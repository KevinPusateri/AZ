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
    GESTIONE_CONTATTO_CARD: 'Gestione Contatto Card',
    DENUNCIA_BMP: 'Denuncia BMP',
    CONSULTAZIONE_SINISTRI: 'Consultazione sinistri',
    SINISTRI_INCOMPLETI: 'Sinistri incompleti',
    SINISTRI_CANALIZZATI: 'Sinistri canalizzati',
    deleteKey: function (keys) {
        if (!keys.MOVIMENTAZIONE_SINISTRI) delete this.MOVIMENTAZIONE_SINISTRI
        if (!keys.DENUNCIA) delete this.DENUNCIA
        if (Cypress.env('isAviva')) delete this.GESTIONE_CONTATTO_CARD
        if (!keys.DENUNCIA_BMP) delete this.DENUNCIA_BMP
        if (!keys.CONSULTAZIONE_SINISTRI) delete this.CONSULTAZIONE_SINISTRI
        if (!keys.SINISTRI_INCOMPLETI) delete this.SINISTRI_INCOMPLETI
        if (!keys.SINISTRI_CANALIZZATI) delete this.SINISTRI_CANALIZZATI
    }
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
    MONITORAGGIO_GUIDA_SMART: 'Monitoraggio Guida Smart',
    deleteKey: function (keys) {
        if (!keys.SINTESI_CONTABILITA) delete this.SINTESI_CONTABILITA
        if (!keys.GIORNATA_CONTABILE) delete this.GIORNATA_CONTABILE
        if (!keys.CONSULTAZIONE_MOVIMENTI) delete this.CONSULTAZIONE_MOVIMENTI
        if (!keys.ESTRAZIONE_CONTABILITA) delete this.ESTRAZIONE_CONTABILITA
        if (!keys.DELEGHE_SDD) delete this.DELEGHE_SDD
        if (!keys.QUADRATURA_UNIFICATA) delete this.QUADRATURA_UNIFICATA
        if (!keys.INCASSO_PER_CONTO) delete this.INCASSO_PER_CONTO
        if (!keys.INCASSO_MASSIVO) delete this.INCASSO_MASSIVO
        if (!keys.SOLLECITO_TITOLI) delete this.SOLLECITO_TITOLI
        if (!keys.IMPOSTAZIONE_CONTABILITA) delete this.IMPOSTAZIONE_CONTABILITA
        if (!keys.CONVENZIONI_IN_TRATTENUTA) delete this.CONVENZIONI_IN_TRATTENUTA
        if (!keys.MONITORAGGIO_GUIDA_SMART) delete this.MONITORAGGIO_GUIDA_SMART
    }
}

class BackOffice {

    /**
     * Verifica che tutti i link su Sinistri siano presenti
     */
    static checkLinksOnSinistriExist(keys) {

        LinksSinistri.deleteKey(keys)
        const linksSinistri = Object.values(LinksSinistri)
        cy.get('app-backoffice-cards-list').first().find('a').each(($labelCard, i) => {
            expect($labelCard).to.contain(linksSinistri[i])
        })
    }

    /**
     * Verifica che tutti i link su Contabilita siano presenti
     */
    static checkLinksOnContabilitaExist(keys) {

        LinksContabilita.deleteKey(keys)
        const linksContabilita = Object.values(LinksContabilita)

        cy.get('app-backoffice-cards-list').eq(1).find('a[class="backoffice-label-text"]').each(($labelCard, i) => {
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
        if (page === LinksContabilita.MONITORAGGIO_GUIDA_SMART)
            cy.get('.backoffice-card').find('a').contains(page).invoke('removeAttr', 'target').click()
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
                getIFrame().find('h4').should('be.visible').then($title => {
                    expect(['Dettaglio cliente', 'Customer details']).to.include($title.text().trim())
                })
                break;
            case LinksSinistri.GESTIONE_CONTATTO_CARD:
                getIFrame().find('div:contains("Nessun sinistro trovato"):visible')
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
                getIFrame().find('#statoGiornaleDiCassa').should('be.visible')
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
                getIFrame().find('input[value="Carica"]').should('be.visible').invoke('attr', 'value').should('equal', 'Carica')
                break;
            case LinksContabilita.QUADRATURA_UNIFICATA:
                getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
                getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
                getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
                getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
                break;
            case LinksContabilita.INCASSO_PER_CONTO:
                cy.wait(10000)
                getIFrame().find('input[value="Cerca"]').should('be.visible').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksContabilita.INCASSO_MASSIVO:
                getIFrame().find('a:contains("Apri filtri"):visible')
                break;
            case LinksContabilita.SOLLECITO_TITOLI:
                getIFrame().find('span:contains("Gestione Sollecito Titoli")')
                getIFrame().find('#buttonCerca:contains("Cerca"):visible')
                break;
            case LinksContabilita.IMPOSTAZIONE_CONTABILITA:
                getIFrame().find('#tabGiornataContabile').should('be.visible')
                // getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
                // getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
                // getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
                // getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
                break;
            case LinksContabilita.CONVENZIONI_IN_TRATTENUTA:
                cy.wait(10000)
                getIFrame().find('#contentPane:contains("Gestione"):visible')
                break;
            case LinksContabilita.MONITORAGGIO_GUIDA_SMART:
                getIFrame().find('p:contains("Guida Smart"):visible')
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
     * Clicca ("News") da landingPage
     */
    static clickNewsLanding() {
        cy.get('lib-news-card').click();
        Common.canaleFromPopup()
        // if (Cypress.env('isAviva'))
        //     getIFrame().find('span:contains("Nuova incentivazione Vita"):visible')
        // else
        getIFrame().find('span:contains("Nuova incentivazione Vita"):visible')
    }
}

export default BackOffice