/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import { AppBase, AppMetaData, TrainDialog, AppDefinition } from '@conversationlearner/models'

export interface App extends AppBase {
    didPollingExpire: boolean
}

export interface SourceModel {
    source: AppDefinition,
    model: AppBase,
}

export interface AppInput {
    appName: string
    locale: string
    metadata: AppMetaData
}

export type PartialTrainDialog = Pick<TrainDialog, "trainDialogId" | "tags" | "description"> & Partial<TrainDialog>