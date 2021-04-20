///<reference types="cypress"/>

var ambiente = "preprod";
var cliente = "PAOLO MAGRIS"

var ambiti = ['Fabbricato', 'Contenuto']

/* const iframeUltra = () => {
    cy.getIframeBody('[class="iframe-content ng-star-inserted"]')
    cy.getIframeBody('[class="iframe-content ng-star-inserted"]').should.contains("portaleagenzie")
    return cy.getIframeBody('[class="iframe-content ng-star-inserted"]')
} */

before(() => {
    cy.viewport(1200, 900);
    //cy.loginMatrix(ambiente, "TUTF014", "P@ssw0rd!")
    })

beforeEach(() => {
    Cypress.Cookies.preserveOnce('JSESSIONID')
    Cypress.Cookies.preserveOnce('IPCZQX037b3024be')
    cy.viewport(1200, 900);
    })

describe("TEST di prova", ()=>{
    it("Login", ()=>{
        cy.loginMatrix(ambiente, "TUTF004", "P@ssw0rd!")
    })

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
        cy.getIframeBody('[class="iframe-content ng-star-inserted"]').find('[id="ambitiRischio"]', {timeout: 30000}).should('be.visible')
        //cy.get('[id="ambitiRischio"]', {timeout: 30000}).should('be.visible')

        for(var i = 0; i<ambiti.length; i++ )
        {
            cy.log("Verifica selezione" + ambiti[1])
            cy.getIframeBody('[class="iframe-content ng-star-inserted"]').find('[class="ng-star-inserted"]').contains(ambiti[i]).should('be.visible')
            cy.getIframeBody('[class="iframe-content ng-star-inserted"]').find('div').contains(ambiti[i]).parent().parent().find('nx-badge').contains('1') //[class="counter"]
        }
    })
})