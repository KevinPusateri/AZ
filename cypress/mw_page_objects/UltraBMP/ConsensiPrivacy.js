/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class ConsensiPrivacy {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Consensi e Privacy
     */
     static caricamentoPagina() {
        cy.intercept({
            method: 'GET',
            url: '**/consensi/getStatiDocumentiPersonali'
        }).as('documenti')

        cy.wait('@documenti', { requestTimeout: 60000 })
    }

    /**
     * Click su Avanti
     */
    static Avanti() {
        ultraIFrame().within(() => {
            cy.get('a').contains('Avanti').click() //avanti
        })
    }

    /**
     * Verifica l'esistenza della sezione
     * * @param {*} sezione
     */
     static verificaSezione(sezione) {
        ultraIFrame().within(() => {
            cy.get('div[class="section-title"]').contains(sezione).should('have.length', 1)
        })
    }
}

export default ConsensiPrivacy