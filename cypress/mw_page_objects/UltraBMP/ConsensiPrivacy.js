/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class ConsensiPrivacy {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Consensi e Privacy
     */
    static caricamentoPagina() {
        cy.log('***** CARICAMENTO PAGINA CONSENSI E PRIVACY *****')
        cy.intercept({
            method: 'GET',
            url: '**/consensi/getStatiDocumentiPersonali'
        }).as('documenti')

        cy.wait('@documenti', { requestTimeout: 60000 })
    }

    /**
     * Click su Avanti
     */
    static Avanti() {
        ultraIFrame().within(() => {
            cy.get('a').contains('Avanti')
            .should('be.visible').click()   //avanti
        })
    }

    /**
     * Verifica l'esistenza della sezione
     * * @param {*} sezione
     */
    static verificaSezione(sezione) {
        ultraIFrame().within(() => {
            cy.get('div[class="section-title"]').contains(sezione).should('have.length', 1)
        })
    }

    /**
     * Visualizza documento
     * * @param {*} documento (è il documento da visualizzare) 
     */
    static visualizzaDocumento(documento) {
        ultraIFrame().within(() => {
            //Se impostato su "tutti" visualizza tutti i documenti presenti
            if (documento == "tutti") {
                cy.get('div[class="table-documenti"]')
                    .find('button').each(($button, index, $list) => {
                        cy.wrap($button).click() //click su Visualizza
                        cy.get('div[class^="dialog-documento"]').should("exist")
                            .find('button').contains('Conferma')
                            .should('be.visible').click() //conferma popup
                    });
            }
            else {
                //ultraIFrame0().within(() => {
                cy.get('div').contains(documento).should('exist')
                    .parent('div[class="documento"]').should('exist')
                    .find('button').contains('VISUALIZZA').should('be.visible').click()

                cy.get('div[class="dialog"]').should("exist")
                    .find('button').contains('Conferma').should('have.length', 1).click()
            }
        })
    }

    /**
     * Verifica presenza popup invio mail documentazione 
     */ 
     static VerificaInvioMail() {
        cy.wait(10000)
        //cy.pause()
        ultraIFrame().within(() => {
            cy.get('div[class="dialog-small dialog-content"]').should('exist')
              .find('main').contains("La documentazione è stata inviata con successo all’indirizzo:").should('exist')
              .parent('div').should('have.class','dialog-small dialog-content')
              .find('a').contains('OK').should('be.visible').click()
        })
    }
}

export default ConsensiPrivacy