/// <reference types="Cypress" />
Cypress.config('defaultCommandTimeout', 20000)
const getApp = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
  }
  
  const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()
  

describe('Login Matrix Web', function () {

    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()

    })


    it('Home MW', function () {

        cy.get('lib-calendar').click()
        cy.get('lib-incident').click()
        cy.get('lib-notification-header').click()
        cy.get('lib-user-header').click()

        cy.get('lib-switch-button').click()
        cy.get('.lib-switch-button-list-column').should('have.length',6)

        cy.get('lib-switch-button-list').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('a[href="/matrix/"]').click()

        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('a[href="/matrix/"]').click()

        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('a[href="/matrix/"]').click()

        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('a[href="/matrix/"]').click()

        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.get('a[href="/matrix/"]').click()

        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Le mie info').click()
        cy.url().should('include', '/my-info')
        cy.get('a[href="/matrix/"]').click()

        cy.get('input').invoke('attr', 'placeholder').should('contain', 'Cerca in Matrix')

        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.get('a[href="/matrix/"]').click()

        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('a[href="/matrix/"]').click()

        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.get('a[href="/matrix/"]').click()

        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('a[href="/matrix/"]').click()

        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.get('a[href="/matrix/"]').click()

        cy.get('app-product-button-list').find('a').contains('Le mie info').click()
        cy.url().should('include', '/my-info')
        cy.get('a[href="/matrix/"]').click()

        cy.get('.homepage-container').contains('Vai al Centro notifiche').click()
        cy.url().should('include', '/notification-center#portafoglio')
        cy.get('a[href="/matrix/"]').click()

        // TODO
        // cy.wait(5000)
        // if(!cy.get('.lib-notification-card').length){
        //     cy.get('.lib-notification-card').find('lib-da-link').first().click()
        // }

        cy.get('app-news-top-bar-title-cta').contains('Vedi tutte').click()
        cy.url().should('include', '/news/recent')
        cy.get('a[href="/matrix/"]').click()

        cy.get('lib-da-link').contains('Banche Dati ANIA').click()
        cy.get('a[href="/matrix/"]').click()
        cy.get('.nx-margin-bottom-2m').first().click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })

        cy.get('.search-in-homepage').type('Ro').type('{enter}')
        cy.get('lib-client-item').first().click()
        cy.get('a[href="/matrix/"]').click()

    });


    it('Navigation Scheda cliente', function () {

        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

        // Ricerca primo cliente Calogero Messina 
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
        cy.get('lib-client-item').first().click()

        // Verifica Tab clients corretti
        cy.get('app-client-profile-tabs').find('a').should(($tab) => {
            expect($tab).to.contain('SINTESI CLIENTE')
            expect($tab).to.contain('DETTAGLIO ANAGRAFICA')
            expect($tab).to.contain('PORTAFOGLIO')
            expect($tab).to.contain('ARCHIVIO CLIENTE')
            expect($tab).to.length(4)

        })

        // Verifica button "mostra" apertura e chiusura popup
        cy.get('app-client-situation').find('.value-link').click();
        cy.get('.cdk-overlay-container').find('nx-icon').click();


        cy.get('app-ultra-parent-tabs').find('nx-tab-header').should(($tab) => {
            expect($tab).to.contain('Casa e Patrimonio')
            expect($tab).to.contain('Salute')
        })

        cy.get('app-section-title').should(($title) => {
            // expect($title).to.contain('Situazione cliente')
            expect($title).to.contain('Fast Quote')
            expect($title).to.contain('Emissioni')
            // expect($title).to.contain('Contratti in evidenza')
            // expect($title).to.length(4)
        })

        cy.get('.card-container').find('app-kpi-dropdown-card').should(($tabCard) => {
            expect($tabCard).to.contain('Auto')
            expect($tabCard).to.contain('Rami vari')
            expect($tabCard).to.contain('Vita')
            expect($tabCard).to.length(3)

        })

        cy.get('.card-container').find('app-kpi-dropdown-card').each(function ($card, index, $list) {
            cy.wrap($card).click()
        })
        // Verifica Menu tendina client
        cy.get('app-contract-card').find('nx-icon').click({ multiple: true })
        cy.get('app-client-resume-card').find('nx-icon[aria-label="Open menu"]').click()

        // TODO:
        // if(cy.get('app-proposals-in-evidence').contains('Contratti in evidenza')){

        //     cy.get('app-contract-card').find('[class$="card-padder"]').each(function($card, index, $list){
        //         cy.wrap($card).click()
        //     })
        // }

    })

    it('burger Menu Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')

        cy.get('lib-burger-icon').click()
        cy.contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        cy.get('a').contains('Clients').click()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Censimento nuovo cliente').click()
        cy.url().should('include', '/new-client')
        cy.get('a').contains('Clients').click()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Pannello anomalie').click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })
        cy.wait(5000)

        cy.contains('Clienti duplicati').click()
        cy.get('a').contains('Clients').click()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti').click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })

        cy.contains('Cancellazione Clienti per fonte').click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })

        cy.contains('Gestione fonte principale').click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })

        cy.contains('Antiriciclaggio').click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })

        cy.contains('Allianz Ultra BMP').click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })


    })

    it('Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')

        cy.get('app-rapid-link').contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        cy.get('a').contains('Clients').click()

        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        closePopup()
        cy.wait(4000)

        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        cy.get('a').contains('Clients').click()
        
        cy.get('app-rapid-link').contains('Antiriciclaggio').click()
        closePopup()

        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        cy.get('a').contains('Clients').click()

        cy.get('.actions-box').contains('Vai a visione globale').click()
        cy.get('a').contains('Clients').click()
        cy.get('.meetings').click()

    })

    it.only('Sales', function () {

        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
     
        cy.get('app-quick-access').contains('Sfera').click()
        closePopup()
        
        cy.get('app-quick-access').contains('Campagne Commerciali').click()
        cy.url().should('include', '/campaign-manager')
        cy.get('a').contains('Sales').click()

        cy.get('app-quick-access').contains('Recupero preventivi e quotazioni').click()
        closePopup()

        cy.get('app-quick-access').contains('Monitoraggio Polizze Proposte').click()
        closePopup()
     
        cy.get('app-quick-access').contains('GED – Gestione Documentale').click()
        closePopup()

//from here
        const buttonEmettiPolizza = () => cy.get('app-emit-policy-popover').find('button:contains("Emetti polizza")').click()
        const popoverEmettiPolizza = () => cy.get('.card-container').find('lib-da-link')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Auto').click()
        closePopup()
        cy.wait(1000)
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio').click()
        closePopup()
        cy.wait(1000)
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Salute').click()
        closePopup()
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio BMP').click()
        closePopup() 
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz1 Business').click()
        closePopup()
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Impresa e Albergo').click()
        closePopup()
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Preventivo anonimo Motor').click()
        closePopup()
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Preventivo anonimo Vita Individuali').click()
        closePopup()
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('MiniFlotte').click()
        closePopup()
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Trattative Auto Corporate').click()
        closePopup()
        cy.wait(1000)

        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Gestione Richieste per PA').click()
        closePopup()
        
        /*
        cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
        closePopup()

        cy.get('lib-upcoming-dates').click()
        cy.url().should('include', '/event-center')
        cy.get('lib-sub-header-right').click()

        cy.get('app-numbers-banner').click()
        cy.url().should('include', '/numbers/operational-indicators')
        cy.go('back')
        cy.get('lib-news-image').click();
        closePopup()
      
        // TODO card
        cy.get('.cards-container').find('.card').each(($card,index) => {
            cy.wrap($card).click()
            getApp().contains('Home').click()
        });
        
        // if ((cy.get('.cards-container').find('.card')).length > 0) {
        //     cy.get('.cards-container').find('.card').first().click()
        //     cy.get('a').contains('Sales').click()
        // }
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
*/
    })


    it('Numbers', function () {

        cy.contains('Numbers').click({ force: true })
        cy.wait(3000)

        cy.contains('LINEE DI BUSINESS').click()
        cy.wait(3000)
        cy.url().should('include', '/business-lines')
        // cy.contains('Premi').click({force: true})
        // cy.wait(3000)
        // cy.contains('Pezzi').click({force: true})
        // cy.wait(3000)
        cy.contains('DANNI').click()
        cy.wait(3000)
        cy.contains('VITA').click()
        cy.wait(3000)

        cy.contains('PRODOTTI').click({ force: true })
        cy.wait(3000)
        cy.url().should('include', '/products')

        cy.contains('INDICATORI OPERATIVI').click({ force: true })
        cy.wait(3000)
        cy.url().should('include', '/operational-indicators')

        cy.contains('INCENTIVI').click({ force: true })
        cy.wait(3000)
        cy.url().should('include', '/incentives')

    })

    it('Backoffice', function () {

        cy.contains('Backoffice').click({ force: true })
        cy.wait(3000)

        cy.url().should('include', '/back-office')
    })


    it('News', function () {

        cy.contains('News').click({ force: true })
        cy.wait(3000)

        cy.url().should('include', '/news/home')
    })


    it('Le Mie Info', function () {

        cy.contains('Le mie info ').click({ force: true })
        cy.wait(3000)

        cy.url().should('include', '/my-info')
    })
});