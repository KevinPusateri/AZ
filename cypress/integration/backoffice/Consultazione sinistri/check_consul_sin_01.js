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

//#region Username Variables
const userName = 'TUTF012'
const psw = 'P@ssw0rd!'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    LoginPage.logInMW(userName, psw)
    TopBar.clickBackOffice()
    BackOffice.clickCardLink('Consultazione sinistri') 
})

beforeEach(() => {
    cy.preserveCookies()
    //Common.visitUrlOnEnv()
})

after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion
})


describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistri', () => {
    
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per numero sinistro  ', function () {
      
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.putValue_ById('#claim_number','927646985')
        csSinObjPage.clickBtn_ByClassAndText('claim_number','Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per polizza assicurato  ', function () {
        
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Polizza');
        csSinObjPage.putValue_ById('#policy_number','528771171')
        csSinObjPage.clickBtn_ByClassAndText('polizza','Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per targa assicurato  ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Targa');
        csSinObjPage.putValue_ById('#plate','EN813ZW')
        csSinObjPage.clickBtn_ByClassAndText('targa','Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per dati anagrafici del cliente persona fisica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.putValue_ById('#cognome','MASET')
        csSinObjPage.putValue_ById('#nome','LUCA')
        csSinObjPage.clickBtn_ByClassAndText('anagrafica','Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per codice fiscale del cliente persona fisica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.putValue_ById('#cognome','')
        csSinObjPage.putValue_ById('#nome','')
        csSinObjPage.putValue_ById('#cf','MSTLCU83L27C957U')
        csSinObjPage.clickBtn_ByClassAndText('anagrafica','Cerca')
    });
    
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per denominazione del cliente come persona giuridica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.putValue_ById('#cf','')
        csSinObjPage.putValue_ById('#cognome','GIRASOLE INDUSTRIE')
        csSinObjPage.clickBtn_ByClassAndText('anagrafica','Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per codice fiscale / partita IVA del cliente persona giuridica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.putValue_ById('#cognome','')
        csSinObjPage.putValue_ById('#cf','04922730264')
        csSinObjPage.clickBtn_ByClassAndText('anagrafica','Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per targa controparte  ', function () {
        
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Targa CTP')
        csSinObjPage.putValue_ById('#plateCTP','FJ220KA')
        csSinObjPage.clickBtn_ByClassAndText('targaCTP','Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per dati anagrafici della controparte persona fisica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici CTP')
        csSinObjPage.putValue_ById('#cognomeCTP','VIVAN')
        csSinObjPage.putValue_ById('#nomeCTP','GERALD')
        csSinObjPage.clickBtn_ByClassAndText('anagraficaCTP','Cerca')
    });
     
});