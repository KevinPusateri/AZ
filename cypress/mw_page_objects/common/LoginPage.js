/// <reference types="Cypress" />
import Common from './Common'
import TopBar from './TopBar'

/**
 * @class
 * @classdesc Classe per avvio di Matrix Web e Login
 * @author Andrea 'Bobo' Oboe
 */
class LoginPage {

    /**
     * Effettua il primo visit di Matrix Web
     * @author Andrea 'Bobo' Oboe
     * @private
     */
    static launchMW() {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.viewport(1920, 1080)

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
     * Login in MW Advanced
     * @param {object} customImpersonification default empty, if specified perform a custom impersonification before login
     * @example let customImpersonification = {
            "agentId": "ARFPULINI2",
            "agency": "010710000"
        }
     * @param {boolean} mockedNotifications default a true, mocka le notifiche in atterraggio su MW
     * @param {boolean} mockedNews default a true, mocka le news in atterraggio su MW
     * @author Andrea 'Bobo' Oboe
     */
    static logInMWAdvanced(customImpersonification = {}, mockedNotifications = true, mockedNews = true) {
        this.launchMW()

        //Skip this two requests that blocks on homepage
        if (!Cypress.env('isSecondWindow')) {
            cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache')
            cy.intercept(/launch-*/, 'ignore').as('launchStaging')
            cy.intercept(/cdn.igenius.ai/, 'ignore').as('igenius')
            cy.intercept(/i.ytimg.com/, 'ignore').as('ytimg')
        }

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

        if (mockedNews && (!Cypress.env('isAviva') || !Cypress.env('isAvivaBroker'))) {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news')) {
                    req.reply({ fixture: 'mockNews.json' })
                }
            })
        } else if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
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

        //Recuperiamo l'utenza in base alla macchina che è in run da tutf.json
        cy.task('getWinUserLogged').then((loggedUser) => {
            cy.fixture("tutf").then(data => {
                const user = data.users.filter(obj => {
                    return obj.userName === loggedUser.username.toUpperCase()
                })[0]

                cy.log('Retrived username : ' + loggedUser.username)
                cy.decryptLoginPsw().then(psw => {
                    let currentImpersonificationToPerform
                    //Verifichiamo se ho customImpersonification valorizzato
                    if (Cypress.$.isEmptyObject(customImpersonification)) {
                        //Verifichiamo inoltre se effettuare check su seconda finestra in monoUtenza oppure AVIVA
                        if (Cypress.env('isSecondWindow') && Cypress.env('monoUtenza'))
                            currentImpersonificationToPerform = {
                                "agentId": data.monoUtenza.agentId,
                                "agency": data.monoUtenza.agency,
                            }
                        else if (Cypress.env('isAviva'))
                            currentImpersonificationToPerform = {
                                "agentId": data.aviva.agentId,
                                "agency": data.aviva.agency,
                            }
                        else if (Cypress.env('isAvivaBroker'))
                            currentImpersonificationToPerform = {
                                "agentId": data.avivaBroker.agentId,
                                "agency": data.avivaBroker.agency,
                            }
                        else
                            currentImpersonificationToPerform = {
                                "agentId": user.agentId,
                                "agency": user.agency,
                            }
                    } else
                        currentImpersonificationToPerform = {
                            "agentId": customImpersonification.agentId,
                            "agency": customImpersonification.agency,
                        }

                    //Se siamo in dashboard, skippo l'impersonificazione
                    if (Cypress.env('usingDash')) {
                        cy.get('input[name="Ecom_User_ID"]').type(user.tutf)
                        cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
                        cy.get('input[type="SUBMIT"]').click()

                        if (!Cypress.env('monoUtenza'))
                            Common.checkUrlEnv()
                        if (!mockedNews && (!Cypress.env('isAviva') || !Cypress.env('isAvivaBroker')))
                            cy.wait('@gqlNews')

                        if (Cypress.env('currentEnv') !== 'TEST')
                            cy.wait('@gqlUserDetails')

                        if (Cypress.env('isSecondWindow'))
                            TopBar.clickSecondWindow(customImpersonification)
                    }
                    else
                        cy.impersonification(user.tutf, currentImpersonificationToPerform.agentId, currentImpersonificationToPerform.agency).then(() => {
                            cy.get('input[name="Ecom_User_ID"]').type(user.tutf)
                            cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
                            cy.get('input[type="SUBMIT"]').click()

                            if (!Cypress.env('monoUtenza'))
                                Common.checkUrlEnv()
                            if (!mockedNews && (!Cypress.env('isAviva') || !Cypress.env('isAvivaBroker')))
                                cy.wait('@gqlNews')

                            if (Cypress.env('currentEnv') !== 'TEST')
                                cy.wait('@gqlUserDetails')

                            if (Cypress.env('isSecondWindow'))
                                TopBar.clickSecondWindow(customImpersonification)
                        })
                })
            })
        })
    }
}

export default LoginPage