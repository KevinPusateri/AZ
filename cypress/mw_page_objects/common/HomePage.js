/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"

class HomePage {

    static reloadMWHomePage() {
        //Skip this two requests that blocks on homepage
        cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
        cy.intercept(/launch-*/, 'ignore').as('launchStaging');

        cy.visit(Common.getBaseUrl())
    }

    /**
     * Click link "Vai al Centro notifiche"
     */
    static clickVaiAlCentroNotifiche() {
        cy.contains('Vai al Centro notifiche').click()
        cy.url().should('include', Common.getBaseUrl() + 'notification-center')
    }

    /**
     * Click link "Vedi tutte"
     */
    static clickVediTutte() {
        cy.contains('Vedi tutte').click()
        cy.url().should('eq', Common.getBaseUrl() + 'news/recent')
    }
}

export default HomePage