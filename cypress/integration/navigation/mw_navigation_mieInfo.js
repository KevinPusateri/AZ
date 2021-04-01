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


describe('Matrix Web : Navigazioni da Le Mie Info - ', function () {
    it('Log In', function () {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    });

    it('Le Mie Info', function () {

        cy.contains('Le mie info ').click({ force: true })
        cy.wait(3000)

        cy.url().should('include', '/my-info')
    })
});