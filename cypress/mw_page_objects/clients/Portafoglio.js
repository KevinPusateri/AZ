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
        cy.get('app-client-profile-tabs').should('be.visible').within(() => {
            cy.get('a').should('be.visible')
        })
        cy.contains('PORTAFOGLIO').click()

    }

    static checkLinksSubTabs() {
        cy.get('nx-tab-header').should('be.visible')
        cy.get('button').should('be.visible')
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
        cy.get('app-wallet-active-contracts').should('be.visible').and('contain.text', 'Polizze attive')
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
        cy.wait(10000)
        Common.canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('#casella-ricerca').should('be.visible').and('contain.text', 'Cerca')
    }

    static checkProposte(){
        cy.get('app-wallet-proposals').should('be.visible')
        cy.get('app-contract-card').should('be.visible')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-contract-card').first().click()
        cy.wait(10000)
        Common.canaleFromPopup()
        cy.wait(12000)
        getIFrame().find('#AZBuilder1_ctl13_cmdEsci').should('be.visible')

    }

    static checkNonInVigore() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('app-wallet-inactive-contracts').find('app-section-title').should('contain.text', 'Polizze')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-wallet-inactive-contracts').find('span[class="nx-button__content-wrapper"]')
            .should('be.visible').and('include.text', 'Incassa')
        cy.get('app-contract-card').should('be.visible').first().click()
        cy.wait(10000)
        Common.canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('#navigation-area').should('be.visible').and('contain.text', '« Uscita')
    }

    static checkSinistri() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('app-wallet-claims').find('app-section-title').should('contain.text', 'Sinistri')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-claim-card').first()
            .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h ellipsis-icon"]').click()

        cy.get('.cdk-overlay-container').find('button').contains('Consulta sinistro').click()
        getIFrame().find('a[class="active"]').should('contain.text', 'Dettaglio del Sinistro')
    }

    static clickSubTab(subTab) {
        cy.get('nx-tab-header').contains(subTab).click({ force: true })
    }
}

export default Portafoglio