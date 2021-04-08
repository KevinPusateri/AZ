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


describe('Matrix Web : Navigazioni da Home Page - ', function () {

    it('Log In', function () {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF008')
        cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    });

    it('Top Menu Principali', function () {

        cy.get('lib-calendar').click()
        cy.get('lib-incident').click()
        cy.get('lib-notification-header').click()
        cy.get('lib-user-header').click()

        cy.get('lib-switch-button').click()
        cy.get('.lib-switch-button-list-column').should('have.length',6)
    });

    it('Top Menu Clients', function () {
        cy.get('lib-switch-button-list').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Sales', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Numbers', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Backoffice', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu News', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Le mie info', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Le mie info').click()
        cy.url().should('include', '/lemieinfo')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Cerca in Matrix', function () {
        cy.get('input').invoke('attr', 'placeholder').should('contain', 'Cerca in Matrix')
    });

    it('Button Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Button Sales', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Button Numbers', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Button Backoffice', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });
    it('Button News', function () {
        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click().wait(5000)
    });

    it('Centro notifiche', function () {
        cy.get('app-notification-top-bar').find('a').contains('Vai al Centro notifiche').click()
        cy.url().should('include', '/notification-center')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Vedi tutte le news', function () {
        cy.get('app-news-top-bar-title-cta').contains('Vedi tutte').click()
        cy.url().should('include', '/news/recent')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    // TODO:  notification card first
    // cy.wait(5000)
    // if(!cy.get('.lib-notification-card').length){
    //     cy.get('.lib-notification-card').find('lib-da-link').first().click()
    // }

    // cy.get('lib-da-link').contains('Banche Dati ANIA').click()
    // cy.get('a[href="/matrix/"]').click()
    // cy.get('.nx-margin-bottom-2m').first().click()
    // cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })


    //TODO: not found lib-client-item
    // cy.get('input[name="main-search-input"]').type('RO').type('{enter}')
    // cy.get('lib-client-item').first().click()
    // cy.get('a[href="/matrix/"]').click()
});