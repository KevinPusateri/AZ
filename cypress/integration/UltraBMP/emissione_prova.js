/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import StartPage from "../../mw_page_objects/UltraBMP/StartPage"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import CondividiPreventivo from "../../mw_page_objects/UltraBMP/CondividiPreventivo"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import ControlliSalvataggio from "../../mw_page_objects/UltraBMP/ControlliSalvataggio"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"
import Portafoglio from "../../mw_page_objects/Clients/Portafoglio"
import Common from "../../mw_page_objects/common/Common"
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgermenu/BurgerMenuSales"
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'
import Annullamento from "../../mw_page_objects/polizza/Annullamento"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json'
import 'cypress-iframe';


//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region enum
const ultraRV = {
  CASAPATRIMONIO: "Allianz Ultra Casa e Patrimonio",
  CASAPATRIMONIO_BMP: "Allianz Ultra Casa e Patrimonio BMP",
  SALUTE: "Allianz Ultra Salute",
}

  
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { modificheContenuto } from '../../fixtures/Ultra/BMP_Caso2.json'
import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso2.json'
import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso2.json'
import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso2.json'
import { daModificareContenuto } from '../../fixtures/Ultra/BMP_Caso2.json'
import { soluzione } from '../../fixtures/Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures/Ultra/BMP_Comune.json'
import { ubicazione } from '../../fixtures//Ultra/BMP_Caso2.json'

//#endregion

//let personaFisica = PersonaFisica.MassimoRoagna()
let personaFisica = PersonaFisica.MarioRossini()
var nContratto = "000"
var nPreventivo = "000"
var frazionamento = "mensile"
var arrPath = []
var arrDoc = []
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.contenuto, ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali, ambitiUltra.ambitiUltraCasaPatrimonio.tutela_legale]

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
      .its('0.contentDocument').should('exist')
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

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

after(function() {
    TopBar.logOutMW()
        //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion
})

describe('Ultra BMP : Emissione BMP Caso2', function() {

    it("Ricerca cliente", () => {
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(personaFisica.codiceFiscale).type('{enter}')
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

    it("Emissione Ultra Casa e Patrimonio", () => {
        SintesiCliente.Emissione(prodotti.RamiVari.CasaPatrimonio)
        //Ultra.selezionaPrimaAgenzia()
        Dashboard.caricamentoDashboardUltra()
      })
    
      it("Selezione ambiti in dashboard", () => {
        Dashboard.selezionaAmbiti(ambiti)
      })

      /*
      it("Accesso Configurazione ambito 'Contenuto'", ()=>{
        
        //UltraBMP.ClickMatita("Contenuto")
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[0])

        ConfigurazioneAmbito.ModificaValoriCasa(daModificareContenuto, modificheContenuto)
        ConfigurazioneAmbito.verificaSoluzioneSelezionata(soluzione.PLUS)

        ConfigurazioneAmbito.modificaSommaAssicurata('Danni al contenuto della casa', '35.000,00 €', false, true)
        ConfigurazioneAmbito.modificaSommaAssicurata('Danni accidentali a superfici in vetro degli arredi', '3.000,00 €', false)
    })

    it("Aggiungi garanzia ambito 'Contenuto'", ()=>{
        ConfigurazioneAmbito.aggiungiGaranzia('Danni da fenomeno elettrico')
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()
    })

    it("Accesso Configurazione ambito 'Catastrofi Naturali'", ()=>{
        
        //UltraBMP.ClickMatita("Catastrofi naturali")
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[1])
        ConfigurazioneAmbito.VerificaDefaultCasa(daModificareContenuto, modificheContenuto)
        ConfigurazioneAmbito.selezionaSoluzione("Essential")
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()
    })

    it("Accesso Configurazione ambito 'Tutela legale'", ()=>{
        
        //UltraBMP.ClickMatita("Tutela legale")
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[2])
        ConfigurazioneAmbito.VerificaDefaultCasa(daModificareContenuto, modificheContenuto)
        ConfigurazioneAmbito.selezionaSoluzione("Top")

        ConfigurazioneAmbito.modificaSommaAssicurata('Casa', '25.000,00 €', false, false)
        ConfigurazioneAmbito.modificaSommaAssicurata('Veicoli guidati con patente', '25.000,00 €', false, false)

        //ConfigurazioneAmbito.ClickButton("CONFERMA")
        //Dashboard.caricamentoDashboardUltra()
    })

    it("Aggiungi garanzia ambito 'Tutela legale'", ()=>{
        ConfigurazioneAmbito.aggiungiGaranzia('Famiglia')
        ConfigurazioneAmbito.aggiungiEstensione('+ Controversie con il datore di lavoro')
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()
    })
    */

    it("Procedi", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
    })

    it("Modifica dati quotazione e conferma", () => {
        //DatiQuotazione.ModificaValoriCasa(modificheContenuto.Nome, daModificareCasa, modificheCasa)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    /*
    it("Verifica dati quotazione", () => {
        Dashboard.selezionaVoceHeader('Dati quotazione')
        DatiQuotazione.VerificaDefaultCasa(modificheCasa.Nome, daVerificareCasa, modificheCasa)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })
    */

    it("Verifica ambiti in Riepilogo", () => {
        Riepilogo.verificaFrazionamento(frazionamento)
        Riepilogo.EmissionePreventivo()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()   
    })

    //*************** >> CASO2 DA QUI
    it("Anagrafica", () => {
        CensimentoAnagrafico.selezionaNuovoFabbricato(personaFisica, ubicazione)
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
    })

    it("Dati integrativi", () => {
        //cy.pause()
        DatiIntegrativi.selezionaSiAmbito('Contenuto')
        DatiIntegrativi.selezionaSiAmbito('Catastrofi naturali')
        DatiIntegrativi.selezionaSiAmbito('Tutela legale')
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.popupApprofondimentoSituazioneAssicurativa()
        DatiIntegrativi.popupDichiarazioni()
        CondividiPreventivo.caricamentoPreventivo()
    })

    it("Condividi Preventivo", () => {
        CondividiPreventivo.SelezionaCopertina("Catastrofi Naturali")
        CondividiPreventivo.Conferma()
        ConsensiPrivacy.caricamentoPagina()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.visualizzaDocumento('Regolamento Allianz Ultra e Set informativo')
        ConsensiPrivacy.visualizzaDocumento('Preventivo Allianz Ultra')
        ConsensiPrivacy.Avanti()
        ConsensiPrivacy.VerificaInvioMail()
        ControlliSalvataggio.caricamentoPagina()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        cy.pause()
        ControlliSalvataggio.verificaPresenzaDocumento("Regolamento Allianz Ultra e Set informativo")
        ControlliSalvataggio.verificaPresenzaDocumento("Preventivo Allianz Ultra")
        ControlliSalvataggio.stampaDocumentazione()
        ControlliSalvataggio.salvaNPreventivo()

        cy.get('@preventivo').then(val => {
            nPreventivo = val
        })
        ControlliSalvataggio.clickPulsante('Torna alla home page')
        ControlliSalvataggio.clickConferma()
    })

    it("Ritorno alla Homepage di Matrix", () => {
        cy.pause()
        TopBar.clickMatrixHome()
        cy.pause()
        cy.wait(5000)
    })

})