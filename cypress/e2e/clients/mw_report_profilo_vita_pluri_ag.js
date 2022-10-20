/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
* @description Da spalla sx in sintesi cliente da Clients, gestione di report profilo vita
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import HomePage from "../../mw_page_objects/common/HomePage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
const agency = '010710000'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )
    })
})
beforeEach(() => {
    cy.preserveCookies()
})
afterEach(function () {
    if (this.currentTest.state !== 'passed') {
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

let currentCustomerNumber
let urlClient
describe('Matrix Web : Report Profilo Vita', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {
    it('Da Clients ricercare un cliente PG presente su più agenzia dell\'hub con Polizza Vita e da menu azioni premere Report profilo vita\n' +
        'Verificare che si apra la maschera di disambiguazione con le agenzie\n' +
        '- scegliendo l\'agenzia dove ha le polizze vita :  verificare che si apra correttamente il pdf\n', () => {
            cy.log('Retriving client PG present in different agencies with polizze vita, please wait...')
            //! Cliente registrato su più agenzie HUB 010375000 con polizza VI solo su una ag -> partita iva 00578020935 
            cy.getClientInDifferentAgenciesWithPolizze('010375000', 80, false, false, 'PG', ).then(currentClient => {

                debugger
                let customImpersonification = {
                    "agentId": currentClient.impersonificationToUse.account,
                    "agency": currentClient.impersonificationToUse.agency
                }
                cy.log('Retrived Client : ' + currentClient.clientToUse.vatIN)
                debugger
                LoginPage.logInMWAdvanced(customImpersonification)
                TopBar.search(currentClient.clientToUse.vatIN)
                LandingRicerca.filtra()
                cy.get('body').as('body').then(($body) => {
                    cy.get('lib-clients-container').should('be.visible')
                    const check = $body.find('span:contains("La ricerca non ha prodotto risultati")').is(':visible')
                    if (check) {
                        TopBar.logOutMW()
                        loopRetriving()
                    }
                })

                LandingRicerca.clickFirstResult()
                SintesiCliente.retriveUrl().then(currentUrl => {
                    urlClient = currentUrl
                })

                SintesiCliente.checkAtterraggioSintesiCliente(currentClient.clientToUse.name)

                //! Commentato per cambiamento comportamento
                //Clicchiamo in disambiguazione nell'ag dove NON ha le polizze VI
                //SintesiCliente.emettiReportProfiloVita(currentClient.agencyToVerify, true)

                //Clicchiamo in disambiguazione nell'ag che ha la polizza VI
                SintesiCliente.emettiReportProfiloVita('375000')

                HomePage.reloadMWHomePage()
            })
        })
})