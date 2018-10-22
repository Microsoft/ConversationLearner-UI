/**
* Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

const actionsModal = require('../support/components/ActionsModal')
const actions = require('../../support/Actions')
const homePage = require('../support/components/HomePage')
const modelPage = require('../support/components/modelpage')
const scorerModal = require('../support/components/ScorerModal')
const trainDialogPage = require('../support/components/traindialogspage')
const editDialogModal = require('../support/components/editdialogmodal')

/**
* Wait action: After the system takes a "wait" action, it will stop taking actions and wait for user input.
* Non-wait action: After the system takes a "non-wait" action, it will immediately choose another action (without waiting for user input)
*/
describe('Wait vs No Wait Action e2e test', function () {
  const momentSeconds = Cypress.moment().format("MMMDD-HHmmSSS")
  const modelName = `e2e-waitvsnowait-${momentSeconds}`
  const action01 = "Which animal would you like?"
  const action02 = "Cows say moo!!"
  const action03 = "Ducks say quack!"
  const trainMessage01 = "Hello"
  const trainMessage02 = "Cow"
  const trainMessage03 = "Duck"

  after(() => { cy.VerifyMonitorFinds() })
  
  afterEach(function () {
    const fileName = `WaitVSNoWait_${this.currentTest.state}-${this.currentTest.title}`
    cy.wait(1000)
      .screenshot(fileName)
  })

  it('create a new model', function () {
    homePage.navigateTo()
    homePage.createNewModel(modelName)
    modelPage.verifyPageTitle(modelName)
  })

  /** FEATURE: New Action */
  it('should create Wait and Non Wait Actions', () => {
    modelPage.navigateToActions()

    // Wait Action:
    actions.clickNewAction()
    actions.selectTypeText()
    actions.typeOnResponseBox(action01)
    actions.clickCreateButton()
     cy.wait(4000);
    // No Wait Actions:
    actions.clickNewAction()
    actions.selectTypeText()
    actions.typeOnResponseBox(action02)
    actions.clickWaitForResponse()
    actions.clickCreateButton()
     cy.wait(4000);
    actions.clickNewAction()
    actions.selectTypeText()
    actions.typeOnResponseBox(action03)
    actions.clickWaitForResponse()
    actions.clickCreateButton()
     cy.wait(4000);
    
    // Verify that the action has been added
    actions.verifyItemInList(action01)
    actions.verifyItemInList(action02)
    actions.verifyItemInList(action03)
  })

  it('should train a dialog using Wait and Non Wait actions', () => {
    modelPage.navigateToTrainDialogs()
    trainDialogPage.verifyPageTitle()
    trainDialogPage.createNew()
    cy.wait(2000)

    editDialogModal.typeYourMessage(trainMessage01)
    editDialogModal.clickScoreActions()
    scorerModal.selectAnActionWithText(action01)
    cy.wait(2000)

    editDialogModal.typeYourMessage(trainMessage02)
    editDialogModal.clickScoreActions()
    scorerModal.selectAnActionWithText(action02)
    cy.wait(2000)

    scorerModal.selectAnActionWithText(action01)
    cy.wait(2000)

    editDialogModal.typeYourMessage(trainMessage03)
    editDialogModal.clickScoreActions()
    scorerModal.selectAnActionWithText(action03)
    cy.wait(2000)

    scorerModal.selectAnActionWithText(action01)
    cy.wait(2000)
    
    editDialogModal.clickDoneTeaching()
  })

  /** FEATURE: Delete a Model */
  it('should delete an existent model', () => {
    homePage.navigateTo();
    homePage.deleteModel(modelName);
    cy.end()
  })
})
