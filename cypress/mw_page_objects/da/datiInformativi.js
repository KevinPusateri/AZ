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

class DatiInformativi {

  /**
   * Attende il caricamento della DA
   */
  static caricamentoPagina() {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('span[class="AZNavigationBarText"]').contains('Dati informativi').should('be.visible')
        .parent('div[class$="current"]').should('exist')
    })
  }


  static completaDati(voce, opzione = "none") {
    cy.getIFrame()

    //seleziona il checkbox
    cy.get('@iframe').within(() => {
      cy.get('span[class="DomandaLabel"]').contains(voce)
        .parents('tr[class="DomandaRow"]').find('td[class$="DomandaCheckBox"]').children('input')
        .check().wait(500)
    })

    //se è presente un menù dropdown seleziona l'opzione indicata 
    //e verifica che non sia più segnata come 'domanda error'
    if (opzione != "none") {
      cy.get('@iframe').within(() => {
        cy.get('span[class="DomandaLabel"]').contains(voce)
          .parents('tr[class="DomandaRow"]').next()
          .find('td[class$="DomandaDropDown"]').children('select').select(opzione)
      })      
      /* cy.get('@iframe').within(() => {
        cy.get('span[class="DomandaLabel"]').contains(voce)
            .parents('tr[class="DomandaRow"]').next().should('have.attr', 'class').and('not.contain', 'DomandaError')
      }) */
    }

    cy.wait(500)
  }

  static completaDatiTxT(voce, testo) {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('span[class="DomandaLabel"]').contains(voce)
        .parents('tr[class^="DomandaRow"]').first().find('input')
        .type(testo).type("{enter}").wait(500)
    })
  }

  /**
   * Completa le risposte alle dichiarazioni del contraente
   * @param {bool} sinistri 
   * @param {bool} polizzeAnnullate 
   * @param {bool} altreCoperture 
   */
  static dichiarazioniContraente(sinistri, polizzeAnnullate, altreCoperture) {
    let risposte = [sinistri, polizzeAnnullate, altreCoperture]
    let domande = ["sinistri", "polizze annullate", "altre coperture"]
    var value = "0"

    cy.getIFrame()

    for (let i = 0; i < risposte.length; i++) {
      if (risposte[i]) {
        value = "1"
      }
      else {
        value = "2"
      }

      cy.get('@iframe').within(() => {
        cy.get('span[class="DomandaLabel"]').contains(domande[i]).should('be.visible')
          .parents('tr[class^="DomandaRow"]').first()
          .find('input[type="radio"]').check(value)
      })
    }
  }
}

export default DatiInformativi
