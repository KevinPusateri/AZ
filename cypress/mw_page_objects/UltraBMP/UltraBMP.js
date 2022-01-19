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
      * ClickButton 
      * @param {string} strButton - testo del button 
      */
     static ClickButton(strButton) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('button').contains(strButton).should('be.visible').click()
            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
            cy.wait(2000)
            
        })

    }
    //#endregion

    //#region DataOggiMenounAnno
    /**
     * Data odierna meno un anno nel formato gg/mm/aaaa 
     */
     static dataOggiMenoUnAnno()
     { 
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear() - 1;
        
        if (dd < 10) {
          dd = '0' + dd;
        }
        
        if (mm < 10) {
          mm = '0' + mm;
        }
        
        today = dd + '/' + mm + '/' + yyyy;
        cy.log('Oggi: ' + today)
        return today
     }
     /**
    //#endregion

    //#region ClickMatita
    /**
      * ClickButton 
      * @param {string} ambito - ambito di cui si vuole selezionare la matita 
      * @param {string} oggetto - oggetto assicurato che si vuole selezionare
      */
     static ClickMatita(ambito) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('tr')
                .contains(ambito)
                .parent()
                .parent()
                .find('[name="pen"]')
                .click()
            //attende il caricamento della pagina Configurazione Contenuto
            cy.get('[id="caSoluzioni"]', { timeout: 30000 })
                .should('be.visible')
                .wait(1000)

            //cy.log('ambito: ' + ambito)
            //cy.log('oggetto: ' + oggetto)
            //cy.pause()
            //cy.get('tr').contains(ambito)
            
            //.should('contain', oggetto)
            //    .parent().parent()
            //    .find('nx-icon[name="pen"]').click()

            //cy.get('#caGaranzie').should('be.visible')
            
        })

    }
    //#endregion

    //#region Click
    /**
      * SelezionaVoceMenuPagAmbiti
      * @param {string} strmenu - testo del menù 
      */
     static SelezionaVoceMenuPagAmbiti(strMenu) {
        //cy.log('strMenu: '+ strMenu.ToString())
        //cy.getIFrame()
        //cy.get('@iframe').within(() => {
        ultraIFrame().within(() => {
            //if (strMenu.ToString().contains("Dati quotazione"))
                //cy.contains('div', strMenu).should('be.visible').click()
            //else
            //cy.pause()
            cy.get('div[id="ambitiHeader"]')
                .contains(strMenu).should('be.visible').click() 
            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
            cy.wait(2000)
        })

    }
    //#endregion

    static modificaSoluzioneHome(ambito, soluzione) {
        ultraIFrame().within(() => {
            cy.get('table[class="nx-table ng-star-inserted"]')
              .contains('div', ambito)
              .should('be.visible')
              .parent('td')
              .parent('tr')
              .find('nx-dropdown nx-icon')
              .should('be.visible')
              .click()
            /*  
            cy.get('tr')
                .contains(ambito)
                .parent()
                .parent()
                .find('nx-dropdown')
                .click()
            */

            cy.wait(500)
            cy.get('nx-dropdown-item').contains(soluzione).should('be.visible').click() 

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

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
            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
            cy.wait(4000)
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

    
}

export default UltraBMP