/**
* @author Sandra Espeche <sandra.marina.espeche@allianz.it>
*/

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
//import { contains } from "cypress/types/jquery"

//#region Username Variables
const userName = 'TUTF021'   // 'TUTF021'
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
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
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

describe('Buca di Ricerca - Risultati Clients', {
    retries: {
        runMode: 1,
        openMode: 0,
    }
}, function () {
   /* 

    HomePage.reloadMWHomePage()
    TopBar.search(currentClientPG.name)
    LandingRicerca.clickClientName(currentClientPG)
    SintesiCliente.checkAtterraggioSintesiCliente(currentClientPG.name)
   // TMTFRC52A41F205U 
*/


    it('Ricerca Cliente e Atterraggio in Sintesi Cliente', function () {
      //  TopBar.search('AUTOMATICI')
       LandingRicerca.searchRandomClient(true,'PF','P')
       LandingRicerca.clickFirstResult()
       //cy.wait(2000)
       SintesiCliente.clickAuto()
       //SintesiCliente.clickPreventivoMotor()
      // getIFrame().find('button:contains("NON CONOSCI LA TARGA?"):visible')
     //  cy.get('.cdk-overlay-container').find('button').contains('NON CONOSCI LA TARGA?').click()
      // cy.get('.cdk-overlay-container').find('Targa').type('AA345TG')
     //  cy.get('input').type('AA345TG')
      SintesiCliente.clickPassioneBlu()
       // SintesiCliente.checkAtterraggioSintesiCliente('AUTOMATICI')
    })
})