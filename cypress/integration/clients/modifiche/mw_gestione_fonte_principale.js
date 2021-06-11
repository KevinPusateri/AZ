/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import BurgerMenuClients from "../../../mw_page_objects/burgerMenu/BurgerMenuClients";
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
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


describe('Matrix Web : Gestione fonte principale', function () {


  Cypress._.times(3, () => {

    it('Verifica aggancio Gestione fonte principale - referenti siano corretti', function () {
      TopBar.clickClients()
      BurgerMenuClients.clickLink('Gestione fonte principale')
      const searchClients = () => {
        getIFrame().find('[class="k-grid-content k-auto-scrollable"]:visible').first().scrollIntoView().then(($table) => {
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

      var clienteCF;
      var indexCliente;
      var indexFonte;
      var nameAgente;
      const listIndex = []
      getIFrame().find('[class="k-grid-content k-auto-scrollable"]:visible').first().within(() => {
        cy.get('tr').each(($ele, index) => {
          cy.wrap($ele).find('td').eq(5).invoke('text').then((textState) => {
            if (textState.trim() === "P" || textState.trim() === "C" || textState.trim() === "E") {
              listIndex.push(index)
            }
          })
        })

        cy.get('tr').then(($tr) => {
          indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]

          cy.wait(2000)
          cy.wrap($tr).eq(indexCliente).find('td > input[class="assegnafonte"]').click()
          cy.wrap($tr).eq(indexCliente).find('td').eq(2).invoke('text').then(clientCfText => {
            clienteCF = clientCfText;
          })
        })
      })


      getIFrame().find('#showFonti').scrollIntoView().click().within(() => {
        cy.wait(4000)
        cy.get('table[class="k-selectable"] > tbody').then(($table) => {
          cy.wrap($table).find('tr:visible').not('tr:first').not('tr:contains("AUTOVELLETRI SRL")').then(($tr) => {
            indexFonte = Math.floor(Math.random() * $tr.length)

            if ($tr.eq(indexFonte).hasClass('k-treelist-group')) {
              cy.wrap($tr.eq(indexFonte)).find('span[class="k-icon k-i-expand"]').click().wait(2000)
              cy.wrap($tr.eq(indexFonte).next().find('td').eq(0)).invoke('text').then((agente) => {
                nameAgente = agente
              })
              cy.wrap($tr.eq(indexFonte).next().find('td').eq(2)).invoke('text').then((nome) => {
              })
              cy.wrap($tr.eq(indexFonte).next()).click()
            } else {
              cy.wrap($tr.eq(indexFonte).find('td').eq(0)).invoke('text').then((agente) => {
                nameAgente = agente
              })
              cy.wrap($tr.eq(indexFonte)).click()
            }
          })
        })
      })

      cy.get('body').within(() => {

        getIFrame().find('button[class="k-button assegnafonte"]').scrollIntoView().click().wait(5000)

        getIFrame()
          .find('div[class="message container"]:contains("Fonte principale impostata con successo per 1 cliente")')
          .should('be.visible')

        getIFrame().find('div:contains("Fonte principale impostata")').parent().find('button:contains("Chiudi")').click()
      })

      cy.get('body').within(() => {
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type(clienteCF).type('{enter}')
        cy.get('lib-client-item').first().click()
      }).then(($body) => {
        cy.wait(4000)
        const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
        if (check) {
          cy.get('input[name="main-search-input"]').type(clienteCF).type('{enter}')
          cy.get('lib-client-item').next().click()
        }
        cy.wait(9000)
        cy.get('#cdk-describedby-message-container:hidden').invoke('text').then((referente) => {
          expect(referente).to.be.include(nameAgente)
        })

      })
    })

  })
})

