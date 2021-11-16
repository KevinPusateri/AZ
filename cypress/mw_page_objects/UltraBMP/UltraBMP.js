/// <reference types="Cypress" />

//import { exit } from "cypress/lib/util"
//import { DefaultCMapReaderFactory } from "pdfjs-dist/types/display/api"
import Common from "../common/Common"

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class UltraBMP {

    //#region Click
    /**
      * ClickButtonContains 
      * @param {string} strButton - testo del button 
      */
     static ClickButtonContains(strButton) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('button').contains(strButton).should('be.visible').click()
            
        })

    }
    //#endregion

    //#region Click
    /**
      * SelezionaVoceMenuPagAmbiti
      * @param {string} strmenu - testo del menù 
      */
     static SelezionaVoceMenuPagAmbiti(strMenu) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.contains('span', strMenu).should('be.visible').click()
            
        })

    }
    //#endregion

    //#region Dati quotazione
    /**
      * Modifica dati quotazione 
      */
     /*
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
    */
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


            //cy.get('button').contains('SCOPRI LA PROTEZIONE').should('be.visible').click()

        })

    }
    //#endregion

    //#region Seleziona ambiti
    /**
      * Seleziona un ambito
      * @param {string} ambito - Nome dell'ambito 
      */
    static SelezionaAmbito(ambito) {    
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.contains(ambito).should('be.visible').click()
        })    
            
    }
    //#endregion

    //#region Aggiunge un ambito già selezionato
    /**
      * Aggiunge un ambito già selezionato
      * @param {string} ambito - Nome dell'ambito 
      */
    static AggiungiAmbito(ambito) {    
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            /*
            //Righe della tabella degli ambiti selezionati prima dell'inserimento
            cy.pause()
            var listingCount = 0
            cy.get('table[class="nx-table ng-star-inserted"] > tbody > tr').then(listing => {
                listingCount = Cypress.$(listing).length
                cy.log("Numero righe tabella ambiti inseriti: " + listingCount)
            })
            //
            */

            cy.contains('div.ng-star-inserted', ambito).children('span').should('be.visible').click()

            /*
            //Righe della tabella degli ambiti selezionati dopo l'inserimento
            cy.get('table[class="nx-table ng-star-inserted"] > tbody > tr').each(($riga, indice) => {
                //cy.wrap($riga).within(() => {
                    cy.log('Dentro il ciclo')
                    //cy.log('')
                    //cy.get('td > div', {timeout: 4000}).eq(1).should('contain.text', ambito)
                    //const checkAmbito = cy.get('td > div', {timeout: 4000}).eq(1).is(':visible')
                    cy.log('Ambito cercato: ' + ambito)
                    cy.log('indice: ' + indice)

                    //$riga.find('td > div', {timeout: 4000}).eq(1).invoke('text').then(($text) => {
                    //    cy.log('tipo selezionato: ', $text)
                        //expect($text).to.equal(defaultFQ.TipoAbitazione)
                    //}) 

                    //const checkAmbito = $riga.find(':contains(ambito)').is(':visible')
                    //$riga.find('td > div').eq(1).its('textContent').then(($textContent) => {
                    //    cy.log('$textContent: ', $textContent)
                    //    //expect($text).to.equal(defaultFQ.TipoAbitazione)
                    //}) 
                    //const valore = $riga.find('td > div').eq(1).value
                    //cy.log('checkAmbito: ' + checkAmbito)
                    //cy.log('testo: ' + testo)
                //})
            })
            */

            /*
            cy.get('table[class="nx-table ng-star-inserted"] > tbody > tr').each(($el, index) => {
                cy.log('$el: ' + $el)
                cy.log('index: ' + index)
            })
            */

            /*
            cy.get('table[class="nx-table ng-star-inserted"] > tbody > tr').then(listing => {
                listingCount = Cypress.$(listing).length
                cy.log("Numero righe tabella ambiti inseriti: " + listingCount)
                Cypress.$(listing).each((index, $el, $list) => {
                    cy.log('Dentro il ciclo')
                    //const testo = $el.text()
                    //cy.log('$el.text: ' + testo)
                    cy.log('$el: '+ $el)
                    cy.log('index: '+ index)
                    cy.log('$list: '+ $list)
                    
                    $el.find('td > div', {timeout: 4000}).eq(1)
                    //cy.wrap($el).find('dir').should('be.visible')
                    //const checkSearchIsPresente = cy.wrap($el).find('dir').should('be.visible')
                    //cy.log('checkSearchIsPresente: ' + checkSearchIsPresente)
                    //cy.log('**** find dir *****')    //.contains('ambito', {timeout: 4000} ).should('be.visible')
                })
            })
            //
            */


            /*
            cy.wait(3000)
            //cy.get('table[class="nx-table ng-star-inserted"] > tbody > tr').each(($el, index, $list) => {
            //    cy.log("Index: " + index)
            //    const checkSearchIsPresente = $el.find('div:contains(ambito)').is(':visible')
            cy.get('table[class="nx-table ng-star-inserted"]').should('be.visible').then(($table) => {
                cy.wrap($table).each(($el, index, $list) => {
                    $el.find('dir').is(':visible')
                    cy.log('**** find dir *****')    //.contains('ambito', {timeout: 4000} ).should('be.visible')
                })
                //const isTrovato = $table.find('tr:contains(ambito)').is(':visible')
                //if (isTrovato)
                //    cy.log("trovato ambito " + "ambito")
                //else
                //    cy.log("NON TROVATO AMBITO " + ambito)
            })
            */
            /*
            cy.get('nx-modal').then(($modalSearch) => {
                const checkSearchIsPresente = $modalSearch.find(':contains("Nessun cliente trovato")').is(':visible')
                if (checkSearchIsPresente)
                    searchOtherMember()
            })
            */
        })    
            
    }
    //#endregion

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
            cy.contains('span', ' Attiva ').should('be.visible').click()
        })    
            
    }
    //#endregion

}

export default UltraBMP