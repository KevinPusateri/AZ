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
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
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
const IframeMovSin = 'iframe[src=\"/dasincruscotto/cruscotto/cruscotto.jsp\"]'

describe('Matrix Web - Sinistri>>Movimentazione: Test di verifica sulla movimentazione sinistri', () => {
    
    it('Atterraggio su BackOffice >> Movimentazioni Sinistri', function () {      
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri') 
        cy.wait(1000) 
    });
    

    it('MW: Movimentazione  sinistri - \'Pagati\' corretta esposizione dei dati (numero sinistro, data movimentazione e data avvenimento)', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(4)
        cy.get('@x4').then((mov) => {                     
            cy.log('[it]>> idx[4 - Sinistri Pagati: '+mov); 
            if (parseInt(mov)>0)
            {
                Common.clickFindByIdOnIframeChild(IframeMovSin, '#CmddettaglioPagati') 
                cy.wait(2000)            
                MovimentazioneSinistriPage.analyzeClaimFields('#listaDettaglio_Table > tbody')
                cy.wait(2000)
                Common.clickFindByIdOnIframeChild(IframeMovSin, '#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    })

    it('MW: Movimentazione  sinistri - \'Periziati\' corretta esposizione dei dati (numero sinistro, data movimentazione e data avvenimento)', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(5)
        cy.get('@x5').then((mov) => {                     
            cy.log('[it]>> idx[5 - Sinistri Periziati: '+mov); 
            if (parseInt(mov)>0)
            {
                Common.clickFindByIdOnIframeChild(IframeMovSin, '#CmddettaglioPeriziati') 
                cy.wait(2000)            
                MovimentazioneSinistriPage.analyzeClaimFields('#listaDettaglio_Table > tbody')
                cy.wait(2000)
                Common.clickFindByIdOnIframeChild(IframeMovSin, '#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    })
});


