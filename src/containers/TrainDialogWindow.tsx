import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Nav, INavLink, INavLinkGroup, Link, CommandButton } from 'office-ui-fabric-react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { State } from '../types';
import { DisplayMode } from '../types/const';
import Webchat from './Webchat'
import TrainDialogAdmin from './TrainDialogAdmin'
import { Session, ActionBase } from 'blis-models'
import { deleteChatSessionAsync } from '../actions/deleteActions'
import { createChatSessionAsync } from '../actions/createActions'
import { setCurrentTrainDialog, setCurrentTeachSession, setDisplayMode } from '../actions/displayActions'
import { Activity } from 'botframework-directlinejs';


class TrainDialogWindow extends React.Component<Props, any> {
    constructor(p: any) {
        super(p);
        this.state = {
            chatSession : new Session({saveToLog : true})
        }
    }
    componentWillMount() {
        let currentAppId: string = this.props.apps.current.appId;
        this.props.createChatSession(this.props.userKey, this.state.chatSession, currentAppId);
    }
    handleQuit() {
        this.props.setDisplayMode(DisplayMode.AppAdmin);
    }
    generateHistory() : Activity[] {
        if (!this.props.trainDialog) {
            return null;
        }
        let activities = [];
        let roundNum = 0;
        for (let round of this.props.trainDialog.rounds) {
            let userText = round.extractorStep.textVariations[0].text;
            let id = `${roundNum}:0`;
            let userActivity = {id: id, from: {id: this.props.user.id, name: this.props.user.name}, type: "message", text: userText} as Activity;
            activities.push(userActivity);

            let scoreNum = 0;
            for (let scorerStep of round.scorerSteps) {
                let labelAction = scorerStep.labelAction;
                let action = this.props.actions.filter((a: ActionBase) => a.actionId == labelAction)[0]; 
                id = `${roundNum}:${scoreNum}`
                let botActivity = {id: id, from: {id:"BlisTrainer", name: "BlisTrainer"}, type: "message", text: action.payload} as Activity;
                activities.push(botActivity);
                scoreNum++;
            }
            roundNum++;
        }
        return activities;
    }
    render() {
        let history = this.generateHistory();
        return (
            <Modal
                isOpen={this.props.error == null}
                isBlocking={true}
                containerClassName='teachModal'>
                <div className="wc-gridContainer">
                    <div className="wc-gridWebchat">
                        <Webchat sessionType={"chat"} history={history} />
                    </div>
                    <div className="wc-gridAdmin">
                        <div className="wc-gridAdminContent">
                            <TrainDialogAdmin />
                        </div>
                        <div className="wc-gridFooter">
                        <CommandButton
                            data-automation-id='randomID16'
                            disabled={false}
                            onClick={this.handleQuit.bind(this)}
                            className='ms-font-su goldButton teachSessionHeaderButton'
                            ariaDescription='Done'
                            text='Done'
                        />
                        </div>    
                    </div>
                </div>
            </Modal>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        createChatSession: createChatSessionAsync,
        deleteChatSession: deleteChatSessionAsync,
        setDisplayMode: setDisplayMode
    }, dispatch);
}
const mapStateToProps = (state: State) => {
    return {
        chatSession: state.chatSessions,
        userKey: state.user.key,
        apps: state.apps,
        user: state.user,
        error: state.error.error,
        trainDialog: state.trainDialogs.current,
        actions: state.actions
    }
}
// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

export default connect(mapStateToProps, mapDispatchToProps)(TrainDialogWindow);
