/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description Emissione preventivo madre per Libri Matricola
 */

///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import 'cypress-iframe';
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";
import LibriMatricolaDA from "../../mw_page_objects/motor/LibriMatricolaDA";
import menuAuto from '../../fixtures/Motor/menuMotor.json'
//import cypress from "cypress";
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
const dbConfig_da = Cypress.env('db_da')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregions

//#region  variabili iniziali
const personaGiuridica = "Sinopoli"
var nPreventivo
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

describe("LIBRI MATRICOLA - PREVENTIVO MADRE", () => {
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

  it("Libri Matricola da Sintesi Cliente", () => {
    SintesiCliente.emissioneAuto(menuAuto.prodottiParticolari.libriMatricola)
    LibriMatricolaDA.caricamentoLibriMatricolaDA()
  })

  it("Nuovo preventivo madre", () => {
    LibriMatricolaDA.nuovoPreventivoMadre('SALA TEST LM AUTOMATICI')
  })

  it("Dati integrativi", () => {
    LibriMatricolaDA.datiIntegrativi(true)
  })

  it("Contraente", () => {
    LibriMatricolaDA.Contraente()
    LibriMatricolaDA.caricamentoRiepilogo()
  })

  it("Riepilogo", () => {
    LibriMatricolaDA.Riepilogo(false)
  })

  it("Integrazione", () => {
    LibriMatricolaDA.Integrazione()
  })

  it("Finale", () => {
    LibriMatricolaDA.ContrattoFinale()
    LibriMatricolaDA.FinaleGoHome()

    cy.get('@contratto').then(val => {
      nPreventivo = val
      cy.log("nContratto b " + nPreventivo)
    })
  })

  it("Verifica presenza preventivo", () => {
    cy.log("nContratto c " + nPreventivo)
    expect(nPreventivo).to.not.be.undefined
    expect(nPreventivo).to.not.be.equal("000000")

    LibriMatricolaDA.caricamentoLibriMatricolaDA()
    LibriMatricolaDA.VerificaPresenzaPrevMadre(nPreventivo)
  })
})