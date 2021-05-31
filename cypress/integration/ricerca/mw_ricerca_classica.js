/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import SCU from "../../mw_page_objects/clients/SCU"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import News from "../../mw_page_objects/Navigation/News"

//#region Variables
const userName = 'LE00038'
const psw = 'Aprile2021$'
//#endregion

//#region Configuration
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

describe('Buca di Ricerca', function () {
    // it('Verifica Click su Ricerca Classica', function () {
    //     LandingRicerca.searchRandomClient(false)
    //     LandingRicerca.checkRicercaClassica()
    // })

    // it('Verifica Click su Ricerca Cliente', function () {
    //     LandingRicerca.searchRandomClient(false)
    //     LandingRicerca.clickRicercaClassicaLabel('Ricerca Cliente')
    //     SCU.checkAggancioRicerca()
    // })

    // it('Verifica Click su Ricerca Polizze proposte', function () {
    //     LandingRicerca.searchRandomClient(false)
    //     LandingRicerca.clickRicercaClassicaLabel('Ricerca Polizze proposte')
    //     SCU.checkAggancioPolizzePropostePreventivi()
    // })

    // it('Verifica Click su Ricerca Preventivi', function () {
    //     LandingRicerca.searchRandomClient(false)
    //     LandingRicerca.clickRicercaClassicaLabel('Ricerca Preventivi')
    //     SCU.checkAggancioPolizzePropostePreventivi()
    // })


    it('Verifica Click su Ricerca News', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.clickRicercaClassicaLabel('Ricerca News')
        News.checkAtterraggio(true)
    })
    it('Verifica Click su Rubrica', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.clickRicercaClassicaLabel('Rubrica')
        SCU.checkAggancioRicerca()
    })
})