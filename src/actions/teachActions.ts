/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import { ActionObject, ErrorType } from '../types'
import { AT } from '../types/ActionTypes'
import { Dispatch } from 'redux'
import ClClient from '../services/client'
import * as ClientFactory from '../services/clientFactory'
import { setErrorDisplay } from './displayActions'
import * as CLM from '@conversationlearner/models'
import * as DialogUtils from '../Utils/dialogUtils'
import { AxiosError } from 'axios'
import { fetchAllTrainDialogsThunkAsync } from './trainActions'
import { fetchApplicationTrainingStatusThunkAsync } from './appActions'

// --------------------------
// createTeachSession
// --------------------------
const createTeachSessionAsync = (): ActionObject =>
    ({
        type: AT.CREATE_TEACH_SESSION_ASYNC
    })

const createTeachSessionRejected = (): ActionObject =>
    ({
        type: AT.CREATE_TEACH_SESSION_REJECTED
    })

const createTeachSessionFulfilled = (teachResponse: CLM.TeachResponse, memories: CLM.Memory[]): ActionObject =>
    ({
        type: AT.CREATE_TEACH_SESSION_FULFILLED,
        teachSession: teachResponse as CLM.Teach,
        memories
    })

export const createTeachSessionThunkAsync = (appId: string, initialEntityMap: CLM.FilledEntityMap | null = null) => {
    return async (dispatch: Dispatch<any>) => {
        const clClient = ClientFactory.getInstance(AT.CREATE_TEACH_SESSION_ASYNC)
        dispatch(createTeachSessionAsync())

        try {
            const initialFilledEntities = initialEntityMap ? initialEntityMap.FilledEntities() : []
            const initialMemory = initialEntityMap ? initialEntityMap.ToMemory() : []
            const teachResponse = await clClient.teachSessionCreate(appId, initialFilledEntities)
            dispatch(createTeachSessionFulfilled(teachResponse, initialMemory))
            return teachResponse
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.CREATE_TEACH_SESSION_ASYNC))
            dispatch(createTeachSessionRejected())
            throw error
        }
    }
}

// --------------------------
// TeachSessionFromHistory
// --------------------------
const createTeachSessionFromHistoryAsync = (appId: string, trainDialog: CLM.TrainDialog, userName: string, userId: string): ActionObject => {
    return {
        type: AT.CREATE_TEACH_SESSION_FROMHISTORYASYNC,
        appId: appId,
        userName: userName,
        userId: userId,
        trainDialog: trainDialog
    }
}

const createTeachSessionFromHistoryFulfilled = (teachWithHistory: CLM.TeachWithHistory): ActionObject => {
    // Needs a fulfilled version to handle response from Epic
    return {
        type: AT.CREATE_TEACH_SESSION_FROMHISTORYFULFILLED,
        teachWithHistory: teachWithHistory
    }
}

export const createTeachSessionFromHistoryThunkAsync = (app: CLM.AppBase, trainDialog: CLM.TrainDialog, userName: string, userId: string, initialUserInput: CLM.UserInput | null = null) => {
    return async (dispatch: Dispatch<any>) => {
        const clClient = ClientFactory.getInstance(AT.CREATE_TEACH_SESSION_FROMHISTORYASYNC)
        dispatch(createTeachSessionFromHistoryAsync(app.appId, trainDialog, userName, userId))

        try {
            const teachWithHistory = await clClient.teachSessionFromHistory(app.appId, trainDialog, initialUserInput, userName, userId)
            dispatch(createTeachSessionFromHistoryFulfilled(teachWithHistory))
            return teachWithHistory
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.CREATE_TEACH_SESSION_FROMHISTORYASYNC))
            dispatch(createTeachSessionRejected())
            throw error
        }
    }
}

// --------------------------
// DeleteTeachSession
// --------------------------
const deleteTeachSessionAsync = (teachSession: CLM.Teach, appId: string, save: boolean): ActionObject => {
    return {
        type: AT.DELETE_TEACH_SESSION_ASYNC,
        teachSession: teachSession,
        appId: appId,
        save: save
    }
}

const deleteTeachSessionFulfilled = (teachSession: CLM.Teach): ActionObject => {
    return {
        type: AT.DELETE_TEACH_SESSION_FULFILLED,
        teachSessionGUID: teachSession.teachId
    }
}

const updateSourceLogDialog = (trainDialogId: string, sourceLogDialogId: string): ActionObject => {
    return {
        type: AT.UPDATE_SOURCE_LOG_DIALOG,
        trainDialogId,
        sourceLogDialogId
    }
}

export const clearTeachSession = (): ActionObject => {
    return {
        type: AT.CLEAR_TEACH_SESSION
    }
}

// Replace destinatation dialog with train dialog and delete the original
const replaceDialog = async (
    destinationTrainDialogId: string,
    trainDialog: CLM.TrainDialog, 
    tags: string[], 
    description: string,
    clClient: ClClient,
    appId: string
    ) => {

    // Created updated source dialog from new dialogs rounds
    const updatedSourceDialog: CLM.TrainDialog = {
        ...trainDialog,
        trainDialogId: destinationTrainDialogId,
        tags,
        description
    }
    const deletePromise = clClient.trainDialogsDelete(appId, trainDialog.trainDialogId)
    const editPromise =  clClient.trainDialogEdit(appId, updatedSourceDialog)
    await Promise.all([deletePromise, editPromise])
}

export const deleteTeachSessionThunkAsync = (
    teachSession: CLM.Teach,
    app: CLM.AppBase,
    save: boolean,
    sourceTrainDialogId: string | null,
    sourceLogDialogId: string | null,
    allTrainDialogs: CLM.TrainDialog[],
    tags: string[] = [],
    description: string = '', 
) => {
    return async (dispatch: Dispatch<any>) => {
        dispatch(deleteTeachSessionAsync(teachSession, app.appId, save))
        const clClient = ClientFactory.getInstance(AT.DELETE_TEACH_SESSION_ASYNC)

        try {
            await clClient.teachSessionDelete(app.appId, teachSession, save)
            if (sourceLogDialogId) {
                dispatch(updateSourceLogDialog(teachSession.trainDialogId, sourceLogDialogId))
            }

            if (!save) {
                dispatch(deleteTeachSessionFulfilled(teachSession));
                return false
            }

            // If saving to a TrainDialog
            const promises: Promise<any>[] = []

            // Retreive the created train dialog 
            const newTrainDialog = await clClient.trainDialog(app.appId, teachSession.trainDialogId)
            newTrainDialog.description = description
            newTrainDialog.tags = tags
            
            // Check to see if new TrainDialog can be merged with an exising TrainDialog
            const existingTrainDialog = DialogUtils.findMatchingTrainDialog(newTrainDialog, allTrainDialogs)

            // If merge possible
            if (existingTrainDialog) {
                // Create merged train dialog
                const mergedTrainDialog = DialogUtils.mergeTrainDialogs(newTrainDialog, existingTrainDialog)
                
                // If merge dialog is from existing dialog
                if (mergedTrainDialog.trainDialogId === existingTrainDialog.trainDialogId) {
                    // Update existing train dialog with merged train dialog, and delete other dialogs
                    mergedTrainDialog.lastModifiedDateTime = `${new Date().toISOString().slice(0, 19)}+00:00`
                    promises.push(clClient.trainDialogEdit(app.appId, mergedTrainDialog))
                    promises.push(clClient.trainDialogsDelete(app.appId, newTrainDialog.trainDialogId))
                    if (sourceTrainDialogId) {
                        promises.push(clClient.trainDialogsDelete(app.appId, sourceTrainDialogId))
                    }
                    await Promise.all(promises)
                }
                // Otherwise merge dialog is from new dialog
                else {

                    if (sourceTrainDialogId) {
                        // Replace source with merged and delete new and merged
                        await replaceDialog(sourceTrainDialogId, mergedTrainDialog, tags, description, clClient, app.appId)
                        promises.push(clClient.trainDialogsDelete(app.appId, newTrainDialog.trainDialogId))
                        promises.push(clClient.trainDialogsDelete(app.appId, existingTrainDialog.trainDialogId))
                        await Promise.all(promises)
                    }
                    else {
                        // Replace new with merge
                        await replaceDialog(newTrainDialog.trainDialogId, mergedTrainDialog, tags, description, clClient, app.appId)
                    }
                }
            }
            // If no merge was possible
            else {

                // If source train dialog exists update it with data from new dialog and then delete the new dialog
                // The new dialog was only created as side effect of new teach session. It was intermediate/temporary and can be discarded.
                if (sourceTrainDialogId) {
                    await replaceDialog(sourceTrainDialogId, newTrainDialog, tags, description, clClient, app.appId)
                }
                else {
                    // Edit the associated train dialogs tag and description
                    await clClient.trainDialogEdit(app.appId, { trainDialogId: teachSession.trainDialogId, tags, description })
                }
            }
            dispatch(deleteTeachSessionFulfilled(teachSession));

            // If we're adding a new train dialog as consequence of the session save, re-fetch train dialogs and start poll for train status
            dispatch(fetchAllTrainDialogsThunkAsync(app.appId));
            dispatch(fetchApplicationTrainingStatusThunkAsync(app.appId));

            // Return "true" if resulted in merge
            return existingTrainDialog !== null;
        } catch (e) {
            const error = e as AxiosError
            dispatch(clearTeachSession())
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.CREATE_TRAIN_DIALOG_ASYNC))
            dispatch(fetchAllTrainDialogsThunkAsync(app.appId));
            return false;
        }
    }
}

// --------------------------
// deleteMemory
// --------------------------
const deleteMemoryAsync = (key: string, currentAppId: string): ActionObject => {
    return {
        type: AT.DELETE_MEMORY_ASYNC,
        key: key,
        appId: currentAppId
    }
}

const deleteMemoryFulfilled = (): ActionObject => {
    return {
        type: AT.DELETE_MEMORY_FULFILLED
    }
}
export const deleteMemoryThunkAsync = (key: string, currentAppId: string) => {
    return async (dispatch: Dispatch<any>) => {
        dispatch(deleteMemoryAsync(key, currentAppId))
        const clClient = ClientFactory.getInstance(AT.DELETE_MEMORY_ASYNC)

        try {
            await clClient.memoryDelete(currentAppId);
            dispatch(deleteMemoryFulfilled());
            return true;
        } catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.DELETE_MEMORY_ASYNC))
            return false;
        }
    }
}

// --------------------------
// RunExtractor
// --------------------------
const runExtractorAsync = (appId: string, extractType: CLM.DialogType, sessionId: string, turnIndex: number | null, userInput: CLM.UserInput): ActionObject => {
    return {
        type: AT.RUN_EXTRACTOR_ASYNC,
        appId: appId,
        extractType: extractType,
        sessionId: sessionId,
        turnIndex: turnIndex,
        userInput: userInput
    }
}

const runExtractorFulfilled = (appId: string, sessionId: string, uiExtractResponse: CLM.UIExtractResponse): ActionObject => {
    return {
        type: AT.RUN_EXTRACTOR_FULFILLED,
        appId: appId,
        sessionId: sessionId,
        uiExtractResponse: uiExtractResponse
    }
}

export const runExtractorThunkAsync = (appId: string, extractType: CLM.DialogType, sessionId: string, turnIndex: number | null, userInput: CLM.UserInput, filteredDialog: string | null) => {
    return async (dispatch: Dispatch<any>) => {
        const clClient = ClientFactory.getInstance(AT.RUN_EXTRACTOR_ASYNC)
        dispatch(runExtractorAsync(appId, extractType, sessionId, turnIndex, userInput))

        try {
            let uiExtractResponse: CLM.UIExtractResponse | null = null

            switch (extractType) {
                case CLM.DialogType.TEACH:
                    uiExtractResponse = await clClient.teachSessionAddExtractStep(appId, sessionId, userInput, filteredDialog)
                    break;
                case CLM.DialogType.TRAINDIALOG:
                    if (turnIndex === null) {
                        throw new Error(`Run extractor was called for a train dialog, but turnIndex was null. This should not be possible. Please open an issue.`)
                    }
                    uiExtractResponse = await clClient.trainDialogsUpdateExtractStep(appId, sessionId, turnIndex, userInput)
                    break;
                case CLM.DialogType.LOGDIALOG:
                    if (turnIndex === null) {
                        throw new Error(`Run extractor was called for a log dialog, but turnIndex was null. This should not be possible. Please open an issue.`)
                    }
                    uiExtractResponse = await clClient.logDialogsUpdateExtractStep(appId, sessionId, turnIndex, userInput)
                    break;
                default:
                    throw new Error(`Could not handle unknown extract type: ${extractType}`)
            }

            dispatch(runExtractorFulfilled(appId, sessionId, uiExtractResponse))
            return uiExtractResponse
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.RUN_EXTRACTOR_ASYNC))
            throw error
        }
    }
}

//---------------------------------------------------------
// User makes an update to an extract response
export const updateExtractResponse = (extractResponse: CLM.ExtractResponse): ActionObject => {
    return {
        type: AT.UPDATE_EXTRACT_RESPONSE,
        extractResponse: extractResponse
    }
}

// User removes extract response
export const removeExtractResponse = (extractResponse: CLM.ExtractResponse): ActionObject => {
    return {
        type: AT.REMOVE_EXTRACT_RESPONSE,
        extractResponse: extractResponse
    }
}

// Clear extract responses
export const clearExtractResponses = (): ActionObject => {
    return {
        type: AT.CLEAR_EXTRACT_RESPONSES
    }
}

// Clear extract responses
export const clearExtractConflict = (): ActionObject => {
    return {
        type: AT.CLEAR_EXTRACT_CONFLICT
    }
}

// --------------------------
// GetScores
// --------------------------
const getScoresAsync = (key: string, appId: string, sessionId: string, scoreInput: CLM.ScoreInput): ActionObject =>
    ({
        type: AT.GET_SCORES_ASYNC,
        key,
        appId,
        sessionId,
        scoreInput
    })

const getScoresFulfilled = (key: string, appId: string, sessionId: string, uiScoreResponse: CLM.UIScoreResponse): ActionObject =>
    ({
        type: AT.GET_SCORES_FULFILLED,
        key,
        appId,
        sessionId,
        uiScoreResponse,
    })
export const getScoresThunkAsync = (key: string, appId: string, sessionId: string, scoreInput: CLM.ScoreInput) => {
    return async (dispatch: Dispatch<any>) => {
        const clClient = ClientFactory.getInstance(AT.GET_SCORES_ASYNC)
        dispatch(getScoresAsync(key, appId, sessionId, scoreInput))

        try {
            const uiScoreResponse = await clClient.teachSessionRescore(appId, sessionId, scoreInput)
            dispatch(getScoresFulfilled(key, appId, sessionId, uiScoreResponse))
            return uiScoreResponse
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.GET_SCORES_ASYNC))
            throw error
        }
    }
}

// --------------------------
// RunScorer
// --------------------------
const runScorerAsync = (key: string, appId: string, teachId: string, uiScoreInput: CLM.UIScoreInput): ActionObject => {
    return {
        type: AT.RUN_SCORER_ASYNC,
        key: key,
        appId: appId,
        sessionId: teachId,
        uiScoreInput: uiScoreInput
    }
}
const runScorerFulfilled = (key: string, appId: string, teachId: string, uiScoreResponse: CLM.UIScoreResponse): ActionObject => {
    return {
        type: AT.RUN_SCORER_FULFILLED,
        key,
        appId,
        sessionId: teachId,
        uiScoreResponse
    }
}
export const runScorerThunkAsync = (key: string, appId: string, teachId: string, uiScoreInput: CLM.UIScoreInput) => {
    return async (dispatch: Dispatch<any>) => {
        const clClient = ClientFactory.getInstance(AT.RUN_SCORER_ASYNC)
        dispatch(runScorerAsync(key, appId, teachId, uiScoreInput))

        try {
            const uiScoreResponse = await clClient.teachSessionUpdateScorerStep(appId, teachId, uiScoreInput)
            dispatch(runScorerFulfilled(key, appId, teachId, uiScoreResponse))
            dispatch(fetchApplicationTrainingStatusThunkAsync(appId))
            return uiScoreResponse
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.RUN_SCORER_ASYNC))
            throw error
        }
    }
}

// --------------------------
// PostScorerFeedback
// --------------------------
const postScorerFeedbackAsync = (key: string, appId: string, teachId: string, uiTrainScorerStep: CLM.UITrainScorerStep, waitForUser: boolean, uiScoreInput: CLM.UIScoreInput): ActionObject => {
    return {
        type: AT.POST_SCORE_FEEDBACK_ASYNC,
        key: key,
        appId: appId,
        sessionId: teachId,
        uiTrainScorerStep: uiTrainScorerStep,
        waitForUser: waitForUser,
        uiScoreInput: uiScoreInput
    }
}

// Score has been posted.  Action is Terminal
const postScorerFeedbackFulfilled = (key: string, appId: string, teachId: string, dialogMode: CLM.DialogMode, uiPostScoreResponse: CLM.UIPostScoreResponse, uiScoreInput: CLM.UIScoreInput | null): ActionObject => {
    return {
        type: AT.POST_SCORE_FEEDBACK_FULFILLED,
        key: key,
        appId: appId,
        sessionId: teachId,
        dialogMode: dialogMode,
        uiPostScoreResponse: uiPostScoreResponse,
        uiScoreInput: uiScoreInput
    }
}

export const postScorerFeedbackThunkAsync = (key: string, appId: string, teachId: string, uiTrainScorerStep: CLM.UITrainScorerStep, waitForUser: boolean, uiScoreInput: CLM.UIScoreInput) => {
    return async (dispatch: Dispatch<any>) => {
        const clClient = ClientFactory.getInstance(AT.POST_SCORE_FEEDBACK_ASYNC)
        dispatch(postScorerFeedbackAsync(key, appId, teachId, uiTrainScorerStep, waitForUser, uiScoreInput))

        try {
            const uiPostScoreResponse = await clClient.teachSessionAddScorerStep(appId, teachId, uiTrainScorerStep)

            if (!waitForUser) {
                // Don't re-send predicted entities on subsequent score call
                uiScoreInput.extractResponse.predictedEntities = [];
                // TODO: Force end task to always be wait
                dispatch(postScorerFeedbackFulfilled(key, appId, teachId, CLM.DialogMode.Scorer, uiPostScoreResponse, uiScoreInput))
            }
            else {
                const dialogMode = uiPostScoreResponse.isEndTask ? CLM.DialogMode.EndSession : CLM.DialogMode.Wait
                dispatch(postScorerFeedbackFulfilled(key, appId, teachId, dialogMode, uiPostScoreResponse, null))
            }
            return uiPostScoreResponse
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.POST_SCORE_FEEDBACK_ASYNC))
            throw error
        }
    }
}
// --------------------------
// ToggleAutoTeach
// --------------------------
export const toggleAutoTeach = (autoTeach: boolean): ActionObject => {
    return {
        type: AT.TOGGLE_AUTO_TEACH,
        autoTeach: autoTeach
    }
}