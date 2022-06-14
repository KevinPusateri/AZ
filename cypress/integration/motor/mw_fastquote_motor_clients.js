/**
* @author Andrea Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import HomePage from "../../mw_page_objects/common/HomePage"


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

        //Andiamo a cercare un cliente in prima istanza per lavorare su Clients
        HomePage.reloadMWHomePage()
        if (!Cypress.env('monoUtenza') && (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))) {
            TopBar.search('Pulini Francesco')
            SintesiCliente.wait()
        } else if (!Cypress.env('isAviva')) {
            TopBar.search('SLZNLL54A04H431Q')
            SintesiCliente.wait()
        } else {
            TopBar.search('DRLTMS95L21F257R')
            SintesiCliente.wait()
        }
    })
})

beforeEach(() => {
    cy.preserveCookies()
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

describe('Clients - Nuovo FastQuote Auto', function () {
        it('Check Nuovo FastQuote Auto', function () {
            SintesiCliente.checkFastQuoteAuto()
        })

        it('Calcola Moto', function () {
            SintesiCliente.calcolaDaFastQuoteAuto('Moto', 'ER67005')
            SintesiCliente.back()
        })

        it('Calcola Auto', function () {
            SintesiCliente.checkFastQuoteAuto()
            SintesiCliente.calcolaDaFastQuoteAuto('Auto', 'FD687CR')
            SintesiCliente.back()
        })

        it('Calcola Autocarro', function () {
            SintesiCliente.checkFastQuoteAuto()
            SintesiCliente.calcolaDaFastQuoteAuto('Autocarro', 'EZ479GA')
            SintesiCliente.back()
        })

        it('Calcola Altro Veicolo', function () {
            SintesiCliente.checkFastQuoteAuto()
            SintesiCliente.calcolaDaFastQuoteAuto('Altro veicolo', 'AKS612')
            SintesiCliente.back()
        })

        it('Verifica link - Procedi con l\'inserimento manuale', function(){
            SintesiCliente.checkFastQuoteAuto()
            SintesiCliente.clickProcediInserimentoManualeFastQuoteAuto()
            SintesiCliente.back()
        })
})