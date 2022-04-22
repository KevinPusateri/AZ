/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class RecuperoPreventivo {

    //#region caricamenti
    /**
     * Attende il caricamento della pagina
     */
    static caricamentoPagina() {
        cy.intercept({
            method: 'POST',
            url: '**/recupero-preventivo/ricerca'
        }).as('recupero')

        cy.wait('@recupero', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    /**
     * imposta il valore nel filtro indicato
     * @param {fixture} filtro 
     * @param {string} cerca 
     */
    static impostaFiltro(filtro, valore) {
        cy.log("filtro: " + filtro)
        cy.log("valore: " + valore)

        switch (filtro) {
            case "numero":
            case "nome":
            case "note":
                cy.log("caso 1")
                ultraIFrame().within(() => {
                    cy.get('[class^="nx-expansion-panel__body"]').should('be.visible')
                        .find('[formcontrolname="' + filtro + '"]')
                        .type(valore)
                })
                break;
            case "dataInizio":
            case "dataFine":
                cy.log("caso 2")
                ultraIFrame().within(() => {
                    cy.get('[class^="nx-expansion-panel__body"]').should('be.visible')
                        .find('[formcontrolname="' + filtro + '"]').focus()
                        .type(valore, { force: true }).type('{enter}', { force: true }).invoke('val')
                        .then(text => cy.log(text))
                })

                //se presente chiude il popup del calendario
                /* ultraIFrame().then(($body) => {
                    if ($body.find('.nx-datepicker-header').is(':visible')) {
                        cy.log("is visible: " + $body.find('.nx-datepicker-header').is(':visible'))
                        $body.find('.nx-datepicker-header').find('[name="close"]').click()
                    }
                }) */
                break;
            default:
                cy.log("default")
        }
    }

    /**
     * click sul pulsante Filtra Risultati
     */
    static clickFiltraRisultati() {
        ultraIFrame().within(() => {
            cy.get('[class^="nx-expansion-panel__body"]').should('be.visible')
                .find('span').contains("FILTRA RISULTATI").click()
        })
    }

    /**
     * Ordina la lista preventivi secondo la colonna e l'ordine indicato
     * @param {json} colonna 
     * @param {json} ordine 
     */
    static ordinaRisultati(colonna, ordine) {
        ultraIFrame().within(() => {
            cy.get('ultra-recupera-preventivo-table').should('exist').then(($body) => {
                do {
                    $body.find('[nxsortheadercell="' + colonna + '"]').children('[role="button"]')
                        .trigger('click')

                    cy.log('while: ' + !$body.find('[nxsortheadercell="' + colonna + '"]')
                        .children('[title*="' + ordine + '"]').is(':visible'))
                }
                while (
                    !$body.find('[nxsortheadercell="' + colonna + '"]')
                        .children('[title*="' + ordine + '"]').is(':visible')
                )
            })

        })
    }

    static gestisci(nContratto) {
        ultraIFrame().within(() => {
            cy.get('[class$="ultra-container"]').children().first()
                .should('exist').then(($body) => {
                    cy.log("gestisci")
                    if (
                        !$body.find('ultra-recupera-preventivo-table')
                            .find('div:contains(' + nContratto + ')').is(':visible') /* &&
                        !$body.find('ultra-pagination')
                            .find('[class="pagination-avanti disabled"]').is(':visible') */
                    ) {
                        do {
                            $body.find('ultra-pagination')
                                .find('[class="pagination-avanti disabled"]').trigger('click')
                        }
                        while (
                            !$body.find('ultra-recupera-preventivo-table')
                                .find('div:contains(' + nContratto + ')').is(':visible') &&
                            !$body.find('ultra-pagination')
                                .find('[class="pagination-avanti disabled"]').is(':visible')
                        )
                    }
                })
        })

        /*
         && !$body.find('ultra-pagination')
            .find('[class="pagination-avanti disabled"]').is(':visible')
        */

        ultraIFrame().within(() => {
            cy.get('ultra-recupera-preventivo-table').should('exist')
                .find('div').contains(nContratto).parents('tr').first()
                .find('button').click()
        })
    }
}

export default RecuperoPreventivo