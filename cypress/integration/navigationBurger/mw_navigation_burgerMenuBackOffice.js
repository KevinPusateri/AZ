/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
import BurgerMenuBackOffice from "../../mw_page_objects/burgerMenu/BurgerMenuBackOffice"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion


//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
})

after(function () {
    //#endregion
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })

})


describe('Matrix Web : Navigazioni da Burger Menu in Backoffice', function () {

    it('Verifica link da Burger Menu', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.checkExistLinks()
    });

    //#region Sinistri
    it('Verifica aggancio Movimentazione sinistri', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Movimentazione sinistri')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione sinistri', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Consultazione sinistri')
        BurgerMenuBackOffice.backToBackOffice()
    })

    if (!Cypress.env('isAviva')) {
        it('Verifica aggancio Denuncia', function () {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.clickLink('Denuncia')
            BurgerMenuBackOffice.backToBackOffice()
        })

        it('Verifica aggancio Denuncia BMP', function () {
            if (!Cypress.env('monoUtenza')) {
                TopBar.clickBackOffice()
                BurgerMenuBackOffice.clickLink('Denuncia BMP')
                BurgerMenuBackOffice.backToBackOffice()
            } else this.skip()

        })

        it('Verifica aggancio Sinistri incompleti', function () {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.clickLink('Sinistri incompleti')
            BurgerMenuBackOffice.backToBackOffice()
        })

        it('Verifica aggancio Sinistri canalizzati', function () {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.clickLink('Sinistri canalizzati')
            BurgerMenuBackOffice.backToBackOffice()
        })
    }
    //#endregion

    //#region Contabilità
    it('Verifica aggancio Sintesi Contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Sintesi Contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Giornata contabile', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Giornata contabile')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione Movimenti', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Consultazione Movimenti')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Estrazione Contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Estrazione Contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Deleghe SDD', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Deleghe SDD')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Quadratura unificata', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Quadratura unificata')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso per conto', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Incasso per conto')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso massivo', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Incasso massivo')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sollecito titoli', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Sollecito titoli')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Convenzioni in trattenuta', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.clickLink('Convenzioni in trattenuta')
            BurgerMenuBackOffice.backToBackOffice()
        } else this.skip()
    })

    it('Verifica aggancio Monitoraggio Guida Smart', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.clickLink('Monitoraggio Guida Smart')
        } else {
            this.skip()
        }
    })

    it('Verifica aggancio Impostazione contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Impostazione contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    //#endregion
})

if (Cypress.env('isAviva')) {
    describe('Matrix Navigazioni da Burger Menu in Backoffice - AVIVA', {
        retries: {
            runMode: 1,
            openMode: 0,
        }
    }, function () {

        it('Verifica ASSENZA aggancio Denuncia', function () {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.checkNotExistLink('Denuncia')
        })

        it('Verifica ASSENZA aggancio Denuncia BMP', function () {
                TopBar.clickBackOffice()
                BurgerMenuBackOffice.checkNotExistLink('Denuncia BMP')
        })

        it('Verifica ASSENZA aggancio Sinistri incompleti', function () {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.checkNotExistLink('Sinistri incompleti')
        })

        it('Verifica ASSENZA aggancio Sinistri canalizzati', function () {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.checkNotExistLink('Sinistri canalizzati')
        })
    })
}