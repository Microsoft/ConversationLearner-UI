/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

import * as helpers from '../../support/Helpers'

// data-testid="teach-session-admin-train-status" (Running, Completed, Failed)
export function ClickRefreshScoreButton() { cy.Get('[data-testid="teach-session-admin-refresh-score-button"]').Click() }
export function SelectAnAction() { cy.Get('[data-testid="action-scorer-button-clickable"]').should("be.visible").Click() }
export function ClickAddActionButton() { cy.Get('[data-testid="action-scorer-add-action-button"]').Click() }
export function VerifyMissingActionNotice() { cy.Get('.cl-font--warning').ExactMatch('MISSING ACTION') }

export function ClickAction(expectedResponse, expectedIndexForActionPlacement) {
  cy.Get('[data-testid="action-scorer-text-response"]').ExactMatch(expectedResponse)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-clickable"]')
    .Click()
  VerifyChatMessage(expectedResponse, expectedIndexForActionPlacement)
}

export function ClickEndSessionAction(expectedData, expectedIndexForActionPlacement) {
  cy.Get('[data-testid="action-scorer-session-response"]')
    .ExactMatch('EndSession')
    .siblings('[data-testid="action-scorer-session-response-user"]')
    .ExactMatch(expectedData)
    .parents('div.ms-DetailsRow-fields')
    .find('[data-testid="action-scorer-button-clickable"]')
    .Click()

  VerifyEndSessionChatMessage(expectedData, expectedIndexForActionPlacement)
}

// To verify the last chat utterance leave expectedIndexOfMessage undefined
export function VerifyChatMessage(expectedMessage, expectedIndexOfMessage) {
  const expectedUtterance = expectedMessage.replace(/'/g, "’")
  cy.Get('[data-testid="web-chat-utterances"]').then(elements => {
    if (!expectedIndexOfMessage) expectedIndexOfMessage = elements.length - 1
    cy.wrap(elements[expectedIndexOfMessage]).within(e => {
      cy.get('div.format-markdown > p').should('have.text', expectedUtterance)
    })
  })
}

export function VerifyEndSessionChatMessage(expectedData, expectedIndexOfMessage) {
  const expectedUtterance = 'EndSession: ' + expectedData.replace(/'/g, "’")
  cy.Get('[data-testid="web-chat-utterances"]').then(elements => {
    if (!expectedIndexOfMessage) expectedIndexOfMessage = elements.length - 1
    const element = Cypress.$(elements[expectedIndexOfMessage]).find('div.wc-adaptive-card > div > div > p')[0]
    expect(helpers.TextContentWithoutNewlines(element)).to.equal(expectedUtterance)
  })
}

export function VerifyContainsEnabledAction(expectedResponse) {
  cy.Get('[data-testid="action-scorer-text-response"]').contains(expectedResponse)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-clickable"]')
    .should('be.enabled')
}

export function VerifyContainsDisabledAction(expectedResponse) {
  cy.Get('[data-testid="action-scorer-text-response"]').contains(expectedResponse)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-no-click"]')
    .should('be.disabled')
}

export function VerifyContainsEnabledEndSessionAction(expectedData) { VerifyEndSessionActionState(expectedData, 'action-scorer-button-clickable', 'be.enabled') }
export function VerifyContainsDisabledEndSessionAction(expectedData) { VerifyEndSessionActionState(expectedData, 'action-scorer-button-no-click', 'be.disabled') }
export function VerifyContainsSelectedEndSessionAction(expectedData) { VerifyEndSessionActionState(expectedData, 'action-scorer-button-selected', 'be.enabled') }

function VerifyEndSessionActionState(expectedData, selectButtonDataTestId, stateToVerify) {
  cy.Get('[data-testid="action-scorer-session-response"]')
    .ExactMatch('EndSession')
    .siblings('[data-testid="action-scorer-session-response-user"]')
    .ExactMatch(expectedData)
    .parents('div.ms-DetailsRow-fields')
    .find(`[data-testid="${selectButtonDataTestId}"]`)
    .should(stateToVerify)
}