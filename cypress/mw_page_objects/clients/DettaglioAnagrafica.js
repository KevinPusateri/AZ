/// <reference types="Cypress" />

class DettaglioAnagrafica {

    static verificaDatiDettaglioAnagrafica(cliente) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        });

        cy.contains('DETTAGLIO ANAGRAFICA').click()

        cy.wait('@gqlClient', { requestTimeout: 30000 });

        if (cliente.isPEC)
            cy.contains('Invio documento via PEC')
                .parent('div')
                .get('nx-icon').should('have.class', 'nx-icon--s nx-icon--check-circle color-true')
    }

    static modificaCliente() {
        cy.contains('DETTAGLIO ANAGRAFICA').click()
        cy.contains('Modifica dati cliente').click()
    }
}

export default DettaglioAnagrafica