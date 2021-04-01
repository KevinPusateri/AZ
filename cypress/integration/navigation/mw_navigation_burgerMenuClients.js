/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
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

describe('Matrix Web : Navigazioni da Burger Menu in Clients', function () {

    it('Verifica aggancio Digital Me da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        backToClients()
    });

    it('Verifica aggancio Censimento nuovo cliente da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Censimento nuovo cliente').click()
        cy.url().should('include', '/new-client')
        backToClients()
    });

    it('Verifica aggancio Pannello anomalie da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Pannello anomalie').click()
        //TODO entrare dopo la disambiguazione nel pannello anomalie
        closePopup()
    });

    it('Verifica aggancio Clienti duplicati da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Clienti duplicati').click()
        //TODO verificare che sono entrato nei clienti duplicati
        backToClients()
    });

    it('Verifica aggancio Cancellazione Clienti da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti').click()
        closePopup()
    });

    it('Verifica aggancio Cancellazione Clienti per fonte da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti per fonte').click()
        //TODO verifica dopo la disambiguazione che sono entrato nella cancellazione clienti per fonte
        closePopup()
    });

    it('Verifica aggancio Gestione fonte principale da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Gestione fonte principale').click()
        //TODO verifica dopo la disambiguazione che sono entrato nella Gestione fonte principale
        closePopup()
    });

    it('Verifica aggancio Antiriciclaggio da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Antiriciclaggio').click()
        //TODO verifica dopo la disambiguazione che sono entrato nell'antiriciclaggio
        closePopup()
    });
});