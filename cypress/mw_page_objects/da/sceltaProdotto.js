/// <reference types="Cypress" />

/**
 * @class Scelta Prodotto
 * @classdesc Classe per interagire con la pagina Scelta Prodtto della DA
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

class SceltaProdotto {

  /**
   * Attende il caricamento della DA
   */
  static caricamentoPagina() {
    cy.intercept({
      method: 'POST',
      url: '**/GRV_AD/**'
    }).as('daRV')

    cy.wait('@daRV', { requestTimeout: 60000 });
  }

  /**
   * Apre l'albero dei prodotto e seleziona il prodotto dalla lista
   * @param {array} prodotto 
   */
  static sceltaProdotto(prodotto) {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      for (let i = 0; i < prodotto.length; i++) { //se è l'ultimo elemento dell'array clicca il nome del prodotto senza verificare l'apertura del ramo
        if (i == prodotto.length - 1) {
          cy.get('.AspNet-TreeView').find('a')
            .contains(prodotto[i]).click()
        }
        else { //apre i rami dell'albero dei prodotti
          cy.get('.AspNet-TreeView').find('span')
            .contains(prodotto[i]).prev().click()
            .should('have.class', 'AspNet-TreeView-Collapse') //verifica che il ramo sia stato aperto
        }
      }

      /* cy.get('#ctl00_cont_ProdRecenti').find('a').contains(prodotto[prodotto.length - 1])
        .should('be.visible').click() */
    })
  }

  /**
   * Clicca sul pulsante 'Avanti'
   */
  static avanti() {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('input[value="Avanti"]').should('be.visible').click() //click sul pulsante
    })

    cy.wait(1000)
  }

  /**
   * Modifica la fonte
   * @param {string} fonte 
   */
  static cambiaFonte(fonte) {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('#ctl00_cont_btnSubAgenzia').should('be.visible').click() //click sul pulsante per aprire il popup scelta fonte

      cy.wait(1000)
    })

    cy.get('@iframe').within(() => {
      cy.get('#UCFonti_TW').should('be.visible')
        .find('td').contains(fonte).find('input').click()

      cy.get('#UCFonti_TW').parent('div').find('input[value="Ok"]').click() //conferma la scelta della fonte

      cy.wait(1000)
    })

    cy.get('@iframe').within(() => {
      cy.get('#ctl00_cont_txtProduttore').should('have.attr', 'value') //verifica che la fonta sia stata modificata
        .and('contain', fonte)
    })
  }
}

export default SceltaProdotto
