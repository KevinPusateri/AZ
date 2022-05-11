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
import { InclusioneApplicazione } from '../../mw_page_objects/motor/LibriMatricola'
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca";
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";
import TopBar from "../../mw_page_objects/common/TopBar";


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

    // it.only('MW', function () {
    //     TopBar.logOutMW()
    // });

    // it.only('VPS', function () {
    //     // cy.visit('http://online.pp.azi.allianzit/AutorDanni/VPS/VPS.aspx')
    //     // cy.origin('https://amlogin-pp.allianz.it/nidp/idff/sso?sid=0&sid=0')
    //     // cy.get('table').should('be.visible')
    //     // cy.get('[name="Ecom_User_ID"]').type('euvps02')
    //     // cy.get('[name="Ecom_Password"]').type('pwdeuvps02')
    //     // cy.get('[value="Conferma"]').click()
    //     let email = 'euvps02'
    //     let psw = 'pwdeuvps02'
    //     cy.session(([email, psw]), () => {

    //         cy.visit('http://online.pp.azi.allianzit/AutorDanni/VPS/VPS.aspx')
    //         cy.get('[name="Ecom_User_ID"]').type('euvps02')
    //         cy.get('[name="Ecom_Password"]').type('pwdeuvps02')
    //         cy.get('[value="Conferma"]').click()
    //         cy.url()
    //             .should("include", 'sasasa');
    //         cy.origin('https://amlogin-pp.allianz.it/nidp/idff/',
    //             { args: [email, psw] },
    //             ([email, psw]) => {
    //                 cy.get('[name="Ecom_User_ID"]').type(email)
    //                 cy.get('[name="Ecom_Password"]').type(psw)
    //             })
    //     })
    // });

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
                TopBar.logOutMW()
            })

        })
    })

    context('INCASSO POLIZZA MADRE', function () {
        it('Incasso', function () {
            cy.fixture('LibriMatricola/LibriMatricola.json').then((data) => {
                LoginPage.logInMWAdvanced()
                LandingRicerca.search(data.ClientePGIVA)
                LandingRicerca.clickFirstResult()
                SintesiCliente.clickAuto()
                SintesiCliente.clickLibriMatricola()
                // LibriMatricola.backElencoLibriMatricola()
                LibriMatricola.accessoIncassoPolizzaMadre(data.numContrattoLibro)
                LibriMatricola.incasso()
                
            })
        })

    })


    // context.only('INCLUSIONE APPLICAZIONI', function () {
    //     //! impostare Come primo parametro : 1 caso di test 
    //     InclusioneApplicazione('Auto', Veicoli.Auto_Applicazione1(), ['Furto'])
    // })

})