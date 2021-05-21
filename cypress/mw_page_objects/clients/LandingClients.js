/// <reference types="Cypress" />

class LandingClients {

    static inizializzaCensimentoClientePF() {
        cy.contains('Clients').click();
        cy.contains('Nuovo cliente').click();
        cy.get('.nx-formfield__row > .nx-formfield__flexfield > .nx-formfield__input-container > .nx-formfield__input > #nx-input-1').type('AS')
        cy.contains('Cerca').click();
        cy.contains('Aggiungi cliente').click();
    }

    static inizializzaCensimentoClientePG(pi) {
        cy.contains('Clients').click();
        cy.contains('Nuovo cliente').click();
        cy.contains('Persona giuridica').click();
        cy.get('#nx-tab-content-0-1 > div > app-new-client-fiscal-code-box > div > div:nth-child(4) > div > nx-formfield').click().type(pi + "1");
        cy.get('span:contains("Cerca"):last').click();
        cy.contains('Aggiungi cliente').click();
    }
}

export default LandingClients