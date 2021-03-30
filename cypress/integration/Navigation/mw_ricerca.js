/// <reference types="Cypress" />
Cypress.config('defaultCommandTimeout', 15000)
  
const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)

describe('Matrix Ricerca', function () {

    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    })

    it('Buca di ricerca',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
    })

    it('Buca di ricerca - risultati',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
    })

    it('Buca di ricerca - ricerca classica',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
        cy.get('button').contains('Ricerca classica').click()
        cy.get('nx-modal-container').find('a').contains('Ricerca Cliente').click()
        canaleFromPopup()
    })

    it.only('Buca di ricerca - risultati Le mie info',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('incasso').type('{enter}')
        cy.get('button').contains('Ricerca classica').click()
        cy.get('nx-modal-container').find('a').contains('Ricerca Cliente').click()
        canaleFromPopup()
    })
})