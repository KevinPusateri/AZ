/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 *
 * @description Emissione preventivo madre per Libri Matricola
 */

///<reference types="cypress"/>

//#region imports
import LoginPage from "../../mw_page_objects/common/LoginPage"
import LibriMatricola from "../../mw_page_objects/motor/LibriMatricola"
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
import TopBar from "../../mw_page_objects/common/TopBar";
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca";
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";


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

describe("LIBRI MATRICOLA", {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {
    var nPreventivoMadre
    var nContratto
    context('PREVENTIVO MADRE', function () {
        PreventivoMadre()

    })

    context('APPLICAZIONI', function () {
        PrevApplicazione('Auto', Veicoli.Auto_WW745FF(), ['Furto'])

        // PrevApplicazione('Moto', Veicoli.Moto_MM25896(), [])

        // PrevApplicazione('Auto No RCA', Veicoli.Auto_ZZ841PP(), ['Furto'], false, 4)
    })

    context('CONFERMA PREVENTIVI APPLICAZIONE E CONVERSIONE POLIZZA MADRE', function () {
        it('Conferma preventivi', function () {
            cy.pause()
            //#region
            // ! DA TOGLIERE A FINE TEST COMPLETATO
            // TopBar.search('09473521004')
            // LandingRicerca.clickFirstResult()
            // SintesiCliente.clickAuto()
            // SintesiCliente.clickLibriMatricola()
            // SintesiCliente.emissioneAuto(menuAuto.prodottiParticolari.libriMatricola)
            // cy.wait('@LibriMatricolaDA', { requestTimeout: 50000 });
            // LibriMatricola.AperturaTabPreventivi()
            //#endregion

            LibriMatricola.backElencoPreventivi()
            LibriMatricola.getPreventivoMadre()
            cy.get('@nPrevMadre').then(val => {
                nPreventivoMadre = val
                LibriMatricola.AperturaElencoApplicazioni(nPreventivoMadre)
                LibriMatricola.confermaPreventivi()
                LibriMatricola.backElencoPreventivi()
                LibriMatricola.accessoPreventivoPolizzaMadre(nPreventivoMadre) //    nPreventivoMadre
            })

        });

        it("Riepilogo", function () {
            LibriMatricola.Avanti()
        })

        it("Integrazione", function () {
            LibriMatricola.IntegrazioneEmettiPolizza()
        })

        it("Consensi", function () {
            LibriMatricola.consensi()
        })

        it("Finale", function () {
            LibriMatricola.FinaleContrattoLibroMatricola()
            LibriMatricola.FinaleGoHome()

            cy.get('@contratto').then(val => {
                nContratto = val
                cy.log("nContratto b " + nContratto)
            })
        })

        it("Verifica presenza Contratto Libro Matricola", function () {
            LibriMatricola.AperturaTabLibriMatricola()
            LibriMatricola.VerificaPresenzaContrattoLibroMatricola(nContratto)
        })
    })


    context.skip('CONVERSIONE E STAMPA MASSIVA PREVENTIVI APPLICAZIONE', function () {
        it('Conversione', function () {
            LibriMatricola.getLibroMatricola()
            cy.get('@nLibroMatricola').then(nLibroMatricola => {

                cy.writeFile('LibriMatricola/LibriMatricola.json', {
                    numContrattoLibro: val
                })
                LibriMatricola.accessoElencoApplicazioniLibroMatricola(nLibroMatricola)
                LibriMatricola.conversione()
            })

        })
    })

    context('INCASSO POLIZZA MADRE', function () {
        it('Incasso', function () {
            cy.fixture('LibriMatricola/LibriMatricola.json').then((data) => {
                TopBar.search(data.ClientePGIVA)
                LandingRicerca.clickFirstResult()
            })
            SintesiCliente.clickAuto()
            SintesiCliente.clickLibriMatricola()
            cy.fixture('LibriMatricola/LibriMatricola.json').then((data) => {
                LibriMatricola.accessoIncassoPolizzaMadre(data.numContrattoLibro)
            })
            LibriMatricola.incasso()
        })

    })
})