/**
 * @author Sandra Espeche <sandra.marina.espeche@allianz.it>
 
*/
/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/sandra_objmw/Sales"   

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 70000)

//#endregion

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )
        LoginPage.logInMWAdvanced()
    })
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
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion

})


describe('Matrix Web : Navigazioni da Sales', function () {

    it('Verifica aggancio Sales', function () {
        TopBar.clickSales()
        cy.wait(6000)
    })

    it('Verifica presenza dei collegamenti rapidi', function () {
       TopBar.clickSales()
       cy.wait(5000)
        Sales.checkExistLinksCollegamentiRapidi()
       cy.wait(5000)

    })

  /*  it('Verifica aggancio Nuovo Sfera', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.clickLinkRapido('Nuovo Sfera')
            Sales.backToSales()
        } else this.skip()
    })
*/
    it('Verifica aggancio Sfera', function () {
        TopBar.clickSales()
        cy.wait(5000)
        Sales.clickLinkRapido('Sfera')
        cy.wait(5000)
        Sales.backToSales()
    })

   
   

});