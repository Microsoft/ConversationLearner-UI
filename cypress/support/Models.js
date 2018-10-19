/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

const helpers = require('./helpers.js')
const homePage = require('./components/HomePage')
const modelPage = require('./components/ModelPage')
const entities = require('./Entities')
const actions = require('./Actions')

export function CreateNewModel(name)
{
  homePage.Visit()
  homePage.ClickNewModelButton()
  homePage.TypeModelName(name)
  homePage.ClickSubmitButton()
  modelPage.VerifyModelName(name)
}

export function ImportModel(modelNamePrefix, fileName)
{
  // Maximum Name Length is 30 Characters
  const name = `${modelNamePrefix}-${helpers.ModelNameTime()}`

  homePage.Visit()
  homePage.ClickImportModelButton()

  homePage.TypeModelName(name)
  homePage.UploadImportModelFile(fileName)
  homePage.ClickSubmitButton()

  return name
}
