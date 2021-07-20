/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Common from "../../mw_page_objects/common/Common"

Cypress.config('defaultCommandTimeout', 60000)

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region  Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
    TopBar.search('Pulini Francesco')
    SintesiCliente.wait()
})

after(() => {
    TopBar.logOutMW()
})

describe('Matrix Web : Navigazioni da Scheda Cliente - Tab Sintesi Cliente', function () {

    it('Navigation Scheda Cliente', function () {
        SintesiCliente.checkTabs()
    })

    it('Verifica Situazione cliente', function () {
        SintesiCliente.checkSituazioneCliente()
    })

    it('Verifica FastQuote: Tab Utra - subTabs Casa e Patrimonio, Salute', function () {
        SintesiCliente.checkFastQuoteUltra()
    })

    it('Verifica FastQuote: Tab Auto', function () {
        SintesiCliente.checkFastQuoteAuto()
    })

    it('Verifica FastQuote: Tab Albergo', function () {
        SintesiCliente.checkFastQuoteAlbergo()
    })

    it('Verifica le Cards Emissioni', function () {
        SintesiCliente.checkCardsEmissioni()
    })

    context('Auto', () => {
        it('Verifica Link Auto', function () {

        })

        it('Verifica Card Auto: Emissione -> Preventivo Motor', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickPreventivoMotor()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Emissione -> Flotte e Convenzioni', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickFlotteConvenzioni()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Assunzione Guidata', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickAssunzioneGuidata()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Veicoli d\'epoca durata 10 giorni', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickVeicoliEpoca()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Libri matricola', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickLibriMatricola()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD al Chilometro', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDChilometro()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Giornata', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDGiornata()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Veicolo', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDVeicolo()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Polizza aperta(base)', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickPolizzaBase()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Coassicurazione', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickCoassicurazione()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Passione Blu -> Nuova polizza', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizza()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Passione Blu -> Nuova polizza guidata', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizzaGuidata()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Passione Blu -> Nuova polizza Coassicurazione', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizzaCoassicurazione()
            SintesiCliente.back()
        })
    })

    context('Rami Vari', () => {

        it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraCasaPatrimonio()
            SintesiCliente.back()
        })

        it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio BMP', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraCasaPatrimonioBMP()
            SintesiCliente.back()
        })


        it('Verifica Card Rami Vari: Allianz Ultra Salute', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraSalute()
            SintesiCliente.back()
        })

        it('Verifica Card Rami Vari: Allianz1 Business', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianz1Business()
            SintesiCliente.back()
        })

        it('Verifica Card Rami Vari: FastQuote Universo Salute', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteUniversoSalute()
            SintesiCliente.back()
        })
        it('Verifica Card Rami Vari: FastQuote Infortuni Da Circolazione', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteInfortuniDaCircolazione()
            SintesiCliente.back()
        })


        it('Verifica Card Rami Vari: FastQuote Impresa Sicura', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteImpresaSicura()
            SintesiCliente.back()
        })

        it('Verifica Card Rami Vari: FastQuote Albergo', function () {
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
    })

    context('Vita', () => {

        it('Verifica Card Vita: Accedi al servizio di consulenza', function () {
            SintesiCliente.clickVita()
            SintesiCliente.clickSevizioConsulenza()
            SintesiCliente.back()
        })
    })

    it('Verifica Contratti in evidenza', function () {
        SintesiCliente.checkContrattiEvidenza()
        SintesiCliente.back()
    })
})