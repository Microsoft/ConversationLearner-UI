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

export function ClickTextAction(expectedResponse) {
  cy.Get('[data-testid="action-scorer-text-response"]').ExactMatch(expectedResponse)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-clickable"]')
    .Click()
}

export function ClickApiAction(apiName, expectedResponse, expectedIndexForActionPlacement) {
  cy.Get('[data-testid="action-scorer-api-name"]').ExactMatch(apiName)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-clickable"]')
    .Click()
}

export function ClickEndSessionAction(expectedData) {
  cy.Get('[data-testid="action-scorer-session-response"]')
    .ExactMatch('EndSession')
    .siblings('[data-testid="action-scorer-session-response-user"]')
    .ExactMatch(expectedData)
    .parents('div.ms-DetailsRow-fields')
    .find('[data-testid="action-scorer-button-clickable"]')
    .Click()
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

export function VerifyNoEnabledSelectActionButtons() {
  cy.Enqueue(() => {

    const clickable = Cypress.$('[data-testid="action-scorer-button-clickable"]')
    const selected = Cypress.$('[data-testid="action-scorer-button-selected"]')
    const addActionButton = Cypress.$('[data-testid="action-scorer-add-action-button"][aria-disabled="false"]')
    const addApiButton = Cypress.$('[data-testid="action-scorer-add-apistub-button"][aria-disabled="false"]')

    if (clickable.length > 0) { helpers.ConLog('VerifyNoEnabledSelectActionButtons', clickable[0].outerHTML) }
    if (selected.length > 0) { helpers.ConLog('VerifyNoEnabledSelectActionButtons', selected[0].outerHTML) }
    if (addActionButton.length > 0) { helpers.ConLog('VerifyNoEnabledSelectActionButtons', addActionButton[0].outerHTML) }
    if (addApiButton.length > 0) { helpers.ConLog('VerifyNoEnabledSelectActionButtons', addApiButton[0].outerHTML) }

    const length = clickable.length + selected.length + addActionButton.length + addApiButton.length

    if (length > 0 ) {
      throw new Error(`We are expecting to find NO enabled Action Scorer buttons, instead we found ${length} of them. See log file for details.`)
    }
  })
}