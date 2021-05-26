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
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
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
    it.only('Verifica aggancio Movimentazione sinistri', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Movimentazione sinistri')
        BurgerMenuBackOffice.backToBackOffice()
    })


    it('Verifica aggancio Denuncia', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Denuncia')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Denuncia BMP', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Denuncia BMP')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione sinistri', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Consultazione sinistri')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sinistri incompleti', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sinistri incompleti')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sinistri canalizzati', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sinistri canalizzati')
        BurgerMenuBackOffice.backToBackOffice()
    })
    //#endregion

    //#region Contabilità
    it('Verifica aggancio Sintesi Contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sintesi Contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Giornata contabile', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Giornata contabile')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione Movimenti', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Consultazione Movimenti')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Estrazione Contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Estrazione Contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Deleghe SDD', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Deleghe SDD')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Quadratura unificata', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Quadratura unificata')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso per conto', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Incasso per conto')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso massivo', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Incasso massivo')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sollecito titoli', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Sollecito titoli')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Impostazione contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Impostazione contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Convenzioni in trattenuta', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Convenzioni in trattenuta')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Monitoraggio Customer Digital Footprint', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLinkOnBurgerMenu('Monitoraggio Customer Digital Footprint')
        BurgerMenuBackOffice.backToBackOffice()

    })
    //#endregion
})