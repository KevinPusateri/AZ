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
import Legami from "../../mw_page_objects/clients/Legami"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
let customImpersonification
//#endregion

//#region Before After
if (!Cypress.env('monoUtenza')) { //! Skippiamo tutti i test se monoUtenza è attiva 
    before(() => {
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)

            customImpersonification = {
                "agentId": "ARGMOLLICA3",
                "agency": "010745000"
            }
            LoginPage.logInMWAdvanced(customImpersonification)
        })
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
}

let retrivedClient
let retrivedPartyRelations
describe('Matrix Web : Convenzioni', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {
    it('Come delegato accedere all\'agenzia 01-745000 e cercare un cliente PF che abbia un legame familiare\n' +
        'Inserire una Convezione a piacere tra quelli presenti, inserire Matricola e Ruolo "Convenzionato\n' +
        'N.B. Prendersi nota delle convenzioni e del legame\n' +
        'Verificare che l\'operazione vada a buon fine e sia presente la convenzione', function () {
            if (!Cypress.env('monoUtenza')) {

                cy.log('Retriving client with relations, please wait...')
                cy.getPartyRelations().then(currentClient => {
                    cy.log('Retrived client : ' + currentClient[0].name + ' ' + currentClient[0].firstName)
                    cy.log('Retrived party relation : ' + currentClient[1].name + ' ' + currentClient[1].firstName)
                    retrivedClient = currentClient[0]
                    retrivedPartyRelations = currentClient[1]
                    TopBar.search(currentClient[0].name + ' ' + currentClient[0].firstName)
                    LandingRicerca.clickClientePF(currentClient[0].name + ' ' + currentClient[0].firstName)
                    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
                    DettaglioAnagrafica.clickSubTab('Convenzioni')
                    DettaglioAnagrafica.checkConvenzioniPresenti(false, true)
                    DettaglioAnagrafica.clickAggiungiConvenzione(true, '1-745000', 'BANCO DI NAPOLI', 'Convenzionato').then((retrivedConvenzione) => {
                        DettaglioAnagrafica.checkConvenzioneInserito(retrivedConvenzione)
                    })
                })
            } else this.skip()
        });

    it('Accedere alla scheda del cliente con cui c\'è il legame\n' +
        'Inserire una Convezione a piacere tra quelli presenti, inserire Matricola e Ruolo "Familiare del Convenzionato"\n' +
        'Verificare che:\n' +
        '- si apra il campo "Aderenti Convenzione" nel cui menu a tendina sia presente il nome del cliente con cui c\'è il legame.\n' +
        'Scegliere conferma e verificare che:\n' +
        '- l\'operazione vada a buon fine\n' +
        '- sia presente la convenzione\n', function () {
            if (!Cypress.env('monoUtenza')) {
                DettaglioAnagrafica.clickSubTab('Legami')
                Legami.clickLinkMembro(retrivedPartyRelations.firstName + ' ' + retrivedPartyRelations.name, false)
                SintesiCliente.checkAtterraggioName(retrivedPartyRelations.firstName + ' ' + retrivedPartyRelations.name)
                DettaglioAnagrafica.clickTabDettaglioAnagrafica()
                DettaglioAnagrafica.clickSubTab('Convenzioni')
                DettaglioAnagrafica.checkConvenzioniPresenti(false, true)
                //? Se non facevo il wrap, andava in esecuzione come prima istruzione dell'it il checkConvenzioneInserito
                cy.wrap(null).then(() => {
                    DettaglioAnagrafica.clickAggiungiConvenzione(true, '1-745000', 'BANCO DI NAPOLI', 'Familiare del Convenzionato', retrivedClient.name + ' ' + retrivedClient.firstName).then((retrivedRelatedConvenzione) => {
                        DettaglioAnagrafica.checkConvenzioneInserito(retrivedRelatedConvenzione)
                    })
                })
            } else this.skip()
        });

    it('Accedere nuovamente alla scheda del convenzionato e da Azioni scegliere Elimina' +
        'Verificare che:' +
        '- l\'operazione vada a buon fine' +
        '- la convenzione non sia più presente (anche per il familiare)', function () {
            if (!Cypress.env('monoUtenza')) {
                TopBar.search(currentClient[0].name + ' ' + currentClient[0].firstName)
                LandingRicerca.clickClientePF(currentClient[0].name + ' ' + currentClient[0].firstName)
                DettaglioAnagrafica.clickTabDettaglioAnagrafica()
                DettaglioAnagrafica.clickSubTab('Convenzioni')
                DettaglioAnagrafica.checkConvenzioniPresenti(true, true)

                DettaglioAnagrafica.clickSubTab('Legami')
                cy.wait(5000)
                Legami.clickLinkMembro(retrivedPartyRelations.firstName + ' ' + retrivedPartyRelations.name, false)
                SintesiCliente.checkAtterraggioName(retrivedPartyRelations.firstName + ' ' + retrivedPartyRelations.name)
                DettaglioAnagrafica.clickTabDettaglioAnagrafica()
                DettaglioAnagrafica.clickSubTab('Convenzioni')
                DettaglioAnagrafica.checkConvenzioniPresenti(false)
            } else this.skip()
        });
})