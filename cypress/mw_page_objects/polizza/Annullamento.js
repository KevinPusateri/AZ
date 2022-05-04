/// <reference types="Cypress" />


class Annullamento {

    static annullaContratto() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            // Inserimento data odierna
            cy.get('[class="tableCellGray"]').should('be.visible').and('contain.text', 'Data annullamento')
            let options = {
                day: 'numeric',
            };
            let formattedDate = new Date().toLocaleString('it-IT', options);
            cy.get('#txtDataAnnullamento').clear()
            cy.get('[class="ui-datepicker-trigger"]').first().click()
            cy.get('#ui-datepicker-div').should('be.visible')
            cy.get('table[class="ui-datepicker-calendar"]').find('a').contains(formattedDate).click()

            // Inserimento "Scelta Firma Cliete" Autografa
            cy.get('#dataAnnullamento').then(($firma) => {
                const isOnlyAutografa = $firma.find('#dropTipoFirma > option')
                if (isOnlyAutografa.length > 1)
                    cy.get('#dropTipoFirma').select('Autografa')
            })

            // Click Annulla Contratto
            cy.get('#btnAnnullaContratto').click()

            // Click checkBox Atto di vendita
            cy.get('#tableDocumenti').should('be.visible')
            cy.get('#tableDocumenti').find('input').check('3')
        })

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('div[aria-labelledby="ui-dialog-title-4"]').should('be.visible').within(() => {
                cy.get('button').contains('Ok').click()

            })
            cy.get('div[aria-labelledby="ui-dialog-title-4"]').should('not.be.visible')


            cy.get('div[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('be.visible').within(() => {
                cy.get('span[class="ui-button-text"]').contains('Conferma').click()
            })

            cy.get('div[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('not.be.visible')


            cy.get('div[class="messaggioAnnullamenti"]').should('be.visible')
                .and('contain.text', 'Annullamento eseguito correttamente.')

            cy.get('input[title="Home"]').should('be.visible').click()

            cy.wait(10000)

        })
    }


    /**
   * Pagina Stop&Drive 
   */
    static stopDrive() {

        //#region Fase Integrazione
        cy.getIFrame()
        cy.get('@iframe').should('be.visible').within(() => {


                cy.get('[class="ui-datepicker-trigger"]').first().click()
                cy.get('#ui-datepicker-div').should('be.visible')
                cy.get('#ui-datepicker-div:visible').within(() => {
                    cy.contains('Succ').click()
                    cy.get('tbody').find('td').contains('1').click()
                })
                cy.get('[class="ui-datepicker-trigger"]').eq(1).click()
                cy.get('#ui-datepicker-div').should('be.visible')
                cy.get('#ui-datepicker-div:visible').within(() => {
                    cy.contains('Succ').click()
                    cy.get('tbody').find('td').contains('25').click()
                })

                //Click Sospendi
                cy.get('#btnSospendiContratto').click().wait(3000)

                // Verifica Popup Sospendi 
                cy.get('div[class="inputLabel inputAvviso derogaAvviso"]').should('be.visible')
                cy.get('div[class="inputLabel inputAvviso derogaAvviso"]')
                    .find('label')
                    .should('contain.text', 'Si sta procedendo alla sospensione della copertura per il veicolo targato')
                // Click Ok Popup
                cy.get('div[class="inputLabel inputAvviso derogaAvviso"]').should('be.visible')
                cy.get('div[class="inputLabel inputAvviso derogaAvviso"]').parents('div[class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable"]').within(() => {
                    cy.get('span[class="ui-button-text"]').contains('Ok').click().wait(60000)
                })
        })
        //#endregion

        //#region Fase Consensi
        cy.getIFrame()
        cy.get('@iframe').should('be.visible').within(() => {
            //Visualizza Allegato 3-Informativa sul distributore
            cy.contains('Allegato 3-Informativa sul distributore').parents('tr').within(() => {
                cy.get('input[title="Visualizza"]:visible').click().wait(4000)
            })
            cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                cy.get('#AnteprimaPDF').should('be.visible')
                cy.contains('Conferma').should('be.visible').click()
            })

            cy.get('div[role="dialog"]').should('not.be.visible')

            //Visualizza Allegato 4-Informazioni sulla distribuzione
            cy.contains('Allegato 4-Informazioni sulla distribuzione del prodotto assicurativo non-IBIP').parents('tr').within(() => {
                cy.get('input[title="Visualizza"]:visible').click().wait(4000)
            })
            cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                cy.get('#AnteprimaPDF').should('be.visible')
                cy.contains('Conferma').click()
            })
            cy.get('div[role="dialog"]').should('not.be.visible')

            //  Visualizza Adeguatezza
            cy.get('#btnVisualizzaAdeguatezza').click().wait(4000)
            cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                cy.get('#AnteprimaPDF').should('be.visible')
                cy.contains('Conferma').click()
            })

            cy.get('div[role="dialog"]').should('not.be.visible')
            cy.get('#btnAvanti').click().wait(20000)
        })



        // cy.getIFrame()
        // cy.get('@iframe').should('be.visible').within(() => {
        //     cy.get('input[value="› Prosegui"]').should('be.visible').click()
        // })
        cy.getIFrame()
        cy.get('@iframe').should('be.visible').within(() => {
            cy.get('div[role="dialog"]').should('be.visible')

            cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('#pnlDialog').should('be.visible')
                    .and('include.text', 'permesso solamente agli indirizzi email ALLIANZ (blocco applicato solamente per gli ambienti di test fino a preprod')
                cy.get('span[class="ui-button-text"]:contains("Ok")').click().wait(4000)
            })
        })
        //#endregion
    }
}
export default Annullamento