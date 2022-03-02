/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Legami from "../../mw_page_objects/clients/Legami"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Username Variables
const psw = 'P@ssw0rd!'
    //#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
    //#endregion

let currentClient = ''
var membro = ''

//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)

        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
})
afterEach(function() {
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
after(function() {
        TopBar.logOutMW()
            //#region Mysql
        cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
                let tests = testsInfo
                cy.finishMysql(dbConfig, insertedId, tests)
            })
            //#endregion

    })
    //#endregion Before After

describe('Matrix Web : Legami', function() {

    Cypress._.times(1, () => {

        it('Verifica creazione di un Gruppo aziendale con inserimento membro', function() {
            DettaglioAnagrafica.checkClientWithoutLegame()
            SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
                currentClient = retrivedClient
            })
            Legami.creaGruppo()
            Legami.inserisciMembroFromGroup().then(retrivedMember => {
                membro = retrivedMember
            })
        })

        it('Verifica membro non inseribile in un altro gruppo', function() {
            Legami.checkMembroInserito(membro, currentClient.name)
            Legami.checkMembroNonInseribile(membro)
        })

        it('Verifica l\'eliminazione di un solo Appartenente', function() {
            Legami.clickInserisciMembro().then(retrivedMember => {
                let newMembro = retrivedMember
                Legami.eliminaMembro(newMembro)
                Legami.clickLinkMembro(membro)
                SintesiCliente.checkAtterraggioSintesiCliente(membro)
                DettaglioAnagrafica.sezioneLegami()
                Legami.checkMembroInserito(membro, currentClient.name, false)
                Legami.checkMembroEliminato(newMembro)

                Legami.clickLinkMembro(currentClient.name)
                SintesiCliente.checkAtterraggioSintesiCliente(currentClient.name)
                DettaglioAnagrafica.sezioneLegami()
                Legami.eliminaMembro(membro)
            })
        })

        it('Verifica button "Inserisci membro"', function() {
            Legami.clickInserisciMembro().then(retrivedMember => {
                let newMembro = retrivedMember
                Legami.checkMembroInserito(newMembro, currentClient.name)
                Legami.eliminaMembro(newMembro)
            })
        })

        it('Verifica inserimento massimo 3 membri', function() {
            for (let index = 0; index < 2; index++) {
                Legami.clickInserisciMembro()
            }
            Legami.checkTerzoMembroNonInseribile()
        })

        it('Verifica "Elimina gruppo"', function() {
            Legami.clickEliminaGruppo()
        })

        it('Verifica link scheda Cliente del membro', function() {
            Legami.creaGruppo()
            Legami.inserisciMembroFromGroup().then(retrivedMember => {
                    let newMembro = retrivedMember
                    Legami.checkMembroInserito(newMembro, currentClient.name)

                    Legami.clickLinkMembro(newMembro)
                    SintesiCliente.checkAtterraggioSintesiCliente(newMembro)
                    DettaglioAnagrafica.sezioneLegami()
                    Legami.checkMembroInserito(newMembro, currentClient.name, false)

                    Legami.clickLinkMembro(currentClient.name)
                    SintesiCliente.checkAtterraggioSintesiCliente(currentClient.name)
                    DettaglioAnagrafica.sezioneLegami()
                    Legami.clickEliminaGruppo()
                })
                // TopBar.logOutMW()
        })

    })
})