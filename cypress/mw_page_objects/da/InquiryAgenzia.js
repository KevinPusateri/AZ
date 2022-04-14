//#region Intercept
const menuInquiryAgenzia = {
    method: 'GET',
    url: /InquiryAgenzia_AD/
}
//#endregion

/**
 * @class
 * @classdesc Classe per interagire con l'applicativo Inquiry Agenzia
 * @author Andrea 'Bobo' Oboe
 */
class InquiryAgenzia {

    /**
     * Verifica accesso a Inquiry di Agenzia
     */
    static verificaAccessoInquiryAgenzia(){
        cy.intercept(menuInquiryAgenzia).as('menuInquiryAgenzia')
        cy.wait('@menuInquiryAgenzia', {timeout: 60000})
        this.uscita()
    }

    static uscita() {
        return cy.get('a:contains("« Uscita"):visible').should('exist').and('be.visible')
    }

    /**
     * Click > CHIUDI
     */
    static clickUscita() {
        this.uscita().click()
    }
}

export default InquiryAgenzia