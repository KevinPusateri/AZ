/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
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

const ambitoUltra = {
  FABBRICATO: "Fabbricato",
  CONTENUTO: "Contenuto",
  CATASTROFI_NATURALI: "Catastrofi naturali",
  RESPONSABILITA_CIVILE: "Responsabilit",       // Responsabilità civile
  TUTELA_LEGALE: "Tutela legale",
  ANIMALI_DOMESTICI: "Animali domestici",
}

const soluzione = {
  ESSENTIAL: "Essential",
  PLUS: "Plus",
  PREMIUM: "Premium",
  TOP: "Top",
}

  
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { modificheAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'

//#endregion

//#region  variabili iniziali
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
    

    /*
    it("Accesso Dati Quotazione da menù", ()=>{
        UltraBMP.SelezionaVoceMenuPagAmbiti('Dati quotazione')
        //cy.pause()
        DatiQuotazione.VerificaDefaultCasa('Casa 1', daVerificareCasa, defaultCasa)
        DatiQuotazione.VerificaDefaultAnimaleDomestico('Animale domestico 1', defaultAnimale)
        cy.pause()
        DatiQuotazione.ModificaValoriCasa('Casa 1', modificheCasa)
        //cy.pause()
        DatiQuotazione.ModificaValoriAnimaleDomestico('Animale domestico 1', modificheAnimale)
        DatiQuotazione.ClickButton("CONFERMA")
    })
    */
    it("Accesso Dati Quotazione da menù", ()=>{
        cy.pause()
        UltraBMP.SelezionaVoceMenuPagAmbiti('Dati quotazione')
        //cy.pause()
        DatiQuotazione.VerificaDefaultCasa('Casa 1', daVerificareCasa, defaultCasa)
        DatiQuotazione.VerificaDefaultAnimaleDomestico('Animale domestico 1', defaultAnimale)
        cy.pause()
        DatiQuotazione.ModificaValoriCasa('Casa 1', daModificareCasa, modificheCasa)
        cy.pause()
        DatiQuotazione.ModificaValoriAnimaleDomestico('Animale domestico 1', daModificareAnimale, modificheAnimale)
        DatiQuotazione.ClickButton("CONFERMA")
    })

    it("Accesso Configurazione ambito 'Fabbricato'", ()=>{
        cy.pause()
        UltraBMP.ClickMatita("Fabbricato", "Casa 1")
        
    })

})