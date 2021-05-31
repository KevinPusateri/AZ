/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import HomePage from "../../mw_page_objects/common/HomePage"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
})

after(() => {
    TopBar.logOutMW()
})
Cypress._.times(1, () => {

    describe('Matrix Web : Navigazioni da Home Page - ', function () {

        it('Verifica Top Menu Principali', function () {
            TopBar.clickIconCalendar()
            TopBar.clickIconIncident()
            TopBar.clickIconNotification()
            TopBar.clickIconUser()
            TopBar.clickIconSwitchPage()
        });

        it('Verifica Top Menu incident - Verifica presenza dei link', function () {
            TopBar.clickIconIncident()
            TopBar.checkLinksIncident()
        })

        it('Verifica Top Menu notifiche - Verifica presenza dei link', function () {
            TopBar.clickIconNotification()
            TopBar.checkNotificheEvidenza()
        })

        it('Verifica Top Menu Clients', function () {
            TopBar.clickIconSwitchPage('Clients')
        });

        it('Verifica Top Menu Sales', function () {
            TopBar.clickIconSwitchPage('Sales')
        });

        it('Verifica Top Menu Numbers', function () {
            TopBar.clickIconSwitchPage('Numbers')
        });

        it('Verifica Top Menu Backoffice', function () {
            TopBar.clickIconSwitchPage('Backoffice')
        });

        it('Verifica Top Menu News', function () {
            TopBar.clickIconSwitchPage('News')
        });

        it('Verifica Top Menu Le mie info', function () {
            TopBar.clickIconSwitchPage('Le mie info')
        });

        it('Verica buca di ricerca', function () {
            TopBar.clickBucaRicerca()
        });

        it('Verifica Button Clients', function () {
            TopBar.clickClients()
        });

        it('Verifica Button Sales', function () {
            TopBar.clickSales()
        });

        it('Verifica Button Numbers', function () {
            TopBar.clickNumbers()
        });

        it('Verifica Button Backoffice', function () {
            TopBar.clickBackOffice()
        });

        it('Verifica Button News', function () {
            TopBar.clickNews()
        });

        it('Verifica Button Le mie info', function () {
            TopBar.clickMieInfo()

        });
        it('Verifica link "Vai al Centro notifiche"', function () {
            HomePage.clickVaiAlCentroNotifiche()
        });

        it('Verifica link: "Vedi tutte"', function () {
            HomePage.clickVediTutte()
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