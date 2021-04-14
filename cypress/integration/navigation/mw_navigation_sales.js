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

const canaleFromPopup = () => cy.wait(1000).get('nx-modal-container').find('.agency-row').first().click()
const buttonEmettiPolizza = () => cyget('app-emit-policy-popover').find('button:contains("Emetti polizza")').click()
const popoverEmettiPolizza = () => cy.get('.card-container').find('lib-da-link')
//#endregion

//#region beforeEach/after
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
    cy.get('body').then($body => {
        if ($body.find('lib-access-error').length === 1 ||
            $body.find('pre:contains("OK(nginx)")').length === 1 ||
            $body.find('pre:contains("FL(nginx)")').length === 1 ||
            $body.find('#runningInEndUserLoginEnvironment').length === 1){
             cy.reload()
             cy.visit('https://matrix.pp.azi.allianz.it/')
            }
        })
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.wait('@gqlNotifications')
})

after(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
    cy.clearCookies();
})
//#endregion

describe('Matrix Web : Navigazioni da Sales', function () {

    it('Verifica aggancio Sales', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
    })

    it('Verifica aggancio Sfera', function () {

        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')

        cy.intercept({
            method: 'POST',
            url: /GetPreferenzeFamiglieCampi/
          }).as('sferaGetPreferenzeFamiglieCampi');

        cy.get('app-quick-access').contains('Sfera').click()
        canaleFromPopup()

        cy.wait('@sferaGetPreferenzeFamiglieCampi', { requestTimeout: 30000 });

        getIFrame().find('ul > li > span:contains("Quietanzamento"):visible')
        getIFrame().find('ul > li > span:contains("Visione Globale"):visible')
        getIFrame().find('ul > li > span:contains("Portafoglio"):visible')
        getIFrame().find('ul > li > span:contains("Clienti"):visible')
        getIFrame().find('ul > li > span:contains("Uscite Auto"):visible')
        getIFrame().find('ul > li > span:contains("Gestore Attività"):visible')
        getIFrame().find('ul > li > span:contains("Operatività"):visible')
        getIFrame().find('button:contains("Applica filtri"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Campagne Commerciali', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')

        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('campaignAgent')) {
            req.alias = 'gqlCampaignAgent'
            }
        })

        cy.get('app-quick-access').contains('Campagne Commerciali').click()
        
        cy.wait('@gqlCampaignAgent', { requestTimeout: 30000 });

        cy.url().should('include', '/campaign-manager')
        getIFrame().find('a:contains("Campagne di vendita"):visible')

        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function(){

        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')

        cy.intercept({
            method: 'POST',
            url: /InizializzaContratti/
        }).as('inizializzaContratti');

        cy.get('app-quick-access').contains('Recupero preventivi e quotazioni').click()
        canaleFromPopup()

        cy.wait('@inizializzaContratti', { requestTimeout: 30000 });

        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })
        
    it('Verifica aggancio Monitoraggio Polizze Proposte', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')

        cy.intercept({
            method: 'POST',
            url: /InizializzaContratti/
        }).as('inizializzaContratti');

        cy.get('app-quick-access').contains('Monitoraggio Polizze Proposte').click()
        canaleFromPopup()

        cy.wait('@inizializzaContratti', { requestTimeout: 30000 });

        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })

    // TODO: continua Fastquote Auto: iframe
    it.only('Verifica aggancio Emetti Polizza - FastQuote Auto', function(){
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('countReceipts')) {
            req.alias = 'gqlCountReceipts'
            }
        })

        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')

        cy.wait('@gqlCountReceipts', { requestTimeout: 30000 });

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Auto').click()
        canaleFromPopup()
        cy.wait(1500)
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio').click()
        closePopup()
        cy.wait(1500)
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Salute').click()
        closePopup()
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio BMP').click()
        closePopup() 
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz1 Business').click()
        closePopup()
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Impresa e Albergo').click()
        closePopup()
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Preventivo anonimo Motor').click()
        closePopup()
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Preventivo anonimo Vita Individuali').click()
        closePopup()
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('MiniFlotte').click()
        closePopup()
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Trattative Auto Corporate').click()
        closePopup()
        cy.wait(1500)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Gestione Richieste per PA').click()
        closePopup()

        cy.get('app-homepage-section').find('.filter-button').click()
        cy.get('app-filters').contains('ANNULLA').click()
        cy.wait(2000)
        // cy.get('nx-checkbox').each(($btn) => {
        //     if ($btn.hasClass('disabled')) {
        //         cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
        //         closePopup()
        //     }else{
        //         cy.get($btn).click()
        //         cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
        //         cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/sales/')
        //     }
        // })

        // only first
        var firstcheckbox = cy.get('app-expiring-card').find('nx-checkbox').first()
        firstcheckbox.then(($btn) => {
            if($btn.hasClass('disabled')){                
                cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
                cy.get('button[aria-label="Close dialog"]').click()
            }else{
                cy.get($btn).click()
                cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
                cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/sales/')
                
            }
            
        })
        // fino al primo disponibile
        var nextCheckbox = cy.get('app-expiring-card').next().find('nx-checkbox').first()
        nextCheckbox.then(($btn) => {
            var check = true;

            while(check){
                if(!$btn.hasClass('disabled')){
                cy.wrap($btn).click()
                cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
                cy.wait(10000)
                cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/sales/')
                check = false
                }
            }
           
        })

        cy.get('lib-upcoming-dates').click()
        cy.url().should('include', '/event-center')
        cy.get('lib-sub-header-right').click()
        cy.wait(2000)

        // cy.get('app-numbers-banner').click()
        // cy.url().should('include', '/numbers/operational-indicators')
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/sales/')
        cy.get('lib-news-image').click();
        closePopup()

        // cy.get('button').then(($el) => {
            //     Cypress.dom.isAttached($el) // true
            //   })
            // console.log(cy.get('.cards-container').find('.damages'))
        cy.get('app-quotations-section').contains('Preventivi e quotazioni -').click()
        if(cy.get('.cards-container').find('.damages').should("exist")){
            cy.get('.cards-container').find('.card').first().click()
            getApp().find('button').contains('Home').click()
            cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/sales/')
        }

        cy.get('app-quotations-section').contains('Preventivi e quotazioni -').click()
        cy.get('app-quotations-section').contains('Vita').click()
        cy.get('app-quotations-section').find('button:contains("Vedi tutti")').click()
        closePopup()
        cy.get('app-quotations-section').contains('Danni').click()
        cy.get('app-quotations-section').find('button:contains("Vedi tutti")').click()
        closePopup()

        cy.get('app-proposals-section').contains('Proposte -').click()
        cy.get('app-proposals-section').contains('Vita').click()
        cy.get('app-proposals-section').find('button:contains("Vedi tutte")').click()
        closePopup()
        cy.get('app-proposals-section').contains('Danni').click()
        cy.get('app-proposals-section').find('button:contains("Vedi tutte")').click()
        closePopup()
    
    })
});