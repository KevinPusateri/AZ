/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const baseUrl = Cypress.env('baseUrl') 
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

const canaleFromPopup = () => {cy.get('body').then($body => {
        if ($body.find('nx-modal-container').length > 0) {   
            cy.get('nx-modal-container').find('.agency-row').first().click()
        }
    });
}
//#endregion

before(() => {
    LoginPage.logInMW(userName, psw)
})
  
beforeEach(() => {
    cy.preserveCookies()
})
  
after(() => {
    TopBar.logOutMW()
})

describe('Matrix Web : Navigazioni da BackOffice', function () {

   it('Verifica atterraggio su BackOffice', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    });

    it('Verifica atterraggio Appuntamenti Futuri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-upcoming-dates').click()
        cy.url().should('eq', baseUrl + 'event-center')
        cy.get('lib-sub-header-right').click()
        cy.url().should('eq', baseUrl + 'back-office')
    });

    // non compare piu
    // it('Verifica Gestione Documentale', function () {
    //     cy.url().should('eq', baseUrl + 'back-office')
    //     cy.get('lib-news-image').click();
    //     cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
    //     //TODO 2 minuti dura TROPPO
    //     getIFrame().find('a:contains("Primo Piano"):visible')
    //     getIFrame().find('span:contains("Primo comandamento: GED, GED e solo GED"):visible')

    //     cy.get('lib-breadcrumbs').contains('Backoffice').click()
    //     cy.url().should('eq', baseUrl + 'back-office')
    // });

    it('Verifica Sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
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
        cy.url().should('eq', baseUrl + 'back-office')
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
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('have.length', 12).each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsContabilita[i])
        })
    });

    it('Verifica apertura disambiguazione: Movimentazione Sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('.backoffice-card').find('a').contains('Movimentazione sinistri').click()
        canaleFromPopup()
        getIFrameMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
        getIFrameMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
        getIFrameMoveSinistri().find('a:contains("Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Denuncia', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Denuncia')
        cy.get('.backoffice-card').find('a').contains('Denuncia').click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        getIFrameDenuncia().find('a:contains("Esegui Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Denuncia BMP', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Denuncia BMP')
        cy.get('.backoffice-card').find('a').contains('Denuncia BMP').click()
        cy.wait(5000)
        canaleFromPopup()
        cy.wait(20000)
        getIFrame().find('h4:contains("Dettaglio cliente"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Consultazione sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Consultazione sinistri')
        cy.get('.backoffice-card').find('a').contains('Consultazione sinistri').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Sinistri incompleti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Sinistri incompleti')
        cy.get('.backoffice-card').find('a').contains('Sinistri incompleti').click()
        canaleFromPopup()
        getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Sinistri canalizzati', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').first().find('a').should('contain','Sinistri canalizzati')
        cy.get('.backoffice-card').find('a').contains('Sinistri canalizzati').click()
        canaleFromPopup()
        getIFrame().find('a:contains("Filtra"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })
    
    it('Verifica apertura disambiguazione: Sintesi Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Sintesi Contabilità')
        cy.get('.backoffice-card').find('a').contains('Sintesi Contabilità').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
        getIFrame().find('span:contains("Esporta"):visible').click()
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Giornata contabile', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Giornata contabile')
        cy.get('.backoffice-card').find('a').contains('Giornata contabile').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Calendario"):visible')
        getIFrame().find('button:contains("Chiudi giornata contabile"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Consultazione Movimenti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Consultazione Movimenti')
        cy.get('.backoffice-card').find('a').contains('Consultazione Movimenti').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Estrazione Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Estrazione Contabilità')
        cy.get('.backoffice-card').find('a').contains('Estrazione Contabilità').click()
        canaleFromPopup()
        getIFrame().find('h3:contains("ExtraDAS"):visible')
        getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
        getIFrame().find('p:contains("Legenda"):visible')
        getIFrame().find('button:contains("Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Deleghe SDD', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Deleghe SDD')
        cy.get('.backoffice-card').find('a').contains('Deleghe SDD').click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('input[value="Carica"]').invoke('attr','value').should('equal','Carica')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

/*    it('Verifica apertura disambiguazione: Quadratura unificata', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Quadratura unificata')
        cy.get('.backoffice-card').find('a').contains('Quadratura unificata').click()
        canaleFromPopup()
        getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
        getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
        getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
        getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })*/

    it('Verifica apertura disambiguazione: Incasso per conto', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Incasso per conto')
        cy.get('.backoffice-card').find('a').contains('Incasso per conto').click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })
       
    it('Verifica apertura disambiguazione: Incasso massivo', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Incasso massivo')
        cy.get('.backoffice-card').find('a').contains('Incasso massivo').click()
        canaleFromPopup()
        getIFrame().find('a:contains("Apri filtri"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Sollecito titoli', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Sollecito titoli')
        cy.get('.backoffice-card').find('a').contains('Sollecito titoli').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Gestione Sollecito Titoli")')
        getIFrame().find('#buttonCerca:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica apertura disambiguazione: Impostazione contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Impostazione contabilità')
        cy.get('.backoffice-card').find('a').contains('Impostazione contabilità').click()
        canaleFromPopup()
        getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
        getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    });

    it('Verifica apertura disambiguazione: Convenzioni in trattenuta', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Convenzioni in trattenuta')
        cy.get('.backoffice-card').find('a').contains('Convenzioni in trattenuta').click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('#contentPane:contains("Gestione"):visible')
        cy.get('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    });

    it('Verifica apertura disambiguazione: Monitoraggio Customer Digital Footprint', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Monitoraggio Customer Digital Footprint')
        cy.get('app-backoffice-cards-list').eq(1).find('a[href="https://portaleagenzie.pp.azi.allianz.it/cdf/"]')
        .invoke('removeAttr','target').click()
        cy.url().should('include', 'cdf')
        cy.go('back')
        cy.get('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    });
})

