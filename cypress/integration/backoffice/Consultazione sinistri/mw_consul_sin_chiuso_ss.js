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
                    
        MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioChiusiSS')

        const locatorRow1 = "#cruscottoDettaglioGridR2_Div"        
        MovimentazioneSinistriPage.clickRow_ByIdAndRow(locatorRow1) 

         // Verifica (2): la valorizzazione del CLD
         const csscldDanneggiato = '#soggetti_danneggiati > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)'
         MovimentazioneSinistriPage.getPromiseValue_ByCss(csscldDanneggiato).then((val) => {
             let dscrpt = val.split(':')[1];        
             cy.log('[it]>> [CLD]: '+dscrpt);
             MovimentazioneSinistriPage.isNullOrEmpty(dscrpt).then((isNull) => {
                 if (!isNull)
                     assert.fail("[it]>> CLD non definito in pagina dettaglio sinistro");      
             });                            
         });

        // Verifica (2): Valore della località
        const csslocalità = "#sx-detail > table > tbody > tr.last-row > td.pointer "
        MovimentazioneSinistriPage.getPromiseValue_ByCss(csslocalità).then((val) => {
            let dscrpt = val.split(':')[1];            
            cy.log('[it]>> [Località]: '+dscrpt);
            MovimentazioneSinistriPage.isNullOrEmpty(dscrpt).then((isNull) => {
                if (!isNull)
                    assert.fail("[Località] non definita in pagina dettaglio sinistro");      
            });   
        });
       
       
                
    });
  

    it('Atterraggio su BackOffice >> Dalla pagina di dettaglio di un sinistro in stato CHIUSO SENZA SEGUITO, ' +
    'Aprendo la sezione Perizie si verifica che non ci siano incarichi di perizia e che sia riportata la dicitura : "Non ci sono incarichi di perizia" ' , function () {
           
        const xpathDettaglio = "#soggetti_danneggiati > div > div:nth-child(1) > a"
        MovimentazioneSinistriPage.clickBtn_ById(xpathDettaglio) 
        
        const xpathDettaglioPerizia = "#soggetti_danneggiati > div > div:nth-child(1) > div > div:nth-child(1) > div.item_content > p"
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText(xpathDettaglioPerizia, "Non ci sono incarichi di perizia")
    });
});
