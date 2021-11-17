/// <reference types="Cypress" />
import Common from './Common'
import TopBar from './TopBar'

class LoginPage {

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
     * Login in MW
     * @deprecated Please use logInMWAdvanced() instead
     * @param {string} userName : TUTF utilizzata per il login
     * @param {string} psw : PSW della TUTF per effettuare il login
     * @param {boolean} performeImpersonification  : default a true, effettua l'impersonificazione che di default è impostata su ARFPULINI2 sulla 010710000
     * @param {string} agency : default a 010710000, setta l'agenzia sulla quale effettuare l'impersonificazione !! Al momento disponibili 01710000 e 01375000 !!
     * @param {boolean} mockedNotifications : default a true, mocka le notifiche in atterraggio su MW
     * @param {boolean} mockedNews : default a true, mocka le news in atterraggio su MW
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
        } else {
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
            if (Cypress.env('isSecondWindow') && Cypress.env('monoUtenza')) {
                agency = '070004549'
                agentId = 'ASGNAZZARRO1'
            } else {
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

                if (!Cypress.env('monoUtenza'))
                    Common.checkUrlEnv()
                if (!mockedNews)
                    cy.wait('@gqlNews')

                cy.wait('@gqlUserDetails')

                if (Cypress.env('isSecondWindow'))
                    TopBar.clickSecondWindow()
            })
        } else {
            cy.get('input[name="Ecom_User_ID"]').type(userName)
            cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
            cy.get('input[type="SUBMIT"]').click()

            Common.checkUrlEnv()

            if (!mockedNews)
                cy.wait('@gqlNews')

            cy.wait('@gqlUserDetails')
        }
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
     */
    static logInMWAdvanced(customImpersonification = {}, mockedNotifications = true, mockedNews = true) {
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

        if (mockedNews && !Cypress.env('isAviva')) {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news')) {
                    req.reply({ fixture: 'mockNews.json' })
                }
            })
        } else if (!Cypress.env('isAviva')){
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

                //Verifichiamo se siamo su TFS oppure no
                let isTFS = (loggedUser.username.toUpperCase() === 'TFSSETUP') ? true : false

                cy.decryptLoginPsw(isTFS).then(psw => {
                    //Utente attualmente in
                    if (loggedUser.username === 'RU18362' || loggedUser.username === 'RU17810') {
                        cy.get('input[name="Ecom_User_ID"]').type(user.tutf)
                        cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
                        cy.get('input[type="SUBMIT"]').click()

                        if (!Cypress.env('monoUtenza'))
                            Common.checkUrlEnv()
                        if (!mockedNews && !Cypress.env('isAviva'))
                            cy.wait('@gqlNews')

                        cy.wait('@gqlUserDetails')

                        if (Cypress.env('isSecondWindow'))
                            TopBar.clickSecondWindow()
                    } else {
                        let currentImpersonificationToPerform
                        //Verifichiamo se ho customImpersonification valorizzato
                        debugger
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
                            else
                                currentImpersonificationToPerform = {
                                    "agentId": user.agentId,
                                    "agency": user.agency,
                                }
                        }
                        else
                            currentImpersonificationToPerform = {
                                "agentId": customImpersonification.agentId,
                                "agency": customImpersonification.agency,
                            }

                        cy.impersonification(user.tutf, currentImpersonificationToPerform.agentId, currentImpersonificationToPerform.agency).then(() => {
                            cy.get('input[name="Ecom_User_ID"]').type(user.tutf)
                            cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
                            cy.get('input[type="SUBMIT"]').click()

                            if (!Cypress.env('monoUtenza'))
                                Common.checkUrlEnv()
                            if (!mockedNews && !Cypress.env('isAviva'))
                                cy.wait('@gqlNews')

                            cy.wait('@gqlUserDetails')

                            if (Cypress.env('isSecondWindow'))
                                TopBar.clickSecondWindow()
                        })
                    }
                })
            })
        })
    }
}

export default LoginPage