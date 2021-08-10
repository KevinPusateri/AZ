/**
* @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import HomePage from "../../mw_page_objects/common/HomePage"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import NoteContratto from "../../mw_page_objects/clients/NoteContratto"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import SCUSalesNoteContratto from "../../mw_page_objects/sales/SCUSalesNoteContratto"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

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

//#region Before After
before(() => {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })

    LoginPage.logInMW(userName, psw)
})
beforeEach(() => {
    cy.preserveCookies()
})
// afterEach(function () {
//     if (this.currentTest.state !== 'passed') {
//         TopBar.logOutMW()
//         //#region Mysql
//         cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//             let tests = testsInfo
//             cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
//         })
//         //#endregion
//         Cypress.runner.stop();
//     }
// })
after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion
})
//#endregion Before After

let urlClient
describe('Matrix Web : Note di contratto', function () {

    it('Verifica Aggiungi Nota', function () {
        // Portafoglio.checkClientWithPolizza() 
        LandingRicerca.search('PTNCLD43L26L719E')
        LandingRicerca.clickFirstResult()
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        NoteContratto.inserisciNotaContratto()
    })

    it('Verifica Tooltip numero di note presenti(1 nota)', function () {
        NoteContratto.checkTooltipNote('1')
    })
    
    it('Verifica Badge Nota', function () {
        NoteContratto.checkBadgeNota()
    })

    it('Verifica Modifica di una nota', function () {
        NoteContratto.modificaNota()
    })

    it('Verifica "Aggiungi nota" dal badge Note', function () {
        NoteContratto.inserisciNotaFromBadge()
    })

    it('Verifica Tooltip numero di note presenti(2 note)', function () {
        NoteContratto.checkTooltipNote('2')
    })

    it('Verifica Flag Importante', function () {
        NoteContratto.checkImportante()
    })

    it('Verifica Tooltip numero di note presenti(2 note) di cui 1 importante', function () {
        NoteContratto.checkTooltipNote('3')
    })

    it.only('Verifica Da Sales La presenza delle note di contratto', function () {
        LandingRicerca.search('PTNCLD43L26L719E')
        LandingRicerca.clickFirstResult()
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        NoteContratto.getPolizza().then((polizza)=>{
            HomePage.reloadMWHomePage()
            TopBar.clickSales()
            BurgerMenuSales.clickLink('Note di contratto')
            SCUSalesNoteContratto.searchPolizza(polizza)
        })
    })

    it.only('Verifica modifica nota da Sales', function () {
        SCUSalesNoteContratto.modificaNota()
    })

    it.only('Verifica che la modifica sia stata effettuata anche su Clients', function () {
        SintesiCliente.visitUrlClient(urlClient)
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
    })




})
