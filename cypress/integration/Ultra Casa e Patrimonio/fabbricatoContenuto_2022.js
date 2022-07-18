///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import Dashboard2022 from "../../mw_page_objects/casaPatrimonio2022/Dashboard2022"
import ConfigurazioneAmbito2022 from "../../mw_page_objects/casaPatrimonio2022/ConfigurazioneAmbito2022"
import DatiQuotazione2022 from "../../mw_page_objects/casaPatrimonio2022/DatiQuotazione2022"
import Riepilogo2022 from "../../mw_page_objects/casaPatrimonio2022/Riepilogo2022"
import CensimentoAnagrafico2022 from "../../mw_page_objects/casaPatrimonio2022/CensimentoAnagrafico2022"
import Vincoli2022 from "../../mw_page_objects/polizza/Vincoli"
import DatiIntegrativi2022 from "../../mw_page_objects/casaPatrimonio2022/DatiIntegrativi2022"
import CondividiPreventivo2022 from "../../mw_page_objects/casaPatrimonio2022/CondividiPreventivo2022"
import ConsensiPrivacy2022 from "../../mw_page_objects/casaPatrimonio2022/ConsensiPrivacy2022"
import ControlliProtocollazione2022 from "../../mw_page_objects/casaPatrimonio2022/ControlliProtocollazione2022"
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
var frazionamento = "Annuale"
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

describe("FABBRICATO E CONTENUTO 2022", () => {
    it("Ricerca cliente", () => {
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
            cy.pause()
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
        SintesiCliente.FQ_tabUltra('Casa e Patrimonio 2022')

        for (var i = 0; i < ambiti.length; i++) {
            cy.get('app-ultra-fast-quote-2022').find('nx-icon[class*="' + ambiti[i] + '"]')
                .should('be.visible').click()
        }

        cy.get('span').contains('Calcola').click({ force: true })
        cy.get('lib-format-numbers').should('be.visible')
        cy.get('lib-da-link[calldaname$="Configura"]').should('be.visible').click()

        Common.canaleFromPopup()
        Dashboard2022.caricamentoDashboardUltra()
    })

    it("Verifica selezione ambiti su home Ultra Casa e Patrimonio", () => {
        Dashboard2022.verificaAmbiti(ambiti)
    })

    it("Seleziona fonte", () => {
        Dashboard2022.selezionaFonteRandom()
    })

    it("Seleziona frazionamento", () => {
        Dashboard2022.selezionaFrazionamento(frazionamento)
    })

    it("Modifica soluzione per Fabbricato", () => {
        Dashboard2022.modificaSoluzione(ambiti[0], 'Top')
    })

    it("Configurazione Contenuto e procedi", () => {
        ConfigurazioneAmbito2022.apriConfigurazioneAmbito(ambiti[1])
        ConfigurazioneAmbito2022.selezionaSoluzione("Premium")
        ConfigurazioneAmbito2022.aggiungiGaranzia("Danni da fenomeno elettrico")
        //ConfigurazioneAmbito2022.aggiungiGaranzia("Scippo e rapina")
        ConfigurazioneAmbito2022.ClickButton("CONFERMA")
        Dashboard2022.procediHome()
        DatiQuotazione2022.CaricamentoPagina()
    })

    it("Conferma dati quotazione", () => {
        DatiQuotazione2022.confermaDatiQuotazione()
        Riepilogo2022.caricamentoRiepilogo()
    })

    it("Riepilogo ed emissione", () => {
        Riepilogo2022.EmissionePolizza()
        CensimentoAnagrafico2022.caricamentoCensimentoAnagrafico()
    })

    it("Censimento anagrafico", () => {
        CensimentoAnagrafico2022.censimentoAnagrafico(cliente.cognomeNome(), cliente.ubicazione())
        CensimentoAnagrafico2022.Avanti()
        DatiIntegrativi2022.caricamentoPagina()
    })

    it("Dati integrativi", () => {
        //todo dati integrativi 2022 non cambia
        DatiIntegrativi2022.selezionaTuttiNo()
        DatiIntegrativi2022.ClickButtonAvanti()
        DatiIntegrativi2022.confermaDichiarazioniContraente()
        ConsensiPrivacy2022.caricamentoPagina()
    })

    it("Consensi e privacy", () => {
        //todo 2022 non cambia
        ConsensiPrivacy2022.Avanti()
        ControlliProtocollazione2022.caricamentoPagina()
    })

    it("salvataggio Contratto", () => {
        ControlliProtocollazione2022.salvataggioContratto()
    })

    it("Controlli e protocollazione - intermediario", () => {
        //todo 2022 noncambia
        ControlliProtocollazione2022.inserimentoIntermediario()
        ControlliProtocollazione2022.intermediarioCollaborazioneOrizzontale()
    })

    it("Visualizza documenti e prosegui", () => {
        ControlliProtocollazione2022.riepilogoDocumenti()
        ControlliProtocollazione2022.Avanti()
        ControlliProtocollazione2022.aspettaCaricamentoAdempimenti()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliProtocollazione2022.stampaAdempimentiPrecontrattuali()
        ControlliProtocollazione2022.Incassa()
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