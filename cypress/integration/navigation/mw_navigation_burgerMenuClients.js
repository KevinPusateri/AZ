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
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion

before(() => {
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF008')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
})
beforeEach(() => {
    cy.viewport(1920, 1080)
    // Preserve cookie in every test
    Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return true;
        }
    })
})
after(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
})

describe('Matrix Web : Navigazioni da Burger Menu in Clients', function () {

    it('Verifica aggancio Censimento nuovo cliente da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Censimento nuovo cliente').click()
        cy.url().should('include', '/new-client')
        cy.get('a').contains('Clients').click()
    });

    it('Verifica aggancio Digital Me da Burger Menu', function () {
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        cy.get('a').contains('Clients').click()
    });

    it('Verifica aggancio Pannello anomalie da Burger Menu', function () {
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Pannello anomalie').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
    });

    it('Verifica aggancio Clienti duplicati da Burger Menu', function () {
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Clienti duplicati').click()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
    });

    it('Verifica aggancio Cancellazione Clienti da Burger Menu', function () {
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
    });

    it('Verifica aggancio Cancellazione Clienti per fonte da Burger Menu', function () {
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti per fonte').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
    });

    it('Verifica aggancio Gestione fonte principale da Burger Menu', function () {
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Gestione fonte principale').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
    });

    it('Verifica aggancio Antiriciclaggio da Burger Menu', function () {
        cy.url().should('include', '/clients')
        cy.get('lib-burger-icon').click()
        cy.contains('Antiriciclaggio').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
        cy.get('a').contains('Clients').click()

    });
});