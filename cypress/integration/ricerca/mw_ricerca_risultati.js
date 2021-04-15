/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000
//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
    cy.intercept(/launch-*/,'ignore').as('launchStaging');
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
            req.alias = 'gqlNotifications'
        }
    })
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
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.wait('@gqlNotifications')
})

afterEach(() => {
    cy.get('.user-icon-container').click()
    cy.wait(1000).contains('Logout').click()
    cy.wait(delayBetweenTests)
    cy.clearCookies();
})


describe('Buca di Ricerca - Risultati', function () {

    it('Verifica Atterraggio nella Pagina',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
        cy.url().should('include', '/search/clients/clients')
        const tabHeader = [
            'clients',
            'sales',
            'le mie info'
        ]        
        cy.get('[class^="docs-grid-colored-row tabs-container"]').find('[class^="tab-header"]').each(($tab,i) =>{
            expect($tab.text().trim()).to.include(tabHeader[i]);
        })

        cy.get('lib-advice-navigation-section').contains('Suggerimenti di navigazione').should('exist').and('be.visible')

        const suggLinks = [
            'Provvigioni',
            'Quattroruote - Calcolo valore Veicolo',
            'Interrogazioni Centralizzate',
            'Recupero preventivi e quotazioni',
            'Monitoraggio Polizze Proposte'
        ]
        cy.get('lib-advice-navigation-section').find('.position-sidebar>.title').should('have.length',5).each(($suggerimenti,i) =>{
            expect($suggerimenti.text().trim()).to.include(suggLinks[i]);
        })
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible')
    })
})
