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

    /**
     * Click Pannello "Notifiche in evidenza"
     */
    static clickPanelNotifiche() {
// APERTURA PANNELLO             
        // cy.intercept('POST', '**/graphql', (req) => {
        //     if (req.body.operationName.includes('notifications')) {
        //         req.alias = 'gqlNotifications'
        //     }
        // })
        // cy.get('nx-expansion-panel').click()
        // cy.wait('@gqlNotifications')
        cy.get('lib-notification-list').should('be.visible')

    }

    /**
     * Verifica notifiche siano visibili,
     * che i titoli corrispondano e 
     * controlla i testi dal menu a tendina di ciascuna notifica 
     * corrispondano
     */
    static checkNotifiche() {
        cy.get('lib-notification-list').find('lib-notification-card').each(($checkNotifica) => {
            expect($checkNotifica).to.be.visible
        })

        cy.get('lib-notification-list').find('[class="title-container"]').each((checkNotificaTitle) => {
            expect(['portafoglio', 'contabilità','vps']).to.include(checkNotificaTitle.text().trim())
        })

        cy.get('lib-notification-list').find('button[class="nx-button--tertiary nx-button--medium"]').each(($checkTendina) => {
            cy.wrap($checkTendina).click({force:true})
            cy.get('[class^="nx-context-menu__content"]').find('button').each($button => {
                expect(['Disattiva notifiche di questo tipo', 'Attiva notifiche di questo tipo',
                    'Segna come da leggere', 'Segna come già letta', 'Segna come da leggere'])
                    .to.include($button.text().trim())
            })

        })
    }
}

export default HomePage