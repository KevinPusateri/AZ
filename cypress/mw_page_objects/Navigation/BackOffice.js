/// <reference types="Cypress" />
import Common from "../common/Common"

const IFrameParent = 'iframe[src="cliente.jsp"]'

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const findIframeChild = (subFrame) => {
    getIFrame().find(subFrame)
        .iframe();

    let iframeChild = getIFrame().find(subFrame)
        .its('0.contentDocument').should('exist');

    return iframeChild.its('body').should('not.be.undefined').then(cy.wrap)
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

const Anagrafe = {
    method: '+(GET|POST)',
    url: /Anagrafe/
}

const LinksSinistri = {
    MOVIMENTAZIONE_SINISTRI: 'Movimentazione sinistri',
    DENUNCIA: 'Denuncia',
    GESTIONE_CONTATTO_CARD: 'Gestione Contatto Card',
    DENUNCIA_BMP: 'Denuncia BMP',
    CONSULTAZIONE_SINISTRI: 'Consultazione sinistri',
    SINISTRI_INCOMPLETI: 'Sinistri incompleti',
    SINISTRI_CANALIZZATI: 'Sinistri canalizzati',
    SCHEDA_SINISTRI_GESTIONE: 'Scheda Sinistri per Gestione',
    deleteKey: function (keys) {
        if (!keys.MOVIMENTAZIONE_SINISTRI) delete this.MOVIMENTAZIONE_SINISTRI
        if (!keys.DENUNCIA) delete this.DENUNCIA
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.GESTIONE_CONTATTO_CARD
        if (!keys.DENUNCIA_BMP) delete this.DENUNCIA_BMP
        if (!keys.CONSULTAZIONE_SINISTRI) delete this.CONSULTAZIONE_SINISTRI
        if (!keys.SINISTRI_INCOMPLETI) delete this.SINISTRI_INCOMPLETI
        if (!keys.SINISTRI_CANALIZZATI) delete this.SINISTRI_CANALIZZATI
        if (!keys.SCHEDA_SINISTRI_GESTIONE || Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.SCHEDA_SINISTRI_GESTIONE
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
        cy.screenshot('Verifica atterraggio su Appuntamenti futuri', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Clicca una delle card link presenti nella pagina BackOffice 
     * @param {string} page - Nome della pagina delle cards link 
     */
    static clickCardLink(page) {
        cy.intercept(Anagrafe).as('Anagrafe')


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
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksSinistri.DENUNCIA:
                cy.wait(10000)
                findIframeChild(IFrameParent).find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
                findIframeChild(IFrameParent).find('h3:contains("Ricerca per polizza"):visible')
                findIframeChild(IFrameParent).find('h3:contains("Ricerca per targa"):visible')
                findIframeChild(IFrameParent).find('h3:contains("Ricerca per dati anagrafici"):visible')
                findIframeChild(IFrameParent).find('a:contains("Esegui Ricerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksSinistri.DENUNCIA_BMP:
                cy.wait(5000)
                cy.getIFrame()
                cy.get('iframe',{timeout:10000}).should('be.visible').within(() => {
                    cy.get('#keyword:visible').should('exist').should('be.visible')
s
                    cy.get('#keyword').should('exist').should('be.visible')
                    cy.get('h2[data-testid="headline"]').should('be.visible')
                        .then($title => {
                            expect(['Dettagli del cliente', 'Customer details']).to.include($title.text().trim())
                        })
                })
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksSinistri.GESTIONE_CONTATTO_CARD:
                getIFrame().find('#resultsClaimsToComplete').should('exist').and('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksSinistri.CONSULTAZIONE_SINISTRI:
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksSinistri.SINISTRI_INCOMPLETI:
                getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksSinistri.SINISTRI_CANALIZZATI:
                getIFrame().find('a:contains("Filtra"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksSinistri.SCHEDA_SINISTRI_GESTIONE:
                getIFrame().find('h4:contains("Scheda Sinistri Gestione Agenziale"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.SINTESI_CONTABILITA:
                getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
                getIFrame().find('span:contains("Esporta"):visible').click()
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.GIORNATA_CONTABILE:
                getIFrame().find('span:contains("Calendario"):visible')
                getIFrame().find('#statoGiornaleDiCassa').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.CONSULTAZIONE_MOVIMENTI:
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.ESTRAZIONE_CONTABILITA:
                getIFrame().find('h3:contains("ExtraDAS"):visible')
                getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
                getIFrame().find('p:contains("Legenda"):visible')
                getIFrame().find('button:contains("Ricerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.DELEGHE_SDD:
                cy.wait(5000)
                getIFrame().find('input[value="Carica"]').should('be.visible').invoke('attr', 'value').should('equal', 'Carica')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.QUADRATURA_UNIFICATA:
                getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
                getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
                getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
                getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.INCASSO_PER_CONTO:
                cy.wait(10000)
                getIFrame().find('#ctl00_pHolderMain1_btnRicercaTitoli').should('be.visible').invoke('attr', 'value').should('equal', 'Cerca')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.INCASSO_MASSIVO:
                getIFrame().find('a:contains("Apri filtri"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.SOLLECITO_TITOLI:
                getIFrame().find('span:contains("Gestione Sollecito Titoli")')
                getIFrame().find('#buttonCerca:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.IMPOSTAZIONE_CONTABILITA:
                getIFrame().find('#tabGiornataContabile').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.CONVENZIONI_IN_TRATTENUTA:
                cy.wait(10000)
                getIFrame().find('#contentPane:contains("Gestione"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksContabilita.MONITORAGGIO_GUIDA_SMART:
                getIFrame().find('p:contains("Guida Smart"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;

        }
    }

    /**
     * Torna indietro su Backoffice
     */
    static backToBackOffice() {
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', 'back-office')
        cy.screenshot('Torna indietro su Backoffice', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    //#endregion

    /**
     * Clicca ("News") da landingPage
     */
    static clickNewsLanding() {
        cy.get('lib-news-card').click();
        Common.canaleFromPopup()
        getIFrame().find('span:contains("IVASS"):visible')
        cy.screenshot('News da BackOffice', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }
}

export default BackOffice