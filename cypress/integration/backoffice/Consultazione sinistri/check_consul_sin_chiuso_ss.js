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
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    //LoginPage.logInMW(userName, psw, true, '010375000')
    LoginPage.logInMW(userName, psw, false)
    TopBar.clickBackOffice()
    BackOffice.clickCardLink('Movimentazione sinistri')
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
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    ' Dalla pagina di dettaglio è verificato quanto segue: ' +
    ' Nella sezione "Pagamenti", cliccando sul pulsante di "Dettagli", si apre la POPUP "Dettaglio Pagamento" ' +
    ' verificare che le informazioni riferite a data pagamento, data invio banca, importo, valuta, causale, modalità di pagamento, Iban, tipo proposta e stato pagamento', function () {
             
        const mvSinObjPage = Object.create(MovimentazioneSinistriPage)
        mvSinObjPage.clickBtn_ById('#CmddettaglioChiusiSS')

        const locatorRow1 = "#cruscottoDettaglioGridR2_Div"
        mvSinObjPage.clickRow_ByIdAndRow(locatorRow1)

        


        mvSinObjPage.clickBtn_ById('#CmdConsultazione')

        cy.window().then(win => {
            cy.stub(win, 'open').callsFake((url) => {
                return win.open.wrappedMethod.call(win, url, '_self');
            }).as('Open');
        });

        mvSinObjPage.clickBtn_ById('#torna')
  /* 
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        const xpathDettaglioPagamento = "#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > a"
        csSinObjPage.clickBtn_ById(xpathDettaglioPagamento)

       
              
          cy.get('@Open').wait(3000) 
          cy.find('.accordion').should('be.visible').invoke('text')  // for input or textarea, .invoke('val')
          .then(text => {         
              cy.log('>> read the value: ' + text)
          })
       */
        mvSinObjPage.clickBtn_ById('#CmdEsci')
    });
});
