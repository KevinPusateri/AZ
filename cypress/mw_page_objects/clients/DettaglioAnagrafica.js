/// <reference types="Cypress" />

class DettaglioAnagrafica {

    static verificaDatiDettaglioAnagrafica(cliente) {

        cy.contains('DETTAGLIO ANAGRAFICA').click()
        //cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(1) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.ragioneSociale).toUpperCase().replace(",",""))
        // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(2) > app-client-data-label:nth-child(1) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.partitaIva))
        // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(2) > app-client-data-label:nth-child(2) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.partitaIva))
        // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(2) > div > div.value > div > div').should('contain.text',"S.R.L.")
        // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(3) > div > div.value > div > div').should('contain.text',"DITTA")
        // //Verifica indirizzo
        // cy.get('.client-name').should('contain.text', String(cliente.ragioneSociale).toUpperCase().replace(",", ""))
        // cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.toponimo)
        // cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.indirizzo)
        // cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.numCivico)
        // cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.cap)
        // cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.citta)
        // cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.provincia)
        // //Verifica email
        // cy.get('nx-icon[class*=mail]').parent().get('div').should('contain.text', String(cliente.email).toLowerCase())
    }
}

export default DettaglioAnagrafica