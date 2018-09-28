/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import './TeachSessionModal.css';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ErrorHandler } from '../../ErrorHandler'
import { AT } from '../../types/ActionTypes'
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import * as OF from 'office-ui-fabric-react';
import { State } from '../../types';
import Webchat from '../Webchat'
import TeachSessionAdmin from './TeachSessionAdmin'
import TeachSessionInitState from './TeachSessionInitState'
import * as CLM from '@conversationlearner/models'
import { Activity } from 'botframework-directlinejs'
import actions from '../../actions'
import ConfirmCancelModal from './ConfirmCancelModal'
import UserInputModal from './UserInputModal'
import { FM } from '../../react-intl-messages'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { EditDialogType } from '.';

interface ComponentState {
    isConfirmDeleteOpen: boolean,
    isUserInputModalOpen: boolean,
    isInitStateOpen: boolean,
    isInitAvailable: boolean,
    webchatKey: number,
    editing: boolean,
    hasTerminalAction: boolean,
    nextActivityIndex: number,
    selectedActivityIndex: number | null
}

class TeachModal extends React.Component<Props, ComponentState> {

    state: ComponentState = {
        isConfirmDeleteOpen: false,
        isUserInputModalOpen: false,
        isInitStateOpen: false,
        isInitAvailable: true,
        webchatKey: 0,
        editing: false,
        hasTerminalAction: false,
        nextActivityIndex: 0,
        selectedActivityIndex: null
    }

    private callbacksId: string | null = null;

    componentDidMount() {
        this.callbacksId = ErrorHandler.registerCallbacks(
            [
                {actionType: AT.POST_SCORE_FEEDBACK_ASYNC, callback: this.onDismissError},
                {actionType: AT.RUN_SCORER_ASYNC, callback: this.onDismissError},
            ]
        );
    };

    componentWillUnmount() {
        if (this.callbacksId) {
            ErrorHandler.deleteCallbacks(this.callbacksId)
        }
    }
 
    @autobind
    onDismissError(errorType: AT): void {
        this.props.deleteTeachSessionThunkAsync(this.props.user.id, this.props.teach, this.props.app, this.props.editingPackageId, false, null, null); // False = abandon
        this.props.onClose();
    }

    componentWillReceiveProps(newProps: Props) {

        let webchatKey = this.state.webchatKey
        let hasTerminalAction = this.state.hasTerminalAction
        let isInitAvailable = this.state.isInitAvailable
        let nextActivityIndex = this.state.nextActivityIndex

        if (this.props.initialHistory !== newProps.initialHistory) {
            webchatKey = this.state.webchatKey + 1
            isInitAvailable = !newProps.initialHistory || newProps.initialHistory.length === 0
            nextActivityIndex = newProps.initialHistory.length
        }

        // If new session
        if (this.props.teach !== newProps.teach) {
            isInitAvailable = true
            hasTerminalAction = false
        }
        // Set terminal action from History but only if I just loaded it
        if (this.props.initialHistory !== newProps.initialHistory && newProps.initialHistory && newProps.initialHistory.length > 0) {
            hasTerminalAction = newProps.lastAction
                ? newProps.lastAction.isTerminal
                : false
        }

        if (webchatKey !== this.state.webchatKey || 
            hasTerminalAction !== this.state.hasTerminalAction ||
            isInitAvailable !== this.state.isInitAvailable) {
            this.setState({
                webchatKey: webchatKey,
                hasTerminalAction: hasTerminalAction,
                isInitAvailable: isInitAvailable,
                nextActivityIndex
            })
        }   
    }

    @autobind
    onInitStateClicked() {
        this.setState({
            isInitStateOpen: true
        })
    }

    @autobind
    async onCloseInitState(filledEntityMap?: CLM.FilledEntityMap) {
        if (filledEntityMap && this.props.onSetInitialEntities) {
            await this.props.onSetInitialEntities(filledEntityMap.FilledEntities())          
        }
        this.setState({
            isInitStateOpen: false
        })
    }

    @autobind
    onClickAbandonTeach() {
        this.setState({
            isConfirmDeleteOpen: true
        })
    }

    @autobind
    onClickSave() {
        // If source was a trainDialog, delete the original
        let sourceTrainDialogId = this.props.sourceTrainDialog ? this.props.sourceTrainDialog.trainDialogId : null;
        let sourceLogDialogId = this.props.sourceLogDialog ? this.props.sourceLogDialog.logDialogId : null;

        this.props.deleteTeachSessionThunkAsync(this.props.user.id, this.props.teach, this.props.app, this.props.editingPackageId, true, sourceTrainDialogId, sourceLogDialogId)
        this.props.onClose()
    }

    @autobind
    onClickConfirmDelete() {
        this.setState(
            {
                isConfirmDeleteOpen: false
            },
            () => {
                this.props.deleteTeachSessionThunkAsync(this.props.user.id, this.props.teach, this.props.app, this.props.editingPackageId, false, null, null); // False = abandon
                this.props.onClose()
            })
    }

    @autobind
    onClickCancelDelete() {
        this.setState({
            isConfirmDeleteOpen: false
        })
    }

    autoTeachChanged(ev: React.FormEvent<HTMLElement>, isChecked: boolean) {
        this.props.toggleAutoTeach(isChecked);
    }

    onWebChatPostActivity(activity: Activity) {
        if (activity.type === 'message') {

            let userInput: CLM.UserInput

            // Check if button submit info
            if (!activity.text && activity.value && activity.value['submit']) {
                userInput = { text: activity.value['submit'] }
            } 
            // Otherwise use text
            else {
                userInput = { text: activity.text! }
            }

            if (!this.props.teach) {
                throw new Error(`Current teach session is not defined. This may be due to race condition where you attempted to chat with the bot before the teach session has been created.`)
            }

            // Add channel data to activity so can process when clicked on later
            activity.channelData = { 
                activityIndex: this.state.nextActivityIndex,
            }
              
            this.setState({ 
                 // No initialization allowed after first input
                isInitAvailable: false, 
                nextActivityIndex: this.state.nextActivityIndex + 1
            })

            this.props.runExtractorThunkAsync(this.props.app.appId, CLM.DialogType.TEACH, this.props.teach.teachId, null, userInput);
        }
    }

    @autobind
    onClickAddUserInput() {
        this.setState({
            isUserInputModalOpen: true
        })
    }

    @autobind
    onCancelAddUserInput() {
        this.setState({
            isUserInputModalOpen: false
        })
    }

    @autobind
    onSubmitAddUserInput(userInput: string) {
        this.setState({
            isUserInputModalOpen: false
        })
        if (this.state.selectedActivityIndex != null) { 
            this.props.onEditTeach(this.state.selectedActivityIndex, userInput, this.props.onInsertInput) 
        }
    }

    @autobind
    onInsertAction() {
        if (this.state.selectedActivityIndex != null) { 
            this.props.onEditTeach(this.state.selectedActivityIndex, null, this.props.onInsertAction) 
        }
    }

    @autobind
    onDeleteTurn() {
        if (this.state.selectedActivityIndex != null) { 
            this.props.onEditTeach(this.state.selectedActivityIndex, null, this.props.onDeleteTurn) 
        }
    }

    renderSelectedActivity(activity: Activity): (JSX.Element | null) {

        if (this.state.selectedActivityIndex === null) {
            return null
        }
        
        const isUser = activity.from.name === 'ConversationLearnerDeveloper'

        // Can only delete first user input if it has no scorer steps
        // and is followed by user input
        const canDeleteRound = this.state.selectedActivityIndex !== 0 /*|| 
            senderType !== CLM.SenderType.User ||
            curRound.scorerSteps.length === 0/* ||LARS
            (hasNoScorerStep && this.props.trainDialog.rounds.length > 1)*/

        return (
            <div className="cl-wc-buttonbar">
                <OF.IconButton
                    className={`cl-wc-addinput ${isUser ? `cl-wc-addinput--user` : `cl-wc-addinput--bot`}`}
                    onClick={this.onClickAddUserInput}
                    ariaDescription="Insert Input Turn"
                    iconProps={{ iconName: 'CommentAdd' }}
                />
                <OF.IconButton
                    className={`cl-wc-addscore ${isUser ? `cl-wc-addscore--user` : `cl-wc-addscore--bot`}`}
                    onClick={this.onInsertAction}
                    ariaDescription="Insert Score Turn"
                    iconProps={{ iconName: 'CommentAdd' }}
                />
                {canDeleteRound &&
                    <OF.IconButton
                        className={`cl-wc-deleteturn ${isUser ? `cl-wc-deleteturn--user` : `cl-wc-deleteturn--bot`}`}
                        iconProps={{ iconName: 'Delete' }}
                        onClick={this.onDeleteTurn}
                        ariaDescription="Delete Turn"
                    />
                }
                </div>
        )
    }

    onWebChatSelectActivity(activity: Activity) {
       
        // Activities from history can be looked up
        if (this.props.initialHistory.length > 0) {
            const selectedActivityIndex = this.props.initialHistory.findIndex(a => a.id === activity.id)
            if (selectedActivityIndex > -1) {
                this.setState({selectedActivityIndex})
                return
            }
        }
        // Otherwise newly create activities with have index in channelData
        this.setState({selectedActivityIndex: activity.channelData.activityIndex})
    }

    renderAbandonText(intl: ReactIntl.InjectedIntl) {
        switch (this.props.editType) {
            case EditDialogType.NEW:
                return intl.formatMessage({
                    id: FM.BUTTON_ABANDON,
                    defaultMessage: 'Abandon'
                }) 
            case EditDialogType.LOG_EDITED:
                return intl.formatMessage({
                    id: FM.BUTTON_ABANDON_EDIT,
                    defaultMessage: 'Abandon Edit'
                })
            case EditDialogType.LOG_ORIGINAL:
                return intl.formatMessage({
                    id: FM.BUTTON_ABANDON,
                    defaultMessage: 'Abandon'
                }) 
            case EditDialogType.TRAIN_EDITED:
                return intl.formatMessage({
                    id: FM.BUTTON_ABANDON_EDIT,
                    defaultMessage: 'Abandon Edit'
                })
            case EditDialogType.TRAIN_ORIGINAL:
                return intl.formatMessage({
                    id: FM.BUTTON_ABANDON,
                    defaultMessage: 'Abandon'
                })
            default:
                return ""
        }
    }

    renderSaveText(intl: ReactIntl.InjectedIntl) {
        switch (this.props.editType) {
            case EditDialogType.NEW:
                return intl.formatMessage({
                    id: FM.BUTTON_SAVE,
                    defaultMessage: 'Save'
                })
            case EditDialogType.LOG_EDITED:
                return intl.formatMessage({
                    id: FM.BUTTON_SAVE_AS_TRAIN_DIALOG,
                    defaultMessage: 'Save as Train Dialog'
                })
            case EditDialogType.LOG_ORIGINAL:
                return intl.formatMessage({
                    id: FM.BUTTON_SAVE_AS_TRAIN_DIALOG,
                    defaultMessage: 'Save as Train Dialog'
                })
            case EditDialogType.TRAIN_EDITED:
                return intl.formatMessage({
                    id: FM.BUTTON_SAVE_EDIT,
                    defaultMessage: 'Save Edit'
                })
            case EditDialogType.TRAIN_ORIGINAL:
                return intl.formatMessage({
                    id: FM.BUTTON_SAVE,
                    defaultMessage: 'Save'
                })
            default:
                return ""
        }
    }

    renderConfirmText(intl: ReactIntl.InjectedIntl) {
        switch (this.props.editType) {
            case EditDialogType.NEW:
                return intl.formatMessage({
                    id: FM.TEACHSESSIONMODAL_TEACH_CONFIRMDELETE_TITLE,
                    defaultMessage: 'Are you sure you want to abandon this teach session?'
                }) 
            case EditDialogType.LOG_EDITED:
                return intl.formatMessage({
                    id: FM.TEACHSESSIONMODAL_EDIT_CONFIRMDELETE_TITLE,
                    defaultMessage: 'Are you sure you want to abondon your edits?'
                })
            case EditDialogType.LOG_ORIGINAL:
                return intl.formatMessage({
                    id: FM.TEACHSESSIONMODAL_EDIT_CONFIRMDELETE_TITLE,
                    defaultMessage: 'Are you sure you want to abondon your edits?'
                })
            case EditDialogType.TRAIN_EDITED:
                return intl.formatMessage({
                    id: FM.TEACHSESSIONMODAL_EDIT_CONFIRMDELETE_TITLE,
                    defaultMessage: 'Are you sure you want to abondon your edits?'
                })
            case EditDialogType.TRAIN_ORIGINAL:
                return intl.formatMessage({
                    id: FM.TEACHSESSIONMODAL_TEACH_CONFIRMDELETE_TITLE,
                    defaultMessage: 'Are you sure you want to abandon this teach session?'
                })
            default:
                return ""
        }
    }

    onScrollChange(position: number) {
        this.props.setWebchatScrollPosition(position)
    }

    render() {
        const { intl } = this.props

        // Put mask of webchat if waiting for extraction labelling
        let chatDisable = this.props.teachSession.mode === CLM.DialogMode.Extractor ? <div className="cl-overlay"/> : null;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    isBlocking={true}
                    containerClassName="cl-modal cl-modal--large cl-modal--teach"
                >
                    <div className="cl-modal_body">
                        <div className="cl-chatmodal">
                            <div className="cl-chatmodal_webchat">
                                <Webchat
                                    data-testid="teachsession-modal-webchat"
                                    isOpen={this.props.isOpen}
                                    key={this.state.webchatKey}
                                    app={this.props.app}
                                    history={this.props.initialHistory}
                                    onPostActivity={activity => this.onWebChatPostActivity(activity)}
                                    onSelectActivity={activity => this.onWebChatSelectActivity(activity)} 
                                    onScrollChange={position => this.onScrollChange(position)}                      
                                    hideInput={this.props.dialogMode !== CLM.DialogMode.Wait}
                                    focusInput={this.props.dialogMode === CLM.DialogMode.Wait}
                                    highlightClassName={'wc-message-selected'}
                                    renderSelectedActivity={activity => this.renderSelectedActivity(activity)}
                                />
                                {chatDisable}
                            </div>
                            <div className="cl-chatmodal_controls">
                                <div className="cl-chatmodal_admin-controls">
                                    <TeachSessionAdmin
                                        data-testid="teachsession-admin"
                                        app={this.props.app}
                                        editingPackageId={this.props.editingPackageId}
                                        editType={this.props.editType}
                                        activityIndex={this.state.nextActivityIndex}
                                        selectedActivity={null}
                                        onScoredAction={(scoredAction) => {
                                                this.setState({
                                                    hasTerminalAction: scoredAction.isTerminal,
                                                    nextActivityIndex: this.state.nextActivityIndex + 1
                                                })
                                            }
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cl-modal_footer cl-modal_footer--border">
                        <div className="cl-modal-buttons">
                            <div className="cl-modal-buttons_secondary">
                                {this.state.isInitAvailable && 
                                    <OF.DefaultButton
                                            data-testid="teachsession-set-initial-state"
                                            disabled={false}
                                            onClick={this.onInitStateClicked}
                                            ariaDescription={intl.formatMessage({
                                                id: FM.TEACHSESSIONMODAL_INITSTATE_ARIADESCRIPTION,
                                                defaultMessage: "Set Initial State"
                                            })}
                                            text={intl.formatMessage({
                                                id: FM.TEACHSESSIONMODAL_INITSTATE_TEXT,
                                                defaultMessage: "Set Initial State"
                                            })}
                                    />
                                    }
                                </div>

                            <div className="cl-modal-buttons_primary">
                                <OF.PrimaryButton
                                    data-testid="teachsession-footer-button-done"
                                    disabled={!this.state.hasTerminalAction || this.props.teachSession.mode === CLM.DialogMode.Extractor}
                                    onClick={this.onClickSave}
                                    ariaDescription={this.renderSaveText(intl)}
                                    text={this.renderSaveText(intl)}
                                />
                                <OF.DefaultButton
                                    data-testid="teachsession-footer-button-abandon"
                                    disabled={false}
                                    className="cl-button-delete"
                                    onClick={this.onClickAbandonTeach}
                                    ariaDescription={this.renderAbandonText(intl)}
                                    text={this.renderAbandonText(intl)}
                                />
                                
                            </div>
                        </div>
                    </div>
                    <ConfirmCancelModal
                        data-testid="teachsession-confirm-cancel"
                        open={this.state.isConfirmDeleteOpen}
                        onCancel={this.onClickCancelDelete}
                        onConfirm={this.onClickConfirmDelete}
                        title={this.renderConfirmText(intl)}
                    />
                    <UserInputModal
                        open={this.state.isUserInputModalOpen}
                        onCancel={() => {this.onCancelAddUserInput()}}
                        onSubmit={this.onSubmitAddUserInput}
                    />
                </Modal>
                <TeachSessionInitState
                    isOpen={this.state.isInitStateOpen}
                    handleClose={this.onCloseInitState}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteTeachSessionThunkAsync: actions.teach.deleteTeachSessionThunkAsync,
        fetchApplicationTrainingStatusThunkAsync: actions.app.fetchApplicationTrainingStatusThunkAsync,
        runExtractorThunkAsync: actions.teach.runExtractorThunkAsync,
        toggleAutoTeach: actions.teach.toggleAutoTeach,
        setWebchatScrollPosition: actions.display.setWebchatScrollPosition
    }, dispatch);
}
const mapStateToProps = (state: State) => {
    if (!state.user.user) {
        throw new Error(`You attempted to render TeachSessionAdmin but the user was not defined. This is likely a problem with higher level component. Please open an issue.`)
    }

    return {
        user: state.user.user,
        teachSession: state.teachSessions
    }
}

export interface ReceivedProps {
    isOpen: boolean
    onClose: Function
    onEditTeach: (historyIndex: number, userInput: string|null, editHandler: (trainDialog: CLM.TrainDialog, activity: Activity, userInput: string) => any) => void
    onInsertAction: (trainDialog: CLM.TrainDialog, activity: Activity) => any
    onInsertInput: (trainDialog: CLM.TrainDialog, activity: Activity, userText: string) => any
    onDeleteTurn: (trainDialog: CLM.TrainDialog, activity: Activity) => any
    onSetInitialEntities: ((initialFilledEntities: CLM.FilledEntity[]) => void) | null
    app: CLM.AppBase
    editingPackageId: string
    teach: CLM.Teach
    dialogMode: CLM.DialogMode
    // Is it new, from a TrainDialog or LogDialog
    editType: EditDialogType,
    // When editing and existing log or train dialog
    sourceTrainDialog: CLM.TrainDialog | null
    sourceLogDialog: CLM.LogDialog | null
    // When editing, the intial history before teach starts
    initialHistory: Activity[]
    lastAction: CLM.ActionBase | null
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(TeachModal))
