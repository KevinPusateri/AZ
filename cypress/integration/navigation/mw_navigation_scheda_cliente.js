/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const buttonAuto = () => cy.get('.card-container').find('app-kpi-dropdown-card').contains('Auto').click()
const buttonRamivari = () => cy.get('.card-container').find('app-kpi-dropdown-card').contains('Rami vari').click()
const buttonVita = () => cy.get('.card-container').find('app-kpi-dropdown-card').contains('Vita').click()
const backToClients = () => cy.get('a').contains('Clients').click().wait(5000)
const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)

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
    cy.get('input[name="main-search-input"]').type('Pulini Francesco').type('{enter}')
    cy.get('lib-client-item').first().click()
    cy.intercept({
        method: 'POST',
        url: /client-resume/
    }).as('pageClient');

    cy.wait('@pageClient', { requestTimeout: 20000 });
})

after(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
})

describe('Matrix Web : Navigazioni da Scheda Cliente', function () {
    it('Navigation Scheda Cliente', function () {
        // Verifica Tab clients corretti
        const tabProfile = [
            'SINTESI CLIENTE',
            'DETTAGLIO ANAGRAFICA',
            'PORTAFOGLIO',
            'ARCHIVIO CLIENTE'
        ]
        cy.get('app-client-profile-tabs').find('a').should('have.length', 4).each(($checkTabProfile, i) => {
            expect($checkTabProfile.text().trim()).to.include(tabProfile[i]);
        })

    })

    it('Verifica Situazione cliente', function () {
        cy.get('app-client-resume app-client-situation').then(($situazione) => {
            if ($situazione.find('app-section-title .title').length > 0) {
                cy.wrap($situazione).should('contain', 'Situazione cliente')
                cy.wrap($situazione).find('.content').should(($subtitle) => {
                    expect($subtitle).to.contain('Totale premi annui')
                    expect($subtitle).to.contain('Totale danni')
                    expect($subtitle).to.contain('Vita puro rischio')
                    expect($subtitle).to.contain('Polizze attive')
                })
            }
        })
    })

    // TODO Auto non carica gli elementi
    // it('Verifica FastQuote', function () {
    //     

    //     cy.get('app-client-resume app-fast-quote').then(($fastquote) => {
    //         if($fastquote.find('app-section-title .title').length > 0){
    //             cy.wrap($fastquote).should('contain','Fast Quote')
    //             cy.wrap($fastquote).find('.subtitle').should('contain','Inserisci i dati richiesti per lanciare la quotazione')

    //             const tabFastQuote = [
    //                 'Ultra',
    //                 'Auto',
    //                 'Persona',
    //                 'Albergo'
    //             ]
    //             cy.get('nx-tab-header').first().find('button').each(($checkTabFastQuote,i) =>{
    //                 expect($checkTabFastQuote.text().trim()).to.include(tabFastQuote[i]);
    //             })

    //            
    //             // cy.get('nx-tab-header').find('button').contains('Auto').click()
    //             // cy.get('app-auto-fast-quote').contains('Targa').should('be.visible')
    //             // cy.get('app-auto-fast-quote').contains('Garanzie').should('be.visible')
    //             // cy.get('app-auto-fast-quote').contains('Totale').should('be.visible')
    //             // cy.get('app-auto-fast-quote').contains('Copertura veicolo').should('be.visible')
    //             // cy.get('app-auto-fast-quote').contains('Copertura conducente').should('be.visible')

    //             // cy.get('nx-tab-header').find('button').contains('Persona').click()
    //             // cy.get('app-fast-quote').contains('Universo Persona').should('be.visible')
    //             // cy.get('app-fast-quote').contains('Universo Salute').should('be.visible')
    //             // cy.get('app-fast-quote').contains('Universo Persona Malattie Gravi').should('be.visible')

    //             // cy.get('nx-tab-header').find('button').contains('Albergo').click()
    //             // cy.get('app-fast-quote').contains('Attività svolta').should('be.visible')
    //             // cy.get('app-fast-quote').contains('Apertura della struttura').should('be.visible')
    //             // cy.get('app-fast-quote').contains('Comune di ubicazione').should('be.visible')

    //             // cy.get('app-fast-quote').find('button').contains('Auto').click()
    //             // const tabUltraFastQuote = [
    //             //     'Casa e Patrimonio',
    //             //     'Salute'
    //             // ]
    //             // cy.get('app-ultra-parent-tabs').find('nx-tab-header').each(($checkTabUltraFastQuote,i) =>{
    //             //     expect($checkTabUltraFastQuote.text().trim()).to.include(tabUltraFastQuote[i]);
    //             // })

    //             cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Casa e Patrimonio').click()
    //             const scopes = [
    //                 'Fabbricato',
    //                 'Contenuto',
    //                 'Catastrofi naturali',
    //                 'Responsabilità',
    //                 'Tutela legale',
    //                 'Animali domestici',
    //             ]
    //             cy.get('app-ultra-fast-quote').find('.scope-name').each(($checkScopes,i) =>{
    //                 expect($checkScopes.text().trim()).to.include(scopes[i]);
    //             })

    //             cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
    //                 cy.wrap($scopeIcon).click()
    //             })
    //             cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
    //                 cy.wrap($scopeIcon).click()
    //             })

    //             // TODO non carica la pagina salute
    //             // cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Salute').click().wait(5000)
    //             // const scopes = [
    //             //     'Spese mediche',
    //             //     'Diaria da ricovero',
    //             //     'Invalidità permanente da infortunio',
    //             //     'Invalidità permanente da malattia'
    //             // ]
    //             // cy.get('app-ultra-health-fast-quote').find('.scope-name').each(($checkScopes,i) =>{
    //             //     expect($checkScopes.text().trim()).to.include(scopes[i]);
    //             // })
    //             // cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
    //             //     cy.wrap($scopeIcon).click()
    //             // })
    //             // cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
    //             //     cy.wrap($scopeIcon).click()
    //             // })

    //             cy.get($fastquote).find('.content').then(($iconBottom) =>{
    //                 cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Preferiti"]').should('be.visible')
    //                 cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Salva"]').should('be.visible')
    //                 cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Condividi"]').should('be.visible')
    //                 cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Configura"]').should('be.visible')
    //             })

    //             //on excel
    //             cy.get('app-ultra-fast-quote').find('.favorites-cta').contains('Vai a Preferiti').click()
    //             canaleFromPopup()
    //             backToClients()

    //         }
    // }) 
    // })
    it('Verifica le Cards Emissioni', function () {
        cy.get('app-client-resume app-client-resume-emissions').then(($emissione) => {
            if ($emissione.find('app-section-title .title').length > 0) {
                cy.wrap($emissione).should('contain', 'Emissioni')
                const tabCard = [
                    'Auto',
                    'Rami vari',
                    'Vita'
                ]
                cy.get('app-kpi-dropdown-card').find('.label').each(($checkScopes, i) => {
                    expect($checkScopes.text().trim()).to.include(tabCard[i]);
                })
                // cy.get('.card-container').find('app-kpi-dropdown-card').should(($tabCard) => {
                //     expect($tabCard).to.contain('Auto')
                //     expect($tabCard).to.contain('Rami vari')
                //     expect($tabCard).to.contain('Vita')
                //     expect($tabCard).to.length(3)
                // })
            }
        })
    })

    it('Verifica Card Auto: Emissione - Polizza nuova', function () {
        buttonAuto()
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Polizza nuova').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Emissione - Assistenza InContatto', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Assistenza InContatto').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari - Assunzione Guidata', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Assunzione guidata').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari - Veicoli d\'epoca durata 10 giorni', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Veicoli d\'epoca').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari - Libri matricola', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Libri matricola').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari - Kasko e ARD al Chilometro', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD al Chilometro').click()
        canaleFromPopup()
        getIFrame().find('button').contains('Annulla').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari- Kasko e ARD a Giornata', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Giornata').click()
        canaleFromPopup()
        getIFrame().find('button').contains('Annulla').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari - Kasko e ARD a Veicolo', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Veicolo').click()
        canaleFromPopup()
        getIFrame().find('button').contains('Annulla').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari - Polizza aperta(base)', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Polizza aperta').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Polizza base').click()
        canaleFromPopup()
        getIFrame().find('button').contains('Annulla').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Prodotti particolari - Coassicurazione', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Coassicurazione').click()
        canaleFromPopup()
        getIFrame().find('button').contains('Annulla').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Passione Blu - Nuova polizza', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Passione Blu - Nuova polizza guidata', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza guidata').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Auto: Passione Blu - Nuova polizza Coassicurazione', function () {
        buttonAuto()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza Coassicurazione').click()
        canaleFromPopup()
        getIFrame().find('button').contains('Annulla').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Casa e Patrimonio').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('span:contains("Procedi"):visible')
        backToClients()
    })

    // //ADD TFS -> mostra in pagina user code not valid
    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio BMP', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Casa e Patrimonio BMP').click()
        cy.wait(2000)
        canaleFromPopup()
        backToClients()
    })

    // //ADD TFS -> mostra in pagina user code not valid
    it('Verifica Card Rami Vari: Allianz Ultra Salute', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Salute').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('span:contains("Procedi"):visible')
        backToClients()
    })

    it('Verifica Card Rami Vari: Allianz1 Business', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz1 Business').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('a:contains("EMETTI QUOTAZIONE"):visible')
        getIFrame().find('a:contains("AVANTI"):visible')
        backToClients()
    })

    it('Verifica Card Rami Vari: FastQuote Universo Persona', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Universo Persona').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Rami Vari: FastQuote Universo Salute', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Universo Salute').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Rami Vari: FastQuote Universo Persona Malattie Gravi', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Universo Persona Malattie Gravi').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Rami Vari: FastQuote Universo Persona Malattie Gravi', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Infortuni Da Circolazione').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        backToClients()
    })

    it('Verifica Card Rami Vari: FastQuote Impresa Sicura', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Impresa Sicura').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
        backToClients()
    })

    it('Verifica Card Rami Vari: FastQuote Albergo', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Albergo').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
        backToClients()
    })

    it('Verifica Card Rami Vari: Emissione - Polizza Nuova', function () {
        buttonRamivari()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Polizza nuova').click()
        canaleFromPopup()
        getIFrame().find('input[value="Home"]').invoke('attr', 'value').should('equal', 'Home')
        getIFrame().find('input[value="indietro"]').invoke('attr', 'value').should('equal', 'indietro')
        getIFrame().find('input[value="Avanti"]').invoke('attr', 'value').should('equal', 'Avanti')
        getIFrame().find('input[value="Uscita"]').invoke('attr', 'value').should('equal', 'Uscita')
        backToClients()
    })

    it('Verifica Card Vita: Accedi al servizio di consulenza', function () {
        buttonVita()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Accedi al servizio di consulenza').click()
        cy.wait(2000)
        canaleFromPopup()
        getIFrame().find('input[value="Home"]').invoke('attr', 'value').should('equal', 'Home')
        getIFrame().find('input[value="indietro"]').invoke('attr', 'value').should('equal', 'indietro')
        backToClients()
    })


    // it('Verifica Contratti in evidenza', function () {
    //     cy.get('app-client-resume app-proposals-in-evidence').then(($contratti) => {
    //         if($contratti.find('app-section-title .title').length > 0){
    //             cy.wrap($contratti).should('contain','Contratti in evidenza')
    //             cy.get('.card-container').find('app-kpi-dropdown-card').each(function ($card) {
    //                 cy.wrap($card).click()
    //             })
    //         }
    //     })
    // })


    // click tab problemi 
    it.only('Verifica Tab Dettaglio Anagrafica', function () {
        cy.get('app-client-profile-tabs').find('a').contains('DETTAGLIO ANAGRAFICA').click()
        
        const tabAnagrafica = [
            'Dati anagrafici',
            'Altri contatti',
            'Altri indirizzi',
            'Documenti',
            'Legami',
            'Conti correnti',
            'Convenzioni'
        ]
        cy.get('nx-tab-header').find('button').should('have.length', 7).each(($checkTabAnagrafica, i) => {
            expect($checkTabAnagrafica.text().trim()).to.include(tabAnagrafica[i]);
        })
        cy.get('app-section-title').find('.title:contains("Dati principali persona fisica"):visible')
        cy.get('app-physical-client-main-data').find('button:contains("Modifica dati cliente"):visible')
        cy.get('app-client-risk-profiles').find('.title:contains("Identificazione e adeguata verifica"):visible')
        cy.get('app-client-consents-accordion').find('.title:contains("Consensi"):visible')
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza').click()
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza AGL').click()
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza Leben').click()
        cy.get('app-section-title').find('.title:contains("Residenza anagrafica"):visible')
        cy.get('app-section-title').find('.title:contains("Domicilio"):visible')
        cy.get('app-section-title').find('.title:contains("Numero di telefono principale"):visible')
        cy.get('app-section-title').find('.title:contains("Email"):visible')
        cy.get('app-section-title').find('.title:contains("Documento principale"):visible')

        cy.get('nx-tab-header').find('button:contains("Altri contatti")').click()
        cy.url().should('include', '/profile-detail?tabIndex=1')
        cy.get('app-client-contact-table-row').find('.label:contains("Orario")')
        cy.get('app-client-contact-table-row').find('.label:contains("Contatto principale")')

        cy.get('nx-tab-header').contains('Altri indirizzi').click()
        cy.url().should('include', '/profile-detail?tabIndex=2')
        cy.find('button:contains("Aggiungi indirizzo"):visible')

        cy.get('nx-tab-header').contains('Documenti').click()
        cy.url().should('include', '/profile-detail?tabIndex=3')
        cy.find('button:contains("Aggiungi documento"):visible')

        cy.get('nx-tab-header').contains('Legami').click()
        cy.url().should('include', '/profile-detail?tabIndex=4')
        cy.find('button:contains("Modifica nucleo"):visible')
        cy.find('button:contains("Inserisci legame"):visible')

        cy.get('nx-tab-header').contains('Conti correnti').click()
        cy.url().should('include', '/profile-detail?tabIndex=5')
        cy.get('app-coming-soon-message').contains('La sezione sarà disponibile a breve')

        cy.get('nx-tab-header').contains('Convenzioni').click()
        cy.url().should('include', '/profile-detail?tabIndex=6')
        cy.get('app-coming-soon-message').contains('La sezione sarà disponibile a breve')

        cy.get('nx-tab-header').contains('Dati anagrafici').click()
        cy.url().should('include', '/profile-detail?tabIndex=0')

    })
})