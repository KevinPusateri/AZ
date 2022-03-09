/// <reference types="Cypress" />

import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"


//#region Intercept
const infoUtente = {
    method: 'GET',
    url: /infoUtente/
}
const agenzieFonti = {
    method: 'POST',
    url: /agenzieFonti/
}
const caricaVista = {
    method: 'POST',
    url: /caricaVista/
}
const aggiornaCaricoTotale = {
    method: 'POST',
    url: /aggiornaCaricoTotale/
}
const aggiornaContatoriCluster = {
    method: 'POST',
    url: /aggiornaContatoriCluster/
}
const estraiQuietanze = {
    method: 'POST',
    url: /estraiQuietanze/
}
//#endregion

/**
 * Enum Tipo Titolo
 * @readonly
 * @enum {Object}
 */
const TipoTitoli = {
    TITOLO_1: {
        key: 1,
        desc: 'perfezionamento'
    },
    TITOLO_2: {
        key: 2,
        desc: 'quietanza'
    },
    TITOLO_3: {
        key: 3,
        desc: 'regolazione premio'
    },
    TITOLO_4: {
        key: 4,
        desc: 'diritti di polizza'
    },
    TITOLO_5: {
        key: 5,
        desc: 'integrazione premio'
    },
    TITOLO_6: {
        key: 6,
        desc: 'indennità anticipata'
    },
    TITOLO_7: {
        key: 7,
        desc: 'incasso provvisorio'
    },
    TITOLO_8: {
        key: 8,
        desc: 'rimborso'
    },
}

/**
 * Enum Tipo Quietanze
 * @readonly
 * @enum {Object}
 * @private
 */
const TipoQuietanze = {
    INCASSATE: 'Incassata',
    IN_LAVORAZIONE: 'InLavorazione',
    DA_LAVORARE: 'DaLavorare'
}

/**
 * Enum Voci Menu
 * @readonly
 * @enum {Object}
 */
const VociMenu = {
    DELTA_PREMIO: {
        parent: 'Quietanza',
        key: 'Delta premio'
    }
}

/**
 * @class
 * @classdesc Classe per interagire con Sfera 4.0 da Matrix Web
 * @author Andrea 'Bobo' Oboe
 */
class Sfera {

    /**
     * Funzione che ritorna le voci di menu disponibili su Sfera
     * @returns {VociMenu} Voci di Menu
     */
    static get VOCIMENU() {
        return VociMenu
    }

    /**
     * Funzione che ritorna i tipi di quietanze
     * @returns {TipoQuietanze} tipo di Quietanze
     */
    static get TIPOQUIETANZE() {
        return TipoQuietanze
    }


    //#region Elementi Sfera
    /**
     * Ritorna la tabella delle estrazioni
     * @returns {Object} la tabella delle estrazioni
     * @private
     */
    static tableEstrazione() {
        return cy.get('app-table-component').should('exist').and('be.visible')
    }

    /**
     * Ritorna il body della tabella delle estrazioni
     * @returns {Object} il body della tabella con l'estrazione
     * @private
     */
    static bodyTableEstrazione() {
        return cy.get('tbody').should('exist').and('be.visible')
    }

    /**
     * Ritorna l'icona di accesso al menu contestuale
     * @returns {Object} ritorna l'icona di accesso al menu contestuale
     * @private
     */
    static threeDotsMenuContestuale() {
        return cy.get('nx-icon[name="ellipsis-h"]').should('exist').and('be.visible')
    }

    /**
     * Ritorna il menu contestuale principale (Quietanza, Polizza, Cliente, Emissione, Sinistri)
     * @returns {Object} menu contestuale principale
     */
    static menuContestualeParent() {
        return cy.get('.cdk-overlay-pane').should('exist').and('be.visible')
    }

    /**
    * Ritorna il menu contestuale figlio
    * @returns {Object} menu contestuale figlio
    */
    static menuContestualeChild() {
        return cy.get('.cdk-overlay-pane').last().should('exist').and('be.visible')
    }
    //#endregion

    /**
     * Effettua accesso al Nuovo Sfera (da Sales)
     * ed attende il caricameto di vari servizi di BE
     */
    static accediSfera() {
        cy.intercept(infoUtente).as('infoUtente')
        cy.intercept(agenzieFonti).as('agenzieFonti')
        cy.intercept(caricaVista).as('caricaVista')
        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

        TopBar.clickSales()
        Sales.clickLinkRapido('Nuovo Sfera')

        cy.wait('@infoUtente', { requestTimeout: 60000 })
        cy.wait('@agenzieFonti', { requestTimeout: 60000 })
        cy.wait('@caricaVista', { requestTimeout: 60000 })
        cy.wait('@aggiornaCaricoTotale', { requestTimeout: 60000 })
        cy.wait('@aggiornaContatoriCluster', { requestTimeout: 60000 })
    }

    /**
     * Espande il pannello che contiene rami estrazione, date, Incassate, In lavorazione e Da lavorare
     */
    static espandiPannello() {
        cy.contains('Espandi Pannello').should('exist').and('be.visible').click()
    }

    /**
     * Click sulla card in base al Tipo e se deve essere abilita o meno
     * @param {TipoQuietanze} tipoQuietanze Tipo di Quietanze da verficare nella relativa card
     * @param {boolean} [bePresent] default false, se a true verifica che il checkbox sia selezionato
     * @private
     */
    static clickTipoQuietanze(tipoQuietanze, bePresent = false) {

        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')

        cy.get('nx-checkbox[formcontrolname="' + tipoQuietanze + '"]').within(() => {

            cy.get('input').invoke('attr', 'value').then((isChecked) => {
                if ((isChecked && !bePresent) || (!isChecked && bePresent)) {
                    cy.get('nx-icon').click()
                    cy.wait('@aggiornaCaricoTotale', { requestTimeout: 60000 })
                }
            })
        })
    }

    /**
     * Filtra il tipo di quietanze da estrarre
     * @param {TipoQuietanze} tipoQuietanze Tipo di Quietanze che devono rimanere nell'estrazione
     */
    static filtraTipoQuietanze(tipoQuietanze) {
        switch (tipoQuietanze) {
            case TipoQuietanze.INCASSATE:
                this.clickTipoQuietanze(this.TIPOQUIETANZE.DA_LAVORARE)
                this.clickTipoQuietanze(this.TIPOQUIETANZE.IN_LAVORAZIONE)
                break
            case TipoQuietanze.DA_LAVORARE:
                this.clickTipoQuietanze(this.TIPOQUIETANZE.INCASSATE)
                this.clickTipoQuietanze(this.TIPOQUIETANZE.IN_LAVORAZIONE)
                break
            case TipoQuietanze.IN_LAVORAZIONE:
                this.clickTipoQuietanze(this.TIPOQUIETANZE.INCASSATE)
                this.clickTipoQuietanze(this.TIPOQUIETANZE.DA_LAVORARE)
                break
        }
    }

    /**
     * Effettua l'Estrai delle Quietanze
     */
    static estrai() {
        cy.intercept(estraiQuietanze).as('estraiQuietanze')
        cy.contains('Estrai').should('exist').click()

        cy.wait('@estraiQuietanze', { requestTimeout: 60000 })

        //Verifichiamo che la tabella d'estrazione sia presente
        this.tableEstrazione()
    }

    /**
     * Effettua l'accesso al menu contestuale della prima riga o della polizza specificata
     * @param {VociMenu} voce 
     * @param {number} [polizza] default null, se specificato clicca sul menu contestuale della polizza passata
     */
    static apriVoceMenu(voce, polizza = null) {
        if (polizza === null)
            this.bodyTableEstrazione().find('tr:first').within(() => {
                this.threeDotsMenuContestuale().click()
            })
        else
            this.bodyTableEstrazione().find('tr').contains(polizza).parents('tr').within(() => {
                this.threeDotsMenuContestuale().click()
            })


        //Andiamo a selezionare prima il menu contestuale 'padre'
        this.menuContestualeParent().within(() => {
            cy.contains(voce.parent).should('exist').and('be.visible').click()
        })

        //Andiamo a selezionare il menu contestuale 'figlio'
        this.menuContestualeChild().within(() => {
            cy.contains(voce.key).click()
        })

        cy.pause()

    }
}

export default Sfera