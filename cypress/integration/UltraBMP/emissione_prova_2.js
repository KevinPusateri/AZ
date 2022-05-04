/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import StartPage from "../../mw_page_objects/UltraBMP/StartPage"
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
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import 'cypress-iframe';


//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region enum
const ultraRV = {
  CASAPATRIMONIO: "Allianz Ultra Casa e Patrimonio",
  CASAPATRIMONIO_BMP: "Allianz Ultra Casa e Patrimonio BMP",
  SALUTE: "Allianz Ultra Salute",
}

  
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { modificheAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { modificheRC } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareFabbricato } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareRC } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareAnimale } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daModificareRC } from '../../fixtures//Ultra/BMP_Caso1.json'
import { defaultFQ } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'
import { soluzione } from '../../fixtures//Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures//Ultra/BMP_Comune.json'

//#endregion

//#region  variabili iniziali
var premioTotPrima = 0
var premioTotDopo = 0
var premioFA = 0
var premioFA_FenomenoElettrico = 0
var premioRC_Prima = 0
var premioRC_Dopo = 0
var premioRC_Affittacamere = 0
var premioRC_ProprietàAnimali = 0

let personaFisica = PersonaFisica.MarcoMarco()
var nContratto = "733138893"
var clienteUbicazione = ""
var frazionamento = "annuale"
var arrPath = []
var arrDoc = []
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, ambitiUltra.ambitiUltraCasaPatrimonio.responsabilita_civile, ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici]

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

describe('Ultra BMP : Emissione BMP Caso1', function() {

    it("Apertura sezione Clients", () => {
        //Ultra.chiudiFinale()
        //StartPage.caricamentoPagina()
        //cy.pause()
        
        // Ricerca anagrafica
        /*
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(personaFisica.nomeCognome()).type('{enter}')
            cy.get('lib-client-item').first().click()
        }).then(($body) => {
            cy.wait(7000)
            const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            cy.log('permessi: ' + check)
            if (check) {
                cy.get('input[name="main-search-input"]').type(personaFisica).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })
        */
        TopBar.search(personaFisica.nomeCognome()) 
        LandingRicerca.clickClientePF(personaFisica.nomeCognome())
        //cy.pause()
        SintesiCliente.checkAtterraggioSintesiCliente(personaFisica.nomeCognome())
    })

    it("Annullamento contratto da Portafoglio", () => {
        //cy.pause()
        Portafoglio.clickTabPortafoglio()
        cy.wait(5000)
        Portafoglio.clickSubTab('Proposte')
        cy.wait(5000)
        Portafoglio.ordinaPolizze("Numero contratto")
        cy.wait(5000)
        //Portafoglio.visualizzaLista()
        //cy.wait(5000)
        cy.log(">>>>> ANNULLAMENTO CONTRATTO: " + nContratto)
        //cy.pause()
        Portafoglio.clickAnnullamento(nContratto, 'ANN.ORIGINE/MANCATO PERFEZIONAMENTO IN AGENZIA')
        //cy.pause()
        UltraBMP.annullamentoContratto('')
        cy.pause()
        ////////////////////////////////
        TopBar.search(personaFisica.nomeCognome())
        LandingRicerca.clickClientePF(personaFisica.nomeCognome())
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkPolizzaIsNotPresentOnPolizzeAttive(nContratto)

    })

    it('Verifica che sulla card di polizza ci sia l’etichetta NON IN VIGORE ' +
        'con il tooltip del motivo di annullamento: “4 Vendita/conto vendita”', function () {
            Portafoglio.clickSubTab('Non in vigore')
            Portafoglio.checkPolizzaIsPresentOnNonInVigore(nContratto, "16 - ANNULLAMENTO DALL'ORIGINE IN AGENZIA")
            cy.pause()
    })

    it("Accesso folder", () => {
        var arrPath = ['Polizze Allianz Ultra', nContratto, 'Versione 1', 'Appendici']
        var arrDoc = ['Richiesta di annullamento']
        SintesiCliente.verificaInFolderDocumenti(arrPath, arrDoc)
        //cy.pause()
    })

    it("Fine test", () => {
        cy.pause()
    })

})