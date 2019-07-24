/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react'
import * as Util from '../Utils/util'
import * as OF from 'office-ui-fabric-react'
import actions from '../actions'
import FormattedMessageId from '../components/FormattedMessageId'
import { RouteComponentProps } from 'react-router'
import { returntypeof } from 'react-redux-typescript'
import { connect } from 'react-redux'
import { State, ports } from '../types'
import { bindActionCreators } from 'redux'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { FM } from '../react-intl-messages'
import './Settings.css'

class Settings extends React.Component<Props> {

    onChangeSdkPort = (event: React.ChangeEvent<HTMLInputElement>) => {
        const botPort = parseInt(event.target.value, 10)
        this.props.settingsUpdatePort(botPort)
    }

    onChangeCustomPort = () => {
        this.props.settingsToggleUseCustomPort()
    }

    onChangeFeatures = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.settingsUpdateFeatures(event.target.value)
    }

    reset = () => {
        this.props.settingsReset()
    }

    render() {
        return (
            <div className="cl-o-app-columns">
                <div className="cl-app_content">
                    <div className="cl-page">
                        <div data-testid="settings-title-2" className={OF.FontClassNames.superLarge}>
                            <FormattedMessageId id={FM.PROFILE_SETTINGS_TITLE} />
                        </div>
                        <div>
                            <div className="cl-settings__bot-port">
                                <div className={`${OF.FontClassNames.xLarge}`}>
                                    <FormattedMessageId id={FM.PROFILE_SETTINGS_BOT_PORT} />
                                </div>
                                <div>
                                    {Util.formatMessageId(this.props.intl, FM.PROFILE_SETTINGS_BOT_PORT_DESCRIPTION, { port: ports.urlBotPort })}
                                </div>
                                <div>
                                    <OF.Icon className="cl-icon cl-color-error" iconName="IncidentTriangle" />
                                    <FormattedMessageId id={FM.PROFILE_SETTINGS_BOT_PORT_WARNING} />
                                </div>
                                <div data-testid="settings-custom-bot-port">
                                    <OF.Checkbox
                                        label={Util.formatMessageId(this.props.intl, FM.PROFILE_SETTINGS_BOT_PORT_USE_CUSTOM)}
                                        checked={this.props.settings.useCustomPort}
                                        onChange={this.onChangeCustomPort}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="cl-input"
                                        type="number"
                                        min={0}
                                        max={99999}
                                        value={this.props.settings.customPort}
                                        onChange={this.onChangeSdkPort}
                                        disabled={!this.props.settings.useCustomPort}
                                    />

                                    <OF.PrimaryButton
                                        text="Reset"
                                        ariaDescription="Reset"
                                        iconProps={{ iconName: 'Undo' }}
                                        onClick={this.reset}
                                        disabled={!this.props.settings.useCustomPort}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <input
                                className="cl-input"
                                type="text"
                                value={this.props.settings.features}
                                onChange={this.onChangeFeatures}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        settingsReset: actions.settings.settingsReset,
        settingsUpdatePort: actions.settings.settingsUpdatePort,
        settingsUpdateFeatures: actions.settings.settingsUpdateFeatures,
        settingsToggleUseCustomPort: actions.settings.settingsToggleUseCustomPort,
    }, dispatch)
}

const mapStateToProps = (state: State) => {
    return {
        settings: state.settings
    }
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps)
const dispatchProps = returntypeof(mapDispatchToProps)
type Props = typeof stateProps & typeof dispatchProps & RouteComponentProps<any> & InjectedIntlProps

export default connect<typeof stateProps, typeof dispatchProps, RouteComponentProps<any>>(mapStateToProps, mapDispatchToProps)(injectIntl(Settings))