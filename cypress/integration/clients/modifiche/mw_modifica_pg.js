/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LandingClients from "../../../mw_page_objects/clients/LandingClients"
import SCU from "../../../mw_page_objects/clients/SCU"
import Folder from "../../../mw_page_objects/common/Folder"
import HomePage from "../../../mw_page_objects/common/HomePage"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../../mw_page_objects/clients/DettaglioAnagrafica"
import ArchivioCliente from "../../../mw_page_objects/clients/ArchivioCliente"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let clientePGNewData
let currentClientPG
//#endregion

//#region Before After
before(() => {
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
  LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
  cy.preserveCookies()
})

// after(() => {
//   TopBar.logOutMW()
// })
//#endregion Before After

describe('Matrix Web : Modifica PG', function () {

  it('Ricercare un cliente PG e verificare il caricamento corretto della scheda del cliente', () => {
    LandingRicerca.searchRandomClient(true, "PG", "E")
    LandingRicerca.clickRandomResult()
    SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
      currentClientPG = currentClient
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
  })

  it("Verificare che i consensi/contatti si siano aggiornati correttamente e Verificare il folder (unici + documento)", () => {
    HomePage.reloadMWHomePage()
    TopBar.search(currentClientPG.name)
    LandingRicerca.clickClientName(currentClientPG)
    SintesiCliente.checkAtterraggioSintesiCliente(currentClientPG.name)
    DettaglioAnagrafica.verificaDatiDettaglioAnagrafica(clientePGNewData)

    // let unicoClienteLebel
    // let unicoDirezionaleLabel
    // let visuraCameraleLebel
    // cy.generateUnicoClienteLabel().then(label => {
    //   unicoClienteLebel = label
    // })

    // cy.generateUnicoDirezioneLabel().then(label => {
    //   unicoDirezionaleLabel = label
    // })

    // cy.generateVisuraCameraleLabel().then(label => {
    //   visuraCameraleLebel = label
    // })

    // SintesiCliente.verificaInFolder([unicoClienteLebel,unicoDirezionaleLabel,visuraCameraleLebel])
  })
})