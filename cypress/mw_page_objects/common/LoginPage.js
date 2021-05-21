/// <reference types="Cypress" />
 
class LoginPage {
 
    static launchMW(){
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.viewport(1920, 1080)

        cy.visit(Cypress.env('urlMWPreprod'),{
            onBeforeLoad: win =>{
                win.sessionStorage.clear();
            }
        })
    }

    static logInMW(userName, psw){
        this.launchMW()

        //Skip this two requests that blocks on homepage
        cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache')
        cy.intercept(/launch-*/,'ignore').as('launchStaging')
        
        //Wait for news graphQL to be returned
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('news')) {
                req.alias = 'gqlNews'
            }
        })

        cy.get('input[name="Ecom_User_ID"]').type(userName)
        cy.get('input[name="Ecom_Password"]').type(psw)
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')

        cy.wait('@gqlNews')

    }
}
 
export default LoginPage