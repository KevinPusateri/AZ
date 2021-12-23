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


let keys = {
    HOME_BACKOFFICE: true,
    MOVIMENTAZIONE_SINISTRI: true,
    DENUNCIA: true,
    GESTIONE_CONTATTO_CARD: true,
    DENUNCIA_BMP: true,
    CONSULTAZIONE_SINISTRI: true,
    SINISTRI_INCOMPLETI: true,
    SINISTRI_CANALIZZATI: true,
    SINTESI_CONTABILITÀ: true,
    GIORNATA_CONTABILE: true,
    CONSULTAZIONE_MOVIMENTI: true,
    ESTRAZIONE_CONTABILITÀ: true,
    DELEGHE_SDD: true,
    QUADRATURA_UNIFICATA: true,
    INCASSO_PER_CONTO: true,
    INCASSO_MASSIVO: true,
    SOLLECITO_TITOLI: true,
    IMPOSTAZIONE_CONTABILITÀ: true,
    CONVENZIONI_IN_TRATTENUTA: true,
    MONITORAGGIO_GUIDA_SMART: true
}


before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()

        cy.getProfiling(data.tutf).then(profiling => {
            cy.filterProfile(profiling, 'SINISTRI_CRUSCOTTO_STD').then(profiled => { keys.MOVIMENTAZIONE_SINISTRI = profiled })
            cy.filterProfile(profiling, 'SINISTRI_DENUNCIA_STD').then(profiled => { keys.DENUNCIA = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRA_BMP').then(profiled => { keys.DENUNCIA_BMP = profiled })
            cy.filterProfile(profiling, 'SINISTRI_INQUIRY_STD').then(profiled => { keys.CONSULTAZIONE_SINISTRI = profiled })
            cy.filterProfile(profiling, 'SINISTRI_REMUN_NO_MISA_STD').then(profiled => { keys.SINISTRI_INCOMPLETI = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_SXCANALIZZATI').then(profiled => { keys.SINISTRI_CANALIZZATI = profiled })
            cy.filterProfile(profiling, 'COMMON_CONTABILITA_SINTESI_CONTABILITA').then(profiled => { keys.SINTESI_CONTABILITÀ = profiled })
            cy.filterProfile(profiling, 'COMMON_CONTABILITA_GIORNATA_CONTABILE').then(profiled => { keys.GIORNATA_CONTABILE = profiled })
            cy.filterProfile(profiling, 'COMMON_CONTABILITA_CONSULTAZIONE_MOVIMENTI').then(profiled => { keys.CONSULTAZIONE_MOVIMENTI = profiled })
            cy.filterProfile(profiling, 'COMMON_CONTABILITA_DAS_INQUIRY').then(profiled => { keys.ESTRAZIONE_CONTABILITÀ = profiled })
            cy.filterProfile(profiling, 'COMMON_DELEGHE_RID_EPAY').then(profiled => { keys.DELEGHE_SDD = profiled })
            cy.filterProfile(profiling, 'COMMON_QUADRATURA_UNIFICATA_ALLIANZ_DIGITAL').then(profiled => { keys.QUADRATURA_UNIFICATA = profiled })
            cy.filterProfile(profiling, 'INCASSO_PER_CONTO').then(profiled => { keys.INCASSO_PER_CONTO = profiled })
            cy.filterProfile(profiling, 'COMMON_INCASSO_MASSIVO').then(profiled => { keys.INCASSO_MASSIVO = profiled })
            cy.filterProfile(profiling, 'COMMON_CONTABILITA_SOLLECITO_TITOLI').then(profiled => { keys.SOLLECITO_TITOLI = profiled })
            cy.filterProfile(profiling, 'MONITORAGGIO_CDF').then(profiled => { keys.MONITORAGGIO_GUIDA_SMART = profiled })
            cy.filterProfile(profiling, 'COMMON_CAD_CONVENZIONI_IN_TRATTENUTA').then(profiled => { keys.CONVENZIONI_IN_TRATTENUTA = profiled })
        })
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


describe('Matrix Web :Navigazioni da Burger Menu in Backoffice', function () {

    it('Verifica link da Burger Menu', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.checkExistLinks(keys)
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

    it.skip('Verifica aggancio Gestione Contatto Card', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Gestione Contatto Card')
        BurgerMenuBackOffice.backToBackOffice()
    })

    if (!Cypress.env('isAviva')) {
        it('Verifica aggancio Denuncia', function () {
            TopBar.clickBackOffice()
            BurgerMenuBackOffice.clickLink('Denuncia')
            BurgerMenuBackOffice.backToBackOffice()
        })

        it('Verifica aggancio Denuncia BMP', function () {
            cy.filterProfile(currentProfiling, 'COMMON_ULTRA_BMP').then(profiled => {
                if (profiled) {
                    TopBar.clickBackOffice()
                    BurgerMenuBackOffice.clickLink('Denuncia BMP')
                    BurgerMenuBackOffice.backToBackOffice()
                }
                else
                    this.skip()
            })
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
        cy.filterProfile(currentProfiling, 'COMMON_CAD_CONVENZIONI_IN_TRATTENUTA').then(profiled => {
            if (profiled) {
                TopBar.clickBackOffice()
                BurgerMenuBackOffice.clickLink('Convenzioni in trattenuta')
                BurgerMenuBackOffice.backToBackOffice()
            }
            else
                this.skip()
        })
    })

    it('Verifica aggancio Monitoraggio Guida Smart', function () {
        cy.filterProfile(currentProfiling, 'MONITORAGGIO_CDF').then(profiled => {
            if (profiled) {
                TopBar.clickBackOffice()
                BurgerMenuBackOffice.clickLink('Monitoraggio Guida Smart')
            }
            else
                this.skip()
        })
    })

    it('Verifica aggancio Impostazione contabilità', function () {
        TopBar.clickBackOffice()
        BurgerMenuBackOffice.clickLink('Impostazione contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    //#endregion
})