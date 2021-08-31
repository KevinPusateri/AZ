/// <reference types="Cypress" />
import Common from "../common/Common"

const getIFrame = () => {

    cy.get('iframe').then($iframe => {
        let iframeClass

        if ($iframe.hasClass('iframe-object'))
            iframeClass = 'iframe-object'
        else
            iframeClass = 'iframe-content ng-star-inserted'

        cy.get('iframe[class="' + iframeClass + '"]').iframe();

        cy.get('iframe[class="' + iframeClass + '"]')
            .its('0.contentDocument').should('exist').as('getFrame')
    })

    return cy.get('@getFrame').its('body').should('not.be.undefined').then(cy.wrap)

}

class News {
    /**
    * @param {boolean} da - Se true, verifica url con aggancio in DA
    */
    static checkAtterraggio(da = false) {
        if (da)
            cy.url().should('include', Common.getBaseUrl() + 'legacyda')
        else
            cy.url().should('include', Common.getBaseUrl() + 'news')

        
        getIFrame().find('app-header:contains("Primo Piano"):visible')
        getIFrame().find('app-header:contains("Tutte"):visible')
    }
}

export default News