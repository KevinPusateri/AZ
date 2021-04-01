/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 15000)
const delayBetweenTests = 2000;
//#endregion

//#region  Global Variables
const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()
//#endregion

beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
})

afterEach(() => {
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
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-upcoming-dates').click()
        cy.url().should('include', '/event-center')
        cy.get('lib-sub-header-right').click()
    });

    it('Verifica Gestione Documentale', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-news-image').click();
        closePopup()
        //TODO Verfica aggancio a GED
    });

    it('Verifica Sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('.backoffice-card').find('a').should(($labelCard) =>{
            expect($labelCard).to.contain('Movimentazione sinistri')
            expect($labelCard).to.contain('Denuncia')
            expect($labelCard).to.contain('Denuncia BMP')
            expect($labelCard).to.contain('Consultazione sinistri')
            expect($labelCard).to.contain('Sinistri incompleti')
            expect($labelCard).to.contain('Sinistri canalizzati')
        })
    });

    it('Verifica Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('.backoffice-card').find('a').should(($labelCard) =>{
            expect($labelCard).to.contain('Sintesi Contabilità')
            expect($labelCard).to.contain('Giornata contabile')
            expect($labelCard).to.contain('Consultazione Movimenti')
            expect($labelCard).to.contain('Estrazione Contabilità')
            expect($labelCard).to.contain('Deleghe SDD')
            expect($labelCard).to.contain('Quadratura unificata')
            expect($labelCard).to.contain('Incasso per conto')
            expect($labelCard).to.contain('Incasso massivo')
            expect($labelCard).to.contain('Sollecito titoli')
            expect($labelCard).to.contain('Impostazione contabilità')
        })
    });

    it('Verifica apertura disambiguazione per voci Sinistri e Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('.backoffice-card').find('a').each(($labelCard) =>{
            cy.get($labelCard).click()
            closePopup()
            //TODO verificare agganci applicativi
        })
    });
})