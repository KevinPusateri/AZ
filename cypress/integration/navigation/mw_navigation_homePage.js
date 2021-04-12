/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 30000)


//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
  
const backToClients = () => cy.get('a').contains('Clients').click().wait(5000)
const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click()
//#endregion


beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.viewport(1920, 1080)
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
            req.alias = 'gqlNotifications'
        }
    })
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return true;
        }
    })
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 50000 });
    cy.wait('@gqlNotifications')

})

afterEach(() => {

    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
})

Cypress._.times(1,()=>{

describe('Matrix Web : Navigazioni da Home Page - ', function () {

    it('Top Menu Principali', function () {
        cy.get('lib-calendar').click()
        cy.get('lib-incident').click()
        cy.get('lib-notification-header').click()
        cy.get('lib-user-header').click()

        cy.get('lib-switch-button').click()
        cy.get('.lib-switch-button-list-column').should('have.length',6)
    });

    it('Top Menu Clients', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Sales', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Numbers', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Backoffice', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('a[href="/matrix/"]').click()
    });

    // it('Top Menu News', function () {
    //     cy.get('lib-switch-button').click().wait(500)
    //     cy.get('lib-switch-button-list').contains('News').click()
    //     cy.url().should('include', '/news/home')
    //     cy.get('a[href="/matrix/"]').click()
    // });

    it('Top Menu Le mie info', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Le mie info').click()
        cy.url().should('include', '/lemieinfo')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Cerca in Matrix', function () {
        cy.get('input').invoke('attr', 'placeholder').should('contain', 'Cerca in Matrix')
    });

    it('Button Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Button Sales', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Button Numbers', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Button Backoffice', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('a[href="/matrix/"]').click()
    });

    it.only('Button News', function () {
        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.get('a[href="/matrix/"]').click()
    });

    
    it('Button News', function () {
        cy.get('app-product-button-list').find('a').contains('Le mie info').click()
        cy.url().should('include', '/news/home')
        cy.get('a[href="/matrix/"]').click()
    });
    it('Centro notifiche', function () {
        cy.get('app-notification-top-bar').find('a').contains('Vai al Centro notifiche').click()
        cy.url().should('include', '/notification-center')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Vedi tutte le news', function () {
        cy.get('app-news-top-bar-title-cta').contains('Vedi tutte').click()
        cy.url().should('include', '/news/recent')
        cy.get('a[href="/matrix/"]').click()
    });


    // farli?
    // it.only('Verifica card Notifica', function () {

    //     cy.get('lib-notification-list').then( ($cardNotification) =>{
    //         if($cardNotification.find('lib-notification-card').length > 0){
    //             cy.wrap($cardNotification).find('lib-notification-card').first().click()
    //         }
    //     })
    // });

    // it.only('Verifica image news', function(){
    //     cy.get('lib-news-image').click()
    //     canaleFromPopup()
    //     getIFrame().find('a:contains("Primo Piano"):visible')
    //     getIFrame().find('span:contains("Primo comandamento: GED, GED e solo GED"):visible')
    // })
});
})