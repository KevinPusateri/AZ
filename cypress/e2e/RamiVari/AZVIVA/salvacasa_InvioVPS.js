///<reference types="cypress"/>

//#region imports
import Common from "../../../mw_page_objects/common/Common"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
import SceltaProdotto from "../../../mw_page_objects/da/sceltaProdotto"
import DatiInformativi from "../../../mw_page_objects/da/datiInformativi"
import Garanzie from "../../../mw_page_objects/da/garanzie"
import Incasso from "../../../mw_page_objects/UltraBMP/Incasso"

import emissione from '../../../fixtures/SchedaCliente/menuEmissione.json'
import prodotti from '../../../fixtures/DA/prodotti.json'
import PersonaFisica from "../../../mw_page_objects/common/PersonaFisica"
import 'cypress-iframe';
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
const dbPolizze = Cypress.env('db_da')
let insertedId
//#endregion

//#region Configuration
const moment = require('moment')
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali DA431AB / bg523fc
let prodotto = prodotti.Patrimonio.CasaFabbricati.Salvacasa
let ramo = "Rami Vari"
let ambiente = Cypress.env('currentEnv')

let cliente = PersonaFisica.ValeriaGiordani()
let indirizzoCliente = cliente.via + " "
    + cliente.numero + " - "
    + cliente.cap + " "
    + cliente.citta + " (" + cliente.provincia + ")"
let fonte = "CASERZA LAURA"

let locali = [
    ["Somma assicurata", "250,000"],
    ["Tipo di assicurazione", "Valore Intero"],
    ["Franchigia", "150,00"]
]

var nContratto = "000"
//#endregion variabili iniziali

//#region beforeAfter
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced({
            "agency": "140001519",
            "agentId": "AAMCASALEGNO"
        }
        )
    })
})

beforeEach(() => {
    cy.preserveCookies()
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

/* afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        TopBar.logOutMW()
        //#region Mysql
        cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion
        Cypress.runner.stop();
    }
}) */
//#endregion beforeAfter

describe("SALVACASA - INVIO PREVENTIVO IN VPS", () => {
    it("Ricerca cliente", () => {
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
            cy.get('lib-client-item').first().click()
        }).then(($body) => {
            cy.wait(7000)
            const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            //const check = cy.get('div[class="client-null-message"]').should('be.visible')
            cy.log('permessi: ' + check)
            if (check) {
                cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })
    })

    it("Selezione prodotto e apertura DA", () => {
        SintesiCliente.Emissione(emissione.RamiVari.Emissione.PolizzaNuova)
        Common.canaleFromPopup()

        SceltaProdotto.caricamentoPagina()
    })

    it("Scelta Prodotto", () => {
        SceltaProdotto.sceltaProdotto(prodotto)
        SceltaProdotto.cambiaFonte(fonte)
        SceltaProdotto.avanti()
        SceltaProdotto.caricamentoPagina()
    })

    it("Dati Informativi", () => {
        //DatiInformativi.caricamentoPagina()
        DatiInformativi.completaDati("FABBRICATO")
        DatiInformativi.completaDati("CIVILE", "Danni ad altri - Vita Privata")
        DatiInformativi.completaDati("TUTELA LEGALE", "Casa Famiglia e Lavoro")
        DatiInformativi.dichiarazioniContraente(false, false, false)
        SceltaProdotto.avanti()
        SceltaProdotto.caricamentoPagina()
    })

    it("Garanzie - parte 1", () => {
        let dettagliEdificio = [
            "Proprietario",
            false,
            "Dimora abituale",
            "Appartamento",
            "2",
            false,
            "100",
            true,
            true,
            false]

        Garanzie.popupAnagFabbricato(indirizzoCliente)
        Garanzie.datiInformativiFabbricato(dettagliEdificio)
    })

    it("Garanzie - parte 2", () => {        
        Garanzie.aggiungiGaranzia("DANNI AI LOCALI", locali)
    })

    it("Fine", () => {
        cy.pause()
    })
})