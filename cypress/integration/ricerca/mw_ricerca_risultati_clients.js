/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000
//#endregion

beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
    cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
})

afterEach(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
})

describe('Buca di Ricerca - Risultati Clients', function () {
    it('Verifica Ricerca Cliente: nome o cognome ',function(){
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
                }else{
                    cy.wrap($age).should('contain',$age.text().trim()).should('have.value',"")
                }
            })
         })
    })

    it('Verifica Modifica filtri',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('AR').type('{enter}')
        cy.url().should('include','search/clients/clients').wait(3000)

        cy.get('.icon').find('[name="filter"]').click()
        cy.get('.filter-group').contains('Potenziale').click()
        cy.get('.filter-group').find('nx-checkbox').first().click()
        cy.get('.footer').find('button').contains('applica').click()

        //TODO Finire modifica
        cy.get('[class="lib-applied-filters-item"]').find('span').should('have.length',6).each($filter =>{
            cy.wrap($filter).should('contain',$filter.text().trim())
        })
        const checkFilter = [
            '1-30018-000 TRIESTE 2000',
            '73-742-060 TRIESTE DIAZ',
            'Persona fisica',
            'Persona giuridica',
            'Effettivo',
            'Cessato'
        ]
        cy.get('lib-applied-filters-item').find('span').should('have.length',6).each(($filter,i) =>{
            cy.wrap($filter).should('contain',checkFilter[i])
        })

    })

    it('Verifica Click su Ricerca Cliente',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('AR').type('{enter}')
        cy.url().should('include','search/clients/clients').wait(3000)
        cy.get('lib-client-item').first().click()
        cy.get('app-client-profile-tabs').find('a').contains('SINTESI CLIENTE').should('have.class','active')
    })
})