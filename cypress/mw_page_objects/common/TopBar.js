/// <reference types="Cypress" />

import Common from '../common/Common'
import HomePage from '../../mw_page_objects/common/HomePage'

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


class TopBar extends HomePage {

    static logOutMW() {

        const delayBetweenTests = 2000

        cy.get('body').then($body => {
            if ($body.find('.user-icon-container').length > 0) {
                cy.get('.user-icon-container').click();
                cy.wait(1000).contains('Logout').click()
                cy.wait(delayBetweenTests)
            }
        });
        cy.clearCookies();
    }

    /**
    * @param {string} value - What to search
    */
    static search(value) {
        cy.get('input[name="main-search-input"]').type(value).type('{enter}').wait(2000)
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
        cy.wait('@getSales', { requestTimeout: 50000 })
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

    static clickIconCalendar() {
        cy.get('lib-calendar').click()
    }

    static clickIconIncident() {
        cy.get('lib-incident').click()
    }

    static clickIconNotification() {
        cy.get('lib-notification-header').click()
    }

    static clickIconUser() {
        cy.get('lib-user-header').click()
    }

    /**
     * 
     * @param {string} page - Se specifichi nome pagina per atterrare -
     * page: Clients, Sales, Numbers, Backoffice, News, Le mie info
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
        }
    }

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
        const linksNotificaion = [
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
        cy.get('lib-notification-settings-container').find('lib-notification-settings-item').each(($link, i) => {
            expect($link.text().trim()).to.include(linksNotificaion[i]);
        })
        cy.get('button[class^="nx-modal__close"]').click()
    }


}

export default TopBar