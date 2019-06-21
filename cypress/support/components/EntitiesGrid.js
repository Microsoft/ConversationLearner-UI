/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

export function VerifyPageTitle() { cy.Get('[data-testid="entities-title"]').contains('Entities').should('be.visible') }
export function ClickButtonNewEntity() { cy.Get('[data-testid="entities-button-create"]').Click() }
export function EditEntity(name) { new Row(name).EditEntity() }

export class Row {
  constructor(entityName) {
    cy.Get('[data-testid="entities-name"]')
      .ExactMatch(entityName)
      .parents('div.ms-DetailsRow-fields')
      .as('entityDetailsRow')
  }

  EditEntity() { cy.Get('@entityDetailsRow').Click() }
  
  VerifyType(type) { cy.Get('@entityDetailsRow').find('[data-testid="entities-type"]').contains(type) }
  VerifyResolverType(type) { cy.Get('@entityDetailsRow').find('[data-testid="entities-resolver"]').contains(type) }
  VerifyResolverNone() { cy.Get('@entityDetailsRow').find('[data-testid="entities-resolver-none"]') }
  VerifyMultiValueChecked() { cy.Get('@entityDetailsRow').find('i[data-icon-name="CheckMark"][data-testid="entities-multi-value"]') }
  VerifyMultiValueUnChecked() { cy.Get('@entityDetailsRow').find('i[data-icon-name="Remove"][data-testid="entities-multi-value"]') }
  VerifyNegatableChecked() { cy.Get('@entityDetailsRow').find('i[data-icon-name="CheckMark"][data-testid="entities-negatable"]') }
  VerifyNegatableUnChecked() { cy.Get('@entityDetailsRow').find('i[data-icon-name="Remove"][data-testid="entities-negatable"]') }
}

export function VerifyEntityNotInGrid(name) {
  cy.DoesNotContain('[data-testid="entities-name"]', 'name')
  // cy.Enqueue(() => {
  //   if (Cypress.$(`[data-testid="entities-name"]:contains(${name})`).length != 0) {
  //     throw new Error(`Entity "${name}" should not be in the grid.`)
  //   }
  // })
}