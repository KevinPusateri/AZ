/// <reference types="Cypress" />




//#region Configuration
Cypress.config('defaultCommandTimeout', 50000)
const delayBetweenTests = 3000
const baseUrl = Cypress.env('baseUrl') 

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


const canaleFromPopup = () => {cy.get('body').then($body => {
    if ($body.find('nx-modal-container').length > 0) {   
        cy.get('nx-modal-container').find('.agency-row').first().click()
    }
});
}

before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  
    cy.intercept('POST', '**/graphql', (req) => {
    // if (req.body.operationName.includes('notifications')) {
    //     req.alias = 'gqlNotifications'
    // }
    if (req.body.operationName.includes('news')) {
        req.alias = 'gqlNews'
    }
    })
    cy.viewport(1920, 1080)
  
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait('@gqlNews')
  })
  
  beforeEach(() => {
      cy.viewport(1920, 1080)
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName.includes('news')) {
            req.alias = 'gqlNews'
        }
        })
        cy.viewport(1920, 1080)
      cy.visit('https://matrix.pp.azi.allianz.it/')
      cy.wait('@gqlNews')
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
  })
  
  after(() => {
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

    it('Verifica Top Menu Principali', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-calendar').click()
        cy.get('lib-incident').click()
        cy.get('lib-notification-header').click()
        cy.get('lib-user-header').click()

        cy.get('lib-switch-button').click().wait(1000)
        cy.get('.lib-switch-button-list-column').should('have.length',6)
    });

    // NEW
    it('Verifica Top Menu incident - Verifica presenza dei link', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-incident').click()
        cy.wait(1000)
        const linksIncident = [
            'SRM',
            'SisCo',
            'Elenco telefonico'
        ]
        cy.get('lib-utility-label').find('a').each(($link, i) => {
            expect($link.text().trim()).to.include(linksIncident[i]);
        })
        cy.get('a[href="/matrix/"]').click()
        cy.url().should('eq',baseUrl)
    })

    // NEW
    it('Verifica Top Menu notifiche - Verifica presenza dei link', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-notification-header').click()
        cy.wait(3000).get('lib-notification-settings').click()
        const linksNotificaion = [
            'Portafoglio',
            'Sinistri',
            'Digital Me',
            'VPS',
            'Contabilità',
            'Richieste SRM',
            'Richieste SisCo',
            'E-commerce',
            'AllianzNow',
            'Cliente',
            'Resi Pos.',
            'Gestione Attività'
        ]
        cy.wait(3000)
        cy.get('lib-notification-settings-container').find('lib-notification-settings-item').each(($link, i) => {
            expect($link.text().trim()).to.include(linksNotificaion[i]);
        })
        cy.get('button[class^="nx-modal__close"]').click()
    })


    it('Verifica Top Menu Clients', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('a[href="/matrix/"]').click()

    });

    it('Verifica Top Menu Sales', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Sales').click()
        cy.url().should('eq', baseUrl + 'sales/')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Verifica Top Menu Numbers', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Numbers').click()
        cy.url().should('eq',baseUrl+'numbers/business-lines')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Verifica Top Menu Backoffice', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Backoffice').click()
        cy.url().should('eq',baseUrl+'back-office')
        cy.get('a[href="/matrix/"]').click()
        });

    it('Verifica Top Menu News', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-switch-button').click().wait(500)
        cy.intercept({
            method: 'GET',
            url: '**/o2o/**'
        }).as('getO2o');
        cy.get('lib-switch-button-list').contains('News').click()
        cy.wait('@getO2o', { requestTimeout: 40000 });
        cy.url().should('eq',baseUrl+'news/home')
        cy.get('a[href="/matrix/"]').click()
        cy.get('a[href="/matrix/"]').click()
    });

    it('Verifica Top Menu Le mie info', function () {
        cy.url().should('eq',baseUrl)
        cy.get('lib-switch-button').click().wait(500)
        cy.get('lib-switch-button-list').contains('Le mie info').click()
        cy.url().should('eq',baseUrl+'lemieinfo?info=1')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Verica buca di ricerca', function () {
        cy.get('input').invoke('attr', 'placeholder').should('contain', 'Cerca in Matrix')
    });

    it('Verifica Button Clients', function () {
        cy.url().should('eq',baseUrl)
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq',baseUrl+'clients/')
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Verifica Button Sales', function () {
        cy.url().should('eq',baseUrl)
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+'sales/')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Verifica Button Numbers', function () {
        cy.url().should('eq',baseUrl)
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq',baseUrl+'numbers/business-lines')
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Verifica Button Backoffice', function () {
        cy.url().should('eq',baseUrl)
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq',baseUrl+'back-office')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Verifica Button News', function () {
        cy.url().should('eq',baseUrl)
        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('eq',baseUrl+'news/home')
        cy.get('a[href="/matrix/"]').click()
    });
    
    it('Verifica Button Le mie info', function () {
        cy.url().should('eq',baseUrl)
        cy.get('app-product-button-list').find('a').contains('Le mie info').click()
        cy.url().should('eq',baseUrl+'lemieinfo?info=1')
        cy.get('a[href="/matrix/"]').click()
        
    });
    it('Verifica Centro notifiche', function () {
        cy.url().should('eq',baseUrl)
        cy.contains('Vai al Centro notifiche').click()
        cy.url().should('include', '/notification-center')
        cy.get('a[href="/matrix/"]').click()
    });

    it('Verifica link: Vedi tutte le news', function () {
        cy.url().should('eq',baseUrl)
        cy.contains('Vedi tutte').click()
        cy.url().should('eq',baseUrl+'news/recent')
        cy.get('a[href="/matrix/"]').click()

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