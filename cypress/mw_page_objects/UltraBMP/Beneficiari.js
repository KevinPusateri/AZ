/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}


const ultraIFrameAnagrafica = () => {
    let iframeAnag = cy.get('#divPopupAnagrafica').find('#divPopUpACAnagrafica')
        .its('0.contentDocument').should('exist')

    return iframeAnag.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Beneficiari {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Censimento Anagrafico
     */
    static caricamentoBeneficiari() {
        cy.intercept({
            method: 'GET',
            url: '**/beneficiari/assicurati'
        }).as('beneficiari')

        cy.wait('@beneficiari', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    /**
     * Seleziona il tipo di beneficiario
     * @param {string} tipoBeneficiario 
     */
    static tipoBeneficiario(tipoBeneficiario) {
        ultraIFrame().within(() => {
            cy.get('[nxlabel="Tipo beneficiario"]')
                .find('nx-dropdown').should('be.visible')
                .click() //apre menù Tipo Beneficiario

            cy.get('nx-dropdown-item').find('span')
                .contains(tipoBeneficiario).click() //seleziona il beneficiario

            cy.wait(500)

            cy.get('[nxlabel="Tipo beneficiario"]')
                .find('nx-dropdown').find('span').contains(tipoBeneficiario)
                .should('be.visible') //verifica che il beneficiario sia stato selezionato
        })
    }

    static inserisciBeneficiario() {
        ultraIFrame().within(() => {
            cy.get('.tipo').find('.inserisci').children('button').click()
        })

        // cy.intercept('ultra/api/beneficiari/cerca?idAmbitoAssicurato=P_1_3&ruolo=beneficiario&tipoRischio=persona')
        //     .as('anagrafe')
        // cy.wait('@anagrafe').then((interception) => {
        //     cy.log(interception.request.url.body)
        //     cy.openWindow(interception.request.url)
        // })
        // cy.request('ultra/api/beneficiari/cerca?idAmbitoAssicurato=P_1_3&ruolo=beneficiario&tipoRischio=persona')
        //     .then((resp) => {
        //         //cy.log(resp.url.body)
        //         cy.openWindow(resp.url)
        //     })

        //cy.switchWindow()
        cy.window().then((win) => {
            cy.spy(win, 'open').as('windowOpen'); // 'spy' vs 'stub' lets the new tab still open if you are visually watching it
          });
          // perform action here [for me it was a button being clicked that eventually ended in a window.open]
          // verify the window opened
          // verify the first parameter is a string (this is the dynamic url) and the second is _blank (opens a new window)
          cy.get('@windowOpen').should('be.calledWith', Cypress.sinon.match.string, '_blank');

        cy.get('#f-cognome')
    }

    /**
     * Clicca sul pulsante Avanti
     */
    static Avanti() {
        ultraIFrame().within(() => {
            cy.get('button').contains('Avanti')
                .should('be.visible').click()
        })
    }
}

export default Beneficiari