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
  // TopBar.logOutMW()
})
//#endregion

var clienteCF;
var indexCliente;
var indexFonte;
var agente;
describe('Matrix Web : Gestione fonte principale', function () {


  it('Verifica aggancio Gestione fonte principale - referenti siano corretti', function () {
    TopBar.clickClients()
    BurgerMenuClients.clickLink('Gestione fonte principale')
    const searchClients = () => {
      getIFrame().find('[class="k-grid-content k-auto-scrollable"]:visible').first().then(($table) => {
        const isTrovato = $table.find(':contains("Nessun record da visualizzare")').is(':visible')
        if (isTrovato) {
          cy.generateTwoLetters().then(randomChars => {
            getIFrame().find('#f-cognome').clear().type(randomChars)
          })
          cy.generateTwoLetters().then(randomChars => {
            getIFrame().find('#f-nome').clear().type(randomChars)
          })
          getIFrame().find('td > button[class="k-button"]').contains('Cerca').click().wait(2000)

          searchClients()
        } else {
          return
        }
      })
    }
    searchClients()

    // getIFrame().find('#tabstrip').then(() => {
    //   for (let i = 0; i < 10; i++) {
    //     getIFrame().find('[class="k-grid-content k-auto-scrollable"]').then(($table) => {
    //       cy.wrap($table).find('tbody').then(() => {
    //         if ($table.find('tr').length === 0) {
    //           cy.generateTwoLetters().then(randomChars => {
    //             getIFrame().find('#f-cognome').clear().type(randomChars)
    //           })
    //           cy.generateTwoLetters().then(randomChars => {
    //             getIFrame().find('#f-nome').clear().type(randomChars)
    //           })
    //           getIFrame().find('td > button[class="k-button"]').contains('Cerca').click().wait(2000)
    //         } else {
    //           i = 11; // QUEST NON VIENE LETTO
    //         }
    //       })
    //     })
    //   }
    // })

    cy.get('#body').then(() => {

      const listIndex = []
      getIFrame().find('[class="k-grid-content k-auto-scrollable"]:visible').first().within(() => {
        cy.get('tr').each(($ele, index) => {
          cy.wrap($ele).find('td').eq(5).invoke('text').then((textState) => {
            if (textState.trim() === "P" || textState.trim() === "C") {
              listIndex.push(index)
            }
          })

        })

        cy.get('tr').then(($tr) => {
          indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]

          cy.wait(2000)
          // cy.wrap($tr).eq(indexCliente).find('td').eq(6).click()
          cy.wrap($tr).eq(indexCliente).find('td > input[class="assegnafonte"]').click()
          cy.wrap($tr).eq(indexCliente).find('td').eq(2).invoke('text').then(clientCfText => {
            clienteCF = clientCfText;
          })

        })
      })

    })


    getIFrame().find('#showFonti').click().within(() =>{
      cy.wait(4000)
      cy.get('table[class="k-selectable"] > tbody').then(($table)=>{
        cy.wrap($table).find('tr').then(($tr) =>{
          indexFonte = Math.floor(Math.random() * $tr.length)
        })

      })
    })

    // getIFrame().find('span[class="k-icon k-i-expand"]:visible').first().click()
    // getIFrame().find('span[class="k-icon k-i-none"]:visible').first().parents('tr').find('td').eq(2).invoke('text').then(agent =>{
    //   Cypress.env('agente', agent);
    //   cy.wait(1500)
    // })
    // agente = Cypress.env('agente');
    // cy.wait(1500)
    // getIFrame().find('span[class="k-icon k-i-none"]:visible').first().click()
    // cy.wait(3000)
    
    // getIFrame().contains('Imposta fonte').click()
    // getIFrame()
    //   .find('div[class="k-widget k-window allianz-alert-window-container"]:contains("Fonte principale impostata con successo per 1 cliente")').should('be.visible')
    // getIFrame().find('div:contains("Fonte principale impostata")').parent().find('button:contains("Chiudi")').click()

    // cy.get('input[name="main-search-input"]').click()
    // cy.get('input[name="main-search-input"]').type(cliente).type('{enter}')
    // cy.get('lib-client-item').first().click()

    // cy.wait(4000)
    // cy.get('#cdk-describedby-message-container:hidden')
    // .should('contain.text',agente)


  })


  // cy.get('a').contains('Clients').click()
  // cy.url().should('eq', baseUrl + 'clients/')
  // cy.get('body').then($body => {
  //           if ($body.find('.user-icon-container').length > 0) {   
  //               cy.get('.user-icon-container').click();
  //               cy.wait(1000).contains('Logout').click()
  //               cy.wait(delayBetweenTests)
  //           }
  //       });
  //       cy.clearCookies();
  // }) 


})

