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
import { tariffaCases } from '../../fixtures//tariffe_ARD/tariffaCases_ARD_aviva.json'
//#endregion

before(() => {
    Cypress.env('isAviva', true)

    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            //List of possible AVIVA
            //14-1960
            // {
            //     "agentId": "AAMCIPRIANO",
            //     "agency": "140001960"
            // }
            //14-1995
            // {
            //     "agentId": "AALALICATA",
            //     "agency": "140001995"
            // }
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced({
                "agentId": "AALALICATA",
                "agency": "140001995"
            })
        })
    })
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
let caseToExecute = []

describe('AVIVA - ARD : ', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, function () {
    tariffaCases.forEach((currentCase, k) => {
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