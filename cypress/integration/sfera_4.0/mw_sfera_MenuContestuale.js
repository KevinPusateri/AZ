/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sfera from "../../mw_page_objects/sfera/Sfera"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
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
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        Sfera.accediSferaDaHomePageMW()

        Sfera.selezionaPortafoglio(false, Sfera.PORTAFOGLI.MOTOR)
        Sfera.setDateEstrazione()
        //Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
        //Sfera.selezionaCluserMotor(Sfera.CLUSTERMOTOR.IN_MORA, true)
        //Sfera.estrai()
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

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

describe('Matrix Web : Sfera 4.0 - Menu Contestuale', function () {
    context('Motor > Menu Quietanza', () => {

        it('Incasso', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, false)
        })

        it('Delta premio', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.DELTA_PREMIO, false)
        })

        it('Riduzione premi > Variazione riduzione premi', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.VARIAZIONE_RIDUZIONE_PREMI, false)
        })

        it('Stampa senza incasso', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.STAMPA_SENZA_INCASSO, false)
        })

        //TODO supporto per trovare modalità estrazione per queste voci affinchè siano utilizzabili
        // it('Riquietanzamento per clienti valori extra', function () {
        // })

        // it('Riduzione premi > Consolidamento Riduzione Premi', function () {
        // })

        // it('Generazione avviso', function () {
        // })
    })

    context('Motor > Menu Polizza', function(){
        it('Sostituzione / Riattivazione auto', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.SOSTITUZIONE_RIATTIVAZIONE_AUTO, false, null, Sfera.TIPOSOSTITUZIONERIATTIVAZIONE.SOSTITUZIONE_STESSO_VEICOLO)
        })

        it('Consultazione > Polizza', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.CONSULTAZIONE_POLIZZA, false)
        })

        it('Consultazione > Documenti di polizza', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.CONSULTAZIONE_DOCUMENTI_POLIZZA, false)
        })

        it('Modifica modalità di pagamento preferito della polizza', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.MODIFICA_MODALITA_PAGAMENTO, false, null, null, Sfera.TIPOMODALITAPAGAMENTO.CONTANTI)
        })

        //TODO supporto per trovare modalità estrazione per queste voci affinchè siano utilizzabili
        // it('Ripresa prev. auto', function () {
        // })

        // it('Dettaglio abbinata', function () {
        // })

        // it('Disattivazione Allianz Pay', function () {
        // })
    })

    //TODO
    // context('Rami Vari > Menu Polizza'), function(){
    //     it('Sostituzione rami vari', function () {
    //     })

    //     it('Consultazione > Comparatore AZ ultra', function () {
            
    //     })

    //     it('Modulari', function () {
            
    //     });
    // }

    context('Menu Cliente', function() {
        it('Scheda cliente', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.SCHEDA_CLIENTE, false)
        })

        it('Lista polizze', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE, false)
        })

        it('Lista sinistri', function () {
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI, false)
        })

        //TODO estrazione sul ptf vita
        // it('Report profilo vita', function () {
        // })
    })

    context('Menu Emissione', function() {
        it.only('Nuova polizza Auto', function () {
            cy.pause()
        })

        it('Nuova polizza Rami Vari', function () {
        })

        it('Servizio consulenza del Vita', function () {
        })

        it('Nuova polizza Allianz Ultra Casa e Patrimonio', function () {
        })

        it('Nuova polizza Allianz Ultra Salute', function () {
        })

        it('Nuova polizza Allianz Ultra Impresa', function () {
        })

        it('Preventivo Motor', function () {
        })
    });
})