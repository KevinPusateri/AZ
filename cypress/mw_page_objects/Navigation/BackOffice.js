/// <reference types="Cypress" />
import Common from "../common/Common"


const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameMoveSinistri = () => {
    getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .iframe();

    let iframeFolder = getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameDenuncia = () => {
    getIFrame().find('iframe[src="cliente.jsp"]')
        .iframe();

    let iframeFolder = getIFrame().find('iframe[src="cliente.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

class BackOffice {

    /**
     * Verifica atterraggio su Appuntamenti futuri
     */
    static clickAppuntamentiFuturi() {
        cy.get('lib-upcoming-dates').click()
        cy.url().should('eq', Common.getBaseUrl() + 'event-center')
        cy.get('lib-sub-header-right').click()
    }

    /**
     * Clicca una delle card link presenti nella pagina BackOffice 
     * @param {string} page - Nome della pagina delle cards link 
     */
    static clickCardLink(page) {
        cy.get('.backoffice-card').find('a').contains(page).click()
    }

    /**
    * Torna indietro su Backoffice
    */
    static backToBackOffice() {
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', Common.getBaseUrl() + 'back-office')
    }

    /**
     * Verifica che tutti i link su Sinistri siano presenti
     */
    static checkLinksOnSinistriExist() {
        const buttonsSinistri = [
            'Movimentazione sinistri',
            'Denuncia',
            'Denuncia BMP',
            'Consultazione sinistri',
            'Sinistri incompleti',
            'Sinistri canalizzati'
        ]
        cy.get('app-backoffice-cards-list').first().find('a').should('have.length', 6).each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsSinistri[i])
        })
    }

    /**
     * Verifica che tutti i link su Contabilita siano presenti
     */
    static checkLinksOnContabilitaExist() {
        const buttonsContabilita = [
            'Sintesi Contabilità',
            'Giornata contabile',
            'Consultazione Movimenti',
            'Estrazione Contabilità',
            'Deleghe SDD',
            'Quadratura unificata',
            'Incasso per conto',
            'Incasso massivo',
            'Sollecito titoli',
            'Impostazione contabilità',
            'Convenzioni in trattenuta',
            'Monitoraggio Customer Digital Footprint'
        ]
        cy.get('app-backoffice-cards-list').eq(1).find('a[class="backoffice-label-text"]').should('have.length', 12).each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsContabilita[i])
        })
    }

    //#region tutti i click Sinistri 
    /**
     * Verifica atterraggio su "Movimentazione Sinistri"
     */
    static checkMovimentazioneSinistri() {
        getIFrameMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
        getIFrameMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
        getIFrameMoveSinistri().find('a:contains("Ricerca"):visible')
    }

    /**
     * Verifica atterraggio su "Denuncia"
     */
    static checkDenuncia() {
        cy.wait(10000)
        getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        getIFrameDenuncia().find('a:contains("Esegui Ricerca"):visible')
    }

    /**
     * Verifica atterraggio su "Denuncia BMP"
     */
    static checkDenunciaBMP() {
        cy.wait(20000)
        getIFrame().find('h4:contains("Dettaglio cliente"):visible')
    }

    /**
     * Verifica atterraggio su "Consultazione sinistri"
     */
    static checkConsultazioneSinistri() {
        getIFrame().find('button:contains("Cerca"):visible')
    }

    /**
     * Verifica atterraggio su "Sinistri incompleti"
     */
    static checkSinistriIncompleti() {
        getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
    }

    /**
     * Verifica atterraggio su "Sinistri canalizzati"
     */
    static checkSinistriCanalizzati() {
        getIFrame().find('a:contains("Filtra"):visible')
    }
    //#endregion

    //#region tutti i click Contabilità
    /**
     * Verifica atterraggio su "Sintesi Contabilità"
     */
    static checkSintesiContabilita() {
        getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
        getIFrame().find('span:contains("Esporta"):visible').click()
    }

    /**
     * Verifica atterraggio su "Giornata contabile"
     */
    static checkGiornataContabile() {
        getIFrame().find('span:contains("Calendario"):visible')
        getIFrame().find('button:contains("Chiudi giornata contabile"):visible')
    }

    /**
     * Verifica atterraggio su "Consultazione Movimenti"
     */
    static checkConsultazioneMovimenti() {
        getIFrame().find('button:contains("Cerca"):visible')
    }

    /**
     * Verifica atterraggio su "Estrazione Contabilità"
     */
    static checkEstrazioneContabilita() {
        getIFrame().find('h3:contains("ExtraDAS"):visible')
        getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
        getIFrame().find('p:contains("Legenda"):visible')
        getIFrame().find('button:contains("Ricerca"):visible')
    }

    /**
     * Verifica atterraggio su "Deleghe SDD"
     */
    static checkDelegheSDD() {
        cy.wait(10000)
        getIFrame().find('input[value="Carica"]').invoke('attr', 'value').should('equal', 'Carica')
    }

    /**
     * Verifica atterraggio su "Quadratura unificata"
     */
    static checkQuadraturaUnificata() {
        getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
        getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
        getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
        getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
    }

    /**
     * Verifica atterraggio su "Incasso per conto"
     */
    static checkIncassoPerConto() {
        cy.wait(10000)
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
    }

    /**
     * Verifica atterraggio su "Incasso massivo"
     */
    static checkIncassoMassivo() {
        getIFrame().find('a:contains("Apri filtri"):visible')
    }

    /**
     * Verifica atterraggio su "Sollecito titoli"
     */
    static checkSollecitoTitoli() {
        getIFrame().find('span:contains("Gestione Sollecito Titoli")')
        getIFrame().find('#buttonCerca:contains("Cerca"):visible')
    }

    /**
     * Verifica atterraggio su "Impostazione contabilità"
     */
    static checkImpostazioneContabilita() {
        getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
        getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
    }

    /**
     * Verifica atterraggio su "Convenzioni in trattenuta"
     */
    static checkConvenzioniInTrattenuta() {
        cy.wait(10000)
        getIFrame().find('#contentPane:contains("Gestione"):visible')
    }

    /**
     * Verifica atterraggio su "Monitoraggio Customer Digital Footprint"
     */
    static clickAndCheckMonitoraggioCustomerDigitalFootprint() {
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Customer Digital Footprint').invoke('removeAttr', 'target').click()
        cy.url().should('include', 'cdf')
        cy.go('back')
    }
    //#endregion
}

export default BackOffice