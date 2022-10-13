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

import Dashboard from "../../../mw_page_objects/UltraBMP/Dashboard"
import Preferiti from "../../../mw_page_objects/UltraBMP/Preferiti"
import PersonaFisica from "../../../mw_page_objects/common/PersonaFisica"
import Portafoglio from "../../../mw_page_objects/clients/Portafoglio"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"

//#region Mysql DB Variables
//const testName = Cypress.spec.name.split('.')[2].split('.')[0].toUpperCase()
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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
        LoginPage.logInMWAdvanced({         
            "agency": "010375000",
            "agentId": "ARALONGO7"
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
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

//#region  variabili iniziali
let cliente = PersonaFisica.MonicaSant()
let sinistro = '927646275'
let stato_sin = 'CHIUSO PAGATO'
let prodotto = "31 - Bonus malus auto"
let targa = "CV366SA"
let polizza = "1-78794122"
let dtAvvenimento = "17 gen 2020"
let dtDenuncia = "20 gen 2020"
let dtChiusura = "25 feb 2021"
let liquidato = "12.031,76 €"
//#endregion variabili iniziali

describe('Matrix Web - Ricerca e verifica sinistro chiuso/pagato, da Cliente-->Portafoglio-->Sinistri', () => {                
    it("Ricerca cliente con sinistro chiuso pagato", () => {
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(cliente.cognomeNome()).type('{enter}')
            cy.get('lib-client-item').first().click()
        }).then(($body) => {
            cy.wait(7000)
            const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            //const check = cy.get('div[class="client-null-message"]').should('be.visible')
            cy.log('permessi: ' + check)
            if (check) {
                cy.get('input[name="main-search-input"]').type(cliente).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })      
    })

    it("Accesso alla sezione Portafoglio-->Sinistri", () => {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Sinistri')             
    })

    it("Verifica i dati del sinistro", () => {
        Portafoglio.checkObj_ByLocatorAndText(".contract-number", sinistro)           
        Portafoglio.checkObj_ByLocatorAndText(".ng-star-inserted", stato_sin)
        Portafoglio.checkObj_ByLocatorAndText(".ng-star-inserted", prodotto)
        Portafoglio.checkObj_ByLocatorAndText(".ng-star-inserted", targa)
        Portafoglio.checkObj_ByLocatorAndText(".ng-star-inserted", polizza)
        Portafoglio.checkObj_ByLocatorAndText(".ng-star-inserted", dtAvvenimento)
        Portafoglio.checkObj_ByLocatorAndText(".ng-star-inserted", dtDenuncia)
        Portafoglio.checkObj_ByLocatorAndText(".ng-star-inserted", dtChiusura)
        Portafoglio.checkObj_ByLocatorAndText(".lib-format-numbers", liquidato) 
        cy.screenshot('Pagina Sezione Portafoglio --> Sinistri ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true }) 
    })
   
});
