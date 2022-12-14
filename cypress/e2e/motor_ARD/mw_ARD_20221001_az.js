/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
import Sales from "../../mw_page_objects/navigation/Sales"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import TenutaTariffa from "../../mw_page_objects/tenutaTariffa/TenutaTariffa"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { tariffaCases as ardCases } from '../../fixtures/tariffe_ARD/tariffaCases_ARD_20221001_az.json'
//#endregion

before(() => {
    Cypress.env('isAviva', false)
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })
    })
    if (cases === '')
        cy.task('info', `Test su tutti i Casi`)
    else{
        cy.task('info', `Run su i seguenti test`)
        ardCases.forEach((currentCase, k) => {
            if (caseToExecute.includes(currentCase.Identificativo_Caso))
            cy.task('info', 'CASO ' + currentCase.Identificativo_Caso + ': ' + currentCase.Descrizione_Settore)
        })
    }
})

beforeEach(() => {
    cy.preserveCookies()
})

after(function () {
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
})

//?Se a true, non si passa in emissione motor da Sales ma da un cliente Random di Clients
let flowClients = false
//?Se specificato, esegue i test per i casi specificati (inserirli in formato stringa)
let cases = Cypress.env('caseToExecute')
let caseToExecute
if (cases === '')
    caseToExecute = []
else {
    if (cases.length > 1)
        caseToExecute = cases.split('-')
    else {
        caseToExecute = [`${cases}`]
    }
}
describe('ARD Ottobre 2022: ', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, function () {
    ardCases.forEach((currentCase, k) => {
        describe(`Case ${k + 1} ` + currentCase.Descrizione_Settore, function () {
            it("Flusso", function () {
                if ((caseToExecute.length === 0 && currentCase.Identificativo_Caso !== 'SKIP') || caseToExecute.includes(currentCase.Identificativo_Caso)) {
                    Common.visitUrlOnEnv()

                    if (flowClients) {
                        TopBar.searchRandom()
                        LandingRicerca.searchRandomClient(true, (currentCase.Tipologia_Entita === 'Persona' ? 'PF' : 'PG'), 'P')
                        LandingRicerca.clickRandomResult('PF')
                        SintesiCliente.clickAuto()
                        SintesiCliente.clickPreventivoMotor()
                    }
                    else {
                        TopBar.clickSales()
                        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
                    }

                    TenutaTariffa.compilaDatiQuotazione(currentCase, flowClients)
                    TenutaTariffa.compilaContraenteProprietario(currentCase, flowClients)
                    TenutaTariffa.compilaVeicolo(currentCase)
                    TenutaTariffa.compilaProvenienza(currentCase)
                    TenutaTariffa.compilaOffertaARD(currentCase)
                    TenutaTariffa.areaRiservata(currentCase)

                    TenutaTariffa.checkTariffaARD(currentCase)
                }
                else
                    this.skip()
            })
        })
    })
})