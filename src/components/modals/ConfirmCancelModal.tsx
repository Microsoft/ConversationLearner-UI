/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react'
import { PrimaryButton, DefaultButton, Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react'
import { FM } from '../../react-intl-messages'
import { injectIntl, InjectedIntlProps } from 'react-intl'

interface ReceivedProps {
    onConfirm: Function | null
    onCancel: Function
    open: boolean
    title: string
    message?: () => React.ReactNode
}

type Props = ReceivedProps & InjectedIntlProps

const ConfirmCancelModal: React.SFC<Props> = (props: Props) => {
    const { intl } = props
    return (
        <Dialog
            hidden={!props.open}
            onDismiss={() => props.onCancel()}
            dialogContentProps={{
                type: DialogType.normal,
                title: props.title
            }}
            modalProps={{
                isBlocking: false
            }}
        >
            {typeof props.message === 'function' && props.message()}
            <DialogFooter>
                {props.onConfirm &&
                    <PrimaryButton
                        onClick={() => {
                            if (props.onConfirm) {
                                props.onConfirm()
                            }
                        }}
                        text={intl.formatMessage({
                            id: FM.CONFIRMCANCELMODAL_PRIMARYBUTTON_TEXT,
                            defaultMessage: 'Confirm'
                        })}
                    />
                }
                <DefaultButton
                    onClick={() => props.onCancel()}
                    text={intl.formatMessage({
                        id: FM.CONFIRMCANCELMODAL_DEFAULTBUTTON_TEXT,
                        defaultMessage: 'Cancel'
                    })}
                />
            </DialogFooter>
        </Dialog>
    )
}
export default injectIntl(ConfirmCancelModal)