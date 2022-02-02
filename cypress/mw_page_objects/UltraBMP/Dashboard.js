/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Dashboard {
    //#region caricamenti
    /**
     * Attende il caricamento della dashboard
     */
    static caricamentoDashboardUltra() {
        cy.intercept({
            method: 'GET',
            url: '**/ambiti-disponibili'
        }).as('ambiti')

        cy.wait('@ambiti', { requestTimeout: 60000 });
    }

    static stringaRandom(lunghezza) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < lunghezza; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
     

    /**
     * Attende il caricamento della sezione preferiti su dashboard
     */
    static caricamentoPreferitiUltra() {
        cy.intercept({
            method: 'GET',
            url: '**/preferiti/disponibili'
        }).as('Preferiti')

        cy.wait('@Preferiti', { requestTimeout: 60000 });
    }
    //#endregion caricamenti

    /**
     * Verifica che siano selezionati gli ambiti indicati
     * @param {array} ambiti 
     */
    static verificaAmbiti(ambiti) {
        ultraIFrame().within(() => {
            for (var i = 0; i < ambiti.length; i++) {
                cy.log("Verifica selezione " + ambiti[1])
                cy.get('[class="ng-star-inserted"]').contains(ambiti[i]).should('be.visible')
                cy.get('div').contains(ambiti[i]).parent().parent().find('nx-icon[class*="selected"]')//[class="counter"]                
            }
        })
    }

    /**
     * Seleziona gli ambiti indicati e verifica che vengano selezionati corretamente.
     * Il parametro 'popup' va settato a true nel caso si voglia selezionare gli ambiti
     * in una finestra popup, ad esempio aggiungendo un ambito nella sezione preferiti
     * @param {array} ambiti
     * @param {bool} popup
     */
    static selezionaAmbiti(ambiti) {
        ultraIFrame().within(() => {
            //scorre l'array degli ambiti da selezionare e clicca sulle icone
            for (var i = 0; i < ambiti.length; i++) {
                cy.log("selezione ambito " + ambiti[1])

                //seleziona ambito
                cy.get('#ambitiRischio', { timeout: 5000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
                    .should('be.visible').click()

                cy.wait(500)

                //verifica che sia selezionato
                cy.get('#ambitiRischio').find('nx-icon[class*="' + ambiti[i] + '"]')
                    .next('nx-indicator')
                    .should('be.visible')
            }
        })
    }

    /**
     * seleziona una fonte casuale
     */
    static selezionaFonteRandom() {
        ultraIFrame().within(() => {
            cy.get('span').contains('Fonte').should('be.visible')
                .next('nx-icon').dblclick() //click su pulsante Fonte
            cy.wait(500)
            cy.get('[id="fontePopover"]').should('be.visible') //verifica apertura popup fonte
                .find('[name="pen"]').click() //click sull'icona della penna
            cy.wait(2000)

            cy.get('[class*="fonti-table"]').should('exist') //verifica apertura popup per la scelta della fonte

            //seleziona una fonte random
            cy.get('[class*="fonti-table"]').find('[class*="sottofonte-semplice"]') //lista delle fonti
                .then(($fonti) => {
                    var rndFonte = Math.floor(Math.random() * $fonti.length)
                    cy.get($fonti).eq(rndFonte).first().find('nx-radio').click() //click sul radio button di una fonte random

                    cy.get($fonti).eq(rndFonte).first().invoke('text').then(($text) => {
                        cy.log('fonte selezionata: ', $text)
                    })
                });

            cy.get('button').contains('CONFERMA').should('exist').click()

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static selezionaFrazionamento(frazionamento) {
        ultraIFrame().within(() => {
            cy.get('ultra-popover-frazionamento').find('nx-icon').click() //click su pulsante frazionamento
            cy.get('[id="pricePopover"]').should('be.visible') //verifica apertura popup frazionamento

            cy.get('[id="frazionamentoDropdown"]').click() //apertura menù scelta frazionamento
            cy.get('[id="frazionamentoDropdown"]').find('[class="custom-popup ng-star-inserted"]').should('be.visible') //verifica apertura popup scelta frazionamento

            cy.get('[class="option-label"]').contains(frazionamento).click() //scelta frazionamento

            cy.get('[id="pricePopover"]').find('button').click() //conferma

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static contrattoTemporaneo(listaAmbiti, inizio, fine, attivita, societa) {
        ultraIFrame().within(() => {
            //apre il popup Contratto Temporaneo
            cy.get('span').contains('Contratto temporaneo')
                .should('be.visible')
                .click()

            cy.wait(1000)

            //verifica che il popup sia visibile e lo inquadra
            cy.get('ultra-contratto-temporaneo-modal').contains('Gestione contratto temporaneo')
                .should('be.visible')
            //cy.get('h5').focus()

            cy.get('label').contains('Temporaneità attiva').click() //Temporaneità attiva
            cy.get('label').contains('Temporaneità attiva').parent().parent()
                .invoke('attr', 'class').should('contain', 'is-checked') //verfica che la temporaneità sia stata attivata

            //aggiunge gli ambilti previsti
            for (var i = 0; i < listaAmbiti.length; i++) {
                //cy.get('app-ultra-ambiti-selection-panel').find('nx-icon[ng-reflect-name="product-'+listaAmbiti[i]+'"]').click()
                cy.get('app-ultra-ambiti-selection-panel').find('nx-icon[class*="' + listaAmbiti[i] + '"]').click()
            }

            //polizza valida da > al
            cy.log("data inizio: " + inizio)
            cy.log("data fine: " + fine)
            cy.get('ultra-contratto-temporaneo-modal').find('input[formcontrolname="dataInizio"]').type(inizio)
                .invoke('val')
                .then(text => cy.log(text))

            cy.get('ultra-contratto-temporaneo-modal').find('input[formcontrolname="dataFine"]').type(fine)
                .invoke('val')
                .then(text => cy.log(text))

            //attività
            cy.get('ultra-contratto-temporaneo-modal').find('nx-dropdown[formcontrolname="attivita"]').click()
            //cy.get('nx-dropdown-item[ng-reflect-value="'+attivita+'"]').click()
            cy.get('nx-dropdown-item').find('span').contains(attivita).click()

            //società
            cy.get('ultra-contratto-temporaneo-modal').find('input[formcontrolname="societa"]').type(societa)

            //conferma
            cy.get('ultra-contratto-temporaneo-modal')
                .find('span').contains('Conferma').parent('button')
                .should('have.attr', 'aria-disabled', 'false')
                .click()

            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        })
    }

    static modificaSoluzioneHome(ambito, soluzione) {
        ultraIFrame().within(() => {
            cy.get('tr')
                .contains(ambito)
                .parent()
                .parent()
                .find('nx-dropdown')
                .click()

            cy.wait(500)
            cy.get('nx-dropdown-item').contains(soluzione).should('be.visible').click() //seleziona Top

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static salvaQuotazione() {
        ultraIFrame().within(() => {
            const nomeQ = Dashboard.stringaRandom(10)
            cy.log('stringa generata: ' + nomeQ)
            cy.get('div[id="ambitiHeader"]')
                .contains('Salva').should('be.visible').click() 
            
            cy.get('div[id="salvaBody"]').should('exist')
              //.find('div[id="salvaBody"]').should('exist')
              .find('div[class="nx-formfield__input"]').should('be.visible')
              .eq(0).should('be.visible')
              .click().wait(500)
              .clear().wait(500)
              .type(nomeQ).wait(2000)
              //.type('{tab}')

            cy.get('div[id="salvaBody"]').should('exist')
              //.find('div[id="salvaBody"]').should('exist')
              .find('div[class="nx-formfield__input"]').should('be.visible')
              .eq(1).should('be.visible')
              .click().wait(500)
              .clear().wait(500)
              .type('Note alla quotazione di prova 1').wait(2000)
              
                  
            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
            cy.wait(1000)

            cy.pause()

            /*
            cy.get('tr')
                .contains(ambito)
                .parent()
                .parent()
                .find('nx-dropdown')
                .click()

            cy.wait(500)
            cy.get('nx-dropdown-item').contains(soluzione).should('be.visible').click() //seleziona Top

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
            */
        })
    }

    static procediHome() {
        ultraIFrame().within(() => {
            cy.get('[id="dashTable"]').should('be.visible')
            //cy.get('button[aria-disabled="false"]').find('span').contains(' PROCEDI ', { timeout: 30000 }).should('be.visible').click()
            cy.get('span').contains(' PROCEDI ', { timeout: 30000 }).should('be.visible').click()
        })
    }

    //#region preferiti
    /**
     * Seleziona il preferto passato come parametro
     * @param {string} tab >Allianz/Di agenzia/Personali
     * @param {string} nome > nome del preferito da selzionare
     */
    static SelezionaPreferiti(tab = "Allianz", nome) {
        cy.log("preferiti?")
        ultraIFrame().within(() => {
            switch (tab) {
                case "Personali":
                    cy.get('#tab_personali').click()
                    break;
                case "Di Agenzia":
                    cy.get('#tab_agenzia').click()
                    break;
                default:
                    cy.log("nessuna tab selezionata")
            }

            cy.get('[class^=description]').contains(nome).click()

            //attende il caricamento del preferito
            cy.intercept({
                method: 'GET',
                url: '**/premio'
            }).as('premio')

            cy.wait('@premio', { requestTimeout: 60000 });
        })
    }

    static AggiungiAmbitiPreferiti(ambiti) {
        ultraIFrame().within(() => {
            cy.get('span').contains("Aggiungi ambito").click()
        })
        cy.wait(500)
    }

    /**
     * Apre la sezione dettagli degli ambiti, se non è già aperta
     */
    static ApriDettagli() {
        ultraIFrame().within(() => {
            //verifica se la sezione dettagli è già aperta
            cy.get('[class^=istanza-col]').then(($body) => {
                // synchronously query from body
                cy.log("dettagli: " + $body.find('[class^=istanza-solution-controls]').is(':visible'))
                // to find which element was created
                if (!$body.find('[class^=istanza-solution-controls]').is(':visible')) {
                    cy.get('span').contains('Dettaglio').click()
                }
                else {
                    cy.log('Sezione Dettagli già aperta')
                }
            })
            /* cy.get('[class^=istanza-solution-controls]')
                .then(($dettagli) => {
                    var isOpen = $dettagli.is(':is.visible')
                    cy.log("Dettagli aperti: " + isOpen)
                    cy.wrap(isOpen).as('dettagli')
                }) */

            //se non è aperta la apre
            /* cy.get('@dettagli').then(($dettagliIsOpen) => {
                if (!$dettagliIsOpen) {
                    cy.get('span').contains('Dettaglio').click()
                }
                else {
                    cy.log('Sezione Dettagli già aperta')
                }
            }) */
        })
    }

    /**
     * Modifica il massimale per garanzia indicata dell'ambito passato come parametro
     * @param {string} ambito 
     * @param {string} garanzia 
     */
    static ModificaMassimaleDettagli(ambito, garanzia, massimale) {
        ultraIFrame().within(() => {
        })
    }
    //#endregion preferiti
}

export default Dashboard