/// <reference types="Cypress" />

import Common from '../common/Common'
import HomePage from '../../mw_page_objects/common/HomePage'

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
const interceptPageSales = () => {
    cy.intercept({
        method: 'POST',
        url: '**/sales/**',
    }).as('getSales');
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

const interceptPageNews = () => {
    cy.intercept({
        method: 'GET',
        url: '**/o2o/**'
    }).as('getO2o');

}

const LandingPage = {
    CLIENTS: 'Clients',
    SALES: 'Sales',
    NUMBERS: 'Numbers',
    BACKOFFICE: 'Backoffice',
    NEWS: 'News',
    LE_MIE_INFO: 'Le mie info'
}


const LinkUtilita = {
    CRUSCOTTO_RESILIENCE: 'Cruscotto resilience',
    CASELLA_DI_POSTA_ED_AGENZIA: 'Casella di posta agente ed agenzia',
    QUATTRORUOTE_CALCOLO_VALORE_VEICOLO: 'Quattroruote - Calcolo valore veicolo', //! seconda finestra
    REPORT_ALLIANZ_NOW: 'Report Allianz Now', //! seconda finestra
    INTERROGAZIONI_CENTRALIZZATE: 'Interrogazioni centralizzate',
    BANCHE_DATI_ANIA: 'Banche Dati ANIA',
    GESTIONE_MAGAZZINO_OBU: 'Gestione Magazzino OBU',
    PIATTAFORMA_CONTRATTI_AZ_TELEMATICS: 'Piattaforma contratti AZ Telematics',
    CRUSCOTTO_INSTALLAZIONE_DISPOSITIVO_SATELLITARE: 'Cruscotto Installazione Dispositivo Satellitare',
    MONITOR_SCORING_AZ_BONUS_DRIVE: 'Monitor Scoring AZ Bonus Drive'
}

class TopBar extends HomePage {

    /**
     * Logout
     */
    static logOutMW() {
        cy.get('lib-user-header').should('be.visible')
        cy.get('figure').should('be.visible').find('img[src$="user-placeholder.png"]').click({ force: true });
        cy.contains('Logout').click({ force: true })

        cy.clearCookies();
    }

    /**
     * fa la Ricerca di due lettere random 
     */
    static searchRandom() {
        cy.generateTwoLetters().then(randomChars => {
            cy.get('input[name="main-search-input"]').clear().type(randomChars).click()
        })
    }

    /**
    * @param {string} value - What to search
    */
    static search(value) {
        cy.get('input[name="main-search-input"]').should('exist').and('be.visible').click()
        cy.get('input[name="main-search-input"]').should('exist').and('be.visible').type(value).type('{enter}').wait(2000)
    }

    /**
     * Click link dai suggerimenti
    */
    static searchClickLinkSuggest() {
        cy.get('input[name="main-search-input"]').should('be.visible').click()
        cy.get('lib-shortcut-section-item').should('be.visible')
        cy.get('lib-search-input').find('a:contains("pulini")').click()
    }


    /**
     * Verifica click Buca di ricerca
     */
    static clickBucaRicerca() {
        cy.get('input[name="main-search-input"]').click()
    }

    /**
     * Verifica Atterraggio "Clients"
     */
    static clickClients() {
        interceptPageClients()
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.wait('@getClients', { requestTimeout: 30000 })
        cy.url().should('eq', Common.getBaseUrl() + 'clients/')
        // cy.get('app-donut-chart').should('be.visible')
        // cy.get('app-donut-chart').find('lib-da-link[calldaname="visioneGlobaleClienteDrillDown"]').should('be.visible')

    }

    /**
     * Verifica Atterraggio "Backoffice"
     */
    static clickBackOffice() {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', Common.getBaseUrl() + 'back-office')
    }

    /**
     * Verifica Atterraggio "Numbers"
     */
    static clickNumbers() {
        interceptPageNumbers()
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.wait('@getNumbers', { requestTimeout: 50000 })
        cy.url().should('eq', Common.getBaseUrl() + 'numbers/business-lines')
    }

    /**
     * Verifica Atterraggio "Sales"
     */
    static clickSales() {
        interceptPageSales()
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        // cy.wait('@getSales', { requestTimeout: 50000 })
        cy.url().should('eq', Common.getBaseUrl() + 'sales/')
    }

    /**
     * Verifica Atterraggio "News"
     */
    static clickNews() {
        interceptPageNews()
        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.wait('@getO2o', { requestTimeout: 40000 });
        cy.url().should('eq', Common.getBaseUrl() + 'news/home')
    }

    /**
     * Verifica Atterraggio "Le mie info"
     */
    static clickMieInfo() {
        interceptPageMieInfo()
        cy.get('app-product-button-list').find('a').contains('Le mie info').click()
        cy.wait('@getMieInfo', { requestTimeout: 50000 })
        cy.url().should('eq', Common.getBaseUrl() + 'lemieinfo?info=1')
    }

    /**
     * Click sull'icona calendario
     */
    static clickIconCalendar() {
        cy.get('lib-calendar').click()
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
                break;
            case "SisCo":
                cy.get('lib-incident-container').find('a:contains("SisCo"):visible').click()
                Common.canaleFromPopup()
                getIFrame().find('a:contains("Individuali")').should('be.visible')
                break;
            case "Elenco telefonico":
                cy.get('lib-incident-container').find('a:contains("Elenco telefonico"):visible').click()
                Common.canaleFromPopup()
                getIFrameElencoTelefonico().find('input[name="btnCerca"]').invoke('attr', 'value').should('equal', ' Cerca ')

                break;
        }

    }


    /**
     * Verifica la presenza di tutti i link su Utility
     */
    static checkLinksUtility() {

        const linksUtilita = Object.values(LinkUtilita)

        if (!Cypress.env('monoUtenza'))
            cy.get('lib-utility').find('lib-utility-label').should('have.length', 10).each(($labelCard, i) => {
                expect($labelCard).to.contain(linksUtilita[i])
            })
        else {
            delete LinkUtilita.QUATTRORUOTE_CALCOLO_VALORE_VEICOLO
            delete LinkUtilita.REPORT_ALLIANZ_NOW
            const linksUtilita = Object.values(LinkUtilita)
            cy.get('lib-utility').find('lib-utility-label').should('have.length', 8).each(($labelCard, i) => {
                expect($labelCard).to.contain(linksUtilita[i])
            })
        }

    }
    /**
     * Click su un link dal menu a tendina di Utilità
     * @param {string} page - nome del link 
     */
    static clickLinkOnUtilita(page) {
        if (page === LinkUtilita.CASELLA_DI_POSTA_ED_AGENZIA ||
            page === LinkUtilita.BANCHE_DATI_ANIA ||
            page === LinkUtilita.PIATTAFORMA_CONTRATTI_AZ_TELEMATICS) {
            cy.contains(page).parents('lib-check-user-permissions').find('a[class="ng-star-inserted"]').invoke('removeAttr', 'target').click()
        } else {
            cy.contains(page).click()
        }
        Common.canaleFromPopup()
        switch (page) {
            case LinkUtilita.CRUSCOTTO_RESILIENCE:
                getIFrame().find('#buttonCercaAttivita').should('contain.text', 'Cerca').and('be.visible')
                break;
            case LinkUtilita.CASELLA_DI_POSTA_ED_AGENZIA:
                cy.url().should('include', 'https://login.microsoftonline.com/common')
                break;
            case LinkUtilita.QUATTRORUOTE_CALCOLO_VALORE_VEICOLO:
                getIFrame().find('input[name="Continua"]').should('be.visible')
                break;
            case LinkUtilita.REPORT_ALLIANZ_NOW:
                break;
            case LinkUtilita.INTERROGAZIONI_CENTRALIZZATE:
                getIFrame().find('h4').should('be.visible').and('contain.text', 'Interrogazioni centralizzate')
                break;
            case LinkUtilita.BANCHE_DATI_ANIA:
                cy.url().should('include', 'Auto/InquiryAnia/Ricerca.aspx')
                cy.go('back')
                break;
            case LinkUtilita.GESTIONE_MAGAZZINO_OBU:
                getIFrame().find('#btnSearch').should('be.visible').and('contain.text', 'Cerca')
                break;
            case LinkUtilita.PIATTAFORMA_CONTRATTI_AZ_TELEMATICS:
                break;
            case LinkUtilita.CRUSCOTTO_INSTALLAZIONE_DISPOSITIVO_SATELLITARE:
                getIFrame().find('#btnSearch').should('be.visible').and('contain.text', 'Cerca')
                break;
            case LinkUtilita.MONITOR_SCORING_AZ_BONUS_DRIVE:
                getIFrame().find('.title').should('be.visible').and('contain.text', 'Cruscotto Scoring Allianz Bonus Drive')
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
        cy.get('lib-user-role-container').should('be.visible').and('contain.text', 'DELEGATO ASSICURATIVO')
        if (!Cypress.env('monoUtenza'))
            cy.contains('Ci sono altri profili collegati')
        cy.contains('Cambio password')
        cy.contains('Configurazione stampanti')
        cy.contains('Impostazioni di agenzia')

    }

    /**
     * 
     * @param {string} page - Se specifichi nome pagina per atterrare -
     * page: Clients, Sales, Numbers, Backoffice, News, Le mie info - 
     * altrimenti va sul link Utilià
     */
    static clickIconSwitchPage(page) {
        cy.get('lib-switch-button').click().wait(500)
        cy.get('.lib-switch-button-list-column').should('have.length', 6)
        switch (page) {
            case LandingPage.CLIENTS:
                interceptPageClients()
                cy.get('lib-switch-button-list').contains('Clients').click()
                cy.url().should('eq', Common.getBaseUrl() + 'clients/')
                cy.wait('@getClients', { requestTimeout: 30000 })
                break;
            case LandingPage.SALES:
                interceptPageSales()
                cy.get('lib-switch-button-list').contains('Sales').click()
                cy.wait('@getSales', { requestTimeout: 50000 })
                cy.url().should('eq', Common.getBaseUrl() + 'sales/')
                break;
            case LandingPage.NUMBERS:
                interceptPageNumbers()
                cy.get('lib-switch-button-list').contains('Numbers').click()
                cy.wait('@getNumbers', { requestTimeout: 50000 })
                cy.url().should('eq', Common.getBaseUrl() + 'numbers/business-lines')
                break;
            case LandingPage.BACKOFFICE:
                cy.get('lib-switch-button-list').contains('Backoffice').click()
                cy.url().should('eq', Common.getBaseUrl() + 'back-office')
                break;
            case LandingPage.NEWS:
                interceptPageNews()
                cy.get('lib-switch-button-list').contains('News').click()
                cy.wait('@getO2o', { requestTimeout: 40000 });
                cy.url().should('eq', Common.getBaseUrl() + 'news/home')
                break;
            case LandingPage.LE_MIE_INFO:
                interceptPageMieInfo()
                cy.get('lib-switch-button-list').contains('Le mie info').click()
                cy.wait('@getMieInfo', { requestTimeout: 50000 })
                cy.url().should('eq', Common.getBaseUrl() + 'lemieinfo?info=1')
                break;
            default:
                cy.contains('Utilità').click()


        }
    }

    /**
     * Verifica la presenza dei link sull'icona incident
     */
    static checkLinksIncident() {
        const linksIncident = [
            'SRM',
            'SisCo',
            'Elenco telefonico'
        ]
        cy.get('lib-utility-label').find('a').each(($link, i) => {
            expect($link.text().trim()).to.include(linksIncident[i]);
        })
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
        cy.get('button[class^="nx-modal__close"]').click()
    }

    /**
     * Click logo Matrix -> torna indietro alla HomePage
     */
    static clickMatrixHome() {
        cy.get('a[href="/matrix/"]').click()
    }

    /**
     * Permettere di aprire la seconda finestra di MW
     */
    static clickSecondWindow() {
        if (Cypress.env('isSecondWindow') && Cypress.env('monoUtenza')) {
            cy.get('a[target="MatrixF2"]').should('exist').invoke('removeAttr', 'target').click()
        }else{
            cy.get('lib-header-right').should('be.visible').within(()=>{
                cy.get('nx-icon[name="launch"]').click()
            })
            Common.canaleFromPopup(true)
        }
    }
}

export default TopBar