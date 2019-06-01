/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import { ActionObject } from '../types'
import { AT } from '../types/ActionTypes'

export const settingsReset = (): ActionObject =>
    ({
        type: AT.SETTINGS_RESET
    })

export const settingsUpdatePort = (port: number): ActionObject =>
    ({
        type: AT.SETTINGS_UPDATE_PORT,
        port,
    })

export const settingsToggleUseCustomPort = (): ActionObject =>
    ({
        type: AT.SETTINGS_TOGGLE_USE_CUSTOM_PORT
    })