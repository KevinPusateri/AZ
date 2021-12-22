/// <reference types="Cypress" />
import Common from "../common/Common";
import BackOffice from "../navigation/BackOffice";

const LinksBurgerMenu = {
    HOME_BACKOFFICE: 'Home Backoffice',
    MOVIMENTAZIONE_SINISTRI: 'Movimentazione sinistri',
    DENUNCIA: 'Denuncia',
    GESTIONE_CONTATTO_CARD: 'Gestione Contatto Card',
    DENUNCIA_BMP: 'Denuncia BMP',
    CONSULTAZIONE_SINISTRI: 'Consultazione sinistri',
    SINISTRI_INCOMPLETI: 'Sinistri incompleti',
    SINISTRI_CANALIZZATI: 'Sinistri canalizzati',
    SINTESI_CONTABILITÀ: 'Sintesi Contabilità',
    GIORNATA_CONTABILE: 'Giornata contabile',
    CONSULTAZIONE_MOVIMENTI: 'Consultazione Movimenti',
    ESTRAZIONE_CONTABILITÀ: 'Estrazione Contabilità',
    DELEGHE_SDD: 'Deleghe SDD',
    QUADRATURA_UNIFICATA: 'Quadratura unificata',
    INCASSO_PER_CONTO: 'Incasso per conto',
    INCASSO_MASSIVO: 'Incasso massivo',
    SOLLECITO_TITOLI: 'Sollecito titoli',
    IMPOSTAZIONE_CONTABILITÀ: 'Impostazione contabilità',
    CONVENZIONI_IN_TRATTENUTA: 'Convenzioni in trattenuta',
    MONITORAGGIO_GUIDA_SMART: 'Monitoraggio Guida Smart',
    deleteKey: function(keys) {  
        if(!keys.HOME_BACKOFFICE) delete this.HOME_BACKOFFICE
        if(!keys.MOVIMENTAZIONE_SINISTRI) delete this.MOVIMENTAZIONE_SINISTRI
        if(!keys.DENUNCIA) delete this.DENUNCIA
        if(Cypress.env('isAviva')) delete this.GESTIONE_CONTATTO_CARD
        if(!keys.DENUNCIA_BMP) delete this.DENUNCIA_BMP
        if(!keys.CONSULTAZIONE_SINISTRI) delete this.CONSULTAZIONE_SINISTRI
        if(!keys.SINISTRI_INCOMPLETI) delete this.SINISTRI_INCOMPLETI
        if(!keys.SINISTRI_CANALIZZATI) delete this.SINISTRI_CANALIZZATI
        if(!keys.SINTESI_CONTABILITÀ) delete this.SINTESI_CONTABILITÀ
        if(!keys.GIORNATA_CONTABILE) delete this.GIORNATA_CONTABILE
        if(!keys.CONSULTAZIONE_MOVIMENTI) delete this.CONSULTAZIONE_MOVIMENTI
        if(!keys.ESTRAZIONE_CONTABILITÀ) delete this.ESTRAZIONE_CONTABILITÀ
        if(!keys.DELEGHE_SDD) delete this.DELEGHE_SDD
        if(!keys.QUADRATURA_UNIFICATA) delete this.QUADRATURA_UNIFICATA
        if(!keys.INCASSO_PER_CONTO) delete this.INCASSO_PER_CONTO
        if(!keys.INCASSO_MASSIVO) delete this.INCASSO_MASSIVO
        if(!keys.SOLLECITO_TITOLI) delete this.SOLLECITO_TITOLI
        if(!keys.IMPOSTAZIONE_CONTABILITÀ) delete this.IMPOSTAZIONE_CONTABILITÀ
        if(!keys.CONVENZIONI_IN_TRATTENUTA) delete this.CONVENZIONI_IN_TRATTENUTA
        if(!keys.MONITORAGGIO_GUIDA_SMART) delete this.MONITORAGGIO_GUIDA_SMART
    }
}

class BurgerMenuBackOffice extends BackOffice {

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkExistLinks(keys) {
        cy.get('lib-burger-icon').click()

        // if (Cypress.env('monoUtenza')) {
        //     delete LinksBurgerMenu.DENUNCIA_BMP
        //     delete LinksBurgerMenu.CONVENZIONI_IN_TRATTENUTA
        //     delete LinksBurgerMenu.MONITORAGGIO_GUIDA_SMART
        //     const linksBurger = Object.values(LinksBurgerMenu)
        //     cy.get('lib-side-menu-link').find('a').each(($checkLinksBurger, i) => {
        //         expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        //     }).should('have.length', 17)
        // } else if (Cypress.env('isAviva')) {
        //     delete LinksBurgerMenu.DENUNCIA
        //     delete LinksBurgerMenu.DENUNCIA_BMP
        //     delete LinksBurgerMenu.SINISTRI_INCOMPLETI
        //     delete LinksBurgerMenu.SINISTRI_CANALIZZATI
        //     delete LinksBurgerMenu.GESTIONE_CONTATTO_CARD
        //     const linksBurger = Object.values(LinksBurgerMenu)
        //     cy.get('lib-side-menu-link').find('a').each(($checkLinksBurger, i) => {
        //         expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        //     }).should('have.length.gte', 13).and('have.length.lte', 15)
        // } else {
        //     const linksBurger = Object.values(LinksBurgerMenu)
        LinksBurgerMenu.deleteKey(keys)
        const linksBurger = Object.values(LinksBurgerMenu)
        cy.get('lib-side-menu-link').find('a').each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
        // }
    }

    /**
     * Click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLink(page) {
        cy.get('lib-burger-icon').click()
        cy.contains(page, { timeout: 5000 }).click()

        Common.canaleFromPopup()
        super.checkPage(page)
    }

    /**
     * Verifica assenza link in Burger Menu BackOffice
     * @param {String} link : verifica il link che non deve essere presente
     */
    static checkNotExistLink(link) {
        cy.get('lib-burger-icon').click()
        cy.get('lib-side-menu').find('a').should('not.contain.text', link)

    }
}

export default BurgerMenuBackOffice