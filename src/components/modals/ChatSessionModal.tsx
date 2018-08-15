/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontClassNames, Icon, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { State } from '../../types';
import Webchat from '../Webchat'
import { AppBase } from '@conversationlearner/models'
import actions from '../../actions'
import { FM } from '../../react-intl-messages'
import { injectIntl, InjectedIntlProps } from 'react-intl'

interface ComponentState {
}

class SessionWindow extends React.Component<Props, ComponentState> {
    onClickDone() {
        if (this.props.chatSession.current !== null) {
            this.props.deleteChatSessionThunkAsync(this.props.user.id, this.props.chatSession.current, this.props.app, this.props.editingPackageId)
        }

        this.props.onClose();
    }

    // Force timeout of the session
    onClickExpire() {
        if (this.props.chatSession.current !== null) {
            this.props.editChatSessionExpireThunkAsync(this.props.app.appId, this.props.chatSession.current.sessionId)
        }
    }

    render() {
        const { intl } = this.props
        return (
            <Modal
                isOpen={this.props.open && this.props.error == null}
                isBlocking={true}
                containerClassName="cl-modal cl-modal--narrow cl-modal--log"
            >
                <div className="cl-modal_body">
                    <div className="cl-sessionmodal">
                        <div className="cl-sessionmodal-title">
                            <div className={`cl-dialog-title cl-dialog-title--log ${FontClassNames.xxLarge}`}>
                                <Icon iconName="UserFollowed" />Log Dialog
                            </div>
                        </div>
                        <div className="cl-chatmodal_webchat">
                            <Webchat
                                data-testid="chatsession-modal-webchat"
                                isOpen={this.props.open && this.props.error == null}
                                app={this.props.app}
                                history={[]}
                                onPostActivity={() => { }}
                                onSelectActivity={() => { }}
                                hideInput={false}
                                focusInput={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="cl-modal_footer cl-modal_footer--border">
                    <div className="cl-modal-buttons">
                        <div className="cl-modal-buttons_secondary">
                        </div>
                        <div className="cl-modal-buttons_primary">
                            <PrimaryButton
                                data-testid="chatsession-modal-footer-button1"
                                onClick={() => this.onClickDone()}
                                ariaDescription={intl.formatMessage({
                                    id: FM.CHATSESSIONMODAL_PRIMARYBUTTON_ARIADESCRIPTION,
                                    defaultMessage: 'Done Testing'
                                })}
                                text={intl.formatMessage({
                                    id: FM.CHATSESSIONMODAL_PRIMARYBUTTON_TEXT,
                                    defaultMessage: 'Done Testing'
                                })}
                            />
                            <DefaultButton
                            data-testid="chatsession-modal-footer-button2"
                                onClick={() => this.onClickExpire()}
                                ariaDescription={intl.formatMessage({
                                    id: FM.CHATSESSIONMODAL_EXPIREBUTTON_ARIADESCRIPTION,
                                    defaultMessage: 'Expire Session'
                                })}
                                text={intl.formatMessage({
                                    id: FM.CHATSESSIONMODAL_EXPIREBUTTON_TEXT,
                                    defaultMessage: 'Expire Session'
                                })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteChatSessionThunkAsync: actions.chat.deleteChatSessionThunkAsync,
        editChatSessionExpireThunkAsync: actions.chat.editChatSessionExpireThunkAsync
    }, dispatch);
}
const mapStateToProps = (state: State) => {
    if (!state.user.user) {
        throw new Error(`You attempted to render ChatSessionModal but the user was not defined. This is likely a problem with higher level component. Please open an issue.`)
    }

    return {
        chatSession: state.chatSessions,
        user: state.user.user,
        error: state.error.title
    }
}

export interface ReceivedProps {
    open: boolean
    onClose: () => void
    app: AppBase,
    editingPackageId: string
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(SessionWindow))
