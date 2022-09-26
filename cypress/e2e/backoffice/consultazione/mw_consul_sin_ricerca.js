/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Selezionando 'Sinistri/Consulatazione sinistri'
 *  Lo script esegue una sequenza di test su tale pagina
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"


//#region Mysql DB Variables
//const testName = Cypress.spec.name.split('.')[2].split('.')[0].toUpperCase()
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


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
     Cypress.runner.stop();
})


describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistri', () => {
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

    const lblnumsin = ".k-grid-content"

    it('Atterraggio su BackOffice >> Consultazione sinistri', function () {             
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
        cy.wait(1000);        
    });

    it('Consultazione Sinistri: Ricerca per numero sinistro  ', function () {
            
        ConsultazioneSinistriPage.setValue_ById('#claim_number', numsin)
        let classvalue = "search_submit claim_number k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        Common.isVisibleText(lblnumsin, numsin)
        Common.isVisibleText(lblnumsin, numpol)
        Common.isVisibleText(lblnumsin, targa_assicurato)
        Common.isVisibleText(lblnumsin, dt_avv)
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro per num sinistro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Consultazione Sinistri: Ricerca per polizza assicurato ', function () {
                
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Polizza');
        ConsultazioneSinistriPage.setValue_ById('#policy_number', numpol)
        let classvalue = "search_submit polizza k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        Common.isVisibleText(lblnumsin, numsin)
        Common.isVisibleText(lblnumsin, numpol)
        Common.isVisibleText(lblnumsin, targa_assicurato)
        Common.isVisibleText(lblnumsin, dt_avv)
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro per polizza assicurato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Consultazione Sinistri: Ricerca per targa assicurato  ', function () {
        
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Targa');
        ConsultazioneSinistriPage.setValue_ById('#plate', targa_assicurato)
        let classvalue = "search_submit targa k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        Common.isVisibleText(lblnumsin, numsin)
        Common.isVisibleText(lblnumsin, numpol)
        Common.isVisibleText(lblnumsin, targa_assicurato)
        Common.isVisibleText(lblnumsin, dt_avv)
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro per targa assicurato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Consultazione Sinistri: Ricerca per dati anagrafici del cliente persona fisica ', function () {
       
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        ConsultazioneSinistriPage.setValue_ById('#cognome', cognome_assicurato)
        ConsultazioneSinistriPage.setValue_ById('#nome', nome_assicurato)
        let classvalue = "search_submit anagrafica k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        Common.isVisibleText(lblnumsin, numsin)
        Common.isVisibleText(lblnumsin, numpol)        
        Common.isVisibleText(lblnumsin, targa_assicurato)
        Common.isVisibleText(lblnumsin, dt_avv)
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro per dati anagrafici del cliente persona fisica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Consultazione Sinistri: Ricerca per codice fiscale del cliente persona fisica ', function () {
       
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        ConsultazioneSinistriPage.setValue_ById('#cognome','')
        ConsultazioneSinistriPage.setValue_ById('#nome','')
        ConsultazioneSinistriPage.setValue_ById('#cf', cf_assicurato)
        let classvalue = "search_submit anagrafica k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')                
        Common.isVisibleText(lblnumsin, numsin)
        Common.isVisibleText(lblnumsin, numpol)
        Common.isVisibleText(lblnumsin, targa_assicurato)
        Common.isVisibleText(lblnumsin, dt_avv)
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro per codice fiscale del cliente persona fisica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Consultazione Sinistri: Ricerca per denominazione del cliente come persona giuridica ', function () {
       
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        ConsultazioneSinistriPage.setValue_ById('#cf','')
        ConsultazioneSinistriPage.setValue_ById('#cognome','GIRASOLE INDUSTRIE')
        let classvalue = "search_submit anagrafica k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        cy.wait(1000);
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro per denominazione del cliente persona giuridica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Consultazione Sinistri: Ricerca per codice fiscale / partita IVA del cliente persona giuridica ', function () {
        
        ConsultazioneSinistriPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        ConsultazioneSinistriPage.setValue_ById('#cognome','')
        ConsultazioneSinistriPage.setValue_ById('#cf','04922730264')
        let classvalue = "search_submit anagrafica k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        cy.wait(1000);
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro per codice fiscale / partita IVA del cliente persona giuridica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    
});