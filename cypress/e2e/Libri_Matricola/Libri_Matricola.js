/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 *
 * @description Emissione preventivo madre per Libri Matricola
 */

///<reference types="cypress"/>
var json = require('../../fixtures/LibriMatricola/Convenzione.json'); //(with path)

//#region imports
import LoginPage from "../../mw_page_objects/common/LoginPage"
import LibriMatricola from "../../mw_page_objects/motor/LibriMatricola"
import 'cypress-iframe';
import Veicoli from '../../mw_page_objects/motor/ListaVeicoli'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
const dbConfig_da = Cypress.env('db_da')
let insertedId
//#endregion

import { PrevApplicazione } from '../../mw_page_objects/motor/LibriMatricola'
import { PreventivoMadre } from '../../mw_page_objects/motor/LibriMatricola'
import { InclusioneApplicazione } from '../../mw_page_objects/motor/LibriMatricola'
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca";
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";
import TopBar from "../../mw_page_objects/common/TopBar";
import HomePage from "../../mw_page_objects/common/HomePage";
import IncassoDA from "../../mw_page_objects/da/IncassoDA";


//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregions

before(() => {
    expect(Cypress.browser.name).to.contain('firefox')
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        TopBar.logOutMW()
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
        //! impostare Come primo parametro : 1 caso di test 
        PrevApplicazione(1, 'Auto', Veicoli.Auto_WW745FF(), ['Furto'])

        PrevApplicazione(2, 'Moto', Veicoli.Moto_MM25896(), [])

        PrevApplicazione(3, 'Auto No RCA', Veicoli.Auto_ZZ841PP(), ['Furto'], false, 4)
    })

    context('CONFERMA PREVENTIVI APPLICAZIONE E CONVERSIONE POLIZZA MADRE', function () {
        it('Conferma preventivi', function () {
            LibriMatricola.backElencoPreventivi()
            LibriMatricola.getPreventivoMadre()
            cy.get('@nPrevMadre').then(val => {
                nPreventivoMadre = val
                LibriMatricola.AperturaElencoApplicazioni(nPreventivoMadre)
                LibriMatricola.confermaPreventivi()
                LibriMatricola.backElencoPreventivi()
                LibriMatricola.accessoPreventivoPolizzaMadre(nPreventivoMadre)
            })

        });

        it("Riepilogo", function () {
            cy.intercept({
                method: 'POST',
                url: '**/GetElencoAutorizzazioni'
            }).as('loadIntegrazione')

            cy.intercept({
                method: '+(GET|POST)',
                url: '**/KoTemplates/**'
            }).as('loadKoTemplates')
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


    context('CONVERSIONE E STAMPA MASSIVA PREVENTIVI APPLICAZIONE', function () {
        it('Conversione', function () {

            LibriMatricola.getLibroMatricola()
            cy.get('@nLibroMatricola').then(nLibroMatricola => {
                cy.readFile('cypress/fixtures/LibriMatricola/LibriMatricola.json').then((obj) => {
                    obj.numContrattoLibro = nLibroMatricola
                    cy.writeFile('cypress/fixtures/LibriMatricola/LibriMatricola.json', obj)
                })
                LibriMatricola.accessoElencoPrevApplicazioni(nLibroMatricola)
                LibriMatricola.conversione()
                // TopBar.logOutMW()
            })

        })
    })

    //TODO login Errore cy.url should
    context('INCASSO POLIZZA MADRE', function () {
        it('Incasso', function () {
            cy.fixture('LibriMatricola/LibriMatricola.json').then((data) => {
                // LoginPage.logInMWAdvanced()
                HomePage.reloadMWHomePage()
                LandingRicerca.search(data.ClientePGIVA)
                LandingRicerca.filtra()
                LandingRicerca.clickFirstResult()
                SintesiCliente.clickAuto()
                SintesiCliente.clickLibriMatricola()
                // LibriMatricola.backElencoLibriMatricola()
                LibriMatricola.accessoIncassoPolizzaMadre(data.numContrattoLibro)
                IncassoDA.accessoMezziPagam()

                LibriMatricola.incasso()

            })
        })

    })


    // context('INCLUSIONE APPLICAZIONI', function () {
    //     //! impostare Come primo parametro : 1 caso di test 
    //     InclusioneApplicazione('Auto', Veicoli.Auto_Applicazione1(), ['Furto'])
    // })

})