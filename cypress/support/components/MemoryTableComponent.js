/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

// When an entity is detected/selected that replaces a previous value
// the "displacedValue" parameter will verify it is displayed.
export function VerifyEntityInMemory(entityName, entityValues, displacedValue) {
  cy.Get('[data-testid="entity-memory-name"]').contains(entityName)

  cy.Get('.cl-font--emphasis,[data-testid="entity-memory-value"]').then(elements => {
    entityValues.forEach(entityValue => {
      cy.wrap(elements).contains(entityValue)
    })
  })

  if (displacedValue) cy.Get('.cl-font--deleted,[data-testid="entity-memory-value"]').contains(displacedValue)
}
