/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000


const getIFrame = () => {
    cy.get('iframe[class="iframe-object"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-object"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
  
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
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
})

// afterEach(() => {
//     cy.get('.user-icon-container').click()
//     cy.contains('Logout').click()
//     cy.wait(delayBetweenTests)
// })


describe('Matrix Web : Navigazioni da Le Mie Info', function () {

    // TODO: non legge getIframe
    it('Le Mie Info', function () {
        cy.contains('Le mie info').click()
        cy.url().should('include', '/lemieinfo')

        console.log(getIFrame().children())
        getIFrame().find('a:contains("» tutti i comunicati"):visible')

    })
});