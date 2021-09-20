/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Selezionando 'Sinistri/Consulatazione sinistri'
 *  Lo script esegue una sequenza di test sulla pagina Consultazione sinistri / dati accessori
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"

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
    cy.getUserWinLogin().then(data => {
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })
        LoginPage.logInMWAdvanced()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
    })
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

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionare un sinistro in stato PAGATO/CHIUSO ' +
    ' per il quale non sia valorizzata alcune "Note di sinistro", "Azioni di recupero" e "Soggetti coinvolti".' +
    ' Verificando che in tal caso siano presenti le diciture standard: ' +
    ' "Nessuna nota presente", "Non sono presenti azioni di recupero" e "Nessun soggetto presente" rispettivamente per le sezioni precedenti ', function () {
        let sinistro = '929538074'
        let stato_sin = 'CHIUSO PAGATO'

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        csSinObjPage.setValue_ById('#claim_number', sinistro)
        let classvalue = "search_submit claim_number k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        csSinObjPage.checkObj_ByText(stato_sin)
        csSinObjPage.printClaimDetailsValue()

        const cssCliente1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        var cliente = csSinObjPage.getPromiseValue_ByCss(cssCliente1)
       
        const cssdtAvv1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        var dtAvvenimento = csSinObjPage.getPromiseValue_ByCss(cssdtAvv1)        

        // Seleziona il sinistro
        csSinObjPage.clickLnk_ByHref(sinistro)
      
        // Verifica : numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = "pageTitle"
        csSinObjPage.checkObj_ByClassAndText(clssDtl, sinistro)

        // Verifica (2): Valore della data avvenimento      
        const cssDtAvv2 = "#sx-detail > table > tbody > tr:nth-child(1) > td.clock"
        csSinObjPage.checkObj_ByLocatorAndText(cssDtAvv2, dtAvvenimento)
        // Verifica (2): Cliente
        const cssCliente2 = "#sx-detail > table > tbody > tr:nth-child(1) > td.people > a"
        csSinObjPage.checkObj_ByLocatorAndText(cssCliente2, cliente) 

        // Seleziona il link dati accessori
        csSinObjPage.clickLnk_ByHref("/dasinconfe/DatiAccessoriIngresso")

        csSinObjPage.checkObj_ByText("Nessuna nota presente")  
        
        csSinObjPage.checkObj_ByText("Non sono presenti azioni di recupero")

        csSinObjPage.checkObj_ByText("Nessun soggetto presente")
    });
    

});
