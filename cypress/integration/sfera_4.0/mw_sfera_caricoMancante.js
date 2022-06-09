/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
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
const listColumnCaricoMancante = [
    'Pt.',
    'Contraente',
    'Polizza',
    'Via',
    'Cp.',
    'Agenzia',
    'Sede',
    'Fonte',
    'Ramo',
    'Fr.',
    'Descrizione Prodotto',
    'Targa'
]
let today = new Date()
today.setMonth(4)
today.setDate(1)
let dataInizio = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth())).slice(-2) + '/' + today.getFullYear()
today.setMonth(5)
today.setDate(30)
let dataFine = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth())).slice(-2) + '/' + today.getFullYear()
//#endregion

//#region Before After
before(() => {
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
    Sfera.accediSferaDaHomePageMW()
    Sfera.espandiPannello()
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

describe('Matrix Web : Sfera 4.0 - Operatività - CARICO MANCANTE', function () {

    it('age 01-712000 aprile maggio - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online', function () {
        Sfera.setDateEstrazione(true, dataInizio, dataFine)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante', function () {
        Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
        Sfera.checkNotExistLob(Sfera.PORTAFOGLI.RAMI_VARI)
        Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        Sfera.espandiPannello()
        Sfera.estrai(false)

    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_LoB MOTOR e RV', function () {
        Sfera.espandiPannello()
        Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
        Sfera.checkLob(Sfera.PORTAFOGLI.RAMI_VARI)
        Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_colonne in tabella', function () {
        Sfera.checkAllColonnePresenti(listColumnCaricoMancante)
    })

    it.skip('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_colonne in tabella', function () {
        // Sfera.selezionaVistaSuggerita('Carico Mancante')
        // Sfera.estrai()
        //TODO
    })

    it.skip('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_colonne in tabella_filtri excel', function () {
        //TODO DA CHIARIRE
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_colonne in tabella_report', function () {
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
        Sfera.estrazioneReportExcel(listColumnCaricoMancante)
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)

    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_default 50 righe', function () {
        Sfera.checkRisultatiPaginaRighe('50')
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_personalizza tabella', function () {
        Sfera.eliminaColonna('Contraente')
        Sfera.checkColonnaAssente('Contraente')
        Sfera.gestisciColonne(['Contraente'])
        Sfera.checkColonnaPresente('Contraente')
        cy.wait(2000)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_menu contestuale', function () {
        // Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        // Sfera.estrai(false)
        Sfera.checkVociMenuExist(Sfera.VOCIMENUQUIETANZA.QUIETANZAMENTO_ONLINE)
        Sfera.checkVociMenuExist(Sfera.VOCIMENUCONSULTAZIONE.POLIZZA)
        Sfera.checkVociMenuExist(Sfera.VOCIMENUCONSULTAZIONE.DOCUMENTI_POLIZZA)
        Sfera.checkVociMenuExist(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE)
        Sfera.checkVociMenuExist(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI)
    })


    it.skip('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_menu contestuale_quietanzmaneto on line', function () {
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.CARICO_MANCANTE)
        Sfera.estrai(false)
        Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.QUIETANZAMENTO_ONLINE, true, null, null, null, true)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_menu contestuale_consultazione_polizza', function () {
        Sfera.apriVoceMenu(Sfera.VOCIMENUCONSULTAZIONE.POLIZZA, false, null, null, null, true)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_menu contestuale_cliente_scheda cliente_call back applicativa', function () {
        Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.SCHEDA_CLIENTE, false, null, null, null, true)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_menu contestuale_cliente_lista polizze_call back applicativa', function () {
        Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE, false, null, null, null, true)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_menu contestuale_cliente_lista sinistri_call back applicativa', function () {
        Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI, false, null, null, null, true)
    })

    it('Sfera 4.0 - Operatività - CARICO MANCANTE - Carico Mancante  e quietanzamento online_nuova label_carico mancante_menu contestuale_consultazione_documenti di polizza_call back applicativa', function () {
        Sfera.apriVoceMenu(Sfera.VOCIMENUCONSULTAZIONE.DOCUMENTI_POLIZZA, false, null, null, null, true)
    })


}) 