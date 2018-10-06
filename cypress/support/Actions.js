/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

const actionsPage = require('../support/components/ActionsPage')
const actionsModal = require('../support/components/ActionsModal')
const modelPage = require('../support/components/ModelPage')

export function CreateNewAction({response, expectedEntity, requiredEntities, disqualifyingEntities, type = 'TEXT' })
{
  modelPage.NavigateToActions()
  actionsPage.ClickNewAction()
  // TODO: this is the default but we need to get this working... actionsModal.selectTypeText()
  actionsModal.TypeResponse(response)
  if (expectedEntity) actionsModal.TypeExpectedEntity(expectedEntity)
  if (requiredEntities) actionsModal.TypeRequiredEntities(requiredEntities)
  if (disqualifyingEntities) actionsModal.TypeDisqualifyingEntities(disqualifyingEntities)
  actionsModal.ClickCreateButton()
}