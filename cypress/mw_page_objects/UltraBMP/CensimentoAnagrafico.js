/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class CensimentoAnagrafico {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Censimento Anagrafico
     */
     static caricamentoCensimentoAnagrafico() {
        cy.intercept({
            method: 'GET',
            url: '**/tmpl_anag_persona_riepilogo.htm'
        }).as('anagrafica')

        cy.wait('@anagrafica', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    /**
     * Completa la sezione Casa della pagina Censimento Anagrafico
     * @param {*} cliente 
     * @param {*} ubicazione 
     */
    static censimentoAnagrafico(cliente, ubicazione) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('div').contains('Casa').should('be.visible').click() //tab Casa

            cy.get('span')
                .contains('Ubicazione')
                .parent()
                .parent()
                .find('select').select(ubicazione)

            cy.get('span')
                .contains('Assicurato associato')
                .parent()
                .parent()
                .find('select').select(cliente)
        })
    }

    static aggiungiClienteCensimentoAnagrafico(cliente) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('div').contains('Persona').should('be.visible').click() //tab Persona

            cy.get('input[value="CERCA"]').should('be.visible').click() //cerca cliente

            cy.get('#divPopupAnagrafica', { timeout: 30000 }).should('be.visible') //attende la comparsa popup di ricerca anagrafiche
            cy.wait(5000)
            //cy.pause()

            //popup anagrafico
            ultraIFrameAnagrafica().within(() => {
                cy.get('#f-cognome').should('be.visible').type(cliente.cognome)
                cy.get('#f-nome').should('be.visible').type(cliente.nome)

                cy.get('#cerca-pers-forinsert').should('be.visible').click() //avvia ricerca
                cy.wait(1000)
                cy.get('span').contains(cliente.cognomeNome()).click()
                cy.wait(2000)
            })

            //popup attenzione CAP
            cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                .should('be.visible')
                .find('button').contains('AGGIORNA')
                .click()

            //cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento  nx-spinner__spin-block
        })
    }
}

export default CensimentoAnagrafico