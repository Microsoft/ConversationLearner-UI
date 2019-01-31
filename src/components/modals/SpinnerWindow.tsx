/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react'
import { returntypeof } from 'react-redux-typescript'
import { connect } from 'react-redux'
import { Modal } from 'office-ui-fabric-react/lib/Modal'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { State } from '../../types'

// Enable to see what API calls I'm waiting for
const debug = false;

class SpinnerWindow extends React.Component<Props, {}> {
    render() {
        return (
            <React.Fragment>
                <Modal
                    isOpen={this.props.displaySpinner.length > 0}
                    isBlocking={true}
                    containerClassName='cl-spinner'
                >
                    <Spinner size={SpinnerSize.large} />
                    {debug &&
                        <div>
                            {this.props.displaySpinner.join("\n\n")}
                        </div>
                    }
                </Modal>
                <div role="alert" aria-live="assertive" className="cl-spinner-aria">
                    {this.props.displaySpinner.length > 0 && <span className="cl-screen-reader" data-testid="spinner">Loading</span>}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        displaySpinner: state.display.displaySpinner
    }
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps)
type Props = typeof stateProps

export default connect<typeof stateProps>(mapStateToProps)(SpinnerWindow)