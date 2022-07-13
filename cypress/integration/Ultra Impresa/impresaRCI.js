/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description 
 */

///<reference types="cypress"/>

//#region imports
import 'cypress-iframe';

import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json'

import PersonaGiuridica from "../../mw_page_objects/common/PersonaGiuridica"

import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import StartPage from "../../mw_page_objects/UltraBMP/StartPage"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import Beneficiari from "../../mw_page_objects/UltraBMP/Beneficiari"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"
//#endregion imports

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
let personaGiuridica = PersonaGiuridica.Sinopoli()
//let personaFisica = PersonaFisica.GalileoGalilei()
var frazionamento = "trimestrale"
var ambiti = [
  ambitiUltra.ambitiUltraCasaPatrimonio.responsabilita_civile,
  ambitiUltra.ambitiUltraCasaPatrimonio.fabbricatoImpresa,
]
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

/* afterEach(function () {
  if (this.currentTest.state !== 'passed') {
    //TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
      let tests = testsInfo
      cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
    //Cypress.runner.stop();
  }
}) */

after(function () {
  TopBar.logOutMW()
  //#region Mysql
  cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
    let tests = testsInfo
    cy.finishMysql(dbConfig, insertedId, tests)
  })
  //#endregion
})
//#endregion Before After

describe("Polizza Responsabilità Civile Impresa", () => {
  it("Ricerca cliente", () => {
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(personaGiuridica.denominazione).type('{enter}')
      cy.get('lib-client-item').first()
        .find('.name').trigger('mouseover').click()
    }).then(($body) => {
      cy.wait(7000)
      const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
      cy.log('permessi: ' + check)
      if (check) {
        cy.get('input[name="main-search-input"]').type(personaGiuridica.denominazione).type('{enter}')
        cy.get('lib-client-item').first().next().click()
      }
    })
  })

  it("Emissione Ultra Impresa", () => {
    SintesiCliente.Emissione(prodotti.RamiVari.UltraImpresa)
    Common.canaleFromPopup()
    StartPage.caricamentoUltraImpresa()
  })

  it("Start Page Impresa", () => {
    StartPage.startAttivitaImpresa(personaGiuridica.attivita)
    StartPage.startScopriProtezione()
  })

  it("Selezione ambiti nella homepage di Ultra Impresa", () => {
    Dashboard.selezionaAmbiti(ambiti, "impresa")
    Dashboard.procediHome()
    DatiQuotazione.CaricamentoPagina()
  })

  it("Conferma dati quotazione", () => {
    DatiQuotazione.confermaDatiQuotazione(true)
    //Riepilogo.caricamentoRiepilogo()
  })

  it("Emissione polizza", () => {
    Riepilogo.EmissionePolizza()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
  })

  it("Censimento anagrafico", () => {
    CensimentoAnagrafico.censimentoAnagraficoImpresa(personaGiuridica)
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

  it("Salvataggio contratto", () => {
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