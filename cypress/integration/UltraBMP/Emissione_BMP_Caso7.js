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
import ControlliSalvataggio from "../../mw_page_objects/UltraBMP/ControlliSalvataggio"
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
import { modificheAnimale } from '../../fixtures/Ultra/BMP_Caso6.json'
import { modificheFabbricato } from '../../fixtures/Ultra/BMP_Caso6.json'
import { daModificareAnimale } from '../../fixtures/Ultra/BMP_Caso6.json'
import { daModificareFabbricato } from '../../fixtures/Ultra/BMP_Caso6.json'
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
var nPreventivo = "000"
var clienteUbicazione = ""
var frazionamento = "annuale"
var arrPath = []
var arrDoc = []
//var ambiti = [ambitoUltra.FABBRICATO, ambitoUltra.RESPONSABILITA_CIVILE, ambitoUltra.ANIMALI_DOMESTICI]
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali, ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici]

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

    it("Emissione preventivo Casa e Patrimonio", () => {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraCasaPatrimonio()
        cy.pause()
    })
    




    /////////////////////////
    ////////////////////////
    ///////////////////////

    it("Seleziona ambiti da Fast Quote", () => {
        cy.pause()
        cy.log('Seleziona ambito')
        //scorre l'array degli ambiti da selezionare e clicca sulle icone
        for (var i = 0; i < ambiti.length; i++) {
            cy.log("selezione ambito " + ambiti[i])

            //seleziona ambito
            
            //cy.get('#ambitiRischio', { timeout: 5000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
            cy.get('div[class="scopes-box ng-star-inserted"]', { timeout: 30000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
                .should('be.visible').click()
            cy.log('****** AMBITO SELEZIONATO: ' + ambiti[i])

            cy.wait(500)

            //verifica che sia selezionato
            cy.log('>>> verifica selezione ambito: ' + ambiti[i])
            cy.get('div[class="scopes-box ng-star-inserted"]', { timeout: 5000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
            .invoke('attr', 'class').should('contain', 'icon-selected')
        }
    })

    it("Calcola in Fast Quote", () => {
        // Click 'calcola'
        cy.get('button').contains('Calcola').should('be.visible').click()
        cy.wait(2000)
    })

    it("Configura ed accedi alla Dashboard Ultra", () => {
        // Click 'Configura'
        cy.get('button').contains('Configura', { timeout: 5000 }).should('be.visible').click()
        Dashboard.caricamentoDashboardUltra() 
    })

    it("Verifica selezione ambiti su home Ultra Casa e Patrimonio", () => {
        Dashboard.verificaAmbiti(ambiti)   
    })

    it("Cambia Soluzioni", () => {
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, soluzione.PREMIUM)
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali, soluzione.TOP)
        Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici, soluzione.PREMIUM)
    })

    it("Configurazione Fabbricato", () => {
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[0])
        ConfigurazioneAmbito.ModificaValoriCasa(daModificareFabbricato, modificheFabbricato)
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()    
    })

    it("Configurazione Animali Domestici", () => {
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[2])
        ConfigurazioneAmbito.ModificaValoriAnimaleDomestico(daModificareAnimale, modificheAnimale)
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()   
    })

    it("Seleziona frazionamento", ()=>{
        Dashboard.selezionaFrazionamento(frazionamento)
    })

    it("Modifica durata fabbricato", () => {
        Dashboard.dotMenu(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, "Modifica la durata")
        Dashboard.modificaDurata(5)
    })

    it("Procedi e Conferma", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Verifica ambiti in Riepilogo", () => {
        Riepilogo.verificaAmbito(ambitoUltra.FABBRICATO, modificheFabbricato.Nome, soluzione.PREMIUM, '5', '')
        Riepilogo.verificaAmbito(ambitoUltra.CATASTROFI_NATURALI, modificheFabbricato.Nome, soluzione.TOP, '1', '')
        Riepilogo.verificaAmbito(ambitoUltra.ANIMALI_DOMESTICI, modificheAnimale.Nome, soluzione.PREMIUM, '1', '')
        Riepilogo.verificaFrazionamento('annuale')
        Riepilogo.EmissionePreventivo()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()   
    })

    it("Censimento anagrafico", () => {
        CensimentoAnagrafico.selezionaContraentePF(personaFisica2)
        CensimentoAnagrafico.selezionaCasa(personaFisica2, true, true)
        CensimentoAnagrafico.selezionaAnimale(modificheAnimale.Nome, personaFisica2, '380260000279818', true)
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.selezionaTuttiNo()
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.popupDichiarazioni()
        CondividiPreventivo.caricamentoPreventivo()
    })

    it("Condividi Preventivo", () => {
        CondividiPreventivo.SelezionaTutti()
        CondividiPreventivo.Conferma()
        ConsensiPrivacy.caricamentoPagina()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.visualizzaDocumento('Regolamento Allianz Ultra e Set informativo')
        ConsensiPrivacy.visualizzaDocumento('Preventivo Allianz Ultra')
        ConsensiPrivacy.Avanti()
        ControlliSalvataggio.caricamentoPagina()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliSalvataggio.verificaPresenzaDocumento("Regolamento Allianz Ultra e Set informativo")
        ControlliSalvataggio.verificaPresenzaDocumento("Preventivo Allianz Ultra")
        ControlliSalvataggio.stampaDocumentazione()
        ControlliSalvataggio.salvaNPreventivo()

        cy.get('@preventivo').then(val => {
            nPreventivo = val
        })
        ControlliSalvataggio.clickPulsante('Torna alla home page')
        ControlliSalvataggio.clickConferma()
    })

    it("Ritorno alla Homepage di Matrix", () => {
        TopBar.clickMatrixHome()
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

            cy.get('input[id="azione-converti"]').should('be.visible').click()
            cy.get('div[class="k-widget k-window"]').should('exist')
              .find('input[value*="Conferma"]').should('be.visible').click()

            Dashboard.caricamentoDashboardUltra()
            
        })
    })

    it("Procedi emissione polizza", () => {
        Dashboard.procediHome()
        Riepilogo.caricamentoRiepilogo()
        Riepilogo.EmissionePolizza()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
    })

    it("Censimento anagrafico", () => {
        CensimentoAnagrafico.Avanti()
        DatiIntegrativi.caricamentoPagina()
    })

    it("Dati integrativi", () => {
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.popupDichiarazioni()
        ConsensiPrivacy.caricamentoPagina()
    })

    it("Consensi e privacy", () => {
        ConsensiPrivacy.Avanti()
        ControlliProtocollazione.caricamentoPagina()
    })

    it("salvataggio Contratto", () => {
        ControlliProtocollazione.salvataggioContratto()
        ControlliProtocollazione.verificaPresenzaDocumento("Regolamento Allianz Ultra e Set informativo")
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 3 - Informativa sul distributore")
        ControlliProtocollazione.verificaPresenzaDocumento("Allegato 4 - Informazioni sulla distribuzione del prodotto assicurativo non-IBIP")
        ControlliProtocollazione.verificaPresenzaDocumento("Riepilogo delle richieste ed esigenze assicurative del cliente")
        ControlliProtocollazione.Avanti()    // Non prosegue prima della visualizzazione dei documenti
    })

    it("Visualizza documenti e prosegui", () => {
        ControlliProtocollazione.riepilogoDocumenti()
        ControlliProtocollazione.Avanti()
        ControlliProtocollazione.aspettaCaricamentoAdempimenti()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        ControlliProtocollazione.verificaPresenzaDocumento("Informativa precontrattuale: Allegati 3 e 4")
        ControlliProtocollazione.verificaPresenzaDocumento("Regolamento Allianz Ultra e Set informativo")
        ControlliProtocollazione.stampaAdempimentiPrecontrattuali(false)
        ControlliProtocollazione.salvaNContratto()

        cy.get('@contratto').then(val => {
            nContratto = val
        })

        ControlliProtocollazione.Home()
        StartPage.caricamentoPagina()
    })

    it("Apertura sezione Clients", () => {
        // Ricerca anagrafica
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(personaFisica2.nomeCognome()).type('{enter}')
            cy.get('lib-client-item').first().click()
        }).then(($body) => {
            cy.wait(7000)
            const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            cy.log('permessi: ' + check)
            if (check) {
                cy.get('input[name="main-search-input"]').type(personaFisica2).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })
    })

    it("Accesso portafoglio Proposte ed avvio incasso", () => {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Proposte')
        Portafoglio.ordinaPolizze("Numero contratto")
        cy.log(">>>>> INCASSO PROPOSTA DA PORTAFOGLIO : " + nContratto)
        Portafoglio.clickIncassaProposta(nContratto)
        Portafoglio.caricamentoPaginaIncassa()
        Portafoglio.clickIncassa()
        Incasso.caricamentoModPagamento()
    })

    it("Incasso - parte 2", () => {
        Incasso.SelezionaMetodoPagamento('Contanti', false)
        //Incasso.SelezionaTipoDelega('Nessuna Delega')
        Incasso.ConfermaIncasso(false)
        Incasso.caricamentoEsito()
    })

    it("Esito incasso", () => {
        Incasso.EsitoIncasso(false)
        Incasso.Chiudi(false)
        cy.pause()
    })



    it("Apertura sezione Clients", () => {
        // Ricerca anagrafica
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(personaFisica2.nomeCognome()).type('{enter}')
            cy.get('lib-client-item').first().click()
        }).then(($body) => {
            cy.wait(7000)
            const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            cy.log('permessi: ' + check)
            if (check) {
                cy.get('input[name="main-search-input"]').type(personaFisica2).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })
        //cy.pause()
    })

    it("Accesso folder", () => {
        arrPath = ['Polizze Allianz Ultra', nContratto, 'Versione 1']
        arrDoc = ['Ricevuta avvenuto pagamento']
        SintesiCliente.verificaInFolderDocumenti(arrPath, arrDoc)
        cy.pause()
    })
    

})