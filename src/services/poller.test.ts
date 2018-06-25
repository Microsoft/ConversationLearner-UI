/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as poller from './poller'
import { delay } from '../util'

describe('Poller', () => {
    test('poll should invoke onExpired callback when polling exceeds max duration', async () => {
        // Arrange
        const onExpiredMock = jest.fn()
        const onUpdateMock = jest.fn(trainingStatus => {
        })
        const pollConfig: poller.IPollConfig<number> = {
            id: 'pc1',
            maxDuration: 500,
            request: async () => {
                return 0
            },
            isResolved: n => false,
            onExpired: onExpiredMock,
            onUpdate: onUpdateMock
        }

        const poller1 = new poller.Poller({ interval: 100 })
        await poller1.addPoll(pollConfig)

        expect(onExpiredMock.mock.calls.length).toBe(1)
        expect(onUpdateMock.mock.calls.length).toBeGreaterThan(3)
    }) 

    test('poll should invoke request, isResolved, and onUpdate for each interval', async () => {
        const requestMock = jest.fn(async () => {
            return 0
        })
        const isResolvedMock = jest.fn(n => false)
        const onExpiredMock = jest.fn()
        const onUpdateMock = jest.fn(trainingStatus => {
        })
        const pollConfig: poller.IPollConfig<number> = {
            id: 'pc1',
            maxDuration: 500,
            request: requestMock,
            isResolved: isResolvedMock,
            onExpired: onExpiredMock,
            onUpdate: onUpdateMock
        }

        const poller1 = new poller.Poller({ interval: 100 })
        await poller1.addPoll(pollConfig)

        expect(requestMock.mock.calls.length).toBe(4)
        expect(isResolvedMock.mock.calls.length).toBe(4)
        expect(onUpdateMock.mock.calls.length).toBe(4)
    })

    test('poll should stop polling after isResolved returns true', async () => {
        const onExpiredMock = jest.fn()
        const onUpdateMock = jest.fn(trainingStatus => {
        })
        const pollConfig: poller.IPollConfig<number> = {
            id: 'pc1',
            maxDuration: 500,
            request: async () => {
                return 0
            },
            isResolved: n => true,
            onExpired: onExpiredMock,
            onUpdate: onUpdateMock
        }

        const poller1 = new poller.Poller({ interval: 100 })
        await poller1.addPoll(pollConfig)

        expect(onUpdateMock.mock.calls.length).toBe(1)
    })

    test('calling poll with same id should extend existing polls', async () => {
        const pollConfig1: poller.IPollConfig<number> = {
            id: 'pc1',
            maxDuration: 400,
            request: async () => {
                return 0
            },
            isResolved: n => false,
            onExpired: () => {},
            onUpdate: () => {}
        }

        const pollConfig2: poller.IPollConfig<number> = {
            id: 'pc1',
            maxDuration: 400,
            request: async () => {
                return 0
            },
            isResolved: n => false,
            onExpired: () => {},
            onUpdate: () => {}
        }

        const now = new Date().getTime()
        const poller1 = new poller.Poller({ interval: 100 })
        const p1 = poller1.addPoll(pollConfig1)
        await delay(200)
        poller1.addPoll(pollConfig2)
        await p1
        const after = new Date().getTime()

        // 200 + 400
        expect(after - now).toBeGreaterThanOrEqual(600)
    })

    test('calling poll with different id should NOT extend existing polls', async () => {
        const pollConfig1: poller.IPollConfig<number> = {
            id: 'pc1',
            maxDuration: 400,
            request: async () => {
                return 0
            },
            isResolved: n => false,
            onExpired: () => {},
            onUpdate: () => {}
        }

        const pollConfig2: poller.IPollConfig<number> = {
            id: 'pc2',
            maxDuration: 400,
            request: async () => {
                return 0
            },
            isResolved: n => false,
            onExpired: () => {},
            onUpdate: () => {}
        }

        const poller1 = new poller.Poller({ interval: 100 })

        const now = new Date().getTime()
        const p1 = poller1.addPoll(pollConfig1)
        await delay(200)
        poller1.addPoll(pollConfig2)

        await p1 // Will still resolve after 400 expiration
        const after = new Date().getTime()
        
        expect(after - now).toBeGreaterThan(400)
    })
})