/// <reference types="Cypress" />
import Common from "../common/Common"

//#region Iframe
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
//#endregion

class News {
    /**
     * Check atterraggio su News
     * @param {boolean} da Se true, verifica url con aggancio in DA
     */
    static checkAtterraggio(da = false) {
        if (da)
            cy.url().should('include', Common.getBaseUrl() + 'legacyda')
        else
            cy.url().should('include', Common.getBaseUrl() + 'lemieinfo?news=news')


        getIFrame().find('app-header:contains("Primo Piano"):visible')
        getIFrame().find('app-header:contains("Tutte"):visible')
        cy.screenshot('Check Atterraggio su News', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }
}

export default News