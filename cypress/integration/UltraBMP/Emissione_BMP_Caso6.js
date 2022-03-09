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
import CondividiPreventivo from "../../mw_page_objects/UltraBMP/CondividiPreventivo"
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
//import { modificheCasa } from '../../fixtures/Ultra/BMP_Caso1.json'
import { modificheAnimale } from '../../fixtures/Ultra/BMP_Caso6.json'
import { modificheFabbricato } from '../../fixtures/Ultra/BMP_Caso6.json'
//import { daVerificareCasa } from '../../fixtures/Ultra/BMP_Caso1.json'
//import { daVerificareAnimale } from '../../fixtures/Ultra/BMP_Caso1.json'
//import { daVerificareFabbricato } from '../../fixtures/Ultra/BMP_Caso1.json'
//import { daVerificareFADef } from '../../fixtures//Ultra/BMP_Caso1.json'
//import { daVerificareRC } from '../../fixtures/Ultra/BMP_Caso1.json'
//import { daVerificareRCDef } from '../../fixtures//Ultra/BMP_Caso1.json'
//import { daModificareCasa } from '../../fixtures/Ultra/BMP_Caso1.json'
import { daModificareAnimale } from '../../fixtures/Ultra/BMP_Caso6.json'
import { daModificareFabbricato } from '../../fixtures/Ultra/BMP_Caso6.json'
//import { defaultFQ } from '../../fixtures/Ultra/BMP_Comune.json'
//import { defaultCasa } from '../../fixtures/Ultra/BMP_Comune.json'
//import { defaultAnimale } from '../../fixtures/Ultra/BMP_Comune.json'
import { soluzione } from '../../fixtures/Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures/Ultra/BMP_Comune.json'

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
let personaFisica2 = PersonaFisica.SimonettaRossino()
var nContratto = "000"
var clienteUbicazione = ""
var frazionamento = "annuale"
var arrPath = ['Polizze Allianz Ultra', nContratto, 'Versione 1', 'Appendici']
var arrDoc = ['Richiesta di annullamento']
//var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI]
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali, ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici]

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

describe('Ultra BMP : Emissione BMP Caso6', function() {

    it("Ricerca cliente", () => {
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(personaFisica.codiceFiscale).type('{enter}')
            cy.get('lib-client-item').first().click()
        }).then(($body) => {
            cy.wait(7000)
            const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            //const check = cy.get('div[class="client-null-message"]').should('be.visible')
            cy.log('permessi: ' + check)
            if (check) {
                cy.get('input[name="main-search-input"]').type(cliente).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })
        //cy.pause()
    })

    it("Seleziona ambiti da Fast Quote", () => {
        cy.log('Seleziona ambito')
        //scorre l'array degli ambiti da selezionare e clicca sulle icone
        for (var i = 0; i < ambiti.length; i++) {
            cy.log("selezione ambito " + ambiti[i])

            //seleziona ambito
            
            //cy.get('#ambitiRischio', { timeout: 5000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
            cy.get('div[class="scopes-box ng-star-inserted"]', { timeout: 30000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
                .should('be.visible').click()
            cy.log('****** AMBITO SELEZIONATO: ' + ambiti[i])
            //cy.pause()

            cy.wait(500)

            //verifica che sia selezionato
            //cy.get('#ambitiRischio').find('nx-icon[class*="' + ambiti[i] + '"]')
            cy.log('>>> verifica selezione ambito: ' + ambiti[i])
            cy.get('div[class="scopes-box ng-star-inserted"]', { timeout: 5000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
            .invoke('attr', 'class').should('contain', 'icon-selected')
        }
        //cy.pause()

        
    })

    it("Calcola in Fast Quote", () => {
        // Click 'calcola'
        cy.get('button').contains('Calcola').should('be.visible').click()
        cy.wait(2000)
        //cy.pause()
    })

    it("Configura ed accedi alla Dashboard Ultra", () => {
        // Click 'Configura'
        cy.get('button').contains('Configura', { timeout: 5000 }).should('be.visible').click()
        Dashboard.caricamentoDashboardUltra()
        //cy.pause()  
    })

    it("Verifica selezione ambiti su home Ultra Casa e Patrimonio", () => {
        Dashboard.verificaAmbiti(ambiti)
        //cy.pause()   
    })

    it("Cambia Soluzioni", () => {
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, soluzione.PREMIUM)
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali, soluzione.TOP)
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici, soluzione.PREMIUM)
        //cy.pause()
    })

    it("Configurazione Fabbricato", () => {
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[0])
        ConfigurazioneAmbito.ModificaValoriCasa(daModificareFabbricato, modificheFabbricato)
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()
        //cy.pause()    
    })

    it("Configurazione Animali Domestici", () => {
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[2])
        ConfigurazioneAmbito.ModificaValoriAnimaleDomestico(daModificareAnimale, modificheAnimale)
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()   
    })

    it("Seleziona frazionamento", ()=>{
        Dashboard.selezionaFrazionamento(frazionamento)
        //cy.pause()
    })

    it("Modifica durata fabbricato", () => {
        Dashboard.dotMenu(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, "Modifica la durata")
        Dashboard.modificaDurata(5)
        //Dashboard.dotMenu(ambitiUltra.ambitiUltraCasaPatrimonio.responsabilita_civile, "Modifica la durata")
        //Dashboard.modificaDurata(30)
        //cy.pause()
    })

    it("Procedi e Conferma", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
        //cy.pause()
    })

    it("Verifica ambiti in Riepilogo", () => {
        Riepilogo.verificaAmbito(ambitoUltra.FABBRICATO, modificheFabbricato.Nome, soluzione.PREMIUM, '5', '')
        Riepilogo.verificaAmbito(ambitoUltra.CATASTROFI_NATURALI, modificheFabbricato.Nome, soluzione.TOP, '1', '')
        Riepilogo.verificaAmbito(ambitoUltra.ANIMALI_DOMESTICI, modificheAnimale.Nome, soluzione.PREMIUM, '1', '')
        Riepilogo.verificaFrazionamento('annuale')
        Riepilogo.EmissionePreventivo()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()   
        //cy.pause()
    })

    it("Censimento anagrafico", () => {
        CensimentoAnagrafico.selezionaContraentePF(personaFisica2)
        CensimentoAnagrafico.selezionaCasa(personaFisica2, true, true)
        CensimentoAnagrafico.selezionaAnimale(modificheAnimale.Nome, personaFisica2, '380260000279818', true)
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
        cy.pause()
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.selezionaTuttiNo()
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.popupDichiarazioni()
        CondividiPreventivo.caricamentoPreventivo()
        //cy.pause()
    })

    it("Condividi Preventivo", () => {
        CondividiPreventivo.SelezionaTutti()
        CondividiPreventivo.Conferma()
        ConsensiPrivacy.caricamentoPagina()
        cy.pause()
    })

    




//////////////////////////////
/////////////////////////////
/////////////////////////////

    
    

    

    it("Dati integrativi", () => {
        DatiIntegrativi.verificaDataDecorrenza()
        DatiIntegrativi.verificaDataScadenza()
        DatiIntegrativi.verificaDatoPolizzaModificabile("Tacito rinnovo", true)
        DatiIntegrativi.verificaDatoPolizzaModificabile("Adeguamento automatico annuale", true)
        DatiIntegrativi.selezionaTuttiNo()
        //cy.pause()
        DatiIntegrativi.verificaRetrodatabilità()
        //cy.pause()
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.popupDichiarazioni()
        ConsensiPrivacy.caricamentoPagina()
        //cy.pause()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.verificaSezione('Unico - Consensi forniti')
        ConsensiPrivacy.verificaSezione('Privacy')
        ConsensiPrivacy.Avanti()
        ControlliProtocollazione.caricamentoPagina()
        //cy.pause()
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
        //cy.pause()
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
        //cy.pause()
    })

    it("Incasso - parte 1", () => {
        Incasso.ClickIncassa()
        Incasso.caricamentoModPagamento()
        //cy.pause()
    })

    it("Incasso - parte 2", () => {
        Incasso.SelezionaMetodoPagamento('Assegno')
        //Incasso.SelezionaTipoDelega('Nessuna Delega')
        Incasso.ConfermaIncasso()
        Incasso.caricamentoEsito()
        //cy.pause()
    })

    it("Esito incasso", () => {
        Incasso.EsitoIncasso()
        Incasso.Chiudi()
        UltraBMP.aspettaPopupConferma()
        //cy.pause()
    })

    it("Chiusura e apertura sezione Clients", () => {
        Ultra.chiudiFinale()
        StartPage.caricamentoPagina()
        cy.pause()
        
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
        //cy.pause()
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
        cy.pause()
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

    it("Accesso folder", () => {
        SintesiCliente.verificaInFolderDocumenti(arrPath, arrDoc)
        cy.pause()
    })
    

})