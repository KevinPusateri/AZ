/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Legami from "../../mw_page_objects/clients/Legami"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let currentClient = ''
var membro = ''
//#endregion


//#region Before After
before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    cy.preserveCookies()
})

after(() => {
    // TopBar.logOutMW()
})
//#endregion Before After

describe('Matrix Web : Legami', function () {

    Cypress._.times(1, () => {

        it('Verifica creazione di un Gruppo aziendale - inserimento membro', function () {
            DettaglioAnagrafica.checkClientWithoutLegame()
            SintesiCliente.retriveClientNameAndAddress().then(retrivedClient => {
                currentClient = retrivedClient
            })
            Legami.creaGruppo()
            Legami.inserisciMembro().then(retrivedMember => {
                membro = retrivedMember
            })
        })

        it('Verifica membro inserito', function () {
            Legami.checkMembroInserito(membro, currentClient.name)
        })

        it('Verifica membro non inseribile in un altro gruppo', function () {
            Legami.checkMembroNonInseribile(membro)
        })

        it('Verifica l\'eliminazione di un solo Appartenente', function () {
            Legami.eliminaMembro()
        })

        it('Verifica "Inserisci membro"', function () {
            let newMembro = ''
            Legami.clickInserisciMembro().then(retrivedMember => {
                newMembro = retrivedMember
            })
            Legami.checkMembroInserito(newMembro, currentClient.name)
            Legami.eliminaMembro()
        })

        it('Verifica inserimento massimo 3 membri', function () {

            for (let index = 0; index < 2; index++) {
                Legami.clickInserisciMembro()
            }
            Legami.checkTerzoMembroNonInseribile()
        })

        it('Verifica "Elimina gruppo"', function () {
            Legami.clickEliminaGruppo()

        })

        it('Verifica link scheda Cliente del membro', function() {
            Legami.creaGruppo()
            let newMembro = ''
            Legami.clickInserisciMembro().then(retrivedMember => {
                newMembro = retrivedMember
            })
            Legami.checkMembroInserito(newMembro, currentClient.name)
            Legami.clickLinkMembro(newMembro)
            SintesiCliente.checkAtterraggioName(newMembro)
            DettaglioAnagrafica.sezioneLegami()
            Legami.checkMembroInserito(newMembro, currentClient.name)
            Legami.clickLinkMembro(currentClient.name)

        })
    })
})