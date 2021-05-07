/// <reference types="Cypress" />
/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const baseUrl = Cypress.env('baseUrl') 

const interceptGetAgenziePDF = () => {
    cy.intercept({
        method: 'POST',
        url: /dacommerciale*/
    }).as('getDacommerciale');
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
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait(2000).wait('@gqlNews')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
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


describe('Matrix Web : Navigazioni da Numbers - ', function () {
    it('Verifica aggancio Numbers', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })
    
    it('Verifica Filtro', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')   
        cy.get('lib-container').find('nx-icon[name="filter"]').click().wait(2000)
        cy.get('app-filters').find('h3:contains("AGENZIE"):visible')
        cy.get('app-filters').find('h3:contains("COMPAGNIE"):visible')
        cy.get('app-filters').find('h3:contains("FONTI"):visible')
        cy.get('app-filters').find('h3:contains("PERIODO"):visible')
        cy.contains('ANNULLA').click()
    })

    it('Verifica PDF', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')   
        cy.get('lib-container').find('a[class="circle icon-glossary btn-icon"]')
        .should('have.attr','href','https://portaleagenzie.pp.azi.allianz.it/dacommerciale/DSB/Content/PDF/Regole_Classificazione_Reportistica.pdf')
    })

    it('Verifica aggancio Ricavi di Agenzia', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        interceptGetAgenziePDF()
        cy.get('app-agency-incoming').contains('RICAVI DI AGENZIA').click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('a:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })
    
    it('Verifica su Linee di Business aggancio New Business', function () {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.contains('LINEE DI BUSINESS').click().should('have.class','active')
        interceptGetAgenziePDF()
        cy.get('app-kpi-card').contains('New business').click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica su Linee di Business aggancio Incassi', function () {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.contains('LINEE DI BUSINESS').click().should('have.class','active')
        interceptGetAgenziePDF()
        cy.get('app-kpi-card').contains('Incassi').click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('[class="ControlloFiltroBottone"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica su Linee di Business aggancio Portafoglio', function () {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.contains('LINEE DI BUSINESS').click().should('have.class','active')
        interceptGetAgenziePDF()
        cy.get('app-kpi-card').contains('Portafoglio').click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('[class="ControlloFiltroBottone"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica su Prodotti aggancio Primo indice prodotto', function () {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.contains('PRODOTTI').click().should('have.class','active')
        cy.url().should('eq', baseUrl + 'numbers/products')
        interceptGetAgenziePDF()
        cy.get('lib-card').first().click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('[class="ControlloFiltroBottone"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/products')
    })

    // Mancherebbe test su Monitoraggio carico
    it('Verifica su Indicatori Operativi aggancio Primo indice digitale', function () {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.contains('INDICATORI OPERATIVI').click().should('have.class','active')
        cy.url().should('eq', baseUrl + 'numbers/operational-indicators')
        interceptGetAgenziePDF()
        cy.get('app-digital-indexes').find('lib-card').first().click()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('a:contains("Apri filtri"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/operational-indicators')
    })

    it('Verifica aggancio incentivi', function () {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.contains('INCENTIVI').click().should('have.class','active')
        cy.url().should('eq', baseUrl + 'numbers/incentives')
        cy.get('.empty-list').should('be.visible').and('contain','La sezione sarà disponibile')
    })
});