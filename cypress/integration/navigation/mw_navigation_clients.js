/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()
const backToClients = () => cy.get('a').contains('Clients').click()
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return true;
        }
    })
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.get('app-product-button-list').find('a').contains('Clients').click()
})

describe('Matrix Web : Navigazioni da Clients', function () {

    it('Verifica aggancio Clients', function () {
        cy.url().should('include', '/clients')
    });

    it('Verifica aggancio Digital Me', function () {
        cy.get('app-rapid-link').contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function () {
        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        backToClients()
    });
    
    it('Verifica aggancio Clienti duplicati', function () {
        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        backToClients()
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        cy.get('app-rapid-link').contains('Antiriciclaggio').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
        backToClients()
    });

    it('Verifica aggancio Nuovo cliente', function () {
        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        cy.url().should('include', '/new-client')
        backToClients()
    });

    it('Verifica aggancio Vai a visione globale', function () {
        cy.get('.actions-box').contains('Vai a visione globale').click().wait(15000)
        getIFrame().find('#main-contenitore-table').should('exist').and('be.visible')
        backToClients()
    });

    it('Verifica aggancio Appuntamenti', function () {
        cy.get('.meetings').click()
        cy.url().should('include', '/clients/event-center')
        cy.get('lib-sub-header-right').find('nx-icon').click()
    });
})