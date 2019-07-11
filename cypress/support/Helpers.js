/**
* Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

// Use this in an `afterEach` function to cause all remaining tests of a suite to be skipped when
// the test that just finished running failed.
//
// CAUTION: This MUST NOT be called using an arrow/lambda function. Examples:
//   WRONG: afterEach(() => helpers.SkipRemainingTestsOfSuiteIfFailed())
//   RIGHT: afterEach(helpers.SkipRemainingTestsOfSuiteIfFailed)
//   RIGHT: afterEach(function() {
//            helpers.SkipRemainingTestsOfSuiteIfFailed()
//            DoSomeOtherWork()
//          })
export function SkipRemainingTestsOfSuiteIfFailed() { 
  if (this.currentTest == undefined) {
    throw new Error('Test Code Error: Cannot use arrow/lambda function to call the SkipRemainingTestsOfSuiteIfFailed() function.')
  }
  if (this.currentTest.state === 'failed') {
    this.skip() 
  }
}

// NOTE: the '-+-' is a signature for filtering console output
export function ConLog(funcName, message) { console.log(`-+- ${Cypress.moment().format("HH:mm:ss..SSS")} - ${funcName} - ${message}`) }

export function Dump(funcName, object) {
  let propertyList = ''
  for (let property in object) propertyList += `${(propertyList.length == 0 ? '' : ', ')}${property}: ${object[property]}`
  ConLog(funcName, propertyList)
}

export function RemoveDuplicates(inputArray) {
  let uniqueOutputArray = []
  for (let i = 0; i < inputArray.length; i++)
    if (uniqueOutputArray.indexOf(inputArray[i]) == -1)
      uniqueOutputArray.push(inputArray[i])

  return uniqueOutputArray
}

export function StringArrayFromElementText(selector, retainMarkup = false) {
  let elements = Cypress.$(selector)
  ConLog(`StringArrayFromElementText(${selector})`, elements.length)
  let returnValues = []
  for (let i = 0; i < elements.length; i++)  {
    let text = retainMarkup ? elements[i].innerHTML : TextContentWithoutNewlines(elements[i])
    returnValues.push(text)
    ConLog(`StringArrayFromElementText(${selector})`, text)
  }
  return returnValues
}

export function NumericArrayFromElementText(selector) {
  let elements = Cypress.$(selector)
  let returnValues = []
  for (let i = 0; i < elements.length; i++) { returnValues.push(parseInt(TextContentWithoutNewlines(elements[i]))) }
  return returnValues
}

export function Moment(dateTime) {
  if (dateTime.includes('/')) {
    if (dateTime.includes(':')) return Cypress.moment(dateTime, 'MM/DD/YYY h:mm:ss a')
    else return Cypress.moment(dateTime, 'MM/DD/YYY')
  }

  if (dateTime.includes(':')) return Cypress.moment(dateTime, 'h:mm:ss a')
  return undefined
}

// This will return the Inner Text of an element without markup nor newline characters.
// Needed because each browser handles this functionality differently.
export function TextContentWithoutNewlines(element) {
  if (element === undefined) { 
    ConLog('TextContentWithoutNewlines', 'undefined element has been passed in.')
    return undefined 
  }
  const returnValue = element.textContent.replace(/(\r\n|\n|\r)/gm, '')
  ConLog('TextContentWithoutNewlines', returnValue)
  return returnValue
}

// This will return the Inner Text of an element split into an array on new line boundaries
export function ArrayOfTextContentWithoutNewlines(elements) {
  if (elements === undefined || elements.length == 0) { return undefined }
  let arrayOfTextContent = []
  for (let i = 0; i < elements.length; i++) {
    arrayOfTextContent.push(TextContentWithoutNewlines(elements[i]))
  }
  return arrayOfTextContent
}

// Model names have a suffix which will end with a single character representing the 
// build number. This is needed to support test model deletion and to guarantee we
// don't delete a model generated by another test run on another virtual machine.
let buildKey = undefined
export function GetBuildKey() {
  if (!buildKey) {
    buildKey = Cypress.env('BUILD_NUM')
    ConLog('GetBuildKey', `BUILD_NUM: ${Cypress.env('BUILD_NUM')} -- ${buildKey}`)
    if (buildKey) {
      buildKey = String.fromCharCode('a'.charCodeAt() + buildKey % 26)
      ConLog('GetBuildKey', `buildKey: ${buildKey}`)
    } else {
      // There is no BUILD_NUM environment variable so this is a local test run.
      // For local test runs always using the same build key works.
      buildKey = 'x';
    }
  }
  return buildKey
}

export function VerifyErrorMessageContains(expectedMessage) { cy.Get('div.cl-errorpanel').contains(expectedMessage) }
export function VerifyErrorMessageExactMatch(expectedMessage) { cy.Get('div.cl-errorpanel').ExactMatch(expectedMessage) }
export function VerifyNoErrorMessages() { cy.DoesNotContain('div.cl-errorpanel') }
