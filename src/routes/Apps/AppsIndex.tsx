/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react'
import actions from '../../actions'
import AppIndex from './App/Index'
import AppsList from './AppsList'
import { Route, Switch } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { returntypeof } from 'react-redux-typescript'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { State } from '../../types'
import * as CLM from '@conversationlearner/models'
import { CL_IMPORT_TUTORIALS_USER_ID } from '../../types/const'
import { OBIImportData } from '../../Utils/obiUtils'
import * as DispatchUtils from '../../Utils/dispatchUtils'
import { SourceAndModelPair, DispatchInfo } from '../../types/models'

class AppsIndex extends React.Component<Props> {
    updateAppsAndBot() {
        if (this.props.user.id !== null && this.props.user.id.length > 0) {
            this.props.fetchApplicationsThunkAsync(this.props.user.id)
        }
    }
    componentDidMount() {
        this.updateAppsAndBot();
    }

    componentDidUpdate(prevProps: Props, _prevState: {}) {
        // TODO: See if this code can be removed. It seems like componentWillMount is called every time the user navigates to /home route
        if (typeof (this.props.user.id) === 'string' && this.props.user.id !== prevProps.user.id) {
            this.updateAppsAndBot();
        }

        const { history, location } = this.props
        const appFromLocationState: CLM.AppBase | null = location.state && location.state.app
        if (appFromLocationState && this.props.apps && this.props.apps.length > 0) {
            const app = this.props.apps.find(a => a.appId === appFromLocationState.appId)
            if (!app) {
                console.warn(`Attempted to find selected model in list of models: ${appFromLocationState.appId} but it could not be found. This should not be possible. Contact Support.`)
                return
            }

            if (appFromLocationState !== app) {
                history.replace(location.pathname, { app })
            }
        }
    }

    onClickDeleteApp = (appToDelete: CLM.AppBase) => {
        this.props.deleteApplicationThunkAsync(appToDelete.appId)
    }

    onCreateApp = async (appToCreate: CLM.AppBase, source: CLM.AppDefinition | null = null, obiImportData?: OBIImportData) => {
        const app = await (this.props.createApplicationThunkAsync(this.props.user.id, appToCreate, source, obiImportData) as any as Promise<CLM.AppBase>)
        const { match, history } = this.props
        history.push(`${match.url}/${app.appId}${obiImportData ? "/trainDialogs" : ""}`, { app })
    }

    onCreateDispatchModel = async (appToCreate: CLM.AppBase, childrenModels: CLM.AppBase[]) => {
        if (childrenModels.length > 5) {
            throw new Error(`Must only select 5 or less models when creating a Dispatcher Model`)
        }

        /**
         * Need to add data indicating model is dispatcher and depends on other models for re-generation
         * Currently overload markdown, but should be separate dedicated, strong typed fields in future.
         * Originally tried to make it readable, but also interpretable. Newlines were collapsed so using JSON
         * 
         * Example:
         * {
         *  "type": "dispatcher",
         *  "models": [
         *      ['6ed9b965-611f-4949-af64-d84b4c43c610', 'Model Name 1'],
         *      ['57f34a81-a88b-4804-8a29-f2c0429f9250', 'Model Other Name 2']
         *      ...
         *      ['d88b3850-ac9d-4805-a3c9-80216bf9cbfb', 'Model Last Name N']
         *  ]
         * }
         */
        const dispatchInfo: DispatchInfo = {
            type: 'dispatcher',
            models: childrenModels.map(m => [m.appId, m.appName])
        }
        appToCreate.metadata.markdown = JSON.stringify(dispatchInfo)

        /**
         * Fetch source and associate with each model
         */
        const childrenSourceModelPairs = await Promise.all(childrenModels.map<Promise<SourceAndModelPair>>(async model => {
            const source = await (this.props.fetchAppSourceThunkAsync(model.appId, model.devPackageId) as any) as CLM.AppDefinition
            
            return {
                source,
                model,
                action: undefined
            }
        }))

        const source = DispatchUtils.generateDispatcherSource(childrenSourceModelPairs)
        const app = await (this.props.createApplicationThunkAsync(this.props.user.id, appToCreate, source) as any as Promise<CLM.AppBase>)
        const { match, history } = this.props
        history.push(`${match.url}/${app.appId}`, { app })
    }

    onImportTutorial = (tutorial: CLM.AppBase) => {
        const srcUserId = CL_IMPORT_TUTORIALS_USER_ID;
        const destUserId = this.props.user.id;

        // TODO: Find cleaner solution for the types.  Thunks return functions but when using them on props they should be returning result of the promise.
        this.props.copyApplicationThunkAsync(srcUserId, destUserId, tutorial.appId)
    }

    render() {
        const { match } = this.props
        return (
            <Switch>
                <Route path={`${match.url}/:appId`} component={AppIndex} />
                <Route
                    exact={true}
                    path={match.url}
                    render={() =>
                        <AppsList
                            apps={this.props.apps}
                            onCreateApp={this.onCreateApp}
                            onCreateDispatchModel={this.onCreateDispatchModel}
                            onClickDeleteApp={this.onClickDeleteApp}
                            onImportTutorial={(tutorial) => this.onImportTutorial(tutorial)}
                        />
                    }
                />
            </Switch>
        )
    }
}


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchApplicationsThunkAsync: actions.app.fetchApplicationsThunkAsync,
        fetchAppSourceThunkAsync: actions.app.fetchAppSourceThunkAsync,
        fetchBotInfoThunkAsync: actions.bot.fetchBotInfoThunkAsync,
        createApplicationThunkAsync: actions.app.createApplicationThunkAsync,
        deleteApplicationThunkAsync: actions.app.deleteApplicationThunkAsync,
        copyApplicationThunkAsync: actions.app.copyApplicationThunkAsync,
    }, dispatch)
}

const mapStateToProps = (state: State) => {
    if (!state.user.user) {
        throw new Error(`You attempted to render AppsIndex but the user was not defined. This is likely a problem with higher level component. Please open an issue.`)
    }

    return {
        apps: state.apps.all,
        display: state.display,
        user: state.user.user,
        browserId: state.bot.browserId
    }
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps)
const dispatchProps = returntypeof(mapDispatchToProps)
type Props = typeof stateProps & typeof dispatchProps & RouteComponentProps<any>

export default connect<typeof stateProps, typeof dispatchProps, RouteComponentProps<any>>(mapStateToProps, mapDispatchToProps)(AppsIndex)