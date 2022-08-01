/**
 * @author Chiara Costa <chiara.costa@allianz.it>
 *
 * @description 
 */

///<reference types="cypress"/>

//#region imports
import 'cypress-iframe';
//import common from 'mocha/lib/interfaces/common';
import Common from "../../mw_page_objects/common/Common"
import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json';
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json';
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";
import LoginPage from "../../mw_page_objects/common/LoginPage";
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica";
import TopBar from "../../mw_page_objects/common/TopBar";
import Beneficiari from "../../mw_page_objects/UltraBMP/Beneficiari";
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico";
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito";
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy";
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione";
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard";
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi";
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione";
import Incasso from "../../mw_page_objects/UltraBMP/Incasso";
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo";



//#endregion imports

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region  variabili iniziali
let personaFisica = PersonaFisica.GalileoGalilei()
let assicurato = personaFisica // PersonaFisica.MarcoMarco()
const personaBeneficiario = PersonaFisica.EttoreMajorana()
var ambiti = [
  ambitiUltra.ambitiUltraSalute.invalidita_permanente_infortunio
]
//var frazionamento = "annuale"
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

describe("BENEFICIARI REFERENTE", () => {
  it("Ricerca cliente", () => {
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()

      cy.get('input[name="main-search-input"]').type(personaFisica.codiceFiscale).type('{enter}')
      cy.get('lib-client-item').first()
        .find('.name').trigger('mouseover').click()
    }).then(($body) => {
      cy.wait(7000)
      const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
      cy.log('permessi: ' + check)
      if (check) {
        cy.get('input[name="main-search-input"]').type(personaFisica.nomeCognome()).type('{enter}')
        cy.get('lib-client-item').first().next().click()
      }
    })
  })

  it("Emissione Ultra Salute", () => {
    SintesiCliente.Emissione(prodotti.RamiVari.UltraSalute)
    // in caso di agenzia HUB
    Common.canaleFromPopup()
    Dashboard.caricamentoDashboardUltra()
  })

  it("Selezione ambiti nella homepage di Ultra Salute", () => {
    Dashboard.selezionaAmbiti(ambiti)
  })


  it("Configurazione Invalidità Permanente da infortunio", () => {
    ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[0])
    ConfigurazioneAmbito.modificaDatoQuotazione("professione", "assistente presso uno studio medico")
    ConfigurazioneAmbito.selezionaSoluzione("Top")
    ConfigurazioneAmbito.aggiungiGaranzia("Capitale per morte da infortunio")
    ConfigurazioneAmbito.ClickButton("CONFERMA")
    Dashboard.procediHome()
    DatiQuotazione.CaricamentoPagina()
  })

  it("Dati Quotazione - modifica copertura", () => {
    DatiQuotazione.modificaDatoQuotazione("copertura", "professionale")
    DatiQuotazione.confermaDatiQuotazione()
    Riepilogo.caricamentoRiepilogo()
  })

  it("Modifica frazionamento ed emissione polizza", () => {
    Riepilogo.EmissionePolizza()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
  })

  it("Aggiungi Cliente Persona Fisica", () => {
    CensimentoAnagrafico.aggiungiClienteCensimentoAnagrafico(assicurato, "Persona 1")
    CensimentoAnagrafico.attendiCheckAssicurato()
    CensimentoAnagrafico.Avanti()
    Beneficiari.caricamentoBeneficiari()
  })

  it("Beneficiari", () => {
    Beneficiari.tipoBeneficiario('Persona fisica')
    Beneficiari.inserisciBeneficiarioNew(personaBeneficiario)
    Beneficiari.tipoBeneficiario('Eredi legittimi')
    Beneficiari.clickInserisci()
    cy.pause()
    Beneficiari.percentualeCapitale(personaBeneficiario.nomeCognome(), "60")
    Beneficiari.percentualeCapitale("Eredi legittimi", "40")
    // cy.get('#nx-input-5').should('be.visible').clear().type('100');
    Beneficiari.Avanti()
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
})