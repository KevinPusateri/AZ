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
            cy.window().then(win => {
                cy.stub(win, 'open').callsFake((url) => {
                    return win.open.wrappedMethod.call(win, url, '_self');
                }).as('Open');
            })


            cy.get('.tipo').find('.inserisci').children('button')
                .click() //click su Inserisci
        })

        cy.get('@Open')
        cy.get('#f-cognome').should('be.visible')
        cy.pause()

        cy.go('back')




        cy.pause()

        /* ultraIFrame().within(() => {
            // Get window object
            cy.window().then((win) => {
                // Replace window.open(url, target)-function with our own arrow function
                cy.stub(win, 'open').callsFake((url) => {
                    // change window location to be same as the popup url
                    win.location.href = "https://portaleagenzie.pp.azi.allianz.it/daanagrafe/SCU/Search/";
                }).as("popup") // alias it with popup, so we can wait refer it with @popup
            })

            // Click button which triggers javascript's window.open() call
            cy.get('.tipo').find('.inserisci').children('button')
                .click() //click su Inserisci
        })

        // Make sure that it triggered window.open function call
        cy.get("@popup") */

        // Now we can continue integration testing for the new "popup tab" inside the same tab

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