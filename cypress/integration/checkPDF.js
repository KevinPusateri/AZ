/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)


describe('Download File and Assert the content', () => {


    it('tests a pdf', () => {
        cy.parsePdf().then(data => {
            cy.log(JSON.stringify(data.body))
            cy.parsePdf().then(datacompare => {
                cy.log(JSON.stringify(datacompare.body))
                expect(JSON.stringify(data.body)).have.to.contain(JSON.stringify(datacompare.body))
            })
        })
    })
});