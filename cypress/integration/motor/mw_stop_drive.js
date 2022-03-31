/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import HomePage from "../../mw_page_objects/common/HomePage";
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca";
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";
import Portafoglio from "../../mw_page_objects/clients/Portafoglio";
import Annullamento from "../../mw_page_objects/polizza/Annullamento";

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

let currentTutf
let currentCustomerNumber
let numberPolizza
let currentCustomerFullName
let currentAgency
before(() => {
    cy.getUserWinLogin().then(data => {
        currentTutf = data.tutf
        cy.log('Retriving client with Polizze for Stop&Drive, please wait...')
        cy.getClientWithConsensoOTP(currentTutf).then(polizzaClient => {
            currentCustomerNumber = polizzaClient.customerNumber
            numberPolizza = polizzaClient.numberPolizza
            currentCustomerFullName = polizzaClient.customerName
            let customImpersonification = {
                agentId: polizzaClient.agentId,
                agency: polizzaClient.agency
            }
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced(customImpersonification)
            currentAgency = polizzaClient.agency
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    HomePage.reloadMWHomePage()
})

afterEach(function () {
    if (this.currentTest.state === 'passed') {
        let messageToSend = `Dati relativi all'ultima Stop & Drive completata : </br></br>
        <b>AGENZIA</b> : ${currentAgency}</br>
        <b>AMBIENTE</b> : ${currentEnv}</br>
        <b>NOME CLIENTE</b> : ${currentCustomerFullName}</br>
        <b>NUMERO POLIZZA</b> : ${numberPolizza}</br>
    `
        //Send Report mail
        cy.task('sendMail', { currentSubject: "MW Stop&Drive Automatic Test", currentMessage: messageToSend, additionalEmail: "codia.carlotta@allianz.it" })
    }
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

let urlClient
describe('Matrix Web : Annullamento -> Stop&Drive', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, function () {

    it('Verifica Stato della polizza in "Sospensione stop and drive"', function () {
        TopBar.search(currentCustomerFullName)
        LandingRicerca.clickClientePF(currentCustomerFullName)
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        Portafoglio.filtraPolizze('Motor')
        Portafoglio.clickAnnullamento(numberPolizza, 'Sospensione stop and drive')
        Annullamento.stopDrive()
        TopBar.search(currentCustomerFullName)
        LandingRicerca.clickClientePF(currentCustomerFullName)
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkTooltipStopDrive(numberPolizza)
    })
})