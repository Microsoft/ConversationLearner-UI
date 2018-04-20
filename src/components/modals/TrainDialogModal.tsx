/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PrimaryButton, DefaultButton, Callout } from 'office-ui-fabric-react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { State } from '../../types';
import Webchat from '../Webchat'
import TrainDialogAdmin from './TrainDialogAdmin'
import { AppBase, TrainDialog, CL_USER_NAME_ID } from 'conversationlearner-models'
import { Activity } from 'botframework-directlinejs';
import ConfirmCancelModal from './ConfirmCancelModal'
import { FM } from '../../react-intl-messages'
import { injectIntl, InjectedIntlProps } from 'react-intl'

interface ComponentState {
    isConfirmCancelModalOpen: boolean,
    calloutOpen: boolean,
    selectedActivity: Activity | null,
    webchatKey: number,
    currentTrainDialog: TrainDialog,
    pendingExtractionChanges: boolean
}

const initialState: ComponentState = {
    isConfirmCancelModalOpen: false,
    calloutOpen: false,
    selectedActivity: null,
    webchatKey: 0,
    currentTrainDialog: null,
    pendingExtractionChanges: false
}

class TrainDialogModal extends React.Component<Props, ComponentState> {
    state = initialState
    private _refBranchButton: HTMLElement | null;

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.open === false && nextProps.open === true) {
            this.setState(initialState);
        }
        if (this.state.currentTrainDialog !== nextProps.trainDialog) {
            // Force webchat to re-mount as history prop can't be updated
            this.setState({
                currentTrainDialog: nextProps.trainDialog,
                webchatKey: this.state.webchatKey + 1
            });
        }
    }

    onClickBranch() {
        if (this.state.selectedActivity) {
            let branchRound = this.state.selectedActivity.channelData.roundIndex;
            // If bot response branch one later
            if (this.state.selectedActivity.from.id === CL_USER_NAME_ID) {
                branchRound++;
            }
            if (branchRound > 0) {
                this.props.onBranch(branchRound);
            }
        }
        else {
            this.setState({
                calloutOpen: true
              });
        }
    }

    onClickDone() {
        this.props.onClose()
    }

    onClickDelete() {
        this.setState({
            isConfirmCancelModalOpen: true
        })
    }

    onClickCancelDelete = () => {
        this.setState({
            isConfirmCancelModalOpen: false
        })
    }

    onClickConfirmDelete = () => {
        this.props.onDelete();
        this.setState(
            { isConfirmCancelModalOpen: false }
        );
    }

    onWebChatSelectActivity(activity: Activity) {
        this.setState({
            selectedActivity: activity
        })
    }

    onCalloutDismiss() {
        this.setState({
          calloutOpen: false
        });
      }

    onExtractionsChanged(changed: boolean) {
        // Put mask on webchat if changing extractions
        this.setState({
            pendingExtractionChanges: changed
        })
    }

    render() {
        const { intl } = this.props
        let chatDisable = this.state.pendingExtractionChanges ? <div className="cl-overlay"/> : null;

        return (
            <Modal
                isOpen={this.props.open}
                isBlocking={true}
                containerClassName="cl-modal cl-modal--large cl-modal--teach"
            >
                <div className="cl-modal_body">  
                    <div className="cl-chatmodal">
                        <div className="cl-chatmodal_webchat">
                            <Webchat
                                key={this.state.webchatKey}
                                app={this.props.app}
                                history={this.props.history}
                                onPostActivity={null}
                                onSelectActivity={activity => this.onWebChatSelectActivity(activity)}
                                hideInput={true}
                                focusInput={false}
                            />
                            {chatDisable}
                        </div>
                        <div className="cl-chatmodal_controls"> 
                            <div className="cl-chatmodal_admin-controls">
                                <TrainDialogAdmin
                                    app={this.props.app}
                                    editingPackageId={this.props.editingPackageId}
                                    canEdit={this.props.canEdit}
                                    trainDialog={this.props.trainDialog}
                                    selectedActivity={this.state.selectedActivity}
                                    onEdit={(sourceTrainDialogId: string, editedTrainDialog: TrainDialog, lastExtractChanged: boolean) => this.props.onEdit(editedTrainDialog, lastExtractChanged)}
                                    onReplace={(editedTrainDialog: TrainDialog) => this.props.onReplace(editedTrainDialog)}
                                    onExtractionsChanged={(changed: boolean) => this.onExtractionsChanged(changed)}
                                />
                            </div>
                            {!this.props.canEdit && <div className="cl-overlay"/>} 
                        </div>
                    </div>
                </div>
                <div className="cl-modal_footer cl-modal_footer--border">
                    <div className="cl-modal-buttons">
                        <div className="cl-modal-buttons_primary" />
                        <div className="cl-modal-buttons_secondary">
                            <div  ref={ (menuButton) => this._refBranchButton = menuButton}>
                                <DefaultButton
                                        disabled={this.state.pendingExtractionChanges || !this.props.canEdit || 
                                            (this.props.trainDialog && this.props.trainDialog.invalid === true)}
                                        onClick={() => this.onClickBranch()}
                                        ariaDescription={intl.formatMessage({
                                            id: FM.TRAINDIALOGMODAL_BRANCH_ARIADESCRIPTION,
                                            defaultMessage: 'Branch'
                                        })}
                                        text={intl.formatMessage({
                                            id: FM.TRAINDIALOGMODAL_BRANCH_TEXT,
                                            defaultMessage: 'Branch'
                                        })}
                                />
                            </div>
                            <DefaultButton
                                disabled={this.state.pendingExtractionChanges || !this.props.canEdit}
                                onClick={() => this.onClickDelete()}
                                ariaDescription={intl.formatMessage({
                                    id: FM.TRAINDIALOGMODAL_DEFAULTBUTTON_ARIADESCRIPTION,
                                    defaultMessage: 'Delete'
                                })}
                                text={intl.formatMessage({
                                    id: FM.TRAINDIALOGMODAL_DEFAULTBUTTON_TEXT,
                                    defaultMessage: 'Delete'
                                })}
                            />
                            <PrimaryButton
                                disabled={this.state.pendingExtractionChanges}
                                onClick={() => this.onClickDone()}
                                ariaDescription={intl.formatMessage({
                                    id: FM.TRAINDIALOGMODAL_PRIMARYBUTTON_ARIADESCRIPTION,
                                    defaultMessage: 'Done'
                                })}
                                text={intl.formatMessage({
                                    id: FM.TRAINDIALOGMODAL_PRIMARYBUTTON_TEXT,
                                    defaultMessage: 'Done'
                                })}
                            />
                        </div>
                    </div>
                </div>
                <ConfirmCancelModal
                    open={this.state.isConfirmCancelModalOpen}
                    onCancel={() => this.onClickCancelDelete()}
                    onConfirm={() => this.onClickConfirmDelete()}
                    title={intl.formatMessage({
                        id: FM.TRAINDIALOGMODAL_CONFIRMDELETE_TITLE,
                        defaultMessage: `Are you sure you want to delete this Training Dialog?`
                    })}
                />
                { this.state.calloutOpen && (
                    <Callout
                        role={ 'alertdialog' }
                        gapSpace={ 0 }
                        target={ this._refBranchButton }
                        onDismiss={ () => this.onCalloutDismiss() }
                        setInitialFocus={ true }
                    >
                        <div>
                        <p className='cl-callout'>
                            {intl.formatMessage({
                                id: FM.TRAINDIALOGMODAL_BRANCH_TIP,
                                defaultMessage: `Select a round first`
                            })}
                        </p>
                        </div>
                    </Callout>
        ) }
            </Modal>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
    }, dispatch);
}
const mapStateToProps = (state: State) => {
    return {
        user: state.user,
        actions: state.actions
    }
}

export interface ReceivedProps {
    app: AppBase,
    editingPackageId: string,
    canEdit: boolean,
    onClose: () => void,
    onBranch: (turnIndex: number) => void,
    onEdit: (newTrainDialog: TrainDialog, lastExtractChanged: boolean) => void,
    onReplace: (newTrainDialog: TrainDialog) => void,
    onDelete: () => void
    open: boolean
    trainDialog: TrainDialog
    history: Activity[]
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(TrainDialogModal))
