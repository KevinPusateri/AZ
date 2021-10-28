/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *  const userName = 'TUTF012'
*  const psw = 'P@ssw0rd!'
 * @description Selezionando 'Sinistri/Movimentazione sinistri'
 *  Lo script esegue una sequenza di test su tale pagina
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
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

describe('Matrix Web - Sinistri>>Movimentazione: Test di verifica sulla movimentazione sinistri', () => {
    
    it('Atterraggio su BackOffice >> Movimentazioni Sinistri: controllo sul totale dei movimenti', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri')
        
        const mvSinObjPage = Object.create(MovimentazioneSinistriPage)
       
        mvSinObjPage.compareTotMovimenti()
    });
    
    it.only('Atterraggio su BackOffice >> Movimentazioni Sinistri: selezionando un sinistro in stato Pagato, in tabella sono sempre valorizzati i campi: Tipo Danno e Cld/Liquidatore' , function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri')
        
        const mvSinObjPage = Object.create(MovimentazioneSinistriPage)
       
        mvSinObjPage.clickBtn_ById('#CmddettaglioPagati')        
    });


    it('Matrix Web - Sinistri>>Movimentazione: Verifica dell\'atterraggio di pagina sui dettagli della movimentazione sinistri', function () {  
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri')
        
        const mvSinObjPage = Object.create(MovimentazioneSinistriPage)
       
        mvSinObjPage.clickBtn_ById('#CmddettaglioDenunciati')
        mvSinObjPage.clickBtn_ById('#CmdEsci')
        
        mvSinObjPage.clickBtn_ById('#CmddettaglioAperti')
        mvSinObjPage.clickBtn_ById('#CmdEsci')
        
        mvSinObjPage.clickBtn_ById('#CmddettaglioTrasferiti')
        mvSinObjPage.clickBtn_ById('#CmdEsci')
        
        mvSinObjPage.clickBtn_ById('#CmddettaglioChiusiSS')
        mvSinObjPage.clickBtn_ById('#CmdEsci')
        
        mvSinObjPage.clickBtn_ById('#CmddettaglioPagati')
        mvSinObjPage.clickBtn_ById('#CmdEsci')

        mvSinObjPage.clickBtn_ById('#CmddettaglioPeriziati')
        mvSinObjPage.clickBtn_ById('#CmdEsci')
    });
    
});


