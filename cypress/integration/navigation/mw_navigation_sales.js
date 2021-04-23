/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
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

const canaleFromPopup = () => {cy.get('body').then($body => {
    if ($body.find('nx-modal-container').length > 0) {   
        cy.get('nx-modal-container').find('.agency-row').first().click()
    }
});
}
const buttonEmettiPolizza = () => cy.get('app-emit-policy-popover').find('button:contains("Emetti polizza")').click()
const popoverEmettiPolizza = () => cy.get('.card-container').find('lib-da-link')
//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.intercept('POST', '/graphql', (req) => {
        // if (req.body.operationName.includes('notifications')) {
        //     req.alias = 'gqlNotifications'
        // }
        if (req.body.operationName.includes('news')) {
            req.alias = 'gqlNews'
        }
    })
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/',{
        onBeforeLoad: win =>{
            win.sessionStorage.clear();
        }
    })
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
    cy.wait('@pageMatrix', { requestTimeout: 60000 });
    // cy.wait('@gqlNotifications');
    cy.wait('@gqlNews');
})

afterEach(() => {
    cy.get('body').then($body => {
        if ($body.find('.user-icon-container').length > 0) {   
            cy.get('.user-icon-container').click();
            cy.wait(1000).contains('Logout').click()
            cy.wait(delayBetweenTests)
        }
    });
    cy.clearCookies();
})

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

        cy.wait('@sferaGetPreferenzeFamiglieCampi', { requestTimeout: 60000 });

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
        
        cy.wait('@gqlCampaignAgent', { requestTimeout: 60000 });
        canaleFromPopup()
        cy.url().should('include', '/campaign-manager')
        getIFrame().find('a:contains("Campagne di vendita"):visible')

        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function(){

        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('app-quick-access').contains('Recupero preventivi e quotazioni').click()
        canaleFromPopup()
        cy.wait(10000);
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
        cy.wait('@inizializzaContratti', { requestTimeout: 60000 });
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })

    //TODO: GED - Gestione Documentale Apre new window
    // it('Verifica aggancio GED - Gestione Documentale', function(){

    // })

    it('Verifica aggancio Emetti Polizza - FastQuote Auto', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Auto').click()
        cy.intercept({
            method: 'GET',
            url: /FastQuoteAU_AD*/
        }).as('getFastQuoteAu');
        canaleFromPopup()
        cy.wait('@getFastQuoteAu', { requestTimeout: 60000 });
        getIFrame().find('form ').invoke('attr','value').should('equal','Cerca')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio').click()
        cy.intercept({
            method: 'GET',
            url: /ultra*/
        }).as('getUltra');
        canaleFromPopup()
        cy.wait('@getUltra', { requestTimeout: 60000 });
        getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Salute', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Salute').click()
        cy.intercept({
            method: 'GET',
            url: /ultra*/
        }).as('getUltra');
        canaleFromPopup()
        cy.wait('@getUltra', { requestTimeout: 60000 });
        getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio BMP', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio BMP').click()
        cy.intercept({
            method: 'GET',
            url: /ultra2*/
        }).as('getUltra2');
        canaleFromPopup()
        cy.wait('@getUltra2', { requestTimeout: 60000 });
        getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Emetti Polizza - Allianz1 Business', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz1 Business').click()
        cy.intercept({
            method: 'POST',
            url: /Danni*/
        }).as('getDanni');
        canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 60000 });
        getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Emetti Polizza - FastQuote Impresa e Albergo', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Impresa e Albergo').click()
        cy.intercept({
            method: 'POST',
            url: /Auto*/
        }).as('getAuto');
        canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 60000 });
        getIFrame().find('form input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Emetti Polizza - Preventivo anonimo Motor', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Preventivo anonimo Motor').click()
        cy.intercept({
            method: 'POST',
            url: /Auto*/
        }).as('getAuto');
        canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 60000 });
        getIFrame().find('form input[value="› Avanti"]').invoke('attr','value').should('equal','› Avanti')
        cy.get('a').contains('Sales').click()
    })

    // // TODO: non trova Home
    // it('Verifica aggancio Emetti Polizza - Preventivo anonimo Vita Individuali', function(){
    //     cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('include', '/sales')
    //     buttonEmettiPolizza()
    //     popoverEmettiPolizza().contains('Preventivo anonimo Vita Individuali').click()
    //     cy.intercept({
    //         method: 'POST',
    //         url: '**/Vita/**'
    //     }).as('getVitaP');
    //     cy.intercept({
    //         method: 'GET',
    //         url: '**/Vita/**'
    //     }).as('getVitaG');
    //     canaleFromPopup()
    //     cy.wait('@getVitaG', { requestTimeout: 60000 });
    //     cy.wait('@getVitaP', { requestTimeout: 60000 });
    //     getIFrame().find('#AZBuilder1_ctl14_cmdHome').invoke('attr','value').should('equal','Home')
    // })

    it('Verifica aggancio Emetti Polizza - MiniFlotte', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('MiniFlotte').click()
        cy.intercept({
            method: 'POST',
            url: /Auto*/
        }).as('getAuto');
        canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 60000 });
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
        cy.get('a').contains('Sales').click()

    })

    it('Verifica aggancio Emetti Polizza - Trattative Auto Corporate', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Trattative Auto Corporate').click()
        cy.intercept({
            method: 'POST',
            url: /Auto*/
        }).as('getAuto');
        canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 60000 });
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
        cy.get('a').contains('Sales').click()

    })

    it('Verifica aggancio Emetti Polizza - Gestione Richieste per PA', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Gestione Richieste per PA').click()
        cy.intercept({
            method: 'POST',
            url: /Danni*/
        }).as('getDanni');
        canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 40000 });
        getIFrame().find('#main-wrapper input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Estrai dettaglio', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        // fino al primo disponibile
        var nextCheckbox = cy.get('app-expiring-card').next().find('nx-checkbox').first()
        nextCheckbox.then(($btn) => {
            var check = true;
            cy.intercept({
                method: 'POST',
                url: /dacommerciale*/
            }).as('getDacommerciale');
            while(check){
                if(!$btn.hasClass('disabled')){
                cy.wrap($btn).click()
                cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
                cy.wait('@getDacommerciale', { requestTimeout: 40000 });
                getIFrame().find('#contentPane button:contains("Estrai Dettaglio"):visible')
                check = false
                }
            }
        })
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Appuntamento', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-upcoming-dates').click()
        cy.url().should('include', '/event-center')
        cy.get('lib-sub-header-right').click()
    })

    it('Verifica aggancio News image Primo comandamento', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-news-image').click();
        canaleFromPopup()
        getIFrame().find('app-header:contains("Primo Piano"):visible')
        getIFrame().find('app-header:contains("Tutte"):visible')
        cy.get('a').contains('Sales').click()

    })
    
    it('Verifica aggancio Preventivi e quotazioni - Card Danni', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
            req.body.variables.filter.tabCallType.includes('DAMAGE')) {
              req.alias = 'gqlDamage'
            }
        })
        cy.get('app-quotations-section').contains('Preventivi e quotazioni').click()
        cy.wait('@gqlDamage')
        cy.get('app-paginated-cards').find('button:contains("Danni")').click()
        cy.intercept({
            method: 'POST',
            url: /Danni*/
        }).as('getDanni');
        cy.get('.cards-container').find('.card').first().click()
        canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 60000 });
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })
    
    it('Verifica aggancio Preventivi e quotazioni Danni - button: Vedi Tutti', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
            req.body.variables.filter.tabCallType.includes('DAMAGE')) {
              req.alias = 'gqlDamage'
            }
        })
        cy.get('app-quotations-section').contains('Preventivi e quotazioni').click()
        cy.wait('@gqlDamage')
        cy.get('app-paginated-cards').find('button:contains("Danni")').click()
        cy.get('app-quotations-section').find('button:contains("Vedi tutti")').click()
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('getDanni');
        cy.intercept({
            method: 'GET',
            url: '**/Danni/**'
        }).as('getDanniG');
        canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 40000 });
        cy.wait('@getDanniG', { requestTimeout: 40000 });
        cy.get('#iframe-container').within(() =>{
            getIFrame().find('form:contains("Cerca"):visible')
        })
        cy.get('a').contains('Sales').click()

    })
    
    //TODO: Verifica Vita con Vita button Note visible
    it('Verifica aggancio Preventivi e quotazioni - Card Vita', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
            req.body.variables.filter.tabCallType.includes('LIFE')) {
              req.alias = 'gqlLife'
            }
        })
        cy.get('app-quotations-section').contains('Preventivi e quotazioni').click()
        cy.wait('@gqlLife')
        cy.get('app-paginated-cards').find('button:contains("Vita")').click()
        cy.get('.cards-container').find('.card').first().click()
        canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('#AZBuilder1_ctl08_cmdNote')
        cy.get('a').contains('Sales').click()

    })

    // TODO
    // it('Verifica aggancio Preventivi e quotazioni Vita - button: Vedi Tutti', function(){
    //     cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('include', '/sales')
    //     cy.intercept('POST', '/graphql', (req) => {
    //         if (req.body.operationName.includes('salesContract') &&
    //         req.body.variables.filter.tabCallType.includes('LIFE')) {
    //           req.alias = 'gqlLife'
    //         }
    //     })
    //     cy.get('app-quotations-section').contains('Preventivi e quotazioni').click()
    //     cy.wait('@gqlLife')
    //     cy.get('app-paginated-cards').find('button:contains("Vita")').click()
    //     cy.get('app-quotations-section').find('button:contains("Vedi tutti")').click()
    //     cy.intercept({
    //         method: 'POST',
    //         url: '**/Danni/**'
    //     }).as('getDanni');
    //     cy.intercept({
    //         method: 'GET',
    //         url: '**/Danni/**'
    //     }).as('getDanniG');
    //     canaleFromPopup()
    //     cy.wait('@getDanni', { requestTimeout: 40000 });
    //     cy.wait('@getDanniG', { requestTimeout: 40000 });
    //     cy.get('#iframe-container').within(() =>{
    //         getIFrame().find('form:contains("Cerca"):visible')
    //     })
    // })

    it('Verifica aggancio Proposte Danni - Card Danni', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
            req.body.variables.filter.tabCallType.includes('DAMAGE')) {
              req.alias = 'gqlDamage'
            }
        })
        cy.get('app-proposals-section').contains('Proposte').click()
        cy.wait('@gqlDamage')
        cy.get('app-paginated-cards').find('button:contains("Danni")').click()
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('getAuto');
        cy.get('.cards-container').find('.card').first().click()
        canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 60000 });
        getIFrame().find('a:contains("« Uscita"):visible')
        cy.get('a').contains('Sales').click()
    })

    
    it('Verifica aggancio Proposte Danni - button: Vedi Tutte', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
            req.body.variables.filter.tabCallType.includes('DAMAGE')) {
              req.alias = 'gqlDamage'
            }
        })
        cy.get('app-proposals-section').contains('Proposte').click()
        cy.wait('@gqlDamage')
        cy.get('app-paginated-cards').find('button:contains("Danni")').click()
        cy.get('app-proposals-section').find('button:contains("Vedi tutte")').click()
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('getDanni');
        cy.intercept({
            method: 'GET',
            url: '**/Danni/**'
        }).as('getDanniG');
        canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 40000 });
        cy.wait('@getDanniG', { requestTimeout: 40000 });
        cy.get('#iframe-container').within(() =>{
            getIFrame().find('form:contains("Cerca"):visible')
        })
        cy.get('a').contains('Sales').click()

    })

    // TODO: stesso problema sopra Frame
    // it('Verifica aggancio Proposte Vita - Card Vita', function(){
    //     cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('include', '/sales')
    //     cy.intercept('POST', '/graphql', (req) => {
    //         if (req.body.operationName.includes('salesContract') &&
    //         req.body.variables.filter.tabCallType.includes('LIFE')) {
    //           req.alias = 'gqlLife'
    //         }
    //     })
    //     cy.get('app-proposals-section').contains('Proposte').click()
    //     cy.wait('@gqlLife')
    //     cy.get('app-paginated-cards').find('button:contains("Vita")').click()
    //     cy.intercept({
    //         method: 'POST',
    //         url: '**/Vita/**'
    //     }).as('getVita');
    //     cy.get('.cards-container').find('.card').first().click()
    //     cy.wait('@getVita', { requestTimeout: 60000 });
    //     getIFrame().find('#AZBuilder1_ctl08_cmdNote')
    // cy.get('a').contains('Sales').click()

    // })

    it('Verifica aggancio Proposte Vita - button: Vedi Tutti', function(){
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
            req.body.variables.filter.tabCallType.includes('LIFE')) {
              req.alias = 'gqlLife'
            }
        })
        cy.get('app-proposals-section').contains('Proposte').click()
        cy.wait('@gqlLife')
        cy.get('app-paginated-cards').find('button:contains("Vita")').click()
        cy.get('app-proposals-section').find('button:contains("Vedi tutte")').click()
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('getDanni');
        cy.intercept({
            method: 'GET',
            url: '**/Danni/**'
        }).as('getDanniG');
        canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 40000 });
        cy.wait('@getDanniG', { requestTimeout: 40000 });
        cy.get('#iframe-container').within(() =>{
            getIFrame().find('form:contains("Cerca"):visible')
        })
        cy.get('a').contains('Sales').click()
    })

});