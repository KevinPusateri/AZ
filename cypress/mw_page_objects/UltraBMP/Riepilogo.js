/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Riepilogo {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Riepilogo
     */
    static caricamentoRiepilogo() {
        cy.intercept({
            method: 'GET',
            url: '**/riepilogo/**'
        }).as('riepilogo')

        cy.wait('@riepilogo', { requestTimeout: 60000 });
    }
    //#endregion caricamenti

    /**
     * Salva la quotazione e attende che compaia il messaggio di quotazione salvata,
     * quindi lo chiude. Se è presente il pulsante "sovascrivi" sovascrive il salvataggio
     */
    static salvaQuotazione(nome = "Quotazione Automatici") {
        ultraIFrame().within(() => {
            cy.get('span').contains('Salva').click() //click su Salva

            cy.get('#salvaForm').should('be.visible').then(($body) => {
                //se è presente il pulsante "sovascrivi" lo clicca
                if ($body.find('[class^=button-sovrascrivi]').is(':visible')) {
                    cy.get('#salvaForm').find('[class^=button-sovrascrivi]').click() //click su Sovascrivi
                }
                //altrimenti clicca su Salva
                else {
                    cy.get('#salvaForm').should('be.visible')
                        .find('input').click()
                        .type(nome) //scrive il nome della quotazione
                    cy.get('#salvaForm').find('div[class^=button-confirm]')
                        .click() //click su Salva Nuovo nel popup
                }
            })

            cy.intercept({
                method: 'GET',
                url: '**/quotazione'
            }).as('quotazione')

            cy.wait('@quotazione', { requestTimeout: 60000 }); //attende l'aggiornamento della quotazione

            cy.get('.quotazione-salvata').should('be.visible') //attende la comparsa del popup di conferma salvataggio
            cy.get('nx-message').find('.close-button').click() //chiude il popup di conferma
        })
    }

    /**
     * Clicca sul pulsante Emetti Polizza
     */
    static EmissionePolizza() {
        ultraIFrame().within(() => {
            cy.get('[id="riepilogoBody"]').should('be.visible') //attende la comparsa del riepilogo
            cy.get('span').contains('Emetti polizza').should('be.visible').click() //emetti polizza
        })
    }
}

export default Riepilogo