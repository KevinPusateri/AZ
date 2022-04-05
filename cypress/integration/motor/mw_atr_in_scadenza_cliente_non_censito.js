/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Sales from "../../mw_page_objects/navigation/Sales"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import TenutaTariffa from "../../mw_page_objects/tenutaTariffa/TenutaTariffa"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

let retrievedTarghe
before(() => {

    cy.task('getTargheInScadenzaAltraCompagnia', { dbConfig: dbConfig }).then((currentRetrievedTarghe) => {
        retrievedTarghe = currentRetrievedTarghe
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })
    })
})
beforeEach(() => {
    cy.preserveCookies()
})
after(function () {
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
})

describe('ATR in Scadenza Altra Compagnia', function () {
    it('Verifica Prenventivo Motor da Sales', function () {

        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
        
        TenutaTariffa.flussoATRScadenzaAltraCompagnia(retrievedTarghe[0])
    })
})