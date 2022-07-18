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
        cy.log('***** CARICAMENTO PAGINA INCASSO *****')
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
        cy.log('***** CARICAMENTO MODALITA PAGAMENTO *****')
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

        cy.wait('@postIncasso', { timeout: 60000 })
    }

    /**
     * clicca sul pulsante Incassa
     */
    static ClickIncassa() {
        var checkFrame0 = false

        ultraIFrame().then(($body) => {
            checkFrame0 = $body.find('#iFrameResizer0').is(':visible') //verifica la presenza dell'iframe0 annidato
            cy.log('checkFrame0: ' + checkFrame0)
        }).within(() => {
            if (checkFrame0) {
                ultraIFrame0().within(() => {
                    cy.get('input[value*="Incassa"]')
                        .should('be.visible').click()
                })
            }
            else {
                cy.get('input[value*="Incassa"]')
                    .should('be.visible').click()
            }
        })
    }

    /**
     * Seleziona il metodo di pagamento
     * todo: modificare con riconoscimento automatico iframe0 (v. CheckIncassa)
     * @param {string} metodo 
     */
    static SelezionaMetodoPagamento(metodo, fl_frame0 = true) {
        ultraIFrame().within(() => {
            cy.log('*****   Seleziona Metodo di Pagamento *****')
            cy.log('fl_frame0: ' + fl_frame0)
            if (fl_frame0)
                ultraIFrame0().within(() => {
                    cy.get('[aria-owns="TabIncassoModPagCombo_listbox"]')
                        .should('be.visible').click()

                    cy.wait(500)
                    cy.get('#TabIncassoModPagCombo_listbox')
                        .find('li').contains(metodo)
                        .should('be.visible').click()
                })
            else {
                cy.get('[aria-owns="TabIncassoModPagCombo_listbox"]')
                    .should('be.visible').click()

                cy.wait(500)
                cy.get('#TabIncassoModPagCombo_listbox')
                    .find('li').contains(metodo)
                    .should('be.visible').click()
            }
        })
    }

    /**
     * Seleziona tipo delega
     * @param {string} delega 
     */
    static SelezionaTipoDelega(delega) {
        var checkFrame0 = false

        ultraIFrame().then(($body) => {
            checkFrame0 = $body.find('#iFrameResizer0').is(':visible') //verifica la presenza dell'iframe0 annidato
            cy.log('checkFrame0: ' + checkFrame0)
        }).within(() => {
            if (checkFrame0) {
                ultraIFrame0().within(() => {
                    cy.get('[aria-owns="TabTipologiaDelegaComboSDD_listbox"]')
                        .should('be.visible').click()

                    cy.wait(500)
                    cy.get('#TabTipologiaDelegaComboSDD_listbox')
                        .find('li').contains(delega)
                        .should('be.visible').click()
                })
            }
            else {
                cy.get('[aria-owns="TabTipologiaDelegaComboSDD_listbox"]')
                    .should('be.visible').click()

                cy.wait(500)
                cy.get('#TabTipologiaDelegaComboSDD_listbox')
                    .find('li').contains(delega)
                    .should('be.visible').click()
            }
        })


        /* ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('[aria-owns="TabTipologiaDelegaComboSDD_listbox"]')
                    .should('be.visible').click()

                cy.wait(500)
                cy.get('#TabTipologiaDelegaComboSDD_listbox')
                    .find('li').contains(delega)
                    .should('be.visible').click()
            })
        }) */
    }


    /**
     * Clicca su Incassa nella sezione finale dell'incasso
     * todo: modificare con riconoscimento automatico iframe0 (v. CheckIncassa)
     */
    static ConfermaIncasso(fl_frame0 = true) {
        ultraIFrame().within(() => {
            if (fl_frame0)
                ultraIFrame0().within(() => {
                    cy.get('button').contains('Incassa')
                        .should('be.visible').click()
                })
            else {
                cy.get('button').contains('Incassa')
                    .should('be.visible').click()
            }
        })
    }

    /**
     * Verifica che l'incasso sia andato a buon fine
     * todo: modificare con riconoscimento automatico iframe0 (v. CheckIncassa)
     */
    static EsitoIncasso(fl_frame0 = true) {
        ultraIFrame().within(() => {
            if (fl_frame0)
                ultraIFrame0().within(() => {
                    //scorre la lista dei risultati e controlla che abbiano tutti la spunta verde
                    //cy.get('[data-bind="foreach: Result.Steps"]')
                    cy.get('.table-steps')
                        .find('img').each(($img, index, $list) => {
                            cy.wrap($img).should('have.attr', 'src').and('contain', 'Shape')
                        });
                })
            else {
                //cy.get('[data-bind="foreach: Result.Steps"]')
                cy.get('.table-steps')
                    .find('img').each(($img, index, $list) => {
                        cy.wrap($img).should('have.attr', 'src').and('contain', 'Shape')
                    });
            }
        })
    }

    /**
     * Clicca sul pulsante Chiudi al termine dell'incasso
     */
    static Chiudi(fl_frame0 = true) {
        ultraIFrame().within(() => {
            if (fl_frame0)
                ultraIFrame0().within(() => {
                    cy.get('[value="CHIUDI"]')
                        .should('be.visible').click()
                })
            else {
                cy.get('[value="CHIUDI"]')
                    .should('be.visible').click()
            }
        })
    }
}
export default Incasso