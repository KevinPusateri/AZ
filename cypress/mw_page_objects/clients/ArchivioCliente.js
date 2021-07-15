/// <reference types="Cypress" />

class ArchivioCliente {

    static clickTabArchivioCliente() {
        cy.contains('ARCHIVIO CLIENTE').click()
    }

    static clickSubTab(subTab) {
        cy.get('nx-tab-header').contains(subTab).click({ force: true })
    }

    static back() {
        cy.get('a').contains('Clients').click()
    }

    static checkLinksSubTabs() {
        const tabArchivioCliente = [
            'Note',
            'Attività',
            'Comunicazioni',
            'Unico',
            'Documentazione',
            'Digital Me'
        ]
        cy.get('nx-tab-header').find('button').each(($checkTabArchivioCliente, i) => {
            expect($checkTabArchivioCliente.text().trim()).to.include(tabArchivioCliente[i]);
        })
    }

    static checkNote() {
        cy.get('app-client-archive-notes').find('app-section-title').should('contain.text', 'Note')
        cy.get('#buttonNewNote').should('be.visible').and('contain.text', 'Aggiungi nota')
        cy.get('app-client-archive-notes').should('be.visible')
        cy.get('app-client-archive-notes').find('app-note-card').should('be.visible')
        cy.get('app-client-archive-notes').find('app-note-card').first().click()
        cy.get('app-note-action-modal').should('be.visible')
        cy.get('app-note-action-modal').find('app-client-data-label').should('be.visible')
        cy.get('div[class="editButton"]').should('be.visible').and('contain.text', 'Modifica')
        cy.get('div[class="editButton"] > nx-icon').should('be.visible')
        cy.get('button[aria-label="Close dialog"]').should('be.visible').click()
        cy.get('app-client-archive-notes').find('app-note-card').first()
            .find('nx-icon[class="ellipsis-icon nx-icon--s nx-icon--ellipsis-h"]').click()
        cy.get('.cdk-overlay-container').find('button').contains('Modifica Nota').click()
        cy.get('app-note-action-modal').should('be.visible', 'Annulla')
        cy.get('app-note-action-modal').find('button').should('contain.text', 'Salva modifica')
    }


    static checkComunicazioni() {
        cy.get('app-client-archive-communications').find('app-section-title').should('contain.text', 'Comunicazioni')
        cy.get('app-client-archive-communications').find('app-search').should('be.visible')
        cy.get('app-client-archive-communications')
            .find('div[class="documents--list-item nx-grid ng-star-inserted"]').should('be.visible')
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('comunicationDetail')) {
                req.alias = 'gqlComunicationDetail'
            }
        })
        cy.get('app-client-archive-communications')
            .find('div[class="documents--list-item nx-grid ng-star-inserted"]').first()
            .find('nx-icon[class="nx-icon--s nx-icon--password-show"]').click()
        cy.wait('@gqlComunicationDetail')
        cy.get('app-client-archive-communications-details').should('be.visible')
        cy.get('button[aria-label="Close dialog"]').click()
    }

    static clickComunicazioni() {
        cy.contains('Comunicazioni').click()
    }

    static verificaCardComunicazioni(etichetta) {
        cy.get('.card-title').should('contain.text', etichetta)
    }

    static verificaUnico() {
        cy.contains('Unico').click()
        //TODO" 1 Aggiornamento unico"
    }
}

export default ArchivioCliente