///<reference types="cypress"/>

//#region imports
import Common from "../../../mw_page_objects/common/Common"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import Ultra from "../../../mw_page_objects/ultra/Ultra"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
import Dashboard from "../../../mw_page_objects/UltraBMP/Dashboard"
import Preferiti from "../../../mw_page_objects/UltraBMP/Preferiti"
import DatiQuotazione from "../../../mw_page_objects/UltraBMP/DatiQuotazione"
import Riepilogo from "../../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import DatiIntegrativi from "../../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import Incasso from "../../../mw_page_objects/UltraBMP/Incasso"
import PersonaFisica from "../../../mw_page_objects/common/PersonaFisica"
import Portafoglio from "../../../mw_page_objects/clients/Portafoglio"
import Appendici from "../../../mw_page_objects/polizza/Appendici"
import Vincoli from "../../../mw_page_objects/polizza/Vincoli"

import ambitiUltra from '../../../fixtures/Ultra/ambitiUltra.json'
import menuPolizzeAttive from '../../../fixtures/SchedaCliente/menuPolizzeAttive.json'
import datiVincoli from '../../../fixtures/Ultra/datiVincolo.json'
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
let prodotto = "Ultra Casa e Patrimonio Vincolato"
let ramo = "Rami Vari"
let dataEmissione = moment().format('YYYY-MM-DD HH:mm:ss')
let dataScadenza = moment().add(1, 'y').format('YYYY-MM-DD HH:mm:ss')
let ambiente = Cypress.env('currentEnv')

let cliente = PersonaFisica.PieroAngela()
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato]
var ambitoApp = [ambitiUltra.ambitiUltraCasaPatrimonio.tutela_legale]
var frazionamento = "semestrale"
var nContratto = "000"
var appendice = "Presenza Altra copertura medesimo rischio - Patrimonio"
//#endregion variabili iniziali

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

describe("PREFERITI, APPENDICE E VINCOLO DIFFERITI", () => {

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

    it("Vai a preferiti", () => {
        SintesiCliente.FQ_tabUltra('Casa e Patrimonio')
        cy.pause()
        SintesiCliente.VaiPreferiti()
        Common.canaleFromPopup()
        Preferiti.caricamentoPreferitiUltra()
    })

    it("Seleziona preferiti", () => {
        Preferiti.SelezionaPreferiti("Personali", "Automatici")
    })

    it("Aggiungi ambiti", () => {
        Preferiti.AggiungiAmbitiPreferiti()
    })

    it("Seleziona ambiti", () => {
        Preferiti.selezionaAmbiti(ambiti)
    })

    it("Seleziona frazionamento", () => {
        Dashboard.selezionaFrazionamento(frazionamento)
    })

    it("Modifica massimale per Responsabilit?? civile casa", () => {
        Preferiti.ApriDettagli()
        Preferiti.ModificaMassimaleDettagli('Responsabilit?? civile della casa', '2.000.000')
    })

    it("Garanzie aggiuntive", () => {
        Preferiti.AggiungiGaranziaDettagli('Danni da fenomeno elettrico')
        Preferiti.AggiungiGaranziaDettagli('cavalli ed altri animali da sella')
        //Preferiti.AggiungiGaranziaDettagli('Controversie con il datore di lavoro') < NON LA FA AGGIUNGERE
    })

    it("Procedi", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
        //Riepilogo.caricamentoRiepilogo()
    })

    it("Conferma dati quotazione", () => {
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Riepilogo ed emissione", () => {
        Riepilogo.salvaQuotazione()
        Riepilogo.EmissionePolizza()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
    })

    it("Censimento anagrafico", () => {
        CensimentoAnagrafico.censimentoAnagrafico(cliente.cognomeNome(), cliente.ubicazione())
        Ultra.Avanti()
        DatiIntegrativi.caricamentoPagina()
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.selezionaTuttiNo()
        Ultra.Avanti()
        DatiIntegrativi.popupDichiarazioni()
        ConsensiPrivacy.caricamentoPagina()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.Avanti()
        ControlliProtocollazione.caricamentoPagina()
    })

    it("salvataggio Contratto", () => {
        ControlliProtocollazione.salvataggioContratto()
    })

    it("Intermediario", () => {
        ControlliProtocollazione.inserimentoIntermediario()
    })

    it("Visualizza documenti e prosegui", () => {
        ControlliProtocollazione.riepilogoDocumenti()
        ControlliProtocollazione.Avanti()
        ControlliProtocollazione.aspettaCaricamentoAdempimenti()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliProtocollazione.stampaAdempimentiPrecontrattuali()
        ControlliProtocollazione.salvaNContratto()

        cy.get('@contratto').then(val => {
            nContratto = val
        })

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
        cy.SalvaPolizza(dbPolizze, cliente.nomeCognome(), nContratto, dataEmissione, dataScadenza, ramo, prodotto, ambiente)
        Incasso.Chiudi()
    })

    it("Chiusura e apertura sezione Clients", () => {
        Ultra.chiudiFinale()
        cy.get('.nx-breadcrumb-item__text').contains('Clients').click()

        cy.intercept({
            method: 'POST',
            url: '**/clients/**'
        }).as('clients')

        cy.wait('@clients', { requestTimeout: 60000 })
    })

    it("Portafoglio", () => {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.listaPolizze(false)
        Portafoglio.ordinaPolizze("Numero contratto")
        Portafoglio.menuContratto(nContratto, menuPolizzeAttive.mostraAmbiti)
        
        Portafoglio.menuContestualeAmbiti(ambitoApp, "Appendici")
        Ultra.selezionaPrimaAgenzia()
        Appendici.caricamentoPagina()
    })

    it("Appendice - Seleziona", () => {
        Appendici.SelezionaAppendice(appendice)
        Appendici.Avanti()
        Appendici.caricamentoEdit()
    })

    it("Appendice - Compilazione", () => {   
        Appendici.CompilazioneAppendice("Generali", "123456789")
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
        Appendici.VerificaNuoveAppendici("medesimo rischio")
        Appendici.Home()
    })

    it("Vincoli - apertura sezione Vincoli", () => {
        cy.get('.nx-breadcrumb-item__text').contains('Clients').click()
        Portafoglio.menuContratto(nContratto, menuPolizzeAttive.vincoli)
        //Ultra.selezionaPrimaAgenzia()
        Vincoli.caricamentoPagina()
    })

    it("Vincoli - aggiunta vincolo", () => {        
        Vincoli.SelezionaAmbito("Fabbricato")
        Vincoli.AggiungiVincolo()
        Vincoli.updateAppendice()
    })

    it("Vincoli - ente vincolatario", () => {
        cy.pause()
        Vincoli.SelezionaEnteVincolatario("Banca")
        //Vincoli.attesaRicerca()
        Vincoli.RicercaBanca("Banca", "Unicredit")
        //Vincoli.updateAppendice()
        //Vincoli.ChiudiPopupAnagrafico()
    })

    it("Vincoli - Testi direzionali", () => {
        Vincoli.TestiDirezionali("Vincolo 42")
    })

    it("Vincoli - Dati vincolo", () => {
        Vincoli.DatiVincolo(datiVincoli.datiVincolo_test1)
    })

    it("Vincoli - Conversione", () => {
        Vincoli.Converti()
        Vincoli.generazioneDocumenti()
    })

    it("Vincoli - Stampa documenti", () => {
        Vincoli.StampaDocumenti("Firma Allianz")
    })

    it("end", () => {
        Vincoli.ConfermaCreazioneDocumento()
        cy.pause()
        cy.SalvaPolizza(dbPolizze, cliente.nomeCognome(), nContratto, dataEmissione, dataScadenza, ramo, prodotto, ambiente)
    })
})