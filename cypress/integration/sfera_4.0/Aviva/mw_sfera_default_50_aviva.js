/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import Common from "../../../mw_page_objects/common/Common"
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

describe('Matrix Web : Default 50 righe', function () {

    it('Accedere a Sfera 4.0 - Estrai con Corretto Caricamento Dati', options, function () {
        Sfera.setDateEstrazione()
        Sfera.estrai()
    })

    it('Verificare che di default compaiano 50 righe in tabella', options, function () {
        Sfera.checkRisultatiPaginaRighe('50')
    })

    it('Selezionare un cluster e Verifica che ci siano 50 righe post selezione cluster', options, function () {
        Sfera.espandiPannello()
        Sfera.selectRandomCluster()
        Sfera.estrai()
        Sfera.checkRisultatiPaginaRighe('50', false)
    })

    it('Selezionare una quietanza\n- Menù Contestuale > Quietanza > Delta Premio \n- Verifica che ci siano 50 righe dopo la chiamata e il rientro dalla call applicativa delta premio', options, function () {
        Common.visitUrlOnEnv()
        Sfera.accediSferaDaHomePageMW()  
        Sfera.setDateEstrazione()
        Sfera.estrai()
        //? Per Trovare delle Quietanze con Delta Premio applicabile filtriamo quelle Entro il periodo di mora
        Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.ENTRO_PERIODO_MORA)
        Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.DELTA_PREMIO, false)
        Sfera.checkRisultatiPaginaRighe('50')
    })

    it('Selezionare una lob (motor,rami vari) \n- Selezionare un cluster \n- Estrai \n- Verificare che ci siano 50 righe su tabella dopo estrazione', options, function () {
        Sfera.selezionaPortafoglio(false, Sfera.PORTAFOGLI.MOTOR)
        Sfera.selectRandomCluster()
        Sfera.estrai()
        Sfera.checkRisultatiPaginaRighe('50')
    })
})