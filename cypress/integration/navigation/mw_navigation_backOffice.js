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

// beforeEach(() => {
//         cy.viewport(1920, 1080)
//         cy.visit('https://matrix.pp.azi.allianz.it/')
//         cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
//         cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
//         cy.get('input[type="SUBMIT"]').click()
//         cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
// })

// afterEach(() => {
//         cy.get('.user-icon-container').click()
//         cy.contains('Logout').click()
//         cy.wait(delayBetweenTests)
// })

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
    cy.wait(delayBetweenTests)
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
        cy.get('lib-breadcrumbs').find('span').should('contain','Primo comandamento: GED, GED e solo GED')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        //TODO Verfica aggancio a GED
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
        cy.get('lib-breadcrumbs').find('span').should('contain','Movimentazione sinistri')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Denuncia').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Denuncia')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Denuncia BMP').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Denuncia BMP')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Consultazione sinistri').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Consultazione sinistri')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Sinistri incompleti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Sinistri incompleti')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Sinistri canalizzati').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Sinistri canalizzati')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        //#endregion

        //#region Contabilita
        cy.get('.backoffice-card').find('a').contains('Sintesi Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Sintesi Contabilità')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Giornata contabile').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Giornata contabile')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Consultazione Movimenti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Consultazione Movimenti')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()


        cy.get('.backoffice-card').find('a').contains('Estrazione Contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Estrazione Contabilità')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Deleghe SDD').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Deleghe SDD')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Quadratura unificata').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Quadratura unificata')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        
        cy.get('.backoffice-card').find('a').contains('Incasso per conto').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Incasso per conto')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        
        cy.get('.backoffice-card').find('a').contains('Incasso massivo').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Incasso massivo')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
                
        cy.get('.backoffice-card').find('a').contains('Sollecito titoli').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Sollecito titoli')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()

        cy.get('.backoffice-card').find('a').contains('Impostazione contabilità').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
        cy.get('lib-breadcrumbs').find('span').should('contain','Impostazione contabilità')
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        //#endregion


    });

})