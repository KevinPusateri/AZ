/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
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
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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
let today = new Date()
today.setDate(today.getDate() + 5)
let dataInizio = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear()
today.setMonth(today.getMonth() + 1)
let dataFine = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 2)).slice(-2) + '/' + today.getFullYear()

//#endregion

//#region Before After
before(() => {
    expect(Cypress.browser.name).to.contain('chrome')

    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
            Sfera.accediSferaDaHomePageMW(true)
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

    describe('Matrix Web : Sfera 4.0', function () {

        it('Verificare Cluster Motor Delta Premio Positivo e Negativo', function () {
            Sfera.setDateEstrazione()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_NEGATIVO, true)
            Sfera.espandiPannello()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_POSITIVO, true)
        })

        // //! Necessari chiarimenti con Visentin
        // it('Sostituzione stesso veicolo Titolo 2 e Verifica in Sfera', function () {
        //     Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
        //     Sfera.estrai()
        //     Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.VUOTO)
        //     Sfera.apriVoceMenu(Sfera.VOCIMENU.SOSTITUZIONE_RIATTIVAZIONE_AUTO, null, Sfera.TIPOSOSTITUZIONERIATTIVAZIONE.SOSTITUZIONE_STESSO_VEICOLO)
        //     cy.pause()
        // })

        it('Quietanzamento Vista Operativa - Gestisci colora riga : Assegna colore', function () {
            Sfera.setDateEstrazione()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_POSITIVO, true)
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.assegnaColoreRandom()
        })

        it('Quietanzamento Vista Operativa - Gestisci colora riga : Rimuovi colore', function () {
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.assegnaNessunColore()
        })

        it('Effettua Stampa Senza Incasso per Quietanze Motor Allianz', function () {
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.STAMPA_QUIETANZE)
            Sfera.selezionaPortafoglio(false, Sfera.PORTAFOGLI.MOTOR)
            Sfera.setDateEstrazione()
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.ENTRO_PERIODO_MORA)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.STAMPA_SENZA_INCASSO, true, null, null, null, true).then((polizza) => {
                cy.log(`Stampa Senza Incasso effettuata su contratto ${polizza}`)
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

        // TODO: ATTENDERE
        // it('verificare corretto layout del pannello scontistica su vista delta premio', function () {
        //     Sfera.setDateEstrazione()
        //     Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
        //     Sfera.estrai()
        //     Sfera.apriVoceMenu(Sfera.VOCIMENU.DELTA_PREMIO)
        //     Sfera.verificaAccessoSfera()
        // })


        it('Verifica Estrazione report excel', function () {
            Sfera.setDateEstrazione()
            Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
            Sfera.estrai()
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.estrazioneReportExcel(Sfera.COLUMNSTANDARD)
        })

        context('Verifica Rotella Gestione Colonne', () => {

            it('Verifica Aggiungi, Drag & Drop, Elimina e Blocco di una Colonna', function () {
                Sfera.setDateEstrazione()
                Sfera.estrai()
                Sfera.gestisciColonne(['Cod. AZPay'])
                Sfera.checkColonnaPresente('Cod. AZPay')
                Sfera.bloccaColonna('Cod. AZPay')
                // Sfera.dragDropColonna('Info') //! Da Implementare in quanto da studiare
                Sfera.eliminaColonna('Cod. AZPay')
                Sfera.checkColonnaAssente('Cod. AZPay')
                Sfera.salvaVistaPersonalizzata('Automatici')
                Sfera.selezionaVista('Automatici')
                Sfera.espandiPannello()
                Sfera.estrai()
            })

            it('Verifica Sostituisci Vista', function () {
                Sfera.gestisciColonne(['Cod. AZPay'])
                Sfera.sostituisciVista('Automatici')
                Sfera.selezionaVista('Automatici')
                Sfera.checkColonnaPresente('Cod. AZPay')
                Sfera.eliminaVista('Automatici')
            })
        })

        it('Verifica Filtro Fonti e Filtro Agenzie Tutte Selezionate', options, function () {
            Sfera.espandiPannello()
            Sfera.fontiAllSelezionati()
            Sfera.agenzieAllSelezionati()
        })


        it('Verifica incasso T2 motor Ramo 31', options, function () {
            Sfera.setDateEstrazione(false, dataInizio, dataFine)
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, true, null, null, null, true)
        })

        it('Verifica incasso T2 motor Ramo 32', options, function () {
            HomePage.reloadMWHomePage()
            Sfera.accediSferaDaHomePageMW(true)
            Sfera.setDateEstrazione(false, dataInizio, dataFine)
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_32)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, true, null, null, null, true)
        })

        it('Verifica Azioni Veloci > Esporta Excel', options, function () {
            HomePage.reloadMWHomePage()
            Sfera.accediSferaDaHomePageMW(true)
            Sfera.setDateEstrazione(false, dataInizio, dataFine)
            Sfera.selectRandomCluster()
            cy.get('@clusterLength').then((clusterLength) => {
                Sfera.azioniVeloci(Sfera.AZIONIVELOCI.ESPORTA_PDF_EXCEL)
                Sfera.checkExcel(clusterLength)
            })
        })
    })
else
    describe('Matrix Web : Sfera 4.0 -> Seconda Finestra - Common', function () {
        it('Common', function () {
            // Verificare Cluster Motor Delta Premio Positivo e Negativo
            Sfera.setDateEstrazione()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_NEGATIVO, true, null, null, null, true)
            Sfera.espandiPannello()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_POSITIVO, true, null, null, null, true)

            // Quietanzamento Vista Operativa - Gestisci colora riga : Assegna colore
            Sfera.setDateEstrazione()
            Sfera.selezionaClusterMotor(Sfera.CLUSTERMOTOR.DELTA_PREMIO_POSITIVO, true, null, null, null, true)
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.assegnaColoreRandom()

            // Quietanzamento Vista Operativa - Gestisci colora riga : Rimuovi colore
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.assegnaNessunColore()

            // Effettua Stampa Senza Incasso per Quietanze Motor Allianz
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.STAMPA_QUIETANZE)
            Sfera.selezionaPortafoglio(false, Sfera.PORTAFOGLI.MOTOR)
            Sfera.setDateEstrazione()
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.STAMPA_SENZA_INCASSO).then((polizza) => {
                cy.log(`Stampa Senza Incasso effettuata su contratto ${polizza}`)
            })

            // Verifica Estrazione report excel
            Sfera.setDateEstrazione()
            cy.wait(2000)
            Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
            Sfera.estrai()
            Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
            Sfera.estrazioneReportExcel(Sfera.COLUMNSTANDARD)

            // Verifica Aggiungi, Drag & Drop, Elimina e Blocco di una Colonna
            Sfera.setDateEstrazione()
            Sfera.estrai()
            Sfera.gestisciColonne(['Cod. AZPay'])
            Sfera.checkColonnaPresente('Cod. AZPay')
            Sfera.bloccaColonna('Cod. AZPay')
            Sfera.eliminaColonna('Cod. AZPay')
            Sfera.checkColonnaAssente('Cod. AZPay')
            Sfera.salvaVistaPersonalizzata('Automatici')
            Sfera.selezionaVista('Automatici')
            Sfera.espandiPannello()
            Sfera.estrai()

            // Verifica Sostituisci Vista
            Sfera.gestisciColonne(['Cod. AZPay'])
            Sfera.sostituisciVista('Automatici')
            Sfera.selezionaVista('Automatici')
            Sfera.checkColonnaPresente('Cod. AZPay')
            Sfera.eliminaVista('Automatici')

            // Verifica Filtro Fonti e Filtro Agenzie Tutte Selezionate
            Sfera.fontiAllSelezionati()
            Sfera.agenzieAllSelezionati()

            // Verifica incasso T2 motor Ramo 31
            //? Incasso possibile da agenzia su cui si è entrati in seconda finestra
            Sfera.setDateEstrazione()
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
            Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.ENTRO_PERIODO_MORA)
            Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_31)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, true, null, null, null, true)

            // Verifica incasso T2 motor Ramo 32
            //? Incasso possibile da agenzia su cui si è entrati in seconda finestra
            Sfera.setDateEstrazione()
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
            Sfera.filtraSuColonna(Sfera.FILTRI.RAMO, Sfera.FILTRI.RAMO.values.RAMO_32)
            Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.ENTRO_PERIODO_MORA)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, true, null, null, null, true)

            // Verifica Azioni Veloci > Esporta Excel
            HomePage.reloadMWHomePage()
            Sfera.accediSferaDaHomePageMW(true)
            Sfera.setDateEstrazione(false, dataInizio, dataFine)
            Sfera.selectRandomCluster()
            cy.get('@clusterLength').then((clusterLength) => {
                Sfera.azioniVeloci(Sfera.AZIONIVELOCI.ESPORTA_PDF_EXCEL)
                Sfera.checkExcel(clusterLength)
            })
        })
    })