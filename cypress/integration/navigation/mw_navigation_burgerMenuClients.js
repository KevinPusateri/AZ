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


describe('Matrix Web : Navigazioni da Burger Menu in Clients - ', function () {
    it('Log In', function () {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    });

    it('Burger Menu Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')

        cy.get('lib-burger-icon').click()
        cy.contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        backToClients()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Censimento nuovo cliente').click()
        cy.url().should('include', '/new-client')
        backToClients()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Pannello anomalie').click()
        closePopup()
        cy.wait(5000)

        cy.contains('Clienti duplicati').click()
        backToClients()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti').click()
        closePopup()

        cy.contains('Cancellazione Clienti per fonte').click()
        closePopup()

        cy.contains('Gestione fonte principale').click()
        closePopup()

        cy.contains('Antiriciclaggio').click()
        closePopup()

        cy.contains('Allianz Ultra BMP').click()
        closePopup()


    })
});