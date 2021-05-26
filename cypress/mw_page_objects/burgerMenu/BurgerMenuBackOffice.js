/// <reference types="Cypress" />
import Common from "../common/Common";
import BackOffice from "../navigation/BackOffice";

const LinksBurgerMenu = {
    HOME_BACKOFFICE: 'Home Backoffice',
    MOVIMENTAZIONE_SINISTRI: 'Movimentazione sinistri',
    DENUNCIA: 'Denuncia',
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
    MONITORAGGIO_CUSTOMER_DIGITAL_FOOTPRINT: 'Monitoraggio Customer Digital Footprint'
}

class BurgerMenuBackOffice extends BackOffice {

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkLinksBurgerMenu() {
        const linksBurger = Object.values(LinksBurgerMenu)

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

        Common.canaleFromPopup()
        super.checkPage(page)
    }



}

export default BurgerMenuBackOffice