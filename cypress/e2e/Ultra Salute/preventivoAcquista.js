/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description 
 */

///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import 'cypress-iframe';
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region enum
const ultraRV = {
  CASAPATRIMONIO: "Allianz Ultra Casa e Patrimonio",
  CASAPATRIMONIO_BMP: "Allianz Ultra Casa e Patrimonio BMP",
  SALUTE: "Allianz Ultra Salute",
}

const ambitiUltraSalute = {
  SPESE_MEDICHE: "health-bag-doctor",
  DIARIA_DA_RICOVERO: "save",
  INVALIDITA_PERMANENTE_INFORTUNIO: "injury-plaster",
  INVALIDITA_PERMANENTE_MALATTIA: "wheelchair",
}
//#endregion enum

//#region  variabili iniziali
let personaGiuridica = "Sinopoli"
let personaFisica = PersonaFisica.GalileoGalilei()
var frazionamento = "trimestrale"
var copertura = "extra-professionale"
var ambiti = [
  ambitiUltraSalute.SPESE_MEDICHE,
  ambitiUltraSalute.DIARIA_DA_RICOVERO,
  ambitiUltraSalute.INVALIDITA_PERMANENTE_INFORTUNIO
]

//let tabCensmentoAnagrafica = "Persona"
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

afterEach(function () {
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
//#endregion Before After

describe("PREVENTIVO E ACQUISTO POLIZZA", () => {
  it("Ricerca cliente", () => {
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(personaGiuridica).type('{enter}')
      cy.get('lib-client-item').first().click()
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
    Ultra.emissioneUltra(ultraRV.SALUTE)
    Common.canaleFromPopup()
    //Ultra.selezionaPrimaAgenzia()
  })

  it("Selezione ambiti nella homepage di Ultra Salute", () => {
    Dashboard.selezionaAmbiti(ambiti)
  })

  it("Cambia Soluzioni", () => {
    Ultra.modificaSoluzioneHome('Diaria da ricovero', 'Essential')
    Ultra.modificaSoluzioneHome('Spese mediche', 'Essential')
    Ultra.modificaSoluzioneHome('Invalidità permanente da infortunio', 'Premium')
  })

  it("Aggiungi garanzie per Invalidità Permanente", () => {
    Ultra.GaranzieAggiuntiveAmbito('Invalidità permanente da infortunio', 'Capitale per morte da infortunio')
    Ultra.procediHome()
  })

  it("Modifica professione e conferma Dati Quotazione", () => {
    Ultra.coperturaDatiQuotazione(copertura)
    Ultra.ProfessionePrincipaleDatiQuotazione('ingegnere solo in studio')
    Ultra.ProfessionePrincipaleDatiQuotazione('fisioterapista', true)
    Ultra.confermaDatiQuotazione()

  })

  it("Riepilogo ed emissione preventivo", () => {
    Ultra.selezionaFrazionamento(frazionamento)
    Ultra.emettiPreventivo()
    Ultra.caricamentoCensimentoAnagrafico()
  })

  it("Aggiungi Cliente Persona Fisica", () => {
    CensimentoAnagrafico.aggiungiClienteCensimentoAnagrafico(personaFisica, "Persona")
    CensimentoAnagrafico.aggiornaParamCliente()
  })

  it("Completa Censimento Anagrafico", () => {
    Ultra.domandaSiNo('Ditta Contraente', 'si')
    Ultra.censimentoAnagraficoAvanti()
  })

  it("Beneficiari", () => {
    Ultra.beneficiariAvanti()
    DatiIntegrativi.caricamentoPagina()
  })
  it("Dati integrativi", () => {
    Ultra.datiIntegrativiSalute(true, true, true)
    Ultra.approfondimentoSituazioneAssicurativa(false)
    DatiIntegrativi.popupDichiarazioni()
  })

  it("Condividi il Preventivo", () => {
    //Ultra.caricamentoCondividi()
    //cy.pause()
    Ultra.condividiPreventivoSelTutti()
    Ultra.condividiPreventivoConferma()
    ConsensiPrivacy.caricamentoPagina()
  })

  it("Consensi e privacy", () => {
    Ultra.riepilogoDocumenti()
    Ultra.avantiConsensi()
  })

  it("Verifica invio mail", () => {
    Ultra.verificaInvioMail()
  })
})