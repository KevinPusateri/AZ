/// <reference types="Cypress" />



class SCUSalesNoteContratto {

    static searchPolizza(polizza) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            debugger
            cy.get('#f-numero-contratto').type(polizza.numberPolizza)
            cy.get('span[aria-owns="f-portafoglio_listbox"]').click()
            if (polizza.lob === 'Auto')
                cy.get('f-portafoglio_listbox').find(':contains("Auto")').click()
            if (polizza.lob === 'RamiVari')
                cy.get('f-portafoglio_listbox').find(':contains("RamiVari")').click()
            if (polizza.lob === 'Vita')
                cy.get('f-portafoglio_listbox').find(':contains("Vita")').click()
            if (polizza.lob === 'Quadro')
                cy.get('f-portafoglio_listbox').find(':contains("Quadro")').click()


            cy.get('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
            cy.get('input[value="Cerca"]').click()
            cy.get('tbody[role="rowgroup"]').should('exist').and('be.visible')
                .and('contain.text','TEST DESCRIZIONE NOTA MODIFICATA')
                .and('contain.text','TEST AGGIUNTO NOTA DA BADGE')
                .and('contain.text','TEST AGGIUNTO NOTA IMPORTANTE')
        })
    }

}
export default SCUSalesNoteContratto