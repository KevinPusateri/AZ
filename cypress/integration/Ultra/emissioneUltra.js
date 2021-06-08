///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali
//var ambiente = "preprod";
//var cliente = "PAOLO MAGRIS"
//var cliente = "MARIO MENEGALDO"
var cliente = "MARIO ROSSO"
//var cliente = "PIERO VERDE"
var ambiti = ['Fabbricato', 'Contenuto']
let nuovoCliente;
let iFrameUltra = '[class="iframe-content ng-star-inserted"]'
let iFrameFirma = '[id="iFrameResizer0"]'
//#endregion variabili iniziali

before(() => {
    //cy.clearCookies();
  
    cy.task('cliente').then((object) => {
      nuovoCliente = object;
    });
    
    LoginPage.logInMW('TUTF004', 'P@ssw0rd!')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.preserveCookies()

    //Cypress.Cookies.defaults({
    //  preserve: (cookie) => {
    //    return true;
    //  }
    //})
  })
  
  /* after(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
    cy.clearCookies();
  }) */

describe("TEST di prova", ()=>{
    /* it("Login", ()=>{
        cy.loginMatrix(ambiente, "TUTF004", "P@ssw0rd!")
    }) */

    it("Ricerca cliente", ()=>{
        cy.get('[name="main-search-input"]').type(cliente).should('have.value', cliente)
        cy.get('[name="main-search-input"]').type('{enter}')
        cy.wait(1000)
        cy.contains('div', cliente.toUpperCase()).click({force: true})
    })

    it("Selezione ambiti FastQuote", ()=>{
        cy.get('#nx-tab-content-1-0 > app-ultra-fast-quote > div.content.ng-star-inserted', {timeout: 30000}).should('be.visible')

        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.contains('div', ambiti[i]).parent().children('nx-icon').click()
        }

        cy.get('[class="calculate-btn"]').click({force: true})
        cy.get('[class="calculate-btn"]', {timeout: 15000}).contains('Ricalcola').should('be.visible')
        cy.contains('span', 'Configura').parent().click()
        //cy.get('[ngclass="agency-row"]').first().click()
    })

    it("Verifica selezione ambiti su home Ultra Casa e Patrimonio", ()=>{
        cy.getIframeBody(iFrameUltra).find('[id="ambitiRischio"]', {timeout: 30000}).should('be.visible')

        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.log("Verifica selezione" + ambiti[1])
            cy.getIframeBody(iFrameUltra).find('[class="ng-star-inserted"]').contains(ambiti[i]).should('be.visible')
            cy.getIframeBody(iFrameUltra).find('div').contains(ambiti[i]).parent().parent().find('nx-badge').contains('1') //[class="counter"]
        }
    })

    it("Seleziona fonte", ()=>{
        cy.getIframeBody(iFrameUltra).find('span').contains('Fonte').should('be.visible').click() //click su pulsante Fonte
        cy.getIframeBody(iFrameUltra).find('[id="fontePopover"]').should('be.visible') //verifica apertura popup fonte

        cy.getIframeBody(iFrameUltra).find('[id="fontePopover"]').find('[name="pen"]').click() //click sull'icona della penna
        cy.getIframeBody(iFrameUltra).find('[class="fonti-table ng-star-inserted"]').should('be.visible') //verifica apertura popup per la scelta della fonte

        //seleziona una fonte random
        cy.getIframeBody(iFrameUltra).find('[class="fonti-table ng-star-inserted"]').find('[class="sottofonte-semplice nx-table-row ng-star-inserted"]') //lista delle fonti
            .then(($fonti) => {
                var rndFonte = Math.floor(Math.random() * $fonti.length)
                cy.get($fonti).eq(rndFonte).first().find('nx-radio').click() //click sul radio button di una fonte random

                cy.get($fonti).eq(rndFonte).first().invoke('text').then(($text) => {
                    cy.log('fonte selezionata: ', $text)
                })
            });
        
        cy.getIframeBody(iFrameUltra).find('button').contains('CONFERMA').should('be.visible').click()
    })

    it("Seleziona frazionamento", ()=>{
        cy.getIframeBody(iFrameUltra).find('ultra-popover-frazionamento').find('nx-icon').click() //click su pulsante frazionamento
        cy.getIframeBody(iFrameUltra).find('[id="pricePopover"]').should('be.visible') //verifica apertura popup frazionamento

        cy.getIframeBody(iFrameUltra).find('[id="frazionamentoDropdown"]').click() //apertura menù scelta frazionamento
        cy.getIframeBody(iFrameUltra).find('[id="frazionamentoDropdown"]').find('[class="custom-popup ng-star-inserted"]').should('be.visible') //verifica apertura popup scelta frazionamento

        cy.getIframeBody(iFrameUltra).find('[class="option-label"]').contains('annuale').click() //scelta frazionamento

        cy.getIframeBody(iFrameUltra).find('[id="pricePopover"]').find('button').click() //conferma

        cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
    })

    it("Modifica soluzione per Fabbricato", ()=>{
        //apertura menù scelta soluzione
        cy.getIframeBody(iFrameUltra).find('tr')
            .contains('Fabbricato')
            .parent()
            .parent()
            .find('nx-dropdown')
            .click() 

        cy.getIframeBody(iFrameUltra).contains('Top').should('be.visible').click() //seleziona Top

        cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
    })

    it("Configurazione Contenuto e procedi", ()=>{
        //click su pulsante Penna
        cy.getIframeBody(iFrameUltra).find('tr')
            .contains('Contenuto')
            .parent()
            .parent()
            .find('[name="pen"]')
            .click() 

        //attende il caricamento della pagina Configurazione Contenuto
        cy.getIframeBody(iFrameUltra).find('[id="caSoluzioni"]', {timeout: 30000})
            .should('be.visible')
        
        cy.getIframeBody(iFrameUltra).contains('Premium').should('be.visible').click() //seleziona soluzione Premium

        //verifica che la soluzione Premium sia stata selezionata
        cy.getIframeBody(iFrameUltra).contains('Premium')
            .parents('[class="ca-col-soluzione selected"]')
            .should('be.visible')

        cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible')

        //cy.pause()
        //garanzia aggiuntiva 'Danni da fenomeno elettrico'
        cy.getIframeBody(iFrameUltra).find('span')
            .contains('Danni da fenomeno elettrico')
            .parent()
            .parent()
            .find('button').contains('Aggiungi').should('be.visible')
            .click()
        
        //cy.pause()
        //verifica che la garanzia sia stata selezionata
        cy.getIframeBody(iFrameUltra).find('span')
            .contains('Danni da fenomeno elettrico')
            .parent()
            .prev()
            .should('have.class', 'garanzia-icon selected')
        
        cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible')

        //garanzia aggiuntiva 'Scippo e rapina'
        cy.getIframeBody(iFrameUltra).find('span')
            .contains('Scippo e rapina')
            .parent()
            .parent()
            .find('button').contains('Aggiungi')
            .click()

        //verifica che la garanzia sia stata selezionata
        cy.getIframeBody(iFrameUltra).find('span')
            .contains('Scippo e rapina')
            .parent()
            .prev()
            .should('have.class', 'garanzia-icon selected')

        cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento

        cy.getIframeBody(iFrameUltra).find('span').contains('CONFERMA').should('be.visible').click()
        cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento

        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('[id="dashTable"]').should('be.visible')
        cy.getIframeBody(iFrameUltra).find('span').contains('PROCEDI', {timeout: 30000}).should('be.visible').click()
    })

    it("Conferma dati quotazione", ()=>{
        //apertura menù scelta soluzione
        cy.getIframeBody(iFrameUltra).find('ultra-form-dati-quotazione', {timeout: 30000}).should('be.visible') //attende la comparsa del form con i dati quotazione

        cy.getIframeBody(iFrameUltra).find('span').contains('CONFERMA').should('be.visible').click() //conferma
        cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
    })

    it("Riepilogo ed emissione", ()=>{
        //apertura menù scelta soluzione
        cy.getIframeBody(iFrameUltra).find('[id="riepilogoBody"]', {timeout: 30000}).should('be.visible') //attende la comparsa del form con i dati quotazione

        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('span').contains('Emetti polizza').should('be.visible').click() //conferma
        cy.wait(3000)
    })

    it("Censimento anagrafico", ()=>{
        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('#tabsAnagrafiche', {timeout: 15000}).should('be.visible') //attende la comparsa del form con i dati quotazione

        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('div').contains('Casa').should('be.visible').click() //tab Casa

        cy.getIframeBody(iFrameUltra).find('span')
            .contains('Ubicazione')
            .parent()
            .parent()
            .find('select').select('VIA DAMIANO CHIESA 98, 34128 - TRIESTE (TS)')

        cy.getIframeBody(iFrameUltra).find('span')
            .contains('Assicurato associato')
            .parent()
            .parent()
            .find('select').select('ROSSO MARIO')

        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('[id="btnAvanti"]').click() //avanti
        cy.wait(3000)
    })

    it("Dati integrativi", ()=>{
        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('[class="page-title"]').children()
            .should('be.visible')
            .invoke('text').then((text) => {
                cy.log('page-title',  text)
            })

        //Attende il caricamento della pagina        
        cy.getIframeBody(iFrameUltra).find('h1:contains("Dati integrativi")').should('be.visible')
        //cy.pause()

        cy.getIframeBody(iFrameUltra).find('label').contains('Seleziona tutti NO').should('be.visible').click() //Dati integrativi oggetti assicurati tutti NO

        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('[id="btnAvanti"]').click() //avanti

        //Attende la comparsa del popup 'Dichiarazioni contraente principale' e clicca su Conferma
        cy.getIframeBody(iFrameUltra).find('[id="PopupDichiarazioni"]', {timeout: 5000})
            .should('be.visible')
            .find('button').contains('CONFERMA').click()

        cy.wait(4000)
    })

    it("Consensi e privacy", ()=>{
        //cy.pause()
        
        //Attende il caricamento della pagina
        cy.getIframeBody(iFrameUltra).find('[class="page-title"]', {timeout: 30000}).contains('Consensi e privacy').should('be.visible')
        //cy.getIframeBody(iFrameUltra).find('[id="alz-spinner"]').should('not.be.visible')

        //cy.pause()
        cy.getIframeBody(iFrameUltra).find('a').contains('Avanti').click() //avanti
        cy.wait(3000)
    })

    it("Controlli e protocollazione", ()=>{
        //cy.pause()
        //Attende il il salvataggio del contratto
        cy.getIframeBody(iFrameUltra).find('[class="step last success"]').contains('è stato salvato con successo').should('be.visible')
        cy.wait(3000)

        //Attende la comparsa della sezione 'Riepilogo documenti'
        //cy.frameInsideFrame(iFrameUltra, iFrameFirma).find('button').contains('Avanti').click() //avanti
        //.find('#RiepilogoDocumentiContainer').should('be.visible')
        cy.getIframeBody(iFrameUltra).getIframeBody(iFrameFirma).find('button').contains('Avanti').click() //avanti

        cy.pause()
        
    })


})