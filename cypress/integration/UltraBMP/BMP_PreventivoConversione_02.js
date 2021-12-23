///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import StartPage from "../../mw_page_objects/UltraBMP/StartPage"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
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
//#endregion enum

//#region  variabili iniziali
var frazionamento = "semestrale"
var ambiti = [
  ambitiUltra.ambitiUltraCasaPatrimonio.contenuto,
  ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali,
  ambitiUltra.ambitiUltraCasaPatrimonio.tutela_legale
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

describe("Preventivo e Conversione ", () => {
  it("Accesso Ultra BMP", () => {
    TopBar.clickSales()
    BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP')
    //Ultra.selezionaPrimaAgenzia()
  })

  it("prosegui da start page", () => {
    StartPage.startScopriProtezione()
  })

  it("Selezione ambiti nella homepage di Ultra Salute", () => {
    //Dashboard.caricamentoUltraHome()
    Dashboard.selezionaAmbiti(ambiti)
  })

  it("Cambia Soluzioni", () => {
    cy.pause()
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