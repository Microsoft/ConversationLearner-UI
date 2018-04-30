/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import { ActionObject, DisplayState } from '../types'
import { AT } from '../types/ActionTypes'
import { Reducer } from 'redux'

const initialState: DisplayState = {
    displaySpinner: [],
    tipType: null
};

const spinnerName = (spinner: string): string => {
    let cut = spinner.lastIndexOf("_");
    return spinner.slice(0, cut);
}
const addSpinner = (spinners: string[], newSpinner: string): string[] => {
    return spinners.concat(spinnerName(newSpinner));
}

const removeSpinner = (spinners: string[], oldSpinner: string): string[] => {
    return spinners.filter(o => o !== spinnerName(oldSpinner));
}

const displayReducer: Reducer<DisplayState> = (state = initialState, action: ActionObject): DisplayState => {
    switch (action.type) {
        case AT.USER_LOGOUT:
            return { ...initialState };
        case AT.SET_TIP_TYPE:
            return { ...state, tipType: action.tipType };
        case AT.CREATE_APPLICATION_FULFILLED:
            return { ...state, displaySpinner: removeSpinner(state.displaySpinner, action.type) }
        case AT.SET_CURRENT_APP_FULFILLED:
            return { ...state, displaySpinner: removeSpinner(state.displaySpinner, action.type) }
        case AT.SET_ERROR_DISPLAY:
            // If I fail to load critical data, return to home page
            switch (action.actionType) {
                case AT.FETCH_APPSOURCE_ASYNC:
                case AT.FETCH_APPLICATIONS_ASYNC:
                case AT.FETCH_BOTINFO_ASYNC:
                case AT.FETCH_ENTITIES_ASYNC:
                case AT.FETCH_ACTIONS_ASYNC:
                    return { ...initialState, displaySpinner: [] };
                default:
                    return { ...state, displaySpinner: [] }
            }
        case AT.SET_CURRENT_APP_ASYNC:

        case AT.CREATE_ACTION_ASYNC:
        case AT.CREATE_APP_TAG_ASYNC: 
        case AT.CREATE_APPLICATION_ASYNC:
        case AT.CREATE_TEACH_SESSION_ASYNC:
        case AT.CREATE_TEACH_SESSION_FROMUNDOASYNC:
        case AT.CREATE_TEACH_SESSION_FROMHISTORYASYNC:
        case AT.CREATE_CHAT_SESSION_ASYNC:
        case AT.CREATE_ENTITY_ASYNC:

        case AT.DELETE_ACTION_ASYNC:
        case AT.DELETE_APPLICATION_ASYNC:
        // case AT.DELETE_CHAT_SESSION_ASYNC: Don't block
        case AT.DELETE_ENTITY_ASYNC:
        case AT.DELETE_MEMORY_ASYNC:
        // case AT.DELETE_LOG_DIALOG_ASYNC: Don't block
        // case AT.DELETE_TEACH_SESSION_ASYNC: Don't block
        // case AT.DELETE_TRAIN_DIALOG_ASYNC: Don't block

        case AT.EDIT_ACTION_ASYNC:
        case AT.EDIT_APPLICATION_ASYNC:
        case AT.EDIT_ENTITY_ASYNC:
        case AT.EDIT_APP_LIVE_TAG_ASYNC:
        case AT.EDIT_APP_EDITING_TAG_ASYNC:
        
        // case AT.EXPIRE_CHAT_SESSION_AYSNC: Don't block
        
        case AT.FETCH_APPSOURCE_ASYNC:
        case AT.FETCH_ACTIONS_ASYNC:
        case AT.FETCH_APPLICATIONS_ASYNC:
        case AT.FETCH_BOTINFO_ASYNC:
        case AT.FETCH_CHAT_SESSIONS_ASYNC:
        case AT.FETCH_ENTITIES_ASYNC:
        case AT.FETCH_TEACH_SESSIONS_ASYNC:
        // case AT.FETCH_TRAIN_DIALOGS_ASYNC: Don't block
        // case AT.FETCH_LOG_DIALOGS_ASYNC: Don't block
        case AT.FETCH_ENTITY_DELETE_VALIDATION_ASYNC:
        case AT.FETCH_ENTITY_EDIT_VALIDATION_ASYNC:
        case AT.FETCH_ACTION_DELETE_VALIDATION_ASYNC:
        case AT.FETCH_ACTION_EDIT_VALIDATION_ASYNC:
        case AT.FETCH_TUTORIALS_ASYNC:

        case AT.COPY_APPLICATION_ASYNC:
        case AT.RUN_EXTRACTOR_ASYNC:
        case AT.GET_SCORES_ASYNC:
        case AT.RUN_SCORER_ASYNC:
        case AT.POST_SCORE_FEEDBACK_ASYNC:
            return { ...state, displaySpinner: addSpinner(state.displaySpinner, action.type) }

        case AT.CREATE_ACTION_FULFILLED:
        case AT.CREATE_APP_TAG_FULFILLED: 
        //case AT.CREATE_APPLICATION_FULFILLED: Handled above
        case AT.CREATE_CHAT_SESSION_REJECTED:
        case AT.CREATE_CHAT_SESSION_FULFILLED:
        case AT.CREATE_TEACH_SESSION_REJECTED:
        case AT.CREATE_TEACH_SESSION_FULFILLED:
        case AT.CREATE_TEACH_SESSION_FROMUNDOFULFILLED:
        case AT.CREATE_TEACH_SESSION_FROMHISTORYFULFILLED:
        case AT.CREATE_ENTITY_FULFILLED:

        case AT.DELETE_ACTION_FULFILLED:
        case AT.DELETE_APPLICATION_FULFILLED:
        // case AT.DELETE_CHAT_SESSION_FULFILLED: Doesn't block
        case AT.DELETE_ENTITY_FULFILLED:
        case AT.DELETE_MEMORY_FULFILLED:
        // case AT.DELETE_LOG_DIALOG_FULFILLED: Doesn't block
        // case AT.DELETE_TEACH_SESSION_FULFILLED: Doesn't block
        // case AT.DELETE_TRAIN_DIALOG_FULFILLED: Doesn't block
        case AT.DELETE_TRAIN_DIALOG_REJECTED:

        case AT.EDIT_ACTION_FULFILLED:
        case AT.EDIT_APPLICATION_FULFILLED:
        case AT.EDIT_ENTITY_FULFILLED:
        case AT.EDIT_APP_LIVE_TAG_FULFILLED:
        case AT.EDIT_APP_EDITING_TAG_FULFILLED:

        case AT.FETCH_APPSOURCE_FULFILLED:
        case AT.FETCH_ACTIONS_FULFILLED:
        case AT.FETCH_BOTINFO_FULFILLED:
        case AT.FETCH_APPLICATIONS_FULFILLED:
        case AT.FETCH_CHAT_SESSIONS_FULFILLED:
        case AT.FETCH_ENTITIES_FULFILLED:
        case AT.FETCH_TEACH_SESSIONS_FULFILLED:
        // case AT.FETCH_TRAIN_DIALOGS_FULFILLED: Doesn't block
        // case AT.FETCH_LOG_DIALOGS_FULFILLED: Doeesn't block
        case AT.FETCH_ENTITY_DELETE_VALIDATION_FULFILLED:
        case AT.FETCH_ENTITY_EDIT_VALIDATION_FULFILLED:
        case AT.FETCH_ACTION_DELETE_VALIDATION_FULFILLED:
        case AT.FETCH_ACTION_EDIT_VALIDATION_FULFILLED:
        case AT.FETCH_TUTORIALS_FULFILLED:
    
        case AT.COPY_APPLICATION_FULFILLED:
        case AT.RUN_EXTRACTOR_FULFILLED:
        case AT.GET_SCORES_FULFILLED:
        case AT.RUN_SCORER_FULFILLED:
        case AT.POST_SCORE_FEEDBACK_FULFILLEDWAIT:
        case AT.POST_SCORE_FEEDBACK_FULFILLEDNOWAIT:
            return { ...state, displaySpinner: removeSpinner(state.displaySpinner, action.type) }
        default:
            return state;
    }
}
export default displayReducer;