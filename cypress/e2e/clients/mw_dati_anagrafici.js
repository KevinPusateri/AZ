/**
* @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
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

var client

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })


        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult()
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
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
//#endregion Before After

describe('Matrix Web : Dati Anagrafici', function () {

    it('Verifica presenza campi titoli -> Dati Principali persona fisica', function () {
        DettaglioAnagrafica.checkCampiDatiPrincipaliPF()
    })

    it('Verifica presenza campi titoli -> Identificazione e adeguata verifica', function () {
        DettaglioAnagrafica.checkCampiIdentificazioneAdeguataVerifica()
    })

    it('Verifica presenza campi titoli -> Consensi', function () {
        DettaglioAnagrafica.checkCampiConsensi()
    })

    it('Verifica presenza campi titoli -> Residenza anagrafica', function () {
        DettaglioAnagrafica.checkCampiResidenzaAnagrafica()
    })

    it('Verifica presenza campi titoli -> Domicilio', function () {
        DettaglioAnagrafica.checkCampiDomicilio()
    })

    it('Verifica presenza campi titoli -> Numero Telefono Principale', function () {
        DettaglioAnagrafica.checkCampiNumeroTelefonoPrincipale()
    })

    it('Verifica presenza campi titoli -> Email', function () {
        DettaglioAnagrafica.checkCampiEmail()
    })

    it('Verifica presenza campi titoli -> Documento Principale', function () {
        DettaglioAnagrafica.checkCampiDocumentoPrincipale()
    })

})
