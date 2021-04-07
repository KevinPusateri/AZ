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
//#endregion

const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
  }

  const getMoveSinistri = () => {
    getSCU().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
    .iframe();
  
    let iframeFolder = getSCU().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
    .its('0.contentDocument').should('exist');
  
    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
  }

  const getDenuncia = () => {
    getSCU().find('iframe[src="cliente.jsp"]')
    .iframe();
  
    let iframeFolder = getSCU().find('iframe[src="cliente.jsp"]')
    .its('0.contentDocument').should('exist');
  
    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
  }

before(() => {
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
        //TODO 
        // getSCU().find('span:contains("Primo comandamento: GED, GED e solo GED")').should('contain','Primo comandamento: GED, GED e solo GED')

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
        //togli

        cy.url().should('include', '/back-office')
        
        //#region SINISTRI
        cy.get('.backoffice-card').find('a').contains('Movimentazione sinistri').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
        getMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
        getMoveSinistri().find('th:contains("Protocollati"):visible')
        getMoveSinistri().find('th:contains("Presi in carico da CLD"):visible')
        getMoveSinistri().find('th:contains("Trasferiti CLD"):visible')
        getMoveSinistri().find('th:contains("Chiusi Senza Seguito"):visible')
        getMoveSinistri().find('th:contains("Pagati"):visible')
        getMoveSinistri().find('th:contains("Periziati"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')


        cy.get('.backoffice-card').find('a').contains('Denuncia').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Denuncia BMP').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('h4:contains("Dettaglio cliente"):visible')
        getSCU().find('nx-multi-step-item:contains("Dettaglio cliente"):visible')
        getSCU().find('nx-multi-step-item:contains("Dettaglio sinistro"):visible')
        getSCU().find('nx-multi-step-item:contains("Dettaglio del danno"):visible')
        getSCU().find('nx-multi-step-item:contains("Sommario"):visible')
        getSCU().find('nx-multi-step-item:contains("Conferma"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

 
        cy.get('.backoffice-card').find('a').contains('Consultazione sinistri').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('#tab-sinistro:contains("Numero Sinistro"):visible')
        getSCU().find('#tab-polizza:contains("Polizza"):visible')
        getSCU().find('#tab-targa:contains("Targa"):visible')
        getSCU().find('#tab-anagrafica:contains("Dati Anagrafici Cliente"):visible')
        getSCU().find('#tab-targaCTP:contains("Targa CTP"):visible')
        getSCU().find('#tab-anagraficaCTP:contains("Dati Anagrafici CTP"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Sinistri incompleti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('button:contains("Chiudi")').click()
        getSCU().find('h2:contains("Sinistri Incompleti"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')


        cy.get('.backoffice-card').find('a').contains('Sinistri canalizzati').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('td:contains("Sinistri Canalizzati"):visible')
        getSCU().find('#tabSinistri:contains("SINISTRI"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        //#endregion

        //#region Contabilita
        cy.get('.backoffice-card').find('a').contains('Sintesi Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('ul > li > span:contains("Sintesi Contabilità"):visible')
        getSCU().find('ul > li > span:contains("Prospetto GDC"):visible')
        getSCU().find('ul > li > span:contains("Report Mensili"):visible')
        getSCU().find('ul > li > span:contains("Report Annuali"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Giornata contabile').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('ul > li > span:contains("Giornale di cassa"):visible')
        getSCU().find('ul > li > span:contains("Gest. Rimessa"):visible')
        getSCU().find('ul > li > span:contains("Coperture Finanziarie"):visible')
        getSCU().find('ul > li > span:contains("Deroghe Contabili"):visible')
        getSCU().find('ul > li > span:contains("Contestazioni"):visible')
        getSCU().find('ul > li > span:contains("Varie"):visible')
        getSCU().find('ul > li > span:contains("Contab. Esterna"):visible')
        getSCU().find('ul > li > span:contains("Gest. Rientri e Detrazioni"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')


        cy.get('.backoffice-card').find('a').contains('Consultazione Movimenti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('ul > li > span:contains("Consultazione movimenti"):visible')
        getSCU().find('ul > li > span:contains("Saldi"):visible')
        getSCU().find('ul > li > span:contains("Modalità di pagamento"):visible')
        getSCU().find('ul > li > span:contains("Monitoraggio Subagenzia"):visible')
        getSCU().find('ul > li > span:contains("Giornale Subagenti"):visible')
        getSCU().find('ul > li > span:contains("E-Payment"):visible')
        getSCU().find('ul > li > span:contains("Monitoraggio Moneta"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')


        cy.get('.backoffice-card').find('a').contains('Estrazione Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('h3:contains("ExtraDAS"):visible')
        getSCU().find('p:contains("Ricerca Estrazioni"):visible')
        getSCU().find('p:contains("Legenda"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')


        cy.get('.backoffice-card').find('a').contains('Deleghe SDD').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('[class="AZBasicTitle"]:contains("Gestione deleghe SDD"):visible')
        getSCU().find('span:contains("Selezionare il periodo per il quale visualizzare le richieste SDD"):visible')

        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        
        cy.get('.backoffice-card').find('a').contains('Quadratura unificata').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
        getSCU().find('#quadMenu:contains("Quadratura Unificata"):visible')
        getSCU().find('#quadMenu:contains("Agenzie Digital"):visible')
        getSCU().find('#HomePdfAdesioneQuad:contains("Richiedi Attivazione"):visible')
        getSCU().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

       
        cy.get('.backoffice-card').find('a').contains('Incasso per conto').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('#pnlProgressBar:contains("Ricerca"):visible')
        getSCU().find('#pnlProgressBar:contains("Pagamento"):visible')
        getSCU().find('#pnlProgressBar:contains("Riepilogo finale"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
       
        cy.get('.backoffice-card').find('a').contains('Incasso massivo').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('span:contains("Incasso Massivo"):visible')
        getSCU().find('h2:contains("Riepilogo Richieste"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
                 
        cy.get('.backoffice-card').find('a').contains('Sollecito titoli').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('span:contains("Gestione Sollecito Titoli")')
        getSCU().find('ul > li > span:contains("Titoli"):visible')
        getSCU().find('ul > li > span:contains("Titoli"):visible')
        getSCU().find('ul > li > span:contains("Polizza"):visible')
        getSCU().find('ul > li > span:contains("Pratiche"):visible')
        getSCU().find('ul > li > span:contains("Pratica Singola"):visible')
        getSCU().find('ul > li > span:contains("Gestione Anagrafica Legale"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('.backoffice-card').find('a').contains('Impostazione contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        getSCU().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getSCU().find('ul > li > span:contains("Prenotazione POS"):visible')
        getSCU().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getSCU().find('ul > li > span:contains("Impostazioni DAS"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        //#endregion

    });

})