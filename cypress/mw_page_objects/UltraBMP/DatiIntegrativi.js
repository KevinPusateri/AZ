/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class DatiIntegrativi {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Dati Integrativi
     */
     static caricamentoPagina() {
        cy.intercept({
            method: 'GET',
            url: '**/datiintegrativi/getDati'
        }).as('datiintegrativi')

        cy.wait('@datiintegrativi', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    /**
     * Clicca sull'opzione 'Seleziona tutti NO'
     */
    static selezionaTuttiNo() {
        ultraIFrame().within(() => {
            cy.get('label').contains('Seleziona tutti NO').should('be.visible').click()
        })
    }

    /**
     * clicca sul pulsante Conferma nel popup Dichiarazioni Contraente
     */
    static popupDichiarazioni() {
        ultraIFrame().within(() => {
            cy.get('[id="PopupDichiarazioni"]', { timeout: 5000 })
                .should('be.visible')
                .find('button').contains('CONFERMA').click()
        })
    }
}

export default DatiIntegrativi