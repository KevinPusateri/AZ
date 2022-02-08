/**
 * @author Chiara Costa <chiara.costaallianz.it>
 *
 * @description 
 */

///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import Ultra from "../../mw_page_objects/ultra/Ultra"
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
//#endregion variabili iniziali

//#region Enumerator
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

describe("POLIZZA BENEFICIARI REFERENTE", () => {
  it("Ricerca cliente", () => {
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(cliente.nomeCognome()).type('{enter}')
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

  it("Emissione Ultra Salute", () => {
    Ultra.emissioneUltra(ultraRV.SALUTE)
   // Ultra.selezionaPrimaAgenzia()
  })

  it("Prosegui", () => {
    var ambiti = [
      ambitiUltraSalute.SPESE_MEDICHE,
      ambitiUltraSalute.DIARIA_DA_RICOVERO,
      ambitiUltraSalute.INVALIDITA_PERMANENTE_INFORTUNIO
    ]

    let oggi = Date.now()
    let dataInizio = new Date(oggi)
    let dataFine = new Date(oggi); dataFine.setMonth(dataInizio.getMonth() + 7)
   

    Ultra.caricamentoUltraHome()
   
    Ultra.procediHome()
  })

  it("Modifica professione in Conferma Dati Quotazione", () => {
    Ultra.ProfessionePrincipaleDatiQuotazione('barista')
    Ultra.confermaDatiQuotazione()
  })

  it("Riepilogo ed emissione", () => {
    Ultra.riepilogoEmissione()
  })

  it("Censimento anagrafico", () => {
    cy.pause()
    Ultra.caricamentoCensimentoAnagrafico()
    Ultra.censimentoAnagraficoSalute(cliente.cognome + ' ' + cliente.nome, false, false, false)
  })

  it("Dati integrativi", () => {
    Ultra.caricaDatiIntegrativi()
    Ultra.datiIntegrativiSalute(true, true, false)
    Ultra.approfondimentoSituazioneAssicurativa(true)
    Ultra.confermaDichiarazioniContraente()
  })

  it("Consensi e privacy", () => {
    Ultra.caricamentoConsensi()
    Ultra.avantiConsensi()
  })

  it("Consensi sezione Intermediario", () => {
    Ultra.salvataggioContratto()
    Ultra.consensiSezIntermediario('2060281 BUOSI FRANCESCA', true)
  })

  it("Visualizza documenti e prosegui", () => {
    Ultra.riepilogoDocumenti()
  })
})