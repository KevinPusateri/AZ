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

// after(() => {
//   TopBar.logOutMW()
// })
//#endregion Before After

describe('Matrix Web : Documenti - Carta D\'Identità', function () {

    it('Cerca Cliente senza Carta D\'Identità', () => {
        documentType = 'identita'
        searchClientWithoutDoc()
    })

    it('Inserisci Carta D\'Identità', () => {
        SintesiCliente.retriveClientName().then(currentClientName => {
            debugger
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