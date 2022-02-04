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
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
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
    cy.log("scadenza: " + scadenza)
    TopBar.clickSales()
    BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio')
    //SintesiCliente.selezionaPrimaAgenzia()
  })

  it("prosegui da start page", () => {
    StartPage.startScopriProtezione()
    //Dashboard.caricamentoDashboardUltra()
  })

  it("Seleziona frazionamento", () => {
    Dashboard.selezionaFrazionamento(frazionamento)
  })

  it("Inserimento vincolo", () => {
    Dashboard.Vincolo(true, casa, scadenza)
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