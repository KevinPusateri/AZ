/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000
const baseUrl = Cypress.env('baseUrl') 
//#endregion

//#region Global Variables
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
}//#endregion

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
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait(2000).wait('@gqlNews')
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

describe('Matrix Web : Navigazioni da Burger Menu in Clients', function () {

    it('Verifica i link da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')

        const linksBurger = [
            'Home Clients',
            'Censimento nuovo cliente',
            'Digital Me',
            'Pannello anomalie',
            'Clienti duplicati',
            'Cancellazione Clienti',
            'Cancellazione Clienti per fonte',
            'Gestione fonte principale',
            'Antiriciclaggio'
        ]
        cy.get('lib-side-menu-link').find('a').should('have.length',9).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    });

    it('Verifica aggancio Censimento nuovo cliente da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Censimento nuovo cliente').click()
        canaleFromPopup()
        cy.url().should('eq', baseUrl + 'clients/new-client')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Digital Me da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Digital Me').click()
        canaleFromPopup()
        cy.url().should('eq', baseUrl + 'clients/digital-me')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Pannello anomalie da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Pannello anomalie').click()
        cy.wait(3000)
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Clienti duplicati da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Clienti duplicati').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Cancellazione Clienti da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Cancellazione Clienti per fonte da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti per fonte').click().wait(2000)
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Gestione fonte principale da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Gestione fonte principale').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Persona fisica"):visible')
        getIFrame().find('span:contains("Persona giuridica"):visible')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });

    it('Verifica aggancio Antiriciclaggio da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Antiriciclaggio').click()
        canaleFromPopup()
        getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
    });
});