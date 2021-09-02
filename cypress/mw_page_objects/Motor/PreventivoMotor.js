/// <reference types="Cypress" />
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
require('cypress-plugin-tab')

class PreventivoMotor {

    static compilaDatiQuotazione(targa, dataNascita) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
      
        cy.get('input[id="nx-input-1"]').should('exist').and('be.visible')
        cy.get('input[ng-reflect-name="DataNascitaProprietario"]').type(dataNascita)
        cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').type(targa);
       
        cy.get('nx-checkbox[id="informativa"]').should('exist').and('be.visible').within(() => {
            cy.get('span[class="nx-checkbox__control"]').click()
            })       
         cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').type(targa);
        
        

        cy.contains('Calcola').should('be.visible')
        cy.contains('Calcola').click({force:true})
        cy.get('input[ng-reflect-name]').should('be.visible').type('mazzini')
        //cy.get('input[nx-input-9]').type('1')
        //cy.get('input[nx-input-9]').type('Monfalcone')

        })
        }
  }
  
  
  
  export default PreventivoMotor