/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
import BurgerMenuBackOffice from "../../mw_page_objects/burgerMenu/BurgerMenuBackOffice"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion


//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
var url = Common.getUrlBeforeEach() + 'back-office'
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
//#endregion


let keys = {
    HOME_BACKOFFICE: true,
    MOVIMENTAZIONE_SINISTRI: true,
    DENUNCIA: true,
    GESTIONE_CONTATTO_CARD: true,
    NUOVA_DENUNCIA: true, // Rel 128 21-11-22 (pre Denuncia BMP)
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
    ESTRAZIONE_CONTABILITA: true,
    CONVENZIONI_IN_TRATTENUTA: true,
    MONITORAGGIO_GUIDA_SMART: true,
    IMPOSTAZIONE_CONTABILITA: true,
    SCHEDA_SINISTRI_GESTIONE: true
}

before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()

            cy.getProfiling(data.tutf).then(profiling => {
                cy.filterProfile(profiling, 'SINISTRI_CRUSCOTTO_STD').then(profiled => { keys.MOVIMENTAZIONE_SINISTRI = profiled })
                cy.filterProfile(profiling, 'SINISTRI_DENUNCIA_STD').then(profiled => { keys.DENUNCIA = profiled })
                cy.filterProfile(profiling, 'SINISTRI_DENUNCIA_STD ').then(profiledSTD => {
                    cy.filterProfile(profiling, 'DENUNCIA_BMP_NM ').then(profiledBMP => {
                        console.log(profiledSTD)
                        console.log(profiledBMP)
                        if (!(profiledSTD && profiledBMP))
                            keys.NUOVA_DENUNCIA = false
                    })
                })
                cy.filterProfile(profiling, 'SINISTRI_INQUIRY_STD').then(profiled => { keys.CONSULTAZIONE_SINISTRI = profiled })
                cy.filterProfile(profiling, 'SINISTRI_REMUN_NO_MISA_STD').then(profiled => { keys.SINISTRI_INCOMPLETI = profiled })
                cy.filterProfile(profiling, 'COMMON_REPORTING_SXCANALIZZATI').then(profiled => { keys.SINISTRI_CANALIZZATI = profiled })
                cy.filterProfile(profiling, 'COMMON_CONTABILITA_SINTESI_CONTABILITA').then(profiled => { keys.SINTESI_CONTABILITÀ = profiled })
                cy.filterProfile(profiling, 'COMMON_CONTABILITA_GIORNATA_CONTABILE').then(profiled => { keys.GIORNATA_CONTABILE = profiled })
                cy.filterProfile(profiling, 'COMMON_CONTABILITA_CONSULTAZIONE_MOVIMENTI').then(profiled => { keys.CONSULTAZIONE_MOVIMENTI = profiled })
                cy.filterProfile(profiling, 'COMMON_CONTABILITA_DAS_INQUIRY').then(profiled => { keys.ESTRAZIONE_CONTABILITA = profiled })
                cy.filterProfile(profiling, 'COMMON_DELEGHE_RID_EPAY').then(profiled => { keys.DELEGHE_SDD = profiled })
                cy.filterProfile(profiling, 'COMMON_QUADRATURA_UNIFICATA_ALLIANZ_DIGITAL').then(profiled => { keys.QUADRATURA_UNIFICATA = profiled })
                cy.filterProfile(profiling, 'INCASSO_PER_CONTO').then(profiled => { keys.INCASSO_PER_CONTO = profiled })
                cy.filterProfile(profiling, 'COMMON_INCASSO_MASSIVO').then(profiled => { keys.INCASSO_MASSIVO = profiled })
                cy.filterProfile(profiling, 'COMMON_CONTABILITA_SOLLECITO_TITOLI').then(profiled => { keys.SOLLECITO_TITOLI = profiled })
                cy.filterProfile(profiling, 'MONITORAGGIO_CDF').then(profiled => { keys.MONITORAGGIO_GUIDA_SMART = profiled })
                cy.filterProfile(profiling, 'COMMON_CAD_CONVENZIONI_IN_TRATTENUTA').then(profiled => { keys.CONVENZIONI_IN_TRATTENUTA = profiled })
                cy.filterProfile(profiling, 'COMMON_CONTABILITA_CONSULTAZIONE_MOVIMENTI').then(profiled => { keys.IMPOSTAZIONE_CONTABILITA = profiled })

                //20.06.22 Scheda Sinistri per Gestione
                cy.filterProfile(profiling, 'COMMON_REPORTING_INTERROGAZIONI_CENTRALIZZATE').then(profiledReportingInterrogazioniCentralizzate => {
                    cy.filterProfile(profiling, 'REPORTING_DATI_SENSIBILI').then(profiledDatiSensibili => {
                        cy.filterProfile(profiling, 'REPORTING_INCENTIVAZIONI_DI_AGENZIA').then(profiledIncentivazioniAgenzia => {
                            debugger
                            if (!(profiledReportingInterrogazioniCentralizzate && profiledDatiSensibili && profiledIncentivazioniAgenzia) || Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
                                keys.SCHEDA_SINISTRI_GESTIONE = false
                        })
                    })
                })
            })
        })
    })
    TopBar.clickBackOffice()
})

beforeEach(() => {
    cy.preserveCookies()
    cy.ignoreRequest()
    BurgerMenuBackOffice.clickBurgerMenu()
})

afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        cy.ignoreRequest()
        cy.visit(url)
        cy.wait(3000)
    }
})

after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion

})


describe('Matrix Web: Navigazioni da Burger Menu in Backoffice', options, function () {

    it('Verifica link da Burger Menu', function () {

        BurgerMenuBackOffice.checkExistLinks(keys)
    });

    //#region Sinistri
    it('Verifica aggancio Movimentazione sinistri', function () {
        if (!keys.MOVIMENTAZIONE_SINISTRI)
            this.skip()

        BurgerMenuBackOffice.clickLink('Movimentazione sinistri')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione sinistri', function () {
        if (!keys.CONSULTAZIONE_SINISTRI)
            this.skip()

        BurgerMenuBackOffice.clickLink('Consultazione sinistri')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Gestione Contatto Card', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) //! NON si ha ancora la chiave i profilazione
            this.skip()

        BurgerMenuBackOffice.clickLink('Gestione Contatto Card')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Denuncia', function () {
        if (!keys.DENUNCIA)
            this.skip()

        BurgerMenuBackOffice.clickLink('Denuncia')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Nuova Denuncia', function () {
        if (!keys.NUOVA_DENUNCIA)
            this.skip()

        BurgerMenuBackOffice.clickLink('Nuova Denuncia')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sinistri incompleti', function () {
        if (!keys.SINISTRI_INCOMPLETI)
            this.skip()

        BurgerMenuBackOffice.clickLink('Sinistri incompleti')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sinistri canalizzati', function () {
        if (!keys.SINISTRI_CANALIZZATI)
            this.skip()

        BurgerMenuBackOffice.clickLink('Sinistri canalizzati')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Scheda Sinistri per Gestione', function () {
        if (!keys.SCHEDA_SINISTRI_GESTIONE)
            this.skip()

        BurgerMenuBackOffice.clickLink('Scheda Sinistri per Gestione')
        BurgerMenuBackOffice.backToBackOffice()
    })
    // }
    //#endregion

    //#region Contabilità
    it('Verifica aggancio Sintesi Contabilità', function () {
        if (!keys.SINTESI_CONTABILITÀ)
            this.skip()

        BurgerMenuBackOffice.clickLink('Sintesi Contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Giornata contabile', function () {
        if (!keys.GIORNATA_CONTABILE)
            this.skip()

        BurgerMenuBackOffice.clickLink('Giornata contabile')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Consultazione Movimenti', function () {
        if (!keys.CONSULTAZIONE_MOVIMENTI)
            this.skip()

        BurgerMenuBackOffice.clickLink('Consultazione Movimenti')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Estrazione Contabilità', function () {
        if (!keys.ESTRAZIONE_CONTABILITÀ)
            this.skip()

        BurgerMenuBackOffice.clickLink('Estrazione Contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Deleghe SDD', function () {
        if (!keys.DELEGHE_SDD)
            this.skip()

        BurgerMenuBackOffice.clickLink('Deleghe SDD')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Quadratura unificata', function () {
        if (!keys.QUADRATURA_UNIFICATA)
            this.skip()

        BurgerMenuBackOffice.clickLink('Quadratura unificata')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso per conto', function () {
        if (!keys.INCASSO_PER_CONTO)
            this.skip()

        BurgerMenuBackOffice.clickLink('Incasso per conto')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Incasso massivo', function () {
        if (!keys.INCASSO_MASSIVO)
            this.skip()

        BurgerMenuBackOffice.clickLink('Incasso massivo')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Sollecito titoli', function () {
        if (!keys.SOLLECITO_TITOLI)
            this.skip()

        BurgerMenuBackOffice.clickLink('Sollecito titoli')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Convenzioni in trattenuta', function () {
        if (!keys.CONVENZIONI_IN_TRATTENUTA)
            this.skip()

        BurgerMenuBackOffice.clickLink('Convenzioni in trattenuta')
        BurgerMenuBackOffice.backToBackOffice()
    })

    it('Verifica aggancio Monitoraggio Guida Smart', function () {
        if (!keys.MONITORAGGIO_GUIDA_SMART)
            this.skip()

        BurgerMenuBackOffice.clickLink('Monitoraggio Guida Smart')
        BurgerMenuBackOffice.backToBackOffice()

    })

    it('Verifica aggancio Impostazione contabilità', function () {
        if (!keys.IMPOSTAZIONE_CONTABILITA)
            this.skip()

        BurgerMenuBackOffice.clickLink('Impostazione contabilità')
        BurgerMenuBackOffice.backToBackOffice()
    })

    //#endregion
})