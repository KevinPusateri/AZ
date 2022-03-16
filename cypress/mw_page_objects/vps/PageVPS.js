/// <reference types="Cypress" />

/**
 * @class
 * @classdesc Classe per avvio di VPS
 * @author Kevin Pusateri
 */
class PageVPS {

    /**
     * Effettua il primo visit
     */
    static launchLoginVPS() {
        cy.visit('http://online.pp.azi.allianzit/AutorDanni/VPS/VPS.aspx')
        //TODO: Da criptare le credenziali
        // cy.get('table').should('be.visible')
        // cy.get('[name="Ecom_User_ID"]').type('euvps02')
        // cy.get('[name="Ecom_Password"]').type('pwdeuvps02')
        // cy.get('[value="Conferma"]').click()
    }

    /**
     * Effettua il logout
     */
    static logout() {
        cy.get('#lblUserName').should('be.visible').click()
        cy.get('#linkLogoff').should('be.visible').click()
        cy.clearCookies();
    }

    static ricercaRichiestaNum(nPreventivoApp) {
        // Seleziona Modalità normale
        cy.get('#ddlModalitaEsecuzione').select('(!) Modalità normale')

        // Ricerca Preventivo Applicazione
        cy.get('#linkRicerca').should('be.visible').click()
        cy.get('#selCampo1').select('Richiesta num.')
        cy.get('#selOperator1').select('Uguale')
        cy.get('#fValore1').clear().type(nPreventivoApp)
        cy.pause()
        cy.get('#btnApplicaFiltro').click()

        // Preventivo Selezionato
        cy.get('td:contains("' + nPreventivoApp + '")').should('be.visible').click()
        cy.get('#datiStampabili').should('be.visible')
        cy.get('#pnlInformazioniAggiuntive').should('be.visible')
        cy.pause()
        cy.window().then(win => {
            cy.stub(win, 'open').callsFake((url, target) => {
                expect(target).to.be.undefined
                // call the original `win.open` method
                // but pass the `_self` argument
                return win.open.wrappedMethod.call(win, url, '_self')
            }).as('open')
        })
        cy.get('#btnAutorizza').should('be.visible').click()
         cy.get('@open')
    }
}

export default PageVPS