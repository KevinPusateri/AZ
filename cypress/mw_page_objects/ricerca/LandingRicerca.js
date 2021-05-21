/// <reference types="Cypress" />

class LandingRicerca {

    static clickFirstResult() {
        cy.get('lib-client-item').first().click();
    }
}

export default LandingRicerca