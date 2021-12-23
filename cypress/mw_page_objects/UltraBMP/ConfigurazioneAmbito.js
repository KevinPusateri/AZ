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
        cy.getIFrame()
        cy.get('@iframe').within(() => {
          //cy.pause()
          //cy.get('span').contains(strButton).should('be.visible').click()
          cy.contains('span', azione).scrollIntoView().should('be.visible').click() 
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)   
      })

    }
    //#endregion

    //#region Verifica default Casa
    /**
      * Verifica valori di default Casa 
      */
     static VerificaDefaultCasa() {
        //cy.getIFrame()
        //cy.get('@iframe').within(() => {
        ultraIFrame().within(() => {
             
            //Verifica default "Assicurato"
            cy.log("Verifica default 'Assicurato': " + defaultCasa.Assicurato)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(0)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Assicurato: ', $text)
                expect($text).to.equal(defaultCasa.Assicurato)
            }) 

            //Verifica default Nome abitazione
            cy.log("Verifica default Nome abitazione: " + defaultCasa.Nome)
            cy.get('#nx-input-2', {timeout: 4000}).should('have.value', defaultCasa.Nome)

            //Verifica default Cap abitazione
            cy.log("Verifica default Cap abitazione: " + defaultCasa.Cap)
            cy.get('#nx-input-3', {timeout: 4000}).should('have.value', defaultCasa.Cap)

            //Verifica default "Uso"
            cy.log("Verifica default 'Uso': " + defaultCasa.Uso)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(1)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Uso: ', $text)
                expect($text).to.equal(defaultCasa.Uso)
            }) 

            //Verifica default "Tipo"
            cy.log("Verifica default 'Tipo': " + defaultCasa.Tipo)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(2)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Tipo: ', $text)
                expect($text).to.equal(defaultCasa.Tipo)
            }) 
            
            //Verifica default Metri Quadri abitazione
            cy.log("Verifica default Metri Quadri abitazione: " + defaultCasa.Mq)
            cy.get('#nx-input-4', {timeout: 4000}).should('have.value', defaultCasa.Mq)

            //Verifica default "Piano"
            cy.log("Verifica default 'Piano': " + defaultCasa.Piano)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(3)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Piano: ', $text)
                expect($text).to.equal(defaultCasa.Piano)
            }) 

            //Verifica default Valore abitazione
            cy.log("Verifica default Valore abitazione: " + defaultCasa.Valore)
            cy.get('#nx-input-5', {timeout: 4000}).should('have.value', defaultCasa.Valore)

            //Verifica default "Classe"
            cy.log("Verifica default 'Classe': " + defaultCasa.Classe)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(4)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Classe: ', $text)
                expect($text).to.equal(defaultCasa.Classe)
            }) 

            //Verifica default "Anno"
            cy.log("Verifica default 'Anno': " + defaultCasa.Anno)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(5)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Anno: ', $text)
                expect($text).to.equal(defaultCasa.Anno)
            }) 

            //Verifica default "Estensione"
            cy.log("Verifica default 'Estensione': " + defaultCasa.Estensione)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(6)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Estensione: ', $text)
                expect($text).to.equal(defaultCasa.Estensione)
            }) 

            //Verifica default "Residenza Assicurato"
            cy.log("Verifica default 'Residenza Assicurato': " + defaultCasa.ResidenzaAss)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(7)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Residenza Assicurato: ', $text)
                expect($text).to.equal(defaultCasa.ResidenzaAss)
            }) 

            //Verifica default Cap Assicurato
            cy.log("Verifica default Cap Assicurato: " + defaultCasa.CapAss)
            cy.get('#nx-input-6', {timeout: 4000}).should('have.value', defaultCasa.CapAss)
            
        })

    }
    //#endregion

    //#region Verifica default Animale Domestico
    /**
      * Verifica valori di default Animale Domestico 
      */
     static VerificaDefaultAnimaleDomestico() {
        //cy.getIFrame()
        //cy.get('@iframe').within(() => {
        ultraIFrame().within(() => {

            //Verifica default Nome animale
            cy.log("Verifica default Nome animale: " + defaultAnimale.Nome)
            cy.get('#nx-input-7', {timeout: 4000}).should('have.value', defaultAnimale.Nome)
             
            //Verifica default "Tipo"
            cy.log("Verifica default 'Tipo': " + defaultAnimale.Tipo)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(1)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(0)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Tipo: ', $text)
                expect($text).to.equal(defaultAnimale.Tipo)
            }) 

            //Verifica default "Sesso"
            cy.log("Verifica default 'Sesso': " + defaultAnimale.Sesso)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(1)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(1)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Sesso: ', $text)
                expect($text).to.equal(defaultAnimale.Sesso)
            }) 

            //Verifica default "Razza"
            cy.log("Verifica default 'Razza': " + defaultAnimale.Razza)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(1)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(2)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Razza: ', $text)
                expect($text).to.equal(defaultAnimale.Razza)
            }) 

            //Verifica default Data di nascita (data odierna meno un anno)
            //cy.pause()
            defaultAnimale.DataNascita = UltraBMP.dataOggiMenoUnAnno()
            cy.log("Verifica default Data di nascita: " + defaultAnimale.DataNascita)
            cy.get('#nx-input-8', {timeout: 4000}).should('have.value', defaultAnimale.DataNascita)

            //Verifica default "Residenza"
            cy.log("Verifica default 'Residenza': " + defaultAnimale.Residenza)
            cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(1)
              .find('[class="ca-dropdown ng-star-inserted"]').eq(3)
              .find('[class="ng-star-inserted"]')
              .invoke('text').then(($text) => {
                cy.log('Residenza: ', $text)
                expect($text).to.equal(defaultAnimale.Residenza)
            }) 

            //Verifica default Cap
            cy.log("Verifica default Cap: " + defaultAnimale.Cap)
            cy.get('#nx-input-9', {timeout: 4000}).should('have.value', defaultAnimale.Cap)

                        
        })

    }
    //#endregion

    //#region Modifica Valori Casa 
    /**
      * Modifica valori Casa
      * @param {JSON} modificheCasa - Valori da modificare
      */
    static ModificaValoriCasa(modificheCasa) {
      ultraIFrame().within(() => {
        cy.log("MODIFICHE VALORI QUOTAZIONE - CASA")

        //Modifica tipo abitazione
        cy.log("Modifica tipo abitazione: " + modificheCasa.Tipo)
        if (modificheCasa.Tipo.length > 0)
        {
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
            .find('[class="ca-dropdown ng-star-inserted"]').eq(2)
            .find('[class="ng-star-inserted"]').click()
            
          cy.get('.nx-dropdown__panel-body').should('be.visible')
            .find('span').contains(modificheCasa.Tipo).click()
          cy.get('div[id="warning-switch-solution"]')
            .find('span').contains('Ok').should('be.visible').click()
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Tipo Abitazione" ' + modificheCasa.Tipo)

        /*
        //Modifica Nome abitazione
        cy.log("Modifica Nome abitazione: " + modificheCasa.Nome)
        //cy.pause()
        if (modificheCasa.Nome.length > 0)
        {
          //cy.pause()
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
            .find('[class="nx-word__inner-wrapper ng-star-inserted"]', {timeout: 4000}).eq(0)
            .click().wait(500)
            .clear().wait(500)
            .type(modificheCasa.Nome).wait(2000)
            .type({enter})
          cy.get('div[id="warning-switch-solution"]')
            .find('span').contains('Ok').should('be.visible').click()
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Nome abitazione" ' + modificheCasa.Nome)
        */

        /*
        //Modifica Cap abitazione
        cy.log("Modifica Cap abitazione: " + modificheCasa.Cap)
        if (modificheCasa.Cap.length > 0)
        {
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
            .find('[class="nx-word__inner-wrapper ng-star-inserted"]', {timeout: 4000}).eq(1)
            .click().wait(500)
            .clear().wait(500)
            .type(modificheCasa.Cap).wait(500)
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Cap abitazione" ' + modificheCasa.Cap)
        */

        
        //Modifica Metri quadri abitazione
        cy.log("Modifica Metri quadri abitazione: " + modificheCasa.Mq)
        if (modificheCasa.Mq.length > 0)
        {
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
            .find('[class="nx-word__inner-wrapper ng-star-inserted"]', {timeout: 4000}).eq(2)
          //cy.get('#nx-input-4', {timeout: 4000}).should('exist').and('be.visible')
            .click().wait(500)
            .clear().wait(500)
            .type(modificheCasa.Mq).wait(2000)
          //Click su cap per far apparire il warning
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
            .find('[class="nx-word__inner-wrapper ng-star-inserted"]', {timeout: 4000}).eq(1)
            .click().wait(500)
          //*
          cy.get('div[id="warning-switch-solution"]')
            .find('span').contains('Ok').should('be.visible').click()
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Metri Quadri abitazione" ' + modificheCasa.Mq)
        
        //Modifica Valore abitazione
        cy.log("Modifica Valore abitazione: " + modificheCasa.Valore)
        if (modificheCasa.Valore.length > 0)
        {
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
            .find('[class="nx-word__inner-wrapper ng-star-inserted"]', {timeout: 4000}).eq(3)
          //cy.get('#nx-input-4', {timeout: 4000}).should('exist').and('be.visible')
            .click().wait(500)
            .clear().wait(500)
            .type(modificheCasa.Valore).wait(2000)
          //Click su cap per far apparire il warning
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(0)
            .find('[class="nx-word__inner-wrapper ng-star-inserted"]', {timeout: 4000}).eq(1)
            .click().wait(500)
          //*
          cy.get('div[id="warning-switch-solution"]')
            .find('span').contains('Ok').should('be.visible').click()
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Valore abitazione" ' + modificheCasa.Valore)

      })

    }
    //#endregion

    //#region Modifica Valori Animale Domestico 
    /**
      * Modifica valori Animale Domestico
      * @param {JSON} modificheAnimale - Valori da modificare
      */
     static ModificaValoriAnimaleDomestico(modificheAnimale) {
      ultraIFrame().within(() => {
        
        cy.log("MODIFICHE VALORI QUOTAZIONE - ANIMALE DOMESTICO")

        /*
        //Modifica Nome animale
        cy.log("Modifica Nome animale: " + modificheAnimale.Nome)
        //cy.pause()
        if (modificheAnimale.Nome.length > 0)
        {
          //cy.pause()
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(1)
            .find('[class="nx-word__inner-wrapper ng-star-inserted"]', {timeout: 4000}).eq(0)
            .click().wait(500)
            .clear().wait(500)
            .type(modificheAnimale.Nome).wait(500)
          //cy.get('div[id="warning-switch-solution"]')
          //  .find('span').contains('Ok').should('be.visible').click()
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Nome animale" ' + modificheAnimale.Nome)
        */

        //Modifica tipo animale
        cy.log("Modifica tipo animale: " + modificheAnimale.Tipo)
        //cy.pause()
        if (modificheAnimale.Tipo.length > 0)
        {
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(1)
            .find('[class="ca-dropdown ng-star-inserted"]').eq(0)
            .find('[class="ng-star-inserted"]').click()
            
          cy.get('.nx-dropdown__panel-body').should('be.visible')
            .find('span').contains(modificheAnimale.Tipo).click()
          //cy.get('div[id="warning-switch-solution"]')
          //  .find('span').contains('Ok').should('be.visible').click()
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Tipo Animale" ' + modificheAnimale.Tipo)

        //Modifica razza animale
        cy.log("Modifica razza animale: " + modificheAnimale.Razza)
        if (modificheAnimale.Razza.length > 0)
        {
          cy.get('form[class="ng-untouched ng-pristine ng-valid ng-star-inserted"]').eq(1)
            .find('[class="ca-dropdown ng-star-inserted"]').eq(2)
            .find('[class="ng-star-inserted"]').click()
            
          cy.get('.nx-dropdown__panel-body').should('be.visible')
            .find('span').contains(modificheAnimale.Razza).click()
          //cy.get('div[id="warning-switch-solution"]')
          //  .find('span').contains('Ok').should('be.visible').click()
          cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
          cy.wait(2000)
        }
        else
            cy.log('NIENTE MODIFICHE "Razza Animale" ' + modificheAnimale.Razza)

      })

    }
    //#endregion

}

export default DatiQuotazione