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

    /**
     * Attende il caricamento dell'Area Riservata
     */
     static caricamentoPagina() {
        cy.log('***** CARICAMENTO PAGINA AREA RISERVATA ULTRA *****')
        cy.intercept({
            method: 'POST',
            url: '**/ultra/**'
        }).as('ambiente')

        cy.wait('@ambiente', { requestTimeout: 40000 });
    }


    //#region Applica Sconto da Area Riservata
    /**
      * Applica sconto da Area Riservata
      */
     static ApplicaSconto() {    
        //cy.getIFrame()
        //cy.get('@iframe').within(() => {
        ultraIFrame().within(() => {
            //cy.contains('span', 'Area riservata').should('be.visible').click()
            //cy.pause()
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

    /**
      * Leggi premio da Area Riservata
      * @param {string} tipo (quale premio si vuole leggere, min, max o attuale) 
      */
    static leggiPremio(tipo) {   
        ultraIFrame().within(() => {
            var PM = 0
            if (tipo.toUpperCase() == 'MIN')    // Premio minimo in autonomia
            {
                cy.get('div[class="row slider-values nx-grid__row"]').should('exist')
                .children('div').should('have.length', 2)
                .eq(1).should('be.visible').invoke('text').then(val => {
                    cy.wrap(val).as('premioMin')
                })
            }
            else if (tipo.toUpperCase() == 'MAX')    // Premio massimo = premio iniziale non scontato
            {
                cy.get('div[class="row slider-values nx-grid__row"]').should('exist')
                .children('div').should('have.length', 2)
                .eq(0).should('be.visible').invoke('text').then(val => {
                    cy.wrap(val).as('premioMax')
                })
            }
            else
            {

            }
        })        
    }

    //#region imposta sconto Sconto da Area Riservata
    /**
      * Imposta sconto da Area Riservata
      * @param {string} prMin (premio minimo applicabile)
      * @param {string} prMax (premio iniziale)
      * @param {string} sconto (percentuale del massimo sconto applicabile in autonomia) 
      */
    static impostaSconto(prMin, prMax, sconto) { 
        var premio = (prMax - Math.round(((prMax * 100 - prMin * 100) * sconto) / 10000)).toString().replace(".",",")
        cy.log('premio massimo: ' + prMax)
        cy.log('premio minimo: ' + prMin) 
        cy.log('percentuale sconto: ' + sconto) 
        cy.log('premio da impostare: ' + premio)   
        
        //var strStyle =  'width: ' + sconto + ';'    
        ultraIFrame().within(() => {
            cy.get('div[id="popover-range"]').should('exist')
              .find('input[id="nx-input-0"]').should('exist')
              .click().wait(500)
              .clear().wait(500)
              .type(premio).wait(2000)
              .type('{enter}')

            cy.get('div[id="popover-range"]').should('exist')
              .find('button').contains('Applica').should('exist').click()
              .wait(2000)
            cy.get('div[id="popover-range"]').should('exist')
              .find('button').contains('Rimuovi sconto').should('exist')
        })

    }
    //#endregion

    static clickConferma() {   
        ultraIFrame().within(() => {
            cy.get('div[id="arButtons"]').should('exist')
              .find('button').contains('CONFERMA').should('exist').click()
        })        
    }
    

}

export default AreaRiservata 