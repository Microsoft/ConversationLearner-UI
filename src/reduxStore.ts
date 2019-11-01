/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import { createStore, applyMiddleware, Store } from 'redux'
import thunk from 'redux-thunk'
import { State } from './types'
import rootReducer from './reducers/root'
import { throttle } from 'lodash'
import * as localStorage from './services/localStorage'
import * as ClientFactory from './services/clientFactory'
// Note: Because we need and force initialState to be done here it has no effect on the reducer but is kept there to follow pattern.
import { initialState as initialSettings } from './reducers/settingsReducer'

export const createReduxStore = (): Store<State> => {
    let persistedState = localStorage.load<Partial<State>>()

    /**
     * We can't rely on format of state persisted in the localStorage. It could be missing, and old schema, or malformed by user tampering
     * This is why we always first ensure it is of the correct type at the lowest level instead of blindly assigning it to our state
     * If is malformed reset to a guaranteed initial / default value.
     */
    if (typeof persistedState !== 'object') {
        persistedState = {
            settings: initialSettings
        }
    }
    else {
        if (typeof persistedState.settings !== 'object') {
            persistedState.settings = initialSettings
        }
        else {
            if (typeof persistedState.settings.useCustomPort !== 'boolean') {
                persistedState.settings.useCustomPort = initialSettings.useCustomPort
            }
            if (typeof persistedState.settings.customPort !== 'number') {
                persistedState.settings.customPort = initialSettings.customPort
            }
            if (typeof persistedState.settings.features !== 'string') {
                persistedState.settings.features = initialSettings.features
            }
        }
    }

    // At this point persistedState should have a correct format of settings object
    const state = persistedState as State
    // If user chose to use custom port update the client to use this port
    // Need this since the subscribe below only happens on store change not initialization
    const botPort = state.settings.useCustomPort
        ? state.settings.customPort
        : initialSettings.botPort

    ClientFactory.setPort(botPort)
    state.settings.botPort = botPort

    const store = createStore(rootReducer,
        state,
        applyMiddleware(
            thunk
        )
    )

    store.subscribe(throttle(() => {
        const state = store.getState()

        // Update client to use the PORT
        if (state.settings.botPort) {
            ClientFactory.setPort(state.settings.botPort)
        }

        const stateToPersist = {
            settings: {
                useCustomPort: state.settings.useCustomPort,
                customPort: state.settings.customPort,
                features: state.settings.features
            }
        }

        localStorage.save(stateToPersist)
    }, 1000))

    return store
}