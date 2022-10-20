/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import SCU from "../../mw_page_objects/clients/SCU"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import News from "../../mw_page_objects/Navigation/News"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion
before(() => {
    console.log(Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
    console.log(Cypress.env('isSecondWindow'))
    console.log(Cypress.env('monoUtenza'))
    console.log(Cypress.env('currentEnv'))

    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
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

describe('Buca di Ricerca', {
    retries: {
        runMode: 1,
        openMode: 1,
    }
}, function () {
    if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
        it('Verifica che sia assente "Ricerca Classica"', function () {
            LandingRicerca.searchRandomClient(false)
            LandingRicerca.checkNotExistRicercaClassica()
        })
    else {
        //#region OLD Version for US AZMAWE-315(pre Rel 127 bis) IN PP funzionannte
        // it('Verifica Click su Ricerca Classica', function () {
        //     LandingRicerca.searchRandomClient(false)
        //     LandingRicerca.checkRicercaClassica()
        // })

        // it('Verifica Click su Ricerca Cliente', function () {
        //     LandingRicerca.searchRandomClient(false)
        //     LandingRicerca.clickRicercaClassicaLabel('Ricerca Cliente')
        //     SCU.checkAggancioRicerca()
        // })

        // it('Verifica Click su Ricerca Polizze proposte', function () {
        //     LandingRicerca.searchRandomClient(false)
        //     LandingRicerca.clickRicercaClassicaLabel('Ricerca Polizze proposte')
        //     SCU.checkAggancioPolizzePropostePreventivi()
        // })

        // it('Verifica Click su Rubrica', function () {
        //     LandingRicerca.searchRandomClient(false)
        //     LandingRicerca.clickRicercaClassicaLabel('Rubrica')
        //     SCU.checkAggancioRubrica()
        // })

        // it('Verifica Click su Ricerca Preventivi', function () {
        //     LandingRicerca.searchRandomClient(false)
        //     LandingRicerca.clickRicercaClassicaLabel('Ricerca Preventivi')
        //     SCU.checkAggancioPolizzePropostePreventivi()
        // })
        //#endregion

        // SOLO in TEST Rel 127 bis
        it('Verifica Click su Ricerca Classica', function () {
            LandingRicerca.searchRandomClient(false)
            LandingRicerca.checkAggancioRicercaCliente()
        })
    }
})