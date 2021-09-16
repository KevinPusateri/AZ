/// <reference types="Cypress" />
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
require('cypress-plugin-tab')

class PreventivoMotor {

    static compilaDatiQuotazione(targa, dataNascita) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').click();
            cy.wait(500)
            cy.get('input[aria-label="Targa"]').type(targa);
            cy.wait(500)

            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click()
            cy.wait(500)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(dataNascita)
            cy.wait(1000)

            cy.get('label[id="nx-checkbox-informativa-label"]>span').eq(0).click({ force: true })
            cy.wait(500)

            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })

            cy.get('input[aria-label="Indirizzo"]').should('exist').and('be.visible').click()
            cy.wait(500)
            cy.get('input[aria-label="Indirizzo"]').type('vittorio veneto');
            cy.wait(500);

            cy.get('input[aria-label="NumeroCivico"]').should('exist').and('be.visible').click()
            cy.wait(500)
            cy.get('input[aria-label="NumeroCivico"]').type('52')
            cy.wait(500);

            cy.get('input[aria-label="Comune"]').should('exist').and('be.visible').click()
            cy.wait(500)
            cy.get('input[aria-label="Comune"]').type('Savona')
            cy.wait(1000);

            cy.contains('Calcola').click({ force: true })
            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })

            cy.contains('OK').should('be.visible')
            cy.contains('OK').click({ force: true })
        })

    }

}

export default PreventivoMotor