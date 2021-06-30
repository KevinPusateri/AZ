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
        method: 'POST',
        url: '**/dacommerciale/**'
    }).as('getDacommerciale');
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
    SCARICO_DATI: 'Scarico Dati',
    INDICI_DIGITALI: 'Indici Digitali',
    NEW_BUSINESS_DANNI: 'New Business Danni',
    ULTRA_CASA_PATRIMONIO: 'Ultra Casa e Patrimonio',
    ULTRA_SALUTE: 'Ultra Salute',
    NEW_BUSINESS_VITA: 'New Business Vita',
    NEW_BUSINESS_ALLIANZ1: 'New Business Allianz1',
    MONITORAGGIO_PTF_DANNI: 'Monitoraggio PTF Danni',
    MONITORAGGIO_RISERVE_VITA: 'Monitoraggio Riserve Vita',
    RETENTION_MOTOR: 'Retention Motor',
    RETENTION_RAMI_VARI: 'Retention Rami Vari',
    MONITORAGGIO_ANDAMENTO_PREMI: 'Monitoraggio Andamento Premi',
    MONITORAGGIO_RICAVI_AGENZIA: 'Monitoraggio Ricavi d\'Agenzia',
    CAPITALE_VITA_SCADENZA: 'Capitale Vita Scadenza'
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
        const linksBurger = Object.values(LinksBurgerMenu)

        cy.get('lib-side-menu-link').find('a').should('have.length', 23).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    }

    /**
     * Click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLink(page) {
        cy.get('lib-burger-icon').click({force:true})

        if (page === LinksBurgerMenu.ESTRAZIONI_AVANZATE)
            interceptGetPentahoDA()
        else
            interceptGetAgenziePDF()

        cy.contains(page).click()
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
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('a:contains("Filtra")')
                break;
            case LinksBurgerMenu.MONITORAGGIO_CARICO:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('#contentPane:contains("Fonti"):visible')
                break;
            case LinksBurgerMenu.MONITORAGGIO_CARICO_FONTE:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('#contentPane:contains("Applica filtri"):visible')
                break;
            case LinksBurgerMenu.INCENTIVAZIONE:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('button:contains("Incentivazione: Maturato per Fonte"):visible')
                break;
            case LinksBurgerMenu.INCENTIVAZIONE_RECRUITING:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('[class="menu-padre"]:contains("Report"):visible')
                break;
            case LinksBurgerMenu.ANDAMENTI_TECNICI:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('button:contains("Fonti produttive"):visible')
                break;
            case LinksBurgerMenu.ESTRAZIONI_AVANZATE:
                cy.wait('@pentahoDA', { requestTimeout: 40000 });
                cy.wait('@pentahoDama', { requestTimeout: 40000 });
                getIFrame().find('a:contains("Nuovo Report"):visible')
                break;
            case LinksBurgerMenu.SCARICO_DATI:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('form:contains("Esporta tracciato")')
                break;
            case LinksBurgerMenu.INDICI_DIGITALI:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('#toggleFilters:contains("Apri filtri")')
                break;
            case LinksBurgerMenu.NEW_BUSINESS_DANNI:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('#ricerca_cliente:contains("Filtra"):visible')
                break;
            case LinksBurgerMenu.ULTRA_CASA_PATRIMONIO:
            case LinksBurgerMenu.ULTRA_SALUTE:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('#submit-Mon_PTF:contains("Filtra"):visible')
                break;
            case LinksBurgerMenu.NEW_BUSINESS_VITA:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                cy.wait(5000)
                getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
                break;
            case LinksBurgerMenu.NEW_BUSINESS_ALLIANZ1:
            case LinksBurgerMenu.MONITORAGGIO_RISERVE_VITA:
            case LinksBurgerMenu.MONITORAGGIO_PTF_DANNI:
            case LinksBurgerMenu.RETENTION_MOTOR:
            case LinksBurgerMenu.RETENTION_RAMI_VARI:
            case LinksBurgerMenu.MONITORAGGIO_ANDAMENTO_PREMI:
            case LinksBurgerMenu.MONITORAGGIO_RICAVI_AGENZIA:
            case LinksBurgerMenu.CAPITALE_VITA_SCADENZA:
                cy.wait('@getDacommerciale', { requestTimeout: 100000 });
                getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
                break;
        }
    }

}

export default BurgerMenuNumbers