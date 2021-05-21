/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LandingClients from "../../../mw_page_objects/clients/LandingClients"
import SCU from "../../../mw_page_objects/clients/SCU"
import Folder from "../../../mw_page_objects/common/Folder"
import HomePage from "../../../mw_page_objects/common/HomePage"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let nuovoClientePF
//#endregion

//#region Before After
before(() => {
  cy.task('nuovoClientePersonaFisica').then((object) => {
    nuovoClientePF = object;
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

describe('Matrix Web : Censimento Nuovo Cliente PF', function () {

  it('Verifica apertura maschera di censimento', () => {
    LandingClients.inizializzaCensimentoClientePF()
  })

  it('Inserimento dati mancanti (no PEP)', () => {
    SCU.nuovoClientePFDatiAnagrafici(nuovoClientePF)
  })

  it('Inserimento contatti : residenza (no cellulare e mail)', () => {
    SCU.nuovoClientePFContatti()
  })

  it('Inserimento consensi (firma grafo e OTP a no)', () => {
    SCU.nuovoClientePFConsensi()
  })

  it('Inserimento documento di identita e completamento flusso', () => {
    SCU.nuovoClientePFDocumento()
    Folder.CaricaDocumentoIdentita()
    SCU.generazioneStampe()
  })

  it('Ricercare il cliente appena censito nella buca di ricerca', () => {
    HomePage.ReloadMWHomePage()
    TopBar.searchClient("PF", nuovoClientePF.nome, nuovoClientePF.cognome)
    LandingRicerca.clickFirstResult()
  })

  it('Cancellare il cliente', () => {
    SintesiCliente.cancellaCliente()
  })
})