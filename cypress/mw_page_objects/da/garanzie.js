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
cy.pause()
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

    cy.pause()
    cy.get('@iframe').within(() => {
      cy.get('.QuestionarioTable').should('be.visible') //verifica l'apertura del popup

      cy.get('.QuestionarioTable').find('.DomandaTesto').each(($el, index, $list) => {

        switch (risposte[index]) {
          case true:
            cy.wrap($el.next().find('input')).check("1")
            break;
          case false:
            cy.wrap($el.next().find('input')).check("2")
            break;
          default:
            if ($el.next('[class$="DomandaDropDown"]').is(':visible')) {
              cy.wrap($el.next().find('select')).select(risposte[index])
            }
            else {
              cy.wrap($el.next().find('select')).clear().type(risposte[index])
            }
        }
      })

      cy.get('.QuestionarioTable').parents('[role="dialog"]').first()
      .find('input[value="Ok"]').click()
    })
  }
}

export default Garanzie
