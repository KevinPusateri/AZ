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
let clientePG
//#endregion

//#region Before After
before(() => {
  cy.task('nuovoClientePersonaGiuridica').then((object) => {
    clientePG = object
    clientePG.tipologia = "DITTA"
    clientePG.formaGiuridica = "S.R.L."
    clientePG.toponimo = "PIAZZA"
    clientePG.indirizzo = "GIUSEPPE GARIBALDI"
    clientePG.numCivico = "1"
    clientePG.cap = "36045"
    clientePG.citta = "LONIGO"
    clientePG.provincia = "VI"
    clientePG.mail = "test_automatici@allianz.it"
    clientePG.isPEC = true
    clientePG.pec = "test_automatici@pec.it"
    clientePG.invioPec = true
  })
  LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
  cy.preserveCookies()
})

after(() => {
  TopBar.logOutMW()
})
//#endregion Before After

describe('Matrix Web : Modifica PG', function () {

  it('Ricercare un cliente PG e verificare il caricamento corretto della scheda del cliente', () => {
    LandingRicerca.searchRandomClient(true, "PG", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      clientePG.nominativo = currentClientName
    })
  })

  it.only('Modificare alcuni dati inserendo la PEC il consenso all\'invio', () => {
    DettaglioAnagrafica.modificaCliente()
    SCU.modificaClientePGDatiAnagrafici(clientePG)
    SCU.modificaClientePGModificaContatti(clientePG)
    SCU.modificaClientePGConsensi(clientePG)
    SCU.modificaClientePGConfermaModifiche()
  })

  it.only('Da Folder inserire la visura camerale e procedere', () => {
    Folder.caricaVisuraCamerale(true)
    Folder.clickTornaIndietro(true)
    SCU.generazioneStampe(true)
  })

  it.only("Verificare che i consensi/contatti si siano aggiornati correttamente e Verificare il folder (unici + documento)", () => {
    HomePage.reloadMWHomePage()
    TopBar.search(clientePG.nominativo)
    LandingRicerca.clickFirstResult()
    SintesiCliente.checkAtterraggioSintesiCliente(clientePG.nominativo)
    DettaglioAnagrafica.verificaDatiDettaglioAnagrafica(clientePG)
    
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