/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 15000)
const delayBetweenTests = 2000
//#endregion

beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
    cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
})

afterEach(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
})


describe('Buca di Ricerca', function () {

    it('Verifica Click su Ricerca Classica',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
        cy.url().should('include', '/search/clients/clients')
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()

        const links = [
            'Ricerca Cliente',
            'Ricerca Polizze proposte',
            'Ricerca Preventivi',
            'Ricerca Documenti',
            'Ricerca News',
            'Rubrica'
            ];     
        cy.get('nx-modal-container').find('lib-da-link').each(($linkRicerca, i) =>{
            expect($linkRicerca.text().trim()).to.include(links[i]);
        })
        cy.get('nx-modal-container').find('button[aria-label="Close dialog"]').click()
    })

    it('Verifica Click su Ricerca Cliente',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
        cy.url().should('include', '/search/clients/clients')
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()
        
        cy.get('nx-modal-container').find('lib-da-link').contains('Ricerca Cliente').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')

    })

})