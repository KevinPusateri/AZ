/**
* @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import HomePage from "../../mw_page_objects/common/HomePage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import NoteContratto from "../../mw_page_objects/clients/NoteContratto"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import SCUSalesNoteContratto from "../../mw_page_objects/sales/SCUSalesNoteContratto"
import Annullamento from "../../mw_page_objects/polizza/Annullamento"
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

// after(function () {
//     TopBar.logOutMW()
//     //#region Mysql
//     cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//         let tests = testsInfo
//         cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
//     })
//     //#endregion
// })
//#endregion Before After

let currentCustomerNumber
let numberPolizza
describe('Matrix Web : Annullamento ', function () {

    it.only('Verifica annullamento', function () {
        cy.getClientWithPolizzeAnnullamento('TUTF021', '31').then(polizzaClient => {
            currentCustomerNumber = polizzaClient.customerNumber
            numberPolizza = polizzaClient.numberPolizza
            SintesiCliente.visitUrlClient(currentCustomerNumber, false)
            SintesiCliente.retriveUrl().then(currentUrl => {
                urlClient = currentUrl
            })
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
            Portafoglio.filtraPolizze('Motor')
            Portafoglio.clickAnnullamento(numberPolizza, 'Vendita')
            Annullamento.annullaContratto()
        })

    })

    it.only('Verifica Polizza non sia presente su Polizze attive', function () {
        SintesiCliente.visitUrlClient(currentCustomerNumber, false)
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkPolizzaIsNotPresentOnPolizzeAttive(numberPolizza)
    })
    it.only('Verifica Polizza sia presente su Non in vigore', function () {
        Portafoglio.clickSubTab('Non in vigore')
        Portafoglio.checkPolizzaIsPresentOnNonInVigore(numberPolizza)

    })

    it.only('Verifica Storno annullamento', function () {

        Portafoglio.clickStornoAnnullamento(numberPolizza)
        SintesiCliente.visitUrlClient(currentCustomerNumber, false)
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkPolizzaIsPresentOnPolizzeAttive(numberPolizza)
        //TODO : verifica tooltip
    })


})
