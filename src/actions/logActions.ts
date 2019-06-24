/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import { AT, ActionObject, ErrorType } from '../types'
import { Dispatch } from 'redux'
import { AppBase, LogDialog } from '@conversationlearner/models'
import { setErrorDisplay } from './displayActions'
import * as ClientFactory from '../services/clientFactory'
import { AxiosError } from 'axios'

//-------------------------------------
// deleteLogDialog
//-------------------------------------
const deleteLogDialogAsync = (appId: string, logDialogId: string): ActionObject => {
    return {
        type: AT.DELETE_LOG_DIALOG_ASYNC,
        appId,
        logDialogId
    }
}

const deleteLogDialogFulfilled = (logDialogId: string): ActionObject => {
    return {
        type: AT.DELETE_LOG_DIALOG_FULFILLED,
        logDialogId
    }
}

const deleteLogDialogRejected = (): ActionObject => {
    return {
        type: AT.DELETE_LOG_DIALOG_REJECTED
    }
}

export const deleteLogDialogThunkAsync = (app: AppBase, logDialogId: string, packageId: string) => {
    return async (dispatch: Dispatch<any>) => {
        dispatch(deleteLogDialogAsync(app.appId, logDialogId))
        const clClient = ClientFactory.getInstance(AT.DELETE_LOG_DIALOG_ASYNC)

        try {
            await clClient.logDialogsDelete(app.appId, logDialogId)
            dispatch(deleteLogDialogFulfilled(logDialogId))
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.DELETE_LOG_DIALOG_ASYNC))
            dispatch(deleteLogDialogRejected())
            dispatch(fetchAllLogDialogsThunkAsync(app, packageId));
        }
    }
}

const deleteLogDialogsAsync = (appId: string, logDialogIds: string[]): ActionObject => {
    return {
        type: AT.DELETE_LOG_DIALOGS_ASYNC,
        appId,
        logDialogIds,
    }
}

const deleteLogDialogsFulfilled = (): ActionObject => {
    return {
        type: AT.DELETE_LOG_DIALOGS_FULFILLED,
    }
}

const deleteLogDialogsRejected = (): ActionObject => {
    return {
        type: AT.DELETE_LOG_DIALOGS_REJECTED,
    }
}

export const deleteLogDialogsThunkAsync = (app: AppBase, logDialogIds: string[], packageId: string) => {
    return async (dispatch: Dispatch<any>) => {
        dispatch(deleteLogDialogsAsync(app.appId, logDialogIds))
        const clClient = ClientFactory.getInstance(AT.DELETE_LOG_DIALOGS_ASYNC)

        try {
            await clClient.logDialogsDeleteMany(app.appId, logDialogIds)
            dispatch(deleteLogDialogsFulfilled())
        }
        catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.DELETE_LOG_DIALOGS_ASYNC))
            dispatch(deleteLogDialogsRejected())
        }
        finally {
            dispatch(fetchAllLogDialogsThunkAsync(app, packageId))
        }
    }
}

//-------------------------------------
// fetchAllLogDialogs
//-------------------------------------
const fetchAllLogDialogsAsync = (appId: string, packageIds: string[]): ActionObject => {
    return {
        type: AT.FETCH_LOG_DIALOGS_ASYNC,
        appId,
        packageIds,
    }
}

const fetchAllLogDialogsFulfilled = (logDialogs: LogDialog[]): ActionObject => {
    return {
        type: AT.FETCH_LOG_DIALOGS_FULFILLED,
        allLogDialogs: logDialogs
    }
}

export const fetchAllLogDialogsThunkAsync = (app: AppBase, packageId: string) => {
    return async (dispatch: Dispatch<any>) => {
        // Note: In future change fetch log dialogs to default to all package if packageId is dev
        const packageIds = (packageId === app.devPackageId)
            ? (app.packageVersions || []).map(pv => pv.packageId).concat(packageId)
            : [packageId]

        const clClient = ClientFactory.getInstance(AT.FETCH_LOG_DIALOGS_ASYNC)
        dispatch(fetchAllLogDialogsAsync(app.appId, packageIds))

        try {
            const logDialogs = await clClient.logDialogs(app.appId, packageIds)
            dispatch(fetchAllLogDialogsFulfilled(logDialogs))
            return logDialogs
        } catch (e) {
            const error = e as AxiosError
            dispatch(setErrorDisplay(ErrorType.Error, error.message, error.response ? JSON.stringify(error.response, null, '  ') : "", AT.FETCH_LOG_DIALOGS_ASYNC))
            return null;
        }
    }
}