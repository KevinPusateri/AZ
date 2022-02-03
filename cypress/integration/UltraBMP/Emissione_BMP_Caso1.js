/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import AreaRiservata from "../../mw_page_objects/UltraBMP/AreaRiservata"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgermenu/BurgerMenuSales"
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

/*
const ambitoUltra = {
  FABBRICATO: "Fabbricato",
  CONTENUTO: "Contenuto",
  CATASTROFI_NATURALI: "Catastrofi naturali",
  RESPONSABILITA_CIVILE: "Responsabilit",       // Responsabilità civile
  TUTELA_LEGALE: "Tutela legale",
  ANIMALI_DOMESTICI: "Animali domestici",
}
*/

/*
const soluzione = {
  ESSENTIAL: "Essential",
  PLUS: "Plus",
  PREMIUM: "Premium",
  TOP: "Top",
}
*/

  
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { modificheAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { modificheRC } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareFabbricato } from '../../fixtures//Ultra/BMP_Caso1.json'
//import { daVerificareFADef } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareRC } from '../../fixtures//Ultra/BMP_Caso1.json'
//import { daVerificareRCDef } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareRC } from '../../fixtures//Ultra/BMP_Caso1.json'
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'
import { soluzione } from '../../fixtures//Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures//Ultra/BMP_Comune.json'

//#endregion

//#region  variabili iniziali
var premioTotPrima = 0
var premioTotDopo = 0
var premioFA = 0
var premioFA_FenomenoElettrico = 0
var premioRC = 0
var premioRC_Affittacamere = 0
var premioRC_ProprietàAnimali = 0

var cliente = ""
var clienteUbicazione = ""
var frazionamento = "annuale"
var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI]
var defaultFQ = {
    "TipoAbitazione"    : "appartamento",
    "MqAbitazione"      : "100",
    "UsoAbitazione"     : "casa principale",
    "CapAbitazione"     : ""
}
var valoriIns = {
    "TipoAbitazione"    : "villa indipendente",
    "MqAbitazione"      : "155",
    "UsoAbitazione"     : "casa saltuaria",
    "CapAbitazione"     : ""
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

describe('Ultra BMP : Emissione BMP Caso1', function() {

    it('Seleziona Ultra BMP', () => {
        TopBar.clickSales()
        //cy.pause()
        //BurgerMenuSales.clickLink(ultraRV.CASAPATRIMONIO_BMP)
        BurgerMenuSales.clickLink(ultraRV.CASAPATRIMONIO)
    })
     
    it("Verifica valori default FQ", () => {
        //cy.pause()
        UltraBMP.VerificaDefaultFQ(defaultFQ)
        UltraBMP.ClickButton('SCOPRI LA PROTEZIONE')
    })

    it("Seleziona ambiti", () => {
        cy.log('Seleziona ambito')
        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.log('RICERCA AMBITO: ' + ambiti[i])
            //cy.pause()
            UltraBMP.SelezionaAmbito(ambiti[i])
        }
    })
    
    
    it("Cambia Soluzioni", () => {
    //cy.pause()
    Ultra.modificaSoluzioneHome(ambitoUltra.FABBRICATO, soluzione.TOP)
    Ultra.modificaSoluzioneHome(ambitoUltra.RESPONSABILITA_CIVILE, soluzione.PREMIUM)
    Ultra.modificaSoluzioneHome(ambitoUltra.ANIMALI_DOMESTICI, soluzione.ESSENTIAL)
    })
    
    it("Accesso Dati Quotazione da menù", ()=>{
        //cy.pause()
        UltraBMP.SelezionaVoceMenuPagAmbiti('Dati quotazione')
        //cy.pause()
        DatiQuotazione.VerificaDefaultCasa('Casa 1', daVerificareCasa, defaultCasa)
        DatiQuotazione.VerificaDefaultAnimaleDomestico('Animale domestico 1', daVerificareAnimale, defaultAnimale)
        //cy.pause()
        DatiQuotazione.ModificaValoriCasa('Casa 1', daModificareCasa, modificheCasa)
        //cy.pause()
        DatiQuotazione.ModificaValoriAnimaleDomestico('Animale domestico 1', daModificareAnimale, modificheAnimale)
        DatiQuotazione.ClickButton("CONFERMA")
        cy.pause()
    })

    it("Accesso Configurazione ambito 'Fabbricato'", ()=>{
        
        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotPrima = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale prima di aggiungere la garanzia: ' + premioTotPrima)
        })

        UltraBMP.ClickMatita("Fabbricato", "Casa 1")

        ConfigurazioneAmbito.VerificaDefaultCasa(daVerificareFabbricato, modificheCasa)
        ConfigurazioneAmbito.verificaSoluzioneSelezionata(soluzione.TOP)
        
        ConfigurazioneAmbito.leggiPremio('Ambito')   //>> premioAmbito
        cy.get('@premioAmbito').then(premioAmbito => {
            premioFA = parseFloat(premioAmbito.replace(/,/,"."))
            cy.log('Premio Ambito Fabbricato: ' + premioFA)
        })

        ConfigurazioneAmbito.leggiPremioGaranziaAggiuntiva('Danni da fenomeno elettrico')    //>> premioGarAgg
        cy.get('@premioGarAgg').then(premioGaranziaAggiuntiva => {
            premioFA_FenomenoElettrico = parseFloat(premioGaranziaAggiuntiva.replace(/,/,"."))
            cy.log('Premio Garanzia Aggiuntiva: ' + premioFA_FenomenoElettrico)
        })

        ConfigurazioneAmbito.aggiungiGaranzia('Danni da fenomeno elettrico')
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        //cy.pause()

        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotDopo = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale dopo aver aggiunto la garanzia: ' + premioTotDopo)
        })

        //Dashboard.verificaPremio(premioTotPrima, premioTotDopo, premioFA_FenomenoElettrico)
        cy.pause()
    })

    it("Verifica premio totale in Dashboard dopo variazioni ambito 'Fabbricato'", ()=>{
        Dashboard.verificaPremio(premioTotPrima, premioTotDopo, premioFA_FenomenoElettrico)
        cy.pause()
    })

    it("Accesso Configurazione ambito 'Responsabilità civile'", ()=>{

        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotPrima = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale prima di aggiungere la garanzia: ' + premioTotPrima)
        })

        UltraBMP.ClickMatita("Responsabilit", "Casa 1")

        ConfigurazioneAmbito.VerificaDefaultCasa(daVerificareRC, modificheCasa)
        ConfigurazioneAmbito.verificaSoluzioneSelezionata(soluzione.PREMIUM)

        ConfigurazioneAmbito.ModificaConfigurazioneAmbito(daModificareRC, modificheRC)
        
        ConfigurazioneAmbito.leggiPremio('Ambito')   //>> premioAmbito
        cy.get('@premioAmbito').then(premioAmbito => {
            premioRC = parseFloat(premioAmbito.replace(/,/,"."))
            cy.log('Premio Ambito Fabbricato: ' + premioRC)
        })

        ConfigurazioneAmbito.leggiPremioGaranziaAggiuntiva('attività di affittacamere e Bed & Breakfast')    //>> premioGarAgg
        cy.get('@premioGarAgg').then(premioGaranziaAggiuntiva => {
            premioRC_Affittacamere = parseFloat(premioGaranziaAggiuntiva.replace(/,/,"."))
            cy.log('Premio Garanzia Aggiuntiva: ' + premioRC_Affittacamere)
        })

        ConfigurazioneAmbito.leggiPremioGaranziaAggiuntiva('proprietà di cavalli ed altri animali da sella')    //>> premioGarAgg
        cy.get('@premioGarAgg').then(premioGaranziaAggiuntiva => {
            premioRC_ProprietàAnimali = parseFloat(premioGaranziaAggiuntiva.replace(/,/,"."))
            cy.log('Premio Garanzia Aggiuntiva: ' + premioRC_ProprietàAnimali)
        })

        ConfigurazioneAmbito.aggiungiGaranzia('attività di affittacamere e Bed & Breakfast')
        ConfigurazioneAmbito.aggiungiGaranzia('proprietà di cavalli ed altri animali da sella')
        ConfigurazioneAmbito.ClickButton("CONFERMA")

        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotDopo = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale dopo aver aggiunto le garanzie: ' + premioTotDopo)
        })

        cy.pause()
        
    })

    it("Verifica premio totale in Dashboard dopo variazioni ambito 'Responsabilità Civile'", ()=>{
        Dashboard.verificaPremio(premioTotPrima, premioTotDopo, premioRC_Affittacamere + premioRC_ProprietàAnimali)
        cy.pause()
    })

    it("Seleziona frazionamento", ()=>{
        Ultra.selezionaFrazionamento(frazionamento)
        cy.pause()
    })

    it("Salva Quotazione e Condividi", () => {
        //cy.pause()
        Dashboard.salvaQuotazione()
        Dashboard.condividiQuotazione('Catastrofi naturali')
        //Dashboard.ClickButton('PROCEDI')
        //cy.pause()
    })

    it("Procedi", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
        //Riepilogo.caricamentoRiepilogo()
        cy.pause()
    })

    it("Verifica presenza Oggetti in Dati Quotazione", () => {
        DatiQuotazione.verificaPresenzaOggetto(defaultCasa.Nome)
        DatiQuotazione.verificaPresenzaOggetto(modificheAnimale.Nome)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
        cy.pause()
    })

    it("Verifica ambiti in Riepilogo", () => {
        ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI
        Riepilogo.verificaAmbito(ambitoUltra.FABBRICATO, defaultCasa.Nome, soluzione.TOP, '1', '')
        Riepilogo.verificaAmbito(ambitoUltra.RESPONSABILITA_CIVILE, defaultCasa.Nome, soluzione.PREMIUM, '1', '')
        Riepilogo.verificaAmbito(ambitoUltra.ANIMALI_DOMESTICI, modificheAnimale.Nome, soluzione.ESSENTIAL, '1', '')
        cy.pause()
    })

})