/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Riepilogo {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Riepilogo
     */
    static caricamentoRiepilogo() {
        cy.intercept({
            method: 'GET',
            url: '**/riepilogo/**'
        }).as('riepilogo')

        cy.wait('@riepilogo', { requestTimeout: 60000 });
    }
    //#endregion caricamenti

    /**
     * Salva la quotazione e attende che compaia il messaggio di quotazione salvata,
     * quindi lo chiude. Se è presente il pulsante "sovascrivi" sovascrive il salvataggio
     */
    static salvaQuotazione(nome = "Quotazione Automatici") {
        ultraIFrame().within(() => {
            cy.get('span').contains('Salva').click() //click su Salva

            cy.get('#salvaForm').should('be.visible').then(($body) => {
                //se è presente il pulsante "sovascrivi" lo clicca
                if ($body.find('[class^=button-sovrascrivi]').is(':visible')) {
                    cy.get('#salvaForm').find('[class^=button-sovrascrivi]').click() //click su Sovascrivi
                }
                //altrimenti clicca su Salva
                else {
                    cy.get('#salvaForm').should('be.visible')
                        .find('input').click()
                        .type(nome) //scrive il nome della quotazione
                    cy.get('#salvaForm').find('div[class^=button-confirm]')
                        .click() //click su Salva Nuovo nel popup
                }
            })

            cy.intercept({
                method: 'GET',
                url: '**/quotazione'
            }).as('quotazione')

            cy.wait('@quotazione', { requestTimeout: 60000 }); //attende l'aggiornamento della quotazione

            cy.get('.quotazione-salvata').should('be.visible') //attende la comparsa del popup di conferma salvataggio
            cy.get('nx-message').find('.close-button').click() //chiude il popup di conferma
        })
    }

    /**
     * Verifica che sia presente un ambito con relativi oggetto, soluzione, durata e prezzo
     */
     static verificaAmbito(ambito, oggetto, soluzione, durata, prezzo) {
        ultraIFrame().within(() => {
            //cy.pause()
            cy.get('span').contains(ambito).should('be.visible')
              .parent('td')
              .parent('tr').should('have.class', 'nx-table-row ng-star-inserted')
              .children('td').should('have.length.gt', 0).then(colonne => {
                cy.wrap(colonne)
                .eq(1).should('contain.text', oggetto)
                cy.wrap(colonne)
                .eq(2).should('contain.text', soluzione)
                cy.wrap(colonne)
                .eq(3).should('contain.text', durata)
                cy.wrap(colonne)
                .eq(4).should('contain.text', prezzo)
              })
        })
    }

    static verificaFrazionamento(fraz) {
        ultraIFrame().within(() => {
            cy.get('div[class="header-price-frazionam"]').should('exist')
            .children('div[class="header-month ng-star-inserted"]').should('have.length.gt', 0)
            .should('contain.text', fraz)
        })
    }


    /**
     * Clicca sul pulsante Emetti Polizza
     */
    static EmissionePolizza() {
        ultraIFrame().within(() => {
            cy.get('[id="riepilogoBody"]').should('be.visible') //attende la comparsa del riepilogo
            cy.get('span').contains('Emetti polizza').should('be.visible').click() //emetti polizza
        })
    }

    static EmissionePreventivo() {
        ultraIFrame().within(() => {
            cy.get('[id="riepilogoBody"]').should('be.visible') //attende la comparsa del riepilogo
            cy.get('span').contains('Emetti preventivo').should('be.visible').click() //emetti polizza
        })
    }

    /**
     * Lettura del premio totale
     * @param {string}} tipo - può essere INIZIALE (default), BARRATO, SCONTATO 
     */
     static  leggiPremioTot(tipo = 'INIZIALE') {
        ultraIFrame().within(() => {
            if (tipo.toUpperCase() == 'INIZIALE')    // Premio Iniziale non scontato
            {
                cy.log('**** PREMIO INIZIALE *****')
                cy.get('div[class="header-price-euro ng-star-inserted"]').should('be.visible')
                .invoke('text').then(val => {
                    cy.wrap(val).as('premioTotRiepilogo')
                    cy.log('leggi premio tot INIZIALE: ' + val)
                })
            }
            else if (tipo.toUpperCase() == 'SCONTATO')    // Premio totale dopo l'applicazione dello sconto
            {
                cy.log('**** PREMIO SCONTATO *****')
                cy.get('div[class="header-price-euro header-price-euro-wo-discount ng-star-inserted"]').should('be.visible')
                .invoke('text').then(val => {
                    cy.wrap(val).as('premioTotRiepilogoScontato')
                    cy.log('leggi premio tot SCONTATO: ' + val)
                })
            }
            else if (tipo.toUpperCase() == 'BARRATO')    // Premio totale iniziale barrato dopo l'applicazione dello sconto
            {
                cy.log('**** PREMIO BARRATO *****')
                cy.get('div[class="header-price-euro-w-discount ng-star-inserted"]').should('be.visible')
                .invoke('text').then(val => {
                    cy.wrap(val).as('premioTotRiepilogoBarrato')
                    cy.log('leggi premio tot BARRATO: ' + val)
                }) 
            }
        })
    }
}

export default Riepilogo