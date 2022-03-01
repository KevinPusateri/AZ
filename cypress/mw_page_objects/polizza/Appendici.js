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

    static caricamentoEdit() {
        cy.intercept({
            method: 'POST',
            url: '**/EditAppendice/**'
        }).as('edit')

        cy.wait('@edit', { requestTimeout: 60000 })
    }

    static caricamentoDocumenti() {
        cy.intercept({
            method: 'POST',
            url: '**/Documento/**'
        }).as('documenti')

        cy.wait('@documenti', { requestTimeout: 60000 })
    }

    static caricamentoNuoveAppendici() {
        cy.intercept({
            method: 'POST',
            url: '**/GetNuoveAppendiciContratto'
        }).as('nuoveAppendici')

        cy.wait('@nuoveAppendici', { requestTimeout: 60000 })
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
            //cy.get('#pageActionButtons')
            cy.get('input[value="Avanti"]').first()
                .should('not.have.attr', 'style', 'display: none;').click()
        })
    }

    static Conferma() {
        ultraIFrame().within(() => {
            cy.get('input[value="Conferma"]').click()
        })
    }

    static Home() {
        ultraIFrame().within(() => {
            cy.get('input[value="Home"]').not('[style="display: none;"]')
                .should('be.visible').click()
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

    static StampaDocumento() {
        ultraIFrame().within(() => {
            cy.get('.documentoSection').should('be.visible')

            cy.get('input[value="Stampa"]').should('be.visible').click()
        })
    }

    static InviaMail() {
        ultraIFrame().within(() => {
            cy.get('.documentoSection').should('be.visible')

            cy.get('input[value="@"]').should('be.visible').click()
        })
    }

    /**
     * Verifica che l'appendice sia presente in lista
     * @param {string} nomeAppendice 
     */
    static VerificaNuoveAppendici(nomeAppendice) {
        ultraIFrame().within(() => {
            cy.get('#listaDocumentiGruppo').find('span[data-bind="text: Descrizione"]')
                .contains(nomeAppendice).should('be.visible')
        })
    }
}

export default Appendici