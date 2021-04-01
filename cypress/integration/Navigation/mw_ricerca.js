/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 15000)

const checkBucaRicerca = () => {
    cy.get('input[name="main-search-input"]').click()
    const getSection = () => cy.get('lib-shortcut-section-item')
    getSection().find('[class="title"]:contains("Ultime pagine visitate"):visible').should('contain','Ultime pagine visitate')
    getSection().find('[class="title"]:contains("Ultimi clienti visualizzati"):visible').should('contain','Ultimi clienti visualizzati')
    getSection().find('[class="title"]:contains("Ultime polizze visualizzate"):visible').should('contain','Ultime polizze visualizzate')

    getSection().find('lib-da-link').should('exist').and('be.visible').and('have.length', 6)
    getSection().find('a[href^="/matrix/clients/client/"]').should('have.length', 3).and('exist').and('be.visible').and('have.attr', 'href')
    getSection().find('img').should('have.length', 3).and('exist').and('be.visible').and('have.attr', 'src')
    
    getSection().find('[class="right nx-grid__column-6"]').each(($text) =>{
        expect($text.text()).not.to.be.empty
    })
    getSection().find('[class="left nx-grid__column-6"]').each(($text) =>{
        expect($text.text()).not.to.be.empty
    })
  }

const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)

describe('Matrix Ricerca', function () {

    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('https://matrix.pp.azi.allianz.it/')
        cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
        cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
        cy.get('input[type="SUBMIT"]').click()
    })

    //add tfs
    it('Buca di ricerca',function(){

        //#region Switch page -> click sulla buca di ricerca
        checkBucaRicerca()
        //#endregion

        //#region qualsiasi landing -> click nella buca di ricerca
        const landingPage = () => cy.get('app-product-button-list').find('a')
        landingPage().contains('Clients').click()
        cy.url().should('include', '/clients')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('Sales').click()
        cy.url().should('include', '/sales')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('Numbers').click()
        cy.url().should('include', '/numbers/business-lines')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()

        landingPage().contains('News').click()
        cy.url().should('include', '/news/home')
        checkBucaRicerca()
        cy.get('a[href="/matrix/"]').click()
        //#endregion
        
    })

    it('Buca di ricerca - risultati',function(){
        //#region Switch page -> click sulla buca di ricerca una parola -> invio
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
        cy.url().should('include', '/search/clients/clients')
        cy.get('[class^="docs-grid-colored-row tabs-container"]').find('[class^="tab-header"]').should(($tab) =>{
            expect($tab).to.contain('clients')
            expect($tab).to.contain('sales')
            expect($tab).to.contain('le mie info')
        })

        cy.get('lib-advice-navigation-section').contains('Suggerimenti di navigazione').should('exist').and('be.visible')
        cy.get('lib-advice-navigation-section').find('.position-sidebar>.title').should('have.length',5).should(($suggerimenti) =>{
            expect($suggerimenti).to.contain('Provvigioni')
            expect($suggerimenti).to.contain('Quattroruote - Calcolo valore Veicolo')
            expect($suggerimenti).to.contain('Interrogazioni Centralizzate')
            expect($suggerimenti).to.contain('Recupero preventivi e quotazioni')
            expect($suggerimenti).to.contain('Monitoraggio Polizze Proposte')
        })
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible')
        //#endregion
    })

    it('Buca di ricerca - ricerca classica',function(){
        //#region Effettuare una ricerca -> pagina dei risultati -> Click su Ricerca Classica
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('Ro').type('{enter}')
        cy.url().should('include', '/search/clients/clients')
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()

        cy.get('nx-modal-container').find('lib-da-link').should(($linkRicerca) =>{
            expect($linkRicerca).to.length(6)
            expect($linkRicerca).to.contain('Ricerca Cliente')
            expect($linkRicerca).to.contain('Ricerca Polizze proposte')
            expect($linkRicerca).to.contain('Ricerca Preventivi')
            expect($linkRicerca).to.contain('Ricerca Documenti')
            expect($linkRicerca).to.contain('Ricerca News')
            expect($linkRicerca).to.contain('Rubrica')
        })
        //#endregion

        //#region Click su Ricerca Cliente 
        cy.get('nx-modal-container').find('lib-da-link').contains('Ricerca Cliente').click()
        canaleFromPopup()
        //#endregion
    })

    it('Buca di ricerca - risultati Clients',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('AR').type('{enter}')
        cy.url().should('include','search/clients/clients')
        cy.get('lib-client-item').should('have.length',30).each($cliente =>{
            cy.wrap($cliente).find('lib-client-status-badge').then(($lettera) =>{
                 var text = $lettera.text().trim()
                    switch(text){
                        case "p":
                            cy.wrap($lettera).find('[ngclass="status-bubble"]').should('contain','p')
                            break
                        case "c":
                            cy.wrap($lettera).find('[ngclass="status-bubble"]').should('contain','c')
                            break
                        case "":
                            assert.equal(text,"")
                            break
                    }
            })
            cy.wrap($cliente).find('.info > .name').then(($name) =>{ cy.wrap($name).should('contain',$name.text()) })     
            cy.wrap($cliente).find('.item').first().then(($adress) =>{ cy.wrap($adress).should('contain',$adress.text()) })
            cy.wrap($cliente).find('.item').next().then(($age) =>{ 
                if($age.text().trim().length > 5){
                    cy.wrap($age).should('contain',$age.text().trim())
                }
            })
         })

         cy.get('.icon').find('[name="filter"]').click()
         cy.get('.filter-group').contains('Potenziale').click()
         cy.get('.filter-group').find('nx-checkbox').first().click()
         cy.get('.footer').find('button').contains('applica').click()
         cy.get('[class="lib-applied-filters-item"]').find('span').should('have.length',6).each($filter =>{
             cy.wrap($filter).should('contain',$filter.text().trim())
         })

         cy.get('lib-client-item').first().click()
         cy.get('app-client-profile-tabs').find('a').contains('SINTESI CLIENTE').should('have.class','active')


    })

    it.only('Buca di ricerca - risultati Le mie info',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('incasso').type('{enter}').wait(2000)
        cy.url().should('include','search/infos/circulars')

        const tabs = ['clients', 'sales', 'le mie info'];
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').find('a')
           .each(($tab, i) => {
                expect($tab.text()).to.include(tabs[i]);
           });
    })

    
    

})