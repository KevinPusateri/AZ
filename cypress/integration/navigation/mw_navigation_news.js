/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000


const getIFrame = () => {
    cy.get('iframe[class="iframe-object"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-object"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
  
const baseUrl = Cypress.env('baseUrl') 

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
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
    cy.url().should('eq',baseUrl)
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 60000 });
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
describe('Matrix Web : Navigazioni da News', function () {

    it('Verifica aggancio News', function () {
        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.url().should('eq', baseUrl + 'news/home')
        getIFrame().find('app-header:contains("Primo Piano"):visible')
        getIFrame().find('app-header:contains("Tutte"):visible')
    })
});