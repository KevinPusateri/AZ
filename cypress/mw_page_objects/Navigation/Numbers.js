/// <reference types="Cypress" />
import Common from "../common/Common"

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

class Numbers {

    /**
     * Torna indetro su Numbers
     * @param {string} checkUrl - Verifica url della pagina di atterraggio
     */
    static backToNumbers(checkUrl) {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', Common.getBaseUrl() + 'numbers/' + checkUrl)
    }

    /**
     * 
     * @param {string} nameTab - Nome del tab da cliccare 
     * @param {string} checkUrlTab - Verifica url del tab cliccato
     */
    static clickTab(nameTab, checkUrlTab) {
        cy.contains(nameTab).click().should('have.class', 'active')
        cy.url().should('eq', Common.getBaseUrl() + 'numbers/' + checkUrlTab)
    }

    /**
     * Verifica che il button  di filtro sia cliccato e chiuso 
     */
    static verificaFiltro() {
        cy.get('lib-container').find('nx-icon[name="filter"]').click().wait(2000)
        cy.get('app-filters').find('h3:contains("AGENZIE"):visible')
        cy.get('app-filters').find('h3:contains("COMPAGNIE"):visible')
        cy.get('app-filters').find('h3:contains("FONTI"):visible')
        cy.get('app-filters').find('h3:contains("PERIODO"):visible')
        cy.contains('ANNULLA').click()
    }

    /**
    * Verifica che il button PDF sia cliccato  
    */
    static verificaPDF() {
        cy.get('lib-container').find('a[class="circle icon-glossary btn-icon"]')
            .should('have.attr', 'href', 'https://portaleagenzie.pp.azi.allianz.it/dacommerciale/DSB/Content/PDF/Regole_Classificazione_Reportistica.pdf')
    }

    /**
     * Verifica Atterraggio Ricavi di Agenzia
     */
    static checkAtterraggioRicaviDiAgenzia() {
        interceptGetAgenziePDF()
        cy.get('app-agency-incoming').contains('RICAVI DI AGENZIA').click()
        cy.wait('@getDacommerciale', { requestTimeout: 80000 });
        getIFrame().find('a:contains("Filtra"):visible')
    }

    /**
     * Verifica Atterraggio New business
     */
    static clickAndCheckAtterraggioNewBusiness() {
        interceptGetAgenziePDF()
        cy.get('app-kpi-card').contains('New business').click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#submit-Mon_PTF:contains("Filtra"):visible')
    }

    /**
    * Verifica Atterraggio Incassi
    */
    static clickAndCheckAtterraggioIncassi() {
        interceptGetAgenziePDF()
        cy.get('app-kpi-card').contains('Incassi').click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('[class="ControlloFiltroBottone"]:contains("Filtra"):visible')
    }

    /**
     * Verifica Atterraggio Incassi
     */
    static clickAndCheckAtterraggioPortafoglio() {
        interceptGetAgenziePDF()
        cy.get('app-kpi-card').contains('Portafoglio').click()
        cy.wait('@getDacommerciale', { requestTimeout: 120000 });
        getIFrame().find('[class="ControlloFiltroBottone"]:contains("Filtra"):visible')
    }

    /**
     * Verifica Atterraggio Primo indice prodotto
     */
    static clickAndCheckAtterraggioPrimoIndiceProdotto() {
        interceptGetAgenziePDF()
        cy.get('lib-card').first().click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('[class="ControlloFiltroBottone"]:contains("Filtra"):visible')
    }

    /**
     * Verifica Atterraggio Primo indice digitale
     */
    static clickAndCheckAtterraggioPrimoIndiceDigitale() {
        interceptGetAgenziePDF()
        cy.get('app-digital-indexes').find('lib-card').first().click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('a:contains("Apri filtri"):visible')
    }

    /**
     * Verifica Atterraggio Incentivi dal panel "GRUPPO INCENTIVATO 178 DAN"
     */
    static checkAtterraggioPrimoIndiceIncentivi() {
        cy.get('app-incentives').find('[class="text-panel-header"]').should('contain','TOTALE MATURATO INCENTIVI')
        interceptGetAgenziePDF()
        cy.contains('GRUPPO INCENTIVATO 178 DAN').click()
        cy.get('app-incentive-card').find('lib-card').first().click()
        Common.canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#btnRicerca_CapoGruppo:contains("Nuova ricerca"):visible')
    }

}

export default Numbers