/// <reference types="Cypress" />
require('cypress-plugin-tab')

import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
import Common from '../common/Common.js'

//#region Iframe
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const matrixFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion

/**
 * Enum Cards Emissioni
 * @readonly
 * @enum {string}
 */
const CardsEmissioni = {
    AUTO: 'Auto',
    RAMIVARI: 'Rami vari',
    VITA: 'Vita',
    deleteKey: function (keys) {
        if (!keys.AUTO) delete this.AUTO
        if (!keys.RAMIVARI) delete this.RAMIVARI
        if (!keys.VITA) delete this.VITA

    }
}
/**
 * Enum Voci Emissione Rami Vari
 * @readonly
 * @enum {string}
 */
const RamiVari = {
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Casa e Patrimonio 2022' : 'Allianz Ultra Casa e Patrimonio 2022',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Casa e Patrimonio' : 'Allianz Ultra Casa e Patrimonio',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Casa e Patrimonio BMP' : 'Allianz Ultra Casa e Patrimonio BMP',
    ALLIANZ_ULTRA_SALUTE: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Salute' : 'Allianz Ultra Salute',
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
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP
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

/**
 * Enum Voci Emissione Auto (con accesso a subMenu)
 * @readonly
 * @enum {string}
 */
const Auto = {
    EMISSIONE: 'Emissione',
    PRODOTTI_PARTICOLARI: 'Prodotti particolari',
    PASSIONE_BLU: (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) ? 'Passione BLU' : 'Natanti',
}

/**
 * Enum Links Emissione Auto
 * @readonly
 * @enum {Object}
 */
const linksEmissioneAuto = {
    EMISSIONE: {
        PREVENTIVO_MOTOR: 'Preventivo Motor',
        SAFE_DRIVE_AUTOVETTURE: 'Safe Drive Autovetture',
        FLOTTE_CONVENZIONI: 'Flotte e convenzioni',
        deleteKey: function (keys) {
            if (!keys.PREVENTIVO_MOTOR) delete this.PREVENTIVO_MOTOR
            if (!keys.FLOTTE_CONVENZIONI || Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.FLOTTE_CONVENZIONI
            if (!keys.SAFE_DRIVE_AUTOVETTURE) delete this.SAFE_DRIVE_AUTOVETTURE
        }
    },
    PRODOTTI_PARTICOLARI: {
        ASSUNZIONE_GUIDATA: 'Assunzione guidata (con cod. di autorizz.)',
        VEICOLI_EPOCA: 'Veicoli d\'epoca durata 10 giorni',
        LIBRI_MATRICOLA: 'Libri matricola',
        KASKO_ARD_DIPENDENDI_MISSIONE: 'Kasko e ARD per \'Dipendenti in Missione\'',
        POLIZZA_APERTA: 'Polizza aperta',
        COASSICURAZIONE: 'Coassicurazione',
        deleteKey: function (keys) {
            if (!keys.ASSUNZIONE_GUIDATA) delete this.ASSUNZIONE_GUIDATA
            if (!keys.VEICOLI_EPOCA) delete this.VEICOLI_EPOCA
            if (!keys.LIBRI_MATRICOLA) delete this.LIBRI_MATRICOLA
            if (!keys.COASSICURAZIONE) delete this.COASSICURAZIONE
        }
    },
    PASSIONE_BLU: {
        NUOVA_POLIZZA: 'Nuova polizza',
        NUOVA_POLIZZA_GUIDATA: 'Nuova polizza Guidata',
        NUOVA_POLIZZA_COASSICURAZIONE: 'Nuova polizza Coassicurazione',
        deleteKey: function (keys) {
            if (!keys.NUOVA_POLIZZA) delete this.NUOVA_POLIZZA
            if (!keys.NUOVA_POLIZZA_GUIDATA || Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.NUOVA_POLIZZA_GUIDATA
            if (!keys.NUOVA_POLIZZA_COASSICURAZIONE) delete this.NUOVA_POLIZZA_COASSICURAZIONE
        }
    }
}

/**
 * @class
 * @classdesc Classe per utilizzare la Sintesi Cliente in Matrix Web
 * @author Andrea 'Bobo' Oboe & Kevin Pusateri
 */
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
        cy.wait('@pageClient', { timeout: 60000 });
        cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')
    }

    /**
     * Verifica la presenza dei Tab Sintesi Cliente, Dettaglio Anagrafica, Portafoglio e Archivio Cliente
     */
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

    /**
     * Effettua un check sulla parte di Situazione Cliente
     */
    static checkSituazioneCliente() {
        cy.get('lib-container').find('app-client-resume:visible').then(($situazione) => {
            const check = $situazione.find(':contains("Situazione cliente")').is(':visible')
            if (check) {
                if ($situazione.find('app-section-title .title').length > 0) {
                    cy.wrap($situazione).should('contain', 'Situazione cliente')
                    cy.wrap($situazione).find('.content').should(($subtitle) => {
                        expect($subtitle).to.contain('Totale premi annui')
                        expect($subtitle).to.contain('Totale danni')
                        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
                            expect($subtitle).to.contain('Vita puro rischio')
                        expect($subtitle).to.contain('Polizze attive')
                    })
                }
            } else
                assert.fail('Sintesi Cliente non è presente')
        })
    }

    /**
     * Click sul Tab Sintesi Cliente
     */
    static clickTabSintesiCliente() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client') || req.body.operationName.includes('fastQuoteProfiling')) {
                req.alias = 'gqlClient'
            }
        });

        cy.contains('SINTESI CLIENTE').click()
        cy.wait('@gqlClient', { timeout: 30000 });
        cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')
    }

    static FQ_tabUltra(tab) {
        /* cy.get('.fast-quote-card').find('nx-tab-header')
            .find('div').contains("Ultra").parent('button[class*="active"]').should('be.visible') */

        const regex = new RegExp('\^' + tab + '\$');
        cy.get('.fast-quote-card').find('app-ultra-parent-tabs')
            .find('.nx-tab-label__content').contains(regex).click()
    }

    /**
     * Effettua Check su Fast Quote Ultra
     */
    static checkFastQuoteUltra(keys) {
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
                    'Casa e Patrimonio 2022',
                    'Salute',
                    'Impresa',
                    'Casa e Patrimonio'
                ]
                if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
                    tabUltraFastQuote = ['Casa e Patrimonio', 'Salute']
                cy.get('app-ultra-parent-tabs').find('nx-tab-header').each(($checkTabUltraFastQuote, i) => {
                    expect($checkTabUltraFastQuote.text().trim()).to.include(tabUltraFastQuote[i]);
                })
                //#endregion

                //#region SubTab Casa e Patrimonio 2022
                if (keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022) {
                    cy.get('app-ultra-parent-tabs').find('nx-tab-header')
                        .contains('Casa e Patrimonio 2022').click()

                    const scopesUltra = [
                        'Fabbricato',
                        'Contenuto',
                        'Furto e rapina',
                        'Catastrofi naturali',
                        'Responsabilità civile della casa',
                        'Responsabilità civile della famiglia',
                        'Tutela legale',
                        'Animali domestici',
                    ]
                    cy.get('app-ultra-fast-quote-2022').find('.scope-name').each(($checkScopes, i) => {
                        expect($checkScopes.text().trim()).to.include(scopesUltra[i]);
                    })
                    cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                        cy.wrap($scopeIcon).click()
                    })
                    cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                        cy.wrap($scopeIcon).click()
                    })
                }
                //#endregion

                //#region SubTab Casa e Patrimonio
                if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                    cy.get('app-ultra-parent-tabs').find('nx-tab-header')
                        .find('button').not(':contains("2022")').contains(/^Casa e Patrimonio$/).click()

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
                    cy.get('app-ultra-fast-quote').contains('Vai a Preferiti').click()
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
                cy.wait('@gqlgetScopes', { timeout: 60000 })
                var scopesSalute = [
                    'Spese mediche',
                    'Diaria da ricovero',
                    'Invalidità permanente da infortunio',
                    'Invalidità permanente da malattia'
                ]
                if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
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
                cy.get('app-ultra-health-fast-quote').contains('Vai a Preferiti').click()
                Common.canaleFromPopup()
                getIFrame().find('#dashBody').should('be.visible')
                if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
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

    /**
     * Effettua Check su Fast Quote Auto
     */
    static checkFastQuoteAuto() {
        cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')

        cy.get('lib-container').find('app-client-resume:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Fast Quote")').is(':visible')
            if (check) {
                cy.intercept('POST', '**/graphql', (req) => {
                    aliasQuery(req, 'dataSettings')
                })
                cy.get('nx-tab-header').find('button').contains('Auto').click()
                cy.wait('@gqldataSettings', { timeout: 60000 })
                cy.get('app-new-auto-fast-quote').contains('Tipo veicolo').should('be.visible')
                cy.get('app-new-auto-fast-quote').contains('Targa').should('be.visible')
                if (!Cypress.env('monoUtenza') && (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))) {
                    cy.get('app-new-auto-fast-quote').contains('Agenzia').should('be.visible')
                }
                cy.get('img[src$="preventivoMotor.jpg"]').should('be.visible')
                cy.get('app-new-auto-fast-quote').contains('Calcola').should('be.visible')
            } else
                assert.fail('FastQuote non è presente')

            cy.screenshot('Check FastQuote Auto', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        })
    }

    /**
     * Effettua il calcola da Fast Quote Auto con accesso all'applicativo motorw
     */
    static calcolaDaFastQuoteAuto(tipoVeicolo, targa) {
        //Tipo Veicolo
        let veicolo = new RegExp("\^" + tipoVeicolo + "\$")
        cy.get('app-new-auto-fast-quote').contains('Seleziona').should('be.visible').click()
        cy.get('div[id^="cdk-overlay-"]').should('be.visible').within(() => {
            cy.contains(veicolo).should('exist').click()
        })

        //Targa
        cy.get('app-new-auto-fast-quote').find('input[placeholder="Inserisci"]').should('be.visible').click().clear().type(targa)

        //Effettuiamo il Calcola
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('calculateMotorPriceQuotation')) {
                req.alias = 'gqlCalculateMotorPriceQuotation'
            }
        })

        cy.screenshot('Click Calcola', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        cy.get('app-new-auto-fast-quote').contains('Calcola').should('be.visible').click()
        cy.wait('@gqlCalculateMotorPriceQuotation', { timeout: 120000 })

        cy.contains('Inserisci i dati manualmente').should('be.visible').click()
        cy.screenshot('PopUp Inserisci i dati manualmente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        cy.intercept({
            method: 'GET',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        Common.canaleFromPopup()
        cy.wait('@getMotor', { timeout: 120000 })

        getIFrame().find('span:contains("Cerca"):visible')

        cy.screenshot('Assuntivo Motor', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click sul popup di Inserimento Manuale Fast Quote Auto
     */
    static clickProcediInserimentoManualeFastQuoteAuto() {
        cy.contains('Procedi con l\'inserimento manuale').should('exist').click()

        cy.intercept({
            method: 'GET',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        Common.canaleFromPopup()
        cy.wait('@getMotor', { timeout: 50000 })

        getIFrame().find('span:contains("Cerca"):visible')
        cy.screenshot('Assuntivo Motor', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Effettua Check su Fast Quote Albergo
     */
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

    /**
     * Verifica le Cards Emissioni
     * @param {Object} keysCards
     * @example let keysCards = {
     *  AUTO: true,
     *   RAMIVARI: true,
     *   VITA: true
     * }   
     * 
     */
    static checkCardsEmissioni(keysCards) {
        cy.get('app-client-resume app-client-resume-emissions').then(($emissione) => {
            if ($emissione.find('app-section-title .title').length > 0) {
                cy.wrap($emissione).should('contain', 'Emissioni')
                CardsEmissioni.deleteKey(keysCards)
                const linkCards = Object.values(CardsEmissioni)
                cy.get('app-kpi-dropdown-card').find('.label').each(($checkScopes, i) => {
                    expect($checkScopes.text().trim()).to.include(linkCards[i]);
                })
            }
        })
    }

    /**
     * Effettua Emissione del ramo indicato
     * @param {string} fixtureEmissione vedi ../../fixtures/SchedaCliente/menuEmissione.json
     */
    static Emissione(fixtureEmissione) {
        //apre il menù di emissione del ramo indicato
        cy.get('.card-container').find('.label')
            .contains(fixtureEmissione[0]).click()

        //scorre i sottomenù fino aselezionare l'opzione richiesta
        for (var i = 1; i < fixtureEmissione.length; i++) {
            cy.log(fixtureEmissione[i])

            const regex = new RegExp('\^' + fixtureEmissione[1] + '\$');
            cy.get('button[role="menuitem"]').contains(regex)
                .should('be.visible').click()
        }
    }

    /**
     * Seleziona la prima agenzia dal popup "seleziona il canale" in Matrix
     * Utilizza Common.canaleFromPopup() 
     * @deprecated
     */
    static selezionaPrimaAgenzia() {
        cy.get('[ngclass="agency-row"]')
            .should('be.visible')
            .first().click()

        cy.wait(2000)
    }

    /**
     * Effettua il click su Auto
     */
    static clickAuto() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            cy.get('.card-container').find('app-kpi-dropdown-card').contains('Auto').click()
        })
    }

    /**
     * Emissione Preventivo Motor
     * @requires clickAuto()
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
        cy.wait('@getMotor', { timeout: 50000 });
        getIFrame().find('button:contains("Calcola"):visible')
        cy.screenshot('Verifica aggancio Prventivo Motor', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }
    /**
     * Emissione Safe Drive Autovetture
     * @requires clickAuto()
     */
    static clickSafeDriveAutovetture() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Safe Drive Autovetture').click()
        cy.intercept({
            method: 'POST',
            url: '**/assuntivomotor/**'
        }).as('getMotor');
        Common.canaleFromPopup()
        cy.wait('@getMotor', { timeout: 50000 });
        getIFrame().find('button:contains("Calcola"):visible', { timeout: 10000 })
        cy.screenshot('Verifica aggancio Safe Drive Autovetture', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Flotte Convenzioni
     */
    static clickFlotteConvenzioni() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Flotte e convenzioni').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Flotte e convenzioni', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Assunzione Guidata
     */
    static clickAssunzioneGuidata() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Assunzione guidata').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Assunzione guidata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Veicoli Epoca
     */
    static clickVeicoliEpoca() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Veicoli d\'epoca').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Veicoli d\'epoca', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Libri Matricola
     */
    static clickLibriMatricola() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Libri matricola').click()
        cy.intercept({
            method: 'POST',
            url: '**/GestioneLibriMatricolaDA/**'
        }).as('getLibriMatricola');
        Common.canaleFromPopup()
        // cy.wait('@getLibriMatricola', { timeout: 40000 }).its('response.statusCode').should('eq', 200)
        cy.wait(15000)
        matrixFrame().within(() => {
            cy.get('#ButtonNuovo').should('be.visible')
            cy.screenshot('Verifica aggancio Libri matricola', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        })
    }

    /**
     * Click Kasko ARD Chilometro
     */
    static clickKaskoARDChilometro() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD al Chilometro').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('li').contains('Dati Amministrativi').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Kasko e ARD al Chilometro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Kasko ARD Giornata
     */
    static clickKaskoARDGiornata() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Giornata').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('li').contains('Dati Amministrativi').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Kasko e ARD a Giornata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Kasko ARD Veicolo
     */
    static clickKaskoARDVeicolo() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Kasko e ARD').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Kasko e ARD a Veicolo').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('li').contains('Dati Amministrativi').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Kasko e ARD a Veicolo', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Polizza Base
     */
    static clickPolizzaBase() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Polizza aperta').click()
        cy.get('.cdk-overlay-pane').find('button').contains('Polizza base').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('li').contains('Dati Amministrativi').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Polizza base', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Coassicurazione
     */
    static clickCoassicurazione() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Coassicurazione').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
        getIFrame().find('li').contains('Dati Amministrativi').click()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Coassicurazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Nuova Polizza Motor
     */
    static clickNuovaPolizza() {
        cy.wait(2000)
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        else
            cy.get('.cdk-overlay-container').find('button').contains('Natanti').click()

        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Nuova polizza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Nuova Polizza Guidata
     */
    static clickNuovaPolizzaGuidata() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza guidata').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Nuova polizza guidata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Nuova Polizza Coassicurazione
     */
    static clickNuovaPolizzaCoassicurazione() {
        cy.wait(2000)
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        else
            cy.get('.cdk-overlay-container').find('button').contains('Natanti').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza Coassicurazione').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        cy.screenshot('Verifica aggancio Nuova polizza Coassicurazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Rami Vari
     */
    static clickRamiVari() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Rami vari")').is(':visible')
            if (check)
                cy.get('.card-container').find('app-kpi-dropdown-card').contains('Rami vari').click()
            else
                assert.fail('Card Rami Vari non è presente')
        })
    }

    /**
     * Click Allianz Ultra Casa Patrimonio
     */
    static clickAllianzUltraCasaPatrimonio() {
        cy.wait(2000)
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            cy.get('.cdk-overlay-container').find('button').not(':contains("2022")').contains('Allianz Ultra Casa e Patrimonio').click()
        } else
            cy.get('.cdk-overlay-container').find('button').not(':contains("2022")').contains('Ultra Casa e Patrimonio').click()
        cy.wait(2000)
        cy.intercept({
            method: 'GET',
            url: '**/fonti'
        }).as('getFonti');
        Common.canaleFromPopup()
        cy.wait('@getFonti', { timeout: 50000 });
        getIFrame().find('ultra-ambiti-disponibili').should('be.visible')
        getIFrame().find('span:contains("PROCEDI")').should('be.visible')
        getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) ? './assets/img/allianz-logo-casa.png' : './assets/img/aviva-logo-cp.png')
        cy.screenshot('Verifica aggancio Ultra Casa e Patrimonio', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Allianz Ultra Casa Patrimonio 2022
     */
    static clickAllianzUltraCasaPatrimonio2022() {
        cy.wait(2000)
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Casa e Patrimonio 2022').click()
        } else
            cy.get('.cdk-overlay-container').find('button').contains('Ultra Casa e Patrimonio 2022').click()
        cy.wait(2000)
        cy.intercept({
            method: 'GET',
            url: '**/fonti'
        }).as('getFonti');
        Common.canaleFromPopup()
        cy.wait('@getFonti', { timeout: 50000 });
        getIFrame().find('ultra-ambiti-disponibili').should('be.visible')
        getIFrame().find('span:contains("Procedi")').should('be.visible')
        getIFrame().find('ultra-product-logo')
    }

    /**
     * Click Allianz Ultra Casa Patrimonio BMP
     */
    static clickAllianzUltraCasaPatrimonioBMP() {
        cy.wait(2000)
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Casa e Patrimonio BMP').click()
        } else
            cy.get('.cdk-overlay-container').find('button').contains('Ultra Casa e Patrimonio BMP').click()

        cy.wait(2000)
        cy.intercept({
            method: 'GET',
            url: '**/fonti'
        }).as('getFonti');
        Common.canaleFromPopup()
        cy.wait('@getFonti', { timeout: 50000 });
        getIFrame().find('img[src="./assets/img/allianz-logo-casa.png"]').should('be.visible')
        getIFrame().find('span:contains("PROCEDI"):visible')
        cy.screenshot('Verifica aggancio Ultra Casa e Patrimonio BMP', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

    }

    /**
     * Click Allianz Ultra Salute
     */
    static clickAllianzUltraSalute() {
        cy.wait(2000)
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Salute').click()
        } else
            cy.get('.cdk-overlay-container').find('button').contains('Ultra Salute').click()

        cy.wait(2000)
        cy.intercept({
            method: 'GET',
            url: '**/fonti'
        }).as('getFonti');
        Common.canaleFromPopup()
        cy.wait('@getFonti', { timeout: 50000 });
        getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) ? './assets/img/allianz-logo-salute.png' : './assets/img/aviva-logo-salute.png')
        getIFrame().find('ultra-ambiti-disponibili').should('be.visible')
        getIFrame().find('span:contains("PROCEDI"):visible')
        cy.screenshot('Verifica aggancio Ultra Salute', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Allianz1 Business
     */
    static clickAllianz1Business() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz1 Business').click()
        cy.wait(2000)
        cy.intercept({
            method: 'POST',
            url: '**/Modular2/**'
        }).as('getModular2')
        Common.canaleFromPopup()
        cy.wait('@getModular2', { timeout: 50000 });
        getIFrame().find('a:contains("EMETTI QUOTAZIONE")').should('be.visible')
        getIFrame().find('a:contains("AVANTI")').should('be.visible')
        cy.screenshot('Verifica aggancio Allianz1 Business', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Fast Quote Universo Salute
     */
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
        cy.screenshot('Verifica aggancio FastQuote Universo Salute', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Fast Quote Infortuni da Circolazione
     */
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
        cy.screenshot('Verifica aggancio FastQuote Infortuni Da Circolazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Fast Quote Impresa Sicura
     */
    static clickFastQuoteImpresaSicura() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Impresa Sicura').click()
        cy.wait(2000)
        cy.intercept({
            method: 'GET',
            url: '**/Auto/**'
        }).as('getAuto');
        Common.canaleFromPopup()
        cy.wait('@getAuto', { timeout: 50000 });
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
        cy.screenshot('Verifica aggancio FastQuote Impresa Sicura', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Fast Quote Albergo
     */
    static clickFastQuoteAlbergo() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('FastQuote Albergo').click()
        cy.wait(2000)
        cy.in
        Common.canaleFromPopup()
        cy.wait(8000)
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
        cy.screenshot('Verifica aggancio FastQuote Albergo', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Gestione Grandine
     */
    static clickGestioneGrandine() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Gestione Grandine').click()
        cy.wait(2000)
        Common.canaleFromPopup()
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
        cy.screenshot('Verifica aggancio Gestione Grandine', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Polizza Nuova Rami Vari
     */
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
        cy.screenshot('Verifica aggancio Polizza nuova', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Vita
     */
    static clickVita() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Vita")').is(':visible')
            if (check)
                cy.get('.card-container').find('app-kpi-dropdown-card').contains('Vita').click()
            else
                assert.fail('Card Vita non è presente')
        })
    }

    /**
     * Click Vita > Servizio Consulenza
     */
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
        cy.wait('@gqlDigitalAgencyLink', { timeout: 30000 })
        cy.wait(20000)
        getIFrame().find('input[value="Avanti"]').should('be.visible').invoke('attr', 'value').should('equal', 'Avanti')
        getIFrame().find('input[value="Indietro"]:visible').invoke('attr', 'value').should('equal', 'Indietro')
        cy.screenshot('Verifica aggancio Accedi al servizio di consulenza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

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

    /**
     * Effettua la Cancellazione di un cliente
     */
    static cancellaCliente() {
        cy.get('nx-icon[aria-label="Open menu"]').click();
        cy.contains('Cancellazione cliente').click();
        cy.contains('Cancella cliente').click();
        cy.contains('Ok').click();
    }

    /**
     * Emette Plein Air (flusso completo)
     */
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
        cy.wait('@dacontabilita', { timeout: 60000 })

        getIFrame().find('#TabVarieInserimentoTipoPagamento').click().wait(1000)
        getIFrame().find('li:visible').contains("Contanti").click()
        getIFrame().find('#FiltroTabVarieInserimentoDescrizione').type("TEST AUTOMATICO")
        getIFrame().find('#TabVarieInserimentoCassetto').click()
        getIFrame().find('li').contains("Cassa").first().click()

        cy.intercept({
            method: 'POST',
            url: /QuestionariWeb/
        }).as('questionariWeb');

        getIFrame().find('#TabVarieInserimentoButton').click().wait(8000)

        cy.wait('@questionariWeb', { timeout: 60000 })

        getIFrame().within(($frame) => {
            $frame.find('#ButtonQuestOk').click()
        })
    }

    /**
     * Verifica Documenti Anagrafici in Folder
     * @param {Array.String} labels - labels dei documenti da verificare in folder
     */
    static verificaInFolderDocumentiAnagrafici(labels) {
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

    /**
     * Verifica Documenti in Folder - 
     * @param {Array.String} folders - albero cartelle dove si trovano i documenti da verificare in folder
     * @param {Array.String} labels - labels dei documenti da verificare in folder
     */
    static verificaInFolderDocumenti(folders, labels) {
        cy.get('nx-icon[aria-label="Open menu"]').click()
        cy.contains('folder').click()
        Common.canaleFromPopup()
        getIFrame().find('span[class="k-icon k-plus"]:visible').click()
        for (var i = 0; i < folders.length; i++) {
            cy.log(('folders[' + i + ']: ' + folders[i]))
            getIFrame().find('span').contains(folders[i]).dblclick()
            cy.wait(2000)
        }
        debugger
        cy.wrap(labels).each((label, i, array) => {
            getIFrame().find('span').contains(label).click()
            cy.wait(2000)
        })
    }

    /**
     * Verifica Data in Spalla Sinistra
     * @param {Objec} cliente Dati del cliente da verificare
     * @example let cliente = {
        nuovoClientePG.tipologia = "DITTA"
        nuovoClientePG.formaGiuridica = "S.R.L."
        nuovoClientePG.toponimo = "PIAZZA"
        nuovoClientePG.indirizzo = "GIUSEPPE GARIBALDI"
        nuovoClientePG.numCivico = "1"
        nuovoClientePG.cap = "36045"
        nuovoClientePG.citta = "LONIGO"
        nuovoClientePG.provincia = "VI"
        }
     */
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

    /**
     * Check Atterraggio in Sintesi Cliente
     * @param {string} [cliente] default a undefined, se specificato verfica il Nome del cliente in card
     */
    static checkAtterraggioSintesiCliente(cliente = undefined) {
        cy.get('app-client-profile-tabs').find('a').contains('SINTESI CLIENTE').should('have.class', 'active')
        if (cliente !== undefined)
            cy.get('.client-name').should('contain.text', String(cliente).toUpperCase().replace(",", ""))
    }

    /**
     * Click su Clients BreadCrumb
     */
    static clickClientsBriciolaPane() {
        cy.contains("Clients").should('exist').click({ force: true })
    }

    /**
     * @typedef Client
     * @property {string} name Nome del cliente
     * @property {string} address Indirizzo del cliente
     */
    /**
     * Funzione che ritorna il nome del cliente e il suo indirizzo
     * @returns {Promise<Client>} Promise per nome e indirizzo del cliente
     */
    static retriveClientNameAndAddress() {
        return new Cypress.Promise((resolve, reject) => {
            let client = { name: '', address: '' }
            cy.get('div[class*=client-name]').should('be.visible').invoke('text')
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

    /**
     * Ritorna l'url del cliente
     * @returns {Promise<string>} Promise url del cliente
     */
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
        cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache')
        cy.intercept(/launch-*/, 'ignore').as('launchStaging')
        cy.intercept(/cdn.igenius.ai/, 'ignore').as('igenius')
        cy.intercept(/i.ytimg.com/, 'ignore').as('ytimg')
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

        cy.wait('@pageClient', { timeout: 60000 });
        cy.get('app-scope-element', { timeout: 120000 }).should('exist').and('be.visible')
    }

    /**
     * Verifica se la Scheda del Cliente ha presente o meno il Numero o la Mail principale
     * @param {string} contactType tipo di contatto a scelta tra 'numero' e 'mail'
     * @returns {Promise<boolean>} Promise ritorna true se presente, false se assente
     */
    static checkContattoPrincipale(contactType) {
        return new Promise((resolve, reject) => {
            cy.get('body')
                .then(body => {
                    let missingValue;
                    (contactType === 'numero') ? missingValue = 'Aggiungi numero principale' : missingValue = ' Aggiungi mail principale '
                    if (body.find('.scrollable-sidebar-content').find('div:contains("' + missingValue + '")').is(':visible')) {
                        cy.get('nx-sidebar').should('be.visible').screenshot('Verifica ' + contactType + ' inserito', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true, disableTimersAndAnimations: true })
                        resolve(false)
                    }
                    else {
                        cy.get('nx-sidebar').should('be.visible').screenshot('Verifica ' + contactType + ' inserito', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true, disableTimersAndAnimations: true })
                        resolve(true)
                    }
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

    /**
     * Clicca sul BreadCrumb Clients per tornare in Sintesi Cliente
     */
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
        cy.wait('@pageClient', { timeout: 60000 });
        cy.wait('@gqlclientContractValidation', { timeout: 60000 })
        cy.wait('@gqlfastQuoteProfiling', { timeout: 60000 })
        cy.wait('@gqlgetScopes', { timeout: 60000 })
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
     * @param {string} agenzia in fase di disambiguazione da cliccare
     * @param {boolean} [erroMessage] default false, se a true controlla prezenza errore
     */
    static emettiReportProfiloVita(agenzia = undefined, errorMessage = false) {
        cy.intercept('POST', '**/graphql', (req) => {
            aliasQuery(req, 'clientReportLifePdf')
        })

        debugger
        cy.get('nx-icon[aria-label="Open menu"]').click().wait(1000)
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
            cy.contains('Report Profilo Vita').should('exist').and('be.visible').click()


            //Finestra di disambiguazione
            if (agenzia !== undefined)
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

    /**
     * Verifica i Links da Card Auto
     */
    static checkLinksFromAuto(keys) {
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first().should('exist').and('be.visible').within(() => {
            // Auto.deleteKey(keys)
            const linksAuto = Object.values(Auto)
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksAuto[i])
            })
        })
    }

    /**
     * Verifica i Links da Card Rami Vari
     * @param {Object} keys 
     */
    static checkLinksFromRamiVari(keys) {
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first().should('exist').and('be.visible').within(() => {

            RamiVari.deleteKey(keys)
            const linksRamiVari = Object.values(RamiVari)
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksRamiVari[i])
            })
        })
    }

    /**
     * Verifica i Links da Card Vita
     */
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

    /**
     * Verifica Links da Auto su Emissione
     * @param {Object} keysAuto
     */
    static checkLinksFromAutoOnEmissione(keysAuto) {
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            linksEmissioneAuto.EMISSIONE.deleteKey(keysAuto)
            const linksAutoEmissione = Object.values(linksEmissioneAuto.EMISSIONE)
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksAutoEmissione[i])
            })
        })
    }

    /**
     * Verifica Links Auto su Prodotti Particolari
     * @param {Object} keysAuto
     */
    static checkLinksFromAutoOnProdottiParticolari(keysAuto) {
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            debugger
            linksEmissioneAuto.PRODOTTI_PARTICOLARI.deleteKey(keysAuto)
            const linksProdottiParticolari = Object.values(linksEmissioneAuto.PRODOTTI_PARTICOLARI)
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksProdottiParticolari[i])
            })
        })
    }

    /**
     * Verifica Links Auto Passione Blu
     */
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

    /**
     * Verifica Links Auto Natanti
     */
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

    /**
     * Verifica Links da Rami Vari Emissione
     */
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

    /**
     * Verifica Links da Auto Prodotti Particolari Kasko
     */
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

    /**
     * Verifica Links da Auto Prodotti Particolari Polizza Aperta
     */
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

    /**
     * ricarica la scheda cliente
     */
    static ricarica() {
        cy.get('app-client-resume-card').should('be.visible')
            .find('[aria-label="Open menu"]').click()

        cy.get('.cdk-overlay-container').find('[role="menu"]').should('be.visible')
            .find('button').contains('Ricarica scheda cliente').click()
    }
}
export default SintesiCliente