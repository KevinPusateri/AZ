/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 3000
//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
    cy.intercept(/launch-*/,'ignore').as('launchStaging');
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
            req.alias = 'gqlNotifications'
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
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.wait('@gqlNotifications')
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

describe('Buca di Ricerca - Risultati Clients', function () {
    it('Verifica Ricerca Cliente: nome o cognome ',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('AR').type('{enter}')
        cy.url().should('include','search/clients/clients')
        cy.get('lib-client-item').each($cliente =>{
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
            cy.wrap($cliente).find('[class="item"]').then(($adress) =>{ cy.wrap($adress).should('contain',$adress.text()) })
          
           
        })

        cy.get('lib-client-item').find('span[class="icon-mw-person-heart-people-love ng-star-inserted"]').then(() =>{
            cy.get('lib-client-item').find('[class="item ng-star-inserted"]').each(($age) =>{ 
                if($age.text().trim().length > 5){
                    cy.wrap($age).should('contain',$age.text().trim())
                }else{
                    cy.wrap($age).should('contain',$age.text().trim()).should('have.value',"")
                }
            })
        })
    })

    it('Verifica Modifica filtri',function(){
        cy.get('input[name="main-search-input"]').click().type('Ar').type('{enter}')
        cy.url().should('include','search/clients/clients').wait(5000)
        
        cy.get('.icon').find('[name="filter"]').click()
        cy.get('.filter-group').find('span:contains("Effettivo"):visible')
        cy.get('.filter-group').find('span:contains("Potenziale"):visible')
        cy.get('.filter-group').find('span:contains("Cessato"):visible')
        cy.get('.filter-group').find('span:contains("Persona fisica"):visible')
        cy.get('.filter-group').find('span:contains("Persona giuridica"):visible')
        cy.get('.filter-group').contains('Potenziale').click()
        cy.get('.filter-group').find('nx-checkbox').first().click()
        cy.get('.footer').find('button').contains('applica').click()
        cy.get('lib-applied-filters-item').find('span').should('be.visible')

    })

    it('Verifica Click su Ricerca Cliente',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('PULINI').type('{enter}')
        cy.url().should('include','search/clients/clients').wait(5000)
        cy.get('lib-client-item').first().click()
        cy.get('app-client-profile-tabs').find('a').contains('SINTESI CLIENTE').should('have.class','active')
    })
})