/**
* Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

export function VerifyPageTitle()       { cy.Get('[data-testid="create-an-action-title"]').contains('Create an Action') }
export function ClickNewAction()        { cy.Get('[data-testid="actions-button-create"]').Click() }
export function ClickWaitForResponse()  { cy.Get('.cl-modal_body').within(() => { cy.Get('.ms-Checkbox-text').Click() })}
export function ClickCreateButton()     { cy.Get('[data-testid="actioncreator-button-create"]').Click() }

export function TypeExpectedEntity(entityNames)         { TypeMultipleEntities('.cl-action-creator--expected-entities', entityNames) }
export function TypeRequiredEntities(entityNames)       { TypeMultipleEntities('.cl-action-creator--required-entities', entityNames) }
export function TypeDisqualifyingEntities(entityNames)  { TypeMultipleEntities('.cl-action-creator--disqualifying-entities', entityNames) }

//What List? What Item? export function VerifyItemInList(name)  { cy.Get('.ms-DetailsRow-cell').should('contain', name) }

export function TypeResponse(textToType) 
{
  cy.Get('.cl-modal_body').within(() => 
  {
    cy.Get('div[data-slate-editor="true"]')
      .clear()
      .type(textToType)
      //.trigger('keyup')
  })
}

function TypeMultipleEntities(selector, entityNames)
{
  if (!Array.isArray(entityNames)) entityNames = [entityNames]

  cy.Get('.cl-modal_body').within(() => 
  {
    cy.Get(selector).within(() => 
    {
      cy.Get('.ms-BasePicker-input')
        .then((element) =>
        {
          for(var i = 0; i < entityNames.length; i++) { cy.wrap(element).type(entityNames[i]).type('{enter}') }
        })
    })
  })
}

export function SelectTypeText() 
{
  cy.Get('[data-testid="dropdown-action-type"]')
    .should("be.visible")
    .Click()
    .Click()
}

export function TypeLetterResponse(letter) 
{
  //if (letter ==="$") letter = '{shift}4';  //TODO: cypress is not resolving shift^4 to trigger entity finder event.
  cy.Get('.cl-modal_body').within(() => 
  {
    cy.Get('div[data-slate-editor="true"]')
      //.type(letter, { release: false })   //enable if the key combination works.
      .clear()
      .type(letter)
      .trigger('onChange')
  })
}


