/// <reference types="Cypress" />
import Common from './Common'

class LoginPage {

    static launchMW() {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.viewport(1920, 1080)

        let url
        Cypress.env('currentEnv') === 'TEST' ? url = Cypress.env('urlMWTest') : url = Cypress.env('urlMWPreprod')

        cy.visit('/', { responseTimeout: 31000 }, {
            onBeforeLoad: win => {
                win.sessionStorage.clear();
                Object.defineProperty(win.navigator, 'language', { value: 'it-IT' });
                Object.defineProperty(win.navigator, 'languages', { value: ['it'] });
                Object.defineProperty(win.navigator, 'accept_languages', { value: ['it'] });
            },
            headers: {
                'Accept-Language': 'it',
            },
        })
    }

    static logInMW(userName, psw, performeImpersonification = true, agency = '010710000', mockedNotifications = true, mockedNews = true) {
        this.launchMW()

        //Skip this two requests that blocks on homepage
        cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache')
        cy.intercept(/launch-*/, 'ignore').as('launchStaging')

        if (mockedNotifications) {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('notifications')) {
                    req.reply({ fixture: 'mockNotifications.json' })
                }
            })
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('getNotificationCategories')) {
                    req.reply({ fixture: 'mockGetNotificationCategories.json' })
                }
            })

        }

        if (mockedNews) {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news')) {
                    req.reply({ fixture: 'mockNews.json' })
                }
            })
        }
        else {
            //Wait for news graphQL to be returned
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news'))
                    req.alias = 'gqlNews'
            })
        }

        //Intecettiamo by default userDetails che serve a tutta una serie di chiamate in MW
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('userDetails'))
                req.alias = 'gqlUserDetails'
        })

        //effettuo impersonification se specificato
        if (performeImpersonification) {
            //TODO Implementare anche altre agenzie che si vogliono
            let agentId
            switch (agency) {
                case '010710000':
                    agentId = 'ARFPULINI2'
                    break;
                case '010375000':
                    agentId = 'ARALONGO7'
                    break;
            }

            cy.impersonification(userName, agentId, agency).then(() => {
                cy.get('input[name="Ecom_User_ID"]').type(userName)
                cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
                cy.get('input[type="SUBMIT"]').click()

                Common.checkUrlEnv()
                if (!mockedNews)
                    cy.wait('@gqlNews')

                cy.wait('@gqlUserDetails')
            })
        }
        else {
            cy.get('input[name="Ecom_User_ID"]').type(userName)
            cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
            cy.get('input[type="SUBMIT"]').click()

            Common.checkUrlEnv()
            if (!mockedNews)
                cy.wait('@gqlNews')

            cy.wait('@gqlUserDetails')
        }
    }
}

export default LoginPage