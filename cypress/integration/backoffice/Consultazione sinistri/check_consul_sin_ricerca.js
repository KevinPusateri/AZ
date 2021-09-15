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
    LoginPage.logInMW(userName, psw, false)
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

    const lblnumsin = "k-grid-content"
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per numero sinistro  ', function () {
    
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.setValue_ById('#claim_number', numsin)
        let classvalue = "search_submit claim_number k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per polizza assicurato  ', function () {
        
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Polizza');
        csSinObjPage.setValue_ById('#policy_number', numpol)
        let classvalue = "search_submit polizza k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per targa assicurato  ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Targa');
        csSinObjPage.setValue_ById('#plate', targa_assicurato)
        let classvalue = "search_submit targa k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per dati anagrafici del cliente persona fisica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.setValue_ById('#cognome', cognome_assicurato)
        csSinObjPage.setValue_ById('#nome', nome_assicurato)
        let classvalue = "search_submit anagrafica k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per codice fiscale del cliente persona fisica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.setValue_ById('#cognome','')
        csSinObjPage.setValue_ById('#nome','')
        csSinObjPage.setValue_ById('#cf', cf_assicurato)
        let classvalue = "search_submit anagrafica k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per targa controparte  ', function () {
        
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Targa CTP')
        csSinObjPage.setValue_ById('#plateCTP', targa_CTP)
        let classvalue = "search_submit targaCTP k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per dati anagrafici della controparte persona fisica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici CTP')
        csSinObjPage.setValue_ById('#cognomeCTP', cognome_CTP)
        csSinObjPage.setValue_ById('#nomeCTP', nome_CTP)
        let classvalue = "search_submit anagraficaCTP k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });
    
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per codice fiscale del CTP persona fisica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.setValue_ById('#cognomeCTP','')
        csSinObjPage.setValue_ById('#nomeCTP','')
        csSinObjPage.setValue_ById('#cfCTP', cf_assicurato)
        let classvalue = "search_submit anagrafica k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
        csSinObjPage.checkObj_ByClassAndText(lblnumsin, numsin)
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per denominazione del cliente come persona giuridica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.setValue_ById('#cf','')
        csSinObjPage.setValue_ById('#cognome','GIRASOLE INDUSTRIE')
        let classvalue = "search_submit anagrafica k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
    });

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca per codice fiscale / partita IVA del cliente persona giuridica ', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)   
        csSinObjPage.clickObj_ByLabel('a','Dati Anagrafici Cliente')
        csSinObjPage.setValue_ById('#cognome','')
        csSinObjPage.setValue_ById('#cf','04922730264')
        let classvalue = "search_submit anagrafica k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')
    });
});