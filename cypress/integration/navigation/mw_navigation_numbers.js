/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 3000

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
  
const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()
const backToClients = () => cy.get('a').contains('Clients').click().wait(5000)
const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)

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
})

afterEach(() => {
    cy.get('.user-icon-container').click()
    cy.wait(1000).contains('Logout').click()
    cy.wait(delayBetweenTests)
    cy.clearCookies();
})

describe('Matrix Web : Navigazioni da Numbers - ', function () {

    it('Numbers', function () {

        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/business-lines')

        cy.contains('LINEE DI BUSINESS').click()
        cy.get('app-agency-incoming').contains('RICAVI DI AGENZIA').click()
        console.log(getIFrame())
        getIFrame().find('a:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.get('app-kpi-card').contains('New business').click()
        // cy.get('lib-breadcrumbs').contains('Numbers').click()
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/numbers/business-lines')
        cy.get('app-kpi-card').contains('Incassi').click()
        // cy.get('lib-breadcrumbs').contains('Numbers').click()
        cy.wait(2000)
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/numbers/business-lines')
        cy.get('app-kpi-card').contains('Portafoglio').click()
        // cy.get('lib-breadcrumbs').contains('Numbers').click()
        cy.wait(2000)
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/numbers/business-lines')
        cy.contains('DANNI').click()
        cy.contains('VITA').click()

        cy.contains('PRODOTTI').click()
        cy.url().should('include', '/products')

        cy.contains('INDICATORI OPERATIVI').click()
        cy.url().should('include', '/operational-indicators')

        cy.contains('INCENTIVI').click()
        cy.url().should('include', '/incentives')

        cy.get('app-filters-section').find('nx-icon').click()
        cy.get('app-filters').contains('ANNULLA').click()
        cy.get('app-filters-section').find('.circle').click()

    })
});