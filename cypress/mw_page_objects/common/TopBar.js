/// <reference types="Cypress" />

import Common from '../common/Common'
import HomePage from '../../mw_page_objects/common/HomePage'
import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'

//#region IFrame
const getIFrame = () => {

    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameElencoTelefonico = () => {
    getIFrame().find('iframe[src="/phoneBook/searchInterniWithCompanyDA.do"]')
        .iframe();

    let iframeFolder = getIFrame().find('iframe[src="/phoneBook/searchInterniWithCompanyDA.do"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion

//#region intercept
const interceptPageSales = () => {
    cy.intercept({
        method: 'POST',
        url: '**/sales/**',
    }).as('getSales');
    cy.intercept('POST', '**/graphql', (req) => {
        aliasQuery(req, 'getExtractedSferaReceipts')
    })
}

const interceptPageMieInfo = () => {
    cy.intercept({
        method: 'POST',
        url: '**/lemieinfo/**',
    }).as('getMieInfo');
}

const interceptPageClients = () => {
    cy.intercept({
        method: 'POST',
        url: '**/clients/**',
    }).as('getClients');
}

const interceptPageNumbers = () => {
    cy.intercept({
        method: 'POST',
        url: '**/numbers/**',
    }).as('getNumbers');

}

//#endregion intercept

const LandingPage = {
    CLIENTS: 'Clients',
    SALES: 'Sales',
    NUMBERS: 'Numbers',
    BACKOFFICE: 'Backoffice',
    NEWS_E_INFO: 'News e Info'
}

const LinkUtilita = {
    CRUSCOTTO_RESILIENCE: 'Cruscotto resilience',
    CASELLA_DI_POSTA_ED_AGENZIA: 'Casella di posta agente ed agenzia',
    QUATTRORUOTE_CALCOLO_VALORE_VEICOLO: 'Quattroruote - Calcolo valore veicolo',
    REPORT_ALLIANZ_NOW: 'Report Allianz Now',
    INTERROGAZIONI_CENTRALIZZATE: 'Interrogazioni centralizzate',
    BANCHE_DATI_ANIA: 'Banche Dati ANIA',
    GESTIONE_MAGAZZINO_OBU: 'Gestione Magazzino OBU',
    PIATTAFORMA_CONTRATTI_AZ_TELEMATICS: 'Piattaforma contratti AZ Telematics',
    CRUSCOTTO_INSTALLAZIONE_DISPOSITIVO_SATELLITARE: 'Cruscotto Installazione Dispositivo Satellitare',
    MONITOR_SCORING_AZ_BONUS_DRIVE: 'Monitor Scoring AZ Bonus Drive',
    GESTIONE_CERTIFICATI: 'Gestione certificati',
    deleteKey: function (keys) {
        debugger
        if (!keys.interrogazioniCentralizzateEnabled) delete this.INTERROGAZIONI_CENTRALIZZATE
        if (!keys.PIATTAFORMA_CONTRATTI_AZ_TELEMATICS) delete this.PIATTAFORMA_CONTRATTI_AZ_TELEMATICS
        if (!keys.MONITOR_SCORING_AZ_BONUS_DRIVE) delete this.MONITOR_SCORING_AZ_BONUS_DRIVE
        if (!keys.REPORT_ALLIANZ_NOW) delete this.REPORT_ALLIANZ_NOW
        if (!keys.obuEnabled) delete this.GESTIONE_MAGAZZINO_OBU
        if (!keys.satellitareEnabled) delete this.CRUSCOTTO_INSTALLAZIONE_DISPOSITIVO_SATELLITARE
        if (!keys.GESTIONE_CERTIFICATI) delete this.GESTIONE_CERTIFICATI
    }
}

class TopBar extends HomePage {

    /**
     * Funzione che permette di effettuare il Logout
     */
    static logOutMW() {

        if (Cypress.env('isSecondWindow')) {
            if (Cypress.env('currentEnv') === 'PREPROD')
                cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
            else
                cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 })
        }

        cy.get('lib-user-header').should('be.visible')
        cy.get('figure').should('be.visible').find('img[src$="user-placeholder.png"]:visible').click({ force: true });
        cy.get('lib-user-header-popover-container').should('be.visible').within(() => {
            cy.contains('Logout').click({ force: true })
        })


        cy.clearCookies();
    }

    /**
     * Ricerca di due lettere random e verifica atterraggio in Landing Ricerca
     */
    static searchRandom() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.generateTwoLetters().then(randomChars => {
            cy.get('input[name="main-search-input"]').should('exist').and('be.visible').click()
            cy.get('input[name="main-search-input"]').should('exist').and('be.visible').type(randomChars).type('{enter}').wait(2000)

            cy.wait('@gqlSearchClient', { timeout: 30000 });
            cy.get('lib-client-item').should('be.visible')

            cy.screenshot(`Ricerca per ${randomChars} effettuata`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        })
    }

    /**
     * Ricerca un valore stabilito dalla serch bar
     * @param {string} value - Cosa cercare nella barra di ricerca in TopBar
     */
    static search(value) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.get('input[name="main-search-input"]').should('exist').and('be.visible').click()
        cy.get('input[name="main-search-input"]').should('exist').and('be.visible').type(value).type('{enter}').wait(2000)
        cy.contains('clients').click()

        cy.wait('@gqlSearchClient', { timeout: 30000 });
        cy.screenshot('Ricerca ' + value + ' effettuata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * It searches for a value in a search bar, waits for the results to appear, then clicks on the first
     * result from the suggested links
     * 
     * @param value - the value to be searched
     */
    static searchAndClickSuggestedNavigations(value) {
        cy.get('input[name="main-search-input"]').click().type(value).wait(3000)
        cy.screenshot(`Ricerca ${value} effettuata`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        cy.get('div[class="results-main-search-container ng-star-inserted"]').within(($results) => {
            //Clicchiamo sul risultato
            $results.find('div:contains("' + value + '")').trigger('click')
        })

        //Vediamo eventuale popup del canale
        Common.canaleFromPopup()
    }

    /**
     * Verifica click Buca di ricerca
     */
    static clickBucaRicerca() {
        cy.get('input[name="main-search-input"]').click()
        cy.screenshot('Verifica Buca di Ricerca', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica Atterraggio "Clients"
     */
    static clickClients() {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { timeout: 30000 })
        cy.url().should('eq', Common.getBaseUrl() + 'clients/')
        cy.get('app-donut-chart').should('be.visible')
        cy.get('app-donut-chart').find('lib-da-link[calldaname="visioneGlobaleClienteDrillDown"]').should('be.visible')
        cy.screenshot('Verifica Atterraggio "Clients"', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica Atterraggio "Backoffice"
     */
    static clickBackOffice() {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', Common.getBaseUrl() + 'back-office')
        cy.screenshot('Verifica Atterraggio "Backoffice"', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica Atterraggio "Numbers"
     */
    static clickNumbers() {
        interceptPageNumbers()
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.wait('@getNumbers', { timeout: 50000 })
        cy.url().should('include', Common.getBaseUrl() + 'numbers')
        cy.screenshot('Verifica atterraggio "Numbers"', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica Atterraggio "Sales"
     */
    static clickSales() {
        interceptPageSales()
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        // cy.wait('@getSales', { timeout: 50000 })
        cy.wait('@gqlgetExtractedSferaReceipts', { timeout: 60000 })
        cy.url().should('eq', Common.getBaseUrl() + 'sales/')
        cy.screenshot('Verifica atterraggio "Sales"', { capture: 'fullPage' }, { overwrite: true })
    }


    /**
     * Verifica Atterraggio "News e Info"
     */
    static clickNewsInfo() {
        interceptPageMieInfo()
        cy.get('app-product-button-list').find('a').contains('News e Info').click()
        cy.wait('@getMieInfo', { timeout: 50000 })
        cy.url().should('eq', Common.getBaseUrl() + 'lemieinfo')
        cy.screenshot('Verifica atterraggio "News e Info"', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica assenza link alla pagina
     * @param {string} page 
     */
    static checkNotExistLanding(page) {
        cy.get('app-product-button-list').find('a').should('not.contain.text', page)
    }

    /**
     * Click sull'icona calendario
     */
    static clickIconCalendar() {
        cy.get('lib-calendar').click()
        cy.screenshot('Click Calendario', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click sull'icona incident
     */
    static clickIconIncident() {
        cy.get('lib-incident').click()
    }

    /**
     * Click link dal menu a tendina
     * @param {string} page - nome del link 
     */
    static clickLinkOnIconIncident(page) {
        this.clickIconIncident()
        switch (page) {
            case "SRM Online":
                cy.get('lib-incident-container').find('a:contains("SRM Online"):visible').click()
                Common.canaleFromPopup()
                getIFrame().find('#ext-element-10:contains("Dashboard")').should('be.visible')
                cy.screenshot(`Verifica accesso a ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case "SisCo":
                cy.get('lib-incident-container').find('a:contains("SisCo"):visible').click()
                Common.canaleFromPopup()
                getIFrame().find('a:contains("Individuali")').should('be.visible')
                cy.screenshot(`Verifica accesso a ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case "Elenco telefonico":
                cy.get('lib-incident-container').find('a:contains("Elenco telefonico"):visible').click()
                Common.canaleFromPopup()
                getIFrameElencoTelefonico().find('input[name="btnCerca"]').invoke('attr', 'value').should('equal', ' Cerca ')
                cy.screenshot(`Verifica accesso a ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
        }
    }

    /**
     * Verifica la presenza di tutti i link su Utility
     * @param {object} keys 
     */
    static checkLinksUtility(keys) {
        LinkUtilita.deleteKey(keys)
        const linksUtilita = Object.values(LinkUtilita)

        cy.get('lib-utility').find('lib-utility-label').each(($labelCard, i) => {
            expect($labelCard).to.contain(linksUtilita[i])
        })

    }

    /**
     * Click su un link dal menu a tendina di Utilità
     * @param {string} page - nome del link 
     */
    static clickLinkOnUtilita(page) {
        if (page === LinkUtilita.CASELLA_DI_POSTA_ED_AGENZIA ||
            page === LinkUtilita.BANCHE_DATI_ANIA ||
            page === LinkUtilita.QUATTRORUOTE_CALCOLO_VALORE_VEICOLO ||
            page === LinkUtilita.PIATTAFORMA_CONTRATTI_AZ_TELEMATICS) {
            cy.get('lib-switch-button-utility').should('be.visible').within(() => {
                cy.contains(page).should('be.visible').parents('lib-check-user-permissions').find('a[class="ng-star-inserted"]').invoke('removeAttr', 'target').click()
            })
        } else if (page === LinkUtilita.CASELLA_DI_POSTA_ED_AGENZIA) {
            cy.window().then(win => {
                cy.stub(win, 'open').callsFake((url) => {
                    return win.open.wrappedMethod.call(win, url, '_self');
                }).as('Open');
            })
            cy.pause()
            cy.contains(page).click()
            cy.get('@Open')
        } else {
            cy.get('lib-switch-button-utility').should('be.visible').within(() => {
                cy.contains(page).click()
            })
        }
        Common.canaleFromPopup()
        switch (page) {
            case LinkUtilita.CRUSCOTTO_RESILIENCE:
                getIFrame().find('#buttonCercaAttivita').should('contain.text', 'Cerca').and('be.visible')
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinkUtilita.CASELLA_DI_POSTA_ED_AGENZIA:
                cy.url().should('include', 'https://login.microsoftonline.com/common')
                cy.get('input[value="Submit"]').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                cy.go('back')
                break;
            case LinkUtilita.QUATTRORUOTE_CALCOLO_VALORE_VEICOLO:
                cy.get('#form_auto').should('be.visible')
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                cy.go('back')
                break;
            case LinkUtilita.REPORT_ALLIANZ_NOW:
                break;
            case LinkUtilita.INTERROGAZIONI_CENTRALIZZATE:
                getIFrame().find('h4').should('be.visible').and('contain.text', 'INTERROGAZIONI CENTRALIZZATE ')
                getIFrame().find('table').should('be.visible')
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinkUtilita.BANCHE_DATI_ANIA:
                cy.url().should('include', 'Auto/InquiryAnia/Ricerca.aspx')
                cy.get('form').should('be.visible').within(() => {
                    cy.get('input[value="Cerca"]').should('be.visible')
                })
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                cy.go('back')
                break;
            case LinkUtilita.GESTIONE_MAGAZZINO_OBU:
                getIFrame().find('#btnSearch').should('be.visible').and('contain.text', 'Cerca')
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinkUtilita.PIATTAFORMA_CONTRATTI_AZ_TELEMATICS:
                break;
            case LinkUtilita.CRUSCOTTO_INSTALLAZIONE_DISPOSITIVO_SATELLITARE:
                getIFrame().find('#btnSearch').should('be.visible').and('contain.text', 'Cerca')
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinkUtilita.MONITOR_SCORING_AZ_BONUS_DRIVE:
                getIFrame().find('.title').should('be.visible').and('contain.text', 'Cruscotto Scoring Allianz Bonus Drive')
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinkUtilita.GESTIONE_CERTIFICATI:
                getIFrame().find('app-home-page-container').should('be.visible')
                getIFrame().find('nx-card').should('be.visible')
                cy.screenshot(`Verifica link Utilità ${page}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
        }

    }

    /**
     * Click sull'icona notifiche
     */
    static clickIconNotification() {
        cy.get('lib-notification-header').click()
        cy.get('lib-notification-list').should('be.visible')

    }

    /**
     * Click sull'icona User
     */
    static clickIconUser() {
        cy.get('lib-user-header').click()
        cy.get('lib-user-name-container').should('be.visible')
        if (!Cypress.env('isAvivaBroker'))
            cy.get('lib-user-role-container').should('be.visible').and('contain.text', 'DELEGATO ASSICURATIVO')
        if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            cy.contains('Ci sono altri profili collegati')
        cy.contains('Cambio password')
        cy.contains('Configurazione stampanti')
        cy.contains('Impostazioni di agenzia')
    }

    /**
     * Verifica icone in SwithPage/HomePage
     * @param {string} page - Se specifichi nome pagina per atterrare -
     * page: Clients, Sales, Numbers, Backoffice, News, Le mie info - 
     * altrimenti va sul link Utilià
     */
    static clickIconSwitchPage(page) {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('.lib-switch-button-list-column').should('have.length', 5)
        switch (page) {
            case LandingPage.CLIENTS:
                interceptPageClients()
                cy.get('lib-switch-button-list').contains('Clients').click()
                cy.url().should('eq', Common.getBaseUrl() + 'clients/')
                cy.wait('@getClients', { timeout: 30000 })
                break;
            case LandingPage.SALES:
                interceptPageSales()
                cy.get('lib-switch-button-list').contains('Sales').click()
                cy.wait('@getSales', { timeout: 50000 })
                cy.url().should('eq', Common.getBaseUrl() + 'sales/')
                break;
            case LandingPage.NUMBERS:
                interceptPageNumbers()
                cy.get('lib-switch-button-list').contains('Numbers').click()
                cy.wait('@getNumbers', { timeout: 50000 })
                cy.url().should('eq', Common.getBaseUrl() + 'numbers/business-lines')
                break;
            case LandingPage.BACKOFFICE:
                cy.get('lib-switch-button-list').contains('Backoffice').click()
                cy.url().should('eq', Common.getBaseUrl() + 'back-office')
                break;
            case LandingPage.NEWS_E_INFO:
                interceptPageMieInfo()
                cy.get('lib-switch-button-list').contains('News e Info').click()
                cy.wait('@getMieInfo', { timeout: 50000 })
                cy.url().should('eq', Common.getBaseUrl() + 'lemieinfo')
                break;
            default:
                cy.contains('Utilità').click()
        }
    }

    /**
     * Verifica la presenza dei link sull'icona incident
     * @param {object} keys 
     */
    static checkLinksIncident(keys) {

        const LinksIncident = {
            SRM: 'SRM Online',
            SERVICENOW_NUOVA_RICHIESTA: 'ServiceNow - Nuova richiesta',
            SERVICENOW_ELENCO_RICHIESTE: 'ServiceNow - Elenco richieste',
            SISCO: 'SisCo',
            ELENCO_TELEFONICO: 'Elenco telefonico',
            deleteKey: function (keys) {
                if (!keys.srmOnlineEnabled) delete this.SRM
                if (!keys.siscoEnabled) delete this.SISCO
                if (!keys.SERVICENOW || (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))) {
                    delete this.SERVICENOW_NUOVA_RICHIESTA
                    delete this.SERVICENOW_ELENCO_RICHIESTE
                }
                if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.ELENCO_TELEFONICO
            }
        }
        LinksIncident.deleteKey(keys)
        const linksIncident = Object.values(LinksIncident)
        if (linksIncident.length > 1)
            cy.get('lib-utility-label').find('a').each(($link, i) => {
                expect($link.text().trim()).to.include(linksIncident[i]);
            })
        else {
            cy.get('lib-incident-container').should('include.text', 'Nessun messaggio presente')
        }

    }

    /**
     * Clicca la rotellina e verifica
     * la presenza di tutte le informazioni di notifica 
     */
    static checkNotificheEvidenza() {
        cy.wait(3000).get('lib-notification-settings').click()
        const linksNotification = [
            'Contabilità',
            'Portafoglio',
            'Sinistri',
            'Digital Me',
            'VPS',
            'Richieste SisCo',
            'Richieste SRM',
            'E-commerce',
            'AllianzNow',
            'Cliente',
            'Resi Pos.',
            'Gestione Attività'
        ]
        cy.wait(3000)
        cy.get('lib-notification-settings-container').should('be.visible').find('lib-notification-settings-item:visible').each(($link, i) => {
            expect($link.text().trim()).to.include(linksNotification[i]);
        })

        cy.screenshot(`Check Notifiche Evidenza`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        cy.get('button[class^="nx-modal__close"]').click()
    }

    /**
     * Click logo Matrix -> torna indietro alla HomePage
     */
    static clickMatrixHome() {
        cy.get('a[href="/matrix/"]').click()
    }

    /**
     * Permettere di aprire la seconda finestra di MW, selezionando il relativo canale
     * @param {object} customImpersonification default empty, if specified select the relative entry in canaleFromPopup
     * @example let customImpersonification = {
            "agentId": "ARDEMILI1",
            "agency": "010712000"
        }
     */
    static clickSecondWindow(customImpersonification = {}) {

        cy.window().then(win => {
            cy.stub(win, 'open').as('windowOpen');
        })

        cy.get('lib-header-right').should('be.visible').within(() => {
            cy.get('nx-icon[name="launch"]').click()
        })

        if ((Cypress.env('isSecondWindow') && Cypress.env('monoUtenza')) || (Cypress.env('isAviva') && Cypress.$.isEmptyObject(customImpersonification))) {
            cy.get('@windowOpen').should('be.calledWith', Cypress.sinon.match.string).then(() => {
                cy.origin((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('urlSecondWindowTest') : Cypress.env('urlSecondWindowPreprod'), () => {
                    cy.visit((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('urlSecondWindowTest') : Cypress.env('urlSecondWindowPreprod'));
                })
            })
        } else
            Common.canaleFromPopup(customImpersonification)
    }
}

export default TopBar