/// <reference types="Cypress" />
import BackOffice from "../navigation/BackOffice";

class BurgerMenuBackOffice extends BackOffice{

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkLinksBurgerMenu() {
        const linksBurger = [
            'Home Backoffice',
            'Movimentazione sinistri',
            'Denuncia',
            'Denuncia BMP',
            'Consultazione sinistri',
            'Sinistri incompleti',
            'Sinistri canalizzati',
            'Sintesi Contabilità',
            'Giornata contabile',
            'Consultazione Movimenti',
            'Estrazione Contabilità',
            'Deleghe SDD',
            'Quadratura unificata',
            'Incasso per conto',
            'Incasso massivo',
            'Sollecito titoli',
            'Impostazione contabilità',
            'Convenzioni in trattenuta',
            'Monitoraggio Customer Digital Footprint'
        ]
        cy.get('lib-side-menu-link').find('a').should('have.length', 19).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    }

    /**
     * Click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLinkOnBurgerMenu(page) {
        cy.get('lib-burger-icon').click()
        cy.contains(page).click()
    }


}

export default BurgerMenuBackOffice