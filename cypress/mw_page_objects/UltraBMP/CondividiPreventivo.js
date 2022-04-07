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

class CondividiPreventivo {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Censimento Anagrafico
     */
    static caricamentoPreventivo() {
        cy.intercept({
            method: 'GET',
            url: '**/getDatiQuotazione'
        }).as('copertina')

        cy.wait('@copertina', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    /**
     * Seleziona tutte le schede
     */
     static SelezionaTutti() {
        ultraIFrame().within(() => {
            cy.get('label').contains('Seleziona tutti')
                .should('be.visible').click()
        })
    }

    /**
     * Seleziona copertina
     * @param {string} copertina (copertina che si vuole selezionare) 
     */
     static SelezionaCopertina(copertina) {
        ultraIFrame().within(() => {
            cy.get('div[class="copertine"]').should('exist')
              .find('div[class="radio-strip-items"]').should('exist')
              .find('footer').contains(copertina).should('have.length', 1).click()
        })
    }

    /**
     * Clicca sul pulsante Conferma
     */
    static Conferma() {
        ultraIFrame().within(() => {
            cy.get('div[class="page-footer"]')
              .should('exist')
              .find('button').contains('Conferma')
              .should('be.visible').click()
        })
    }
}

export default CondividiPreventivo