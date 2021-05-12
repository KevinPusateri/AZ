/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
const baseUrl = Cypress.env('baseUrl') 

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
//#endregion

before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  
    cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName.includes('news')) {
        req.alias = 'gqlNews'
    }
    })
    cy.viewport(1920, 1080)
  
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('LE00080')
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
  })
  
//   after(() => {
//     cy.get('body').then($body => {
//         if ($body.find('.user-icon-container').length > 0) {   
//             cy.get('.user-icon-container').click();
//             cy.wait(1000).contains('Logout').click()
//             cy.wait(delayBetweenTests)
//         }
//     });
//     cy.clearCookies();
//   })

describe('Matrix Web : Gestione fonte principale', function () {

    it('Verifica aggancio Gestione fonte principale - referenti siano corretti', function () {
        cy.get('app-product-button-list').find('a').contains('Clients').click()
        cy.url().should('eq', baseUrl + 'clients/')
        cy.get('lib-burger-icon').click()
        cy.contains('Gestione fonte principale').click()
        canaleFromPopup()
        
        getIFrame().find('#tabstrip').then(() => {
          for (let i = 0; i < 10; i++) {
            getIFrame().find('[class="k-grid-content k-auto-scrollable"]').then(($table) => {
              cy.wrap($table).find('tbody').then(() => {
                if ($table.find('tr').length === 0) {
                  cy.generateTwoLetters().then(randomChars => {
                    getIFrame().find('#f-cognome').clear().type(randomChars)
                  })
                  cy.generateTwoLetters().then(randomChars => {
                    getIFrame().find('#f-nome').clear().type(randomChars)
                  })
                  getIFrame().find('td > button[class="k-button"]').contains('Cerca').click().wait(2000)
                } else {
                  i = 11; // QUEST NON VIENE LETTO
                }
              })
            })
          }
        })

        getIFrame().find('[class="k-grid-content k-auto-scrollable"]').then(($table)=>{
          cy.wrap($table).find('tr > [role="gridcell"]').invoke('index').then((i)=>{
              cy.wrap($table).find('tr > [role="gridcell"] > input[class="assegnafonte"]').eq(i).click()
          })
        })

        getIFrame().find('#showFonti').click()
        getIFrame().find('[class="k-grid-header-wrap"]').within(() => {
          cy.get('tbody').find('[class="k-alt k-treelist-group"]').first().within(() =>{
            cy.get('td').find('[class="k-icon k-i-collapse"]').click()
          })
        }) 
        
        // getIFrame().find('[class="fonteselector k-widget k-reset k-header k-panelbar"]').click()

        // cy.get('a').contains('Clients').click()
        // cy.url().should('eq', baseUrl + 'clients/')


    })
    
})

