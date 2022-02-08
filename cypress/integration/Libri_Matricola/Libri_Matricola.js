/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 *
 * @description Emissione preventivo madre per Libri Matricola
 */

///<reference types="cypress"/>

//#region imports
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import LibriMatricola from "../../mw_page_objects/motor/LibriMatricola"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import 'cypress-iframe';
import Veicoli from '../../mw_page_objects/motor/ListaVeicoli'
//import cypress from "cypress";
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
const dbConfig_da = Cypress.env('db_da')
let insertedId
//#endregion

import { PrevApplicazione } from '../../mw_page_objects/motor/LibriMatricola'
import { PreventivoMadre } from '../../mw_page_objects/motor/LibriMatricola'


//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregions

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

// afterEach(function () {
//     if (this.currentTest.state !== 'passed') {
//         //TopBar.logOutMW()
//         //#region Mysql
//         cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//             let tests = testsInfo
//             cy.finishMysql(dbConfig, insertedId, tests)
//         })
//         //#endregion
//         //Cypress.runner.stop();
//     }
// })

// after(function () {
//     TopBar.logOutMW()
//     //#region Mysql
//     cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//         let tests = testsInfo
//         cy.finishMysql(dbConfig, insertedId, tests)
//     })
//     //#endregion
// })
//#endregion Before After

describe("LIBRI MATRICOLA", function () {
    var nPreventivo
    var nPreventivoMadre

    context.only('PREVENTIVO MADRE', function () {
        PreventivoMadre()
        nPreventivoMadre = nPreventivo //! Da verificare se lo legge per la conversione
    })

    context('APPLICAZIONI', function () {
        PrevApplicazione('Auto', Veicoli.Auto_WW745FF(), ['Furto'])

        PrevApplicazione('Moto', Veicoli.Moto_MM25896(), [])

        PrevApplicazione('Auto No RCA', Veicoli.Auto_ZZ841PP(), ['Furto'], false, 4)

    })


    context('APPLICAZIONE E CONVERSIONE POLIZZA MADRE', function () {
        it('CONVERSIONE', () => {
            cy.log(nPreventivo)
            //#region
            // ! DA TOGLIERE A FINE TEST COMPLETATO
            TopBar.search('04818780480')
            LandingRicerca.clickFirstResult()
            SintesiCliente.clickAuto()
            SintesiCliente.clickLibriMatricola()
            LibriMatricola.AperturaTabPreventivi()
            //#endregion

            
            // LibriMatricola.conversione()
            LibriMatricola.accessoPreventivoPolizzaMadre('271228') //    nPreventivoMadre
        });

        it("Riepilogo", () => {
            LibriMatricola.Avanti()
        })

        it("Integrazione", () => {
            LibriMatricola.IntegrazioneEmettiPolizza()
            // cy.wait('@loadIntegrazione', { requestTimeout: 60000 });
        })
        
        it("Consensi", () => {
            LibriMatricola.consensi()
        })

        it("Finale", () => {
            LibriMatricola.ContrattoFinale()
            LibriMatricola.FinaleGoHome()
            // LibriMatricola.caricamentoElencoApplicazioni()

            cy.get('@contratto').then(val => {
                nPreventivoApp = val
                cy.log("Preventivo Applicazione n. " + nPreventivoApp)
            })
        })

    })

})