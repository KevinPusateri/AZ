/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import HomePage from "../../mw_page_objects/common/HomePage"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


let keysRamivari = {
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: true,
    ALLIANZ_ULTRA_SALUTE: true,
    ALLIANZ_ULTRA_IMPRESA: true,
    ALLIANZ1_BUSINESS: true,
    FASQUOTE_UNIVERSO_PERSONA: true,
    FASTQUOTE_UNIVERSO_SALUTE: true,
    FASTQUOTE_INFORTUNI_CIRCOLAZIONE: true,
    FASQUOTE_IMPRESA_SICURA: true,
    FASQUOTE_ALBERGO: true,
    GESTIONE_GRANDINE: true,
}

let keysAuto = {
    PREVENTIVO_MOTOR: true,
    FLOTTE_CONVENZIONI: true,
    SAFE_DRIVE_AUTOVETTURE: false,
    ASSUNZIONE_GUIDATA: true,
    VEICOLI_EPOCA: true,
    LIBRI_MATRICOLA: true,
    KASKO_ARD_CHILOMETRO: true,
    KASKO_ARD_GIORNATA: true,
    KASKO_ARD_VEICOLO: true,
    POLIZZA_BASE: true,
    COASSICURAZIONE: true,
    PASSIONE_BLU: true,
    NUOVA_POLIZZA: true,
    NUOVA_POLIZZA_GUIDATA: true,
    NUOVA_POLIZZA_COASSICURAZIONE: true
}

let keysCards = {
    AUTO: true,
    RAMIVARI: true,
    VITA: true
}

before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()

            // CARDS 
            if (!Cypress.env('internetTesting'))
                cy.getProfiling(data.tutf).then((profiling) => {

                    // AUTO
                    // AUTO_PREVENTIVO && AUTO_RISCHIO_NUOVO
                    cy.filterProfile(profiling, 'AUTO_PREVENTIVO').then(profiledCase1 => {
                        cy.filterProfile(profiling, 'AUTO_RISCHIO_NUOVO').then(profiledCase2 => {
                            if (profiledCase1 && profiledCase2)
                                keysCards.AUTO = true
                            else
                                keysCards.AUTO = false
                        })
                    })

                    // RAMI VARI
                    // (RV_PREVENTIVO && RV_RISCHIO_NUOVO) || RV_GESTIONE_GRANDINE
                    cy.filterProfile(profiling, 'RV_PREVENTIVO').then(profiledCase1 => {
                        cy.filterProfile(profiling, 'RV_RISCHIO_NUOVO').then(profiledCase2 => {
                            if (profiledCase1 && profiledCase2)
                                keysCards.RAMIVARI = true
                            else
                                cy.filterProfile(profiling, 'RV_GESTIONE_GRANDINE').then(profiled => {
                                    keysCards.RAMIVARI = profiled
                                })
                        })

                    })

                    // VITA
                    // VITA_ASSUNZIONE && VITA_PREVENTIVAZIONE
                    cy.filterProfile(profiling, 'VITA_ASSUNZIONE').then(profiledCase1 => {
                        cy.filterProfile(profiling, 'VITA_PREVENTIVAZIONE').then(profiledCase2 => {
                            if (profiledCase1 && profiledCase2)
                                keysCards.VITA = true
                            else
                                keysCards.VITA = false
                        })
                    })


                    // AUTO
                    if (keysCards.AUTO) {
                        cy.filterProfile(profiling, 'COMMON_MATRIX_MOTOR_ASSUNTIVO').then(profiled => { keysAuto.PREVENTIVO_MOTOR = profiled })
                        cy.filterProfile(profiling, 'COMMON_MATRIX_MOTOR_ASSUNTIVO').then(profiled => { keysAuto.FLOTTE_CONVENZIONI = profiled })
                        cy.filterProfile(profiling, 'COMMON_SAFE_DRIVE').then(profiled => { keysAuto.SAFE_DRIVE_AUTOVETTURE = profiled })
                        cy.filterProfile(profiling, 'AU_NAUTICA').then(profiled => { keysAuto.PASSIONE_BLU = profiled })
                        cy.filterProfile(profiling, 'AU_NAUTICA').then(profiled => { keysAuto.NUOVA_POLIZZA = profiled })
                        cy.filterProfile(profiling, 'AU_NAUTICA').then(profiled => {
                            if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
                                keysAuto.NUOVA_POLIZZA_GUIDATA = false
                            else
                                keysAuto.NUOVA_POLIZZA_GUIDATA = profiled
                        })
                        cy.filterProfile(profiling, 'AU_NAUTICA').then(profiled => { keysAuto.NUOVA_POLIZZA_COASSICURAZIONE = profiled })
                    }

                    // RAMI VARI
                    if (keysCards.RAMIVARI) {
                        cy.filterProfile(profiling, 'COMMON_ULTRACASA2022').then(profiled => { keysRamivari.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022 = profiled })
                        cy.filterProfile(profiling, 'COMMON_ULTRA').then(profiled => { keysRamivari.ALLIANZ_ULTRA_CASA_E_PATRIMONIO = profiled })
                        cy.filterProfile(profiling, 'COMMON_ULTRA_BMP').then(profiled => { keysRamivari.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP = profiled })
                        cy.filterProfile(profiling, 'COMMON_ULTRAPMI').then(profiled => { keysRamivari.ALLIANZ_ULTRA_IMPRESA = profiled })
                        cy.filterProfile(profiling, 'COMMON_ULTRAS').then(profiled => { keysRamivari.ALLIANZ_ULTRA_SALUTE = profiled })
                        cy.filterProfile(profiling, 'COMMON_ULTRAPMI_OLDPROD').then(profiled => { keysRamivari.ALLIANZ1_BUSINESS = profiled })
                        cy.filterProfile(profiling, 'COMMON_ULTRAS_OLDPROD').then(profiled => { keysRamivari.FASQUOTE_UNIVERSO_PERSONA = profiled })
                        cy.filterProfile(profiling, 'RV_PREVENTIVO_FAST_QUOTE').then(profiled => { keysRamivari.FASTQUOTE_UNIVERSO_SALUTE = profiled })
                        cy.filterProfile(profiling, 'RV_PREVENTIVO_FAST_QUOTE').then(profiled => { keysRamivari.FASTQUOTE_INFORTUNI_CIRCOLAZIONE = profiled })
                        cy.filterProfile(profiling, 'RV_PREVENTIVO_FAST_QUOTE').then(profiled => { keysRamivari.FASQUOTE_IMPRESA_SICURA = profiled })
                        cy.filterProfile(profiling, 'RV_PREVENTIVO_FAST_QUOTE').then(profiled => { keysRamivari.FASQUOTE_ALBERGO = profiled })
                        cy.filterProfile(profiling, 'RV_GESTIONE_GRANDINE').then(profiled => { keysRamivari.GESTIONE_GRANDINE = profiled })
                    }
                })
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    HomePage.reloadMWHomePage()
    if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
        TopBar.search('Pulini Francesco')
        SintesiCliente.wait()
    } else if (!Cypress.env('isAviva')) {
        TopBar.search('SLZNLL54A04H431Q')
        SintesiCliente.wait()
    } else if (!Cypress.env('isAvivaBroker')) { // Entra in Aviva
        TopBar.search('DRLTMS95L21F257R')
        SintesiCliente.wait()
    } else {
        TopBar.search('VLLNLN57T42B872A')// Entra in Aviva Broker
        SintesiCliente.wait()
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

describe('MW: Navigazioni Scheda Cliente -> Tab Sintesi Cliente', function () {

    it('Verifica i tab', function () {
        SintesiCliente.checkTabs()
    })

    it('Verifica Situazione cliente', function () {
        SintesiCliente.checkSituazioneCliente()
    })

    it('Verifica FastQuote: Tab Utra - subTabs', function () {
        SintesiCliente.checkFastQuoteUltra(keysRamivari)
    })

    it('Verifica FastQuote: Tab Auto', function () {
        SintesiCliente.checkFastQuoteAuto()
    })

    it('Verifica FastQuote: Tab Albergo', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            SintesiCliente.checkFastQuoteAlbergo()
        else this.skip()
    })

    it('Verifica le Cards Emissioni', function () {
        SintesiCliente.checkCardsEmissioni(keysCards)
    })

    it('Verifica Link da Card Auto', function () {
        if (!keysCards.AUTO)
            this.skip()
        SintesiCliente.clickAuto()
        SintesiCliente.checkLinksFromAuto(keysAuto)
    })

    it('Verifica Link da Card Auto -> Emissione', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.checkLinksFromAutoOnEmissione(keysAuto)
    })

    it('Verifica Link da Card Auto -> Prodotti particolari', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnProdottiParticolari(keysAuto)
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Prodotti particolari -> Kasko e ARD per Dipendenti in Missione', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnProdottiParticolariKasko()
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Prodotti particolari -> Polizza aperta', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnProdottiParticolariPolizzaAperta()
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Passione BLU', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnPassioneBlu()
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Natanti(AVIVA)', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            cy.log('Test Per AVIVA')
            this.skip()
        }
        SintesiCliente.clickAuto()
        SintesiCliente.checkLinksFromAutoOnNatanti()
    })

    it('Verifica Link da Card Vita', function () {
        if (!keysCards.VITA)
            this.skip()
        // if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
        SintesiCliente.clickVita()
        SintesiCliente.checkLinksFromVita()
        // } else this.skip()
    })

    it('Verifica Card Auto: Emissione -> Preventivo Motor', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickPreventivoMotor()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Emissione -> Safe Drive Autovetture', function () {
        if (!keysAuto.SAFE_DRIVE_AUTOVETTURE)
            this.skip()
        SintesiCliente.clickAuto()
        SintesiCliente.clickSafeDriveAutovetture()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Emissione -> Flotte e Convenzioni', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickFlotteConvenzioni()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Assunzione Guidata', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickAssunzioneGuidata()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Veicoli d\'epoca durata 10 giorni', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickVeicoliEpoca()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Libri matricola', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickLibriMatricola()
            SintesiCliente.back()
        } else this.skip()
    })


    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD al Chilometro', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDChilometro()
            SintesiCliente.back()
        } else this.skip()

    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Giornata', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDGiornata()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Veicolo', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDVeicolo()
            SintesiCliente.back()
        } else this.skip()

    })

    it('Verifica Card Auto: Prodotti particolari -> Polizza aperta(base)', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickPolizzaBase()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Coassicurazione', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickCoassicurazione()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizza()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Natanti(AVIVA) -> Nuova polizza', function () {
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            this.skip()
        SintesiCliente.clickAuto()
        SintesiCliente.clickNuovaPolizza()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza guidata', function () {
        if (!keysAuto.NUOVA_POLIZZA_GUIDATA || Cypress.env('isAviva'))
            this.skip()
        SintesiCliente.clickAuto()
        SintesiCliente.clickNuovaPolizzaGuidata()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Natanti(AVIVA) -> Nuova polizza Coassicurazione', function () {
        if (!keysAuto.NUOVA_POLIZZA_COASSICURAZIONE || (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')))
            this.skip()
        SintesiCliente.clickAuto()
        SintesiCliente.clickNuovaPolizzaCoassicurazione()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza Coassicurazione', function () {
        if (!keysAuto.NUOVA_POLIZZA_COASSICURAZIONE || (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')))
            this.skip()
        SintesiCliente.clickAuto()
        SintesiCliente.clickNuovaPolizzaCoassicurazione()
        SintesiCliente.back()
    })


    it('Verifica Link da Card Rami vari', function () {
        if (!keysCards.RAMIVARI)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.checkLinksFromRamiVari(keysRamivari)
    })

    it('Verifica Link da Card Rami Vari -> Emissione', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.checkLinksFromRamiVariOnEmissione()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio 2022', function () {
        if (!keysRamivari.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraCasaPatrimonio2022()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio', function () {
        if (!keysRamivari.ALLIANZ_ULTRA_CASA_E_PATRIMONIO)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraCasaPatrimonio()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio BMP', function () {
        if (!keysRamivari.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraCasaPatrimonioBMP()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Salute', function () {
        if (!keysRamivari.ALLIANZ_ULTRA_SALUTE)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraSalute()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz1 Business', function () {
        if (!keysRamivari.ALLIANZ1_BUSINESS)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianz1Business()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: FastQuote Universo Salute', function () {
        if (!keysRamivari.FASTQUOTE_UNIVERSO_SALUTE)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteUniversoSalute()
        SintesiCliente.back()
    })
    it('Verifica Card Rami Vari: FastQuote Infortuni Da Circolazione', function () {
        if (!keysRamivari.FASTQUOTE_INFORTUNI_CIRCOLAZIONE)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteInfortuniDaCircolazione()
        SintesiCliente.back()
    })


    it('Verifica Card Rami Vari: FastQuote Impresa Sicura', function () {
        if (!keysRamivari.FASQUOTE_IMPRESA_SICURA)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteImpresaSicura()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: FastQuote Albergo', function () {
        if (!keysRamivari.FASQUOTE_ALBERGO)
            this.skip()
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteAlbergo()
        SintesiCliente.back()
    })

    //TODO: canale + new window -> trovare un modo
    // it('Verifica Card Rami Vari: Gestione Grandine', function () {
    //     SintesiCliente.clickRamiVari()
    //     SintesiCliente.clickGestioneGrandine()
    //     SintesiCliente.back()
    // })


    it('Verifica Card Rami Vari: Emissione - Polizza Nuova', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickPolizzaNuova()
        SintesiCliente.back()
    })

    it('Verifica Card Vita: Accedi al servizio di consulenza', function () {
        if (!keysCards.VITA)
            this.skip()
        SintesiCliente.clickVita()
        SintesiCliente.clickSevizioConsulenza()
        SintesiCliente.back()
    })

    it('Verifica Contratti in evidenza', function () {
        if (!keysCards.VITA)
            this.skip()
        SintesiCliente.checkContrattiEvidenza()
        SintesiCliente.back()
    })

})