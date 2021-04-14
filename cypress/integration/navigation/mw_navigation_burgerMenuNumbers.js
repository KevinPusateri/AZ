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

const getIFrameProva = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('wrapper').should('not.be.undefined').then(cy.wrap)
}
//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
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
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.get('app-product-button-list').find('a').contains('Numbers').click()
})

after(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
})

describe('Matrix Web : Navigazioni da Burger Menu in Numbers', function () {

    it('Verifica i link da Burger Menu', function () {
        const linksBurger = [
            'Home Numbers',
            'Monitoraggio Fonti',
            'Monitoraggio Carico',
            'Monitoraggio Carico per Fonte',
            'X - Advisor',
            'Incentivazione',
            'Incentivazione Recruiting',
            'Andamenti Tecnici',
            'Estrazioni Avanzate',
            'Scarico Dati',
            'Indici Digitali',
            'New Business Danni',
            'New Business Ultra',
            'New Business Vita',
            'New Business Allianz1',
            'Monitoraggio PTF Danni',
            'Monitoraggio Riserve Vita',
            'Retention Motor',
            'Retention Rami Vari',
            'Monitoraggio Andamento Premi',
            'Monitoraggio Ricavi d\'Agenzia',
            'Capitale Vita Scadenza'
        ]
        
        cy.get('lib-side-menu-link').find('a').should('have.length',22).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    })

    it('Verifica aggancio Monitoraggio Fonti', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Fonti').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('a:contains("Filtra")')
        cy.get('a').contains('Numbers').click()
    })

    //TODO: verifica
    // it('Verifica aggancio Monitoraggio Carico', function () {
    //     cy.url().should('include', '/numbers/business-lines')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('Monitoraggio Carico').click()
    //     cy.get('nx-modal-container').find('.agency-row').first().click()

    //     cy.get('a').contains('Numbers').click()
    // })
    
    it('Verifica aggancio Monitoraggio Carico per Fonte', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.intercept({
            method: 'POST',
            url: /GetApplicationInitData/
        }).as('getApplicationInitData');
        cy.contains('Monitoraggio Carico per Fonte').click()
        cy.wait('@getApplicationInitData', { requestTimeout: 25000 });
        getIFrame().find('button:contains("Applica filtri":visible')
        cy.get('a').contains('Numbers').click()
    })


    //TODO: connessione non sicura
    // it.only('Verifica aggancio X - Advisor', function () {
    //     cy.url().should('include', '/numbers/business-lines')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('X - Advisor').click()
    //     cy.get('nx-modal-container').find('.agency-row').first().click()

    //     cy.get('a').contains('Numbers').click()
    // })


    it('Verifica aggancio Incentivazione', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Incentivazione').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Incentivazione: Maturato per Fonte"):visible')
        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Incentivazione Recruiting', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Incentivazione Recruiting').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('[class="menu-padre"]:contains("Report"):visible')
        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Andamenti Tecnici', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Andamenti Tecnici').click()
        // cy.intercept({
        //     method: 'GET',
        //     url: /AT/
        // }).as('at');
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Fonti produttive"):visible')
        // cy.wait('@at', { requestTimeout: 25000 });

        cy.get('a').contains('Numbers').click()
    })
    
    //TODO: INIZIARE DA QUI controlla FrameProva method its
    it.only('Verifica aggancio Estrazioni Avanzate', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Estrazioni Avanzate').click()
        cy.intercept({
            method: 'GET',
            url: /pentahoDA/
        }).as('pentahoDA');    
        cy.get('nx-modal-container').find('.agency-row').first().click()
        cy.wait('@pentahoDA', { requestTimeout: 25000 });
        getIFrameProva().find('a:visible')
        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Scarico Dati', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Scarico Dati').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Indici Digitali', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Indici Digitali').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Danni', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Danni').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Ultra', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Ultra').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Vita', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Vita').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Allianz1', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Allianz1').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio PTF Danni', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio PTF Danni').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio Riserve Vita', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Riserve Vita').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Retention Motor', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Retention Motor').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Retention Rami Vari', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Retention Rami Vari').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio Andamento Premi', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Andamento Premi').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio Ricavi d\'Agenzia', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Ricavi d\'Agenzia').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Capitale Vita Scadenza', function () {
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Capitale Vita Scadenza').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()

        cy.get('a').contains('Numbers').click()
    })
})    