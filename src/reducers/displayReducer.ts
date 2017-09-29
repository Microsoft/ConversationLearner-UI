import { ActionObject } from '../types'
import { DisplayState } from '../types'
import { AT } from '../types/ActionTypes'
import { Reducer } from 'redux'
import { DisplayMode } from '../types/const'

const initialState: DisplayState = {
    displayMode: DisplayMode.AppList,
    displayWebchat: false,
    displayLogin: true,
    displaySpinner: []
};

const spinnerName = function (spinner: string): string {
    let cut = spinner.lastIndexOf("_");
    return spinner.slice(0, cut);
}
const addSpinner = function (spinners: string[], newSpinner: string): string[] {
    return spinners.concat(spinnerName(newSpinner));
}

const removeSpinner = function (spinners: string[], oldSpinner: string): string[] {
    return spinners.filter(o => o !== spinnerName(oldSpinner));
}

const displayReducer: Reducer<DisplayState> = (state = initialState, action: ActionObject): DisplayState => {
    switch (action.type) {
        case AT.LOGOUT:
            return { ...initialState };
        case AT.SET_DISPLAY_MODE:
            return { ...state, displayMode: action.setDisplay };
        case AT.SET_LOGIN_DISPLAY:
            return { ...state, displayLogin: action.setLoginDisplay };
        case AT.CREATE_BLIS_APPLICATION_FULFILLED:
            return { ...state, displayMode: DisplayMode.AppAdmin, displaySpinner: removeSpinner(state.displaySpinner, action.type) }
        case AT.SET_CURRENT_BLIS_APP_FULFILLED:
            return { ...state, displayMode: DisplayMode.AppAdmin };
        case AT.SET_ERROR_DISPLAY:
            // If I fail to load critical data, return to home page
            switch (action.route) {
                case AT.FETCH_APPLICATIONS_ASYNC:
                case AT.FETCH_BOTINFO_ASYNC:
                case AT.FETCH_ENTITIES_ASYNC:
                case AT.FETCH_ACTIONS_ASYNC:
                    return { ...initialState, displayLogin: false, displaySpinner: [] };
                default:
                    return { ...state, displaySpinner: [] }
            }
        case AT.CREATE_ACTION_ASYNC:
        case AT.CREATE_BLIS_APPLICATION_ASYNC:
        case AT.CREATE_CHAT_SESSION_ASYNC:
        case AT.CREATE_ENTITY_ASYNC:

        case AT.DELETE_ACTION_ASYNC:
        case AT.DELETE_BLIS_APPLICATION_ASYNC:
        case AT.DELETE_CHAT_SESSION_ASYNC:
        case AT.DELETE_ENTITY_ASYNC:
        case AT.DELETE_TEACH_SESSION_ASYNC:

        case AT.EDIT_ACTION_ASYNC:
        case AT.EDIT_BLIS_APPLICATION_ASYNC:
        case AT.EDIT_ENTITY_ASYNC:

        case AT.FETCH_ACTIONS_ASYNC:
        case AT.FETCH_APPLICATIONS_ASYNC:
        case AT.FETCH_BOTINFO_ASYNC:
        case AT.FETCH_CHAT_SESSIONS_ASYNC:
        case AT.FETCH_ENTITIES_ASYNC:
        case AT.FETCH_TEACH_SESSIONS_ASYNC:

        case AT.RUN_EXTRACTOR_ASYNC:
        case AT.RUN_SCORER_ASYNC:
        case AT.POST_SCORE_FEEDBACK_ASYNC:
        case AT.DELETE_LOG_DIALOG_ASYNC:
            return { ...state, displaySpinner: addSpinner(state.displaySpinner, action.type) };

        case AT.CREATE_ACTION_FULFILLED:
        //case AT.CREATE_BLIS_APPLICATION_FULFILLED: Handled above
        case AT.CREATE_CHAT_SESSION_FULFILLED:
        case AT.CREATE_ENTITY_FULFILLED:
        //case AT.CREATE_ENTITY_FULFILLEDNEGATIVE: Do not clear spinner until positive is complete
        case AT.CREATE_ENTITY_FULFILLEDPOSITIVE:

        case AT.DELETE_ACTION_FULFILLED:
        case AT.DELETE_BLIS_APPLICATION_FULFILLED:
        case AT.DELETE_CHAT_SESSION_FULFILLED:
        case AT.DELETE_ENTITY_FULFILLED:
        case AT.DELETE_TEACH_SESSION_FULFILLED:

        case AT.EDIT_ACTION_FULFILLED:
        case AT.EDIT_BLIS_APPLICATION_FULFILLED:
        case AT.EDIT_ENTITY_FULFILLED:

        case AT.FETCH_ACTIONS_FULFILLED:
        case AT.FETCH_BOTINFO_FULFILLED:
        case AT.FETCH_APPLICATIONS_FULFILLED:
        case AT.FETCH_CHAT_SESSIONS_FULFILLED:
        case AT.FETCH_ENTITIES_FULFILLED:
        case AT.FETCH_TEACH_SESSIONS_FULFILLED:

        case AT.RUN_EXTRACTOR_FULFILLED:
        case AT.RUN_SCORER_FULFILLED:
        case AT.POST_SCORE_FEEDBACK_FULFILLEDWAIT:
        case AT.POST_SCORE_FEEDBACK_FULFILLEDNOWAIT:
        case AT.DELETE_LOG_DIALOG_FULFILLED:
            return { ...state, displaySpinner: removeSpinner(state.displaySpinner, action.type) };
        default:
            return state;
    }
}
export default displayReducer;