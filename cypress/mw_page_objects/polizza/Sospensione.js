/// <reference types="Cypress" />


class Sospensione {

    static sospendiPolizza() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            // Inserimento data odierna
            cy.get('[class="tableCellGray"]').should('be.visible').and('contain.text', 'Data sospensione')
            let options = {
                day: 'numeric',
            };
            let formattedDate = new Date().toLocaleString('it-IT', options);
            cy.get('#txtDataAnnullamento').clear()
            cy.get('[class="ui-datepicker-trigger"]').first().click()
            cy.get('#ui-datepicker-div').should('be.visible')
            cy.get('table[class="ui-datepicker-calendar"]').find('a').contains(formattedDate).click()

            // Click Calcola
            cy.get('#btnCalcola').click()

            // Click Annulla Contratto
            cy.get('#btnAnnullaContratto').click()

        })

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('div[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('be.visible').within(() => {
                cy.get('span[class="ui-button-text"]').contains('Conferma').click()
            })

            cy.get('div[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('not.be.visible')


            cy.get('div[class="messaggioAnnullamenti"]').should('be.visible')
                .and('contain.text', 'Sospensione eseguito correttamente.')

            cy.get('input[title="Home"]').should('be.visible').click()

            cy.wait(10000)

        })
    }

}
export default Sospensione