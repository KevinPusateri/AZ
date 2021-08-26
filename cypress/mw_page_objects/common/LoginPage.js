/// <reference types="Cypress" />
import Common from './Common'
import TopBar from './TopBar'

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

    /**
     * Login in MW
     * @param {*} userName : TUTF utilizzata per il login
     * @param {*} psw : PSW della TUTF per effettuare il login
     * @param {*} performeImpersonification  : default a true, effettua l'impersonificazione che di default è impostata su ARFPULINI2 sulla 010710000
     * @param {*} agency : default a 010710000, setta l'agenzia sulla quale effettuare l'impersonificazione !! Al momento disponibili 01710000 e 01375000 !!
     * @param {*} mockedNotifications : default a true, mocka le notifiche in atterraggio su MW
     * @param {*} mockedNews : default a true, mocka le news in atterraggio su MW
     */
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
            let agentId

            //! MONOUTENZA DEDICATA PER EFFETTUARE I TEST SU SECONDA FINESTRA (AG 070004549)
            if (Cypress.env('isSecondWindow')) {
                agency = '070004549'
                agentId = 'ASGNAZZARRO1'
            }
            else {
                //TODO Implementare anche altre agenzie che si vogliono
                switch (agency) {
                    case '010710000':
                        agentId = 'ARFPULINI2'
                        break;
                    case '010375000':
                        agentId = 'ARALONGO7'
                        break;
                }
            }
            cy.impersonification(userName, agentId, agency).then(() => {
                cy.get('input[name="Ecom_User_ID"]').type(userName)
                cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
                cy.get('input[type="SUBMIT"]').click()

                Common.checkUrlEnv()
                if (!mockedNews)
                    cy.wait('@gqlNews')

                cy.wait('@gqlUserDetails')

                if (Cypress.env('isSecondWindow'))
                    TopBar.clickSecondWindow()
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