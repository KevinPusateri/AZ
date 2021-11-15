/// <reference types="Cypress" />

//import { exit } from "cypress/lib/util"
import Common from "../common/Common"

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class UltraBMP {

    //#region Dati quotazione
    /**
      * Modifica dati quotazione 
      */
    static compilaDatiQuotazione() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            
            cy.get('div[class="nx-dropdown__container"]').first().then(($div)=>{
                //cy.pause()
                cy.get('span').contains('appartamento').click()
                cy.get('span').contains('villa indipendente').click()
                //cy.get('input[id="nx-input-0"]').should('exist').type('250')
            })

            cy.get('button').contains('SCOPRI LA PROTEZIONE').should('be.visible').click()
            //cy.get('div[class="nx-dropdown__container"]').first().find('span').contains('appartamento').should(be.visible)
            
        })

    }
    //#endregion

    //#region Verifica default FQ
    /**
      * Verifica valori di default
      * @param {JSON} defaultFQ - Valori di default 
      */
     static VerificaDefaultFQ(defaultFQ) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
             
            //Verifica default tipo abitazione
            cy.log("Verifica default tipo abitazione: " + defaultFQ.TipoAbitazione)
            cy.get('#nx-dropdown-rendered-0 > span', {timeout: 4000}).invoke('text').then(($text) => {
                cy.log('tipo selezionato: ', $text)
                expect($text).to.equal(defaultFQ.TipoAbitazione)
            }) 

            //Verifica default dimensione abitazione
            cy.log("Verifica default dimensione abitazione: " + defaultFQ.MqAbitazione)
            cy.get('#nx-input-0', {timeout: 4000}).should('have.value', defaultFQ.MqAbitazione)

            //Verifica default utilizzo abitazione
            cy.log("Verifica default utilizzo abitazione: " + defaultFQ.UsoAbitazione)
            cy.get('#nx-dropdown-rendered-1 > span', {timeout: 4000}).invoke('text').then(($text) => {
                cy.log('uso selezionato: ', $text)
                expect(($text).trim()).to.equal(defaultFQ.UsoAbitazione)
            }) 

            //Verifica default cap
            if (defaultFQ.CapAbitazione.length > 0)
            {
                cy.log("Verifica default cap abitazione: " + defaultFQ.CapAbitazione)
                cy.get('#nx-input-1', {timeout: 4000}).should('have.value', defaultFQ.CapAbitazione)
            }
            
        })

    }
    //#endregion

    //#region Modifica FQ
    /**
      * Modifica valori FQ
      * @param {JSON} valoriIns - Valori da inserire 
      */
     static ModificaValoriFQ(valoriIns) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
             
            //Modifica tipo abitazione
            //cy.pause()
            cy.log("Modifica tipo abitazione: " + valoriIns.TipoAbitazione)
            if (valoriIns.TipoAbitazione.length > 0)
            {
                //cy.log("Modifica tipo abitazione: " + valoriIns.TipoAbitazione)
                cy.get('#nx-dropdown-rendered-0 > span').click()
                cy.get('.nx-dropdown__panel-body').should('be.visible')
                cy.get('span').contains(valoriIns.TipoAbitazione).click()
                cy.get('#nx-dropdown-rendered-0 > span').invoke('text').then(($text) => {
                    cy.log('tipo selezionato: ', $text)
                    expect(($text).trim()).to.equal(valoriIns.TipoAbitazione)
                }) 
            }
            else
                cy.log('NIENTE MODIFICHE. NON INSERISCO ' + valoriIns.TipoAbitazione)


            //Modifica dimensione abitazione
            //cy.pause()
            cy.log("Modifica dimensione abitazione: " + valoriIns.MqAbitazione)
            if (valoriIns.MqAbitazione.length > 0)
            {
                cy.get('#nx-input-0').clear().type(valoriIns.MqAbitazione)
                cy.get('#nx-input-0', {timeout: 4000}).should('have.value', valoriIns.MqAbitazione)
            }
            else
                cy.log('NIENTE MODIFICHE. NON INSERISCO ' + valoriIns.MqAbitazione)


            //Modifica utilizzo abitazione
            //cy.pause()
            cy.log("Modifica utilizzo abitazione: " + valoriIns.UsoAbitazione)
            if (valoriIns.UsoAbitazione.length > 0)
            {
                cy.get('#nx-dropdown-rendered-1 > span').click()
                cy.get('.nx-dropdown__panel-body').should('be.visible')
                cy.get('span').contains(valoriIns.UsoAbitazione).click()
                cy.get('#nx-dropdown-rendered-1 > span').invoke('text').then(($text) => {
                    cy.log('uso selezionato: ', $text)
                    expect(($text).trim()).to.equal(valoriIns.UsoAbitazione)
                }) 
            }
            else
                cy.log('NIENTE MODIFICHE. NON INSERISCO ' + valoriIns.UsoAbitazione)


            //Modifica cap abitazione
            //cy.pause()
            cy.log("Modifica cap abitazione: " + valoriIns.CapAbitazione)
            if (valoriIns.CapAbitazione.length > 0)
            {
                cy.get('#nx-input-1').clear().type(valoriIns.CapAbitazione)
                cy.get('#nx-input-1', {timeout: 4000}).should('have.value', valoriIns.CapAbitazione)
            }
            else
                cy.log('NIENTE MODIFICHE. NON INSERISCO ' + valoriIns.CapAbitazione)


            cy.get('button').contains('SCOPRI LA PROTEZIONE').should('be.visible').click()

        })

    }
    //#endregion

    /**
      * Seleziona un ambito
      * @param {string} ambito - Nome dell'ambito 
      */
    //#region Seleziona ambiti
    static SelezionaAmbito(ambito) {    
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.contains(ambito).should('be.visible').click()
        })    
            
    }
    //#endregion

}

export default UltraBMP