/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Convenzioni from "../../mw_page_objects/UltraBMP/Convenzioni"
import AreaRiservata from "../../mw_page_objects/UltraBMP/AreaRiservata"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
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

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { modificheAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'
import { soluzione } from '../../fixtures//Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures//Ultra/BMP_Comune.json'
import { daVerificareFAMod } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareFADef } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareRC } from '../../fixtures//Ultra/BMP_Caso1.json'


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

describe('Ultra BMP : Aggiunta fabbricato', function() {

    it('Seleziona Ultra BMP', () => {
        TopBar.clickSales()
        //cy.pause()
        //BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP')
        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio')
        UltraBMP.ClickButton('SCOPRI LA PROTEZIONE')
    })
     
    /*
    it("Verifica valori default FQ", () => {
        //cy.pause()
        UltraBMP.VerificaDefaultFQ(defaultFQ)
        UltraBMP.ClickButton('SCOPRI LA PROTEZIONE')
    })
    */

    /*
    it("Modifica valori FQ", () => {
        //cy.pause()
        UltraBMP.ModificaValoriFQ(valoriIns)
        UltraBMP.getButton('SCOPRI LA PROTEZIONE')
    })
    */
    
    it("Seleziona ambiti", () => {
        cy.log('Seleziona ambito')
        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.log('RICERCA AMBITO: ' + ambiti[i])
            //cy.pause()
            UltraBMP.SelezionaAmbito(ambiti[i])
        }
    })
    
    /*
    it("Aggiungi Ambito 'Fabbricato'", () => {
        cy.log("AGGIUNGI AMBITO - 'Fabbricato'")
        //cy.pause()
        UltraBMP.AggiungiAmbito('Fabbricato')
    })
    */

    /*
    it("Aggiungi Ambito 'Fabbricato'", () => { 
        cy.log("AGGIUNGI AMBITO - 'Fabbricato'")
        //cy.pause()
        UltraBMP.AggiungiAmbito('Fabbricato')
        //ConfigurazioneAmbito.
    })
    */

    it("Cambia Soluzioni", () => {
        //cy.pause()
        Ultra.modificaSoluzioneHome(ambitoUltra.FABBRICATO, soluzione.TOP)
        Ultra.modificaSoluzioneHome(ambitoUltra.RESPONSABILITA_CIVILE, soluzione.PREMIUM)
        Ultra.modificaSoluzioneHome(ambitoUltra.ANIMALI_DOMESTICI, soluzione.ESSENTIAL)
    })

    it("Salva Quotazione", () => {
        cy.pause()
        Dashboard.salvaQuotazione()
        cy.pause()
    })
    



    it("Accesso Dati Quotazione da menù", ()=>{
        cy.pause()
        UltraBMP.SelezionaVoceMenuPagAmbiti('Dati quotazione')
        //cy.pause()
        DatiQuotazione.VerificaDefaultCasa('Casa 1', daVerificareCasa, defaultCasa)
        DatiQuotazione.VerificaDefaultAnimaleDomestico('Animale domestico 1', daVerificareAnimale, defaultAnimale)
        cy.pause()
        DatiQuotazione.ModificaValoriCasa('Casa 1', daModificareCasa, modificheCasa)
        cy.pause()
        DatiQuotazione.ModificaValoriAnimaleDomestico('Animale domestico 1', daModificareAnimale, modificheAnimale)
        DatiQuotazione.ClickButton("CONFERMA")
    })
    

    it("Accesso Configurazione ambito 'Fabbricato'", ()=>{
        cy.pause()
        UltraBMP.ClickMatita("Fabbricato", "Casa 1")

        ConfigurazioneAmbito.VerificaDefaultCasa(daVerificareFAMod, modificheCasa)
        ConfigurazioneAmbito.VerificaDefaultCasa(daVerificareFADef, defaultCasa)
        //ConfigurazioneAmbito.VerificaDefaultAnimaleDomestico(daModificareAnimale, modificheAnimale)
        ConfigurazioneAmbito.verificaSoluzioneSelezionata(soluzione.TOP)
        //cy.pause()
        //ConfigurazioneAmbito.leggiPremio('totale')     <=== DA FARE VERIFICA PREMI
        cy.pause()
        ConfigurazioneAmbito.aggiungiGaranzia('Danni da fenomeno elettrico')
        ConfigurazioneAmbito.ClickButton("CONFERMA")

        cy.pause()
        
    })

    /*
    it("Aggiungi Ambito 'Contenuto'", () => { 
        cy.log("AGGIUNGI AMBITO - 'Contenuto'")
        //cy.pause()
        UltraBMP.AggiungiAmbito('Contenuto')
    })
    */
    
    /*
    it("Accesso Area Riservata - Applica sconto ", ()=>{
        cy.pause()
        UltraBMP.SelezionaVoceMenuPagAmbiti('Area riservata')
        AreaRiservata.ApplicaSconto()
    })
    */

    /*
    it("Accesso Convenzioni - Seleziona convenzione ", ()=>{
        cy.pause()
        UltraBMP.SelezionaVoceMenuPagAmbiti('Convenzioni')
        //Convenzioni.ClickTab('Codici speciali')
        //Convenzioni.ClickTab('Convenzioni')
        //Convenzioni.ChiudiFinestra()
        Convenzioni.SelezionaConvenzione("Sky")
        Convenzioni.RimuoviConvenzione()
        Convenzioni.ClickButton('Annulla')
        //Convenzioni.ClickButton('Conferma')
    })
    */

    /*
    it("Accesso Configurazione Ambito da matita", ()=>{
        cy.pause()
        UltraBMP.ClickMatita('Fabbricato')
        //UltraBMP.ClickMatita('Fabbricato', 'Casa 2')
    })
    */

    /*
    it("Seleziona fonte", ()=>{
        cy.pause()
        Ultra.selezionaFonteRandom()
    })
    */

    it("Seleziona frazionamento", ()=>{
        Ultra.selezionaFrazionamento(frazionamento)
    })

    it("Modifica soluzione per Fabbricato", ()=>{
        Ultra.modificaSoluzioneHome('Fabbricato', 'Top')
    })
    
    it("Modifica soluzione per Contenuto", ()=>{
        Ultra.modificaSoluzioneHome('Contenuto', 'Essential')
        cy.pause()
    })
})