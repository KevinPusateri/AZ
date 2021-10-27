/// <reference types="Cypress" />

const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const ultraIFrame0 = () => {
    let iframeFolder = ultraIFrame().find('[id="iFrameResizer0"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

class Ultra {

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

    static selezionaFonteRandom() {
        ultraIFrame().within(() => {
            cy.wait(1000)
            cy.get('span').contains('Fonte').should('be.visible').click() //click su pulsante Fonte
            cy.wait(500)
            cy.get('[id="fontePopover"]').should('be.visible') //verifica apertura popup fonte

            cy.get('[id="fontePopover"]').find('[name="pen"]').click() //click sull'icona della penna
            cy.wait(2000)
            cy.get('#fontiModal').should('be.visible') //verifica apertura popup per la scelta della fonte

            //seleziona una fonte random
            cy.get('#fontiModal').find('[class="sottofonte-semplice nx-table-row ng-star-inserted"]') //lista delle fonti
                .then(($fonti) => {
                    var rndFonte = Math.floor(Math.random() * $fonti.length)
                    cy.get($fonti).eq(rndFonte).first().find('nx-radio').click() //click sul radio button di una fonte random

                    cy.get($fonti).eq(rndFonte).first().invoke('text').then(($text) => {
                        cy.log('fonte selezionata: ', $text)
                    })
                });

            cy.get('button').contains('CONFERMA').should('be.visible').click()
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
                cy.get('app-ultra-ambiti-selection-panel').find('nx-icon[class*="'+listaAmbiti[i]+'"]').click()
            }

            //polizza valida da > al
            cy.log("data inizio: " + inizio)
            cy.log("data fine: " + fine)
            cy.get('ultra-contratto-temporaneo-modal').find('input[formcontrolname="dataInizio"]').type(inizio)
            cy.get('ultra-contratto-temporaneo-modal').find('input[formcontrolname="dataFine"]').type(fine)

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

            cy.get('span').contains(soluzione).should('be.visible').click() //seleziona Top

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

            //cy.pause()
            //verifica che la garanzia sia stata selezionata
            cy.get('span')
                .contains('Danni da fenomeno elettrico')
                .parent()
                .prev()
                .should('have.class', 'garanzia-icon selected')

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
                .should('have.class', 'garanzia-icon selected')

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

    static ProfessionePrincipaleDatiQuotazione(professione) {
        ultraIFrame().within(() => {
            //apertura menù scelta soluzione
            cy.get('ultra-form-dati-quotazione', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione
            cy.get('div[class*="professioneDrop"]').click() //clicca sulla professione presente

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
            //apertura menù scelta soluzione
            cy.get('[id="riepilogoBody"]', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            //cy.pause()
            cy.get('span').contains('Emetti polizza').should('be.visible').click() //conferma
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
        })
    }

    static censimentoAnagraficoSalute(cliente, SpeseMediche, DiariaRicovero, Invalidita) {
        ultraIFrame().within(() => {
            cy.get('#tabsAnagrafiche', { timeout: 30000 }).should('be.visible') //attende la comparsa del form con i dati quotazione

            cy.get('div[class="tabs-title"]').contains('Persona').should('be.visible').click() //tab Casa

            cy.get('select').select(cliente)
            cy.wait(2000)

            //Spese Mediche si/no
            if(SpeseMediche == true) {
                cy.get('div[class="domanda"]').contains(/^Spese mediche$/)
                    .parent()
                    .parent()
                    .next('div').find('span[class="label-text"]').contains('SI').click()

                cy.get('textarea[class="has-error"]', { timeout: 5000 }).should('be.visible').type('Lorem ipsum dolor sit amet')
                cy.get('div[class="domanda"]').contains(/^Spese mediche$/).click()
                cy.wait(1000)
            }
            

            //Diaria da Ricovero si/no
            if(DiariaRicovero == true) {
                cy.get('div[class="domanda"]').contains(/^Diaria da ricovero$/)
                    .parent()
                    .parent()
                    .next('div').find('span[class="label-text"]').contains('SI').click()

                cy.get('textarea[class="has-error"]', { timeout: 5000 }).should('be.visible').type('Lorem ipsum dolor sit amet')
                cy.get('div[class="domanda"]').contains(/^Diaria da ricovero$/).click()
                cy.wait(1000)
            }

            //Invalidità permanente da infortunio si/no
            if(Invalidita == true) {
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

    static datiIntegrativi() {
        ultraIFrame().within(() => {
            cy.get('[class="page-title"]').children()
                .should('be.visible')
                .invoke('text').then((text) => {
                    cy.log('page-title', text)
                })

            //Attende il caricamento della pagina        
            cy.get('h1:contains("Dati integrativi")').should('be.visible')
            //cy.pause()

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
        cy.intercept('/Danni/UltraBRE/KoTemplates/tmpl_dati_assicurato_integr.htm', (req) => {
                req.alias = 'datiAssicurato'
        })
        //cy.wait('@datiAssicurato')

        ultraIFrame().within(() => {
            //Attende il caricamento della pagina
            //cy.wait('@datiAssicurato', { timeout: 15000 })   
            cy.get('h1:contains("Dati integrativi")').should('be.visible')
            
            //Spese Mediche si/no
            if(speseMediche == true) {
                cy.get('label').contains(/^Spese mediche$/)
                    .parent()
                    .next('div').find('span').contains('SI').click()
            }
            else {
                cy.get('label').contains(/^Spese mediche$/)
                    .parent()
                    .next('div').find('span').contains('NO').click()
            }

            if(diariaRicovero == true) {
                cy.get('label').contains(/^Diaria da ricovero$/)
                    .parent()
                    .next('div').find('span').contains('SI').click()
            }
            else {
                cy.get('label').contains(/^Diaria da ricovero$/)
                    .parent()
                    .next('div').find('span').contains('NO').click()
            }

            if(invalidita == true) {
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

            if(polizzeStessoRischio == true) {
                cy.get('[class="popupSituazioneAssicurativa"]')
                .find('span').contains('polizze in essere sullo stesso rischio')
                .closest('[class="domanda"]').find('span').contains('SI') //Se possiede polizze sullo stesso rischio clicca si

                if(comunqueInteressato == false) {
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
        })

        
    }

    static consensiPrivacy() {
        ultraIFrame().within(() => {
            //Attende il caricamento della pagina
            cy.get('[class="page-title"]', { timeout: 30000 }).contains('Consensi e privacy').should('be.visible')
            cy.get('a').contains('Avanti').click() //avanti
        })
    }
    
    static consensiSezIntermediario(intermediario, collaborazione = false, esterno = false) {
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
            if(collaborazione == true) {
                cy.get('#IntermediariContainer')
                    .find('div[class="consenso"]').contains('Collaborazione orizzontale')
                    .parent().find('span').contains('SI').click()
            }

            //seleziona 'All'esterno dell'agenzia / a distanza' SI se richiesto
            if(esterno == true) {
                cy.get('#IntermediariContainer')
                    .find('div[class="consenso"]').contains('distanza')
                    .parent().find('span').contains('SI').click()
            }
        })
    }

    static salvataggioContratto() {
        ultraIFrame().within(() => {
            cy.get('[class="step last success"]').contains('è stato salvato con successo').should('be.visible')
            cy.log("Contratto salvato con successo")
        })
    }

    static inserimentoIntermediario() {
        ultraIFrame0().within(() => {
            cy.get('[class="consenso-text has-error"]', { timeout: 10000 })
                .contains('Intermediario').not('Firma Compagnia')
                .next('div').click()

            cy.wait(1000)

            cy.get('[class="select2-result-label"]')
                .contains('2060281 BUOSI FRANCESCA').click()
        })
    }

    static riepilogoDocumenti() {
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

    static stampaAdempimentiPrecontrattuali() {
        ultraIFrame0().within(() => {
            cy.log('titolo tab: ', cy.title())
            cy.title().should('include', 'Allianz Matrix')
    
            //attende caricamento sezione Precontrattuali
            cy.get('[data-bind="with: sezionePreContrattuali"]', {timeout: 20000})
                .should('be.visible')
    
            cy.get('button').not('[disabled]').contains('STAMPA')
                    .should('be.visible')
                    .click()
    
            cy.wait(2000)
            
            cy.get('button').not('[disabled]').contains('STAMPA')
                    .should('be.visible')
                    .click()
    
            cy.get('button').contains('Incassa')
                    .should('be.visible')
                    .click()
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
}

export default Ultra