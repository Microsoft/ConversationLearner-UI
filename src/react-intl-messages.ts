export enum FM {
    ABOUT_TITLE = 'About.title',
    DOCS_TITLE = 'Docs.title',
    SUPPORT_TITLE = 'Support.title',
    NOMATCH_TITLE = 'NoMatch.title',
    NOMATCH_HOME = 'NoMatch.home',
    PAGE_COMINGSOON = 'page.comingsoon',

    // Actions
    ACTIONS_TITLE = 'Actions.title',
    ACTIONS_SUBTITLE = 'Actions.subtitle',
    ACTIONS_CREATEBUTTONARIALDESCRIPTION = 'Actions.createButtonAriaDescription',
    ACTIONS_CREATEBUTTONTITLE = 'Actions.createButtonTitle',
    ACTIONS_CONFIRMDELETEMODALTITLE = 'Actions.confirmDeleteModalTitle',

    // App
    APP_HEADER_HOME = 'App.header.home',
    APP_HEADER_ABOUT = 'App.header.about',
    APP_HEADER_DOCS = 'App.header.docs',
    APP_HEADER_SUPPORT = 'App.header.support',

    // TrainingStatus
    APP_TRAINING_STATUS_STATUS = 'TrainingStatus.status.label',
    APP_TRAINING_STATUS_UNKNOWN = 'TrainingStatus.status.unknown',
    APP_TRAINING_STATUS_QUEUED = 'TrainingStatus.status.queued',
    APP_TRAINING_STATUS_RUNNING = 'TrainingStatus.status.running',
    APP_TRAINING_STATUS_COMPLETED = 'TrainingStatus.status.completed',
    APP_TRAINING_STATUS_FAILED = 'TrainingStatus.status.failed',
    APP_TRAINING_STATUS_LAST_UPDATE = 'TrainingStatus.lastupdate',
    APP_TRAINING_STATUS_REFRESH = 'TrainingStatus.refresh',
    APP_TRAINING_STATUS_EXPIRED = 'TrainingStatus.expired',

    // Apps List
    APPSLIST_TITLE = 'AppsList.title',
    APPSLIST_SUBTITLE = 'AppsList.subtitle',
    APPSLIST_CREATEBUTTONARIADESCRIPTION = 'AppsList.createButtonAriaDescription',
    APPSLIST_CREATEBUTTONTEXT = 'AppsList.createButtonText',
    APPSLIST_CONFIRMDELETEMODALTITLE = 'AppsList.confirmDeleteModalTitle',
    APPSLIST_COLUMN_NAME = 'AppsList.columns.name',
    APPSLIST_COLUMNS_LOCALE = 'AppsList.columns.locale',
    APPSLIST_COLUMNS_LINKEDBOTS = 'AppsList.columns.linkedBots',
    APPSLIST_COLUMNS_ACTIONS = 'AppsList.columns.actions',

    // Dashboard
    DASHBOARD_TITLE = 'Dashboard.title',
    DASHBOARD_SUBTITLE = 'Dashboard.subtitle',

    // Entities
    ENTITIES_TITLE = 'Entities.title',
    ENTITIES_SUBTITLE = 'Entities.subtitle',
    ENTITIES_CREATEBUTTONARIALDESCRIPTION = 'Entities.createButtonAriaDescription',
    ENTITIES_CREATEBUTTONTEXT = 'Entities.createButtonText',
    ENTITIES_COLUMNS_NAME = 'Entities.columns.name',
    ENTITIES_COLUMNS_TYPE = 'Entities.columns.type',
    ENTITIES_COLUMNS_IS_PROGRAMMATIC = 'Entities.columns.isProgrammatic',
    ENTITIES_COLUMNS_IS_BUCKETABLE = 'Entities.columns.isBucketable',
    ENTITIES_COLUMNS_IS_NEGATABLE = 'Entities.columns.isNegatable',
    ENTITIES_CONFIRMDELETEMODALTITLE = 'Entities.confirmDeleteModalTitle',
    ENTITIES_DELETEWARNINGTITLE = 'Entities.deleteWarningTitle',
    ENTITIES_DELETEWARNINGPRIMARYBUTTONTEXT = 'Entities.deleteWarningPrimaryButtonText',

    // LogDialogs
    LOGDIALOGS_TITLE = 'LogDialogs.title',
    LOGDIALOGS_SUBTITLE = 'LogDialogs.subtitle',
    LOGDIALOGS_CREATEBUTTONTITLE = 'LogDialogs.createButtonTitle',
    LOGDIALOGS_CREATEBUTTONARIALDESCRIPTION = 'LogDialogs.createButtonAriaDescription',
    LOGDIALOGS_SESSIONCREATIONWARNING_TITLE = 'LogDialogs.sessionCreationWarning.title',
    LOGDIALOGS_SESSIONCREATIONWARNING_PRIMARYBUTTON = 'LogDialogs.sessionCreationWarning.primaryButton',
    LOGDIALOGS_FIRSTINPUT = 'LogDialogs.firstInput',
    LOGDIALOGS_LASTINPUT = 'LogDialogs.lastInput',
    LOGDIALOGS_LASTRESPONSE = 'LogDialogs.lastResponse',
    LOGDIALOGS_TURNS = 'LogDialogs.turns',

    // Settings
    SETTINGS_TITLE = 'Settings.title',
    SETTINGS_SUBTITLE = 'Settings.subtitle',
    SETTINGS_FIELDERROR_REQUIREDVALUE = 'Settings.fieldError.requiredValue',
    SETTINGS_FIELDERROR_ALPHANUMERIC = 'Settings.fieldError.alphanumeric',
    SETTINGS_FIELDERROR_DISTINCT = 'Settings.fieldError.distinct',
    SETTINGS_FIELDS_NAMELABEL = 'Settings.fields.nameLabel',
    SETTINGS_FILEDS_APPIDLABEL = 'Settings.fields.appIdLabel',
    SETTINGS_PASSWORDHIDDEN = 'Settings.passwordHidden',
    SETTINGS_PASSWORDVISIBLE = 'Settings.passwordVisible',
    SETTINGS_BOTFRAMEWORKAPPIDFIELDLABEL = 'Settings.botFrameworkAppIdFieldLabel',
    SETTINGS_BOTFRAMEWORKADDBOTBUTTONTEXT = 'Settings.botFrameworkAddBotButtonText',
    SETTINGS_BOTFRAMEWORKLUISKEYLABEL = 'Settings.botFrameworkLuisKeyLabel',
    SETTINGS_BOTFRAMEWORKLOCALELABEL = 'Settings.botFrameworkLocaleLabel',
    SETTINGS_BOTFRAMEWORKLISTLABEL = 'Settings.botFrameworkListLabel',
    SETTINGS_SAVECHANGES = 'Settings.saveChanges',
    SETTINGS_DISCARD = 'Settings.discard',

    // ToolTip
    TOOLTIP_ACTION_API = 'ToolTop.ACTION_API',
    TOOLTIP_ACTION_API_TITLE = 'ToolTop.ACTION_API_TITLE',
    TOOLTIP_ACTION_ARGUMENTS = 'ToolTip.ACTION_ARGUMENTS',
    TOOLTIP_ACTION_ARGUMENTS_TITLE = 'ToolTip.ACTION_ARGUMENTS_TITLE',
    TOOLTIP_ACTION_CARD = 'ToolTip.ACTION_CARD',
    TOOLTIP_ACTION_CARD_TITLE = 'ToolTip.ACTION_CARD_TITLE',
    TOOLTIP_ACTION_ENTITIES = 'ToolTip.ACTION_ENTITIES',
    TOOLTIP_ACTION_ENTITIES_REQ = 'ToolTip.ACTION_ENTITIES_REQ',
    TOOLTIP_ACTION_ENTITIES_REQ_NOT = 'ToolTip.ACTION_ENTITIES_REQ_NOT',
    TOOLTIP_ACTION_ENTITIES_BLOCK = 'ToolTip.ACTION_ENTITIES_BLOCK',
    TOOLTIP_ACTION_ENTITIES_BLOCK_NOT = 'ToolTip.ACTION_ENTITIES_BLOCK_NOT',
    TOOLTIP_ACTION_NEGATIVE = 'ToolTip.ACTION_NEGATIVE',
    TOOLTIP_ACTION_NEGATIVE_TITLE = 'ToolTip.ACTION_NEGATIVE_TITLE',
    TOOLTIP_ACTION_NEGATIVE_ROW1 = 'ToolTip.ACTION_NEGATIVE_TITLE_ROW1',
    TOOLTIP_ACTION_NEGATIVE_ROW2 = 'ToolTip.ACTION_NEGATIVE_TITLE_ROW2',
    TOOLTIP_ACTION_NEGATIVE_ROW3 = 'ToolTip.ACTION_NEGATIVE_TITLE_ROW3',
    TOOLTIP_ACTION_NEGATIVE_ROW4 = 'ToolTip.ACTION_NEGATIVE_TITLE_ROW4',

    TOOLTIP_ACTION_RESPONSE = 'ToolTip.ACTION_RESPONSE',
    TOOLTIP_ACTION_RESPONSE_TEXT1 = 'ToolTip.ACTION_RESPONSE_TEXT1',
    TOOLTIP_ACTION_RESPONSE_TEXT2 = 'ToolTip.ACTION_RESPONSE_TEXT2',
    TOOLTIP_ACTION_RESPONSE_TEXT3 = 'ToolTip.ACTION_RESPONSE_TEXT3',
    TOOLTIP_ACTION_RESPONSE_TEXT_TITLE = 'ToolTip.ACTION_RESPONSE_TEXT_TITLE',
    TOOLTIP_ACTION_RESPONSE_ROW1 = 'ToolTip.ACTION_RESPONSE_ROW1',
    TOOLTIP_ACTION_RESPONSE_ROW2 = 'ToolTip.ACTION_RESPONSE_ROW2',
    TOOLTIP_ACTION_RESPONSE_ROW3 = 'ToolTip.ACTIONRESPONSE_ROW3',

    TOOLTIP_ACTION_REQUIRED = 'ToolTip.ACTION_REQUIRED',
    TOOLTIP_ACTION_REQUIRED_TITLE = 'ToolTip.ACTION_REQUIRED_TITLE',
    TOOLTIP_ACTION_REQUIRED_ROW1 = 'ToolTip.ACTION_REQUIRED_ROW1',
    TOOLTIP_ACTION_REQUIRED_ROW2 = 'ToolTip.ACTION_REQUIRED_ROW2',
    TOOLTIP_ACTION_REQUIRED_ROW3 = 'ToolTip.ACTION_REQUIRED_ROW3',
    TOOLTIP_ACTION_REQUIRED_ROW4 = 'ToolTip.ACTION_REQUIRED_ROW4',
    TOOLTIP_ACTION_SCORE = 'ToolTip.ACTION_SCORE',
    TOOLTIP_ACTION_SCORE_PERCENT = 'ToolTip.ACTION_SCORE_PERCENT',
    TOOLTIP_ACTION_SCORE_TRAINING = 'ToolTip.ACTION_SCORE_TRAINING',
    TOOLTIP_ACTION_SCORE_DISQUALIFIED = 'ToolTip.ACTION_SCORE_DISQUALIFIED',

    TOOLTIP_ACTION_SUGGESTED = 'ToolTip.ACTION_SUGGESTED',
    TOOLTIP_ACTION_SUGGESTED_TITLE = 'ToolTip.ACTION_SUGGESTED_TITLE',
    TOOLTIP_ACTION_SUGGESTED_ROW1 = 'ToolTip.ACTION_SUGGESTED_ROW1',
    TOOLTIP_ACTION_SUGGESTED_ROW2 = 'ToolTip.ACTION_SUGGESTED_ROW2',

    TOOLTIP_ACTION_TYPE = 'ToolTip.ACTION_TYPE',
    TOOLTIP_ACTION_TYPE_TITLE = 'ToolTip.ACTION_TYPE_TITLE',
    TOOLTIP_ACTION_TYPE_TEXT = 'ToolTip.ACTION_TYPE.Text',
    TOOLTIP_ACTION_TYPE_APILOCAL = 'ToolTip.ACTION_TYPE.APILocal',
    TOOLTIP_ACTION_TYPE_APIAZURE = 'ToolTip.ACTION_TYPE.APIAzure',
    TOOLTIP_ACTION_TYPE_CARD = 'ToolTip.ACTION_TYPE.Card',
    TOOLTIP_ACTION_WAIT = 'ToolTip.ACTION_WAIT',
    TOOLTIP_ACTION_WAIT_TITLE = 'ToolTip.ACTION_WAIT_TITLE',
    TOOLTIP_ENTITY_ACTION_REQUIRED = 'ToolTip.ENTITY_ACTION_REQUIRED',
    TOOLTIP_ENTITY_ACTION_BLOCKED = 'ToolTip.ENTITY_ACTION_BLOCKED',
    TOOLTIP_ENTITY_EXTRACTOR_HELP = 'ToolTipo.ENTITY_EXTRACTOR_HELP',
    TOOLTIP_ENTITY_EXTRACTOR_WARNING = 'ToolTip.ENTITY_EXTRACTOR_WARNING',
    TOOLTIP_ENTITY_NAME = 'ToolTip.ENTITY_NAME',
    TOOLTIP_ENTITY_VALUE = 'ToolTip.ENTITY_VALUE',
    TOOLTIP_ENTITY_TYPE = 'ToolTip.ENTITY_TYPE',
    TOOLTIP_EXAMPLE = 'ToolTip.EXAMPLE',

    TOOLTIP_MEMORYMANAGER = 'ToolTip.ACTION_MEMORYMANAGER',
    TOOLTIP_MEMORYMANAGER_TITLE = 'ToolTip.ACTION_MEMORYMANAGER_TITLE',

    // Train Dialogs
    TRAINDIALOGS_TITLE = 'TrainDialogs.title',
    TRAINDIALOGS_SUBTITLE = 'TrainDialogs.subtitle',
    TRAINDIALOGS_CREATEBUTTONTITLE = 'TrainDialogs.createButtonTitle',
    TRAINDIALOGS_CREATEBUTTONARIALDESCRIPTION = 'TrainDialogs.createButtonAriaDescription',
    TRAINDIALOGS_FIRSTINPUT = 'TrainDialogs.firstInput',
    TRAINDIALOGS_LASTINPUT = 'TrainDialogs.lastInput',
    TRAINDIALOGS_LASTRESPONSE = 'TrainDialogs.lastResponse',
    TRAINDIALOGS_TURNS = 'TrainDialogs.turns',

    // User Login
    USERLOGIN_TITLE = 'UserLogin.title',
    USERLOGIN_USERNAMEFIELDLABEL = 'UserLogin.usernameFieldLabel',
    USERLOGIN_USERNAMEFIELDPLACEHOLDER = 'UserLogin.usernameFieldPlaceholder',
    USERLOGIN_PASSWORDFIELDLABEL = 'UserLogin.passwordFieldLabel',
    USERLOGIN_PASSWORDFIELDPLACEHOLDER = 'UserLogin.passwordFieldPlaceholder',
    USERLOGIN_LOGINBUTTONARIADESCRPTION = 'UserLogin.loginButtonAriaDescription',
    USERLOGIN_LOGINBUTTONTEXT = 'UserLogin.loginButtonText',

    // ActionDetails
    ACTIONDETAILSLIST_COLUMNS_RESPONSE = 'ActionDetailsList.columns.response',
    ACTIONDETAILSLIST_COLUMNS_ARGUMENTS = 'ActionDetailsList.columns.arguments',
    ACTIONDETAILSLIST_COLUMNS_TYPE = 'ActionDetailsList.columns.type',
    ACTIONDETAILSLIST_COLUMNS_REQUIREDENTITIES = 'ActionDetailsList.columns.requiredEntities',
    ACTIONDETAILSLIST_COLUMNS_BLOCKINGENTITIES = 'ActionDetailsList.columns.blockingEntities',
    ACTIONDETAILSLIST_COLUMNS_SUGGESTEDENTITY = 'ActionDetailsList.columns.suggestedEntity',
    ACTIONDETAILSLIST_COLUMNS_ISTERMINAL = 'ActionDetailsList.columns.isTerminal',

    // TextVariation
    TEXTVARIATION_PLACEHOLDER = 'TextVariationCreator.placeholder',

    // ActionScorer
    ACTIONSCORER_COLUMNS_RESPONSE = 'ActionScorer.columns.response',
    ACTIONSCORER_COLUMNS_ARGUMENTS = 'ActionScorer.columns.arguments',
    ACTIONSCORER_COLUMNS_SCORE = 'ActionScorer.columns.score',
    ACTIONSCORER_COLUMNS_ENTITIES = 'ActionScorer.columns.entities',
    ACTIONSCORER_COLUMNS_ISTERMINAL = 'ActionScorer.columns.isTerminal',
    ACTIONSCORER_COLUMNS_TYPE = 'ActionScorer.columns.type',

    // AppCreator
    APPCREATOR_FIELDERROR_REQUIREDVALUE = 'AppCreator.fieldError.requiredValue',
    APPCREATOR_FIELDERROR_ALPHANUMERIC = 'AppCreator.fieldError.alphanumeric',
    APPCREATOR_FIELDERROR_DISTINCT = 'AppCreator.fieldError.distinct',
    APPCREATOR_TITLE = 'AppCreator.title',
    APPCREATOR_FIELDS_NAME_LABEL = 'AppCreator.fields.name.label',
    APPCREATOR_FIELDS_NAME_PLACEHOLDER = 'AppCreator.fields.name.placeholder',
    APPCREATOR_FIELDS_LUISKEY_LABEL = 'AppCreator.fields.luisKey.label',
    APPCREATOR_FIELDS_LUISKEY_HELPTEXT = 'AppCreator.fields.luisKey.helptext',
    APPCREATOR_FIELDS_LUISKEY_PLACEHOLDER = 'AppCreator.fields.luisKey.placeholder',
    APPCREATOR_FIELDS_LOCALE_LABEL = 'AppCreator.fields.locale.label',
    APPCREATOR_CREATEBUTTON_ARIADESCRIPTION = 'AppCreator.createButton.ariaDescription',
    APPCREATOR_CREATEBUTTON_TEXT = 'AppCreator.createButton.text',
    APPCREATOR_CANCELBUTTON_ARIADESCRIPTION = 'AppCreator.cancelButton.ariaDescription',
    APPCREATOR_CANCELBUTTON_TEXT = 'AppCreator.cancelButton.text',

    // ChatSessionWindow
    CHATSESSIONWINDOW_PRIMARYBUTTON_ARIADESCRIPTION = 'ChatSessionWindow.primaryButton.ariaDescription',
    CHATSESSIONWINDOW_PRIMARYBUTTON_TEXT = 'ChatSessionWindow.primaryButton.text',

    // ConfirmDeleteModal
    CONFIRMDELETEMODAL_PRIMARYBUTTON_TEXT = 'ConfirmDeleteModal.primaryButton.text',
    CONFIRMDELETEMODAL_DEFAULTBUTTON_TEXT = 'ConfirmDeleteModal.defaultButton.text',

    // EntityCreatorEditor
    ENTITYCREATOREDITOR_FIELDERROR_REQUIREDVALUE = 'EntityCreatorEditor.fieldError.requiredValue',
    ENTITYCREATOREDITOR_FIELDERROR_ALPHANUMERIC = 'EntityCreatorEditor.fieldsError.alphanumerica',
    ENTITYCREATOREDITOR_FIELDERROR_DISTINCT = 'EntityCreatorEditor.fields.distinct',
    ENTITYCREATOREDITOR_ENTITYOPTION_NEW = 'EntityCreatorEditor.entityOption.new',
    ENTITYCREATOREDITOR_TITLE_CREATE = 'EntityCreatorEditor.title.create',
    ENTITYCREATOREDITOR_TITLE_EDIT = 'EntityCreatorEditor.title.edit',
    ENTITYCREATOREDITOR_FIELDS_NAME_LABEL = 'EntityCreatorEditor.fields.name.label',
    ENTITYCREATOREDITOR_FIELDS_NAME_PLACEHOLDER = 'EntityCreatorEditor.fields.name.placeholder',
    ENTITYCREATOREDITOR_FIELDS_TYPE_LABEL = 'EntityCreatorEditor.fields.type.label',
    ENTITYCREATOREDITOR_FIELDS_PROGRAMMATICONLY_LABEL = 'EntityCreatorEditor.fields.programmatically.label',
    ENTITYCREATOREDITOR_FIELDS_PROGRAMMATICONLY_HELPTEXT = 'EntityCreatorEditor.fields.programmatically.helptext',
    ENTITYCREATOREDITOR_FIELDS_TOOLTIPTARGET = 'EntityCreatorEditor.fields.tooltiptarget',
    ENTITYCREATOREDITOR_FIELDS_MULTIVALUE_LABEL = 'EntityCreatorEditor.fields.multiValue.label',
    ENTITYCREATOREDITOR_FIELDS_MULTIVALUE_HELPTEXT = 'EntityCreatorEditor.fields.multiValue.helpText',
    ENTITYCREATOREDITOR_FIELDS_NEGATAABLE_LABEL = 'EntityCreatorEditor.fields.negatable.label',
    ENTITYCREATOREDITOR_FIELDS_NEGATABLE_HELPTEXT = 'EntityCreatorEditor.fields.negatable.helpText',
    ENTITYCREATOREDITOR_PIVOT_EDIT = 'EntityCreatorEditor.pivot.editEntity',
    ENTITYCREATOREDITOR_PIVOT_REQUIREDFOR = 'EntityCreatorEditor.pivot.requiredForActions',
    ENTITYCREATOREDITOR_PIVOT_BLOCKEDACTIONS = 'EntityCreatorEditor.pivot.blockedActions',
    ENTITYCREATOREDITOR_CREATEBUTTON_ARIADESCRIPTION = 'EntityCreatorEditor.createButton.ariaDescription',
    ENTITYCREATOREDITOR_CREATEBUTTON_TEXT = 'EntityCreatorEditor.createButton.text',
    ENTITYCREATOREDITOR_CANCELBUTTON_ARIADESCRIPTION = 'EntityCreatorEditor.cancelButton.ariaDescription',
    ENTITYCREATOREDITOR_CANCELBUTTON_TEXT = 'EntityCreatorEditor.cancelButton.text',
    ENTITYCREATOREDITOR_DONEBUTTON_ARIADESCRIPTION = 'EntityCreatorEditor.doneButton.ariaDescription',
    ENTITYCREATOREDITOR_DONEBUTTON_TEXT = 'EntityCreatorEditor.doneButton.text',
    ENTITYCREATOREDITOR_DELETEBUTTON_ARIADESCRIPTION = 'EntityCreatorEditor.deleteButton.ariaDescription',
    ENTITYCREATOREDITOR_DELETEBUTTON_TEXT = 'EntityCreatorEditor.deleteButton.text',

    // Error
    ERROR_ERROR = 'Error.error',
    ERROR_WARNING = 'Error.warning',
    ERROR_PRIMARYBUTTON_ARIADESCRIPTION = 'Error.ariaDescription',
    ERROR_PRIMARYBUTTON_TEXT = 'Error.text',

    // LogDialogModal
    LOGDIALOGMODAL_DEFAULTBUTTON_ARIADESCRIPTION = 'LogDialogModal.defaultButton.ariaDescription',
    LOGDIALOGMODAL_DEFAULTBUTTON_TEXT = 'LogDialogModal.defaultButton.text',
    LOGDIALOGMODAL_PRIMARYBUTTON_ARIADESCRIPTION = 'LogDialogModal.primaryButton.ariaDescription',
    LOGDIALOGMODAL_PRIMARYBUTTON_TEXT = 'LogDialogModal.primaryButton.text',
    LOGDIALOGMODAL_CONFIRMDELETE_TITLE = 'LogDialogModal.confirmDelete.title',

    // LogOut
    LOGOUT_TITLE = 'LogoutModal.title',
    LOGOUT_PRIMARYBUTTON_ARIADESCRIPTION = 'LogoutModal.primaryButton.ariaDescription',
    LOGOUT_PRIMARYBUTTON_TEXT = 'LogoutModal.primaryButton.text',
    LOGOUT_DEFAULTBUTTON_ARIADESCRIPTION = 'LogoutModal.defaultButton.ariaDescription',
    LOGOUT_DEFAULTBUTTON_TEXT = 'LogoutModal.defaultButton.text',

    // MemoryTable
    MEMORYTABLE_EMPTY = 'MemoryTable.empty',

    // TeachSessionAdmin
    TEACHSESSIONADMIN_DIALOGMODE_USER = 'TeachSessionAdmin.dialogMode.user',
    TEACHSESSIONADMIN_DIALOGMODE_BOT = 'TeachSessionAdmin.dialogMode.bot',
    TEACHSESSIONADMIN_MEMORY_TITLE = 'TeachSessionAdmin.memory.title',
    TEACHSESSIONADMIN_ENTITYDETECTION_TITLE = 'TeachSessionAdmin.entityDetection.title',
    TEACHSESSIONADMIN_ACTION_TITLE = 'TeachSessionAdmin.action.title',
    TEACHSESSIONADMIN_TRAINSTATUS_COMPLETED = 'TeachSessionAdmin.trainstatus.completed',
    TEACHSESSIONADMIN_TRAINSTATUS_NEWSCORES = 'TeachSessionAdmin.trainstatus.newscores',
    TEACHSESSIONADMIN_TRAINSTATUS_REFRESH = 'TeachSessionAdmin.trainstatus.refresh',
    TEACHSESSIONADMIN_TRAINSTATUS_FAILED = 'TeachSessionAdmin.trainstatus.failed',
    TEACHSESSIONADMIN_TRAINSTATUS_RUNNING = 'TeachSessionAdmin.trainstatus.running',

    // TeachSessionWindow
    TEACHSESSIONWINDOW_DEFAULTBUTTON_ARIADESCRIPTION = 'TeachSessionWindow.defaultButton.ariaDescription',
    TEACHSESSIONWINDOW_DEFAULTBUTTON_TEXT = 'TeachSessionWindow.defaultButton.text',
    TEACHSESSIONWINDOW_PRIMARYBUTTON_ARIADESCRIPTION = 'TeachSessionWindow.primaryButton.ariaDescription',
    TEACHSESSIONWINDOW_PRIMARYBUTTON_TEXT = 'TeachSessionWindow.primaryButton.text',
    TEACHSESSIONWINDOW_CONFIRMDELETE_TITLE = 'TeachSessionWindow.confirmDelete.title',

    // TrainDialogAdmin
    TRAINDIALOGADMIN_DIALOGMODE_USER = 'TrainDialogAdmin.dialogMode.user',
    TRAINDIALOGADMIN_DIALOGMODE_TEXT = 'TrainDialogAdmin.dialogMode.text',
    TRAINDIALOGADMIN_MEMORY_TITLE = 'TrainDialogAdmin.memory.title',
    TRAINDIALOGADMIN_HELPTEXT_TITLE = 'TrainDialogAdmin.helpText.title',
    TRAINDIALOGADMIN_HELPTEXT_DESCRIPTION = 'TrainDialogAdmin.helpText.description',
    TRAINDIALOGADMIN_HELPTEXT_DESCRIPTION2 = 'TrainDialogAdmin.helpText.description2',
    TRAINDIALOGADMIN_ENTITYDETECTION_TITLE = 'TrainDialogAdmin.entityDetection.title',
    TRAINDIALOGADMIN_ENTITYDETECTION_HELPTEXT = 'TrainDialogAdmin.entityDetection.helpText',
    TRAINDIALOGADMIN_ACTION_TITLE = 'TrainDialogAdmin.action.title',
    TRAINDIALOGADMIN_SAVECHANGES_TITLE = 'TrainDialogAdmin.saveChanges.title',
    TRAINDIALOGADMIN_SAVECHANGES_DESCRIPTION = 'TrainDialogAdmin.saveChanges.description',
    TRAINDIALOGADMIN_SAVECHANGES_PRIMARYBUTTON_TEXT = 'TrainDialogAdmin.saveChanges.primaryButton.text',
    TRAINDIALOGADMIN_SAVECHANGES_DEFAULTBUTTON_TEXT = 'TrainDialogAdmin.saveChanges.defaultButton.text',

    // TrainDialogWindow
    TRAINDIALOGWINDOW_DEFAULTBUTTON_ARIADESCRIPTION = 'TrainDialogWindow.defaultButton.ariaDescription',
    TRAINDIALOGWINDOW_DEFAULTBUTTON_TEXT = 'TrainDialogWindow.defaultButton.text',
    TRAINDIALOGWINDOW_PRIMARYBUTTON_ARIADESCRIPTION = 'TrainDialogWindow.primaryButton.ariaDescription',
    TRAINDIALOGWINDOW_PRIMARYBUTTON_TEXT = 'TrainDialogWindow.primaryButton.text',
    TRAINDIALOGWINDOW_CONFIRMDELETE_TITLE = 'TrainDialogWindow.confirmDelete.title',
}

// Message ids follow convention of '<componentname>.<area>[.<subarea>]*`
export default {
    'en-US': {
        //  {FM.ABOUT_TITLE}
        [FM.ABOUT_TITLE]: 'About',
        [FM.DOCS_TITLE]: 'Docs',
        [FM.SUPPORT_TITLE]: 'Support',
        [FM.NOMATCH_TITLE]: 'That page was not found.',
        [FM.NOMATCH_HOME]: 'Home',
        [FM.PAGE_COMINGSOON]: 'Coming soon...',

        // Actions
        [FM.ACTIONS_TITLE]: 'Actions',
        [FM.ACTIONS_SUBTITLE]: `Manage a list of actions that your application can take given it's state and user input...`,
        [FM.ACTIONS_CREATEBUTTONARIALDESCRIPTION]: 'Create a New Action',
        [FM.ACTIONS_CREATEBUTTONTITLE]: 'New Action',
        [FM.ACTIONS_CONFIRMDELETEMODALTITLE]: 'Are you sure you want to delete this action?',

        // App
        [FM.APP_HEADER_HOME]: 'Home',
        [FM.APP_HEADER_ABOUT]: 'About',
        [FM.APP_HEADER_DOCS]: 'Docs',
        [FM.APP_HEADER_SUPPORT]: 'Support',

        // TrainingStatus
        [FM.APP_TRAINING_STATUS_STATUS]: 'Status',
        [FM.APP_TRAINING_STATUS_UNKNOWN]: 'Unknown',
        [FM.APP_TRAINING_STATUS_QUEUED]: 'Queued',
        [FM.APP_TRAINING_STATUS_RUNNING]: 'Running',
        [FM.APP_TRAINING_STATUS_COMPLETED]: 'Completed',
        [FM.APP_TRAINING_STATUS_FAILED]: 'Failed',
        [FM.APP_TRAINING_STATUS_LAST_UPDATE]: 'Last Updated',
        [FM.APP_TRAINING_STATUS_REFRESH]: 'Refresh',
        [FM.APP_TRAINING_STATUS_EXPIRED]: 'Polling was stopped before training status was finalized. Please Refresh',

        // Apps List
        [FM.APPSLIST_TITLE]: 'My Apps',
        [FM.APPSLIST_SUBTITLE]: 'Create and Manage your BLIS applications...',
        [FM.APPSLIST_CREATEBUTTONARIADESCRIPTION]: 'Create a New Application',
        [FM.APPSLIST_CREATEBUTTONTEXT]: 'New App',
        [FM.APPSLIST_CONFIRMDELETEMODALTITLE]: 'Are you sure you want to delete this application?',
        [FM.APPSLIST_COLUMN_NAME]: 'Name',
        [FM.APPSLIST_COLUMNS_LOCALE]: 'Locale',
        [FM.APPSLIST_COLUMNS_LINKEDBOTS]: 'Linked Bots',
        [FM.APPSLIST_COLUMNS_ACTIONS]: 'Actions',

        // Dashboard
        [FM.DASHBOARD_TITLE]: 'Overview',
        [FM.DASHBOARD_SUBTITLE]: `Facts & statistics about the app's data at any period of time...`,

        // Entities
        [FM.ENTITIES_TITLE]: 'Entities',
        [FM.ENTITIES_SUBTITLE]: 'Manage a list of entities in your application and track and control their instances within actions...',
        [FM.ENTITIES_CREATEBUTTONARIALDESCRIPTION]: 'Create a New Entity',
        [FM.ENTITIES_CREATEBUTTONTEXT]: 'New Entity',
        [FM.ENTITIES_COLUMNS_NAME]: 'Name',
        [FM.ENTITIES_COLUMNS_TYPE]: 'Type',
        [FM.ENTITIES_COLUMNS_IS_PROGRAMMATIC]: 'Programmatic',
        [FM.ENTITIES_COLUMNS_IS_BUCKETABLE]: 'Multi-Value',
        [FM.ENTITIES_COLUMNS_IS_NEGATABLE]: 'Negatable',
        [FM.ENTITIES_CONFIRMDELETEMODALTITLE]: 'Are you sure you want to delete this entity?',
        [FM.ENTITIES_DELETEWARNINGTITLE]: 'You cannot delete this entity because it is being used in an action.',
        [FM.ENTITIES_DELETEWARNINGPRIMARYBUTTONTEXT]: 'Close',

        // LogDialogs
        [FM.LOGDIALOGS_TITLE]: 'Log Dialogs',
        [FM.LOGDIALOGS_SUBTITLE]: 'Use this tool to test the current versions of your application, to check if you are progressing on the right track...',
        [FM.LOGDIALOGS_CREATEBUTTONTITLE]: 'New Chat Session',
        [FM.LOGDIALOGS_CREATEBUTTONARIALDESCRIPTION]: 'Create a New Chat Session',
        [FM.LOGDIALOGS_SESSIONCREATIONWARNING_TITLE]: 'You may not create chat session at this time. Please try again after training as completed.',
        [FM.LOGDIALOGS_SESSIONCREATIONWARNING_PRIMARYBUTTON]: 'Ok',
        [FM.LOGDIALOGS_FIRSTINPUT]: 'First Input',
        [FM.LOGDIALOGS_LASTINPUT]: 'Last Input',
        [FM.LOGDIALOGS_LASTRESPONSE]: 'Last Response',
        [FM.LOGDIALOGS_TURNS]: 'Turns',

        // Settings
        [FM.SETTINGS_TITLE]: 'Settings',
        [FM.SETTINGS_SUBTITLE]: 'Control your application versions, who has access to it and whether it is public or private...',
        [FM.SETTINGS_FIELDERROR_REQUIREDVALUE]: 'Required Value',
        [FM.SETTINGS_FIELDERROR_ALPHANUMERIC]: 'Application name may only contain alphanumeric characters',
        [FM.SETTINGS_FIELDERROR_DISTINCT]: 'Name is already in use.',
        [FM.SETTINGS_FIELDS_NAMELABEL]: 'Name',
        [FM.SETTINGS_FILEDS_APPIDLABEL]: 'App ID',
        [FM.SETTINGS_PASSWORDHIDDEN]: 'Show',
        [FM.SETTINGS_PASSWORDVISIBLE]: 'Hide',
        [FM.SETTINGS_BOTFRAMEWORKAPPIDFIELDLABEL]: 'Application ID',
        [FM.SETTINGS_BOTFRAMEWORKADDBOTBUTTONTEXT]: 'Add',
        [FM.SETTINGS_BOTFRAMEWORKLUISKEYLABEL]: 'LUIS Key',
        [FM.SETTINGS_BOTFRAMEWORKLOCALELABEL]: 'Locale',
        [FM.SETTINGS_BOTFRAMEWORKLISTLABEL]: 'Bot Framework Apps',
        [FM.SETTINGS_SAVECHANGES]: 'Save Changes',
        [FM.SETTINGS_DISCARD]: 'Discard',

        // ToolTip
        [FM.TOOLTIP_ACTION_API]: 'APIs exposed in the running Bot of the form:',
        [FM.TOOLTIP_ACTION_API_TITLE]: 'API',
        [FM.TOOLTIP_ACTION_ARGUMENTS]: `When Action Type is an API call, a list of comma separated arguments passed to the API. Arguments prefixed with a $ refer to Entity values.  For example: "$city"`,
        [FM.TOOLTIP_ACTION_ARGUMENTS_TITLE]: `Arguments`,
        [FM.TOOLTIP_ACTION_CARD]: `When Action Type is a card call, a list of comma separated arguments passed to the Card. Arguments prefixed with a $ refer to Entity values.  For example: "$city"`,
        [FM.TOOLTIP_ACTION_CARD_TITLE]: `Card`,
        [FM.TOOLTIP_ACTION_ENTITIES]: 'Status of Entity requirements for this action:',
        [FM.TOOLTIP_ACTION_ENTITIES_REQ]: 'Required Entity is present',
        [FM.TOOLTIP_ACTION_ENTITIES_REQ_NOT]: 'Required Enitity is missing (DISQUALIFIES ACTION)',
        [FM.TOOLTIP_ACTION_ENTITIES_BLOCK]: 'Blocking Entity is present (DISQUALIFIES ACTION)',
        [FM.TOOLTIP_ACTION_ENTITIES_BLOCK_NOT]: 'Blocking Entity is missing',

        [FM.TOOLTIP_ACTION_NEGATIVE]: 'Action will not be selected if Memory already contains value for these Entities',
        [FM.TOOLTIP_ACTION_NEGATIVE_TITLE]: 'Blocking Entities',
        [FM.TOOLTIP_ACTION_NEGATIVE_ROW1]: '"How would you like to pay?"',
        [FM.TOOLTIP_ACTION_NEGATIVE_ROW2]: '$paymentDetails',
        [FM.TOOLTIP_ACTION_NEGATIVE_ROW3]: '"When were you born?"',
        [FM.TOOLTIP_ACTION_NEGATIVE_ROW4]: '$birthdate',

        [FM.TOOLTIP_ACTION_RESPONSE]: 'Value of Response that Bot will take',
        [FM.TOOLTIP_ACTION_RESPONSE_TEXT1]: 'Text the Bot will display to the user.',
        [FM.TOOLTIP_ACTION_RESPONSE_TEXT2]: 'Prefix text with a $ to substitute Entity values.',
        [FM.TOOLTIP_ACTION_RESPONSE_TEXT3]: 'Text contained in brackets (i.e. []) will only be displayed if all contained entities have values.',
        [FM.TOOLTIP_ACTION_RESPONSE_TEXT_TITLE]: 'Response',
        [FM.TOOLTIP_ACTION_RESPONSE_ROW1]: '"How can I help you?"',
        [FM.TOOLTIP_ACTION_RESPONSE_ROW2]: '"You have $toppings on your pizza."',
        [FM.TOOLTIP_ACTION_RESPONSE_ROW3]: '"Hi[, $name]"',

        [FM.TOOLTIP_ACTION_REQUIRED]: 'Action will not be selected unless Memory contains values for these Entities',
        [FM.TOOLTIP_ACTION_REQUIRED_TITLE]: 'Required Entities',
        [FM.TOOLTIP_ACTION_REQUIRED_ROW1]: '"How would you like to pay?"',
        [FM.TOOLTIP_ACTION_REQUIRED_ROW2]: '$orderDetails $address',
        [FM.TOOLTIP_ACTION_REQUIRED_ROW3]: '"Hi, $name"',
        [FM.TOOLTIP_ACTION_REQUIRED_ROW4]: '$name',

        [FM.TOOLTIP_ACTION_SCORE]: 'Score:',
        [FM.TOOLTIP_ACTION_SCORE_PERCENT]: 'BLIS confidence in performing an Action',
        [FM.TOOLTIP_ACTION_SCORE_TRAINING]: `Action can't be scored yet as BLIS is still training`,
        [FM.TOOLTIP_ACTION_SCORE_DISQUALIFIED]: 'Action has been disqualified - Required Entities are missing or Blocked Entites are present',

        [FM.TOOLTIP_ACTION_SUGGESTED]: `Hint to BLIS that the user's reply to this Action will likely be a value for this Entity`,
        [FM.TOOLTIP_ACTION_SUGGESTED_TITLE]: 'Expected Response',
        [FM.TOOLTIP_ACTION_SUGGESTED_ROW1]: '"What is your name?"',
        [FM.TOOLTIP_ACTION_SUGGESTED_ROW2]: '$name',

        [FM.TOOLTIP_ACTION_TYPE]: 'One of the following:',
        [FM.TOOLTIP_ACTION_TYPE_TITLE]: 'Action Type',
        [FM.TOOLTIP_ACTION_TYPE_TEXT]: 'A text response',
        [FM.TOOLTIP_ACTION_TYPE_APILOCAL]: 'An API call to the Bot',
        [FM.TOOLTIP_ACTION_TYPE_APIAZURE]: 'An API call to an Azure Function',
        [FM.TOOLTIP_ACTION_TYPE_CARD]: 'Renders an Adaptive Card template',
        [FM.TOOLTIP_ACTION_WAIT]: 'When selected, Bot will wait for more user input before taking another action',
        [FM.TOOLTIP_ACTION_WAIT_TITLE]: 'Wait For Response',
        [FM.TOOLTIP_ENTITY_ACTION_BLOCKED]: `Actions that are blocked from use if this Entity is set`,
        [FM.TOOLTIP_ENTITY_ACTION_REQUIRED]: `Actions that are only employed when this Entity is set`,
        [FM.TOOLTIP_ENTITY_EXTRACTOR_HELP]: `Select text to label it as an entity.  View Help:`,
        [FM.TOOLTIP_ENTITY_EXTRACTOR_WARNING]: 'Text Variations must contain the same detected Entities and the primary input text.',
        [FM.TOOLTIP_ENTITY_NAME]: 'Name of the Entity',
        [FM.TOOLTIP_ENTITY_VALUE]: 'What the Bot currently has in Memory for this Entity',
        [FM.TOOLTIP_ENTITY_TYPE]: 'Type of Entity: CUSTOM or name existing of Pre-Built Entity',
        [FM.TOOLTIP_EXAMPLE]: 'For Example:',

        [FM.TOOLTIP_MEMORYMANAGER]: `The memory manager provides the following functions for manipulating the Bot's memory:`,
        [FM.TOOLTIP_MEMORYMANAGER_TITLE]: 'Memory Manager',

        // Train Dialogs
        [FM.TRAINDIALOGS_TITLE]: 'Train Dialogs',
        [FM.TRAINDIALOGS_SUBTITLE]: 'Use this tool to train and improve the current versions of your application...',
        [FM.TRAINDIALOGS_CREATEBUTTONTITLE]: 'New Teach Session',
        [FM.TRAINDIALOGS_CREATEBUTTONARIALDESCRIPTION]: 'Create a New Teach Session',
        [FM.TRAINDIALOGS_FIRSTINPUT]: 'First Input',
        [FM.TRAINDIALOGS_LASTINPUT]: 'Last Input',
        [FM.TRAINDIALOGS_LASTRESPONSE]: 'Last Response',
        [FM.TRAINDIALOGS_TURNS]: 'Turns',

        // Login
        [FM.USERLOGIN_TITLE]: 'Log In',
        [FM.USERLOGIN_USERNAMEFIELDLABEL]: 'Name',
        [FM.USERLOGIN_USERNAMEFIELDPLACEHOLDER]: 'User Name...',
        [FM.USERLOGIN_PASSWORDFIELDLABEL]: 'Password',
        [FM.USERLOGIN_PASSWORDFIELDPLACEHOLDER]: 'Password...',
        [FM.USERLOGIN_LOGINBUTTONARIADESCRPTION]: 'Log In',
        [FM.USERLOGIN_LOGINBUTTONTEXT]: 'Log In',

        // ActionDetailsList
        [FM.ACTIONDETAILSLIST_COLUMNS_RESPONSE]: 'Response',
        [FM.ACTIONDETAILSLIST_COLUMNS_ARGUMENTS]: 'Arguments',
        [FM.ACTIONDETAILSLIST_COLUMNS_TYPE]: 'Action Type',
        [FM.ACTIONDETAILSLIST_COLUMNS_REQUIREDENTITIES]: 'Required Entities',
        [FM.ACTIONDETAILSLIST_COLUMNS_BLOCKINGENTITIES]: 'Blocking Entities',
        [FM.ACTIONDETAILSLIST_COLUMNS_SUGGESTEDENTITY]: 'Expected Entity',
        [FM.ACTIONDETAILSLIST_COLUMNS_ISTERMINAL]: 'Wait',

        // TextVariationCreator
        [FM.TEXTVARIATION_PLACEHOLDER]: 'Add alternative input...',

        // ActionScorer
        [FM.ACTIONSCORER_COLUMNS_RESPONSE]: 'Response',
        [FM.ACTIONSCORER_COLUMNS_ARGUMENTS]: 'Arguments',
        [FM.ACTIONSCORER_COLUMNS_SCORE]: 'Score',
        [FM.ACTIONSCORER_COLUMNS_ENTITIES]: 'Entities',
        [FM.ACTIONSCORER_COLUMNS_ISTERMINAL]: 'Wait',
        [FM.ACTIONSCORER_COLUMNS_TYPE]: 'Type',

        // AppCreator
        [FM.APPCREATOR_FIELDERROR_REQUIREDVALUE]: 'Required Value',
        [FM.APPCREATOR_FIELDERROR_ALPHANUMERIC]: 'Application name may only contain alphanumeric characters',
        [FM.APPCREATOR_FIELDERROR_DISTINCT]: 'Name is already in use.',
        [FM.APPCREATOR_TITLE]: 'Create a BLIS App',
        [FM.APPCREATOR_FIELDS_NAME_LABEL]: 'Name',
        [FM.APPCREATOR_FIELDS_NAME_PLACEHOLDER]: 'Application Name...',
        [FM.APPCREATOR_FIELDS_LUISKEY_LABEL]: 'LUIS Key',
        [FM.APPCREATOR_FIELDS_LUISKEY_HELPTEXT]: 'Find your key',
        [FM.APPCREATOR_FIELDS_LUISKEY_PLACEHOLDER]: 'Key...',
        [FM.APPCREATOR_FIELDS_LOCALE_LABEL]: 'Locale',
        [FM.APPCREATOR_CREATEBUTTON_ARIADESCRIPTION]: 'Create',
        [FM.APPCREATOR_CREATEBUTTON_TEXT]: 'Create',
        [FM.APPCREATOR_CANCELBUTTON_ARIADESCRIPTION]: 'Cancel',
        [FM.APPCREATOR_CANCELBUTTON_TEXT]: 'Cancel',

        // ChatSessionWindow
        [FM.CHATSESSIONWINDOW_PRIMARYBUTTON_ARIADESCRIPTION]: 'Done Testing',
        [FM.CHATSESSIONWINDOW_PRIMARYBUTTON_TEXT]: 'Done Testing',

        // ConfirmDeleteModal
        [FM.CONFIRMDELETEMODAL_PRIMARYBUTTON_TEXT]: 'Confirm',
        [FM.CONFIRMDELETEMODAL_DEFAULTBUTTON_TEXT]: 'Cancel',

        // EntityCreatorEditor
        [FM.ENTITYCREATOREDITOR_FIELDERROR_REQUIREDVALUE]: 'Required Value',
        [FM.ENTITYCREATOREDITOR_FIELDERROR_ALPHANUMERIC]: 'Entity name may only contain alphanumeric characters with no spaces.',
        [FM.ENTITYCREATOREDITOR_FIELDERROR_DISTINCT]: 'Name is already in use.',
        [FM.ENTITYCREATOREDITOR_ENTITYOPTION_NEW]: 'New Type',
        [FM.ENTITYCREATOREDITOR_TITLE_CREATE]: 'Create an Entity',
        [FM.ENTITYCREATOREDITOR_TITLE_EDIT]: 'Edit Entity',
        [FM.ENTITYCREATOREDITOR_FIELDS_NAME_LABEL]: 'Entity Name',
        [FM.ENTITYCREATOREDITOR_FIELDS_NAME_PLACEHOLDER]: 'Name...',
        [FM.ENTITYCREATOREDITOR_FIELDS_TYPE_LABEL]: 'Entity Type',
        [FM.ENTITYCREATOREDITOR_FIELDS_PROGRAMMATICONLY_LABEL]: 'Programmatic Only',
        [FM.ENTITYCREATOREDITOR_FIELDS_MULTIVALUE_LABEL]: 'Multi-valued',
        [FM.ENTITYCREATOREDITOR_FIELDS_NEGATAABLE_LABEL]: 'Negatable',
        [FM.ENTITYCREATOREDITOR_PIVOT_EDIT]: 'Edit Entity',
        [FM.ENTITYCREATOREDITOR_PIVOT_REQUIREDFOR]: 'Required For Actions',
        [FM.ENTITYCREATOREDITOR_PIVOT_BLOCKEDACTIONS]: 'Blocked Actions',
        [FM.ENTITYCREATOREDITOR_CREATEBUTTON_ARIADESCRIPTION]: 'Create',
        [FM.ENTITYCREATOREDITOR_CREATEBUTTON_TEXT]: 'Create',
        [FM.ENTITYCREATOREDITOR_CANCELBUTTON_ARIADESCRIPTION]: 'Cancel',
        [FM.ENTITYCREATOREDITOR_CANCELBUTTON_TEXT]: 'Cancel',
        [FM.ENTITYCREATOREDITOR_DONEBUTTON_ARIADESCRIPTION]: 'Done',
        [FM.ENTITYCREATOREDITOR_DONEBUTTON_TEXT]: 'Done',
        [FM.ENTITYCREATOREDITOR_DELETEBUTTON_ARIADESCRIPTION]: 'Delete',
        [FM.ENTITYCREATOREDITOR_DELETEBUTTON_TEXT]: 'Delete',

        // Error
        [FM.ERROR_ERROR]: 'Error',
        [FM.ERROR_WARNING]: 'Warning',
        [FM.ERROR_PRIMARYBUTTON_ARIADESCRIPTION]: 'Ok',
        [FM.ERROR_PRIMARYBUTTON_TEXT]: 'Ok',

        // LogDialogModal
        [FM.LOGDIALOGMODAL_DEFAULTBUTTON_ARIADESCRIPTION]: 'Delete',
        [FM.LOGDIALOGMODAL_DEFAULTBUTTON_TEXT]: 'Delete',
        [FM.LOGDIALOGMODAL_PRIMARYBUTTON_ARIADESCRIPTION]: 'Done',
        [FM.LOGDIALOGMODAL_PRIMARYBUTTON_TEXT]: 'Done',
        [FM.LOGDIALOGMODAL_CONFIRMDELETE_TITLE]: 'Are you sure you want to delete this Log Dialog?',

        // LogoutModal
        [FM.LOGOUT_TITLE]: 'Log Out',
        [FM.LOGOUT_PRIMARYBUTTON_ARIADESCRIPTION]: 'Log Out',
        [FM.LOGOUT_PRIMARYBUTTON_TEXT]: 'Log Out',
        [FM.LOGOUT_DEFAULTBUTTON_ARIADESCRIPTION]: 'Cancel',
        [FM.LOGOUT_DEFAULTBUTTON_TEXT]: 'Cancel',

        // MemoryTable
        [FM.MEMORYTABLE_EMPTY]: 'Empty',

        // TeachSessionAdmin
        [FM.TEACHSESSIONADMIN_DIALOGMODE_USER]: 'User Input',
        [FM.TEACHSESSIONADMIN_DIALOGMODE_BOT]: 'Bot Response',
        [FM.TEACHSESSIONADMIN_MEMORY_TITLE]: 'Memory',
        [FM.TEACHSESSIONADMIN_ENTITYDETECTION_TITLE]: 'Entity Detection',
        [FM.TEACHSESSIONADMIN_ACTION_TITLE]: 'Action',
        [FM.TEACHSESSIONADMIN_TRAINSTATUS_COMPLETED]: 'Train Status: Completed',
        [FM.TEACHSESSIONADMIN_TRAINSTATUS_NEWSCORES]: 'New Scores Available',
        [FM.TEACHSESSIONADMIN_TRAINSTATUS_REFRESH]: 'Refresh',
        [FM.TEACHSESSIONADMIN_TRAINSTATUS_FAILED]: 'Train Status: Failed',
        [FM.TEACHSESSIONADMIN_TRAINSTATUS_RUNNING]: 'Train Status: Runnning...',

        // TeachSessionWindow
        [FM.TEACHSESSIONWINDOW_DEFAULTBUTTON_ARIADESCRIPTION]: 'Abandon Teach',
        [FM.TEACHSESSIONWINDOW_DEFAULTBUTTON_TEXT]: 'Abandon Teach',
        [FM.TEACHSESSIONWINDOW_PRIMARYBUTTON_ARIADESCRIPTION]: 'Done Teaching',
        [FM.TEACHSESSIONWINDOW_PRIMARYBUTTON_TEXT]: 'Done Teaching',
        [FM.TEACHSESSIONWINDOW_CONFIRMDELETE_TITLE]: 'Are you sure you want to abandon this teach session?',

        // TrainDialogAdmin
        [FM.TRAINDIALOGADMIN_DIALOGMODE_USER]: 'User Input',
        [FM.TRAINDIALOGADMIN_DIALOGMODE_TEXT]: 'Bot Response',
        [FM.TRAINDIALOGADMIN_MEMORY_TITLE]: 'Memory',
        [FM.TRAINDIALOGADMIN_HELPTEXT_TITLE]: 'Train Dialog',
        [FM.TRAINDIALOGADMIN_HELPTEXT_DESCRIPTION]: 'Click on User or Bot dialogs to the left to view steps in the Train Dialog.',
        [FM.TRAINDIALOGADMIN_HELPTEXT_DESCRIPTION2]: 'You can then make changes to the Train Dialog.',
        [FM.TRAINDIALOGADMIN_ENTITYDETECTION_TITLE]: 'Entity Detection',
        [FM.TRAINDIALOGADMIN_ENTITYDETECTION_HELPTEXT]: 'Click on text from the dialog to the left.',
        [FM.TRAINDIALOGADMIN_ACTION_TITLE]: 'Action',
        [FM.TRAINDIALOGADMIN_SAVECHANGES_TITLE]: 'Your changes will invalidate the subsequent steps in the Train Dialog',
        [FM.TRAINDIALOGADMIN_SAVECHANGES_DESCRIPTION]: 'Do you want to proceed and truncate the Train Dialog at this step?',
        [FM.TRAINDIALOGADMIN_SAVECHANGES_PRIMARYBUTTON_TEXT]: 'Yes',
        [FM.TRAINDIALOGADMIN_SAVECHANGES_DEFAULTBUTTON_TEXT]: 'No',

        // TrainDialogWindow
        [FM.TRAINDIALOGWINDOW_DEFAULTBUTTON_ARIADESCRIPTION]: 'Delete',
        [FM.TRAINDIALOGWINDOW_DEFAULTBUTTON_TEXT]: 'Delete',
        [FM.TRAINDIALOGWINDOW_PRIMARYBUTTON_ARIADESCRIPTION]: 'Done',
        [FM.TRAINDIALOGWINDOW_PRIMARYBUTTON_TEXT]: 'Done',
        [FM.TRAINDIALOGWINDOW_CONFIRMDELETE_TITLE]: 'Are you sure you want to delete this Training Dialog?',
    },
    'ko': {
        [FM.ABOUT_TITLE]: '약',
        [FM.DOCS_TITLE]: '선적 서류 비치',
        [FM.SUPPORT_TITLE]: '지원하다',
        [FM.NOMATCH_TITLE]: '페이지를 찾을 수 없습니다.',
        [FM.NOMATCH_HOME]: '집',
        [FM.PAGE_COMINGSOON]: '출시 예정 ...',

        // App
        [FM.APP_HEADER_HOME]: '집',
        [FM.APP_HEADER_ABOUT]: '약',
        [FM.APP_HEADER_DOCS]: '선적 서류 비치',
        [FM.APP_HEADER_SUPPORT]: '지원하다',
        [FM.APPSLIST_CONFIRMDELETEMODALTITLE]: '이 애플리케이션을 삭제 하시겠습니까?',
        [FM.APPSLIST_COLUMN_NAME]: '이름',
        [FM.APPSLIST_COLUMNS_LOCALE]: '장소',
        [FM.APPSLIST_COLUMNS_LINKEDBOTS]: '연결된 봇',
        [FM.APPSLIST_COLUMNS_ACTIONS]: '행위',

        // Apps List
        [FM.APPSLIST_SUBTITLE]: '내 앱',
        [FM.APPSLIST_SUBTITLE]: 'BLIS 응용 프로그램 작성 및 관리 ...',
        [FM.APPSLIST_CREATEBUTTONARIADESCRIPTION]: '새 응용 프로그램 만들기',
        [FM.APPSLIST_CREATEBUTTONTEXT]: '새 앱',

        // Login
        [FM.USERLOGIN_TITLE]: '로그인',
        [FM.USERLOGIN_USERNAMEFIELDLABEL]: '이름',
        [FM.USERLOGIN_USERNAMEFIELDPLACEHOLDER]: '사용자 이름...',
        [FM.USERLOGIN_PASSWORDFIELDLABEL]: '암호',
        [FM.USERLOGIN_PASSWORDFIELDPLACEHOLDER]: '암호...',
        [FM.USERLOGIN_LOGINBUTTONARIADESCRPTION]: '로그인',
        [FM.USERLOGIN_LOGINBUTTONTEXT]: '로그인',

        // TODO: I think there are special localization experts within Microsoft who can fill this in for us.
    }
}