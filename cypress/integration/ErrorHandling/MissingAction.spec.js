/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

import * as models from '../../support/Models'
import * as modelPage from '../../support/components/ModelPage'
import * as train from '../../support/Train'
import * as editDialogModal from '../../support/components/EditDialogModal'
import * as common from '../../support/Common'
import * as actions from '../../support/Actions'
import * as scorerModal from '../../support/components/ScorerModal'
import * as helpers from '../../support/Helpers'

describe('Missing Action - ErrorHandling', () => {
  afterEach(helpers.SkipRemainingTestsOfSuiteIfFailed)
  
  context('Setup', () => {
    it('Should import a model and wait for training to complete', () => {
      models.ImportModel('z-missingAction', 'z-whatsYourName.cl')
      modelPage.NavigateToTrainDialogs()
      cy.WaitForTrainingStatusCompleted()
    })

    it('Should verify there are no error icons on the page and create a new Train Dialog', () => {
      modelPage.VerifyNoErrorIconOnPage()
    train.CreateNewTrainDialog()
    })
  })

  context('Train', () => {
    it('Should complete and save a simple 1 action Train Dialog', () => {
      train.TypeYourMessage(common.gonnaDeleteAnAction)
      editDialogModal.ClickScoreActionsButton()
      train.SelectAction(common.whatsYourName)
      train.Save()
    })
  })

  context('Action', () => {
    it('Should delete the action we just used in the Train Dialog', () => {
      modelPage.NavigateToActions()
      actions.DeleteAction(common.whatsYourName)
    })
  })

  context('Train Dialog Grid', () => {
    it('Should verify there are now error icons showing in the Train Dialog grid', () => {
      modelPage.NavigateToTrainDialogs()
      modelPage.VerifyErrorIconForTrainDialogs()
      train.VerifyErrorsFoundInTraining(common.gonnaDeleteAnAction, common.gonnaDeleteAnAction, '')
    })
  })

  context('Train', () => {
    it('Should edit the Train Dialog and verify the expected error messages show up', () => {
      train.EditTraining(common.gonnaDeleteAnAction, common.gonnaDeleteAnAction, '')
      editDialogModal.VerifyErrorMessage(common.trainDialogHasErrorsMessage)

      editDialogModal.SelectChatTurnStartsWith('ERROR: Can’t find Action Id')
      editDialogModal.VerifyErrorMessage('Action does not exist')
      scorerModal.VerifyMissingActionNotice()
    })
  })

  context('Train Add Action', () => {
    it('Should create a new action and correct the error in the Train Dialog', () => {
      scorerModal.ClickAddActionButton()
      actions.CreateNewAction({ response: common.whatsYourName, expectedEntities: ['name'] })
      editDialogModal.VerifyNoErrorMessage()
      editDialogModal.ClickSaveCloseButton()
      modelPage.VerifyNoErrorIconOnPage()
    })
  })
})