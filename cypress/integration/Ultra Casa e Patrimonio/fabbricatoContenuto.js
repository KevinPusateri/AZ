///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"

import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import 'cypress-iframe';
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali
let cliente = PersonaFisica.GalileoGalilei()
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato,
ambitiUltra.ambitiUltraCasaPatrimonio.contenuto]
var frazionamento = "annuale"
let nuovoCliente;
let iFrameUltra = '[class="iframe-content ng-star-inserted"]'
let iFrameFirma = '[id="iFrameResizer0"]'
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

describe("FABBRICATO E CONTENUTO ", () => {
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

    it("Selezione ambiti FastQuote", () => {
        SintesiCliente.FQ_tabUltra('Casa e Patrimonio')

        for (var i = 0; i < ambiti.length; i++) {
            cy.get('app-ultra-parent-tabs').find('nx-icon[class*="' + ambiti[i] + '"]')
                .should('be.visible').click()
        }

        cy.get('span').contains('Calcola').click({ force: true })
        cy.get('lib-format-numbers').should('be.visible')
        cy.get('lib-da-link[calldaname$="Configura"]').should('be.visible').click()

        Common.canaleFromPopup()
        Dashboard.caricamentoDashboardUltra()
    })

    it("Verifica selezione ambiti su home Ultra Casa e Patrimonio", () => {
        Dashboard.verificaAmbiti(ambiti)
    })

    it("Seleziona fonte", () => {
        Dashboard.selezionaFonteRandom()
    })

    it("Seleziona frazionamento", () => {
        Dashboard.selezionaFrazionamento(frazionamento)
    })

    it("Modifica soluzione per Fabbricato", () => {
        Dashboard.modificaSoluzione(ambiti[0], 'Top')
    })

    it("Configurazione Contenuto e procedi", () => {
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[1])
        ConfigurazioneAmbito.selezionaSoluzione("Premium")
        ConfigurazioneAmbito.aggiungiGaranzia("Danni da fenomeno elettrico")
        //ConfigurazioneAmbito.aggiungiGaranzia("Scippo e rapina")
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
    })

    it("Conferma dati quotazione", () => {
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Riepilogo ed emissione", () => {
        Riepilogo.EmissionePolizza()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
    })

    it("Censimento anagrafico", () => {
        CensimentoAnagrafico.censimentoAnagrafico(cliente.cognomeNome(), cliente.ubicazione())
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.selezionaTuttiNo()
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.confermaDichiarazioniContraente()
        ConsensiPrivacy.caricamentoPagina()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.Avanti()
        ControlliProtocollazione.caricamentoPagina()
    })

    it("salvataggio Contratto", () => {
        ControlliProtocollazione.salvataggioContratto()
    })

    it("Controlli e protocollazione - intermediario", () => {
        ControlliProtocollazione.inserimentoIntermediario()
        ControlliProtocollazione.intermediarioCollaborazioneOrizzontale()
    })

    it("Visualizza documenti e prosegui", () => {
        ControlliProtocollazione.riepilogoDocumenti()
        ControlliProtocollazione.Avanti()
        ControlliProtocollazione.aspettaCaricamentoAdempimenti()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliProtocollazione.stampaAdempimentiPrecontrattuali()
        ControlliProtocollazione.Incassa()
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
        Incasso.Chiudi()
    })
})