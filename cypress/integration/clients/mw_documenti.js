/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import SCUDocumenti from "../../mw_page_objects/clients/SCUDocumenti"
import HomePage from "../../mw_page_objects/common/HomePage"
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

let currentClient = ''
let documentType = ''

//#region Support
const searchClientWithoutDoc = (documentType) => {
    LandingRicerca.searchRandomClient(true, "PF", "P", false)
    LandingRicerca.clickRandomResult('PF','P',false)
    DettaglioAnagrafica.sezioneDocumenti()
    DettaglioAnagrafica.checkDocumento(documentType, false).then(documentIsPresent => {
        if (documentIsPresent)
            searchClientWithoutDoc(documentType)
        else {
            cy.screenshot({ clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            return
        }
    })
}
//#endregion

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })
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

describe('Matrix Web : Documenti', function () {
    it('Cerca Cliente senza Carta D\'Identità', () => {
        documentType = 'identita'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Carta D\'Identità', function () {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaCartaIdentita()
    })

    it('Verifica Carta D\'Identità inserita', function () {
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientePF(currentClient.name)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Documento D\'Identità NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Patente', function () {
        documentType = 'Patente'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Patente', function () {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaPatente()
    })

    it('Verifica Patente', function () {
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientePF(currentClient.name)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Patente NON inserita')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Passaporto', function () {
        documentType = 'Passaporto'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Passaporto', function () {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoPassaporto()
    })

    it('Verifica Passaporto', function () {
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientePF(currentClient.name)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Passaporto NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Porto D\'Armi', function () {
        documentType = 'armi'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Porto D\'Armi', function () {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoPortoArmi()
    })

    it('Verifica Porto D\'Armi', function () {
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientePF(currentClient.name)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Porto D\'Armi NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Tessera Postale', function () {
        documentType = 'Postale'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Tessera Postale', function () {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaTesseraPostale()
    })

    it('Verifica Tessera Postale', function () {
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientePF(currentClient.name)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Tessera Postale NON inserita')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Altro Documento', function () {
        documentType = 'Altro'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Altro Documento', function () {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoAltroDocumento()
    })

    it('Verifica Altro Documento', function () {
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientePF(currentClient.name)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Altro Documento NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })
})