/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Ultra from "../../mw_page_objects/ultra/Ultra"
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

//#endregion

//#region  variabili iniziali
var cliente = ""
var clienteUbicazione = ""
var frazionamento = "annuale"
var ambiti = ['Fabbricato', 'Contenuto', 'Animali domestici']
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
        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP')
    })
     
    it("Verifica valori default FQ", () => {
        //cy.pause()
        UltraBMP.VerificaDefaultFQ(defaultFQ)
    })

    it("Modifica valori FQ", () => {
        //cy.pause()
        UltraBMP.ModificaValoriFQ(valoriIns)
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