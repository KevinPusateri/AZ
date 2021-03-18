/// <reference types="Cypress" />
Cypress.config('defaultCommandTimeout', 15000)


describe('Login Matrix Web', function(){

    beforeEach(() => {
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
        cy.wait(3000)

    })
    

    it('Home MW', function(){
        cy.get('.icon-mw-calendar-plain').click({force: true})
        cy.wait(3000)
        cy.get('.icon-mw-icon-incident').click({force: true})
        cy.wait(3000)
        cy.get('.icon-mw-bell').click({force: true})
        cy.wait(3000)
        cy.get('.nx-image--rounded > img').click({force: true})
        cy.wait(3000)

        cy.get('.icon-mw-icon-switch').click({force: true})
        cy.wait(3000)
        
        cy.get('input').invoke('attr', 'placeholder').should('contain','Cerca in Matrix')



    });


    it.only('Client Search Clients', function() {  
        
        cy.viewport(1920,1080)
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')
        
        cy.get('input[name="main-search-input"]').type('CALOGERO MESSINA').type('{enter}')
        cy.wait(2000)
        cy.get('lib-client-item').first().click()
        cy.wait(4000)
        
        // cy.get('[class^="client-name"]').should('contain','CALOGERO MESSINA')
        
        // cy.get('app-operative-alert-card').contains('Da incassare').click({force: true});
        // cy.wait(3000)

        cy.get('app-client-profile-tabs').find('a').should(($tab) => {
            expect($tab).to.contain('SINTESI CLIENTE')
            expect($tab).to.contain('DETTAGLIO ANAGRAFICA')
            expect($tab).to.contain('PORTAFOGLIO')
            expect($tab).to.contain('ARCHIVIO CLIENTE')
            expect($tab).to.length(4)

          })

          cy.get('app-client-situation').find('.value-link').click();
          cy.get('.cdk-global-overlay-wrapper').find('nx-icon').click();
          cy.get('app-contract-card').find('nx-icon').click({multiple:true})
         // TODO:
         // cy.get('app-contract-card').find('.icon-mw-people-connect badge-icon').click({multiple:true})

        //   cy.get('.fast-quote-cart').find('nx-tab-group').should(($tab) => {
        //     expect($tab).to.contain('Ultra')
        //     expect($tab).to.contain('Auto')
        //     expect($tab).to.contain('Persona')
        //   })
          
          cy.get('app-section-title').should(($title) =>{
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

          cy.get('.card-container').find('app-kpi-dropdown-card').contains('Auto').click()
          cy.get('.card-container').find('app-kpi-dropdown-card').contains('Rami vari').click()
          cy.get('.card-container').find('app-kpi-dropdown-card').contains('Vita').click()

     })
    

     it('burger Menu Clients', function() {


        cy.contains('Clients').click({force: true})
        cy.url().should('include', '/clients')

        cy.get('.burger-menu').click();
        cy.contains('Censimento nuovo cliente').click({force: true})
        cy.url().should('include', '/new-client')
        // cy.wait(3000)

        cy.get('.burger-menu').click();
        cy.contains('Digital Me').click({force: true})
        cy.url().should('include', '/digital-me')


        cy.get('.burger-menu').click();
        cy.contains('Pannello anomalie').click({force: true})
        cy.get('button[aria-label="Close dialog"]').click({force: true})
        
        cy.get('.burger-menu').click({force:true});
        cy.contains('Clienti duplicati').click({force: true})
        cy.wait(3000)

        cy.get('.burger-menu').click({force:true});
        cy.contains('Cancellazione Clienti').click({force: true})
        cy.get('button[aria-label="Close dialog"]').click({force: true})
        // cy.wait(2000)

        cy.contains('Cancellazione Clienti per fonte').click({force: true})
        cy.get('button[aria-label="Close dialog"]').click({force: true})
        // cy.wait(2000)

        cy.contains('Gestione fonte principale').click({force: true})
        cy.get('button[aria-label="Close dialog"]').click({force: true})
        // cy.wait(2000)

        cy.contains('Antiriciclaggio').click({force: true})
        cy.get('button[aria-label="Close dialog"]').click({force: true})
        //   cy.wait(2000)

        cy.contains('Allianz Ultra BMP').click({force: true})
        cy.get('button[aria-label="Close dialog"]').click({force: true})
        //  cy.wait(3000)

     })

     it('Page Specific Client ', function() {

        cy.contains('Clients').click({force: true})
        cy.url().should('include', '/clients')

        cy.get('app-rapid-link').contains('Digital Me').click({force:true})
        cy.url().should('include', '/digital-me')
        cy.go('back')

        cy.get('app-rapid-link').contains('Pannello anomalie').click({force:true})
        cy.get('button[aria-label="Close dialog"]').click({force: true})
        cy.wait(3000)

        cy.get('app-rapid-link').contains('Clienti duplicati').click({force:true})
        cy.wait(3000)

        cy.go('back')

     })
     
    it('Sales', function() {

        cy.contains('Sales').click({force: true})
        cy.wait(3000)

        cy.url().should('include', '/sales')
    })

    
    it('Numbers', function() {

        cy.contains('Numbers').click({force: true})
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

        cy.contains('PRODOTTI').click({force: true})
        cy.wait(3000)
        cy.url().should('include', '/products')

        cy.contains('INDICATORI OPERATIVI').click({force: true})
        cy.wait(3000)
        cy.url().should('include', '/operational-indicators')

        cy.contains('INCENTIVI').click({force: true})
        cy.wait(3000)
        cy.url().should('include', '/incentives')

    })

    
    it('Backoffice', function() {

        cy.contains('Backoffice').click({force: true})
        cy.wait(3000)

        cy.url().should('include', '/back-office')
    })

    
    it('News', function() {

        cy.contains('News').click({force: true})
        cy.wait(3000)

        cy.url().should('include', '/news/home')
    })

    
    it('Le Mie Info', function() {

        cy.contains('Le mie info ').click({force: true})
        cy.wait(3000)

        cy.url().should('include', '/my-info')
    })
});