/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const ultraIFrame0 = () => {
    let iframeZero = cy.get('[id="iFrameResizer0"]')
        .its('0.contentDocument').should('exist');

    return iframeZero.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class ControlliProtocollazione {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Consensi e Privacy
     */
    static caricamentoPagina() {
        cy.log('***** CARICAMENTO PAGINA CONTROLLI E PROTOCOLLAZIONE *****')
        cy.intercept({
            method: 'GET',
            url: '**/GetRiepilogoDocumenti'
        }).as('documenti')

        cy.wait('@documenti', { timeout: 100000 })
    }

    static aspettaCaricamentoAdempimenti() {
        cy.log('***** CARICAMENTO ADEMPIMENTI PRECONTRATTUALI IN CONTROLLI E PROTOCOLLAZIONE *****')
        cy.intercept({
            method: 'GET',
            //url: '**/GetSezioneStampaContrassegno'
            url: '**/GetSezionePrecontrattuale'
        }).as('stampa')

        cy.wait('@stampa', { timeout: 100000 })
    }

    /**
     * verifica che il contratto sia stato salvato con successo
     */
    static salvataggioContratto() {
        ultraIFrame().within(() => {
            cy.get('[class="step last success"]').contains('è stato salvato con successo').should('be.visible')
            cy.log("Contratto salvato con successo")
        })
    }

    /**
     * Inserisce l'intermediario, se necessario
     */
    static inserimentoIntermediario() {
        var checkFrame0 = false
        var checkIntermediarioError = false

        ultraIFrame().then(($body) => {
            checkFrame0 = $body.find('#iFrameResizer0').is(':visible') //verifica la presenza dell'iframe0 annidato
            cy.log('checkFrame0: ' + checkFrame0)
        }).within(() => {
            cy.log('checkFrame0bis: ' + checkFrame0)
            if (checkFrame0) { //se l'iFrame0 è presente, controlla se è necessario inserire l'intermediario
                ultraIFrame0().then(($body) => {
                    checkIntermediarioError = $body.find('[class="consenso-text has-error"]').is(':visible') //verifica la necessità di inserire l'intermediario
                    cy.log('checkIntermediarioError: ' + checkIntermediarioError)
                }).within(() => {
                    if (checkIntermediarioError) { //se necessario, inserisce l'intermediario
                        cy.log("intermediario da inserire")
                        cy.get('[class="consenso-text has-error"]', { timeout: 10000 })
                            .contains('Intermediario').not('Firma Compagnia')
                            .next('div').click()

                        cy.wait(1000)

                        cy.get('[class="select2-result-label"]')
                            .contains('2060281 BUOSI FRANCESCA').click()
                    }
                    else {
                        cy.log("intermediario già inserito")
                    }
                })
            }
            else {
                cy.log("intermediario non necessario")
            }
        })
    }

    /**
     * Aggiunge la "Collaborazione orizzontale" nella sezione Intermediario
     */
    static intermediarioCollaborazioneOrizzontale() {
        var checkFrame0 = false

        ultraIFrame().then(($body) => {
            //verifica la presenza dell'iframe0 annidato
            checkFrame0 = $body.find('#iFrameResizer0').is(':visible')
        }).within(() => {
            if (checkFrame0) { //se l'iFrame0 è presente, controlla se è necessario inserire l'intermediario
                ultraIFrame0().within(() => {
                    cy.get('div').contains('Collaborazione orizzontale')
                        .next().find('span').contains('SI').click()
                })
            }
        })
    }

    /**
     * Visualizza i documenti nella sezione Riepilogo
     */
    static riepilogoDocumenti() {
        var check = true

        ultraIFrame().then(($body) => {
            check = $body.find('#iFrameResizer0').is(':visible') //verifica la presenza dell'iframe0 annidato
        }).within(() => {
            if (check) {
                ultraIFrame0().within(() => {
                    //Attende la comparsa della sezione 'Riepilogo documenti'
                    cy.get('#RiepilogoDocumentiContainer').should('be.visible')

                    cy.get('#RiepilogoDocumentiContainer')
                        .find('button').not('[disabled]')//lista dei pulsanti
                        .each(($button, index, $list) => {
                            cy.log("index" + index)
                            cy.wrap($button).click() //click su Visualizza

                            //conferma popup
                            cy.get('button').contains('Conferma').should('be.visible').click()
                        });
                })
            }
            else {
                //Attende la comparsa della sezione 'Riepilogo documenti'
                cy.get('[class="table-documenti"]').should('be.visible')

                cy.get('[class="table-documenti"]')
                    .find('button').not('[disabled]')//lista dei pulsanti
                    .each(($button, index, $list) => {
                        cy.log("index" + index)
                        cy.wrap($button).click() //click su Visualizza
                        cy.wait(1000)

                        //conferma popup
                        cy.get('button').contains('Conferma').should('be.visible').click()
                    });
            }
        })
    }

    /**
     * Clicca sul pulsante Avanti
     */
    static Avanti() {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('button').contains('Avanti').click()   //avanti
            })
        })
    }

    /**
     * Clicca sul pulsante Stampa
     * Situazione differente a seconda che il cliente abbia dato o meno il consenso all'invio mail
     */
    static stampaAdempimentiPrecontrattuali(invio_mail = true) {
        
        //cy.intercept({
        //    method: 'GET',
        //    url: '**/GetSezionePrecontrattuale'
        //}).as('precontrattuale')

        //cy.wait('@precontrattuale', { requestTimeout: 60000 })
        

        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.log('titolo tab: ', cy.title())
                cy.title().should('include', 'Allianz Matrix')

                if (invio_mail)
                {
                    cy.get('div').contains('E-mail inviata in automatico con successo', { timeout: 20000 })
                      .should('be.visible')
                    
                    cy.get('[data-bind*="sezioneContrattuali"]', { timeout: 20000 })
                      .should('be.visible')
                      .find('button').not('[disabled]').contains('STAMPA')
                      .should('be.visible')
                      .click()
                }
                else    // no invio mail
                {
                    cy.get('div[data-bind*="sezionePreContrattuali"]', { timeout: 20000 })
                    .should('exist')
                    .find('button').not('[disabled]').contains('STAMPA')
                    .should('be.visible')
                    .click()

                    cy.get('[data-bind*="sezioneContrattuali"]', { timeout: 20000 })
                      .should('be.visible')
                      .find('button').not('[disabled]').contains('STAMPA')
                      .should('be.visible')
                      .click()
                }
                //attende caricamento sezione Precontrattuali
                // Non funziona se non c'è il consenso all'invio mail
                //cy.get('div').contains('E-mail inviata in automatico con successo', { timeout: 20000 })
                //    .should('be.visible')

                /*
                cy.get('div[data-bind*="sezionePreContrattuali"]', { timeout: 20000 })
                    .should('exist')

                cy.get('[data-bind*="sezioneContrattuali"]', { timeout: 20000 })    //>>> non lo vedo
                cy.get('div[data-bind*="BottoneStampaDocumenti"]', { timeout: 20000 })
                    .should('be.visible')
                    .find('button').not('[disabled]').contains('STAMPA')
                    .should('be.visible')
                    .click()
                */
            })
        })
    }

    static salvaNContratto() {
        ultraIFrame().within(() => {
            cy.get('[class="step last success"]').find('span').contains('contratto')
                .children('b').invoke('text').then(val => {
                    cy.wrap(val).as('contratto')
                    cy.log("return " + '@contratto')
                })
        })
    }

    static salvaNPreventivo() {
        ultraIFrame().within(() => {
            cy.get('[class="step last success"]').find('span').contains('preventivo')
                .children('b').invoke('text').then(val => {
                    cy.wrap(val).as('preventivo')
                    cy.log("return " + '@preventivo')
                })
        })
    }


    /**
     * Verifica l'opzione selezionata per un determinante campo
     * * @param {*} campo (è il campo che si vuole verificare)
     * * @param {*} opzione (è l'opzione che dovrebbe essere selezionata) 
     */   //>>>>>> DA SVILUPPARE - NON FUNZIONA !!!!!!!
     static verificaOpzione(campo, opzione) {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('div').contains(campo).should('exist')
                    .parent('div').should('exist')
                    .find('span').contains(opzione).should('be.checked')
                    //.find('span').contains(opzione).should('exist')
            })    
            
        })
    }

    /**
     * Verifica presenza documento da visualizzare
     * * @param {*} documento (è il documento da verificare) 
     */ 
     static verificaPresenzaDocumento(documento) {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('div').contains(documento).should('exist')
            })    
            
        })
    }

    /**
     * Imposta opzione per uno di campi si/no
     * * @param {*} campo (è il campo che si vuole impostare)
     * * @param {*} opzione (è l'opzione che si vuole impostare) 
     */ 
     static impostaOpzione(campo, opzione) {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('div').contains(campo).should('exist')
                    .parent('div').should('exist')
                    .find('span').contains(opzione).should('be.visible').click()
            })    
            
        })
    }


    /**
     * Clicca sul pulsante Incassa
     */
    static Incassa() {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('button').contains('Incassa')
                    .should('be.visible')
                    .click()
            })
        })
    }

    /**
     * Clicca sul pulsante Home
     */
     static Home() {
        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.get('button').contains('Home')
                    .should('be.visible')
                    .click()
            })
            //Conferma
            cy.get('div[class="dialog"]').should('exist')
            .find('footer[class="btn-container"]').contains('Conferma').should('be.visible').click()
        })
    }

}
export default ControlliProtocollazione