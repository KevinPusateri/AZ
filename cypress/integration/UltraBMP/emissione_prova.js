/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Convenzioni from "../../mw_page_objects/UltraBMP/Convenzioni"
import AreaRiservata from "../../mw_page_objects/UltraBMP/AreaRiservata"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import StartPage from "../../mw_page_objects/UltraBMP/StartPage"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"
import Portafoglio from "../../mw_page_objects/Clients/Portafoglio"
import Common from "../../mw_page_objects/common/Common"
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgermenu/BurgerMenuSales"
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'
import Annullamento from "../../mw_page_objects/polizza/Annullamento"
//import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import 'cypress-iframe';

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { modificheAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'
import { soluzione } from '../../fixtures//Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures//Ultra/BMP_Comune.json'
import { daVerificareFAMod } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareFADef } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareRC } from '../../fixtures//Ultra/BMP_Caso1.json'


//#endregion

//#region  variabili iniziali
//var cliente = ""
//var clienteUbicazione = ""
//let personaFisica = PersonaFisica.MassimoRoagna()
let personaFisica = PersonaFisica.CarloRossini()
let personaFisica2 = PersonaFisica.SimonettaRossino()

//var frazionamento = "annuale"
//var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI]
var nContratto = "755054941"
var nPreventivo = "755055507"
var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE]
//var arrPath = ['Polizze Allianz Ultra', '733117594', 'Versione 1', 'Appendici']
//var arrDoc = ['Richiesta di annullamento']
//var arrPath = ['Polizze Allianz Ultra', '733117594', 'Versione 1']
//var arrDoc = ['Polizza', 'Ricevuta avvenuto pagamento', 'Ciccio']
var defaultFQ = {
    "TipoAbitazione"    : "appartamento",
    "MqAbitazione"      : "100",
    "UsoAbitazione"     : "casa principale",
    "CapAbitazione"     : ""
}
var valoriIns = {
    "TipoAbitazione"    : "villa indipendente",
    "MqAbitazione"      : "155",
    "UsoAbitazione"     : "casa saltuaria",
    "CapAbitazione"     : ""
}

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
      .its('0.contentDocument').should('exist')
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
  }

//#endregion variabili iniziali


before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

after(function() {
    TopBar.logOutMW()
        //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion
})

describe('Prove relative ad Ultra', function() {

    it("Homepage di Matrix", () => {
        TopBar.clickMatrixHome()
        cy.wait(5000)
    })

    it("Recupero preventivi da Sales", () => {
        TopBar.clickSales()
        cy.wait(10000)
        BurgerMenuSales.clickLink('Recupero preventivi e quotazioni')
        Common.canaleFromPopup()
        cy.wait(12000);
        
    })

    it("Selezione preventivo ed avvio conversione ", () => {
        ultraIFrame().within(() => {
            cy.get('span[id="pulsante-avanzate"]').should('be.visible').click()
            cy.get('input[id="num-preventivo"]').should('be.visible')
              .type(nPreventivo).wait(2000)
              .type('{enter}')

            // Verifica presenza preventivo
            cy.get('div[id="contenitore-risultati"]').should('exist')
              .find('table > tbody > tr').should('exist')
              .find('td').should('have.length.gt', 1)
              .contains(nPreventivo).should('have.length', 1)
            cy.pause()

            cy.get('input[id="azione-converti"]').should('be.visible').click()
            cy.get('div[class="k-widget k-window"]').should('exist')
              .find('input[value*="Conferma"]').should('be.visible').click()

            Dashboard.caricamentoDashboardUltra()
            
        })
    })

    it("Pausa test", () => {
        cy.pause()
    })


})