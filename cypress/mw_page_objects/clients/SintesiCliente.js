/// <reference types="Cypress" />
require('cypress-plugin-tab')

import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
import Common from '../common/Common.js'
import ToBar from '../common/TopBar.js'

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}


const RamiVari = {
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: 'Allianz Ultra Casa e Patrimonio',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: 'Allianz Ultra Casa e Patrimonio BMP',
    ALLIANZ_ULTRA_SALUTE: Cypress.env('isAviva') ? 'Ultra Salute' : 'Allianz Ultra Salute',
    ALLIANZ_ULTRA_IMPRESA: 'Allianz Ultra Impresa',
    ALLIANZ1_BUSINESS: 'Allianz1 Business',
    FASQUOTE_UNIVERSO_PERSONA: 'Fastquote Universo Persona',
    FASTQUOTE_UNIVERSO_SALUTE: 'FastQuote Universo Salute',
    FASTQUOTE_INFORTUNI_CIRCOLAZIONE: 'FastQuote Infortuni Da Circolazione',
    FASQUOTE_IMPRESA_SICURA: 'FastQuote Impresa Sicura',
    FASQUOTE_ALBERGO: 'FastQuote Albergo',
    GESTIONE_GRANDINE: 'Gestione Grandine',
    EMISSIONE: 'Emissione',
    deleteKey: function (keys) {
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP
        if (!keys.ALLIANZ_ULTRA_SALUTE) delete this.ALLIANZ_ULTRA_SALUTE
        if (!keys.ALLIANZ_ULTRA_IMPRESA) delete this.ALLIANZ_ULTRA_IMPRESA
        if (!keys.ALLIANZ1_BUSINESS) delete this.ALLIANZ1_BUSINESS
        if (!keys.FASQUOTE_UNIVERSO_PERSONA) delete this.FASQUOTE_UNIVERSO_PERSONA
        if (!keys.FASTQUOTE_UNIVERSO_SALUTE) delete this.FASTQUOTE_UNIVERSO_SALUTE
        if (!keys.FASTQUOTE_INFORTUNI_CIRCOLAZIONE) delete this.FASTQUOTE_INFORTUNI_CIRCOLAZIONE
        if (!keys.FASQUOTE_IMPRESA_SICURA) delete this.FASQUOTE_IMPRESA_SICURA
        if (!keys.FASQUOTE_ALBERGO) delete this.FASQUOTE_ALBERGO
        if (!keys.GESTIONE_GRANDINE) delete this.GESTIONE_GRANDINE
    }
}

class SintesiCliente {

    /**
     * Funzione che attende il caricamento della Sintesi Cliente dopo aver cliccato il primo risultato riportato dalla ricerca
     */
    static wait() {
        cy.intercept({
            method: 'POST',
            url: '**/clients/**'
        }).as('pageClient');
        cy.intercept('POST', '**/graphql', (req) => {
            // Queries
            aliasQuery(req, 'fastQuoteProfiling')
            aliasQuery(req, 'getScopes')
        })
        cy.get('lib-client-item').should('be.visible')
        cy.get('lib-client-item').first().click()
        cy.wait('@pageClient', { requestTimeout: 60000 });
        cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')
    }

    static checkTabs() {
        // Verifica Tab clients corretti
        const tabProfile = [
            'SINTESI CLIENTE',
            'DETTAGLIO ANAGRAFICA',
            'PORTAFOGLIO',
            'ARCHIVIO CLIENTE'
        ]
        cy.get('app-client-profile-tabs').find('a').should('have.length', 4).each(($checkTabProfile, i) => {
            expect($checkTabProfile.text().trim()).to.include(tabProfile[i]);
        })
    }

    //#region Situazione Cliente
    static checkSituazioneCliente() {
        cy.get('lib-container').find('app-client-resume:visible').then(($situazione) => {
            const check = $situazione.find(':contains("Situazione cliente")').is(':visible')
            if (check) {
                if ($situazione.find('app-section-title .title').length > 0) {
                    cy.wrap($situazione).should('contain', 'Situazione cliente')
                    cy.wrap($situazione).find('.content').should(($subtitle) => {
                        expect($subtitle).to.contain('Totale premi annui')
                        expect($subtitle).to.contain('Totale danni')
                        if (!Cypress.env('isAviva'))
                            expect($subtitle).to.contain('Vita puro rischio')
                        expect($subtitle).to.contain('Polizze attive')
                    })
                }
            } else
                assert.fail('Sintesi Cliente non è presente')
        })
    }
    //#endregion

    //#region Fastquote
    static checkFastQuoteUltra() {
        cy.get('app-fast-quote').find('app-scope-element').should('be.visible')
        cy.get('lib-container').find('app-client-resume:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Fast Quote")').is(':visible')
            if (check) {
                cy.wrap($fastquote).should('contain', 'Fast Quote')
                cy.wrap($fastquote).find('.subtitle').should('contain', 'Inserisci i dati richiesti per lanciare la quotazione')
                //#region Presenza link sul container Fasquote
                cy.get($fastquote).find('.content').then(($iconBottom) => {
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Preferiti"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Salva"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Condividi"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Configura"]').should('be.visible')
                })
                //#endregion

                //#region Verifica presenza tabs(Ultra Auto Albergo)
                const tabFastQuote = [
                    'Ultra',
                    'Auto',
                    'Albergo'
                ]
                cy.get('nx-tab-header').first().find('button').each(($checkTabFastQuote, i) => {
                    expect($checkTabFastQuote.text().trim()).to.include(tabFastQuote[i]);
                })
                //#endregion

                //#region Verifica presenza SubTab Ultra
                cy.get('nx-tab-header').find('button').contains('Ultra').click()
                var tabUltraFastQuote = [
                    'Casa e Patrimonio',
                    'Salute'
                ]
                if (Cypress.env('isAviva'))
                    tabUltraFastQuote = ['Salute']
                cy.get('app-ultra-parent-tabs').find('nx-tab-header').each(($checkTabUltraFastQuote, i) => {
                    expect($checkTabUltraFastQuote.text().trim()).to.include(tabUltraFastQuote[i]);
                })
                //#endregion

                //#region SubTab Casa e Patrimonio
                if (!Cypress.env('isAviva')) {

                    cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Casa e Patrimonio').click()
                    const scopesUltra = [
                        'Fabbricato',
                        'Contenuto',
                        'Catastrofi naturali',
                        'Responsabilità',
                        'Tutela legale',
                        'Animali domestici',
                    ]
                    cy.get('app-ultra-fast-quote').find('.scope-name').each(($checkScopes, i) => {
                        expect($checkScopes.text().trim()).to.include(scopesUltra[i]);
                    })
                    cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                        cy.wrap($scopeIcon).click()
                    })
                    cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                        cy.wrap($scopeIcon).click()
                    })

                    //#endregion

                    //#region Link Vai a preferiti(Ultra - Casa e patrimonio)
                    cy.get('app-ultra-fast-quote').find('.favorites-cta').contains('Vai a Preferiti').click()
                    Common.canaleFromPopup()
                    getIFrame().find('#dashBody').should('be.visible')
                    getIFrame().find('img[src="./assets/img/allianz-logo-casa.png"]').should('be.visible')
                    getIFrame().find('button:contains("PROCEDI")').should('be.visible')
                    cy.get('a').contains('Clients').click({ force: true })
                    //#endregion
                }

                //#region SubTab Salute
                cy.intercept('POST', '**/graphql', (req) => {
                    aliasQuery(req, 'getScopes')
                })
                cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Salute').click()
                cy.wait('@gqlgetScopes', { requestTimeout: 60000 })
                var scopesSalute = [
                    'Spese mediche',
                    'Diaria da ricovero',
                    'Invalidità permanente da infortunio',
                    'Invalidità permanente da malattia'
                ]
                if (Cypress.env('isAviva'))
                    var scopesSalute = [
                        'Spese mediche',
                        'Diaria da ricovero',
                        'Invalidità permanente da malattia'
                    ]
                cy.get('app-ultra-health-fast-quote').find('.scope-name').each(($checkScopes, i) => {
                    expect($checkScopes.text().trim()).to.include(scopesSalute[i]);
                })
                cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                    cy.wrap($scopeIcon).click()
                })
                cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                    cy.wrap($scopeIcon).click()
                })
                //#endregion

                //#region Link Vai a preferiti(Ultra - Salute)
                cy.get('app-ultra-health-fast-quote').find('.favorites-cta').contains('Vai a Preferiti').click()
                Common.canaleFromPopup()
                getIFrame().find('#dashBody').should('be.visible')
                if (!Cypress.env('isAviva'))
                    getIFrame().find('img[src="./assets/img/allianz-logo-salute.png"]').should('be.visible')
                else
                    getIFrame().find('#tab_agenzia').should('be.visible')
                getIFrame().find('button:contains("PROCEDI")').should('be.visible')
                cy.get('a').contains('Clients').click({ force: true })
                //#endregion
            } else
                assert.fail('FastQuote non è presente')
        })
    }

    static checkFastQuoteAuto() {
        cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')

        cy.get('lib-container').find('app-client-resume:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Fast Quote")').is(':visible')
            if (check) {
                cy.intercept('POST', '**/graphql', (req) => {
                    aliasQuery(req, 'dataSettings')
                })
                cy.get('nx-tab-header').find('button').contains('Auto').click()
                cy.wait('@gqldataSettings', { requestTimeout: 60000 })
                cy.get('app-new-auto-fast-quote').contains('Tipo veicolo').should('be.visible')
                cy.get('app-new-auto-fast-quote').contains('Targa').should('be.visible')
                if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva')) {
                    cy.get('app-new-auto-fast-quote').contains('Agenzia').should('be.visible')
                }
                cy.get('app-new-auto-fast-quote').contains('Calcola').should('be.visible')
            } else
                assert.fail('FastQuote non è presente')

        })
    }

    static checkFastQuoteAlbergo() {
        cy.get('lib-container').find('app-client-resume:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Fast Quote")').is(':visible')
            if (check) {
                cy.intercept('POST', '**/graphql', (req) => {
                    aliasQuery(req, 'dataSettings')
                })
                //#region Tab Albergo
                cy.get('nx-tab-header').find('button').contains('Albergo').click()
                cy.get('app-hotel-fast-quote').contains('Cerca').should('be.visible')
                cy.get('app-hotel-fast-quote').contains('Attività svolta').should('be.visible')
                cy.get('app-hotel-fast-quote').contains('Apertura della struttura').should('be.visible')
                cy.get('app-hotel-fast-quote').contains('Comune di ubicazione').should('be.visible')
                cy.get('app-hotel-fast-quote').contains('Calcola').should('be.visible')
                //#endregion
            } else
                assert.fail('FastQuote non è presente')

        })
    }

    /**
     * Clicca sul pulsante 'Vai a Preferiti' nella scheda Fastquote
     */
    static VaiPreferiti() {
        cy.get('div').contains('Vai a Preferiti').click()
    }
    //#endregion

    //#region Emissioni
    static checkCardsEmissioni() {
        cy.get('app-client-resume app-client-resume-emissions').then(($emissione) => {
            if ($emissione.find('app-section-title .title').length > 0) {
                cy.wrap($emissione).should('contain', 'Emissioni')
                const tabCard = [
                    'Auto',
                    'Rami vari',
                    'Vita'
                ]
                cy.get('app-kpi-dropdown-card').find('.label').each(($checkScopes, i) => {
                    expect($checkScopes.text().trim()).to.include(tabCard[i]);
                })
            }
        })
    }

    /**
     * Selezione emissione Auto da scheda Emissioni
     * @param {json menu auto} menuAuto 
     */
    static emissioneAuto(menuAuto) {
        cy.intercept({
            method: 'POST',
            url: '**/Auto/GestioneLibriMatricolaDA/**'
        }).as('LibriMatricolaDA')
        cy.get('app-kpi-dropdown-card[lob="motor"]').click() //apre il menù Motor

        cy.log('Array menù auto: ' + menuAuto.length)
        //scorre i sottomenù fino aselezionare l'opzione richiesta
        for (var i = 0; i < menuAuto.length; i++) {
            cy.log(menuAuto[i])
            cy.get('button[role="menuitem"]').contains(menuAuto[i])
                .should('be.visible').click()
        }

        //seleziona la prima agenzia dal poup "canale con cui vuoi procedere"
        Common.canaleFromPopup()
        cy.wait('@LibriMatricolaDA', { requestTimeout: 50000 });
    }

    /**
     * seleziona la prima agenzia dal popup "seleziona il canale" in Matrix
     */
    static selezionaPrimaAgenzia() {
        cy.get('[ngclass="agency-row"]')
            .should('be.visible')
            .first().click()

        cy.wait(2000)
    }

    //#region Links Card Auto
    static clickAuto() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Auto")').is(':visible')
            if (check)
                cy.get('.card-container').find('app-kpi-dropdown-card').contains('Auto').click()
            else
                assert.fail('Card Auto non è presente')
        })
    }

    /**
     * Emissione Preventivo Motor
     * ! DEVE ESSERE PRIMA UTILIZZATO IL METODO clickAuto()
     */
    static clickPreventivoMotor() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Preventivo Motor').click()
        cy.intercept({
            method: 'POST',
            url: '**/assuntivomotor/**'
        }).as('getMotor');
        Common.canaleFromPopup()
        cy.wait('@getMotor', { requestTimeout: 50000 });
        getIFrame().find('button:contains("Calcola"):visible')
    }


    static clickFlotteConvenzioni() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Flotte e convenzioni').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickAssunzioneGuidata() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Assunzione guidata').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickVeicoliEpoca() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Veicoli d\'epoca').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickLibriMatricola() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Libri matricola').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="Nuovo"]').invoke('attr', 'value').should('equal', 'Nuovo')
    }

    static clickKaskoARDChilometro() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD al Chilometro').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickKaskoARDGiornata() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Giornata').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickKaskoARDVeicolo() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Veicolo').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickPolizzaBase() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Polizza aperta').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Polizza base').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickCoassicurazione() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Coassicurazione').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickNuovaPolizza() {
        cy.wait(2000)
        if (!Cypress.env('isAviva'))
            cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        else
            cy.get('.cdk-overlay-container').find('button').contains('Natanti').click()

        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickNuovaPolizzaGuidata() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza guidata').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickNuovaPolizzaCoassicurazione() {
        cy.wait(2000)
        if (!Cypress.env('isAviva'))
            cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        else
            cy.get('.cdk-overlay-container').find('button').contains('Natanti').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza Coassicurazione').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }
    //#endregion

    //#region Links Card Rami Vari
    static clickRamiVari() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Rami vari")').is(':visible')
            if (check)
                cy.get('.card-container').find('app-kpi-dropdown-card').contains('Rami vari').click()
            else
                assert.fail('Card Rami Vari non è presente')
        })
    }

    static clickAllianzUltraCasaPatrimonio() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Casa e Patrimonio').click()
        cy.wait(2000)
        Common.canaleFromPopup()
        getIFrame().find('span:contains("PROCEDI"):visible')
    }

    static clickAllianzUltraCasaPatrimonioBMP() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Casa e Patrimonio BMP').click()
        cy.wait(2000)
        cy.intercept({
            method: 'GET',
            url: '**/fonti'
        }).as('getFonti');
        Common.canaleFromPopup()
        cy.wait('@getFonti', { requestTimeout: 50000 });
        getIFrame().find('img[src="./assets/img/allianz-logo-casa.png"]').should('be.visible')
        getIFrame().find('span:contains("PROCEDI"):visible')
    }

    static clickAllianzUltraSalute() {
        cy.wait(2000)
        if (!Cypress.env('isAviva')) {
            cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Salute').click()
        } else
            cy.get('.cdk-overlay-container').find('button').contains('Ultra Salute').click()

        cy.wait(2000)
        Common.canaleFromPopup()
        getIFrame().find('span:contains("PROCEDI"):visible')
    }

    static clickAllianz1Business() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz1 Business').click()
        cy.wait(2000)
        Common.canaleFromPopup()
        getIFrame().find('a:contains("EMETTI QUOTAZIONE"):visible')
        getIFrame().find('a:contains("AVANTI"):visible')
    }

    static clickFastQuoteUniversoSalute() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Universo Salute').click()
        cy.wait(2000)
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickFastQuoteInfortuniDaCircolazione() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Infortuni Da Circolazione').click()
        cy.wait(2000)
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    static clickFastQuoteImpresaSicura() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Impresa Sicura').click()
        cy.wait(2000)
        cy.intercept({
            method: 'GET',
            url: '**/Auto/**'
        }).as('getAuto');
        Common.canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 50000 });
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
    }

    static clickFastQuoteAlbergo() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Albergo').click()
        cy.wait(2000)
        cy.in
        Common.canaleFromPopup()
        cy.wait(8000)
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
    }

    static clickGestioneGrandine() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Gestione Grandine').click()
        cy.wait(2000)
        Common.canaleFromPopup()
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
    }

    static clickPolizzaNuova() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Polizza nuova').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="Home"]').invoke('attr', 'value').should('equal', 'Home')
        getIFrame().find('input[value="Indietro"]').invoke('attr', 'value').should('equal', 'Indietro')
        getIFrame().find('input[value="Avanti"]').invoke('attr', 'value').should('equal', 'Avanti')
        getIFrame().find('input[value="Uscita"]').invoke('attr', 'value').should('equal', 'Uscita')
    }
    //#endregion

    //#region Links Card Vita
    static clickVita() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Vita")').is(':visible')
            if (check)
                cy.get('.card-container').find('app-kpi-dropdown-card').contains('Vita').click()
            else
                assert.fail('Card Vita non è presente')
        })
    }
    static clickSevizioConsulenza() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Accedi al servizio di consulenza').click()
        cy.wait(2000)
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('digitalAgencyLink')) {
                req.alias = 'gqlDigitalAgencyLink'
            }
        })

        Common.canaleFromPopup()
        cy.wait('@gqlDigitalAgencyLink', { requestTimeout: 30000 })
        cy.wait(20000)
        getIFrame().find('input[value="Avanti"]').should('be.visible').invoke('attr', 'value').should('equal', 'Avanti')
        getIFrame().find('input[value="Indietro"]:visible').invoke('attr', 'value').should('equal', 'Indietro')
    }
    //#endregion

    //#endregion

    //#region Contratti in Evidenza

    /**
     * Verifica l'aggancio alla pagina del primo contratto
     */
    static checkContrattiEvidenza() {
        cy.get('lib-container').find('app-proposals-in-evidence:visible').then(($contratto) => {
            const check = $contratto.find(':contains("Contratti in evidenza")').is(':visible')
            if (check) {
                cy.wrap($contratto).find('lib-da-link').first().click()
                Common.canaleFromPopup()
                getIFrame().find('#navigation-area:contains("Contratto"):visible')
            } else
                assert.fail('Contratti in evidenza')
        })
    }
    //#endregion

    static cancellaCliente() {
        cy.get('nx-icon[aria-label="Open menu"]').click();
        cy.contains('Cancellazione cliente').click();
        cy.contains('Cancella cliente').click();
        cy.contains('Ok').click();
    }

    static emettiPleinAir() {
        cy.get('nx-icon[aria-label="Open menu"]').click();
        cy.contains('PLEINAIR').click();
        getIFrame().find('#PageContentPlaceHolder_Questionario1_4701-15_0_i').select('NUOVA ISCRIZIONE')
        getIFrame().find('#PageContentPlaceHolder_Questionario1_4701-40_0_i').select('FORMULA BASE')

        if (!Cypress.env('monoUtenza'))
            cy.intercept({
                method: 'POST',
                url: '**/dacontabilita/**'
            }).as('dacontabilita');
        else cy.intercept({
            method: 'GET',
            url: '**/dacontabilita/**'
        }).as('dacontabilita');

        getIFrame().find('#ButtonQuestOk').click().wait(10000)
        cy.wait('@dacontabilita', { requestTimeout: 60000 })

        getIFrame().find('#TabVarieInserimentoTipoPagamento').click()
        getIFrame().find('li').contains("Contanti").click()
        getIFrame().find('#FiltroTabVarieInserimentoDescrizione').type("TEST AUTOMATICO")
        getIFrame().find('#TabVarieInserimentoCassetto').click()
        getIFrame().find('li').contains("Cassa").first().click()

        cy.intercept({
            method: 'POST',
            url: /QuestionariWeb/
        }).as('questionariWeb');

        getIFrame().find('#TabVarieInserimentoButton').click().wait(8000)

        cy.wait('@questionariWeb', { requestTimeout: 60000 })

        getIFrame().within(($frame) => {
            $frame.find('#ButtonQuestOk').click()
        })
    }

    /**
     * @param {Array.String} labels - labels dei documenti da verificare in folder
     */
    static verificaInFolder(labels) {
        cy.get('nx-icon[aria-label="Open menu"]').click()
        cy.contains('folder').click()
        Common.canaleFromPopup()
        getIFrame().find('span[class="k-icon k-plus"]:visible').click()
        getIFrame().find('span[class="k-icon k-plus"]:first').click()
        debugger
        cy.wrap(labels).each((label, i, array) => {
            getIFrame().find('span').contains(label).click()
        })
    }

    static verificaDatiSpallaSinistra(cliente) {
        //Verifica indirizzo
        cy.get('.client-name').should('contain.text', String(cliente.ragioneSociale).toUpperCase().replace(",", ""))
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.toponimo)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.indirizzo)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.numCivico)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.cap)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.citta)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.provincia)
        //Verifica email
        cy.get('nx-icon[class*=mail]').parent().get('div').should('contain.text', String(cliente.email).toLowerCase())
    }

    static checkAtterraggioSintesiCliente(cliente) {
        cy.get('app-client-profile-tabs').find('a').contains('SINTESI CLIENTE').should('have.class', 'active')
        cy.get('.client-name').should('contain.text', String(cliente).toUpperCase().replace(",", ""))
    }

    static clickClientsBriciolaPane() {
        cy.contains("Clients").should('exist').click({ force: true })
    }

    static checkAtterraggioName(cliente) {
        cy.get('app-client-profile-tabs').find('a').contains('SINTESI CLIENTE').should('have.class', 'active')
        cy.get('.client-name').should('contain.text', cliente)
    }

    static retriveClientNameAndAddress() {
        return new Cypress.Promise((resolve, reject) => {
            let client = { name: '', address: '' }
            cy.get('div[class*=client-name]').invoke('text')
                .then(currentClientName => {
                    client.name = currentClientName

                    cy.log('Retrived Client Name : ' + client.name)
                })
            cy.get('app-link-client-resume').find('a:first')
                .find('div[class="value ng-star-inserted"]').invoke('text').then((currentAddress) => {
                    client.address = currentAddress.split('-')[0].replace(',', '').trim()
                    cy.log('Retrived Client Address : ' + client.address)
                })

            resolve(client);
        });
    }

    static retriveUrl() {
        return new Cypress.Promise((resolve) => {
            resolve(cy.url())
        })
    }

    /**
     * Funzione che carica direttamente l'url del cliente
     * @param {boolean} fullUrl default a true, viene passato l'url completo, altrimenti viene generato
     * @param {string} param viene passato l'url completo
     */
    static visitUrlClient(param, fullUrl = true) {
        cy.intercept({
            method: 'POST',
            url: '**/clients/**'
        }).as('pageClient');

        if (fullUrl)
            cy.visit(param)
        else {
            if (!Cypress.env('monoUtenza')) {
                if (Cypress.env('currentEnv') === 'TEST')
                    cy.visit(Cypress.env('baseUrlTest') + 'clients/client/' + param)
                else
                    cy.visit(Cypress.env('baseUrlPreprod') + 'clients/client/' + param)
            } else {
                if (Cypress.env('currentEnv') === 'TEST')
                    cy.visit(Cypress.env('urlSecondWindowTest') + 'clients/client/' + param)
                else
                    cy.visit(Cypress.env('urlSecondWindowPreprod') + 'clients/client/' + param)

            }
        }

        cy.wait('@pageClient', { requestTimeout: 60000 });
        cy.get('app-scope-element', { timeout: 120000 }).should('exist').and('be.visible')
    }

    /**
     * Verifica se la Scheda del Cliente ha presente o meno il Numero o la Mail principale
     * @param {string} contactType tipo di contatto a scelta tra 'numero' e 'mail'
     * @returns true se presente, false se assente
     */
    static checkContattoPrincipale(contactType) {
        return new Promise((resolve, reject) => {
            cy.get('body')
                .then(body => {
                    let missingValue;
                    (contactType === 'numero') ? missingValue = 'Aggiungi numero principale' : missingValue = ' Aggiungi mail principale '
                    if (body.find('.scrollable-sidebar-content').find('div:contains("' + missingValue + '")').is(':visible'))
                        resolve(false)
                    else
                        resolve(true)
                })
        })
    }

    /**
     * Aggiunge Contatto principale (a scelta tra 'numero' o 'mail') 
     * @param {string} contactType tipo di contatto a scelta tra 'numero' e 'mail'
     */
    static aggiungiContattoPrincipale(contactType) {
        let missingValue;
        (contactType === 'numero') ? missingValue = ' Aggiungi numero principale ' : missingValue = ' Aggiungi mail principale '
        cy.get('div.da-link.ng-star-inserted').should('be.visible').find('div:contains("' + missingValue + '")').click()

    }

    static back() {
        cy.intercept({
            method: 'POST',
            url: '**/clients/**'
        }).as('pageClient');
        cy.intercept('POST', '**/graphql', (req) => {
            // Queries
            aliasQuery(req, 'clientContractValidation')
            aliasQuery(req, 'fastQuoteProfiling')
            aliasQuery(req, 'getScopes')

        })
        cy.get('a').contains('Clients').click().wait(5000)
        cy.wait('@pageClient', { requestTimeout: 60000 });
        cy.wait('@gqlclientContractValidation', { requestTimeout: 60000 })
        cy.wait('@gqlfastQuoteProfiling', { requestTimeout: 60000 })
        cy.wait('@gqlgetScopes', { requestTimeout: 60000 })
        cy.get('app-fast-quote').should('be.visible')
        cy.get('app-fast-quote').find('nx-tab-group').should('be.visible')
        cy.get('app-fast-quote').find('app-scope-element').should('be.visible')
    }

    /**
     * Verifica la presenza della voce specificata cliccando sui 3 puntini in spalla sinistra
     * @param {String} voce etichetta da verifica cliccando sui 3 puntini in spalla sinistra
     */
    static checkVociSpallaSinistra(voce) {
        cy.get('nx-icon[aria-label="Open menu"]').click()
        cy.contains(voce).should('exist').and('be.visible')
        //per chiudere il menu contestuale
        cy.get('nx-icon[aria-label="Open menu"]').click()
    }

    /**
     * Emette Report Profilo Vita cliccando sui 3 puntini della spalla sx in atterraggio su Sintesi Cliente
     */
    static emettiReportProfiloVita(agenzia, errorMessage = false) {
        cy.intercept('POST', '**/graphql', (req) => {
            aliasQuery(req, 'clientReportLifePdf')
        })

        debugger
        cy.get('nx-icon[aria-label="Open menu"]').click().wait(1000)
        cy.contains('Report Profilo Vita').should('exist').and('be.visible').click()

        //NON DEVE COMPARIRE L'ERRORE
        if (!errorMessage) {
            cy.window().then(win => {
                cy.stub(win, 'open').callsFake((url, target) => {
                    expect(target).to.be.undefined
                    // call the original `win.open` method
                    // but pass the `_self` argument
                    return win.open.wrappedMethod.call(win, url, '_self')
                }).as('open')
            })

            //Finestra di disambiguazione
            cy.get('nx-modal-container').find('.agency-row').contains(agenzia).first().click().wait(3000)
            //cy.get('nx-modal-container').find('.agency-row').first().click().wait(3000)
            cy.get('@open')

            cy.wait('@gqlclientReportLifePdf')
                .its('response.body.data')
                .should('have.property', 'clientReportLifePdf')
        }
        //DEVE COMPARIRE L'ERRORE
        else {
            //Finestra di disambiguazione
            cy.get('nx-modal-container').find('.agency-row').contains(agenzia).first().click().wait(3000)
        }
    }

    static checkLinksFromAuto() {
        if (!Cypress.env('isAviva')) {
            cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first().should('exist').and('be.visible').within(() => {
                const linksAuto = [
                    'Emissione',
                    'Prodotti particolari',
                    'Passione BLU'
                ]
                cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                    expect($buttonLinks).to.contain(linksAuto[i])
                })
            })
        } else {
            //AVIVA
            cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first().should('exist').and('be.visible').within(() => {
                const linksAuto = [
                    'Emissione',
                    'Natanti',
                ]
                cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                    expect($buttonLinks).to.contain(linksAuto[i])
                })
            })
        }

    }

    static checkLinksFromRamiVari(keys) {
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first().should('exist').and('be.visible').within(() => {

            RamiVari.deleteKey(keys)
            const linksRamiVari = Object.values(RamiVari)
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksRamiVari[i])
            })
        })
    }

    static checkLinksFromVita() {
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first().should('exist').and('be.visible').within(() => {
            const linksPassioneBlu = [
                'Accedi al servizio di consulenza'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksPassioneBlu[i])
            })
        })
    }

    static checkLinksFromAutoOnEmissione() {
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            const linksEmissione = [
                'Preventivo Motor',
                'Flotte e convenzioni'
            ]
            if (Cypress.env('isAviva'))
                linksEmissione.pop()
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksEmissione[i])
            })
        })
    }

    static checkLinksFromAutoOnProdottiParticolari() {
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            const linksProdottiParticolari = [
                'Assunzione guidata (con cod. di autorizz.)',
                'Veicoli d\'epoca durata 10 giorni',
                'Libri matricola',
                'Kasko e ARD per \'Dipendenti in Missione\'',
                'Polizza aperta',
                'Coassicurazione'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksProdottiParticolari[i])
            })
        })
    }

    static checkLinksFromAutoOnPassioneBlu() {
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            var linksPassioneBlu = [
                'Nuova polizza',
                'Nuova polizza guidata',
                'Nuova polizza Coassicurazione'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksPassioneBlu[i])
            })
        })
    }
    static checkLinksFromAutoOnNatanti() {
        cy.get('.cdk-overlay-container').find('button').contains('Natanti').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            var linksPassioneBlu = [
                'Nuova polizza',
                'Nuova polizza Coassicurazione'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksPassioneBlu[i])
            })
        })
    }

    static checkLinksFromRamiVariOnEmissione() {
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            const linksEmissioneRamiVari = [
                'Polizza nuova'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksEmissioneRamiVari[i])
            })
        })
    }

    static checkLinksFromAutoOnProdottiParticolariKasko() {
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD per \'Dipendenti in Missione\'').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(2).should('exist').and('be.visible').within(() => {
            const linksProdottiParticolariKasko = [
                'Kasko e ARD al Chilometro',
                'Kasko e ARD a Giornata',
                'Kasko e ARD a Veicolo'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksProdottiParticolariKasko[i])
            })
        })
    }

    static checkLinksFromAutoOnProdottiParticolariPolizzaAperta() {
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.get('.cdk-overlay-container').find('button').contains('Polizza aperta').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(2).should('exist').and('be.visible').within(() => {
            const linksProdottiParticolariPolizzaAperta = [
                'Polizza base'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksProdottiParticolariPolizzaAperta[i])
            })
        })
    }
}
export default SintesiCliente