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
}


class LandingClients {

    static inizializzaCensimentoClientePF() {
        cy.contains('Clients').click()
        cy.contains('Nuovo cliente').click()
        cy.get('.nx-formfield__row > .nx-formfield__flexfield > .nx-formfield__input-container > .nx-formfield__input > #nx-input-1').type('AS')
        cy.contains('Cerca').click()
        cy.contains('Aggiungi cliente').click()
    }

    static inizializzaCensimentoClientePG(pi) {
        cy.contains('Clients').click()
        cy.contains('Nuovo cliente').click()
        cy.contains('Persona giuridica').click()
        cy.get('#nx-tab-content-0-1 > div > app-new-client-fiscal-code-box > div > div:nth-child(4) > div > nx-formfield').click().type(pi + "1")
        cy.get('span:contains("Cerca"):last').click()
        cy.contains('Aggiungi cliente').click()
    }

    /**
     * Verifica la presenza dei collegamenti rapidi
     */
    static checkExistLinksCollegamentiRapidi() {

        const linksCollegamentiRapidi = Object.values(LinksRapidi)

        cy.get('app-home-right-section').find('app-rapid-link').should('have.length', 5).each(($checkLinksRapidi, i) => {
            expect($checkLinksRapidi.text().trim()).to.include(linksCollegamentiRapidi[i]);
        })
    }

    /**
     * Torna indetro su Clients
     */
    static backToClients() {
        cy.get('a').contains('Clients').click()
        cy.url().should('eq', Common.getBaseUrl() + 'clients/')
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
    static clickLinkRapido(page) {
        switch (page) {
            case LinksRapidi.ANALISI_DEI_BISOGNI:
                if(Cypress.isBrowser('firefox')){

                    cy.get('app-home-right-section').find('app-rapid-link[linkname="Analisi dei bisogni"] > a')
                            .should('have.attr', 'href', 'https://www.ageallianz.it/analisideibisogni/app')
                }else{
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
        }
    }

    /**
     * Click button "+ Nuovo cliente"
     */
    static clickNuovoCliente() {
        cy.get('.component-section').find('button').contains('Nuovo cliente').click()
        cy.url().should('eq', Common.getBaseUrl() + 'clients/new-client')
    }

    /**
     * Click button "Vai a visione globale"
     */
    static clickVisioneGlobale() {
        cy.intercept({
            method: 'POST',
            url: '**/dacommerciale/**',
        }).as('getDaCommerciale');
        cy.get('.actions-box').contains('Vai a visione globale').click()
        cy.wait('@getDaCommerciale', { requestTimeout: 50000 })
        getIFrame().find('#main-contenitore-table').should('exist').and('be.visible')
    }

    /**
     * Click button "Appuntamento"
     */
    static clickAppuntamenti() {
        cy.get('.meetings').click()
        cy.url().should('eq', Common.getBaseUrl() + 'clients/event-center')
    }

    /**
     * Da Richieste Digital Me
     * verifica dal menu a tendina della prima card 
     * che il contenuto non sia vuoto e che i dati corrispondano
     */
    static verificaRichiesteDigitalMe() {
        cy.get('app-dm-requests-card').first().find('button[class^="row-more-icon-button"]').click()
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').each(($checkLink) => {
            expect($checkLink.text()).not.to.be.empty
        })
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').first().invoke('text')
            .should('include', '+')
        cy.get('app-digital-me-context-menu').find('[href^="mailto"]').invoke('text').should('include', '@')
        cy.get('app-digital-me-context-menu').find('[href^="/matrix/clients/"]').should('contain', 'Apri scheda cliente')
        cy.get('app-digital-me-context-menu ').find('lib-da-link').should('contain', 'Apri dettaglio polizza')
    }

    /**
     * Click su button "Vedi tutte" da Richieste Digital Me
     * verificando dal menu a tendina  della prima card 
     * che il contenuto non sia vuoto e che i dati corrispondano
     */
     static verificaVediTutte() {
        cy.contains('Vedi tutte').click()
        cy.url().should('include', '/clients/digital-me')
        cy.get('[class="ellipsis-box"]').first().find('button').click()
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').each(($checkLink) =>{
            expect($checkLink.text()).not.to.be.empty
        })
        cy.get('app-digital-me-context-menu').find('[class="digital-me-context-menu-button ng-star-inserted"]').first().invoke('text')
            .should('include', '+')
        cy.get('app-digital-me-context-menu').find('[href^="mailto"]').invoke('text').should('include', '@')
        cy.get('app-digital-me-context-menu').find('[href^="/matrix/clients/"]').should('contain', 'Apri scheda cliente')
        cy.get('app-digital-me-context-menu ').find('lib-da-link').should('contain', 'Apri dettaglio polizza')
    }
}

export default LandingClients