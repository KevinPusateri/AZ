/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Appendici {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Dati Integrativi
     */
     static caricamentoPagina() {
        cy.intercept({
            method: 'POST',
            url: '**/GetNuoveAppendiciContratto'
        }).as('appendici')

        cy.wait('@appendici', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    /**
     * seleziona l'appendice da gestire
     * @param {string} appendice 
     */
    static SelezionaAppendice(appendice) {
        ultraIFrame().within(() => {
            cy.get('#nuoveAppendiciSelect_chosen').should('be.visible').click() //apre il menù appendici
            cy.get('.chosen-results').find('li').contains(appendice).click() //seleziona appendice
        })
    }

    /**
     * click sul pulsante avanti
     */
    static Avanti() {
        ultraIFrame().within(() => {
            cy.get('input[value="Avanti"]').click()
        })
    }

    static Conferma() {
        ultraIFrame().within(() => {
            cy.get('input[value="Conferma"]').click()
        })
    }

    static CompilazioneAppendice(compagnia, nCiascunaPolizza) {
        ultraIFrame().within(() => {
            cy.get('#compilazioneAppendice').find('[data-bind*="COMPAGNIA"]')
            .children('input').type(compagnia)
            cy.get('#compilazioneAppendice').find('[data-bind*="POLIZZE"]')
            .children('input').type(nCiascunaPolizza)
        })
    }
}

export default Appendici