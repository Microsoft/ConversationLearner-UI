import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { editBLISApplicationAsync } from '../../../actions/updateActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../../../types';
import * as OF from 'office-ui-fabric-react';
import { BlisAppBase, BlisAppMetaData } from 'blis-models'
import './Settings.css'
import { FM } from '../../../react-intl-messages'
import { injectIntl, InjectedIntlProps, defineMessages, FormattedMessage } from 'react-intl'

const messages = defineMessages({
    fieldErrorRequired: {
        id: FM.SETTINGS_FIELDERROR_REQUIREDVALUE,
        defaultMessage: "Required Value"
    },
    fieldErrorAlphanumeric: {
        id: FM.SETTINGS_FIELDERROR_ALPHANUMERIC,
        defaultMessage: 'Application name may only contain alphanumeric characters'
    },
    fieldErrorDistinct: {
        id: FM.SETTINGS_FIELDERROR_DISTINCT,
        defaultMessage: 'Name is already in use.'
    },
    passwordHidden: {
        id: FM.SETTINGS_PASSWORDHIDDEN,
        defaultMessage: 'Show'
    },
    passwordVisible: {
        id: FM.SETTINGS_PASSWORDVISIBLE,
        defaultMessage: 'Hide'
    },
    botFrameworkAppIdFieldLabel: {
        id: FM.SETTINGS_BOTFRAMEWORKAPPIDFIELDLABEL,
        defaultMessage: 'Application ID'
    },
    botFrameworkAddBotButtonText: {
        id: FM.SETTINGS_BOTFRAMEWORKADDBOTBUTTONTEXT,
        defaultMessage: 'Add'
    },
    saveChanges: {
        id: FM.SETTINGS_SAVECHANGES,
        defaultMessage: 'Save Changes'
    },
    discard: {
        id: FM.SETTINGS_DISCARD,
        defaultMessages: 'Discard'
    }
})

const styles = {
    shown: {
        visibility: "visible"
    },
    hidden: {
        visibility: "hidden"
    }
}

interface ComponentState {
    localeVal: string
    appIdVal: string
    appNameVal: string
    luisKeyVal: string
    edited: boolean
    botFrameworkAppsVal: any[],
    newBotVal: string,
    isPasswordVisible: boolean,
    passwordShowHideText: string
}

class Settings extends React.Component<Props, ComponentState> {
    constructor(p: Props) {
        super(p)

        this.state = {
            localeVal: '',
            appIdVal: '',
            appNameVal: '',
            luisKeyVal: '',
            edited: false,
            botFrameworkAppsVal: [],
            newBotVal: "",
            isPasswordVisible: false,
            passwordShowHideText: this.props.intl.formatMessage(messages.passwordHidden)
        }

        this.onChangedLuisKey = this.onChangedLuisKey.bind(this)
        this.onChangedBotId = this.onChangedBotId.bind(this)
        this.onChangedName = this.onChangedName.bind(this)
        this.onRenderBotListRow = this.onRenderBotListRow.bind(this)
        this.onClickShowPassword = this.onClickShowPassword.bind(this)
        this.onClickAddBot = this.onClickAddBot.bind(this)
        this.onClickSave = this.onClickSave.bind(this)
        this.onClickDiscard = this.onClickDiscard.bind(this)
    }
    componentWillMount() {
        let app = this.props.app
        this.setState({
            localeVal: app.locale,
            appIdVal: app.appId,
            appNameVal: app.appName,
            luisKeyVal: app.luisKey,
            botFrameworkAppsVal: app.metadata.botFrameworkApps,
            newBotVal: ""
        })
    }
    componentDidUpdate() {
        let app = this.props.app
        if (this.state.edited == false && (this.state.localeVal !== app.locale ||
            this.state.appIdVal !== app.appId ||
            this.state.appNameVal !== app.appName ||
            this.state.luisKeyVal !== app.luisKey ||
            this.state.botFrameworkAppsVal !== app.metadata.botFrameworkApps)) {
            this.setState({
                localeVal: app.locale,
                appIdVal: app.appId,
                appNameVal: app.appName,
                luisKeyVal: app.luisKey,
                botFrameworkAppsVal: app.metadata.botFrameworkApps
            })
        }
    }
    onChangedName(text: string) {
        this.setState({
            appNameVal: text,
            edited: true
        })
    }
    onChangedBotId(text: string) {
        this.setState({
            newBotVal: text,
            edited: true
        })
    }
    onChangedLuisKey(text: string) {
        this.setState({
            luisKeyVal: text,
            edited: true
        })
    }
    onClickAddBot() {
        let newBotApps = this.state.botFrameworkAppsVal.concat(this.state.newBotVal);
        this.setState({
            botFrameworkAppsVal: newBotApps,
            newBotVal: ""
        })
    }
    onRenderBotListRow(item?: any, index?: number) {
        return (
            <div>
                <OF.TextField className="ms-font-m-plus" disabled={true} value={item} />
            </div>
        )
    }
    onClickDiscard() {
        let app = this.props.app
        this.setState({
            localeVal: app.locale,
            appIdVal: app.appId,
            appNameVal: app.appName,
            luisKeyVal: app.luisKey,
            botFrameworkAppsVal: app.metadata.botFrameworkApps,
            edited: false,
            newBotVal: ""
        })
    }
    onClickSave() {
        let app = this.props.app
        let modifiedApp = new BlisAppBase({
            appName: this.state.appNameVal,
            appId: app.appId,
            luisKey: this.state.luisKeyVal,
            locale: app.locale,
            metadata: new BlisAppMetaData({
                botFrameworkApps: this.state.botFrameworkAppsVal
            })
        })
        this.props.editBLISApplicationAsync(this.props.userKey, modifiedApp);
        this.setState({
            localeVal: app.locale,
            appIdVal: app.appId,
            appNameVal: app.appName,
            luisKeyVal: app.luisKey,
            edited: false,
            newBotVal: ""
        })
    }

    onGetNameErrorMessage(value: string): string {
        const { intl } = this.props
        if (value.length === 0) {
            return intl.formatMessage(messages.fieldErrorRequired)
        }

        if (!/^[a-zA-Z0-9- ]+$/.test(value)) {
            return intl.formatMessage(messages.fieldErrorAlphanumeric)
        }

        // Check that name isn't in use
        let foundApp = this.props.apps.find(a => (a.appName == value && a.appId != this.props.app.appId));
        if (foundApp) {
            return intl.formatMessage(messages.fieldErrorDistinct)
        }

        return ""
    }

    onClickShowPassword() {
        this.setState((prevState: ComponentState) => ({
            isPasswordVisible: !prevState.isPasswordVisible,
            passwordShowHideText: !prevState.isPasswordVisible
                ? this.props.intl.formatMessage(messages.passwordHidden)
                : this.props.intl.formatMessage(messages.passwordVisible)
        }))
    }

    render() {
        const { intl } = this.props
        let options = [{
            key: this.state.localeVal,
            text: this.state.localeVal,
        }]
        let buttonsDivStyle = this.state.edited == true ? styles.shown : styles.hidden;
        return (
            <div className="blis-page">
                <span className="ms-font-xxl">
                    <FormattedMessage
                        id={FM.SETTINGS_TITLE}
                        defaultMessage="Settings"
                    />
                </span>
                <span className="ms-font-m-plus">
                    <FormattedMessage
                        id={FM.SETTINGS_SUBTITLE}
                        defaultMessage="Control your application versions, who has access to it and whether it is public or private..."
                    />
                </span>
                <div>
                    <OF.TextField
                        className="ms-font-m-plus"
                        onChanged={(text) => this.onChangedName(text)}
                        label={intl.formatMessage({
                            id: FM.SETTINGS_FIELDS_NAMELABEL,
                            defaultMessage: "Name"
                        })}
                        onGetErrorMessage={value => this.onGetNameErrorMessage(value)}
                        value={this.state.appNameVal}
                    />
                    <OF.TextField
                        className="ms-font-m-plus"
                        disabled={true}
                        label={intl.formatMessage({
                            id: FM.SETTINGS_FILEDS_APPIDLABEL,
                            defaultMessage: "App ID"
                        })}
                        value={this.state.appIdVal}
                    />
                    <OF.Label className="ms-font-m-plus">
                        <FormattedMessage
                            id={FM.SETTINGS_BOTFRAMEWORKLUISKEYLABEL}
                            defaultMessage="LUIS Key"
                        />
                    </OF.Label>
                    <div className="blis-settings-textfieldwithbutton">
                        <OF.TextField
                            id="luis-key"
                            className="ms-font-m-plus"
                            onChanged={(text) => this.onChangedLuisKey(text)}
                            type={this.state.isPasswordVisible ? "text" : "password"}
                            value={this.state.luisKeyVal}
                        />
                        <OF.PrimaryButton
                            onClick={this.onClickShowPassword}
                            ariaDescription={this.state.passwordShowHideText}
                            text={this.state.passwordShowHideText}
                        />
                    </div>
                    <OF.Label className="ms-font-m-plus">
                        <FormattedMessage
                            id={FM.SETTINGS_BOTFRAMEWORKLOCALELABEL}
                            defaultMessage="Locale"
                        />
                    </OF.Label>
                    <OF.Dropdown
                        className="ms-font-m-plus"
                        options={options}
                        selectedKey={this.state.localeVal}
                        disabled={true}
                    />
                    <div>
                        <OF.Label className="ms-font-m-plus">
                            <FormattedMessage
                                id={FM.SETTINGS_BOTFRAMEWORKLISTLABEL}
                                defaultMessage="Bot Framework Apps"
                            />
                        </OF.Label>
                        <OF.List
                            items={this.state.botFrameworkAppsVal}
                            onRenderCell={this.onRenderBotListRow}
                        />
                        <div className="blis-settings-textfieldwithbutton">
                            <OF.TextField
                                className="ms-font-m-plus"
                                onChanged={(text) => this.onChangedBotId(text)}
                                placeholder={intl.formatMessage(messages.botFrameworkAppIdFieldLabel)}
                                value={this.state.newBotVal}
                            />
                            <OF.PrimaryButton
                                onClick={this.onClickAddBot}
                                ariaDescription={intl.formatMessage(messages.botFrameworkAddBotButtonText)}
                                text={intl.formatMessage(messages.botFrameworkAddBotButtonText)}
                            />
                        </div>
                    </div>
                    <div className="blis-modal-buttons_primary" style={buttonsDivStyle}>
                        <OF.PrimaryButton
                            disabled={this.onGetNameErrorMessage(this.state.appNameVal) !== ""}
                            onClick={this.onClickSave}
                            ariaDescription={intl.formatMessage(messages.saveChanges)}
                            text={intl.formatMessage(messages.saveChanges)}
                        />
                        <OF.DefaultButton
                            onClick={this.onClickDiscard}
                            ariaDescription={intl.formatMessage(messages.discard)}
                            text={intl.formatMessage(messages.discard)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        editBLISApplicationAsync
    }, dispatch);
}
const mapStateToProps = (state: State) => {
    return {
        userKey: state.user.key,
        apps: state.apps.all
    }
}

export interface ReceivedProps {
    app: BlisAppBase
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps;

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(Settings))