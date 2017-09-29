import * as React from 'react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { CommandButton } from 'office-ui-fabric-react';

export interface Props {
    onConfirm: Function;
    onCancel: Function;
    open: boolean;
    title: string;
}

const ConfirmDeleteModal: React.SFC<Props> = (props: Props) => {
    return (
        <Modal
            isOpen={props.open}
            isBlocking={false}
            containerClassName='createModal'
        >
            <div className='modalHeader'>
                <span className='ms-font-xl ms-fontWeight-semilight'>{props.title}</span>
            </div>
            <div className='modalFooter'>
                <CommandButton
                    disabled={false}
                    onClick={() => props.onConfirm()}
                    className='blis-button--gold'
                    ariaDescription='Confirm'
                    text='Confirm'
                />
                <CommandButton
                    className="blis-button--gray"
                    disabled={false}
                    onClick={() => props.onCancel()}
                    ariaDescription='Cancel'
                    text='Cancel'
                />
            </div>
        </Modal>
    )
}
export default ConfirmDeleteModal;