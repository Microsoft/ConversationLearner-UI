/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

import * as homePage from './components/HomePage'
import * as modelPage from './components/ModelPage'
import * as scorerModal from './components/ScorerModal'
import * as trainDialogsGrid from './components/TrainDialogsGrid'
import * as mergeModal from './components/MergeModal'
import * as helpers from './Helpers'

let currentTrainingSummary
let originalTrainingSummary
let isBranched
let originalChatMessages
let editedChatMessages

function Today() { return Cypress.moment().format("MM/DD/YYYY") }

export const AllChatMessagesSelector = 'div[data-testid="web-chat-utterances"] > div.wc-message-content > div'
export const TypeYourMessageSelector = 'input.wc-shellinput[placeholder="Type your message..."]' // data-testid NOT possible
export const ScoreActionsButtonSelector = '[data-testid="score-actions-button"]'

export function TypeAlternativeInput(trainMessage) { cy.Get('[data-testid="entity-extractor-alternative-input-text"]').type(`${trainMessage}{enter}`) }
export function ClickSetInitialStateButton() { cy.Get('[data-testid="teach-session-set-initial-state"]').Click() }
export function ClickScoreActionsButton() { cy.Get(ScoreActionsButtonSelector).Click() }
export function VerifyEntityMemoryIsEmpty() { cy.Get('[data-testid="memory-table-empty"]').contains('Empty') }
export function ClickAddAlternativeInputButton() { cy.Get('[data-testid="entity-extractor-add-alternative-input-button"]').Click() }
export function ClickEntityDetectionToken(tokenValue) { cy.Get('[data-testid="token-node-entity-value"]').contains(tokenValue).Click() }
export function ClickSubmitChangesButton() { cy.Get('[data-testid="submit-changes-button"]').Click() }
export function GetAllChatMessages() { return helpers.StringArrayFromElementText(AllChatMessagesSelector) }
export function VerifyErrorMessage(expectedMessage) { cy.Get('div.cl-editdialog-error').find('span').ExactMatch(expectedMessage) }
export function VerifyWarningMessage(expectedMessage) { cy.Get('[data-testid="dialog-modal-warning"]').find('span').ExactMatch(expectedMessage) }
export function VerifyNoErrorMessage() { cy.DoesNotContain('div.cl-editdialog-error') }
export function VerifyErrorPopup(expectedMessage) { cy.Get('p.ms-Dialog-title').ExactMatch(expectedMessage) }
export function ClickPopupConfirmCancelOkButton() { cy.Get('[data-testid="confirm-cancel-modal-ok"]').Click() }
export function ClickDeleteChatTurn() { cy.Get('[data-testid="chat-edit-delete-turn-button"]').Click() }
export function VerifyTypeYourMessageIsMissing() { cy.DoesNotContain(TypeYourMessageSelector) }
export function VerifyScoreActionsButtonIsMissing() { cy.DoesNotContain(ScoreActionsButtonSelector) }

export function ClickSaveCloseButton() { cy.Get('[data-testid="edit-teach-dialog-close-save-button"]').Click() }
export function VerifyCloseButtonLabel() { cy.Get('[data-testid="edit-teach-dialog-close-save-button"]').contains('Close') }
export function VerifySaveBranchButtonLabel() { cy.Get('[data-testid="edit-teach-dialog-close-save-button"]').contains('Save Branch') }
export function ClickAbandonDeleteButton() { cy.Get('[data-testid="edit-dialog-modal-abandon-delete-button"]').Click() }
export function VerifyDeleteButtonLabel() { cy.Get('[data-testid="edit-dialog-modal-abandon-delete-button"]').contains('Delete') }
export function VerifyAbandonBranchButtonLabel() { cy.Get('[data-testid="edit-dialog-modal-abandon-delete-button"]').contains('Abandon Branch') }
export function ClickUndoButton() { cy.Get('[data-testid="edit-teach-dialog-undo-button"]').Click() }
export function ClickConfirmAbandonDialogButton() { return cy.Get('[data-testid="confirm-cancel-modal-accept"]').Click() }
export function ClickReplayButton() { cy.Get('[data-testid="edit-dialog-modal-replay-button"]').Click() }

export function VerifyDescription(expectedDescription) { cy.Get(`input.cl-borderless-text-input#description[value="${expectedDescription}"]`) }
export function TypeDescription(description) { cy.Get('input.cl-borderless-text-input#description').clear().type(`${description}{enter}`) }
export function ClickAddTagButton() { cy.Get('[data-testid="tags-input-add-tag-button"]').Click() }
export function VerifyNoTags() { cy.Get('div.cl-tags > div.cl-tags__tag > button > i [data-icon-name="Clear"]').should('have.length', 0) }

export function ClickClearFilterButton() { cy.Get('[data-testid="train-dialogs-clear-filter-button"]').Click() }

export function VerifyTags(tags) { 
  cy.Enqueue(() => {
    helpers.ConLog('VerifyTags', 'Start')
    const tagsOnPage = helpers.StringArrayFromElementText('div.cl-tags > div.cl-tags__tag > span')
    let missingTags = []
    tags.forEach(tag => {
      if (!tagsOnPage.find(tagOnPage => tag === tagOnPage)) missingTags.push(tag)
    })
    if (missingTags.length > 0) throw new Error(`Failed to find these tags: ${missingTags}`)
  })
}

// Pass in an array of tag strings.
// If you try to call this twice in a row, it will fail to find the "Add Tag Button"
// so don't do it, this was designed to take multiple tags.
export function AddTags(tags) { 
  ClickAddTagButton()
  let tagList = ''
  tags.forEach(tag => { tagList += `${tag}{enter}` })
  cy.Get('[data-testid="tags-input-tag-input"]').type(tagList)
}

// Verify that the branch button is within the same control group as the message.
export function VerifyBranchButtonGroupContainsMessage(message) {
  cy.Get('[data-testid="edit-dialog-modal-branch-button"]').as('branchButton')
    .parents('div.wc-message-selected').contains('p', message)
}

export function AbandonBranchChanges() {
  ClickAbandonDeleteButton()
  homePage.ClickConfirmButton()
}

export function VerifyChatMessageCount(expectedCount) {
  cy.wrap(1, {timeout: 10000}).should(() => {
    let actualCount = GetAllChatMessages().length
    if(actualCount != expectedCount) {
      throw new Error(`Expecting the number of chat messages to be ${expectedCount} instead it is ${actualCount}`)
    }
  })
}

// -----------------------------------------------------------------------------
// Selects FROM ALL chat messages, from both Bot and User.
// Once clicked, more UI elements will become visible & enabled.
// OPTIONAL index parameter lets you select other than the 1st 
// instance of a message.
// RETURNS: The index of the selected turn.

export function SelectChatTurnExactMatch(message, index = 0) { 
  return SelectChatTurnInternal(message, index, (elementText, transformedMessage) => elementText === transformedMessage)}

export function SelectChatTurnStartsWith(message, index = 0) {
  return SelectChatTurnInternal(message, index, (elementText, transformedMessage) => elementText.startsWith(transformedMessage))}

function SelectChatTurnInternal(message, index, matchPredicate) {
  const funcName = `SelectChatTurnInternal(${message}, ${index})`
  cy.ConLog(funcName, `Start`)

  cy.WaitForStableDOM()
  cy.Enqueue(() => {
    message = message.replace(/'/g, "’")
    const elements = Cypress.$(AllChatMessagesSelector)
    helpers.ConLog(funcName, `Chat message count: ${elements.length}`)
    for (let i = 0; i < elements.length; i++) {
      const innerText = helpers.TextContentWithoutNewlines(elements[i])
      helpers.ConLog(funcName, `Chat turn - Text: '${innerText}' - Inner HTML '${elements[i].innerHTML}'`)
      if (matchPredicate(innerText, message)) {
        if (index > 0) index--
        else {
          helpers.ConLog(funcName, `FOUND!`)
          elements[i].click()
          return i
        }
      }
      else helpers.ConLog(funcName, `NOT A MATCH`)
      helpers.ConLog(funcName, `NEXT`)
    }
    throw new Error(`${funcName} - Failed to find the message in chat utterances`)
  })
}

// -----------------------------------------------------------------------------

// This is meant to be called after SelectChatTurn for a user message.
// Do NOT use this for bot messages, since they have no branching capabilities.
// Side Effect: '@branchButton' alias is created.
export function VerifyBranchButtonIsInSameControlGroupAsMessage(message) {
  // Verify that the branch button is within the same control group as the originalMessage that was just selected.
  cy.Get('[data-testid="edit-dialog-modal-branch-button"]').as('branchButton')
    .parents('div.wc-message-selected').contains('p', message)
}

// This depends on the '@branchButton' alias having been created by the VerifyBranchButtonIsInSameControlGroupAsMessage() function.
// *** export function BranchChatTurn(message) {
//   cy.Get('@branchButton').Click()
//   cy.Get('[data-testid="user-input-modal-new-message-input"]').type(`${message}{enter}`)
// }

// Creates the '@allChatTurns' alias.
export function CreateAliasForAllChatTurns() {
  cy.Get('[data-testid="web-chat-utterances"]').as('allChatTurns')
}

export function VerifyChatTurnControlButtons(element, index) {
  let turnIsUserTurn
  if (element.classList.contains('wc-message-from-me')) turnIsUserTurn = true
  else if (element.classList.contains('wc-message-from-bot')) turnIsUserTurn = false
  else {
    helpers.Dump(`VerifyChatTurnControlButtons()`, element)
    throw new Error('Expecting element to contain class with either "wc-message-from-me" or "wc-message-from-bot" (see console output for element dump)')
  }

  if (index > 0) cy.Contains('[data-testid="chat-edit-delete-turn-button"]', 'Delete Turn')
  else cy.DoesNotContain('[data-testid="chat-edit-delete-turn-button"]')

  cy.Contains('[data-testid="chat-edit-add-bot-response-button"]', '+')

  if (turnIsUserTurn) cy.Get('[data-testid="edit-dialog-modal-branch-button"]').Contains('Branch').ConLog(`VerifyChatTurnControlButtons()`, 'Branch Found')
  else cy.DoesNotContain('[data-testid="edit-dialog-modal-branch-button"]')

  cy.Contains('[data-testid="chat-edit-add-user-input-button"]', '+')
}

// Verify that there are NO Chat Edit Controls at all on this page.
export function VerifyThereAreNoChatEditControls() {
  cy.DoesNotContain('[data-testid="chat-edit-delete-turn-button"]')
  cy.DoesNotContain('[data-testid="chat-edit-add-bot-response-button"]', '+')
  cy.DoesNotContain('[data-testid="edit-dialog-modal-branch-button"]')
  cy.DoesNotContain('[data-testid="chat-edit-add-user-input-button"]', '+')
}

export function VerifyEndSessionChatTurnControls() {
  cy.Contains('[data-testid="chat-edit-delete-turn-button"]', 'Delete Turn')
  cy.DoesNotContain('[data-testid="chat-edit-add-bot-response-button"]')
  cy.DoesNotContain('[data-testid="edit-dialog-modal-branch-button"]')
  cy.DoesNotContain('[data-testid="chat-edit-add-user-input-button"]')
}


// This is an odd verification function in that it is validating test code that we
// had wrong at one point. We need to do this because if the cy.DoesNotContain fails
// to find the selector, it could mean that cy.DoesNotContain method has a bug in it.
export function VerifyCyDoesNotContainMethodWorksWithSpecialChatSelector(userMessage, botMessage) {
  cy.log('EXPECTED FAILURE Comming Next')
  cy.DoesNotContain('[data-testid="chat-edit-add-bot-response-button"]', '+', true).then(expectedFailureOccurred => {
    expect(expectedFailureOccurred).to.be.true
  })
}

export function LabelTextAsEntity(text, entity, itMustNotBeLabeledYet = true) {
  function LabelIt() {
    // This actually works if text is a word or a phrase.
    cy.Get('body').trigger('Test_SelectWord', { detail: text })
    cy.Get('[data-testid="fuse-match-option"]').contains(entity).Click()
  }

  if (itMustNotBeLabeledYet) {
    LabelIt()
  } else {
    // First make sure it is not already labeled before trying to label it.
    cy.WaitForStableDOM()
    cy.Enqueue(() => {
      let labeledAlready = false
      const elements = Cypress.$('[data-testid="token-node-entity-value"] > span > span')

      // If you need to find a phrase, this part of the code will fail, 
      // you will need to upgrade this code in that case.
      for (let i = 0; i < elements.length; i++) {
        if (helpers.TextContentWithoutNewlines(elements[i]) === text) {
          labeledAlready = Cypress.$(elements[i]).parents('.cl-entity-node--custom')
                            .find(`[data-testid="custom-entity-name-button"]:contains('${entity}')`)
                            .length > 0
          break;
        }
      }
      
      if (!labeledAlready) {
        LabelIt()
      }
    })
  }
}

// Verify that a specific word of a user utterance has been labeled as an entity.
// word = a word within the utterance that should already be labeled
// entity = name of entity the word was labeled with
// *** This may work for multiple word labels, but you must only pass in the one
// *** word that uniquely identifies the labeled text
export function RemoveEntityLabel(word, entity, index = 0) {
  cy.Get('div.slate-editor').then(elements => {
    expect(elements.length).to.be.at.least(index - 1)
    cy.wrap(elements[index]).within(() => {
      cy.wrap(elements[index]).click()
      cy.Get('[data-testid="token-node-entity-value"] > span > span')
        .ExactMatch(word)
        .parents('.cl-entity-node--custom')
        .find('[data-testid="custom-entity-name-button"]')
        .contains(entity)
        .Click()

      cy.Get('button[title="Unselect Entity"]').Click()
    })
  })
}

// Verify that a specific word of a user utterance has been labeled as an entity.
//  word = a word within the utterance that should already be labeled
//  entity = name of entity the word should be labeled with
// *** This does NOT work for multiple words. ***
export function VerifyEntityLabel(word, entity) {
  cy.log(`Verify that '${word}' is labeled as entity '${entity}'`)
  cy.Get('[data-testid="token-node-entity-value"] > span > span')
    .ExactMatch(word)
    .parents('.cl-entity-node--custom')
    .find('[data-testid="custom-entity-name-button"]')
    .contains(entity)
}

// textEntityPairs is an array of objects contains these two variables:
//  text = a word within the utterance that should already be labeled
//  entity = name of entity to label the word with
export function VerifyEntityLabeledDifferentPopupAndClose(textEntityPairs) { VerifyEntityLabeledDifferentPopupAndClickButton(textEntityPairs, 'Close') }
export function VerifyEntityLabeledDifferentPopupAndAccept(textEntityPairs) { VerifyEntityLabeledDifferentPopupAndClickButton(textEntityPairs, 'Accept') }

function VerifyEntityLabeledDifferentPopupAndClickButton(textEntityPairs, buttonLabel) {
  cy.Get('[data-testid="extract-conflict-modal-previously-submitted-labels"]').as('ExtractConflictModal')
    .next('div.entity-labeler')
    .within(() => { textEntityPairs.forEach(textEntityPair => VerifyEntityLabel(textEntityPair.text, textEntityPair.entity)) })

  cy.get('@ExtractConflictModal').parent().next().contains(buttonLabel).Click()  
}

export function VerifyEntityLabelWithinSpecificInput(textEntityPairs, index) {
  cy.Get('div.slate-editor').then(elements => {
    expect(elements.length).to.be.at.least(index - 1)
    cy.wrap(elements[index]).within(() => {
      textEntityPairs.forEach(textEntityPair => VerifyEntityLabel(textEntityPair.text, textEntityPair.entity))
    })
  })
}

export function InsertUserInputAfter(existingMessage, newMessage) {
  SelectChatTurnExactMatch(existingMessage)

  // This ODD way of clicking is to avoid the "Illegal Invocation" error that
  // happens with this specific UI element.
  cy.RunAndExpectDomChange(() => { Cypress.$('[data-testid="chat-edit-add-user-input-button"]')[0].click() })

  cy.Get('[data-testid="user-input-modal-new-message-input"]').type(`${newMessage}{enter}`)
}

// OPTIONAL newMessage parameter if provided will replace the autoselected Bot response
// OPTIONAL index parameter lets you select other than the 1st 
// instance of a message as the point of insertion.
export function InsertBotResponseAfter(existingMessage, newMessage, index = 0) {
  cy.ConLog(`InsertBotResponseAfter(${existingMessage}, ${newMessage})`, `Start`)
  cy.Enqueue(() => { return SelectChatTurnExactMatch(existingMessage, index) }).then(indexOfSelectedChatTurn => {
    helpers.ConLog(`InsertBotResponseAfter(${existingMessage}, ${newMessage})`, `indexOfSelectedChatTurn: ${indexOfSelectedChatTurn}`)
    
    // This ODD way of clicking is to avoid the "Illegal Invocation" error that
    // happens with this specific UI element.
    cy.RunAndExpectDomChange(() => { Cypress.$('[data-testid="chat-edit-add-bot-response-button"]')[0].click() })
    
    if (newMessage) {
      cy.WaitForStableDOM()
      
      // TODO: Temporarily commented this out to see if tests start failing on this bug again.
      //cy.wait(1000) // TODO: Remove this after fixing Bug 1855: More Odd Rendering in Train Dialog Chat Pane
      
      cy.Enqueue(() => { 
        // Sometimes the UI has already automaticly selected the Bot response we want
        // so we need to confirm that we actually need to click on the action, 
        // otherwise an unnecessary message box pops up that we don't want to deal with.

        const chatMessages = GetAllChatMessages()
        const indexOfInsertedBotResponse = indexOfSelectedChatTurn + 1
        if (chatMessages[indexOfInsertedBotResponse] != newMessage) {
          scorerModal.ClickTextAction(newMessage)
          VerifyTextChatMessage(newMessage, indexOfInsertedBotResponse)
        }
      })
    }
    cy.ConLog(`InsertBotResponseAfter(${existingMessage}, ${newMessage})`, `End`)
  })
}

export function VerifyChatTurnIsNotAnExactMatch(turnTextThatShouldNotMatch, expectedTurnCount, turnIndex) {
  VerifyChatTurnInternal(expectedTurnCount, turnIndex, chatMessageFound => {
    if (chatMessageFound === turnTextThatShouldNotMatch) { 
      throw new Error(`Chat turn ${turnIndex} should NOT be an exact match to: ${turnTextThatShouldNotMatch}`) 
    }
  })
}

export function VerifyChatTurnIsAnExactMatch(expectedTurnText, expectedTurnCount, turnIndex) { 
  VerifyChatTurnInternal(expectedTurnCount, turnIndex, chatMessageFound => {
    if (chatMessageFound !== expectedTurnText) { 
      throw new Error(`Chat turn ${turnIndex} should be an exact match to: ${expectedTurnText}`) 
    }
  })
}

// This function does the hard work of retrying until the chat message count is what we expect
// before it verifies a specific chat turn with a custom verification.
function VerifyChatTurnInternal(expectedTurnCount, turnIndex, doVerification) {
  cy.WaitForStableDOM()
  let chatMessages
  cy.wrap(1).should(() => { 
    chatMessages = GetAllChatMessages()
    if (chatMessages.length != expectedTurnCount) { 
      throw new Error(`${chatMessages.length} chat turns were found, however we were expecting ${expectedTurnCount}`)
    }
  }).then(() => {
    if(chatMessages.length < turnIndex) { 
      throw new Error(`VerifyChatTurnInternal(${expectedTurnCount}, ${turnIndex}): ${chatMessages.length} is not enough chat turns to find the requested turnIndex`) 
    }
    
    doVerification(chatMessages[turnIndex])
  })
}

export function CreateNewTrainDialog() {
  cy.Enqueue(() => {
    const turns = trainDialogsGrid.GetTurns()
    currentTrainingSummary = {
      FirstInput: undefined,
      LastInput: undefined,
      LastResponse: undefined,
      Turns: 0,
      // FUDGING on the time - subtract 25 seconds because the time is set by the server
      // which is not exactly the same as our test machine.
      MomentTrainingStarted: Cypress.moment().subtract(25, 'seconds'),
      MomentTrainingEnded: undefined,
      LastModifiedDate: undefined,
      CreatedDate: undefined,
      TrainGridRowCount: (turns ? turns.length : 0) + 1
    }
    isBranched = false
  })
  trainDialogsGrid.ClickNewTrainDialogButton()
}

export function EditTraining(firstInput, lastInput, lastResponse) {
  cy.Enqueue(() => {
    const turns = trainDialogsGrid.GetTurns()
    const firstInputs = trainDialogsGrid.GetFirstInputs()
    const lastInputs = trainDialogsGrid.GetLastInputs()
    const lastResponses = trainDialogsGrid.GetLastResponses()
    const lastModifiedDates = trainDialogsGrid.GetLastModifiedDates()
    const createdDates = trainDialogsGrid.GetCreatedDates()

    helpers.ConLog(`EditTraining(${firstInput}, ${lastInput}, ${lastResponse})`, `${turns.length}, ${lastInputs[0]}, ${lastInputs[1]}, ${lastInputs[2]}`)

    for (let i = 0; i < firstInputs.length; i++) {
      if (firstInputs[i] == firstInput && lastInputs[i] == lastInput && lastResponses[i] == lastResponse) {
        currentTrainingSummary = {
          FirstInput: firstInputs[i],
          LastInput: lastInputs[i],
          LastResponse: lastResponses[i],
          Turns: turns[i],
          // FUDGING on the time - subtract 25 seconds because the time is set by the server
          // which is not exactly the same as our test machine.
          MomentTrainingStarted: Cypress.moment().subtract(25, 'seconds'),
          MomentTrainingEnded: undefined,
          LastModifiedDate: lastModifiedDates[i],
          CreatedDate: createdDates[i],
          TrainGridRowCount: (turns ? turns.length : 0)
        }
        originalTrainingSummary = Object.create(currentTrainingSummary)
        isBranched = false

        helpers.ConLog(`EditTraining(${firstInput}, ${lastInput}, ${lastResponse})`, `ClickTraining for ${i} - ${turns[i]}, ${firstInputs[i]}, ${lastInputs[i]}, ${lastResponses[i]}`)
        trainDialogsGrid.ClickTraining(i)
        return
      }
    }
    throw new Error(`Can't Find Training to Edit. The grid should, but does not, contain a row with this data in it: FirstInput: ${firstInput} -- LastInput: ${lastInput} -- LastResponse: ${lastResponse}`)
  })
}

// The optional 'dontCountThisTurn' parameter is intended for the rare cases where 
// we know the user turn will be discarded by the UI.
export function TypeYourMessage(message, dontCountThisTurn = false) {
  cy.Get(TypeYourMessageSelector).type(`${message}{enter}`)
  cy.Enqueue(() => {
    if (!currentTrainingSummary.FirstInput) currentTrainingSummary.FirstInput = message
    currentTrainingSummary.LastInput = message
    if (!dontCountThisTurn) {
      currentTrainingSummary.Turns++
    }
  })
}

// lastResponse parameter is optional. It is necessary only when there are $entities
// in the Action that produced the Bot's last response.
export function SelectTextAction(expectedResponse, lastResponse) {
  scorerModal.ClickTextAction(expectedResponse)
  VerifyTextChatMessage(expectedResponse)
  cy.Enqueue(() => {
    if (lastResponse) currentTrainingSummary.LastResponse = lastResponse
    else currentTrainingSummary.LastResponse = expectedResponse
  })
}

export function SelectApiCardAction(apiName, expectedCardTitle, expectedCardText) {
  scorerModal.ClickApiAction(apiName, expectedCardText)
  VerifyCardChatMessage(expectedCardTitle, expectedCardText)
  cy.Enqueue(() => { currentTrainingSummary.LastResponse = apiName })
}

export function SelectApiPhotoCardAction(apiName, expectedCardTitle, expectedCardText, expectedCardImage) {
  scorerModal.ClickApiAction(apiName, expectedCardText)
  VerifyPhotoCardChatMessage(expectedCardTitle, expectedCardText, expectedCardImage)
  cy.Enqueue(() => { currentTrainingSummary.LastResponse = apiName })
}

export function SelectApiTextAction(apiName, expectedResponse) {
  scorerModal.ClickApiAction(apiName, expectedResponse)
  VerifyTextChatMessage(expectedResponse)
  cy.Enqueue(() => { currentTrainingSummary.LastResponse = apiName })
}

export function SelectEndSessionAction(expectedData) {
  scorerModal.ClickEndSessionAction(expectedData);
  VerifyEndSessionChatMessage(expectedData)
  cy.Enqueue(() => { currentTrainingSummary.LastResponse = expectedData })
}

// To verify the last chat utterance leave expectedIndexOfMessage undefined.
export function VerifyTextChatMessage(expectedMessage, expectedIndexOfMessage) {
  cy.Get('[data-testid="web-chat-utterances"]').then(allChatElements => {
    if (!expectedIndexOfMessage) expectedIndexOfMessage = allChatElements.length - 1
    let elements = Cypress.$(allChatElements[expectedIndexOfMessage]).find('div.format-markdown > p')
    if (elements.length == 0) {
      throw new Error(`Did not find expected Text Chat Message '${expectedMessage}' at index: ${expectedIndexOfMessage}`)
    }
    
    const expectedUtterance = expectedMessage.replace(/'/g, "’")
    let textContentWithoutNewlines = helpers.TextContentWithoutNewlines(elements[0])
    helpers.ConLog('VerifyTextChatMessage', textContentWithoutNewlines)

    if (helpers.TextContentWithoutNewlines(elements[0]) !== expectedUtterance) {
      throw new Error(`Expected to find '${expectedUtterance}' in the text chat pane, instead we found '${textContentWithoutNewlines}' at index: ${expectedIndexOfMessage}`)
    }
  })
}

// To verify the last chat utterance leave expectedIndexOfMessage undefined.
// Leave expectedMessage temporarily undefined so that you can copy the text
// output from the screen or log to paste into your code.
export function VerifyCardChatMessage(expectedCardTitle, expectedCardText, expectedIndexOfMessage) {
  cy.Get('[data-testid="web-chat-utterances"]').then(allChatElements => {
    if (!expectedIndexOfMessage) expectedIndexOfMessage = allChatElements.length - 1
    let elements = Cypress.$(allChatElements[expectedIndexOfMessage]).find(`div.format-markdown > p:contains('${expectedCardTitle}')`).parent()
    if (elements.length == 0) {
      throw new Error(`Did not find expected '${expectedCardTitle}' card with '${expectedCardText}' at index: ${expectedIndexOfMessage}`)
    }
    elements = Cypress.$(elements[0]).next('div.wc-list').find('div.wc-adaptive-card > div.ac-container > div.ac-container > div > p')
    if (elements.length == 0) {
      throw new Error(`Did not find expected content element for API Call card that should contain '${expectedCardText}' at index: ${expectedIndexOfMessage}`)
    }
    
    // Log the contents of the API Call card so that we can copy the exact string into the .spec.js file.
    let textContentWithoutNewlines = helpers.TextContentWithoutNewlines(elements[0])
    helpers.ConLog('VerifyCardChatMessage', textContentWithoutNewlines)
    
    if (!textContentWithoutNewlines.includes(expectedCardText)) {
      throw new Error(`Expected to find '${expectedCardTitle}' card with '${expectedCardText}', instead we found '${textContentWithoutNewlines}' at index: ${expectedIndexOfMessage}`)
    }
  })
}

// To verify the last chat utterance leave expectedIndexOfMessage undefined.
export function VerifyPhotoCardChatMessage(expectedCardTitle, expectedCardText, expectedCardImage, expectedIndexOfMessage) {
  const funcName = `VerifyPhotoCardChatMessage("${expectedCardTitle}", "${expectedCardText}", "${expectedCardImage}", ${expectedIndexOfMessage})`
  cy.Get('[data-testid="web-chat-utterances"]').then(allChatElements => {
    if (!expectedIndexOfMessage) expectedIndexOfMessage = allChatElements.length - 1
    let errorMessage = ''
    
    if (Cypress.$(allChatElements[expectedIndexOfMessage]).find(`p:contains('${expectedCardTitle}')`).length == 0) {
      errorMessage += `Did not find expected card title: '${expectedCardTitle}' - `
    }
    
    if (Cypress.$(allChatElements[expectedIndexOfMessage]).find(`p:contains('${expectedCardText}')`).length == 0) {
      errorMessage += `Did not find expected card text: '${expectedCardText}' - `
    }
    
    if (Cypress.$(allChatElements[expectedIndexOfMessage]).find(`img[src="${expectedCardImage}"]`).length == 0) {
      errorMessage += `Did not find expected image: '${expectedCardImage}' - `
    }

    if (errorMessage.length > 0)  {
      helpers.ConLog(`VerifyPhotoCardChatMessage("${expectedCardTitle}", "${expectedCardText}", "${expectedCardImage}", ${expectedIndexOfMessage})`, `Chat Element at index ${expectedIndexOfMessage}: ${allChatElements[expectedIndexOfMessage].outerHTML}`)
      throw new Error(`${errorMessage}at chat turn index ${expectedIndexOfMessage}`)
    }
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

// This method is used to score AND AUTO-SELECT the action after branching.
export function ClickScoreActionsButtonAfterBranching(lastResponse) {
  ClickScoreActionsButton()
  cy.Enqueue(() => {
    currentTrainingSummary.LastResponse = lastResponse
  })
}

export function SaveAsIsVerifyInGrid() {
  const funcName = 'SaveAsIsVerifyInGrid'

  cy.DumpHtmlOnDomChange(true)

  ClickSaveCloseButton()
  cy.Enqueue(() => {
    // FUDGING on the time - adding 25 seconds because the time is set by the server
    // which is not exactly the same as our test machine.
    currentTrainingSummary.MomentTrainingEnded = Cypress.moment().add(25, 'seconds')

    cy.WaitForStableDOM()
    let renderingShouldBeCompleteTime = new Date().getTime() + 1000
    cy.wrap(1, {timeout: 10000}).should(() => {
      if (mergeModal.IsVisible()) {
        helpers.ConLog(funcName, 'mergeModal.IsVisible')

        mergeModal.$ClickSaveAsButton()
        renderingShouldBeCompleteTime = new Date().getTime() + 1000
        throw new Error('The Merge Modal popped up, and we clicked the Save As Is button...need to retry and wait for the grid to become visible')
      }

      if (modelPage.IsOverlaid()) {
        helpers.ConLog(funcName, 'modalPage.IsOverlaid')
        renderingShouldBeCompleteTime = new Date().getTime() + 1000
        throw new Error('Overlay found thus Train Dialog Grid is not stable...retry until it is')
      } else if (new Date().getTime() < renderingShouldBeCompleteTime) {
        // There is no overlay, but we will still wait until we've seen this condition for 
        // at least 1 full second before we call it good.
        helpers.ConLog(funcName, 'Wait for no overlays for at least 1 second')
        throw new Error(`Waiting till no overlays show up for at least 1 second...retry '${funcName}'`)
      }
      helpers.ConLog(funcName, 'No overlays for at least 1 second')
    }).then(() => {
      if (isBranched) VerifyTrainingSummaryIsInGrid(originalTrainingSummary)
      VerifyTrainingSummaryIsInGrid(currentTrainingSummary)
    })
  })
  cy.DumpHtmlOnDomChange(false)
}

function VerifyTrainingSummaryIsInGrid(trainingSummary) {
  const funcName = 'VerifyTrainingSummaryIsInGrid'
  // Keep these lines of logging code in this method, they come in handy when things go bad.
  helpers.ConLog(funcName, `FirstInput: ${trainingSummary.FirstInput}`)
  helpers.ConLog(funcName, `LastInput: ${trainingSummary.LastInput}`)
  helpers.ConLog(funcName, `LastResponse: ${trainingSummary.LastResponse}`)
  helpers.ConLog(funcName, `CreatedDate: ${trainingSummary.CreatedDate}`)
  helpers.ConLog(funcName, `LastModifiedDate: ${trainingSummary.LastModifiedDate}`)
  helpers.ConLog(funcName, `MomentTrainingStarted: ${trainingSummary.MomentTrainingStarted.format()}`)
  helpers.ConLog(funcName, `MomentTrainingEnded: ${trainingSummary.MomentTrainingEnded.format()}`)

  let renderingShouldBeCompleteTime = new Date().getTime()
  cy.Get('[data-testid="train-dialogs-turns"]', {timeout: 10000})
    .should(elements => { 
      if (modelPage.IsOverlaid()) {
        helpers.ConLog(funcName, 'modalPage.IsOverlaid')
        renderingShouldBeCompleteTime = new Date().getTime() + 1000
        throw new Error('Overlay found thus Train Dialog Grid is not stable...retry until it is')
      } else if (new Date().getTime() < renderingShouldBeCompleteTime) {
        helpers.ConLog(funcName, 'Wait for no overlays for at least 1 second')
        throw new Error(`Waiting till no overlays show up for at least 1 second...retry '${funcName}'`)
      }

      if (elements.length != trainingSummary.TrainGridRowCount) { 
        helpers.ConLog(funcName, `Did NOT find the expected row count: ${elements.length}.`)
        throw new Error(`${elements.length} rows found in the training grid, however we were expecting ${trainingSummary.TrainGridRowCount}`)
      }

      helpers.ConLog(funcName, `Found the expected row count: ${elements.length}`)

      const turns = trainDialogsGrid.GetTurns()
      const firstInputs = trainDialogsGrid.GetFirstInputs()
      const lastInputs = trainDialogsGrid.GetLastInputs()
      const lastResponses = trainDialogsGrid.GetLastResponses()
      const lastModifiedDates = trainDialogsGrid.GetLastModifiedDates()
      const createdDates = trainDialogsGrid.GetCreatedDates()
  
      for (let i = 0; i < trainingSummary.TrainGridRowCount; i++) {
        // Keep these lines of logging code in this method, they come in handy when things go bad.
        helpers.ConLog(funcName, `CreatedDates[${i}]: ${createdDates[i]} --- ${helpers.Moment(createdDates[i]).isBetween(trainingSummary.MomentTrainingStarted, trainingSummary.MomentTrainingEnded)}`)
        helpers.ConLog(funcName, `LastModifiedDates[${i}]: ${lastModifiedDates[i]} --- ${helpers.Moment(lastModifiedDates[i]).isBetween(trainingSummary.MomentTrainingStarted, trainingSummary.MomentTrainingEnded)}`)
        helpers.ConLog(funcName, `Turns[${i}]: ${turns[i]}`)
  
        if (((trainingSummary.LastModifiedDate && lastModifiedDates[i] == trainingSummary.LastModifiedDate) ||
            helpers.Moment(lastModifiedDates[i]).isBetween(trainingSummary.MomentTrainingStarted, trainingSummary.MomentTrainingEnded)) &&
            turns[i] == trainingSummary.Turns &&
            ((trainingSummary.CreatedDate && createdDates[i] == trainingSummary.CreatedDate) ||
              helpers.Moment(createdDates[i]).isBetween(trainingSummary.MomentTrainingStarted, trainingSummary.MomentTrainingEnded)) &&
            firstInputs[i] == trainingSummary.FirstInput &&
            lastInputs[i] == trainingSummary.LastInput &&
            lastResponses[i] == trainingSummary.LastResponse) {

          helpers.ConLog(funcName, 'Found all of the expected data. Validation PASSES!')
          return; // Fully VALIDATED! We found what we expected.
        }
      }
      throw new Error(`The grid should, but does not, contain a row with this data in it: FirstInput: ${trainingSummary.FirstInput} -- LastInput: ${trainingSummary.LastInput} -- LastResponse: ${trainingSummary.LastResponse} -- Turns: ${trainingSummary.Turns} -- LastModifiedDate: ${trainingSummary.LastModifiedDate} -- CreatedDate: ${trainingSummary.CreatedDate}`)
    })
}

export function CaptureOriginalChatMessages() {
  cy.WaitForStableDOM().then(() => { originalChatMessages = GetAllChatMessages() })
}

export function VerifyOriginalChatMessages() {
  VerifyAllChatMessages(() => { return originalChatMessages })
}

export function CaptureEditedChatMessages() {
  cy.WaitForStableDOM().then(() => { editedChatMessages = GetAllChatMessages() })
}

export function VerifyEditedChatMessages() {
  VerifyAllChatMessages(() => { return editedChatMessages })
}

function VerifyAllChatMessages(functionGetChatMessagesToBeVerified) {
  cy.WaitForStableDOM().then(() => {
    let errorMessage = ''
    const chatMessagesToBeVerified = functionGetChatMessagesToBeVerified()
    const allChatMessages = GetAllChatMessages()

    if (allChatMessages.length != chatMessagesToBeVerified.length)
      errorMessage += `Original chat message count was ${chatMessagesToBeVerified.length}, current chat message count is ${allChatMessages.length}.`

    const length = Math.max(allChatMessages.length, chatMessagesToBeVerified.length)
    for (let i = 0; i < length; i++) {
      if (i >= allChatMessages.length)
        errorMessage += `-- [${i}] - Original: '${chatMessagesToBeVerified[i]}' is extra'`
      else if (i >= chatMessagesToBeVerified.length)
        errorMessage += `-- [${i}] - Current: '${allChatMessages[i]}' is extra'`
      else if (allChatMessages[i] != chatMessagesToBeVerified[i])
        errorMessage += `-- [${i}] - Original: '${chatMessagesToBeVerified[i]}' does not match current: '${allChatMessages[i]}'`
    }
    if (errorMessage.length > 0) throw errorMessage
  })
}

export function BranchChatTurn(originalMessage, newMessage, originalIndex = 0) {
  cy.Enqueue(() => {
    originalMessage = originalMessage.replace(/'/g, "’")

    SelectChatTurnExactMatch(originalMessage, originalIndex)

    VerifyBranchButtonIsInSameControlGroupAsMessage(originalMessage)

    // Capture the list of messages currently in the chat, truncate it at the point of branching, then add the new message to it.
    // This array will be used later to validate that the changed chat is persisted.
    let branchedChatMessages
    cy.WaitForStableDOM().then(() => {
      branchedChatMessages = GetAllChatMessages()
      for (let i = 0; i < branchedChatMessages.length; i++) {
        if (branchedChatMessages[i] == originalMessage) {
          branchedChatMessages.length = i + 1
          branchedChatMessages[i] = newMessage
        }
      }
    })

    cy.Get('@branchButton').Click()
    cy.Get('[data-testid="user-input-modal-new-message-input"]').type(`${newMessage}{enter}`)
  
    isBranched = true
    originalTrainingSummary.TrainGridRowCount++
    currentTrainingSummary.TrainGridRowCount++

    VerifyAllChatMessages(() => { return branchedChatMessages })
  })
}

export function SelectAndVerifyEachChatTurnHasExpectedButtons() { SelectAndVerifyEachChatTurn(VerifyChatTurnControlButtons) }
export function SelectAndVerifyEachChatTurnHasNoButtons() { SelectAndVerifyEachChatTurn(VerifyThereAreNoChatEditControls) }
export function SelectAndVerifyEachBotChatTurnHasNoSelectActionButtons() { SelectAndVerifyEachChatTurn( scorerModal.VerifyNoEnabledSelectActionButtons, 1, 2) }

function SelectAndVerifyEachChatTurn(verificationFunction, index = 0, increment = 1, initialized = false) {
  if (!initialized) { 
    CreateAliasForAllChatTurns() 
  }

  cy.Get('@allChatTurns').then(elements => {
    if (index < elements.length) {
      cy.wrap(elements[index]).Click().then(() => {
        verificationFunction(elements[index], index)
        SelectAndVerifyEachChatTurn(verificationFunction, index + increment, increment, true)
      })
    }
  })
}

export function AbandonDialog() {
  ClickAbandonDeleteButton()
  ClickConfirmAbandonDialogButton()
}

export function EditTrainingNEW(scenario, tags) {
  const funcName = `EditTrainingNEW(${scenario}, ${tags})`
  cy.Enqueue(() => {
    const tagsFromGrid = trainDialogsGrid.GetTags()
    const scenarios = trainDialogsGrid.GetDescription()

    helpers.ConLog(funcName, `Row Count: ${scenarios.length}`)

    for (let i = 0; i < scenarios.length; i++) {
      if (scenarios[i] === scenario && tagsFromGrid[i] == tags) {
        helpers.ConLog(funcName, `ClickTraining for row: ${i}`)
        trainDialogsGrid.ClickTraining(i)
        return
      }
    }
    throw new Error(`Can't Find Training to Edit. The grid should, but does not, contain a row with this data in it: scenario: '${scenario}' -- tags: ${tags}`)
  })
}

export function VerifyCloseIsTheOnlyEnabledButton() {
  cy.Get('[data-testid="edit-dialog-modal-replay-button"]').should('be.disabled')
  cy.Get('[data-testid="edit-dialog-modal-abandon-delete-button"]').should('be.disabled')
  cy.Get('[data-testid="edit-teach-dialog-close-save-button"]').should('be.enabled')
}

export function VerifyListOfTrainDialogs(expectedTurns) {
  const funcName = 'VerifyListOfTrainDialogs'
  cy.log('Verify List of Train Dialogs', expectedTurns)
  cy.Enqueue(() => {
    const firstInputs = trainDialogsGrid.GetFirstInputs()
    const lastInputs = trainDialogsGrid.GetLastInputs()
    const lastResponses = trainDialogsGrid.GetLastResponses()

    let errors = false
    expectedTurns.forEach(turn => {
      helpers.ConLog(funcName, `Find - "${turn.firstInput}", "${turn.lastInput}", "${turn.lastResponse}"`)
      let found = false
      for (let i = 0; i < firstInputs.length; i++) {
        if (firstInputs[i] == turn.firstInput && lastInputs[i] == turn.lastInput && lastResponses[i] == turn.lastResponse) {
          found = true
          helpers.ConLog(funcName, `Found on row ${i}`)
          break;
        }
      }
      
      if (!found) {
        helpers.ConLog(funcName, 'ERROR - NOT Found')
        errors = true
      }
    })
    
    if (errors) {
      throw new Error('Did not find 1 or more of the expected Train Dialogs in the grid. Refer to the log file for details.')
    }
    
    if (firstInputs.length > expectedTurns.length) {
      throw new Error(`Found all of the expected Train Dialogs, however there are an additional ${firstInputs.length - expectedTurns.length} Train Dialogs in the grid that we were not expecting. Refer to the log file for details.`)
    }
  })
}
