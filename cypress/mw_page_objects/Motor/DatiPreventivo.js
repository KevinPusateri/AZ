/// <reference types="Cypress" />





class DatiPreventivo {

    static clickCeckTarga() {
        cy.contains('NON CONOSCI LA TARGA?').click()
    }
    
    static clickP2() {
        cy.get('nx-tab-header').contains('NON TARGA?').click()
    }
 }