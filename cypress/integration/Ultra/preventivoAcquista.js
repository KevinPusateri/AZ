///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
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
//var frazionamento = "annuale"
//#endregion variabili iniziali

before(() => {
  cy.getUserWinLogin().then(data => {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
      insertedId = results.insertId
    })
    LoginPage.logInMWAdvanced()
  })
})

beforeEach(() => {
  cy.preserveCookies()
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

describe("Preventivo e Acquisto Polizza", () => {
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
    Ultra.selezionaPrimaAgenzia()
  })

  it("Selezione ambiti nella homepage di Ultra Salute", () => {
    Ultra.caricamentoUltraHome()
    Ultra.selezionaAmbitiHome(ambiti)
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

  it("Riepilogo ed emissione preventivos", () => {
    Ultra.selezionaFrazionamento(frazionamento)
    Ultra.emettiPreventivo()
    cy.wait(3000)
  })

  it("Aggiungi Cliente Persona Fisica", () => {
    Ultra.aggiungiClienteCensimentoAnagrafico(personaFisica)
  })

  it("Completa Censimento Anagrafico", () => {
    Ultra.domandaSiNo('Ditta Contraente', 'si')
    Ultra.censimentoAnagraficoAvanti()
  })

  it("Beneficiari", () => {
    Ultra.beneficiariAvanti()
  })
  it("Dati integrativi", () => {
    Ultra.datiIntegrativiSalute(true, true, true)
    Ultra.approfondimentoSituazioneAssicurativa(false)
    Ultra.confermaDichiarazioniContraente()
  })

  it("Condividi il Preventivo", () => {
    Ultra.condividiPreventivoSelTutti()
    Ultra.condividiPreventivoConferma()
  })

  it("Consensi e privacy", () => {
    Ultra.riepilogoDocumenti()
    Ultra.avantiConsensi()
  })

  it("Fine", () => {
    Ultra.verificaInvioMail()
  })
})