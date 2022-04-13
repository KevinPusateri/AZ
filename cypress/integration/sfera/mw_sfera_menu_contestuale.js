/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
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
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        Sfera.accediSferaDaHomePageMW()
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

describe('Matrix Web : Sfera 4.0 - Menu Contestuale', function () {
    context('Motor > Menu Quietanza', () => {

        it.only('Estrazione Quietanze Motor Da Lavorare (In mora)', () => {
            Sfera.selezionaPortafoglio(false, Sfera.PORTAFOGLI.MOTOR)
            Sfera.setDateEstrazione()
            Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
            Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.IN_MORA, true)
        })

        it('Incasso', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, false)
        })

        it('Delta premio', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.DELTA_PREMIO, false)
        })

        it('Riduzione premi > Variazione riduzione premi', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.VARIAZIONE_RIDUZIONE_PREMI, false)
        })

        it('Stampa senza incasso', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.STAMPA_SENZA_INCASSO, false)
        })

        it.only('Riquietanzamento per clienti valori extra', function () {
            cy.pause()
        })

        it('Riduzione premi > Consolidamento Riduzione Premi', function () {
        })

        it('Generazione avviso', function () {
        })


    })
})