/// <reference types="Cypress" />

class HomePage {

    static reloadMWHomePage() {
        //Skip this two requests that blocks on homepage
        cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
        cy.intercept(/launch-*/, 'ignore').as('launchStaging');

        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')
    }
}

export default HomePage