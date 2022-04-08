/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}


const ultraIFrameAnagrafica = () => {
    let iframeAnag = cy.get('#divPopupAnagrafica').find('#divPopUpACAnagrafica')
        .its('0.contentDocument').should('exist')

    return iframeAnag.its('body').should('not.be.undefined').then(cy.wrap)
}

//#endregion iFrame

class CensimentoAnagrafico {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Censimento Anagrafico
     */
    static caricamentoCensimentoAnagrafico() {
        cy.log('***** CARICAMENTO CENSIMENTO ANAGRAFICO *****')
        cy.intercept({
            method: 'GET',
            url: '**/tmpl_anag_figura.htm'
        }).as('anagrafica')

        cy.wait('@anagrafica', { requestTimeout: 60000 })


        //cy.intercept({
        //    method: 'GET',
        //    url: '**/completamento/getDatiQuotazione'
        //}).as('anagrafica')

        //cy.wait('@anagrafica', { requestTimeout: 60000 })

    }

    static attendiCheckAssicurato() {
        cy.intercept({
            method: 'POST',
            url: '**/CheckAssicurato'
        }).as('checkAssicurato')

        cy.wait('@checkAssicurato', { requestTimeout: 60000 })

    }

    //#endregion caricamenti

    /**
     * Clicca sul pulsante Avanti
     */
    static Avanti() {
        ultraIFrame().within(() => {
            cy.get('[id="btnAvanti"]').should('be.visible').click()
        })
    }

    /**
     * Completa la sezione Casa della pagina Censimento Anagrafico
     * @param {*} cliente 
     * @param {*} ubicazione 
     */
    static censimentoAnagrafico(cliente, ubicazione, capDiverso = false) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('div').contains('Casa').should('be.visible').click() //tab Casa

            cy.get('span')
                .contains('Ubicazione')
                .parent()
                .parent()
                .find('select').select(ubicazione)

            if (capDiverso) {
                cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                    .should('be.visible')
                    .find('button').contains('AGGIORNA')
                    .click()
            }

            cy.get('span')
                .contains('Assicurato associato')
                .parent()
                .parent()
                .find('select').select(cliente)

            if (capDiverso) {
                cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                    .should('be.visible')
                    .find('button').contains('AGGIORNA')
                    .click()
            }
        })
    }

    static aggiungiClienteCensimentoAnagrafico(cliente, tab) {
        ultraIFrame().within(() => {
         //   cy.get('div').contains('Persona 1').should('be.visible').click() //tab Persona

            


            // cy.get('#tablist').find('a').first()
            //     .should('be.visible').click() //tab Persona/contrente principale

            cy.get('[value="CERCA"]').should('be.visible').click() //cerca cliente

            cy.get('#divPopupAnagrafica', { timeout: 30000 }).should('be.visible') //attende la comparsa popup di ricerca anagrafiche
            cy.wait(5000)

            //popup anagrafico
            ultraIFrameAnagrafica().within(() => {
                if (primoContraente) {
                    cy.get('#AZBuilder1_GroupStdPersonaImpresa__Pop')
                        .find('input[value="Persona Fisica"]').click()
                    cy.wait(3000)
                }
            })

            ultraIFrameAnagrafica().within(() => {
                cy.get('#f-cognome').should('be.visible').type(cliente.cognome)
                cy.get('#f-nome').should('be.visible').type(cliente.nome)

                cy.get('#cerca-pers-forinsert').should('be.visible').click() //avvia ricerca
                cy.wait(1000)
                cy.get('td').contains(cliente.codiceFiscale).click()
                cy.wait(2000)
            })
        })
    }

    static aggiungiClienteCensimentoAnagrafico(cliente, tab) {
        ultraIFrame().within(() => {            
            cy.get('div').contains('Persona').should('be.visible').click() //tab Persona

            cy.get('input[value="CERCA"]').should('be.visible').click() //cerca cliente

            cy.get('#divPopupAnagrafica', { timeout: 30000 }).should('be.visible') //attende la comparsa popup di ricerca anagrafiche
            cy.wait(5000)
            //cy.pause()

            //popup anagrafico
            ultraIFrameAnagrafica().within(() => {
                cy.get('#f-cognome').should('be.visible').type(cliente.cognome)
                cy.get('#f-nome').should('be.visible').type(cliente.nome)

                cy.get('#cerca-pers-forinsert').should('be.visible').click() //avvia ricerca
                cy.wait(1000)
                cy.get('td').contains(cliente.codiceFiscale).click()
                cy.wait(2000)
            })

            //popup attenzione CAP
            cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                .should('be.visible')
                .find('button').contains('AGGIORNA')
                .click()

            //cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento  nx-spinner__spin-block
        })
    }


    /**
     * Seleziona un contraente già esistente
     * @param {*} cliente  (persona fisica)
     */
    static selezionaContraentePF(cliente) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible')  //attende la comparsa del form con i dati quotazione

            cy.get('div').contains('Contraente Principale').should('be.visible').click()  //tab Contraente Principale

            cy.get('button').contains('CERCA').should('be.visible').click()  //cerca cliente

            cy.get('#divPopupAnagrafica', { timeout: 30000 }).should('be.visible')  //attende la comparsa popup di ricerca anagrafiche
            cy.wait(5000)


            //cy.get('div[id="divPopupAnagrafica"]').should('exist')

            //popup anagrafico
            ultraIFrameAnagrafica().within(() => {
                cy.get('#AZBuilder1_GroupStdPersonaImpresa__Pop').should('be.visible')
                    .find(('input[value="Persona Fisica"]')).should('be.enabled').click()  //seleziona Persona Fisica
                cy.wait(5000)
            })

            ultraIFrameAnagrafica().within(() => {
                cy.get('#f-cognome').should('be.visible').type(cliente.cognome)
                cy.get('#f-nome').should('be.visible').type(cliente.nome)

                cy.get('#cerca-pers-forinsert').should('be.visible').click()  //avvia ricerca
                cy.wait(5000)
                cy.get('span').contains(cliente.cognomeNome()).click()
                cy.wait(2000)
            })
            //cy.pause()

            /*
            //popup attenzione CAP
            cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                .should('be.visible')
                .find('button').contains('AGGIORNA')
                .click()
            */

            //cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento  nx-spinner__spin-block
        })
    }

    /**
     * chiude il popup di attenzione relativo al CAP differente
     */
    static popupCap() {
        ultraIFrame().within(() => {
            //popup attenzione CAP
            cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                .should('be.visible')
                .find('button').contains('AGGIORNA')
                .click()
        })
    }

    /**
     * Seleziona un contraente già esistente
     * @param {*} cliente  (persona fisica)
     * @param {*} capDifferente (flag per indicare se il cap è differente da quello di default)
     * @param {*} interesseStorico (flag per indicare se la casa è di interesse storico)
     */
    static selezionaCasa(cliente, capDifferente = false, interesseStorico = false) {
        ultraIFrame().within(() => {
            //cy.log('*** seleziona Casa ***')
            //cy.log('ubicazione: ' + cliente.ubicazione() + ' - cliente: ' + cliente.cognomeNome())

            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible')  //attende la comparsa del form con i dati quotazione
            cy.get('div').contains('Casa').should('be.visible').click()  //tab Casa

            cy.get('span')
                .contains('Ubicazione').should('be.visible')
                .parent()
                .parent()
                .find('select').select(cliente.ubicazione())
                .wait(2000)


            if (capDifferente) {
                //popup attenzione CAP
                cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                    .should('be.visible')
                    .find('button').contains('AGGIORNA')
                    .click()

                //cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
                cy.wait(2000)
            }


            cy.get('span')
                .contains('Assicurato associato').should('be.visible')
                .parent().should('exist')
                .parent().should('exist')
                .find('select').select(cliente.cognomeNome())
                .wait(2000)

            if (capDifferente) {
                //popup attenzione CAP
                cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                    .should('be.visible')
                    .find('button').contains('AGGIORNA')
                    .click()
                //cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
                cy.wait(2000)
            }

            if (interesseStorico) {
                cy.get('span[class="domande-integrative-fabbricato"]', { timeout: 15000 })
                    .should('have.length', 1)
                    .find('span').contains('SI')
                    .should('be.visible')
                    .click()
                //popup Fabbricato di interesse storico
                cy.get('div[id="popupConfermaCambioDomanda"]').should('contain.text', "comporta l'azzeramento degli sconti, la rimozione della convenzione speciale e il ricalcolo del prezzo")
                cy.get('button').contains('AGGIORNA').should('be.visible').click()
                //cy.pause()
            }

        })
    }

    /**
     * Seleziona un'ubicazione differente da quella del contraente
     * @param {*} cliente  (persona fisica)
     * @param {json} ubicazione // Nuova ubicazione
     */
     static selezionaNuovoFabbricato(cliente, ubicazione) {
        ultraIFrame().within(() => {
            cy.log('*** selezionaNuovoFabbricato ***')

            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible')  //attende la comparsa del form con i dati quotazione
            cy.get('div').contains('Casa').should('be.visible').click()  //tab Casa

            cy.get('button').contains('NUOVO FABBRICATO').should('be.visible').click()
            cy.wait(5000)

            CensimentoAnagrafico.impostaUbicazione(ubicazione)
            cy.wait(3000)

        })
        ultraIFrame().within(() => {
            cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
              .should('be.visible')
              .find('button').contains('AGGIORNA')
              .click()
                
            cy.wait(2000)
            
            cy.get('span')
                .contains('Assicurato associato').should('be.visible')
                .parent().should('exist')
                .parent().should('exist')
                .find('select').select(cliente.cognomeNome())
                .wait(2000)
        })
    }

    /**
     * Seleziona un animale
     * @param {*} cliente  (persona fisica)
     * @param {*} microchip (numero di 15 cifre)
     * @param {*} capDifferente (flag per indicare se il cap è differente da quello di default)
     */
    static selezionaAnimale(animale, cliente, microchip, capDifferente = false) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible')  //attende la comparsa del form con i dati quotazione
            cy.get('div').contains('Animali domestici').should('be.visible').click()  //tab Anumali Domestici

            cy.get('input[id="lblNomeAnimale"]').should('be.visible')
                .clear()
                .wait(1000)
                .type(animale)

            cy.get('#lblAnimalemicrochip').should('be.visible')
              .clear()
              .wait(1000)
              .type(microchip)

            cy.get('div')
                .contains('Proprietario').should('be.visible')
                .parent()
                .find('select').select(cliente.cognomeNome())

            if (capDifferente) {
                //popup attenzione CAP
                cy.get('#popupConfermaCambioParamTariffari', { timeout: 15000 })
                    .should('be.visible')
                    .find('button').contains('AGGIORNA')
                    .click()
            }

        })
    }

    /**
     * risponde alle domande nella sezione Domande Integrative
     * @param {string} domanda //è sufficiente scrivere una porzione della domanda
     * @param {string} risposta //si-no
     */
    static domandeIntegrative(domanda, risposta) {
        ultraIFrame().within(() => {
            if (domanda == "Spese mediche" ||
                domanda == "Diaria da ricovero" ||
                domanda == "invalidità permanente da infortunio") {
                cy.get('.domanda').contains(domanda)
                    .parents('.domanda').next()
                    .find(risposta.toUpperCase()).click()
            }
            else {
                cy.get('.DomandaTesto').contains(domanda)
                    .parents('.domandaSiNo')
                    .find('span').contains(risposta.toUpperCase()).click()
            }
        })
    }

    /**
     * clicca sul pulsante Apri della sezione 'Gestione vincoli'
     */
    static apriVincoli() {
        ultraIFrame().within(() => {
            cy.get('button[data-bind*="ApriVincolo"]').click() //click sul pulsante

            //attende caricamento pagina
            cy.intercept({
                method: 'GET',
                url: '**/getInfo'
            }).as('gestioneVincolo')
    
            cy.wait('@gestioneVincolo', { requestTimeout: 60000 })
        })
    }

     /* Impostazione ubicazione diversa dall'indirizzo del contraente 
     * @param {json} ubicazione
     */
     static impostaUbicazione(ubicazione) {
        ultraIFrameAnagrafica().within(() => {
            cy.log("ultraIFrameAnagrafica - 1")
                
            if(!ubicazione.Toponomastica == "")
            {
                cy.get('input[id*="_campoUBI_CodPrefis"]').should('be.visible')
                  .click().wait(500)
                  .type(ubicazione.Toponomastica).wait(500)
                cy.get('ul[id*="_campoUBI_CodPrefis_listbox"]').should('be.visible')
                  .find('li').contains(ubicazione.Toponomastica.toUpperCase()).click()
            }
            if(!ubicazione.Indirizzo == "")
            {
                cy.get('input[id*="_campoUBI_DesIndir"]').should('be.visible')
                  .click().wait(500)
                  .clear().wait(500)
                  .type(ubicazione.Indirizzo).wait(500)
            }
            if(!ubicazione.Numero == "")
            {
                cy.get('input[id*="_campoUBI_NumCiv"]').should('be.visible')
                  .click().wait(500)
                  .clear().wait(500)
                  .type(ubicazione.Numero).wait(500)
            }
            if(!ubicazione.Scala == "")
            {
                cy.get('input[id*="_campoUBI_NumScala"]').should('be.visible')
                  .click().wait(500)
                  .clear().wait(500)
                  .type(ubicazione.Scala).wait(500)
            }
            if(!ubicazione.Nazione == "")
            {
                cy.get('span[aria-owns*="_campoUBI_Nazione_listbox"]').should('exist').click()
                cy.get('ul[id*="_campoUBI_Nazione_listbox"]').should('be.visible')
                  .find('li').contains(ubicazione.Nazione).should('be.visible').click()
            }
            
            if(!ubicazione.Provincia == "")
            {
                cy.get('input[id*="_campoUBI_Provincia"]').should('exist')
                  .click().wait(500)
                  .type(ubicazione.Provincia).wait(500)
                cy.contains(ubicazione.Provincia.toUpperCase()).should('be.visible').click()
            }
                
                
        })
        cy.wait(2000)
        
        if(!ubicazione.Comune == "")
        {
            ultraIFrameAnagrafica().within(() => {
                cy.log("ultraIFrameAnagrafica - 2")
                cy.get('input[id*="_campoUBI_CodTerr"]').should('exist').wait(3000)
                  .click().wait(1000)
                  .clear().wait(1000)
            })
        
            ultraIFrameAnagrafica().within(() => {
                cy.get('input[id*="_campoUBI_CodTerr"]').should('exist')
                .type(ubicazione.Comune).wait(500)

                cy.get('ul[id*="_campoUBI_CodTerr_listbox"]').should('be.visible')
                .find('li').contains(ubicazione.Comune.toUpperCase()).click().wait(2000)
            })
        }

        if(!ubicazione.Cap == "")
        {
            ultraIFrameAnagrafica().within(() => {
                cy.get('span[aria-owns*="_campoUBI_CodCap_listbox"]').should('exist').click()

                cy.get('ul[id*="_campoUBI_CodCap_listbox"]').should('be.visible')
                  .find('li').contains(ubicazione.Cap).should('be.visible').click()
            })
        }

        ultraIFrameAnagrafica().within(() => {
            cy.get('input[id*="_Conferma"]').should('be.visible').click()
        })

    }

}

export default CensimentoAnagrafico