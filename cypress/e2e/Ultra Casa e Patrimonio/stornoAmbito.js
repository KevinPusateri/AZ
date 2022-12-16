///<reference types="cypress"/>

//#region imports
//fixtures
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'

//pages
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import Annullamenti from '../../mw_page_objects/polizza/Annullamento'

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
let ricercaPolizza = "schedaCliente"
const moment = require('moment')
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali
let cliente = PersonaFisica.PieroAngela()
let prodotto = "Ultra Casa e Patrimonio 2022"
var ambitoStorno = ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato
var idPolizza = "000"
var lastPolizza = "000"
//#endregion variabili iniziali

//#region beforeAfter
before(() => {
    cy.findLastPolizza(dbPolizze, prodotto, false).then((result) => {
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

describe("STORNO AMBITO", () => {
    it("Ricerca polizza", () => {
        switch (ricercaPolizza) {
            case "schedaCliente":
                cy.get('body').within(() => {
                    cy.get('input[name="main-search-input"]').click().clear()
                    cy.get('input[name="main-search-input"]')
                        .clear()
                        .type(cliente.codiceFiscale).type('{enter}')

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
                //todo ricerca polizza per lista
                //Portafoglio.ordinaPolizze("Numero contratto")
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

    it("Apertura sezione Annullamenti", () => {
        switch (ricercaPolizza) {
            case "schedaCliente":
                Portafoglio.menuContrattoLista(lastPolizza, menuPolizzeAttive.mostraAmbiti)
                Portafoglio.menuContestualeAmbiti(ambitoStorno, "Annullamento")
                break;

            case "ricercaDiretta":
                cy.get("lib-contract-search-context-menu").should('be.visible')
                    .children("nx-icon").click() //apre menù contestuale
                cy.get('[role="menu"][class^="nx-context-menu"]').find("button").contains(menuPolizzeAttive.mostraAmbiti).click() //apre 'mostra ambiti' da menù contestuale
                cy.get('nx-modal-container[aria-label="Show Scopes Modal"]').find('nx-icon[class*="' + ambitoStorno + '"]')
                    .parents('div[class^="card"]').first().find('[name="ellipsis-h"]').click() //apre menù contestuale ambito
                cy.get("lib-da-link").find("button").contains("Annullamento").click() //seleziona 'annullamento'
                break;
        }
        Common.canaleFromPopup()
        Annullamenti.caricamentoAnnullamentiRV()
    })

    it("Tipo annullamento 'Cessato Rischio'", () => {
        Annullamenti.annullamentiRV("cessato rischio")
        Annullamenti.dataAnnullamento()
        Annullamenti.btnAnnullaContratto()
    })

    it("Popup documentazione richiesta", () => {
        Annullamenti.documentazioneComprovante()
    })

    it("Operazione completata", () => {
        Annullamenti.verificaAnnullamento()
        Annullamenti.confermaAppendice()
        cy.registraAnnullamento(dbPolizze, idPolizza, lastPolizza, prodotto)
    })

    it("Home", () => {
        Annullamenti.btnHome()
    })

    it("Verifica storno ambito", () => {
        //cerca polizza
        switch (ricercaPolizza) {
            case "schedaCliente":
                cy.get('body').within(() => {
                    cy.get('input[name="main-search-input"]').click().clear()
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
                //todo ricerca polizza per lista
                //Portafoglio.ordinaPolizze("Numero contratto")
                Portafoglio.listaPolizze(true)
                Portafoglio.menuContrattoLista(lastPolizza, menuPolizzeAttive.mostraAmbiti)
                break;

            case "ricercaDiretta":
                //cerca polizza
                cy.get('input[name="main-search-input"]').click()
                cy.get('input[name="main-search-input"]')
                    .clear()
                    .type(lastPolizza).type('{enter}')

                //apre card polizza
                cy.get('lib-contract-card-search').first().should('be.visible')
                    .find("nx-icon").click()

                cy.get("lib-contract-search-context-menu").should('be.visible')
                    .children("nx-icon").click() //apre menù contestuale
                cy.get('[role="menu"][class^="nx-context-menu"]').find("button").contains(menuPolizzeAttive.mostraAmbiti).click() //apre 'mostra ambiti' da menù contestuale
                break;
        }

        cy.get('nx-modal-container[aria-label="Show Scopes Modal"]').find('nx-icon[class*="' + ambitoStorno + '"]')
            .parents('div[class^="card"]').first().find("nx-badge").contains("ANNULLATO").should('be.visible') //verifica la presenza del badge 'ANNULLATO'

        //verifica l'assenza della voce "Annullamento" nel menù contestuale
        cy.get('nx-modal-container[aria-label="Show Scopes Modal"]').find('nx-icon[class*="' + ambitoStorno + '"]')
            .parents('div[class^="card"]').first().find('[name="ellipsis-h"]').click() //apre menù contestuale ambito
        cy.get("lib-da-link").contains('button', 'Annullamento').should('not.exist') //controlla voce

        cy.get('nx-modal-container[aria-label="Show Scopes Modal"]').find('nx-icon[name="close"]').click()
    })
})