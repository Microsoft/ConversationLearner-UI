/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import {
    NavLink,
    Route,
    Switch
} from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AppBase, AppDefinition, ActionBase, ActionTypes, ApiAction, CardAction, BotInfo, Validity } from '@conversationlearner/models'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { FM } from '../../../react-intl-messages'
import { State } from '../../../types';
import { IconButton, Icon } from 'office-ui-fabric-react'
import Entities from './Entities'
import TrainDialogs from './TrainDialogs'
import Actions from './Actions'
import Dashboard from './Dashboard'
import Settings from './Settings'
import LogDialogs from './LogDialogs'
import { FontClassNames } from 'office-ui-fabric-react'
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import TrainingStatus from '../../../components/TrainingStatusContainer'
import actions from '../../../actions'
import './Index.css'

// TODO: i18n support would be much easier after proper routing is implemented
// this would eliminate the use of page title strings as navigation keys and instead use the url

interface ComponentState {
    validationErrors: string[]
    packageId: string | null
}

class Index extends React.Component<Props, ComponentState> {
    state: ComponentState = {
        validationErrors: [],
        packageId: null
    }

    async loadApp(app: AppBase, packageId: string): Promise<void> {
        this.setState({ packageId })

        await this.props.fetchBotInfoThunkAsync(this.props.browserId, app.appId)

        this.props.setCurrentAppThunkAsync(this.props.user.id, app)
        // Note: We load log dialogs in a separate call as eventually we want to page
        this.props.fetchAllLogDialogsThunkAsync(app, packageId)
        this.props.fetchAppSourceThunkAsync(app.appId, packageId)
    }

    componentWillMount() {
        const { match, location, history } = this.props
        const app: AppBase | null = location.state && location.state.app
        if (!app) {
            // TODO: Is there a way to recover getting appId from URL instead of router state
            const appId = match.params.appId
            console.warn(`${this.constructor.name} componentWillMount. location.state.app is for app ${appId}`)
            history.push('/home')
            return
        }

        const editPackageId = this.props.activeApps[app.appId] || app.devPackageId;
        if (!editPackageId) {
            throw new Error(`You attempted to load an app, but editPackageId is not defined. This is likely a problem with the code. Please open an issue.`)
        }

        this.loadApp(app, editPackageId)
    }

    componentWillReceiveProps(newProps: Props) {
        const app: AppBase | null = newProps.location.state && newProps.location.state.app
        if (!app) {
            throw new Error(`App/Index#componentWillReceiveProps: app could not be found in location state. This is likely a problem with the code. Please open an issue.`)
        }

        const editPackageId = newProps.activeApps[app.appId] || app.devPackageId
        if (!editPackageId) {
            throw new Error(`App/Index#componentWillReceiveProps: editPackageId is not defined. This is likely a problem with the code. Please open an issue.`)
        }

        if (this.state.packageId !== editPackageId) {
            this.loadApp(app, editPackageId);
        }

        if ((newProps.actions !== this.props.actions || newProps.botInfo !== this.props.botInfo) && newProps.botInfo) {
            let validationErrors = this.actionValidationErrors(newProps.botInfo, newProps.actions);
            this.setState({ validationErrors: validationErrors });
        }
    }

    onCreateApp = async (appToCreate: AppBase, source: AppDefinition | null = null) => {
        const app = await (this.props.createApplicationThunkAsync(this.props.user.id, appToCreate, source) as any as Promise<AppBase>)
        const { history } = this.props
        history.push(`/home/${app.appId}`, { app })
    }

    actionValidationErrors(botInfo: BotInfo, actions: ActionBase[]): string[] {
        // Check for missing APIs
        const actionsMissingCallbacks = actions
            .filter(a => a.actionType === ActionTypes.API_LOCAL)
            .map(a => new ApiAction(a))
            .filter(a => !botInfo.callbacks || !botInfo.callbacks.some(cb => cb.name === a.name))

        // Make unique list of missing APIs
        const uniqueCallbackNames = actionsMissingCallbacks
            .map(a => a.name)
            .filter((item, i, ar) => ar.indexOf(item) === i)

        const apiActionErrors = uniqueCallbackNames.map(api => `Action references callback "${api}" not contained by running Bot.`)

        // Check for bad templates
        const badTemplateErrors = botInfo.templates
            .filter(t => t.validationError !== null)
            .map(t => t.validationError!)

        // Check for missing templates
        const actionsMissingTemplates = actions
            .filter(a => a.actionType === ActionTypes.CARD)
            .map(a => new CardAction(a))
            .filter(a => !botInfo.templates || !botInfo.templates.some(cb => cb.name === a.templateName))

        // Make unique list of missing templates
        const uniqueTemplateNames = actionsMissingTemplates
            .map(a => a.templateName)
            .filter((item, i, ar) => ar.indexOf(item) === i)

        const missingTemplateErrors = uniqueTemplateNames.map(template => `Action references Template "${template}" not contained by running Bot`)

        return [
            ...apiActionErrors,
            ...badTemplateErrors,
            ...missingTemplateErrors
        ]
    }

    hasInvalidTrainDialogs(): boolean {
        return this.props.trainDialogs.filter(td => td.validity !== undefined && td.validity !== Validity.VALID).length > 0;
    }
    render() {
        const { match, location, intl } = this.props

        if (!location.state) {
            return null
        }

        const app: AppBase = location.state.app
        // TODO: There is an assumption that by the time render is called, componentWillMount has called loadApp and set the packageId
        const editPackageId = this.state.packageId!

        // TODO: Why is this hard coded to Master? If there is no packageVersions we default back to Master but this seems incorrect
        let tag = 'Master'
        if (editPackageId !== app.devPackageId) {
            const packageReference = app.packageVersions.find(pv => pv.packageId === editPackageId)
            if (!packageReference) {
                throw new Error(`editPackageId did not equal devPackageId, but could not find a packageVersion using the editPackageId: ${editPackageId}. This should not be possible. Please open an issue.`)
            }

            tag = packageReference.packageVersion
        }

        const invalidTrainDialogs = this.hasInvalidTrainDialogs();
        const invalidBot = this.state.validationErrors && this.state.validationErrors.length > 0;
       
        return (
            <div className="cl-app-page">
                <div>
                    <div className="cl-app-title">
                        <div
                            data-testid="app-index-model-name" 
                            className={FontClassNames.xxLarge}
                        >{app.appName}</div>
                    </div>
                    <div className={`cl-app-tag-status ${FontClassNames.mediumPlus}`}>
                        Tag: {tag}
                        {editPackageId === app.livePackageId && 
                            <span className="cl-font--warning">LIVE</span>
                        }
                    </div>
                    <TrainingStatus
                        app={app}
                    />
                    <div className={`cl-nav ${FontClassNames.mediumPlus}`}>
                        <div className="cl-nav_section">
                            <NavLink className="cl-nav-link" data-testid="app-index-nav-link-home" exact to={{ pathname: `${match.url}`, state: { app } }}>
                                <Icon iconName="Home" />
                                    <span className={invalidBot ? 'cl-font--highlight' : ''}>Home
                                        {invalidBot &&
                                            <TooltipHost 
                                                content={intl.formatMessage({
                                                    id: FM.TOOLTIP_BOTINFO_INVALID,
                                                    defaultMessage: 'Bot not compatible'
                                                })} 
                                                calloutProps={{ gapSpace: 0 }}
                                            >
                                                <IconButton
                                                    className="ms-Button--transparent cl-icon--short"
                                                    iconProps={{ iconName: 'IncidentTriangle' }}
                                                    title="Error Alert"
                                                />
                                            </TooltipHost>
                                        }</span>
                            </NavLink>
                            <NavLink className="cl-nav-link" data-testid="app-index-nav-link-entities" to={{ pathname: `${match.url}/entities`, state: { app } }}>
                                <Icon iconName="List" /><span>Entities</span><span className="count">{this.props.entities.filter(e => typeof e.positiveId === 'undefined' || e.positiveId === null).filter(e => !e.doNotMemorize).length}</span>
                            </NavLink>
                            <NavLink className="cl-nav-link" data-testid="app-index-nav-link-actions" to={{ pathname: `${match.url}/actions`, state: { app } }}>
                                <Icon iconName="List" /><span>Actions</span><span className="count">{this.props.actions.length}</span>
                            </NavLink>
                            <NavLink className="cl-nav-link" data-testid="app-index-nav-link-train-dialogs" to={{ pathname: `${match.url}/trainDialogs`, state: { app } }}>
                                <Icon iconName="List" />
                                    <span className={invalidTrainDialogs ? 'cl-font--highlight' : ''}>Train Dialogs
                                        {invalidTrainDialogs && 
                                            <TooltipHost 
                                                content={intl.formatMessage({
                                                    id: FM.TOOLTIP_TRAINDIALOG_INVALID,
                                                    defaultMessage: 'Contains Invalid Train Dialogs'
                                                })} 
                                                calloutProps={{ gapSpace: 0 }}
                                            >
                                                <Icon className="cl-icon" iconName="IncidentTriangle" />
                                            </TooltipHost>
                                        }</span>
                                    <span className="count">{this.props.trainDialogs.length}</span>
                            </NavLink>
                            <NavLink className="cl-nav-link" data-testid="app-index-nav-link-log-dialogs" to={{ pathname: `${match.url}/logDialogs`, state: { app } }}>
                                <Icon iconName="List" /><span>Log Dialogs</span>
                            </NavLink>
                            <NavLink className="cl-nav-link" data-testid="app-index-nav-link-settings" to={{ pathname: `${match.url}/settings`, state: { app } }}>
                                <Icon iconName="Settings" /><span>Settings</span>
                            </NavLink>
                        </div>
                        <div className="cl-nav_section">
                            <NavLink className="cl-nav-link" exact={true} to="/home">
                                <Icon iconName="Back" /><span>My Models</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route 
                        path={`${match.url}/settings`} 
                        render={props => <Settings {...props} app={app} editingPackageId={editPackageId} onCreateApp={this.onCreateApp} />} />
                    <Route 
                        path={`${match.url}/entities`} 
                        render={props => <Entities {...props} app={app} editingPackageId={editPackageId} />} />
                    <Route 
                        path={`${match.url}/actions`} 
                        render={props => <Actions {...props} app={app} editingPackageId={editPackageId}/>} />
                    <Route 
                        path={`${match.url}/trainDialogs`} 
                        render={props => <TrainDialogs {...props} app={app} editingPackageId={editPackageId} invalidBot={invalidBot} filteredAction={location.state.actionFilter} filteredEntity={location.state.entityFilter} />} />
                    <Route 
                        path={`${match.url}/logDialogs`} 
                        render={props => <LogDialogs {...props} app={app} editingPackageId={editPackageId} invalidBot={invalidBot} />} />
                    <Route
                        exact={true}
                        path={match.url}
                        render={props => <Dashboard {...props} app={app} validationErrors={this.state.validationErrors} />}
                    />
                </Switch>
            </div>
        )
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        setCurrentAppThunkAsync: actions.display.setCurrentAppThunkAsync,
        createApplicationThunkAsync: actions.app.createApplicationThunkAsync,
        fetchAppSourceThunkAsync: actions.app.fetchAppSourceThunkAsync,
        fetchAllLogDialogsThunkAsync: actions.log.fetchAllLogDialogsThunkAsync,
        fetchBotInfoThunkAsync: actions.bot.fetchBotInfoThunkAsync
    }, dispatch);
}
const mapStateToProps = (state: State) => {
    if (!state.user.user) {
        throw new Error(`You attempted to render App/Index but the user was not defined. This is likely a problem with higher level component. Please open an issue.`)
    }

    return {
        entities: state.entities,
        actions: state.actions,
        trainDialogs: state.trainDialogs,
        display: state.display,
        botInfo: state.bot.botInfo,
        user: state.user.user,
        browserId: state.bot.browserId,
        activeApps: state.apps.activeApps
    }
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);

interface MatchParams {
    appId: string
}
type Props = typeof stateProps & typeof dispatchProps & RouteComponentProps<MatchParams> & InjectedIntlProps;

export default connect<typeof stateProps, typeof dispatchProps, RouteComponentProps<any>>(mapStateToProps, mapDispatchToProps)(injectIntl(Index));
