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

import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"

import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
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
let personaGiuridica = "Sinopoli"
let personaFisica = PersonaFisica.GalileoGalilei()
var frazionamento = "trimestrale"
var copertura = "extra-professionale"
var ambiti = [
  ambitiUltra.ambitiUltraSalute.spese_mediche,
  ambitiUltra.ambitiUltraSalute.diaria_da_ricovero,
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

describe("POLIZZA INFORTUNI CLAUSOLA M", () => {
  it("Ricerca cliente", () => {
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(personaGiuridica).type('{enter}')
      cy.get('lib-client-item').first()
        .find('.name').trigger('mouseover').click()
    }).then(($body) => {
      cy.wait(7000)
      const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
      cy.log('permessi: ' + check)
      if (check) {
        cy.get('input[name="main-search-input"]').type(personaGiuridica).type('{enter}')
        cy.get('lib-client-item').first().next().click()
      }
    })
  })

  it("Emissione Ultra Salute", () => {
    SintesiCliente.Emissione(prodotti.RamiVari.UltraSalute)
    Ultra.selezionaPrimaAgenzia()
    Dashboard.caricamentoDashboardUltra()
  })

  it("Selezione ambiti nella homepage di Ultra Salute", () => {
    Dashboard.selezionaAmbiti(ambiti)
  })

  it("Cambia Soluzioni", () => {
    for (var i = 0; i < ambiti.length; i++) {
      Dashboard.modificaSoluzione(ambiti[i], "Essential")
    }
  })

  it("Configurazione Invalidità Permanente da infortunio", () => {
    ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[2])
    ConfigurazioneAmbito.modificaDatoQuotazione("professione", "assistente presso uno studio medico")
    ConfigurazioneAmbito.selezionaSoluzione("Premium")
    ConfigurazioneAmbito.aggiungiGaranzia("Capitale per morte da infortunio")
    ConfigurazioneAmbito.ClickButton("CONFERMA")
    //Dashboard.caricamentoDashboardUltra()
    Dashboard.procediHome()
    DatiQuotazione.CaricamentoPagina()
  })

  it("Dati Quotazione - modifica copertura", () => {
    DatiQuotazione.modificaDatoQuotazione("copertura", "professionale")
    DatiQuotazione.confermaDatiQuotazione()
    Riepilogo.caricamentoRiepilogo()
  })

  it("Modifica frazionamento ed emissione polizza", () => {
    Dashboard.selezionaFrazionamento(frazionamento)
    Riepilogo.EmissionePolizza()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
  })

  it("Aggiungi Cliente Persona Fisica", () => {
    CensimentoAnagrafico.aggiungiClienteCensimentoAnagrafico(personaFisica, "Persona")
    CensimentoAnagrafico.aggiornaParamCliente()
    //CensimentoAnagrafico.attendiCheckAssicurato()
    //CensimentoAnagrafico.popupCap()
  })

  it("Domande integrative Censimento Anagrafico", () => {
    CensimentoAnagrafico.domandeIntegrative("indennità", "si")
    CensimentoAnagrafico.Avanti()
    Beneficiari.caricamentoBeneficiari()
  })

  it("Beneficiari", () => {
    Beneficiari.Avanti()
    DatiIntegrativi.caricamentoPagina()
  })
  
  it("Dati integrativi", () => {
    DatiIntegrativi.DatiIntegrativi(true, true, true)
    DatiIntegrativi.ClickButtonAvanti()
    DatiIntegrativi.approfondimentoSituazioneAssicurativa(false)
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