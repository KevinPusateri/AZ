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


// const reloadAndCheckMatrix =() =>{
//     cy.wait(100)
//     var url = baseUrl
//     console.log(url)
//     cy.get('body').then( $body =>{
//         if(url === 'https://portaleagenzie.pp.azi.allianz.it/matrix/'){
//             return
//         }
//         console.log('BBBBB')
//         cy.wait(100)
//         cy.reload()
//         reloadAndCheckMatrix()
//     })
// }
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
    cy.visit('https://amlogin-pp.allianz.it/nidp/idff/sso?id=203&sid=2&option=credential&sid=2&target=https%3A%2F%2Fportaleagenzie.pp.azi.allianz.it%2Fmatrix%2F',{
        onBeforeLoad: win =>{
            win.sessionStorage.clear();
        }
    })
    // reloadAndCheck()
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    // reloadAndCheckMatrix()
    // Cypress.Cookies.defaults({
    //     preserve: (cookie) => {
    //         return true;
    //     }
    // })
    cy.url().should('eq',baseUrl)
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
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.url().should('eq', baseUrl + 'clients/')
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
            url: /GetDati/,
          }).as('getDati');

        cy.get('.actions-box').contains('Vai a visione globale').click()
        canaleFromPopup()
        cy.wait('@getDati', { requestTimeout: 30000 })
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