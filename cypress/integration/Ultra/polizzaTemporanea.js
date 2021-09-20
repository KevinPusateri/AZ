///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import 'cypress-iframe';
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali
var cliente = "ANNA GALLO"
var clienteUbicazione = "VIA DELL'ACQUARIO 9, 00055 - LADISPOLI (RM)"
//var ambiti = ['Fabbricato', 'Contenuto']
//var frazionamento = "annuale"
let nuovoCliente;
let iFrameUltra = '[class="iframe-content ng-star-inserted"]'
let iFrameFirma = '[id="iFrameResizer0"]'
//#endregion variabili iniziali

//#region Enumerator
const ultraRV = {
    CASAPATRIMONIO: "Allianz Ultra Casa e Patrimonio",
    CASAPATRIMONIO_BMP: "Allianz Ultra Casa e Patrimonio BMP",
    SALUTE: "Allianz Ultra Salute",
}

const ambitiUltraSalute = {
    SPESE_MEDICHE: "health-bag-doctor",
    DIARIA_DA_RICOVERO: "save",
    INVALIDITA_PERMANENTE_INFORTUNIO: "injury-plaster",
    INVALIDITA_PERMANENTE_MALATTIA: "wheelchair",
}
//#endregion enum

before(() => {
    //cy.clearCookies();
  
    cy.task('cliente').then((object) => {
      nuovoCliente = object;
    });
    
    LoginPage.logInMW('TUTF004', 'P@ssw0rd!')
  })
  
  beforeEach(() => {
    cy.preserveCookies()
  })
  
  after(() => {
    //cy.get('.user-icon-container').click()
    //cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
    cy.clearCookies();
  })

describe("Polizza temporanea", ()=>{
    it("Ricerca cliente", ()=>{
        cy.get('[name="main-search-input"]').type(cliente).should('have.value', cliente)
        cy.get('[name="main-search-input"]').type('{enter}')
        cy.wait(1000)
        cy.contains('div', cliente.toUpperCase()).click({force: true})
        
    })

    it("Emissione Ultra Salute", ()=>{
        Ultra.emissioneUltra(ultraRV.SALUTE)
        Ultra.selezionaPrimaAgenzia()
        
    })

    it("Impostazione contratto temporaneo", ()=>{
        var ambiti = [
            ambitiUltraSalute.SPESE_MEDICHE,
            ambitiUltraSalute.DIARIA_DA_RICOVERO,
            ambitiUltraSalute.INVALIDITA_PERMANENTE_INFORTUNIO
        ]

        Ultra.contrattoTemporaneo(ambiti)
        cy.pause()
    })

    it("Seleziona fonte", ()=>{
        Ultra.selezionaFonteRandom()
    })

    it("Seleziona frazionamento", ()=>{
        Ultra.selezionaFrazionamento(frazionamento)
    })

    it("Modifica soluzione per Fabbricato", ()=>{
        Ultra.modificaSoluzioneHome('Fabbricato', 'Top')
    })

    it("Configurazione Contenuto e procedi", ()=>{
        Ultra.configuraContenuto()
        Ultra.procediHome()
    })

    it("Conferma dati quotazione", ()=>{
        Ultra.confermaDatiQuotazione()
    })

    it("Riepilogo ed emissione", ()=>{
        Ultra.riepilogoEmissione()
    })

    it("Censimento anagrafico", ()=>{
        Ultra.censimentoAnagrafico('GALLO ANNA', clienteUbicazione)
    })

    it("Dati integrativi", ()=>{
        Ultra.datiIntegrativi()
    })    

    it("Consensi e privacy", ()=>{
        Ultra.consensiPrivacy()
    })

    it("salvataggio Contratto", ()=>{
        Ultra.salvataggioContratto()  
    })

    it("Intermediario", ()=>{
        Ultra.inserimentoIntermediario()     
    })

    it("Visualizza documenti e prosegui", ()=>{
        Ultra.riepilogoDocumenti()
        // cy.wait(5000)
    })

    it("Adempimenti precontrattuali e Perfezionamento", ()=>{
        Ultra.stampaAdempimentiPrecontrattuali()
    })

    it("Incasso - parte 1", ()=>{
        //attende caricamento sezione Precontrattuali
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#pnlMainTitoli', {timeout: 15000})
            .should('be.visible')

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[value="> Incassa"]')
                .should('be.visible')
                .click()

        //cy.wait(5000)

        //attende il caricamento
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[class="divAttenderePrego"]').should('be.visible')
        
        //cy.wait(1000)
        //cy.pause()
    })

    it("Incasso - parte 2", ()=>{
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#TabIncassoPanelBar-2')
            .should('be.visible')

        //selezione mensilità
        // cy.frameLoaded(iFrameUltra)
        //     .iframeCustom().find(iFrameFirma)
        //     .iframeCustom().find('[aria-owns="TabIncassoTipoMens_listbox"]')
        //     .should('be.visible')
        //     .click()
        
        // cy.wait(1000)
        // cy.frameLoaded(iFrameUltra)
        //     .iframeCustom().find(iFrameFirma)
        //     .iframeCustom().find('li').contains('SDD')
        //     .should('be.visible')
        //     .click()

        //selezione tipo di pagamento
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[aria-owns="TabIncassoModPagCombo_listbox"]')
            .should('be.visible')
            .click()
        
        cy.wait(1000)
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#TabIncassoModPagCombo_listbox')
            .find('li').contains('Assegno')
            .should('be.visible')
            .click()
        
        //cy.wait(1000) tipo di delega

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('button').contains('Incassa')
            .should('be.visible')
            .click()

        //cy.pause()
    })

    it("Esito incasso", ()=>{
        //attende caricamento sezione Peecontrattuali
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#pnlContrattoIncasso', {timeout: 30000})
            .should('be.visible')

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[data-bind="foreach: Result.Steps"]')
            .find('img')//lista esiti
                .each(($img, index, $list) => {
                    cy.wrap($img).should('have.attr', 'src').and('contain', 'confirm_green') //verifica la presenza della spunta verde
                });

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[value="> CHIUDI"]')
            .should('be.visible')
            .click()
    })

    /* it("Chiusura", ()=>{
        cy.pause()
        
        Ultra.chiudiFinale()
    }) */
})