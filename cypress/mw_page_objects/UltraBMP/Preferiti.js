/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const matrixIframe = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Preferiti {
    //#region caricamenti
    /**
     * Attende il caricamento della sezione preferiti su dashboard
     */
    static caricamentoPreferitiUltra() {
        cy.intercept({
            method: 'GET',
            url: '**/preferiti/disponibili'
        }).as('Preferiti')

        cy.wait('@Preferiti', { requestTimeout: 60000 });
    }
    //#endregion caricamenti

    /**
     * Seleziona il preferto passato come parametro
     * @param {string} tab >Allianz/Di agenzia/Personali
     * @param {string} nome > nome del preferito da selzionare
     */
    static SelezionaPreferiti(tab = "Allianz", nome) {
        cy.log("preferiti?")
        matrixIframe().within(() => {
            switch (tab) {
                case "Personali":
                    cy.get('#tab_personali').click()
                    break;
                case "Di Agenzia":
                    cy.get('#tab_agenzia').click()
                    break;
                default:
                    cy.log("nessuna tab selezionata")
            }

            cy.get('[class^=description]').contains(nome).click()

            //attende il caricamento del preferito
            cy.intercept({
                method: 'GET',
                url: '**/premio'
            }).as('premio')

            cy.wait('@premio', { requestTimeout: 60000 });
        })
    }

    static AggiungiAmbitiPreferiti(ambiti) {
        matrixIframe().within(() => {
            cy.get('span').contains("Aggiungi ambito").click()
        })
        cy.wait(500)
    }

    static selezionaAmbiti(ambiti) {
        matrixIframe().within(() => {
            //scorre l'array degli ambiti da selezionare e clicca sulle icone
            for (var i = 0; i < ambiti.length; i++) {
                cy.log("selezione ambito " + ambiti[1])

                //seleziona ambito
                cy.get('#aggiungiNuovoAmbitoModal', { timeout: 5000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
                    .should('be.visible').click()

                cy.wait(500)

                //verifica che sia selezionato
                cy.get('#aggiungiNuovoAmbitoModal').find('nx-icon[class*="' + ambiti[i] + '"]')
                    .next('nx-indicator')
                    .should('be.visible')
            }

            cy.get('button')
                .children('span')
                .contains('Continua').click()

            cy.get('#warningConfermaModal')
                .find('button').click()

            for (var i = 0; i < ambiti.length; i++) {
                cy.get('#IstanzePreferiti')
                    .find('nx-icon[class*="' + ambiti[i] + '"]')
                    .should('be.visible')
            }
        })
    }

    /**
     * Apre la sezione dettagli degli ambiti, se non è già aperta
     */
    static ApriDettagli() {
        matrixIframe().within(() => {
            //verifica se la sezione dettagli è già aperta
            cy.get('[class^=istanza-col]').then(($body) => {
                // synchronously query from body
                cy.log("dettagli: " + $body.find('[class^=istanza-solution-controls]').is(':visible'))
                // to find which element was created
                if (!$body.find('[class^=istanza-solution-controls]').is(':visible')) {
                    cy.get('span').contains('Dettaglio').click()
                }
                else {
                    cy.log('Sezione Dettagli già aperta')
                }
            })
        })
    }

    /**
     * Modifica il massimale per garanzia indicata
     * @param {string} garanzia
     * @param {string} massimale
     */
    static ModificaMassimaleDettagli(garanzia, massimale) {
        //apre il menù a tendina per la scelta del massimale della garanzia indicata
        matrixIframe().within(() => {
            cy.get('span').contains(garanzia)
                .parents('[class^=soluz-garanzie]')
                .within(() => {
                    cy.get('nx-dropdown').click()
                })
        })

        matrixIframe().within(() => {
            cy.get('nx-dropdown-item[aria-disabled=false]').contains(massimale).click() //clicca sul valore del massimale
            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    /**
     * Attiva la garanzia indicata
     * @param {string} garanzia 
     */
    static AggiungiGaranziaDettagli(garanzia) {
        matrixIframe().within(() => {
            cy.get('.label').contains(garanzia)
                .parents('[class=title-switch]')
                .within(() => {
                    cy.get('nx-switcher').click()
                })
            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }
}
export default Preferiti