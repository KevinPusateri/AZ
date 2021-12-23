/// <reference types="Cypress" />
import Common from "../common/Common";
import Numbers from "../navigation/Numbers";
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const interceptGetAgenziePDF = () => {
    cy.intercept({
        method: 'GET',
        url: '**/dacommerciale/**'
    }).as('getDacommercialeGET');
    cy.intercept({
        method: 'POST',
        url: '**/dacommerciale/**'
    }).as('getDacommercialePOST');
}

const interceptGetPentahoDA = () => {
    cy.intercept({
        method: 'GET',
        url: '**/pentahoDA/**'
    }).as('pentahoDA');
    cy.intercept({
        method: 'GET',
        url: '**/pentahoDama/**'
    }).as('pentahoDama');
}

const LinksBurgerMenu = {
    HOME_NUMBERS: 'Home Numbers',
    MONITORAGGIO_FONTI: 'Monitoraggio Fonti',
    MONITORAGGIO_CARICO: 'Monitoraggio Carico',
    MONITORAGGIO_CARICO_FONTE: 'Monitoraggio Carico per Fonte',
    X_ADVISOR: 'X - Advisor',
    INCENTIVAZIONE: 'Incentivazione',
    INCENTIVAZIONE_RECRUITING: 'Incentivazione Recruiting',
    ANDAMENTI_TECNICI: 'Andamenti Tecnici',
    ESTRAZIONI_AVANZATE: 'Estrazioni Avanzate',
    SCARICO_DATI: 'Scarico Dati', ///SSSS
    INDICI_DIGITALI: 'Indici Digitali',
    NEW_BUSINESS_DANNI: 'New Business Danni',
    NEW_BUSINESS_ULTRA_CASA_PATRIMONIO: 'New Business Ultra Casa e Patrimonio',
    NEW_BUSINESS_ULTRA_SALUTE: 'Ultra Salute',
    NEW_BUSINESS_VITA: 'New Business Vita',
    NEW_BUSINESS_ALLIANZ1: 'New Business Allianz1',
    MONITORAGGIO_PTF_DANNI: 'Monitoraggio PTF Danni',
    MONITORAGGIO_RISERVE_VITA: 'Monitoraggio Riserve Vita',
    RETENTION_MOTOR: 'Retention Motor',
    RETENTION_RAMI_VARI: 'Retention Rami Vari',
    MONITORAGGIO_ANDAMENTO_PREMI: 'Monitoraggio Andamento Premi',
    MONITORAGGIO_RICAVI_AGENZIA: 'Monitoraggio Ricavi d\'Agenzia',
    CAPITALE_VITA_SCADENZA: 'Capitale Vita Scadenza',
    deleteKey: function(keys) {  
        if(!keys.MONITORAGGIO_FONTI) delete this.MONITORAGGIO_FONTI
        if(!keys.MONITORAGGIO_CARICO) delete this.MONITORAGGIO_CARICO
        if(!keys.MONITORAGGIO_CARICO_FONTE) delete this.MONITORAGGIO_CARICO_FONTE
        if(!keys.X_ADVISOR) delete this.X_ADVISOR
        if(!keys.INCENTIVAZIONE) delete this.INCENTIVAZIONE
        if(!keys.INCENTIVAZIONE_RECRUITING) delete this.INCENTIVAZIONE_RECRUITING
        if(!keys.ANDAMENTI_TECNICI) delete this.ANDAMENTI_TECNICI
        if(!keys.ESTRAZIONI_AVANZATE) delete this.ESTRAZIONI_AVANZATE
        if(!keys.SCARICO_DATI) delete this.SCARICO_DATI
        if(!keys.INDICI_DIGITALI) delete this.INDICI_DIGITALI
        if(!keys.NEW_BUSINESS_DANNI) delete this.NEW_BUSINESS_DANNI
        if(!keys.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO) delete this.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO
        if(!keys.NEW_BUSINESS_ULTRA_SALUTE) delete this.NEW_BUSINESS_ULTRA_SALUTE
        if(!keys.NEW_BUSINESS_VITA) delete this.NEW_BUSINESS_VITA
        if(!keys.NEW_BUSINESS_ALLIANZ1) delete this.NEW_BUSINESS_ALLIANZ1
        if(!keys.MONITORAGGIO_PTF_DANNI) delete this.MONITORAGGIO_PTF_DANNI
        if(!keys.MONITORAGGIO_RISERVE_VITA) delete this.MONITORAGGIO_RISERVE_VITA
        if(!keys.RETENTION_MOTOR) delete this.RETENTION_MOTOR
        if(!keys.RETENTION_RAMI_VARI) delete this.RETENTION_RAMI_VARI
        if(!keys.MONITORAGGIO_ANDAMENTO_PREMI) delete this.MONITORAGGIO_ANDAMENTO_PREMI
        if(!keys.MONITORAGGIO_RICAVI_AGENZIA) delete this.MONITORAGGIO_RICAVI_AGENZIA
        if(!keys.CAPITALE_VITA_SCADENZA) delete this.CAPITALE_VITA_SCADENZA
    }
}


class BurgerMenuNumbers extends Numbers {

    /**
     * Torna indetro su Numbers
     * @param {string} checkUrl - Verifica url della pagina di atterraggio
     */
    static backToNumbers() {
        super.backToNumbers('business-lines')
    }

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkExistLinks() {
        cy.get('lib-burger-icon').click()

        if (Cypress.env('isAviva')) {
            const linksBurger = [
                LinksBurgerMenu.HOME_NUMBERS,
                LinksBurgerMenu.MONITORAGGIO_FONTI,
                LinksBurgerMenu.NEW_BUSINESS_DANNI,
                LinksBurgerMenu.NEW_BUSINESS_ULTRA_SALUTE,
                LinksBurgerMenu.MONITORAGGIO_PTF_DANNI,
                LinksBurgerMenu.MONITORAGGIO_ANDAMENTO_PREMI,
                LinksBurgerMenu.MONITORAGGIO_RICAVI_AGENZIA
            ]
            cy.get('lib-side-menu-link').find('a').each(($checkLinksBurger, i) => {
                expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
            }).should('have.length', 7)
        } else if (Cypress.env('monoUtenza')) {
            delete LinksBurgerMenu.SCARICO_DATI
            const linksBurger = Object.values(LinksBurgerMenu)
            cy.get('lib-side-menu-link').find('a').each(($checkLinksBurger, i) => {
                expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
            }).should('have.length', 22)
        } else {
            const linksBurger = Object.values(LinksBurgerMenu)
            cy.get('lib-side-menu-link').find('a').should('have.length', 23).each(($checkLinksBurger, i) => {
                expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
            })
        }
    }

    /**
     * Click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLink(page) {
        cy.get('lib-burger-icon').click({ force: true })

        if (page === LinksBurgerMenu.ESTRAZIONI_AVANZATE)
            interceptGetPentahoDA()
        else
            interceptGetAgenziePDF()

        if (page === LinksBurgerMenu.X_ADVISOR)
            cy.contains('X - Advisor').invoke('removeAttr', 'target').click()
        else
            cy.contains(page,{timeout:5000}).click()

        Common.canaleFromPopup()
        this.checkPage(page)
    }

    /**
     * Verifica atterraggio alla pagina
     * @param {string} page - Nome della pagina 
     */
    static checkPage(page) {
        switch (page) {
            case LinksBurgerMenu.MONITORAGGIO_FONTI:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('a:contains("Filtra")')
                break;
            case LinksBurgerMenu.MONITORAGGIO_CARICO:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('#btnFonti').should('be.visible')
                break;
            case LinksBurgerMenu.MONITORAGGIO_CARICO_FONTE:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('#contentPane:contains("Apri filtri"):visible')
                break;
            case LinksBurgerMenu.X_ADVISOR:
                cy.contains('Advisor')
                cy.contains('Dashboard')
                cy.get('textarea').should('be.visible')
                Common.visitUrlOnEnv()
                break;
            case LinksBurgerMenu.INCENTIVAZIONE:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('button:contains("Incentivazione: Maturato per Fonte"):visible')
                break;
            case LinksBurgerMenu.INCENTIVAZIONE_RECRUITING:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                if (!Cypress.env('monoUtenza'))
                    getIFrame().find('[class="menu-padre"]:contains("Report"):visible')
                else
                    getIFrame().find('#likelyCauses').should('be.visible')
                    .and('contain.text', 'Non esistono piani di incentivazioni recruiting per l\'agenzia.')
                break;
            case LinksBurgerMenu.ANDAMENTI_TECNICI:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('button:contains("Fonti produttive"):visible')
                break;
            case LinksBurgerMenu.ESTRAZIONI_AVANZATE:
                cy.wait('@pentahoDA', { requestTimeout: 40000 });
                cy.wait('@pentahoDama', { requestTimeout: 40000 });
                getIFrame().find('a:contains("Nuovo Report"):visible')
                break;
            case LinksBurgerMenu.SCARICO_DATI:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('form:contains("Esporta tracciato")')
                break;
            case LinksBurgerMenu.INDICI_DIGITALI:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('#toggleFilters:contains("Apri filtri")')
                break;
            case LinksBurgerMenu.NEW_BUSINESS_DANNI:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('#ricerca_cliente').should('be.visible').and('contain.text', 'Filtra')
                break;
            case LinksBurgerMenu.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO:
            case LinksBurgerMenu.NEW_BUSINESS_ULTRA_SALUTE:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                getIFrame().find('#submit-Mon_PTF').should('be.visible').and('contain.text', 'Filtra')
                break;
            case LinksBurgerMenu.NEW_BUSINESS_VITA:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                cy.wait(5000)
                getIFrame().find('[class="page-container"]').should('be.visible').and('contain.text', 'Filtra')
                break;
            case LinksBurgerMenu.NEW_BUSINESS_ALLIANZ1:
            case LinksBurgerMenu.MONITORAGGIO_RISERVE_VITA:
            case LinksBurgerMenu.MONITORAGGIO_PTF_DANNI:
            case LinksBurgerMenu.RETENTION_MOTOR:
            case LinksBurgerMenu.RETENTION_RAMI_VARI:
            case LinksBurgerMenu.MONITORAGGIO_ANDAMENTO_PREMI:
            case LinksBurgerMenu.MONITORAGGIO_RICAVI_AGENZIA:
            case LinksBurgerMenu.CAPITALE_VITA_SCADENZA:
                cy.wait('@getDacommercialeGET', { requestTimeout: 150000 });
                cy.wait('@getDacommercialePOST', { requestTimeout: 150000 });
                getIFrame().find('[class="page-container"]').should('be.visible').and('contain.text', 'Filtra')
                break;
        }
    }

}

export default BurgerMenuNumbers