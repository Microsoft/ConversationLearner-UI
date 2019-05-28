/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

import * as models from '../../../support/Models'
import * as modelPage from '../../../support/components/ModelPage'
import * as train from '../../../support/Train'
import * as trainDialogsGrid from '../../../support/components/TrainDialogsGrid'
import * as common from '../../../support/Common'
import * as actions from '../../../support/Actions'
import * as scorerModal from '../../../support/components/ScorerModal'
import * as helpers from '../../../support/Helpers'

describe('Exception Callback - ErrorHandling', () => {
  afterEach(helpers.SkipRemainingTestsOfSuiteIfFailed)
  
  context('Setup', () => {
    it('Should import a model to test against and navigate to Train Dialogs view', () => {
      models.ImportModel('z-ExceptnCallback', 'z-ApiCallbacks.cl')
      modelPage.NavigateToTrainDialogs()
    })
  })

  context.skip('Train Dialog that will be Discarded by an Error', () => {
    it('Should create a new Train Dialog', () => {
      train.CreateNewTrainDialog()
    })

    it('Should add a user turn, to be used later to cause an error, and verify it is in the chat pane', () => {
      train.TypeYourMessage('This is an entityError')
      train.LabelTextAsEntity('entityError', 'entityError')
      train.ClickScoreActionsButton()
      train.VerifyErrorPopup("Error in Bot's EntityDetectionCallback:  An intentional error was invoked in the EntityDetectionCallback function.")
      train.ClickConfirmCancelOkButton()
    })
  })

  context('Train Dialog that will be Saved', () => {
    it('Should create a new Train Dialog', () => {
      train.CreateNewTrainDialog()
    })

    it('Should add a user turn, to be used later to cause an error, and verify it is in the chat pane', () => {
      train.TypeYourMessage('This can be an entityError')
      train.ClickScoreActionsButton()
      train.SelectApiTextAction('ExceptionAPI', 'ExceptionAPI: Hello with no exception')
    })

    it('Should add a logicError turn and verify it renders a card with an error message in the chat pane', () => {
      train.TypeYourMessage('This is a logicError')
      train.LabelTextAsEntity('logicError', '+logicError')
      train.ClickScoreActionsButton()
      train.SelectApiCardAction('ExceptionAPI', 'Exception hit in Bot’s API Callback: ‘ExceptionAPI’', 'Error: ExceptionAPI: Logic Error')
    })

    it('Should add a turn to remove the logicError and verify it renders a NON-error message', () => {
      train.TypeYourMessage('Remove the logicError')
      train.LabelTextAsEntity('logicError', '-logicError')
      train.ClickScoreActionsButton()
      train.SelectApiTextAction('ExceptionAPI', 'ExceptionAPI: Hello with no exception')
    })

    it('Should add a renderError turn and verify it renders a card with an error message in the chat pane', () => {
      train.TypeYourMessage('This will produce a renderError')
      train.LabelTextAsEntity('renderError', '+renderError')
      train.ClickScoreActionsButton()
      train.SelectApiCardAction('ExceptionAPI', 'Exception hit in Bot’s API Callback: ‘ExceptionAPI’', 'Error: ExceptionAPI: Render Error')
    })

    it('Should add a logicError turn again and verify the error message is for the logicError, not the renderError', () => {
      train.TypeYourMessage('This is a logicError')
      train.LabelTextAsEntity('logicError', '+logicError', false)
      train.ClickScoreActionsButton()
      train.SelectApiCardAction('ExceptionAPI', 'Exception hit in Bot’s API Callback: ‘ExceptionAPI’', 'Error: ExceptionAPI: Logic Error')
    })

    it('Should add a turn to remove the logicError and verify it renders the error message for renderError once again', () => {
      train.TypeYourMessage('Remove the logicError')
      train.LabelTextAsEntity('logicError', '-logicError', false)
      train.ClickScoreActionsButton()
      train.SelectApiCardAction('ExceptionAPI', 'Exception hit in Bot’s API Callback: ‘ExceptionAPI’', 'Error: ExceptionAPI: Render Error')
    })

    it('Should add a turn to remove the renderError and verify it renders a NON-error message', () => {
      train.TypeYourMessage('Clear out the renderError')
      train.LabelTextAsEntity('renderError', '-renderError')
      train.ClickScoreActionsButton()
      train.SelectApiTextAction('ExceptionAPI', 'ExceptionAPI: Hello with no exception')
    })

    it('Should add a user turn, to be used later to cause an error, and verify it is in the chat pane', () => {
      train.TypeYourMessage('An entityError shall go here as well')
      train.ClickScoreActionsButton()
      train.SelectApiTextAction('ExceptionAPI', 'ExceptionAPI: Hello with no exception')
    })

    it('More to do here - waiting for fix for Bug 2136: API Errors not behaving like other errors', () => {
    })

    it('Should save the training and verify it is in the grid', () => {
      train.SaveAsIsVerifyInGrid()
    })
  })

  context('Edit the Train Dialog to Verify the Errors Persisted', () => {
    it('Should edit the Train Dialog we just saved', () => {
      train.EditTraining('This can be an entityError', 'An entityError shall go here as well', 'ExceptionAPI')
    })

    // Bug 2142: TEST BLOCKER - API Callback error rendering is different between original TD rendering and when editing a Train Dialog
    // Once this bug is fixed the calls to "VerifyCardChatMessage" will fail due to the first parameter needing to be changed.
    it('Should verify that all Bot responses persisted correctly', () => {
      train.VerifyTextChatMessage('ExceptionAPI: Hello with no exception', 1)
      train.VerifyCardChatMessage('Exception hit in Bot’s API Callback:ExceptionAPI', 'Error: ExceptionAPI: Logic Error', 3)
      train.VerifyTextChatMessage('ExceptionAPI: Hello with no exception', 5)
      train.VerifyCardChatMessage('Exception hit in Bot’s API Callback:ExceptionAPI', 'Error: ExceptionAPI: Render Error', 7)
      train.VerifyCardChatMessage('Exception hit in Bot’s API Callback:ExceptionAPI', 'Error: ExceptionAPI: Logic Error', 9)
      train.VerifyCardChatMessage('Exception hit in Bot’s API Callback:ExceptionAPI', 'Error: ExceptionAPI: Render Error', 11)
      train.VerifyTextChatMessage('ExceptionAPI: Hello with no exception', 13)
      train.VerifyTextChatMessage('ExceptionAPI: Hello with no exception', 15)
    })

    it('More to do here - waiting for fix for Bug 2136: API Errors not behaving like other errors', () => {
    })

    it('Should save the training and verify it is in the grid', () => {
      train.SaveAsIsVerifyInGrid()
    })
  })
})
