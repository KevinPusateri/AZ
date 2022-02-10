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
     * Inserisce la data di decorrenza o scadenza tramite code injection
     * tipoData: 'decorrenza' o 'scadenza'
     * @param {string} tipoData 
     * @param {string} data 
     */
    static ModificaDataInjection(tipoData, data) {
        ultraIFrame().within(() => {
            var txtBox
            switch (tipoData) {
                case "decorrenza":
                    txtBox = "#txtDataDecorrenza"
                    break;
                case "scadenza":
                    txtBox = "#txtDataScadenza"
                    break;
                default:
                    cy.log("usare il tipoData: 'decorrenza' o 'scadenza'")
            }

            cy.get(txtBox)
                .invoke('attr', 'value', data)
                .should('have.attr', 'value', data)
        })
    }

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