/// <reference types="Cypress" />

//#region Intercept
const schedaAgenzia = {
    method: 'GET',
    url: '**/SchedaAgenzia.aspx'
}

const scriptResource = {
    method: 'GET',
    url: '**/ScriptResource.axd**'
}

const utenzeVisibilita = {
    method: 'GET',
    url: '**/UtenzeVisibilita.aspx'
}
//#endregion

//#region iFrame
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

//#region Enum
/**
 * Enum Voci Menu
 * TODO terminare con le altre voci
 * @readonly
 * @enum {Object}
 * @private
 */
const VociMenu = {
    GEST_ACCOUNTS: 'Gest.Accounts'
}
//#endregion

/**
 * @class
 * @classdesc Classe per interagire con l'applicativo Struttura di Agenzia
 * @author Andrea 'Bobo' Oboe
 */
class StrutturaAgenzia {
    /**
     * Funzione che ritorna le Voci di Menu
     * @returns {VociMenu} Voci di Menu
     */
    static get VOCIMENU() {
        return VociMenu
    }

    /**
     * Verifica accesso a Inquiry di Agenzia
     */
    static verificaAccessoDBFonti() {
        cy.intercept(schedaAgenzia).as('schedaAgenzia')
        cy.intercept(scriptResource).as('scriptResource')

        cy.wait('@schedaAgenzia', { timeout: 60000 })
        cy.wait('@scriptResource', { timeout: 60000 })
    }

    static clickVoceMenu(voceMenu){
        cy.intercept(scriptResource).as('scriptResource')
        cy.intercept(utenzeVisibilita).as('utenzeVisibilita')

        getIFrame().within(() => {
            cy.contains(voceMenu).should('exist').and('be.visible').click()

            switch (voceMenu) {
                case VociMenu.GEST_ACCOUNTS:
                    cy.wait('@scriptResource', { timeout: 60000 })
                    cy.wait('@utenzeVisibilita', { timeout: 60000 })
                    break
            }
        })
    }
}

export default StrutturaAgenzia