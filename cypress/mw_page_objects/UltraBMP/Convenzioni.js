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

    //#region ClickTab
    /**
      * Clicktab
      * @param {string} tab - Stringa del tab che si vuole selezionare
      */
     static ClickTab(tab) {    
        ultraIFrame().within(() => {
            cy.pause()
            cy.contains('div', ' tab ').should('be.visible').click()
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
            cy.contains('nx-icon.close').parent('button').should('be.visible').click()
        })    
            
    }
    //#endregion

    //#region Seleziona Convenzione
    /**
      * Seleziona Convenzione
      * @param {string} conv - Nome della convenzione che si vuole selezionare
      */
     static SelezionaConvenzione(conv) {    
        //cy.getIFrame()
        //cy.get('@iframe').within(() => {
        ultraIFrame().within(() => {
            //cy.contains('span', 'Area riservata').should('be.visible').click()
            cy.pause()
            cy.contains('span', ' Attiva ').should('be.visible').click()

            cy.contains('span', ' Torna ').should('be.visible').click()
        })    
            
    }
    //#endregion

}

export default Convenzioni
