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
import * as CLM from '@conversationlearner/models'
import { TeachSessionModal, EditDialogModal, EditDialogType, EditState } from '../../../components/modals'
import actions from '../../../actions'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import { injectIntl, InjectedIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import { FM } from '../../../react-intl-messages'
import { Activity } from 'botframework-directlinejs';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { getDefaultEntityMap, notNullOrUndefined } from '../../../util';
import ReplayErrorList from '../../../components/modals/ReplayErrorList';
import * as moment from 'moment'

interface IRenderableColumn extends OF.IColumn {
    render: (x: CLM.TrainDialog, component: TrainDialogs) => React.ReactNode
    getSortValue: (trainDialog: CLM.TrainDialog, component: TrainDialogs) => string
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

function textClassName(trainDialog: CLM.TrainDialog): string {
    if (trainDialog.invalid === true) {
        return `${OF.FontClassNames.mediumPlus} cl-font--highlight`;
    }
    return OF.FontClassNames.mediumPlus!;
}

function getFirstInput(trainDialog: CLM.TrainDialog): string | void {
    if (trainDialog.rounds && trainDialog.rounds.length > 0) {
        return trainDialog.rounds[0].extractorStep.textVariations[0].text
    }
}

function getLastInput(trainDialog: CLM.TrainDialog): string | void {
    if (trainDialog.rounds && trainDialog.rounds.length > 0) {
        return trainDialog.rounds[trainDialog.rounds.length - 1].extractorStep.textVariations[0].text;
    }
}

function getLastResponse(trainDialog: CLM.TrainDialog, component: TrainDialogs): string | void {
    // Find last action of last scorer step of last round
    // If found, return payload, otherwise return not found icon
    if (trainDialog.rounds && trainDialog.rounds.length > 0) {
        let scorerSteps = trainDialog.rounds[trainDialog.rounds.length - 1].scorerSteps;
        if (scorerSteps.length > 0) {
            let actionId = scorerSteps[scorerSteps.length - 1].labelAction;
            let action = component.props.actions.find(a => a.actionId === actionId);
            if (action) {
                return CLM.ActionBase.GetPayload(action, getDefaultEntityMap(component.props.entities))
            }
        }
    }
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
            isResizable: false,
            render: trainDialog => {
                let count = trainDialog.rounds ? trainDialog.rounds.length : 0
                return <span className={textClassName(trainDialog)}>{count}</span>
            },
            getSortValue: trainDialog => (trainDialog.rounds ? trainDialog.rounds.length : 0).toString().padStart(4, '0')
        },
        {
            key: 'lastModifiedDateTime',
            name: intl.formatMessage({
                id: FM.TRAINDIALOGS_LAST_MODIFIED_DATE_TIME,
                defaultMessage: 'Last Modified'
            }),
            fieldName: 'lastModifiedDateTime',
            minWidth: 100,
            isResizable: false,
            render: trainDialog => <span className={OF.FontClassNames.mediumPlus}>{moment(trainDialog.lastModifiedDateTime).format('L')}</span>,
            getSortValue: trainDialog => moment(trainDialog.lastModifiedDateTime).valueOf().toString()
        },
        {
            key: 'created',
            name: intl.formatMessage({
                id: FM.TRAINDIALOGS_CREATED_DATE_TIME,
                defaultMessage: 'Created'
            }),
            fieldName: 'created',
            minWidth: 100,
            isResizable: false,
            render: trainDialog => <span className={OF.FontClassNames.mediumPlus}>{moment(trainDialog.createdDateTime).format('L')}</span>,
            getSortValue: trainDialog => moment(trainDialog.createdDateTime).valueOf().toString()
        }
    ]
}

interface ComponentState {
    columns: OF.IColumn[]
    sortColumn: IRenderableColumn
    teachSession: CLM.Teach | undefined
    history: Activity[]
    lastAction: CLM.ActionBase | null
    isTeachDialogModalOpen: boolean
    isEditDialogModalOpen: boolean
    // Item selected in webchat window
    selectedHistoryIndex: number | null
    // Current train dialogs being edited
    currentTrainDialog: CLM.TrainDialog | null
    // If Train Dialog was edited, the original one
    originalTrainDialogId: string | null,
    // Is Dialog being edited a new one, a TrainDialog or a LogDialog
    editType: EditDialogType
    searchValue: string,
    dialogKey: number,
    entityFilter: OF.IDropdownOption | null
    actionFilter: OF.IDropdownOption | null
    isValidationWarningOpen: boolean
    validationErrors: CLM.ReplayError[]
    validationErrorTitleId: string | null
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
            teachSession: undefined,
            history: [],
            lastAction: null,
            isTeachDialogModalOpen: false,
            isEditDialogModalOpen: false,
            selectedHistoryIndex: null,
            currentTrainDialog: null,
            originalTrainDialogId: null,
            editType: EditDialogType.TRAIN_ORIGINAL,
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

    sortTrainDialogs(trainDialogs: CLM.TrainDialog[]): CLM.TrainDialog[] {
        // If column header selected sort the items, always putting invalid at the top
        if (this.state.sortColumn) {
            trainDialogs
                .sort((a, b) => {

                    // Always put invalid at top (values can also be undefined)
                    if (a.invalid === true && b.invalid !== true) {
                        return -1;
                    }
                    if (b.invalid === true && a.invalid !== true) {
                        return 1;
                    }

                    // Then sort by column value
                    let firstValue = this.state.sortColumn.getSortValue(a, this)
                    let secondValue = this.state.sortColumn.getSortValue(b, this)
                    let compareValue = firstValue.localeCompare(secondValue)

                    // If primary sort is the same do secondary sort on another column, to prevent sort jumping around
                    if (compareValue === 0) {
                        let sortColumn2 = ((this.state.sortColumn !== this.state.columns[0]) ? this.state.columns[0] : this.state.columns[1]) as IRenderableColumn
                        firstValue = sortColumn2.getSortValue(a, this)
                        secondValue = sortColumn2.getSortValue(b, this)
                        compareValue = firstValue.localeCompare(secondValue)
                    }

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

    toActionFilter(action: CLM.ActionBase, entities: CLM.EntityBase[]): OF.IDropdownOption {
        return {
            key: action.actionId,
            text: CLM.ActionBase.GetPayload(action, getDefaultEntityMap(entities))
        }
    }

    toEntityFilter(entity: CLM.EntityBase): OF.IDropdownOption {
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
            const trainDialog = this.state.currentTrainDialog
            if (trainDialog) {
                let existingTrainDialog = newProps.trainDialogs.find(t => t.trainDialogId === trainDialog.trainDialogId);
                // If it exists update (may not if is new one being edited)
                if (existingTrainDialog) {
                    this.setState({
                        currentTrainDialog: existingTrainDialog,
                        originalTrainDialogId: existingTrainDialog.trainDialogId
                    })
                }
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

    @autobind
    async onSetInitialEntities(initialFilledEntities: CLM.FilledEntity[]) {

        if (this.state.teachSession) {
            // Delete existing teach session
            await this.props.deleteTeachSessionThunkAsync(this.props.user.id, this.state.teachSession, this.props.app, this.props.editingPackageId, false, null, null); // False = abandon
                
            // Create new one with initial entities
            await this.onClickNewTeachSession(initialFilledEntities)
        }
    }

    onClickNewTeachSession(initialFilledEntities: CLM.FilledEntity[] = []) {
        // TODO: Find cleaner solution for the types.  Thunks return functions but when using them on props they should be returning result of the promise.
        ((this.props.createTeachSessionThunkAsync(this.props.app.appId, initialFilledEntities) as any) as Promise<CLM.TeachResponse>)
            .then(teachResponse => {
                this.setState({
                    teachSession: teachResponse as CLM.Teach,
                    isTeachDialogModalOpen: true,
                    editType: EditDialogType.NEW
                })
            })
            .catch(error => {
                console.warn(`Error when attempting to create teach session: `, error)
            })
    }

    onCloseTeachSession() {
        this.setState({
            teachSession: undefined,
            isTeachDialogModalOpen: false,
            history: [],
            lastAction: null,
            currentTrainDialog: null,
            // originalTrainDialogId - do not clear. Need for later 
            dialogKey: this.state.dialogKey + 1
        })
    }
    
    // User has clicked on Activity in a Teach Session
    async onEditTeach(historyIndex: number) {

        try {
            if (this.state.teachSession) {
                // Get train dialog associated with the teach session
                let trainDialog = await ((this.props.fetchTrainDialogThunkAsync(this.props.app.appId, this.state.teachSession.trainDialogId, false) as any) as Promise<CLM.TrainDialog>)
                trainDialog.definitions = {
                    entities: this.props.entities,
                    actions: this.props.actions,
                    trainDialogs: []
                }

                // Delete the teach session w/o saving
                await this.props.deleteTeachSessionThunkAsync(this.props.user.id, this.state.teachSession, this.props.app, this.props.editingPackageId, false, null, null)

                // Generate history
                let teachWithHistory = await ((this.props.fetchHistoryThunkAsync(this.props.app.appId, trainDialog, this.props.user.name, this.props.user.id) as any) as Promise<CLM.TeachWithHistory>)
                const originalId = this.state.currentTrainDialog ? this.state.currentTrainDialog.trainDialogId : null
                if (teachWithHistory) {
                    this.setState({
                        history: teachWithHistory.history,
                        lastAction: teachWithHistory.lastAction,
                        currentTrainDialog: trainDialog,
                        originalTrainDialogId: originalId,
                        isEditDialogModalOpen: true,
                        selectedHistoryIndex: historyIndex,
                        isTeachDialogModalOpen: false
                    })
                }
            }
        }
        catch(error) {
            console.warn(`Error when attempting to edit Teach session`, error)
        }
    }

    onDeleteTrainDialog() {
        if (!this.state.currentTrainDialog) {
            throw new Error(`You attempted to delete a train dialog, but currentTrainDialog is not defined. Please open an issue.`)
        }

        this.props.deleteTrainDialogThunkAsync(this.props.user.id, this.props.app, this.state.currentTrainDialog.trainDialogId)
        this.props.fetchApplicationTrainingStatusThunkAsync(this.props.app.appId)
        this.onCloseEditDialogModal();
    }

    onBranchTrainDialog(turnIndex: number) {
        if (!this.state.currentTrainDialog) {
            throw new Error(`You attempted to branch from a turn in train dialog, but currentTrainDialog is not defined. Please open an issue.`)
        }

        // TODO: Why do we need to re-find the trainDialog, if we already have it as currentTrainDialog?
        const trainDialog = this.props.trainDialogs.find(td => td.trainDialogId === this.state.currentTrainDialog!.trainDialogId)
        if (!trainDialog) {
            throw new Error(`You attempted to branch from a turn in train dialog, but that train dialog could not be found in list of train dialogs. Please open an issue.`)
        }

        // Create new train dialog, removing turns above the branch
        const newTrainDialog: CLM.TrainDialog = {
            createdDateTime: new Date().toJSON(),
            lastModifiedDateTime: new Date().toJSON(),
            trainDialogId: undefined!,
            sourceLogDialogId: trainDialog.sourceLogDialogId,
            version: undefined!,
            packageCreationId: undefined!,
            packageDeletionId: undefined!,
            initialFilledEntities: trainDialog.initialFilledEntities,
            rounds: trainDialog.rounds.slice(0, turnIndex),
            definitions: {
                entities: this.props.entities,
                actions: this.props.actions,
                trainDialogs: []
            }
        };

        ((this.props.createTeachSessionFromHistoryThunkAsync(this.props.app, newTrainDialog, this.props.user.name, this.props.user.id) as any) as Promise<CLM.TeachWithHistory>)
            .then(teachWithHistory => {
                if (teachWithHistory.replayErrors.length === 0) {
                    this.setState({
                        teachSession: teachWithHistory.teach,
                        history: teachWithHistory.history,
                        lastAction: teachWithHistory.lastAction,
                        currentTrainDialog: null,
                        originalTrainDialogId: null,
                        editType: EditDialogType.NEW,
                        isEditDialogModalOpen: false,
                        selectedHistoryIndex: null,
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

    onUpdateHistory(newTrainDialog: CLM.TrainDialog, activityIndex: number | null) {
        ((this.props.fetchHistoryThunkAsync(this.props.app.appId, newTrainDialog, this.props.user.name, this.props.user.id) as any) as Promise<CLM.TeachWithHistory>)
        .then(teachWithHistory => {

            const originalId = this.state.currentTrainDialog ? this.state.currentTrainDialog.trainDialogId : null     
            this.setState({
                history: teachWithHistory.history,
                lastAction: teachWithHistory.lastAction,
                currentTrainDialog: newTrainDialog,
                originalTrainDialogId: originalId,
                selectedHistoryIndex: activityIndex,
                isEditDialogModalOpen: true,
                editType: this.state.editType === EditDialogType.NEW 
                        ? EditDialogType.NEW
                        : EditDialogType.TRAIN_EDITED
            })
        })
        .catch(error => {
            console.warn(`Error when attempting to create history: `, error)
        })
    }

    async onContinueTrainDialog(newTrainDialog: CLM.TrainDialog, initialUserInput: CLM.UserInput) {

        try {
            let teachWithHistory = await ((this.props.createTeachSessionFromHistoryThunkAsync(this.props.app, newTrainDialog, this.props.user.name, this.props.user.id, initialUserInput) as any) as Promise<CLM.TeachWithHistory>)
    
            if (teachWithHistory.replayErrors.length  === 0) {
                // Note: Don't clear currentTrainDialog so I can delete it if I save my edits
                this.setState({
                    teachSession: teachWithHistory.teach,
                    history: teachWithHistory.history,
                    lastAction: teachWithHistory.lastAction,
                    isEditDialogModalOpen: false,
                    selectedHistoryIndex: null,
                    isTeachDialogModalOpen: true,
                    editType: this.state.editType === EditDialogType.NEW 
                        ? EditDialogType.NEW
                        : EditDialogType.TRAIN_EDITED
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
        }
        catch (error) {
                console.warn(`Error when attempting to create teach session from train dialog: `, error)
        }
    }

    // Replace the current trainDialog with a new one
    async onReplaceTrainDialog(newTrainDialog: CLM.TrainDialog, isInvalid: boolean) {

        newTrainDialog.invalid = isInvalid
        newTrainDialog.definitions = null
        try { 
            await ((this.props.editTrainDialogThunkAsync(this.props.app.appId, newTrainDialog) as any) as Promise<CLM.TeachWithHistory>);
        }
        catch (error) {
            console.warn(`Error when attempting to replace an edited train dialog: `, error)
        }

        this.onCloseEditDialogModal()
    }

    // Create a new trainDialog 
    async onCreateTrainDialog(newTrainDialog: CLM.TrainDialog, isInvalid: boolean) {

        newTrainDialog.invalid = isInvalid

        try { 
            await ((this.props.createTrainDialogThunkAsync(this.props.app.appId, newTrainDialog) as any) as Promise<CLM.TrainDialog>);
        }
        catch (error) {
            console.warn(`Error when attempting to create a train dialog: `, error)
        }

        this.onCloseEditDialogModal()
    }

    onClickTrainDialogItem(trainDialog: CLM.TrainDialog) {
        this.props.clearWebchatScrollPosition()
        let trainDialogWithDefinitions: CLM.TrainDialog = {
            createdDateTime: new Date().toJSON(),
            lastModifiedDateTime: new Date().toJSON(),
            trainDialogId: undefined!,
            sourceLogDialogId: trainDialog.sourceLogDialogId,
            version: undefined!,
            packageCreationId: undefined!,
            packageDeletionId: undefined!,
            rounds: trainDialog.rounds,
            initialFilledEntities: trainDialog.initialFilledEntities,
            definitions: {
                actions: this.props.actions,
                entities: this.props.entities,
                trainDialogs: []
            },
        };

        ((this.props.fetchHistoryThunkAsync(this.props.app.appId, trainDialogWithDefinitions, this.props.user.name, this.props.user.id) as any) as Promise<CLM.TeachWithHistory>)
            .then(teachWithHistory => {
                const originalId = this.state.currentTrainDialog ? this.state.currentTrainDialog.trainDialogId : null   
                this.setState({
                    history: teachWithHistory.history,
                    lastAction: teachWithHistory.lastAction,
                    currentTrainDialog: trainDialog,
                    originalTrainDialogId: originalId,
                    editType: EditDialogType.TRAIN_ORIGINAL,
                    isEditDialogModalOpen: true,
                    selectedHistoryIndex: null
                })
            })
            .catch(error => {
                console.warn(`Error when attempting to create history: `, error)
            })
    }

    async onCloseEditDialogModal(reload: boolean = false) {

        if (reload && this.state.originalTrainDialogId) {
            // Reload local copy
            await ((this.props.fetchTrainDialogThunkAsync(this.props.app.appId, this.state.originalTrainDialogId, true) as any) as Promise<CLM.TrainDialog>)
        }
        this.setState({
            isEditDialogModalOpen: false,
            selectedHistoryIndex: null,
            currentTrainDialog: null,
            // originalTrainDialogId: Do not clear.  Save for later 
            history: [],
            lastAction: null,
            dialogKey: this.state.dialogKey + 1
        })
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

    getFilteredAndSortedDialogs(): CLM.TrainDialog[] {
        let filteredTrainDialogs: CLM.TrainDialog[] = []

        if (!this.state.searchValue && !this.state.entityFilter && !this.state.actionFilter) {
            filteredTrainDialogs = this.props.trainDialogs;
        } else {
            // TODO: Consider caching as not very efficient
            filteredTrainDialogs = this.props.trainDialogs.filter((t: CLM.TrainDialog) => {
                const entitiesInTD: CLM.EntityBase[] = []
                const actionsInTD: CLM.ActionBase[] = []
                const variationText: string[] = []

                for (let round of t.rounds) {
                    for (let variation of round.extractorStep.textVariations) {
                        variationText.push(variation.text);
                        for (let le of variation.labelEntities) {
                            // Include pos and neg examples of entity if reversable
                            const entity = this.props.entities.find(e => e.entityId === le.entityId)
                            if (!entity) {
                                continue
                            }

                            entitiesInTD.push(entity)
                            const negativeEntity = this.props.entities.find(e => e.entityId === entity.negativeId)
                            if (!negativeEntity) {
                                continue
                            }
                            entitiesInTD.push(negativeEntity)
                        }
                    }
                    for (let ss of round.scorerSteps) {
                        let foundAction = this.props.actions.find(a => a.actionId === ss.labelAction);
                        // Invalid train dialogs can contain deleted actions
                        if (!foundAction) {
                            continue
                        }

                        actionsInTD.push(foundAction)

                        // Need to check filledEntities for programmatic only entities
                        const entities = ss.input.filledEntities
                            .map((fe: any) => fe.entityId)
                            .filter(notNullOrUndefined)
                            .map((entityId: any) => this.props.entities.find(e => e.entityId === entityId))
                            .filter(notNullOrUndefined)

                        entitiesInTD.push(...entities)
                    }
                }

                // Filter out train dialogs that don't match filters (data = negativeId for multivalue)
                const entityFilter = this.state.entityFilter
                if (entityFilter && entityFilter.key
                    && !entitiesInTD.find(en => en.entityId === entityFilter.key)
                    && !entitiesInTD.find(en => en.entityId === entityFilter.data)) {
                    return false;
                }
                const actionFilter = this.state.actionFilter
                if (actionFilter && actionFilter.key
                    && !actionsInTD.find(a => a.actionId === actionFilter.key)) {
                    return false;
                }

                let entityNames = entitiesInTD.map(e => e.entityName);
                let actionPayloads = actionsInTD.map(a => CLM.ActionBase.GetPayload(a, getDefaultEntityMap(this.props.entities)));

                // Then check search terms
                let searchString = variationText.concat(actionPayloads).concat(entityNames).join(' ').toLowerCase();
                return searchString.indexOf(this.state.searchValue) > -1;
            })
        }

        filteredTrainDialogs = this.sortTrainDialogs(filteredTrainDialogs);
        return filteredTrainDialogs;
    }

    render() {
        const { intl, trainDialogs } = this.props
        const computedTrainDialogs = this.getFilteredAndSortedDialogs()
        const editState = (this.props.editingPackageId !== this.props.app.devPackageId) 
            ? EditState.INVALID_PACKAGE 
            : this.props.invalidBot
            ? EditState.INVALID_BOT
            : EditState.CAN_EDIT

        return (
            <div className="cl-page">
                <div data-testid="train-dialogs-title" className={`cl-dialog-title cl-dialog-title--train ${OF.FontClassNames.xxLarge}`}>
                    <OF.Icon iconName="EditContact" />
                    <FormattedMessage
                        id={FM.TRAINDIALOGS_TITLE}
                        defaultMessage="Train Dialogs"
                    />
                </div>
                {this.props.editingPackageId === this.props.app.devPackageId ?
                    <span data-testid="train-dialogs-subtitle" className={OF.FontClassNames.mediumPlus}>
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
                        data-testid="button-new-train-dialog"
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
                        componentRef={component => this.newTeachSessionButton = component!}
                    />
                </div>

                {trainDialogs.length === 0
                    ? <div className="cl-page-placeholder">
                        <div className="cl-page-placeholder__content">
                            <div className={`cl-page-placeholder__description ${OF.FontClassNames.xxLarge}`}>Create a Train Dialog</div>
                            <OF.PrimaryButton
                                iconProps={{
                                    iconName: "Add"
                                }}
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
                            />
                        </div>
                    </div>
                    : <React.Fragment>
                        <div>
                            <OF.Label htmlFor="traindialogs-input-search" className={OF.FontClassNames.medium}>
                                Search:
                            </OF.Label>
                            <OF.SearchBox
                                data-testid="search-box"
                                id="traindialogs-input-search"
                                className={OF.FontClassNames.medium}
                                onChange={(newValue) => this.onChangeSearchString(newValue)}
                                onSearch={(newValue) => this.onChangeSearchString(newValue)}
                            />
                        </div>
                        <div className="cl-list-filters">
                            <OF.Dropdown
                                data-testid="dropdown-filter-by-entity"
                                ariaLabel="Entity:"
                                label="Entity:"
                                selectedKey={(this.state.entityFilter ? this.state.entityFilter.key : undefined)}
                                onChanged={this.onSelectEntityFilter}
                                placeHolder="Filter by Entity"
                                options={this.props.entities
                                    // Only show positive versions of negatable entities
                                    .filter(e => e.positiveId == null)
                                    .map(e => this.toEntityFilter(e))
                                    .concat({ key: -1, text: '---', data: null })
                                }
                            />

                            <OF.Dropdown
                                data-testid="dropdown-filter-by-action"
                                ariaLabel="Action:"
                                label="Action:"
                                selectedKey={(this.state.actionFilter ? this.state.actionFilter.key : undefined)}
                                onChanged={this.onSelectActionFilter}
                                placeHolder="Filter by Action"
                                options={this.props.actions
                                    .map(a => this.toActionFilter(a, this.props.entities))
                                    .concat({ key: -1, text: '---' })
                                }
                            />
                        </div>
                        <OF.DetailsList
                            data-testid="detail-list"
                            key={this.state.dialogKey}
                            className={OF.FontClassNames.mediumPlus}
                            items={computedTrainDialogs}
                            columns={this.state.columns}
                            checkboxVisibility={OF.CheckboxVisibility.hidden}
                            onColumnHeaderClick={this.onClickColumnHeader}
                            onRenderItemColumn={(trainDialog, i, column: IRenderableColumn) => returnErrorStringWhenError(() => column.render(trainDialog, this))}
                            onActiveItemChanged={trainDialog => this.onClickTrainDialogItem(trainDialog)}
                        />
                    </React.Fragment>}
                <ReplayErrorList
                    open={this.state.isValidationWarningOpen}
                    onClose={this.onCloseValidationWarning}
                    textItems={this.state.validationErrors}
                    formattedTitleId={this.state.validationErrorTitleId!}
                    formattedMessageId={this.state.validationErrorMessageId!}
                />
                <TeachSessionModal
                    app={this.props.app}
                    editingPackageId={this.props.editingPackageId}
                    teach={this.props.teachSessions.current!}
                    dialogMode={this.props.teachSessions.mode}
                    isOpen={this.state.isTeachDialogModalOpen}
                    onClose={() => this.onCloseTeachSession()}
                    onEditTeach={(historyIndex) => this.onEditTeach(historyIndex)}
                    onSetInitialEntities={this.onSetInitialEntities}
                    initialHistory={this.state.history}
                    editType={this.state.editType}
                    lastAction={this.state.lastAction}
                    sourceTrainDialog={this.state.currentTrainDialog}
                    sourceLogDialog={null}
                />
                <EditDialogModal
                    data-testid="train-dialog-modal"
                    app={this.props.app}
                    editingPackageId={this.props.editingPackageId}
                    editState={editState}
                    open={this.state.isEditDialogModalOpen}
                    trainDialog={this.state.currentTrainDialog!}
                    editingLogDialog={null}
                    history={this.state.history}
                    initialSelectedHistoryIndex={this.state.selectedHistoryIndex}
                    editType={this.state.editType}
                    onClose={(reload) => this.onCloseEditDialogModal(reload)}
                    onBranch={(turnIndex) => this.onBranchTrainDialog(turnIndex)}
                    onDelete={() => this.onDeleteTrainDialog()}
                    onUpdateHistory={(updatedTrainDialog, selectedActivityIndex) => this.onUpdateHistory(updatedTrainDialog, selectedActivityIndex)}
                    onContinue={(editedTrainDialog, initialUserInput) => this.onContinueTrainDialog(editedTrainDialog, initialUserInput)}
                    onSave={(editedTrainDialog, isInvalid) => this.onReplaceTrainDialog(editedTrainDialog, isInvalid)}
                    onCreate={(newTrainDialog, isInvalid) => this.onCreateTrainDialog(newTrainDialog, isInvalid)}
                />
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        clearWebchatScrollPosition: actions.display.clearWebchatScrollPosition,
        createTeachSessionThunkAsync: actions.teach.createTeachSessionThunkAsync,
        createTeachSessionFromHistoryThunkAsync: actions.teach.createTeachSessionFromHistoryThunkAsync,
        createTrainDialogThunkAsync: actions.train.createTrainDialogThunkAsync,
        deleteTrainDialogThunkAsync: actions.train.deleteTrainDialogThunkAsync,
        deleteTeachSessionThunkAsync: actions.teach.deleteTeachSessionThunkAsync,
        deleteMemoryThunkAsync: actions.teach.deleteMemoryThunkAsync,
        editTrainDialogThunkAsync: actions.train.editTrainDialogThunkAsync,
        fetchHistoryThunkAsync: actions.train.fetchHistoryThunkAsync,
        fetchApplicationTrainingStatusThunkAsync: actions.app.fetchApplicationTrainingStatusThunkAsync,
        fetchTrainDialogThunkAsync: actions.train.fetchTrainDialogThunkAsync,
        runExtractorThunkAsync: actions.teach.runExtractorThunkAsync
        
    }, dispatch)
}
const mapStateToProps = (state: State) => {
    if (!state.user.user) {
        throw new Error(`You attempted to render TrainDialogs but the user was not defined. This is likely a problem with higher level component. Please open an issue.`)
    }

    return {
        user: state.user.user,
        actions: state.actions,
        entities: state.entities,
        trainDialogs: state.trainDialogs,
        teachSessions: state.teachSessions
    }
}

export interface ReceivedProps {
    app: CLM.AppBase,
    invalidBot: boolean,
    editingPackageId: string,
    filteredAction?: CLM.ActionBase,
    filteredEntity?: CLM.EntityBase
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps;

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(TrainDialogs))