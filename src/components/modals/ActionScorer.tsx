/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { State } from '../../types'
import * as CLM from '@conversationlearner/models'
import { createActionThunkAsync } from '../../actions/actionActions'
import { toggleAutoTeach } from '../../actions/teachActions'
import * as OF from 'office-ui-fabric-react';
import ActionCreatorEditor from './ActionCreatorEditor'
import { onRenderDetailsHeader } from '../ToolTips/ToolTips'
import { injectIntl, InjectedIntl, InjectedIntlProps } from 'react-intl'
import { FM } from '../../react-intl-messages'
import * as Util from '../../Utils/util'
import AdaptiveCardViewer from './AdaptiveCardViewer/AdaptiveCardViewer'
import * as ActionPayloadRenderers from '../actionPayloadRenderers'
import ConfirmCancelModal from './ConfirmCancelModal'

const ACTION_BUTTON = 'action_button'
const MISSING_ACTION = 'missing_action'

interface IRenderableColumn extends OF.IColumn {
    getSortValue: (action: CLM.ScoredBase, component: ActionScorer) => number | string
    render: (x: CLM.ScoredBase, component: ActionScorer, index: number) => React.ReactNode
}

function getColumns(intl: InjectedIntl, hideScore: boolean): IRenderableColumn[] {
    return [
        {
            key: 'select',
            name: '',
            fieldName: 'actionId',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            getSortValue: action => action.actionId,
            render: (action, component, index) => {

                const selected = (component.props.dialogType !== CLM.DialogType.TEACH && index === 0)
                const buttonText = intl.formatMessage({
                    id: selected ? FM.BUTTON_SELECTED : FM.BUTTON_SELECT,
                    defaultMessage: selected ? Util.getDefaultText(FM.BUTTON_SAVE_EDIT) : Util.getDefaultText(FM.BUTTON_SAVE_EDIT)
                });
                if (!component.props.canEdit) {
                    return (
                        <OF.PrimaryButton
                            data-testid="action-scorer-button-no-click"
                            disabled={true}
                            ariaDescription={buttonText}
                            text={buttonText}
                        />
                    )
                }

                const isAvailable = component.isUnscoredActionAvailable(action as CLM.UnscoredAction)
                if (!isAvailable || selected) {
                    return (
                        <OF.PrimaryButton
                            data-testid="action-scorer-button-no-click"
                            disabled={!isAvailable}
                            ariaDescription={buttonText}
                            text={buttonText}
                            onClick={component.showAlreadySelectedPopUp}
                        />
                    )
                }
                else {
                    const refFn = (index === 0)
                        ? (ref: any) => { component.primaryScoreButton = ref }
                        : undefined
                    return (
                        <OF.PrimaryButton
                            data-testid="action-scorer-button-clickable"
                            onClick={() => component.handleActionSelection(action.actionId)}
                            ariaDescription={buttonText}
                            text={buttonText}
                            componentRef={refFn}
                        />
                    )
                }
            }
        },
        {
            key: 'actionResponse',
            name: intl.formatMessage({
                id: FM.ACTIONSCORER_COLUMNS_RESPONSE,
                defaultMessage: 'Response'
            }),
            fieldName: 'actionResponse',
            minWidth: 100,
            maxWidth: 500,
            isMultiline: true,
            isResizable: true,
            getSortValue: () => '',
            render: (action: CLM.ActionBase, component) => {
                const defaultEntityMap = Util.getDefaultEntityMap(component.props.entities)

                if (action.actionType === CLM.ActionTypes.TEXT) {
                    const textAction = new CLM.TextAction(action)
                    return (
                        <ActionPayloadRenderers.TextPayloadRendererContainer
                            data-testid="action-scorer-action-text"
                            textAction={textAction}
                            entities={component.props.entities}
                            memories={component.props.memories}
                        />)
                }
                else if (action.actionType === CLM.ActionTypes.API_LOCAL) {
                    // TODO: Find better way to handle this with CodeActionRenderer?
                    const apiAction = new CLM.ApiAction(action)
                    return (
                        <ActionPayloadRenderers.ApiPayloadRendererContainer
                            data-testid="action-scorer-action-api"
                            apiAction={apiAction}
                            entities={component.props.entities}
                            memories={component.props.memories}
                        />)
                }
                else if (action.actionType === CLM.ActionTypes.CARD) {
                    const cardAction = new CLM.CardAction(action)
                    return (
                        <ActionPayloadRenderers.CardPayloadRendererContainer
                            data-testid="action-scorer-action-card"
                            isValidationError={false}
                            cardAction={cardAction}
                            entities={component.props.entities}
                            memories={component.props.memories}
                            onClickViewCard={(_, showOriginal) => component.onClickViewCard(action, showOriginal)}
                        />)
                }
                else if (action.actionType === CLM.ActionTypes.END_SESSION) {
                    const sessionAction = new CLM.SessionAction(action)
                    return (
                        <ActionPayloadRenderers.SessionPayloadRendererContainer
                            data-testid="action-scorer-action-session"
                            sessionAction={sessionAction}
                            entities={component.props.entities}
                            memories={component.props.memories}
                        />)
                }

                return <span className={OF.FontClassNames.mediumPlus}>{CLM.ActionBase.GetPayload(action, defaultEntityMap)}</span>
            }
        },
        {
            key: 'actionScore',
            name: hideScore ? '' : intl.formatMessage({
                id: FM.ACTIONSCORER_COLUMNS_SCORE,
                defaultMessage: 'Score'
            }),
            fieldName: 'score',
            minWidth: hideScore ? 1 : 80,
            maxWidth: hideScore ? 1 : 80,
            isResizable: true,
            isSorted: true,
            isSortedDescending: true,
            getSortValue: (scoredBase, component) => {

                // TODO: Fix type so we can use typed property access
                const score = scoredBase['score']

                // If score base does not have score it's either not scorable or not available
                // prioritize not scorable over not available but both at bottom of list
                if (!score) {
                    if (scoredBase['reason'] === CLM.ScoreReason.NotAvailable) {
                        return -100;
                    } else {
                        let isAvailable = component.isUnscoredActionAvailable(scoredBase as CLM.UnscoredAction);
                        return isAvailable
                            ? -1
                            : -10
                    }
                }

                return score
            },
            render: (action, component) => {
                if (component.props.hideScore) {
                    return null;
                }
                let fieldContent: number | string = (action as CLM.ScoredAction).score
                if (fieldContent) {
                    // No scores in TrainDialogs
                    if (component.props.dialogType === CLM.DialogType.TRAINDIALOG) {
                        fieldContent = '';
                    } else {
                        fieldContent = `${(fieldContent as number * 100).toFixed(1)}%`
                    }
                } else if (component.isMasked(action.actionId)) {
                    fieldContent = "Masked"
                } else {
                    let isAvailable = component.isUnscoredActionAvailable(action as CLM.UnscoredAction);
                    if (isAvailable) {
                        fieldContent = (component.props.dialogType !== CLM.DialogType.TEACH) ?
                            'Unknown' : "Training...";
                    }
                    else {
                        fieldContent = "Disqualified";
                    }
                }
                return <span className={OF.FontClassNames.mediumPlus}>{fieldContent}</span>
            }
        },
        {
            key: 'actionEntities',
            name: intl.formatMessage({
                id: FM.ACTIONSCORER_COLUMNS_ENTITIES,
                defaultMessage: 'Entities'
            }),
            fieldName: 'entities',
            minWidth: 100,
            maxWidth: 300,
            isResizable: true,
            getSortValue: () => '',
            render: (action, component) => component.renderEntityRequirements(action.actionId)
        },
        {
            key: 'isTerminal',
            name: intl.formatMessage({
                id: FM.ACTIONSCORER_COLUMNS_ISTERMINAL,
                defaultMessage: 'Wait'
            }),
            fieldName: 'isTerminal',
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            getSortValue: action => action.isTerminal ? 1 : -1,
            render: action => <OF.Icon
                iconName={(action.isTerminal ? "CheckMark" : "Remove")}
                className={`cl-icon${action.isTerminal ? " checkIcon" : " notFoundIcon"}`}
            />
        },
        {
            key: 'actionType',
            name: intl.formatMessage({
                id: FM.ACTIONSCORER_COLUMNS_TYPE,
                defaultMessage: 'Type'
            }),
            fieldName: 'actionType',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            getSortValue: action => action.actionType.toLowerCase(),
            render: action => action.actionType
        },
    ]
}

interface ComponentState {
    actionModalOpen: boolean
    columns: OF.IColumn[]
    sortColumn: IRenderableColumn
    haveEdited: boolean
    cardViewerAction: CLM.ActionBase | null
    cardViewerShowOriginal: boolean
    isAlreadySelectedOpen: boolean
}

class ActionScorer extends React.Component<Props, ComponentState> {
    primaryScoreButton: any = null;

    constructor(p: Props) {
        super(p);

        const columns = getColumns(this.props.intl, this.props.hideScore)
        this.state = {
            actionModalOpen: false,
            columns,
            sortColumn: columns[2], // "score"
            haveEdited: false,
            cardViewerAction: null,
            cardViewerShowOriginal: false,
            isAlreadySelectedOpen: false
        };
        this.handleActionSelection = this.handleActionSelection.bind(this);
        this.handleDefaultSelection = this.handleDefaultSelection.bind(this);
        this.handleOpenActionModal = this.handleOpenActionModal.bind(this);
        this.renderItemColumn = this.renderItemColumn.bind(this);
        this.onColumnClick = this.onColumnClick.bind(this);
        this.focusPrimaryButton = this.focusPrimaryButton.bind(this);
        this.showAlreadySelectedPopUp = this.showAlreadySelectedPopUp.bind(this);
        this.onCloseAlreadySelectedPopUp = this.onCloseAlreadySelectedPopUp.bind(this);
    }
    componentWillReceiveProps(newProps: Props) {
        if (this.props.scoreResponse !== newProps.scoreResponse) {
            this.setState({
                haveEdited: false
            })
        }
    }
    // TODO: Why invoke autoSelect on both Update and DidUpdate?!
    componentUpdate() {
        this.autoSelect();
    }
    componentDidUpdate() {
        this.autoSelect();
    }
    componentDidMount() {
        this.autoSelect();
    }

    onClickViewCard(action: CLM.ActionBase, cardViewerShowOriginal: boolean) {
        this.setState({
            cardViewerAction: action,
            cardViewerShowOriginal
        })
    }
    onCloseCardViewer = () => {
        this.setState({
            cardViewerAction: null,
            cardViewerShowOriginal: true
        })
    }

    autoSelect() {
        // If not in interactive mode select action automatically
        if (this.props.autoTeach && this.props.dialogMode === CLM.DialogMode.Scorer) {
            // We assume if DialogMode is Scorer, then we must have ScoreResponse
            // TODO: Fix this with better types
            const scoreResponse = this.props.scoreResponse
            const actions = [...scoreResponse.scoredActions as CLM.ScoredBase[], ...scoreResponse.unscoredActions]
            // Since actions are sorted by score descending (max first), assume first scored action is the "best" action
            const bestAction = actions[0];

            // Make sure there is an available action
            if ((bestAction as CLM.UnscoredAction).reason === CLM.ScoreReason.NotAvailable) {
                // If none available auto teach isn't possible.  User must create a new action
                this.props.toggleAutoTeach(false);
                return;
            }
            const selectedActionId = bestAction.actionId;
            this.handleActionSelection(selectedActionId);

        } else if (!this.state.actionModalOpen) {
            setTimeout(this.focusPrimaryButton, 100)
        }
    }
    focusPrimaryButton(): void {
        if (this.primaryScoreButton) {
            this.primaryScoreButton.focus();
        }
        else {
            setTimeout(this.focusPrimaryButton, 100)
        }
    }

    onClickCancelActionEditor() {
        this.setState({
            actionModalOpen: false
        })
    }

    async onClickSubmitActionEditor(action: CLM.ActionBase) {
        await Util.setStateAsync(this, { actionModalOpen: false })

        let newAction = await ((this.props.createActionThunkAsync(this.props.app.appId, action) as any) as Promise<CLM.ActionBase>)

        if (newAction) {
            // See if new action is available, then take it
            let isAvailable = this.isAvailable(newAction);
            if (isAvailable) {
                this.handleActionSelection(newAction.actionId);
            }
        }
    }

    handleOpenActionModal() {
        this.setState({
            actionModalOpen: true
        })
    }
    onColumnClick(event: any, column: any) {
        let { columns } = this.state;
        let isSortedDescending = column.isSortedDescending;

        // If we've sorted this column, flip it.
        if (column.isSorted) {
            isSortedDescending = !isSortedDescending;
        }

        // Reset the items and columns to match the state.
        this.setState({
            columns: columns.map((col: any) => {
                col.isSorted = (col.key === column.key);

                if (col.isSorted) {
                    col.isSortedDescending = isSortedDescending;
                }

                return col;
            }),
            sortColumn: column
        });
    }

    handleDefaultSelection() {
        // Look for a valid action
        let actionId = null
        const scoreResponse = this.props.scoreResponse
        if (scoreResponse.scoredActions && scoreResponse.scoredActions.length > 0) {
            actionId = scoreResponse.scoredActions[0].actionId;
        } else if (scoreResponse.unscoredActions) {
            for (let unscoredAction of scoreResponse.unscoredActions) {
                if (unscoredAction.reason === CLM.ScoreReason.NotScorable) {
                    actionId = unscoredAction.actionId;
                    break;
                }
            }
        }
        if (actionId) {
            this.handleActionSelection(actionId);
        }
    }
    handleActionSelection(actionId: string) {
        const { scoredActions, unscoredActions } = this.props.scoreResponse
        let scoredAction = scoredActions.find(a => a.actionId === actionId);
        if (!scoredAction) {
            let unscoredAction = unscoredActions.find(a => a.actionId === actionId);
            if (unscoredAction) {
                const { reason, ...scoredBase } = unscoredAction
                // This is hack to create scored action without a real score
                scoredAction = {
                    ...scoredBase,
                    score: undefined!
                }
            }
            // TODO: Modify handleActionSelection to be passed action instead of finding action again from list by ID
            // TODO: If score can be undefined on train dialog, what is the value in actually having the real score?
            // if it doesn't matter, then skip all this steps for scored, unscored, missing and just find action within props.actions
            else {
                const responseActions = [...scoredActions, ...unscoredActions]
                const otherActions = this.props.actions.filter(a => responseActions.every(sa => sa.actionId !== a.actionId))
                const action = otherActions.find(a => a.actionId === actionId)
                if (!action) {
                    throw new Error(`Could not find action with id: ${actionId} in list of actions`)
                }

                scoredAction = {
                    actionId: action.actionId,
                    payload: action.payload,
                    isTerminal: action.isTerminal,
                    actionType: action.actionType,
                    score: undefined!
                }
            }
        }

        if (!scoredAction) {
            throw new Error(`Scored action could not be found in list of available actions`)
        }

        let trainScorerStep: CLM.TrainScorerStep = {
            input: this.props.scoreInput,
            labelAction: actionId,
            logicResult: undefined,
            scoredAction: scoredAction
        };

        this.setState({ haveEdited: true });
        this.props.onActionSelected(trainScorerStep);
    }

    // Check if entity is in memory and return it's name 
    entityInMemory(entityId: string): { match: boolean, name: string } {
        let entity = this.props.entities.filter(e => e.entityId === entityId)[0];

        // If entity is null - there's a bug somewhere
        if (!entity) {
            return { match: false, name: 'ERROR' };
        }

        let memory = this.props.memories.filter(m => m.entityName === entity.entityName)[0];
        return { match: (memory != null), name: entity.entityName };
    }

    renderEntityRequirements(actionId: string) {
        let action = this.props.actions.filter(a => a.actionId === actionId)[0];

        // If action is null - there's a bug somewhere
        if (!action) {
            return <div>ERROR: Missing Action</div>;
        }

        let items = [];
        for (let entityId of action.requiredEntities) {
            let found = this.entityInMemory(entityId);
            items.push({
                name: found.name,
                neg: false,
                type: found.match
                    ? 'cl-entity cl-entity--match'
                    : 'cl-entity cl-entity--mismatch',
            });
        }
        for (let entityId of action.negativeEntities) {
            let found = this.entityInMemory(entityId);
            items.push({
                name: found.name,
                neg: true,
                type: found.match
                    ? 'cl-entity cl-entity--mismatch'
                    : 'cl-entity cl-entity--match',
            });
        }
        return (
            <OF.List
                items={items}
                onRenderCell={(item, index) => {
                    return <span className={item.type}>{item.neg ? (<del>{item.name}</del>) : item.name}</span>
                }}
            />
        )
    }

    isUnscoredActionAvailable(action: CLM.UnscoredAction): boolean {
        if (action.reason === CLM.ScoreReason.NotAvailable) {
            return false;
        } else {
            return this.isActionIdAvailable(action.actionId);
        }
    }

    // Returns true if ActionId is available in actions
    isActionIdAvailable(actionId: string): boolean {
        let action = this.props.actions.find(a => a.actionId === actionId);
        if (!action) {
            return false;
        }
        return this.isAvailable(action);
    }

    // Returns true if Action is available given Entities in Memory
    isAvailable(action: CLM.ActionBase): boolean {

        for (let entityId of action.requiredEntities) {
            let found = this.entityInMemory(entityId);
            if (!found.match) {
                return false;
            }
        }
        for (let entityId of action.negativeEntities) {
            let found = this.entityInMemory(entityId);
            if (found.match) {
                return false;
            }
        }
        return true;
    }
    calculateReason(unscoredAction: CLM.UnscoredAction): CLM.ScoreReason {

        if (!unscoredAction.reason || unscoredAction.reason === CLM.ScoreReason.NotCalculated) {

            let action = this.props.actions.filter((a: CLM.ActionBase) => a.actionId === unscoredAction.actionId)[0];

            // If action is null - there's a bug somewhere
            if (!action) {
                return CLM.ScoreReason.NotAvailable;
            }

            let isAvailable = this.isAvailable(action);
            return isAvailable ? CLM.ScoreReason.NotScorable : CLM.ScoreReason.NotAvailable;
        }
        return unscoredAction.reason as CLM.ScoreReason;
    }

    isMasked(actionId: string): boolean {
        return (this.props.scoreInput.maskedActions && this.props.scoreInput.maskedActions.indexOf(actionId) > -1);
    }
    renderItemColumn(action: CLM.ScoredBase, index: number, column: IRenderableColumn) {
        // Null is action create button
        if (action.actionId === ACTION_BUTTON) {
            if (column.key === 'select') {
                // Will focus on new action button if no scores
                const ref = (index === 0)
                    ? ((r: any) => { this.primaryScoreButton = r })
                    : undefined;
                return (
                    <OF.PrimaryButton
                        data-testid="action-scorer-add-action-button"
                        onClick={this.handleOpenActionModal}
                        ariaDescription='Cancel'
                        text='Action'
                        iconProps={{ iconName: 'CirclePlus' }}
                        componentRef={ref}
                    />
                )
            } else {
                return '';
            }
        }
        // Handle deleted actions
        else if (action.actionId === MISSING_ACTION) {
            if (column.key === 'select') {
                let buttonText = (this.props.dialogType !== CLM.DialogType.TEACH && index === 0) ? "Selected" : "Select";
                return (
                    <OF.PrimaryButton
                        disabled={true}
                        ariaDescription={buttonText}
                        text={buttonText}
                    />
                )
            } else if (column.key === 'actionResponse') {
                return <span className="cl-font--warning">MISSING ACTION</span>;
            }
            else if (column.key === 'actionScore') {
                return column.render(action as CLM.ScoredBase, this, index)
            }
            else {
                return '';
            }
        }

        return column.render(action as CLM.ScoredBase, this, index)
    }

    // Create dummy item for injecting non-actions into list
    makeDummyItem(dummyType: string, score: number): CLM.ScoredAction {
        return {
            actionId: dummyType,
            payload: dummyType,
            score: score,
            isTerminal: false,
            actionType: CLM.ActionTypes.TEXT
        }
    }

    getScoredItems(): CLM.ScoredBase[] {
        if (!this.props.scoreResponse) {
            return []
        }

        let scoredItems = [...this.props.scoreResponse.scoredActions as CLM.ScoredBase[], ...this.props.scoreResponse.unscoredActions]

        // Need to reassemble to scored item has full action info and reason
        scoredItems = scoredItems.map(e => {
            let action = this.props.actions.find(ee => ee.actionId === e.actionId);
            let score = (e as CLM.ScoredAction).score;
            let reason = score ? null : this.calculateReason(e as CLM.UnscoredAction);
            if (action) {
                return { ...action, reason: reason, score: score }
            }
            else {
                // Action that no longer exists (was deleted)
                return this.makeDummyItem(MISSING_ACTION, score);
            }
        });

        // Add any new actions that weren't included in scores
        // NOTE: This will go away when we always rescore the step
        const missingActions = this.props.actions.filter(a => scoredItems.find(si => si.actionId === a.actionId) == null)
        const missingItems = missingActions.map(action =>
            ({
                ...action,
                reason: CLM.ScoreReason.NotCalculated,
                score: 0
            }))
        // Null is rendered as ActionCreat button
        scoredItems = [...scoredItems, ...missingItems]

        if (this.state.sortColumn) {
            const sortColumn = this.state.sortColumn
            // Sort the items.
            scoredItems = scoredItems.sort((a: CLM.ScoredBase, b: CLM.ScoredBase) => {
                const firstValue = sortColumn.getSortValue(a, this)
                const secondValue = sortColumn.getSortValue(b, this)

                let isFirstGreaterThanSecond = 0

                if (typeof firstValue === 'string' && typeof secondValue === 'string') {
                    isFirstGreaterThanSecond = firstValue.localeCompare(secondValue)
                }
                else if (typeof firstValue === 'number' && typeof secondValue === 'number') {
                    isFirstGreaterThanSecond = firstValue - secondValue
                }

                return sortColumn.isSortedDescending
                    ? isFirstGreaterThanSecond * -1
                    : isFirstGreaterThanSecond
            });
        }

        // If editing allowed and Action creation button
        if (scoredItems && !this.props.autoTeach && this.props.canEdit) {
            scoredItems.push(this.makeDummyItem(ACTION_BUTTON, 0));
        }

        // Add null for action createtion button at end
        return scoredItems;
    }

    render() {
        // In teach mode, hide scores after selection
        // so they can't be re-selected for non-terminal actions
        if (this.props.dialogType === CLM.DialogType.TEACH && this.state.haveEdited) {
            return null;
        }

        const { intl } = this.props
        const scores: CLM.ScoredBase[] = this.getScoredItems()
        let template: CLM.Template | undefined
        let renderedActionArguments: CLM.RenderedActionArgument[] = []
        if (this.state.cardViewerAction) {
            const cardAction = new CLM.CardAction(this.state.cardViewerAction)
            const entityMap = Util.getDefaultEntityMap(this.props.entities)
            template = this.props.templates.find((t) => t.name === cardAction.templateName)
            renderedActionArguments = this.state.cardViewerShowOriginal
                ? cardAction.renderArguments(entityMap, { preserveOptionalNodeWrappingCharacters: true })
                : cardAction.renderArguments(Util.createEntityMapFromMemories(this.props.entities, this.props.memories), { fallbackToOriginal: true })
        }

        return (
            <div>
                <OF.DetailsList
                    className={OF.FontClassNames.mediumPlus}
                    items={scores}
                    columns={this.state.columns}
                    checkboxVisibility={OF.CheckboxVisibility.hidden}
                    onRenderItemColumn={this.renderItemColumn}
                    onColumnHeaderClick={this.onColumnClick}
                    onRenderDetailsHeader={(
                        detailsHeaderProps: OF.IDetailsHeaderProps,
                        defaultRender: OF.IRenderFunction<OF.IDetailsHeaderProps>) =>
                        onRenderDetailsHeader(detailsHeaderProps, defaultRender)}
                />

                <ActionCreatorEditor
                    app={this.props.app}
                    editingPackageId={this.props.editingPackageId}
                    open={this.state.actionModalOpen}
                    action={null}
                    handleClose={() => this.onClickCancelActionEditor()}
                    // It is not possible to delete from this modal since you cannot select existing action so disregard implementation of delete 
                    handleDelete={action => { }}
                    handleEdit={action => this.onClickSubmitActionEditor(action)}
                />
                <AdaptiveCardViewer
                    open={this.state.cardViewerAction != null}
                    onDismiss={() => this.onCloseCardViewer()}
                    template={template}
                    actionArguments={renderedActionArguments}
                    hideUndefined={true}
                />
                <ConfirmCancelModal
                    data-testid="popup-already-selected"
                    open={this.state.isAlreadySelectedOpen}
                    onOk={this.onCloseAlreadySelectedPopUp}
                    title={intl.formatMessage({
                        id: FM.LOGDIALOGS_ALREADYSELECTED,
                        defaultMessage: Util.getDefaultText(FM.LOGDIALOGS_ALREADYSELECTED)
                    })}
                />
            </div>
        )
    }

    showAlreadySelectedPopUp() {
        this.setState({ isAlreadySelectedOpen: true })
    }

    onCloseAlreadySelectedPopUp() {
        this.setState({ isAlreadySelectedOpen: false })
    }
}

export interface ReceivedProps {
    app: CLM.AppBase
    editingPackageId: string,
    dialogType: CLM.DialogType,  // LARS = make this not train dialog specific
    autoTeach: boolean,
    dialogMode: CLM.DialogMode,
    scoreResponse: CLM.ScoreResponse,
    scoreInput: CLM.ScoreInput,
    memories: CLM.Memory[],
    canEdit: boolean
    hideScore: boolean,
    onActionSelected: (trainScorerStep: CLM.TrainScorerStep) => void,
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        createActionThunkAsync,
        toggleAutoTeach,
    }, dispatch);
}
const mapStateToProps = (state: State, ownProps: any) => {
    if (!state.bot.botInfo) {
        throw new Error(`You attempted to render the ActionScorer which requires botInfo, but botInfo was not defined. This is likely a problem with higher level component. Please open an issue.`)
    }

    return {
        user: state.user.user,
        entities: state.entities,
        actions: state.actions,
        templates: state.bot.botInfo.templates
    }
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(ActionScorer))