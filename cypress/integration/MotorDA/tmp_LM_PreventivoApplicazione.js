/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description Emissione preventivo applicazione auto da preventivo madre 
 * test di esportazione
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
import menuProvenienza from '../../fixtures/Motor/ProdottoProvenienza.json'
import Veicoli from '../../mw_page_objects/motor/ListaVeicoli'
//import cypress from "cypress";
//#endregion

export function PrevApplicazione(veicolo, garanzie, coperturaRCA = true) {

  

  //#region Mysql DB Variables
  const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
  const currentEnv = Cypress.env('currentEnv')
  const dbConfig = Cypress.env('db')
  //const dbConfig_da = Cypress.env('db_da')
  let insertedId
  //#endregion

  //#region Configuration
  Cypress.config('defaultCommandTimeout', 60000)
  const delayBetweenTests = 2000
  //#endregions

  //#region  variabili iniziali
  const personaGiuridica = "Sinopoli"
  var nPreventivo = null
  var nPreventivoApp = null
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

  describe("LIBRI MATRICOLA - PREVENTIVO APPLICAZIONE", () => {
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

    it("Elenco applicazioni", () => {
      LibriMatricolaDA.AperturaTabPreventivi()
      LibriMatricolaDA.AperturaElencoApplicazioni(nPreventivo)

      cy.get('@nPrevMadre').then(val => {
        nPreventivo = val
        cy.log("nPreventivo: " + nPreventivo)
      })

      LibriMatricolaDA.caricamentoElencoApplicazioni()
    })

    it("Nuovo preventivo applicazione", () => {
      LibriMatricolaDA.NuovoPreventivoApplicazione(true)
      LibriMatricolaDA.caricamentoDatiAmministrativi()
    })

    it("Dati Amministrativi", () => {
      LibriMatricolaDA.Avanti()
      LibriMatricolaDA.caricamentoContraenteProprietario()
    })

    it("Contraente/Proprietario", () => {
      LibriMatricolaDA.Avanti()
      LibriMatricolaDA.caricamentoVeicolo()
    })

    it("Veicolo", () => {
      LibriMatricolaDA.NuovoVeicolo(veicolo)
      LibriMatricolaDA.Avanti()
      LibriMatricolaDA.caricamentoProdottoProvenienza()
    })

    it("Selezione provenienza", () => {
      LibriMatricolaDA.CoperturaRCA(coperturaRCA)
      if(coperturaRCA) {
        LibriMatricolaDA.ProvenienzaVeicolo(menuProvenienza.primaImmatricolazione.documentazione)
      }
      LibriMatricolaDA.Avanti()      
      LibriMatricolaDA.caricamentoRiepilogo()
    })

    it("Riepilogo", () => {
      LibriMatricolaDA.RiepilogoGaranzie(garanzie)
      //cy.pause()
      LibriMatricolaDA.Avanti()
    })

    it("Integrazione", () => {
      //cy.pause()
      LibriMatricolaDA.Integrazione()
    })

    it("Finale", () => {
      LibriMatricolaDA.ContrattoFinale()
      LibriMatricolaDA.FinaleGoHome()
      LibriMatricolaDA.caricamentoElencoApplicazioni()

      cy.get('@contratto').then(val => {
        nPreventivoApp = val
        cy.log("Preventivo Applicazione n. " + nPreventivoApp)
      })
    })

    it("Verifica presenza preventivo applicazione", () => {
      expect(nPreventivoApp).to.not.be.undefined
      expect(nPreventivoApp).to.not.be.null

      LibriMatricolaDA.VerificaPresenzaPrevApp(nPreventivoApp)
    })
  })
}

