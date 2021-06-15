/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../../mw_page_objects/clients/DettaglioAnagrafica"
import SCUDocumenti from "../../../mw_page_objects/clients/SCUDocumenti"
import HomePage from "../../../mw_page_objects/common/HomePage"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let currentClient = ''
let documentType = ''
//#endregion

//#region Support
const searchClientWithoutDoc = () => {
    LandingRicerca.searchRandomClient(true, "PF", "P")
    LandingRicerca.clickRandomResult()
    DettaglioAnagrafica.sezioneDocumenti()
    DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
        if (documentIsPresent)
            searchClientWithoutDoc()
        else
            return
    })
}
//#endregion

//#region Before After
before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    cy.preserveCookies()
})

after(() => {
  TopBar.logOutMW()
})
//#endregion Before After

describe('Matrix Web : Documenti - Carta D\'Identità', function () {

    it('Cerca Cliente senza Carta D\'Identità', () => {
        documentType = 'identita'
        searchClientWithoutDoc()
    })

    it('Inserisci Carta D\'Identità', () => {
        SintesiCliente.retriveClientName().then(currentClientName => {
            currentClient = currentClientName
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaCartaIdentita()
    })

    it('Verifica Carta D\'Identità inserita', () => {
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Documento D\'Identità NON inserito')
        })
    })
})

describe('Matrix Web : Documenti - Patente', function () {

    it('Cerca Cliente senza Patente', () => {
        documentType = 'Patente'
        searchClientWithoutDoc()
    })

    it('Inserisci Patente', () => {
        SintesiCliente.retriveClientName().then(currentClientName => {
            currentClient = currentClientName
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaPatente()
    })

    it('Verifica Patente', () => {
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Patente NON inserita')
        })
    })
})

describe('Matrix Web : Documenti - Passaporto', function () {

    it('Cerca Cliente senza Passaporto', () => {
        documentType = 'Passaporto'
        searchClientWithoutDoc()
    })

    it('Inserisci Passaporto', () => {
        SintesiCliente.retriveClientName().then(currentClientName => {
            currentClient = currentClientName
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoPassaporto()
    })

    it('Verifica Passaporto', () => {
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Passaporto NON inserito')
        })
    })
})

describe('Matrix Web : Documenti - Porto D\'Armi', function () {

    it('Cerca Cliente senza Porto D\'Armi', () => {
        documentType = 'armi'
        searchClientWithoutDoc()
    })

    it('Inserisci Porto D\'Armi', () => {
        SintesiCliente.retriveClientName().then(currentClientName => {
            currentClient = currentClientName
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoPortoArmi()
    })

    it('Verifica Porto D\'Armi', () => {
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Porto D\'Armi NON inserito')
        })
    })
})

describe('Matrix Web : Documenti - Tessera Postale', function () {

    it('Cerca Cliente senza Tessera Postale', () => {
        documentType = 'Postale'
        searchClientWithoutDoc()
    })

    it('Inserisci Tessera Postale', () => {
        SintesiCliente.retriveClientName().then(currentClientName => {
            currentClient = currentClientName
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovaTesseraPostale()
    })

    it('Verifica Tessera Postale', () => {
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Tessera Postale NON inserita')
        })
    })
})

describe.only('Matrix Web : Documenti - Altro', function () {

    it('Cerca Cliente senza Altro Documento', () => {
        documentType = 'Altro'
        searchClientWithoutDoc()
    })

    it('Inserisci Altro Documento', () => {
        SintesiCliente.retriveClientName().then(currentClientName => {
            currentClient = currentClientName
        })

        DettaglioAnagrafica.aggiungiDocumento()
        SCUDocumenti.nuovoAltroDocumento()
    })

    it('Verifica Altro Documento', () => {
        DettaglioAnagrafica.checkDocumento(documentType).then(documentIsPresent => {
            if (!documentIsPresent)
                assert.fail('Altro Documento NON inserito')
        })
    })
})