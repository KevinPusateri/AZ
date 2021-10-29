/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgermenu/BurgerMenuSales"

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
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

after(function() {
    TopBar.logOutMW()
        //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion
})

describe('Matrix Web : Navigazioni da BackOffice', function() {

    it('Seleziona Ultra BMP', () => {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP')
    })
     
    /*
    it('Quotazione', () => {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            
            cy.get('div[class="nx-dropdown__container"]').first().then(($div)=>{
                cy.get('span').contains('appartamento').click()
            })

            //cy.get('div[class="nx-dropdown__container"]').first().find('span').contains('appartamento').should(be.visible)
            
        })
    })
    */
    
    
    it("Imposta valori quotazione", () => {
        UltraBMP.compilaDatiQuotazione()
    })
    
})