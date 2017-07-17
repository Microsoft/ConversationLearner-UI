import 'rxjs'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { 
	BlisAppBase, BlisAppMetaData, BlisAppList, 
	EntityBase, EntityMetaData, EntityList, 
	ActionBase, ActionMetaData, ActionList, ActionTypes,
	UserInput,
	TrainExtractorStep, ExtractResponse, TrainScorerStep } from 'blis-models'
import * as Rx from 'rxjs';
import { Observable, Observer } from 'rxjs'

//=========================================================
// CONFIG
//=========================================================

const config: AxiosRequestConfig = {
	headers: {
		"Content-Type": "application/json"
	}
}
const rootUrl: string = "http://localhost:5000/";

//=========================================================
// PARAMETER REQUIREMENTS
//=========================================================

export interface BlisAppForUpdate extends BlisAppBase {
	trainingFailureMessage: string;
	trainingRequired: boolean;
	trainingStatus: string;
	latestPackageId: number
}

//=========================================================
// GET ROUTES
//=========================================================

export const getAllBlisApps = (userId : string): Observable<AxiosResponse> => {
	const getAppsRoute: string = `apps?userId=${userId}`;
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppsRoute), config))
};
export const getBlisApp = (appId: string): Observable<AxiosResponse> => {
	let getAppRoute: string = `app/${appId}`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppRoute), config))
};
export const getAllEntitiesForBlisApp = (appId: string): Observable<AxiosResponse> => {
	let getEntitiesForAppRoute: string = `app/${appId}/entities`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getEntitiesForAppRoute), config))
};
export const getBlisEntity = (appId: string, entityId: string): Observable<AxiosResponse> => {
	let getEntityRoute: string = `app/${appId}/entity/${entityId}`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getEntityRoute), config))
};
export const getAllActionsForBlisApp = (appId: string): Observable<AxiosResponse> => {
	let getActionsForAppRoute: string = `app/${appId}/actions`;
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getActionsForAppRoute), config))
};
export const getBlisAction = (appId: string, actionId: string): Observable<AxiosResponse> => {
	let getActionRoute: string = `app/${appId}/action/${actionId}`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getActionRoute), config))
};

//=========================================================
// CREATE ROUTES
//=========================================================

export const createBlisApp = (userId : string, blisApp: BlisAppBase): Observable<AxiosResponse> => {
	let addAppRoute: string = `app?userId=${userId}`
	//remove the appId property from the object
	const { appId, ...appToSend } = blisApp
	return Rx.Observable.fromPromise(axios.post(rootUrl.concat(addAppRoute), appToSend, config))
};
export const createBlisEntity = (entity: EntityBase, appId: string, ): Observable<AxiosResponse> => {
	let addEntityRoute: string = `app/${appId}/entity`
	//remove property from the object that the route will not accept
	const { version, packageCreationId, packageDeletionId, entityId, ...entityToSend } = entity;
	return Rx.Observable.fromPromise(axios.post(rootUrl.concat(addEntityRoute), entityToSend, config))
};
export const createBlisAction = (action: ActionBase, appId: string): Observable<AxiosResponse> => {
	let addActionRoute: string = `app/${appId}/action`
	//remove property from the object that the route will not accept
	const { actionId, version, packageCreationId, packageDeletionId, ...actionToSend } = action
	return Rx.Observable.fromPromise(axios.post(rootUrl.concat(addActionRoute), actionToSend, config))
};

//=========================================================
// DELETE ROUTES
//=========================================================

export const deleteBlisApp = (blisAppId: string, blisApp: BlisAppForUpdate): Observable<AxiosResponse> => {
	let deleteAppRoute: string = `app/${blisAppId}` //takes an app in the body
	const { appId, latestPackageId, metadata, trainingRequired, trainingStatus, trainingFailureMessage, ...appToSend } = blisApp
	let configWithBody = {...config, body: appToSend}
	return Rx.Observable.fromPromise(axios.delete(rootUrl.concat(deleteAppRoute), configWithBody))
};
export const deleteBlisEntity = (appId: string, entity: EntityBase): Observable<AxiosResponse> => {
	let deleteEntityRoute: string = `app/${appId}/entity`
	const { version, packageCreationId, packageDeletionId, entityId, ...entityToSend } = entity;
	let configWithBody = {...config, body: entityToSend};
	return Rx.Observable.fromPromise(axios.delete(rootUrl.concat(deleteEntityRoute), configWithBody))
};
export const deleteBlisAction = (appId: string, blisActionId: string, action: ActionBase): Observable<AxiosResponse> => {
	let deleteActionRoute: string = `app/${appId}/action/${blisActionId}` 
	const { actionId, version, packageCreationId, packageDeletionId, ...actionToSend } = action
	let configWithBody = {...config, body: actionToSend}
	return Rx.Observable.fromPromise(axios.delete(rootUrl.concat(deleteActionRoute), configWithBody))
};

//=========================================================
// EDIT ROUTES
//=========================================================

export const editBlisApp = (blisAppId: string, blisApp: BlisAppForUpdate): Observable<AxiosResponse> => {
	let editAppRoute: string = `app/${blisAppId}`;
	const { appId, latestPackageId, metadata, trainingRequired, trainingStatus, trainingFailureMessage, ...appToSend } = blisApp
	return Rx.Observable.fromPromise(axios.put(rootUrl.concat(editAppRoute), appToSend, config))
};
export const editBlisAction = (appId: string, blisActionId: string, action: ActionBase): Observable<AxiosResponse> => {
	let editActionRoute: string = `app/${appId}/action/${blisActionId}`
	const { actionId, version, packageCreationId, packageDeletionId, ...actionToSend } = action
	return Rx.Observable.fromPromise(axios.put(rootUrl.concat(editActionRoute), actionToSend, config))
};

//========================================================
// SESSION ROUTES
//========================================================

/** START SESSION : Creates a new session and a corresponding logDialog */
export const createSession = (appId : string, key : string): Observable<AxiosResponse> => {
	let addAppRoute: string = `app/${appId}/session?key=${key}`
	return Rx.Observable.fromPromise(axios.post(rootUrl.concat(addAppRoute), config))
};

/** GET SESSION : Retrieves information about the specified session */
export const getSession = (appId: string, sessionId: string): Observable<AxiosResponse> => {
	let getAppRoute: string = `app/${appId}/session/${sessionId}`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppRoute), config))
};

/** END SESSION : End a session. */
export const deleteSession = (appId: string, sessionId: string, key : string): Observable<AxiosResponse> => {
	let deleteAppRoute: string = `app/${appId}/session/${sessionId}` 
	return Rx.Observable.fromPromise(axios.delete(rootUrl.concat(deleteAppRoute)))
};

/** GET SESSIONS : Retrieves definitions of ALL open sessions */
export const getSessions = (appId: string): Observable<AxiosResponse> => {
	let getAppRoute: string = `app/${appId}/sessions`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppRoute), config))
};

/** GET SESSION IDS : Retrieves a list of session IDs */
export const getSessionIds = (appId: string): Observable<AxiosResponse> => {
	let getAppRoute: string = `app/${appId}/session`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppRoute), config))
};

//========================================================
// Teach
//========================================================

/** START TEACH SESSION: Creates a new teaching session and a corresponding trainDialog */
export const createTeach = (appId : string, key : string): Observable<AxiosResponse> => {
	let addAppRoute: string = `app/${appId}/teach?key=${key}`
	return Rx.Observable.fromPromise(axios.post(rootUrl.concat(addAppRoute), config))
};

/** GET TEACH: Retrieves information about the specified teach */
export const getTeach = (appId: string, teachId: string): Observable<AxiosResponse> => {
	let getAppRoute: string = `app/${appId}/teach/${teachId}`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppRoute), config))
};

/** RUN EXTRACTOR: Runs entity extraction (prediction). 
 * If a more recent version of the package is available on 
 * the server, the session will first migrate to that newer version.  This 
 * doesn't affect the trainDialog maintained.
 */
export const putExtract = (appId: string, teachId: string, userInput: UserInput): Observable<AxiosResponse> => {
	let editAppRoute: string = `app/${appId}/teach/${teachId}/extractor`;
	return Rx.Observable.fromPromise(axios.put(rootUrl.concat(editAppRoute), userInput, config))
};

/** EXTRACTION FEEDBACK: Uploads a labeled entity extraction instance
 * ie "commits" an entity extraction label, appending it to the teach session's
 * trainDialog, and advancing the dialog. This may yield produce a new package.
 */
export const postExtraction = (appId : string, teachId: string, trainExtractorStep : TrainExtractorStep, key : string): Observable<AxiosResponse> => {
	let addAppRoute: string = `app/${appId}/teach/${teachId}/extractor`
	return Rx.Observable.fromPromise(axios.post(rootUrl.concat(addAppRoute), trainExtractorStep, config))
};

/** RUN SCORER: Takes a turn and return distribution over actions.
 * If a more recent version of the package is 
 * available on the server, the session will first migrate to that newer version.  
 * This doesn't affect the trainDialog maintained by the teaching session.
 */
export const putScore = (appId: string, teachId: string, extractResponse: ExtractResponse, key: string): Observable<AxiosResponse> => {
	let editAppRoute: string = `app/${appId}/teach/${teachId}/scorer?key=${key}`;
	return Rx.Observable.fromPromise(axios.put(rootUrl.concat(editAppRoute), extractResponse, config))
};

/** SCORE FEEDBACK: Uploads a labeled scorer step instance 
 * – ie "commits" a scorer label, appending it to the teach session's 
 * trainDialog, and advancing the dialog. This may yield produce a new package.
 */
export const postScore = (appId : string, teachId: string, trainScorerStep : TrainScorerStep, key : string): Observable<AxiosResponse> => {
	let addAppRoute: string = `app/${appId}/teach/${teachId}/scorer?key=${key}`
	return Rx.Observable.fromPromise(axios.post(rootUrl.concat(addAppRoute), trainScorerStep, config))
};

/** END TEACH: Ends a teach.   
 * For Teach sessions, does NOT delete the associated trainDialog.
 * To delete the associated trainDialog, call DELETE on the trainDialog.
 */
export const deleteTeach = (appId: string, teachId: string, key : string): Observable<AxiosResponse> => {
	let deleteAppRoute: string = `app/${appId}/teach/${teachId}?key=${key}`
	return Rx.Observable.fromPromise(axios.delete(rootUrl.concat(deleteAppRoute)))
};

/** GET TEACH SESSIONS: Retrieves definitions of ALL open teach sessions */
export const getTeaches = (appId: string): Observable<AxiosResponse> => {
	let getAppRoute: string = `app/${appId}/teaches`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppRoute), config))
};

/** GET TEACH SESSION IDS: Retrieves a list of teach session IDs */
export const getTeachIds = (appId: string): Observable<AxiosResponse> => {
	let getAppRoute: string = `app/${appId}/teach`
	return Rx.Observable.fromPromise(axios.get(rootUrl.concat(getAppRoute), config))
};
