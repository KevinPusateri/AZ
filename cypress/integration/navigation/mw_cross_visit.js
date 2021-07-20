
/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />


//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


describe('Matrix Web : Aggancio Cross Visit', function () {
    it('Numbers - Verifica aggancio Allianz Global Assistance', function () {
        cy.visit('https://oazis.allianz-assistance.it/dynamic/home/index')
        cy.get('#oaz-login-btn').should('be.visible').and('contain.text','Accedi')
    });

    it('Clients - Verifica aggancio Analisi dei Bisogni', function () {
        cy.visit('https://www.ageallianz.it/analisideibisogni/app')
        cy.get('button').find('span').should('be.visible').and('contain.text','Accedi')
    });

})

