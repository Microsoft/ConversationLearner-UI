import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../../types'
import { PredictedEntity, LabeledEntity, ExtractResponse, TextVariation, ExtractType } from 'blis-models'
import { CommandButton } from 'office-ui-fabric-react';
import TextVariationCreator from '../TextVariationCreator';
import ExtractorResponseEditor from '../ExtractorResponseEditor';
import EntityCreatorEditor from './EntityCreatorEditor';
import { TeachMode } from '../../types/const'
import PopUpMessage from '../PopUpMessage';
import { clearExtractResponses, updateExtractResponse, removeExtractResponse } from '../../actions/teachActions'

interface ComponentState {
    entityModalOpen: boolean,
    popUpOpen: boolean, 
    textVariations: TextVariation[]
};

// TODO: Need to re-define TextVariaion / ExtractResponse class defs so we don't need
// to do all the messy conversion back and forth
class EntityExtractor extends React.Component<Props, ComponentState> {
    constructor(p: any) {
        super(p)
        this.state = {
            entityModalOpen: false,
            popUpOpen: false,
            textVariations: []
        }
        this.entityButtonOnClick = this.entityButtonOnClick.bind(this);
        this.onClickDoneExtracting = this.onClickDoneExtracting.bind(this);
        this.entityEditorHandleClose = this.entityEditorHandleClose.bind(this);
        this.onRemoveExtractResponse = this.onRemoveExtractResponse.bind(this)
        this.onUpdateExtractResponse = this.onUpdateExtractResponse.bind(this)
    }
    componentWillMount() {
        this.setState({textVariations : this.props.textVariations})
    }

    componentDidMount() {
        findDOMNode<HTMLButtonElement>(this.refs.doneExtractingButton).focus();
    }
    componentDidUpdate() {
        // If not in interactive mode run scorer automatically
        if (this.props.autoTeach && this.props.teachMode == TeachMode.Extractor) {
            this.onClickDoneExtracting();
        }
    }
    componentWillReceiveProps(newProps: Props) {
        // If I'm swiching my round, clear any extracted responses
        if (this.props.sessionId != newProps.sessionId || this.props.turnIndex != newProps.turnIndex) {
           this.props.clearExtractResponses();
        }
        if (this.props.textVariations != this.state.textVariations) {
            this.setState({textVariations : this.props.textVariations})
        }
    }
    entityEditorHandleClose() {
        this.setState({
            entityModalOpen: false
        })
    }
    entityButtonOnClick() {
        this.setState({
            entityModalOpen: true
        })
    }
    handleClosePopUpModal() {
        this.setState({
            popUpOpen: false
        })
    }
    handleOpenPopUpModal() {
        this.setState({
            popUpOpen: true
        })
    }
    /** Returns true is predicted entities match */
    isValid(primaryResponse: ExtractResponse, extractResponse: ExtractResponse): boolean {
        let missing = primaryResponse.predictedEntities.filter(item =>
            !extractResponse.predictedEntities.find(er => item.entityId == er.entityId));

        if (missing.length > 0) {
            return false;
        }
        missing = extractResponse.predictedEntities.filter(item =>
            !primaryResponse.predictedEntities.find(er => item.entityId == er.entityId));
        if (missing.length > 0) {
            return false;
        }
        return true;
    } 
    allValid(extractResponses : ExtractResponse[]): boolean {
        for (let extractResponse of extractResponses) {
            if (extractResponse != extractResponses[0]) {
                if (!this.isValid(extractResponses[0], extractResponse)) {
                    return false;
                }
            }
        }
        return true;
    }
    toLabeledEntities(predictedEntities : PredictedEntity[]) : LabeledEntity[] {
        let labeledEntities : LabeledEntity[] = [];
        for (let predictedEntity of predictedEntities)
        {
            let labelEntity = new LabeledEntity({
                startCharIndex: predictedEntity.startCharIndex,
                endCharIndex: predictedEntity.endCharIndex,
                entityId: predictedEntity.entityId,
                entityName: predictedEntity.entityName,
                entityText: predictedEntity.entityText
            });
            labeledEntities.push(labelEntity);
        }
        return labeledEntities;
    }
    toPredictedEntities(labeledEntities : LabeledEntity[]) : PredictedEntity[] {
        let predictedEntities : PredictedEntity[] = [];
        for (let labeledEntity of labeledEntities)
        {
            let predictedEntity = new PredictedEntity({
                startCharIndex: labeledEntity.startCharIndex,
                endCharIndex: labeledEntity.endCharIndex,
                entityId: labeledEntity.entityId,
                entityName: labeledEntity.entityName,
                entityText: labeledEntity.entityText
            });
            predictedEntities.push(predictedEntity);
        }
        return predictedEntities;
    }
    toTextVariation(extractResponse: ExtractResponse) : TextVariation {

        let labeledEntities = this.toLabeledEntities(extractResponse.predictedEntities);
        let textVariation = new TextVariation({
            text: extractResponse.text,
            labelEntities: labeledEntities
        });
        return textVariation;
    }
    toExtractResponses(textVariations: TextVariation[]) : ExtractResponse[] {
        let extractResponses : ExtractResponse[] = [];
        for (let textVariation of textVariations)
        {
            let predictedEntities = this.toPredictedEntities(textVariation.labelEntities);
            let extractResponse = new ExtractResponse({
                text: textVariation.text,
                predictedEntities: predictedEntities
            });
            extractResponses.push(extractResponse);
        }
        return extractResponses;
    }
    // Return merge of extract responses and text variations
    allResponses() : ExtractResponse[] {
        let convertedVariations = this.toExtractResponses(this.state.textVariations as TextVariation[]);
        let allResponses = [...convertedVariations, ...this.props.extractResponses];
        return allResponses;
    }
    onClickDoneExtracting() {
        let allResponses = this.allResponses();

        if (!this.allValid(allResponses)) {
            this.handleOpenPopUpModal();
            return;
        }

        let textVariations: TextVariation[] = [];
        for (let extractResponse of allResponses) {
            let labeledEntities = this.toLabeledEntities(extractResponse.predictedEntities);
            textVariations.push(new TextVariation({ text: extractResponse.text, labelEntities: labeledEntities }));
        }     
        this.props.onTextVariationsExtracted(allResponses[0], textVariations, this.props.turnIndex);
    }
    onRemoveExtractResponse(extractResponse: ExtractResponse) : void {
        // First look at extract reponses
        let foundResponse = this.props.extractResponses.find(e => e.text == extractResponse.text);
        if (foundResponse) {
            this.props.removeExtractResponse(foundResponse);
            return;
        }
        // Remove from text variations
        let newVariations = this.state.textVariations.filter((v : TextVariation) => v.text != extractResponse.text);
        this.setState({textVariations: newVariations});
    }
    onUpdateExtractResponse(extractResponse: ExtractResponse) : void {
        // First look at extract reponses
        let foundResponse = this.props.extractResponses.find(e => e.text == extractResponse.text);
        if (foundResponse) {
            this.props.updateExtractResponse(extractResponse);
            return;
        }
        
        // Replace existing text variation (if any) with new one and maintain ordering
        let index = this.state.textVariations.findIndex((v : TextVariation) => v.text == extractResponse.text);
        if (index < 0) {
            // Should never happen, but protect just in case
            return;
        }
        let newVariation = this.toTextVariation(extractResponse);
        let newVariations = [...this.state.textVariations];
        newVariations[index] = newVariation;
        this.setState({textVariations: newVariations});
    }
    render() {
        let allResponses = this.allResponses();
        if (!allResponses[0]) {
            return null;
        }

        // Don't show edit components when in auto TACH or on score step
        let canEdit = (!this.props.autoTeach && this.props.teachMode == TeachMode.Extractor);

        let variationCreator = null;
        let addEntity = null;
        let editComponents = null;
        let extractDisplay = null;
        if (canEdit) {
            variationCreator = <TextVariationCreator
                appId={this.props.appId}
                sessionId={this.props.sessionId}
                extractType={this.props.extractType}
                turnIndex={this.props.turnIndex} />
            addEntity =
                <CommandButton
                    className="blis-button--gold teachCreateButton"
                    onClick={this.entityButtonOnClick}
                    ariaDescription='Cancel'
                    text='Entity'
                    iconProps={{ iconName: 'CirclePlus' }}
                />
            editComponents =
                <div>
                    <CommandButton
                        onClick={this.onClickDoneExtracting}
                        className='ms-font-su blis-button--gold'
                        ariaDescription={this.props.extractButtonName}
                        text={this.props.extractButtonName}
                        ref="doneExtractingButton"
                    />

                    <EntityCreatorEditor
                        open={this.state.entityModalOpen}
                        entity={null}
                        handleClose={this.entityEditorHandleClose} />
                </div>

            let key = 0;
            extractDisplay = [];
            for (let extractResponse of allResponses) {
                let isValid = true;
                if (extractResponse != allResponses[0]) {
                    isValid = this.isValid(allResponses[0], extractResponse);
                }

                extractDisplay.push(<ExtractorResponseEditor
                    canEdit={canEdit}
                    key={key++}
                    isPrimary={key == 1}
                    isValid={isValid}
                    extractResponse={extractResponse}
                    updateExtractResponse={extractResponse => this.onUpdateExtractResponse(extractResponse)}
                    removeExtractResponse={extractResponse => this.onRemoveExtractResponse(extractResponse)}
                />);
            }
        }
        else {
            // Only display primary response if not in edit mode
            const extractResponse = allResponses[0]
            extractDisplay = <ExtractorResponseEditor
                canEdit={canEdit}
                key={0}
                isPrimary={true}
                isValid={true}
                extractResponse={extractResponse}
                updateExtractResponse={extractResponse => this.onUpdateExtractResponse(extractResponse)}
                removeExtractResponse={extractResponse => this.onRemoveExtractResponse(extractResponse)}
            />
        }

        return (
            <div>
                <div>
                    <div className='teachTitleBox'>
                        <div className='ms-font-l teachTitle'>Entity Detection</div>
                        {addEntity}
                    </div>
                    {extractDisplay}
                    {variationCreator}
                </div>
                {editComponents}
                <PopUpMessage open={this.state.popUpOpen} onConfirm={() => this.handleClosePopUpModal()} title="Text variations must all have same tagged entities." />
            </div>
        )
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateExtractResponse,
        removeExtractResponse,
        clearExtractResponses
    }, dispatch);
}
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        user: state.user,
        entities: state.entities,
        extractResponses: state.teachSessions.extractResponses
    }
}

export interface ReceivedProps {
    appId: string,
    extractType: ExtractType,
    sessionId: string,
    turnIndex: number,
    autoTeach: boolean
    teachMode: TeachMode
    textVariations: TextVariation[],
    extractButtonName: string,
    onTextVariationsExtracted: (extractResponse: ExtractResponse, textVariations: TextVariation[], turnIndex: number) => void
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps;

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(EntityExtractor);
