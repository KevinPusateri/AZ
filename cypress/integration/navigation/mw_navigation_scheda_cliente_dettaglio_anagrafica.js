/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  
    cy.intercept('POST', '/graphql', (req) => {
    // if (req.body.operationName.includes('notifications')) {
    //     req.alias = 'gqlNotifications'
    // }
    if (req.body.operationName.includes('news')) {
        req.alias = 'gqlNews'
    }
    })
    cy.viewport(1920, 1080)
  
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('Le00080')
    cy.get('input[name="Ecom_Password"]').type('Dragonball3')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait('@gqlNews')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
    cy.get('input[name="main-search-input"]').type('Pulini Francesco').type('{enter}')
    cy.intercept({
        method: 'POST',
        url: '**/clients/**'
    }).as('pageClient');
 
    cy.get('lib-client-item').first().click()
    cy.wait('@pageClient', { requestTimeout: 60000 });
    cy.get('app-client-profile-tabs').find('a').contains('DETTAGLIO ANAGRAFICA').click()
  })
  
  after(() => {
    cy.get('body').then($body => {
        if ($body.find('.user-icon-container').length > 0) {   
            cy.get('.user-icon-container').click();
            cy.wait(1000).contains('Logout').click()
            cy.wait(delayBetweenTests)
        }
    });
    cy.clearCookies();
  })

describe('Matrix Web : Navigazioni da Scheda Cliente - Tab Dettaglio Anagrafica', function () {

    it('Verifica presenza di subtab nel Tab Dettaglio Anagrafica', function () {
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

    })

    it('Dettaglio Anagrafica: verifica SubTab Dati Anagrafici', function () {
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
    })

    it('Dettaglio Anagrafica: verifica SubTab Altri contatti', function () {
        cy.intercept('GET','**/omazeuxnewsdev/**').as('pageTab')
        cy.get('nx-tab-header').contains('Altri contatti').click()
        cy.wait('@pageTab')
        cy.url().should('include', '/profile-detail?tabIndex=1')
        cy.get('app-client-contact-table-row').find('.label:contains("Orario")')
        cy.get('app-client-contact-table-row').find('.label:contains("Contatto principale")')
    })

    it('Dettaglio Anagrafica: verifica SubTab Altri indirizzi', function () {
        cy.intercept('GET','**/omazeuxnewsdev/**').as('pageTab')
        cy.get('nx-tab-header').contains('Altri indirizzi').click()
        cy.wait('@pageTab')
        cy.url().should('include', '/profile-detail?tabIndex=2')
        cy.get('app-client-other-addresses').find('button:contains("Aggiungi indirizzo"):visible')
    })

    // NON VISIBILE
    it('Dettaglio Anagrafica: verifica SubTab Documenti ', function () {
        cy.intercept('GET','**/omazeuxnewsdev/**').as('pageTab')
        cy.get('nx-tab-header').contains('Documenti').click()
        cy.wait('@pageTab')
        cy.url().should('include', '/profile-detail?tabIndex=3')
        cy.find('button:contains("Aggiungi documento"):visible')
    })

    it('Dettaglio Anagrafica: verifica SubTab Legami', function () {
        cy.intercept('GET','**/omazeuxnewsdev/**').as('pageTab')
        cy.get('nx-tab-header').contains('Legami').click()
        cy.wait('@pageTab')
        cy.url().should('include', '/profile-detail?tabIndex=4')
        cy.find('button:contains("Modifica nucleo"):visible')
        cy.find('button:contains("Inserisci legame"):visible')
    })

    it('Dettaglio Anagrafica: verifica SubTab Conti correnti', function () {
        cy.intercept('GET','**/omazeuxnewsdev/**').as('pageTab')
        cy.get('nx-tab-header').contains('Conti correnti').click()
        cy.wait('@pageTab')
        cy.url().should('include', '/profile-detail?tabIndex=5')
        cy.get('app-coming-soon-message').contains('La sezione sarà disponibile a breve')
    })

    it('Dettaglio Anagrafica: verifica SubTab Conti Convenzioni', function () {
        cy.intercept('GET','**/omazeuxnewsdev/**').as('pageTab')
        cy.get('nx-tab-header').contains('Convenzioni').click()
        cy.wait('@pageTab')
        cy.url().should('include', '/profile-detail?tabIndex=6')
        cy.get('app-coming-soon-message').contains('La sezione sarà disponibile a breve')
        cy.get('nx-tab-header').contains('Dati anagrafici').click()
        cy.url().should('include', '/profile-detail?tabIndex=0')

    })
})