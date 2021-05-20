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

const canaleFromPopup = () => {
  cy.get('body').then($body => {
    if ($body.find('nx-modal-container').length > 0) {
      cy.wait(2000)
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
  cy.url().should('include', '/portaleagenzie.pp.azi.allianz.it/matrix/')

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
var clienteCF;
var indexCliente;
var nameCliente;
describe('Matrix Web - Hamburger Menu: Cancellazione Clienti ', function () {

  it('Verifica aggancio pagina Cancellazione clienti', function () {
    cy.get('app-product-button-list').find('a').contains('Clients').click()
    cy.url().should('eq', baseUrl + 'clients/')
    cy.get('lib-burger-icon').click()
    cy.contains('Cancellazione Clienti').click()
    canaleFromPopup()
    getIFrame().find('span:contains("Persona fisica"):visible')
    getIFrame().find('span:contains("Persona giuridica"):visible')
    cy.get('a').contains('Clients').click()
    cy.url().should('eq', baseUrl + 'clients/')
  })


  // TI RE un solo caso
  it.only('Verifica Cancellazione clienti PF e PG', function () {
    cy.get('app-product-button-list').find('a').contains('Clients').click()
    cy.url().should('eq', baseUrl + 'clients/')
    cy.get('lib-burger-icon').click()
    cy.contains('Cancellazione Clienti').click()
    canaleFromPopup()
    getIFrame().find('#tabstrip').then(() => {
      for (var i = 0; i < 10; i++) {
        getIFrame().find('[class="search-grid-fisica k-grid k-widget"]').then(($table) => {
          cy.wrap($table).find('tbody').then(() => {
            if ($table.find('tr:contains("Nessun record da visualizzare.")').length === 1) {
              cy.generateTwoLetters().then(randomChars => {
                getIFrame().find('#f-cognome').clear().type('Ro')
              })
              cy.generateTwoLetters().then(randomChars => {
                getIFrame().find('#f-nome').clear().type('ma')
              })
              getIFrame().find('input[class="k-button pull-right"]').contains('Cerca').click().wait(2000)
            } else {
              i = 11; // QUEST NON VIENE LETTO
            }
          })
        })
      }
    })


    cy.get('#body').then(() => {

      const listIndex = []
      getIFrame().find('table[role="grid"] > tbody').first().within(() => {
        cy.get('tr').each(($ele, index) => {
          cy.wrap($ele).find('td').eq(3).invoke('text').then((textState) => {
            if (textState === "P") {
              listIndex.push(index)
            }
          })
        })

        cy.get('tr').then(($tr) => {
          indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]
          cy.wait(2000)
          cy.wrap($tr).eq(indexCliente).find('td').eq(4).click()
          cy.wrap($tr).eq(indexCliente).find('td').eq(1).invoke('text').then(clientCfText => {
            clienteCF = clientCfText;
          })
          cy.wrap($tr).eq(indexCliente).find('td').eq(0).invoke('text').then(clientNameText => {
            nameCliente = clientNameText;
          })
        })
      })

      getIFrame().find('[class="search-grid-container person-selected"]').within(() => {
        cy.get('button:contains("Cancella"):visible').click()
      })
      getIFrame().find('[class="k-widget k-window allianz-alert-window-container"]').within(() => {
        cy.get('[class="message container"]:visible').should('contain', 'Attenzione l\'operazione non è reversibile.')
        cy.get('form[class="buttons"]:visible').contains('Ok').click()
      }).then(() =>{
        getIFrame().find('form[class="buttons"]:visible').contains('Chiudi').click()
      })
     
    })
  })

  it('Ricercare i clienti in buca di ricera - accedere alla scheda', function () {
    cy.get('form').then(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(clienteCF).type('{enter}')
    })

    cy.get('.icon').find('[name="filter"]').click()
    cy.get('.filter-group').find('span:contains("Effettivo"):visible').click()
    cy.get('.filter-group').find('span:contains("Cessato"):visible').click()
    cy.get('.footer').find('button').contains('applica').click()


    cy.get('lib-clients-container').should('not.contain', nameCliente)
    // cy.get('div[class="text-container"]').should('contain','La ricerca non ha prodotto risultati')

  })

})

