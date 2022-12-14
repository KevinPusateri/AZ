/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Dashboard {
    //#region caricamenti
    /**
     * Attende il caricamento della dashboard
     */
    static caricamentoDashboardUltra() {
        cy.log('***** CARICAMENTO PAGINA DASHBOARD ULTRA *****')
        cy.intercept({
            method: 'GET',
            url: '**/ambiti-disponibili'
        }).as('ambiti')

        cy.wait('@ambiti', { timeout: 120000 });
    }

    static stringaRandom(lunghezza) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < lunghezza; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    /**
     * Attende il caricamento della sezione preferiti su dashboard
     */
    static caricamentoPreferitiUltra() {
        cy.intercept({
            method: 'GET',
            url: '**/preferiti/disponibili'
        }).as('Preferiti')

        cy.wait('@Preferiti', { timeout: 60000 });
    }

    static caricamentoAmbitiAcquistati() {
        cy.intercept({
            method: 'GET',
            url: '**/oggetti-assicurati'
        }).as('oggettiAssicurati')

        cy.wait('@oggettiAssicurati', { timeout: 60000 });
    }
    //#endregion caricamenti

    /**
     * Verifica che siano selezionati gli ambiti indicati
     * @param {array} ambiti 
     */
    static verificaAmbiti(ambiti) {
        cy.log(">>> VERIFICA AMBITI DASHBOARD <<<")
        ultraIFrame().within(() => {
            for (var i = 0; i < ambiti.length; i++) {
                cy.log("Verifica selezione " + ambiti[i])
                //cy.pause()
                cy.get('nx-indicator[class="nx-indicator ng-star-inserted"]').should('exist')
                    //siblings('nx-icon').should('exist')
                    .siblings('nx-icon[class*="' + ambiti[i] + '"]', { timeout: 10000 })
                    //.contains(ambiti[i]).should('have.length', 1)
                    //.siblings('nx-icon[class*=ambiti[i]]')
                    .invoke('attr', 'class').should('contain', 'selected')
                //cy.get('[class="ng-star-inserted"]').contains(ambiti[i]).should('be.visible')
                //cy.get('div').contains(ambiti[i]).parent().parent().find('nx-icon[class*="selected"]')//[class="counter"]                
            }
        })
        //cy.pause()
    }

    /**
      * SelezionaVoceMenuPagAmbiti
      * @param {string} strmenu - testo del men?? 
      */
    static selezionaVoceHeader(strMenu) {
        ultraIFrame().within(() => {
            cy.get('div[id="ambitiHeader"]')
                .contains(strMenu).should('be.visible').click()
            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
            //cy.wait(2000)
        })

    }
    //#endregion


    /**
     * Seleziona gli ambiti indicati e verifica che vengano selezionati corretamente.
     * la variabile 'impresa' riguarda la tipologia di RC per Ultra Impresa (impresa/propriet??)
     * @param {array} ambiti
     * @param {string} ambiti
     */
    static selezionaAmbiti(ambiti, impresa = null) {
        ultraIFrame().within(() => {
            //scorre l'array degli ambiti da selezionare e clicca sulle icone
            for (var i = 0; i < ambiti.length; i++) {
                cy.log("selezione ambito " + ambiti[1])

                //seleziona ambito
                cy.get('#ambitiRischio', { timeout: 5000 }).find('nx-icon[class*="' + ambiti[i] + '"]')
                    .should('be.visible').click()

                if (impresa != null) {
                    if (ambiti[i] == "shield") {
                        cy.get('scelta-rc-modal').should('be.visible')
                            .find('ultra-ambito-button[name*="' + impresa + '"]')
                            .click()

                        cy.wait(200)

                        cy.get('scelta-rc-modal').find('button').contains('conferma').click()
                    }

                    cy.get('[class="nx-spinner__spin-block"]')
                        .should('not.be.visible') //attende il caricamento

                    cy.get('#ambitiRischio').find('nx-icon[class*="' + ambiti[i] + '"]')
                        .should('have.attr', 'aria-checked', 'true')
                }
                else {
                    cy.get('[class="nx-spinner__spin-block"]')
                        .should('not.be.visible') //attende il caricamento

                    //verifica che sia selezionato
                    cy.get('#ambitiRischio').find('nx-icon[class*="' + ambiti[i] + '"]')
                        .next('nx-indicator')
                        .should('be.visible')
                }



            }
        })
    }

    static aggiungiAmbito(nuovoAmbito) {
        ultraIFrame().within(() => {
            cy.get('nx-icon[class*="' + nuovoAmbito + '"]').parents('ultra-ambito-button').contains("+ Aggiungi nuovo").click()
            cy.wait(500)

        })
    }


    /**
     * seleziona una fonte casuale
     */
    static selezionaFonteRandom() {
        ultraIFrame().within(() => {
            cy.get('span').contains('Fonte').should('be.visible')
                .next('nx-icon').click() //click su pulsante Fonte
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

            cy.get('[id="frazionamentoDropdown"]').click() //apertura men?? scelta frazionamento
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

            cy.wait(1000);

            //verifica che il popup sia visibile e lo inquadra
            cy.get('ultra-contratto-temporaneo-modal').contains('Gestione contratto temporaneo')
                .should('be.visible')
            //cy.get('h5').focus()

            cy.get('label').contains('Temporaneit?? attiva').click() //Temporaneit?? attiva
            cy.get('label').contains('Temporaneit?? attiva').parent().parent()
                .invoke('attr', 'class').should('contain', 'is-checked') //verfica che la temporaneit?? sia stata attivata

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

            //attivit??
            cy.get('ultra-contratto-temporaneo-modal').find('nx-dropdown[formcontrolname="attivita"]').click()
            //cy.get('nx-dropdown-item[ng-reflect-value="'+attivita+'"]').click()
            cy.get('nx-dropdown-item').find('span').contains(attivita).click()

            //societ??
            cy.get('ultra-contratto-temporaneo-modal').find('input[formcontrolname="societa"]').type(societa)

            //conferma
            cy.get('ultra-contratto-temporaneo-modal')
                .find('span').contains('Conferma').parent('button')
                .should('have.attr', 'aria-disabled', 'false')
                .click()

            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
        })
    }

    static modificaSoluzione(ambito, soluzione) {
        ultraIFrame().within(() => {
            cy.get('ultra-dash-ambiti-istanze-table')
                .find('nx-icon[class*="' + ambito + '"]')
                .parents('tr')
                .find('nx-dropdown')
                .click()

            cy.wait(500)
            cy.get('nx-dropdown-item').contains(soluzione).should('be.visible').click() //seleziona Top

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
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

    /**
     * apre il men?? dot (tre puntini) di un determinato ambito
     * e seleziona la voce indicata
     * @param {fixture} ambito
     * @param {string} voce 
     */
    static dotMenu(ambito, voce) {
        ultraIFrame().within(() => {
            //apre il menu dot
            cy.get('ultra-dash-ambiti-istanze-table').find('nx-icon[class*="' + ambito + '"]')
                .parents('tr').find('nx-icon[name="ellipsis-h"]').wait(500).click()

            //seleziona la voce
            cy.get('ultra-istanza-action-menu').should('be.visible')
                .find('div').contains(voce).click()
        })
    }

    /**
     * modifica la durata, a popup gi?? aperto tramite dotMenu() 
     * @param {int} anni 
     */
    static modificaDurata(anni) {
        ultraIFrame().within(() => {
            //se la durata ?? superiore ad un anno clicca il relativo switch
            if (anni > 1) {
                cy.get('ultra-modifica-durata-modal').find('nx-switcher').click()

                //apre il men?? dropdown per la scelta degli anni
                cy.get('ultra-modifica-durata-modal').find('nx-dropdown').click()
                cy.wait(500)

                //sceglie l'anno
                cy.get('div[role="listbox"]').should('be.visible')
                    .find('span').contains(anni.toString() + " anni").click()

                //conferma
                cy.get('button').children('span').contains('CONFERMA').click()
            }

            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
            cy.wait(1000);
        })
    }


    static salvaQuotazione() {
        ultraIFrame().within(() => {
            const nomeQ = Dashboard.stringaRandom(10)
            cy.log('stringa generata: ' + nomeQ)
            cy.get('div[id="ambitiHeader"]')
                .contains('Salva').should('be.visible').click()

            cy.get('div[id="salvaBody"]').should('exist')
                .find('div[class="nx-formfield__input"]').should('be.visible')
                .eq(0).should('be.visible')
                .click().wait(500)
                .clear().wait(500)
                .type(nomeQ).wait(2000)

            cy.get('div[id="salvaBody"]').should('exist')
                .find('div[class="nx-formfield__input"]').should('be.visible')
                .eq(1).should('be.visible')
                .click().wait(500)
                .clear().wait(500)
                .type('Note alla quotazione di prova').wait(2000)

            // Verifica notifica verde quotazione salvata
            cy.get('div[id="salvaBody"]').should('exist')
                .find('span').contains('Salva').should('be.visible').click()

            // Verifica circoletto con spunta 
            cy.get('nx-message[class="header-title context-success"]').should('exist')
                .find('nx-icon[class="nx-message__icon nx-icon--s ndbx-icon nx-icon--check-circle ng-star-inserted"]').should('be.visible')

            // Verifica quotazione salvata 
            cy.get('nx-message[class="header-title context-success"]').should('exist')
                .find('span[class="quotazione-salvata"]').should('be.visible').invoke('text').then(val => {
                    cy.wrap(val)
                    cy.log('testo1: ' + val)
                })
            cy.get('nx-message[class="header-title context-success"]').should('exist')
                .find('span[class="nr-quotazione"]').should('be.visible').invoke('text').then(val => {
                    cy.wrap(val)
                    cy.log('testo2: ' + val)
                })

            cy.get('button[class="close-button"]').should('exist').click()
            cy.get('[class="nx-spinner__spin-block"]').should('not.be.visible')
            cy.wait(1000);
        })
    }

    static condividiQuotazione(daSelezionare) {
        ultraIFrame().within(() => {
            cy.get('div[id="ambitiHeader"]')
                .contains('Condividi').should('be.visible').click()

            cy.get('div[id="seleziona-copertina"]').should('exist')
                .find('p').contains('Allianz Ultra').should('have.class', 'titolo-copertina selected')
            cy.get('div[id="seleziona-copertina"]').should('exist')
                .find('p').contains('Animali domestici').should('have.class', 'titolo-copertina')
            cy.get('div[id="seleziona-copertina"]').should('exist')
                .find('p').contains('Catastrofi naturali').should('have.class', 'titolo-copertina')
            cy.get('div[id="seleziona-copertina"]').should('exist')
                .find('p').contains('Rc e Tutela legale').should('have.class', 'titolo-copertina')
            cy.get('div[id="seleziona-copertina"]').should('exist')
                .find('p').contains('Casa').should('have.class', 'titolo-copertina')

            // Selezione copertina
            cy.get('div[id="seleziona-copertina"]').should('exist')
                .find('p').contains(daSelezionare).should('have.class', 'titolo-copertina').click()

            // Consenso privacy
            cy.get('span').contains('Salva PDF').should('exist')
                .parent('button').should('have.attr', 'aria-disabled', 'true')

            cy.get('div[id="privacy-section"]').should('exist')
                .find('input[class="nx-switcher__input"]').should('have.attr', 'aria-checked', 'false').click({ force: true })

            cy.get('span').contains('Salva PDF').should('exist')
                .parent('button').should('have.attr', 'aria-disabled', 'false').click()

        })
    }

    /**
     * Lettura del premio totale
     * @param {string}} tipo - pu?? essere INIZIALE (default), BARRATO, SCONTATO 
     */
    static leggiPremioTot(tipo = 'INIZIALE') {
        ultraIFrame().within(() => {
            if (tipo.toUpperCase() == 'INIZIALE')    // Premio Iniziale non scontato
            {
                cy.log('**** PREMIO INIZIALE *****')
                cy.get('div[class="header-price-euro ng-star-inserted"]').should('be.visible')
                    .invoke('text').then(val => {
                        cy.wrap(val).as('premioTotDashboard')
                        cy.log('leggi premio tot INIZIALE: ' + val)
                    })
            }
            else if (tipo.toUpperCase() == 'SCONTATO')    // Premio totale dopo l'applicazione dello sconto
            {
                cy.log('**** PREMIO SCONTATO *****')
                cy.get('div[class="header-price-euro header-price-euro-wo-discount ng-star-inserted"]').should('be.visible')
                    .invoke('text').then(val => {
                        cy.wrap(val).as('premioTotDashboardScontato')
                        cy.log('leggi premio tot SCONTATO: ' + val)
                    })
            }
            else if (tipo.toUpperCase() == 'BARRATO')    // Premio totale iniziale barrato dopo l'applicazione dello sconto
            {
                cy.log('**** PREMIO BARRATO *****')
                cy.get('div[class="header-price-euro-w-discount ng-star-inserted"]').should('be.visible')
                    .invoke('text').then(val => {
                        cy.wrap(val).as('premioTotDashboardBarrato')
                        cy.log('leggi premio tot BARRATO: ' + val)
                    })
            }
        })
    }

    static leggiPremioTotBarrato() {
        ultraIFrame().within(() => {
            cy.get('div[class="header-price-euro-w-discount ng-star-inserted"]').should('be.visible')
                .invoke('text').then(val => {
                    cy.wrap(val).as('premioTotDashboardBarrato')
                })
        })
    }

    static verificaPremio(premioOld, premioNew, variazionePremio) {
        var impMin = 0
        var impMax = 0
        var premio = premioOld + variazionePremio
        impMin = (premio - 0.01)
        impMax = (premio + 0.01)

        cy.log("** Verifica premio **")
        cy.log('PremioOld: ' + premioOld + ' - PremioNew: ' + premioNew + ' - Delta: ' + variazionePremio)
        expect(premioNew).to.be.gte(impMin).and.be.lte(impMax)
    }

    /**
     * 
     * @param {json} ambito 
     */
    static sblocca(ambito) {
        ultraIFrame().within(() => {
            cy.get('ultra-dash-ambiti-istanze-table')
                .find('nx-icon[class*="' + ambito + '"]').should('be.visible')
                .parents('tr').first().find('button[class*="button-sblocca"]').should('be.visible')
                .click()
        })
    }

    static procediHome() {
        ultraIFrame().within(() => {
            cy.get('[id="dashTable"]').should('be.visible')
            cy.get('span').contains(' PROCEDI ', { matchCase: false })
                .scrollIntoView().should('be.visible').click()
        })
    }

    //#region preferiti
    /**
     * Seleziona il preferito passato come parametro
     * @param {string} tab >Allianz/Di agenzia/Personali
     * @param {string} nome > nome del preferito da selezionare
     */
    static SelezionaPreferiti(tab = "Allianz", nome) {
        cy.log("preferiti?")
        ultraIFrame().within(() => {
            switch (tab) {
                case "Personali":
                    cy.get('#tab_personali').click()
                    break;
                case "Di Agenzia":
                    cy.get('#tab_agenzia').click()
                    break;
                default:
                    cy.log("nessuna tab selezionata")
            }

            cy.get('[class^=description]').contains(nome).click()

            //attende il caricamento del preferito
            cy.intercept({
                method: 'GET',
                url: '**/premio'
            }).as('premio')

            cy.wait('@premio', { timeout: 60000 });
        })
    }

    static AggiungiAmbitiPreferiti(ambiti) {
        ultraIFrame().within(() => {
            cy.get('span').contains("Aggiungi ambito").click()
        })
        cy.wait(500)
    }

    /**
     * Apre la sezione dettagli degli ambiti, se non ?? gi?? aperta
     */
    static ApriDettagli() {
        ultraIFrame().within(() => {
            //verifica se la sezione dettagli ?? gi?? aperta
            cy.get('[class^=istanza-col]').then(($body) => {
                // synchronously query from body
                cy.log("dettagli: " + $body.find('[class^=istanza-solution-controls]').is(':visible'))
                // to find which element was created
                if (!$body.find('[class^=istanza-solution-controls]').is(':visible')) {
                    cy.get('span').contains('Dettaglio').click()
                }
                else {
                    cy.log('Sezione Dettagli gi?? aperta')
                }
            })
            /* cy.get('[class^=istanza-solution-controls]')
                .then(($dettagli) => {
                    var isOpen = $dettagli.is(':is.visible')
                    cy.log("Dettagli aperti: " + isOpen)
                    cy.wrap(isOpen).as('dettagli')
                }) */

            //se non ?? aperta la apre
            /* cy.get('@dettagli').then(($dettagliIsOpen) => {
                if (!$dettagliIsOpen) {
                    cy.get('span').contains('Dettaglio').click()
                }
                else {
                    cy.log('Sezione Dettagli gi?? aperta')
                }
            }) */
        })
    }
    //#endregion preferiti

    //#region Vincoli
    /**
     * Inserisce un vincolo per il contratto
     * @param {bool} pagamentoAnticipato 
     * @param {array} casa 
     * @param {string} scadenza 
     */
    static Vincolo(pagamentoAnticipato, casa, scadenza) {
        ultraIFrame().within(() => {
            //apre il popup per l'inserimento dei vincoli
            cy.get('span').contains('Contratto vincolato')
                .should('be.visible').click()

            //verifica che il popup sia aperto
            cy.get('ultra-contratto-vincolato-modal')
                .find('h1').contains('Gestione Vincoli')
                .should('be.visible')

            //imposta l'opzione dal selezionare in base alla modalit?? di pagamento indicata
            var pagamentoStr

            if (pagamentoAnticipato) {
                pagamentoStr = "con pagamento"
            }
            else {
                pagamentoStr = "senza pagamento"
            }

            cy.get('span').contains(pagamentoStr).click() //seleziona la modalit?? di pagamento indicata

            //verifica che venga aperta la sezione ambiti
            cy.get('#oggetto-assicurato-ambiti').should('be.visible')

            //Seleziona tutte le case indicate
            for (var i = 0; i < casa.length; i++) {
                cy.get('div').contains(casa[i])
                    .parent('div').find('nx-checkbox').click()
            }
        })

        ultraIFrame().within(() => {
            //clicca sulla textbox per la data di scadenza e
            //chiude il popup per la scelta della data prima di scrivere la data
            cy.wait(500)
            cy.get('input[placeholder="GG/MM/AAAA"]').focus()
                .type(scadenza, { force: true }).invoke('val')
                .then(text => cy.log(text))
        })

        //se presente chiude il popup del calendario
        ultraIFrame().then(($body) => {
            if ($body.find('.nx-datepicker-header').is(':visible')) {
                cy.log("is visible: " + $body.find('.nx-datepicker-header').is(':visible'))
                $body.find('.nx-datepicker-header').find('[name="close"]').click()
            }
        })

        ultraIFrame().within(() => {
            //conferma il vincolo
            cy.get('span').contains('CONFERMA')
                .should('be.visible').click()

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }
    //#endregion Vincoli

    //#region Convenzioni
    /**
     * inserisce la convenzione indicata. E' possibile indicare se chiudere il popup
     * una volta finito o lasciare il popup aperto per altre operazioni
     * @param {string} convenzione >convenzione da selezionare
     * @param {bool} chiudi >se chiudere o meno il popup alla fine delle operazioni (default: si)
     */
    static Convenzione(convenzione, chiudi = true) {
        ultraIFrame().within(() => {
            cy.get('nx-header-actions').find("span")
                .contains('Convenzioni').click()
        })

        //attesa
        // cy.intercept({
        //     method: 'GET',
        //     url: '**/convenzioni'
        // }).as('convenzioni')
        // cy.wait('@convenzioni', { timeout: 30000 });

        ultraIFrame().within(() => {
            cy.get('ultra-convenzioni-modal').should('be.visible')
                .find('#cercaConvenzione').find('input').type(convenzione)

            cy.get('ultra-convenzioni-modal').should('be.visible')
                .find('.lista-convenzioni').find('span').contains(convenzione)
                .parents('ultra-convenzione-item').find('nx-radio').click()

            cy.get('ultra-convenzioni-modal').should('be.visible')
                .find('ultra-info-convenzione').find('h3')
                .should('contain.text', convenzione)

            if (chiudi) {
                cy.get('ultra-convenzioni-modal').should('be.visible')
                    .find('button').children('span').contains('Conferma').click()

                cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
            }
        })
    }

    static VerificaAmbientiConvenzione(ambitiSelect, ambitiDeselect = null, ambitiDisable = null) {
        ultraIFrame().then(($body) => {
            if ($body.find('ultra-convenzioni-modal').is(':visible')) {
                cy.log('popup convenzioni gi?? aperto')
            }
            else {
                $body.find('nx-header-actions').find('span:contains("Convenzioni")').click()
            }
        })

        //verifica ambiti in popup Convenzioni
        ultraIFrame().within(() => {
            cy.get('ultra-convenzioni-modal').find('[data-testid="colonnaDettaglio"]')
                .should('be.visible').find('span').contains('personalizza')
                .click()

            cy.get('ultra-convenzioni-modal').find('.container-ambiti')
                .should('be.visible')

            for (var i = 0; i < ambitiSelect.length; i++) {
                cy.get('ultra-convenzioni-modal').find('.container-ambiti').scrollIntoView()
                    .find('p').contains(ambitiSelect[i]).parents('div[class*="istanzaAmbitoButton"]')
                    .should('have.attr', 'class').and('contain', 'selected')
            }

            if (ambitiDeselect != null) {
                for (var i = 0; i < ambitiDeselect.length; i++) {
                    cy.get('ultra-convenzioni-modal').find('.container-ambiti')
                        .find('p').contains(ambitiDeselect[i]).parents('div[class*="istanzaAmbitoButton"]')
                        .should('have.attr', 'class').and('contain', 'deselected')
                }
            }

            if (ambitiDisable != null) {
                for (var i = 0; i < ambitiDisable.length; i++) {
                    cy.get('ultra-convenzioni-modal').find('.container-ambiti')
                        .find('p').contains(ambitiDisable[i]).parents('div[class*="istanzaAmbitoButton"]')
                        .should('have.attr', 'class').and('contain', 'disabled')
                }
            }

            cy.get('ultra-convenzioni-modal').should('be.visible')
                .find('ultra-personalizzazione-convenzione')
                .find('a').contains('Annulla').click().wait(500)

            cy.get('ultra-convenzioni-modal').should('be.visible')
                .find('button').children('span').contains('Conferma').click()

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })

        //verifica convenzioni in tooltip dashboard
        ultraIFrame().within(() => {
            for (var i = 0; i < ambitiSelect.length; i++) {
                cy.get('ultra-dash-ambiti-istanze-table').first()
                    .should('be.visible').find('div').contains(ambitiSelect[i])
                    .parents('tr').find('.tooltip-text').contains('convenzione')
            }
        })
    }
    //#endregion Convenzioni
}

export default Dashboard