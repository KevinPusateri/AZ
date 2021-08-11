/// <reference types="Cypress" />




class SCUSalesNoteContratto {

    /**
     * Verifica se sono presenti le note della polizza
     * @param {object} polizza - polizza = { numberPolizza, lob } 
     */
    static searchPolizza(polizza) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            debugger
            cy.get('#f-numero-contratto').type(polizza.numberPolizza)
            cy.get('span[aria-owns="f-portafoglio_listbox"]').click()
            cy.get('#f-portafoglio-list').should('be.visible')
            if (polizza.lob === 'Auto')
                cy.get('#f-portafoglio-list').find('li:contains("Auto")').click()
            if (polizza.lob === 'Rami Vari')
                cy.get('#f-portafoglio-list').find('li:contains("RamiVari")').click()
            if (polizza.lob === 'Vita')
                cy.get('#f-portafoglio-list').find('li:contains("Vita")').click()
            if (polizza.lob === 'Quadro')
                cy.get('#f-portafoglio-list').find('li:contains("Quadro")').click()

            cy.get('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
            cy.get('input[value="Cerca"]').click().wait(3500)
            cy.get('tbody[role="rowgroup"] > tr').should('not.contain.text', 'Nessun record da visualizzare.')
            // cy.get('@iframe').within(() => {
                cy.get('td[role="gridcell"]').should('include.text', 'TEST DESCRIZIONE NOTA MODIFICATA')
                    .and('include.text', 'TEST AGGIUNTO NOTA DA BADGE')
                    .and('include.text', 'TEST AGGIUNTO NOTA IMPORTANTE')
            // })
        })


    }

    static modificaNota() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('table[role="grid"]').should('be.visible')
            cy.get('table[role="grid"]').find('tbody > tr').first().within(() => {
                cy.get('a').click()
                cy.get('ul').should('be.visible')
                cy.get('ul').find('li:contains("Modifica nota")').click()
            })

            cy.get('#window-editNota').should('exist').and('be.visible')
            cy.get('form[class="editNota"]').should('be.visible').within(() => {
                cy.get('#descrizione-nota').clear().type('TEST DESCRIZIONE MODIFICATO DA SALES')
                cy.get('[class="cols cols-button"]').find('button:contains("Conferma")').click()
            })

            cy.get('#window-editNota').should('not.be.visible')
            cy.get('td[role="gridcell"]').should('exist').and('be.visible')
                .and('contain.text', 'TEST DESCRIZIONE MODIFICATO DA SALES')

        })
    }

}
export default SCUSalesNoteContratto