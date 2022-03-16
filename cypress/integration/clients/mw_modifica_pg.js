/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SCU from "../../mw_page_objects/clients/SCU"
import Folder from "../../mw_page_objects/common/Folder"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
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

let clientePGNewData
let currentClientPG
let unicoClienteLebel
let unicoDirezionaleLabel
let visuraCameraleLebel

//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
    cy.task('nuovoClientePersonaGiuridica').then((object) => {
        clientePGNewData = object
        clientePGNewData.tipologia = "DITTA"
        clientePGNewData.formaGiuridica = "S.R.L."
        clientePGNewData.toponimo = "PIAZZA"
        clientePGNewData.indirizzo = "GIUSEPPE GARIBALDI"
        clientePGNewData.numCivico = "1"
        clientePGNewData.cap = "36045"
        clientePGNewData.citta = "LONIGO"
        clientePGNewData.provincia = "VI"
        clientePGNewData.mail = "test_automatici@allianz.it"
        clientePGNewData.isPEC = true
        clientePGNewData.pec = "test_automatici@pec.it"
        clientePGNewData.invioPec = true
    })
    cy.generateUnicoClienteLabel().then(label => {
        unicoClienteLebel = label
    })

    cy.generateUnicoDirezioneLabel().then(label => {
        unicoDirezionaleLabel = label
    })

    cy.generateVisuraCameraleLabel().then(label => {
        visuraCameraleLebel = label
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

let urlClient
describe('Matrix Web : Modifica PG', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {

    it('Ricercare un cliente PG e verificare il caricamento corretto della scheda del cliente', () => {
        LandingRicerca.searchRandomClient(true, "PG", Cypress.env('isAviva') ? 'E' : 'P')
        LandingRicerca.clickRandomResult(Cypress.env('isAviva') ? 'E' : 'P')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            currentClientPG = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
    })

    it('Modificare alcuni dati inserendo la PEC il consenso all\'invio', () => {

        DettaglioAnagrafica.modificaCliente()
        SCU.modificaClientePGDatiAnagrafici(clientePGNewData)
        SCU.modificaClientePGModificaContatti(clientePGNewData)
        SCU.modificaClientePGConsensi(clientePGNewData)
        SCU.modificaClientePGConfermaModifiche()
    })

    it('Da Folder inserire la visura camerale e procedere', () => {
        Folder.caricaVisuraCamerale(true)
        Folder.clickTornaIndietro(true)
        SCU.generazioneStampe(true)
        SintesiCliente.clickClientsBriciolaPane()
    })

    it("Verificare che i consensi/contatti si siano aggiornati correttamente e Verificare il folder (unici + documento)", () => {
        TopBar.search(currentClientPG.name)
        LandingRicerca.clickClientePG(currentClientPG.name)
        SintesiCliente.checkAtterraggioSintesiCliente(currentClientPG.name)
        DettaglioAnagrafica.verificaDatiDettaglioAnagrafica(clientePGNewData)
        SintesiCliente.verificaInFolderDocumentiAnagrafici([unicoClienteLebel, unicoDirezionaleLabel, visuraCameraleLebel])
    })
})