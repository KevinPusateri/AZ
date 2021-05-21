/// <reference types="Cypress" />

class TopBar {

    static logOutMW() {

        const delayBetweenTests = 2000

        cy.get('body').then($body => {
            if ($body.find('.user-icon-container').length > 0) {
                cy.get('.user-icon-container').click();
                cy.wait(1000).contains('Logout').click()
                cy.wait(delayBetweenTests)
            }
        });
        cy.clearCookies();
    }

    /**
    * @param {string} tipoCliente - Tipo Cliente a scelta tra "PF" o "PG"
    * @param {string} nome - Nome proprio della PF o Nome della PG
    * @param {string} cognome - Opzionale, solo nel caso di PF
    */
    static searchClient(tipoCliente, nome, cognome) {
        switch (tipoCliente) {
            case "PF":
                cy.get('input[name="main-search-input"]').type(cognome + " " + nome).type('{enter}');
                break;
            case "PG":
                cy.get('input[name="main-search-input"]').type(nome).type('{enter}');
        }
    }

    static clickBackOffice() {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', Cypress.env('baseUrl') + 'back-office')
    }
}

export default TopBar