import { ActionObject } from '../types'
import { AT } from '../types/ActionTypes'
import { BlisAppBase, EntityBase, ActionBase, TrainDialog, LogDialog, Teach, Session } from 'blis-models'
import { Dispatch } from 'redux'
import BlisClient from '../epics/blisClient'

const blisClient = new BlisClient("http://localhost:5000", () => '')

export const createBLISApplicationAsync = (key: string, userId: string, application: BlisAppBase): ActionObject => {
    return {
        type: AT.CREATE_BLIS_APPLICATION_ASYNC,
        key: key,
        userId: userId,
        blisApp: application,
    }
}

export const createApplicationFulfilled = (blisApp: BlisAppBase): ActionObject => {
    return {
        type: AT.CREATE_BLIS_APPLICATION_FULFILLED,
        blisApp: blisApp
    }
}

export const createEntityAsync = (key: string, entity: EntityBase, currentAppId: string): ActionObject => {

    return {
        type: AT.CREATE_ENTITY_ASYNC,
        key: key,
        entity: entity,
        currentAppId: currentAppId
    }
}

export const createEntityFulfilled = (entity: EntityBase, entityId: string): ActionObject => {
    return {
        type: AT.CREATE_ENTITY_FULFILLED,
        entity: entity,
        entityId: entityId
    }
}

// After positive entity has been created, create the negative entity with a reference to the positiveId
export const createPositiveEntityFulfilled = (key: string, positiveEntity: EntityBase, positiveEntityId: string, currentAppId: string): ActionObject => {
    let negativeEntity: EntityBase = { ...positiveEntity, entityName: `~${positiveEntity.entityName}`, metadata: { ...positiveEntity.metadata, positiveId: positiveEntityId } } as EntityBase;
    return {
        type: AT.CREATE_ENTITY_FULFILLEDPOSITIVE,
        key: key,
        negativeEntity: negativeEntity,
        positiveEntity: positiveEntity,
        currentAppId: currentAppId
    }
}

export const createNegativeEntityFulfilled = (key: string, positiveEntity: EntityBase, negativeEntity: EntityBase, negativeEntityId: string, currentAppId: string): ActionObject => {
    let posEntity: EntityBase = positiveEntity;
    posEntity.metadata.negativeId = negativeEntityId;
    posEntity.entityId = negativeEntity.metadata.positiveId;
    negativeEntity.entityId = negativeEntityId;
    //send both to store to be saved locally, and send the positive entity back to the service to update its metadata
    return {
        type: AT.CREATE_ENTITY_FULFILLEDNEGATIVE,
        key: key,
        positiveEntity: posEntity,
        negativeEntity: negativeEntity,
        currentAppId: currentAppId
    }
}

export const createActionAsync = (key: string, action: ActionBase, currentAppId: string): ActionObject => {
    return {
        type: AT.CREATE_ACTION_ASYNC,
        key: key,
        action: action,
        currentAppId: currentAppId
    }
}

export const createActionFulfilled = (action: ActionBase, actionId: string): ActionObject => {
    return {
        type: AT.CREATE_ACTION_FULFILLED,
        action: action,
        actionId: actionId
    }
}

export const createChatSessionAsync = (key: string): ActionObject =>
    ({
        type: AT.CREATE_CHAT_SESSION_ASYNC
    })

export const createChatSessionRejected = (): ActionObject =>
    ({
        type: AT.CREATE_CHAT_SESSION_REJECTED
    })

export const createChatSessionFulfilled = (session: Session): ActionObject =>
    ({
        type: AT.CREATE_CHAT_SESSION_FULFILLED,
        session: session
    })

export const createChatSessionThunkAsync = (key: string, appId: string) => {
    return async (dispatch: Dispatch<any>) => {
        blisClient.key = key
        dispatch(createChatSessionAsync(key))
        const app = await blisClient.appGet(appId)
        // TODO: Update blis-models to expose trainingStatus on app model
        const trainingStatus = (app as any).trainingStatus
        if (trainingStatus !== "completed") {
            dispatch(createChatSessionRejected())
            throw new Error(`Application is still training. You may not create chat session at this time. Please try again later.`)
        }

        const session = await blisClient.chatSessionsCreate(appId)
        dispatch(createChatSessionFulfilled(session))

        return session
    }
}

export const createTeachSessionAsync = (key: string, teachSession: Teach, currentAppId: string): ActionObject => {

    return {
        type: AT.CREATE_TEACH_SESSION_ASYNC,
        key: key,
        teachSession: teachSession,
        currentAppId: currentAppId
    }
}

export const createTeachSessionFulfilled = (teachSession: Teach, teachSessionId: string): ActionObject => {

    return {
        type: AT.CREATE_TEACH_SESSION_FULFILLED,
        teachSession: teachSession,
        teachSessionId: teachSessionId
    }
}

export const createTrainDialogAsync = (key: string, appId: string, trainDialog: TrainDialog, logDialogId: string): ActionObject =>
    ({
        type: AT.CREATE_TRAIN_DIALOG_ASYNC,
        key,
        appId,
        trainDialog,
        logDialogId
    })

export const createTrainDialogFulfilled = (trainDialog: TrainDialog): ActionObject =>
    ({
        type: AT.CREATE_TRAIN_DIALOG_FULFILLED,
        trainDialog
    })

// TODO: should be async with fulfillment
export const createLogDialog = (key: string, logDialog: LogDialog): ActionObject => {

    return {
        type: AT.CREATE_LOG_DIALOG,
        key: key,
        logDialog: logDialog
    }
}