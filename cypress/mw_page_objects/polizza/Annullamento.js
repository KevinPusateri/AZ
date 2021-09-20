/// <reference types="Cypress" />


class Annullamento {

    static annullaContratto() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            // Inserimento data odierna
            cy.get('[class="tableCellGray"]').should('be.visible').and('contain.text', 'Data annullamento')
            let options = {
                day: 'numeric',
            };
            let formattedDate = new Date().toLocaleString('it-IT', options);
            cy.get('#txtDataAnnullamento').clear()
            cy.get('[class="ui-datepicker-trigger"]').first().click()
            cy.get('#ui-datepicker-div').should('be.visible')
            cy.get('table[class="ui-datepicker-calendar"]').find('a').contains(formattedDate).click()

            // Inserimento "Scelta Firma Cliete" Autografa
            cy.get('#dataAnnullamento').then(($firma) => {
                const isOnlyAutografa = $firma.find('#dropTipoFirma > option')
                if (isOnlyAutografa.length > 1)
                    cy.get('#dropTipoFirma').select('Autografa')
            })

            // Click Annulla Contratto
            cy.get('#btnAnnullaContratto').click()

            // Click checkBox Atto di vendita
            cy.get('#tableDocumenti').should('be.visible')
            cy.get('#tableDocumenti').find('input').check('3')
        })

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('div[aria-labelledby="ui-dialog-title-4"]').should('be.visible').within(() => {
                cy.get('button').contains('Ok').click()

            })
            cy.get('div[aria-labelledby="ui-dialog-title-4"]').should('not.be.visible')


            cy.get('div[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('be.visible').within(() => {
                cy.get('span[class="ui-button-text"]').contains('Conferma').click()
            })

            cy.get('div[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('not.be.visible')


            cy.get('div[class="messaggioAnnullamenti"]').should('be.visible')
                .and('contain.text', 'Annullamento eseguito correttamente.')

            cy.get('input[title="Home"]').should('be.visible').click()

            cy.wait(10000)

        })
    }

}
export default Annullamento