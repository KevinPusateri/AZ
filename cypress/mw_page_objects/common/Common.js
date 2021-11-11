/// <reference types="Cypress" />

const getIframe = () => cy.get('iframe').its('0.contentDocument.body')


class Common {

    /**
     * 
     * dal popup clicca sulla prima agenzia per accedere alla pagina
     * @param {boolean} chooseUtenza : default a false, effettua l'accesso alla seconda finestra dalla homepage
     */
    static canaleFromPopup(chooseUtenza = false) {
        cy.wait(1000)

        if (Cypress.env('monoUtenza')) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')
                    cy.get('div[ngclass="agency-row"]').first().click()
                }
            })
        }

        // Scegli utenza se siamo su finestra principale e procediamo dall'icona sulla seconda finestra
        if (Cypress.env('isSecondWindow') && !Cypress.env('monoUtenza') && chooseUtenza) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')

                    cy.get('div[ngclass="agency-row"]').contains(Cypress.env('multiUtenza')).click()
                    cy.window().then(win => {
                        cy.stub(win, 'open').as('windowOpen');
                    });
                    cy.get('@windowOpen').should('be.calledWith', Cypress.sinon.match.string).then(stub => {
                        cy.visit(stub.args[0][0]);
                        stub.restore;
                    });
                }
            })
        }

        // Scegli utenza se siamo su finestra principale multiutenza
        if (Cypress.env('isSecondWindow') && !Cypress.env('monoUtenza') && chooseUtenza) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')

                    cy.get('div[ngclass="agency-row"]').contains(Cypress.env('multiUtenza')).click()
                }
            })
        }

        if (!Cypress.env('isSecondWindow') && !Cypress.env('monoUtenza') && !chooseUtenza) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')
                    cy.get('div[ngclass="agency-row"]').first().click()
                }
            })
        }

    }

    /**
     * Resituisce l'url in base all'ambiente(env) 
     * @returns {string} indirizzo url
     */
    static getBaseUrl() {
        let url
        if (Cypress.env('currentEnv') === 'TEST')
            url = Cypress.env('baseUrlTest')
        else
        if (!Cypress.env('monoUtenza'))
            url = Cypress.env('baseUrlPreprod')
        else
            url = Cypress.env('urlSecondWindow')

        return url;
    }

    /**
     * Se Preprod fa should su baseUrlPreprod altrimenti su baseUrlTest
     */
    static checkUrlEnv() {
        if (Cypress.env('currentEnv') === 'TEST')
            cy.url().should('include', Cypress.env('baseUrlTest'))
        else {
            if (!Cypress.env('monoUtenza'))
                cy.url().should('include', Cypress.env('baseUrlPreprod'))
            else
                cy.url().should('include', Cypress.env('urlSecondWindow'))
        }
    }

    /**
     * Se Preprod fa il visit su urlMWPreprod altrimenti su urlMWTest
     */
    static visitUrlOnEnv(mockedNotifications = true, mockedNews = true) {
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
                if (req.body.operationName.includes('news')) {
                    req.alias = 'gqlNews'
                    req.res
                }
            })
        }

        if (Cypress.env('currentEnv') === 'TEST')
            cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 })
        else {
            if (!Cypress.env('monoUtenza'))
                cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
            else
                cy.visit(Cypress.env('urlSecondWindow'), { responseTimeout: 31000 })
        }
        if (!mockedNews)
            cy.wait('@gqlNews')
    }


    /**
     * Click un elemento dentro l'iframe
     * @param {string} id - tag o attributo del tag
     * @returns   return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').click()
        })
     */
    static clickByIdOnIframe(id) {
        return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').click()
        })
    }

    /**
     * Click un elemento
     * @param {string} id - tag o attributo del tag
     * @returns cy.get(id).should('exist').and('be.visible').click()
     */
    static clickById(id) {
        return cy.get(id).should('exist').and('be.visible').click()
    }


    /**
     * Click su un testo dentro l'iframe
     * @param {string} text - testo
     * @returns  getIframe().within(() => {
            cy.contains(text).should('be.visible').click()
        })
     */
    static clickByTextOnIframe(text) {
        return getIframe().within(() => {
            cy.contains(text).should('be.visible').click()
        })
    }

    /**
     * Click su un testo
     * @param {string} text - testo
     * @returns  cy.contains(text).should('be.visible').click()
     */
    static clickByText(text) {
        return cy.contains(text).should('be.visible').click()
    }


    /**
     * Get elemento da un iframe
     * @param {string} id - tag o attributo del tag
     * @returns  getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible')
        })
    */
    static getByIdOnIframe(id) {
        return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible')
        })
    }

    /**
     * Get elemento
     * @param {string} id - tag o attributo del tag
     * @returns  cy.get(id).should('exist').and('be.visible')
     * @example Common.getById('#body'), Common.getById('input['input']', Common.getById('input['a[href="link"]'])
     * @link https://docs.cypress.io/api/commands/get#Selector
     */
    static getById(id) {
        return cy.get(id).should('exist').and('be.visible')
    }

    /**
     * Get elemento
     * @param {string} id - tag o attributo del tag
     * @param {string} idFind - tag o attributo del tag
     * @returns  return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').find(idFind)
        })
     * @example cy.get('#parent').find('li')
     * @link https://docs.cypress.io/api/commands/find
     */
    static getByIdAndFindOnIframe(id, idFind) {
        return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').find(idFind)
        })
    }

    /**
     * Get elemento
     * @param {string} id - tag o attributo del tag
     * @returns cy.get(id).should('exist').and('be.visible').find(idFind)
     * @example cy.get('#parent').find('li')
     * @link https://docs.cypress.io/api/commands/find
     */
    static getByIdAndFind(id, idFind) {
        return cy.get(id).should('exist').and('be.visible').find(idFind)
    }

    /**
     * Get elemento
     * @param {string} i - tag o attributo del tag
     * @param {string} text - testo
     * @returns cy.get(id).should('exist').and('be.visible').clear().type(text)

     * @example Common.getByIdWithType('#parent','Ciao, come va?')
     * @link https://docs.cypress.io/api/commands/type
     */
    static getByIdWithType(id, text) {
        return cy.get(id).should('exist').and('be.visible').clear().type(text)
    }

    /**
     * Get elemento Da un Iframe
     * @param {string} i - tag o attributo del tag
     * @param {string} text - testo
     * @returns getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').clear().type(text)
        })
     * @example Common.getByIdWithTypeOnIframe('#parent','Ciao, come va?')
     * @link https://docs.cypress.io/api/commands/type
     */
    static getByIdWithTypeOnIframe(id, text) {
        return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').clear().type(text)
        })
    }
}



export default Common