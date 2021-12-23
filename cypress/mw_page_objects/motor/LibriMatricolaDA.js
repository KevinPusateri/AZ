/// <reference types="Cypress" />

import { find } from "lodash";
import NoteContratto from "../clients/NoteContratto";

//#region iFrame
const matrixFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class LibriMatricolaDA {

    /**
     * Attende il caricamento di Libri Matricola su DA
     */
    static caricamentoLibriMatricolaDA() {
        cy.intercept({
            method: 'POST',
            url: '**/Auto/GestioneLibriMatricolaDA/**'
        }).as('LibriMatricolaDA')

        cy.wait('@LibriMatricolaDA', { requestTimeout: 60000 });
    }

    /**
     * Avvia l'emissione di un nuovo preventivo madre
     * @param {string} convenzione 
     */
    static nuovoPreventivoMadre(convenzione) {
        matrixFrame().within(() => {
            cy.get('#ButtonNuovo').should('be.visible').click() //click sul pulsante 'nuovo'

            cy.get('#tblConvenzioni').should('be.visible')
                .find('td[aria-describedby="tblConvenzioni_txtDescrizione"]')
                .contains(convenzione).should('be.visible').click()

            cy.get('button').children('span').contains('Ok')
                .should('be.visible').click()
        })
    }

    /**
     * Inserisce i dati integrativi
     * [21/12/2021 si limita ad attendere il caricamento e cliccare 'avanti']
     * @param {bool} retrodatazione 
     */
    static datiIntegrativi(retrodatazione) {

        //attende caricamento Dati Integrativi
        cy.intercept({
            method: 'POST',
            url: '**/GetDatiAggiuntiviConvenzione'
        }).as('loadDatiIntegrativi')

        cy.wait('@loadDatiIntegrativi', { requestTimeout: 60000 });

        matrixFrame().within(() => {

            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()

            if (retrodatazione) {
                cy.get('label').contains('Retrodatazione della decorrenza?').should('be.visible')
                    .parent().parent()
                    .find('button').children('span').contains('Ok').click()
            }
        })
    }

    /**
     * Imposta i dati contraente
     * [21/12/2021 si limita ad attendere il caricamento della pagina e andare avanti]
     */
    static Contraente() {

        //attende caricamento Contraente
        cy.intercept({
            method: 'POST',
            url: '**/GetComboContent'
        }).as('loadContraente')

        cy.wait('@loadContraente', { requestTimeout: 60000 });


        matrixFrame().within(() => {
            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()
        })
    }

    /**
     * Attende il caricamento della pagina Coperture,
     * risponde alla presenza di altre coperture
     * [21/12/2021 non agisce sulle garanzie presenti]
     * @param {bool} altreCoperture 
     */
    static Riepilogo(altreCoperture) {

        //attende caricamento Riepilogo
        cy.intercept({
            method: 'POST',
            url: '**/GetRiepilogoGaranzie'
        }).as('loadRiepilogo')

        cy.wait('@loadRiepilogo', { requestTimeout: 60000 });

        matrixFrame().within(() => {
            var copertureValue = "1" //default altre coperture: si

            //se non sono presenti altre coperture
            //modifica il value per 'no'
            if (!altreCoperture) {
                copertureValue = "2"
            }

            //Questionario adeguatezza: altre coperture
            cy.get('input[name="adegAltreCopRB"][value="' + copertureValue + '"]')
                .should('be.visible').click()

            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()
        })
    }

    /**
     * Completa la pagina Integrazione
     * [21/12/2021 si limita ad emettere il preventivo]
     */
    static Integrazione() {
        //attende il completamento del salvataggio preventivo 608601
        cy.intercept({
            method: 'POST',
            url: '**/GetElencoAutorizzazioni'
        }).as('loadIntegrazione')

        cy.wait('@loadIntegrazione', { requestTimeout: 60000 });

        matrixFrame().within(() => {
            //click su Emetti preventivo
            cy.get('#btnSalvaNomin')
                .should('be.visible').click()
        })
    }

    static Finale() {
        //attende il completamento del salvataggio preventivo 608601
        cy.intercept({
            method: 'POST',
            url: '**/GeneraPDF'
        }).as('salvataggioContratto')

        cy.wait('@salvataggioContratto', { requestTimeout: 60000 });

        matrixFrame().within(() => {
            cy.get('[class="clNumeroPrevContr"]').invoke('text').then(val => {
                cy.wrap(val).as('contratto')
                cy.log("return " + '@contratto')
            })
        })
    }

    /**
     * Seleziona gli ambiti indicati e verifica che vengano selezionati corretamente
     * @param {array} ambiti
     */
    static selezionaAmbiti(ambiti) {
        matrixFrame().within(() => {
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
        matrixFrame().within(() => {
            cy.get('span ').contains('Fonte').should('be.visible')
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
        matrixFrame().within(() => {
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
        matrixFrame().within(() => {
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
        matrixFrame().within(() => {
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

    static procediHome() {
        matrixFrame().within(() => {
            cy.get('[id="dashTable"]').should('be.visible')
            //cy.get('button[aria-disabled="false"]').find('span').contains(' PROCEDI ', { timeout: 30000 }).should('be.visible').click()
            cy.get('span').contains(' PROCEDI ', { timeout: 30000 }).should('be.visible').click()
        })
    }
}

export default LibriMatricolaDA