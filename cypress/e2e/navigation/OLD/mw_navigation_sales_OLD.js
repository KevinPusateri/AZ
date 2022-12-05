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
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

let today = new Date()
today.setDate(1)
today.setMonth(new Date().getMonth() - 1)
let dataInizio = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth())).slice(-2) + '/' + today.getFullYear()
today.setMonth(new Date().getMonth())
today.setDate(25)
let dataFine = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth())).slice(-2) + '/' + today.getFullYear()
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
    TrattativeAutoCorporateEnabled: true,
    SAFE_DRIVE_AUTOVETTURE: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022: true
}

let keysRapidi = {
    MONITORAGGIO_POLIZZE_PROPOSTE: true,
    RECUPERO_PREVENTIVI_E_QUOTAZIONI: true,
    NUOVO_SFERA: true,
    SFERA: true,
    CAMPAGNE_COMMERCIALI: true,
    GED_GESTIONE_DOCUMENTALE: true
}

let cluster = Sales.getCluster()
let azioniVeloci = Sales.getAzioniVeloci()

before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
            if (!Cypress.env('internetTesting')) {
                // Profiling Emetti polizza
                cy.getProfiling(data.tutf).then(profiling => {
                    cy.filterProfile(profiling, 'COMMON_ULTRA_BMP').then(profiled => { keys.BMPenabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_ULTRAPMI').then(profiled => { keys.UltraImpresaEnabled = profiled })
                    cy.filterProfile(profiling, 'AUTO_PREVENTIVO').then(profiled => { keys.PreventivoMotorEnabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_ULTRAS').then(profiled => { keys.UltraSaluteEnabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_ULTRA').then(profiled => { keys.UltraCasaPatrimonioEnabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_ULTRACASA2022').then(profiled => { keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022 = profiled })
                    cy.filterProfile(profiling, 'COMMON_ALLIANZ1_BUSINESS').then(profiled => { keys.Allianz1BusinessEnabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_FASTQUOTE_IMPRESA_SICURA').then(profiled => { keys.FasquoteImpresaAlbergoEnabled = profiled })
                    cy.filterProfile(profiling, 'AUTO_PREVENTIVO').then(profiled => { keys.FlotteConvenzioniEnabled = profiled })
                    cy.filterProfile(profiling, 'VITA_PREVENTIVAZIONE_ANONIMA').then(profiled => { keys.PreventivoAnonimoVitaenabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_MINIFLOTTE').then(profiled => { keys.MiniflotteEnabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_TOOL_TRATTATIVE').then(profiled => { keys.TrattativeAutoCorporateEnabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_SAFE_DRIVE').then(profiled => { keys.SAFE_DRIVE_AUTOVETTURE = profiled })
                })

                //Profiling collegamenti rapidi
                cy.getProfiling(data.tutf).then(profiling => {
                    cy.filterProfile(profiling, 'COMMON_GESTIONE_MONITORAGGIO_PROPOSTE').then(profiled => { keysRapidi.MONITORAGGIO_POLIZZE_PROPOSTE = profiled })
                    cy.filterProfile(profiling, 'COMMON_OFFERTA_PREVENTIVI').then(profiled => { keysRapidi.RECUPERO_PREVENTIVI_E_QUOTAZIONI = profiled })
                    cy.filterProfile(profiling, 'COMMON_GESTIONE_SCADENZE').then(profiled => { keysRapidi.NUOVO_SFERA = profiled })
                    cy.filterProfile(profiling, 'COMMON_GESTIONE_SCADENZE').then(profiled => { keysRapidi.SFERA = profiled })
                    cy.filterProfile(profiling, 'RUOLO_CAMPAIGN').then(profiled => { keysRapidi.CAMPAGNE_COMMERCIALI = profiled })
                    cy.filterProfile(profiling, 'COMMON_GED').then(profiled => { keysRapidi.GED_GESTIONE_DOCUMENTALE = profiled })
                })
            }
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

    it('Verifica Refresh Quietanzamento', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.selectFirstDay('1')
        Sales.checkRefreshQuietanzamento()
    })

    it('Verifica Filtro Quietanzamento', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.selectFirstDay('1')
        Sales.checkFiltriQuietanzamento()
    })

    it('Verifica Gestisci Preferiti Quietanzamento', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.selectFirstDay('1')
        Sales.checkGestisciPreferiti()
    })

    it('Verifica Carico Totale', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.selectFirstDay('1')
        Sales.checkCaricoEstratto()
        Sales.checkCaricoTotalePezzi()
        Sales.checkCaricoTotalePremi()
    })

    it('Verifica Azioni Veloci Motor', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Motor', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster()
            Sales.clickAzioniVeloci()
            Sales.checkAzioniVeloci()
            Sales.backToSales()
        })
    })

    it('Verifica Azioni Veloci Rami Vari', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Rami vari', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster()
            Sales.clickAzioniVeloci()
            Sales.checkAzioniVeloci()
            Sales.backToSales()
        })
    })

    it('Verifica Azioni Veloci Vita', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Vita', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster()
            Sales.clickAzioniVeloci()
            Sales.checkAzioniVeloci()
            Sales.backToSales()
        })
    })

    it('Verifica Azioni Veloci Tutte', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Tutte', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster()
            Sales.clickAzioniVeloci()
            Sales.checkAzioniVeloci()
            Sales.backToSales()
        })
    })

    it('Verifica Azioni Veloci: "Eliminazione Sconto Commerciale"', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Motor', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster(cluster.USCITE_ANIA)
            Sales.clickAzioniVeloci(cluster.USCITE_ANIA, azioniVeloci.ELIMINAZIONE_SCONTO_COMMERCIALE)
            Sales.backToSales()
        })
    });

    it('Verifica Azioni Veloci: "Verifica possibilità di incremento premio"', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Motor', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster(cluster.DELTA_PREMIO_NEGATIVO)
            Sales.clickAzioniVeloci(cluster.DELTA_PREMIO_NEGATIVO, azioniVeloci.VERIFICA_POSSIBILITA_DI_INCREMENTO_PREMIO)
            Sales.backToSales()
        })
    });

    it('Verifica Estrai', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Motor', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster(cluster.MODALITA_PAGAMENTO_DA_REMOTO)
            Sales.selectAltriCluster(cluster.MONOCOPERTI)
            Sales.checkEstraiModifiche([cluster.MODALITA_PAGAMENTO_DA_REMOTO, cluster.MONOCOPERTI])
            Sales.backToSales()
        })
    });

    it('Verifica Azioni Veloci: "Vai a vista Quietanzamento"', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Motor', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster(cluster.MODALITA_PAGAMENTO_DA_REMOTO)
            Sales.clickAzioniVeloci(cluster.PER_TUTTI_I_CLUSTER_SELEZIONATI, azioniVeloci.VAI_A_VISTA_QUIETANZAMENTO)
            Sales.backToSales()
        })
    });

    it('Verifica Azioni Veloci: "Assegna Colore"', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.lobDiInteresse('Motor', 'Azioni Veloci').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
            Sales.selectFirstDay('1')
            Sales.selectAltriCluster(cluster.MODALITA_PAGAMENTO_DA_REMOTO)
            Sales.clickAzioniVeloci(cluster.PER_TUTTI_I_CLUSTER_SELEZIONATI, azioniVeloci.ASSEGNA_COLORE)
            Sales.backToSales()
        })
    });

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

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
        it('Verifica aggancio Sfera', function () {
            TopBar.clickSales()
            Sales.clickLinkRapido('Sfera')
            Sales.backToSales()
        })

    it('Verifica aggancio Campagne Commerciali', function () {
        if (!keysRapidi.CAMPAGNE_COMMERCIALI)
            this.skip()
        TopBar.clickSales()
        Sales.clickLinkRapido('Campagne Commerciali')
        Sales.backToSales()
    })

    it('Verifica ASSENZA Sfera', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.checkNotExistLink('a', /^Sfera$/)
        Sales.backToSales()
    })

    it('Verifica ASSENZA GED – Gestione Documentale', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
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
        if (!keys.PreventivoMotorEnabled)
            this.skip()
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Safe Drive Autovetture', function () {
        if (!keys.SAFE_DRIVE_AUTOVETTURE)
            this.skip()
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Safe Drive Autovetture')
        Sales.backToSales()
    })

    if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) {
        it('Verifica aggancio Emetti Polizza - Ultra Salute', function () {
            if (!keys.UltraSaluteEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Ultra Salute')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Ultra Casa e Patrimonio', function () {
            if (!keys.UltraCasaPatrimonioEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Ultra Casa e Patrimonio')
            Sales.backToSales()
        })
    }
    else {

        it('Verifica aggancio Emetti Polizza - Allianz Ultra Salute', function () {
            if (!keys.UltraSaluteEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Salute')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio', function () {
            if (!keys.UltraCasaPatrimonioEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio 2022', function () {
            if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio 2022')
            Sales.backToSales()
        })

        //! Fino a settembre non funzionerà
        it.skip('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio BMP', function () {
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
            if (!keys.Allianz1BusinessEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz1 Business')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - FastQuote Impresa e Albergo', function () {
            if (!keys.FasquoteImpresaAlbergoEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('FastQuote Impresa e Albergo')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Flotte e Convenzioni', function () {
            if (!keys.FlotteConvenzioniEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Flotte e Convenzioni')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Preventivo anonimo Vita Individuali', function () {
            if (!keys.PreventivoAnonimoVitaenabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Preventivo anonimo Vita Individuali')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - MiniFlotte', function () {
            if (!keys.MiniflotteEnabled)
                this.skip()
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('MiniFlotte')
            Sales.backToSales()
        })

        it('Verifica aggancio Emetti Polizza - Trattative Auto Corporate', function () {
            if (!keys.TrattativeAutoCorporateEnabled)
                this.skip()
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
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
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
            Sales.setDateEstrazione(dataInizio, dataFine)
            Sales.lobDiInteresse('Motor', 'Estrai').then((checkEnabled) => {
                if (!checkEnabled)
                    this.skip()
            })
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Rami Vari', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.setDateEstrazione(dataInizio, dataFine)
            Sales.lobDiInteresse('Rami vari', 'Estrai').then((checkEnabled) => {
                if (!checkEnabled)
                    this.skip()
            })
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Vita', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()
        TopBar.clickSales()
        Sales.setDateEstrazione(dataInizio, dataFine)
        Sales.lobDiInteresse('Vita', 'Estrai').then((checkEnabled) => {
            if (!checkEnabled)
                this.skip()
        })
        Sales.backToSales()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Tutte', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.setDateEstrazione(dataInizio, dataFine)
            Sales.lobDiInteresse('Tutte', 'Estrai').then((checkEnabled) => {
                if (!checkEnabled)
                    this.skip()
            })
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica TAB: "Campagne"', function () {
        if (!keysRapidi.CAMPAGNE_COMMERCIALI)
            this.skip()
        TopBar.clickSales()
        Sales.clickTabCampagne()
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

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {

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

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
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
