/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"

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
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMyql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

    TopBar.logOutMW()
})

describe('Buca di Ricerca - Risultati Clients', function () {
    it('Verifica Ricerca Cliente: nome o cognome ', function () {
        LandingRicerca.searchRandomClient(true,'PF','E')
        LandingRicerca.checkRisultatiRicerca()
    })

    it('Verifica Modifica filtri', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.filtraRicerca("P")
    })

    it('Verifica Click su Ricerca Cliente e Atterraggio in Sintesi Cliente', function () {
        TopBar.search('PULINI')
        LandingRicerca.clickFirstResult()
        SintesiCliente.checkAtterraggioSintesiCliente('PULINI')
    })
})