/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class StartPage {

    //#region caricamenti
    /**
     * Attende il caricamento della pagina
     */
    static caricamentoPagina() {
        cy.log('***** CARICAMENTO PAGINA INIZIALE ULTRA *****')
        cy.intercept({
            method: 'GET',
            url: '**/otiBuilding'
        }).as('pgIniziale')

        cy.wait('@pgIniziale', { requestTimeout: 60000 })
    }

    static caricamentoUltraImpresa() {
        cy.log('***** CARICAMENTO PAGINA INIZIALE ULTRA *****')
        cy.intercept({
            method: 'GET',
            url: '**/otiBusiness'
        }).as('pgIniziale')

        cy.wait('@pgIniziale', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    static startScopriProtezione() {
        ultraIFrame().within(() => {
            cy.get('button').contains('SCOPRI LA PROTEZIONE').should('be.visible').click() //click su Scopri la Protezione
            //cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible') //attende il caricamento
        })
    }

    /**
     * Seleziona una voce dal menù header
     * @param {fixture} voce [calcola, modifica, recupero]
     */
    static menuHeader(voce) {
        ultraIFrame().within(() => {
            cy.get('nx-header-navigation').find('a')
                .contains(voce).click()
        })
    }

    /**
     * ricerca la professione e seleziona il primo risultato
     * @param {string} professione
     */
    static startModificaProfessione(professione) {
        ultraIFrame().within(() => {
            cy.get('span').contains('professione').should('be.visible')
                .next('a').click() //apre il popup per la ricerca professioni

            cy.get('#professioni-modal').find('input')
                .type(professione) //ricerca professione

            cy.wait(1000);

            cy.get('#list-one').find('span').first().click() //seleziona il primo risultato
            cy.get('#list-one').find('span').first().prev('nx-icon[name="check"]')
                .should('be.visible') //verifica che compaia il segno di spunta

            cy.get('button[aria-disabled="false"]')
                .children('span').contains('CONFERMA').click() //conferma il popup

            cy.get('span').contains('professione').should('be.visible')
                .next('a').contains(professione).should('be.visible') //verifica che la professione sia stata modificata nella pagina start
        })
    }

    /**
     * ricerca l'attività svolta dall'impresa e seleziona il primo risultato
     * @param {string} attivita
     */
    static startAttivitaImpresa(attivita) {
        ultraIFrame().within(() => {
            cy.get('span').contains('attività svolta').should('be.visible')
                .next('a').click() //apre il popup per la ricerca professioni

            cy.get('ricerca-attivita-modal').find('input[type="search"]')
                .should('be.visible').type(attivita) //ricerca attività
            cy.wait(1000);

            cy.get('#list-one').find('span').first().click() //seleziona il primo risultato
            cy.wait(500);
        })

        ultraIFrame().within(() => {
            cy.get('#list-one').find('span').first().prev('nx-icon[name="check"]')
                .should('be.visible') //verifica che compaia il segno di spunta

            cy.get('button[aria-disabled="false"]')
                .children('span').contains('Conferma').click() //conferma il popup

                cy.get('span').contains('attività svolta').should('be.visible')
                .next('a').contains(attivita).should('be.visible') //verifica che la professione sia stata modificata nella pagina start
        })
    }

    //#region Verifica default FQ
    /**
      * Verifica valori di default
      * @param {JSON} defaultFQ - Valori di default 
      */
    static VerificaDefaultFQ(defaultFQ) {
        ultraIFrame().within(() => {

            //Verifica default tipo abitazione
            cy.log("Verifica default tipo abitazione: " + defaultFQ.TipoAbitazione)
            cy.get('#nx-dropdown-rendered-0 > span', { timeout: 4000 }).invoke('text').then(($text) => {
                cy.log('tipo selezionato: ', $text)
                expect($text).to.equal(defaultFQ.TipoAbitazione)
            })

            //Verifica default dimensione abitazione
            cy.log("Verifica default dimensione abitazione: " + defaultFQ.MqAbitazione)
            cy.get('#nx-input-0', { timeout: 4000 }).should('have.value', defaultFQ.MqAbitazione)

            //Verifica default utilizzo abitazione
            cy.log("Verifica default utilizzo abitazione: " + defaultFQ.UsoAbitazione)
            cy.get('#nx-dropdown-rendered-1 > span', { timeout: 4000 }).invoke('text').then(($text) => {
                cy.log('uso selezionato: ', $text)
                expect(($text).trim()).to.equal(defaultFQ.UsoAbitazione)
            })

            //Verifica default cap
            if (defaultFQ.CapAbitazione.length > 0) {
                cy.log("Verifica default cap abitazione: " + defaultFQ.CapAbitazione)
                cy.get('#nx-input-1', { timeout: 4000 }).should('have.value', defaultFQ.CapAbitazione)
            }

        })

    }
    //#endregion
}

export default StartPage