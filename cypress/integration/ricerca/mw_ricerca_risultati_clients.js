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
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
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
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion

})

describe('Buca di Ricerca - Risultati Clients', function () {

    it('Verifica Ricerca Cliente: nome o cognome ', function () {
        LandingRicerca.searchRandomClient(true, 'PF', 'E')
        LandingRicerca.checkRisultatiRicerca()
    })

    it('Verifica Modifica filtri', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.filtraRicerca("P")
    })


    if (Cypress.env('isAviva')) {

        describe('Buca di Ricerca - Risultati Clients - AVIVA', function () {

            it('Verifica Click su Ricerca Cliente e Atterraggio in Sintesi Cliente', function () {
                if (Cypress.env('isAvivaBroker')) {
                    TopBar.search('CRISTINA PENACCHIONI')
                    LandingRicerca.clickFirstResult()
                    SintesiCliente.checkAtterraggioSintesiCliente('CRISTINA PENACCHIONI')
                }
                else {
                    TopBar.search('CRISTINA PO')
                    LandingRicerca.clickFirstResult()
                    SintesiCliente.checkAtterraggioSintesiCliente('CRISTINA PO')
                }
            })
        })
    } else {
        it('Verifica Click su Ricerca Cliente e Atterraggio in Sintesi Cliente', function () {

            if (!Cypress.env('monoUtenza')) {
                TopBar.search('PULINI')
                LandingRicerca.clickFirstResult()
                SintesiCliente.checkAtterraggioSintesiCliente('PULINI')
            } else {
                TopBar.search('GIUSEPPE NAZZARRO')
                LandingRicerca.clickFirstResult()
                SintesiCliente.checkAtterraggioSintesiCliente('GIUSEPPE NAZZARRO')
            }


        })
    }
})