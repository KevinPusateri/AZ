/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const ultraIFrame0 = () => {
    let iframeZero = cy.get('[id="iFrameResizer0"]')
        .its('0.contentDocument').should('exist');

    return iframeZero.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class ControlliSalvataggio {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Controlli e Salvataggio
     */
    static caricamentoPagina() {
        cy.log('***** CARICAMENTO PAGINA CONTROLLI E SALVATAGGIO *****')
        cy.intercept({
            method: 'GET',
            url: '**/getDatiQuotazione'
        }).as('controlli')

        cy.wait('@controlli', { timeout: 100000 })
    }

    static salvaNPreventivo() {
        ultraIFrame().within(() => {
            cy.get('[class="step last success"]').find('span').contains('preventivo')
                .children('b').invoke('text').then(val => {
                    cy.wrap(val).as('preventivo')
                    cy.log("return " + '@preventivo')
                })
        })
    }

    /**
     * Verifica presenza documento da visualizzare
     * * @param {*} documento (è il documento da verificare) 
     */ 
     static verificaPresenzaDocumento(documento) {
        ultraIFrame().within(() => {
            cy.get('div').contains(documento).should('exist')    
        })
    }

    /**
     * Clicca sul pulsante Stampa
     * Da verificare se ci sono differente a seconda che il cliente abbia dato o meno il consenso all'invio mail
     */
     static stampaDocumentazione() {
        ultraIFrame().within(() => {
            cy.get('div[class="table-column-buttons"]').should('exist')
              .find('button').contains('STAMPA').should('be.visible').click()
            
            cy.get('div').contains('Operazione conclusa.', { timeout: 20000 })
              .should('be.visible')
        })
    }

    /**
     * Clicca sul pulsante "Torna alla home page" oppure "acquista"
     * * @param {*} testoPulsante (è il documento da verificare)
     */
    static clickPulsante(testoPulsante) {
        ultraIFrame().within(() => {
            cy.get('div[class="button-group"]').should('exist')
              .find('button').contains(testoPulsante).should('be.visible').click()
        })
    }

    static clickConferma() {
        ultraIFrame().within(() => {
            cy.get('div[class="dialog"]').should('exist')
              .find('a').contains('Conferma').should('be.visible').click()
        })
    }
}
export default ControlliSalvataggio