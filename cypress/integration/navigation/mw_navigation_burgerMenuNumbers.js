/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 3000
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
const canaleFromPopup = () => cy.wait(1000).get('nx-modal-container').find('.agency-row').first().click()

//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
          req.alias = 'gqlNotifications'
        }
      })
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
    cy.wait('@gqlNotifications')
})

afterEach(() => {
    cy.wait(1000).get('.user-icon-container').click()
    cy.wait(1000).contains('Logout').click()
    cy.wait(delayBetweenTests)
    
    cy.clearCookies();
})

describe('Matrix Web : Navigazioni da Burger Menu in Numbers', function () {

    it('Verifica i link da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()

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
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Fonti').click()
        canaleFromPopup()
        getIFrame().find('a:contains("Filtra")')
        cy.get('a').contains('Numbers').click()
    })

    //TODO: verifica
    // it('Verifica aggancio Monitoraggio Carico', function () {
    // cy.get('app-product-button-list').find('a').contains('Numbers').click()
    //     cy.url().should('include', '/numbers/business-lines')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('Monitoraggio Carico').click()
    //     canaleFromPopup()

    //     cy.get('a').contains('Numbers').click()
    // })
    
    it('Verifica aggancio Monitoraggio Carico per Fonte', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
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
        // cy.get('app-product-button-list').find('a').contains('Numbers').click()
    //     cy.url().should('include', '/numbers/business-lines')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('X - Advisor').click()
    //     canaleFromPopup()

    //     cy.get('a').contains('Numbers').click()
    // })


    it('Verifica aggancio Incentivazione', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Incentivazione').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Incentivazione: Maturato per Fonte"):visible')
        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Incentivazione Recruiting', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Incentivazione Recruiting').click()
        canaleFromPopup()
        getIFrame().find('[class="menu-padre"]:contains("Report"):visible')
        cy.get('a').contains('Numbers').click()
    })

    // DA RISOLVERE
    it('Verifica aggancio Andamenti Tecnici', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Andamenti Tecnici').click()
        // cy.intercept({
        //     method: 'GET',
        //     url: /AT/
        // }).as('at');
        canaleFromPopup()
        getIFrame().find('button:contains("Fonti produttive"):visible')
        // cy.wait('@at', { requestTimeout: 25000 });

        cy.get('a').contains('Numbers').click()
    })
    
    //TODO: INIZIARE DA QUI
    it('Verifica aggancio Estrazioni Avanzate', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Estrazioni Avanzate').click()
        cy.intercept({
            method: 'GET',
            url: /pentahoDA/
        }).as('pentahoDA');    
        canaleFromPopup()
        cy.wait('@pentahoDA', { requestTimeout: 25000 });
        getIFrame().find('a:contains("Nuovo Report"):visible')
        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Scarico Dati', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Scarico Dati').click()
        canaleFromPopup()
        getIFrame().find('form:contains("Esporta tracciato")')
        cy.get('a').contains('Numbers').click()
    })

    it.only('Verifica aggancio Indici Digitali', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Indici Digitali').click()
        canaleFromPopup()
        getIFrame().find('#toggleFilters:contains("Apri filtri")')
        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Danni', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Danni').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Ultra', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Ultra').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Vita', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Vita').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio New Business Allianz1', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('New Business Allianz1').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio PTF Danni', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio PTF Danni').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio Riserve Vita', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Riserve Vita').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Retention Motor', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Retention Motor').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Retention Rami Vari', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Retention Rami Vari').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio Andamento Premi', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Andamento Premi').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Monitoraggio Ricavi d\'Agenzia', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Ricavi d\'Agenzia').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })

    it('Verifica aggancio Capitale Vita Scadenza', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Capitale Vita Scadenza').click()
        canaleFromPopup()

        cy.get('a').contains('Numbers').click()
    })
})    