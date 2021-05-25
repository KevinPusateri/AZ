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

    static checkAtterraggioAppuntamentiFuturi() {
        cy.get('lib-upcoming-dates').click()
        cy.url().should('eq', Common.getBaseUrl() + 'event-center')
        cy.get('lib-sub-header-right').click()
    }

    static clickCardLink(page) {
        cy.get('.backoffice-card').find('a').contains(page).click()
    }

    static checkCardExistOnSinistri(linkTitlePage) {
        cy.get('app-backoffice-cards-list').eq(0).find('a').should('contain', linkTitlePage)
    }

    static checkCardExistOnContabilita(linkTitlePage) {
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain', linkTitlePage)
    }

    static backToBackOffice() {
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', Common.getBaseUrl() + 'back-office')
    }

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
        cy.get('app-backoffice-cards-list').eq(1).find('a[class="backoffice-label-text"]').should('have.length',12).each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsContabilita[i])
        })
    }

    static checkAtterraggioMovimentazioneSinistri() {
        getIFrameMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
        getIFrameMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
        getIFrameMoveSinistri().find('a:contains("Ricerca"):visible')
    }

    static checkAtterraggioDenuncia() {
        cy.wait(10000)
        getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        getIFrameDenuncia().find('a:contains("Esegui Ricerca"):visible')
    }

    static checkAtterraggioDenunciaBMP() {
        cy.wait(20000)
        getIFrame().find('h4:contains("Dettaglio cliente"):visible')
    }

    static checkAtterraggioConsultazioneSinistri() {
        getIFrame().find('button:contains("Cerca"):visible')
    }

    static checkAtterraggioSinistriIncompleti() {
        getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
    }

    static checkAtterraggioSinistriCanalizzati() {
        getIFrame().find('a:contains("Filtra"):visible')
    }

    static checkAtterraggioSintesiContabilita() {
        getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
        getIFrame().find('span:contains("Esporta"):visible').click()
    }

    static checkAtterraggioGiornataContabile() {
        getIFrame().find('span:contains("Calendario"):visible')
        getIFrame().find('button:contains("Chiudi giornata contabile"):visible')
    }

    static checkAtterraggioConsultazioneMovimenti() {
        getIFrame().find('button:contains("Cerca"):visible')
    }

    static checkAtterraggioEstrazioneContabilita() {
        getIFrame().find('h3:contains("ExtraDAS"):visible')
        getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
        getIFrame().find('p:contains("Legenda"):visible')
        getIFrame().find('button:contains("Ricerca"):visible')
    }

    static checkAtterraggioDelegheSDD() {
        cy.wait(10000)
        getIFrame().find('input[value="Carica"]').invoke('attr', 'value').should('equal', 'Carica')
    }

    static checkAtterraggioIncassoPerConto() {
        cy.wait(10000)
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
    }

    static checkAtterraggioIncassoMassivo() {
        getIFrame().find('a:contains("Apri filtri"):visible')
    }

    static checkAtterraggioSollecitoTitoli() {
        getIFrame().find('span:contains("Gestione Sollecito Titoli")')
        getIFrame().find('#buttonCerca:contains("Cerca"):visible')
    }

    static checkAtterraggioImpostazioneContabilita() {
        getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
        getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
    }

    static checkAtterraggioConvenzioniInTrattenuta() {
        cy.wait(10000)
        getIFrame().find('#contentPane:contains("Gestione"):visible')
    }

    static checkAtterraggioMonitoraggioCustomerDigitalFootprint() {
        cy.get('app-backoffice-cards-list').eq(1).find('a[href="https://portaleagenzie.pp.azi.allianz.it/cdf/"]')
            .invoke('removeAttr', 'target').click()
        cy.url().should('include', 'cdf')
        cy.go('back')
    }

}

export default BackOffice