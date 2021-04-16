/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
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


beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
    cy.intercept(/launch-*/,'ignore').as('launchStaging');
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return true;
        }
    })
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
})

afterEach(() => {
    cy.get('.user-icon-container').click()
    cy.wait(1000).contains('Logout').click()
    cy.wait(delayBetweenTests)
    cy.clearCookies();
})

//TODO: togliere i wait su Deleghe ssd e Incasso per conto e Gestione Documentale
describe('Matrix Web : Navigazioni da BackOffice', function () {

   it('Verifica atterraggio su BackOffice', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    });

    it('Verifica Appuntamenti Futuri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-upcoming-dates').click()
        cy.url().should('include', '/event-center')
        cy.get('lib-sub-header-right').click()
    });

    // it('Verifica Gestione Documentale', function () {
    //     cy.url().should('include', '/back-office')
    //     cy.get('lib-news-image').click();
    //     cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
    //     //TODO 2 minuti dura TROPPO
    //     getIFrame().find('a:contains("Primo Piano"):visible')
    //     getIFrame().find('span:contains("Primo comandamento: GED, GED e solo GED"):visible')

    //     cy.get('lib-breadcrumbs').contains('Backoffice').click()
    //     cy.url().should('include', '/back-office')
    // });

    it('Verifica Sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
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
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
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
            'Impostazione contabilità',
            'Convenzioni in trattenuta'
        ]
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('have.length', 11).each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsContabilita[i])
        })
    });

    it('Verifica apertura disambiguazione: Movimentazione Sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('.backoffice-card').find('a').contains('Movimentazione sinistri').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrameMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
        getIFrameMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
        getIFrameMoveSinistri().find('a:contains("Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Denuncia', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Denuncia')
        cy.get('.backoffice-card').find('a').contains('Denuncia').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        getIFrameDenuncia().find('a:contains("Esegui Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it.only('Verifica apertura disambiguazione: Denuncia BMP', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Denuncia BMP')
        cy.get('.backoffice-card').find('a').contains('Denuncia BMP').click()
        cy.intercept({
            method: 'GET',
            url: /fnol*/
        }).as('fnol');
        cy.get('nx-modal-container').find('.agency-row').first().click()
        cy.wait('@fnol', { requestTimeout: 25000 });

        getIFrame().find('fnol-root:contains("Continua"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Consultazione sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Consultazione sinistri')
        cy.get('.backoffice-card').find('a').contains('Consultazione sinistri').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Sinistri incompleti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Sinistri incompleti')
        cy.get('.backoffice-card').find('a').contains('Sinistri incompleti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Chiudi")').click()
        getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Sinistri canalizzati', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Sinistri canalizzati')
        cy.get('.backoffice-card').find('a').contains('Sinistri canalizzati').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('a:contains("Filtra"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })
    it('Verifica apertura disambiguazione: Sintesi Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Sintesi Contabilità')
        cy.get('.backoffice-card').find('a').contains('Sintesi Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
        getIFrame().find('span:contains("Esporta"):visible').click()
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Giornata contabile', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Giornata contabile')
        cy.get('.backoffice-card').find('a').contains('Giornata contabile').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Calendario"):visible')
        getIFrame().find('button:contains("Chiudi giornata contabile"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Consultazione Movimenti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Consultazione Movimenti')
        cy.get('.backoffice-card').find('a').contains('Consultazione Movimenti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Estrazione Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Estrazione Contabilità')
        cy.get('.backoffice-card').find('a').contains('Estrazione Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('h3:contains("ExtraDAS"):visible')
        getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
        getIFrame().find('p:contains("Legenda"):visible')
        getIFrame().find('button:contains("Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Deleghe SDD', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Deleghe SDD')
        cy.get('.backoffice-card').find('a').contains('Deleghe SDD').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(10000)
        getIFrame().find('input[value="Carica"]').invoke('attr','value').should('equal','Carica')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Quadratura unificata', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Quadratura unificata')
        cy.get('.backoffice-card').find('a').contains('Quadratura unificata').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
        getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
        getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
        getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Incasso per conto', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Incasso per conto')
        cy.get('.backoffice-card').find('a').contains('Incasso per conto').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(10000)
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })
       
    it('Verifica apertura disambiguazione: Incasso massivo', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Incasso massivo')
        cy.get('.backoffice-card').find('a').contains('Incasso massivo').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('a:contains("Apri filtri"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Sollecito titoli', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Sollecito titoli')
        cy.get('.backoffice-card').find('a').contains('Sollecito titoli').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Gestione Sollecito Titoli")')
        getIFrame().find('#buttonCerca:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    })

    it('Verifica apertura disambiguazione: Impostazione contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Impostazione contabilità')
        cy.get('.backoffice-card').find('a').contains('Impostazione contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
        getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
    });

    
})