/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

const helpers = require('../../support/Helpers')
const homePage = require('../../support/components/HomePage')
const modelPage = require('../../support/components/ModelPage')
const train = require('../../support/Train')
const trainDialogsGrid = require('../../support/components/TrainDialogsGrid')

/// Description: A temporary workspace for experimental code
describe('zTemp test', () =>
{
  it('zTemp test', () => 
  {
    homePage.Visit()
    homePage.NavigateToModelPage("Model1-mni-Oct29-100059-443")
    modelPage.NavigateToTrainDialogs()
    cy.pause()

    cy.Get('div.wc-message-wrapper.list.clickable').contains('')
  })
})
