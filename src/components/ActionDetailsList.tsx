import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { ActionBase } from 'blis-models'
import { State } from '../types'
import * as OF from 'office-ui-fabric-react';
import { onRenderDetailsHeader } from './ToolTips'
import { injectIntl, InjectedIntl, InjectedIntlProps } from 'react-intl'
import { FM } from '../react-intl-messages'

class ActionDetailsList extends React.Component<Props, ComponentState> {
    constructor(p: any) {
        super(p);
        this.state = {
            columns: getColumns(this.props.intl),
            sortColumn: null
        }
        this.onClickColumnHeader = this.onClickColumnHeader.bind(this);
    }

    sortActions(): ActionBase[] {
        let actions = [...this.props.actions];
        // If column header selected sort the items
        if (this.state.sortColumn) {
            actions
                .sort((a, b) => {
                    const firstValue = this.state.sortColumn.getSortValue(a, this)
                    const secondValue = this.state.sortColumn.getSortValue(b, this)
                    const compareValue = firstValue.localeCompare(secondValue)
                    return this.state.sortColumn.isSortedDescending
                        ? compareValue
                        : compareValue * -1
                })
        }

        return actions;
    }

    onClickColumnHeader(event: any, clickedColumn: IRenderableColumn) {
        let { columns } = this.state;
        let isSortedDescending = clickedColumn.isSortedDescending;

        // If we've sorted this column, flip it.
        if (clickedColumn.isSorted) {
            isSortedDescending = !isSortedDescending;
        }

        // Reset the items and columns to match the state.
        this.setState({
            columns: columns.map(column => {
                column.isSorted = (column.key === clickedColumn.key);

                if (column.isSorted) {
                    column.isSortedDescending = isSortedDescending;
                }

                return column;
            }),
            sortColumn: clickedColumn
        });
    }

    render() {
        let sortedActions = this.sortActions();
        return (
            <OF.DetailsList
                className="ms-font-m-plus"
                items={sortedActions}
                columns={this.state.columns}
                checkboxVisibility={OF.CheckboxVisibility.hidden}
                onRenderItemColumn={(action: ActionBase, i, column: IRenderableColumn) => column.render(action, this)}
                onActiveItemChanged={action => this.props.onSelectAction(action)}
                onColumnHeaderClick={this.onClickColumnHeader}
                onRenderDetailsHeader={(detailsHeaderProps: OF.IDetailsHeaderProps,
                    defaultRender: OF.IRenderFunction<OF.IDetailsHeaderProps>) =>
                    onRenderDetailsHeader(detailsHeaderProps, defaultRender)}
            />
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        entities: state.entities,
    }
}

export interface ReceivedProps {
    actions: ActionBase[]
    onSelectAction: (action: ActionBase) => void
}

// Props types inferred from mapStateToProps 
const stateProps = returntypeof(mapStateToProps);
type Props = typeof stateProps & ReceivedProps & InjectedIntlProps

export default connect<typeof stateProps, {}, ReceivedProps>(mapStateToProps, null)(injectIntl(ActionDetailsList))

function getColumns(intl: InjectedIntl): IRenderableColumn[] {
    return [
        {
            key: 'actionResponse',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_RESPONSE,
                defaultMessage: 'Response'
            }),
            fieldName: 'actionResponse',
            minWidth: 100,
            maxWidth: 400,
            isResizable: true,
            isMultiline: true,
            getSortValue: action => ActionBase.GetPayload(action),
            render: (action, component) => <span className="ms-font-m-plus" onClick={() => component.props.onSelectAction(action)}>{ActionBase.GetPayload(action)}</span>
        },
        {
            key: 'actionArguments',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_ARGUMENTS,
                defaultMessage: 'Arguments'
            }),
            fieldName: 'actionArguments',
            minWidth: 80,
            maxWidth: 300,
            isResizable: true,
            // TODO: There was no value in previous implementation, what should it be?
            getSortValue: action => ActionBase.GetArguments(action).join('').toLowerCase(),
            render: action => {
                const args = ActionBase.GetArguments(action);
                return (!args || args.length === 0)
                    ? <span className="ms-Icon ms-Icon--Remove notFoundIcon" aria-hidden="true"/>
                    : args.map((argument, i) => <div className="ms-ListItem-primaryText" key={i}>{argument}</div>)
            }
        },
        {
            key: 'actionType',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_TYPE,
                defaultMessage: 'Action Type'
            }),
            fieldName: 'metadata',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            getSortValue: action => action.metadata.actionType.toLowerCase(),
            render: action => <span className='ms-font-m-plus'>{action.metadata.actionType}</span>
        },
        {
            key: 'requiredEntities',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_REQUIREDENTITIES,
                defaultMessage: 'Required Entities'
            }),
            fieldName: 'requiredEntities',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            // TODO: Previous implementation returned arrays for these which is incorrect.
            // Should be action.negativeEntities.join('').toLowerCase(), but need entity names which requires lookup
            // This lookup should be done ahead of time instead of on every render
            getSortValue: action => '',
            render: (action, component) => action.requiredEntities.length === 0
                ? <span className="ms-Icon ms-Icon--Remove blis-icon" aria-hidden="true"></span>
                : action.requiredEntities.map(entityId => {
                    const entity = component.props.entities.find(e => e.entityId === entityId)
                    return (
                        <div className='ms-ListItem is-selectable' key={entityId}>
                            <span className='ms-ListItem-primaryText'>{entity.entityName}</span>
                        </div>
                    )
                })
        },
        {
            key: 'negativeEntities',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_BLOCKINGENTITIES,
                defaultMessage: 'Blocking Entities'
            }),
            fieldName: 'negativeEntities',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            // TODO: Previous implementation returned arrays for these which is incorrect.
            // Should be action.negativeEntities.join('').toLowerCase(), but need entity names which requires lookup
            // This lookup should be done ahead of time instead of on every render
            getSortValue: action => '',
            render: (action, component) => action.negativeEntities.length === 0
                ? <span className="ms-Icon ms-Icon--Remove blis-icon" aria-hidden="true"></span>
                : action.negativeEntities.map(entityId => {
                    const entity = component.props.entities.find(e => e.entityId == entityId)
                    return (
                        <div className='ms-ListItem is-selectable' key={entityId}>
                            <span className='ms-ListItem-primaryText'>{entity.entityName}</span>
                        </div>
                    )
                })
        },
        {
            key: 'suggestedEntity',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_SUGGESTEDENTITY,
                defaultMessage: 'Expected Entity'
            }),
            fieldName: 'suggestedEntity',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            getSortValue: action => '',
            render: (action, component) => {
                const expectedEntityId = action.suggestedEntity || (action.metadata as any).entitySuggestion
                if (!expectedEntityId) {
                    return <span className="ms-Icon ms-Icon--Remove blis-icon" aria-hidden="true"></span>
                }

                const expectedEntity = component.props.entities.find(e => e.entityId == expectedEntityId)
                return (
                    <div className='ms-ListItem is-selectable'>
                        <span className='ms-ListItem-primaryText'>{expectedEntity.entityName}</span>
                    </div>
                )
            }
        },
        {
            key: 'isTerminal',
            name: intl.formatMessage({
                id: FM.ACTIONDETAILSLIST_COLUMNS_ISTERMINAL,
                defaultMessage: 'Wait'
            }),
            fieldName: 'isTerminal',
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            getSortValue: action => action.isTerminal ? 'a' : 'b',
            render: action => <span className={"ms-Icon blis-icon " + (action.isTerminal ? 'ms-Icon--CheckMark' : 'ms-Icon--Remove')} aria-hidden="true"></span>
        }
    ]
}

interface IRenderableColumn extends OF.IColumn {
    render: (action: ActionBase, component: ActionDetailsList) => JSX.Element | JSX.Element[]
    getSortValue: (action: ActionBase, component: ActionDetailsList) => string
}

interface ComponentState {
    columns: IRenderableColumn[]
    sortColumn: IRenderableColumn
}