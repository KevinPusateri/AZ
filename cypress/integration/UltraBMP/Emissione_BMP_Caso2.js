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
import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json'
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
import { modificheContenuto } from '../../fixtures/Ultra/BMP_Caso2.json'
import { modificheCasa } from '../../fixtures//Ultra/BMP_Caso2.json'
import { daModificareCasa } from '../../fixtures//Ultra/BMP_Caso2.json'
import { daVerificareCasa } from '../../fixtures//Ultra/BMP_Caso2.json'
import { daModificareContenuto } from '../../fixtures/Ultra/BMP_Caso2.json'
import { soluzione } from '../../fixtures/Ultra/BMP_Comune.json'
import { ambitoUltra } from '../../fixtures/Ultra/BMP_Comune.json'
import { ubicazione } from '../../fixtures//Ultra/BMP_Caso2.json'

//#endregion

//let personaFisica = PersonaFisica.MassimoRoagna()
let personaFisica = PersonaFisica.MarioRossini()
var nContratto = "000"
var nPreventivo = "000"
var frazionamento = "mensile"
var arrPath = []
var arrDoc = []
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.contenuto, ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali, ambitiUltra.ambitiUltraCasaPatrimonio.tutela_legale]

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

describe('Ultra BMP : Emissione BMP Caso2', function() {

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
    })

    it("Emissione Ultra Casa e Patrimonio", () => {
        SintesiCliente.Emissione(prodotti.RamiVari.CasaPatrimonio)
        //Ultra.selezionaPrimaAgenzia()
        Dashboard.caricamentoDashboardUltra()
      })
    
      it("Selezione ambiti in dashboard", () => {
        Dashboard.selezionaAmbiti(ambiti)
      })

      it("Accesso Configurazione ambito 'Contenuto'", ()=>{
        
        //UltraBMP.ClickMatita("Contenuto")
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[0])

        ConfigurazioneAmbito.ModificaValoriCasa(daModificareContenuto, modificheContenuto)
        ConfigurazioneAmbito.verificaSoluzioneSelezionata(soluzione.PLUS)

        ConfigurazioneAmbito.modificaSommaAssicurata('Danni al contenuto della casa', '35.000,00 €', false, true)
        ConfigurazioneAmbito.modificaSommaAssicurata('Danni accidentali a superfici in vetro degli arredi', '3.000,00 €', false)
    })

    it("Aggiungi garanzia ambito 'Contenuto'", ()=>{
        ConfigurazioneAmbito.aggiungiGaranzia('Danni da fenomeno elettrico')
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()
    })

    it("Accesso Configurazione ambito 'Catastrofi Naturali'", ()=>{
        
        //UltraBMP.ClickMatita("Catastrofi naturali")
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[1])
        ConfigurazioneAmbito.VerificaDefaultCasa(daModificareContenuto, modificheContenuto)
        ConfigurazioneAmbito.selezionaSoluzione("Essential")
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()
    })

    it("Accesso Configurazione ambito 'Tutela legale'", ()=>{
        
        //UltraBMP.ClickMatita("Tutela legale")
        ConfigurazioneAmbito.apriConfigurazioneAmbito(ambiti[2])
        ConfigurazioneAmbito.VerificaDefaultCasa(daModificareContenuto, modificheContenuto)
        ConfigurazioneAmbito.selezionaSoluzione("Top")

        ConfigurazioneAmbito.modificaSommaAssicurata('Casa', '25.000,00 €', false, false)
        ConfigurazioneAmbito.modificaSommaAssicurata('Veicoli guidati con patente', '25.000,00 €', false, false)

        //ConfigurazioneAmbito.ClickButton("CONFERMA")
        //Dashboard.caricamentoDashboardUltra()
    })

    it("Aggiungi garanzia ambito 'Tutela legale'", ()=>{
        ConfigurazioneAmbito.aggiungiGaranzia('Famiglia')
        ConfigurazioneAmbito.aggiungiEstensione('+ Controversie con il datore di lavoro')
        ConfigurazioneAmbito.ClickButton("CONFERMA")
        Dashboard.caricamentoDashboardUltra()
    })

    it("Procedi", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
    })

    it("Modifica dati quotazione e conferma", () => {
        DatiQuotazione.ModificaValoriCasa(modificheContenuto.Nome, daModificareCasa, modificheCasa)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Verifica dati quotazione", () => {
        Dashboard.selezionaVoceHeader('Dati quotazione')
        DatiQuotazione.VerificaDefaultCasa(modificheCasa.Nome, daVerificareCasa, modificheCasa)
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Verifica ambiti in Riepilogo", () => {
        Riepilogo.verificaFrazionamento(frazionamento)
        Riepilogo.EmissionePreventivo()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()   
    })

    /////>>>>> COPIARE PROVA
    it("Anagrafica", () => {
        CensimentoAnagrafico.selezionaNuovoFabbricato(ubicazione)  
        cy.pause()
    })



    



    ///////////////////
    ////////////////////
    ///////////////////

    it("Procedi e Conferma", () => {
        cy.pause()
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
        cy.pause()
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