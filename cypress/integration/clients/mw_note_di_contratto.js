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
    cy.getUserWinLogin().then(data => {
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })
        LoginPage.logInMWAdvanced()
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
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion
})
//#endregion Before After

let currentCustomerNumber
describe('Matrix Web : Note di contratto', function () {

    context('Polizza Auto', function () {

        it('Verifica Aggiungi Nota', function () {
            //('Retriving client with polizze auto, please wait...')
            cy.getClientWithPolizze('TUTF021', '31').then(customerNumber => {
                currentCustomerNumber = customerNumber
                SintesiCliente.visitUrlClient(customerNumber, false)
                SintesiCliente.retriveUrl().then(currentUrl => {
                    urlClient = currentUrl
                })
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Motor')
                NoteContratto.inserisciNotaContratto()
                NoteContratto.checkNotaInserita()
            })
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
            SintesiCliente.visitUrlClient(currentCustomerNumber, false)
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
            Portafoglio.filtraPolizze('Motor')
            NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
        })

        it('Verifica l\'eliminazione delle note', function () {
            NoteContratto.cancellaNote()
        })
    })

    context('Polizza Vita', function () {
        it('Verifica Aggiungi Nota', function () {
            //('Retriving client with polizze vita, please wait...')
            cy.getClientWithPolizze('TUTF021', '86').then(customerNumber => {
                currentCustomerNumber = customerNumber
                SintesiCliente.visitUrlClient(customerNumber, false)
                SintesiCliente.retriveUrl().then(currentUrl => {
                    urlClient = currentUrl
                })
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Vita')
                NoteContratto.inserisciNotaContratto()
            })
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
            SintesiCliente.visitUrlClient(currentCustomerNumber, false)
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
            Portafoglio.filtraPolizze('Vita')
            NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
        })

        it('Verifica l\'eliminazione delle note', function () {
            NoteContratto.cancellaNote()
        })
    })

    context('Polizza Rami Vari', function () {
        it('Verifica Aggiungi Nota', function () {
            //('Retriving client with polizze rami vari, please wait...')
            cy.getClientWithPolizze('TUTF021', '11').then(customerNumber => {
                currentCustomerNumber = customerNumber
                SintesiCliente.visitUrlClient(customerNumber, false)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Rami vari')
                NoteContratto.inserisciNotaContratto()
            })
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
            SintesiCliente.visitUrlClient(currentCustomerNumber, false)
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
        it('Verifica Aggiungi Nota', function () {
            //('Retriving client with polizze ultra, please wait...')
            cy.getClientWithPolizze('TUTF021', '42', true).then(customerNumber => {
                currentCustomerNumber = customerNumber
                SintesiCliente.visitUrlClient(customerNumber, false)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Allianz Ultra')
                NoteContratto.inserisciNotaContratto()
            })
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
            SintesiCliente.visitUrlClient(currentCustomerNumber, false)
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
            Portafoglio.filtraPolizze('Allianz Ultra')
            NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
        })

        it('Verifica l\'eliminazione delle note', function () {
            NoteContratto.cancellaNote()
        })
    })

    context('Polizza Allianz1 Business', function () {
        //('Retriving client with polizze allianz 1 business, please wait...')
        it('Verifica Aggiungi Nota', function () {
            cy.getClientWithPolizze('TUTF021', '42', false, true).then(customerNumber => {
                currentCustomerNumber = customerNumber
                SintesiCliente.visitUrlClient(customerNumber, false)
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Polizze attive')
                Portafoglio.filtraPolizze('Allianz 1')
                NoteContratto.inserisciNotaContratto()
            })
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
            SintesiCliente.visitUrlClient(currentCustomerNumber, false)
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
            Portafoglio.filtraPolizze('Allianz 1')
            NoteContratto.checkNotaModificata('TEST DESCRIZIONE MODIFICATO DA SALES')
        })

        it('Verifica l\'eliminazione delle note', function () {
            NoteContratto.cancellaNote()
        })
    })
})
