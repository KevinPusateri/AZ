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
}

class BurgerMenuClients extends Clients {

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkExistLinks() {

        cy.get('lib-burger-icon').click({force:true})

        const linksBurger = Object.values(LinksBurgerMenu)

        cy.get('lib-side-menu-link').find('a').should('have.length', 11).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    }

    /**
     * Apre il burgerMenu e click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLink(page) {
        cy.get('lib-burger-icon').click({force:true})
        if (page === LinksBurgerMenu.ANALISI_DEI_BISOGNI) {
            cy.contains(page).invoke('removeAttr', 'target').click()
        }
        cy.contains(page).click()

        this.checkPage(page)
    }

    /**
     * Verifica atterraggio alla pagina
     * @param {string} page - Nome della pagina 
     */
    static checkPage(page) {
        switch (page) {
            case LinksBurgerMenu.ANALISI_DEI_BISOGNI:
                cy.get('h2:contains("Analisi dei bisogni assicurativi"):visible')
                cy.go('back')
                cy.url().should('include', Common.getBaseUrl())
                break;
            case LinksBurgerMenu.CENSIMENTO_NUOVO_CLIENTE:
                Common.canaleFromPopup()
                cy.url().should('eq', Common.getBaseUrl() + 'clients/new-client')
                break;
            case LinksBurgerMenu.DIGITAL_ME:
                Common.canaleFromPopup()
                cy.url().should('eq', Common.getBaseUrl() + 'clients/digital-me')
                break;
            case LinksBurgerMenu.PANNELLO_ANOMALIE:
                cy.wait(3000)
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksBurgerMenu.CLIENTI_DUPLICATI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksBurgerMenu.CANCELLAZIONE_CLIENTI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksBurgerMenu.CANCELLAZIONE_CLIENTI_PER_FONTE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Disassocia Tutti"):visible')
                break;
            case LinksBurgerMenu.GESTIONE_FONTE_PRINCIPALE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.ANTIRICICLAGGIO:
                Common.canaleFromPopup()
                getIFrame().find('#divMain:contains("Servizi antiriciclaggio"):visible')
                break;
            case LinksBurgerMenu.HOSPITAL_SCANNER:
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