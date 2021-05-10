/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000
const baseUrl = Cypress.env('baseUrl') 
const interceptPageClients = () =>{
    cy.intercept({
        method: 'POST',
        url: '**/clients/**' ,
      }).as('getClients');
    
}

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

const canaleFromPopup = () => {
    cy.get('body').then($body => {
        if ($body.find('nx-modal-container').length > 0) {  
        cy.wait(3000)
        cy.get('nx-modal-container').find('.agency-row').first().click()
    }
});
}
//#endregion

before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  
    cy.intercept('POST', '/graphql', (req) => {
    // if (req.body.operationName.includes('notifications')) {
    //     req.alias = 'gqlNotifications'
    // }
    if (req.body.operationName.includes('news')) {
        req.alias = 'gqlNews'
    }
    })
    cy.viewport(1920, 1080)
  
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('le00080')
    cy.get('input[name="Ecom_Password"]').type('Dragonball3')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait('@gqlNews')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
  })
  
  after(() => {
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
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica presenza dei collegamenti rapidi',function() {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        const linksCollegamentiRapidi = [
            'Analisi dei bisogni', // NEW
            'Digital Me',
            'Pannello anomalie',
            'Clienti duplicati',
            'Antiriciclaggio'
        ]
        cy.get('app-home-right-section').find('app-rapid-link').should('have.length',5).each(($link, i) => {
            expect($link.text().trim()).to.include(linksCollegamentiRapidi[i]);
        })
    })

    // TODO: NEW PAGINA
    it('Verifica aggancio Analisi dei bisogni', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.get('app-rapid-link').find('a[href="https://www.ageallianz.it/analisideibisogni/app"]').invoke('removeAttr','target').contains('Analisi dei bisogni').click()
        cy.go('back')
        cy.url().should('include', baseUrl + 'clients/')
    });

    it('Verifica aggancio Digital Me', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.get('app-rapid-link').contains('Digital Me').click()
        canaleFromPopup()
        cy.url().should('eq', baseUrl + 'clients/digital-me')
        backToClients()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Pannello anomalie', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        backToClients()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Clienti duplicati', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        backToClients()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.get('app-rapid-link').contains('Antiriciclaggio').click()
        canaleFromPopup()
        getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
        backToClients()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Nuovo cliente', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        canaleFromPopup()
        cy.url().should('eq', baseUrl + 'clients/new-client')
        backToClients()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Vai a visione globale', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.intercept({
            method: 'POST',
            url: '**/dacommerciale/**',
        }).as('getDaCommerciale');
        cy.get('.actions-box').contains('Vai a visione globale').click()
        canaleFromPopup()
        cy.wait('@getDaCommerciale', { requestTimeout: 50000 })
        getIFrame().find('#main-contenitore-table').should('exist').and('be.visible')
        backToClients()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Appuntamenti', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.get('.meetings').click()
        canaleFromPopup()
        cy.url().should('eq', baseUrl + 'clients/event-center')
        cy.get('lib-sub-header-right').find('nx-icon').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Richiesta Digital Me', function () {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
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
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
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