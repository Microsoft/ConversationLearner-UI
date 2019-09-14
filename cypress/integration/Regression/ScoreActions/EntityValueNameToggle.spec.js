/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

import * as models from '../../../support/Models'
import * as modelPage from '../../../support/components/ModelPage'
import * as entities from '../../../support/Entities'
import * as actions from '../../../support/Actions'
import * as actionModal from '../../../support/components/ActionModal'
import * as scorerModal from '../../../support/components/ScorerModal'
import * as common from '../../../support/Common'
import * as train from '../../../support/Train'
import * as common from '../../../support/Common'
import * as helpers from '../../../support/Helpers'

describe('Entity Value-Name Toggle - Score Actions', () => {
  afterEach(helpers.SkipRemainingTestsOfSuiteIfFailed)
  let generatedScoreActionsData = new scorerModal.GeneratedData('EntityValueNameToggle.json')

  context('Setup', () => {
    it('Create a model to test against and navigate to Train Dialogs', () => {
      models.ImportModel('z-valueNameToggle', 'z-valueNameToggle.cl')
      modelPage.NavigateToTrainDialogs()
    })
  })

  context('Train Dialog', () => {
    it('Edit the Train Dialog and Bring up Score Actions Panel', () => {
      train.EditTraining('Testing Entity Value/Name Toggle feature.', "We're done here.", 'Goodbye $name')
    })

    it('Select and Verify the Presence or Absence of Toggle Button for Each Bot Turn', () => {
      // While verifying everything in the Score Actions Panel this also verifies 
      // the presence or absense of the toggle switch on all Actions at each turn.
      // These will vary due to the values contained (or not) in Entities.
      train.VerifyEachBotChatTurn(() => { generatedScoreActionsData.VerifyScoreActionsListUnwrapped() })      
    })


    it('Toggle a Text Action then verify text changes', () => {
      scorerModal.ClickTextEntityValueNameToggleButon('Hello Billy Bob')
      scorerModal.VerifyContainsTextAction('Hello $name')
    })

    it('Toggle an API Action then verify text changes', () => {
      scorerModal.ClickApiEntityValueNameToggleButon('RenderTheArgs')
      scorerModal.VerifyContainsApiAction('RenderTheArgslogic(memoryManager, firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg, seventhArg)firstArg:"$1stArg"secondArg:"$2ndArg"thirdArg:"333"fourthArg:"4444"fifthArg:"five"sixthArg:"six"seventhArg:"seven"render(result, memoryManager, firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg, seventhArg)firstArg:"$1stArg"secondArg:"$2ndArg"thirdArg:"three"fourthArg:"four"fifthArg:"55555"sixthArg:"666666"seventhArg:"7777777"')
    })

    it('Toggle a Card Action then verify text changes', () => {
      scorerModal.ClickCardEntityValueNameToggleButon('promptWithPicture')
      scorerModal.VerifyContainsCardAction('promptWithPicturetitle:Do you like flowers?image:https://cdn.pixabay.com/photo/2018/10/30/16/06/water-lily-3784022__340.jpgline1:Flowers make life beautifulline2:$fruit start out as a flowerline3:Bees Like Flowersbutton1:I Like Flowersbutton2:Flowers are for the birds and bees')
    })

    it('Toggle an EndSession Action then verify text changes', () => {
      scorerModal.ClickEndSessionEntityValueNameToggleButon('Goodbye Billy Bob')
      scorerModal.VerifyContainsEndSessionAction('Goodbye $name')
    })

    // Since we toggled multiple items, reverify the entire grid.
    // This will verify that each toggled Action remained in the
    // toggled state and were not affected by toggling other actions.
    generatedScoreActionsData.VerifyScoreActionsList()

    it('Toggle all Actions back to their original state and then verify text changes', () => {
      scorerModal.ClickTextEntityValueNameToggleButon('Hello $name')
      scorerModal.VerifyContainsTextAction('Hello Billy Bob')

      scorerModal.ClickApiEntityValueNameToggleButon('RenderTheArgs')
      scorerModal.VerifyContainsApiAction('RenderTheArgslogic(memoryManager, firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg, seventhArg)firstArg:"1 One"secondArg:"Two 2 Two 2"thirdArg:"333"fourthArg:"4444"fifthArg:"five"sixthArg:"six"seventhArg:"seven"render(result, memoryManager, firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg, seventhArg)firstArg:"1 One"secondArg:"Two 2 Two 2"thirdArg:"three"fourthArg:"four"fifthArg:"55555"sixthArg:"666666"seventhArg:"7777777"')

      scorerModal.ClickCardEntityValueNameToggleButon('promptWithPicture')
      scorerModal.VerifyContainsCardAction('promptWithPicturetitle:Do you like flowers?image:https://cdn.pixabay.com/photo/2018/10/30/16/06/water-lily-3784022__340.jpgline1:Flowers make life beautifulline2:ORANGES start out as a flowerline3:Bees Like Flowersbutton1:I Like Flowersbutton2:Flowers are for the birds and bees')

      scorerModal.ClickEndSessionEntityValueNameToggleButon('Goodbye $name')
      scorerModal.VerifyContainsEndSessionAction('Goodbye Billy Bob')
    })

    // Since we toggled multiple items, reverify the entire grid.
    // This will verify that each toggled Action remained in the
    // toggled state and were not affected by toggling other actions.
    generatedScoreActionsData.VerifyScoreActionsList()

    generatedScoreActionsData.SaveGeneratedData()
  })

  // Manually EXPORT this to fixtures folder and name it 'z-comprehensive1.cl'
})