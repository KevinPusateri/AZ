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
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'

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
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
//#endregion imports

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

//#region  variabili iniziali
let cliente = PersonaFisica.EttoreMajorana()
var ambiti = [
  ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato,
  ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali,
  ambitiUltra.ambitiUltraCasaPatrimonio.tutela_legale
]
var ambitiPostSblocco = [
  ambitiUltra.ambitiUltraCasaPatrimonio.contenuto
]
var nContratto = "000"
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

describe("CONVENZIONE STANDARD", () => {
  it("Ricerca cliente", () => {
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
      cy.get('lib-client-item').first()
        .find('.name').trigger('mouseover').click()
    }).then(($body) => {
      cy.wait(7000)
      const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
      cy.log('permessi: ' + check)
      if (check) {
        cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
        cy.get('lib-client-item').first().next().click()
      }
    })
  })

  it("Emissione Ultra Casa e Patrimonio", () => {
    SintesiCliente.Emissione(prodotti.RamiVari.CasaPatrimonio)
    Common.canaleFromPopup()
    Dashboard.caricamentoDashboardUltra()
  })

  it("Selezione ambiti", () => {
    Dashboard.selezionaAmbiti(ambiti)
    Dashboard.procediHome()
    DatiQuotazione.CaricamentoPagina()
  })

  it("Dati Quotazione", () => {
    DatiQuotazione.confermaDatiQuotazione()
    Riepilogo.caricamentoRiepilogo()
  })

  it("Riepilogo", () => {
    Riepilogo.EmissionePolizza()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
  })

  it("Censimento anagrafico", () => {
    CensimentoAnagrafico.censimentoAnagrafico(cliente.cognomeNome(), cliente.ubicazione())
    CensimentoAnagrafico.Avanti()
    DatiIntegrativi.caricamentoPagina()
  })

  it("Dati integrativi", () => {
    DatiIntegrativi.selezionaTuttiNo()
    DatiIntegrativi.ClickButtonAvanti()
    DatiIntegrativi.confermaDichiarazioniContraente()
    ConsensiPrivacy.caricamentoPagina()
  })

  it("Consensi e privacy", () => {
    ConsensiPrivacy.Avanti()
    ControlliProtocollazione.caricamentoPagina()
  })

  it("salvataggio Contratto", () => {
    ControlliProtocollazione.salvataggioContratto()
    ControlliProtocollazione.salvaNContratto()

        cy.get('@contratto').then(val => {
            nContratto = val
        })
  })

  it("Controlli e protocollazione - intermediario", () => {
    ControlliProtocollazione.inserimentoIntermediario()
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
    Incasso.SelezionaTipoDelega("Nessuna Delega")
    Incasso.ConfermaIncasso()
    Incasso.caricamentoEsito()
  })

  it("Esito incasso", () => {
    Incasso.EsitoIncasso()
    Incasso.Chiudi()
  })

  it("Chiusura e apertura sezione Clients", () => {
    Ultra.chiudiFinale()
    cy.get('.nx-breadcrumb-item__text').contains('Clients').click()

    cy.intercept({
      method: 'POST',
      url: '**/clients/**'
    }).as('clients')

    cy.wait('@clients', { requestTimeout: 60000 })
  })

  it("Portafoglio", () => {
    Portafoglio.apriPortafoglioLite()
    Portafoglio.ordinaPolizze("Numero contratto")
    cy.pause()
    //Portafoglio.menuContratto(nContratto, menuPolizzeAttive.modificaPolizza)    
    //Common.canaleFromPopup()
    //Dashboard.caricamentoAmbitiAcquistati()
  })

  it("configurazione ambito", () => {
    Dashboard.sblocca(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato)
    Dashboard.selezionaAmbiti(ambitiPostSblocco)
    ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[0])
    ConfigurazioneAmbito.selezionaSoluzione("Premium")
    ConfigurazioneAmbito.ClickButton("CONFERMA")
    //Dashboard.caricamentoDashboardUltra()
  })

  it("Convenzioni", () => {
    Dashboard.Convenzione('Abbonati Sky', false)
    Dashboard.VerificaAmbientiConvenzione(["Fabbricato", "Contenuto"],
                                          ["Catastrofi naturali", "Tutela legale"],
                                          ["Catastrofi naturali", "Tutela legale"])
  })

  it("Selezione ambiti", () => {
    Dashboard.procediHome()
    Riepilogo.caricamentoRiepilogo()
  })

  /* it("Dati Quotazione", () => {
    DatiQuotazione.confermaDatiQuotazione()
    Riepilogo.caricamentoRiepilogo()
  }) */

  it("Riepilogo", () => {
    Riepilogo.EmissionePolizza()
    CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
  })

  it("Censimento anagrafico", () => {
    CensimentoAnagrafico.verificaFabbricatoInserito(cliente)
    CensimentoAnagrafico.Avanti()
    DatiIntegrativi.caricamentoPagina()
  })

  it("Dati integrativi", () => {
    DatiIntegrativi.selezionaTuttiNo()
    DatiIntegrativi.ClickButtonAvanti()
    DatiIntegrativi.confermaDichiarazioniContraente()
    ConsensiPrivacy.caricamentoPagina()
  })

  it("Consensi e privacy", () => {
    ConsensiPrivacy.Avanti()
    ControlliProtocollazione.caricamentoPagina()
  })

  it("salvataggio Contratto", () => {
    ControlliProtocollazione.salvataggioContratto()
    ControlliProtocollazione.salvaNContratto()

        cy.get('@contratto').then(val => {
            nContratto = val
        })
  })

  it("Controlli e protocollazione - intermediario", () => {
    ControlliProtocollazione.inserimentoIntermediario()
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
    //Incasso.SelezionaTipoDelega("Nessuna Delega")
    Incasso.ConfermaIncasso()
    Incasso.caricamentoEsito()
  })

  it("Esito incasso", () => {
    Incasso.EsitoIncasso()
    Incasso.Chiudi()
  })

  it("Fine", () => {
    cy.pause()
    //todo: controllare come cercare vecchia polizza senza convenzione o retrodatare la scadenza
    //todo: usare database?
  })
})