/**
* @author Kevin Pusateri <kevin.pusateri@allianz.it>
* @description SOSPENSIONE
Requisiti: polizza auto con scadenza a più di due mesi, frazionamento annuale (per comodità), ramo 13 o 31
Controlli:
1.	premere i 3 puntini sulla card di polizza e selezionare Annullamento e successivamente Sospensione
2.	scegliere data di sospensione odierna
3.	lasciare Scelta Firma Agente il valore preimpostato e premere Calcola e successivamente Annulla Contratto
4.	premere Conferma sul pop up con l’appendice di annullamento in pdf + tasto Home
5.	verificare che la polizza sia ancora presente nel tab Polizze attive ma abbia l’etichetta SOSPESA 
con tooltip “30 – Sospensione senza integrazione”

*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import Sospensione from "../../mw_page_objects/polizza/Sospensione"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

let currentTutf
//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        currentTutf = data.tutf

        cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )
        LoginPage.logInMWAdvanced()
    })
})
beforeEach(() => {
    cy.preserveCookies()
})

afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        //#region Mysql
        cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
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
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
})
//#endregion Before After

let currentCustomerFullName
let currentCustomerNumber
let numberPolizza
let urlClient
describe('Matrix Web : Sospensione ', function () {

    it('Verifica che la polizza sia ancora presente nel tab Polizze attive ' +
        'ma abbia l’etichetta SOSPESA con tooltip “30 – Sospensione senza integrazione”', function () {
            cy.log('Retriving client with Polizze for Sospensione, please wait...')
            cy.getClientWithPolizzeAnnullamento(currentTutf, '31', 'sospesa').then(polizzaClient => {
                currentCustomerNumber = polizzaClient.customerNumber
                numberPolizza = polizzaClient.numberPolizza
                currentCustomerFullName = polizzaClient.customerName
                TopBar.search(currentCustomerFullName)
                LandingRicerca.clickClientePF(currentCustomerFullName)
                SintesiCliente.retriveUrl().then(currentUrl => {
                    urlClient = currentUrl
                })
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Motor')
                Portafoglio.clickAnnullamento(numberPolizza, 'Sospensione')
                Sospensione.sospendiPolizza()
                TopBar.search(currentCustomerFullName)
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.checkPolizzaIsSospesa(numberPolizza)
            })
        })


})
