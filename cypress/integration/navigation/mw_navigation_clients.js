/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 15000)

const getApp = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
  
const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()
const backToClients = () => cy.get('a').contains('Clients').click().wait(5000)
const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)


describe('Matrix Web : Navigazioni da Clients - ', function () {
    it('Log In', function () {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    });

    it('Clients', function () {
        //Problemi button nuovo cliente
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')

        cy.get('app-rapid-link').contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        backToClients()

        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        closePopup()

        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        cy.wait(1000)
        backToClients()
        
        cy.get('app-rapid-link').contains('Antiriciclaggio').click()
        closePopup()

        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        backToClients()

        cy.get('.actions-box').contains('Vai a visione globale').click()
        backToClients()
        cy.get('.meetings').click()

    })
});