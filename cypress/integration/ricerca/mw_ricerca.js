/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 3000
//#endregion

const checkBucaRicerca = () => {
    cy.get('input[name="main-search-input"]').click()
    const getSection = () => cy.get('lib-shortcut-section-item')
    getSection().find('[class="title"]:contains("Ultime pagine visitate"):visible').should('contain', 'Ultime pagine visitate')
    getSection().find('[class="title"]:contains("Ultimi clienti visualizzati"):visible').should('contain', 'Ultimi clienti visualizzati')
    getSection().find('[class="title"]:contains("Ultime polizze visualizzate"):visible').should('contain', 'Ultime polizze visualizzate')

    getSection().find('[class="left nx-grid__column-6"]').should('exist').and('be.visible').and('have.length', 9)
    getSection().find('a[href^="/matrix/clients/client/"]').should('have.length', 3).and('exist').and('be.visible').and('have.attr', 'href')
    getSection().find('img').should('have.length', 3).and('exist').and('be.visible').and('have.attr', 'src')

    getSection().find('[class="right nx-grid__column-6"]').each(($text) => {
        expect($text.text()).not.to.be.empty
    })
    getSection().find('[class="left nx-grid__column-6"]').each(($text) => {
        expect($text.text()).not.to.be.empty
    })
}


beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
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
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.wait('@gqlNotifications')
})

afterEach(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
    cy.clearCookies();
})

describe('Matrix Ricerca', function () {

    it('Verifica Ricerca Da Switch Page', function () {
        checkBucaRicerca()
    })

    it('Verifica Ricerca Da Landing Page', function () {
        const landingPage = () => cy.get('app-product-button-list').find('a')
        landingPage().contains('Clients').click()
        cy.url().should('include', '/clients')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('Sales').click()
        cy.url().should('include', '/sales')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('News').click()
        cy.url().should('include', '/news/home')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()
    })

})