/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients"
import Clients from "../../mw_page_objects/clients/LandingClients"

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region  Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
})

after(() => {
    TopBar.logOutMW()
})
describe('Matrix Web : Navigazioni da Burger Menu in Clients', function () {

    it('Verifica i link da Burger Menu', function () {
        TopBar.clickClients()
        BurgerMenuClients.checkExistLinks()
    });

    it.only('Verifica aggancio Analisi dei bisogni', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Analisi dei bisogni')
    });

    it('Verifica aggancio Censimento nuovo cliente', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Censimento nuovo cliente')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Digital Me', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Digital Me')
        Clients.checkDigitalMe()
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Pannello anomalie')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Clienti duplicati', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Clienti duplicati')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Cancellazione Clienti', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Cancellazione Clienti')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Cancellazione Clienti per fonte', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Cancellazione Clienti per fonte')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Gestione fonte principale', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Gestione fonte principale')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Antiriciclaggio')
        BurgerMenuClients.backToClients()
    });

    // TODO ADD TFS  -> mostra canale e non c'è _blank
    // it.only('Verifica aggancio Hospital scanner', function () {
    //     TopBar.clickClients()
    //     BurgerMenuClients.clickLink('Hospital scanner')
    //     BurgerMenuClients.backToClients()
    // });
});