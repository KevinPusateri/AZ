///<reference types="cypress"/>

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali
var ambiente = "preprod";
//var cliente = "PAOLO MAGRIS"
var cliente = "MARIO MENEGALDO"
var ambiti = ['Fabbricato', 'Contenuto']
let nuovoCliente;
let iFrameUltra = '[class="iframe-content ng-star-inserted"]'
//#endregion variabili iniziali

/* const iframeUltra = () => {
    cy.getIframeBody('[class="iframe-content ng-star-inserted"]')
    cy.getIframeBody('[class="iframe-content ng-star-inserted"]').should.contains("portaleagenzie")
    return cy.getIframeBody('[class="iframe-content ng-star-inserted"]')
} */

before(() => {
    cy.clearCookies();
  
    cy.task('cliente').then((object) => {
      nuovoCliente = object;
    });
    
    cy.loginMatrix(ambiente, 'TUTF014', 'P@ssw0rd!')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
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
        cy.get('[ngclass="agency-row"]').first().click()
    })

    it("Verifica selezione ambiti su home Ultra Casa e Patrimonio", ()=>{
        cy.getIframeBody(iFrameUltra).find('[id="ambitiRischio"]', {timeout: 30000}).should('be.visible')
        //cy.get('[id="ambitiRischio"]', {timeout: 30000}).should('be.visible')

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
})