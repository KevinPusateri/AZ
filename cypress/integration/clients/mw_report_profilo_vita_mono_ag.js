/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
* @description Da spalla sx in sintesi cliente da Clients, gestione di report profilo vita
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import HomePage from "../../mw_page_objects/common/HomePage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import Common from "../../mw_page_objects/common/Common"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
const agency = '010710000'
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
afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        //#region Mysql
        cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
        })
        //#endregion
        Cypress.runner.stop();
    }
})
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

let currentCustomerNumber
let urlClient
describe('Matrix Web : Report Profilo Vita', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {
    it('Accedere a MW con un\'utenza con doppio ruolo\n' +
        'e ricercare un cliente PF presente solo in un\'agenzia con polizza Vita e da menu azioni\n' +
        'Verificare che ci sia la voce "Report Profilo Vita"', () => {
            cy.log('Retriving client PF with polizze vita, please wait...')
            cy.getClientWithPolizze('TUTF021', '86').then(customerNumber => {
                currentCustomerNumber = customerNumber
                SintesiCliente.visitUrlClient(customerNumber, false)
                SintesiCliente.retriveUrl().then(currentUrl => {
                    urlClient = currentUrl
                })
                SintesiCliente.checkVociSpallaSinistra('Report Profilo Vita')
            })
        })

    it('Cliccare su "Report Profilo Vita"\n' +
        'Verificare che si apra la maschera di disambiguazione con la scelta dei due accuont, sceglierne uno\n' +
        'Verificare che si apra correttamente il pdf', () => {
            SintesiCliente.emettiReportProfiloVita('710000')
            HomePage.reloadMWHomePage()
        })
})