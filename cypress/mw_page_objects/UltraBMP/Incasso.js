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

class Incasso {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Incasso iniziale
     */
    static caricamentoPagina() {
        cy.intercept({
            method: 'POST',
            url: '**/InitMezziPagam'
        }).as('pagamento')

        cy.wait('@pagamento', { timeout: 60000 })
    }

    /**
     * Attende il caricamento della pagina di Incasso con la scelta del metodo di pagamento
     */
    static caricamentoModPagamento() {
        cy.intercept({
            method: 'GET',
            url: '**/GetListaCassettiIncassoCompleto'
        }).as('pagamento')

        cy.wait('@pagamento', { timeout: 60000 })
    }

    /**
     * Attende il completamento dell'incasso
     */
    static caricamentoEsito() {
        cy.intercept({
            method: 'POST',
            url: '**/GetPostIncassoData'
        }).as('postIncasso')

        cy.wait('@postIncasso', { requestTimeout: 60000 })
    }

    /**
     * clicca sul pulsante Incassa
     */
    static ClickIncassa() {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('input[value="> Incassa"]')
                .should('be.visible').click()
            })
        })
    }

    /**
     * Seleziona il metodo di pagamento
     * @param {string} metodo 
     */
    static SelezionaMetodoPagamento(metodo) {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('[aria-owns="TabIncassoModPagCombo_listbox"]')
                    .should('be.visible').click()

                cy.wait(500)
                cy.get('#TabIncassoModPagCombo_listbox')
                    .find('li').contains(metodo)
                    .should('be.visible').click()
            })
        })
    }

    /**
     *Clicca su Incassa nella sezione finale dell'incasso
     */
    static ConfermaIncasso() {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('button').contains('Incassa')
                    .should('be.visible').click()
            })
        })
    }

    /**
     * Verifica che l'incasso sia andato a buon fine
     */
    static EsitoIncasso() {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                //scorre la lista dei risultati e controlla che abbiano tutti la spunta verde
                cy.get('[data-bind="foreach: Result.Steps"]')
                    .find('img').each(($img, index, $list) => {
                        cy.wrap($img).should('have.attr', 'src').and('contain', 'confirm_green')
                    });
            })
        })
    }

    /**
     * Clicca sul pulsante Chiudi al termine dell'incasso
     */
    static Chiudi() {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('[value="> CHIUDI"]')
                    .should('be.visible').click()
            })
        })
    }
}
export default Incasso