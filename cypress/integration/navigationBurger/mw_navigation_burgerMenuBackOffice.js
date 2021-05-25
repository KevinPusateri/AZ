/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import BurgerMenuBackOffice from "../../mw_page_objects/burgerMenu/BurgerMenuBackOffice"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Variables
const userName = 'le00080'
const psw = 'Dragonball3'
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


describe('Matrix Web : Navigazioni da Burger Menu in Backoffice', function () {

    it('Verifica link da Burger Menu', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.checkLinksBurgerMenu()
    });

    //#region Sinistri
    it('Verifica aggancio Movimentazione sinistri', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Movimentazione sinistri')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkMovimentazioneSinistri()
        BurgerMenuBackOffice.backToBackOffice()
    })


    it('Verifica aggancio Denuncia', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Denuncia')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkDenuncia()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Denuncia BMP', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Denuncia BMP')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkDenunciaBMP()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione sinistri', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Consultazione sinistri')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkConsultazioneSinistri()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sinistri incompleti', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sinistri incompleti')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkSinistriIncompleti()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sinistri canalizzati', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sinistri canalizzati')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkSinistriCanalizzati()
        BurgerMenuBackOffice.backToBackOffice()
    })
    //#endregion

    //#region Contabilità
    it('Verifica aggancio Sintesi Contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sintesi Contabilità')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkSintesiContabilita()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Giornata contabile', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Giornata contabile')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkGiornataContabile()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione Movimenti', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Consultazione Movimenti')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkConsultazioneMovimenti()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Estrazione Contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Estrazione Contabilità')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkEstrazioneContabilita()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Deleghe SDD', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Deleghe SDD')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkDelegheSDD()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Quadratura unificata', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Quadratura unificata')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkQuadraturaUnificata()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso per conto', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Incasso per conto')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkIncassoPerConto()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso massivo', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Incasso massivo')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkIncassoMassivo()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sollecito titoli', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sollecito titoli')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkSollecitoTitoli()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Impostazione contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Impostazione contabilità')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkImpostazioneContabilita()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Convenzioni in trattenuta', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Convenzioni in trattenuta')
        Common.canaleFromPopup()
        BurgerMenuBackOffice.checkConvenzioniInTrattenuta()
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Monitoraggio Customer Digital Footprint', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickAndCheckMonitoraggioCustomerDigitalFootprint()
    })
    //#endregion
})