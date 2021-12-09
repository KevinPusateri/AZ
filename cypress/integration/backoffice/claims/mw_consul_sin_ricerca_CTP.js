/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Selezionando 'Sinistri/Consulatazione sinistri '
 *  Lo script esegue una sequenza di test su tale pagina
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"


//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[2].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )
        LoginPage.logInMWAdvanced({
            "agentId": "ARALONGO7",
            "agency": "010375000"
        })
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
    })
})

beforeEach(() => {
    cy.preserveCookies()
    //Common.visitUrlOnEnv()
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
     Cypress.runner.stop();
})


describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistri per CTP', () => {
    // DATI DEL TEST (Per la verifica selezionare un sinistro con controparte)
    const numsin = "927646985"
    const numpol = "528771171"
    const targa_assicurato = "EN813ZW"
    const nome_assicurato = "LUCA"
    const cognome_assicurato = "MASET"
    const cf_assicurato = "MSTLCU83L27C957U"
    const targa_CTP = "FJ220KA"
    const nome_CTP = "GERALD"
    const cognome_CTP = "VIVAN"
    const cf_CTP = "VVNGLD86A14Z222H"
    const dt_avv = "11/07/2020"

    const lblnumsin = "k-grid-content"
    

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per targa controparte ', function () {
               
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Targa CTP')
        ConsultazioneSinistriPage.setValue_ById('#plateCTP', targa_CTP)
        let classvalue = "search_submit targaCTP k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')        
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numsin)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numpol)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, targa_assicurato)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, dt_avv)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per dati anagrafici della CTP persona fisica ', function () {
         
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Dati Anagrafici CTP')
        ConsultazioneSinistriPage.setValue_ById('#cognomeCTP','')
        ConsultazioneSinistriPage.setValue_ById('#nomeCTP','')
        ConsultazioneSinistriPage.setValue_ById('#cognomeCTP', cognome_CTP)
        ConsultazioneSinistriPage.setValue_ById('#nomeCTP', nome_CTP)
        ConsultazioneSinistriPage.setValue_ById('#data_daCTP', dt_avv)
        ConsultazioneSinistriPage.setValue_ById('#data_aCTP', dt_avv)
        let classvalue = "search_submit anagraficaCTP k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, cognome_CTP)       
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, nome_CTP) 

        const locRArrow = "#results > div.k-grid-content > table > tbody > tr:nth-child(1) > td:nth-child(5) > a"
        ConsultazioneSinistriPage.clickBtn_ById(locRArrow)
        
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numsin)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numpol)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, targa_assicurato)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, dt_avv)
    });
    
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per codice fiscale del CTP persona fisica ', function () {
      
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Dati Anagrafici CTP')
        ConsultazioneSinistriPage.setValue_ById('#cognomeCTP','')
        ConsultazioneSinistriPage.setValue_ById('#nomeCTP','')
        ConsultazioneSinistriPage.setValue_ById('#cfCTP', '')
        ConsultazioneSinistriPage.setValue_ById('#cfCTP', cf_CTP)
        ConsultazioneSinistriPage.setValue_ById('#data_daCTP', dt_avv)
        ConsultazioneSinistriPage.setValue_ById('#data_aCTP', dt_avv)
        let classvalue = "search_submit anagraficaCTP k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')        
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, cf_CTP) 
        
        const locRArrow = "#results > div.k-grid-content > table > tbody > tr:nth-child(1) > td:nth-child(5) > a"
        ConsultazioneSinistriPage.clickBtn_ById(locRArrow)
             
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numsin)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numpol)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, targa_assicurato)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, dt_avv)
    });

});