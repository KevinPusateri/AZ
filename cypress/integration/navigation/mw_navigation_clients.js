/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 15000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()
const backToClients = () => cy.get('a').contains('Clients').click().wait(2000)
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

describe('Matrix Web : Navigazioni da Clients', function () {

    it('Verifica aggancio Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
    });

    it('Verifica aggancio Digital Me', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('app-rapid-link').contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        //TODO entrare dopo la disambiguazione nel pannello anomalie
        closePopup()
    });

    
    it('Verifica aggancio Clienti duplicati', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        //TODO verificare che sono entrato nei clienti duplicati
        backToClients()
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('app-rapid-link').contains('Antiriciclaggio').click()
        //TODO verifica dopo la disambiguazione che sono entrato nell'antiriciclaggio
        closePopup()
    });

    it('Verifica aggancio Nuovo cliente', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        cy.url().should('include', '/new-client')
        backToClients()
    });

    it('Verifica aggancio Vai a visione globale', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('.actions-box').contains('Vai a visione globale').click()
        //TODO verifica atterraggio in visione globale
        backToClients()
    });

    it('Verifica aggancio Appuntamenti', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('.meetings').click()
        //TODO verifica dopo la disambiguazione che sono entrato nell'antiriciclaggio
        backToClients()
    });
})