/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)


describe('Download File and Assert the content', () => {


    it('tests a pdf', () => {
        cy.parsePdf().then(data => {
            cy.log(JSON.stringify(data))
        })
    })
});