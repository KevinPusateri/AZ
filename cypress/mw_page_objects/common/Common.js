/// <reference types="Cypress" />

const getIframe = () => cy.get('iframe').its('0.contentDocument.body')

const findIframeChild = (subFrame) => {
    getIframe().find(subFrame, { timeout: 6000 })
        .iframe();

    let iframeChild = getIframe().find(subFrame, { timeout: 6000 })
        .its('0.contentDocument').should('exist');

    return iframeChild.its('body').should('not.be.undefined').then(cy.wrap)
}


/**
 * Subtracts the given number of months from the given date, or the current date if no date is given.
 * @param numOfMonths - The number of months to subtract from the date.
 * @param [date] - The date to subtract the months from. Defaults to the current date.
 * @returns A date object.
 */
function subtractMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);

    return date;
}

/**
 * Add a number of months to a date and return the new date.
 * @param numOfMonths - The number of months to add to the date.
 * @param [date] - The date to add the months to.
 * @returns A date object.
 */
function sumMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);

    return date;
}


/**
 * @class
 * @classdesc Classe Common per varie funzioni Cross Matrix Web
 * @author Andrea 'Bobo' Oboe, Kevin Pusateri & Michele Delle Donne
 */
class Common {

    /**
     * Dal popup clicca sulla prima agenzia per accedere alla pagina
     * @param {object} customImpersonification default empty, if specified select the relative entry in the popup
     * @example let customImpersonification = {
            "agentId": "ARDEMILI1",
            "agency": "010712000"
        }
     */
    static canaleFromPopup(customImpersonification = {}, notWindowOpen = false, agenzia = null, onlyLogin = false) {
        cy.wait(3000)

        if (agenzia !== null) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')
                    cy.get('div[ngclass="agency-row"]').contains(agenzia).click()
                }
            })
        }

        if (Cypress.env('monoUtenza')) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')
                    cy.get('div[ngclass="agency-row"]').first().click()
                }
            })
        }

        if (!onlyLogin) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')
                    cy.get('div[ngclass="agency-row"]').first().click()
                }
            })
        }
        else if (Cypress.env('isSecondWindow') && !Cypress.env('monoUtenza')) {
            cy.get('body').then($body => {
                if ($body.find('div[ngclass="agency-row"]').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')

                    if (Cypress.$.isEmptyObject(customImpersonification))
                        cy.get('div[ngclass="agency-row"]').contains(Cypress.env('multiUtenza')).click()
                    else {
                        //Formattiamo la entry
                        let comp = customImpersonification.agency.substr(0, 2).replace(/^0+/, '')
                        let ag = customImpersonification.agency.substr(2).replace(/^0+/, '')

                        cy.get('div[ngclass="agency-row"]').contains(`${comp}-${ag}`).click()
                    }

                    if (!notWindowOpen)
                        cy.get('@windowOpen').should('be.calledWith', Cypress.sinon.match.string).then(() => {
                            // cy.origin((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('urlSecondWindowTest') : Cypress.env('urlSecondWindowPreprod'), () => {
                            cy.visit((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('urlSecondWindowTest') : Cypress.env('urlSecondWindowPreprod'));
                            // Cypress.on('uncaught:exception', () => false)
                            // })
                        })
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

    /**
     * Verifica che l'url sia corretto in base all'ambiente
     * @todo In ambiente di TEST il check non viene fatto correttamente
     */
    static checkUrlEnv() {
        if (Cypress.env('currentEnv') !== 'TEST') {
            if (!Cypress.env('monoUtenza'))
                cy.url().should('include', Cypress.env('baseUrlPreprod'))
            else
                cy.url().should('include', Cypress.env('urlSecondWindow'))
        }
    }

    /**
     * Effettua il visit url nei vari ambienti in base alle variabili settate in cypress.json
     * Se Preprod fa il visit su urlMWPreprod altrimenti su urlMWTest (vedi cypress.json)
     * @param {boolean} mockedNotifications default true per mockare le Notifice
     * @param {boolean} mockedNews default a true per mockare le News
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
            if (!Cypress.env('isSecondWindow'))
                cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 })
            else
                cy.visit(Cypress.env('urlSecondWindowTest'), { responseTimeout: 31000 })
        }
        else {
            if (!Cypress.env('isSecondWindow'))
                cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
            else
                cy.visit(Cypress.env('urlSecondWindowPreprod'), { responseTimeout: 31000 })
        }
        if (!mockedNews && !Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
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
            cy.get(id).should('exist').scrollIntoView().and('be.visible').click()
        })
    }

    /**
     * Click un elemento dentro l'iframe
     * @param {string} id - tag o attributo del tag
     * @returns   return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').click()
        })
     */
    static clickByAttrAndLblOnIframe(id, label) {
        return getIframe().within(() => {
            cy.get(id).should('exist', { timeout: 5000 }).contains(label).click({ force: true })
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
            cy.get(id).should('exist').scrollIntoView().and('be.visible')
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
     * @example Common.getByIdWithTypeOnIframe('#f-nome', randomChars)
     * @link https://docs.cypress.io/api/commands/type
     */
    static getByIdWithTypeOnIframe(id, text) {
        return getIframe().within(() => {
            cy.get(id).should('exist').and('be.visible').clear().type(text)
        })
    }

    /**
     * Trova l'elemento tramite la sua path all'interno di un iFrame
     * @param {string} path path elemento
     * @returns elemento
     * @example Common.findByIdOnIframe('table[role="grid"]:visible > tbody')
     */
    static findByIdOnIframe(path) {
        return getIframe().find(path, { timeout: 5000 }).should('exist').scrollIntoView();
    }

    /**
     * Trova l'elemento tramite la sua path all'interno di un iFrame ed effettua il click
     * @param {*} path 
     * @returns elemento cliccato per poter effettuare altre operazioni concatenate
     * @example Common.clickFindByIdOnIframe('#eseguiRicerca')
     */
    static clickFindByIdOnIframe(path) {
        return getIframe().find(path, { timeout: 5000 }).should('exist').scrollIntoView().click({ force: true })
    }

    /**
     * Trova l'elemento tramite la sua path all'interno di un iFrame ed effettua il click
     * @param {*} idIframe child frame
     * @param {*} path locator
     * @returns elemento cliccato per poter effettuare altre operazioni concatenate
     * @example Common.clickFindByIdOnIframeChild('iframe[src="cliente.jsp"]', '#eseguiRicerca')
     */
    static clickFindByIdOnIframeChild(idIframe, path) {
        return findIframeChild(idIframe).find(path, { timeout: 5000 }).should('exist').scrollIntoView().click({ force: true })
    }
    /**
     * Gets an object in iframe child by iframe parent
     * @param {*} IframeParent frame locator
     * @param {*} IframeChild - frame locator
     * @returns   findIframeChild(IframeParent).find(IframeChild)
            .iframe();
        })
     */
    static getIFrameChildByParent(IframeParent, IframeChild) {
        findIframeChild(IframeParent).find(IframeChild)
            .iframe();

        let iframe = findIframeChild(IframeParent).find(IframeChild)
            .its('0.contentDocument').should('exist');

        return iframe.its('body').should('not.be.undefined').then(cy.wrap)
    }

    /**
     * Gets an object in iframe by text
     * @param {*} idIframe del  frame
     * @param {string} text - testo
     * @returns findIframeChild(idIframe).within(() => {
            cy.contains(text).should('be.visible').click()
        })
     */
    static getObjByTextOnIframe(text) {
        return getIframe().within(() => {
            cy.contains(text, { timeout: 5000 }).scrollIntoView().should('exist').and('be.visible')
            cy.log('>> object with label [' + text + '] is defined')
        })
    }
    /**
     * Gets an object in iframe By Id
     * @param {*} Id Object
     * @returns  getIframe().find(path, { timeout: 5000 }).should('exist')
        })
     */
    static getObjByIdOnIframe(id) {
        return getIframe().find(id, { timeout: 5000 }).should('exist')
    }
    /**
     * Gets an object in iframe Child by text
     * @param {*} idIframe del child frame
     * @param {string} text - testo
     * @returns findIframeChild(idIframe).within(() => {
            cy.contains(text, { timeout: 5000 }).should('exist').and('be.visible')
        })
     */
    static getObjByTextOnIframeChild(idIframe, text) {
        return findIframeChild(idIframe).within(() => {
            cy.contains(text, { timeout: 5000 }).should('exist').scrollIntoView().and('be.visible')
            cy.log('>> object with label [' + text + '] is defined')
        })
    }

    /**
     * Check if an child object identified by locator and its label is displayed
     * @param {*} idIframe id child frame
     * @param {string} id : id attribute 
     * @param {string} text : text displayed
     * @returns {Object}
     */
    static getObjByIdAndTextOnIframeChild(idIframe, id, text) {
        return findIframeChild(idIframe).find(id).should('exist').then(($obj) => {
            const value = $obj.val().toUpperCase();
            if (value.includes(text.toUpperCase())) {
                cy.log('>> object with id=' + id + ' and label: "' + text + '" is defined')
            }
        })
    }
    /**
    * Check if an img is displayed
    * @param {string} locator : class attribute 
    * @param {string} src : source img file
    */
    static isVisibleImg(locator, src) {

        let check = getIframe().find(locator, { timeout: 9000 }).should('be.visible').should('have.attr', 'src').and('contain', src);
        if (check)
            cy.log('>> img with attribute src=' + src + ' is defined and visible ')

        cy.wait(1000);
    }
    /**
     * Checks if the text associated with an object identified by its locator is displayed
     * @param {string} id : locator attribute 
     * @param {string} text : text displayed
     */
    static isVisibleText(id, text) {
        getIframe().find(id, { timeout: 6000 }).should('exist').scrollIntoView().and('be.visible').then(($tag) => {
            let txt = $tag.text().trim()
            debugger
            cy.log('>> the text value is:  ' + txt)
            if (txt.includes(text))
                cy.log('>> object with text value : "' + text + '" is defined')
            else
                assert.fail('object with text value: "' + text + '" is not defined')
        });
        cy.wait(1000);
    }
    /**
     * Checks if the text associated with an object identified by its locator is displayed
     * @param {*} idIframe id child frame
     * @param {string} id : locator attribute 
     * @param {string} text : text displayed
     */
    static isVisibleTextOnIframeChild(idIframe, id, text) {

        findIframeChild(idIframe).find(id, { timeout: 5000 }).should('exist').scrollIntoView().and('be.visible').then(($tag) => {
            let txt = $tag.text().trim()
            cy.log('>> the text value is:  ' + txt)
            if (txt.includes(text))
                cy.log('>> object with text value : "' + text + '" is defined')
            else
                assert.fail('object with text value: "' + text + '" is not defined')
        });
        cy.wait(1000);
    }
    /**
     * Check if an object identified by tag and its title attribute is displayed
     * @param {string} locator : class attribute 
     * @param {string} label : text displayed
     */
    static isVisibleTitleTag(tag, title) {
        getIframe().find(tag + '[title="' + title + '"]').scrollIntoView().should('be.visible')
    }
    /**
     * Check if an object identified by tag and its title attribute is displayed
     * @param {*} idIframe id child frame
     * @param {string} locator : class attribute 
     * @param {string} label : text displayed
     */
    static isVisibleTitleTagOnIframeChild(idIframe, tag, title) {
        findIframeChild(idIframe).find(tag + '[title="' + title + '"]', { timeout: 5000 }).scrollIntoView().should('be.visible')
    }

    /**
    /**
     * Defined @regexExp a regular expression is verified if the string @str 
     * matches the reg. ex.
     * @param {string} regexExp : regular expression string 
     * @param {string} str : string value
     * @param {string} msg : message
     * @example For date check: Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, val, ' contain a valid date')
     * @returns assert.isTrue(the string @str respects the rule, [message])
     * @link https://docs.cypress.io/guides/references/assertions#TDD-Assertions
     */
    static isValidCheck(regexExp, str, msg) {
        var pattern = new RegExp(regexExp)
        //Tests for a match in a string. It returns true or false.       
        cy.wrap(str).then((validation) => {
            validation = pattern.test(str)
            assert.isTrue(validation, '>> The string: "' + str + '" ' + msg)
        });
    }

    /**
     * It takes a date, a month, and a boolean, and returns a date.
     * @param {Number} date - the day of the month
     * @param {Number} month - number of months to add or subtract
     * @param {Boolean} operation default true add months else substract month
     * @returns The date in the format dd/mm/yyyy
     */
    static setDate(date = undefined, month = undefined, operation = true) {

        const today = new Date();
        if (month !== undefined) {
            if (operation)
                console.log(sumMonths(month, today));
            else
                console.log(subtractMonths(month, today));
        }
        if (date !== undefined)
            today.setDate(date)
        let data = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear()
        return data
    }

    static getUrlBeforeEach() {
        let url
        if (Cypress.env('currentEnv') === 'PREPROD') {
            if (Cypress.env('isSecondWindow'))
                url = Cypress.env('urlSecondWindowPreprod')
            else
                url = Cypress.env('urlMWPreprod')
        } else {
            if (Cypress.env('isSecondWindow'))
                url = Cypress.env('urlSecondWindowTest')
            else
                url = Cypress.env('urlMWTest')
        }

        return url
    }

}

export default Common