/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Emissione denuncia di un sinistro motor avente come copertura 
 * di garanzia la "Eventi Naturali - Grandine"
 */


/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import DenunciaBMP from "../../../mw_page_objects/backoffice/DenunciaBMP"
import { isDate } from "lodash"


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

// #region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced({
            "agentId": "ARCZULIANELLO",
            "agency": "010319000"
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

//#region Script Variables
const IFrameParent = '[class="iframe-content ng-star-inserted"]'
/*
var ramo_pol = '31-Globale Auto'
var cliente_cognome = 'Toccane'
var cliente_nome = 'Francesco'
var cliente_dt_nascita = '25/03/1983'
var cliente_num_pol = '79323432'
var cliente_targa = 'DS246AT'
*/
var ramo_pol = '31' //601 - BONUS/MALUS
var cliente_cognome = 'VERDE'
var cliente_nome = 'Alessio'
var cliente_dt_nascita = '10/11/2003'
var cliente_num_pol = '755065526'
var cliente_email = 'f.ninno@allianz.it'

var copertura_danno = 'ULTRA CASA'

var sinistro_veicoli_coinvolti = '1'
var sinistro_descrizione_danno = 'Danneggiamento da grandine'
var sinistro_località = 'GORIZIA'

var tipo_danno = 'Eventi Naturali'

let dtAvvenimento
let dtDenuncia
let controparte_marca
let idx_cop_gar
//#endregion

describe('Matrix Web - Sinistri>>Denuncia: Emissione denuncia di un sinistro motor avente come copertura' +
' di garanzia la "' + copertura_danno + '"', () => {

    it('Atterraggio su BackOffice >> Denuncia BMP', function () {
        TopBar.clickBackOffice()
        cy.wait(1000)
        BackOffice.clickCardLink('Denuncia BMP') 
        cy.wait(1000)    
    });        

    it('Denuncia --> Ricerca cliente per numero di polizza: ' + cliente_num_pol, function () {
        // Ricerca cliente per Polizza
        DenunciaBMP.setValue_ById('#keyword', cliente_cognome + " " + cliente_nome);
        let classvalue = "input__icon nx-icon--s ndbx-icon nx-icon--search"
        Common.clickByIdOnIframe("[name='search']")
        let btn_class= "nx-button__content-wrapper"
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')
        //
        cy.wait(1000)
        cy.screenshot('Pagina Ricerca cliente -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    
});