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

    static compilaDatiQuotazione(targa,dataNascita) {
        getIFrame().find('input[id="nx-input-0"]').should('exist').and('be.visible').type(targa);
        getIFrame().find('input[id="nx-input-1"]').should('exist').and('be.visible').type(dataNascita)
       getIFrame().find('nx-checkbox[id="informativa"]').should('exist').and('be.visible').check()
        
    }
  }
  
  
  
  export default PreventivoMotor