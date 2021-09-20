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
import MovimentazioneSinistriPage from "../../../mw_page_objects/backoffice/MovimentazioneSinistriPage"

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
    cy.getUserWinLogin().then(data => {
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })
        LoginPage.logInMWAdvanced()
        TopBar.clickBackOffice()
    BackOffice.clickCardLink('Movimentazione sinistri')
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

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO SENZA SEGUITO', () => {
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato CHIUSO SENZA SEGUITO ' +
    ' Dalla pagina di dettaglio è verificata la sezione INTESTAZIONE ed in particolare quanto segue: ' +
    ' (1) siano valorizzati i campi Località e CLD/Danneggiato ' , function () {
             
        const mvSinObjPage = Object.create(MovimentazioneSinistriPage)
        mvSinObjPage.clickBtn_ById('#CmddettaglioChiusiSS')

        const locatorRow1 = "#cruscottoDettaglioGridR2_Div"        
        mvSinObjPage.clickRow_ByIdAndRow(locatorRow1) 
       
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        // Verifica (2): Valore della località
        const csslocalità = "#sx-detail > table > tbody > tr.last-row > td.pointer"
        mvSinObjPage.getPromiseValue_ByCss(csslocalità)
        // Verifica (2): la valorizzazione del CLD
        const csscldDanneggiato = '#soggetti_danneggiati > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a'
        mvSinObjPage.getPromiseValue_ByCss(csscldDanneggiato)
       
        
    });
  

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato CHIUSO SENZA SEGUITO ' +
    'Analizzando la sezione Perizie e verifica che non sia presente la dicitura : "Non ci sono incarichi di perizia" ' , function () {
   
        const mvSinObjPage = Object.create(MovimentazioneSinistriPage)
        
        const xpathDettaglio = "#soggetti_danneggiati > div > div:nth-child(1) > a"
        mvSinObjPage.clickBtn_ById(xpathDettaglio) 
        
        const xpathDettaglioPerizia = "#soggetti_danneggiati > div > div:nth-child(1) > div > div:nth-child(1) > div.item_content > p"
        mvSinObjPage.checkObj_ByLocatorAndText(xpathDettaglioPerizia, "Non ci sono incarichi di perizia")

    });
});
