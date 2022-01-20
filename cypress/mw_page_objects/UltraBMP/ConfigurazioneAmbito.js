/// <reference types="Cypress" />

//import { exit } from "cypress/lib/util"
//import { DefaultCMapReaderFactory } from "pdfjs-dist/types/display/api"
import Common from "../common/Common"
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"
import { defaultCasa } from '../../fixtures//Ultra/BMP_Comune.json'
import { defaultAnimale } from '../../fixtures//Ultra/BMP_Comune.json'

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class DatiQuotazione {
    
  //#region ClickButton
    /**
      * ClickButton 
      * @param {string} azione - testo del button 
      */
    static ClickButton(azione) {
      //cy.getIFrame()
      //cy.get('@iframe').within(() => {
          //cy.pause()
          //cy.get('span').contains(strButton).should('be.visible').click()
      ultraIFrame().within(() => {
        cy.contains('span', azione).scrollIntoView().should('be.visible').click() 
        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(2000)   
      })

    }
    //#endregion

    static verificaSoluzioneSelezionata(soluzioneSel) {
      ultraIFrame().within(() => {
        cy.get('div[class="ca-col-soluzione selected"]').should('exist')
          .contains(soluzioneSel).should('exist')
          //.contains('h3', soluzioneSel).should('exist')
      })

    }

    static aggiungiGaranzia(garanziaAgg) {
      ultraIFrame().within(() => {
        cy.contains('span', garanziaAgg).should('exist')
          .parent('div')
          .parent('div')
          .find('button').should('be.enabled').click()
          //.contains('Aggiungi').should('be.enabled').click()

        cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        cy.wait(2000)   

      })

    }

    static leggiPremio(garanzia) {
      //let pr = 0
      ultraIFrame().within(() => {
        cy.pause()
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
        else
        {

        }
      })

    }

    static leggiPremioGaranziaAggiuntiva(garanziaAgg) {
      //let pr = 0
      ultraIFrame().within(() => {
        cy.pause()
        cy.contains('span', garanziaAgg).should('exist')
          .parent('div')
          .parent('div')
          .find('div[class="nx-grid__row"]').should('have.length.gt', 0)
          .eq(0).find('span').should('be.visible').invoke('text').then(val => {
            cy.wrap(val).as('premioGarAgg')
          })
      })
  
    }

    static verificaDropDown(testoRiga, ind, testoDaVerificare) {
      //cy.contains('h2', oggetto).should('exist')
      //  .parent('div').should('exist')
      cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
        .find('form').should('exist')
        .contains(testoRiga)
        .parent().should('have.class', 'ca-question ng-star-inserted')
        .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
        .children('div').should('have.length.gt', 0)
        .eq(ind).should('have.text' , testoDaVerificare)
    }

    static verificaInput(testoRiga, ind, testoDaVerificare) {
      //cy.contains('h2', oggetto).should('exist')
      //  .parent('div').should('exist')
      cy.get('div[id="accordionDatiQuotazioneBody"]').should('exist')
        .find('form').should('exist')
        .contains(testoRiga)
        .parent().should('have.class', 'ca-question ng-star-inserted')
        .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
        .children('div').should('have.length.gt', 0)
        .eq(ind).find('input').should('have.value' , testoDaVerificare)
    }

    static modificaDropDown(testoRiga, ind, testoDaInserire) {
      //cy.contains('h2', oggetto).should('exist')
      //  .parent('div').should('exist')
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
      //cy.contains('h2', oggetto).should('exist')
      //  .parent('div').should('exist')
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
      cy.wait(1000)

    }
    

    //#region Verifica default Casa
    /**
      * Verifica valori di default Casa 
      */
    static VerificaDefaultCasa(daVerificare, valoriDaVerificare) {

      ultraIFrame().within(() => {
      
      // *** RIGA ASSICURATO ***

        //Verifica default "Assicurato"
        if (daVerificare.Assicurato)
        {
          if (valoriDaVerificare.Assicurato.length > 0)
          {
            cy.log("Verifica 'Assicurato' - atteso: " + valoriDaVerificare.Assicurato)
            DatiQuotazione.verificaDropDown('assicurato è', 1, valoriDaVerificare.Assicurato)
          }
          else
          {
            cy.log("Verifica default 'Assicurato' - atteso: " + defaultCasa.Assicurato)
            DatiQuotazione.verificaDropDown('assicurato è', 1, defaultCasa.Assicurato)
          }
        }
        else
          cy.log("NON verifico campo 'Assicurato")

        //Verifica default "Nome abitazione"
        if (daVerificare.Nome)
        {
          if (valoriDaVerificare.Nome.length > 0)
          {
            cy.log("Verifica 'Nome abitazione' - atteso: " + valoriDaVerificare.Nome)
            DatiQuotazione.verificaInput('assicurato è', 3, valoriDaVerificare.Nome)
          }
          else
          {
            cy.log("Verifica default 'Nome abitazione' - atteso: " + defaultCasa.Nome)
            DatiQuotazione.verificaDropDown('assicurato è', 3, defaultCasa.Nome)
          }
        }
        else
          cy.log("NON verifico campo 'Nome abitazione")
      
        //Verifica default "Cap abitazione"
        if (daVerificare.Cap)
        {
          if (valoriDaVerificare.Cap.length > 0)
          {
            cy.log("Verifica 'Cap' - atteso: " + valoriDaVerificare.Cap)
            DatiQuotazione.verificaInput('assicurato è', 5, valoriDaVerificare.Cap)
          }
          else
          {
            cy.log("Verifica default 'Cap' - atteso: " + defaultCasa.Cap)
            DatiQuotazione.verificaDropDown('assicurato è', 5, defaultCasa.Cap)
          }
        }
        else
          cy.log("NON verifico campo 'Cap")

      // *** RIGA ABITAZIONE ***

        //Verifica default "Uso abitazione"
        if (daVerificare.Uso)
        {
          if (valoriDaVerificare.Uso.length > 0)
          {
            cy.log("Verifica 'Uso' - atteso: " + valoriDaVerificare.Uso)
            DatiQuotazione.verificaDropDown('È la casa', 1, valoriDaVerificare.Uso)
          }
          else
          {
            cy.log("Verifica default 'Uso' - atteso: " + defaultCasa.Uso)
            DatiQuotazione.verificaDropDown('È la casa', 1, defaultCasa.Uso)
          }
        }
        else
          cy.log("NON verifico campo 'Uso") 
      
        //Verifica default "Tipo abitazione"
        if (daVerificare.Tipo)
        {
          if (valoriDaVerificare.Tipo.length > 0)
          {
            cy.log("Verifica 'Tipo' - atteso: " + valoriDaVerificare.Tipo)
            DatiQuotazione.verificaDropDown('È la casa', 4, valoriDaVerificare.Tipo)
          }
          else
          {
            cy.log("Verifica default 'Tipo' - atteso: " + defaultCasa.Tipo)
            DatiQuotazione.verificaDropDown('È la casa', 4, defaultCasa.Tipo)
          }
        }
        else
          cy.log("NON verifico campo 'Tipo")

        //Verifica default "Metri Quadri abitazione"
        if (daVerificare.Mq)
        {
          if (valoriDaVerificare.Mq.length > 0)
          {
            cy.log("Verifica 'Metri quadri abitazione' - atteso: " + valoriDaVerificare.Mq)
            DatiQuotazione.verificaInput('È la casa', 6, valoriDaVerificare.Mq)
          }
          else
          {
            cy.log("Verifica default 'Metri quadri abitazione' - atteso: " + defaultCasa.Mq)
            DatiQuotazione.verificaDropDown('È la casa', 6, defaultCasa.Mq)
          }
        }
        else
          cy.log("NON verifico campo 'Metri quadri abitazione")

        //Verifica default "Piano abitazione"
        if (daVerificare.Piano)
        {
          if (valoriDaVerificare.Piano.length > 0)
          {
            cy.log("Verifica 'Piano' - atteso': " + valoriDaVerificare.Piano)
            DatiQuotazione.verificaDropDown('È la casa', 9, valoriDaVerificare.Piano)
          }
          else
          {
            cy.log("Verifica default 'Piano' - atteso: " + defaultCasa.Piano)
            DatiQuotazione.verificaDropDown('È la casa', 9, defaultCasa.Piano)
          }
        }
        else
          cy.log("NON verifico campo 'Piano")

      // *** RIGA VALORE RICOSTRUZIONE ***

        //Verifica default "Valore abitazione"
        if (daVerificare.Valore)
        {
          if (valoriDaVerificare.Valore.length > 0)
          {
            cy.log("Verifica 'Valore abitazione' - atteso: " + valoriDaVerificare.Valore)
            DatiQuotazione.verificaInput('Il valore di ricostruzione', 1, valoriDaVerificare.Valore)
          }
          else
          {
            cy.log("Verifica default 'Valore abitazione' - atteso: " + defaultCasa.Valore)
            DatiQuotazione.verificaDropDown('Il valore di ricostruzione', 1, defaultCasa.Valore)
          }
        }
        else
          cy.log("NON verifico campo 'Valore abitazione")

      // *** RIGA CARATTERISTICHE COSTRUTTIVE ***

        //Verifica default "Classe abitazione"
        if (daVerificare.Classe)
        {
          if (valoriDaVerificare.Classe.length > 0)
          {
            cy.log("Verifica 'Classe' - atteso: " + valoriDaVerificare.Classe)
            DatiQuotazione.verificaDropDown('Le caratteristiche costruttive', 1, valoriDaVerificare.Classe)
          }
          else
          {
            cy.log("Verifica default 'Classe' - atteso: " + defaultCasa.Classe)
            DatiQuotazione.verificaDropDown('Le caratteristiche costruttive', 1, defaultCasa.Classe)
          }
        }
        else
          cy.log("NON verifico campo 'Classe")

      // *** RIGA MEZZI DI PROTEZIONE ***

        //Verifica default "Classe protezione"
        if (daVerificare.ClasseProtezione)
        {
          if (valoriDaVerificare.ClasseProtezione.length > 0)
          {
            cy.log("Verifica 'Classe Protezione' - atteso: " + valoriDaVerificare.ClasseProtezione)
            DatiQuotazione.verificaDropDown('Ha mezzi di protezione', 1, valoriDaVerificare.ClasseProtezione)
          }
          else
          {
            cy.log("Verifica default 'Classe Protezione' - atteso: " + defaultCasa.ClasseProtezione)
            DatiQuotazione.verificaDropDown('Ha mezzi di protezione', 1, defaultCasa.ClasseProtezione)
          }
        }
        else
          cy.log("NON verifico campo 'Classe Protezione")

        //Verifica default "Presenza allarme"
        if (daVerificare.Allarme)
        {
          if (valoriDaVerificare.Allarme.length > 0)
          {
            cy.log("Verifica 'Allarme' - atteso: " + valoriDaVerificare.Allarme)
            DatiQuotazione.verificaDropDown('Ha mezzi di protezione', 3, valoriDaVerificare.Allarme)
          }
          else
          {
            cy.log("Verifica default 'Allarme' - atteso: " + defaultCasa.Allarme)
            DatiQuotazione.verificaDropDown('Ha mezzi di protezione', 3, defaultCasa.Allarme)
          }
        }
        else
          cy.log("NON verifico campo 'Allarme")

      // *** RIGA ANNO DI COSTRUZIONE ***

        //Verifica default "Anno di costruzione"
        if (daVerificare.Anno)
        {
          if (valoriDaVerificare.Anno.length > 0)
          {
            cy.log("Verifica 'Anno costruzione' - atteso: " + valoriDaVerificare.Anno)
            DatiQuotazione.verificaDropDown('Lo stabile è stato costruito', 1, valoriDaVerificare.Anno)
          }
          else
          {
            cy.log("Verifica default 'Anno costruzione' - atteso: " + defaultCasa.Anno)
            DatiQuotazione.verificaDropDown('Lo stabile è stato costruito', 1, defaultCasa.Anno)
          }
        }
        else
          cy.log("NON verifico campo 'Anno costruzione")

      // *** RIGA ESTENSIONE PROTEZIONE ***

        //Verifica default "E"stensione protezione"
        if (daVerificare.Estensione)
        {
          if (valoriDaVerificare.Estensione.length > 0)
          {
            cy.log("Verifica 'Estensione protezione' - atteso: " + valoriDaVerificare.Estensione)
            DatiQuotazione.verificaDropDown('estendere la protezione', 0, valoriDaVerificare.Estensione)
          }
          else
          {
            cy.log("Verifica default 'Estensione protezione' - atteso: " + defaultCasa.Estensione)
            DatiQuotazione.verificaDropDown('estendere la protezione', 0, defaultCasa.Estensione)
          }
        }
        else
          cy.log("NON verifico campo 'Estensione protezione")

      // *** RIGA ASSICURATO ***

        //Verifica default "Residenza assicurato"
        if (daVerificare.ResidenzaAss)
        {
          if (valoriDaVerificare.ResidenzaAss.length > 0)
          {
            cy.log("Verifica 'Residenza assicurato' - atteso: " + valoriDaVerificare.ResidenzaAss)
            DatiQuotazione.verificaDropDown('assicurato ha la residenza', 1, valoriDaVerificare.ResidenzaAss)
          }
          else
          {
            cy.log("Verifica default 'Residenza assicurato' - atteso: " + defaultCasa.ResidenzaAss)
            DatiQuotazione.verificaDropDown('assicurato ha la residenza', 1, defaultCasa.ResidenzaAss)
          }
        }
        else
          cy.log("NON verifico campo 'Residenza assicurato")

        //Verifica default "Cap assicurato"
        if (daVerificare.CapAss)
        {
          if (valoriDaVerificare.CapAss.length > 0)
          {
            cy.log("Verifica 'Cap assicurato' - atteso: " + valoriDaVerificare.CapAss)
            DatiQuotazione.verificaInput('assicurato ha la residenza', 3, valoriDaVerificare.CapAss)
          }
          else
          {
            cy.log("Verifica default 'Cap assicurato' - atteso: " + defaultCasa.CapAss)
            DatiQuotazione.verificaDropDown('assicurato ha la residenza', 3, defaultCasa.CapAss)
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
        if (daVerificare.Nome)
        {
          if (valoriDaVerificare.Nome.length > 0)
          {
            cy.log("Verifica 'Nome animale' - atteso: " + valoriDaVerificare.Nome)
            DatiQuotazione.verificaInput('è un', 1, valoriDaVerificare.Nome)
          }
          else
          {
            cy.log("Verifica default 'Nome animale' - atteso: " + defaultAnimale.Nome)
            DatiQuotazione.verificaDropDown('è un', 1, defaultAnimale.Nome)
          }
        }
        else
          cy.log("NON verifico campo 'Nome")
          
        //Verifica default "Tipo"
        if (daVerificare.Tipo)
        {
          if (valoriDaVerificare.Tipo.length > 0)
          {
            cy.log("Verifica 'Tipo' - atteso: " + valoriDaVerificare.Tipo)
            DatiQuotazione.verificaDropDown('è un', 3, valoriDaVerificare.Tipo)
          }
          else
          {
            cy.log("Verifica default 'Tipo' - atteso: " + defaultAnimale.Tipo)
            DatiQuotazione.verificaDropDown('è un', 3, defaultAnimale.Tipo)
          }
        }
        else
          cy.log("NON verifico campo 'Tipo")

        //Verifica default "Sesso"
        if (daVerificare.Sesso)
        {
          if (valoriDaVerificare.Sesso.length > 0)
          {
            cy.log("Verifica 'Sesso' - atteso: " + valoriDaVerificare.Sesso)
            DatiQuotazione.verificaDropDown('è un', 6, valoriDaVerificare.Sesso)
          }
          else
          {
            cy.log("Verifica default 'Sesso' - atteso: " + defaultAnimale.Sesso)
            DatiQuotazione.verificaDropDown('è un', 6, defaultAnimale.Sesso)
          }
        }
        else
          cy.log("NON verifico campo 'Sesso")

        //Verifica default "Razza"
        if (daVerificare.Razza)
        {
          if (valoriDaVerificare.Razza.length > 0)
          {
            cy.log("Verifica 'Razza' - atteso: " + valoriDaVerificare.Razza)
            DatiQuotazione.verificaDropDown('di razza', 1, valoriDaVerificare.Razza)
          }
          else
          {
            cy.log("Verifica 'Razza' - atteso: " + defaultAnimale.Razza)
            DatiQuotazione.verificaDropDown('di razza', 1, defaultAnimale.Razza)
          }
        }
        else
          cy.log("NON verifico campo 'Razza")

        //Verifica default "Data di nascita" (data odierna meno un anno)
        if (daVerificare.DataNascita)
        {
          if (valoriDaVerificare.DataNascita.length > 0)
          {
            cy.log("Verifica 'Data di nascita' - atteso: " + valoriDaVerificare.DataNascita)
            DatiQuotazione.verificaInput('La sua data di nascita', 4, valoriDaVerificare.DataNascita)
          }
          else
          {
            valoriDefault.DataNascita = UltraBMP.dataOggiMenoUnAnno()
            cy.log("Verifica default 'Data Nascita' - atteso: " + valoriDefault.DataNascita)
            DatiQuotazione.verificaDropDown('La sua data di nascita', 4, valoriDefault.DataNascita)
          }
        }
        else
          cy.log("NON verifico campo 'DataNascita")

        //Verifica default "Residenza"
        if (daVerificare.Residenza)
        {
          if (valoriDaVerificare.Residenza.length > 0)
          {
            cy.log("Verifica 'Residenza' - atteso: " + valoriDaVerificare.Residenza)
            DatiQuotazione.verificaDropDown('Il proprietario ha la residenza', 1, valoriDaVerificare.Residenza)
          }
          else
          {
            cy.log("Verifica default 'Residenza' - atteso: " + defaultAnimale.Residenza)
            DatiQuotazione.verificaDropDown('Il proprietario ha la residenza', 1, defaultAnimale.Residenza)
          }
        }
        else
          cy.log("NON verifico campo 'Residenza")

        //Verifica default "Cap"
        if (daVerificare.Cap)
        {
          if (valoriDaVerificare.Cap.length > 0)
          {
            cy.log("Verifica 'Cap residenza' - atteso: " + valoriDaVerificare.Cap)
            DatiQuotazione.verificaInput('Il proprietario ha la residenza', 3, valoriDaVerificare.Cap)
          }
          else
          {
            cy.log("Verifica default 'Cap' - atteso: " + defaultAnimale.Cap)
            DatiQuotazione.verificaDropDown('Il proprietario ha la residenza', 3, defaultAnimale.Cap)
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
        if (daModificare.Assicurato)
        {
          cy.log("Modifica 'Assicurato - da inserire': " + modificheCasa.Assicurato)
          //cy.pause()
          DatiQuotazione.modificaDropDown('assicurato è', 1, modificheCasa.Assicurato)
          /*
          cy.contains('h2', casa).should('exist')
            .parent('div').should('exist')
            .find('form').should('exist')
            .contains("assicurato è")
            .parent().should('have.class', 'ca-question ng-star-inserted')
            .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
            .children('div').should('have.length.gt', 0)
            .eq(1).should('be.visible')
            .find('[class="ng-star-inserted"]').click()

          cy.get('.nx-dropdown__panel-body').should('be.visible')
            .find('span').contains(modificheCasa.Assicurato).click()
          
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
          */
        }

        //Modifica "Nome abitazione"
        if (daModificare.Nome)
        {
          cy.log("Modifica 'Nome abitazione - da inserire': " + modificheCasa.Nome)
          //cy.pause()
          DatiQuotazione.modificaInput('assicurato è', 3, modificheCasa.Nome)
          
          cy.get('div[id="warning-switch-solution"]')
            .find('span').contains('Ok').should('be.visible').click()
          cy.wait(1000)

          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(1000)


          /*
          cy.contains('h2', casa).should('exist')
            .parent('div').should('exist')
            .find('form').should('exist')
            .contains("assicurato è")
            .parent().should('have.class', 'ca-question ng-star-inserted')
            .parent().should('have.class', 'ca-questions-row ng-star-inserted')     //riga
            .children('div').should('have.length.gt', 0)
            .eq(3).should('be.visible')
            .click().wait(500)
            .clear().wait(500)
            .type(modificheCasa.Nome).wait(2000)
            //.find('[class="ng-star-inserted"]').click()

          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
          */
         //casa = modificheCasa.Nome
        }
        
        //Modifica "Cap abitazione"
        if (daModificare.Cap)
        {
          cy.log("Modifica 'Cap - da inserire': " + modificheCasa.Cap)
          //DatiQuotazione.modificaInput(casa, 'assicurato è', 5, modificheCasa.Cap)
          //cy.contains('h2', casa).should('exist')
          //  .parent('div').should('exist')
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
          cy.wait(1000)
          
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(1000)
        }
        
      // *** RIGA ABITAZIONE ***

        //Modifica "Uso abitazione"
        if (daModificare.Uso)
        {
          cy.log("Modifica 'Uso - da inserire': " + modificheCasa.Uso)
          DatiQuotazione.modificaDropDown(casa, 'È la casa', 1, modificheCasa.Uso)
        }
        
        //cy.pause()


        //Modifica "Tipo abitazione"
        if (daModificare.Tipo)
        {
          cy.log("Modifica 'Tipo - da inserire': " + modificheCasa.Tipo)
          DatiQuotazione.modificaDropDown(casa, 'È la casa', 4, modificheCasa.Tipo)
        }
        
        //Modifica "Metri Quadri abitazione"
        if (daModificare.Mq)
        {
          cy.log("Modifica 'Metri quadri abitazione - da inserire': " + modificheCasa.Mq)
          DatiQuotazione.modificaInput(casa, 'È la casa', 6, modificheCasa.Mq)
        }
        
        //Modifica "Piano abitazione"
        if (daModificare.Piano)
        {
          cy.log("Modifica 'Piano - da inserire': " + modificheCasa.Piano)
          DatiQuotazione.modificaDropDown(casa, 'È la casa', 9, modificheCasa.Piano)
        }
        
      // *** RIGA VALORE RICOSTRUZIONE ***

        //Modifica "Valore abitazione"
        if (daModificare.Valore)
        {
          cy.log("Modifica 'Valore abitazione - da inserire': " + modificheCasa.Valore)
          DatiQuotazione.modificaInput(casa, 'Il valore di ricostruzione', 1, modificheCasa.Valore)
        }
        
      // *** RIGA CARATTERISTICHE COSTRUTTIVE ***

        //Modifica "Classe abitazione"
        if (daModificare.Classe)
        {
          cy.log("Modifica 'Classe - da inserire': " + modificheCasa.Classe)
          DatiQuotazione.modificaDropDown(casa, 'Le caratteristiche costruttive', 1, modificheCasa.Classe)
        }
        
      // *** RIGA MEZZI DI PROTEZIONE ***

        //Modifica "Classe protezione"
        if (daModificare.ClasseProtezione)
        {
          cy.log("Modifica 'Classe Protezione - da inserire': " + modificheCasa.ClasseProtezione)
          DatiQuotazione.modificaDropDown(casa, 'Ha mezzi di protezione', 1, modificheCasa.ClasseProtezione)
        }
        
        //Modifica "Presenza allarme"
        if (daModificare.Allarme)
        {
          cy.log("Modifica 'Allarme - da inserire': " + modificheCasa.Allarme)
          DatiQuotazione.modificaDropDown(casa, 'Ha mezzi di protezione', 3, modificheCasa.Allarme)
        }
        
      // *** RIGA ANNO DI COSTRUZIONE ***

        //Modifica "Anno di costruzione"
        if (daModificare.Anno)
        {
          cy.log("Modifica 'Anno costruzione - da inserire': " + modificheCasa.Anno)
          DatiQuotazione.modificaDropDown(casa, 'Lo stabile è stato costruito', 1, modificheCasa.Anno)
        }
        
      // *** RIGA ESTENSIONE PROTEZIONE ***

        //Modifica "E"stensione protezione"
        if (daModificare.Estensione)
        {
          cy.log("Modifica 'Estensione protezione - da inserire': " + modificheCasa.Estensione)
          DatiQuotazione.modificaDropDown(casa, 'estendere la protezione', 0, modificheCasa.Estensione)
        }
        
      // *** RIGA ASSICURATO ***

        //Modifica "Residenza assicurato"
        if (daModificare.ResidenzaAss)
        {
          cy.log("Modifica 'Residenza assicurato - da inserire': " + modificheCasa.ResidenzaAss)
          DatiQuotazione.modificaDropDown(casa, 'assicurato ha la residenza', 1, modificheCasa.ResidenzaAss)
        }
        
        //Modifica "Cap assicurato"
        if (daModificare.CapAss)
        {
          cy.log("Modifica 'Cap assicurato - da inserire': " + modificheCasa.CapAss)
          //DatiQuotazione.modificaInput(casa, 'assicurato ha la residenza', 3, modificheCasa.CapAss)
          //cy.contains('h2', casa).should('exist')
          //  .parent('div').should('exist')
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
          cy.wait(1000)
          
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(1000)
        }
        
        cy.pause()
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

        //Modifica "Nome animale"
        if (daModificare.Nome)
        {
          cy.log("Modifica 'Nome animale' - da inserire: " + modificheAnimale.Nome)
          DatiQuotazione.modificaInput('è un', 1, modificheAnimale.Nome)

          animale = modificheAnimale.Nome
        }
          
        //Modifica "Tipo"
        if (daModificare.Tipo)
        {
          cy.log("Modifica 'Tipo' - da inserire: " + modificheAnimale.Tipo)
          DatiQuotazione.modificaDropDown('è un', 3, modificheAnimale.Tipo)
        }

        //Modifica "Sesso"
        if (daModificare.Sesso)
        {
          cy.log("Modifica 'Sesso' - da inserire: " + modificheAnimale.Sesso)
          DatiQuotazione.modificaDropDown('è un', 6, modificheAnimale.Sesso)
        }

        //Modifica "Razza"
        if (daModificare.Razza)
        {
          cy.log("Modifica 'Razza' - da inserire: " + modificheAnimale.Razza)
          DatiQuotazione.modificaDropDown('di razza', 1, modificheAnimale.Razza)
        }

        //Modifica "Data di nascita"
        if (daModificare.DataNascita)
        {
          cy.log("Modifica 'Data di nascita' - da inserire: " + modificheAnimale.DataNascita)
          DatiQuotazione.modificaInput('La sua data di nascita', 4, modificheAnimale.DataNascita)
        }

        //Modifica "Residenza"
        if (daModificare.Residenza)
        {
          cy.log("Modifica'Residenza' - da inserire: " + modificheAnimale.Residenza)
          DatiQuotazione.modificaDropDown('Il proprietario ha la residenza', 1, modificheAnimale.Residenza)
        }

        //Modifica "Cap"
        if (daModificare.Cap)
        {
          cy.log("Modifica 'Cap residenza' - da inserire: " + modificheAnimale.Cap)
          //DatiQuotazione.modificaInput(animale, 'Il proprietario ha la residenza', 3, modificheAnimale.Cap)
          //cy.contains('h2', animale).should('exist')
          //  .parent('div').should('exist')
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
          cy.wait(1000)
          
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(1000)


          cy.pause()
        }


      })

    }
    //#endregion

}

export default DatiQuotazione