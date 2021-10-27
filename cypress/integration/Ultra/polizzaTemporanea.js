///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import Ultra from "../../mw_page_objects/ultra/Ultra"
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
var cliente = "PIERO VERDE"
var clienteUbicazione = "VIA ROMA 4, 33100 - UDINE (UD)"
//var ambiti = ['Fabbricato', 'Contenuto']
//var frazionamento = "annuale"
let nuovoCliente;
let iFrameUltra = '[class="iframe-content ng-star-inserted"]'
let iFrameFirma = '[id="iFrameResizer0"]'
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

describe("Polizza temporanea", ()=>{
    it("Ricerca cliente", ()=>{
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(cliente).type('{enter}')
            cy.get('lib-client-item').first().click()
          }).then(($body) => {
            cy.wait(7000)
            //const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            const check = cy.get('div[class="client-null-message"]').should('be.visible')
            cy.log('permessi: ' + check)
            if (check) {
              cy.get('input[name="main-search-input"]').type(cliente).type('{enter}')
              cy.get('lib-client-item').first().next().click()
            }
          })
      
        /* cy.get('[name="main-search-input"]').type(cliente).should('have.value', cliente)
        cy.get('[name="main-search-input"]').type('{enter}')
        cy.wait(1000)
        cy.pause()
        cy.contains('div', cliente.toUpperCase()).click({force: true}) */
        
    })

    it("Emissione Ultra Salute", ()=>{
        Ultra.emissioneUltra(ultraRV.SALUTE)
        Ultra.selezionaPrimaAgenzia()
        
    })

    it("Impostazione contratto temporaneo e prosegui", ()=>{
        var ambiti = [
            ambitiUltraSalute.SPESE_MEDICHE,
            ambitiUltraSalute.DIARIA_DA_RICOVERO,
            ambitiUltraSalute.INVALIDITA_PERMANENTE_INFORTUNIO
        ]

        let oggi = Date.now()
        let dataInizio = new Date(oggi)
        let dataFine = new Date(oggi); dataFine.setMonth(dataInizio.getMonth()+7)
        var inizio = ('0'+dataInizio.getDate()).slice(-2) +''+ ('0'+(dataInizio.getMonth()+1)).slice(-2) +''+ dataInizio.getFullYear()
        var fine = ('0'+dataFine.getDate()).slice(-2) +''+ ('0'+(dataFine.getMonth()+1)).slice(-2) +''+ dataFine.getFullYear()

        Ultra.contrattoTemporaneo(ambiti, inizio, fine, "Lavoratore occasionale", "Allianz")
        Ultra.procediHome()
    })

    it("Modifica professione in Conferma Dati Quotazione", ()=>{
        Ultra.ProfessionePrincipaleDatiQuotazione('barista')
        Ultra.confermaDatiQuotazione()
    })

    it("Riepilogo ed emissione", ()=>{
        Ultra.riepilogoEmissione()
    })

    it("Censimento anagrafico", ()=>{
        Ultra.censimentoAnagraficoSalute('VERDE PIERO', false, false, false)
    })

    it("Dati integrativi", ()=>{
        Ultra.datiIntegrativiSalute(true, true, false)
        Ultra.approfondimentoSituazioneAssicurativa(true)
        Ultra.confermaDichiarazioniContraente()        
    })

    it("Consensi e privacy", ()=>{
      Ultra.consensiPrivacy()
    })

    it("Consensi sezione Intermediario", ()=>{        
        Ultra.consensiSezIntermediario('2060281 BUOSI FRANCESCA', true)
    })

    it("Visualizza documenti e prosegui", ()=>{
        Ultra.riepilogoDocumenti()
    })
})