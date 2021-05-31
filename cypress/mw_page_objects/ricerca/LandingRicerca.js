/// <reference types="Cypress" />

import Common from "../common/Common";

class LandingRicerca {

    /**
    * @param {boolean} filtri - Se true, imposta filtri aggiuntivi di ricerca, altrimenti no
    * @param {string} tipoCliente - Tipo Cliente a scelta tra "PF" o "PG"
    * @param {string} statoCliente - Stato Cliente a scelta tra "E", "P" o "C"
    */
    static searchRandomClient(filtri, tipoCliente, statoCliente) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.get('input[name="main-search-input"]').click()
        cy.generateTwoLetters().then(randomChars => {
            cy.get('input[name="main-search-input"]').type(randomChars).type('{enter}')
        })
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 });
        cy.url().should('eq', Common.getBaseUrl() + 'search/clients/clients')

        if (filtri) {
            //Filtriamo la ricerca in base a tipoCliente
            cy.get('.icon').find('[name="filter"]').click()
            if (tipoCliente === "PF")
                cy.get('.filter-group').contains('Persona giuridica').click()
            else
                cy.get('.filter-group').contains('Persona fisica').click()

            //Filtriamo la ricerca in base a statoCliente
            switch (statoCliente) {
                case "E":
                    cy.get('.filter-group').contains('Potenziale').click()
                    cy.get('.filter-group').contains('Cessato').click()
                    break
                case "P":
                    cy.get('.filter-group').contains('Effettivo').click()
                    cy.get('.filter-group').contains('Cessato').click()
                    break
                case "C":
                    cy.get('.filter-group').contains('Potenziale').click()
                    cy.get('.filter-group').contains('Effettivo').click()
                    break
            }

            cy.get('.footer').find('button').contains('applica').click()
            cy.wait('@gqlSearchClient', { requestTimeout: 30000 });

            cy.get('lib-applied-filters-item').find('span').should('be.visible')
        }
    }

    static clickFirstResult() {
        cy.get('lib-client-item').first().click();
    }

    /**
     * 
     * @param {string} pageLanding - nome della pagina 
     */
    static checkBucaRicercaSuggerrimenti(pageLanding) {
        cy.get('input[name="main-search-input"]').click()
        const getSection = () => cy.get('lib-shortcut-section-item')
        getSection().find('[class="title"]:contains("Ultime pagine visitate"):visible').should('contain', 'Ultime pagine visitate')
        getSection().find('[class="title"]:contains("Ultimi clienti visualizzati"):visible').should('contain', 'Ultimi clienti visualizzati')
        getSection().find('[class="title"]:contains("Ultime polizze visualizzate"):visible').should('contain', 'Ultime polizze visualizzate')

        getSection().find('[class="left nx-grid__column-6"]').should('exist').and('be.visible').and('have.length', 9)
        getSection().find('a[href^="/matrix/clients/client/"]').should('have.length', 3).and('exist').and('be.visible').and('have.attr', 'href')
        getSection().find('img').should('have.length', 3).and('exist').and('be.visible').and('have.attr', 'src')

        getSection().find('[class="right nx-grid__column-6"]').each(($text) => {
            expect($text.text()).not.to.be.empty
        })
        getSection().find('[class="left nx-grid__column-6"]').each(($text) => {
            expect($text.text()).not.to.be.empty
        })

        cy.get('a[href="/matrix/"]').click()
    }

    static checkRicercaClassica() {
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()

        const links = [
            'Ricerca Cliente',
            'Ricerca Polizze proposte',
            'Ricerca Preventivi',
            'Ricerca News',
            'Rubrica'
        ]
        cy.get('nx-modal-container').find('lib-da-link').each(($linkRicerca, i) => {
            expect($linkRicerca.text().trim()).to.include(links[i]);
        })
        cy.get('nx-modal-container').find('button[aria-label="Close dialog"]').click()
    }

    static clickRicercaClassicaLabel(link) {
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()
        cy.get('nx-modal-container').find('lib-da-link').contains(link).click()
        Common.canaleFromPopup()
    }
}

export default LandingRicerca