const selectors = {
    common: {
        spinner: '.cl-spinner',
        dropDownOptions: 'button.ms-Dropdown-item',
    },
    homePage: {
        link: '#uiLink',
    },
    app: {
        container: '.cl-app'
    },
    officePicker: {
        buttonSuggestion: '.ms-Suggestions-itemButton',
        suggestions: '.ms-Suggestions',
        tagItem: '.ms-TagItem',
        tagItemClose: '.ms-TagItem-close',
    },
    models: {
        buttonCreate: '[data-testid=model-list-create-new-button]',
        buttonImport: '[data-testid=model-list-import-model-button]',
        buttonLocalFile: '[data-testid="model-creator-locate-file-button"]',
        name: '[data-testid=model-creator-input-name]',
        submit: '[data-testid=model-creator-submit-button]',
        inputFile: '[data-testid="model-creator-import-file-picker"] input[type="file"]',
    },
    model: {
        name: '[data-testid="app-index-model-name"]',
        buttonNavActions: '[data-testid="app-index-nav-link-actions"]',
        buttonNavEntities: '[data-testid="app-index-nav-link-entities"]',
        buttonNavTrainDialogs: '[data-testid=app-index-nav-link-train-dialogs]',
        buttonNavLogDialogs: '[data-testid="app-index-nav-link-log-dialogs"]',
        buttonNavSettings: '[data-testid="app-index-nav-link-settings"]',
    },
    trainingStatus: {
        completed: '[data-testid="training-status-completed"]',
    },
    entities: {
        buttonCreate: '[data-testid="entities-button-create"]',
        name: '[data-testid="entities-name"]',
    },
    entity: {
        dropDownType: '[data-testid="entity-creator-entity-type-dropdown"]',
        modal: '[data-testid="entity-creator-modal"]',
        name: '[data-testid="entity-creator-entity-name-text"]',
        enumValue: '[data-testid="entity-enum-value"]',
        enumValueName: '[data-testid="entity-enum-value-value-name"][value=""]',
        enumValueButtonDelete: '[data-testid="entity-enum-value-button-delete"]',
        buttonDelete: '[data-testid="entity-button-delete"]',
        buttonCancel: '[data-testid="entity-button-cancel"]',
        buttonSave: '[data-testid="entity-creator-button-save"]',
    },
    actions: {
        buttonNewAction: '[data-testid="actions-button-create"]',
        setEntityResponseText: '[data-testid="actions-list-set-entity"]',
        textResponse: '[data-testid="action-scorer-text-response"]',
    },
    action: {
        dropDownType: '[data-testid="dropdown-action-type"]',
        dropDownEntity: '[data-testid="action-set-entity"]',
        dropDownEnum: '[data-testid="action-set-enum"]',
        dropDownApiCallback: '[data-testid="dropdown-api-option"]',
        dropDownCardTemplate: '[data-testid="action-card-template"]',
        buttonCreate: '[data-testid="action-creator-create-button"]',
        buttonCreateEntity: '[data-testid="action-button-create-entity"]',
        buttonCancel: '[data-testid="action-creator-cancel-button"]',
        buttonDelete: '[data-testid="action-creator-delete-button"]',
        inputResponse: '[data-testid="action-text-response"] [contenteditable="true"]',
        inputRequiredConditions: '[data-testid="action-required-entities"] input',
        inputDisqualifiedConditions: '[data-testid="action-disqualifying-entities"] input',
        inputExpectedEntity: '[data-testid="action-expected-entity"] input',
        tagPickerRequired: '[data-testid="action-required-entities"]',
        tagPickerExpected: '[data-testid="action-expected-entity"]',
        tagPickerDisqualified: '[data-testid="action-disqualifying-entities"]',
        setEntityWarning: '[data-testid="action-set-entity-warning"]',
        nonRemovableTags: '[data-testid="picker-tag-nonRemovable"]',
        checkBoxWaitForResponse: '[data-testid="action-creator-wait-checkbox"] .ms-Checkbox',
        warningNoWaitExpected: '[data-testid="action-warning-nowait-expected"]',
        logicArg: (argName: string) => `[data-testid="action-logic-argument-${argName}"] [contenteditable="true"]`,
        renderArg: (argName: string) => `[data-testid="action-render-argument-${argName}"] [contenteditable="true"]`,
        cardArg: (argName: string) => `[data-testid="action-card-argument-${argName}"] [contenteditable="true"]`,
    },
    actionDeleteModal: {
        deleteTypeA: '[data-testid="action-delete-type"] [data-testid="action-modal-delete-type-a"]',
        deleteTypeB: '[data-testid="action-delete-type"] [data-testid="action-modal-delete-type-b"]',
        buttonConfirm: '[data-testid="action-delete-confirm"]',
        buttonCancel: '[data-testid="confirm-cancel-modal-cancel"]',
    },
    confirmCancelModal: {
        buttonCancel: '[data-testid="confirm-cancel-modal-cancel"]',
        buttonConfirm: '[data-testid="confirm-cancel-modal-accept"]',
        buttonOk: '[data-testid="confirm-cancel-modal-ok"]',
    },
    trainDialogs: {
        descriptions: '[data-testid="train-dialogs-description"]',
        tags: '[data-testid="train-dialogs-tags"] .cl-tags-readonly__tag',
        buttonNew: '[data-testid="button-new-train-dialog"]',
    },
    trainDialog: {
        inputWebChat: 'input[placeholder="Type your message..."]',
        buttonScoreActions: '[data-testid="score-actions-button"]',
        buttonAbandon: '[data-testid="edit-dialog-modal-abandon-delete-button"]',
        buttonSelectAction: '[data-testid="action-scorer-button-clickable"]',
        buttonSave: '[data-testid="edit-teach-dialog-close-save-button"]',
        actionScorerSetEntityActions: '[data-testid="action-scorer-action-set-entity"]',
        actionScorerTextActions: '[data-testid="action-scorer-text-response"]',
        actionScorer: {
            rowField: '[data-automationid="DetailsRowFields"]',
            buttonCreate: '[data-testid="action-scorer-add-action-button"]',
        },
    },
    mergeModal: {
        title: '[data-testid="merge-modal-title"]',
        buttonMerge: '[data-testid="merge-modal-merge-button"]',
        buttonSaveAsIs: '[data-testid="merge-modal-save-as-is-button"]',
    },
    dialogModal: {
        container: '.cl-modal',
        branchButton: '[data-testid="edit-dialog-modal-branch-button"]',
        branchInput: '[data-testid="user-input-modal-new-message-input"]',
        branchSubmit: '[data-testid="app-create-button-submit"]',
        buttonCloseSave: '[data-testid="edit-teach-dialog-close-save-button"]',
        buttonScoreActionsButton: '[data-testid="score-actions-button"]',
        buttonSaveAsTrainDialog: '[data-testid="footer-button-done"]',
        buttonAddTag: '[data-testid="train-dialog-tags"] .cl-tags__button-add',
        inputDescription: '[data-testid="train-dialog-description"]',
        inputTag: '[data-testid="train-dialog-tags"] .cl-tags__form input',
        tags: '[data-testid="train-dialog-tags"] .cl-tags__tag span',
        tagsControl: '[data-testid="train-dialog-tags"]',
        webChatUtterances: 'div[data-testid="web-chat-utterances"] > div.wc-message-content > div > div.format-markdown > p',
        entityConflictModal: {
            modal: '[data-testid="extract-conflict-modal-conflicting-labels"]',
            buttonAccept: '[data-testid="entity-conflict-accept"]',
            buttonCancel: '[data-testid="entity-conflict-cancel"]',
        },
        error: '[data-testid="dialog-modal-error-noselection"]',
        warning: '[data-testid="dialog-modal-warning"]',
    },
    logDialogs: {
        buttonCreate: '[data-testid="log-dialogs-new-button"]',
        description: '[data-testid="log-dialogs-description"]',
    },
    logDialog: {
        buttonDone: '[data-testid="chat-session-modal-done-testing-button"]',
        inputMessage: 'input[placeholder="Type your message..."]',
    },
    logConversionConflictsModal: {
        modal: '[data-testid="log-conversion-conflicts-modal"]',
        conflictButtons: '[data-testid^="log-conversion-conflicts-conflict"]',
        conflict1: '[data-testid="log-conversion-conflicts-conflict-1"]',
        conflict2: '[data-testid="log-conversion-conflicts-conflict-2"]',
        buttonNext: '[data-testid="log-conversion-conflicts-modal-next"]',
        buttonPrevious: '[data-testid="log-conversion-conflicts-modal-previous"]',
        buttonAbort: '[data-testid="log-conversion-conflicts-modal-cancel"]',
        buttonAccept: '[data-testid="log-conversion-conflicts-modal-accept"]',
    },
    chatModal: {
        container: '.cl-sessionmodal',
        buttonDone: '[data-testid="chat-session-modal-done-testing-button"]',
    },
    extractionEditor: {
        inputAlternateText: '[data-testid="entity-extractor-alternative-input-text"]',
        overlay: '.entity-labeler-overlay',
        customButton: '[data-testid="custom-entity-name-button"]',
        customNode: '.cl-entity-node--custom',
        nodeIndicator: '.cl-entity-node-indicator',
        buttonRemoveLabel: '[data-testid="entity-extractor-button-remove-label"]',
        buttonSubmitChanges: '[data-testid="submit-changes-button"]',
        buttonCreate: '[data-testid="entity-extractor-create-button"]',
        slateEditor: '[data-slate-editor="true"]',
        tokenNode: '[data-testid="token-node-entity-value"]',
    },
    entityPicker: {
        inputSearch: '[data-testid="entity-picker-entity-search"]',
        buttonNew: '[data-testid="entity-picker-button-new"]',
        options: '.custom-toolbar .custom-toolbar__results .custom-toolbar__result',
    },
    webChat: {
        messageFromBot: '.wc-message-from-bot',
        messageFromBotException: '.wc-border-error-from-bot',
        messageFromMe: '.wc-message-from-me',
        messageFromMeException: '.wc-border-error-from-me',
        messageColorException: '.wc-message-color-exception',
        messageDownArrow: '.wc-message-downarrow',
        buttonAddAction: '[data-testid="chat-edit-add-bot-response-button"]',
        buttonAddInput: '[data-testid="chat-edit-add-user-input-button"]',
        buttonBranch: '[data-testid="edit-dialog-modal-branch-button"]',
    },
    settings: {
        buttonNewVersion: '[data-testid="settings-button-new-version"]',
        buttonSave: '[data-testid="settings-button-save"]',
        buttonDiscard: '[data-testid="settings-button-discard"]',
        inputModelName: '[data-testid="settings-input-model-name"]',
    },
    packageCreatorModal: {
        modal: '[data-testid="package-creator-modal"]',
        inputVersionName: '[data-testid="package-creator-input-version-name"]',
        buttonCreate: '[data-testid="package-creator-button-create"]',
        buttonCancel: '[data-testid="package-creator-button-cancel"]',
    },
    payloadEditor: {
        mentionNodeCompleted: '.mention-node--completed',
    }
}

export default selectors