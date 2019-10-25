/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

import * as models from '../../../support/Models'
import * as modelPage from '../../../support/components/ModelPage'
import * as entityDetectionPanel from '../../../support/components/EntityDetectionPanel'
import * as train from '../../../support/Train'
import * as helpers from '../../../support/Helpers'

describe('New Entity Label on Existing Phrase 1 - Entity Labeling', () => {
  afterEach(helpers.SkipRemainingTestsOfSuiteIfFailed)

  context('Setup', () => {
    it('Import a model and wait for training to complete', () => {
      models.ImportModel('z-newEntityLabel1', 'z-newEntityLabel.cl')
      modelPage.NavigateToTrainDialogs()
      cy.WaitForTrainingStatusCompleted()
    })
  })

  context('One Instance of the Phrase', () => {
    it('Create a new Train Dialog and add a description for unique identification', () => {
      train.CreateNewTrainDialog()
      train.TypeDescription('Test Generated')
    })

    it('User types a new and unique phrase and labels a word as an Entity', () => {
      train.TypeYourMessage('A totally unique phrase')
      entityDetectionPanel.LabelTextAsEntity('unique', 'anEntity')
      train.ClickScoreActionsButton()
      train.SelectTextAction('The only response')
    })

    it('User types the same unique phrase but does not label it, then score actions', () => {
      train.TypeYourMessage('A totally unique phrase')
      train.ClickScoreActionsButton()
    })

    it('Change to Previously Submitted Label from prior turn, then select the only Bot response', () => {
      entityDetectionPanel.VerifyEntityLabelConflictPopupAndChangeToPevious([{ text: 'unique', entity: 'anEntity' }])
      train.SelectTextAction('The only response')
    })
  
  // -----------------------------------------------------------------------------------------------------------------------------
  // Bug 2301: "Change attempted labels to match..." option fails to update the markup on affected chat turns
  // Once this bug is fixed comment out this block of code.
  })
  context('A detour to verify that Bug 2301 reproduced and work around it', () => {
    it('Verify that both user turns have the expected markup, taking the bug into consideration', () => {
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally <strong><em>unique</em></strong> phrase', 4, 0)
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally unique phrase<br>', 4, 2)
    })

    it('Save the Train Dialog and Re-edit the same', () => {
      train.SaveAsIs()
      train.EditTraining('A totally unique phrase', 'A totally unique phrase', 'The only response')
    })
  })

  context('Resume the normal test path...', () => {
  // -----------------------------------------------------------------------------------------------------------------------------

    it('Verify that both user turns have the expected markup', () => {
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally <strong><em>unique</em></strong> phrase', 4, 0)
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally <strong><em>unique</em></strong> phrase', 4, 2)
    })
    
    it('Remove the Entity label from one of the phrases', () => {
      train.SelectChatTurnExactMatch('A totally unique phrase')
      entityDetectionPanel.RemoveEntityLabel('unique', 'anEntity')
      train.ClickSubmitChangesButton()
    })
    
    it('Change the other turn in this TD to our Attempted change', () => {
      entityDetectionPanel.VerifyEntityLabelConflictPopupAndChangeToAttempted([{ text: 'unique', entity: 'anEntity' }])
    })

  // -----------------------------------------------------------------------------------------------------------------------------
  // Bug 2323: "Change attempted labels to match..." option fails to update the markup on affected chat turns
  // Once this bug is fixed comment out this block of code.

    it('Verify that both user turns have the expected markup', () => {
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally <strong><em>unique</em></strong> phrase', 4, 0)
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally <strong><em>unique</em></strong> phrase', 4, 2)
    })

    it('Verify that both user turns have the expected markup', () => {
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally unique phrase<br>', 4, 0)
      train.VerifyChatTurnIsAnExactMatchWithMarkup('A totally unique phrase<br>', 4, 2)
    })
    
    it('', () => {
    })
    
  })
})