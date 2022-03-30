/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */
/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"

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
    BMPenabled: true,
    UltraImpresaEnabled: true,
    PreventivoMotorEnabled: true,
    UltraSaluteEnabled: true,
    UltraCasaPatrimonioEnabled: true,
    Allianz1BusinessEnabled: true,
    FasquoteImpresaAlbergoEnabled: true,
    FlotteConvenzioniEnabled: true,
    PreventivoAnonimoVitaenabled: true,
    MiniflotteEnabled: true,
    TrattativeAutoCorporateEnabled: true
}

let keysRapidi = {
    MONITORAGGIO_POLIZZE_PROPOSTE: true,
    RECUPERO_PREVENTIVI_E_QUOTAZIONI: true,
    NUOVO_SFERA: true,
    SFERA: true,
    CAMPAGNE_COMMERCIALI: true,
    GED_GESTIONE_DOCUMENTALE: true
}

before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
            // Profiling Emetti polizza
            cy.getProfiling(data.tutf).then(profiling => {
                cy.filterProfile(profiling, 'COMMON_ULTRA_BMP').then(profiled => { keys.BMPenabled = profiled })
                cy.filterProfile(profiling, 'COMMON_ULTRAPMI').then(profiled => { keys.UltraImpresaEnabled = profiled })
                cy.filterProfile(profiling, 'AUTO_PREVENTIVO').then(profiled => { keys.PreventivoMotorEnabled = profiled })
                cy.filterProfile(profiling, 'COMMON_ULTRAS').then(profiled => { keys.UltraSaluteEnabled = profiled })
                cy.filterProfile(profiling, 'COMMON_ULTRA').then(profiled => { keys.UltraUltraCasaPatrimonioEnabled = profiled })
                cy.filterProfile(profiling, 'COMMON_ALLIANZ1_BUSINESS').then(profiled => { keys.Allianz1BusinessEnabled = profiled })
                cy.filterProfile(profiling, 'COMMON_FASTQUOTE_IMPRESA_SICURA').then(profiled => { keys.FasquoteImpresaAlbergoEnabled = profiled })
                cy.filterProfile(profiling, 'AUTO_PREVENTIVO').then(profiled => { keys.FlotteConvenzioniEnabled = profiled })
                cy.filterProfile(profiling, 'VITA_PREVENTIVAZIONE_ANONIMA').then(profiled => { keys.PreventivoAnonimoVitaenabled = profiled })
                cy.filterProfile(profiling, 'COMMON_MINIFLOTTE').then(profiled => { keys.MiniflotteEnabled = profiled })
                cy.filterProfile(profiling, 'COMMON_TOOL_TRATTATIVE').then(profiled => { keys.TrattativeAutoCorporateEnabled = profiled })
            })

            //Profiling collegamenti rapidi
            cy.getProfiling(data.tutf).then(profiling => {
                cy.filterProfile(profiling, 'COMMON_GESTIONE_MONITORAGGIO_PROPOSTE').then(profiled => { keys.MONITORAGGIO_POLIZZE_PROPOSTE = profiled })
                cy.filterProfile(profiling, 'COMMON_OFFERTA_PREVENTIVI').then(profiled => { keys.RECUPERO_PREVENTIVI_QUOTAZIONI = profiled })
                cy.filterProfile(profiling, 'COMMON_GESTIONE_SCADENZE').then(profiled => { keys.NUOVO_SFERA = profiled })
                cy.filterProfile(profiling, 'COMMON_GESTIONE_SCADENZE').then(profiled => { keys.SFERA = profiled })
                cy.filterProfile(profiling, 'RUOLO_CAMPAIGN').then(profiled => { keys.CAMPAGNE_COMMERCIALI = profiled })
                cy.filterProfile(profiling, 'COMMON_GED').then(profiled => { keys.GED_GESTIONE_DOCUMENTALE = profiled })

            })
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
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


describe('Matrix Web : Navigazioni da Sales', function () {

    it('Verifica aggancio Sales', function () {
        TopBar.clickSales()
    })

    it('Verifica presenza dei collegamenti rapidi', function () {
        TopBar.clickSales()
        Sales.checkExistLinksCollegamentiRapidi(keysRapidi)
    })

    it('Verifica aggancio Nuovo Sfera', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.clickLinkRapido('Nuovo Sfera')
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica Refresh Quietanzamento', function () {
        TopBar.clickSales()
        Sales.checkRefreshQuietanzamento()
    })

    if (!Cypress.env('isAviva'))
        it('Verifica aggancio Sfera', function () {
            TopBar.clickSales()
            Sales.clickLinkRapido('Sfera')
            Sales.backToSales()
        })

    it('Verifica aggancio Campagne Commerciali', function () {
        if (!keys.CAMPAGNE_COMMERCIALI)
            this.skip()
        TopBar.clickSales()
        Sales.clickLinkRapido('Campagne Commerciali')
        Sales.backToSales()
    })

    it('Verifica ASSENZA Campagne Commerciali', function () {
        if (!Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        Sales.checkNotExistLink('a', 'Campagne Commerciali')
        Sales.backToSales()
    })

    it('Verifica ASSENZA Sfera', function () {
        if (!Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        Sales.checkNotExistLink('a', /^Sfera$/)
        Sales.backToSales()
    })

    it('Verifica ASSENZA GED – Gestione Documentale', function () {
        if (!Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        Sales.checkNotExistLink('a', 'GED – Gestione Documentale')
        Sales.backToSales()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Recupero preventivi e quotazioni')
        Sales.backToSales()
    })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Monitoraggio Polizze Proposte')
        Sales.backToSales()
    })

    it('Verifica la presenza dei link su "Emetti Polizza"', function () {
        TopBar.clickSales()
        Sales.checkLinksOnEmettiPolizza(keys)
    })

    it('Verifica aggancio Emetti Polizza - Preventivo Motor', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
        Sales.backToSales()
    })


    //TODO: Implement profiling keys for Emmetti Polizza
    https://github.developer.allianz.io/az-italy/matrix-web-fe-tests/issues/65
    if (Cypress.env('isAviva')) {
        it('Verifica aggancio Emetti Polizza - Ultra Salute', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Ultra Salute')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Ultra Casa e Patrimonio', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Ultra Casa e Patrimonio')
            Sales.backToSales()
        })
    }
    else {

        it('Verifica aggancio Emetti Polizza - Allianz Ultra Salute', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Salute')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio')
            Sales.backToSales()
        })


        it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio BMP', function () {
            if (!keys.BMPenabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio BMP')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Allianz Ultra Impresa', function () {
            if (!keys.UltraImpresaEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Impresa')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Allianz1 Business', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz1 Business')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - FastQuote Impresa e Albergo', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('FastQuote Impresa e Albergo')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Flotte e Convenzioni', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Flotte e Convenzioni')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Preventivo anonimo Vita Individuali', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Preventivo anonimo Vita Individuali')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - MiniFlotte', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('MiniFlotte')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Trattative Auto Corporate', function () {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Trattative Auto Corporate')
            Sales.backToSales()
        })
    }

    it('Verifica tab "Pezzi"', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.checkExistPezzi()
        } else this.skip()
    })

    it('Verifica tab "Premi"', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.checkExistPremi()
        } else this.skip()
    })

    it('Verifica aggancio Attività in scadenza - Estrai dettaglio', function () {
        if (Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        if (!Cypress.env('monoUtenza')) {
            Sales.clickAttivitaInScadenza()
        }
        Sales.clickEstraiDettaglio()
        Sales.backToSales()
    })


    it('Verifica "Quietanzamento" - lob di interesse: Motor', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.lobDiInteresse('Motor').then((checkEnabled) => {
                if (!checkEnabled)
                    this.skip()
            })
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Rami Vari', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.lobDiInteresse('Rami vari').then((checkEnabled) => {
                if (!checkEnabled)
                    this.skip()
            })
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Vita', function () {
        if (Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Vita').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
        })
        Sales.backToSales()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Tutte', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.lobDiInteresse('Tutte').then((checkEnabled) => {
                if (!checkEnabled)
                    this.skip()
            })
            Sales.backToSales()
        } else this.skip()
    })


    it('Verifica TAB: "Campagne"', function () {
        if (!keys.CAMPAGNE_COMMERCIALI)
            this.skip()
        TopBar.clickSales()
        Sales.clickTabCampagne()
    })

    it('Verifica ASSENZA TAB: CAMPAGNE', function () {
        if (!Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        Sales.checkNotExistLink('button[role="tab"]', 'CAMPAGNE')
        Sales.backToSales()
    })

    it('Verifica aggancio Appuntamento', function () {
        TopBar.clickSales()
        Sales.clickAppuntamento()
    })
    it('Verifica aggancio Preventivi e quotazioni - Card Danni', function () {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabDanni()
        Sales.clickPrimaCardDanniOnPreventivo()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni Danni - button: Vedi Tutti', function () {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabDanni()
        Sales.clickButtonVediTutti()
        Sales.backToSales()
    })

    if (!Cypress.env('isAviva')) {

        it('Verifica aggancio Preventivi e quotazioni - Card Vita', function () {
            TopBar.clickSales()
            Sales.clickPreventiviQuotazioniOnTabVita()
            Sales.clickPrimACardVitaOnPreventivo()
            Sales.backToSales()
        })
        it('Verifica aggancio Preventivi e quotazioni Vita - button: Vedi Tutti', function () {
            TopBar.clickSales()
            Sales.clickPreventiviQuotazioniOnTabVita()
            Sales.clickButtonVediTutti()
            Sales.backToSales()
        })
    } else
        it('Verifica Tab Vita su Preventivi e quotazioni non sia presente', function () {
            TopBar.clickSales()
            Sales.checkNotExistTabVitaOnPreventiviQuot()
        })


    it('Verifica aggancio Proposte Danni - Card Danni', function () {
        TopBar.clickSales()
        Sales.clickTabDanniOnProposte()
        Sales.clickPrimaCardDanniOnProposte()
        Sales.backToSales()
    })

    it('Verifica aggancio Proposte Danni - button: Vedi Tutte', function () {
        TopBar.clickSales()
        Sales.clickTabDanniOnProposte()
        Sales.clickButtonVediTutte()
        Sales.backToSales()
    })

    if (!Cypress.env('isAviva')) {
        it('Verifica aggancio Proposte Vita - Card Vita', function () {
            TopBar.clickSales()
            Sales.clickTabVitaOnProposte()
            Sales.clickPrimaCardVitaOnProposte()
            Sales.backToSales()
        })

        it('Verifica aggancio Proposte Vita - button: Vedi Tutte', function () {
            TopBar.clickSales()
            Sales.clickTabVitaOnProposte()
            Sales.clickButtonVediTutte()
            Sales.backToSales()
        })
    } else
        it('Verifica Tab Vita su Proposte non sia presente', function () {
            TopBar.clickSales()
            Sales.checkNotExistTabVitaOnProposte()
        })

});
