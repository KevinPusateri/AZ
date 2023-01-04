/// <reference types="Cypress" />

/**
 * @class Scelta Prodotto
 * @classdesc Classe per interagire con la pagina Dati Informativi della DA
 * @author Elio Cossu
 */

/**
 * Accesso all'iFrame di Matrix
 */
/* const matrixFrame = () => {
  let iframeSCU = cy.get('#matrixIframe')
    .its('0.contentDocument').should('exist')

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
} */

class Garanzie {
  /**
   * Modifica l'indirizzo del fabbricato
   * @param {string} indirizzo 
   */
  static popupAnagFabbricato(indirizzo) {
    cy.getIFrame()

    //apre il popup anagrafico per fabbricato
    cy.get('@iframe').within(() => {
      cy.get('td').contains("Fabbricato")
        .next('td').find('input[value="Aggiungi"]').click()
    })

    cy.intercept({
      method: 'POST',
      url: '**/AnagrafeWA40/**'
    }).as('popup')

    cy.wait('@popup', { requestTimeout: 60000 });

    cy.get('@iframe').within(() => {
      cy.get('#anag').should('be.visible') //verifica l'apertura del popup

      cy.getIFrame()
      cy.get('@iframe').within(() => {
        cy.get('.AZGridViewSelectedItem').find('td').contains(indirizzo).should('be.visible') //verifica la presenza dell'indirizzo del fabbricato
        cy.get('input[value="Conferma"]').click()
          .wait(1000) //conferma
      })
    })
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('#ctl00_cont_TabGrupAssic_PanelAss').find('.PxGDesc').contains(indirizzo).should('be.visible') //verifica che il fabbricato sia stato inserito
    })
  }

  /**
   * completa il popup 'dettagli edificio'
   * @param {array} risposte 
   */
  static datiInformativiFabbricato(risposte) {
    cy.getIFrame()

    //apre il popup dati informativi per fabbricato
    cy.get('@iframe').within(() => {
      cy.get('td').contains("Fabbricato")
        .siblings('.PxGQst').find('input[value="Dati Informativi"]').click()
    })

    cy.intercept({
      method: 'POST',
      url: '**/GRV_AD/**'
    }).as('popup')

    cy.wait('@popup', { requestTimeout: 60000 });

    for (let i = 0; i < risposte.length; i++) {
      switch (risposte[i]) {
        case true:
          cy.getIFrame()
          cy.get('@iframe').within(() => {
            cy.get('.QuestionarioTable').find('.DomandaTesto').eq(i)
              .next().find('input').check("1").wait(500)
          })

          break;
        case false:
          cy.getIFrame()
          cy.get('@iframe').within(() => {
            cy.get('.QuestionarioTable').find('.DomandaTesto').eq(i)
              .next().find('input').check("2").wait(500)
          })

          break;
        default:
          cy.get('@iframe').within(() => {
            cy.get('.QuestionarioTable').find('.DomandaTesto').eq(i).then($el => {
              cy.log("if... visible? " + $el.next('[class$="DomandaDropDown"]').is(':visible'))
              if ($el.next('[class$="DomandaDropDown"]').is(':visible')) {
                cy.wrap($el.next().find('select')).select(risposte[i]).wait(1000)
              }
              else {
                cy.wrap($el.next().find('input'))
                  .type("{rightArrow}").type(risposte[i]).type("{enter}").wait(500)
              }
            })
          })
      }
    }

    cy.get('@iframe').within(() => {
      cy.get('.QuestionarioTable').parents('[role="dialog"]').first()
        .find('input[value="Ok"]').click()
    })
  }

  /**
   * 
   * @param {string} garanzia 
   * @param {array^2} valori 
   */
  static aggiungiGaranzia(garanzia, valori) {
    var domanda
    var risposta
    cy.getIFrame()

    cy.get('@iframe').within(() => {
      cy.get('.ListaSezioniDescrizione').contains(garanzia).click().wait(1000)
    })


    for (var i = 0; i < valori.length; i++) {
      domanda = valori[i][0]
      risposta = valori[i][1]
      cy.get('@iframe').within(() => {
        cy.get('.QuestionarioDiv').find('.DomandaTesto').contains(domanda).then($el => {
          if ($el.next('[class$="DomandaDropDown"]').is(':visible')) {
            cy.wrap($el.parents('tr[class^="DomandaRow"]').first().find('select')).select(risposta).wait(500)
          }
          else {
            cy.wrap($el.parents('tr[class^="DomandaRow"]').first().find('input'))
              .type("{rightArrow}").type(risposta).type("{enter}").wait(500)
          }
        })
      })
    }
  }
}

export default Garanzie
