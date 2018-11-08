/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

const helpers = require('../../support/Helpers')
const homePage = require('../../support/components/HomePage')
const modelPage = require('../../support/components/ModelPage')
const train = require('../../support/Train')
const trainDialogsGrid = require('../../support/components/TrainDialogsGrid')
const editDialogsModal = require('../../support/components/EditDialogModal')

/// Description: A temporary workspace for experimental code
describe('zTemp test', () =>
{
  it('zTemp test', () => 
  {
    homePage.Visit()
    // homePage.NavigateToModelPage("BigTrain")
    // modelPage.NavigateToTrainDialogs()
    cy.pause()

    // editDialogsModal.SelectChatTurn('Hello Paul', 4)
    //cy.Get('div.wc-message-wrapper.list.clickable').contains('Paul is not here').Click()
  })
})
