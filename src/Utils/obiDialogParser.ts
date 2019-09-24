/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as CLM from '@conversationlearner/models'
import * as DialogEditing from './dialogEditing'
import * as OBIUtils from './obiUtils'
import * as Util from './util'
import { OBIDialog } from '../types/obiTypes'

enum OBIStepType {
    BEGIN_DIALOG = "Microsoft.BeginDialog",
    END_TURN = "Microsoft.EndTurn",
    HTTP_REQUEST = "Microsoft.HttpRequest",
    SEND_ACTIVITY = "Microsoft.SendActivity",
    TEXT_INPUT = "Microsoft.TextInput"
}

enum OBIRuleType {
    INTENT_RULE = "Microsoft.IntentRule"
}

export class ObiDialogParser {
    private app: CLM.AppBase
    private composerDialog: OBIUtils.ComposerDialog
    private actions: CLM.ActionBase[] = []
    private entities: CLM.EntityBase[] = []
    private createActionThunkAsync: (appId: string, action: CLM.ActionBase) => Promise<CLM.ActionBase | null>
    private createEntityThunkAsync: (appId: string, entity: CLM.EntityBase) => Promise<CLM.EntityBase | null>

    constructor(
        app: CLM.AppBase,
        actions: CLM.ActionBase[],
        entities: CLM.EntityBase[],
        createActionThunkAsync: (appId: string, action: CLM.ActionBase) => Promise<CLM.ActionBase | null>,
        createEntityThunkAsync: (appId: string, entity: CLM.EntityBase) => Promise<CLM.EntityBase | null>
    ) {
        this.app = app
        this.actions = actions
        this.entities = entities
        this.createActionThunkAsync = createActionThunkAsync
        this.createEntityThunkAsync = createEntityThunkAsync
    }

    async getTrainDialogs(files: File[]): Promise<CLM.TrainDialog[] | null> {

        const dialogs: OBIDialog[] = []
        const luMap: Map<string, string[]> = new Map()
        const lgMap: Map<string, CLM.LGItem> = new Map()
        for (const file of files) {
            if (file.name.endsWith('.dialog')) {
                const fileText = await Util.readFileAsync(file)
                const obiDialog: OBIDialog = JSON.parse(fileText)
                // Set name, removing suffix
                obiDialog.$id = this.removeSuffix(file.name)
                dialogs.push(obiDialog)
            }
            else if (file.name.endsWith('.lu')) {
                const fileText = await Util.readFileAsync(file)
                this.addToLUMap(fileText, luMap)
            }
            else if (file.name.endsWith('.lg')) {
                const fileText = await Util.readFileAsync(file)
                CLM.ObiUtils.addToLGMap(fileText, lgMap)
            }
            else {
                throw new Error(`Expecting .dialog, .lu and .lg files. ${file.name} is of unknown file type`)
            }
        }

        this.composerDialog = {
            dialogs,
            luMap,
            lgMap
        }

        const mainDialog = this.composerDialog.dialogs.find(d => d.$id === "Entry.main")
        if (!mainDialog) {
            return null
        }

        return this.getTrainDialogsfromOBIDialog(mainDialog)
    }

    private addToLUMap(text: string, luMap: Map<string, string[]>): any {
        const keys = text.split('##')
        for (const key of keys) {
            if (!key.startsWith(">")) {
                const inputs = key.split('- ').map(i => i.trim())
                luMap.set(inputs[0], inputs.slice(1))
            }
        }
        return luMap
    }

    private async getTrainDialogsfromOBIDialog(obiDialog: OBIDialog): Promise<CLM.TrainDialog[]> {

        let trainDialogs: CLM.TrainDialog[] = []
        if (obiDialog.rules) {
            for (const rule of obiDialog.rules) {
                if (rule.$type === OBIRuleType.INTENT_RULE) {

                    const textVariations = this.getTextVariations(rule.intent!)
                    const extractorStep: CLM.TrainExtractorStep = {
                        textVariations: textVariations
                    }
                    if (!rule.steps) {
                        continue
                    }
                    for (const step of rule.steps) {
                        if (typeof step === "string") {
                            throw new Error("Unexpected string step")
                        }
                        if (step.$type !== OBIStepType.BEGIN_DIALOG || typeof step.dialog !== "string") {
                            console.log(`Unhandled OBI Type: ${step.$type}`)
                            continue
                        }
                        const subDialog = this.composerDialog.dialogs.find(d => d.$id === step.dialog)
                        if (!subDialog) {
                            throw new Error(`Dialog name ${step.dialog} undefined`)
                        }
                        const childDialogs = await this.getTrainDialogsfromOBIDialog(subDialog)
                        // Add extractor step to all the children
                        childDialogs.forEach(td => {
                            td.rounds[0].extractorStep = extractorStep
                        })
                        // Add children to train dialog list
                        trainDialogs = [...trainDialogs, ...childDialogs]
                    }
                }
            }
        }
        let trainRound: CLM.TrainRound | undefined
        if (obiDialog.steps) {
            for (const [i, step] of obiDialog.steps.entries()) {
                const nextStep = (i + 1 < obiDialog.steps.length) ? obiDialog.steps[i + 1] : undefined
                if (typeof step === "string" || typeof nextStep === "string") {
                    throw new Error("Unexected step of type string")
                }
                if (step.$type === OBIStepType.SEND_ACTIVITY) {
                    if (!trainRound) {
                        trainRound = {
                            extractorStep: { textVariations: [] },
                            scorerSteps: []
                        }
                    }
                    if (!step.activity) {
                        throw new Error("Expected activity to be set")
                    }
                    const scorerStep = await this.getScorerStepFromActivity(step.activity)
                    trainRound.scorerSteps.push(scorerStep)
                }
                else if (step.$type === OBIStepType.TEXT_INPUT) {
                    if (!trainRound) {
                        trainRound = {
                            extractorStep: { textVariations: [] },
                            scorerSteps: []
                        }
                    }
                    if (!step.prompt) {
                        throw new Error("Expected activity to be set")
                    }
                    const scorerStep = await this.getScorerStepFromActivity(step.prompt)
                    trainRound.scorerSteps.push(scorerStep)
                }
                else if (step.$type === OBIStepType.HTTP_REQUEST) {
                    if (!trainRound) {
                        trainRound = {
                            extractorStep: { textVariations: [] },
                            scorerSteps: []
                        }
                    }
                    const scorerStep = await this.createActionFromHttpRequest(step, nextStep)
                    trainRound.scorerSteps.push(scorerStep)
                }
                else if (step.$type === OBIStepType.BEGIN_DIALOG) {
                    const subDialog = this.composerDialog.dialogs.find(d => d.$id === step.dialog)
                    if (!subDialog) {
                        throw new Error(`Dialog name ${step.dialog} undefined`)
                    }

                    const childDialogs = await this.getTrainDialogsfromOBIDialog(subDialog)

                    // Add children to train dialog list
                    trainDialogs = [...trainDialogs, ...childDialogs]
                }
                else if (step.$type !== OBIStepType.END_TURN) {
                    console.log(`Unhandled OBI Type: ${step.$type}`)
                }
            }
            if (trainRound) {
                if (trainDialogs.length === 0) {
                    trainDialogs.push(this.makeEmptyTrainDialog())
                }
                for (const td of trainDialogs) {
                    // If susequent round has no extractor step, just prepend scorer steps
                    if (td.rounds.length > 0 && td.rounds[0].extractorStep.textVariations.length === 0) {
                        td.rounds[0].scorerSteps = [...trainRound.scorerSteps, ...td.rounds[0].scorerSteps]
                    }
                    // Otherwise prepend round
                    else {
                        td.rounds = [trainRound, ...td.rounds]
                    }
                }
            }
        }
        return trainDialogs
    }

    private async getScorerStepFromActivity(prompt: string): Promise<CLM.TrainScorerStep> {
        const parsedActivity = prompt.substring(prompt.indexOf("[") + 1, prompt.lastIndexOf("]")).trim()
        let response = this.composerDialog.lgMap.get(parsedActivity)
        if (!response) {
            // LARS thow error once CCI .dialog transformer has been fixed
            response = { text: "Can't Parse LG", suggestions: [] }
            //throw new Error(`LG name ${prompt} undefined`)
        }

        let scoreInput: CLM.ScoreInput = {
            filledEntities: [],
            context: {},
            maskedActions: []
        }

        const importText = response.suggestions.length > 0 ? JSON.stringify(response) : response.text
        return {
            importText,
            input: scoreInput,
            labelAction: CLM.CL_STUB_IMPORT_ACTION_ID,
            logicResult: undefined,  // LARS handle api calls
            scoredAction: undefined
        }
    }

    /**
     * HttpRequest represents a RESTful request with known input and output parameters.
     * The .dialog file is expected to have a field `responseFields` that enumerates the top-level
     * output parameters of the response object.  Note that as of 2019.09, this field is specific
     * to ConversationLearner and is not part of the OBI spec.
     */
    private async createActionFromHttpRequest(step: OBIDialog, nextStep: OBIDialog | undefined):
        Promise<CLM.TrainScorerStep> {
        if (!step.url) {
            throw new Error('HTTP requests require url')
        }
        // TODO(thpar) : revisit logic for this.
        const isTerminal = (!nextStep || nextStep.$type === OBIStepType.TEXT_INPUT ||
            nextStep.$type === OBIStepType.END_TURN)
        const hashText = JSON.stringify(step)
        let action: CLM.ActionBase | undefined | null = OBIUtils.findActionFromHashText(hashText, this.actions)
        if (!action && this.createActionThunkAsync) {
            action = await DialogEditing.getPlaceholderAPIAction(this.app.appId, step.url, isTerminal,
                this.actions, this.createActionThunkAsync as any)
        }
        // Create an entity for each output parameter in the action.
        let actionOutputEntities: OBIUtils.OBIActionOutput[] = []
        if (step.responseFields) {
            actionOutputEntities = step.responseFields.map(
                (field) => { return { entityName: field } }
            )
        }
        const filledEntities = await OBIUtils.importActionOutput(actionOutputEntities, this.entities, this.app,
            this.createEntityThunkAsync)
        const scoreInput: CLM.ScoreInput = {
            filledEntities,
            context: {},
            maskedActions: []
        }
        // Create a scored action for this action; this will allow the action to be matched during import.
        let scoredAction: CLM.ScoredAction | undefined
        if (action) {
            scoredAction = {
                actionId: action.actionId,
                payload: action.payload,
                isTerminal: action.isTerminal,
                actionType: CLM.ActionTypes.API_LOCAL,
                score: 1
            }
        }
        return {
            importText: undefined,
            input: scoreInput,
            labelAction: CLM.CL_STUB_IMPORT_ACTION_ID,
            logicResult: undefined,
            scoredAction
        }
    }

    private getTextVariations(intentName: string) {
        let userInputs = this.composerDialog.luMap.get(intentName)
        if (!userInputs) {
            throw new Error(`Intent name ${intentName} undefined`)
        }
        // Programatically fired events have no intent
        // Use intent name for now LARS
        if (userInputs.length === 0) {
            userInputs = [intentName]
        }
        userInputs = userInputs.slice(0, CLM.MAX_TEXT_VARIATIONS)
        const textVariations: CLM.TextVariation[] = []
        userInputs.forEach(input => {
            textVariations.push({
                text: input,
                labelEntities: []
            })
        })
        return textVariations
    }

    private makeEmptyTrainDialog(): CLM.TrainDialog {
        return {
            trainDialogId: undefined!,
            version: undefined!,
            packageCreationId: undefined!,
            packageDeletionId: undefined!,
            sourceLogDialogId: undefined!,
            initialFilledEntities: [],
            rounds: [],
            tags: [],
            description: '',
            createdDateTime: new Date().toJSON(),
            lastModifiedDateTime: new Date().toJSON(),
            // It's initially invalid
            validity: CLM.Validity.INVALID,
        }
    }

    private removeSuffix(text: string): string {
        let name = text.split('.')
        name.pop()
        return name.join('.')
    }
}