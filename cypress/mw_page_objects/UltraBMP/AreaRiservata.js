/// <reference types="Cypress" />

//import { exit } from "cypress/lib/util"
//import { DefaultCMapReaderFactory } from "pdfjs-dist/types/display/api"
import Common from "../common/Common"

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class AreaRiservata {

    //#region Applica Sconto da Area Riservata
    /**
      * Applica sconto da Area Riservata
      */
     static ApplicaSconto() {    
        //cy.getIFrame()
        //cy.get('@iframe').within(() => {
        ultraIFrame().within(() => {
            //cy.contains('span', 'Area riservata').should('be.visible').click()
            cy.pause()
            cy.get('div[class="nx-spinner__spin-block"]').should('not.be.visible') //attende il caricamento
            //cy.contains('span', 'Attiva').should('be.visible').click()
            //cy.pause()
            cy.contains('span', 'Torna').should('be.visible').invoke('text').then(($testo) => {
                cy.log('testo: ' + $testo)
            })
            cy.contains('span', 'Torna').should('be.visible').click()
        })    
            
    }
    //#endregion

}

export default AreaRiservata 