/// <reference types="Cypress" />

class ArchivioCliente {

    static clickArchivioCliente() {
        cy.contains('ARCHIVIO CLIENTE').click()
    }

    static clickComunicazioni() {
        cy.contains('Comunicazioni').click()
    }

    static verificaCardComunicazioni(etichetta) {
        cy.get('.card-title').should('contain.text', etichetta)
    }

    static verificaUnico(){
        cy.contains('Unico').click()
        //TODO" 1 Aggiornamento unico"
    }
}

export default ArchivioCliente