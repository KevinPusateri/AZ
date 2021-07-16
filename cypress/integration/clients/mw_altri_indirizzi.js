/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../mw_page_objects/common/LoginPage"
import TopBar from "../mw_page_objects/common/TopBar"
import LandingRicerca from "../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../mw_page_objects/clients/DettaglioAnagrafica"
import SCUAltriIndirizzi from "../mw_page_objects/clients/SCUAltriIndirizzi"
import HomePage from "../mw_page_objects/common/HomePage"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion
var client
var indirizzo = {
    toponimo: "",
    numero: "1",
    address: "TORINO",
    comune: "TRIESTE",
    ruolo: "",
    cap: "34123"
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


describe('Matrix Web : Creazione Indirizzo', function () {

    it('Verifica l\'operazione di inserimento Indirizzo', function () {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult()
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Altri indirizzi')
        SCUAltriIndirizzi.aggiungiInidirizzo(indirizzo).then((address) => {
            indirizzo = address
        })
    })

    it('Verifica Indirizzo sia inserito nella tabella', function () {
        HomePage.reloadMWHomePage()
        TopBar.search(client.name)
        LandingRicerca.clickClientName(client, true, 'PF', 'E')
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Altri indirizzi')
        SCUAltriIndirizzi.checkAltriIndirizzi(indirizzo)
    })


    it('Verifica la modifica Indirizzo ', function () {
        SCUAltriIndirizzi.modificaIndirizzo(indirizzo).then(address => {
            indirizzo = address
        })
        HomePage.reloadMWHomePage()
        TopBar.search(client.name)
        LandingRicerca.clickClientName(client, true, 'PF', 'E')
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Altri indirizzi')
        SCUAltriIndirizzi.checkAltriIndirizzi(indirizzo)
    })


    it('Verifica Elimina Indirizzo ', function () {
        SCUAltriIndirizzi.eliminaIndirizzo(indirizzo)
    })


})
