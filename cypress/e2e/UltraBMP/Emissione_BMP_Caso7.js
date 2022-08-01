/**
 * @author Pietro Scocchi <pietro.scocchi@allianz.it>
 */

/// <reference types="Cypress" />
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import prodotti from '../../fixtures/SchedaCliente/menuEmissione.json'
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import StartPage from "../../mw_page_objects/UltraBMP/StartPage"
import ConfigurazioneAmbito from "../../mw_page_objects/UltraBMP/ConfigurazioneAmbito"
import Dashboard from "../../mw_page_objects/UltraBMP/Dashboard"
import Riepilogo from "../../mw_page_objects/UltraBMP/Riepilogo"
import CensimentoAnagrafico from "../../mw_page_objects/UltraBMP/CensimentoAnagrafico"
import CondividiPreventivo from "../../mw_page_objects/UltraBMP/CondividiPreventivo"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import ConsensiPrivacy from "../../mw_page_objects/UltraBMP/ConsensiPrivacy"
import AreaRiservata from "../../mw_page_objects/UltraBMP/AreaRiservata"
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
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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
import { modificheAnimale } from '../../fixtures/Ultra/BMP_Caso7.json'
import { daModificareAnimale } from '../../fixtures/Ultra/BMP_Caso7.json'
import { soluzione } from '../../fixtures/Ultra/BMP_Comune.json'


//#endregion

//#region  variabili iniziali
var premioMinimo = 0
var premioMassimo = 0
var premioIniziale = 0
var premioBarrato = 0
var premioScontato = 0
var premioBarratoRiepilogo = 0
var premioScontatoRiepilogo = 0
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
var ambiti = [ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, 
              ambitiUltra.ambitiUltraCasaPatrimonio.contenuto,
              ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali,
              ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici]

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

after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
})

describe('Ultra BMP : Emissione BMP Caso7', function () {

    it("Ricerca cliente", () => {
        /*
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
        */
        TopBar.search(personaFisica.nomeCognome()) 
        LandingRicerca.clickClientePF(personaFisica.nomeCognome())
        SintesiCliente.checkAtterraggioSintesiCliente(personaFisica.nomeCognome())
        //cy.pause()
    })

    it("Emissione preventivo Casa e Patrimonio", () => {
        SintesiCliente.Emissione(prodotti.RamiVari.CasaPatrimonio)
        Common.canaleFromPopup()
        Dashboard.caricamentoDashboardUltra()
    })

    it("Seleziona ambiti", () => {
        cy.log('Seleziona ambito')
        Dashboard.selezionaAmbiti(ambiti)
    })
    
    it("Cambia Soluzioni", () => {
    Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.fabbricato, soluzione.TOP)
    Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.contenuto, soluzione.TOP)
    Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.catastrofi_naturali, soluzione.TOP)
    Dashboard.modificaSoluzione(ambitiUltra.ambitiUltraCasaPatrimonio.animali_domestici, soluzione.TOP)
    })
    
    it("Seleziona frazionamento", () => {
        Dashboard.selezionaFrazionamento(frazionamento)
    })

    it("Lettura premio totale prima dello sconto", () => {
        Dashboard.leggiPremioTot()    //>> premioTotDashboard 
        cy.get('@premioTotDashboard').then(premioTot => {
            premioIniziale = premioTot
            cy.log('Premio iniziale prima dello sconto: ' + premioIniziale)
        })
    })

    it("Accesso Area Riservata", () => {
        Dashboard.selezionaVoceHeader('Area riservata')
        //AreaRiservata.caricamentoPagina()
    })

    it("Lettura premi Area Riservata", () => {
        AreaRiservata.leggiPremio('MIN')
        cy.get('@premioMin').then(premioMin => {
            premioMinimo = parseFloat(premioMin.replace(/,/,"."))
            cy.log('Premio Minimo: ' + premioMinimo)
        })
        AreaRiservata.leggiPremio('MAX')
        cy.get('@premioMax').then(premioMax => {
            premioMassimo = parseFloat(premioMax.replace(/,/,"."))
            cy.log('Premio Massimo: ' + premioMassimo)
        })
    })

    it("Impostazione sconto in Area Riservata", () => {
        AreaRiservata.impostaSconto(premioMinimo, premioMassimo, 65)
        AreaRiservata.clickConferma()
        Dashboard.caricamentoDashboardUltra()
    })

    it("Lettura premi dopo applicazione sconto", () => {
        // Premio scontato
        
        Dashboard.leggiPremioTot('SCONTATO')    //>> premioTotDashboardScontato
        cy.get('@premioTotDashboardScontato').then(premioTotScontato => {
            premioScontato = premioTotScontato
            cy.log('Premio scontato: ' + premioScontato)
        })
        

        // Premio iniziale barrato
        Dashboard.leggiPremioTot('BARRATO')    //>> premioTotDashboardBarrato 
        cy.get('@premioTotDashboardBarrato').then(premioTotBarrato => {
            premioBarrato = premioTotBarrato
            cy.log('Premio barrato dopo sconto: ' + premioBarrato)
        })
    })

    it("Verifica premio barrato", () => {
        expect(premioBarrato).to.be.equal(premioIniziale)
    })

    it("Procedi e Conferma", () => {
        Dashboard.procediHome()
        DatiQuotazione.CaricamentoPagina()
        DatiQuotazione.confermaDatiQuotazione()
        Riepilogo.caricamentoRiepilogo()
    })

    it("Lettura premi in pagina di Riepilogo", () => {
        // Premio scontato
        
        Riepilogo.leggiPremioTot('SCONTATO')    //>> premioTotRiepilogoScontato
        cy.get('@premioTotRiepilogoScontato').then(premioTotScontato => {
            premioScontatoRiepilogo = premioTotScontato
            cy.log('Premio scontato Riepilogo: ' + premioScontatoRiepilogo)
        })
        

        // Premio iniziale barrato
        Riepilogo.leggiPremioTot('BARRATO')    //>> premioTotRiepilogoBarrato 
        cy.get('@premioTotRiepilogoBarrato').then(premioTotBarrato => {
            premioBarratoRiepilogo = premioTotBarrato
            cy.log('Premio barrato dopo sconto Riepilogo: ' + premioBarratoRiepilogo)
        })
    })

    it("Verifiche premio e frazionamento in Riepilogo", () => {
        Riepilogo.verificaFrazionamento('annuale')
        expect(premioScontatoRiepilogo).to.be.equal(premioScontato)
        expect(premioBarratoRiepilogo).to.be.equal(premioBarrato)
        Riepilogo.EmissionePreventivo()
        CensimentoAnagrafico.caricamentoCensimentoAnagrafico()
    })

    it("Censimento anagrafico", () => {
        //CensimentoAnagrafico.selezionaContraentePF(personaFisica2)
        CensimentoAnagrafico.selezionaCasa(personaFisica)
        CensimentoAnagrafico.selezionaAnimale(modificheAnimale.Nome, personaFisica, '380260000279818', false)
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
        Common.visitUrlOnEnv()
    })

    it("Apertura sezione Clients", () => {
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
    })

    it("Verifica presenza preventivo in Portafoglio", () => {
        cy.pause()
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Preventivi')
        //Portafoglio.visualizzaLista()
        Portafoglio.checkPreventivoIsPresentOnPreventivi(nPreventivo)
    })

    it("Fine Test", () => {
        cy.pause()
    })

})