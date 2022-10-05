/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sfera from "../../mw_page_objects/sfera/Sfera"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId


//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        })
    })
    let customImpersonification = {
        "agentId": "ARALONGO7",
        "agency": "010375000"
    }
    LoginPage.logInMWAdvanced(customImpersonification)
})

beforeEach(() => {
    cy.preserveCookies()
})

// afterEach(function () {
//     if (this.currentTest.state !== 'passed') {
//         TopBar.logOutMW()
//         //#region Mysql
//         cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//             let tests = testsInfo
//             cy.finishMysql(dbConfig, insertedId, tests)
//         })
//         //#endregion
//         Cypress.runner.stop();
//     }
// })

// after(function () {
//     TopBar.logOutMW()
//     //#region Mysql
//     cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//         let tests = testsInfo
//         cy.finishMysql(dbConfig, insertedId, tests)
//     })
//     //#endregion
// })
//#endregion Before After

describe('Matrix Web : Sfera 4.0 - Gestione Viste - Revisione gestione denominazione', function () {

    it('Step 1 - Verifica caricamento Dati', function () {
        Sfera.accediSferaDaHomePageMW(true)
    })


    it('Step 2 - Verifica caricamento estrazione', function () {
        Sfera.estrai(true)
    })

    it('Step 3 - verifica apertura gestione colonne', function () {
        Sfera.checkAperturaGestioneColonne()
    })

    it('Step 4 - verifica trascinamento in verticale colonna destra gestisci colonne', function () {
        Sfera.dragAndDropColonne('Info', 0, 50)
    })

    it('Step 5 -  verifica trascinamento in orizzontale colonne', function () {
        Sfera.dragAndDropADDColonne('Cod. AZPay', 150, 100)
        Sfera.buttonApplicaSalva()
    })

    it('Step 6 - verifica salvataggio vista', function () {
        Sfera.nuovaVista('AutomaticiDrop')
        Sfera.checkColonnaSpostata(4, 'Info')
        Sfera.checkColonnaSpostata(5, 'Cod. AZPay')
        Sfera.selezionaVista(Sfera.VISTESUGGERITE.VISTA_STANDARD)
        Sfera.estrai(false)
        Sfera.checkAperturaGestioneColonne()
        Sfera.applicaSalvaVista('AutomaticiDrop')
        Sfera.checkColonnaSpostata(1, 'Info')
        Sfera.checkColonnaAssente('Cod. AZPay')
        Sfera.eliminaVista('AutomaticiDrop')
    })

})