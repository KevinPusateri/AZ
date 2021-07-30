/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import News from "../../mw_page_objects/Navigation/News"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion
//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

before(() => {
  cy.task('startMyql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
      insertedId = results.insertId
  })
  LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
  cy.preserveCookies()
  Common.visitUrlOnEnv()
})

after(function () {
  TopBar.logOutMW()
  //#region Mysql
  cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
      let tests = testsInfo
      cy.task('finishMyql', { dbConfig: dbConfig, rowId: insertedId, tests })
  })
  //#endregion

})

describe('Matrix Web : Navigazioni da News', function () {

  it('Verifica aggancio News', function () {
    TopBar.clickNews()
    News.checkAtterraggio()
  })
});