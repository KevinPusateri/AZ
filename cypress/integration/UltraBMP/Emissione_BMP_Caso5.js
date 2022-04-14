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
import Folder from "../../mw_page_objects/common/Folder"
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
//import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { modificheAnimale } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { modificheRC } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { daVerificareAnimale } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { daVerificareFabbricato } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { daVerificareRC } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { daModificareAnimale } from '../../fixtures//Ultra/BMP_Caso5.json'
//import { daModificareRC } from '../../fixtures//Ultra/BMP_Caso5.json'
import { defaultFQ } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'
import { soluzione } from '../../fixtures//Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures//Ultra/BMP_Comune.json'
import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json'
import { ubicazione } from '../../fixtures//Ultra/BMP_Caso2.json'

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
var nContratto = "000"
var clienteUbicazione = ""
var frazionamento = "annuale"
var arrPath = []
var arrDoc = []
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, ambitiUltra.ambitiUltraCasaPatrimonio.contenuto]

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

describe('Ultra BMP : Emissione BMP Caso5', function() {

    it("Ricerca cliente", () => {
        TopBar.search(personaFisica.nomeCognome()) 
        LandingRicerca.clickClientePF(personaFisica.nomeCognome())
        SintesiCliente.checkAtterraggioSintesiCliente(personaFisica.nomeCognome())
    })

    it("Emissione Ultra Casa e Patrimonio", () => {
        SintesiCliente.Emissione(prodotti.RamiVari.CasaPatrimonio)
        //Ultra.selezionaPrimaAgenzia()
        Dashboard.caricamentoDashboardUltra()
    })
    
    it("Selezione ambiti in dashboard", () => {
        Dashboard.selezionaAmbiti(ambiti)
    })

    it("Cambia Soluzioni", () => {
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, soluzione.TOP)
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.contenuto, soluzione.TOP)
    })

    it("Procedi", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
    })

    it("Conferma dati quotazione", () => {
        //DatiQuotazione.ModificaValoriCasa(modificheContenuto.Nome, daModificareCasa, modificheCasa)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Riepilogo", () => {
        Riepilogo.EmissionePolizza()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()   
    })

    it("Anagrafica", () => {
        //CensimentoAnagrafico.selezionaNuovoFabbricato(personaFisica, ubicazione)
        //CensimentoAnagrafico.Avanti()
        //DatiIntegrativi.caricamentoPagina()

        //CensimentoAnagrafico.selezionaContraentePF(personaFisica2)
        CensimentoAnagrafico.selezionaCasa(personaFisica)
        //CensimentoAnagrafico.selezionaAnimale(modificheAnimale.Nome, personaFisica2, '380260000279818', true)
        CensimentoAnagrafico.Avanti()
        //DatiIntegrativi.caricamentoPagina()
    })

    it("Verifiche alert Anagrafica incompleta", () => {
        CensimentoAnagrafico.verificaAlertBloccoContraente()
    })

    it("Modifiche anagrafica contraente", () => {
        CensimentoAnagrafico.modificaDatiCLiente()
        CensimentoAnagrafico.selezionaCasa(personaFisica)
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
    })

    it("Fine test", () => {
        cy.pause()
    })

})