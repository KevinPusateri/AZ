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

const LinksSinistri = {
    MOVIMENTAZIONE_SINISTRI: 'Movimentazione sinistri',
    DENUNCIA: 'Denuncia',
    DENUNCIA_BMP: 'Denuncia BMP',
    CONSULTAZIONE_SINISTRI: 'Consultazione sinistri',
    SINISTRI_INCOMPLETI: 'Sinistri incompleti',
    SINISTRI_CANALIZZATI: 'Sinistri canalizzati'
}

const LinksContabilita = {
    SINTESI_CONTABILITA: 'Sintesi Contabilità',
    GIORNATA_CONTABILE: 'Giornata contabile',
    CONSULTAZIONE_MOVIMENTI: 'Consultazione Movimenti',
    ESTRAZIONE_CONTABILITA: 'Estrazione Contabilità',
    DELEGHE_SDD: 'Deleghe SDD',
    QUADRATURA_UNIFICATA: 'Quadratura unificata',
    INCASSO_PER_CONTO: 'Incasso per conto',
    INCASSO_MASSIVO: 'Incasso massivo',
    SOLLECITO_TITOLI: 'Sollecito titoli',
    IMPOSTAZIONE_CONTABILITA: 'Impostazione contabilità',
    CONVENZIONI_IN_TRATTENUTA: 'Convenzioni in trattenuta',
    MONITORAGGIO_CUSTOMER_DIGITAL_FOOTPRINT: 'Monitoraggio Customer Digital Footprint'
}

class BackOffice {

    /**
      * Verifica che tutti i link su Sinistri siano presenti
      */
    static checkLinksOnSinistriExist() {
        const linksSinistri = Object.values(LinksSinistri)

        cy.get('app-backoffice-cards-list').first().find('a').should('have.length', 6).each(($labelCard, i) => {
            expect($labelCard).to.contain(linksSinistri[i])
        })
    }

    /**
     * Verifica che tutti i link su Contabilita siano presenti
     */
    static checkLinksOnContabilitaExist() {
        const linksContabilita = Object.values(LinksContabilita)

        cy.get('app-backoffice-cards-list').eq(1).find('a[class="backoffice-label-text"]').should('have.length', 12).each(($labelCard, i) => {
            expect($labelCard).to.contain(linksContabilita[i])
        })
    }

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
        if (page === LinksContabilita.MONITORAGGIO_CUSTOMER_DIGITAL_FOOTPRINT)
            cy.get('.backoffice-card').find('a').contains('Monitoraggio Customer Digital Footprint').invoke('removeAttr', 'target').click()
        else
            cy.get('.backoffice-card').find('a').contains(page).click()

        Common.canaleFromPopup()
        this.checkPage(page)
    }

    /**
      * Verifica atterraggio alla pagina
      * @param {string} page - Nome della pagina 
      */
    static checkPage(page) {
        switch (page) {
            case LinksSinistri.MOVIMENTAZIONE_SINISTRI:
                getIFrameMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
                getIFrameMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
                getIFrameMoveSinistri().find('a:contains("Ricerca"):visible')
                break;
            case LinksSinistri.DENUNCIA:
                cy.wait(10000)
                getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
                getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
                getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
                getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
                getIFrameDenuncia().find('a:contains("Esegui Ricerca"):visible')
                break;
            case LinksSinistri.DENUNCIA_BMP:
                cy.wait(20000)
                getIFrame().find('h4:contains("Dettaglio cliente"):visible')
                break;
            case LinksSinistri.CONSULTAZIONE_SINISTRI:
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksSinistri.SINISTRI_INCOMPLETI:
                getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
                break;
            case LinksSinistri.SINISTRI_CANALIZZATI:
                getIFrame().find('a:contains("Filtra"):visible')
                break;
            case LinksContabilita.SINTESI_CONTABILITA:
                getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
                getIFrame().find('span:contains("Esporta"):visible').click()
                break;
            case LinksContabilita.GIORNATA_CONTABILE:
                getIFrame().find('span:contains("Calendario"):visible')
                getIFrame().find('button:contains("Chiudi giornata contabile"):visible')
                break;
            case LinksContabilita.CONSULTAZIONE_MOVIMENTI:
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksContabilita.ESTRAZIONE_CONTABILITA:
                getIFrame().find('h3:contains("ExtraDAS"):visible')
                getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
                getIFrame().find('p:contains("Legenda"):visible')
                getIFrame().find('button:contains("Ricerca"):visible')
                break;
            case LinksContabilita.DELEGHE_SDD:
                cy.wait(10000)
                getIFrame().find('input[value="Carica"]').invoke('attr', 'value').should('equal', 'Carica')
                break;
            case LinksContabilita.QUADRATURA_UNIFICATA:
                getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
                getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
                getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
                getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
                break;
            case LinksContabilita.INCASSO_PER_CONTO:
                cy.wait(10000)
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksContabilita.INCASSO_MASSIVO:
                getIFrame().find('a:contains("Apri filtri"):visible')
                break;
            case LinksContabilita.SOLLECITO_TITOLI:
                getIFrame().find('span:contains("Gestione Sollecito Titoli")')
                getIFrame().find('#buttonCerca:contains("Cerca"):visible')
                break;
            case LinksContabilita.IMPOSTAZIONE_CONTABILITA:
                getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
                getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
                getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
                getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
                break;
            case LinksContabilita.CONVENZIONI_IN_TRATTENUTA:
                cy.wait(10000)
                getIFrame().find('#contentPane:contains("Gestione"):visible')
                break;
            case LinksContabilita.MONITORAGGIO_CUSTOMER_DIGITAL_FOOTPRINT:
                getIFrame().find('p:contains("Customer Digital Footprint"):visible')
                break;
        }
    }

    /**
    * Torna indietro su Backoffice
    */
    static backToBackOffice() {
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', Common.getBaseUrl() + 'back-office')
    }

    //#endregion

    /**
     * Clicca VPS Rami Vari ("News")
     */
    static clickVPSRami() {
        cy.get('lib-news-card').click();
        Common.canaleFromPopup()
        getIFrame().find('span:contains("VPS Rami Vari: meno è meglio!"):visible')
    }
}

export default BackOffice