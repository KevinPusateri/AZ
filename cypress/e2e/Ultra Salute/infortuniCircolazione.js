///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import FastquoteDA from "../../mw_page_objects/da/fastquoteDA"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"

import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json'
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
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

//#region  variabili iniziali
let prodotto = prodotti.RamiVari.FQ_InfortuniCircolazione
let ramo = "Rami Vari"
let ambiente = Cypress.env('currentEnv')

let cliente = PersonaFisica.PieroAngela()
var nContratto = "000"
//#endregion variabili iniziali

//#region beforeAfter
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
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

describe("INVALIDITA' PERMANENTE DA INFORTUNIO ", () => {
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
                cy.get('input[name="main-search-input"]').type(cliente).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })
    })

    it("Selezione prodotto e apertura DA", () => {
        SintesiCliente.Emissione(prodotto)
        Common.canaleFromPopup()

        FastquoteDA.caricamentoPagina()
    })

    it("Personalizzazione", () => {
        FastquoteDA.verificaAtterraggio(prodotto[prodotto.length - 1])
        FastquoteDA.avanti()
        FastquoteDA.confermaDati()
        FastquoteDA.caricamentoIntegrazione()
    })

    it("Integrazione - Dati Integrativi", () => {
        FastquoteDA.datiIntegrativiSiNo(true, false, false)
        FastquoteDA.datiIntegrativiParametro("100")
        FastquoteDA.avanti()
        //cy.pause()
        FastquoteDA.situazioneAssicurativa(false)
        FastquoteDA.caricamentoConsensi()
    })

    it("Consensi", () => {
        cy.wait(500)
        FastquoteDA.avanti()
        FastquoteDA.caricamentoFinale()
    })

    it("Finale", () => {
        FastquoteDA.salvaNumContratto()

        cy.get('@contratto').then(val => {
            nContratto = val
        })

        FastquoteDA.inserisciIntermediario("2039812 BINDA KETTY")
        FastquoteDA.visualizzaDocumenti()

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            FastquoteDA.avanti()
        })
        FastquoteDA.caricamentoProtocollazione()
    })

    it("Controlli e protocollazione", () => {
        FastquoteDA.stampa()
        FastquoteDA.incassa()
        Incasso.caricamentoPagina()
    })

    it("Incasso - parte 1", () => {
        Incasso.ClickIncassa()
        Incasso.caricamentoModPagamento()
    })

    it("Incasso - parte 2", () => {
        Incasso.SelezionaMetodoPagamento('Assegno')
        Incasso.ConfermaIncasso()
        Incasso.caricamentoEsito()
    })

    it("Esito incasso", () => {
        Incasso.EsitoIncasso()

        cy.SalvaPolizza(dbPolizze,
            cliente.nomeCognome(),
            nContratto,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss'),
            ramo,
            prodotto[prodotto.length-1],
            ambiente)

        Incasso.Chiudi()
    })
})