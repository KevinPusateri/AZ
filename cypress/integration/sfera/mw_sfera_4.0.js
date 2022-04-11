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

describe('Matrix Web : Sfera 4.0', function () {

    it.only('Verificare presenza ed accesso a Delta Premio da menù contestuale e ritorno in Sfera', function () {
        Sfera.setDateEstrazione()
        Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
        Sfera.estrai()
        Sfera.apriVoceMenu(Sfera.VOCIMENU.DELTA_PREMIO)
        Sfera.verificaAccessoSfera()
    })

    it('Verificare Cluster Motor Delta Premio Positivo e Negativo', function () {
        Sfera.setDateEstrazione()
        Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_NEGATIVO, true)
        Sfera.espandiPannello()
        Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_POSITIVO, true)
    })

    //! Necessari chiarimenti con Visentin
    // it('Sostituzione stesso veicolo Titolo 2 e Verifica in Sfera', function () {
    //     Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
    //     Sfera.estrai()
    //     Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.VUOTO)
    //     Sfera.apriVoceMenu(Sfera.VOCIMENU.SOSTITUZIONE_RIATTIVAZIONE_AUTO, null, Sfera.TIPOSOSTITUZIONERIATTIVAZIONE.SOSTITUZIONE_STESSO_VEICOLO)
    //     cy.pause()
    // })

    it('Quietanzamento Vista Operativa - Gestisci colora riga : Assegna colore', function () {
        Sfera.setDateEstrazione()
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
        Sfera.assegnaColoreRighe(Sfera.COLORI.SIGNIFICATO_ALFA)
    })

    it('Quietanzamento Vista Operativa - Gestisci colora riga : Rimuovi colore', function () {
        Sfera.setDateEstrazione()
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
        Sfera.assegnaColoreRighe(Sfera.COLORI.NESSUN_COLORE)
    })

    it.only('Gestione Stampa Senza Incasso per Quietanze Motor Allianz', function () {
        Sfera.selezionaPortafoglio(false, Sfera.PORTAFOGLI.MOTOR)
        Sfera.setDateEstrazione(false, '02/02/2022')
        Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.IN_LAVORAZIONE)
        Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.QUIETANZE_STAMPABILI, true)
        Sfera.apriVoceMenu(Sfera.VOCIMENU.STAMPA_SENZA_INCASSO).then((polizza) => {
            //De-Selezioniamo le Stampabili
            Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.QUIETANZE_STAMPABILI, false)
            Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.QUIETANZE_STAMPATE, true)
            Sfera.filtraSuColonna(Sfera.FILTRI.POLIZZA, polizza)
        })
    })

    // TODO: ATTENDERE LA RISPOSTA DI STEFANO
    // it('Sfera AZpay', () => {
    //     Sfera.setDateEstrazione()
    //     Sfera.selezionaVista('codice azpay')
    //     Sfera.gestisciColonne(['Cons. Email Cl', 'Cod. AZPay'])
    //     Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
    //     //! Problema -> Trovare il cliente valido per l'invio azpay
    //     Sfera.creaAndInviaCodiceAzPay()
    // })

    it('verificare corretto layout del pannello scontistica su visat delta premio', function () {
        Sfera.setDateEstrazione()
        Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
        Sfera.estrai()
        Sfera.apriVoceMenu(Sfera.VOCIMENU.DELTA_PREMIO)
        Sfera.verificaAccessoSfera()
    })
})