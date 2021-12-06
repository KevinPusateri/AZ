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

const ultraIFrameAnagrafica = () => {
    let iframeAnagrafica = cy.get('iframe[src*="Anagrafe"]').should('be.visible')
        .its('0.contentDocument').should('exist');

    return iframeAnagrafica.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Ultra {

    static startScopriProtezione() {
        ultraIFrame().within(() => {
            cy.get('button').contains('SCOPRI LA PROTEZIONE').should('be.visible').click() //click su Scopri la Protezione
            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static caricamentoUltraHome(ambiti) {
        cy.intercept({
            method: 'GET',
            url: '**/ambiti-disponibili'
        }).as('ambiti')

        cy.wait('@ambiti', { requestTimeout: 60000 });
    }

    //#region Persona Fisica
    static verificaAmbitiHome(ambiti) {
        ultraIFrame().within(() => {
            for (var i = 0; i < ambiti.length; i++) {
                cy.log("Verifica selezione " + ambiti[1])
                cy.get('[class="ng-star-inserted"]').contains(ambiti[i]).should('be.visible')
                cy.get('div').contains(ambiti[i]).parent().parent().find('nx-icon[class*="selected"]')//[class="counter"]                
            }
        })
    }

    static selezionaAmbitiHome(ambiti) {
        ultraIFrame().within(() => {
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

    static selezionaFonteRandom() {
        ultraIFrame().within(() => {
            cy.get('span').contains('Fonte').should('be.visible')
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
        ultraIFrame().within(() => {
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
        ultraIFrame().within(() => {
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
        ultraIFrame().within(() => {
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

    static GaranzieAggiuntiveAmbito(ambito, garanzia) {
        ultraIFrame().within(() => {
            cy.get('tr').contains(ambito)
                .parent().parent()
                .find('nx-icon[name="pen"]').click()

            cy.get('#caGaranzie').should('be.visible')

            cy.get('span').contains(garanzia)
                .parent().parent()
                .find('span').contains('Aggiungi')
                .click()

            cy.wait(500)

            cy.get('span').contains('CONFERMA')
                .should('be.visible').click()

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    //configurazione specifica per l'ambito contenuto, per test emissione Ultra Fabbricato e Contenuto
    static configuraContenuto() {
        ultraIFrame().within(() => {
            //click su pulsante Penna
            cy.get('tr')
                .contains('Contenuto')
                .parent()
                .parent()
                .find('[name="pen"]')
                .click()

            //attende il caricamento della pagina Configurazione Contenuto
            cy.get('[id="caSoluzioni"]', { timeout: 30000 })
                .should('be.visible')

            cy.get('h3').contains('Premium').should('be.visible').click() //seleziona soluzione Premium

            //verifica che la soluzione Premium sia stata selezionata
            cy.get('h3').contains('Premium')
                .parents('[class="ca-col-soluzione selected"]')
                .should('be.visible')

            cy.get('[id="alz-spinner"]').should('not.be.visible')

            //cy.pause()
            //garanzia aggiuntiva 'Danni da fenomeno elettrico'
            cy.get('span')
                .contains('Danni da fenomeno elettrico')
                .parent()
                .parent()
                .find('button').contains('Aggiungi').should('be.visible')
                .click()

            cy.wait(1000)
            //verifica che la garanzia sia stata selezionata
            cy.get('span')
                .contains('Danni da fenomeno elettrico')
                .parent()
                .prev()
                .should('have.class', 'selected')

            cy.get('[id="alz-spinner"]').should('not.be.visible')

            //garanzia aggiuntiva 'Scippo e rapina'
            cy.get('span')
                .contains('Scippo e rapina')
                .parent()
                .parent()
                .find('button').contains('Aggiungi')
                .click()

            //verifica che la garanzia sia stata selezionata
            cy.get('span')
                .contains('Scippo e rapina')
                .parent()
                .prev()
                .should('have.class', 'selected')

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento

            cy.get('span').contains('CONFERMA').should('be.visible').click()
            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static procediHome() {
        ultraIFrame().within(() => {
            cy.get('[id="dashTable"]').should('be.visible')
            //cy.get('button[aria-disabled="false"]').find('span').contains(' PROCEDI ', { timeout: 30000 }).should('be.visible').click()
            cy.get('span').contains(' PROCEDI ', { timeout: 30000 }).should('be.visible').click()
        })
    }

    static confermaDatiQuotazione() {
        ultraIFrame().within(() => {
            //apertura menù scelta soluzione
            cy.get('ultra-form-dati-quotazione', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('button').contains('CONFERMA').should('be.visible').click() //conferma
            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static coperturaDatiQuotazione(copertura) {
        ultraIFrame().within(() => {
            //apertura menù scelta soluzione
            cy.get('ultra-form-dati-quotazione', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('span').contains('Vuole una copertura ').should('be.visible')
                .parent().next('div')
                .find('nx-dropdown').click()

            cy.get('span').contains(copertura)
                .should('be.visible').click()

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    //Modifica la professione nella sezione Dati Quotazione
    //altre: aggiunta altre professioni
    static ProfessionePrincipaleDatiQuotazione(professione, altre = false) {
        ultraIFrame().within(() => {
            //apertura menù scelta soluzione
            cy.get('ultra-form-dati-quotazione', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            if (altre) {
                cy.get('div[class*="addProfessione"]').click() //aggiungi altre professioni
            }
            else {
                cy.get('div[class*="professioneDrop"]').click() //clicca sulla professione presente
            }


            cy.get('div[class*="search-professioni extended"]', { timeout: 10000 }).should('be.visible') //attende il caricamento del popup
            cy.get('#search-input-formfield').find('input').should('be.visible').type(professione) //cerca la professione

            //seleziona la professione
            cy.get('div[class*="search-professioni extended"]')
                .find('div[class*="result-content"]')
                .find('span').contains(professione.toUpperCase()).click()

            //conferma
            cy.get('div[class*="search-professioni extended"]')
                .find('span').contains('CONFERMA').click()

            cy.wait(1000)
        })
    }

    static riepilogoEmissione() {
        ultraIFrame().within(() => {
            cy.get('[id="riepilogoBody"]', { timeout: 30000 }).should('be.visible') //attende la comparsa del riepilogo
            cy.get('span').contains('Emetti polizza').should('be.visible').click() //emetti polizza
        })
    }

    static emettiPreventivo() {
        ultraIFrame().within(() => {
            cy.get('span').contains('Emetti preventivo').should('be.visible').click() //emetti preventivo
            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static censimentoAnagraficoAvanti() {
        ultraIFrame().within(() => {
            cy.get('[id="btnAvanti"]').should('be.visible').click() //avanti
            cy.wait(5000)
        })
    }

    static caricamentoCensimentoAnagrafico(cliente, ubicazione) {
        cy.intercept({
            method: 'GET',
            url: '**/tmpl_anag_container.htm'
        }).as('consensiPrivacy')

        cy.wait('@consensiPrivacy', { requestTimeout: 60000 })

        ultraIFrame().within(() => {
            //Attende il caricamento della pagina            
            cy.get('[class="page-title"]', { timeout: 15000 }).contains('Censimento anagrafico').should('be.visible')
        })
    }

    static censimentoAnagrafico(cliente, ubicazione) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('div').contains('Casa').should('be.visible').click() //tab Casa

            cy.get('span')
                .contains('Ubicazione')
                .parent()
                .parent()
                .find('select').select(ubicazione)

            cy.get('span')
                .contains('Assicurato associato')
                .parent()
                .parent()
                .find('select').select(cliente)

            cy.get('[id="btnAvanti"]').click() //avanti
            cy.wait(5000)
        })
    }

    static aggiungiClienteCensimentoAnagrafico(cliente) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('div').contains('Persona').should('be.visible').click() //tab Persona

            cy.get('input[value="CERCA"]').should('be.visible').click() //cerca cliente

            cy.get('#divPopupAnagrafica', { timeout: 30000 }).should('be.visible') //attende la comparsa popup di ricerca anagrafiche
            cy.wait(5000)

            //popup anagrafico
            ultraIFrameAnagrafica().within(() => {
                cy.get('#f-cognome').should('be.visible').type(cliente.cognome)
                cy.get('#f-nome').should('be.visible').type(cliente.nome)

                cy.get('#cerca-pers-forinsert').should('be.visible').click() //avvia ricerca
                cy.wait(1000)
                cy.get('span').contains(cliente.cognomeNome()).click()
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

    static censimentoAnagraficoSalute(cliente, SpeseMediche, DiariaRicovero, Invalidita) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('div[class="tabs-title"]').contains('Persona').should('be.visible').click() //tab Casa

            cy.get('select').select(cliente)
            cy.wait(2000)

            //Spese Mediche si/no
            if (SpeseMediche == true) {
                cy.get('div[class="domanda"]').contains(/^Spese mediche$/)
                    .parent()
                    .parent()
                    .next('div').find('span[class="label-text"]').contains('SI').click()

                cy.get('textarea[class="has-error"]', { timeout: 5000 }).should('be.visible').type('Lorem ipsum dolor sit amet')
                cy.get('div[class="domanda"]').contains(/^Spese mediche$/).click()
                cy.wait(1000)
            }


            //Diaria da Ricovero si/no
            if (DiariaRicovero == true) {
                cy.get('div[class="domanda"]').contains(/^Diaria da ricovero$/)
                    .parent()
                    .parent()
                    .next('div').find('span[class="label-text"]').contains('SI').click()

                cy.get('textarea[class="has-error"]', { timeout: 5000 }).should('be.visible').type('Lorem ipsum dolor sit amet')
                cy.get('div[class="domanda"]').contains(/^Diaria da ricovero$/).click()
                cy.wait(1000)
            }

            //Invalidità permanente da infortunio si/no
            if (Invalidita == true) {
                cy.get('div[class="domanda"]').contains(/^Invalidità permanente da infortunio$/)
                    .parent()
                    .parent()
                    .next('div').find('span[class="label-text"]').contains('SI').click()

                cy.get('textarea[class="has-error"]', { timeout: 5000 }).should('be.visible').type('Lorem ipsum dolor sit amet')
                cy.get('div[class="domanda"]').contains(/^Invalidità permanente da infortunio$/).click()
                cy.wait(1000)
            }

            cy.get('[id="btnAvanti"]').click() //avanti

            //cy.get('[class="spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    static beneficiariAvanti() {
        ultraIFrame().within(() => {
            cy.get('button').contains('Avanti')
                .should('be.visible').click() //avanti
            cy.get('[id="alz-spinner"]').should('not.be.visible')
            cy.get('button').contains('Avanti').click() //avanti
            cy.wait(3000)
        })
    }

    static caricaDatiIntegrativi() {
        cy.intercept({
            method: 'GET',
            url: '**/tmpl_dati_ambito_integr.htm'
        }).as('datiIntegrativi')

        cy.wait('@datiIntegrativi', { requestTimeout: 60000 })

        cy.wait(3000)
    }

    static datiIntegrativi() {
        ultraIFrame().within(() => {
            cy.get('[class="page-title"]').should('be.visible')
                .invoke('text').then((text) => {
                    cy.log('page-title', text)
                })


            // cy.intercept({
            //     method: 'GET',
            //     url: '**/getDatiQuotazione'
            // }).as('datiIntegrativi')

            // cy.wait('@datiIntegrativi', { requestTimeout: 60000 })


            //Attende il caricamento della pagina        
            cy.get('h1:contains("Dati integrativi")').should('be.visible')
            cy.wait(2000)

            cy.get('label').contains('Seleziona tutti NO').should('be.visible').click() //Dati integrativi oggetti assicurati tutti NO

            //cy.pause()
            cy.get('[id="btnAvanti"]').click() //avanti

            //Attende la comparsa del popup 'Dichiarazioni contraente principale' e clicca su Conferma
            cy.get('[id="PopupDichiarazioni"]', { timeout: 5000 })
                .should('be.visible')
                .find('button').contains('CONFERMA').click()
        })
    }

    static datiIntegrativiSalute(speseMediche, diariaRicovero, invalidita) {
        ultraIFrame().within(() => {
            //Attende il caricamento della pagina
            cy.get('h1:contains("Dati integrativi")').should('be.visible')

            //Spese Mediche si/no
            if (speseMediche == true) {
                cy.get('label').contains(/^Spese mediche$/)
                    .parent()
                    .next('div').find('span').contains('SI').click()
            }
            else {
                cy.get('label').contains(/^Spese mediche$/)
                    .parent()
                    .next('div').find('span').contains('NO').click()
            }

            if (diariaRicovero == true) {
                cy.get('label').contains(/^Diaria da ricovero$/)
                    .parent()
                    .next('div').find('span').contains('SI').click()
            }
            else {
                cy.get('label').contains(/^Diaria da ricovero$/)
                    .parent()
                    .next('div').find('span').contains('NO').click()
            }

            if (invalidita == true) {
                cy.get('label').contains(/^Invalidita' permanente da infortunio$/)
                    .parent()
                    .next('div').find('span').contains('SI').click()
            }
            else {
                cy.get('label').contains(/^Invalidita' permanente da infortunio$/)
                    .parent()
                    .next('div').find('span').contains('NO').click()
            }

            cy.get('[id="btnAvanti"]').click() //avanti
        })
    }

    static approfondimentoSituazioneAssicurativa(polizzeStessoRischio, comunqueInteressato = true) {
        ultraIFrame().within(() => {
            //cy.get('[class="popupSituazioneAssicurativa"]', { timeout: 10000 })
            cy.get('#QuestionarioSituazioneAssicurativa', { timeout: 10000 })
                .should('be.visible') //attende la comparsa del popup

            if (polizzeStessoRischio == true) {
                cy.get('[class="popupSituazioneAssicurativa"]')
                    .find('span').contains('polizze in essere sullo stesso rischio')
                    .closest('[class="domanda"]').find('span').contains('SI') //Se possiede polizze sullo stesso rischio clicca si

                if (comunqueInteressato == false) {
                    cy.get('[class="popupSituazioneAssicurativa"]')
                        .find('span').contains('comunque interessato')
                        .closest('[class="domanda"]').find('span').contains('NO') //se non è interessato clicca no
                }
            }

            cy.get('[class="popupSituazioneAssicurativa"]')
                .find('button').contains('CONFERMA').click() //conferma il popup
            cy.wait(1000)
        })
    }

    static confermaDichiarazioniContraente() {
        ultraIFrame().within(() => {
            //Attende la comparsa del popup 'Dichiarazioni contraente principale' e clicca su Conferma            
            cy.get('[aria-describedby="PopupDichiarazioni"]', { timeout: 5000 })
                .should('be.visible') //attende la comparsa del popup
                .find('button').contains('CONFERMA').click() //conferma
            cy.wait(5000)
        })
    }

    //seleziona tutte le schede degli ambiti nella sezione Condividi il Preventivo
    static condividiPreventivoSelTutti() {
        ultraIFrame().within(() => {
            cy.get('label').contains('Seleziona tutti')
                .should('be.visible')
                .children('span').click()
        })
    }

    static condividiPreventivoConferma() {
        ultraIFrame().within(() => {
            cy.get('button').contains('Conferma')
                .should('be.visible').click()
        })

        cy.wait(5000)
    }

    static caricamentoConsensi() {
        cy.intercept({
            method: 'GET',
            url: '**/consensi/**'
        }).as('consensiPrivacy')

        cy.wait('@consensiPrivacy', { requestTimeout: 60000 })
        cy.wait(1000)

        ultraIFrame().within(() => {
            //Attende il caricamento della pagina            
            cy.get('[class="page-title"]', { timeout: 15000 }).contains('Consensi e privacy').should('be.visible')
        })
    }

    static avantiConsensi() {
        ultraIFrame().within(() => {
            cy.get('a').contains('Avanti').click() //avanti
        })
    }

    static consensiSezIntermediario(intermediario, collaborazione = false, esterno = false) {
        cy.intercept({
            method: 'GET',
            url: '**/GetIntermediari'
        }).as('intermediari')

        cy.wait('@intermediari', { requestTimeout: 60000 })

        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                //Attende il caricamento della pagina
                cy.get('[class="consenso-text has-error"]', { timeout: 30000 })
                    .contains('Intermediario').not('Firma Compagnia')
                    .should('be.visible') //attende che sia visibile la sezione intermediari
                    .parent().find('a').click()

                cy.wait(500)

                cy.get('#select2-drop').should('be.visible').find('input')
                    .type(intermediario).type('{enter}') //seleziona l'intermediario

                //seleziona 'Collaborazione orizzontale' SI se richiesto
                if (collaborazione == true) {
                    cy.get('#IntermediariContainer')
                        .find('div[class="consenso"]').contains('Collaborazione orizzontale')
                        .parent().find('span').contains('SI').click()
                }

                //seleziona 'All'esterno dell'agenzia / a distanza' SI se richiesto
                if (esterno == true) {
                    cy.get('#IntermediariContainer')
                        .find('div[class="consenso"]').contains('distanza')
                        .parent().find('span').contains('SI').click()
                }
            })
        })
    }

    static salvataggioContratto() {
        cy.intercept({
            method: 'POST',
            url: '**/SalvaPerStep'
        }).as('contratto')

        cy.wait('@contratto', { requestTimeout: 60000 })

        ultraIFrame().within(() => {
            cy.get('[class="step last success"]').contains('è stato salvato con successo').should('be.visible')
            cy.log("Contratto salvato con successo")
        })
    }

    static inserimentoIntermediario() {
        var checkFrame0 = false
        var checkIntermediarioError = false

        cy.intercept({
            method: 'GET',
            url: '**/GetIntermediari'
        }).as('intermediari')

        cy.wait('@intermediari', { requestTimeout: 60000 })

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

    static riepilogoDocumenti() {
        //GetRiepilogoDocumenti
        var check = true

        // cy.intercept({
        //     method: 'GET',
        //     url: '**/GetRiepilogoDocumenti'
        // }).as('riepilogoDocumenti')

        // cy.wait('@riepilogoDocumenti', { requestTimeout: 60000 })

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

                    cy.get('button').contains('Avanti').click() //avanti
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

    static stampaAdempimentiPrecontrattuali() {
        cy.intercept({
            method: 'GET',
            url: '**/GetSezionePrecontrattuale'
        }).as('precontrattuale')

        cy.wait('@precontrattuale', { requestTimeout: 60000 })

        ultraIFrame().within(() => {
            ultraIFrame0().within(() => {
                cy.log('titolo tab: ', cy.title())
                cy.title().should('include', 'Allianz Matrix')

                //attende caricamento sezione Precontrattuali
                cy.get('div').contains('E-mail inviata in automatico con successo', { timeout: 20000 })
                    .should('be.visible')

                cy.get('[data-bind*="sezioneContrattuali"]', { timeout: 20000 })
                    .should('be.visible')
                    .find('button').not('[disabled]').contains('STAMPA')
                    .should('be.visible')
                    .click()

                cy.wait(500)

                cy.get('button').contains('Incassa')
                    .should('be.visible')
                    .click()
            })
        })
    }

    static chiudiFinale() {
        ultraIFrame().within(() => {
            cy.wait(1000)
            cy.get('a').contains('Conferma').click()
        })
    }



    //#region Matrix
    //seleziona il prodotto Ultra da emettere
    //a partire dal menù Rami vari nella pagina di cliente su Matrix
    static emissioneUltra(prodotto) {
        //apre il menù 'Rami vari'
        cy.get('div[class="label"]').contains('Rami vari')
            .should('be.visible')
            .click()

        cy.wait(500)

        //seleziona prodotto
        cy.get('button[role="menuitem"]').contains(prodotto)
            .should('be.visible')
            .click()
    }

    //seleziona la prima agenzia dal popup "seleziona il canale" in Matrix
    static selezionaPrimaAgenzia(prodotto) {
        //apre il menù 'Rami vari'
        cy.get('[ngclass="agency-row"]')
            .should('be.visible')
            .first().click()

        cy.wait(2000)
    }

    static verificaInvioMail() {
        cy.intercept({
            method: 'POST',
            url: '**/InviaMail'
        }).as('invioMail')

        cy.wait('@invioMail', { requestTimeout: 60000 });

        ultraIFrame().within(() => {
            cy.get('[class="dialog-small dialog-content"]')
                .should('be.visible').contains('La documentazione è stata inviata con successo')
        })
    }

    //#endregion Matrix

    static modificaClientePGConfermaModifiche() {
        //#region Intercept
        cy.intercept({
            method: 'POST',
            url: /NormalizeImpresa/
        }).as('normalizeImpresa')

        cy.intercept({
            method: 'POST',
            url: /ValidateForEdit/
        }).as('validateForEdit')

        cy.intercept({
            method: 'GET',
            url: '**/AnagrafeWA40/**'
        }).as('anagrafeWA40')

        cy.intercept({
            method: 'GET',
            url: '**/SCU/**'
        }).as('scu')

        cy.intercept({
            method: 'POST',
            url: /getCustomerTree/
        }).as('getCustomerTree')
        //#endregion Intercept

        getSCU().find('#submit').click().wait(1000)

        //Verifica presenza normalizzatore
        getSCU().find('#Allianz-msg-container').then((container) => {
            if (container.find('li:contains(normalizzati)').length > 0) {
                getSCU().find('#submit').click()
            }
        });

        cy.wait('@normalizeImpresa', { requestTimeout: 60000 });
        cy.wait('@validateForEdit', { requestTimeout: 60000 });
        cy.wait('@anagrafeWA40', { requestTimeout: 60000 });
        cy.wait('@scu', { requestTimeout: 60000 }).wait(1000);

        getSCU().find('button:contains("Conferma")').click();

        //Restiamo in attesa del caricamento del tree del folder
        cy.wait('@getCustomerTree', { requestTimeout: 30000 });
    }
    //#endregion

    //#region Helper
    static domandaSiNo(domanda, risposta) {
        ultraIFrame().within(() => {
            cy.get('span').contains(domanda)
                .should('be.visible')
                .parent().parent()
                .find('label').contains(risposta.toUpperCase())
                .click()
        })
    }
    //#endregion Helper

}

export default Ultra