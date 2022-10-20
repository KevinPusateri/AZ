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
    Sfera.accediSferaDaHomePageMW(true)
})

beforeEach(() => {
    cy.preserveCookies()
})

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
    describe('Matrix Web : Sfera 4.0 - Iniziative Aperte', function () {
        it('Accedere a Sfera 4.0 - Estrai con Corretto Caricamento Dati', function () {
            Sfera.setDateEstrazione(true)
        })

        it('Verificare la presenza del cluster "Con iniziative aperte", selezionarlo e verificare il corretto funzionamento e valorizzazione', function () {
            Sfera.espandiPannello()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.CON_INIZIATIVE_APERTE, true)
        })

        it('Verificare tooltip riga della colonna Ap.Cl che contenga Iniziativa, Assegnatario, Data Scad. e Tipologia e il numero di iniziative aperte', function () {
            Sfera.checkToolTipRigaByColonna(Sfera.FILTRI.AP_CL, 'Iniziativa')
        })

        it('Verificare la presenza della colonna "Iniziative Cl" in tabella', function () {
            Sfera.checkColonnaPresente('Iniziative Cl')
        })

        it('Verificare la presenza della colonna "Ap. Cl" in tabella', function () {
            //? Siccole Cl è a capo e nell'header hanno inserito un <br>, verifico direttamente Ap.
            Sfera.checkColonnaPresente('Ap.')
        })

        it('Verificare che compaia il tooltip corrispondente su Iniziative Cl "Elenco Iniziative, di Agenzia o Direzione, Aperte sul Cliente"', function () {
            Sfera.checkTooltipSingleColumn({
                key: 'Iniziative Cl',
                tooltip: 'Elenco Iniziative, di Agenzia o Direzione, Aperte sul Cliente'
            })
        })

        it('Verifica visualizzazione filtro excel sulla colonna Iniziative Cl', function () {
            Sfera.filtraSuColonna(Sfera.FILTRI.INIZIATIVE_CL, Sfera.FILTRI.COMMON.values.RANDOM)
            cy.get('@randomValueFiltered').then(value => {
                Sfera.checkValoreInColonna(Sfera.FILTRI.INIZIATIVE_CL, value)
            })
        })
    })
else
    describe('Matrix Web : Sfera 4.0 - Seconda Finestra', function () {
        it('Iniziative Aperte', function () {
            Sfera.setDateEstrazione(true)
            Sfera.espandiPannello()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.CON_INIZIATIVE_APERTE, true)
            Sfera.checkColonnaPresente('Iniziative Cl')
            Sfera.checkTooltipSingleColumn({
                key: 'Iniziative Cl',
                tooltip: 'Elenco Iniziative, di Agenzia o Direzione, Aperte sul Cliente'

            })
            //? Siccole Cl è a capo e nell'header hanno inserito un <br>, verifico direttamente Ap.
            Sfera.checkColonnaPresente('Ap.')
            Sfera.checkToolTipRigaByColonna(Sfera.FILTRI.AP_CL, 'Iniziativa')
            Sfera.filtraSuColonna(Sfera.FILTRI.INIZIATIVE_CL, Sfera.FILTRI.COMMON.values.RANDOM)
            cy.get('@randomValueFiltered').then(value => {
                Sfera.checkValoreInColonna(Sfera.FILTRI.INIZIATIVE_CL, value)
            })
        })
    })