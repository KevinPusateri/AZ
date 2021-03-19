/// <reference types="Cypress" />
Cypress.config('defaultCommandTimeout', 15000)


describe('Login Matrix Web', function () {

    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()

    })


    it('Home MW', function () {
        cy.get('.icon-mw-calendar-plain').click({ force: true })
        cy.get('.icon-mw-icon-incident').click({ force: true })
        cy.get('.icon-mw-bell').click({ force: true })
        cy.get('.nx-image--rounded > img').click({ force: true })

        cy.get('.icon-mw-icon-switch').click({ force: true })

        cy.get('input').invoke('attr', 'placeholder').should('contain', 'Cerca in Matrix')



    });


    it('Navigation customer card', function () {

        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

        // Ricerca primo cliente Calogero Messina 
        cy.get('input[name="main-search-input"]').type('CALOGERO MESSINA').type('{enter}')
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
            expect($title).to.contain('Situazione cliente')
            expect($title).to.contain('Fast Quote')
            expect($title).to.contain('Emissioni')
            expect($title).to.contain('Contratti in evidenza')
            expect($title).to.length(4)
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


        cy.contains('Clients').click({ force: true })
        cy.url().should('include', '/clients')

        cy.get('.burger-menu').click()
        cy.contains('Censimento nuovo cliente').click()
        cy.url().should('include', '/new-client')
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/clients/')

        cy.get('.burger-menu').click()
        cy.contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/clients/')


        cy.get('.burger-menu').click();
        cy.contains('Pannello anomalie').click()
        cy.get('.cdk-overlay-container').find('button nx-icon[name="close"]').click({ force: true })

        cy.contains('Clienti duplicati').click()
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/clients/')

        cy.get('.burger-menu').click();
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

    it.only('Clients', function () {
        cy.contains('Clients').click({ force: true })
        cy.url().should('include', '/clients')

        cy.get('app-rapid-link').contains('Digital Me').click()
        cy.url().should('include', '/digital-me')
        cy.get('lib-breadcrumbs').find('a').click()

        cy.get('app-rapid-link').contains('Pannello anomalie').click()
        cy.get('button[aria-label="Close dialog"]').click()

        cy.get('app-rapid-link').contains('Clienti duplicati').click()
        cy.get('lib-breadcrumbs').find('a').click()

        cy.get('lib-check-user-permissions').contains('Nuovo cliente').click()
        cy.get('lib-breadcrumbs').find('a').click()

        cy.get('.actions-box').contains('Vai a visione globale').click()
        cy.get('lib-breadcrumbs').find('a').click()
        cy.get('.meetings').click()
    })

    it('Sales', function () {

        cy.contains('Sales').click({ force: true })
        cy.wait(3000)

        cy.url().should('include', '/sales')
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