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
        Sfera.accediSferaDaHomePageMW(true)

        Sfera.selezionaPortafoglio(false, Sfera.PORTAFOGLI.MOTOR)
        Sfera.setDateEstrazione()
        Sfera.filtraTipoQuietanze(Sfera.TIPOQUIETANZE.DA_LAVORARE)
        Sfera.estrai()
        Sfera.filtraSuColonna(Sfera.FILTRI.INFO, Sfera.FILTRI.INFO.values.ENTRO_PERIODO_MORA)
    })
})

beforeEach(() => {
    cy.preserveCookies()
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
if (!Cypress.env('isSecondWindow'))
    describe('Matrix Web : Sfera 4.0 - Menu Contestuale', function () {
        context('Motor > Menu Quietanza', () => {

            it('Incasso', function () {
                Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, false)
            })

            it('Delta premio', function () {
                Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.DELTA_PREMIO, false)
            })

            it('Riduzione premi > Variazione riduzione premi', function () {
                //? Verificare sempre che ci sia plafond assegnato alla 1-710000 (chiedi simone.sergas@allianz.it)
                Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.DELTA_PREMIO)
                Sfera.espandiPannello()
                Sfera.estrai()
                Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
                Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.VARIAZIONE_RIDUZIONE_PREMI, false)
            })

            it('Stampa senza incasso', function () {
                Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.STAMPA_SENZA_INCASSO, false)
            })

            //TODO supporto per trovare modalità estrazione per queste voci affinchè siano utilizzabili
            // it('Riquietanzamento per clienti valori extra', 
            //  () {
            // })

            // it('Riduzione premi > Consolidamento Riduzione Premi', function () {
            // })

            // it('Generazione avviso', function () {
            // })
        })

        context('Motor > Menu Polizza', function () {
            it('Sostituzione / Riattivazione auto', function () {
                //! NON VA AVANTI PASSA AL PROSSIMO TESTS
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

        context('Menu Cliente', function () {
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

        context('Menu Emissione', function () {
            it('Nuova polizza Auto', function () {
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
else
    describe('Matrix Web : Sfera 4.0 -> Seconda Finestra', function () {
        it('Menu Contestuale', function () {

            //Menu Quietanza
            Sfera.gestisciColonne(['Num. Gg. Per. Mo.'])
            Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
            Sfera.filtraSuColonna(Sfera.FILTRI.NUM_GG_PER_MO, Sfera.FILTRI.NUM_GG_PER_MO.values.MORA_10)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.INCASSO, false)

            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.DELTA_PREMIO, false, null, null, null, true)
            // ? Verificare sempre che ci sia plafond assegnato alla 1-710000 (chiedi simone.sergas@allianz.it)
            Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.DELTA_PREMIO)
            Sfera.espandiPannello()
            Sfera.estrai()
            Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.VARIAZIONE_RIDUZIONE_PREMI, false, null, null, null, true)

            Sfera.gestisciColonne(['Num. Gg. Per. Mo.'])
            Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
            Sfera.filtraSuColonna(Sfera.FILTRI.NUM_GG_PER_MO, Sfera.FILTRI.NUM_GG_PER_MO.values.MORA_10)
            Sfera.apriVoceMenu(Sfera.VOCIMENUQUIETANZA.STAMPA_SENZA_INCASSO, false, null, null, null, true)
            
            // Menu Polizza
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.SOSTITUZIONE_RIATTIVAZIONE_AUTO, false, null, Sfera.TIPOSOSTITUZIONERIATTIVAZIONE.SOSTITUZIONE_STESSO_VEICOLO)
            Sfera.filtraSuColonna(Sfera.FILTRI.AGENZIA, Sfera.FILTRI.AGENZIA.values.A_710000)
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.CONSULTAZIONE_POLIZZA, false, null, null, null, true)
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.CONSULTAZIONE_DOCUMENTI_POLIZZA, false, null, null, null, true)
            Sfera.apriVoceMenu(Sfera.VOCIMENUPOLIZZA.MODIFICA_MODALITA_PAGAMENTO, false, null, null, Sfera.TIPOMODALITAPAGAMENTO.CONTANTI)

            //Menu Cliente
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.SCHEDA_CLIENTE, false, null, null, null, true)
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_POLIZZE, false, null, null, null, true)
            Sfera.apriVoceMenu(Sfera.VOCIMENUCLIENTE.LISTA_SINISTRI, false, null, null, null, true)
        })
    })