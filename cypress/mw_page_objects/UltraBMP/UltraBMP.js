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

    static aspettaPopupConferma() {
      cy.log('***** CARICAMENTO POPUP CONFERMA *****')
      cy.intercept({
        method: 'GET',
        url: '**/getInfoRedirectHome'
    }).as('conferma')

    cy.wait('@conferma', { timeout: 60000 })
    }


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

    //#region DataOggiPiuUnAnno
    /**
     * Data odierna più un anno nel formato gg/mm/aaaa 
     */
     static dataOggiPiuUnAnno()
     { 
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear() + 1;
        
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

    //#region DataOggiPiuAnni
    * @param {number} anni - anni che si vogliono aggiungere alla data di oggi (non funziona col 29 febbraio)
    /**
     * Data odierna più anni nel formato gg/mm/aaaa 
     */
     static dataOggiPiuAnni(anni)
     { 
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear() + anni;
        
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

    //#region DataOggi
    /**
     * Data odierna nel formato gg/mm/aaaa 
     */
     static dataOggi()
     { 
        var today = new Date();
        //cy.log("DATA DI OGGI: " + today)
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
          dd = '0' + dd;
        }
        
        if (mm < 10) {
          mm = '0' + mm;
        }
        
        today = dd + '/' + mm + '/' + yyyy;
        //cy.log('Oggi: ' + today)
        return today
     }
     /**
    //#endregion

    //#region DataOggiPiuGiorni
    /**
     * Data odierna + gg nel formato gg/mm/aaaa 
     * @param {number} gg - giorni che si vogliono aggiungere alla data di oggi 
     */
     static dataOggiPiuGiorni(gg)
     { 
        var data = new Date();
        data.setDate(data.getDate() + gg)
        
        var dd = data.getDate();
        var mm = data.getMonth() + 1; //January is 0!
        var yyyy = data.getFullYear();

        if (dd < 10) {
          dd = '0' + dd;
        }
        
        if (mm < 10) {
          mm = '0' + mm;
        }
        
        data = dd + '/' + mm + '/' + yyyy;
        //cy.log('Data calcolata: ' + data)
        return data
        
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
            
        })

    }
    //#endregion

    //#region Click
    /**
      * SelezionaVoceMenuPagAmbiti
      * @param {string} strmenu - testo del menù 
      */
     static SelezionaVoceMenuPagAmbiti(strMenu) {
        ultraIFrame().within(() => {
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

            cy.contains('div.ng-star-inserted', ambito).children('span').should('be.visible').click()
        })    
            
    }
    //#endregion

    /**
     * Annullamento contratto (passare una data se differente dalla data odierna)
     * @param string dataAnnullamento (nel formato gg/mm/aaaa) 
     */
     static annullamentoContratto(dataAnnullamento = "") {
        //cy.pause()
        ultraIFrame().within(() => {
            // Verifica data di annullamento
            UltraBMP.verificaDataAnnullamento()
            //cy.pause()
            //cy.get('[id="PopupDichiarazioni"]', { timeout: 5000 })
            //    .should('be.visible')
            //    .find('button').contains('CONFERMA').click()
            
            // Click Annulla Contratto
            cy.get('#btnAnnullaContratto').should('be.visible').click()
            
            // Finestra Richiesta Documenti
            cy.get('span[class="ui-dialog-title"]').contains('Richiesta Documenti').should('exist')
            cy.get('table[id="tableDocumenti"]').should('exist')
              .find('tr').contains('Copie del contratto').should('be.visible')
              .parent()
              .parent()
            //   .children('td').should('have.length.gt', 0)
              .eq(0).click()

            //cy.get('button').contains('ok').should('be.visible').click()

            cy.get('span[class="ui-dialog-title"]').contains('Richiesta Documenti').should('exist')
            .parent('div')
            .parent('div')
            .find('button').contains('Ok').should('be.visible').click()

            // Operazione completata
            cy.get('span[class="ui-dialog-title"]').contains('Operazione completata').should('be.visible')
              .parent('div')
              .parent('div')
              .find('span').contains("ANNULLAMENTO DALL'ORIGINE IN AGENZIA").should('be.visible')
            
              cy.get('span[class="ui-dialog-title"]').contains('Operazione completata').should('be.visible')
              .parent('div')
              .parent('div')
              .find('button').contains('Ok').should('be.visible').click()

            //cy.pause()
        })

        // Pdf annullamento
        ultraIFrame().within(() => {
            cy.get('div[id="Appendicepdf"]').should('be.visible')
              .parent('div')
              .find('button').contains('Conferma').should('be.visible').click()

            //cy.get('div[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('not.be.visible')
        })

        // Home
        ultraIFrame().within(() => {
            cy.get('input[title="Home"]').should('be.visible').click()

            cy.wait(10000)
        })
        //cy.pause()

    }

    /**
     * Verifica data annullamento (se non viene passata alcuna data dev'essere la data di oggi)
     * @param string dataAnnullamento (nel formato gg/mm/aaaa) 
     */
     static verificaDataAnnullamento(dataAnnullamento = "") {
        if (dataAnnullamento == "")
            dataAnnullamento = UltraBMP.dataOggi()
        cy.log("Data Annullamento da verificare: " + dataAnnullamento)
        //ultraIFrame().within(() => {
            cy.get('input[id="txtDataAnnullamento"]').should('have.value', dataAnnullamento)
        //})
    }

    
}

export default UltraBMP