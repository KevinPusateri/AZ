/// <reference types="Cypress" />

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

        cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

        cy.get('input[name="main-search-input"]').type('CALOGERO MESSINA').type('{enter}')

        cy.get('lib-client-item').first().click()
        cy.wait(3000) 
        
        cy.get('div[ngclass="client-name"]').should('contain','CALOGERO MESSINA')
        

        // cy.get("app-section-title").should('contain', 'Situazione Cliente')

        cy.get('a[class^="tab-header nx-grid__column-3 ng-star-inserted"]').should(($tab) => {
            expect($tab).to.contain('SINTESI CLIENTE')
            expect($tab).to.contain('DETTAGLIO ANAGRAFICA')
            expect($tab).to.contain('PORTAFOGLIO')
            expect($tab).to.contain('ARCHIVIO CLIENTE')
          })
          
        //   button div[class="nx-tab-label__content"]
          cy.get('nx-tab-header').find('.nx-tab-label__content').should(($tab) => {
            expect($tab).to.contain('Ultra')
            expect($tab).to.contain('Auto')
            expect($tab).to.contain('Persona')
            expect($tab).to.contain('Albergo')
            expect($tab).to.contain('Casa e Patrimonio')
            expect($tab).to.contain('Salute')
            expect($tab).to.length(6)
          })


          
          cy.get('app-client-resume-emissions').find('.card').should(($tab) => {
            expect($tab).to.contain('Auto')
            expect($tab).to.contain('Rami vari')
            expect($tab).to.contain('Vita')
            expect($tab).to.length(3)
          })
     })
    

     it('burger Menu Clients', function() {

        Cypress.config('defaultCommandTimeout', 10000)

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