import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { State } from '../../types'
import {
    BlisAppBase, TrainScorerStep, Memory, ScoredBase, ScoreInput, ScoreResponse,
    ActionBase, ScoredAction, UnscoredAction, ScoreReason, DialogType, ActionTypes,
    Template, ActionArgument
} from 'blis-models';
import { createActionAsync } from '../../actions/createActions'
import { toggleAutoTeach } from '../../actions/teachActions'
import { PrimaryButton } from 'office-ui-fabric-react';
import { DialogMode } from '../../types/const'
import * as OF from 'office-ui-fabric-react';
import ActionCreatorEditor from './ActionCreatorEditor'
import { onRenderDetailsHeader } from '../ToolTips'
import { injectIntl, InjectedIntl, InjectedIntlProps } from 'react-intl'
import { FM } from '../../react-intl-messages'
import AdaptiveCardViewer from './AdaptiveCardViewer/AdaptiveCardViewer'

const ACTION_BUTTON = 'action_button';

interface IRenderableColumn extends OF.IColumn {
    render: (x: ScoredBase, component: ActionScorer, index: number) => React.ReactNode
}

function getColumns(intl: InjectedIntl): IRenderableColumn[] {
    return [
        {
            key: 'select',
            name: '',
            fieldName: 'actionId',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            render: (action, component, index) => {
                let buttonText = (component.props.dialogType !== DialogType.TEACH && index === 0) ? "Selected" : "Select";
                let reason = (action as UnscoredAction).reason;
                if (reason === ScoreReason.NotAvailable) {
                    return (
                        <PrimaryButton
                            disabled={true}
                            ariaDescription={buttonText}
                            text={buttonText}
                        />
                    )
                }
                let refFn = (index === 0) ? ((ref: any) => { component.primaryScoreButton = ref }) : null;
                return (
                    <PrimaryButton
                        onClick={() => component.handleActionSelection(action.actionId)}
                        ariaDescription={buttonText}
                        text={buttonText}
                        componentRef={refFn}
                    />
                )
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
            render: (action: ActionBase, component) => {
                return (
                    <div>
                    {action.metadata.actionType === ActionTypes.CARD &&
                        <OF.PrimaryButton
                            className="blis-dropdownWithButton-button"
                            onClick={() => component.onClickViewCard(action)}
                            ariaDescription="Refresh"
                            text=""
                            iconProps={{ iconName: 'RedEye' }}
                        />
                    }
                    <span className='ms-font-m-plus'>{ActionBase.GetPayload(action as ActionBase)}</span>
                    </div>
                )
            }
        },
        {
            key: 'actionArguments',
            name: intl.formatMessage({
                id: FM.ACTIONSCORER_COLUMNS_ARGUMENTS,
                defaultMessage: 'Arguments'
            }),
            fieldName: 'actionArguments',
            minWidth: 80,
            maxWidth: 300,
            isResizable: true,
            render: action => {
                const args = ActionBase.GetActionArguments(action as ActionBase).map(aa => `${aa.parameter}: ${aa.value}`);
                return (!args)
                    ? <span className="ms-Icon ms-Icon--Remove notFoundIcon" aria-hidden="true" />
                    : <OF.List
                        items={args}
                        onRenderCell={(item, index) => (
                            <div className='ms-ListItem-primaryText'>{item}</div>
                        )}
                    />
            }
        },
        {
            key: 'actionScore',
            name: intl.formatMessage({
                id: FM.ACTIONSCORER_COLUMNS_SCORE,
                defaultMessage: 'Score'
            }),
            fieldName: 'score',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            isSorted: true,
            isSortedDescending: true,
            render: (action, component) => {
                let fieldContent: number | string = (action as ScoredAction).score
                if (fieldContent) {
                    // No scores in TrainDialogs
                    if (component.props.dialogType === DialogType.TRAINDIALOG) {
                        fieldContent = '';
                    } else {
                        fieldContent = (fieldContent as number * 100).toFixed(1) + "%"
                    }
                } else if (component.isMasked(action.actionId)) {
                    fieldContent = "Masked"
                } else {
                    let reason = (action as UnscoredAction).reason;
                    fieldContent = (reason === ScoreReason.NotAvailable) ?
                        "Disqualified" :
                        (component.props.dialogType !== DialogType.TEACH) ?
                            '' :
                            "Training...";
                }

                return <span className='ms-font-m-plus'>{fieldContent}</span>
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
            render: action => <span className={"ms-Icon blis-icon" + (action.isTerminal ? " ms-Icon--CheckMark checkIcon" : "ms-Icon--Remove notFoundIcon")} aria-hidden="true" />
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
            render: action => action.metadata.actionType
        },
    ]
}

interface ComponentState {
    actionModalOpen: boolean;
    columns: OF.IColumn[];
    sortColumn: OF.IColumn;
    haveEdited: boolean;
    newAction: ActionBase;
    cardViewerAction: ActionBase;
}

class ActionScorer extends React.Component<Props, ComponentState> {
    primaryScoreButton: any = null;

    constructor(p: Props) {
        super(p);

        const columns = getColumns(this.props.intl)
        this.state = {
            actionModalOpen: false,
            columns,
            sortColumn: columns[3], // "score"
            haveEdited: false,
            newAction: null,
            cardViewerAction: null
        };
        this.handleActionSelection = this.handleActionSelection.bind(this);
        this.handleDefaultSelection = this.handleDefaultSelection.bind(this);
        this.handleOpenActionModal = this.handleOpenActionModal.bind(this);
        this.renderItemColumn = this.renderItemColumn.bind(this);
        this.onColumnClick = this.onColumnClick.bind(this);
        this.focusPrimaryButton = this.focusPrimaryButton.bind(this);
    }
    componentWillReceiveProps(newProps: Props) {
        if (this.props.scoreResponse !== newProps.scoreResponse) {

            // Note any newly added action
            let newAction = null;
            if (newProps.actions.length > this.props.actions.length) {
                // Find the new action
                newAction = newProps.actions.filter(na => {
                    let fa = this.props.actions.find(a => a.actionId === na.actionId);
                    return fa === undefined;
                })[0];
            }
            this.setState({
                haveEdited: false,
                newAction: newAction
            });
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

    onClickViewCard(action: ActionBase) {
        this.setState({
            cardViewerAction: action
        })
    }
    onCloseCardViewer = () => {
        this.setState({
            cardViewerAction: null
        })
    }

    autoSelect() {
        // If not in interactive mode select action automatically
        if (this.props.autoTeach && this.props.dialogMode === DialogMode.Scorer) {

            let actions = (this.props.scoreResponse.scoredActions as ScoredBase[])
                .concat(this.props.scoreResponse.unscoredActions) || [];
            // Since actions are sorted by score descending (max first), assume first scored action is the "best" action
            let bestAction = actions[0];

            // Make sure there is an available aciont
            if ((bestAction as UnscoredAction).reason === ScoreReason.NotAvailable) {
                // If none available auto teach isn't possible.  User must create a new action
                this.props.toggleAutoTeach(false);
                return;
            }
            let selectedActionId = bestAction.actionId;
            this.handleActionSelection(selectedActionId);

        } else if (this.state.newAction) {
            // See if new action is available, then take it
            let isAvailable = this.isAvailable(this.state.newAction);
            if (isAvailable) {
                this.handleActionSelection(this.state.newAction.actionId);
                this.setState({ newAction: null });
            }

        } else if (!this.state.actionModalOpen) {
            setTimeout(this.focusPrimaryButton, 500);
        }
    }
    focusPrimaryButton(): void {
        if (this.primaryScoreButton) {
            this.primaryScoreButton.focus();
        }
    }

    onClickCancelActionEditor() {
        this.setState({
            actionModalOpen: false
        })
    }

    onClickSubmitActionEditor(action: ActionBase) {
        this.setState({
            actionModalOpen: false
        }, () => {
            this.props.createActionAsync(this.props.user.id, action, this.props.app.appId)
        })
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
    getValue(scoredBase: ScoredBase, col: OF.IColumn): any {
        let value = scoredBase[col.fieldName]
        if (col.fieldName === 'score') {
            // Sort new actions to the top
            if (this.state.newAction && this.state.newAction.actionId === scoredBase.actionId) {
                return 100;
            } else if (!scoredBase[col.fieldName]) {
                if (scoredBase['reason'] === ScoreReason.NotAvailable) {
                    return -100;
                } else {  // notScorable
                    return -1;
                }
            }
        }
        if (!value) {
            value = '';
        }

        if (typeof value === 'string' || value instanceof String) {
            return value.toUpperCase();
        }
        return value;
    }
    handleDefaultSelection() {
        // Look for a valid action
        let actionId = null;
        let scoreResponse = this.props.scoreResponse;
        if (scoreResponse.scoredActions && scoreResponse.scoredActions.length > 0) {
            actionId = scoreResponse.scoredActions[0].actionId;
        } else if (scoreResponse.unscoredActions) {
            for (let unscoredAction of scoreResponse.unscoredActions) {
                if (unscoredAction.reason === ScoreReason.NotScorable) {
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

        let scoredAction = this.props.scoreResponse.scoredActions.find(a => a.actionId === actionId);
        if (!scoredAction) {
            let unscoredAction = this.props.scoreResponse.unscoredActions.find(a => a.actionId === actionId);
            scoredAction = new ScoredAction(unscoredAction);
        }
        let trainScorerStep = new TrainScorerStep(
            {
                input: this.props.scoreInput,
                labelAction: actionId,
                scoredAction: scoredAction
            });

        this.setState({ haveEdited: true });
        this.props.onActionSelected(trainScorerStep);
    }

    /** Check if entity is in memory and return it's name */
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
                name: found.name, type: found.match ?
                    "blis-entity blis-entity--match" : "blis-entity blis-entity--mismatch", neg: false
            });
        }
        for (let entityId of action.negativeEntities) {
            let found = this.entityInMemory(entityId);
            items.push({
                name: found.name, type: found.match ?
                    "blis-entity blis-entity--mismatch" : "blis-entity blis-entity--match", neg: true
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
    // Returns true if Action is available given Entities in Memory
    isAvailable(action: ActionBase): boolean {

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
    calculateReason(unscoredAction: UnscoredAction): ScoreReason {

        if (!unscoredAction.reason || unscoredAction.reason === ScoreReason.NotCalculated) {

            let action = this.props.actions.filter((a: ActionBase) => a.actionId === unscoredAction.actionId)[0];

            // If action is null - there's a bug somewhere
            if (!action) {
                return ScoreReason.NotAvailable;
            }

            let isAvailable = this.isAvailable(action);
            return isAvailable ? ScoreReason.NotScorable : ScoreReason.NotAvailable;
        }
        return unscoredAction.reason as ScoreReason;
    }
    isMasked(actionId: string): boolean {
        return (this.props.scoreInput.maskedActions && this.props.scoreInput.maskedActions.indexOf(actionId) > -1);
    }
    renderItemColumn(action: ScoredBase | string, index: number, column: IRenderableColumn) {
        // Null is action create button
        if (action === ACTION_BUTTON) {
            if (column.key === 'select') {
                // Will focus on new action button if no scores
                let ref = (index === 0) ? ((ref: any) => { this.primaryScoreButton = ref }) : null;
                return (
                    <PrimaryButton
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

        return column.render(action as ScoredBase, this, index)
    }
    getScoredItems(): ScoredBase[] {
        if (!this.props.scoreResponse) {
            return null;
        }

        let scoredItems = (this.props.scoreResponse.scoredActions as ScoredBase[])
            .concat(this.props.scoreResponse.unscoredActions) || [];

        // Need to reassemble to scored item has full action info and reason
        scoredItems = scoredItems.map(e => {
            let action = this.props.actions.find(ee => ee.actionId === e.actionId);
            let score = (e as ScoredAction).score;
            let reason = score ? null : this.calculateReason(e as UnscoredAction);
            return { ...action, reason: reason, score: score }
        });

        // Add any new actions that weren't included in scores
        // NOTE: This will go away when we always rescore the step
        let missingActions = this.props.actions.filter(a => scoredItems.find(si => si.actionId === a.actionId) == null);
        let missingItems = missingActions.map(a => {
            let action = a;
            let score = 0;
            let reason = ScoreReason.NotCalculated;
            return { ...action, reason: reason, score: score }
        })
        // Null is rendered as ActionCreat button
        scoredItems = [...scoredItems, ...missingItems];

        if (this.state.sortColumn) {
            // Sort the items.
            scoredItems = scoredItems.sort((a: ScoredBase, b: ScoredBase) => {
                let firstValue = this.getValue(a, this.state.sortColumn);
                let secondValue = this.getValue(b, this.state.sortColumn);

                if (this.state.sortColumn.isSortedDescending) {
                    return firstValue > secondValue ? -1 : 1;
                } else {
                    return firstValue > secondValue ? 1 : -1;
                }
            });
        }

        // Add null for action createtion button at end
        return scoredItems;
    }

    render() {
        // In teach mode, hide scores after selection
        // so they can't be reselected for non-terminal actions
        if (this.props.dialogType === DialogType.TEACH && this.state.haveEdited) {
            return null;
        }

        let scores: (ScoredBase | string)[] = this.getScoredItems();

        // If editing allowed and Action creation button
        if (!this.props.autoTeach) {
            scores.push(ACTION_BUTTON);
        }

        let template: Template = null;
        let actionArguments: ActionArgument[] = [];
        if (this.state.cardViewerAction) {
            let actionPayload = ActionBase.GetPayload(this.state.cardViewerAction);
            template = this.props.templates.find((t) => t.name === actionPayload);
            actionArguments = ActionBase.GetActionArguments(this.state.cardViewerAction);
        }
        return (
            <div>
                <OF.DetailsList
                    className="ms-font-m-plus"
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
                    open={this.state.actionModalOpen}
                    action={null}
                    onClickCancel={() => this.onClickCancelActionEditor()}
                    /* It is not possible to delete from this modal since you cannot select existing action so disregard implementation of delete */
                    onClickDelete={action => { }}
                    onClickSubmit={action => this.onClickSubmitActionEditor(action)}
                />
                <AdaptiveCardViewer
                    open={this.state.cardViewerAction != null}
                    onDismiss={() => this.onCloseCardViewer()}
                    template={template}
                    actionArguments={actionArguments} 
                />
            </div>
        )
    }
}

export interface ReceivedProps {
    app: BlisAppBase
    dialogType: DialogType,
    sessionId: string,
    autoTeach: boolean,
    dialogMode: DialogMode,
    scoreResponse: ScoreResponse,
    scoreInput: ScoreInput,
    memories: Memory[]
    onActionSelected: (trainScorerStep: TrainScorerStep) => void,
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        createActionAsync,
        toggleAutoTeach,
    }, dispatch);
}
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        user: state.user,
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