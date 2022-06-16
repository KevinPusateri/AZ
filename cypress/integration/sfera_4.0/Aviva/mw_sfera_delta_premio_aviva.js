/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import Sfera from "../../../mw_page_objects/sfera/Sfera"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
//#endregion

//#region Before After
before(() => {
    Cypress.env('isAviva', true)
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced({
                "agentId": "AAMCIPRIANO",
                "agency": "140001960"
            })
            Sfera.accediSferaDaHomePageMW()
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
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
//#endregion Before After

describe('Matrix Web : Profilare la visualizzazione delle colonne tramite tabella di configurazione. Lo stesso per i cluster', function () {

    it('Accedere a Sfera 4.0 - Estrai con Corretto Caricamento Dati', options, function () {
        Sfera.setDateEstrazione()
        Sfera.estrai()
    })

    it('In colonne verificare sia presente la colonna Polizza e la colonna Polizza originale', options, function () {
        Sfera.checkColonnaPresente('Polizza')
        Sfera.checkColonnaPresente('Polizza originale')
    })

    it('Selezionare Viste Suggerite - "Delta premio - riduzione premio a cura dell\'agenzia"', options, function () {
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.DELTA_PREMIO)
    })
    
    it('Delta premio - Verificare corretta visualizzazione della vista selezionata con schermata riepilogativa in basso', options, function () {
        Sfera.selezionaRigaRandom()
        Sfera.verificaSezioneDeltaPremio()
    })
})