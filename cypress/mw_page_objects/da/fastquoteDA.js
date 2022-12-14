/// <reference types="Cypress" />

/**
 * @class Fastquote DA
 * @classdesc Classe per interagire con la sezione Fastquote in DA
 * @author Elio Cossu
 */

/**
 * Accesso all'iFrame di Matrix
 */
const matrixFrame = () => {
  let iframeSCU = cy.get('#matrixIframe')
    .its('0.contentDocument').should('exist')

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class FastquoteDA {

  /**
   * Attende il caricamento della pagina Fastquote
   */
  static caricamentoPagina() {
    cy.intercept({
      method: 'GET',
      url: '**/tmpl_grigliaGaranzie.htm'
    }).as('daInfortuni')

    cy.wait('@daInfortuni', { requestTimeout: 60000 });
  }

  //#region Personalizzazione

  /**
   * Controlla che sia stata aperta la pagina Fastquote del prodotto corretto
   * @param {string} prodotto //nome del prodotto
   */
  static verificaAtterraggio(prodotto) {
    matrixFrame().within(() => {
      cy.get('#titoloProdotto').contains(prodotto).should('be.visible')
    })
  }

  /**
   * Modifica il tipo di copertura per la polizza (conducente o veicolo)
   * @param {string} copertura 
   */
  static tipoCopertura(copertura) {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('.pnlRischioRiep').find('input').first().click()
      cy.get('a').contains(copertura).click() //seleziona tipo di copertura
    })
  }

  /**
   * Clicca sul pulsante 'Avanti'
   */
  static avanti() {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('#btnAvanti').should('be.visible').click() //click sul pulsante
    })
  }

  /**
   * Clicca sul pulsante 'Conferma' nel popup 'Conferma dati'
   */
  static confermaDati() {
    matrixFrame().within(() => {
      cy.get('#popupConfermaDati').should('be.visible')
        .next().contains("Conferma").wait(500).click()
    })
  }
  //#endregion Personalizzazione

  //#region Integrazione
  /**
   * Attende il caricamento della sezione Integrazione
   */
  static caricamentoIntegrazione() {
    cy.intercept({
      method: 'GET',
      url: '**/tmpl_anag_riepilogoPremi.htm'
    }).as('integrazione')

    cy.wait('@integrazione', { requestTimeout: 60000 });
  }

  /**
   * Risponde alle domande del pannello 'Dati Integrativi' della sezione Integrazione
   * @param {bool} eredi 
   * @param {bool} contraente 
   * @param {bool} altri 
   */
  static datiIntegrativiSiNo(eredi, contraente, altri) {
    let risposte = [eredi, contraente, altri] //array con le risposte

    matrixFrame().within(() => {
      for (var i = 0; i < risposte.length; i++) {
        //ricerca la domanda n. i e seleziona 'si' o  'no'
        cy.log("risposta " + i + " = " + risposte[i])
        if (risposte[i] === true) {
          cy.log("SI")

          cy.get('.pnlDettagliVeicolo').find('.domandaInput').eq(i)
            .find('input[value="1"]').click()
        }
        else {
          cy.log("NO")

          cy.get('.pnlDettagliVeicolo').find('.domandaInput').eq(i)
            .find('input[value="2"]').click()
        }
      }
    })
  }

  /**
   * Inserisce eventuali parametri per le garanzie. Se non necessario inserire stringa vuota ""
   * @param {string} eredi 
   * @param {string} contraente 
   * @param {string} altri 
   */
  static datiIntegrativiParametro(eredi, contraente = "", altri = "") {
    let parametri = [eredi, contraente, altri] //array con le stringhe per i parametri

    cy.log("")

    matrixFrame().within(() => {
      for (var i = 0; i < parametri.length; i++) {
        //scorre la lista dei parametri e li inserisce se necessario
        if (parametri[i] === "") {
          cy.log("Parametro " + i + " non necessario")
        }
        else {
          cy.get('span[class$="errorLabelVisible"]').first()
            .siblings('.parametroGaranzia').find('input').clear().type(parametri[i] + "{enter}")
        }
      }
    })
  }

  /**
   * riceca targa nella sezione Integrazione
   * @param {string} targa 
   */
  static ricercaTarga(targa) {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('#txtCognome').should('be.visible')
        .clear().type(targa) //click sul pulsante
      cy.get('#btnRicerca').should('be.visible').click() //ricerca

      cy.get('#tblPersone').should('be.visible')
        .find('td').contains(targa).click() //aspetta il completamento della ricerca e clicca sulla targa trovata
    })
  }

  static nuovoVeicolo(targa) {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('input[value="Nuovo veicolo"]').should('be.visible').click() //click sul pulsante Nuovo Veicolo

      cy.get('#divInserimentoVeicolo').should('be.visible')
        .find('label').contains("Tipo veicolo:")
        .parents('tr').first()
        .find('select').select("autovettura ad uso privato")

      cy.get('#divInserimentoVeicolo').should('be.visible')
        .find('label').contains("Targa:")
        .parents('tr').first()
        .find('input').type(targa)

      cy.get('div[aria-labelledby$="InserimentoVeicolo"]').should('be.visible')
        .find('button').contains("Conferma").click()

      
    })
  }

  /**
   * Risponde alla domanda del popup 'Situazione assicurativa'
   * @param {bool} altreCoperture 
   */
  static situazioneAssicurativa(altreCoperture) {
    matrixFrame().within(() => {
      cy.get('#QuestionarioSituazioneAssicurativa').find('.domandaInput').within(() => {
        if (altreCoperture) {
          cy.get('input[value="1"]').click()
        }
        else {
          cy.get('input[value="2"]').click()
        }
      })

      cy.get('#QuestionarioSituazioneAssicurativa').next().find('button').contains("Conferma").click()
    })
  }
  //#endregion Integrazione

  //#region Consensi
  /**
   * Attende il caricamento della sezione Consensi
   */
  static caricamentoConsensi() {
    cy.intercept({
      method: 'POST',
      url: '**/GetElencoAutorizzazioni'
    }).as('consensi')

    cy.wait('@consensi', { requestTimeout: 60000 });
  }
  //#endregion Consensi

  //#region Finale
  /**
   * Attende il caricamento della sezione Finale
   */
  static caricamentoFinale() {
    cy.intercept({
      method: 'GET',
      url: '**/GetRiepilogoDocumenti'
    }).as('finale')

    cy.wait('@finale', { timeout: 120000 });
  }

  /**
   * Inserisce l'intermediario indicato. Default: sceglie un intermediario casuale
   * @param {string} intermediario 
   */
  static inserisciIntermediario(intermediario) {
    matrixFrame().within(() => {
      cy.getIFrame()
      cy.get('@iframe').within(() => {
        cy.get('#intermediario').select(intermediario)
      })
    })
  }

  /**
   * visualizza i documenti della sezione Riepilogo
   */
  static visualizzaDocumenti() {
    matrixFrame().within(() => {
      cy.getIFrame()
      cy.get('@iframe').within(() => {
        cy.get('#RiepilogoDocumentiContainer').find('button').each(($el, index, $list) => {
          cy.log($el.parents('tr').find('td').first().text())
          cy.log("hidden: " + $el.parents('[style$="display: none;"]').first().is(':hidden'))
          if ($el.parents('[style$="display: none;"]').first().is(':hidden')) {
            cy.log("documento non visualizzabile")
          }
          else {
            $el.trigger('click')

            cy.get('button').contains("Conferma").should('be.visible')
              .click()
          }
        })
      })
    })
  }

  static caricamentoProtocollazione() {
    cy.intercept({
      method: 'GET',
      url: '**/GetSezioneStampaContrassegno'
    }).as('protocollazione')

    cy.wait('@protocollazione', { timeout: 120000 });
  }

  /**
   * Click sul pulsante STAMPA
   */
  static stampa() {
    matrixFrame().within(() => {
      cy.getIFrame()
      cy.get('@iframe').within(() => {
        cy.get('button[title="STAMPA"]').should('be.visible').not('[disabled]').click()
      })
    })
  }

  /**
   * click sul pulsante Incassa
   */
  static incassa() {
    matrixFrame().within(() => {
      cy.getIFrame()
      cy.get('@iframe').within(() => {
        cy.get('button').contains("Incassa").click()
      })
    })
  }

  static salvaNumContratto() {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.get('.clNumeroPrevContr').should('be.visible').invoke('text').then(val => {
        cy.wrap(val).as('contratto')
        cy.log("return " + '@contratto')
      })
    })
  }
  //#endregion Finale
}

export default FastquoteDA
