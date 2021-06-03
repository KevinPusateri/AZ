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

    describe('Matrix Web : Navigazioni da Home Page - ', function () {

        it('Verifica Top Menu Principali', function () {
            TopBar.clickIconCalendar()
            TopBar.clickIconIncident()
            // TopBar.clickIconNotification() -> è stato tolto canpanellina notifiche
            TopBar.clickIconUser()
            TopBar.clickIconSwitchPage()
        });

        it('Verifica Top Menu incident - Verifica presenza dei link', function () {
            TopBar.clickIconIncident()
            TopBar.checkLinksIncident()
        })
        
        // è stato tolto
        // it('Verifica Top Menu notifiche - Verifica presenza dei link', function () {
        //     TopBar.clickIconNotification()
        //     TopBar.checkNotificheEvidenza()
        // })

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

        it('Verifica Click Pannello "Notifiche in evidenza"', function () {
            HomePage.clickPanelNotifiche()
        })

        it('Verifica testi e link delle notifiche', function () {

            HomePage.clickPanelNotifiche()
            HomePage.checkNotifiche()
        })

})