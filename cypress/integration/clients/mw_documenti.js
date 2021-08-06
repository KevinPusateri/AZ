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

let currentClient = ''
let documentType = ''

//#region Support
const searchClientWithoutDoc = (documentType) => {
    LandingRicerca.searchRandomClient(true, "PF", "P")
    LandingRicerca.clickRandomResult('PF')
    DettaglioAnagrafica.sezioneDocumenti()
    DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
        if (documentIsPresent)
            searchClientWithoutDoc(documentType)
        else
            return
    })
}
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

describe('Matrix Web : Documenti', function () {
    it('Cerca Cliente senza Carta D\'Identità', () => {
        documentType = 'identita'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Carta D\'Identità', () => {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaCartaIdentita()
    })

    it('Verifica Carta D\'Identità inserita', () => {
        HomePage.reloadMWHomePage()
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientName(currentClient)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Documento D\'Identità NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Patente', () => {
        documentType = 'Patente'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Patente', () => {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaPatente()
    })

    it('Verifica Patente', () => {
        HomePage.reloadMWHomePage()
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientName(currentClient)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Patente NON inserita')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Passaporto', () => {
        documentType = 'Passaporto'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Passaporto', () => {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoPassaporto()
    })

    it('Verifica Passaporto', () => {
        HomePage.reloadMWHomePage()
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientName(currentClient)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Passaporto NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Porto D\'Armi', () => {
        documentType = 'armi'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Porto D\'Armi', () => {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoPortoArmi()
    })

    it('Verifica Porto D\'Armi', () => {
        HomePage.reloadMWHomePage()
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientName(currentClient)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Porto D\'Armi NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Tessera Postale', () => {
        documentType = 'Postale'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Tessera Postale', () => {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaTesseraPostale()
    })

    it('Verifica Tessera Postale', () => {
        HomePage.reloadMWHomePage()
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientName(currentClient)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Tessera Postale NON inserita')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })

    it('Cerca Cliente senza Altro Documento', () => {
        documentType = 'Altro'
        searchClientWithoutDoc(documentType)
    })

    it('Inserisci Altro Documento', () => {
        SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
            currentClient = retrivedClient
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoAltroDocumento()
    })

    it('Verifica Altro Documento', () => {
        HomePage.reloadMWHomePage()
        TopBar.search(currentClient.name)
        LandingRicerca.clickClientName(currentClient)
        DettaglioAnagrafica.sezioneDocumenti()
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Altro Documento NON inserito')
            else
                assert.isTrue(documentIsPresent, 'è stato inserito');
        })
    })
})