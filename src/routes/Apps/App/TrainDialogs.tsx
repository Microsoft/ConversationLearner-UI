/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as OF from 'office-ui-fabric-react';
import { State } from '../../../types'
import { AppBase, Teach, TrainDialog, TeachWithHistory, ActionBase, EntityBase, UITeachResponse, ReplayError, UIScoreInput } from '@conversationlearner/models'
import { TeachSessionModal, TrainDialogModal, SessionMemoryCheck } from '../../../components/modals'
import { fetchHistoryThunkAsync, fetchApplicationTrainingStatusThunkAsync } from '../../../actions/fetchActions'
import {
    createTeachSessionThunkAsync,
    createTeachSessionFromUndoThunkAsync,
    createTeachSessionFromHistoryThunkAsync
} from '../../../actions/createActions'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { deleteTrainDialogThunkAsync, deleteMemoryThunkAsync } from '../../../actions/deleteActions';
import { editTrainDialogThunkAsync } from '../../../actions/updateActions';
import { injectIntl, InjectedIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import { FM } from '../../../react-intl-messages'
import { setErrorDisplay } from '../../../actions/displayActions';
import { Activity } from 'botframework-directlinejs';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { getDefaultEntityMap } from '../../../util';
import ReplayErrorList from '../../../components/modals/ReplayErrorList';

interface IRenderableColumn extends OF.IColumn {
    render: (x: TrainDialog, component: TrainDialogs) => React.ReactNode
    getSortValue: (trainDialog: TrainDialog, component: TrainDialogs) => string
}

const returnStringWhenError = (s: string) => {
    return (f: Function) => {
        try {
            return f()
        }
        catch (err) {
            return s
        }
    }
}

const returnErrorStringWhenError = returnStringWhenError("ERR")

function textClassName(trainDialog: TrainDialog): string {
    if (trainDialog.invalid === true) {
        return `${OF.FontClassNames.mediumPlus} cl-font--highlight`;
    }
    return OF.FontClassNames.mediumPlus;
}

function getFirstInput(trainDialog: TrainDialog) : string {
    if (trainDialog.rounds && trainDialog.rounds.length > 0) {
        const text = trainDialog.rounds[0].extractorStep.textVariations[0].text
        return text;
    }
    return null;
}

function getLastInput(trainDialog: TrainDialog) : string {
    if (trainDialog.rounds && trainDialog.rounds.length > 0) {
        const text = trainDialog.rounds[trainDialog.rounds.length - 1].extractorStep.textVariations[0].text;
        return text
    }
    return null;
}

function getLastResponse(trainDialog: TrainDialog, component: TrainDialogs): string {
    // Find last action of last scorer step of last round
    // If found, return payload, otherwise return not found icon
    if (trainDialog.rounds && trainDialog.rounds.length > 0) {
        let scorerSteps = trainDialog.rounds[trainDialog.rounds.length - 1].scorerSteps;
        if (scorerSteps.length > 0) {
            let actionId = scorerSteps[scorerSteps.length - 1].labelAction;
            let action = component.props.actions.find(a => a.actionId == actionId);
            if (action) {
                return ActionBase.GetPayload(action, getDefaultEntityMap(component.props.entities))
            } 
        }
    }
    return null;
}

function getColumns(intl: InjectedIntl): IRenderableColumn[] {
    return [
        {
            key: 'firstInput',
            name: intl.formatMessage({
                id: FM.TRAINDIALOGS_FIRSTINPUT,
                defaultMessage: 'First Input'
            }),
            fieldName: 'firstInput',
            minWidth: 100,
            maxWidth: 500,
            isResizable: true,
            isSortedDescending: true,
            render: trainDialog => {
                let firstInput = getFirstInput(trainDialog);
                if (firstInput) {
                    return (<span className={textClassName(trainDialog)}>
                            {trainDialog.invalid === true && <Icon className="cl-icon" iconName="IncidentTriangle" />}
                            {firstInput}
                        </span>)
                }
                return <OF.Icon iconName="Remove" className="notFoundIcon" />
            },
            getSortValue: trainDialog => {
                let firstInput = getFirstInput(trainDialog)
                return firstInput ? firstInput.toLowerCase() : ''
            }
        },
        {
            key: 'lastInput',
            name: intl.formatMessage({
                id: FM.TRAINDIALOGS_LASTINPUT,
                defaultMessage: 'Last Input'
            }),
            fieldName: 'lastInput',
            minWidth: 100,
            maxWidth: 500,
            isResizable: true,
            render: trainDialog => {
                let lastInput = getLastInput(trainDialog)
                if (lastInput) {
                    return <span className={textClassName(trainDialog)}>{lastInput}</span>
                }
                return <OF.Icon iconName="Remove" className="notFoundIcon" />
            },
            getSortValue: trainDialog => {
                let lastInput = getLastInput(trainDialog)
                return lastInput ? lastInput.toLowerCase() : ''
            }
        },
        {
            key: 'lastResponse',
            name: intl.formatMessage({
                id: FM.TRAINDIALOGS_LASTRESPONSE,
                defaultMessage: 'Last Response'
            }),
            fieldName: 'lastResponse',
            minWidth: 100,
            maxWidth: 500,
            isResizable: true,
            render: (trainDialog, component) => {
                let lastResponse = getLastResponse(trainDialog, component);
                if (lastResponse) {
                    return <span className={textClassName(trainDialog)}>{lastResponse}</span>;
                }
                return <OF.Icon iconName="Remove" className="notFoundIcon" />;
            },
            getSortValue: (trainDialog, component) => {
                let lastResponse = getLastResponse(trainDialog, component)
                return lastResponse ? lastResponse.toLowerCase() : ''
            }
        },
        {
            key: 'turns',
            name: intl.formatMessage({
                id: FM.TRAINDIALOGS_TURNS,
                defaultMessage: 'Turns'
            }),
            fieldName: 'dialog',
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            render: trainDialog => {
                let count = trainDialog.rounds ? trainDialog.rounds.length : 0
                return <span className={textClassName(trainDialog)}>{count}</span>
            },
            getSortValue: trainDialog => (trainDialog.rounds ? trainDialog.rounds.length : 0).toString().padStart(4, '0')
        }
    ]
}

interface ComponentState {
    columns: OF.IColumn[],
    sortColumn: IRenderableColumn,
    teachSession: Teach,
    activities: Activity[]
    isTeachDialogModalOpen: boolean
    isTrainDialogModalOpen: boolean
    isSessionMemoryCheckOpen: boolean
    currentTrainDialog: TrainDialog
    searchValue: string,
    dialogKey: number,
    entityFilter: OF.IDropdownOption,
    actionFilter: OF.IDropdownOption
    isValidationWarningOpen: boolean
    validationErrors: ReplayError[],
    validationErrorTitleId: string | null,
    validationErrorMessageId: string | null
}

class TrainDialogs extends React.Component<Props, ComponentState> {
    newTeachSessionButton: OF.IButton
    state: ComponentState

    constructor(props: Props) {
        super(props)
        let columns = getColumns(this.props.intl);
        this.state = {
            columns: columns,
            sortColumn: columns[0],
            teachSession: null,
            activities: [],
            isTeachDialogModalOpen: false,
            isTrainDialogModalOpen: false,
            isSessionMemoryCheckOpen: false,
            currentTrainDialog: null,
            searchValue: '',
            dialogKey: 0,
            entityFilter: null,
            actionFilter: null,
            isValidationWarningOpen: false,
            validationErrors: [],
            validationErrorTitleId: null,
            validationErrorMessageId: null
        }
    }

    sortTrainDialogs(trainDialogs: TrainDialog[]): TrainDialog[] {

        // If column header selected sort the items
        if (this.state.sortColumn) {
            trainDialogs
                .sort((a, b) => {
                    const firstValue = this.state.sortColumn.getSortValue(a, this)
                    const secondValue = this.state.sortColumn.getSortValue(b, this)
                    const compareValue = firstValue.localeCompare(secondValue)
                    return this.state.sortColumn.isSortedDescending
                        ? compareValue
                        : compareValue * -1
                })
        }

        return trainDialogs;
    }

    @autobind
    onClickColumnHeader(event: any, clickedColumn: IRenderableColumn) {
        let { columns } = this.state;
        let isSortedDescending = !clickedColumn.isSortedDescending;

        // Reset the items and columns to match the state.
        this.setState({
            columns: columns.map(column => {
                column.isSorted = (column.key === clickedColumn.key);
                column.isSortedDescending = isSortedDescending;
                return column;
            }),
            sortColumn: clickedColumn
        });
    }

    toActionFilter(action: ActionBase, entities: EntityBase[]) : OF.IDropdownOption {
        return { 
            key: action.actionId,
            text: ActionBase.GetPayload(action, getDefaultEntityMap(entities))
        }
    }
     
    toEntityFilter(entity: EntityBase) : OF.IDropdownOption {
        return { 
            key: entity.entityId,
            text: entity.entityName,
            data: entity.negativeId
        }
    }

    componentDidMount() {
        this.newTeachSessionButton.focus();
        if (this.props.filteredAction) {
            this.setState({
                actionFilter: this.toActionFilter(this.props.filteredAction, this.props.entities)
            })
        }
        if (this.props.filteredEntity) {
            this.setState({
                entityFilter: this.toEntityFilter(this.props.filteredEntity)
            })
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.filteredAction && this.props.filteredAction !== newProps.filteredAction) {
            this.setState({
                actionFilter: this.toActionFilter(newProps.filteredAction, newProps.entities)
            })
        }
        if (newProps.filteredEntity && this.props.filteredEntity !== newProps.filteredEntity) {
            this.setState({
                entityFilter: this.toEntityFilter(newProps.filteredEntity)
            })
        }
        // If train dialogs have been updated, update selected trainDialog too
        if (this.props.trainDialogs !== newProps.trainDialogs) {
            if (this.state.currentTrainDialog) {
                let newTrainDialog = newProps.trainDialogs.find(t => t.trainDialogId === this.state.currentTrainDialog.trainDialogId);
                this.setState({
                    currentTrainDialog: newTrainDialog
                })
            }
            this.newTeachSessionButton.focus();
        }
    }

    @autobind
    onSelectEntityFilter(item: OF.IDropdownOption) {
        this.setState({
            entityFilter: item
        })
    }

    @autobind
    onSelectActionFilter(item: OF.IDropdownOption) {
        this.setState({
            actionFilter: item
        })
    }

    onClickNewTeachSession() {
        // TODO: Find cleaner solution for the types.  Thunks return functions but when using them on props they should be returning result of the promise.
        ((this.props.createTeachSessionThunkAsync(this.props.app.appId) as any) as Promise<UITeachResponse>)
            .then(uiTeachResponse => {
                this.setState({
                    teachSession: uiTeachResponse.teachResponse as Teach,
                    isTeachDialogModalOpen: true,
                    isSessionMemoryCheckOpen: uiTeachResponse.memories.length > 0
                })
            })
            .catch(error => {
                console.warn(`Error when attempting to create teach session: `, error)
            })
    }

    onCloseTeachSession() {
        this.setState({
            teachSession: null,
            isTeachDialogModalOpen: false,
            activities: null,
            currentTrainDialog: null,
            dialogKey: this.state.dialogKey + 1
        })
    }

    onUndoTeachStep(popRound: boolean) {
        ((this.props.createTeachSessionFromUndoThunkAsync(this.props.app.appId, this.state.teachSession, popRound, this.props.user.name, this.props.user.id) as any) as Promise<TeachWithHistory>)
            .then(teachWithHistory => {
                if (teachWithHistory.replayErrors.length === 0) {
                    this.setState({
                        teachSession: teachWithHistory.teach,
                        activities: teachWithHistory.history,
                    })
                }
                else {
                    this.setState({
                        validationErrors: teachWithHistory.replayErrors,
                        isValidationWarningOpen: true,
                        validationErrorTitleId: FM.REPLAYERROR_UNDO_TITLE,
                        validationErrorMessageId: FM.REPLAYERROR_FAILMESSAGE
                    })
                }
            })
            .catch(error => {
                console.warn(`Error when attempting to create teach session from undo: `, error)
            })
    }

    onDeleteTrainDialog() {

        this.props.deleteTrainDialogThunkAsync(this.props.user.id, this.props.app, this.state.currentTrainDialog.trainDialogId)
        this.props.fetchApplicationTrainingStatusThunkAsync(this.props.app.appId)
        this.onCloseTrainDialogModal();
    }

    onBranchTrainDialog(turnIndex: number) {

        let trainDialog = this.props.trainDialogs.find(td => td.trainDialogId === this.state.currentTrainDialog.trainDialogId);

        // Create new train dialog, removing turns above the branch
        let newTrainDialog: TrainDialog = {
            trainDialogId: undefined,
            sourceLogDialogId: trainDialog.sourceLogDialogId,
            version: undefined,
            packageCreationId: undefined,
            packageDeletionId: undefined,
            rounds: trainDialog.rounds.slice(0, turnIndex),
            definitions: {
                entities: this.props.entities,
                actions: this.props.actions,
                trainDialogs: []
            }
        };

        ((this.props.createTeachSessionFromHistoryThunkAsync(this.props.app, newTrainDialog, this.props.user.name, this.props.user.id) as any) as Promise<TeachWithHistory>)
            .then(teachWithHistory => {
                if (teachWithHistory.replayErrors.length === 0) {
                    this.setState({
                        teachSession: teachWithHistory.teach,
                        activities: teachWithHistory.history,
                        currentTrainDialog: null,
                        isTrainDialogModalOpen: false,
                        isTeachDialogModalOpen: true
                    })
                }
                else {
                    this.setState({
                        validationErrors: teachWithHistory.replayErrors,
                        isValidationWarningOpen: true,
                        validationErrorTitleId: FM.REPLAYERROR_BRANCH_TITLE,
                        validationErrorMessageId: FM.REPLAYERROR_FAILMESSAGE
                    })
                }
            })
            .catch(error => {
                console.warn(`Error when attempting to create teach session from branch: `, error)
            })
    }

    onEditTrainDialog(newTrainDialog: TrainDialog, newScoreInput: UIScoreInput) {

        ((this.props.createTeachSessionFromHistoryThunkAsync(this.props.app, newTrainDialog, this.props.user.name, this.props.user.id, newScoreInput) as any) as Promise<TeachWithHistory>)
            .then(teachWithHistory => {
                if (teachWithHistory.replayErrors.length === 0) {
                    // Note: Don't clear currentTrainDialog so I can delete it if I save my edits
                    this.setState({
                        teachSession: teachWithHistory.teach,
                        activities: teachWithHistory.history,
                        isTrainDialogModalOpen: false,
                        isTeachDialogModalOpen: true
                    })
                }
                else {
                    this.setState({
                        validationErrors: teachWithHistory.replayErrors,
                        isValidationWarningOpen: true,
                        validationErrorTitleId: FM.REPLAYERROR_EDIT_TITLE,
                        validationErrorMessageId: FM.REPLAYERROR_FAILMESSAGE
                    })
                }
            })
            .catch(error => {
                console.warn(`Error when attempting to create teach session from train dialog: `, error)
            })
    }

    // Replace the current trainDialog with a new one
    // Should only be used when replay not required (i.e. changing text variations)
    onReplaceTrainDialog(newTrainDialog: TrainDialog) {

        ((this.props.editTrainDialogThunkAsync(this.props.app.appId, newTrainDialog) as any) as Promise<TeachWithHistory>)
            .catch(error => {
                console.warn(`Error when attempting to edit a train dialog: `, error)
            })
    }

    onClickTrainDialogItem(trainDialog: TrainDialog) {
        let trainDialogWithDefinitions: TrainDialog = {
            trainDialogId: undefined,
            sourceLogDialogId: trainDialog.sourceLogDialogId,
            version: undefined,
            packageCreationId: undefined,
            packageDeletionId: undefined,
            rounds: trainDialog.rounds,
            definitions: {
                actions: this.props.actions,
                entities: this.props.entities,
                trainDialogs: []
            },
        };

        ((this.props.fetchHistoryThunkAsync(this.props.app.appId, trainDialogWithDefinitions, this.props.user.name, this.props.user.id) as any) as Promise<TeachWithHistory>)
            .then(teachWithHistory => {
                this.setState({
                    activities: teachWithHistory.history,
                    currentTrainDialog: trainDialog,
                    isTrainDialogModalOpen: true
                })
            })
            .catch(error => {
                console.warn(`Error when attempting to create history: `, error)
            })
    }

    onCloseTrainDialogModal() {
        this.setState({
            isTrainDialogModalOpen: false,
            currentTrainDialog: null,
            activities: null,
            dialogKey: this.state.dialogKey + 1
        })
    }

    onCloseSessionMemoryCheck(saveMemory: boolean) {

        if (saveMemory) {
            this.setState({
                isSessionMemoryCheckOpen: false
            })
        } else {
            ((this.props.deleteMemoryThunkAsync(this.props.user.id, this.props.app.appId) as any) as Promise<void>)
            .then(() => {
                this.setState({
                    isSessionMemoryCheckOpen: false
                })
            })
            .catch(error => {
                console.warn(`Error when attempting to clear memory: `, error)
            })
        }
    }

    onChangeSearchString(newValue: string) {
        let lcString = newValue.toLowerCase();
        this.setState({
            searchValue: lcString
        })
    }

    @autobind
    onCloseValidationWarning() {
        this.setState({
            isValidationWarningOpen: false
        })
    }

    renderTrainDialogItems(): TrainDialog[] {
        let filteredTrainDialogs : TrainDialog[] = null;

        if (!this.state.searchValue && ! this.state.entityFilter && !this.state.actionFilter) {
            filteredTrainDialogs = this.props.trainDialogs;
        } else {
            // TODO: Consider caching as not very efficient
            filteredTrainDialogs = this.props.trainDialogs.filter((t: TrainDialog) => {
                let entitiesInTD = [];
                let actionsInTD = [];
                let variationText = [];

                for (let round of t.rounds) {
                    for (let variation of round.extractorStep.textVariations) {
                        variationText.push(variation.text);
                        for (let le of variation.labelEntities) {
                            // Include pos and neg examples of entity if reversable
                            let entity = this.props.entities.find(e => e.entityId === le.entityId);
                            entitiesInTD.push(entity);
                            if (entity.negativeId) {
                                entitiesInTD.push(this.props.entities.find(e => e.entityId === entity.negativeId));
                            }
                        }
                    }
                    for (let ss of round.scorerSteps) {
                        let foundAction = this.props.actions.find(a => a.actionId === ss.labelAction);
                        // Invalid train dialogs can contain delted actions
                        if (foundAction) {
                            actionsInTD.push(foundAction);
                        }
                        // Need to check filledEntities for programmatic only entities
                        for (let filledEntity of ss.input.filledEntities) {
                            entitiesInTD.push(this.props.entities.find(e => e.entityId === filledEntity.entityId));
                        }
                    }
                }

                // Filter out train dialogs that don't match filters (data = negativeId for multivalue)
                if (this.state.entityFilter && this.state.entityFilter.key
                        && !entitiesInTD.find(en => en.entityId === this.state.entityFilter.key)
                        && !entitiesInTD.find(en => en.entityId === this.state.entityFilter.data)) {
                    return false;
                }
                if (this.state.actionFilter && this.state.actionFilter.key
                    && !actionsInTD.find(a => a.actionId === this.state.actionFilter.key)) {
                return false;
            }

                let entityNames = entitiesInTD.map(e => e.entityName);
                let actionPayloads = actionsInTD.map(a => ActionBase.GetPayload(a, getDefaultEntityMap(this.props.entities)));

                // Then check search terms
                let searchString = variationText.concat(actionPayloads).concat(entityNames).join(' ').toLowerCase();
                return searchString.indexOf(this.state.searchValue) > -1;
            })
        }
        // Sort to put invalid ones at the top
        filteredTrainDialogs
        .sort((a, b) => {
            return (a.invalid === true) ? -1 : 1;
        })

        filteredTrainDialogs = this.sortTrainDialogs(filteredTrainDialogs);
        return filteredTrainDialogs;
    }

    render() {
        const { intl } = this.props
        let trainDialogItems = this.renderTrainDialogItems()
        let currentTrainDialog = this.state.currentTrainDialog
        return (
            <div className="cl-page">
                <div className={`cl-dialog-title cl-dialog-title--train ${OF.FontClassNames.xxLarge}`}>
                    <OF.Icon iconName="EditContact" />
                    <FormattedMessage
                        id={FM.TRAINDIALOGS_TITLE}
                        defaultMessage="Train Dialogs"
                    />
                </div>
                {this.props.editingPackageId === this.props.app.devPackageId ?
                    <span className={OF.FontClassNames.mediumPlus}>
                        <FormattedMessage
                            id={FM.TRAINDIALOGS_SUBTITLE}
                            defaultMessage="Train Dialogs are example conversations you want your Bot to imitate"
                        />
                    </span>
                    :
                    <span className="cl-errorpanel">Editing is only allowed in Master Tag</span>
                }
                <div>
                    <OF.PrimaryButton
                        disabled={this.props.editingPackageId !== this.props.app.devPackageId || this.props.invalidBot}
                        onClick={() => this.onClickNewTeachSession()}
                        ariaDescription={intl.formatMessage({
                            id: FM.TRAINDIALOGS_CREATEBUTTONARIALDESCRIPTION,
                            defaultMessage: 'Create a New Train Dialog'
                        })}
                        text={intl.formatMessage({
                            id: FM.TRAINDIALOGS_CREATEBUTTONTITLE,
                            defaultMessage: 'New Train Dialog'
                        })}
                        componentRef={component => this.newTeachSessionButton = component}
                    />
                    <ReplayErrorList  
                        open={this.state.isValidationWarningOpen}
                        onClose={this.onCloseValidationWarning}
                        textItems={this.state.validationErrors}
                        formattedTitleId={this.state.validationErrorTitleId}
                        formattedMessageId={this.state.validationErrorMessageId}
                    />
                    <TeachSessionModal
                        app={this.props.app}
                        editingPackageId={this.props.editingPackageId}
                        teachSession={this.props.teachSessions.current}
                        dialogMode={this.props.teachSessions.mode}
                        open={this.state.isTeachDialogModalOpen && !this.state.isSessionMemoryCheckOpen}
                        onClose={() => this.onCloseTeachSession()}
                        onUndo={(popRound) => this.onUndoTeachStep(popRound)}
                        history={this.state.isTeachDialogModalOpen ? this.state.activities : null}
                        sourceTrainDialog={this.state.currentTrainDialog}
                    />
                </div>
                <div>
                    <OF.Label htmlFor="search" className={OF.FontClassNames.medium}>
                        Search:
                    </OF.Label>
                    <OF.SearchBox
                        id="search"
                        className={OF.FontClassNames.medium}
                        onChange={(newValue) => this.onChangeSearchString(newValue)}
                        onSearch={(newValue) => this.onChangeSearchString(newValue)}
                    />
                </div>
                <div className="cl-list-filters">
                    <OF.Dropdown
                        label="Entity:"
                        selectedKey={(this.state.entityFilter ? this.state.entityFilter.key : undefined)}
                        onChanged={this.onSelectEntityFilter}
                        placeHolder="Filter by Entity"
                        options={this.props.entities
                            // Only show positive versions of negatable entities
                            .filter(e => e.positiveId == null)
                            .map(e => this.toEntityFilter(e))
                            .concat({key: null, text: '---', data: null})
                        }
                    /> 
        
                    <OF.Dropdown
                        label="Action:"
                        selectedKey={(this.state.actionFilter ? this.state.actionFilter.key : undefined)}
                        onChanged={this.onSelectActionFilter}
                        placeHolder="Filter by Action"
                        options={this.props.actions
                            .map(a => this.toActionFilter(a, this.props.entities))
                            .concat({key: null, text: '---'})
                        }
                    />
                </div>
                <OF.DetailsList
                    key={this.state.dialogKey}
                    className={OF.FontClassNames.mediumPlus}
                    items={trainDialogItems}
                    columns={this.state.columns}
                    checkboxVisibility={OF.CheckboxVisibility.hidden}
                    onColumnHeaderClick={this.onClickColumnHeader}
                    onRenderItemColumn={(trainDialog, i, column: IRenderableColumn) => returnErrorStringWhenError(() => column.render(trainDialog, this))}
                    onActiveItemChanged={trainDialog => this.onClickTrainDialogItem(trainDialog)}
                />
                <TrainDialogModal
                    app={this.props.app}
                    editingPackageId={this.props.editingPackageId}
                    canEdit={this.props.editingPackageId === this.props.app.devPackageId && !this.props.invalidBot}
                    open={this.state.isTrainDialogModalOpen}
                    onClose={() => this.onCloseTrainDialogModal()}
                    onBranch={(turnIndex: number) => this.onBranchTrainDialog(turnIndex)}
                    onDelete={() => this.onDeleteTrainDialog()}
                    onEdit={(editedTrainDialog: TrainDialog, newScoreInput: UIScoreInput) => this.onEditTrainDialog(editedTrainDialog, newScoreInput)}
                    onReplace={(editedTrainDialog: TrainDialog) => this.onReplaceTrainDialog(editedTrainDialog)}
                    trainDialog={currentTrainDialog}
                    history={this.state.isTrainDialogModalOpen ? this.state.activities : null}
                />
                <SessionMemoryCheck
                    open={this.state.isSessionMemoryCheckOpen}
                    onClose={(saveMemory: boolean) => this.onCloseSessionMemoryCheck(saveMemory)}
                    memories={this.props.teachSessions.memories}
                />
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        createTeachSessionThunkAsync,
        fetchHistoryThunkAsync,
        fetchApplicationTrainingStatusThunkAsync,
        deleteTrainDialogThunkAsync,
        deleteMemoryThunkAsync,
        createTeachSessionFromUndoThunkAsync,
        createTeachSessionFromHistoryThunkAsync,
        editTrainDialogThunkAsync,
        setErrorDisplay
    }, dispatch)
}
const mapStateToProps = (state: State) => {
    return {
        user: state.user,
        actions: state.actions,
        entities: state.entities,
        trainDialogs: state.trainDialogs,
        teachSessions: state.teachSessions
    }
}

export interface ReceivedProps {
    app: AppBase,
    invalidBot: boolean,
    editingPackageId: string,
    filteredAction?: ActionBase,
    filteredEntity?: EntityBase
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps;

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(TrainDialogs))