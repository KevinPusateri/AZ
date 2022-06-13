/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import HomePage from "../../mw_page_objects/common/HomePage"


//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region variables
let currentClient
//#endregion

before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    HomePage.reloadMWHomePage()
    if (!Cypress.env('monoUtenza'))
        cy.getUserWinLogin().then(data => {
            let fileAgency
            if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
                fileAgency = 'agencies'
            else if (!Cypress.env('isAvivaBroker'))
                fileAgency = 'agenciesAviva'
            else
                fileAgency = 'agenciesAvivaBroker'

            cy.fixture(fileAgency).then(agenciesFromFixture => {
                var currentAgency = agenciesFromFixture.shift()
                cy.log('Perform impersonification on ' + currentAgency.agency)
                cy.impersonification(data.tutf, currentAgency.agentId, currentAgency.agency)
                switch (Cypress.currentTest.title) {
                    case 'Verifica subTab Portafoglio':
                    case 'Verifica subTab Polizze attive':
                        cy.getClientWithPolizzeAttive(data.tutf, '31', 'PF', currentAgency).then((client) => {
                            currentClient = client
                            TopBar.search(currentClient.socialSecurityNumber)
                            SintesiCliente.wait()
                        })
                        break
                    case 'Verifica subTab Proposte':
                        cy.getClientWithProposte(data.tutf, '31', 'PF', currentAgency).then((client) => {
                            currentClient = client
                            TopBar.search(currentClient.socialSecurityNumber)
                            SintesiCliente.wait()
                        })
                        break
                    case 'Verifica subTab Preventivi':
                        cy.getClientWithPreventivi(data.tutf, 'PF', currentAgency).then((client) => {
                            currentClient = client
                            TopBar.search(currentClient.socialSecurityNumber)
                            SintesiCliente.wait()
                        })
                        break
                    case 'Verifica subTab Non in vigore':
                        cy.getClientWithNonInVigore(data.tutf, 'PF', currentAgency).then((client) => {
                            currentClient = client
                            TopBar.search(currentClient.socialSecurityNumber)
                            SintesiCliente.wait()
                        })
                        break
                    case 'Verifica subTab Sinistri':
                        cy.getClientWithSinistri(data.tutf, 'PF', currentAgency).then((client) => {
                            currentClient = client
                            TopBar.search(currentClient.socialSecurityNumber)
                            SintesiCliente.wait()
                        })
                        break
                    default:
                        throw new Error('Test Nuovo Da Aggiungere')
                }
            })

        })

    if (Cypress.env('monoUtenza')) {
        TopBar.search('SLZNLL54A04H431Q')
        SintesiCliente.wait()
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

describe('MW: Navigazioni da Scheda Cliente - Tab Portafoglio', function () {

    it('Verifica subTab Portafoglio', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkLinksSubTabs()
    })

    it('Verifica subTab Polizze attive', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        Portafoglio.filtraPolizze('Motor')
        Portafoglio.checkPolizzeAttive()
    })

    it('Verifica subTab Proposte', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Proposte')
        Portafoglio.checkProposte()
    })

    it('Verifica subTab Preventivi', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Preventivi')
        Portafoglio.checkPreventivi()
    })

    it('Verifica subTab Non in vigore', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Non in vigore')
        Portafoglio.checkNonInVigore()
    })

    //TODO: SINISTRI BEFOREACH CISL
    it('Verifica subTab Sinistri', function () {
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Sinistri')
                Portafoglio.checkSinistri()
            }
        })
    })
})