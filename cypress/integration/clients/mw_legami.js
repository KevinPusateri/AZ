/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let currentClient = ''
let legame = ''
//#endregion

const searchClientWithoutLegame = () => {
    // LandingRicerca.searchRandomClient(true, "PG", "P")
    // LandingRicerca.clickRandomResult()
    debugger
    LandingRicerca.search('LA DISPENSA')
    LandingRicerca.clickFirstResult()
    DettaglioAnagrafica.sezioneLegami()
    DettaglioAnagrafica.checkLegami().then(check => {
        debugger
        if (check)
            searchClientWithoutLegame()
        else
            return
    })
}

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

describe('Matrix Web : Legami', function () {

    it('Cerca Cliente senza Legami', () => {
        searchClientWithoutLegame()
    })

    // it('Inserisci membro', () => {
    //     SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
    //         currentClient = retrivedClient
    //     })

    //     Legami.creaGruppo()
    //     // Legami.nuovoMembro()
    // })
})