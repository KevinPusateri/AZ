/// <reference types="Cypress" />

class LandingRicerca {

    /**
    * @param {string} tipoCliente - Tipo Cliente a scelta tra "PF" o "PG"
    * @param {string} statoCliente - Stato Cliente a scelta tra "E", "P" o "C"
    */
    static searchRandomClient(tipoCliente, statoCliente) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.get('input[name="main-search-input"]').click()
        cy.generateTwoLetters().then(randomChars => {
            cy.get('input[name="main-search-input"]').type(randomChars).type('{enter}')
        })
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 });
        cy.url().should('include', '/search/clients/clients')

        //Filtriamo la ricerca in base a tipoCliente
        cy.get('.icon').find('[name="filter"]').click()
        if (tipoCliente === "PF")
            cy.get('.filter-group').contains('Persona giuridica').click()
        else
            cy.get('.filter-group').contains('Persona fisica').click()

        //Filtriamo la ricerca in base a statoCliente
        switch (statoCliente) {
            case "E":
                cy.get('.filter-group').contains('Potenziale').click()
                cy.get('.filter-group').contains('Cessato').click()
                break
            case "P":
                cy.get('.filter-group').contains('Effettivo').click()
                cy.get('.filter-group').contains('Cessato').click()
                break
            case "C":
                cy.get('.filter-group').contains('Potenziale').click()
                cy.get('.filter-group').contains('Effettivo').click()
                break
        }

        cy.get('.footer').find('button').contains('applica').click()
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 });

        cy.get('lib-applied-filters-item').find('span').should('be.visible')
    }

    static clickFirstResult() {
        cy.get('lib-client-item').first().click();
    }
}

export default LandingRicerca