/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import BurgerMenuClients from "../../../mw_page_objects/burgerMenu/BurgerMenuClients";
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"


//#region Variables
const userName = 'le00080'
const psw = 'Dragonball3'
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Global Variables
const getIFrame = () => {
  cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();

  let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
before(() => {
  LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
  Common.visitUrlOnEnv()
  cy.preserveCookies()
})

after(() => {
  TopBar.logOutMW()
})
//#endregion

var clienteCF;
var indexCliente;
describe('Matrix Web - Hamburger Menu: Cancellazione Clienti ', function () {

  it('Verifica aggancio pagina Cancellazione Clienti', function () {
    TopBar.clickClients()
    BurgerMenuClients.clickLink('Cancellazione Clienti')
    BurgerMenuClients.backToClients()
  })

  it('Verifica Cancellazione clienti PF e PG', function () {
    TopBar.clickClients()
    BurgerMenuClients.clickLink('Cancellazione Clienti')

    const searchClients = () => {
      getIFrame().find('[class="search-grid-fisica k-grid k-widget"]').then(($table) => {
        const isTrovato = $table.find('tr:contains("Nessun record da visualizzare.")').is(':visible')
        if (isTrovato) {
          cy.generateTwoLetters().then(randomChars => {
            getIFrame().find('#f-cognome').clear().type(randomChars)
          })
          cy.generateTwoLetters().then(randomChars => {
            getIFrame().find('#f-nome').clear().type(randomChars)
          })
          getIFrame().find('input[class="k-button pull-right"]').contains('Cerca').click().wait(2000)

          searchClients()
          
        } else {
          return
        }
      })
    }
    searchClients()

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
        })
      })

      cy.get('body').within(() => {
        getIFrame().find('button:contains("Cancella"):visible').click()

        getIFrame()
          .find('div[class="message container"]:contains("Attenzione l\'operazione non è reversibile."):visible')
          .should('be.visible')
          getIFrame().find('form[class="buttons"]:visible').contains('Ok').click()

        getIFrame().find('div[class="message container"]:contains("Cancellazione clienti completata")').should('be.visible')
        getIFrame().find('form[class="buttons"]:visible').contains('Chiudi').click()

      })

      cy.get('a[href="/matrix/"]').click()
    })
  })

  it('Ricercare i clienti in buca di ricera - accedere alla scheda', function () {
    TopBar.search(clienteCF)
    LandingRicerca.filtraRicerca('P')
    LandingRicerca.checkClienteNotFound()
  })

})

