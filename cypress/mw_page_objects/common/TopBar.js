/// <reference types="Cypress" />

import Common from '../common/Common'

const interceptPageSales = () => {
    cy.intercept({
        method: 'POST',
        url: '**/sales/**',
    }).as('getSales');
}

const interceptPageMieInfo = () => {
    cy.intercept({
        method: 'POST',
        url: '**/lemieinfo/**',
    }).as('getMieInfo');
}

const interceptPageClients = () =>{
    cy.intercept({
        method: 'POST',
        url: '**/clients/**' ,
      }).as('getClients');
    
}


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
    static searchClientByName(tipoCliente, nome, cognome) {
        switch (tipoCliente) {
            case "PF":
                cy.get('input[name="main-search-input"]').type(cognome + " " + nome).type('{enter}');
                break;
            case "PG":
                cy.get('input[name="main-search-input"]').type(nome).type('{enter}');
        }
    }

    /**
    * @param {string} cfOrPi - Inserire Codice Fiscale o Partita Iva
    */
    static searchClientByCForPI(cfOrPi) {

        cy.get('input[name="main-search-input"]').type(cfOrPi).type('{enter}');
    }

    static clickClients() {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.url().should('eq', Common.getBaseUrl() + 'clients/')
    }

    static clickBackOffice() {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', Common.getBaseUrl() + 'back-office')
    }

    static clickNumbers() {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', Common.getBaseUrl() + 'numbers/business-lines')
    }

    static clickSales() {
        interceptPageSales()
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.wait('@getSales', { requestTimeout: 50000 })
        cy.url().should('eq', Common.getBaseUrl() + 'sales/')
    }

    static clickMieInfo() {
        interceptPageMieInfo()
        cy.get('app-product-button-list').find('a').contains('Le mie info').click()
        cy.wait('@getMieInfo', { requestTimeout: 50000 })
        cy.url().should('eq', Common.getBaseUrl() + 'lemieinfo?info=1')
    }
}

export default TopBar