/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */
// TODO: NON INIZIATO


/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000
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
const canaleFromPopup = () => {cy.get('body').then($body => {
        if ($body.find('nx-modal-container').length > 0) {   
            cy.get('nx-modal-container').find('.agency-row').first().click()
        }
    });
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
    cy.clearLocalStorage();
  
    cy.intercept('POST', '/graphql', (req) => {
    // if (req.body.operationName.includes('notifications')) {
    //     req.alias = 'gqlNotifications'
    // }
    if (req.body.operationName.includes('news')) {
        req.alias = 'gqlNews'
    }
    })
    cy.viewport(1920, 1080)
  
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait('@gqlNews')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
  })
  
  after(() => {
    cy.get('body').then($body => {
        if ($body.find('.user-icon-container').length > 0) {   
            cy.get('.user-icon-container').click();
            cy.wait(1000).contains('Logout').click()
            cy.wait(delayBetweenTests)
        }
    });
    cy.clearCookies();
  })


describe('Matrix Web : Navigazioni da Burger Menu in Backoffice', function () {

    it('Verifica link da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        const linksBurger = [
            'Home Backoffice',
            'Movimentazione sinistri',
            'Denuncia',
            'Denuncia BMP',
            'Consultazione sinistri',
            'Sinistri incompleti',
            'Sinistri canalizzati',
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
        cy.get('lib-side-menu-link').find('a').should('have.length',19).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    });

    //#region Sinistri
    it('Verifica aggancio Movimentazione sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Movimentazione sinistri').click()
        cy.intercept({
            method: 'POST',
            url: /dasincruscotto*/
        }).as('getDasincruscotto');
        canaleFromPopup()
        cy.wait('@getDasincruscotto', { requestTimeout: 20000 });
        getIFrameMoveSinistri().find('#CmdAggiorna:contains("Ricerca"):visible')
        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Denuncia', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Denuncia').click()
        canaleFromPopup()
        getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        getIFrameDenuncia().find('a:contains("Esegui Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Denuncia BMP', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Denuncia BMP').click()
        canaleFromPopup()
        cy.wait(20000)
        getIFrame().find('fnol-root:contains("Continua"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Consultazione sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Consultazione sinistri').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Sinistri incompleti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Sinistri incompleti').click()
        canaleFromPopup()
        getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Sinistri canalizzati', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Sinistri canalizzati').click()
        canaleFromPopup()
        getIFrame().find('a:contains("Filtra"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })
    //#endregion

    //#region Contabilità
    it('Verifica aggancio Sintesi Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Sintesi Contabilità').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
        getIFrame().find('span:contains("Esporta"):visible').click()
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Giornata contabile', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Giornata contabile').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Calendario"):visible')
        getIFrame().find('button:contains("Chiudi giornata contabile"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Consultazione Movimenti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Consultazione Movimenti').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Estrazione Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Estrazione Contabilità').click()
        canaleFromPopup()
        getIFrame().find('h3:contains("ExtraDAS"):visible')
        getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
        getIFrame().find('p:contains("Legenda"):visible')
        getIFrame().find('button:contains("Ricerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Deleghe SDD', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Deleghe SDD').click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('input[value="Carica"]').invoke('attr','value').should('equal','Carica')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

 /*   it('Verifica aggancio Quadratura unificata', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Quadratura unificata').click()
        canaleFromPopup()
        getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
        getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
        getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
        getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })*/

    it('Verifica aggancio Incasso per conto', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Incasso per conto').click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Incasso massivo', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Incasso massivo').click()
        canaleFromPopup()
        getIFrame().find('a:contains("Apri filtri"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Sollecito titoli', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Sollecito titoli').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Gestione Sollecito Titoli")')
        getIFrame().find('#buttonCerca:contains("Cerca"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Impostazione contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Impostazione contabilità').click()
        canaleFromPopup()
        getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
        getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })

    it('Verifica aggancio Convenzioni in trattenuta', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Convenzioni in trattenuta').click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('#contentPane:contains("Gestione"):visible')
        cy.get('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })
    //#endregion

    //TODO:aggiungere su tfs
    it('Verifica aggancio Monitoraggio Customer Digital Footprint', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Customer Digital Footprint').invoke('removeAttr','target').click()
        cy.url().should('include', 'cdf')
        cy.go('back')
        cy.get('a').contains('Backoffice').click()
        cy.url().should('eq', baseUrl + 'back-office')
    })
})