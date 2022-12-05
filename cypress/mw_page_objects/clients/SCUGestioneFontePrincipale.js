/// <reference types="Cypress" />

import LandingRicerca from "../ricerca/LandingRicerca";

const getIFrame = () => {
  cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();

  let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class SCUGestioneFontePrincipale {


  static eseguiOnPersonaFisica() {
    getIFrame().contains('Persona fisica').click()

    // Loop finchè non trovo un cliente digitando 2 lettere nome cognome finchè non risulta nella tabella
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
          getIFrame().find('button[type="submit"]').contains('Cerca').click().wait(2000)

          searchClients()
        } else {
          cy.screenshot('Ricerca clienti PF', { overwrite: true })
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
    // Seleziono un cliente random dalla tabella
    getIFrame().find('[class="k-grid-content k-auto-scrollable"]:visible').first().within(() => {

      // Lista dei clienti trovati
      cy.get('tr').each(($ele, index) => {
        cy.wrap($ele).find('td').eq(5).find('span[data-tooltip]').invoke('text').then((textState) => {
          if (textState.trim() === "P" || textState.trim() === "C" || textState.trim() === "E") {
            listIndex.push(index)
          }
        })
      })

      // Prende dall'array un cliente random
      cy.get('tr').then(($tr) => {
        indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]

        cy.wait(2000)
        cy.wrap($tr).eq(indexCliente).find('td > input[class="assegnafonte"]').click()
        cy.wrap($tr).eq(indexCliente).find('td').eq(2).find('span[class="value"]').invoke('text').then(clientCfText => {
          clienteCF = clientCfText;
        })
      })
    })

    // Seleziono dalla tabella delle fonti una fonte random
    getIFrame().find('#showFonti').scrollIntoView().click().within(() => {
      cy.contains('span', 'Nessuna fonte selezionata').click()
      cy.wait(4000)
      cy.get('table[class="k-selectable"] > tbody').then(($table) => {
        cy.wrap($table).find('tr:visible').not('tr:first')
          .not('tr:contains("AUTOVELLETRI SRL")')
          .not('tr:contains("SEDE SECONDARIA")')
          .not('tr:contains("AGENZIA")')
          .not('tr:contains("SUBAGENZIA")').then(($tr) => {
            indexFonte = Math.floor(Math.random() * $tr.length)

            if ($tr.eq(indexFonte).hasClass('k-treelist-group')) {
              cy.wrap($tr.eq(indexFonte)).find('span[class="k-icon k-i-expand"]').click({ force: true }).wait(2000)
              cy.wrap($tr.eq(indexFonte).next().find('td').eq(0)).invoke('text').then((agente) => {
                nameAgente = agente
              })

              cy.wrap($tr.eq(indexFonte).next()).click({ force: true })
            } else {
              cy.wrap($tr.eq(indexFonte).find('td').eq(0)).invoke('text').then((agente) => {
                nameAgente = agente
              })
              cy.wrap($tr.eq(indexFonte)).click({ force: true })
            }

          })
      })
    })

    // Click Imposta Fonte principale
    cy.get('body').within(() => {
      getIFrame().find('button[class^="k-button assegnafonte"]').scrollIntoView().click().wait(5000)
    })


    cy.get('body').within(() => {
      getIFrame()
        .find('div[class="modal-body"]:contains("Fonte principale impostata con successo per 1 cliente")')
        .should('be.visible')

      getIFrame().find('div:contains("Fonte principale impostata")').parent().find('button:contains("Chiudi")').click()
    })

    cy.intercept({
      method: 'POST',
      url: '**/clients/**'
    }).as('pageClient');


    // Verifico dalla scheda cliente che la fonte impostata si trovi nei referenti
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(clienteCF).type('{enter}')
      //LandingRicerca.filtra('PF')
      cy.get('lib-client-item').first().click()
    }).then(($body) => {
      cy.wait(6000)
      const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
      if (check) {
        cy.get('input[name="main-search-input"]').type(clienteCF).type('{enter}')
        LandingRicerca.filtra()
        // cy.get('lib-client-item').next().click()
        cy.get('lib-client-item').click()
      }


      cy.wait('@pageClient', { timeout: 60000 });
      cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')

      cy.get('.referent-box').find('span').invoke('text').then(contraente => {
        expect(contraente).to.include(nameAgente)
        cy.screenshot('Referente aggiornato correttamente', { clip: { x: 0, y: 0, width: 1920, height: 900 } })
      })
    })
  }

  static eseguiOnPersonaGiuridica() {
    getIFrame().contains('Persona giuridica').click()

    // Loop finchè non trovo un cliente digitando 2 lettere nome cognome finchè non risulta nella tabella
    const searchClients = () => {
      getIFrame().find('[class="k-grid-content k-auto-scrollable"]:visible').first().scrollIntoView().then(($table) => {
        const isTrovato = $table.find(':contains("Nessun record da visualizzare")').is(':visible')
        if (isTrovato) {
          cy.generateTwoLetters().then(randomChars => {
            getIFrame().find('#g-denominazione').clear().type(randomChars)
          })
          getIFrame().find('button[type="submit"]').eq(1).contains('Cerca').click().wait(2000)

          searchClients()
        } else {
          cy.screenshot('Ricerca clienti PG', { overwrite: true })
          return
        }
      })
    }
    searchClients()

    var clienteIVA;
    var indexCliente;
    var indexFonte;
    var nameAgente;
    const listIndex = []
    // Seleziono un cliente random dalla tabella
    getIFrame().find('[class="k-grid-content k-auto-scrollable"]:visible').first().within(() => {
      cy.get('tr').each(($ele, index) => {
        cy.wrap($ele).find('td').eq(6).find('span[data-tooltip]').invoke('text').then((textState) => {
          if (textState.trim() === "P" || textState.trim() === "C" || textState.trim() === "E") {
            listIndex.push(index)
          }
        })
      })

      cy.get('tr').then(($tr) => {
        indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]

        cy.wait(2000)
        cy.wrap($tr).eq(indexCliente).find('td > input[class="assegnafonte"]').click()
        cy.wrap($tr).eq(indexCliente).find('td').eq(2).find('span[class="value"]').invoke('text').then(clientIVAText => {
          clienteIVA = clientIVAText;
        })
      })
    })

    // Seleziono dalla tabella delle fonti una fonte random
    getIFrame().find('#showFonti').scrollIntoView().click().within(() => {
      cy.contains('span', 'Nessuna fonte selezionata').click()
      cy.wait(4000)
      cy.get('table[class="k-selectable"] > tbody').then(($table) => {
        cy.wrap($table).find('tr:visible').not('tr:first')
          .not('tr:contains("AUTOVELLETRI SRL")')
          .not('tr:contains("SEDE SECONDARIA")')
          .not('tr:contains("AGENZIA")')
          .not('tr:contains("SUBAGENZIA")').then(($tr) => {
            indexFonte = Math.floor(Math.random() * $tr.length)

            if ($tr.eq(indexFonte).hasClass('k-treelist-group')) {
              cy.wrap($tr.eq(indexFonte)).find('span[class="k-icon k-i-expand"]').click({ force: true }).wait(2000)
              cy.wrap($tr.eq(indexFonte).next().find('td').eq(0)).invoke('text').then((agente) => {
                nameAgente = agente
                cy.log(nameAgente)
              })
              cy.wrap($tr.eq(indexFonte).next()).click({ force: true })
            } else {
              cy.wrap($tr.eq(indexFonte).find('td').eq(0)).invoke('text').then((agente) => {
                nameAgente = agente
              })
              cy.wrap($tr.eq(indexFonte)).click({ force: true })
            }
          })
      })
    })
    // Click Imposta Fonte principale
    cy.get('body').within(() => {
      getIFrame().find('button[class^="k-button assegnafonte"]').scrollIntoView().click().wait(5000)
    })

    cy.get('body').within(() => {
      getIFrame()
        .find('div[class="modal-body"]:contains("Fonte principale impostata con successo per 1 cliente")')
        .should('be.visible')

      getIFrame().find('div:contains("Fonte principale impostata")').parent().find('button:contains("Chiudi")').click()
    })

    cy.intercept({
      method: 'POST',
      url: '**/clients/**'
    }).as('pageClient');

    // Verifico dalla scheda cliente che la fonte impostata si trovi nei referenti
    cy.get('body').within(() => {
      cy.get('input[name="main-search-input"]').click()
      cy.get('input[name="main-search-input"]').type(clienteIVA).type('{enter}')
      LandingRicerca.filtra()
      // cy.get('lib-client-item').next().click()
      cy.get('lib-client-item').click()
    }).then(($body) => {
      cy.wait(6000)
      const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
      if (check) {
        cy.get('input[name="main-search-input"]').type(clienteIVA).type('{enter}')
        //LandingRicerca.filtra('PG')
        cy.get('lib-client-item').next().click()
      }
      cy.wait('@pageClient', { timeout: 60000 });
      cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')
      cy.get('.referent-box').find('span').invoke('text').then(contraente => {
        expect(contraente).to.include(nameAgente)
        cy.screenshot('Referente aggiornato correttamente', { clip: { x: 0, y: 0, width: 1920, height: 900 } })
      })
    })
  }

}
export default SCUGestioneFontePrincipale
