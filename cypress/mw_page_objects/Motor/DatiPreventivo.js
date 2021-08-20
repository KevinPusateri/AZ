/// <reference types="Cypress" />

//import Common from "../common/Common";




class DatiPreventivo {

    static ClickCheckTarga() {
        cy.contains('NON CONOSCI LA TARGA?').click()
    }
    static verificaUnico() {
        cy.contains('Unico').click()
        //TODO" 1 Aggiornamento unico"
    }
    static clickP2() {
        cy.get('nx-tab-header').contains('NON TARGA?').click()
    }
 }