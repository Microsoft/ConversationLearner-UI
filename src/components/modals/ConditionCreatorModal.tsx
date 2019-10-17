import * as React from 'react'
import * as OF from 'office-ui-fabric-react'
import * as Util from '../../Utils/util'
import * as CLM from '@conversationlearner/models'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { FM } from '../../react-intl-messages'
import './ConditionCreatorModal.css'
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning'
import { PreBuilts } from 'src/types'
import { conditionDisplay, convertConditionToConditionalTag, isConditionEqual } from '../../Utils/actionCondition'

const entityIsAllowedInCondition = (entity: CLM.EntityBase): boolean => {
    if (entity.entityType == CLM.EntityType.ENUM) {
        return true
    }

    if (entity.entityType == CLM.EntityType.LUIS
        && entity.resolverType == PreBuilts.Number
        && entity.isResolutionRequired == true) {
        return true
    }

    if (entity.isMultivalue === true) {
        return true
    }

    return false
}

interface EntityOption extends OF.IDropdownOption {
    data: CLM.EntityBase
}

const convertEntityToDropdownOption = (entity: CLM.EntityBase): EntityOption => {
    let secondaryInfo = entity.entityType === CLM.EntityType.ENUM
        ? `enum`
        : entity.isMultivalue
            ? 'multi'
            : 'single'

    return {
        key: entity.entityId,
        text: `${entity.entityName} - ${secondaryInfo}`,
        data: entity,
    }
}

interface OperatorOption extends OF.IDropdownOption {
    data: CLM.ConditionType
}

const convertConditionTypesToDropdownOptions = (conditionTypes: object): OperatorOption[] => {
    return Object.keys(conditionTypes)
        .map((conditionType: string) => {
            let conditionText = `unknown`
            if (conditionDisplay && conditionDisplay[conditionType]) {
                conditionText = conditionDisplay[conditionType]
            }

            return {
                key: conditionType,
                text: conditionText,
                data: conditionTypes[conditionType],
            }
        })
}

const operatorOptions = convertConditionTypesToDropdownOptions(CLM.ConditionType)
// We know EQUAL will be found since it was created from enum type in line above
const equalOperatorOption = operatorOptions.find(o => o.data == CLM.ConditionType.EQUAL)!

interface EnumOption extends OF.IDropdownOption {
    data: CLM.EnumValue
}

// Enum here refers to Enum values on Entities
const convertEnumValueToDropdownOption = (enumValue: CLM.EnumValue): EnumOption => {
    // TODO: Fix types to avoid this. EnumValues on Entities should be guaranteed to exist.
    // Only don't exist during temporary creation
    if (!enumValue.enumValueId) {
        throw new Error(`Enum value must have id. When attempting to convert enum value to dropdown option, value did not have id. Perhaps it was not saved.`)
    }

    return {
        key: enumValue.enumValueId,
        text: enumValue.enumValue,
        data: enumValue,
    }
}

type Props = InjectedIntlProps
    & {
        entities: CLM.EntityBase[],
        isOpen: boolean,
        conditions: CLM.Condition[],
        onClickCreate: (condition: CLM.Condition) => void,
        onClickCancel: () => void,
    }

const Component: React.FC<Props> = (props) => {
    // Entity Dropdown
    const entityOptions = props.entities
        .filter(entityIsAllowedInCondition)
        .map(e => convertEntityToDropdownOption(e))
        .sort((a, b) => a.text.localeCompare(b.text))

    const [selectedEntityOption, setSelectedEntityOption] = React.useState(entityOptions[0])
    React.useEffect(() => {
        if (entityOptions.length > 0) {
            setSelectedEntityOption(entityOptions[0])
        }
    }, [props.entities])

    const onChangeEntity = (event: React.FormEvent<HTMLDivElement>, option?: EntityOption | undefined, index?: number | undefined) => {
        if (!option) {
            return
        }

        setSelectedEntityOption(option)
    }

    // Operator Dropdown
    const [selectedOperatorOption, setSelectedOperatorOption] = React.useState(equalOperatorOption)
    const onChangeOperator = (event: React.FormEvent<HTMLDivElement>, option?: OperatorOption) => {
        if (!option) {
            return
        }

        setSelectedOperatorOption(option)
    }

    // Value
    const [showNumberValue, setShowNumberValue] = React.useState(true)
    const [numberValue, setNumberValue] = React.useState(0)
    const [enumValueOptions, setEnumValueOptions] = React.useState<EnumOption[]>([])
    React.useLayoutEffect(() => {
        if (enumValueOptions.length > 0) {
            setSelectedEnumValueOption(enumValueOptions[0])
        }
    }, [enumValueOptions])

    const [selectedEnumValueOption, setSelectedEnumValueOption] = React.useState<EnumOption>()
    const onChangeEnumValueOption = (event: React.FormEvent<HTMLDivElement>, option?: EnumOption) => {
        if (!option) {
            return
        }

        setSelectedEnumValueOption(option)
    }

    const [isCreateDisabled, setIsCreateDisabled] = React.useState(false)

    // If entity selected is ENUM show possible values in dropdown
    // Otherwise, show number input
    React.useEffect(() => {
        if (!selectedEntityOption) {
            return
        }

        const entity = selectedEntityOption.data as CLM.EntityBase
        if (entity.entityType === CLM.EntityType.ENUM && entity.enumValues) {
            const enumValueOptions = entity.enumValues.map(ev => convertEnumValueToDropdownOption(ev))
            setEnumValueOptions(enumValueOptions)
            // Only allow equal operator when selecting enum
            setSelectedOperatorOption(equalOperatorOption)
            setShowNumberValue(false)
        }
        else {
            setShowNumberValue(true)
        }
    }, [selectedEntityOption])

    // If any of inputs change, recompute validity
    React.useEffect(() => {
        const isValid = Boolean(selectedEntityOption)
            && Boolean(selectedOperatorOption)
            && (showNumberValue
                || Boolean(selectedEnumValueOption))

        setIsCreateDisabled(!isValid)
    }, [selectedEntityOption, selectedOperatorOption, numberValue, selectedEnumValueOption])

    // If modal has opened (from false to true)
    React.useLayoutEffect(() => {
        if (props.isOpen) {
            // Reset operator and value
            setSelectedOperatorOption(equalOperatorOption)
            setNumberValue(0)
        }
    }, [props.isOpen])

    const createConditionFromState = () => {
        if (!selectedEntityOption
            || !selectedOperatorOption) {
            return
        }

        const condition: CLM.Condition = {
            entityId: selectedEntityOption.data.entityId,
            condition: selectedOperatorOption.data
        }

        if (showNumberValue) {
            condition.value = numberValue
        }
        else if (selectedEnumValueOption) {
            // TODO: Fix enum types
            condition.valueId = selectedEnumValueOption.data.enumValueId!
        }

        return condition
    }

    const onClickCreate = () => {
        const condition = createConditionFromState()
        if (condition) {
            props.onClickCreate(condition)
        }
        else {
            console.warn(`User attempted to create condition but condition did not exist. Usually means there is bad state calculation in modal.`)
        }
    }

    const onClickCancel = () => {
        props.onClickCancel()
    }

    const onClickExistingCondition = (condition: CLM.Condition) => {
        props.onClickCreate(condition)
    }

    const isOperatorDisabled = selectedEntityOption && selectedEntityOption.data.entityType === CLM.EntityType.ENUM
    const conditionsUsingEntity = props.conditions.filter(c => c.entityId === selectedEntityOption.key)
    const currentCondition = createConditionFromState()

    return <OF.Modal
        isOpen={props.isOpen}
        containerClassName="cl-modal cl-modal--medium"
        data-testid="condition-creator-modal-title"
    >
        <div className="cl-modal_header" data-testid="condition-creator-title">
            <span className={OF.FontClassNames.xxLarge}>Create a Condition</span>
        </div>

        <div className="cl-modal_body">
            <div>
                {entityOptions.length === 0
                    ? <p className="cl-text--warning"><OF.Icon iconName='Warning' /> You may only create conditions on enum entities or those with resolver type number which is required. Your model does not have either type available. Please create either of these types of entities to create a condition.</p>
                    : <>
                        <h2 style={{ fontWeight: OF.FontWeights.semibold as number }} className={OF.FontClassNames.large}>Current Condition:</h2>
                        <div className="cl-condition-creator__expression">
                            <OF.Dropdown
                                label="Entity"
                                data-testid="condition-creator-modal-dropdown-entity"
                                selectedKey={selectedEntityOption && selectedEntityOption.key}
                                options={entityOptions}
                                onChange={onChangeEntity}
                            />
                            <OF.Dropdown
                                label="Operator"
                                data-testid="condition-creator-modal-dropdown-operator"
                                selectedKey={selectedOperatorOption.key}
                                disabled={isOperatorDisabled}
                                options={operatorOptions}
                                onChange={onChangeOperator}
                            />
                            {/* Little awkward to checkEnumValueOption here, but do it for type safety */}
                            {(showNumberValue || !selectedEnumValueOption)
                                ? <div data-testid="condition-creator-modal-dropdown-numbervalue">
                                    <OF.Label>Number</OF.Label>
                                    <OF.SpinButton
                                        value={numberValue.toString()}
                                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                                            const value = parseInt(event.target.value)
                                            if (!Number.isNaN(value)) {
                                                setNumberValue(value)
                                            }
                                        }}
                                        onDecrement={v => setNumberValue(prevValue => prevValue - 1)}
                                        onIncrement={v => setNumberValue(prevValue => prevValue + 1)}
                                        labelPosition={Position.bottom}
                                        step={1}
                                    />
                                </div>
                                : <OF.Dropdown
                                    label="Enum Value"
                                    data-testid="condition-creator-modal-dropdown-enumvalue"
                                    selectedKey={selectedEnumValueOption.key}
                                    options={enumValueOptions}
                                    onChange={onChangeEnumValueOption}
                                />}
                        </div>

                        <h2 style={{ fontWeight: OF.FontWeights.semibold as number }} className={OF.FontClassNames.large}>Existing Conditions:</h2>
                        <div className="cl-condition-creator__existing-conditions">
                            {conditionsUsingEntity.map(condition => {
                                const conditionalTag = convertConditionToConditionalTag(condition, props.entities)
                                const isActive = currentCondition
                                    ? isConditionEqual(condition, currentCondition)
                                    : false

                                return <React.Fragment key={conditionalTag.key}>
                                    <div className="cl-condition-creator__existing-condition"
                                        data-testid="condition-creator-modal-existing-condition">
                                        {conditionalTag.name}
                                    </div>

                                    <OF.DefaultButton
                                        data-testid="condition-creator-modal-button-use-condition"
                                        onClick={() => onClickExistingCondition(conditionalTag.condition!)}
                                    >
                                        Use Condition
                                    </OF.DefaultButton>

                                    <div>
                                        {isActive
                                            && <OF.Icon
                                                className="cl-text--success"
                                                data-testid="condition-creator-modal-existing-condition-match"
                                                iconName="Accept"
                                            />}
                                    </div>
                                </React.Fragment>
                            })}
                        </div>
                    </>
                }
            </div>
        </div>

        <div className="cl-modal_footer cl-modal-buttons">
            <div className="cl-modal-buttons_secondary">
            </div>
            <div className="cl-modal-buttons_primary">
                <OF.PrimaryButton
                    data-testid="condition-creator-button-create"
                    disabled={isCreateDisabled}
                    onClick={onClickCreate}
                    ariaDescription={Util.formatMessageId(props.intl, FM.BUTTON_CREATE)}
                    text={Util.formatMessageId(props.intl, FM.BUTTON_CREATE)}
                    iconProps={{ iconName: 'Accept' }}
                />

                <OF.DefaultButton
                    data-testid="condition-creator-button-cancel"
                    onClick={onClickCancel}
                    ariaDescription={Util.formatMessageId(props.intl, FM.BUTTON_CANCEL)}
                    text={Util.formatMessageId(props.intl, FM.BUTTON_CANCEL)}
                    iconProps={{ iconName: 'Cancel' }}
                />
            </div>
        </div>
    </OF.Modal>
}

export default injectIntl(Component)