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


        //***** 
        //nContratto = '733117285'
        //cy.log('CognomeNome: ' + personaFisica.cognomeNome())
        //cy.log('nContratto: ' + nContratto)
        //cy.pause()

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

        cy.pause()

        Portafoglio.clickTabPortafoglio()
        Portafoglio.ordinaPolizze("Numero contratto")
        //Portafoglio.menuContratto(nContratto, menuPolizzeAttive.annullamento)
        //Portafoglio.menuContestualeAmbiti("tutela legale", "Appendici")
        //Ultra.selezionaPrimaAgenzia()
        Portafoglio.clickAnnullamento(nContratto, 'ANN.ORIGINE/MANCATO PERFEZIONAMENTO IN AGENZIA')
        //Annullamento.annullaContratto()
        UltraBMP.annullamentoContratto()
        TopBar.search(personaFisica.cognomeNome())
        LandingRicerca.clickClientePF(personaFisica.cognomeNome())
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkPolizzaIsNotPresentOnPolizzeAttive(nContratto)

        cy.pause()

        it('Verifica che sulla card di polizza ci sia l’etichetta NON IN VIGORE ' +
        'con il tooltip del motivo di annullamento: “4 Vendita/conto vendita”', function () {
            Portafoglio.clickSubTab('Non in vigore')
            Portafoglio.checkPolizzaIsPresentOnNonInVigore(numberPolizza)
        })
        */

        //****
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
        Dashboard.caricamentoDashboardUltra()
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
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.verificaDataDecorrenza()
        DatiIntegrativi.verificaDataScadenza()
        DatiIntegrativi.verificaDatoPolizzaModificabile("società di brokeraggio", false)
        DatiIntegrativi.verificaDatoPolizzaModificabile("Tacito rinnovo", true)
        //DatiIntegrativi.impostaDataDecorrenza(UltraBMP.dataOggiPiuGiorni(-1))
        DatiIntegrativi.selezionaTuttiNo()
        DatiIntegrativi.verificaRetrodatabilità()
        DatiIntegrativi.ClickButtonAvanti()
        //Ultra.Avanti()
        DatiIntegrativi.popupDichiarazioni()
        ConsensiPrivacy.caricamentoPagina()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.verificaSezione('Unico - Consensi forniti')
        ConsensiPrivacy.verificaSezione('Privacy')
        ConsensiPrivacy.Avanti()
        ControlliProtocollazione.caricamentoPagina()
    })

    it("salvataggio Contratto", () => {
        ControlliProtocollazione.salvataggioContratto()
        //ControlliProtocollazione.verificaOpzione('Tipo firma', 'MANUALE')
        ControlliProtocollazione.impostaOpzione("All'esterno dell'agenzia / a distanza", 'SI')
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 4-ter - Elenco delle regole di comportamento del distributore")
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 3 - Informativa sul distributore")
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 4 - Informazioni sulla distribuzione del prodotto assicurativo non-IBIP")
        ControlliProtocollazione.Avanti()    // Non prosegue prima della visualizzazione dei documenti
        //cy.pause()
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
        ControlliProtocollazione.aspettaCaricamentoAdempimenti()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliProtocollazione.verificaPresenzaDocumento("Informativa precontrattuale: Allegati 3, 4 e 4TER")
        ControlliProtocollazione.verificaPresenzaDocumento("Regolamento Allianz Ultra e Set informativo")
        ControlliProtocollazione.stampaAdempimentiPrecontrattuali(false)
        //cy.pause()
        ControlliProtocollazione.salvaNContratto()
        //cy.pause()

        cy.get('@contratto').then(val => {
            nContratto = val
        })

        ControlliProtocollazione.Incassa()
        Incasso.caricamentoPagina()
    })

    it("Incasso - parte 1", () => {
        Incasso.ClickIncassa()
        Incasso.caricamentoModPagamento()
    })

    it("Incasso - parte 2", () => {
        Incasso.SelezionaMetodoPagamento('Assegno')
        Incasso.SelezionaTipoDelega('Nessuna Delega')
        Incasso.ConfermaIncasso()
        Incasso.caricamentoEsito()
        //cy.pause()
    })

    it("Esito incasso", () => {
        Incasso.EsitoIncasso()
        Incasso.Chiudi()
        UltraBMP.aspettaPopupConferma()
    })

    it("Chiusura e apertura sezione Clients", () => {
        Ultra.chiudiFinale()
        StartPage.caricamentoPagina()
        //cy.pause()
        
        // Ricerca anagrafica
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

    it("Annullamento contratto da Portafoglio", () => {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.ordinaPolizze("Numero contratto")
        //Portafoglio.menuContratto(nContratto, menuPolizzeAttive.annullamento)
        //Portafoglio.menuContestualeAmbiti("tutela legale", "Appendici")
        //Ultra.selezionaPrimaAgenzia()
        cy.log(">>>>> ANNULLAMENTO CONTRATTO: " + nContratto)
        //cy.pause()
        Portafoglio.clickAnnullamento(nContratto, 'ANN.ORIGINE/MANCATO PERFEZIONAMENTO IN AGENZIA')
        //cy.pause()
        //Annullamento.annullaContratto()
        UltraBMP.annullamentoContratto()
        //cy.pause()
        TopBar.search(personaFisica.nomeCognome())
        //cy.pause()
        LandingRicerca.clickClientePF(personaFisica.nomeCognome())
        //cy.pause()
        Portafoglio.clickTabPortafoglio()
        //cy.pause()
        Portafoglio.checkPolizzaIsNotPresentOnPolizzeAttive(nContratto)

        //cy.pause()

        /*
        Portafoglio.clickTabPortafoglio()
        Portafoglio.ordinaPolizze("Numero contratto")
        //Portafoglio.menuContratto(nContratto, menuPolizzeAttive.annullamento)
        //Portafoglio.menuContestualeAmbiti("tutela legale", "Appendici")
        //Ultra.selezionaPrimaAgenzia()
        Portafoglio.clickAnnullamento(nContratto, 'ANN.ORIGINE/MANCATO PERFEZIONAMENTO IN AGENZIA')
        Annullamento.annullaContratto()
        TopBar.search(personaFisica)
        LandingRicerca.clickClientePF(personaFisica.cognomeNome())
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkPolizzaIsNotPresentOnPolizzeAttive(nContratto)
        */

        //cy.pause()
    })

    it('Verifica che sulla card di polizza ci sia l’etichetta NON IN VIGORE ' +
        'con il tooltip del motivo di annullamento: “4 Vendita/conto vendita”', function () {
            Portafoglio.clickSubTab('Non in vigore')
            Portafoglio.checkPolizzaIsPresentOnNonInVigore(nContratto, "16 - ANNULLAMENTO DALL'ORIGINE IN AGENZIA")
            cy.pause()
        })
    
})