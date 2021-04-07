/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 15000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()

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
//#endregion

before(() => {
    cy.clearCookies();
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
    cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
})

beforeEach(() => {
    cy.viewport(1920, 1080)
    // Preserve cookie in every test
    Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return true;
        }
    })
})

after(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.clearCookies();
})

describe('Matrix Web : Navigazioni da BackOffice', function () {

    it('Verifica atterraggio su BackOffice', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    });

    it('Verifica Appuntamenti Futuri', function () {
        cy.url().should('include', '/back-office')
        cy.get('lib-upcoming-dates').click()
        cy.url().should('include', '/event-center')
        cy.get('lib-sub-header-right').click()
    });

    it('Verifica Gestione Documentale', function () {
        cy.url().should('include', '/back-office')
        cy.get('lib-news-image').click();
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        //TODO 2 minuti dura TROPPO
        getIFrame().find('a:contains("Primo Piano"):visible')
        getIFrame().find('span:contains("Primo comandamento: GED, GED e solo GED"):visible')

        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    });

    it('Verifica Sinistri', function () {
        cy.url().should('include', '/back-office')

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
    });

    it('Verifica Contabilità', function () {
        cy.url().should('include', '/back-office')

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
            'Impostazione contabilità'
        ]
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('have.length', 10).each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsContabilita[i])
        })
    });

    it('Verifica apertura disambiguazione per voci Sinistri e Contabilità', function () {
        cy.url().should('include', '/back-office')
        
        //#region SINISTRI
        cy.get('.backoffice-card').find('a').contains('Movimentazione sinistri').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrameMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
        getIFrameMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
        getIFrameMoveSinistri().find('th:contains("Protocollati"):visible')
        getIFrameMoveSinistri().find('th:contains("Presi in carico da CLD"):visible')
        getIFrameMoveSinistri().find('th:contains("Trasferiti CLD"):visible')
        getIFrameMoveSinistri().find('th:contains("Chiusi Senza Seguito"):visible')
        getIFrameMoveSinistri().find('th:contains("Pagati"):visible')
        getIFrameMoveSinistri().find('th:contains("Periziati"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Denuncia').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Denuncia BMP').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('h4:contains("Dettaglio cliente"):visible')
        getIFrame().find('nx-multi-step-item:contains("Dettaglio cliente"):visible')
        getIFrame().find('nx-multi-step-item:contains("Dettaglio sinistro"):visible')
        getIFrame().find('nx-multi-step-item:contains("Dettaglio del danno"):visible')
        getIFrame().find('nx-multi-step-item:contains("Sommario"):visible')
        getIFrame().find('nx-multi-step-item:contains("Conferma"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Consultazione sinistri').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('#tab-sinistro:contains("Numero Sinistro"):visible')
        getIFrame().find('#tab-polizza:contains("Polizza"):visible')
        getIFrame().find('#tab-targa:contains("Targa"):visible')
        getIFrame().find('#tab-anagrafica:contains("Dati Anagrafici Cliente"):visible')
        getIFrame().find('#tab-targaCTP:contains("Targa CTP"):visible')
        getIFrame().find('#tab-anagraficaCTP:contains("Dati Anagrafici CTP"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Sinistri incompleti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('button:contains("Chiudi")').click()
        getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Sinistri canalizzati').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('td:contains("Sinistri Canalizzati"):visible')
        getIFrame().find('#tabSinistri:contains("SINISTRI"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        //#endregion

        //#region Contabilita
        cy.get('.backoffice-card').find('a').contains('Sintesi Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('ul > li > span:contains("Sintesi Contabilità"):visible')
        getIFrame().find('ul > li > span:contains("Prospetto GDC"):visible')
        getIFrame().find('ul > li > span:contains("Report Mensili"):visible')
        getIFrame().find('ul > li > span:contains("Report Annuali"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Giornata contabile').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('ul > li > span:contains("Giornale di cassa"):visible')
        getIFrame().find('ul > li > span:contains("Gest. Rimessa"):visible')
        getIFrame().find('ul > li > span:contains("Coperture Finanziarie"):visible')
        getIFrame().find('ul > li > span:contains("Deroghe Contabili"):visible')
        getIFrame().find('ul > li > span:contains("Contestazioni"):visible')
        getIFrame().find('ul > li > span:contains("Varie"):visible')
        getIFrame().find('ul > li > span:contains("Contab. Esterna"):visible')
        getIFrame().find('ul > li > span:contains("Gest. Rientri e Detrazioni"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Consultazione Movimenti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('ul > li > span:contains("Consultazione movimenti"):visible')
        getIFrame().find('ul > li > span:contains("Saldi"):visible')
        getIFrame().find('ul > li > span:contains("Modalità di pagamento"):visible')
        getIFrame().find('ul > li > span:contains("Monitoraggio Subagenzia"):visible')
        getIFrame().find('ul > li > span:contains("Giornale Subagenti"):visible')
        getIFrame().find('ul > li > span:contains("E-Payment"):visible')
        getIFrame().find('ul > li > span:contains("Monitoraggio Moneta"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')


        cy.get('.backoffice-card').find('a').contains('Estrazione Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('h3:contains("ExtraDAS"):visible')
        getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
        getIFrame().find('p:contains("Legenda"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')


        cy.get('.backoffice-card').find('a').contains('Deleghe SDD').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('[class="AZBasicTitle"]:contains("Gestione deleghe SDD"):visible')
        getIFrame().find('span:contains("Selezionare il periodo per il quale visualizzare le richieste SDD"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        
        cy.get('.backoffice-card').find('a').contains('Quadratura unificata').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
        getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
        getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
        getIFrame().find('#HomePdfAdesioneQuad:contains("Richiedi Attivazione"):visible')
        getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

       
        cy.get('.backoffice-card').find('a').contains('Incasso per conto').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('#pnlProgressBar:contains("Ricerca"):visible')
        getIFrame().find('#pnlProgressBar:contains("Pagamento"):visible')
        getIFrame().find('#pnlProgressBar:contains("Riepilogo finale"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
       
        cy.get('.backoffice-card').find('a').contains('Incasso massivo').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('span:contains("Incasso Massivo"):visible')
        getIFrame().find('h2:contains("Riepilogo Richieste"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
                 
        cy.get('.backoffice-card').find('a').contains('Sollecito titoli').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('span:contains("Gestione Sollecito Titoli")')
        getIFrame().find('ul > li > span:contains("Titoli"):visible')
        getIFrame().find('ul > li > span:contains("Titoli"):visible')
        getIFrame().find('ul > li > span:contains("Polizza"):visible')
        getIFrame().find('ul > li > span:contains("Pratiche"):visible')
        getIFrame().find('ul > li > span:contains("Pratica Singola"):visible')
        getIFrame().find('ul > li > span:contains("Gestione Anagrafica Legale"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Impostazione contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
        getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        //#endregion

    });

})