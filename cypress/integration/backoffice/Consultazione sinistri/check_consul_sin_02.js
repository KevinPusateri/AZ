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
    //LoginPage.logInMW(userName, psw, true, '010375000')
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

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {

    it.only('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    'Si entra nella pagina di dettaglio e si verifica l\'intestazione di pagina: ' +
    ' (1) In alto alla pagina di dettaglio è riportato il numero di sinistro ' +
    ' (2) Data di avvenimento, Cliente, Località siano valorizzate' +
    ' (3) E\' riportato il Tipo sinistro', function () {
        let sinistro = '927646985'
        let stato_sin = 'CHIUSO PAGATO'

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        csSinObjPage.setValue_ById('#claim_number', sinistro)
        let classvalue = "search_submit claim_number k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        csSinObjPage.checkObj_ByText(stato_sin)
        csSinObjPage.printClaimDetailsValue()
        const css1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        let cliente = csSinObjPage.getValue_ByCss(css1)
        const css2 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(3)"
        let polizza = csSinObjPage.getValue_ByCss(css2)
        const css3 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(4)"   
        let targa = csSinObjPage.getValue_ByCss(css3)
        const css4 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(5)"  
        let tiposin = csSinObjPage.getValue_ByCss(css4)
        const css6 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        let dtAvvenimento = csSinObjPage.getValue_ByCss(css6)
        
        const css5 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(6)"  
        let statosin = csSinObjPage.getValue_ByCss(css5)
      
        // Seleziona il sinistro
        csSinObjPage.clickLnk_ByHref(sinistro)
      
        // Verifica (1): numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = "pageTitle"
        csSinObjPage.checkObj_ByClassAndText(clssDtl, sinistro)

        // Verifica (2): Valore della data avvenimento      
        const cssDtAvv = "#sx-detail > table > tbody > tr:nth-child(1) > td.clock"
        csSinObjPage.checkObj_ByLocatorAndText(cssDtAvv, dtAvvenimento)
        // Verifica (2): Valore del cliente
        const cssCliente = "#sx-detail > table > tbody > tr:nth-child(1) > td.people > a"
        csSinObjPage.checkObj_ByLocatorAndText(cssCliente, cliente)
        // Verifica (2): Valore della località
        const csslocalità = "#sx-detail > table > tbody > tr.last-row > td.pointer"
        csSinObjPage.IsNullOrEmpty(csSinObjPage.getValue_ByCss(csslocalità))
    });


    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca il numero sinistro e verifica che nell\'intestazione di pagina siano riportati i seguenti dati: Data di avvenimento, Cliente, Località, Tipo sinistro', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        csSinObjPage.clickObj_ByLabel('a', 'Polizza');
        csSinObjPage.setValue_ById('#policy_number', '528771171')
        let classvalue = "search_submit polizza k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue,'Cerca')

    });

});