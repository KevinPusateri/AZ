/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BackOffice from "../../mw_page_objects/Navigation/BackOffice"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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
    SINTESI_CONTABILITA: true,
    GIORNATA_CONTABILE: true,
    CONSULTAZIONE_MOVIMENTI: true,
    ESTRAZIONE_CONTABILITA: true,
    DELEGHE_SDD: true,
    QUADRATURA_UNIFICATA: true,
    INCASSO_PER_CONTO: true,
    INCASSO_MASSIVO: true,
    SOLLECITO_TITOLI: true,
    IMPOSTAZIONE_CONTABILITA: true,
    CONVENZIONI_IN_TRATTENUTA: true,
    MONITORAGGIO_GUIDA_SMART: true,
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
                cy.filterProfile(profiling, 'COMMON_ULTRA_BMP').then(profiled => { keys.DENUNCIA_BMP = profiled })
                cy.filterProfile(profiling, 'SINISTRI_INQUIRY_STD').then(profiled => { keys.CONSULTAZIONE_SINISTRI = profiled })
                cy.filterProfile(profiling, 'SINISTRI_REMUN_NO_MISA_STD').then(profiled => { keys.SINISTRI_INCOMPLETI = profiled })
                cy.filterProfile(profiling, 'COMMON_REPORTING_SXCANALIZZATI').then(profiled => { keys.SINISTRI_CANALIZZATI = profiled })
                cy.filterProfile(profiling, 'COMMON_CONTABILITA_SINTESI_CONTABILITA').then(profiled => { keys.SINTESI_CONTABILITA = profiled })
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
                            if (!(profiledReportingInterrogazioniCentralizzate && profiledDatiSensibili && profiledIncentivazioniAgenzia) || Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
                                keys.SCHEDA_SINISTRI_GESTIONE = false
                        })
                    })
                })
            })
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv(false, false)
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

describe('Matrix Web : Navigazioni da BackOffice', function () {

    it('Verifica atterraggio su BackOffice', function () {
        TopBar.clickBackOffice()
    });

    it('Verifica atterraggio Appuntamenti Futuri', function () {
        TopBar.clickBackOffice()
        BackOffice.clickAppuntamentiFuturi()
    });

    it('Verifica links Sinistri', function () {
        TopBar.clickBackOffice()
        BackOffice.checkLinksOnSinistriExist(keys)
    });

    it('Verifica links Contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.checkLinksOnContabilitaExist(keys)
    });

    it('Verifica apertura disambiguazione: Movimentazione Sinistri', function () {
        if (!keys.MOVIMENTAZIONE_SINISTRI)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Denuncia', function () {
        if (!keys.DENUNCIA)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Denuncia BMP', function () {
        if (!keys.DENUNCIA_BMP)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia BMP')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Consultazione sinistri', function () {
        if (!keys.CONSULTAZIONE_SINISTRI)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri')
        BackOffice.backToBackOffice()
    })

    it('Verifica aggancio Gestione Contatto Card', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) //! NON si ha ancora la chiave i profilazione
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Gestione Contatto Card')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sinistri incompleti', function () {
        if (!keys.SINISTRI_INCOMPLETI)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sinistri incompleti')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sinistri canalizzati', function () {
        if (!keys.SINISTRI_CANALIZZATI)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sinistri canalizzati')
        BackOffice.backToBackOffice()
    })

    it('Verifica aggancio Scheda Sinistri per Gestione', function () {
        if (!keys.SCHEDA_SINISTRI_GESTIONE)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Scheda Sinistri per Gestione')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sintesi Contabilità', function () {
        if (!keys.SINTESI_CONTABILITA)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sintesi Contabilità')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Giornata contabile', function () {
        if (!keys.GIORNATA_CONTABILE)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Giornata contabile')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Consultazione Movimenti', function () {
        if (!keys.CONSULTAZIONE_MOVIMENTI)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione Movimenti')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Estrazione Contabilità', function () {
        if (!keys.ESTRAZIONE_CONTABILITA)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Estrazione Contabilità')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Deleghe SDD', function () {
        if (!keys.DELEGHE_SDD)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Deleghe SDD')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Quadratura unificata', function () {
        if (!keys.QUADRATURA_UNIFICATA)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Quadratura unificata')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Incasso per conto', function () {
        if (!keys.INCASSO_PER_CONTO)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Incasso per conto')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Incasso massivo', function () {
        if (!keys.INCASSO_MASSIVO)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Incasso massivo')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sollecito titoli', function () {
        if (!keys.SOLLECITO_TITOLI)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sollecito titoli')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Convenzioni in trattenuta', function () {
        if (!keys.CONVENZIONI_IN_TRATTENUTA)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Convenzioni in trattenuta')
        BackOffice.backToBackOffice()

    });

    it('Verifica apertura disambiguazione: Monitoraggio Guida Smart', function () {
        if (!keys.MONITORAGGIO_GUIDA_SMART)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Monitoraggio Guida Smart')
        BackOffice.backToBackOffice()
    });

    it('Verifica apertura disambiguazione: Impostazione contabilità', function () {
        if (!keys.IMPOSTAZIONE_CONTABILITA)
            this.skip()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Impostazione contabilità')
        BackOffice.backToBackOffice()
    });
})