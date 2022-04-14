/// <reference types="Cypress" />

//#region Intercept
const riepilogo = {
    method: 'POST',
    url: '**/GetRiepilogoGaranzie'
}

const getDettaglioConvenzione = {
    method: 'POST',
    url: '**/GetDettaglioConvenzione'
}

const getDatiAggiuntiviConvenzione = {
    method: 'POST',
    url: '**/GetDatiAggiuntiviConvenzione'
}
//#endregion

/**
 * @class
 * @classdesc Classe per interagire con NGRA2013 (vecchio assuntivo motor)
 * @author Andrea 'Bobo' Oboe
 */
class NGRA2013 {

    /**
     * Funzione che verifica l'accesso a Riepilogo
     */
    static verificaAccessoRiepilogo() {
        cy.intercept(riepilogo).as('riepilogo')
        cy.wait('@riepilogo', { timeout: 60000 })
        this.avanti()
        cy.wait(2000)
        cy.screenshot('Verifica Accesso a Riepilogo NGRA2013', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static verificaAccessoDatiAmministrativi(){
        cy.intercept(getDettaglioConvenzione).as('getDettaglioConvenzione')
        cy.intercept(getDatiAggiuntiviConvenzione).as('getDatiAggiuntiviConvenzione')
        cy.wait('@getDettaglioConvenzione', { timeout: 60000 })
        cy.wait('@getDatiAggiuntiviConvenzione', { timeout: 60000 })
        
        this.sostituzioneAScadenza()
    }

    /**
     * Interazione con il pulsante Avanti
     * @param {boolean} [performeClick] default false, se true effettua click
     * @private
     */
    static avanti(performeClick = false) {
        cy.get('[value="› Avanti"]').should('exist').and('be.visible')

        if (performeClick)
            cy.get('[value="› Avanti"]').click()
    }

    /**
     * Pulsante Sostituzione a Scadenza
     */
    static sostituzioneAScadenza(){
        cy.contains('Sostituzione a Scadenza').should('exist').and('be.visible')
    }

    /**
     * Interazione con il pulsante Home
     * @param {boolean} [performeClick] default false, se true effettua click
     */
    static home(performeClick = false) {
        cy.get('[value="› Home"]:visible').should('exist').and('be.visible')

        if (performeClick)
        {
            cy.get('[value="› Home"]').click()

            //Popup Si è sicuri di vole ruscire?
            cy.get('label:contains("Si è sicuri di voler uscire?")')
                .parents('.ui-dialog').find('span[class="ui-button-text"]').contains('Si').click() //Risponde SI al popup di attenzione
        }
    }

    /**
     * Interazione con il pulsante Annulla Modifiche (in Riepilogo)
     * @param {boolean} [performeClick] default false, se true effettua click
     * @private
     */
    static annullaModifiche(performeClick = false) {
        cy.contains('Annulla Modifiche').should('exist').and('be.visible')

        if (performeClick)
            cy.get('Annulla Modifiche').click()
    }

}

export default NGRA2013