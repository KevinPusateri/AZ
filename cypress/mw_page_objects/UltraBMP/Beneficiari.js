/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}


const ultraIFrameAnagrafica = () => {
    let iframeAnag = cy.get('#divPopupAnagrafica').find('#divPopUpACAnagrafica')
        .its('0.contentDocument').should('exist')

    return iframeAnag.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Beneficiari {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Censimento Anagrafico
     */
    static caricamentoBeneficiari() {
        cy.intercept({
            method: 'GET',
            url: '**/beneficiari/assicurati'
        }).as('beneficiari')

        cy.wait('@beneficiari', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    /**
     * Clicca sul pulsante Avanti
     */
    static Avanti() {
        ultraIFrame().within(() => {
            cy.get('button').contains('Avanti')
                .should('be.visible').click()
        })
    }
}

export default Beneficiari