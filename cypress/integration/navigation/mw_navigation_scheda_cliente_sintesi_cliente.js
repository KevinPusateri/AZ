/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Common from "../../mw_page_objects/common/Common"

Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 3000

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const backToClients = () => cy.get('a').contains('Clients').click().wait(5000)
const canaleFromPopup = () => cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region  Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
    cy.get('input[name="main-search-input"]').type('Pulini Francesco').type('{enter}')
    cy.intercept({
        method: 'POST',
        url: '**/clients/**'
    }).as('pageClient');
    cy.get('lib-client-item').first().click()
    cy.wait('@pageClient', { requestTimeout: 60000 });
})

after(() => {
    // TopBar.logOutMW()
})

describe('Matrix Web : Navigazioni da Scheda Cliente - Tab Sintesi Cliente', function () {
    it('Navigation Scheda Cliente', function () {
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

    })

    it('Verifica Situazione cliente', function () {
        cy.get('app-client-resume app-client-situation').then(($situazione) => {
            if ($situazione.find('app-section-title .title').length > 0) {
                cy.wrap($situazione).should('contain', 'Situazione cliente')
                cy.wrap($situazione).find('.content').should(($subtitle) => {
                    expect($subtitle).to.contain('Totale premi annui')
                    expect($subtitle).to.contain('Totale danni')
                    expect($subtitle).to.contain('Vita puro rischio')
                    expect($subtitle).to.contain('Polizze attive')
                })
            }
        })
    })

    // TODO Auto non carica gli elementi
    it('Verifica FastQuote', function () {
        cy.get('app-client-resume app-fast-quote').then(($fastquote) => {
            if ($fastquote.find('app-section-title .title').length > 0) {
                cy.wrap($fastquote).should('contain', 'Fast Quote')
                cy.wrap($fastquote).find('.subtitle').should('contain', 'Inserisci i dati richiesti per lanciare la quotazione')

                const tabFastQuote = [
                    'Ultra',
                    'Auto',
                    'Persona',
                    'Albergo'
                ]
                cy.get('nx-tab-header').first().find('button').each(($checkTabFastQuote, i) => {
                    expect($checkTabFastQuote.text().trim()).to.include(tabFastQuote[i]);
                })


                // cy.get('nx-tab-header').find('button').contains('Auto').click()
                // cy.get('app-auto-fast-quote').contains('Targa').should('be.visible')
                // cy.get('app-auto-fast-quote').contains('Garanzie').should('be.visible')
                // cy.get('app-auto-fast-quote').contains('Totale').should('be.visible')
                // cy.get('app-auto-fast-quote').contains('Copertura veicolo').should('be.visible')
                // cy.get('app-auto-fast-quote').contains('Copertura conducente').should('be.visible')

                // cy.get('nx-tab-header').find('button').contains('Persona').click()
                // cy.get('app-fast-quote').contains('Universo Persona').should('be.visible')
                // cy.get('app-fast-quote').contains('Universo Salute').should('be.visible')
                // cy.get('app-fast-quote').contains('Universo Persona Malattie Gravi').should('be.visible')

                // cy.get('nx-tab-header').find('button').contains('Albergo').click()
                // cy.get('app-fast-quote').contains('Attività svolta').should('be.visible')
                // cy.get('app-fast-quote').contains('Apertura della struttura').should('be.visible')
                // cy.get('app-fast-quote').contains('Comune di ubicazione').should('be.visible')

                // cy.get('app-fast-quote').find('button').contains('Auto').click()
                // const tabUltraFastQuote = [
                //     'Casa e Patrimonio',
                //     'Salute'
                // ]
                // cy.get('app-ultra-parent-tabs').find('nx-tab-header').each(($checkTabUltraFastQuote,i) =>{
                //     expect($checkTabUltraFastQuote.text().trim()).to.include(tabUltraFastQuote[i]);
                // })

                cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Casa e Patrimonio').click()
                const scopes = [
                    'Fabbricato',
                    'Contenuto',
                    'Catastrofi naturali',
                    'Responsabilità',
                    'Tutela legale',
                    'Animali domestici',
                ]
                cy.get('app-ultra-fast-quote').find('.scope-name').each(($checkScopes, i) => {
                    expect($checkScopes.text().trim()).to.include(scopes[i]);
                })

                cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                    cy.wrap($scopeIcon).click()
                })
                cy.get('app-scope-element').find('nx-icon').each($scopeIcon => {
                    cy.wrap($scopeIcon).click()
                })

                // TODO non carica la pagina salute
                // cy.get('app-ultra-parent-tabs').find('nx-tab-header').contains('Salute').click().wait(5000)
                // const scopes = [
                //     'Spese mediche',
                //     'Diaria da ricovero',
                //     'Invalidità permanente da infortunio',
                //     'Invalidità permanente da malattia'
                // ]
                // cy.get('app-ultra-health-fast-quote').find('.scope-name').each(($checkScopes,i) =>{
                //     expect($checkScopes.text().trim()).to.include(scopes[i]);
                // })
                // cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
                //     cy.wrap($scopeIcon).click()
                // })
                // cy.get('app-scope-element').find('nx-icon').each($scopeIcon =>{
                //     cy.wrap($scopeIcon).click()
                // })

                cy.get($fastquote).find('.content').then(($iconBottom) => {
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Preferiti"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Salva"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Condividi"]').should('be.visible')
                    cy.wrap($iconBottom).find('lib-da-link[calldaname="ALLIANZ-ULTRA#Configura"]').should('be.visible')
                })

                //on excel
                cy.get('app-ultra-fast-quote').find('.favorites-cta').contains('Vai a Preferiti').click()
                canaleFromPopup()
                backToClients()

            }
        })
    })

    it('Verifica le Cards Emissioni', function () {
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
    })


    context('Auto', () => {
        it('Verifica Card Auto: Emissione -> Preventivo Motor', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickPreventivoMotor()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Emissione -> Flotte e Convenzioni', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickFlotteConvenzioni()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Assunzione Guidata', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickAssunzioneGuidata()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Veicoli d\'epoca durata 10 giorni', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickVeicoliEpoca()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Libri matricola', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickLibriMatricola()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD al Chilometro', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDChilometro()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Giornata', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDGiornata()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Veicolo', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickKaskoARDVeicolo()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Polizza aperta(base)', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickPolizzaBase()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Prodotti particolari -> Coassicurazione', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickCoassicurazione()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Passione Blu -> Nuova polizza', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizza()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Passione Blu -> Nuova polizza guidata', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizzaGuidata()
            SintesiCliente.back()
        })

        it('Verifica Card Auto: Passione Blu -> Nuova polizza Coassicurazione', function () {
            SintesiCliente.clickAuto()
            SintesiCliente.clickNuovaPolizzaCoassicurazione()
            SintesiCliente.back()
        })
    })

    context.only('Rami Vari', () => {

        it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraCasaPatrimonio()
            SintesiCliente.back()
        })

        // //ADD TFS -> mostra in pagina user code not valid
        // it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio BMP', function () {
        //     buttonRamivari()
        //     cy.wait(2000)
        //     cy.get('.cdk-overlay-container').find('button').contains('Allianz Ultra Casa e Patrimonio BMP').click()
        //     cy.wait(2000)
        //     canaleFromPopup()
        //     backToClients()
        // })


        it('Verifica Card Rami Vari: Allianz Ultra Salute', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraSalute()
            SintesiCliente.back()
        })

        it('Verifica Card Rami Vari: Allianz1 Business', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianz1Business()
            SintesiCliente.back()
        })

        //TOLTO
        // it('Verifica Card Rami Vari: FastQuote Universo Persona', function () {
        //     buttonRamivari()
        //     cy.wait(2000)
        //     cy.get('.cdk-overlay-container').find('button').contains('FastQuote Universo Persona').click()
        //     cy.wait(2000)
        //     canaleFromPopup()
        //     getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        //     getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        //     getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        //     getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        //     getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        //     getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        //     backToClients()
        // })

        it('Verifica Card Rami Vari: FastQuote Universo Salute', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteUniversoSalute()
            SintesiCliente.back()
        })

        //TOLTO
        // it('Verifica Card Rami Vari: FastQuote Universo Persona Malattie Gravi', function () {
        //     buttonRamivari()
        //     cy.wait(2000)
        //     cy.get('.cdk-overlay-container').find('button').contains('FastQuote Universo Persona Malattie Gravi').click()
        //     cy.wait(2000)
        //     canaleFromPopup()
        //     getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        //     getIFrame().find('input[value="› Premi Tecnici"]').invoke('attr', 'value').should('equal', '› Premi Tecnici')
        //     getIFrame().find('input[value="› Partitario"]').invoke('attr', 'value').should('equal', '› Partitario')
        //     getIFrame().find('input[value="› Indietro"]').invoke('attr', 'value').should('equal', '› Indietro')
        //     getIFrame().find('input[value="› Emetti Quotazione"]').invoke('attr', 'value').should('equal', '› Emetti Quotazione')
        //     getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
        //     backToClients()
        // })

        it.only('Verifica Card Rami Vari: FastQuote Infortuni Da Circolazione', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteInfortuniDaCircolazione()
            SintesiCliente.back()
        })


        it.only('Verifica Card Rami Vari: FastQuote Impresa Sicura', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteImpresaSicura()
            SintesiCliente.back()
        })

        it.only('Verifica Card Rami Vari: FastQuote Albergo', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickFastQuoteAlbergo()
            SintesiCliente.back()
        })

        // Pagina nuova -> senza link
        // it('Verifica Card Rami Vari: Gestione Grandine', function () {
        //     SintesiCliente.clickRamiVari()
        //     SintesiCliente.clickFastQuoteAlbergo()
        //     SintesiCliente.back()
        // })

        it.only('Verifica Card Rami Vari: Emissione - Polizza Nuova', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickPolizzaNuova()
            SintesiCliente.back()
        })
    })

    context('Vita', () => {

        it('Verifica Card Vita: Accedi al servizio di consulenza', function () {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickSevizioConsulenza()
            SintesiCliente.back()
        })
    })
})