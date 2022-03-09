/// <reference types="Cypress" />

const getIframe = () => cy.get('iframe').its('0.contentDocument.body')


class Common {

    /**
     * Dal popup clicca sulla prima agenzia per accedere alla pagina
     * @param {boolean} chooseUtenza : default a false, effettua l'accesso alla seconda finestra dalla homepage
     */
    static canaleFromPopup(chooseUtenza = false) {
        cy.wait(3000)

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
            else {
                if (Cypress.env('currentEnv') === 'TEST')
                    url = Cypress.env('urlSecondWindowTest')
                else
                    url = Cypress.env('urlSecondWindowPreprod')

            }
        return url;
    }

    static checkUrlEnv() {
        //TODO In ambiente di TEST il check non viene fatto correttamente
        if (Cypress.env('currentEnv') !== 'TEST') {
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
        cy.intercept(/cdn.igenius.ai/, 'ignore').as('igenius')
        cy.intercept(/i.ytimg.com/, 'ignore').as('ytimg')

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

        if (Cypress.env('currentEnv') === 'TEST') {
            if (!Cypress.env('monoUtenza'))
                cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 })
            else
                cy.visit(Cypress.env('urlSecondWindowTest'), { responseTimeout: 31000 })
        }
        else {
            if (!Cypress.env('monoUtenza'))
                cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
            else
                cy.visit(Cypress.env('urlSecondWindowPreprod'), { responseTimeout: 31000 })
        }
        if (!mockedNews && !Cypress.env('isAviva'))
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


    static findByIdOnIframe(id) {
        return getIframe().find(id)
    }

    static clickFindByIdOnIframe(id) {
        return getIframe().find(id).click()
    }

    /**
     * Defined @regexExp a regular expression is verified if the string @str 
     * matches the reg. ex.
     * @param {string} regexExp : regular expression string 
     * @param {string} str : string value
     * @param {string} msg : message
     * @returns assert.isTrue(value, [message])
     * @link https://docs.cypress.io/guides/references/assertions#TDD-Assertions
     */
    static isValidCheck(regexExp, str, msg)
    {
        var pattern = new RegExp(regexExp)
        //Tests for a match in a string. It returns true or false.       
        cy.wrap(str).then((validation) => {
            validation = pattern.test(str)                          
            assert.isTrue(validation,'>> The string: "' +str+ '" ' + msg)
        });
    }
}



export default Common