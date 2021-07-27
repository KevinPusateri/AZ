/// <reference types="Cypress" />
import common from 'mocha/lib/interfaces/common'
import Common from './Common'
import HomePage from './HomePage'

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
            }
        })
    }

    static logInMW(userName, psw, mockedNotifications = true, mockedNews = true) {
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

        if (mockedNotifications) {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news')) {
                    req.reply({ fixture: 'mockNews.json' })
                }
            })
        }
        else {
            //Wait for news graphQL to be returned
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news')) {
                    req.alias = 'gqlNews'
                    req.res
                }
            })
        }

        cy.get('input[name="Ecom_User_ID"]').type(userName)
        cy.get('input[name="Ecom_Password"]').type(psw)
        cy.get('input[type="SUBMIT"]').click()

        Common.checkUrlEnv()
        if (!mockedNews)
            cy.wait('@gqlNews')
    }
}

export default LoginPage