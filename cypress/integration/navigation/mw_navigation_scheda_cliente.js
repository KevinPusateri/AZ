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


describe.only('Matrix Web : Navigazioni da Scheda Cliente - ', function () {
    it('Log In', function () {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    });
    
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
});