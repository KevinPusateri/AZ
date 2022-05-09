/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
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

let today = new Date()
today.setDate(today.getDate() + 1)
let dataInizio = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear()
today.setMonth(today.getMonth() + 1)
let dataFine = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 2)).slice(-2) + '/' + today.getFullYear()


//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
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

describe('Matrix Web : Sfera 4.0 AVIVA', function () {

    it('Verifica Filtro Fonti e Filtro Agenzie Tutte Selezionate', options, function () {
        Sfera.fontiAllSelezionati()
        Sfera.agenzieAllSelezionati()
    })

    it('Verifica rimozione AZPay', options, function () {
        Sfera.setDateEstrazione()
        Sfera.estrai()
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
        Sfera.checkLinkMenu('Crea e invia codici AzPay')
    })

    it('Verifica Tasto Azioni Veloci Cluster Sinistrose', options, function () {
        Sfera.setDateEstrazione()
        Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.SINISTROSE)
        Sfera.checkVoceAzioniVeloci(Sfera.CLUSTERMOTOR.SINISTROSE)
    })

    it('Verifica Lob', options, function () {
        Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
    })

    it('Verifica incasso T2 motor', options, function () {
        Sfera.setDateEstrazione(false, dataInizio, dataFine)
        Sfera.estrai()
        Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, true, null, null, null, true)
    })

    it('Verifica verifica menu contestuale - Assenza link Vita', options, function () {
        Sfera.espandiPannello()
        Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)
        Sfera.checkVociMenuNotExist(Sfera.VOCIMENUEMISSIONE.SERVIZIO_CONSULENZA_VITA)
    })

})