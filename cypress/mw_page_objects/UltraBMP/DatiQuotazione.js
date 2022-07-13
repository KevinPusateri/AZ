/// <reference types="Cypress" />

import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"

const ultraIFrame = () => {
  let iframeSCU = cy.get('#matrixIframe')
    .its('0.contentDocument').should('exist')

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class DatiQuotazione {

  static CaricamentoPagina() {
    cy.log('***** CARICAMENTO PAGINA DATI QUOTAZIONE *****')
    cy.intercept({
      method: 'GET',
      url: '**/conferma-dati/**'
    }).as('datiQuotazione')

    cy.wait('@datiQuotazione', { requestTimeout: 60000 });
  }

  //#region ClickButton
  /**
    * ClickButton 
    * @param {string} azione - testo del button 
    */
  static ClickButton(azione) {
    cy.getIFrame()
    cy.get('@iframe').within(() => {
      cy.contains('span', azione).scrollIntoView().should('be.visible').click()
      //cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
      //cy.wait(2000)
    })
  }

  /**
   * Clicca sul pulsante Conferma
   * @param {bool} impresa //per i flussi Ultra Impresa
   */
  static confermaDatiQuotazione(impresa = false) {
    ultraIFrame().within(() => {
      //apertura menù scelta soluzione
      var tag = 'ultra-form-dati-quotazione'
      if (impresa) {
        tag = 'ultra-dati-quotazione-card'
      }

      cy.get(tag, { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

      cy.get('button').contains('CONFERMA', { matchCase: false })
        .scrollIntoView().should('be.visible').click() //conferma
      //cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
    })
  }
  //#endregion


  static verificaDropDown(oggetto, testoRiga, ind, testoDaVerificare) {
    cy.contains('h2', oggetto).should('exist')
      .parent('div').should('exist')
      .find('form').should('exist')
      .contains(testoRiga)
      .parent().should('have.class', 'ca-question ng-star-inserted')
      .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
      .children('div').should('have.length.gt', 0)
      .eq(ind).should('have.text', testoDaVerificare)
  }

  static verificaInput(oggetto, testoRiga, ind, testoDaVerificare) {
    cy.contains('h2', oggetto).should('exist')
      .parent('div').should('exist')
      .find('form').should('exist')
      .contains(testoRiga)
      .parent().should('have.class', 'ca-question ng-star-inserted')
      .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
      .children('div').should('have.length.gt', 0)
      .eq(ind).find('input').should('have.value', testoDaVerificare)
  }

  static modificaDropDown(oggetto, testoRiga, ind, testoDaInserire) {
    cy.contains('h2', oggetto).should('exist')
      .parent('div').should('exist')
      .find('form').should('exist')
      .contains(testoRiga)
      .parent().should('have.class', 'ca-question ng-star-inserted')
      .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
      .children('div').should('have.length.gt', 0)
      .eq(ind).should('be.visible')
      .find('[class="ng-star-inserted"]').should('be.visible').click()

    cy.get('.nx-dropdown__panel-body').should('be.visible')
      .find('span').contains(testoDaInserire).click()

    cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
    cy.wait(2000)
  }

  static modificaInput(oggetto, testoRiga, ind, testoDaInserire) {
    cy.contains('h2', oggetto).should('exist')
      .parent('div').should('exist')
      .find('form').should('exist')
      .contains(testoRiga)
      .parent().should('have.class', 'ca-question ng-star-inserted')
      .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
      .children('div').should('have.length.gt', 0)
      .eq(ind).should('be.visible')
      .click().wait(500)
      .clear().wait(500)
      .type(testoDaInserire).wait(2000)
      .type('{enter}')

    cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
    cy.wait(1000)

  }

  static verificaPresenzaOggetto(oggetto) {
    ultraIFrame().within(() => {
      cy.contains('h2', oggetto).should('exist')
    })
  }


  //#region Verifica default Casa
  /**
    * Verifica valori di default Casa 
    */
  static VerificaDefaultCasa(casa, daVerificare, valoriDefault) {

    ultraIFrame().within(() => {

      // *** RIGA ASSICURATO ***

      //Verifica default "Assicurato"
      if (daVerificare.Assicurato) {
        cy.log("Verifica default 'Assicurato - atteso': " + valoriDefault.Assicurato)
        DatiQuotazione.verificaDropDown(casa, 'assicurato è', 1, valoriDefault.Assicurato)
      }
      else
        cy.log("NON verifico campo 'Assicurato")

      //Verifica default "Nome abitazione"
      if (daVerificare.Nome) {
        cy.log("Verifica default 'Nome abitazione - atteso': " + valoriDefault.Nome)
        DatiQuotazione.verificaInput(casa, 'assicurato è', 3, valoriDefault.Nome)
      }
      else
        cy.log("NON verifico campo 'Nome abitazione")

      //Verifica default "Cap abitazione"
      if (daVerificare.Cap) {
        cy.log("Verifica default 'Cap - atteso': " + valoriDefault.Cap)
        DatiQuotazione.verificaInput(casa, 'assicurato è', 5, valoriDefault.Cap)
      }
      else
        cy.log("NON verifico campo 'Cap")

      // *** RIGA ABITAZIONE ***

      //Verifica default "Uso abitazione"
      if (daVerificare.Uso) {
        cy.log("Verifica default 'Uso - atteso': " + valoriDefault.Uso)
        DatiQuotazione.verificaDropDown(casa, 'È la casa', 1, valoriDefault.Uso)
      }
      else
        cy.log("NON verifico campo 'Uso")

      //Verifica default "Tipo abitazione"
      if (daVerificare.Tipo) {
        cy.log("Verifica default 'Tipo - atteso': " + valoriDefault.Tipo)
        DatiQuotazione.verificaDropDown(casa, 'È la casa', 4, valoriDefault.Tipo)
      }
      else
        cy.log("NON verifico campo 'Tipo")

      //Verifica default "Metri Quadri abitazione"
      if (daVerificare.Mq) {
        cy.log("Verifica default 'Metri quadri abitazione - atteso': " + valoriDefault.Mq)
        DatiQuotazione.verificaInput(casa, 'È la casa', 6, valoriDefault.Mq)
      }
      else
        cy.log("NON verifico campo 'Metri quadri abitazione")

      //Verifica default "Piano abitazione"
      if (daVerificare.Piano) {
        cy.log("Verifica default 'Piano - atteso': " + valoriDefault.Piano)
        DatiQuotazione.verificaDropDown(casa, 'È la casa', 9, valoriDefault.Piano)
      }
      else
        cy.log("NON verifico campo 'Piano")

      // *** RIGA VALORE RICOSTRUZIONE ***

      //Verifica default "Valore abitazione"
      if (daVerificare.Valore) {
        cy.log("Verifica default 'Valore abitazione - atteso': " + valoriDefault.Valore)
        DatiQuotazione.verificaInput(casa, 'Il valore di ricostruzione', 1, valoriDefault.Valore)
      }
      else
        cy.log("NON verifico campo 'Valore abitazione")

      // *** RIGA CARATTERISTICHE COSTRUTTIVE ***

      //Verifica default "Classe abitazione"
      if (daVerificare.Classe) {
        cy.log("Verifica default 'Classe - atteso': " + valoriDefault.Classe)
        DatiQuotazione.verificaDropDown(casa, 'Le caratteristiche costruttive', 1, valoriDefault.Classe)
      }
      else
        cy.log("NON verifico campo 'Classe")

      // *** RIGA MEZZI DI PROTEZIONE ***

      //Verifica default "Classe protezione"
      if (daVerificare.ClasseProtezione) {
        cy.log("Verifica default 'Classe Protezione - atteso': " + valoriDefault.ClasseProtezione)
        DatiQuotazione.verificaDropDown(casa, 'Ha mezzi di protezione', 1, valoriDefault.ClasseProtezione)
      }
      else
        cy.log("NON verifico campo 'Classe Protezione")

      //Verifica default "Presenza allarme"
      if (daVerificare.Allarme) {
        cy.log("Verifica default 'Allarme - atteso': " + valoriDefault.Allarme)
        DatiQuotazione.verificaDropDown(casa, 'Ha mezzi di protezione', 3, valoriDefault.Allarme)
      }
      else
        cy.log("NON verifico campo 'Allarme")

      // *** RIGA ANNO DI COSTRUZIONE ***

      //Verifica default "Anno di costruzione"
      if (daVerificare.Anno) {
        cy.log("Verifica default 'Anno costruzione - atteso': " + valoriDefault.Anno)
        DatiQuotazione.verificaDropDown(casa, 'Lo stabile è stato costruito', 1, valoriDefault.Anno)
      }
      else
        cy.log("NON verifico campo 'Anno costruzione")

      // *** RIGA ESTENSIONE PROTEZIONE ***

      //Verifica default "E"stensione protezione"
      if (daVerificare.Estensione) {
        cy.log("Verifica default 'Estensione protezione - atteso': " + valoriDefault.Estensione)
        DatiQuotazione.verificaDropDown(casa, 'estendere la protezione', 0, valoriDefault.Estensione)
      }
      else
        cy.log("NON verifico campo 'Estensione protezione")

      // *** RIGA ASSICURATO ***

      //Verifica default "Residenza assicurato"
      if (daVerificare.ResidenzaAss) {
        cy.log("Verifica default 'Residenza assicurato - atteso': " + valoriDefault.ResidenzaAss)
        DatiQuotazione.verificaDropDown(casa, 'assicurato ha la residenza', 1, valoriDefault.ResidenzaAss)
      }
      else
        cy.log("NON verifico campo 'Residenza assicurato")

      //Verifica default "Cap assicurato"
      if (daVerificare.CapAss) {
        cy.log("Verifica default 'Cap assicurato - atteso': " + valoriDefault.CapAss)
        DatiQuotazione.verificaInput(casa, 'assicurato ha la residenza', 3, valoriDefault.CapAss)
      }
      else
        cy.log("NON verifico campo 'Cap assicurato")

    })

  }
  //#endregion

  //#region Verifica default Animale Domestico
  /**
    * Verifica valori di default Animale Domestico 
    */
  static VerificaDefaultAnimaleDomestico(animale, daVerificare, valoriDefault) {

    ultraIFrame().within(() => {

      //Verifica default "Nome animale"
      if (daVerificare.Nome) {
        cy.log("Verifica default 'Nome animale - atteso': " + valoriDefault.Nome)
        DatiQuotazione.verificaInput(animale, 'è un', 1, valoriDefault.Nome)
      }
      else
        cy.log("NON verifico campo 'Nome")

      //Verifica default "Tipo"
      if (daVerificare.Tipo) {
        cy.log("Verifica default 'Tipo - atteso': " + valoriDefault.Tipo)
        DatiQuotazione.verificaDropDown(animale, 'è un', 3, valoriDefault.Tipo)
      }
      else
        cy.log("NON verifico campo 'Tipo")

      //Verifica default "Sesso"
      if (daVerificare.Sesso) {
        cy.log("Verifica default 'Sesso - atteso': " + valoriDefault.Sesso)
        DatiQuotazione.verificaDropDown(animale, 'è un', 6, valoriDefault.Sesso)
      }
      else
        cy.log("NON verifico campo 'Sesso")

      //Verifica default "Razza"
      if (daVerificare.Razza) {
        cy.log("Verifica default 'Razza - atteso': " + valoriDefault.Razza)
        DatiQuotazione.verificaDropDown(animale, 'di razza', 1, valoriDefault.Razza)
      }
      else
        cy.log("NON verifico campo 'Razza")

      //Verifica default "Data di nascita" (data odierna meno un anno)
      if (daVerificare.DataNascita) {
        //valoriDefault.DataNascita = UltraBMP.dataOggiMenoUnAnno()
        valoriDefault.DataNascita = UltraBMP.dataOggiPiuAnni(-1)
        cy.log("Verifica default 'Data di nascita - atteso': " + valoriDefault.DataNascita)
        DatiQuotazione.verificaInput(animale, 'La sua data di nascita', 4, valoriDefault.DataNascita)
      }
      else
        cy.log("NON verifico campo 'DataNascita")

      //Verifica default "Residenza"
      if (daVerificare.Residenza) {
        cy.log("Verifica default 'Residenza - atteso': " + valoriDefault.Residenza)
        DatiQuotazione.verificaDropDown(animale, 'Il proprietario ha la residenza', 1, valoriDefault.Residenza)
      }
      else
        cy.log("NON verifico campo 'Residenza")

      //Verifica default "Cap"
      if (daVerificare.Cap) {
        cy.log("Verifica default 'Cap residenza - atteso': " + valoriDefault.Cap)
        DatiQuotazione.verificaInput(animale, 'Il proprietario ha la residenza', 3, valoriDefault.Cap)
      }
      else
        cy.log("NON verifico campo 'Cap")

    })

  }
  //#endregion


  //#region Modifica Valori Casa 
  /**
    * Modifica valori Casa
    * @param {JSON} modificheCasa - Valori da modificare
    */
  static ModificaValoriCasa(casa, daModificare, modificheCasa) {
    ultraIFrame().within(() => {
      cy.log("MODIFICHE VALORI QUOTAZIONE - CASA")

      // *** RIGA ASSICURATO ***

      //Modifica "Assicurato"
      if (daModificare.Assicurato) {
        cy.log("Modifica 'Assicurato - da inserire': " + modificheCasa.Assicurato)
        //cy.pause()
        DatiQuotazione.modificaDropDown(casa, 'assicurato è', 1, modificheCasa.Assicurato)
      }

      //Modifica "Nome abitazione"
      if (daModificare.Nome) {
        cy.log("Modifica 'Nome abitazione - da inserire': " + modificheCasa.Nome)
        DatiQuotazione.modificaInput(casa, 'assicurato è', 3, modificheCasa.Nome)

        cy.get('div[id="warning-switch-solution"]')
          .find('span').contains('Ok').should('be.visible').click()
        cy.wait(1000)

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000)

        casa = modificheCasa.Nome
      }

      //Modifica "Cap abitazione"
      if (daModificare.Cap) {
        cy.log("Modifica 'Cap - da inserire': " + modificheCasa.Cap)
        cy.contains('h2', casa).should('exist')
          .parent('div').should('exist')
          .find('form').should('exist')
          .contains("che si trova al CAP")
          .parent().should('have.class', 'ca-question ng-star-inserted')
          .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
          .children('div').should('have.length.gt', 0)
          .eq(5).should('be.visible').as('cap1')
          .click().wait(500)
          .clear().wait(500)
          .type(modificheCasa.Cap).wait(1000)

        cy.contains(modificheCasa.Cap).should('have.length', 1).dblclick()
        cy.wait(1000)

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000)
      }

      // *** RIGA ABITAZIONE ***

      //Modifica "Uso abitazione"
      if (daModificare.Uso) {
        cy.log("Modifica 'Uso - da inserire': " + modificheCasa.Uso)
        DatiQuotazione.modificaDropDown(casa, 'È la casa', 1, modificheCasa.Uso)
      }

      //Modifica "Tipo abitazione"
      if (daModificare.Tipo) {
        cy.log("Modifica 'Tipo - da inserire': " + modificheCasa.Tipo)
        DatiQuotazione.modificaDropDown(casa, 'È la casa', 4, modificheCasa.Tipo)
      }

      //Modifica "Metri Quadri abitazione"
      if (daModificare.Mq) {
        cy.log("Modifica 'Metri quadri abitazione - da inserire': " + modificheCasa.Mq)
        DatiQuotazione.modificaInput(casa, 'È la casa', 6, modificheCasa.Mq)
      }

      //Modifica "Piano abitazione"
      if (daModificare.Piano) {
        cy.log("Modifica 'Piano - da inserire': " + modificheCasa.Piano)
        DatiQuotazione.modificaDropDown(casa, 'È la casa', 9, modificheCasa.Piano)
      }

      // *** RIGA VALORE RICOSTRUZIONE ***

      //Modifica "Valore abitazione"
      if (daModificare.Valore) {
        cy.log("Modifica 'Valore abitazione - da inserire': " + modificheCasa.Valore)
        DatiQuotazione.modificaInput(casa, 'Il valore di ricostruzione', 1, modificheCasa.Valore)
      }

      // *** RIGA CARATTERISTICHE COSTRUTTIVE ***

      //Modifica "Classe abitazione"
      if (daModificare.Classe) {
        cy.log("Modifica 'Classe - da inserire': " + modificheCasa.Classe)
        DatiQuotazione.modificaDropDown(casa, 'Le caratteristiche costruttive', 1, modificheCasa.Classe)
      }

      // *** RIGA MEZZI DI PROTEZIONE ***

      //Modifica "Classe protezione"
      if (daModificare.ClasseProtezione) {
        cy.log("Modifica 'Classe Protezione - da inserire': " + modificheCasa.ClasseProtezione)
        DatiQuotazione.modificaDropDown(casa, 'Ha mezzi di protezione', 1, modificheCasa.ClasseProtezione)
      }

      //Modifica "Presenza allarme"
      if (daModificare.Allarme) {
        cy.log("Modifica 'Allarme - da inserire': " + modificheCasa.Allarme)
        DatiQuotazione.modificaDropDown(casa, 'Ha mezzi di protezione', 3, modificheCasa.Allarme)
      }

      // *** RIGA ANNO DI COSTRUZIONE ***

      //Modifica "Anno di costruzione"
      if (daModificare.Anno) {
        cy.log("Modifica 'Anno costruzione - da inserire': " + modificheCasa.Anno)
        DatiQuotazione.modificaDropDown(casa, 'Lo stabile è stato costruito', 1, modificheCasa.Anno)
      }

      // *** RIGA ESTENSIONE PROTEZIONE ***

      //Modifica "E"stensione protezione"
      if (daModificare.Estensione) {
        cy.log("Modifica 'Estensione protezione - da inserire': " + modificheCasa.Estensione)
        DatiQuotazione.modificaDropDown(casa, 'estendere la protezione', 0, modificheCasa.Estensione)
      }

      // *** RIGA ASSICURATO ***

      //Modifica "Residenza assicurato"
      if (daModificare.ResidenzaAss) {
        cy.log("Modifica 'Residenza assicurato - da inserire': " + modificheCasa.ResidenzaAss)
        DatiQuotazione.modificaDropDown(casa, 'assicurato ha la residenza', 1, modificheCasa.ResidenzaAss)
      }

      //Modifica "Cap assicurato"
      if (daModificare.CapAss) {
        cy.log("Modifica 'Cap assicurato - da inserire': " + modificheCasa.CapAss)
        cy.contains('h2', casa).should('exist')
          .parent('div').should('exist')
          .find('form').should('exist')
          .contains("assicurato ha la residenza")
          .parent().should('have.class', 'ca-question ng-star-inserted')
          .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
          .children('div').should('have.length.gt', 0)
          .eq(3).should('be.visible').as('cap2')
          .click().wait(500)
          .clear().wait(500)
          .type(modificheCasa.CapAss).wait(1000)

        cy.contains(modificheCasa.CapAss).should('have.length', 1).dblclick()
        cy.wait(1000)

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000)
      }

    })

  }
  //#endregion

  //#region Modifica Valori Animale Domestico 
  /**
    * Modifica valori Animale Domestico
    * @param {JSON} modificheAnimale - Valori da modificare
    */
  static ModificaValoriAnimaleDomestico(animale, daModificare, modificheAnimale) {
    ultraIFrame().within(() => {

      cy.log("MODIFICHE VALORI QUOTAZIONE - ANIMALE DOMESTICO")

      //Modifica "Nome animale"
      if (daModificare.Nome) {
        cy.log("Modifica 'Nome animale' - da inserire: " + modificheAnimale.Nome)
        DatiQuotazione.modificaInput(animale, 'è un', 1, modificheAnimale.Nome)

        animale = modificheAnimale.Nome
      }

      //Modifica "Tipo"
      if (daModificare.Tipo) {
        cy.log("Modifica 'Tipo' - da inserire: " + modificheAnimale.Tipo)
        DatiQuotazione.modificaDropDown(animale, 'è un', 3, modificheAnimale.Tipo)
      }

      //Modifica "Sesso"
      if (daModificare.Sesso) {
        cy.log("Modifica 'Sesso' - da inserire: " + modificheAnimale.Sesso)
        DatiQuotazione.modificaDropDown(animale, 'è un', 6, modificheAnimale.Sesso)
      }

      //Modifica "Razza"
      if (daModificare.Razza) {
        cy.log("Modifica 'Razza' - da inserire: " + modificheAnimale.Razza)
        DatiQuotazione.modificaDropDown(animale, 'di razza', 1, modificheAnimale.Razza)
      }

      //Modifica "Data di nascita"
      if (daModificare.DataNascita) {
        cy.log("Modifica 'Data di nascita' - da inserire: " + modificheAnimale.DataNascita)
        DatiQuotazione.modificaInput(animale, 'La sua data di nascita', 4, modificheAnimale.DataNascita)
      }

      //Modifica "Residenza"
      if (daModificare.Residenza) {
        cy.log("Modifica'Residenza' - da inserire: " + modificheAnimale.Residenza)
        DatiQuotazione.modificaDropDown(animale, 'Il proprietario ha la residenza', 1, modificheAnimale.Residenza)
      }

      //Modifica "Cap"
      if (daModificare.Cap) {
        cy.log("Modifica 'Cap residenza' - da inserire: " + modificheAnimale.Cap)
        cy.contains('h2', animale).should('exist')
          .parent('div').should('exist')
          .find('form').should('exist')
          .contains("Il proprietario ha la residenza")
          .parent().should('have.class', 'ca-question ng-star-inserted')
          .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
          .children('div').should('have.length.gt', 0)
          .eq(3).should('be.visible').as('cap2')
          .click().wait(500)
          .clear().wait(500)
          .type(modificheAnimale.Cap).wait(1000)

        cy.contains(modificheAnimale.Cap).should('have.length', 1).dblclick()
        cy.wait(1000)

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000)

      }
    })
  }
  //#endregion

  static modificaDatoQuotazione(dato, modifica) {
    ultraIFrame().within(() => {
      cy.get('.ng-star-inserted').contains(dato)
        .parents('[class^="ca-questions-row"]').then(($element) => {
          switch (dato) {
            case "assicurato", "nato", "cap": //modifica textbox/input
              cy.wrap($element).find('input').clear().type(modifica)
              break;
            case "copertura":
              cy.wrap($element).find('nx-dropdown').trigger('click')
              cy.wait(300)
              cy.get('nx-dropdown-item').contains(modifica)
                .should('be.visible').click()
              break;
            case "professione":
              cy.wrap($element).find('[class*="professioneDrop"]').click()
              cy.wait(500)
              cy.get('[class="search-professioni extended"]').should('be.visible')
                .find('input[type="search"]').type(modifica)
              cy.get('[id="alz-spinner"]').should('not.be.visible')
              cy.get('[class^="result-content"]').contains(modifica).click()
              cy.get('button').contains('CONFERMA').click()
              cy.get('[id="alz-spinner"]').should('not.be.visible')
              cy.get('[class*="professioneDrop"]').children()
                .should('contain.text', modifica)
              break;
            default:
            // code block
          }
        })
    })
  }
}

export default DatiQuotazione