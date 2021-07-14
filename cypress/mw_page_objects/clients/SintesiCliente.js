/// <reference types="Cypress" />
import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
import Common from '../common/Common.js'

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class SintesiCliente {

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
                const tabUltraFastQuote = [
                    'Casa e Patrimonio',
                    'Salute'
                ]
                cy.get('app-ultra-parent-tabs').find('nx-tab-header').each(($checkTabUltraFastQuote, i) => {
                    expect($checkTabUltraFastQuote.text().trim()).to.include(tabUltraFastQuote[i]);
                })
                //#endregion

                //#region SubTab Casa e Patrimonio
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

                //#region SubTab Salute
                cy.intercept('POST', '**/graphql', (req) => {
                    aliasQuery(req, 'getScopes')
                })
                cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Salute').click()
                cy.wait('@gqlgetScopes', { requestTimeout: 60000 })
                const scopesSalute = [
                    'Spese mediche',
                    'Diaria da ricovero',
                    'Invalidità permanente da infortunio',
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
                getIFrame().find('img[src="./assets/img/allianz-logo-salute.png"]').should('be.visible')
                getIFrame().find('button:contains("PROCEDI")').should('be.visible')
                cy.get('a').contains('Clients').click({ force: true })
                //#endregion
            } else
                assert.fail('FastQuote non è presente')
        })
    }

    static checkFastQuoteAuto() {
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
                cy.get('app-new-auto-fast-quote').contains('Agenzia').should('be.visible')
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
        cy.get('.cdk-overlay-container').find('button').contains('Flotte e Convenzioni').click()
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
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
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
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza Coassicurazione').click()
        Common.canaleFromPopup()
        getIFrame().find('button:contains("Annulla"):visible').click()
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

    static clickAllianzUltraSalute() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Salute').click()
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
            method: 'POST',
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
        cy.intercept({
            method: 'GET',
            url: '**/Vita/**'
        }).as('getVita');
        Common.canaleFromPopup()
        cy.wait('@getVita', { requestTimeout: 60000 })
        cy.wait(10000)
        getIFrame().find('input[value="Avanti"]:visible').invoke('attr', 'value').should('equal', 'Avanti')
        getIFrame().find('input[value="Indietro"]:visible').invoke('attr', 'value').should('equal', 'Indietro')
    }
    //#endregion

    //#endregion

    //#region Contratti in Evidenza
    
    /**
     * Verifica l'aggancio alla pgina del primo contratto
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
        cy.intercept({
            method: 'POST',
            url: '**/dacontabilita/**'
        }).as('dacontabilita');
        getIFrame().find('#ButtonQuestOk').click().wait(10000)
        cy.wait('@dacontabilita', { requestTimeout: 60000 })
        getIFrame().find('#TabVarieInserimentoTipoPagamento').click()
        getIFrame().find('li').contains("Contanti").click()
        getIFrame().find('#FiltroTabVarieInserimentoDescrizione').type("TEST AUTOMATICO")

        cy.intercept({
            method: 'POST',
            url: /QuestionariWeb/
        }).as('questionariWeb');

        getIFrame().find('#TabVarieInserimentoButton').click().wait(8000)

        cy.wait('@questionariWeb', { requestTimeout: 60000 })

        getIFrame().find('#ButtonQuestOk').click()
    }

    /**
    * @param {Array.String} labels - labels dei documenti da verificare in folder
    */
    static verificaInFolder(labels) {
        cy.get('nx-icon[aria-label="Open menu"]').click()
        cy.contains('folder').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(3000)

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

    static retriveClientNameAndAddress() {
        return new Promise((resolve, reject) => {
            let client = { name: '', address: '' }
            cy.get('div[class*=client-name]').invoke('text')
                .then(currentClientName => {
                    client.name = currentClientName

                    cy.log('Retrived Client Name : ' + client.name)
                })
            cy.get('nx-icon[class="nx-icon--location nx-icon--auto nx-link__icon"]').parents('a')
                .find('div[class="value ng-star-inserted"]').invoke('text').then((currentAddress) => {
                    client.address = currentAddress.split('-')[0].replace(',', '').trim()
                    cy.log('Retrived Client Address : ' + client.address)
                })

            resolve(client);
        });
    }
    /**
     * Verifica se la Scheda del Cliente ha presente o meno il Numero o la Mail principale
     * @param {*} contactType tipo di contatto a scelta tra 'numero' e 'mail'
     * @returns true se presente, false se assente
     */
    static checkContattoPrincipale(contactType) {
        return new Promise((resolve, reject) => {
            cy.get('body')
                .then(body => {
                    let missingValue
                    (contactType === 'numero') ? missingValue = 'Aggiungi numero principale' : missingValue = ' Aggiungi mail principale '
                    if (body.find('.scrollable-sidebar-content').find('div:contains("' + missingValue + '")').length > 0)
                        resolve(false)
                    else
                        resolve(true)
                })
        })
    }

    /**
     * Aggiunge Contatto principale (a scelta tra 'numero' o 'mail') 
     * @param {*} contactType tipo di contatto a scelta tra 'numero' e 'mail'
     */
    static aggiungiContattoPrincipale(contactType) {
        let missingValue
        (contactType === 'numero') ? missingValue = 'Aggiungi numero principale' : missingValue = ' Aggiungi mail principale '
        cy.get('.scrollable-sidebar-content').find('div:contains("' + missingValue + '")').click({ multiple: true })

    }

    static back() {
        cy.get('a').contains('Clients').click().wait(5000)
    }


}

export default SintesiCliente