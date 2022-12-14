/// <reference types="Cypress" />

import Common from "../common/Common"
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}


const LinksRapidi = {
    ANALISI_DEI_BISOGNI: 'Analisi dei bisogni',
    DIGITAL_ME: 'Digital Me',
    PANNELLO_ANOMALIE: 'Pannello anomalie',
    CLIENTI_DUPLICATI: 'Clienti duplicati',
    ANTIRICICLAGGIO: 'Antiriciclaggio',
    deleteKey: function (keys) {
        if (!keys.PANNELLO_ANOMALIE) delete this.PANNELLO_ANOMALIE
        if (!keys.CLIENTI_DUPLICATI) delete this.CLIENTI_DUPLICATI
        if (!keys.ANTIRICICLAGGIO) delete this.ANTIRICICLAGGIO
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.ANALISI_DEI_BISOGNI
    }
}


class LandingClients {

    static inizializzaCensimentoClientePF() {
        cy.contains('Clients').click()
        cy.contains('Nuovo cliente').click()
        cy.get('.nx-formfield__row > .nx-formfield__flexfield > .nx-formfield__input-container > .nx-formfield__input > #nx-input-1').type('AS')
        cy.contains('Cerca').click()
        cy.screenshot('Aggiungi Cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.contains('Aggiungi cliente').click()
    }

    static inizializzaCensimentoClientePG(pi) {
        cy.contains('Clients').click()
        cy.contains('Nuovo cliente').click()
        cy.contains('Persona giuridica').click()
        cy.get('#nx-tab-content-0-1 > div > app-new-client-fiscal-code-box > div > div:nth-child(4) > div > nx-formfield').click().type(pi + "1")
        cy.get('span:contains("Cerca"):last').click()
        cy.screenshot('Aggiungi Cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.contains('Aggiungi cliente').click()
    }

    /**
     * Verifica la presenza dei collegamenti rapidi
     */
    static checkExistLinksCollegamentiRapidi(keys) {

        LinksRapidi.deleteKey(keys)
        const linksCollegamentiRapidi = Object.values(LinksRapidi)

        cy.get('app-home-right-section').should('be.visible')

        cy.get('app-home-right-section').find('app-rapid-link:visible').each(($checkLinksRapidi, i) => {
            expect($checkLinksRapidi.text().trim()).to.include(linksCollegamentiRapidi[i]);
        })

        cy.screenshot('Verifica presenza collegamenti rapidi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Torna indetro su Clients
     */
    static backToClients() {
        cy.get('a').contains('Clients').click({ force: true })
        cy.url().should('include','clients/')
    }

    static clickLink(page) {
        if (page === LinksBurgerMenu.ANALISI_DEI_BISOGNI) {
            cy.contains(page).invoke('removeAttr', 'target').click()
        }
        cy.contains(page).click()

        this.checkPage(page)
    }

    /**
     * Click link nella sezione "Collegamenti rapidi"
     * @param {string} page - nome del link
     */
    static clickLinkRapido(page, keyDigitalMe = {}) {
        switch (page) {
            case LinksRapidi.ANALISI_DEI_BISOGNI:
                if (Cypress.isBrowser('firefox')) {

                    cy.get('app-home-right-section').find('app-rapid-link[linkname="Analisi dei bisogni"] > a')
                        .should('have.attr', 'href', 'https://www.ageallianz.it/analisideibisogni/app')
                } else {
                    cy.get('app-rapid-link').contains(page).invoke('removeAttr', 'target').click()
                    cy.get('h2:contains("Analisi dei bisogni assicurativi"):visible')
                    cy.go('back')
                }
                cy.url().should('include', Common.getBaseUrl())
                break;
            case LinksRapidi.DIGITAL_ME:
                cy.get('app-rapid-link').contains(page).click()
                Common.canaleFromPopup()
                cy.url().should('eq', Common.getBaseUrl() + 'clients/digital-me')
                cy.get('app-digital-me-header').should('exist').and('be.visible').then(($digitalme) => {
                    const checkIsRequest = $digitalme.find(':contains("Ci sono 0 richieste Digital me, di cui 0 da gestire")').is(':visible')
                    if (!checkIsRequest) {
                        let tabDigitalMe = []
                        if (keyDigitalMe.PUBBLICAZIONE_PROPOSTE) {

                            tabDigitalMe = [
                                'Richieste Cliente',
                                'Pubblicazione Proposte'
                            ]
                            cy.get('nx-tab-group').find('button').each(($checkTabDigitalMe, i) => {
                                expect($checkTabDigitalMe.text().trim()).to.include(tabDigitalMe[i]);
                            })
                            cy.contains('Richieste Cliente').click()
                            cy.get('app-digital-me-main-table').find('tr > td').should('be.visible')
                        } else {
                            cy.get('app-digital-me-main-table').find('tr > td').should('be.visible')
                        }
                    } else
                        cy.wrap($digitalme).should('contain.text', 'Ci sono 0 richieste Digital me, di cui 0 da gestire')
                })
                break;
            case LinksRapidi.PANNELLO_ANOMALIE:
                cy.get('app-rapid-link').contains(page).click()
                cy.wait(3000)
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksRapidi.CLIENTI_DUPLICATI:
                cy.get('app-rapid-link').contains(page).click()
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksRapidi.ANTIRICICLAGGIO:
                cy.get('app-rapid-link').contains(page).click()
                Common.canaleFromPopup()
                getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
                break;

                cy.screenshot('Verifica link rapido ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        }
    }

    /**
     * Click button "+ Nuovo cliente"
     */
    static clickNuovoCliente() {
        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        cy.url().should('eq', Common.getBaseUrl() + 'clients/new-client')
        cy.screenshot('Verifica Nuovo Cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click button "Vai a visione globale"
     */
    static clickVisioneGlobale() {
        //! AL MOMENTO SOLO IN TEST NUOVA GRAFICA
        // cy.intercept({
        //     method: 'POST',
        //     url: '**/dacommerciale/**',
        // }).as('getDaCommerciale');
        cy.intercept({
            method: 'POST',
            url: '**/globalVision',
        }).as('getGlobalVision');
        cy.get('.actions-box').contains('Vai a visione globale').click()
        cy.wait('@getGlobalVision', { requestTimeout: 50000 })
        // cy.wait('@getDaCommerciale', { requestTimeout: 50000 })
        // getIFrame().find('#main-contenitore-table').should('exist').and('be.visible')
        // cy.getIframe
        // cy.get('nx-spinner').should('not.be.visible')
        cy.get('div[class^="chart-container"]').should('exist').and('be.visible')
        cy.screenshot('Verifica Visione Globale', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static checkAssenzaVisioneGlobale() {
        cy.get('.actions-box').should('not.include.text', 'Vai a visione globale')
        cy.screenshot('Verifica Assenza Visione Globale', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click button "Appuntamento"
     */
    static clickAppuntamenti() {
        cy.get('.meetings').click()
        cy.url().should('eq', Common.getBaseUrl() + 'clients/event-center')
        cy.screenshot('Verifica Appuntamento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Da Richieste Digital Me
     * verifica dal menu a tendina della prima card 
     * che il contenuto non sia vuoto e che i dati corrispondano
     */
    static verificaRichiesteDigitalMe() {
        cy.wait(3000)

        cy.get('app-dm-requests').first().should('exist').and('be.visible').then($request => {
            const checkDatiIsPresent = $request.find(':contains("Non ci sono dati da mostrare")').is(':visible')
            if (checkDatiIsPresent) {
                cy.get('app-dm-requests').find('p').should('contain.text', 'Non ci sono dati da mostrare')
            } else {
                cy.get('app-dm-requests-card').should('be.visible')
            }

            cy.screenshot('Verifica Digital Me', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        });
    }

    static checkDigitalMe(keyDigitalMe) {
        cy.wait(5000)
        console.log(keyDigitalMe)
        cy.get('app-digital-me-header').should('exist').and('be.visible').then(($digitalme) => {
            const checkIsRequest = $digitalme.find(':contains("Ci sono 0 richieste Digital me, di cui 0 da gestire")').is(':visible')
            if (checkIsRequest)
                cy.wrap($digitalme).should('contain.text', 'Ci sono 0 richieste Digital me, di cui 0 da gestire')
            else {

                let tabDigitalMe = []
                if (keyDigitalMe.PUBBLICAZIONE_PROPOSTE) {

                    tabDigitalMe = [
                        'Richieste Cliente',
                        'Pubblicazione Proposte'
                    ]
                    cy.get('nx-tab-group').find('button').each(($checkTabDigitalMe, i) => {
                        expect($checkTabDigitalMe.text().trim()).to.include(tabDigitalMe[i]);
                    })
                    cy.contains('Richieste Cliente').click()
                    cy.get('app-digital-me-main-table').find('tr > td').should('be.visible')
                    this.digitalMe('Richieste Cliente');
                }


                if (keyDigitalMe.PUBBLICAZIONE_PROPOSTE) {
                    cy.intercept('POST', '**/graphql', (req) => {
                        if (req.body.operationName.includes('dmEventMotor')) {
                            req.alias = 'gqlEventMotor'
                        }
                    })
                    cy.contains('Pubblicazione Proposte').click()
                    cy.get('app-digital-me-main-table').should('be.visible')
                }
            }
            cy.screenshot('Verifica Digital Me', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        })
    }


    /**
     * Verifica se gli elementi sono visibili e il menu a tendina sia corretta
     */
    static digitalMe() {
        cy.get('app-digital-me-main-table').find('tbody > tr').should('be.visible')
        cy.get('app-digital-me-main-table').find('tbody > tr').first()
            .find('td').eq(2).then(($td) => {
                const checkAttivita = $td.text()
                cy.get('tbody > tr').first().find('button[class="row-more-icon-button"]').click()
                switch (checkAttivita) {
                    case 'Firma Digital Me':
                    case 'Firma e Pagamento DM':
                        cy.get('app-digital-me-context-menu').find('lib-da-link').should('contain', 'Apri dettaglio polizza')
                        cy.get('app-digital-me-context-menu').find('lib-da-link').should('contain', 'Accedi a folder cliente');
                        break;
                    case 'Attivazione Consensi Digital Me':
                    case 'Modifica anagrafica':
                        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').first().invoke('text')
                            .should('include', '+');
                        cy.get('app-digital-me-context-menu').find('nx-icon[name^="mail"]').parent().invoke('text').should('include', '@');
                        cy.get('app-digital-me-context-menu').find('[href^="/matrix/clients/"]').should('contain', 'Apri scheda cliente');
                        cy.get('app-digital-me-context-menu').find('lib-da-link').should('contain', 'Accedi a folder cliente');
                        break;
                    default:
                        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').first().invoke('text')
                            .should('include', '+');
                        cy.get('app-digital-me-context-menu').find('nx-icon[name^="mail"]').parent().invoke('text').should('include', '@');
                        cy.get('app-digital-me-context-menu').find('[href^="/matrix/clients/"]').should('contain', 'Apri scheda cliente');
                        cy.get('app-digital-me-context-menu').find('lib-da-link').should('contain', 'Apri dettaglio polizza')
                        cy.get('app-digital-me-context-menu').find('lib-da-link').should('contain', 'Accedi a folder cliente');
                        break;
                }
            });
        cy.screenshot('Verifica Digital Me', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click su button "Vedi tutte" da Richieste Digital Me
     * verificando dal menu a tendina  della prima card 
     * che il contenuto non sia vuoto e che i dati corrispondano
     */
    static clickVediTutte() {
        cy.contains('Vedi tutte').click()
        cy.url().should('include', '/clients/digital-me')

        cy.screenshot('Click su button "Vedi tutte" da Richieste Digital Me', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica che il contenuto di Visione globale cliente sia presente
     */
    static checkVisioneGlobaleCliente() {
        cy.get('app-global-vision-carousel').should('be.visible')
        cy.get('app-global-vision-carousel').should('exist').and('be.visible').within(() => {
            cy.get('svg').should('be.visible')

            const titleGlobals = [
                'Contatti e consensi concessi',
                'Contatti e consensi non concessi',
                'Polizze Clienti',
                'Monocoperti',
                'Anzianit?? del Cliente',
                'Et?? del Cliente',
                'Tipo Persona',
                'Coperture',
                'Scoperture'
            ]
            cy.get('ngu-tile').should('be.visible').find('div[class="chart-title homepage-chart-title"]').each((title, i) => {
                expect(titleGlobals).to.include(title.text().trim());
            })
        })

        cy.screenshot('Verifica che il contenuto di Visione globale cliente sia presente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

    }
}

export default LandingClients