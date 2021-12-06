/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import HomePage from "../../mw_page_objects/common/HomePage"

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
    HomePage.reloadMWHomePage()
    if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva')) {
        TopBar.search('Pulini Francesco')
        SintesiCliente.wait()
    } else if (!Cypress.env('isAviva')) {
        TopBar.search('SLZNLL54A04H431Q')
        SintesiCliente.wait()
    } else {
        TopBar.search('DRNBRN44D25F537J')
        SintesiCliente.wait()
    }
})
after(function() {
    TopBar.logOutMW()
        //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion

})
describe('MW: Navigazioni Scheda Cliente -> Tab Sintesi Cliente', function() {

    it('Verifica i tab', function() {
        SintesiCliente.checkTabs()
    })

    it('Verifica Situazione cliente', function() {
        SintesiCliente.checkSituazioneCliente()
    })

    it('Verifica FastQuote: Tab Utra - subTabs', function() {
        SintesiCliente.checkFastQuoteUltra()
    })

    //! DA VEDERE ASSENTE AGENZIA SELECT
    it('Verifica FastQuote: Tab Auto', function() {
        SintesiCliente.checkFastQuoteAuto()
    })

    it('Verifica FastQuote: Tab Albergo', function() {
        if (!Cypress.env('isAviva'))
            SintesiCliente.checkFastQuoteAlbergo()
        else this.skip()
    })

    it('Verifica le Cards Emissioni', function() {
        SintesiCliente.checkCardsEmissioni()
    })

    it('Verifica Link da Card Auto', function() {
        SintesiCliente.clickAuto()
        SintesiCliente.checkLinksFromAuto()
    })

    it('Verifica Link da Card Auto -> Emissione', function() {
        SintesiCliente.clickAuto()
        SintesiCliente.checkLinksFromAutoOnEmissione()
    })

    it('Verifica Link da Card Auto -> Prodotti particolari', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnProdottiParticolari()
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Prodotti particolari -> Kasko e ARD per Dipendenti in Missione', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnProdottiParticolariKasko()
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Prodotti particolari -> Polizza aperta', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnProdottiParticolariPolizzaAperta()
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Passione BLU', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnPassioneBlu()
        } else this.skip()
    })

    it('Verifica Link da Card Auto -> Natanti(AVIVA)', function() {
        if (Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.checkLinksFromAutoOnNatanti()
        } else this.skip()
    })

    it('Verifica Link da Card Rami vari', function() {
        SintesiCliente.clickRamiVari()
        SintesiCliente.checkLinksFromRamiVari()
    })

    it('Verifica Link da Card Rami Vari -> Emissione', function() {
        SintesiCliente.clickRamiVari()
        SintesiCliente.checkLinksFromRamiVariOnEmissione()
    })

    it('Verifica Link da Card Vita', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickVita()
            SintesiCliente.checkLinksFromVita()
        } else this.skip()
    })

    it('Verifica Card Auto: Emissione -> Preventivo Motor', function() {
        SintesiCliente.clickAuto()
        SintesiCliente.clickPreventivoMotor()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Emissione -> Flotte e Convenzioni', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickFlotteConvenzioni()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Assunzione Guidata', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickAssunzioneGuidata()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Veicoli d\'epoca durata 10 giorni', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickVeicoliEpoca()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Libri matricola', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickLibriMatricola()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD al Chilometro', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDChilometro()
            SintesiCliente.back()
        } else this.skip()

    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Giornata', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDGiornata()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Veicolo', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDVeicolo()
            SintesiCliente.back()
        } else this.skip()

    })

    it('Verifica Card Auto: Prodotti particolari -> Polizza aperta(base)', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickPolizzaBase()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Prodotti particolari -> Coassicurazione', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickCoassicurazione()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizza()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Natanti(AVIVA) -> Nuova polizza', function() {
        if (Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizza()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza guidata', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizzaGuidata()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Natanti(AVIVA) -> Nuova polizza Coassicurazione', function() {
        if (Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizzaCoassicurazione()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza Coassicurazione', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizzaCoassicurazione()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraCasaPatrimonio()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio BMP', function() {
        if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraCasaPatrimonioBMP()
            SintesiCliente.back()
        } else this.skip()
    })


    it('Verifica Card Rami Vari: Allianz Ultra Salute', function() {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraSalute()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz1 Business', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianz1Business()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Rami Vari: FastQuote Universo Salute', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteUniversoSalute()
            SintesiCliente.back()
        } else this.skip()
    })
    it('Verifica Card Rami Vari: FastQuote Infortuni Da Circolazione', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteInfortuniDaCircolazione()
            SintesiCliente.back()
        } else this.skip()
    })


    it('Verifica Card Rami Vari: FastQuote Impresa Sicura', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteImpresaSicura()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Card Rami Vari: FastQuote Albergo', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteAlbergo()
            SintesiCliente.back()
        } else this.skip()
    })

    //TODO: canale + new window -> trovare un modo
    // it('Verifica Card Rami Vari: Gestione Grandine', function () {
    //     SintesiCliente.clickRamiVari()
    //     SintesiCliente.clickGestioneGrandine()
    //     SintesiCliente.back()
    // })

    it('Verifica Card Rami Vari: Emissione - Polizza Nuova', function() {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickPolizzaNuova()
        SintesiCliente.back()
    })

    it('Verifica Card Vita: Accedi al servizio di consulenza', function() {
        if (!Cypress.env('isAviva')) {
            SintesiCliente.clickVita()
            SintesiCliente.clickSevizioConsulenza()
            SintesiCliente.back()
        } else this.skip()
    })

    it('Verifica Contratti in evidenza', function() {
        SintesiCliente.checkContrattiEvidenza()
        SintesiCliente.back()
    })
})