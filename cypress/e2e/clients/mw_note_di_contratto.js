/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import HomePage from "../../mw_page_objects/common/HomePage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import NoteContratto from "../../mw_page_objects/clients/NoteContratto"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import SCUSalesNoteContratto from "../../mw_page_objects/sales/SCUSalesNoteContratto"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
//#endregion import

let currentTutf

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
let urlClient
//#endregion

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            currentTutf = data.tutf
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)

            LoginPage.logInMWAdvanced()
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    cy.ignoreRequest()
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

let currentCustomerFullName
describe('Matrix Web : Note di contratto', function () {
    context('Polizza Auto', function () {

        before(() => {
            cy.getClientWithPolizze(currentTutf, '31', false, false, 'PF', (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? true : false).then(customerFullName => {
                currentCustomerFullName = customerFullName
            })
        })

        it('Verifica Aggiungi Nota', function () {
            if (currentCustomerFullName !== "") {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                SintesiCliente.retriveUrl().then(currentUrl => {
                    urlClient = currentUrl
                })
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Motor')
                NoteContratto.inserisciNotaContratto()
                NoteContratto.checkNotaInserita()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(1 nota)', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkTooltipNote('1')
            } else
                this.skip()
        })

        it('Verifica Badge Nota', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkBadgeNota()
            } else
                this.skip()
        })

        it('Verifica Modifica di una nota', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.modificaNota()
            } else
                this.skip()
        })

        it('Verifica "Aggiungi nota" dal badge Note', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.inserisciNotaFromBadge()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note)', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkTooltipNote('2')
            } else
                this.skip()
        })

        it('Verifica Flag Importante', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkImportante()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note) di cui 1 importante', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkTooltipNote('3')
            } else
                this.skip()
        })

        it('Verifica Da Sales La presenza delle note di contratto', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.getPolizza().then((polizza) => {
                    HomePage.reloadMWHomePage()
                    TopBar.clickSales()
                    BurgerMenuSales.clickLink('Note di contratto')
                    SCUSalesNoteContratto.searchPolizza(polizza)
                })
            } else
                this.skip()
        })

        it('Verifica modifica nota da Sales', function () {
            if (currentCustomerFullName !== "") {
                SCUSalesNoteContratto.modificaNota()
            } else
                this.skip()
        })

        it('Verifica che la modifica sia stata effettuata anche su Clients', function () {
            if (currentCustomerFullName !== "") {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Motor')
                NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
            } else
                this.skip()
        })

        it('Verifica l\'eliminazione delle note', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.cancellaNote()
            } else
                this.skip()
        })
    })

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
        context('Polizza Rami Vari', function () {

            before(() => {
                cy.getClientWithPolizze(currentTutf, '11', false, false, 'PF', (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? true : false).then(customerFullName => {
                    currentCustomerFullName = customerFullName
                })
            })

            it('Verifica Aggiungi Nota', function () {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Rami vari')
                NoteContratto.inserisciNotaContratto()
            })

            it('Verifica Tooltip numero di note presenti(1 nota)', function () {
                NoteContratto.checkTooltipNote('1')
            })

            it('Verifica Badge Nota', function () {
                NoteContratto.checkBadgeNota()
            })

            it('Verifica Modifica di una nota', function () {
                NoteContratto.modificaNota()
            })

            it('Verifica "Aggiungi nota" dal badge Note', function () {
                NoteContratto.inserisciNotaFromBadge()
            })

            it('Verifica Tooltip numero di note presenti(2 note)', function () {
                NoteContratto.checkTooltipNote('2')
            })

            it('Verifica Flag Importante', function () {
                NoteContratto.checkImportante()
            })

            it('Verifica Tooltip numero di note presenti(2 note) di cui 1 importante', function () {
                NoteContratto.checkTooltipNote('3')
            })

            it('Verifica Da Sales La presenza delle note di contratto', function () {
                NoteContratto.getPolizza().then((polizza) => {
                    HomePage.reloadMWHomePage()
                    TopBar.clickSales()
                    BurgerMenuSales.clickLink('Note di contratto')
                    SCUSalesNoteContratto.searchPolizza(polizza)
                })
            })

            it('Verifica modifica nota da Sales', function () {
                SCUSalesNoteContratto.modificaNota()
            })

            it('Verifica che la modifica sia stata effettuata anche su Clients', function () {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Rami vari')
                NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
            })

            it('Verifica l\'eliminazione delle note', function () {
                NoteContratto.cancellaNote()
            })
        })

    context('Polizza Ultra', function () {
        before(() => {
            cy.getClientWithPolizze(currentTutf, '42', false, false, 'PF', (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? true : false).then(customerFullName => {
                currentCustomerFullName = customerFullName
            })
        })

        it('Verifica Aggiungi Nota', function () {
            if (currentCustomerFullName !== "") {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra' : 'Allianz Ultra')
                NoteContratto.inserisciNotaContratto()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(1 nota)', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkTooltipNote('1')
            } else
                this.skip()
        })

        it('Verifica Badge Nota', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkBadgeNota()
            } else
                this.skip()
        })

        it('Verifica Modifica di una nota', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.modificaNota()
            } else
                this.skip()
        })

        it('Verifica "Aggiungi nota" dal badge Note', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.inserisciNotaFromBadge()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note)', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkTooltipNote('2')
            } else
                this.skip()
        })

        it('Verifica Flag Importante', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkImportante()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note) di cui 1 importante', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.checkTooltipNote('3')
            } else
                this.skip()
        })

        it('Verifica Da Sales La presenza delle note di contratto', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.getPolizza().then((polizza) => {
                    HomePage.reloadMWHomePage()
                    TopBar.clickSales()
                    BurgerMenuSales.clickLink('Note di contratto')
                    SCUSalesNoteContratto.searchPolizza(polizza)
                })
            } else
                this.skip()
        })

        it('Verifica modifica nota da Sales', function () {
            if (currentCustomerFullName !== "") {
                SCUSalesNoteContratto.modificaNota()

            } else
                this.skip()
        })

        it('Verifica che la modifica sia stata effettuata anche su Clients', function () {
            if (currentCustomerFullName !== "") {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra' : 'Allianz Ultra')
                NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
            } else
                this.skip()
        })

        it('Verifica l\'eliminazione delle note', function () {
            if (currentCustomerFullName !== "") {
                NoteContratto.cancellaNote()
            } else
                this.skip()
        })
    })

    context('Polizza Vita', function () {
        it('Verifica Aggiungi Nota', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                //('Retriving client with polizze vita, please wait...')
                cy.getClientWithPolizze(currentTutf, '86').then(customerFullName => {
                    currentCustomerFullName = customerFullName
                    TopBar.search(currentCustomerFullName)
                    LandingRicerca.filtra()
                    LandingRicerca.clickClientePF(currentCustomerFullName)
                    SintesiCliente.retriveUrl().then(currentUrl => {
                        urlClient = currentUrl
                    })
                    Portafoglio.clickTabPortafoglio()
                    Portafoglio.clickSubTab('Polizze attive')
                    Portafoglio.filtraPolizze('Vita')
                    NoteContratto.inserisciNotaContratto()
                })
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(1 nota)', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkTooltipNote('1')
            } else
                this.skip()
        })

        it('Verifica Badge Nota', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkBadgeNota()
            } else
                this.skip()
        })

        it('Verifica Modifica di una nota', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.modificaNota()
            } else
                this.skip()
        })

        it('Verifica "Aggiungi nota" dal badge Note', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.inserisciNotaFromBadge()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note)', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkTooltipNote('2')
            } else
                this.skip()
        })

        it('Verifica Flag Importante', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkImportante()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note) di cui 1 importante', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkTooltipNote('3')
            } else
                this.skip()
        })

        it('Verifica Da Sales La presenza delle note di contratto', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.getPolizza().then((polizza) => {
                    HomePage.reloadMWHomePage()
                    TopBar.clickSales()
                    BurgerMenuSales.clickLink('Note di contratto')
                    SCUSalesNoteContratto.searchPolizza(polizza)
                })
            } else
                this.skip()
        })

        it('Verifica modifica nota da Sales', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                SCUSalesNoteContratto.modificaNota()
            } else
                this.skip()
        })

        it('Verifica che la modifica sia stata effettuata anche su Clients', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Vita')
                NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
            } else
                this.skip()
        })

        it('Verifica l\'eliminazione delle note', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.cancellaNote()
            } else
                this.skip()
        })
    })

    context('Polizza Allianz1 Business', function () {
        //('Retriving client with polizze allianz 1 business, please wait...')
        it('Verifica Aggiungi Nota', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                cy.getClientWithPolizze(currentTutf, '42', false, true).then(customerFullName => {
                    currentCustomerFullName = customerFullName
                    TopBar.search(currentCustomerFullName)
                    LandingRicerca.filtra()
                    LandingRicerca.clickClientePF(currentCustomerFullName)
                    Portafoglio.clickTabPortafoglio()
                    Portafoglio.clickSubTab('Polizze attive')
                    Portafoglio.filtraPolizze('Allianz 1')
                    NoteContratto.inserisciNotaContratto()
                })
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(1 nota)', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkTooltipNote('1')
            } else
                this.skip()
        })

        it('Verifica Badge Nota', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkBadgeNota()
            } else
                this.skip()
        })

        it('Verifica Modifica di una nota', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.modificaNota()
            } else
                this.skip()
        })

        it('Verifica "Aggiungi nota" dal badge Note', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.inserisciNotaFromBadge()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note)', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkTooltipNote('2')
            } else
                this.skip()
        })

        it('Verifica Flag Importante', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkImportante()
            } else
                this.skip()
        })

        it('Verifica Tooltip numero di note presenti(2 note) di cui 1 importante', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.checkTooltipNote('3')
            } else
                this.skip()
        })

        it('Verifica Da Sales La presenza delle note di contratto', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.getPolizza().then((polizza) => {
                    HomePage.reloadMWHomePage()
                    TopBar.clickSales()
                    BurgerMenuSales.clickLink('Note di contratto')
                    SCUSalesNoteContratto.searchPolizza(polizza)
                })
            } else
                this.skip()
        })

        it('Verifica modifica nota da Sales', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                SCUSalesNoteContratto.modificaNota()
            } else
                this.skip()
        })

        it('Verifica che la modifica sia stata effettuata anche su Clients', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                TopBar.search(currentCustomerFullName)
                LandingRicerca.filtra()
                LandingRicerca.clickClientePF(currentCustomerFullName)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Allianz 1')
                NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
            } else
                this.skip()
        })

        it('Verifica l\'eliminazione delle note', function () {
            if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                NoteContratto.cancellaNote()
            } else
                this.skip()
        })
    })
})