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
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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

if (!Cypress.env('isSecondWindow'))
    describe('Matrix Web : Inserire le impostazioni sui filtri in colonna tra i criteri salvati nel salvataggio vista', function () {
        context('No Cluster', function () {
            it('Accedere a Sfera 4.0 - Estrai con Corretto Caricamento Dati', options, function () {
                Sfera.setDateEstrazione()
                Sfera.estrai()
            })

            it('Selezionare due colonne ed inserire due diversi filtri', options, function () {
                Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
                Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_2349)

                Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
                Sfera.checkValoreInColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_2349)
            })

            it('Salva vista', options, function () {
                Sfera.salvaVistaPersonalizzata('Automatici_2349_31')
                //? Effettuiamo un RESET della view
                Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.VISTA_STANDARD)
                Sfera.espandiPannello()
                Sfera.estrai()
            })

            it('Selezoinare vista Automatici_EM_31 e verificare che in estrazione vengano applicati e mantenuti i filtri salvati precedentemente', options, function () {
                Sfera.selezionaVista('Automatici_2349_31')
                Sfera.espandiPannello()
                Sfera.estrai()
                Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
                Sfera.eliminaVista('Automatici_2349_31')
            })
        })

        context('Cluster', function () {

            it('Accedere a Sfera 4.0 :\n- Estrai con Corretto Caricamento Dati', options, function () {
                Common.visitUrlOnEnv()
                Sfera.accediSferaDaHomePageMW()
                Sfera.setDateEstrazione()
            })


            it('- Selezionare due colonne ed inserire due diversi filtri \n- Selezionare un cluster desiderato', options, function () {
                Sfera.selectRandomCluster()
                Sfera.estrai()
                Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
                Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_1960)

                Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
                Sfera.checkValoreInColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_1960)
            })

            it('Salva vista', options, function () {
                Sfera.salvaVistaPersonalizzata('Automatici_AQ_35_Cluster')
                //? Effettuiamo un RESET della view
                Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.VISTA_STANDARD)
                Sfera.espandiPannello()
                Sfera.estrai()
            })

            it('Selezoinare vista Automatici_AQ_35_Cluster e verificare che in estrazione vengano applicati e mantenuti i filtri salvati precedentemente', options, function () {
                Sfera.selezionaVista('Automatici_AQ_35_Cluster')
                Sfera.espandiPannello()
                Sfera.estrai()
                Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
                Sfera.eliminaVista('Automatici_AQ_35_Cluster')
            })
        })
    })
else
    describe('Matrix Web : Sfera 4.0 -> Seconda Finestra', function () {
        it('AVIVA Viste', function () {
            //#region NO Cluster
            //Accedere a Sfera 4.0 - Estrai con Corretto Caricamento Dati
            Sfera.setDateEstrazione()
            Sfera.estrai()
            //Selezionare due colonne ed inserire due diversi filtri
            Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.ALTRE_SCADENZE_IN_QUIETANZAMENTO)
            Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            //Salva vista
            Sfera.salvaVistaPersonalizzata('Automatici_EM_31')
            //? Effettuiamo un RESET della view
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.VISTA_STANDARD)
            Sfera.espandiPannello()
            Sfera.estrai()
            //Selezoinare vista Automatici_EM_31 e verificare che in estrazione vengano applicati e mantenuti i filtri salvati precedentemente
            Sfera.selezionaVista('Automatici_EM_31')
            Sfera.espandiPannello()
            Sfera.estrai()
            Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            Sfera.eliminaVista('Automatici_EM_31')
            //#endregion

            //#region Cluster
            //Accedere a Sfera 4.0 :- Estrai con Corretto Caricamento Dati
            Common.visitUrlOnEnv()
            Sfera.accediSferaDaHomePageMW()
            Sfera.setDateEstrazione()
            //Selezionare due colonne ed inserire due diversi filtri - Selezionare un cluster desiderato
            Sfera.selectRandomCluster()
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.ENTRO_PERIODO_MORA)
            Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            //Salva vista
            Sfera.salvaVistaPersonalizzata('Automatici_AQ_35_Cluster')
            //? Effettuiamo un RESET della view
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.VISTA_STANDARD)
            Sfera.espandiPannello()
            Sfera.estrai()
            //Selezoinare vista Automatici_AQ_35_Cluster e verificare che in estrazione vengano applicati e mantenuti i filtri salvati precedentemente
            Sfera.selezionaVista('Automatici_AQ_35_Cluster')
            Sfera.espandiPannello()
            Sfera.estrai()
            Sfera.checkValoreInColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            Sfera.eliminaVista('Automatici_AQ_35_Cluster')
            //#endregion
        })
    })