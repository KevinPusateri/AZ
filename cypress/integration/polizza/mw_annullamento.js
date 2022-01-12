/**
* @author Kevin Pusateri <kevin.pusateri@allianz.it>
*@description ANNULLAMENTO PER VENDITA + STORNO ANNULLAMENTO
Requisiti: polizza auto con scadenza futura, frazionamento annuale (per comodità), ramo 13 o 31
Controlli:
1.	premere i 3 puntini sulla card di polizza e selezionare Annullamento e successivamente Vendita
2.	scegliere data annullamento odierna
3.	selezionare firma Autografa dal menù Scelta Firma Cliente
4.	premere il tasto Annulla Contratto
5.	flaggare Atto di Vendita sul pop up Richiesta documenti + tasto OK
6.	premere Conferma sul pop up con l’appendice di annullamento in pdf + tasto Home
7.	verificare che la polizza non sia più presente nel tab Polizze attive e sia presente sul tab polizze non in vigore
8.	verificare che sulla card di polizza ci sia l’etichetta NON IN VIGORE con il tooltip del motivo di annullamento: “4 Vendita/conto vendita”
9.	premere i 3 puntini sulla card di polizza e selezionare Storno annullamento
10.	premere sulla schermata successiva Storno annullamento e poi Home (il pop up a pag 22 non dovrebbe comparire)
11.	verificare che la polizza non sia più presente nel tab Polizze non in vigore e sia di nuovo presente sul tab polizze in vigore

*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import Annullamento from "../../mw_page_objects/polizza/Annullamento"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

let currentTutf
//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        currentTutf = data.tutf
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
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

describe('Matrix Web : Annullamento + Storno Annullamento', function () {

    it('Verifica che la polizza non sia più presente nel tab Polizze attive e ' +
        'sia presente sul tab polizze non in vigore', function () {
            cy.log('Retriving client with Polizze for Annullamento, please wait...')
            cy.getClientWithPolizzeAnnullamento(currentTutf, '31').then(polizzaClient => {
                currentCustomerNumber = polizzaClient.customerNumber
                numberPolizza = polizzaClient.numberPolizza
                currentCustomerFullName = polizzaClient.customerName
                TopBar.search(currentCustomerFullName)
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Motor')
                Portafoglio.clickAnnullamento(numberPolizza, 'Vendita')
                Annullamento.annullaContratto()
                TopBar.search(currentCustomerFullName)
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.checkPolizzaIsNotPresentOnPolizzeAttive(numberPolizza)
            })

        })

    it('Verifica che sulla card di polizza ci sia l’etichetta NON IN VIGORE ' +
        'con il tooltip del motivo di annullamento: “4 Vendita/conto vendita”', function () {
            Portafoglio.clickSubTab('Non in vigore')
            Portafoglio.checkPolizzaIsPresentOnNonInVigore(numberPolizza)
        })


    it('Verifica che la polizza non sia più presente nel tab Polizze non in vigore e ' +
        'sia di nuovo presente sul tab polizze in vigore', function () {
            Portafoglio.clickStornoAnnullamento(numberPolizza)
            SintesiCliente.visitUrlClient(currentCustomerNumber, false)
            Portafoglio.clickTabPortafoglio()
            Portafoglio.checkPolizzaIsPresentOnPolizzeAttive(numberPolizza)

        })


})
