/// <reference types="Cypress" />


class Annullamento {

    static annullaContratto(){
        cy.getIFrame()
        cy.get('@iframe').within(() =>{
            cy.get('[class="tableCellGray"]').should('be.visible').and('contain.text','Data annullamento')
        })
    }

}
export default Annullamento