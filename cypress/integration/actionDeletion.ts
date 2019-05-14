import constants from '../support/constants'
import s from '../support/selectors'
import * as util from '../support/utilities'

describe('Action Deletion', () => {
    const testData = {
        modelName: `actionDeletion`,
        modelFile: `actionDeletion.cl`,
        dialogs: {
            terminal1: 'terminalText1',
            terminal2: 'terminalText2',
            nonTerminal: 'nonTerminal',
            setEntity: 'setEntity',
            preserveValidity: 'preserveValidity',
        },
        actions: {
            terminal1: 'Terminal Text 1',
            terminal2: 'Terminal Text 2',
            terminal3: 'Terminal Text 3',
            nonTerminal1: 'Non-terminal Text 1',
            nonTerminal2: 'Non-terminal Text 2',
            setEntity: 'myEnum: THREE',
        },
    }

    before(() => {
        cy.visit('http://localhost:3000')
        util.importModel(testData.modelName, testData.modelFile)
    })

    beforeEach(() => {
        cy.get(s.model.buttonNavActions)
            .click()
    })

    describe('preserve action placeholder', () => {
        it('should mark the dialog using action as invalid', () => {
            // select action 1
            cy.get(s.actions.textResponse)
                .contains(testData.actions.terminal1)
                .click()

            // delete action without option
            cy.get(s.action.buttonDelete)
                .click()

            // wait deletion calculation
            cy.get(s.common.spinner, { timeout: constants.spinner.timeout })
                .should('not.exist')

            cy.server()
            cy.route('/sdk/app/*/traindialogs*').as('getTrainDialogs')

            cy.get(s.confirmCancelModal.buttonConfirm)
                .click()

            // wait actual deletion
            cy.get(s.common.spinner, { timeout: constants.spinner.timeout })
                .should('not.exist')

            cy.wait(['@getTrainDialogs'])

            // open affected dialog
            cy.get(s.model.buttonNavTrainDialogs)
                .click()

            cy.get(s.trainDialogs.descriptions)
                .contains(testData.dialogs.terminal1)
                .click()

            // verify has invalid
            cy.get(s.webChat.messageFromBotException)
            cy.get(s.dialogModal.error)

            cy.get(s.dialogModal.buttonCloseSave)
                .click()
        })
    })

    describe('remove scorer step', () => {
        describe('terminal actions', () => {
            afterEach(() => {
                cy.wait(1000)
                cy.get(s.dialogModal.buttonCloseSave)
                    .click()
                cy.wait(1000)
            })

            it.only('should mark dialogs using action as invalid', () => {
                cy.get(s.actions.textResponse)
                    .contains(testData.actions.terminal2)
                    .click()

                // delete action without option
                cy.get(s.action.buttonDelete)
                    .click()

                // wait deletion calculation
                cy.get(s.common.spinner, { timeout: constants.spinner.timeout })
                    .should('not.exist')

                cy.get(s.confirmCancelModal.optionRemovePlaceholder)
                    .click()

                cy.server()
                cy.route('/sdk/app/*/traindialogs*').as('getTrainDialogs')

                cy.get(s.confirmCancelModal.buttonConfirm)
                    .click()

                // wait actual deletion
                cy.get(s.common.spinner, { timeout: constants.spinner.timeout })
                    .should('not.exist')

                cy.wait(['@getTrainDialogs'])

                // open affected dialog
                cy.get(s.model.buttonNavTrainDialogs)
                    .click()

                cy.get(s.trainDialogs.descriptions)
                    .contains(testData.dialogs.terminal2)
                    .click()

                // verify has invalid
                cy.get(s.webChat.messageFromBotException)
                cy.get(s.dialogModal.error)
            })
        })

        describe('non-terminal', () => {
            describe('does not affect memory', () => {
                it('removing TEXT action from dialog should not modify validity', () => {
                    // navigate to actions
                    // select non-terminal action 3
                    // delete action with option
                    // open affect dialog
                    // verify validity was preserve (remain valid)
                })

                it('removing CARD action from dialog should not modify validity', () => {

                })
            })

            describe('does affect memory', () => {
                it('removing API action from dialog should require replay and show WARNING', () => {
                    // navigate to actions
                    // select non-terminal action 4
                    // delete action with option
                    // open affect dialog
                    // verify validity is WARNING
                })

                it('removing SET_ENTITY action from dialog should require replay and show WARNING', () => {

                })
            })
        })

        describe('preserve worst validity', () => {
            it('dialog should remain INVALID after deletion operation which is VALID', () => {
                // navigate to actions
                // select terminal action 5
                // delete action with option
                // open affect dialog
                // verify invalid
                // close
                // navigate to actions
                // select non-terminal action 6
                // delete action with option
                // open affect dialog
                // verify invalid
            })
        })
    })
})