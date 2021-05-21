/// <reference types="Cypress" />
 
class TopBar {

    static logOutMW(){
        
        const delayBetweenTests = 2000

        cy.get('body').then($body => {
            if ($body.find('.user-icon-container').length > 0) {   
                cy.get('.user-icon-container').click();
                cy.wait(1000).contains('Logout').click()
                cy.wait(delayBetweenTests)
            }
        });
        cy.clearCookies();
    }
}

export default TopBar