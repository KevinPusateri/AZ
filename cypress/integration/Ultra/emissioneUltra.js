///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import 'cypress-iframe';
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
    cy.preserveCookies()
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
        //cy.iframe().find('[id="ambitiRischio"]', {timeout: 30000}).should('be.visible')
        cy.frameLoaded(iFrameUltra)

        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.log("Verifica selezione" + ambiti[1])
            //cy.iframe().find('[class="ng-star-inserted"]').contains(ambiti[i]).should('be.visible')
            //cy.iframe().find('div').contains(ambiti[i]).parent().parent().find('nx-badge').contains('1') //[class="counter"]
            cy.iframe().find('[class="ng-star-inserted"]').contains(ambiti[i]).should('be.visible')
            cy.iframe().find('div').contains(ambiti[i]).parent().parent().find('nx-badge').contains('1') //[class="counter"]
        }
    })

    it("Seleziona fonte", ()=>{
        cy.frameLoaded(iFrameUltra)

        cy.iframe().find('span').contains('Fonte').should('be.visible').click() //click su pulsante Fonte
        cy.iframe().find('[id="fontePopover"]').should('be.visible') //verifica apertura popup fonte
        //cy.iframe().find('span').contains('Fonte').should('be.visible').click() //click su pulsante Fonte
        //cy.iframe().find('[id="fontePopover"]').should('be.visible') //verifica apertura popup fonte

        cy.iframe().find('[id="fontePopover"]').find('[name="pen"]').click() //click sull'icona della penna
        cy.iframe().find('[class="fonti-table ng-star-inserted"]').should('be.visible') //verifica apertura popup per la scelta della fonte
        //cy.iframe().find('[id="fontePopover"]').find('[name="pen"]').click() //click sull'icona della penna
        //cy.iframe().find('[class="fonti-table ng-star-inserted"]').should('be.visible') //verifica apertura popup per la scelta della fonte

        //seleziona una fonte random
        cy.iframe().find('[class="fonti-table ng-star-inserted"]').find('[class="sottofonte-semplice nx-table-row ng-star-inserted"]') //lista delle fonti
            .then(($fonti) => {
                var rndFonte = Math.floor(Math.random() * $fonti.length)
                cy.get($fonti).eq(rndFonte).first().find('nx-radio').click() //click sul radio button di una fonte random

                cy.get($fonti).eq(rndFonte).first().invoke('text').then(($text) => {
                    cy.log('fonte selezionata: ', $text)
                })
            });
        
        cy.iframe().find('button').contains('CONFERMA').should('be.visible').click()
    })

    it("Seleziona frazionamento", ()=>{
        cy.frameLoaded(iFrameUltra)

        cy.iframe().find('ultra-popover-frazionamento').find('nx-icon').click() //click su pulsante frazionamento
        cy.iframe().find('[id="pricePopover"]').should('be.visible') //verifica apertura popup frazionamento

        cy.iframe().find('[id="frazionamentoDropdown"]').click() //apertura menù scelta frazionamento
        cy.iframe().find('[id="frazionamentoDropdown"]').find('[class="custom-popup ng-star-inserted"]').should('be.visible') //verifica apertura popup scelta frazionamento

        cy.iframe().find('[class="option-label"]').contains('annuale').click() //scelta frazionamento

        cy.iframe().find('[id="pricePopover"]').find('button').click() //conferma

        cy.iframe().find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
    })

    it("Modifica soluzione per Fabbricato", ()=>{
        cy.frameLoaded(iFrameUltra)

        //apertura menù scelta soluzione
        cy.iframe().find('tr')
            .contains('Fabbricato')
            .parent()
            .parent()
            .find('nx-dropdown')
            .click() 

        cy.iframe().contains('Top').should('be.visible').click() //seleziona Top

        cy.iframe().find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
    })

    it("Configurazione Contenuto e procedi", ()=>{
        cy.frameLoaded(iFrameUltra)

        //click su pulsante Penna
        cy.iframe().find('tr')
            .contains('Contenuto')
            .parent()
            .parent()
            .find('[name="pen"]')
            .click() 

        //attende il caricamento della pagina Configurazione Contenuto
        cy.iframe().find('[id="caSoluzioni"]', {timeout: 30000})
            .should('be.visible')
        
        cy.iframe().contains('Premium').should('be.visible').click() //seleziona soluzione Premium

        //verifica che la soluzione Premium sia stata selezionata
        cy.iframe().contains('Premium')
            .parents('[class="ca-col-soluzione selected"]')
            .should('be.visible')

        cy.iframe().find('[id="alz-spinner"]').should('not.be.visible')

        //cy.pause()
        //garanzia aggiuntiva 'Danni da fenomeno elettrico'
        cy.iframe().find('span')
            .contains('Danni da fenomeno elettrico')
            .parent()
            .parent()
            .find('button').contains('Aggiungi').should('be.visible')
            .click()
        
        //cy.pause()
        //verifica che la garanzia sia stata selezionata
        cy.iframe().find('span')
            .contains('Danni da fenomeno elettrico')
            .parent()
            .prev()
            .should('have.class', 'garanzia-icon selected')
        
        cy.iframe().find('[id="alz-spinner"]').should('not.be.visible')

        //garanzia aggiuntiva 'Scippo e rapina'
        cy.iframe().find('span')
            .contains('Scippo e rapina')
            .parent()
            .parent()
            .find('button').contains('Aggiungi')
            .click()

        //verifica che la garanzia sia stata selezionata
        cy.iframe().find('span')
            .contains('Scippo e rapina')
            .parent()
            .prev()
            .should('have.class', 'garanzia-icon selected')

        cy.iframe().find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento

        cy.iframe().find('span').contains('CONFERMA').should('be.visible').click()
        cy.iframe().find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento

        //cy.pause()
        cy.iframe().find('[id="dashTable"]').should('be.visible')
        cy.iframe().find('span').contains('PROCEDI', {timeout: 30000}).should('be.visible').click()
    })

    it("Conferma dati quotazione", ()=>{
        cy.frameLoaded(iFrameUltra)

        //apertura menù scelta soluzione
        cy.iframe().find('ultra-form-dati-quotazione', {timeout: 30000}).should('be.visible') //attende la comparsa del form con i dati quotazione

        cy.iframe().find('span').contains('CONFERMA').should('be.visible').click() //conferma
        cy.iframe().find('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
    })

    it("Riepilogo ed emissione", ()=>{
        cy.frameLoaded(iFrameUltra)

        //apertura menù scelta soluzione
        cy.iframe().find('[id="riepilogoBody"]', {timeout: 30000}).should('be.visible') //attende la comparsa del form con i dati quotazione

        //cy.pause()
        cy.iframe().find('span').contains('Emetti polizza').should('be.visible').click() //conferma
        cy.wait(3000)
    })

    it("Censimento anagrafico", ()=>{
        cy.frameLoaded(iFrameUltra)

        //cy.pause()
        cy.iframe().find('#tabsAnagrafiche', {timeout: 15000}).should('be.visible') //attende la comparsa del form con i dati quotazione

        //cy.pause()
        cy.iframe().find('div').contains('Casa').should('be.visible').click() //tab Casa

        cy.iframe().find('span')
            .contains('Ubicazione')
            .parent()
            .parent()
            .find('select').select('VIA DAMIANO CHIESA 98, 34128 - TRIESTE (TS)')

        cy.iframe().find('span')
            .contains('Assicurato associato')
            .parent()
            .parent()
            .find('select').select('ROSSO MARIO')

        //cy.pause()
        cy.iframe().find('[id="btnAvanti"]').click() //avanti
        cy.wait(3000)
    })

    it("Dati integrativi", ()=>{
        cy.frameLoaded(iFrameUltra)

        //cy.pause()
        cy.iframe().find('[class="page-title"]').children()
            .should('be.visible')
            .invoke('text').then((text) => {
                cy.log('page-title',  text)
            })

        //Attende il caricamento della pagina        
        cy.iframe().find('h1:contains("Dati integrativi")').should('be.visible')
        //cy.pause()

        cy.iframe().find('label').contains('Seleziona tutti NO').should('be.visible').click() //Dati integrativi oggetti assicurati tutti NO

        //cy.pause()
        cy.iframe().find('[id="btnAvanti"]').click() //avanti

        //Attende la comparsa del popup 'Dichiarazioni contraente principale' e clicca su Conferma
        cy.iframe().find('[id="PopupDichiarazioni"]', {timeout: 5000})
            .should('be.visible')
            .find('button').contains('CONFERMA').click()

        cy.wait(4000)
    })

    it("Consensi e privacy", ()=>{
        //cy.pause()
        cy.frameLoaded(iFrameUltra)
        
        //Attende il caricamento della pagina
        cy.iframe().find('[class="page-title"]', {timeout: 30000}).contains('Consensi e privacy').should('be.visible')
        //cy.iframe().find('[id="alz-spinner"]').should('not.be.visible')

        //cy.pause()
        cy.iframe().find('a').contains('Avanti').click() //avanti
        cy.wait(5000)
    })

    it("Controlli e protocollazione", ()=>{
        //cy.pause()
        cy.frameLoaded(iFrameUltra)

        //Attende il il salvataggio del contratto
        cy.iframe().find('[class="step last success"]').contains('è stato salvato con successo').should('be.visible')
        cy.wait(3000)

        //Attende la comparsa della sezione 'Riepilogo documenti'
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#RiepilogoDocumentiContainer').should('be.visible')        
    })

    it("Visualizza documenti e prosegui", ()=>{
        cy.frameLoaded(iFrameUltra)

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[class="consenso-text"]')
            .contains('Intermediario').not('Firma Compagnia')
            .next('div').click()

        cy.wait(1000)
        //cy.pause()

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[class="select2-result-label"]')
            .contains('2056852 CARGNELUTTI SILVIA').click()
        //cy.pause()

        //Attende la comparsa della sezione 'Riepilogo documenti'
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#RiepilogoDocumentiContainer')
            .find('button').not('[disabled]')//lista dei pulsanti
                .each(($button, index, $list) => {
                    cy.log("index" + index)
                    cy.wrap($button).click() //click su Visualizza

                        //conferma popup
                        cy.frameLoaded(iFrameUltra).iframeCustom()
                            .find(iFrameFirma).iframeCustom()
                            .find('button').contains('Conferma').should('be.visible').click()
                });        

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('button').contains('Avanti').click() //avanti

        cy.wait(5000)
    })

    it("Adempimenti precontrattuali e Perfezionamento", ()=>{
        cy.log('titolo tab: ', cy.title())
        cy.title().should('include', 'Allianz Matrix')

        //attende caricamento sezione Precontrattuali
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[data-bind="with: sezionePreContrattuali"]', {timeout: 20000})
            .should('be.visible')

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('button').not('[disabled]').contains('STAMPA')
                .should('be.visible')
                .click()

        cy.wait(2000)
        
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('button').not('[disabled]').contains('STAMPA')
                .should('be.visible')
                .click()

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('button').contains('Incassa')
                .should('be.visible')
                .click()
    })

    it("Incasso - parte 1", ()=>{
        //attende caricamento sezione Precontrattuali
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#pnlContratto', {timeout: 15000})
            .should('be.visible')

        //cy.pause()

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[aria-owns="TabIncassoModPagCombo_listbox"]')
            .click()
        
        cy.wait(500)

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#TabIncassoModPagCombo_listbox')
            .find('li').contains('Assegno')
            .click()

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
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[class="divAttenderePrego"]').should('not.exist')
        
        cy.wait(1000)
        //cy.pause()
    })

    it("Incasso - parte 2", ()=>{
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#TabIncassoPanelBar')
            .should('be.visible')

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
        
        //cy.wait(1000)

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

        cy.frameLoaded('#matrixIframe')
        cy.iframe().find('a').contains('Conferma').click()
    })
})