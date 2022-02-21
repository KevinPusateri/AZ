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
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'
import Annullamento from "../../mw_page_objects/polizza/Annullamento"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import ambitiUltra from '../../fixtures/Ultra/ambitiUltra.json'
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
//import { daVerificareFADef } from '../../fixtures//Ultra/BMP_Caso1.json'
import { daVerificareRC } from '../../fixtures//Ultra/BMP_Caso1.json'
//import { daVerificareRCDef } from '../../fixtures//Ultra/BMP_Caso1.json'
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

//let personaFisica = PersonaFisica.MassimoRoagna()
let personaFisica = PersonaFisica.CarloRossini()
var clienteUbicazione = ""
var frazionamento = "annuale"
//var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI]
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

    it('Seleziona Ultra BMP', () => {
        TopBar.clickSales()
        //BurgerMenuSales.clickLink(ultraRV.CASAPATRIMONIO_BMP)
        BurgerMenuSales.clickLink(ultraRV.CASAPATRIMONIO)
    })
     
    it("Verifica valori default FQ e accesso alla dashboard", () => {
        StartPage.VerificaDefaultFQ(defaultFQ)
        StartPage.startScopriProtezione()
        //Dashboard.caricamentoDashboardUltra()    
    })
    
    it("Seleziona ambiti", () => {
        cy.log('Seleziona ambito')
        
        /*
        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.log('RICERCA AMBITO: ' + ambiti[i])
            UltraBMP.SelezionaAmbito(ambiti[i])
            
            cy.pause()
        }
        */
        
        Dashboard.selezionaAmbiti(ambiti)
    })
    
    
    it("Cambia Soluzioni", () => {
        /*
    Ultra.modificaSoluzioneHome(ambitoUltra.FABBRICATO, soluzione.TOP)
    Ultra.modificaSoluzioneHome(ambitoUltra.RESPONSABILITA_CIVILE, soluzione.PREMIUM)
    Ultra.modificaSoluzioneHome(ambitoUltra.ANIMALI_DOMESTICI, soluzione.ESSENTIAL)
    */
    Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, soluzione.TOP)
    Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.responsabilita_civile, soluzione.PREMIUM)
    Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici, soluzione.ESSENTIAL)
    
    })
    
    it("Accesso Dati Quotazione da menù", ()=>{
        //UltraBMP.SelezionaVoceMenuPagAmbiti('Dati quotazione')
        Dashboard.selezionaVoceHeader('Dati quotazione')    //<<<<===== DA FARE AL POSTO DI QUELLO SOPRA 
        cy.pause()
        DatiQuotazione.VerificaDefaultCasa('Casa 1', daVerificareCasa, defaultCasa)
        DatiQuotazione.VerificaDefaultAnimaleDomestico('Animale domestico 1', daVerificareAnimale, defaultAnimale)
        DatiQuotazione.ModificaValoriCasa('Casa 1', daModificareCasa, modificheCasa)
        DatiQuotazione.ModificaValoriAnimaleDomestico('Animale domestico 1', daModificareAnimale, modificheAnimale)
        DatiQuotazione.ClickButton("CONFERMA")
        //Dashboard.caricamentoDashboardUltra()  <<< non trova 
    })

    it("Accesso Configurazione ambito 'Fabbricato'", ()=>{
        
        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotPrima = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale prima di aggiungere la garanzia: ' + premioTotPrima)
        })

        UltraBMP.ClickMatita("Fabbricato", "Casa 1")

        ConfigurazioneAmbito.VerificaDefaultCasa(daVerificareFabbricato, modificheCasa)
        ConfigurazioneAmbito.verificaSoluzioneSelezionata(soluzione.TOP)
        
        ConfigurazioneAmbito.leggiPremio('Ambito')   //>> premioAmbito
        cy.get('@premioAmbito').then(premioAmbito => {
            premioFA = parseFloat(premioAmbito.replace(/,/,"."))
            cy.log('Premio Ambito Fabbricato: ' + premioFA)
        })

        ConfigurazioneAmbito.leggiPremioGaranziaAggiuntiva('Danni da fenomeno elettrico')    //>> premioGarAgg
        cy.get('@premioGarAgg').then(premioGaranziaAggiuntiva => {
            premioFA_FenomenoElettrico = parseFloat(premioGaranziaAggiuntiva.replace(/,/,"."))
            cy.log('Premio Garanzia Aggiuntiva: ' + premioFA_FenomenoElettrico)
        })

        ConfigurazioneAmbito.aggiungiGaranzia('Danni da fenomeno elettrico')
        ConfigurazioneAmbito.ClickButton("CONFERMA")

        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotDopo = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale dopo aver aggiunto la garanzia: ' + premioTotDopo)
        })

    })

    it("Verifica premio totale in Dashboard dopo variazioni ambito 'Fabbricato'", ()=>{
        cy.log('********* VERIFICA PREMIO **************')
        cy.log('premioTotPrima: ' + premioTotPrima)
        cy.log('premioTotDopo: ' + premioTotDopo)
        cy.log('premioFA_FenomenoElettrico: ' + premioFA_FenomenoElettrico)
        Dashboard.verificaPremio(premioTotPrima, premioTotDopo, premioFA_FenomenoElettrico)
    })

    it("Accesso Configurazione ambito 'Responsabilità civile'", ()=>{

        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotPrima = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale prima di aggiungere la garanzia: ' + premioTotPrima)
        })

        UltraBMP.ClickMatita("Responsabilit", "Casa 1")

        ConfigurazioneAmbito.VerificaDefaultCasa(daVerificareRC, modificheCasa)
        ConfigurazioneAmbito.verificaSoluzioneSelezionata(soluzione.PREMIUM)

        ConfigurazioneAmbito.leggiPremio('Ambito')   //>> premioAmbito
        cy.get('@premioAmbito').then(premioAmbito => {
            premioRC_Prima = parseFloat(premioAmbito.replace(/,/,"."))
            cy.log('Premio Ambito Responsabilità Civile - Prima delle modifiche: ' + premioRC_Prima)
        })

        ConfigurazioneAmbito.ModificaConfigurazioneAmbito(daModificareRC, modificheRC)
        
        ConfigurazioneAmbito.leggiPremio('Ambito')   //>> premioAmbito
        cy.get('@premioAmbito').then(premioAmbito => {
            premioRC_Dopo = parseFloat(premioAmbito.replace(/,/,"."))
            cy.log('Premio Ambito Responsabilità Civile - Dopo le modifiche: ' + premioRC_Dopo)
        })

        ConfigurazioneAmbito.leggiPremioGaranziaAggiuntiva('attività di affittacamere e Bed & Breakfast')    //>> premioGarAgg
        cy.get('@premioGarAgg').then(premioGaranziaAggiuntiva => {
            premioRC_Affittacamere = parseFloat(premioGaranziaAggiuntiva.replace(/,/,"."))
            cy.log('Premio Garanzia Aggiuntiva Affittacamere: ' + premioRC_Affittacamere)
        })

        ConfigurazioneAmbito.leggiPremioGaranziaAggiuntiva('proprietà di cavalli ed altri animali da sella')    //>> premioGarAgg
        cy.get('@premioGarAgg').then(premioGaranziaAggiuntiva => {
            premioRC_ProprietàAnimali = parseFloat(premioGaranziaAggiuntiva.replace(/,/,"."))
            cy.log('Premio Garanzia Aggiuntiva Cavalli: ' + premioRC_ProprietàAnimali)
        })

        ConfigurazioneAmbito.aggiungiGaranzia('attività di affittacamere e Bed & Breakfast')
        ConfigurazioneAmbito.aggiungiGaranzia('proprietà di cavalli ed altri animali da sella')
        ConfigurazioneAmbito.ClickButton("CONFERMA")

        Dashboard.leggiPremioTot()     //>> premioTotDashboard    
        cy.get('@premioTotDashboard').then(premioTot => {
            premioTotDopo = parseFloat(premioTot.replace(/,/,"."))
            cy.log('Premio totale dopo aver aggiunto le garanzie: ' + premioTotDopo)
        })
        
    })

    it("Verifica premio totale in Dashboard dopo variazioni ambito 'Responsabilità Civile'", ()=>{
        var deltaPremio = (premioRC_Dopo - premioRC_Prima) + premioRC_Affittacamere + premioRC_ProprietàAnimali
        Dashboard.verificaPremio(premioTotPrima, premioTotDopo, deltaPremio)
    })

    it("Seleziona frazionamento", ()=>{
        Ultra.selezionaFrazionamento(frazionamento)
    })

    // Al momento bypasso perchè non compare il messaggio di salvataggio e non va la condivisione
    
    it("Salva Quotazione e Condividi", () => {
        Dashboard.salvaQuotazione()
        Dashboard.condividiQuotazione('Catastrofi naturali')
    })
    

    it("Procedi", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
    })

    it("Verifica presenza Oggetti in Dati Quotazione", () => {
        DatiQuotazione.verificaPresenzaOggetto(defaultCasa.Nome)
        DatiQuotazione.verificaPresenzaOggetto(modificheAnimale.Nome)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Verifica ambiti in Riepilogo", () => {
        ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI
        Riepilogo.verificaAmbito(ambitoUltra.FABBRICATO, defaultCasa.Nome, soluzione.TOP, '1', '')
        Riepilogo.verificaAmbito(ambitoUltra.RESPONSABILITA_CIVILE, defaultCasa.Nome, soluzione.PREMIUM, '1', '')
        Riepilogo.verificaAmbito(ambitoUltra.ANIMALI_DOMESTICI, modificheAnimale.Nome, soluzione.ESSENTIAL, '1', '')
        Riepilogo.verificaFrazionamento('annuale')
        Riepilogo.EmissionePolizza()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()   
    })

    it("Censimento anagrafico", () => {
        CensimentoAnagrafico.selezionaContraentePF(personaFisica)
        CensimentoAnagrafico.selezionaCasa(personaFisica, true)
        CensimentoAnagrafico.selezionaAnimale(modificheAnimale.Nome, personaFisica, '380260000279818', true)
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.verificaDataDecorrenza()
        DatiIntegrativi.verificaDataScadenza()
        DatiIntegrativi.verificaDatoPolizzaModificabile("Tacito rinnovo", true)
        DatiIntegrativi.verificaDatoPolizzaModificabile("Adeguamento automatico annuale", true)
        DatiIntegrativi.selezionaTuttiNo()
        cy.pause()
        DatiIntegrativi.verificaRetrodatabilità()
        cy.pause()
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.popupDichiarazioni()
        ConsensiPrivacy.caricamentoPagina()
        cy.pause()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.verificaSezione('Unico - Consensi forniti')
        ConsensiPrivacy.verificaSezione('Privacy')
        ConsensiPrivacy.Avanti()
        ControlliProtocollazione.caricamentoPagina()
        cy.pause()
    })

    it("salvataggio Contratto", () => {
        ControlliProtocollazione.salvataggioContratto()
        //ControlliProtocollazione.verificaOpzione('Tipo firma', 'MANUALE')
        ControlliProtocollazione.impostaOpzione("All'esterno dell'agenzia / a distanza", 'SI')
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 4-ter - Elenco delle regole di comportamento del distributore")
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 3 - Informativa sul distributore")
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 4 - Informazioni sulla distribuzione del prodotto assicurativo non-IBIP")
        ControlliProtocollazione.Avanti()    // Non prosegue prima della visualizzazione dei documenti
        cy.pause()
    })

    /*
    it("Intermediario", () => {
        ControlliProtocollazione.inserimentoIntermediario()
        cy.pause()
    })
    */

    it("Visualizza documenti e prosegui", () => {
        ControlliProtocollazione.riepilogoDocumenti()
        ControlliProtocollazione.Avanti()
        cy.pause()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliProtocollazione.verificaPresenzaDocumento("Informativa precontrattuale: Allegati 3, 4 e 4TER")
        ControlliProtocollazione.verificaPresenzaDocumento("Regolamento Allianz Ultra e Set informativo")
        ControlliProtocollazione.stampaAdempimentiPrecontrattuali(false)
        cy.pause()
        ControlliProtocollazione.salvaNContratto()
        cy.pause()

        cy.get('@contratto').then(val => {
            nContratto = val
        })

        ControlliProtocollazione.Incassa()
        //Incasso.caricamentoPagina()
        cy.pause()
    })

    it("Incasso - parte 1", () => {
        Incasso.ClickIncassa()
        //Incasso.caricamentoModPagamento()
        cy.pause()
    })

    it("Incasso - parte 2", () => {
        Incasso.SelezionaMetodoPagamento('Assegno')
        Incasso.SelezionaTipoDelega('Nessuna Delega')
        Incasso.ConfermaIncasso()
        //ncasso.caricamentoEsito()
        cy.pause()
    })

    it("Esito incasso", () => {
        Incasso.EsitoIncasso()
        Incasso.Chiudi()
        cy.pause()
    })

    it("Chiusura e apertura sezione Clients", () => {
        Ultra.chiudiFinale()
        
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
        cy.pause()
    })

    it("Portafoglio", () => {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.ordinaPolizze("Numero contratto")
        Portafoglio.menuContratto(nContratto, menuPolizzeAttive.annullamento)
        //Portafoglio.menuContestualeAmbiti("tutela legale", "Appendici")
        //Ultra.selezionaPrimaAgenzia()
        cy.pause()
    })
    

})