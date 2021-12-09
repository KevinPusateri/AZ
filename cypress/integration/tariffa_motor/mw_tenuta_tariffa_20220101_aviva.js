/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
import Sales from "../../mw_page_objects/navigation/Sales"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import TenutaTariffa from "../../mw_page_objects/tenutaTariffa/TenutaTariffa"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { tariffaCases } from '../../fixtures/tariffe/tariffaCases_20220101_aviva.json'
//#endregion
before(() => {
    //! UTILIZZARE CHROME PER IL TIPO DI TEST E PER LA POSSIBILITA' DI ANDARE IN AMBIENTE DI TEST E PREPROD
    expect(Cypress.browser.name).to.contain('chrome')
    
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

// after(function () {
//     TopBar.logOutMW()
//     //#region Mysql
//     cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//         let tests = testsInfo
//         cy.finishMysql(dbConfig, insertedId, tests)
//     })
//     //#endregion
// })

describe('Tenuta Tariffa Gennaio 2022 : ', function () {
    tariffaCases.forEach((currentCase, k) => {
        it(`Case ${k + 1} ` + currentCase.Descrizione_Settore, function () {
            if (currentCase.Identificativo_Caso !== 'SKIP') {

                Common.visitUrlOnEnv()
                TopBar.clickSales()
                Sales.clickLinkOnEmettiPolizza('Preventivo Motor')

                TenutaTariffa.compilaDatiQuotazione(currentCase)
                TenutaTariffa.compilaContraenteProprietario(currentCase)
                TenutaTariffa.compilaVeicolo(currentCase)
                TenutaTariffa.compilaProvenienza(currentCase)
                TenutaTariffa.compilaOfferta(currentCase)
                TenutaTariffa.checkTariffa(currentCase)
            }
            else
                this.skip()
        });
    });
})