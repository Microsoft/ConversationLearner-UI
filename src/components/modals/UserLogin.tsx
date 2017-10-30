import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { CommandButton, TextField } from 'office-ui-fabric-react';
import { State } from '../../types';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import { FM } from '../../react-intl-messages'

interface ReceivedProps {
    open: boolean
    onClickLogin: (name: string, password: string, id: string) => void
    onDismiss: () => void
}

interface ComponentState {
    userName: string
    userPassword: string
}

class UserLogin extends React.Component<Props, ComponentState> {
    state: ComponentState = {
        userName: '',
        userPassword: ''
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            this.onClickLogin()
        }
    }

    onChangedName = (text: string) => {
        this.setState({
            userName: text
        })
    }

    onChangedPassword = (text: string) => {
        this.setState({
            userPassword: text
        })
    }

    onClickLogin = () => {
        const { userName, userPassword } = this.state

        if (userName === '' || userPassword === '') {
            return
        }

        const userId = this.generateUserId(this.state.userName, this.state.userPassword)
        this.props.onClickLogin(this.state.userName, this.state.userPassword, userId)
        this.reset()
    }

    private generateUserId(name: string, password: string): string | undefined {
        return (!name || !password) ? undefined : name + "_" + password
    }

    private reset() {
        this.setState({
            userName: '',
            userPassword: ''
        })
    }

    render() {
        return (
            <Modal
                isOpen={this.props.open}
                onDismiss={() => this.props.onDismiss()}
                isBlocking={true}
                containerClassName='blis-modal blis-modal--small blis-modal--border'
            >
                <div className='blis-modal_title'>
                    <span className='ms-font-xxl ms-fontWeight-semilight'>
                        <FormattedMessage
                            id={FM.USERLOGIN_TITLE}
                            defaultMessage="Log In"
                        />
                    </span>
                </div>
                <div>
                    <TextField
                        onKeyDown={this.onKeyDown}
                        onChanged={this.onChangedName}
                        label={this.props.intl.formatMessage({
                            id: 'UserLogin.usernameFieldLabel',
                            defaultMessage: "Name"
                        })}
                        placeholder={this.props.intl.formatMessage({
                            id: 'UserLogin.usernameFieldPlaceholder',
                            defaultMessage: "User Name..."
                        })}
                        value={this.state.userName}
                    />
                    <TextField
                        onKeyDown={this.onKeyDown}
                        onChanged={this.onChangedPassword}
                        type="Password"
                        label={this.props.intl.formatMessage({
                            id: 'UserLogin.passwordFieldLabel',
                            defaultMessage: "Password..."
                        })}
                        placeholder={this.props.intl.formatMessage({
                            id: 'UserLogin.passwordFieldPlaceholder',
                            defaultMessage: "Password..."
                        })}
                        value={this.state.userPassword}
                    />
                </div>
                <div className='blis-modal_buttonbox'>
                    <CommandButton
                        onClick={this.onClickLogin}
                        className='blis-button--gold'
                        ariaDescription={this.props.intl.formatMessage({
                            id: 'UserLogin.loginButtonAriaDescription',
                            defaultMessage: "Log In"
                        })}
                        text={this.props.intl.formatMessage({
                            id: 'UserLogin.loginButtonText',
                            defaultMessage: "Log In"
                        })}
                    />
                </div>
            </Modal>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
    }, dispatch);
}
const mapStateToProps = (state: State) => {
    return {
        user: state.user
    }
}
// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps & InjectedIntlProps;

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(injectIntl(UserLogin));