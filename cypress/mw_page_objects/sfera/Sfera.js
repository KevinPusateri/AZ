/// <reference types="Cypress" />

import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"
import NGRA2013 from "../../mw_page_objects/motor/NGRA2013"

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
    }
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
    },
    SOSTITUZIONE_RIATTIVAZIONE_AUTO: {
        parent: 'Polizza',
        key: 'Sostituzione / Riattivazione auto'
    }
}

/**
 * Enum Cluster
 * @readonly
 * @enum {Object}
 */
const ClusterMotor = {
    DELTA_PREMIO_NEGATIVO: "Delta premio negativo",
    DELTA_PREMIO_POSITIVO: "Delta premio positivo",
}

/**
 * Enum TipoSostituzioneRiattivazione
 * @readonly
 * @enum {Object}
 */
const TipoSostituzioneRiattivazione = {
    SOSTITUZIONE_STESSO_VEICOLO: "Sostituzione stesso veicolo",
    SOSTITUZIONE_DIVERSO_VEICOLO: "Sostituzione diverso veicolo",
    SOSTITUZIONE_MODIFICA_TARGA: "Sostituzione per modifica targa",
    SOSTITUZIONE_MODIFICA_DATI_TECNICI: "Sostituzione per modifica dati tecnici",
    SOSTITUZIONE_MODIFICA_GANCIO_TRAINO: "Sostituzione per modifica gancio traino",
    RIATTIVAZIONE_ALTRO_VEICOLO: "Riattivazione altro veicolo",
    RIATTIVAZIONE_STESSO_VEICOLO: "Riattivazione stesso veicolo",
    CESSIONE: "Cessione"
}

/**
 * Enum Filtri
 * @readonly
 * @enum {Object}
 */
const Filtri = {
    INFO: {
        key: "Info",
        values: {
            VUOTO: "Vuoto",
            ALTRE_SCADENZE_IN_QUIETANZAMENTO: "AQ",
            ENTRO_PERIODO_MORA: "EM",
            RATE_PRECEDENTI_SCOPERTE: "RS"
        }
    },
    PORTAFOGLIO: {
        key: "Pt.",
        values: {
            VUOTO: "Vuoto",
            AUTO: "AU"
        }
    }
}

/**
 * @class
 * @classdesc Classe per interagire con Sfera 4.0 da Matrix Web
 * @author Andrea 'Bobo' Oboe & Kevin Pusateri
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
     * Funzione che ritorna i Cluster Motor
     * @returns {ClusterMotor} Cluster Motor
     */
    static get CLUSTERMOTOR() {
        return ClusterMotor
    }

    /**
     * Funzione che ritorna i tipi di quietanze
     * @returns {TipoQuietanze} tipo di Quietanze
     */
    static get TIPOQUIETANZE() {
        return TipoQuietanze
    }

    /**
     * Funzione che ritorna i tipi di Filtri
     * @returns {Filtri} tipi di Filtri
     */
    static get FILTRI() {
        return Filtri
    }

    /**
     * Funzione che ritorna i tipi di Sostituzione / Riattivazione Auto
     * @returns {TipoSostituzioneRiattivazione} tipi di Sostituzione / Riattivazione Auto
     */
    static get TIPOSOSTITUZIONERIATTIVAZIONE() {
        return TipoSostituzioneRiattivazione
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
     * @private
     */
    static menuContestualeParent() {
        return cy.get('.cdk-overlay-pane').should('exist').and('be.visible')
    }

    /**
    * Ritorna il menu contestuale figlio
    * @returns {Object} menu contestuale figlio
    * @private
    */
    static menuContestualeChild() {
        return cy.get('.cdk-overlay-pane').last().should('exist').and('be.visible')
    }

    /**
     * Ritorna il dropdown Tipo di sostituzione per Sostituzione/Riattivazione auto
     * @returns {Object} Tipo di sostituzione auto dropdown da popup
     * @private
     */
    static dropdownSostituzioneRiattivazione() {
        return cy.get('sfera-sost-auto-modal').find('nx-dropdown').should('exist').and('be.visible')
    }

    /**
     * Ritorna il pulsante Procedi
     * @returns {Object} pulsante Procedi
     * @private
     */
    static procedi() {
        return cy.contains('Procedi').should('exist').and('be.visible')
    }
    //#endregion

    /**s
     * Effettua accesso al Nuovo Sfera (da Sales)
     * ed attende il caricameto di vari servizi di BE
     */
    static accediSferaDaHomePageMW() {
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
     * Verifica accesso a Sfera
     */
    static verificaAccessoSfera() {
        cy.intercept(infoUtente).as('infoUtente')
        cy.intercept(agenzieFonti).as('agenzieFonti')
        cy.intercept(caricaVista).as('caricaVista')
        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

        cy.wait('@infoUtente', { requestTimeout: 60000 })
        cy.wait('@agenzieFonti', { requestTimeout: 60000 })
        cy.wait('@caricaVista', { requestTimeout: 60000 })
        cy.wait('@aggiornaCaricoTotale', { requestTimeout: 60000 })
        cy.wait('@aggiornaContatoriCluster', { requestTimeout: 60000 })

        this.bodyTableEstrazione()
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
     * @param {Filtri} filtro da utilizzare
     * @param {String} valore da ricercare
     */
    static filtraSuColonna(filtro, valore) {
        cy.get('thead').within(() => {

            cy.get(`div:contains(${filtro.key})`).parent().find('nx-icon:last').click()
            cy.get('div[class="filterPopover ng-star-inserted"]').within(() => {
                cy.get('input:visible').type(valore)
                cy.wait(500)
                cy.get('span[class="nx-checkbox__control"]:visible').click()
                cy.intercept(estraiQuietanze).as('estraiQuietanze')
                cy.contains('Applica').should('be.enabled').click()
                cy.wait('@estraiQuietanze', { requestTimeout: 60000 })
            })
        })
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
     * @param {TipoSostituzioneRiattivazione} [tipoSostituzioneRiattivazione] default null, tipo di sostituzione/riattivazione auto da effettuare
     */
    static apriVoceMenu(voce, polizza = null, tipoSostituzioneRiattivazione = null) {
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

        //Verifichiamo gli accessi in base al tipo di menu selezionato
        switch (voce) {
            case VociMenu.DELTA_PREMIO:
                NGRA2013.verificaAccessoRiepilogo()
                break;
            case VociMenu.SOSTITUZIONE_RIATTIVAZIONE_AUTO:
                //Scegliamo il Tipo di sostituzione dal popup
                this.dropdownSostituzioneRiattivazione().click()
                cy.contains(tipoSostituzioneRiattivazione).should('exist').click()
                this.procedi().click()
                cy.pause()
                break;
        }
    }
    /**
     * Seleziona il cluster motor sul quale effettuare l'estrazione
     * @param {ClusterMotor} clusterMotor tipo di cluster da selezionare
     */
    static selezionaCluserMotor(clusterMotor) {
        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
        cy.contains(clusterMotor).click()
        cy.wait('@aggiornaCaricoTotale', { requestTimeout: 60000 })

        //Verifichiamo che sia valorizzato il numero tra ()
        cy.contains(clusterMotor).invoke('text').then(clusterMotorText => {
            expect(parseInt(clusterMotorText.match(/\(([^)]+)\)/)[1])).to.be.greaterThan(0)
        })
        this.estrai()
    }
}

export default Sfera