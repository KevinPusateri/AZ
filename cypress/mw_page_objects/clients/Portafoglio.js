/// <reference types="Cypress" />

import Common from "../common/Common";
import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class Portafoglio {

    static back() {
        cy.get('a').contains('Clients').click()
    }

    static clickTabPortafoglio() {

        cy.contains('PORTAFOGLIO').click()

    }

    static checkLinksSubTabs() {
        const tabPortafoglio = [
            'Polizze attive',
            'Proposte',
            'Preventivi',
            'Non in vigore',
            'Sinistri'
        ]
        cy.get('nx-tab-header').find('button').each(($checkTabPortafoglio, i) => {
            expect($checkTabPortafoglio.text().trim()).to.include(tabPortafoglio[i]);
        })
    }

    static checkPolizzeAttive() {
        cy.get('app-contract-card').should('be.visible')
        cy.get('app-wallet-quotations').find('app-wallet-quotations').should('contain.text', 'Polizze attive')
        cy.get('app-wallet-active-contracts').find('span[class="nx-button__content-wrapper"]')
            .should('be.visible').and('include.text', 'Incassa').and('include.text', 'Modifica consensi')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-contract-card').should('be.visible').first().click()
        Common.canaleFromPopup()
        getIFrame().find('#navigation-area:contains("Contratto"):visible')
    }

    static checkPreventivi() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('app-wallet-quotations').find('app-section-title').should('contain.text', 'Preventivi')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-contract-card').should('be.visible').first().click()
        // cy.intercept('POST', '**/graphql', (req) => {
        //     // Queries
        //     aliasQuery(req, 'digitalAgencyLink')
        // })
        Common.canaleFromPopup()
        // cy.wait('@gqldigitalAgencyLink', { requestTimeout: 60000 });
        getIFrame().find('#casella-ricerca').should('contain.text', 'Cerca')
    }

    static checkNonInVigore() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('app-wallet-inactive-contracts').find('app-section-title').should('contain.text', 'Polizze')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-wallet-inactive-contracts').find('span[class="nx-button__content-wrapper"]')
            .should('be.visible').and('include.text', 'Incassa')
        cy.get('app-contract-card').should('be.visible').first().click()
        Common.canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('#casella-ricerca').should('contain.text', 'Cerca')
    }

    static checkSinistri() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('app-wallet-claims').find('app-section-title').should('contain.text', 'Sinistri')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-claim-card').first()
            .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h ellipsis-icon"]').click()

        cy.get('.cdk-overlay-container').find('button').contains('Consulta sinistro').click()
        getIFrame().find('a[class="active"]').should('contain.text','Dettaglio del Sinistro')
    }

    static clickSubTab(subTab) {
        cy.get('nx-tab-header').contains(subTab).click({ force: true })
    }
}

export default Portafoglio