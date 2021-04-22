/// <reference types="Cypress" />


Cypress.config('defaultCommandTimeout', 30000)


//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 3000
//#endregion

//#region Global Variables
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
  
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
        if (req.body.operationName.includes('news')) {
            req.alias = 'gqlNews'
        }
    })
    cy.visit('https://matrix.pp.azi.allianz.it/',{
        onBeforeLoad: win =>{
            win.sessionStorage.clear();
        }
    })
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
    // cy.wait('@gqlNotifications')
    cy.wait('@gqlNews')

})

afterEach(() => {
    cy.get('body').then($body => {
        if ($body.find('.user-icon-container').length > 0) {   
            cy.get('.user-icon-container').click();
            cy.wait(1000).contains('Logout').click()
            cy.wait(delayBetweenTests)
        }
    });
    cy.clearCookies();
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
    });

    it('Top Menu Sales', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Sales').click()
        cy.url().should('include', '/sales')
    });

    it('Top Menu Numbers', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
    });

    it('Top Menu Backoffice', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    });

    it('Top Menu News', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.intercept({
            method: 'GET',
            url: '**/o2o/**'
        }).as('getO2o');
        cy.get('lib-switch-button-list').contains('News').click()
        cy.wait('@getO2o', { requestTimeout: 40000 });
        cy.url().should('include', '/news/home')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Le mie info', function () {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Le mie info').click()
        cy.url().should('include', '/lemieinfo')
    });

    it('Cerca in Matrix', function () {
        cy.get('input').invoke('attr', 'placeholder').should('contain', 'Cerca in Matrix')
    });

    it('Button Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
    });
        
    it('Button Sales', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
    });

    it('Button Numbers', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
    });
        
    it('Button Backoffice', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    });

    it('Button News', function () {
        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('include', '/news/home')
    });
    
    it('Button News', function () {
        cy.get('app-product-button-list').find('a').contains('Le mie info').click()
        cy.url().should('include', '/news/home')
    });
    it('Centro notifiche', function () {
        cy.get('app-notification-top-bar').find('a').contains('Vai al Centro notifiche').click()
        cy.url().should('include', '/notification-center')
    });

    it('Vedi tutte le news', function () {
        cy.get('app-news-top-bar-title-cta').contains('Vedi tutte').click()
        cy.url().should('include', '/news/recent')
    });

    // it('Verifica card Notifica', function () {

    //     cy.wait('@gqlNotifications')
    //     cy.get('lib-notification-card').first().find('button').click()

    // })

    // it('Verifica cards Notifiche', function () {
    //     //TODO non trova i button
    //     cy.get('lib-notification-card').first().find('button').click()
    //     cy.wait(5000)
    //     cy.get('.cdk-overlay-container').find('button').contains('Disattiva notifiche di questo tipo').should('be.visible')
    //     // cy.get('.cdk-overlay-container').find('button').contains('Disattiva notifiche di questo tipo').should('be.visible')
    //     // cy.get('.cdk-overlay-container').find('button:contains("Segna come da leggere"):visible')
    //     // cy.get('lib-notification-list').find('button').each($button =>{
    //     //     cy.wrap($button).click()
    //     //     cy.wait(3000)
    //     //     cy.get('.nx-context-menu__content').find('button:contains("Disattiva notifiche di questo tipo"):visible')
    //     //     cy.get('.nx-context-menu__content').find('button:contains("Segna come da leggere"):visible')
    //     // })
    //     // cy.get('lib-notification-list').then($cardsNotification =>{
    //     //     if($cardsNotification.find('lib-notification-card').length > 0){
    //     //         cy.wrap($cardsNotification).find('[class^="body"]').first().then($card =>{
    //     //             if($card.hasClass('body unread')){
                        
    //     //                 cy.wrap($card).click()
    //     //                 cy.get('nx-modal-container').find('[class="notification-da-container ng-star-inserted"]').first().click()
    //     //             }else
    //     //                 cy.wrap($card).click()
    //     //         })
    //     //         cy.get('a[href="/matrix/"]').click()
    //     //     }
    //     // })
    // });

   
});
})