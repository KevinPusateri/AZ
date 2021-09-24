/**
* @author Sandra Espeche <sandra.marina.espeche@allianz.it>
*/

/// <reference types="Cypress" />
//import DatiPreventivo from "../../mw_page_objects/Motor/DatiPreventivo"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
//import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import DatiPreventivo from "../../mw_page_objects/Motor/DatiPreventivo"

//#region Username Variables
//const userName = 'TUTF017'   // 'TUTF021'
//const psw = 'P@ssw0rd!'
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
    cy.getUserWinLogin().then(data=> {
        cy.task('startMysql',  { dbConfig: dbconfig, testCaseName: testName, current 
            Env: currentEnv, currentUser: data.tutf}).then((results) => {
                insertedId=results.insertId
            })
            LoginPage.logInMWAdvanced()
        })
   // LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
   
    cy.preserveCookies()
    Common.visitUrlOnEnv()
})

after(function () {
  //  TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

})

describe('Ricerca per preventivo', {
    retries: {
        runMode: 1,
        openMode: 0,
    }
}, function () {
    it('Ricerca cliente per preventivo', function () {
              //  TopBar.search('AUTOMATICI')
       LandingRicerca.searchRandomClient(true,'PF','P')
       LandingRicerca.clickFirstResult()
       
      
       
       DatiPreventivo.clickAuto()
      //DatiPreventivo.clickPassioneBlu()
       DatiPreventivo.clickPreventivoMotor()
       
       DatiPreventivo.ClickCheckTarga()
      
       DatiPreventivo.clickAvanti()

       // SintesiCliente.checkAtterraggioSintesiCliente('AUTOMATICI')
    })
})