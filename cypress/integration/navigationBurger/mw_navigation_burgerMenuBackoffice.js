/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000
//#endregion

//#region Global Variables
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
const canaleFromPopup = () => {cy.get('body').then($body => {
        if ($body.find('nx-modal-container').length > 0) {   
            cy.get('nx-modal-container').find('.agency-row').first().click()
        }
    });
}
const getIFrameMoveSinistri = () => {
    getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
    .iframe();

    let iframeFolder = getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
    .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

const interceptCruscotto = () => {
    cy.intercept({
        method: 'POST',
        url: /dacommerciale*/
    }).as('getDacommerciale');
}
//#endregion



beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
          req.alias = 'gqlNotifications'
        }
        if (req.body.operationName.includes('news')) {
            req.alias = 'gqlNews'
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
    cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 30000 });
    // cy.wait('@gqlNotifications')
    cy.wait('@gqlNews')

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
describe('Matrix Web : Navigazioni da Burger Menu in Clients', function () {

    it('Verifica i link da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        const linksBurger = [
            'Home Backoffice',
            'Movimentazione sinistri',
            'Denuncia',
            'Denuncia BMP',
            'Consultazione sinistri',
            'Sinistri incompleti',
            'Sinistri canalizzati',
            'Sintesi Contabilità',
            'Giornata contabile',
            'Consultazione Movimenti',
            'Estrazione Contabilità',
            'Deleghe SDD',
            'Quadratura unificata',
            'Incasso per conto',
            'Incasso massivo',
            'Sollecito titoli',
            'Impostazione contabilità',
            'Convenzioni in trattenuta'
        ]
        cy.get('lib-side-menu-link').find('a').should('have.length',18).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    });

    //#region Sinistri
    it('Verifica aggancio Movimentazione sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()
        cy.contains('Movimentazione sinistri').click()
        cy.intercept({
            method: 'POST',
            url: /dasincruscotto*/
        }).as('getDasincruscotto');
        canaleFromPopup()
        cy.wait('@getDasincruscotto', { requestTimeout: 20000 });
        getIFrameMoveSinistri().find('#CmdAggiorna:contains("Ricerca"):visible')
        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Denuncia', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Denuncia BMP', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Consultazione sinistri', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Sinistri incompleti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Sinistri canalizzati', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })
    //#endregion

    it('Verifica aggancio Sintesi Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Giornata contabile', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Consultazione Movimenti', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Estrazione Contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Deleghe SDD', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Quadratura unificata', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Incasso per conto', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Incasso massivo', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Sollecito titoli', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Impostazione contabilità', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })

    it('Verifica aggancio Convenzioni in trattenuta', function () {
        cy.get('app-product-button-list').find('a').contains('Backoffice').click()
        cy.url().should('include', '/back-office')
        cy.get('lib-burger-icon').click()

        cy.get('a').contains('Backoffice').click()
    })


})