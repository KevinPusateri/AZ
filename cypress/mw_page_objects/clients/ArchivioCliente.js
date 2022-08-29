/// <reference types="Cypress" />

class ArchivioCliente {

    static clickTabArchivioCliente() {
        cy.contains('ARCHIVIO CLIENTE').click()
        cy.contains('div','Not').should('exist').and('be.visible')
    }

    static clickSubTab(subTab) {
        cy.get('nx-tab-header').contains(subTab).click({ force: true })
    }

    static back() {
        cy.get('a').contains('Clients').click()
    }

    static checkLinksSubTabs() {
        cy.get('nx-tab-header').should('be.visible')
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
        cy.get('app-client-archive-notes').should('be.visible').then(($schedaNote => {
            const check = $schedaNote.find(':contains("Nessuna nota presente")').is(':visible')
            if (check)
                assert.isTrue(true, 'Note non presenti')
            else {
                cy.get('app-client-archive-notes').find('app-note-card').should('be.visible')
                cy.get('app-client-archive-notes').find('app-note-card').first().click()
                cy.get('app-note-action-modal').should('be.visible')
                cy.get('app-note-action-modal').find('app-client-data-label').should('be.visible')
                cy.get('div[class="editButton"]').should('be.visible').and('contain.text', 'Modifica')
                cy.get('div[class="editButton"] > nx-icon').should('be.visible')
                cy.get('button[aria-label="Close dialog"]').should('be.visible').click()
                cy.get('app-client-archive-notes').find('app-note-card').first()
                    .find('nx-icon[aria-label="Apri menu"]').click()
                cy.get('.cdk-overlay-container').find('button').contains('Modifica Nota').click()
                cy.get('app-note-action-modal').should('be.visible', 'Annulla')
                cy.get('app-note-action-modal').find('button').should('contain.text', 'Salva modifica')
            }
        }))
    }


    static checkComunicazioni() {
        cy.get('app-client-archive-communications').find('app-section-title').should('contain.text', 'Comunicazioni')
        cy.get('app-client-archive-communications').find('app-search').should('be.visible').wait(3000)
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('comunicationDetail')) {
                req.alias = 'gqlComunicationDetail'
            }
        })
        cy.get('app-client-archive-communications').then(($doc) => {
            if ($doc.find('div[class="documents--list-item nx-grid ng-star-inserted"]').first().length > 0) {
                cy.wrap($doc).first().find('nx-icon[name="password-show"]:first').click()
                cy.wait('@gqlComunicationDetail')
                cy.get('app-client-archive-communications-details').should('be.visible')
                cy.get('button[aria-label="Close dialog"]').click()
            }
        })
    }

    static checkUnico() {
        cy.get('app-client-archive-unique').find('app-client-archive-unique-change-card')
            .should('be.visible')
        cy.get('app-client-archive-unique').find('app-section-title').should('include.text', 'Aggiornament')
        cy.get('app-client-archive-unique').find('app-section-title').should('include.text', 'unico')
        cy.get('app-client-archive-unique').find('div[class="nx-grid__column-2"]').should('contain.text', 'Modifiche')
        cy.get('app-client-archive-unique').find('div[class="nx-grid__column-3"]').should('contain.text', 'Consensi accettati')
        cy.get('app-client-archive-unique').find('div[class="nx-grid__column-3"]').should('contain.text', 'Consensi rifiutati')
        // cy.get('app-client-archive-unique').find('app-client-archive-unique-change-card').first()
        //     .find('nx-icon[class="nx-icon--s nx-icon--password-show"]').click()
    }

    static checkDigitalMe() {
        cy.get('app-client-archive-dm').should('be.visible')
        cy.get('app-client-archive-dm').find('app-dm-requests-card').should('be.visible')

        cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').first().find('button[class="row-more-icon-button"]').click();
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').each(($checkLink) => {
            expect($checkLink.text()).not.to.be.empty;
        });
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').first().invoke('text')
            .should('include', '+');
        cy.get('app-digital-me-context-menu').find('[href^="mailto"]').invoke('text').should('include', '@');
        cy.get('app-digital-me-context-menu').find('[href^="/matrix/clients/"]').should('contain', 'Apri scheda cliente');
        cy.get('app-digital-me-context-menu').find('lib-da-link').should('contain', 'Apri dettaglio polizza')
        cy.get('app-digital-me-context-menu').find('lib-da-link').should('contain', 'Accedi a folder cliente');


        cy.get('app-client-archive-dm').find('app-dm-requests-card').first().click()
        cy.get('app-digital-me-details-modal').find('nx-badge').should('be.visible').and('contain.text', 'DA GESTIRE')
        cy.get('app-digital-me-details-modal').find('app-contract-card').should('be.visible')
        cy.get('app-digital-me-details-modal').find('button[role="tab"]').should('contain.text', 'Dettaglio Richiesta')
        cy.get('app-digital-me-details-modal').find('button[role="tab"]').should('contain.text', 'Allegati')
        cy.get('app-digital-me-details-modal').find('app-contract-card').should('be.visible')


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