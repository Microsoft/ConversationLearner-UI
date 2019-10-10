/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as CLM from '@conversationlearner/models'
import * as DialogEditing from './dialogEditing'
import * as OBIUtils from './obiUtils'
import * as Util from './util'
import * as OBITypes from '../types/obiTypes'
import * as stripJsonComments from 'strip-json-comments'

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

// A node in a dialog tree.
class ObiDialogNode {
    readonly dialog: OBITypes.OBIDialog
    intent?: string
    children: ObiDialogNode[]
    constructor(dialog: OBITypes.OBIDialog) {
        this.dialog = dialog
        this.children = []
    }
}

export interface ObiDialogParserResult {
    luMap: Map<string, string[]>
    lgItems: CLM.LGItem[],
    trainDialogs: CLM.TrainDialog[]
    warnings: string[]
}

export class ObiDialogParser {
    private app: CLM.AppBase
    private actions: CLM.ActionBase[] = []
    private entities: CLM.EntityBase[] = []
    private dialogs: Map<string, OBITypes.OBIDialog>
    private lgItems: CLM.LGItem[]
    private luMap: Map<string, string[]>
    private warnings: string[]
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
        this.actions = [...actions]
        this.entities = [...entities]
        this.createActionThunkAsync = createActionThunkAsync
        this.createEntityThunkAsync = createEntityThunkAsync
    }

    // Reads input files; packs data into dialog / LU / LG maps according to file extensions.
    async readDialogFiles(files: File[]) {
        for (const file of files) {
            if (file.name.endsWith('.dialog')) {
                const fileText = await Util.readFileAsync(file)
                const obiDialog: OBITypes.OBIDialog = JSON.parse(stripJsonComments(fileText))
                // Set name, removing suffix
                obiDialog.$id = this.removeSuffix(file.name)
                this.dialogs.set(obiDialog.$id, obiDialog)
            }
            else if (file.name.endsWith('.lu')) {
                const fileText = await Util.readFileAsync(file)
                this.addToLUMap(fileText, this.luMap)
            }
            else if (file.name.endsWith('.lg')) {
                const fileText = await Util.readFileAsync(file)
                CLM.ObiUtils.addToLGMap(fileText, this.lgItems)
            }
            else {
                this.warnings.push(`Expecting .dialog, .lu and .lg files. ${file.name} is of unknown file type`)
            }
        }
    }

    async parse(files: File[]): Promise<ObiDialogParserResult> {
        this.lgItems = []
        this.luMap = new Map()
        this.dialogs = new Map()
        this.warnings = []

        await this.readDialogFiles(files)

        const mainDialog = this.dialogs.get("Entry.main")
        let trainDialogs: CLM.TrainDialog[] = []
        if (!mainDialog) {
            this.warnings.push(`Missing entry point. Expecting a .dialog file called "Entry.main"`)
        } else {
            const rootNode = await this.collectDialogNodes(mainDialog)
            await this.getTrainDialogs(rootNode, trainDialogs)
        }
        return {
            luMap: this.luMap,
            lgItems: this.lgItems,
            trainDialogs,
            warnings: this.warnings
        }
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

    /**
     * Walks the dialog tree from the given node.  Validates types of nodes in the tree and returns an
     * in-memory representation of the tree.
     * Tree construction is slightly complicated since child nodes can be referenced in `rules` or `steps`.
     */
    private async collectDialogNodes(obiDialog: OBITypes.OBIDialog): Promise<ObiDialogNode> {
        let node: ObiDialogNode = new ObiDialogNode(obiDialog)
        if (obiDialog.rules) {
            await this.collectDialogRuleChildren(node, obiDialog.rules)
        }
        if (obiDialog.steps) {
            await this.collectDialogStepChildren(node, obiDialog.steps)
        }
        return node
    }

    // Collects dialog tree nodes from `Microsoft.IntentRule` elements in the dialog `rules` section.
    private async collectDialogRuleChildren(node: ObiDialogNode, rules: OBITypes.MicrosoftIRule[]) {
        for (const rule of rules) {
            if (rule.$type !== OBIRuleType.INTENT_RULE) {
                console.log(`Unhandled OBI rule type: ${rule.$type}`)
                continue
            }
            const intent = rule.intent
            if (!intent) {
                throw new Error(`Rule is missing intent property`)
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
                const subDialog = this.dialogs.get(step.dialog)
                if (!subDialog) {
                    throw new Error(`Dialog name ${step.dialog} undefined`)
                }
                // Add children to train dialog list, if applicable
                const child = await this.collectDialogNodes(subDialog)
                if (child) {
                    // Add this node's intent string to all children.
                    child.intent = intent
                    node.children.push(child)
                }
            }
        }
    }

    /**
     * Collects dialog nodes from dialog-redirecting elements in the dialog `steps` section.
     */
    private async collectDialogStepChildren(node: ObiDialogNode, steps: (string | OBITypes.OBIDialog)[]) {
        for (const step of steps) {
            if (typeof step === "string") {
                throw new Error("Unexected step of type string")
            }
            // Handle any steps that may contain an expansion of the dialog tree.
            // TODO(thpar) : handle Microsoft.SwitchCondition.
            switch (step.$type) {
                case OBIStepType.BEGIN_DIALOG:
                    if (!step.dialog || typeof step.dialog !== "string") {
                        console.log(`Unhandled OBI Type: ${step.$type}`)
                        continue
                    }
                    const subDialog = this.dialogs.get(step.dialog)
                    if (!subDialog) {
                        throw new Error(`Dialog name ${step.dialog} undefined`)
                    }
                    const childDialogs = await this.collectDialogNodes(subDialog)
                    if (childDialogs) {
                        // Add children to train dialog list
                        node.children.push(childDialogs)
                    }
                    break
                default:
                // No child nodes, so nothing to do here.
                // The actions in this step will be handled later.
            }
        }
    }

    // Generates TrainDialog instances from the dialog tree.
    private async getTrainDialogs(node: ObiDialogNode, dialogs: CLM.TrainDialog[]) {
        await this.getTrainDialogsIter(node, [], dialogs)
    }

    // Recursive helper.
    private async getTrainDialogsIter(node: ObiDialogNode, currentRounds: CLM.TrainRound[],
        dialogs: CLM.TrainDialog[]) {
        if (!node) {
            return
        }
        let rounds = [...currentRounds]
        // Build up a training round from any applicable steps in this node.
        const obiDialog = node.dialog
        if (obiDialog.steps) {
            let trainRound = await this.getTrainRoundfromOBIDialogSteps(obiDialog.steps)
            if (trainRound) {
                if (node.intent) {
                    const extractorStep: CLM.TrainExtractorStep = {
                        textVariations: this.getTextVariations(node.intent)
                    }
                    trainRound.extractorStep = extractorStep
                }
                rounds.push(trainRound)
            }
        }
        // This is a leaf node of the conversational tree; build a dialog containing the visited rounds.
        if (!node.children || node.children.length === 0) {
            let dialog = this.makeEmptyTrainDialog()
            dialog.rounds = [...rounds]
            dialogs.push(dialog)
            return
        }
        // This is not a leaf node; continue building up the dialog tree from the rounded visited so far.
        for (const child of node.children) {
            await this.getTrainDialogsIter(child, rounds, dialogs)
        }
    }

    private async getTrainRoundfromOBIDialogSteps(steps: (string | OBITypes.OBIDialog)[]):
        Promise<CLM.TrainRound | undefined> {
        let trainRound: CLM.TrainRound | undefined
        for (const [i, step] of steps.entries()) {
            const nextStep = (i + 1 < steps.length) ? steps[i + 1] : undefined
            if (typeof step === "string" || typeof nextStep === "string") {
                throw new Error("Unexected step of type string")
            }
            switch (step.$type) {
                case OBIStepType.SEND_ACTIVITY: {
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
                    break
                }
                case OBIStepType.TEXT_INPUT: {
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
                    break
                }
                case OBIStepType.HTTP_REQUEST: {
                    if (!trainRound) {
                        trainRound = {
                            extractorStep: { textVariations: [] },
                            scorerSteps: []
                        }
                    }
                    const scorerStep = await this.createActionFromHttpRequest(step, nextStep)
                    trainRound.scorerSteps.push(scorerStep)
                    break
                }
                // TODO(thpar) : handle Microsoft.SwitchCondition.
                case OBIStepType.BEGIN_DIALOG: {
                    // Nothing to do here, the child dialogs were already expanded.
                    break
                }
                default: {
                    if (step.$type !== OBIStepType.END_TURN) {
                        console.log(`Unhandled OBI Type: ${step.$type}`)
                    }
                }
            }
        }
        return trainRound
    }

    private async getScorerStepFromActivity(prompt: string): Promise<CLM.TrainScorerStep> {

        let scoreInput: CLM.ScoreInput = {
            filledEntities: [],
            context: {},
            maskedActions: []
        }

        return {
            importText: prompt,
            input: scoreInput,
            labelAction: CLM.CL_STUB_IMPORT_ACTION_ID,
            logicResult: undefined,
            scoredAction: undefined
        }
    }

    /**
     * HttpRequest represents a RESTful request with known input and output parameters.
     * The .dialog file is expected to have a field `responseFields` that enumerates the top-level
     * output parameters of the response object.  Note that as of 2019.09, this field is specific
     * to ConversationLearner and is not part of the OBI spec.
     */
    private async createActionFromHttpRequest(step: OBITypes.OBIDialog, nextStep: OBITypes.OBIDialog | undefined):
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
            action = await DialogEditing.getOrCreatePlaceholderAPIAction(this.app.appId, step.url,
                isTerminal, this.actions, this.createActionThunkAsync as any)
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
            labelAction: action ? action.actionId : CLM.CL_STUB_IMPORT_ACTION_ID,
            logicResult: undefined,
            scoredAction
        }
    }

    private getTextVariations(intentName: string) {
        let userInputs = this.luMap.get(intentName)
        if (!userInputs) {
            throw new Error(`Intent name ${intentName} undefined`)
        }
        // Programatically fired events have no intent
        // Use intent name for now
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