/**
* @author Andrea Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca";
import Portafoglio from "../../mw_page_objects/clients/Portafoglio";
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

let currentTutf
let numberPolizza
let currentCustomerFullName
let currentAgency
let performeReload = false
before(() => {
    cy.getUserWinLogin().then(data => {
        currentTutf = data.tutf
        cy.log('Retriving client with Polizze Auto, please wait...')
        cy.getClientWithConsensoOTP(currentTutf).then(polizzaClient => {
            numberPolizza = polizzaClient.numberPolizza
            currentCustomerFullName = polizzaClient.customerName
            let customImpersonification = {
                agentId: polizzaClient.agentId,
                agency: polizzaClient.agency
            }
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced(customImpersonification)
            currentAgency = polizzaClient.agency

            TopBar.search(currentCustomerFullName)
            LandingRicerca.filtraRicerca('E')
            LandingRicerca.clickClientePF(currentCustomerFullName)
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    if (!performeReload)
        performeReload = true
    else
        cy.reload({ log: false })
})

afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        TopBar.clickMatrixHome()
        TopBar.search(currentCustomerFullName)
        LandingRicerca.filtraRicerca('E')
        LandingRicerca.clickClientePF(currentCustomerFullName)
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
    }
});

after(function () {

    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
})

describe('Matrix Web : Verifica Menu Contestuale Polizze Auto Attive (aggancio applicativo)', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, function () {

    context('Sostituzione/Riattivazione', function() {
        it('Sostituzione stesso veicolo', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.sostituzioneStessoVeicolo, true)
        })

        it('Sostituzione diverso veicolo', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.sostituzioneDiversoVeicolo, true)
        })

        it('Sostituzione aggiornamento veicolo - Modifica targa', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.sostituzioneModificaTarga, true)
        })

        it('Sostituzione aggiornamento veicolo - Modifica gancio traino', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.sostituzioneModificaGancioTraino, true)
        })

        it('Sostituzione aggiornamento veicolo - Modifica dati tecnici', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.sostituzioneModificaDatiTecnici, true)
        })

        it('Sostituzione aggiornamento veicolo - Modifica vincolo', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.sostituzioneModificaVincolo, true)
        })
    })

    it('Regolazione Premio', function () {
        Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.regolazionePremio, true)
    })

    it('Quietanzamento online', function () {
        Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.quietanzamentoOnline, true)
    })

    it('Annullamento', function () {
        Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.annullamento, true)
    })

    it('Storno annullamento', function () {
        Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.stornoAnnullamento, true)
    })

    it('Funzioni anagrafiche : Reperibilità di contratto', function () {
        Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.reperibilitaDiContratto, true)
    })

    context('Altri casi assuntivi', function() {
        it('Cessione', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.altriCasiAssuntiviCessione, true)
        })

        it('Modifica tipologia veicolo (settore tariffario)', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.altriCasiAssuntiviModificaTipologiaVeicolo, true)
        })

        it('Allineamento proprietario contraente', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.altriCasiAssuntiviAllineamentoProprietarioContraente, true)
        })
    })

    context('Gestione', function () {
        //? I menu Tecnologica con la release 124 verranno rimossi
        it('Perizia Kasko', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.gestionePeriziaKasko, true)
        })

        it('Duplicati certificato e carta verde', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.gestioneDuplicatiCertificatoCartaVerde, true)
        })

        it('Stampa attestato di rischio', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.gestioneStampaAttestatoRischio, true)
        })

        it('Ristampa certificato in giornata', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.gestioneRistampaCertificatoGiornata, true)
        })

        it('Revoca di disdetta o recesso', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.gestioneRevocaDisdettaRecesso, true)
        })
    })

    context('Sinistri', function () {
        it('Denuncia sinistro', function () {
            Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.denunciaSinistro, true)
        })
    })

    it('Modifica fonte', function () {
        Portafoglio.menuContratto(numberPolizza, menuPolizzeAttive.modificaFonte, true)
    })
})