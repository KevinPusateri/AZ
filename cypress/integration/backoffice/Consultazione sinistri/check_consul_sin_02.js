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
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"

//#region Username Variables
const userName = 'TUTF012'
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
    //LoginPage.logInMW(userName, psw, true, '010375000')
    LoginPage.logInMW(userName, psw, false)
    TopBar.clickBackOffice()
    BackOffice.clickCardLink('Consultazione sinistri')
})

beforeEach(() => {
    cy.preserveCookies()
    //Common.visitUrlOnEnv()
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

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {

    it.only('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    'Si entra nella pagina di dettaglio e si verifica l\'intestazione di pagina: ' +
    ' (1) In alto alla pagina di dettaglio è riportato il numero di sinistro ' +
    ' (2) La Data di avvenimento, Cliente, Località sono valorizzate' +
    ' (3) E\' riportato il Tipo sinistro', function () {
        var sinistro = '927646985'
        var stato_sin = 'CHIUSO PAGATO'

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        csSinObjPage.putValue_ById('#claim_number', sinistro)
        csSinObjPage.clickBtn_ByClassAndText('claim_number', 'Cerca')
        csSinObjPage.checkVisibleTextValue(stato_sin)
        csSinObjPage.printClaimDetailsValue()
        var cliente = csSinObjPage.getValueInClaimDetails(1)
        var polizza = csSinObjPage.getValueInClaimDetails(2)       
        var tiposin = csSinObjPage.getValueInClaimDetails(4)
        var statosin = csSinObjPage.getValueInClaimDetails(5)
        var dtAvvenimento = csSinObjPage.getValueInClaimDetails(6)
        csSinObjPage.clickSelectClaim(sinistro)
        // Verifica (1)
        csSinObjPage.checkVisibleClaimNumberInPageDetails(sinistro)
        // Verifica (2)
    });


    it('Atterraggio su BackOffice >> Consultazione Sinistri: Ricerca il numero sinistro e verifica che nell\'intestazione di pagina siano riportati i seguenti dati: Data di avvenimento, Cliente, Località, Tipo sinistro', function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        csSinObjPage.clickObj_ByLabel('a', 'Polizza');
        csSinObjPage.putValue_ById('#policy_number', '528771171')
        csSinObjPage.clickBtn_ByClassAndText('polizza', 'Cerca')

    });

});