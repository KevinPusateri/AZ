/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
* @description Verifica delle Convenzioni da Clients (su AG che non puo' emetterle e su AG che puo' emetterle)
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import Legami from "../../mw_page_objects/clients/Legami"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Before After
before(() => {
    // cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
    //     insertedId = results.insertId
    // })
    // LoginPage.logInMW(userName, psw)
})
beforeEach(() => {
    cy.preserveCookies()
})
afterEach(function () {
    // if (this.currentTest.state !== 'passed') {
    //     TopBar.logOutMW()
    //     //#region Mysql
    //     cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
    //         let tests = testsInfo
    //         cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    //     })
    //     //#endregion
    //     Cypress.runner.stop();
    // }
})
after(function () {
    // TopBar.logOutMW()
    //#region Mysql
    // cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
    //     let tests = testsInfo
    //     cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    // })
    //#endregion

})
//#endregion Before After

let urlClient
let retrivedClient
let retrivedPartyRelations
describe('Matrix Web : Convenzioni', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {

    // it('Come delegato accedere all\'agenzia 01-710000 e cercare un cliente PG e verificare in Dettaglio Anagrafica la presenza del Tab Convenzioni', () => {
    //     LandingRicerca.searchRandomClient(true, 'PG', 'P')
    //     LandingRicerca.clickRandomResult()
    //     SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
    //         currentClientPG = currentClient
    //     })

    //     DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    //     DettaglioAnagrafica.clickSubTab('Convenzioni')
    // })

    // it('Cliccare su Aggiungi Nuovo e Verificare che : \n' +
    //     '- compaia il messaggio "Nessuna convenzione disponibile"\n' +
    //     '- non venga creata alcuna convenzione', () => {
    //         DettaglioAnagrafica.clickAggiungiConvenzione(false)
    //         TopBar.logOutMW()
    //     });

    it('Come delegato accedere all\'agenzia 01-745000 e cercare un cliente PF che abbia un legame familiare\n' +
        'Inserire una Convezione a piacere tra quelli presenti, inserire Matricola e Ruolo "Convenzionato\n' +
        'N.B. Prendersi nota delle convenzioni e del legame\n' +
        'Verificare che l\'operazione vada a buon fine e sia presente la convenzione', () => {
            cy.impersonification('TUTF003', 'ARGMOLLICA3', '010745000')
            cy.log('Retriving client with relations, please wait...')
            cy.getPartyRelations('TUTF003').then(currentClient => {
                cy.log('Retrived client : ' + currentClient[0].name + ' ' + currentClient[0].firstName)
                cy.log('Retrived party relation : ' + currentClient[1].name + ' ' + currentClient[1].firstName)
                retrivedClient = currentClient[0]
                retrivedPartyRelations = currentClient[1]
                LoginPage.logInMW('TUTF003', psw)
                SintesiCliente.visitUrlClient(currentClient[0].customerNumber, false)
                DettaglioAnagrafica.clickTabDettaglioAnagrafica()
                DettaglioAnagrafica.clickSubTab('Convenzioni')
                DettaglioAnagrafica.checkConvenzioniPresenti(false, true)
                DettaglioAnagrafica.clickAggiungiConvenzione(true, '1-745000', 'FINSEDA', 'Convenzionato').then((retrivedConvenzione) => {
                    DettaglioAnagrafica.checkConvenzioneInserito(retrivedConvenzione)
                })
            })
        });

    it('Accedere alla scheda del cliente con cui c\'è il legame\n' +
        'Inserire una Convezione a piacere tra quelli presenti, inserire Matricola e Ruolo "Familiare del Convenzionato"\n' +
        'Verificare che:\n' +
        '- si apra il campo "Aderenti Convenzione" nel cui menu a tendina sia presente il nome del cliente con cui c\'è il legame.\n' +
        'Scegliere conferma e verificare che:\n' +
        '- l\'operazione vada a buon fine\n' +
        '- sia presente la convenzione\n', () => {
            DettaglioAnagrafica.clickSubTab('Legami')
            Legami.clickLinkMembro(retrivedPartyRelations.firstName + ' ' + retrivedPartyRelations.name, false)
            SintesiCliente.checkAtterraggioName(retrivedPartyRelations.firstName + ' ' + retrivedPartyRelations.name)
            DettaglioAnagrafica.clickTabDettaglioAnagrafica()
            DettaglioAnagrafica.clickSubTab('Convenzioni')
            DettaglioAnagrafica.checkConvenzioniPresenti(false, true)
            cy.wrap(null).then(() => {
                DettaglioAnagrafica.clickAggiungiConvenzione(true, '1-745000', 'FINSEDA', 'Familiare del Convenzionato', retrivedClient.name + ' ' + retrivedClient.firstName).then((retrivedRelatedConvenzione) => {
                    DettaglioAnagrafica.checkConvenzioneInserito(retrivedRelatedConvenzione)
                })
            })
        });
})