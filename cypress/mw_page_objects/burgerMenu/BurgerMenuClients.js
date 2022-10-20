/// <reference types="Cypress" />
import Common from "../common/Common";
import Clients from "../clients/LandingClients";

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
const interceptloadSCIImpresa = () => {
    cy.intercept({
        method: 'POST',
        url: '**/SCImpresa/**'
    }).as('loadSCIImpresa')
}


const LinksBurgerMenu = {
    HOME_CLIENTS: 'Home Clients',
    ANALISI_DEI_BISOGNI: 'Analisi dei bisogni',
    CENSIMENTO_NUOVO_CLIENTE: 'Censimento nuovo cliente',
    DIGITAL_ME: 'Digital Me',
    PANNELLO_ANOMALIE: 'Pannello anomalie',
    CLIENTI_DUPLICATI: 'Clienti duplicati',
    CANCELLAZIONE_CLIENTI: 'Cancellazione Clienti',
    CANCELLAZIONE_CLIENTI_PER_FONTE: 'Cancellazione Clienti per fonte',
    GESTIONE_FONTE_PRINCIPALE: 'Gestione fonte principale',
    ANTIRICICLAGGIO: 'Antiriciclaggio',
    HOSPITAL_SCANNER: 'Hospital scanner',
    CONSENSI_EMAIL_SUI_CONTRATTI: 'Consensi email sui contratti',
    deleteKey: function (keys) {
        if (!keys.CENSIMENTO_NUOVO_CLIENTE) delete this.CENSIMENTO_NUOVO_CLIENTE
        if (!keys.PANNELLO_ANOMALIE) delete this.PANNELLO_ANOMALIE
        if (!keys.CLIENTI_DUPLICATI) delete this.CLIENTI_DUPLICATI
        if (!keys.CANCELLAZIONE_CLIENTI) delete this.CANCELLAZIONE_CLIENTI
        if (!keys.CANCELLAZIONE_CLIENTI_PER_FONTE) delete this.CANCELLAZIONE_CLIENTI_PER_FONTE
        if (!keys.GESTIONE_FONTE_PRINCIPALE) delete this.GESTIONE_FONTE_PRINCIPALE
        if (!keys.ANTIRICICLAGGIO) delete this.ANTIRICICLAGGIO
        if (!keys.HOSPITAL_SCANNER) delete this.HOSPITAL_SCANNER
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.ANALISI_DEI_BISOGNI
        if (!keys.CONSENSI_EMAIL_SUI_CONTRATTI) delete this.CONSENSI_EMAIL_SUI_CONTRATTI
    }
}

class BurgerMenuClients extends Clients {

    static clickBurgerMenu(){
        cy.get('lib-burger-icon').click({ force: true })
    }


    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkExistLinks(keys) {

        cy.get('lib-burger-icon').click({ force: true })
        LinksBurgerMenu.deleteKey(keys)
        const linksBurger = Object.values(LinksBurgerMenu)
        cy.get('lib-side-menu-link').find('a').each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })

        cy.screenshot('Verifica Links Clients', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Apre il burgerMenu e click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLink(page, openBurger = true) {
        interceptloadSCIImpresa()

        if (openBurger)
            cy.get('lib-burger-icon').click({ force: true })
        if (page === LinksBurgerMenu.ANALISI_DEI_BISOGNI ||
            page === LinksBurgerMenu.HOSPITAL_SCANNER) {
            this.checkPage(page)
        } else {
            cy.contains(page, { timeout: 5000 }).click()
            this.checkPage(page)
        }

    }

    /**
     * Verifica atterraggio alla pagina
     * @param {string} page - Nome della pagina 
     */
    static checkPage(page) {
        switch (page) {
            case LinksBurgerMenu.ANALISI_DEI_BISOGNI:
                Common.canaleFromPopup()
                if (Cypress.isBrowser('firefox')) {
                    cy.get('app-home-right-section').find('app-rapid-link[linkname="Analisi dei bisogni"] > a')
                        .should('have.attr', 'href', 'https://www.ageallianz.it/analisideibisogni/app')
                        this.clickBurgerMenu()
                } else {
                    cy.get('lib-burger-sidebar').find('a[href="https://www.ageallianz.it/analisideibisogni/app"]').invoke('removeAttr', 'target').click()
                    // cy.wait('@analisiBisogni', { requestTimeout: 80000 });
                    cy.url().should('include', '/analisideibisogni/app/login')
                    cy.get('h2:contains("Analisi dei bisogni assicurativi"):visible')
                    cy.go('back')
                }
                // cy.url().should('include', Common.getBaseUrl())
                break;
            case LinksBurgerMenu.CENSIMENTO_NUOVO_CLIENTE:
                Common.canaleFromPopup()
                cy.url().should('include', 'clients/new-client')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.DIGITAL_ME:
                Common.canaleFromPopup()
                cy.url().should('include','clients/digital-me')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.PANNELLO_ANOMALIE:
                cy.wait(3000)
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CLIENTI_DUPLICATI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CANCELLAZIONE_CLIENTI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CANCELLAZIONE_CLIENTI_PER_FONTE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Disassocia Tutti"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.GESTIONE_FONTE_PRINCIPALE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ANTIRICICLAGGIO:
                Common.canaleFromPopup()
                getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.HOSPITAL_SCANNER:
                cy.contains(page).click()

                cy.window().then(win => {
                    cy.stub(win, 'open').callsFake((url) => {
                        return win.open.wrappedMethod.call(win, url, '_self');
                    }).as('Open');
                });

                Common.canaleFromPopup()
                cy.get('@Open')
                cy.wait(15000)
                cy.get('app-home').should('exist').and('be.visible').and('contain.text', 'CERCA INTERVENTO')
                cy.go('back')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CONSENSI_EMAIL_SUI_CONTRATTI:
                Common.canaleFromPopup()
                cy.wait('@loadSCIImpresa', { requestTimeout: 30000 })
                getIFrame().find('button:contains("Salva")').should('be.visible')
                break;
        }
    }


    /**
     * Torna indetro su Clients
     */
    static backToClients() {
        super.backToClients()
    }



}

export default BurgerMenuClients