/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Convenzioni from "../../mw_page_objects/UltraBMP/Convenzioni"
import AreaRiservata from "../../mw_page_objects/UltraBMP/AreaRiservata"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import ControlliProtocollazione from "../../mw_page_objects/UltraBMP/ControlliProtocollazione"
import Incasso from "../../mw_page_objects/UltraBMP/Incasso"
import Common from "../../mw_page_objects/common/Common"
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgermenu/BurgerMenuSales"
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
let personaFisica = PersonaFisica.MassimoRoagna()
//var frazionamento = "annuale"
//var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI]
var nContratto = "000"
var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE]
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

describe('Ultra BMP : Aggiunta fabbricato', function() {

    it('Seleziona Ultra BMP', () => {
        TopBar.clickSales()
        //cy.pause()
        //BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP')
        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio')
        UltraBMP.ClickButton('SCOPRI LA PROTEZIONE')
    })
     
    /*
    it("Verifica valori default FQ", () => {
        //cy.pause()
        UltraBMP.VerificaDefaultFQ(defaultFQ)
        UltraBMP.ClickButton('SCOPRI LA PROTEZIONE')
    })
    */

    /*
    it("Modifica valori FQ", () => {
        //cy.pause()
        UltraBMP.ModificaValoriFQ(valoriIns)
        UltraBMP.getButton('SCOPRI LA PROTEZIONE')
    })
    */
    
    it("Seleziona ambiti", () => {
        cy.log('Seleziona ambito')
        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.log('RICERCA AMBITO: ' + ambiti[i])
            //cy.pause()
            UltraBMP.SelezionaAmbito(ambiti[i])
        }
    })
    
    /*
    it("Aggiungi Ambito 'Fabbricato'", () => {
        cy.log("AGGIUNGI AMBITO - 'Fabbricato'")
        //cy.pause()
        UltraBMP.AggiungiAmbito('Fabbricato')
    })
    */

    /*
    it("Aggiungi Ambito 'Fabbricato'", () => { 
        cy.log("AGGIUNGI AMBITO - 'Fabbricato'")
        //cy.pause()
        UltraBMP.AggiungiAmbito('Fabbricato')
        //ConfigurazioneAmbito.
    })
    */

    it("Cambia Soluzioni", () => {
        //cy.pause()
        Ultra.modificaSoluzioneHome(ambitoUltra.FABBRICATO, soluzione.TOP)
        Ultra.modificaSoluzioneHome(ambitoUltra.RESPONSABILITA_CIVILE, soluzione.PREMIUM)
        //Ultra.modificaSoluzioneHome(ambitoUltra.ANIMALI_DOMESTICI, soluzione.ESSENTIAL)
    })

    it("Accesso Dati Quotazione da menù", ()=>{
        UltraBMP.SelezionaVoceMenuPagAmbiti('Dati quotazione')
        //DatiQuotazione.VerificaDefaultCasa('Casa 1', daVerificareCasa, defaultCasa)
        //DatiQuotazione.VerificaDefaultAnimaleDomestico('Animale domestico 1', daVerificareAnimale, defaultAnimale)
        //DatiQuotazione.ModificaValoriCasa('Casa 1', daModificareCasa, modificheCasa)
        //DatiQuotazione.ModificaValoriAnimaleDomestico('Animale domestico 1', daModificareAnimale, modificheAnimale)
        DatiQuotazione.ClickButton("CONFERMA")
        //Dashboard.caricamentoDashboardUltra()  <<< non trova 
    })

    /*
    it("Salva Quotazione e Condividi", () => {
        //cy.pause()
        Dashboard.salvaQuotazione()
        Dashboard.condividiQuotazione('Catastrofi naturali')
        //Dashboard.ClickButton('PROCEDI')
        //cy.pause()
    })
    */

    it("Procedi", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
        //Riepilogo.caricamentoRiepilogo()
        //cy.pause()
    })

    it("Verifica presenza Oggetti in Dati Quotazione", () => {
        //DatiQuotazione.verificaPresenzaOggetto(defaultCasa.Nome)
        //DatiQuotazione.verificaPresenzaOggetto(defaultAnimale.Nome)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Verifica ambiti in Riepilogo", () => {
        Riepilogo.verificaAmbito('Fabbricato', 'Casa 1', 'Top', '1', '')
        Riepilogo.EmissionePolizza()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
    })
    
    it("Censimento anagrafico", () => {
        CensimentoAnagrafico.selezionaContraentePF(personaFisica)
        CensimentoAnagrafico.selezionaCasa(personaFisica, true)
        //CensimentoAnagrafico.selezionaAnimale(modificheAnimale.Nome, personaFisica, '380260000279818', true)
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
        cy.pause()
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.verificaDataDecorrenza()
        DatiIntegrativi.verificaDataScadenza()
        DatiIntegrativi.verificaDatoPolizzaModificabile("società di brokeraggio", false)
        DatiIntegrativi.verificaDatoPolizzaModificabile("Tacito rinnovo", true)
        //DatiIntegrativi.impostaDataDecorrenza(UltraBMP.dataOggiPiuGiorni(-1))
        DatiIntegrativi.selezionaTuttiNo()
        cy.pause()
        DatiIntegrativi.verificaRetrodatabilità()
        cy.pause()
        DatiIntegrativi.ClickButtonAvanti()
        //Ultra.Avanti()
        DatiIntegrativi.popupDichiarazioni()
        ConsensiPrivacy.caricamentoPagina()
        cy.pause()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.Avanti()
        ControlliProtocollazione.caricamentoPagina()
        cy.pause()
    })

    it("salvataggio Contratto", () => {
        ControlliProtocollazione.salvataggioContratto()
        cy.pause()
    })

    it("Intermediario", () => {
        ControlliProtocollazione.inserimentoIntermediario()
        cy.pause()
    })

    it("Visualizza documenti e prosegui", () => {
        ControlliProtocollazione.riepilogoDocumenti()
        ControlliProtocollazione.Avanti()
        cy.pause()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliProtocollazione.stampaAdempimentiPrecontrattuali()
        ControlliProtocollazione.salvaNContratto()
        cy.pause()

        cy.get('@contratto').then(val => {
            nContratto = val
        })

        ControlliProtocollazione.Incassa()
        Incasso.caricamentoPagina()
        cy.pause()
    })

    it("Incasso - parte 1", () => {
        Incasso.ClickIncassa()
        Incasso.caricamentoModPagamento()
        cy.pause()
    })

    it("Incasso - parte 2", () => {
        Incasso.SelezionaMetodoPagamento('Assegno')
        Incasso.ConfermaIncasso()
        Incasso.caricamentoEsito()
        cy.pause()
    })

    it("Esito incasso", () => {
        Incasso.EsitoIncasso()
        Incasso.Chiudi()
        cy.pause()
    })
    
})