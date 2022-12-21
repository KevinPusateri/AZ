///<reference types="cypress"/>

//#region imports
//fixtures
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'
import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json'

//pages
import Common from "../../../mw_page_objects/common/Common"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import Portafoglio from "../../../mw_page_objects/clients/Portafoglio"
import Appendici from "../../../mw_page_objects/polizza/Appendici"

import Annullamenti from '../../../mw_page_objects/polizza/Annullamento'

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
let ricercaPolizza = "schedaCliente"
const moment = require('moment')
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali
let ambiente = Cypress.env('currentEnv')
let cliente = PersonaFisica.PieroAngela()
let prodotto = prodotti.RamiVari.FQ_InfortuniCircolazione
let veicolo = "Veicolo targato WD888WD"
let veicoloNuovo = "Ag675cl"
var appendice = "Sostituzione veicolo"
var idPolizza = "000"
var lastPolizza = "000"
//#endregion variabili iniziali

//#region beforeAfter
before(() => {
    cy.log("Ambiente: " + ambiente)
    cy.findLastPolizza(dbPolizze, prodotto[prodotto.length-1], false, ambiente).then((result) => {
        idPolizza = result[0].id
        lastPolizza = result[0].numero
        cy.log("id lastPolizza: " + idPolizza)
        cy.log("numero lastPolizza: " + lastPolizza)
    })

    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced({
            "agentId": "ARALONGO7",
            "agency": "010375000"
        }
        )
    })
})

beforeEach(() => {
    cy.preserveCookies()
    cy.ignoreRequest()
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
//#endregion beforeAfter 502404460  lib-contracts-container tab-content-container

describe("APPENDICE SOSTITUZIONE VEICOLO", () => {
    it("Ricerca polizza", () => {
        switch (ricercaPolizza) {
            case "schedaCliente":
                cy.get('body').within(() => {
                    cy.get('input[name="main-search-input"]').click()
                    cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
                    cy.get('lib-client-item').first()
                        .find('.name').trigger('mouseover').click()
                }).then(($body) => {
                    cy.wait(7000)
                    const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
                    if (check) {
                        cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
                        cy.get('lib-client-item').first().next().click()
                    }
                })

                Portafoglio.apriPortafoglioLite()
                cy.pause()
                Portafoglio.listaPolizze(true)
                break;

            case "ricercaDiretta":
                //cerca polizza
                cy.get('input[name="main-search-input"]').click()
                cy.get('input[name="main-search-input"]').type(lastPolizza).type('{enter}')

                //apre card polizza
                cy.get('lib-contract-card-search').first().should('be.visible')
                    .find("nx-icon").click()
                break;
        }
    })

    it("Apertura sezione Appendici", () => {
        switch (ricercaPolizza) {
            case "schedaCliente":
                Portafoglio.menuContrattoLista(lastPolizza, menuPolizzeAttive.appendici)
                break;

            case "ricercaDiretta":
                cy.get("lib-contract-search-context-menu").should('be.visible')
                    .children("nx-icon").click() //apre menù contestuale
                cy.get('[role="menu"][class^="nx-context-menu"]').find("button").contains(menuPolizzeAttive.appendici).click() //apre 'appendici' da menù contestuale
                break;
        }
        Common.canaleFromPopup()
        Appendici.caricamentoPagina()
    })

    it("Seleziona appendice per sostituzione veicolo", () => {
        Appendici.SelezionaAppendice(appendice)
        Appendici.Avanti()
        Appendici.caricamentoEdit()
        
    })

    it("Appendici dichiarative", () => {
        Appendici.VeicoloAssicurato(veicolo)
        Appendici.VeicoloSostitutivo(veicoloNuovo)
        Appendici.Conferma()
        Appendici.caricamentoDocumenti()
    })

    it("Appendice - Documenti", () => {
        Appendici.StampaDocumento()
        Appendici.InviaMail()
        Appendici.Home()
        Appendici.caricamentoNuoveAppendici()
    })

    it("Appendice - Verifica nuova appendice", () => {
        Appendici.VerificaNuoveAppendici("Sostituzione del veicolo assicurato")
        cy.registraAnnullamento(dbPolizze, idPolizza, lastPolizza, prodotto[prodotto.length-1])
    })
})