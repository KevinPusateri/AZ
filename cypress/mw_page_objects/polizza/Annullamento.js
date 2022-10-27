/// <reference types="Cypress" />


class Annullamento {

    static annullaContratto() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            // Inserimento data odierna
            let options = {
                day: 'numeric',
            };
            let formattedDate = new Date().toLocaleString('it-IT', options);
            cy.get('#txtDataAnnullamento').clear()
            cy.get('button[class^="ui-datepicker-trigger"]:first').click()
            cy.get('#ui-datepicker-div').should('be.visible')
            cy.get('table[class="ui-datepicker-calendar"]').find('a').contains(formattedDate).click()

            // Inserimento "Scelta Firma Cliete" Autografa
            cy.get('#dataAnnullamento').then(($firma) => {
                const isOnlyAutografa = $firma.find('#dropTipoFirma > option')
                if (isOnlyAutografa.length > 1) {
                    cy.get('#dropTipoFirma').select('Autografa')
                }
            })

            // Click Annulla Contratto
            cy.get('#btnAnnullaContratto').click()

            // Click checkBox Atto di vendita
            cy.get('div[role="dialog"]').should('be.visible')
            cy.get('div[class^="documento-richiesto"]').click()
        })

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('div[class="ui-dialog-buttonset"]').should('be.visible').within(() => {
                cy.get('button:visible').contains('Ok').click()

            })
            cy.get('div[role="dialog"]').should('not.be.visible')


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


            cy.get('[class*="ui-datepicker-trigger"]').first().click()
            cy.get('#ui-datepicker-div').should('be.visible')
            cy.get('#ui-datepicker-div:visible').within(() => {
                cy.contains('Succ').click()
                cy.get('tbody').find('td').contains('10').click()
            })
            cy.get('[class*="ui-datepicker-trigger"]').eq(1).click()
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

    //#region annullamentiRV
    //#region caricamenti
    static caricamentoAnnullamentiRV() {
        cy.intercept({
            method: 'POST',
            url: '**/GetListaAnnullamenti'
        }).as('annullamenti')

        cy.wait('@annullamenti', { timeout: 120000 });
    }

    static caricamentoRichiestaDocumenti() {
        cy.intercept({
            method: 'POST',
            url: '**/DoOperazioniPreConsegnaDocumentazione'
        }).as('documenti')

        cy.wait('@documenti', { timeout: 120000 });
    }
    //#endregion caricamenti

    //seleziona il tipo di annullamento
    static annullamentiRV(descrizione) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get("#gridAnnullamenti").should('be.visible')
                .find('td[aria-describedby="gridAnnullamenti_descrizione"]').contains(descrizione.toUpperCase()).click()
        })
    }

    //inserisce la data di annullamento
    static dataAnnullamento(data = "today") {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            if (data == "today") {
                cy.get('#txtDataAnnullamento').next("button").should('be.visible').click() //find('[class^="ui-datepicker"]')
                cy.wait(200)
                cy.get('[class="ui-datepicker-calendar"]').should('be.visible')
                    .find('[class$="ui-datepicker-today"]').click()
            }
            else {
                cy.get("#txtDataAnnullamento").should('be.visible').type(data)
            }
        })
    }

    //click sul pulsante Annulla Contratto
    static btnAnnullaContratto() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get("#btnAnnullaContratto").should('be.visible').click().wait(200)
        })
    }

    //conferma la presenza della "documentazione comprovante"
    static documentazioneComprovante() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            //spunta su 'Documentazione comprovante...'
            cy.get(".cella-documenti-richiesti").should('be.visible')
                .find("input").click()
        })

        //cy.pause()

        cy.get('@iframe').within(() => {
            //verifica che che la checkbox sia stata segnata
            cy.get(".cella-documenti-richiesti").find("div").first()
                .should('have.class', 'documento-richiesto')

            cy.get('[class^="ui-dialog"][style^="display: block;"]')
                .find("button").contains("Ok").click()
        })
    }

    static verificaAnnullamento() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('#OperazioneCompletata').should('be.visible')
                .parents('div[style^="display: block;"]').find('button').click()
        })
    }

    static confermaAppendice() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('[aria-labelledby="ui-dialog-title-pnlPopUpPdf"]').should('be.visible')
                .find('button').click()
        })
    }

    static btnHome() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get("#btnPortale").should('be.visible').click().wait(200)
        })
    }
    //#endregion annullamentiRV
}
export default Annullamento