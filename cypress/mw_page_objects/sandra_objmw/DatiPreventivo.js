/// <reference types="Cypress" />
//require('cypress-plugin-tab')

import Common from "../common/Common";
//import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
//import SintesiCliente from "../clients/SintesiCliente";
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}


class DatiPreventivo {

    static ClickCheckTarga() {
        cy.wait(10000)
         getIFrame().find('nx-checkbox[id="informativa"]').should('exist').and('be.visible').within(() => {
            cy.get('span[class="nx-checkbox__control"]').click()
        })
        getIFrame().find('button').contains('Non conosci la targa?').click()

    }
    static verificaUnico() {
       // cy.contains('Unico').click()
        //TODO" 1 Aggiornamento unico"
        cy.wait(10000)
        cy.get('span[class="nx-checkbox__control"]').click()
        cy.wait(10000)
        getIFrame().find('nx-checkbox[id="informativa"]').click()
    }
    static clickAvanti() {
        cy.wait(10000)
        getIFrame().find('button').contains('AVANTI').click()

    }



    //#region Links Card Auto
    static clickPreventivoMotor() {
        cy.wait(3000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Preventivo Motor').click()
        cy.intercept({
            method: 'POST',
            url: '**/assuntivomotor/**'
        }).as('getMotor');
        Common.canaleFromPopup()
        cy.wait('@getMotor', { requestTimeout: 50000 });
        getIFrame().find('button:contains("Calcola"):visible')


    }

    static clickPassioneBlu() {
        cy.wait(30000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza').click()
        Common.canaleFromPopup()
        //  getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        //  getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.wait(3000)

    }

    static clickAuto() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Auto")').is(':visible')
            if (check)
                cy.get('.card-container').find('app-kpi-dropdown-card').contains('Auto').click()
            else
                assert.fail('Card Auto non è presente')


        })

    }


    static clickNuovaPolizza() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza').click()
        Common.canaleFromPopup()
        // getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        //  getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    //#endregion 

}

export default DatiPreventivo