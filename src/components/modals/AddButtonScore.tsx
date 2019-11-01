/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react'
import * as OF from 'office-ui-fabric-react'
import { FM } from '../../react-intl-messages'
import FormattedMessageId from '../FormattedMessageId'
import './AddButton.css'

interface Props {
    onClick: () => void,
    // Replaces current css class rather than extends
    className?: string
}

class AddButtonScore extends React.Component<Props> {
    render() {
        return (
            <div
                role="button"
                className={this.props.className || `cl-addbutton-add cl-addbutton-addscore`}
                onClick={this.props.onClick}
                data-testid="chat-edit-add-bot-response-button"
            >
                <OF.TooltipHost
                    directionalHint={OF.DirectionalHint.topCenter}
                    tooltipProps={{
                        onRenderContent: () =>
                            <FormattedMessageId id={FM.TOOLTIP_ADD_BOT_RESONSE_BUTTON} />
                    }}
                >
                    <svg
                        className="cl-addbutton-svg cl-addbutton-svg-score"
                    >
                        <polygon
                            points="0,2 19,2 19,6 24,10 19,13 19,17 0,17"
                            transform="rotate(180) translate(-24, -19)"
                            strokeWidth="1"
                        />
                        <text className="cl-addbutton-addscore-text" x="10" y="14">+</text>
                    </svg>
                </OF.TooltipHost>
            </div>
        )
    }
}

export default AddButtonScore