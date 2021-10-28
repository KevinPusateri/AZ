/**
 * @author Sandra Espeche <sandra.marina.espeche@allianz.it>
 
*/
/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/mw_sandra_obj/S_sales"   

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

  
  
    it('Verifica la presenza dei link su "Emetti Polizza"', function () {
        TopBar.clickSales()
        cy.wait(10000)
        Sales.checkLinksOnEmettiPolizza()
        cy.wait(10000)

    })

    it('Verifica aggancio Emetti Polizza - Preventivo Motor', function () {
       TopBar.clickSales()
        cy.wait(3000)
        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
        cy.wait(6000)
       // Sales.backToSales()
    })


})

