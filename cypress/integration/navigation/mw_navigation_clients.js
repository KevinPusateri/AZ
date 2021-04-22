/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000
//#endregion

//#region Global Variables
const backToClients = () => cy.get('a').contains('Clients').click()
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const canaleFromPopup = () => {cy.get('body').then($body => {
    if ($body.find('nx-modal-container').length > 0) {   
        cy.get('nx-modal-container').find('.agency-row').first().click()
    }
});
}
//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
            req.alias = 'gqlNotifications'
        }
        if (req.body.operationName.includes('news')) {
            req.alias = 'gqlNews'
        }
    })
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/',{
        onBeforeLoad: win =>{
            win.sessionStorage.clear();
        }
    })
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
    // cy.wait('@gqlNotifications')
    cy.wait('@gqlNews')
})

afterEach(() => {
    cy.get('body').then($body => {
        if ($body.find('.user-icon-container').length > 0) {   
            cy.get('.user-icon-container').click();
            cy.wait(1000).contains('Logout').click()
            cy.wait(delayBetweenTests)
        }
    });
    cy.clearCookies();
})

describe('Matrix Web : Navigazioni da Clients', function () {

    it('Verifica aggancio Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
    });

    it('Verifica aggancio Digital Me', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.get('app-rapid-link').contains('Digital Me').click()
        canaleFromPopup()
        cy.url().should('include', '/digital-me')
        backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        canaleFromPopup()
        cy.wait(5000)
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        backToClients()
    });

    it('Verifica aggancio Clienti duplicati', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        backToClients()
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.get('app-rapid-link').contains('Antiriciclaggio').click()
        canaleFromPopup()
        cy.wait(5000)
        getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
        backToClients()
    });

    it('Verifica aggancio Nuovo cliente', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        canaleFromPopup()
        cy.url().should('include', '/new-client')
        backToClients()
    });

    it('Verifica aggancio Vai a visione globale', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.intercept({
            method: 'POST',
            url: /GetDati/,
          }).as('getDati');

        cy.get('.actions-box').contains('Vai a visione globale').click()
        canaleFromPopup()
        cy.wait('@getDati', { requestTimeout: 60000 })
        getIFrame().find('#main-contenitore-table').should('exist').and('be.visible')
        backToClients()
    });

    it('Verifica aggancio Appuntamenti', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.get('.meetings').click()
        canaleFromPopup()
        cy.url().should('include', '/clients/event-center')
        cy.get('lib-sub-header-right').find('nx-icon').click()
    });

    it('Verifica aggancio Richiesta Digital Me', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.get('app-dm-requests-card').first().find('button[class^="row-more-icon-button"]').click()
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').each(($checkLink) =>{
            expect($checkLink.text()).not.to.be.empty
        })
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').first().invoke('text')
            .should('include', '+')
        cy.get('app-digital-me-context-menu').find('[href^="mailto"]').invoke('text').should('include', '@')
        cy.get('app-digital-me-context-menu').find('[href^="/matrix/clients/"]').should('contain', 'Apri scheda cliente')
        cy.get('app-digital-me-context-menu ').find('lib-da-link').should('contain', 'Apri dettaglio polizza')
    });

    it('Verifica aggancio Richiesta Digital Me - button Vedi tutte', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.contains('Vedi tutte').click()
        cy.url().should('include', '/clients/digital-me')
        cy.get('[class="ellipsis-box"]').first().find('button').click()
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').each(($checkLink) =>{
            expect($checkLink.text()).not.to.be.empty
        })
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').first().invoke('text')
            .should('include', '+')
        cy.get('app-digital-me-context-menu').find('[href^="mailto"]').invoke('text').should('include', '@')
        cy.get('app-digital-me-context-menu').find('[href^="/matrix/clients/"]').should('contain', 'Apri scheda cliente')
        cy.get('app-digital-me-context-menu ').find('lib-da-link').should('contain', 'Apri dettaglio polizza')

    });
})