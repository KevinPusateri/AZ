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
const searchClientWithoutDoc = (documentType) => {
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

describe('Matrix Web : Documenti', function () {
    context('Carta D\'Identità', function () {

        it('Cerca Cliente senza Carta D\'Identità', () => {
            documentType = 'identita'
            searchClientWithoutDoc()
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
    })

    context('Patente', function () {

        it('Cerca Cliente senza Patente', () => {
            documentType = 'Patente'
            searchClientWithoutDoc()
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
    })

    context('Passaporto', function () {

        it('Cerca Cliente senza Passaporto', () => {
            documentType = 'Passaporto'
            searchClientWithoutDoc()
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
    })

    context('Porto D\'Armi', function () {

        it('Cerca Cliente senza Porto D\'Armi', () => {
            documentType = 'armi'
            searchClientWithoutDoc()
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
    })

    context('Tessera Postale', function () {

        it('Cerca Cliente senza Tessera Postale', () => {
            documentType = 'Postale'
            searchClientWithoutDoc()
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
    })

    context('Altro', function () {

        it('Cerca Cliente senza Altro Documento', () => {
            documentType = 'Altro'
            searchClientWithoutDoc()
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
})