/// <reference types="Cypress" />

//import { exit } from "cypress/lib/util"
//import { DefaultCMapReaderFactory } from "pdfjs-dist/types/display/api"
import Common from "../common/Common"

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class Convenzioni {

    //#region ClickButton
    /**
      * ClickButton 
      * @param {string} azione - testo del button 
      */
     static ClickButton(azione) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.pause()
            //cy.get('span').contains(strButton).should('be.visible').click()
            cy.contains('span', azione).scrollIntoView().should('be.visible').click()
            
        })

    }
    //#endregion

    //#region ClickTab
    /**
      * Clicktab
      * @param {string} tab - Stringa del tab che si vuole selezionare
      */
     static ClickTab(tab) {    
        ultraIFrame().within(() => {
            cy.pause()
            cy.contains('div[class="nx-margin-bottom-m ng-star-inserted"]', tab).should('be.visible').click()
        })    
            
    }
    //#endregion

    //#region Seleziona Convenzione
    /**
      * Seleziona Convenzione
      * @param {string} conv - Convenzione che si vuole selezionare
      */
     static SelezionaConvenzione(conv) {    
        ultraIFrame().within(() => { 
            /*
            cy.pause()
            cy.log("Ricerca convenzione: " + conv )
            cy.get('div[class="scrollable"] > div > div > div > span').each(($el) => {
                cy.log('$el.text: ' + $el.text())
            })
            */
            cy.pause()
            cy.contains('span', conv).parent('div').should('be.visible')
              .find('input[type="radio"]')
              .should('not.be.visible')
              .check({force: true})
              .should('be.checked')

        })    
            
    }
    //#endregion

    //#region Rimuovi Convenzione
    /**
      * Seleziona Convenzione
      */
     static RimuoviConvenzione() {    
        ultraIFrame().within(() => { 
            cy.pause()
            cy.get('span[class="rimuovi ng-star-inserted"]').should('be.visible').click()
        })    
            
    }
    //#endregion

    //#region ChiudiFinestra
    /**
      * Clicktab
      */
     static ChiudiFinestra() {    
        ultraIFrame().within(() => {
            cy.pause()
            cy.contains('nx-icon[name="close"]').parent('button').should('be.visible').click()
        })    
            
    }
    //#endregion

}

export default Convenzioni
