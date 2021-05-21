/// <reference types="Cypress" />
 
class Disambiguazione {
 
    static canaleFromPopup(){
        cy.get('body').then($body => {
            if ($body.find('nx-modal-container').length > 0) {
              cy.wait(2000)
              cy.get('nx-modal-container').find('.agency-row').first().click()
            }
          })
    }

}
 
export default Disambiguazione