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
        cy.clearCookies().wait(2000)

        Cypress.config().baseUrl = 'http://online.pp.azi.allianzit/AutorDanni/VPS/VPS.aspx'

        // const stub = cy.stub().as('open')
        // cy.on('window:before:load', (win) => {
        //     cy.stub(win, 'open').callsFake(stub)
        // })

        cy.visit('/')
        // cy.get('@open').should('have.been.calledOnce')
        //TODO: Da criptare le credenziali
        cy.get('body').then(($body) => {
            var formLoginExist = $body.find('input[name="Ecom_User_ID"]').is(':visible')
            if (formLoginExist) {
                cy.get('table').should('be.visible')
                cy.get('[name="Ecom_User_ID"]').type('euvps02')
                cy.get('[name="Ecom_Password"]').type('pwdeuvps02')
                cy.pause()

                cy.get('[value="Conferma"]').click()

            }
        })

        // cause the window to be recreated
        cy.reload()

        // all window.open calls are correctly forwarded to our stub
        // cy.get('@open').should('have.been.calledTwice')
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
        return new Cypress.Promise((resolve) => {

            // Seleziona Modalità normale
            cy.get('#ddlModalitaEsecuzione').select('(!) Modalità normale')
            cy.wait(3000)

            // Ricerca Preventivo Applicazione
            cy.get('#linkRicerca').should('be.visible').click()
            cy.get('#selCampo1').select('Richiesta num.')
            cy.get('#selOperator1').select('Uguale')
            cy.get('#fValore1').clear().type(nPreventivoApp)
            cy.get('#btnApplicaFiltro').click().wait(2000)

            // Preventivo Selezionato
            cy.get('td:contains("' + nPreventivoApp + '")').should('be.visible').click()
            cy.get('#datiStampabili').should('be.visible')
            cy.get('#pnlInformazioniAggiuntive').should('be.visible')
            cy.get('#MasterForm').should('have.attr', 'action').then((href) => {

                let richiestaId = href.substring(
                    href.indexOf("Id=") + 3,
                    href.lastIndexOf("&LDAPEDIR=")
                );
                console.log(richiestaId)
                resolve(richiestaId)
            })

        })
    }

    static autorizza(richiestaId) {
        cy.getUserWinLogin().then(data => {
            var agency = data.agency.substring(3)
            cy.window().then(win => {
                cy.stub(win, 'open').callsFake((url, target) => {
                    let urlAutorizza = 'AutorizzaRichiesta.aspx?RichiestaId=' + richiestaId + '&CodiceAgenzia=' + agency
                    win.location.href = urlAutorizza
                }).as("popup")
            })
            cy.get('#btnAutorizza').should('be.visible').click()
            cy.get('@popup')
                .should("be.called")

            cy.get('h1')
                .should('have.text', 'Autorizza preventivo')
            cy.pause()
        })
    }
}

export default PageVPS