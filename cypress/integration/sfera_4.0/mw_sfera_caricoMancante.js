/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import Common from "../../mw_page_objects/common/Common"
import HomePage from "../../mw_page_objects/common/HomePage"
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

//#region global variabled
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}

//! settato default a true, altrimenti a false se viene utilizzato uno o piu only nei test
const flusso = true

let dataInizio = Common.setDate(1, undefined, false)
//#endregion

//#region Before After
before(() => {
    //! UTILIZZARE CHROME PER LA POSSIBILITA' DI FARE L'EXCEL
    expect(Cypress.browser.name).to.contain('chrome')
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        })
    })
    let customImpersonification = {
        "agentId": "ARDEMILI1",
        "agency": "010712000"
    }
    LoginPage.logInMWAdvanced(customImpersonification)
    Sfera.accediSferaDaHomePageMW(true)
    Sfera.espandiPannello()
    if (!flusso) {
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        Sfera.setDateEstrazione(false, dataInizio)
        Sfera.estrai(false)
    }
})

beforeEach(() => {
    cy.preserveCookies()
})

if (flusso)
    afterEach(function () {
        if (this.currentTest.state !== 'passed') {
            TopBar.logOutMW()
            //#region Mysql
            cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
                let tests = testsInfo
                cy.finishMysql(dbConfig, insertedId, tests)
            })
            //#endregion
            Cypress.runner.stop();
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
})
//#endregion Before After


if (!Cypress.env('isSecondWindow'))
    describe('Matrix Web : Sfera 4.0 - Operatività - CARICO MANCANTE', function () {

        it('Age 01-712000 aprile maggio - Corretto caricamento dati', function () {
            Sfera.setDateEstrazione(true, dataInizio)
        })

        it('Vista Carico Mancante', function () {
            Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
            Sfera.checkNotExistLob(Sfera.PORTAFOGLI.RAMI_VARI)
            Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.espandiPannello()
            Sfera.estrai(false)

        })

        it('LoB MOTOR e RV default', function () {
            Sfera.espandiPannello()
            Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
            Sfera.checkLob(Sfera.PORTAFOGLI.RAMI_VARI)
            Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)
        })

        it('Verifica colonne corrette in tabella', function () {
            Sfera.checkAllColonnePresenti(Sfera.COLUMNCARICOMANCANTE)
        })

        it('Colonne in tabella_Tooltip', function () {
            Sfera.checkTooltipHeadersColonne(Sfera.COLUMNCARICOMANCANTE)
        })

        it.skip('Colonne in tabella_filtri excel', function () {
            //TODO DA CHIARIRE
            // !NON APPLICABILE SUL File excel i filtri
        })

        it('Colonne in tabella_report excel', function () {
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.estrazioneReportExcel(Sfera.COLUMNCARICOMANCANTE)
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
        })

        it('Verifica default 50 righe', function () {
            Sfera.checkRisultatiPaginaRighe('50')
        })

        it('Personalizza tabella', function () {
            Sfera.eliminaColonna('Contraente')
            Sfera.checkColonnaAssente('Contraente')
            Sfera.gestisciColonne(['Contraente'])
            Sfera.checkColonnaPresente('Contraente')
            cy.wait(2000)
        })

        it('Menu contestuale verifica voci presenti', function () {
            Sfera.checkVociMenuExist(Sfera.VOCIMENUQUIETANZA.QUIETANZAMENTO_ONLINE)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCONSULTAZIONE.POLIZZA)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCONSULTAZIONE.DOCUMENTI_POLIZZA)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI)
        })


        it('Menu contestuale -> Quietanzmaneto online', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.QUIETANZAMENTO_ONLINE, true, null, null, null, true)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        })

        it('Menu Contestuale -> Consultazione Polizza_call back applicativa', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCONSULTAZIONE.POLIZZA, false, null, null, null, true)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        })

        it('Menu Contestuale -> Cliente -> Scheda Cliente_call back applicativa', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.SCHEDA_CLIENTE, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.setDateEstrazione(false, dataInizio)
            Sfera.estrai(false)
        })

        it('Menu Contestuale -> Cliente -> Lista polizze_call back applicativa', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.setDateEstrazione(false, dataInizio)
            Sfera.estrai(false)
        })

        it('Menu Contestuale -> Cliente -> Lista Sinistri_call back applicativa', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.setDateEstrazione(false, dataInizio)
            Sfera.estrai(false)
        })

        it('Menu Contestuale -> Consultazione Documenti di polizza_call back applicativa', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCONSULTAZIONE.DOCUMENTI_POLIZZA, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        })

        //? Sfera 4.0 - Operatività - CARICO MANCANTE -
        //? Carico Mancante  e quietanzamento online_quietanzamento online ok>verificare in vista standard  il quietanzamento 
        //! Da inizia appena il bug verrà risolto
    })
else
    describe('Matrix Web : Sfera 4.0 -> Seconda Finestra - CARICO MANCANTE', function () {
        it('CARICO MANCANTE', function () {
            // Age 01-712000 aprile maggio - Corretto caricamento dati
            Sfera.setDateEstrazione(true, dataInizio)

            // Vista Carico Mancante
            Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
            Sfera.checkNotExistLob(Sfera.PORTAFOGLI.RAMI_VARI)
            Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.espandiPannello()
            Sfera.estrai(false)

            // LoB MOTOR e RV default
            Sfera.espandiPannello()
            Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
            Sfera.checkLob(Sfera.PORTAFOGLI.RAMI_VARI)
            Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)

            // Verifica colonne corrette in tabella
            Sfera.checkAllColonnePresenti(Sfera.COLUMNCARICOMANCANTE)

            // Colonne in tabella_Tooltip
            Sfera.checkTooltipHeadersColonne(Sfera.COLUMNCARICOMANCANTE)

            // Colonne in tabella_report excel
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.estrazioneReportExcel(Sfera.COLUMNCARICOMANCANTE)
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)

            // Verifica default 50 righe
            Sfera.checkRisultatiPaginaRighe('50')

            // Personalizza tabella
            Sfera.eliminaColonna('Contraente')
            Sfera.checkColonnaAssente('Contraente')
            Sfera.gestisciColonne(['Contraente'])
            Sfera.checkColonnaPresente('Contraente')
            cy.wait(2000)

            // Menu contestuale verifica voci presenti
            Sfera.checkVociMenuExist(Sfera.VOCIMENUQUIETANZA.QUIETANZAMENTO_ONLINE)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCONSULTAZIONE.POLIZZA)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCONSULTAZIONE.DOCUMENTI_POLIZZA)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE)
            Sfera.checkVociMenuExist(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI)

            // Menu contestuale -> Quietanzmaneto online
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.QUIETANZAMENTO_ONLINE, true, null, null, null, true)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)

            // Menu Contestuale -> Consultazione Polizza_call back applicativa
            Sfera.apriVoceMenu(Sfera.VOCIMENUCONSULTAZIONE.POLIZZA, false, null, null, null, true)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)

            // Menu Contestuale -> Cliente -> Scheda Cliente_call back applicativa
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.SCHEDA_CLIENTE, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.setDateEstrazione(false, dataInizio)
            Sfera.estrai(false)

            // Menu Contestuale -> Cliente -> Lista polizze_call back applicativa
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.setDateEstrazione(false, dataInizio)
            Sfera.estrai(false)

            // Menu Contestuale -> Cliente -> Lista Sinistri_call back applicativa
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.setDateEstrazione(false, dataInizio)
            Sfera.estrai(false)

            // Menu Contestuale -> Consultazione Documenti di polizza_call back applicativa
            Sfera.apriVoceMenu(Sfera.VOCIMENUCONSULTAZIONE.DOCUMENTI_POLIZZA, false, null, null, null, true, Sfera.VISTESUGGERITE.CARICO_MANCANTE)
            Sfera.checkVistaExist(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        })
    })