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
var frazionamento = "semestrale"
var prezzoRiservato = '455,00'
var copertura = "extra-professionale"
var ambiti = [
  ambitiUltraSalute.SPESE_MEDICHE,
  ambitiUltraSalute.DIARIA_DA_RICOVERO,
  ambitiUltraSalute.INVALIDITA_PERMANENTE_INFORTUNIO,
  ambitiUltraSalute.INVALIDITA_PERMANENTE_MALATTIA
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

describe("QUOTAZIONE", () => {
  it("Accesso Ultra Salute", () => {
    TopBar.clickSales()
    BurgerMenuSales.clickLink('Allianz Ultra Salute')
    //Ultra.selezionaPrimaAgenzia()
  })

  it("Modifica professione da start page Ultra Salute", () => {
    Ultra.startModificaProfessione('dirigente')
    Ultra.startScopriProtezione()
  })

  it("Selezione ambiti nella homepage di Ultra Salute", () => {
    //Ultra.caricamentoUltraHome()
    Ultra.selezionaAmbitiHome(ambiti)
  })

  it("Cambia Soluzioni", () => {
    Ultra.modificaSoluzioneHome('Diaria da ricovero', 'Top')
    Ultra.modificaSoluzioneHome('Spese mediche', 'Premium')
  })

  it("Seleziona frazionamento", () => {
    Ultra.selezionaFrazionamento(frazionamento)
  })

  it("Area riservata", () => {
    Ultra.areaRiservata(prezzoRiservato)
  })

  it("Condividi", () => {
    Ultra.condividi('Quotazione Test', ambiti)
    cy.log("FINE")
  })
})