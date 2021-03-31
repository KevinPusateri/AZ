/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 15000)

const getApp = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
  
const closePopup = () => cy.get('button[aria-label="Close dialog"]').click()
const backToClients = () => cy.get('a').contains('Clients').click().wait(5000)
const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)


describe.only('Matrix Web : Navigazioni da Home Page - ', function () {

    it('Log In', function () {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    });

    it('Top Menu Principali', function () {

        cy.get('lib-calendar').click()
        cy.get('lib-incident').click()
        cy.get('lib-notification-header').click()
        cy.get('lib-user-header').click()

        cy.get('lib-switch-button').click()
        cy.get('.lib-switch-button-list-column').should('have.length',6)
    });

    it('Top Menu Clients', function () {
        cy.get('lib-switch-button-list').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Sales', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Numbers', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Backoffice', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu News', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Top Menu Le mie info', function () {
        cy.get('lib-switch-button').click()
        cy.get('lib-switch-button-list').contains('Le mie info').click()
        cy.url().should('include', '/lemieinfo')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Cerca in Matrix', function () {
        cy.get('input').invoke('attr', 'placeholder').should('contain', 'Cerca in Matrix')
    });

    it('Button Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Button Sales', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Button Numbers', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });
        
    it('Button Backoffice', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });
    it('Button News', function () {
        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('include', '/news/home')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click().wait(5000)
    });

    it('Centro notifiche', function () {
        cy.get('app-notification-top-bar').find('a').contains('Vai al Centro notifiche').click()
        cy.url().should('include', '/notification-center')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    it('Vedi tutte le news', function () {
        cy.get('app-news-top-bar-title-cta').contains('Vedi tutte').click()
        cy.url().should('include', '/news/recent')
        cy.wait(3000)
        cy.get('a[href="/matrix/"]').click()
    });

    // TODO:  notification card first
    // cy.wait(5000)
    // if(!cy.get('.lib-notification-card').length){
    //     cy.get('.lib-notification-card').find('lib-da-link').first().click()
    // }

    // cy.get('lib-da-link').contains('Banche Dati ANIA').click()
    // cy.get('a[href="/matrix/"]').click()
    // cy.get('.nx-margin-bottom-2m').first().click()
    // cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })


    //TODO: not found lib-client-item
    // cy.get('input[name="main-search-input"]').type('RO').type('{enter}')
    // cy.get('lib-client-item').first().click()
    // cy.get('a[href="/matrix/"]').click()
});

describe('Matrix Web : DA FARE', function () {
    it('Navigation Scheda Cliente', function () {

        // Ricerca primo cliente Calogero Messina 
        cy.get('input[name="main-search-input"]').type('Tentor Maurizio').type('{enter}')
        cy.get('lib-client-item').first().click()
        cy.wait(7000)

        // Verifica Tab clients corretti
        cy.get('app-client-profile-tabs').find('a').should(($tab) => {
            expect($tab).to.contain('SINTESI CLIENTE')
            expect($tab).to.contain('DETTAGLIO ANAGRAFICA')
            expect($tab).to.contain('PORTAFOGLIO')
            expect($tab).to.contain('ARCHIVIO CLIENTE')
            expect($tab).to.length(4)

        })

        cy.get('app-client-resume app-client-situation').then(($situazione) => {
            if($situazione.find('app-section-title .title').length > 0){
                cy.wrap($situazione).should('contain', 'Situazione cliente')
                cy.wrap($situazione).find('.content').should(($subtitle) =>{
                    expect($subtitle).to.contain('Totale premi annui')
                    expect($subtitle).to.contain('Totale danni')
                    expect($subtitle).to.contain('Vita puro rischio')
                    expect($subtitle).to.contain('Polizze attive')
                })
            }
        })

        cy.get('app-client-resume app-fast-quote').then(($fastquote) => {
            if($fastquote.find('app-section-title .title').length > 0){
                cy.wrap($fastquote).should('contain','Fast Quote')
                cy.wrap($fastquote).find('.subtitle').should('contain','Inserisci i dati richiesti per lanciare la quotazione')
                cy.get('nx-tab-header').first().find('button').should(($tabOfFastquote) => {
                    expect($tabOfFastquote).to.contain('Ultra')
                    expect($tabOfFastquote).to.contain('Auto')
                    expect($tabOfFastquote).to.contain('Persona')
                    expect($tabOfFastquote).to.contain('Albergo')
                })

                cy.get('nx-tab-header').first().find('button').each(($tabOfFastquoteClick) => {
                    cy.wrap($tabOfFastquoteClick).click()
                })

                cy.get('nx-tab-header').first().find('button').contains('Ultra').click()
                
                cy.get('app-ultra-parent-tabs').find('nx-tab-header').should(($tab) => {
                    expect($tab).to.contain('Casa e Patrimonio')
                    expect($tab).to.contain('Salute')
                })
                cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Casa e Patrimonio').click()

                cy.get('app-ultra-fast-quote').find('.scope-name').should(($scope) => {
                    expect($scope).to.contain('Fabbricato')
                    expect($scope).to.contain('Contenuto')
                    expect($scope).to.contain('Catastrofi naturali')
                    expect($scope).to.contain('Responsabilità civile')
                    expect($scope).to.contain('Tutela legale')
                    expect($scope).to.contain('Animali domestici')
                })

                cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
                    cy.wrap($scopeIcon).click()
                })
                cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
                    cy.wrap($scopeIcon).click()
                })

                cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Salute').click().wait(5000)

                cy.get('app-ultra-health-fast-quote').find('.scope-name').should(($scope) => {
                    expect($scope).to.contain('Spese mediche')
                    expect($scope).to.contain('Diaria da ricovero')
                    expect($scope).to.contain('Invalidità permanente da infortunio')
                    expect($scope).to.contain('Invalidità permanente da malattia')
                })

                cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
                    cy.wrap($scopeIcon).click()
                })
                cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
                    cy.wrap($scopeIcon).click()
                })

                cy.get($fastquote).find('.content').then(($iconBottom) =>{
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Preferiti"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Salva"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Condividi"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Configura"]').should('be.visible')
                })

                //on excel
                cy.get('app-ultra-fast-quote').find('.favorites-cta').contains('Vai a Preferiti').click()
                canaleFromPopup()
                backToClients()

                cy.get('nx-tab-header').first().find('button').contains('Auto').click()
                cy.get('app-auto-fast-quote').contains('Targa').should('be.visible')
                cy.get('app-auto-fast-quote').contains('Garanzie').should('be.visible')
                cy.get('app-auto-fast-quote').contains('Totale').should('be.visible')
                cy.get('app-auto-fast-quote').contains('Copertura veicolo').should('be.visible')
                cy.get('app-auto-fast-quote').contains('Copertura conducente').should('be.visible')

                cy.get('nx-tab-header').first().find('button').contains('Persona').click()
                cy.get('app-fast-quote').contains('Universo Persona').should('be.visible')
                cy.get('app-fast-quote').contains('Universo Salute').should('be.visible')
                cy.get('app-fast-quote').contains('Universo Persona Malattie Gravi').should('be.visible')

                cy.get('nx-tab-header').first().find('button').contains('Albergo').click()
                cy.get('app-fast-quote').contains('Attività svolta').should('be.visible')
                cy.get('app-fast-quote').contains('Apertura della struttura').should('be.visible')
                cy.get('app-fast-quote').contains('Comune di ubicazione').should('be.visible')



            }
        }) 

        cy.get('app-client-resume app-client-resume-emissions').then(($emissione) => {
            if($emissione.find('app-section-title .title').length > 0){
                cy.wrap($emissione).should('contain','Emissioni')
                cy.get('.card-container').find('app-kpi-dropdown-card').should(($tabCard) => {
                    expect($tabCard).to.contain('Auto')
                    expect($tabCard).to.contain('Rami vari')
                    expect($tabCard).to.contain('Vita')
                    expect($tabCard).to.length(3)
                })
                
               const buttonAuto = () =>  cy.get('.card-container').find('app-kpi-dropdown-card',{ timeout: 10000 }).contains('Auto').click()

                buttonAuto()
                const buttonHover = () => cy.get('.cdk-overlay-container').find('button')
 
                buttonHover().contains('Emissione').click()
                cy.wait(2000)
                buttonHover().contains('Polizza nuova').click()
                canaleFromPopup()
                backToClients()
                
                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Emissione').click()
                cy.wait(2000)
                buttonHover().contains('Assistenza InContatto').click()
                canaleFromPopup()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Assunzione guidata').click()
                canaleFromPopup()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Veicoli d\'epoca').click()
                canaleFromPopup()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Libri matricola').click()
                canaleFromPopup()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Kasko e ARD').click()
                cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD al Chilometro').click()
                canaleFromPopup()
                getApp().find('button').contains('Annulla').click()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Kasko e ARD').click()
                cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Giornata').click()
                canaleFromPopup()
                getApp().find('button').contains('Annulla').click()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Kasko e ARD').click()
                cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Veicolo').click()
                canaleFromPopup()
                getApp().find('button').contains('Annulla').click()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Polizza aperta').click()
                cy.get('.cdk-overlay-pane').find('button').contains('Polizza base').click()
                canaleFromPopup()
                getApp().find('button').contains('Annulla').click()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Prodotti particolari').click()
                cy.wait(2000)
                buttonHover().contains('Coassicurazione').click()
                canaleFromPopup()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Passione BLU').click()
                cy.wait(2000)
                buttonHover().contains('Nuova polizza').click()
                canaleFromPopup()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Passione BLU').click()
                cy.wait(2000)
                buttonHover().contains('Nuova polizza guidata').click()
                canaleFromPopup()
                backToClients()

                buttonAuto()
                cy.wait(2000)
                buttonHover().contains('Passione BLU').click()
                cy.wait(2000)
                buttonHover().contains('Nuova polizza Coassicurazione').click()
                canaleFromPopup()
                backToClients()

                const buttonRamivari = () =>  cy.get('.card-container').find('app-kpi-dropdown-card').contains('Rami vari').click()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('Allianz Ultra Casa e Patrimonio').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('Allianz1 Business').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('FastQuote Universo Persona').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()
                
                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('FastQuote Universo Salute').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('FastQuote Universo Persona Malattie Gravi').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('FastQuote Infortuni Da Circolazione').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('FastQuote Impresa Sicura').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('FastQuote Albergo').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()

                buttonRamivari()
                cy.wait(2000)
                buttonHover().contains('Emissione').click()
                cy.wait(2000)
                buttonHover().contains('Polizza nuova').click()
                canaleFromPopup()
                backToClients()
                
                const buttonVita = () =>  cy.get('.card-container').find('app-kpi-dropdown-card').contains('Vita').click()

                buttonVita()
                cy.wait(2000)
                buttonHover().contains('Accedi al servizio di consulenza').click()
                cy.wait(2000)
                canaleFromPopup()
                backToClients()
            }

        })

        cy.get('app-client-resume app-proposals-in-evidence').then(($contratti) => {
            if($contratti.find('app-section-title .title').length > 0){
                cy.wrap($contratti).should('contain','Contratti in evidenza')
                cy.get('.card-container').find('app-kpi-dropdown-card').each(function ($card) {
                    cy.wrap($card).click()
                })
            }

        })

        

    });

    it('Burger Menu Clients', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')

        cy.get('lib-burger-icon').click()
        cy.contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        backToClients()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Censimento nuovo cliente').click()
        cy.url().should('include', '/new-client')
        backToClients()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Pannello anomalie').click()
        closePopup()
        cy.wait(5000)

        cy.contains('Clienti duplicati').click()
        backToClients()
        cy.wait(5000)

        cy.get('lib-burger-icon').click()
        cy.contains('Cancellazione Clienti').click()
        closePopup()

        cy.contains('Cancellazione Clienti per fonte').click()
        closePopup()

        cy.contains('Gestione fonte principale').click()
        closePopup()

        cy.contains('Antiriciclaggio').click()
        closePopup()

        cy.contains('Allianz Ultra BMP').click()
        closePopup()


    })

    it('Clients', function () {
        //Problemi button nuovo cliente
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('include', '/clients')

        cy.get('app-rapid-link').contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        backToClients()

        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        closePopup()

        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        cy.wait(1000)
        backToClients()
        
        cy.get('app-rapid-link').contains('Antiriciclaggio').click()
        closePopup()

        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        backToClients()

        cy.get('.actions-box').contains('Vai a visione globale').click()
        backToClients()
        cy.get('.meetings').click()

    })

    it('Sales', function () {
        // manca iframe card e back dopodiche finito test
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
        cy.wait(1500)
        const buttonEmettiPolizza = () => cy.get('app-emit-policy-popover').find('button:contains("Emetti polizza")').click()
        const popoverEmettiPolizza = () => cy.get('.card-container').find('lib-da-link')
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Auto').click()
        closePopup()
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

    it('Numbers', function () {

        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('include', '/business-lines')

        cy.contains('LINEE DI BUSINESS').click()
        cy.get('app-agency-incoming').contains('RICAVI DI AGENZIA').click()
        cy.get('app-kpi-card').contains('New business').click()
        // cy.get('lib-breadcrumbs').contains('Numbers').click()
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/numbers/business-lines')
        cy.get('app-kpi-card').contains('Incassi').click()
        // cy.get('lib-breadcrumbs').contains('Numbers').click()
        cy.wait(2000)
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/numbers/business-lines')
        cy.get('app-kpi-card').contains('Portafoglio').click()
        // cy.get('lib-breadcrumbs').contains('Numbers').click()
        cy.wait(2000)
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/numbers/business-lines')
        cy.contains('DANNI').click()
        cy.contains('VITA').click()

        cy.contains('PRODOTTI').click()
        cy.url().should('include', '/products')

        cy.contains('INDICATORI OPERATIVI').click()
        cy.url().should('include', '/operational-indicators')

        cy.contains('INCENTIVI').click()
        cy.url().should('include', '/incentives')

        cy.get('app-filters-section').find('nx-icon').click()
        cy.get('app-filters').contains('ANNULLA').click()
        cy.get('app-filters-section').find('.circle').click()

    })

    it('Backoffice', function () {

        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')

        cy.get('lib-upcoming-dates').click()
        cy.url().should('include', '/event-center')
        cy.get('lib-sub-header-right').click()

        cy.get('lib-news-image').click();
        closePopup()

        // cy.get('app-backoffice-title').each(($label) =>{
        //     expect($label).to.contain('Sinistri')
        //     expect($label).to.contain('Contabilità')
        // })
        cy.get('.backoffice-card').find('a').should(($labelCard) =>{
                expect($labelCard).to.contain('Movimentazione sinistri')
                expect($labelCard).to.contain('Denuncia')
                expect($labelCard).to.contain('Denuncia BMP')
                expect($labelCard).to.contain('Consultazione sinistri')
                expect($labelCard).to.contain('Sinistri incompleti')
                expect($labelCard).to.contain('Sinistri canalizzati')
                /*
                expect($labelCard).to.contain('Sinstesi Contabilità')
                expect($labelCard).to.contain('Giornata contabile')
                expect($labelCard).to.contain('Consultazione Movimenti')
                expect($labelCard).to.contain('Estrazione Contabilità')
                expect($labelCard).to.contain('Deleghe SDD')
                expect($labelCard).to.contain('Quadratura unificata')
                expect($labelCard).to.contain('Incasso per conto')
                expect($labelCard).to.contain('Incasso massivo')
                expect($labelCard).to.contain('Sollecito titoli')
                expect($labelCard).to.contain('Impostazione contabilità')
                */
            })
            
        cy.get('.backoffice-card').find('a').each(($labelCard) =>{
            cy.get($labelCard).click()
            closePopup()

        })
    })

    it('News', function () {

        cy.get('app-product-button-list').find('a').contains('News').click()
        cy.url().should('include', '/news/home')

        cy.find('app-header').find('a').contains('Tutte').click()
        cy.get('.show dropdown').contains('Business').click()
        cy.get('app-header').contains('Primo Piano')

    })


    it('Le Mie Info', function () {

        cy.contains('Le mie info ').click({ force: true })
        cy.wait(3000)

        cy.url().should('include', '/my-info')
    })
});