/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description 
 */

///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import StartPage from "../../mw_page_objects/UltraBMP/StartPage"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import Vincoli from "../../mw_page_objects/polizza/Vincoli"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import CondividiPreventivo from "../../mw_page_objects/UltraBMP/CondividiPreventivo"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import RecuperoPreventivo from "../../mw_page_objects/UltraBMP/RecuperoPreventivo"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"

import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import menuStart from '../../fixtures/Ultra/menuHeaderStart.json'
import filtroRicercaPreventivo from '../../fixtures/Ultra/filtroRicercaPreventivo.json'
import ordinePolizze from '../../fixtures/Ultra/ordinePolizze.json'
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'
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
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato]
var casa = ["Casa 1"]
var frazionamento = "annuale"
let oggi = Date.now()
let dataInizio = new Date(oggi)
var dataOggi = ('0' + dataInizio.getDate()).slice(-2) + '' +
  ('0' + (dataInizio.getMonth() + 1)).slice(-2) + '' +
  dataInizio.getFullYear()
let dataFine = new Date(oggi); dataFine.setFullYear(dataInizio.getFullYear() + 10)
var scadenza = ('0' + dataFine.getDate()).slice(-2) + '' +
  ('0' + (dataFine.getMonth() + 1)).slice(-2) + '' +
  dataFine.getFullYear()
var nContratto = "000"
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

describe("Vincolo contestuale PUA ", () => {
  it("Accesso Ultra Casa e Patrimonio", () => {
    cy.log("oggi: " + dataOggi)
    TopBar.clickSales()
    BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio')
    //SintesiCliente.selezionaPrimaAgenzia()
  })

  it("prosegui da start page", () => {
    StartPage.startScopriProtezione()
  })

  it("Seleziona frazionamento", () => {
    Dashboard.selezionaFrazionamento(frazionamento)
  })

  it("Inserimento vincolo", () => {
    Dashboard.Vincolo(true, casa, scadenza)
  })

  it("Modifica durata per ambiti", () => {
    Dashboard.dotMenu(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, "Modifica la durata")
    Dashboard.modificaDurata(30)
    Dashboard.dotMenu(ambitiUltra.ambitiUltraCasaPatrimonio.responsabilita_civile, "Modifica la durata")
    Dashboard.modificaDurata(30)
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
    Riepilogo.EmissionePreventivo()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
  })

  it("Censimento anagrafico", () => {
    CensimentoAnagrafico.selezionaContraentePF(cliente)
    CensimentoAnagrafico.censimentoAnagrafico(cliente.cognomeNome(), cliente.ubicazione(), true)
    CensimentoAnagrafico.apriVincoli()
    Vincoli.ApriPopupEnteVincolatario()
    Vincoli.attesaRicerca()
    Vincoli.RicercaBanca("Banca", "Unicredit")
    Vincoli.InserisciTestoDirezionaleUltra("Vincolo 1")
    Vincoli.ConfermaGestioneVincoli()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
    Ultra.Avanti()
    DatiIntegrativi.caricamentoPagina()
  })

  it("Dati integrativi", () => {
    DatiIntegrativi.selezionaTuttiNo()
    DatiIntegrativi.ClickButtonAvanti()
    // DatiIntegrativi.approfondimentoSituazioneAssicurativa(false)
    DatiIntegrativi.confermaDichiarazioniContraente()
    CondividiPreventivo.caricamentoPreventivo()
  })

  it("Condividi il Preventivo", () => {
    CondividiPreventivo.SelezionaCopertina("Casa")
    CondividiPreventivo.Conferma()
    ConsensiPrivacy.caricamentoPagina()
  })

  it("Visualizza documenti e prosegui", () => {
    ConsensiPrivacy.visualizzaDocumento("tutti")
    ConsensiPrivacy.Avanti()
  })

  it("Verifica invio mail e ritorno alla homepage", () => {
    ControlliProtocollazione.verificaInvioMail()
    ControlliProtocollazione.salvaNPreventivo()

    cy.get('@preventivo').then(val => {
      nContratto = val
    })

    ControlliProtocollazione.Home()
    StartPage.caricamentoPagina()
  })

  it("Recupero preventivo", () => {
    cy.log("Numero preventivo: " + nContratto)
    StartPage.menuHeader(menuStart.recupero)
    RecuperoPreventivo.impostaFiltro(filtroRicercaPreventivo.dataDal, dataOggi)
    RecuperoPreventivo.clickFiltraRisultati()
    //RecuperoPreventivo.ordinaRisultati(ordinePolizze.colonna.numero, ordinePolizze.ordine.ascendente)    
    RecuperoPreventivo.gestisci(nContratto)
    Dashboard.caricamentoDashboardUltra()
  })

  it("Emissione - Procedi", () => {
    Dashboard.procediHome()
    Riepilogo.caricamentoRiepilogo()
  })

  it("Emissione - Riepilogo", () => {
    Riepilogo.EmissionePolizza()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
  })

  it("Emissione - Censimento Anagrafico", () => {
    CensimentoAnagrafico.Avanti()
    DatiIntegrativi.caricamentoPagina()
  })

  it("Emissione - Dati integrativi", () => {
    DatiIntegrativi.ClickButtonAvanti()
    DatiIntegrativi.confermaDichiarazioniContraente()
    ConsensiPrivacy.caricamentoPagina()
  })

  it("Emissione - Privacy", () => {
    //ConsensiPrivacy.visualizzaDocumento("tutti")
    ConsensiPrivacy.Avanti()
    ControlliProtocollazione.caricamentoPagina()
  })

  it("Emissione - intermediario", () => {
    ControlliProtocollazione.inserimentoIntermediario()
  })

  it("Emissione - Visualizza documenti", () => {
    ControlliProtocollazione.riepilogoDocumenti()
    ControlliProtocollazione.Avanti()
    ControlliProtocollazione.aspettaCaricamentoAdempimenti()
  })

  it("Emissione - Adempimenti precontrattuali", () => {
    ControlliProtocollazione.salvaNContratto()

    cy.get('@contratto').then(val => {
      nContratto = val
    })

    ControlliProtocollazione.stampaAdempimentiPrecontrattuali()
    ControlliProtocollazione.Home()
  })

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

  it("Portafoglio", () => {
    cy.log("Numero contratto: " + nContratto)

    Portafoglio.clickTabPortafoglio()
    Portafoglio.clickSubTab("Proposte")
    Portafoglio.ordinaPolizze("Numero contratto")
    Portafoglio.clickIncassaProposta(nContratto)
    Common.canaleFromPopup()
    Incasso.caricamentoPagina()
  })

  it("Incasso - parte 1", () => {
    Incasso.ClickIncassa()
    Incasso.caricamentoModPagamento()
  })

  it("Incasso - parte 2", () => {
    Incasso.SelezionaMetodoPagamento('Assegno', false)
    Incasso.ConfermaIncasso(false)
    Incasso.caricamentoEsito()
  })

  it("Esito incasso", () => {
    Incasso.EsitoIncasso(false)
    Incasso.Chiudi(false)
  })

  it("Chiusura e apertura sezione Clients", () => {
    //Ultra.chiudiFinale()
    cy.get('.nx-breadcrumb-item__text').contains('Clients').click()

    cy.intercept({
      method: 'POST',
      url: '**/clients/**'
    }).as('clients')

    cy.wait('@clients', { requestTimeout: 60000 })
  })

  it("Verifica polizza attiva", () => {
    cy.pause()
    Portafoglio.clickSubTab("Polizze attive")
    Portafoglio.ordinaPolizze("Numero contratto")
    Portafoglio.checkPolizzaAttivaLite(nContratto)
  })

  it("Verifica ambiti", () => {
    Portafoglio.checkAmbiti(nContratto, ["FABBRICATO MUTUO", "RESPONSABILITA' CIVILE ESSENTIAL"])
  })


  it("Fine", () => {
    cy.pause()
  })
})