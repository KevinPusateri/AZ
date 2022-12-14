/// <reference types="Cypress" />

import Common from "../common/Common"
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import DatiQuotazione from "../../mw_page_objects/UltraBMP/DatiQuotazione"
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'


const ultraIFrame = () => {
  let iframeSCU = cy.get('#matrixIframe')
    .its('0.contentDocument').should('exist')

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class ConfigurazioneAmbito {

  //#region ClickButton
  /**
    * ClickButton 
    * @param {string} azione - testo del button 
    */
  static ClickButton(azione) {
    ultraIFrame().within(() => {
      cy.contains('span', azione).scrollIntoView().should('be.visible').click().wait(500)
      //cy.get('[id="alz-spinner"]').should('not.be.visible')
      cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible') //attende il caricamento
    })

  }
  //#endregion

  /**
   * Clicca sull'icona della matita dell'ambito indicato
   * Utilizza i nomi degli ambiti da fixture ambitiUltra.js
   * @param {string da fixture} ambito 
   */
  static apriConfigurazioneAmbito(ambito) {
    ultraIFrame().within(() => {
      cy.get('ultra-dash-ambiti-istanze-table')
        .find('nx-icon[class*="' + ambito + '"]')
        .parents('tr')
        .find('nx-icon[name="pen"]')
        .click({force: true}) //clicca sull'icona della penna

      cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible') //attende il caricamento
    })
  }

  static verificaSoluzioneSelezionata(soluzioneSel) {
    ultraIFrame().within(() => {
      cy.get('div[class="ca-col-soluzione selected"]').should('exist')
        .contains(soluzioneSel).should('exist')
    })
  }

  static aggiungiGaranzia(garanziaAgg) {
    ultraIFrame().within(() => {
      cy.get('#caGaranzie').should('be.visible') //verifica che la sezione Garanzie Aggiuntive sia visibile

      cy.get('ultra-config-ambito-garanzia-aggiuntiva')
        .contains(garanziaAgg).should('be.visible')
        //.parents('ultra-config-ambito-garanzia-aggiuntiva')
        .parents('div[class="garanzia-principale ultra-centered nx-grid__row"]')
        .find('button').should('be.enabled').click()
        //.find('button').contains('Aggiungi').should('exist').click()

      cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
    })
  }

  static aggiungiEstensione(garanziaAgg) {
    ultraIFrame().within(() => {
      cy.get('#caGaranzie').should('be.visible') //verifica che la sezione Garanzie Aggiuntive sia visibile

      cy.get('ultra-config-ambito-garanzia-aggiuntiva')
        .contains(garanziaAgg).should('be.visible')
        //.parents('ultra-config-ambito-garanzia-aggiuntiva')
        .parents('div[class="ca-sottogaranzia nx-grid__row ng-star-inserted"]')
        .find('button').should('be.enabled').click()
        //.find('button').contains('Aggiungi').should('exist').click()

      cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
    })
  }

  static leggiPremio(garanzia) {
    //let pr = 0
    ultraIFrame().within(() => {
      if (garanzia.toUpperCase() == 'TOTALE')    // Premio totale
      {
        cy.get('div[id="ambitiHeader"]').should('exist')
          .find('div[class ^="header-price-euro"]').should('have.length.gt', 0)
          .eq(0).should('be.visible').invoke('text').then(val => {
            cy.wrap(val).as('premioTot')
          })
      }
      else if (garanzia.toUpperCase() == 'AMBITO')    // Premio dell'ambito
      {
        cy.get('div[id="ambitiHeader"]').should('exist')
          .find('div[class ^="header-price-euro"]').should('have.length.gt', 0)
          .eq(1).should('be.visible').invoke('text').then(val => {
            cy.wrap(val).as('premioAmbito')
          })

      }
      else {

      }
    })

  }

  static leggiPremioGaranziaAggiuntiva(garanziaAgg) {
    ultraIFrame().within(() => {
      cy.contains('span', garanziaAgg).should('exist')
        .parent('div')
        .parent('div')
        .find('div[class="nx-grid__row"]').should('have.length.gt', 0)
        .eq(0).find('span').should('be.visible').invoke('text').then(val => {
          cy.wrap(val).as('premioGarAgg')
        })
    })

  }

  /**
   * Modifica della somma assicurata della garanzia aggiuntiva passata in input
   * @param {string} garanziaAgg   (nome della garanzia aggiuntiva)
   * @param {string} importo   (valore somma assicurata che si vuole selezionare) 
   */
  static modificaSommaAssicurataGarAgg(garanziaAgg, importo) {
    cy.intercept({
      method: 'GET',
      url: /premio/
  }).as('premio')

    ultraIFrame().within(() => {
      //cy.log('***** CARICAMENTO PAGINA CONTROLLI E PROTOCOLLAZIONE *****')
        
      cy.contains('span', garanziaAgg).should('exist')
        .parents('div[class="garanzia-principale ultra-centered nx-grid__row"]').should('have.length', 1)
        //.parent('div')
        .find('div').contains('Somma assicurata').should('exist')
        .parents('div[class="garanzia-control nx-grid__column-3 ng-star-inserted"]').should('exist')
        .find('nx-dropdown[class="nx-dropdown ng-star-inserted is-filled"]').should('exist').click().wait(500)

      cy.get('div[class="nx-dropdown__panel-body"]').should('exist')
        .contains(importo).click()

        cy.wait('@premio', { timeout: 100000 })

    })

  }


  static verificaDropDown(testoRiga, ind, testoDaVerificare) {
    cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
      .find('form').should('exist')
      .contains(testoRiga)
      .parent().should('have.class', 'ca-question ng-star-inserted')
      .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
      .children('div').should('have.length.gt', 0)
      .eq(ind).should('have.text', testoDaVerificare)
  }

  static verificaInput(testoRiga, ind, testoDaVerificare) {
    cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
      .find('form').should('exist')
      .contains(testoRiga)
      .parent().should('have.class', 'ca-question ng-star-inserted')
      .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
      .children('div').should('have.length.gt', 0)
      .eq(ind).find('input').should('have.value', testoDaVerificare)
  }

  static modificaDropDown(testoRiga, ind, testoDaInserire) {
    cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
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

  static modificaInput(testoRiga, ind, testoDaInserire) {
    cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
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
    cy.wait(1000);

  }

  static modificaDropDownConf(testoRiga, ind, testoDaInserire) {
    cy.get('div[class="ca-col-soluzione selected"]').should('exist')
      .contains(testoRiga)
      .parent().should('have.class', 'garanzia-name')
      .parent().should('have.class', 'soluz-garanzia-0 soluz-garanzie ng-star-inserted')
      .children('div').should('have.length.gt', 0)
      .eq(ind).should('be.visible')
      .find('[class="ng-star-inserted"]').should('be.visible')
      .eq(1).should('be.visible').click()

    cy.get('.nx-dropdown__panel-body').should('be.visible')
      .find('span').contains(testoDaInserire).click()

    cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
    cy.wait(2000)

  }

  //#region Verifica default Casa
  /**
    * Verifica valori di default Casa 
    */
  static VerificaDefaultCasa(daVerificare, valoriDaVerificare) {

    ultraIFrame().within(() => {

      // *** RIGA ASSICURATO ***

      //Verifica default "Assicurato"
      if (daVerificare.Assicurato) {
        if (valoriDaVerificare.Assicurato.length > 0) {
          cy.log("Verifica 'Assicurato' - atteso: " + valoriDaVerificare.Assicurato)
          ConfigurazioneAmbito.verificaDropDown('assicurato ??', 1, valoriDaVerificare.Assicurato)
        }
        else {
          cy.log("Verifica default 'Assicurato' - atteso: " + defaultCasa.Assicurato)
          ConfigurazioneAmbito.verificaDropDown('assicurato ??', 1, defaultCasa.Assicurato)
        }
      }
      else
        cy.log("NON verifico campo 'Assicurato")

      //Verifica default "Nome abitazione"
      if (daVerificare.Nome) {
        if (valoriDaVerificare.Nome.length > 0) {
          cy.log("Verifica 'Nome abitazione' - atteso: " + valoriDaVerificare.Nome)
          ConfigurazioneAmbito.verificaInput('assicurato ??', 3, valoriDaVerificare.Nome)
        }
        else {
          cy.log("Verifica default 'Nome abitazione' - atteso: " + defaultCasa.Nome)
          ConfigurazioneAmbito.verificaDropDown('assicurato ??', 3, defaultCasa.Nome)
        }
      }
      else
        cy.log("NON verifico campo 'Nome abitazione")

      //Verifica default "Cap abitazione"
      if (daVerificare.Cap) {
        if (valoriDaVerificare.Cap.length > 0) {
          cy.log("Verifica 'Cap' - atteso: " + valoriDaVerificare.Cap)
          ConfigurazioneAmbito.verificaInput('assicurato ??', 5, valoriDaVerificare.Cap)
        }
        else {
          cy.log("Verifica default 'Cap' - atteso: " + defaultCasa.Cap)
          ConfigurazioneAmbito.verificaDropDown('assicurato ??', 5, defaultCasa.Cap)
        }
      }
      else
        cy.log("NON verifico campo 'Cap")

      // *** RIGA ABITAZIONE ***

      //Verifica default "Uso abitazione"
      if (daVerificare.Uso) {
        if (valoriDaVerificare.Uso.length > 0) {
          cy.log("Verifica 'Uso' - atteso: " + valoriDaVerificare.Uso)
          ConfigurazioneAmbito.verificaDropDown('?? la casa', 1, valoriDaVerificare.Uso)
        }
        else {
          cy.log("Verifica default 'Uso' - atteso: " + defaultCasa.Uso)
          ConfigurazioneAmbito.verificaDropDown('?? la casa', 1, defaultCasa.Uso)
        }
      }
      else
        cy.log("NON verifico campo 'Uso")

      //Verifica default "Tipo abitazione"
      if (daVerificare.Tipo) {
        if (valoriDaVerificare.Tipo.length > 0) {
          cy.log("Verifica 'Tipo' - atteso: " + valoriDaVerificare.Tipo)
          ConfigurazioneAmbito.verificaDropDown('?? la casa', 4, valoriDaVerificare.Tipo)
        }
        else {
          cy.log("Verifica default 'Tipo' - atteso: " + defaultCasa.Tipo)
          ConfigurazioneAmbito.verificaDropDown('?? la casa', 4, defaultCasa.Tipo)
        }
      }
      else
        cy.log("NON verifico campo 'Tipo")

      //Verifica default "Metri Quadri abitazione"
      if (daVerificare.Mq) {
        if (valoriDaVerificare.Mq.length > 0) {
          cy.log("Verifica 'Metri quadri abitazione' - atteso: " + valoriDaVerificare.Mq)
          ConfigurazioneAmbito.verificaInput('?? la casa', 6, valoriDaVerificare.Mq)
        }
        else {
          cy.log("Verifica default 'Metri quadri abitazione' - atteso: " + defaultCasa.Mq)
          ConfigurazioneAmbito.verificaDropDown('?? la casa', 6, defaultCasa.Mq)
        }
      }
      else
        cy.log("NON verifico campo 'Metri quadri abitazione")

      //Verifica default "Piano abitazione"
      if (daVerificare.Piano) {
        if (valoriDaVerificare.Piano.length > 0) {
          cy.log("Verifica 'Piano' - atteso': " + valoriDaVerificare.Piano)
          ConfigurazioneAmbito.verificaDropDown('?? la casa', 9, valoriDaVerificare.Piano)
        }
        else {
          cy.log("Verifica default 'Piano' - atteso: " + defaultCasa.Piano)
          ConfigurazioneAmbito.verificaDropDown('?? la casa', 9, defaultCasa.Piano)
        }
      }
      else
        cy.log("NON verifico campo 'Piano")

      // *** RIGA VALORE RICOSTRUZIONE ***

      //Verifica default "Valore abitazione"
      if (daVerificare.Valore) {
        if (valoriDaVerificare.Valore.length > 0) {
          cy.log("Verifica 'Valore abitazione' - atteso: " + valoriDaVerificare.Valore)
          ConfigurazioneAmbito.verificaInput('Il valore di ricostruzione', 1, valoriDaVerificare.Valore)
        }
        else {
          cy.log("Verifica default 'Valore abitazione' - atteso: " + defaultCasa.Valore)
          ConfigurazioneAmbito.verificaDropDown('Il valore di ricostruzione', 1, defaultCasa.Valore)
        }
      }
      else
        cy.log("NON verifico campo 'Valore abitazione")

      // *** RIGA CARATTERISTICHE COSTRUTTIVE ***

      //Verifica default "Classe abitazione"
      if (daVerificare.Classe) {
        if (valoriDaVerificare.Classe.length > 0) {
          cy.log("Verifica 'Classe' - atteso: " + valoriDaVerificare.Classe)
          ConfigurazioneAmbito.verificaDropDown('Le caratteristiche costruttive', 1, valoriDaVerificare.Classe)
        }
        else {
          cy.log("Verifica default 'Classe' - atteso: " + defaultCasa.Classe)
          ConfigurazioneAmbito.verificaDropDown('Le caratteristiche costruttive', 1, defaultCasa.Classe)
        }
      }
      else
        cy.log("NON verifico campo 'Classe")

      // *** RIGA MEZZI DI PROTEZIONE ***

      //Verifica default "Classe protezione"
      if (daVerificare.ClasseProtezione) {
        if (valoriDaVerificare.ClasseProtezione.length > 0) {
          cy.log("Verifica 'Classe Protezione' - atteso: " + valoriDaVerificare.ClasseProtezione)
          ConfigurazioneAmbito.verificaDropDown('Ha mezzi di protezione', 1, valoriDaVerificare.ClasseProtezione)
        }
        else {
          cy.log("Verifica default 'Classe Protezione' - atteso: " + defaultCasa.ClasseProtezione)
          ConfigurazioneAmbito.verificaDropDown('Ha mezzi di protezione', 1, defaultCasa.ClasseProtezione)
        }
      }
      else
        cy.log("NON verifico campo 'Classe Protezione")

      //Verifica default "Presenza allarme"
      if (daVerificare.Allarme) {
        if (valoriDaVerificare.Allarme.length > 0) {
          cy.log("Verifica 'Allarme' - atteso: " + valoriDaVerificare.Allarme)
          ConfigurazioneAmbito.verificaDropDown('Ha mezzi di protezione', 3, valoriDaVerificare.Allarme)
        }
        else {
          cy.log("Verifica default 'Allarme' - atteso: " + defaultCasa.Allarme)
          ConfigurazioneAmbito.verificaDropDown('Ha mezzi di protezione', 3, defaultCasa.Allarme)
        }
      }
      else
        cy.log("NON verifico campo 'Allarme")

      // *** RIGA ANNO DI COSTRUZIONE ***

      //Verifica default "Anno di costruzione"
      if (daVerificare.Anno) {
        if (valoriDaVerificare.Anno.length > 0) {
          cy.log("Verifica 'Anno costruzione' - atteso: " + valoriDaVerificare.Anno)
          ConfigurazioneAmbito.verificaDropDown('Lo stabile ?? stato costruito', 1, valoriDaVerificare.Anno)
        }
        else {
          cy.log("Verifica default 'Anno costruzione' - atteso: " + defaultCasa.Anno)
          ConfigurazioneAmbito.verificaDropDown('Lo stabile ?? stato costruito', 1, defaultCasa.Anno)
        }
      }
      else
        cy.log("NON verifico campo 'Anno costruzione")

      // *** RIGA ESTENSIONE PROTEZIONE ***

      //Verifica default "E"stensione protezione"
      if (daVerificare.Estensione) {
        if (valoriDaVerificare.Estensione.length > 0) {
          cy.log("Verifica 'Estensione protezione' - atteso: " + valoriDaVerificare.Estensione)
          ConfigurazioneAmbito.verificaDropDown('estendere la protezione', 0, valoriDaVerificare.Estensione)
        }
        else {
          cy.log("Verifica default 'Estensione protezione' - atteso: " + defaultCasa.Estensione)
          ConfigurazioneAmbito.verificaDropDown('estendere la protezione', 0, defaultCasa.Estensione)
        }
      }
      else
        cy.log("NON verifico campo 'Estensione protezione")

      // *** RIGA ASSICURATO ***

      //Verifica default "Residenza assicurato"
      if (daVerificare.ResidenzaAss) {
        if (valoriDaVerificare.ResidenzaAss.length > 0) {
          cy.log("Verifica 'Residenza assicurato' - atteso: " + valoriDaVerificare.ResidenzaAss)
          ConfigurazioneAmbito.verificaDropDown('assicurato ha la residenza', 1, valoriDaVerificare.ResidenzaAss)
        }
        else {
          cy.log("Verifica default 'Residenza assicurato' - atteso: " + defaultCasa.ResidenzaAss)
          ConfigurazioneAmbito.verificaDropDown('assicurato ha la residenza', 1, defaultCasa.ResidenzaAss)
        }
      }
      else
        cy.log("NON verifico campo 'Residenza assicurato")

      //Verifica default "Cap assicurato"
      if (daVerificare.CapAss) {
        if (valoriDaVerificare.CapAss.length > 0) {
          cy.log("Verifica 'Cap assicurato' - atteso: " + valoriDaVerificare.CapAss)
          ConfigurazioneAmbito.verificaInput('assicurato ha la residenza', 3, valoriDaVerificare.CapAss)
        }
        else {
          cy.log("Verifica default 'Cap assicurato' - atteso: " + defaultCasa.CapAss)
          ConfigurazioneAmbito.verificaDropDown('assicurato ha la residenza', 3, defaultCasa.CapAss)
        }
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
  static VerificaDefaultAnimaleDomestico(daVerificare, valoriDaVerificare) {

    ultraIFrame().within(() => {

      //Verifica default "Nome animale"
      if (daVerificare.Nome) {
        if (valoriDaVerificare.Nome.length > 0) {
          cy.log("Verifica 'Nome animale' - atteso: " + valoriDaVerificare.Nome)
          ConfigurazioneAmbito.verificaInput('?? un', 1, valoriDaVerificare.Nome)
        }
        else {
          cy.log("Verifica default 'Nome animale' - atteso: " + defaultAnimale.Nome)
          ConfigurazioneAmbito.verificaDropDown('?? un', 1, defaultAnimale.Nome)
        }
      }
      else
        cy.log("NON verifico campo 'Nome")

      //Verifica default "Tipo"
      if (daVerificare.Tipo) {
        if (valoriDaVerificare.Tipo.length > 0) {
          cy.log("Verifica 'Tipo' - atteso: " + valoriDaVerificare.Tipo)
          ConfigurazioneAmbito.verificaDropDown('?? un', 3, valoriDaVerificare.Tipo)
        }
        else {
          cy.log("Verifica default 'Tipo' - atteso: " + defaultAnimale.Tipo)
          ConfigurazioneAmbito.verificaDropDown('?? un', 3, defaultAnimale.Tipo)
        }
      }
      else
        cy.log("NON verifico campo 'Tipo")

      //Verifica default "Sesso"
      if (daVerificare.Sesso) {
        if (valoriDaVerificare.Sesso.length > 0) {
          cy.log("Verifica 'Sesso' - atteso: " + valoriDaVerificare.Sesso)
          ConfigurazioneAmbito.verificaDropDown('?? un', 6, valoriDaVerificare.Sesso)
        }
        else {
          cy.log("Verifica default 'Sesso' - atteso: " + defaultAnimale.Sesso)
          ConfigurazioneAmbito.verificaDropDown('?? un', 6, defaultAnimale.Sesso)
        }
      }
      else
        cy.log("NON verifico campo 'Sesso")

      //Verifica default "Razza"
      if (daVerificare.Razza) {
        if (valoriDaVerificare.Razza.length > 0) {
          cy.log("Verifica 'Razza' - atteso: " + valoriDaVerificare.Razza)
          ConfigurazioneAmbito.verificaDropDown('di razza', 1, valoriDaVerificare.Razza)
        }
        else {
          cy.log("Verifica 'Razza' - atteso: " + defaultAnimale.Razza)
          ConfigurazioneAmbito.verificaDropDown('di razza', 1, defaultAnimale.Razza)
        }
      }
      else
        cy.log("NON verifico campo 'Razza")

      //Verifica default "Data di nascita" (data odierna meno un anno)
      if (daVerificare.DataNascita) {
        if (valoriDaVerificare.DataNascita.length > 0) {
          cy.log("Verifica 'Data di nascita' - atteso: " + valoriDaVerificare.DataNascita)
          ConfigurazioneAmbito.verificaInput('La sua data di nascita', 4, valoriDaVerificare.DataNascita)
        }
        else {
          //valoriDefault.DataNascita = UltraBMP.dataOggiMenoUnAnno()
          valoriDefault.DataNascita = UltraBMP.dataOggiPiuAnni(-1)
          cy.log("Verifica default 'Data Nascita' - atteso: " + valoriDefault.DataNascita)
          ConfigurazioneAmbito.verificaDropDown('La sua data di nascita', 4, valoriDefault.DataNascita)
        }
      }
      else
        cy.log("NON verifico campo 'DataNascita")

      //Verifica default "Residenza"
      if (daVerificare.Residenza) {
        if (valoriDaVerificare.Residenza.length > 0) {
          cy.log("Verifica 'Residenza' - atteso: " + valoriDaVerificare.Residenza)
          ConfigurazioneAmbito.verificaDropDown('Il proprietario ha la residenza', 1, valoriDaVerificare.Residenza)
        }
        else {
          cy.log("Verifica default 'Residenza' - atteso: " + defaultAnimale.Residenza)
          ConfigurazioneAmbito.verificaDropDown('Il proprietario ha la residenza', 1, defaultAnimale.Residenza)
        }
      }
      else
        cy.log("NON verifico campo 'Residenza")

      //Verifica default "Cap"
      if (daVerificare.Cap) {
        if (valoriDaVerificare.Cap.length > 0) {
          cy.log("Verifica 'Cap residenza' - atteso: " + valoriDaVerificare.Cap)
          ConfigurazioneAmbito.verificaInput('Il proprietario ha la residenza', 3, valoriDaVerificare.Cap)
        }
        else {
          cy.log("Verifica default 'Cap' - atteso: " + defaultAnimale.Cap)
          DatiQuConfigurazioneAmbitootazione.verificaDropDown('Il proprietario ha la residenza', 3, defaultAnimale.Cap)
        }
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
  static ModificaValoriCasa(daModificare, modificheCasa) {
    ultraIFrame().within(() => {
      cy.log("MODIFICHE VALORI QUOTAZIONE - CASA")

      // *** RIGA ASSICURATO ***

      //Modifica "Assicurato"
      if (daModificare.Assicurato) {
        cy.log("Modifica 'Assicurato - da inserire': " + modificheCasa.Assicurato)
        ConfigurazioneAmbito.modificaDropDown('assicurato ??', 1, modificheCasa.Assicurato)
      }

      //Modifica "Nome abitazione"
      if (daModificare.Nome) {
        cy.log("Modifica 'Nome abitazione - da inserire': " + modificheCasa.Nome)
        ConfigurazioneAmbito.modificaInput('assicurato ??', 3, modificheCasa.Nome)

        cy.get('div[id="warning-switch-solution"]')
          .find('span').contains('Ok').should('be.visible').click()
        cy.wait(1000);

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000);

      }

      //Modifica "Cap abitazione"
      if (daModificare.Cap) {
        cy.log("Modifica 'Cap - da inserire': " + modificheCasa.Cap)
        cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
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
        cy.wait(1000);

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000);
      }

      // *** RIGA ABITAZIONE ***

      //Modifica "Uso abitazione"
      if (daModificare.Uso) {
        cy.log("Modifica 'Uso - da inserire': " + modificheCasa.Uso)
        ConfigurazioneAmbito.modificaDropDown('?? la casa', 1, modificheCasa.Uso)
      }

      //Modifica "Tipo abitazione"
      if (daModificare.Tipo) {
        cy.log("Modifica 'Tipo - da inserire': " + modificheCasa.Tipo)
        ConfigurazioneAmbito.modificaDropDown('?? la casa', 4, modificheCasa.Tipo)
      }

      //Modifica "Metri Quadri abitazione"
      if (daModificare.Mq) {
        cy.log("Modifica 'Metri quadri abitazione - da inserire': " + modificheCasa.Mq)
        ConfigurazioneAmbito.modificaInput('?? la casa', 6, modificheCasa.Mq)
      }

      //Modifica "Piano abitazione"
      if (daModificare.Piano) {
        cy.log("Modifica 'Piano - da inserire': " + modificheCasa.Piano)
        ConfigurazioneAmbito.modificaDropDown('?? la casa', 9, modificheCasa.Piano)
      }

      // *** RIGA VALORE RICOSTRUZIONE ***

      //Modifica "Valore abitazione"
      if (daModificare.Valore) {
        cy.log("Modifica 'Valore abitazione - da inserire': " + modificheCasa.Valore)
        ConfigurazioneAmbito.modificaInput('Il valore di ricostruzione', 1, modificheCasa.Valore)
      }

      // *** RIGA CARATTERISTICHE COSTRUTTIVE ***

      //Modifica "Classe abitazione"
      if (daModificare.Classe) {
        cy.log("Modifica 'Classe - da inserire': " + modificheCasa.Classe)
        ConfigurazioneAmbito.modificaDropDown('Le caratteristiche costruttive', 1, modificheCasa.Classe)
      }

      // *** RIGA MEZZI DI PROTEZIONE ***

      //Modifica "Classe protezione"
      if (daModificare.ClasseProtezione) {
        cy.log("Modifica 'Classe Protezione - da inserire': " + modificheCasa.ClasseProtezione)
        ConfigurazioneAmbito.modificaDropDown('Ha mezzi di protezione', 1, modificheCasa.ClasseProtezione)
      }

      //Modifica "Presenza allarme"
      if (daModificare.Allarme) {
        cy.log("Modifica 'Allarme - da inserire': " + modificheCasa.Allarme)
        ConfigurazioneAmbito.modificaDropDown('Ha mezzi di protezione', 3, modificheCasa.Allarme)
      }

      // *** RIGA ANNO DI COSTRUZIONE ***

      //Modifica "Anno di costruzione"
      if (daModificare.Anno) {
        cy.log("Modifica 'Anno costruzione - da inserire': " + modificheCasa.Anno)
        ConfigurazioneAmbito.modificaDropDown('Lo stabile ?? stato costruito', 1, modificheCasa.Anno)
      }

      // *** RIGA ESTENSIONE PROTEZIONE ***

      //Modifica "E"stensione protezione"
      if (daModificare.Estensione) {
        cy.log("Modifica 'Estensione protezione - da inserire': " + modificheCasa.Estensione)
        ConfigurazioneAmbito.modificaDropDown('estendere la protezione', 0, modificheCasa.Estensione)
      }

      // *** RIGA ASSICURATO ***

      //Modifica "Residenza assicurato"
      if (daModificare.ResidenzaAss) {
        cy.log("Modifica 'Residenza assicurato - da inserire': " + modificheCasa.ResidenzaAss)
        ConfigurazioneAmbito.modificaDropDown('assicurato ha la residenza', 1, modificheCasa.ResidenzaAss)
      }

      //Modifica "Cap assicurato"
      if (daModificare.CapAss) {
        cy.log("Modifica 'Cap assicurato - da inserire': " + modificheCasa.CapAss)
        cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
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
        cy.wait(1000);

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000);
      }

    })

  }
  //#endregion

  //#region Modifica Valori Animale Domestico 
  /**
    * Modifica valori Animale Domestico
    * @param {JSON} modificheAnimale - Valori da modificare
    */
  static ModificaValoriAnimaleDomestico(daModificare, modificheAnimale) {
    ultraIFrame().within(() => {

      cy.log("MODIFICHE VALORI QUOTAZIONE - ANIMALE DOMESTICO")
      cy.log('input - DaModificare Nome: ' + daModificare.Nome)
      cy.log('input - DaModificare Tipo: ' + daModificare.Tipo)
      cy.log('input - DaModificare Sesso: ' + daModificare.Sesso)

      //Modifica "Nome animale"
      if (daModificare.Nome) {
        cy.log("Modifica 'Nome animale' - da inserire: " + modificheAnimale.Nome)
        ConfigurazioneAmbito.modificaInput('?? un', 1, modificheAnimale.Nome)

        //animale = modificheAnimale.Nome
      }

      //Modifica "Tipo"
      if (daModificare.Tipo) {
        cy.log("Modifica 'Tipo' - da inserire: " + modificheAnimale.Tipo)
        ConfigurazioneAmbito.modificaDropDown('?? un', 3, modificheAnimale.Tipo)
      }

      //Modifica "Sesso"
      if (daModificare.Sesso) {
        cy.log("Modifica 'Sesso' - da inserire: " + modificheAnimale.Sesso)
        ConfigurazioneAmbito.modificaDropDown('?? un', 6, modificheAnimale.Sesso)
      }

      //Modifica "Razza"
      if (daModificare.Razza) {
        cy.log("Modifica 'Razza' - da inserire: " + modificheAnimale.Razza)
        ConfigurazioneAmbito.modificaDropDown('di razza', 1, modificheAnimale.Razza)
      }

      //Modifica "Data di nascita"
      if (daModificare.DataNascita) {
        cy.log("Modifica 'Data di nascita' - da inserire: " + modificheAnimale.DataNascita)
        ConfigurazioneAmbito.modificaInput('La sua data di nascita', 4, modificheAnimale.DataNascita)
      }

      //Modifica "Residenza"
      if (daModificare.Residenza) {
        cy.log("Modifica'Residenza' - da inserire: " + modificheAnimale.Residenza)
        ConfigurazioneAmbito.modificaDropDown('Il proprietario ha la residenza', 1, modificheAnimale.Residenza)
      }

      //Modifica "Cap"
      if (daModificare.Cap) {
        cy.log("Modifica 'Cap residenza' - da inserire: " + modificheAnimale.Cap)
        cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
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
        cy.wait(1000);

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(1000);

      }


    })

  }
  //#endregion

  //#region Modifica Valori Configurazione Ambito 
  /**
    * Modifica valori Configurazione Ambito
    * @param {JSON} daModificare - Flag campi da modificare
    * * @param {JSON} modificheAmbito - Valori da modificare
    */
  static ModificaConfigurazioneAmbito(daModificare, modificheAmbito) {
    ultraIFrame().within(() => {

      cy.log("MODIFICHE VALORI CONFIGURAZIONE AMBITO")

      //Modifica "Responsabilit?? Civile della casa "
      if (daModificare.RC_Casa) {
        cy.log("Modifica 'Responsabilit?? civile della casa' - da inserire: " + modificheAmbito.RC_Casa)
        ConfigurazioneAmbito.modificaDropDownConf('Responsabilit?? civile della casa', 1, modificheAmbito.RC_Casa)
      }

    })

  }
  //#endregion

  //#region Dati Quotazione WIP
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
  //#endregion Dati Quotazione

  //#region Soluzioni
  /**
   * Seleziona la soluzione indicata
   * @param {string} soluzione 
   */
  static selezionaSoluzione(soluzione) {
    ultraIFrame().within(() => {
      cy.get('#caSoluzioni').should('be.visible') //verifica che la sezione soluzioni sia visibile

      //controlla se la soluzione ?? gi?? selezionata, altrimenti la seleziona
      cy.get('[class^="ca-col-soluzione"]').contains(soluzione).then(($element) => {
        // synchronously query from body
        // to find which element was created
        if ($element.parents('[class="ca-col-soluzione selected"]').is(':visible')) {
          cy.log('Soluzione' + soluzione + ' gi?? selezionata')
        }
        else {
          $element.trigger('click')
          cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
          cy.get('[class^="ca-col-soluzione selected"]').contains(soluzione)
            .should('be.visible') //verifica che la soluzione sia stata selezionata
        }
      })
    })
  }
  //#endregion Soluzioni

  //#region Modifica Somma Assicurata 
  /**
    * Modifica Somma Assicurata della soluzione selezionata
    * @param {string} copertura - copertura di cui si vuole modificare la somma assicurata
    * @param {string} importo - il valore che si vuole impostare
    * @param {boolean} tutte - flag che indica se la modifica dev'essere applicata a tutte le soluzioni
    * @param {boolean} importoLibero - flag importo libero (true) o da lista predefinita importi
    */
   static modificaSommaAssicurata(copertura, importo, tutte, importoLibero = false) {
    ultraIFrame().within(() => {
      var strSiNo = "No"
      if (tutte)
        strSiNo = "Si"


      cy.log("MODIFICHE VALORI SOMMA ASSICURATA")
      if (importoLibero)
      {
        cy.get('div[class="ca-col-soluzione selected"]').should('exist')
          .find('span').contains(copertura)
          .parents('div[class="garanzia-name"]')
          .parent('div').should('have.length', 1)
          .find('div[class="col-control col-valuta ng-star-inserted"]')
          .find('input').should('have.length', 1)
          .click().wait(500)
          .clear().wait(500)
          .type(importo).wait(2000)
          .type('{enter}')  

        cy.get('div[id="warning-switch-solution"]').should('exist')
          .find('div[class="bottoni-modale ng-star-inserted"]').should('exist')
          .find('button').contains(strSiNo).should('be.visible').click()
      }
      else       // dropdown
      {
        cy.get('div[class="ca-col-soluzione selected"]').should('exist')
        .find('span').contains(copertura)
        .parents('div[class="garanzia-name"]')
        .parent('div').should('have.length', 1)
        .find('div[class="col-control col-dropdown ng-star-inserted"]')
        .find('nx-dropdown').should('have.length', 1).click()
        
        cy.get('.nx-dropdown__panel-body').should('be.visible')
          .find('span').contains(importo).click()
      }

      cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
      cy.wait(1000);

    })

  }
  //#endregion


}



export default ConfigurazioneAmbito