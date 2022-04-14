/// <reference types="Cypress" />

import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"
import NGRA2013 from "../../mw_page_objects/motor/NGRA2013"
import Common from "../../mw_page_objects/common/Common"
import IncassoDA from "../../mw_page_objects/da/IncassoDA"
import InquiryAgenzia from "../../mw_page_objects/da/InquiryAgenzia"
import Folder from "../../mw_page_objects/common/Folder"

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

const interceptContraenteScheda = () => {
    cy.intercept({
        method: 'POST',
        url: '**/recuperaDatiAnagraficiCliente',
    }).as('getDatiAnagrafici');
    cy.intercept({
        method: 'POST',
        url: '**/recuperaIniziativeCliente',
    }).as('getDatiIniziative');
    cy.intercept({
        method: 'POST',
        url: '**/recuperaContrattiCliente',
    }).as('getContratti');
    cy.intercept({
        method: 'POST',
        url: '**/recuperaFastquoteCliente',
    }).as('getFastquote');

    //Note
    cy.intercept({
        method: 'POST',
        url: '**/recuperaNoteCliente',
    }).as('getRecuperaNote');
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
 * Enum Voci Menu Quietanza
 * @readonly
 * @enum {Object}
 */
const VociMenuQuietanza = {
    INCASSO: {
        root: 'Quietanza',
        parent: '',
        key: 'Incasso'
    },
    DELTA_PREMIO: {
        root: 'Quietanza',
        parent: '',
        key: 'Delta premio'
    },
    RIQUIETANZAMENTO: {
        root: 'Quietanza',
        parent: '',
        key: 'Riquietanzamento per clienti valori extra'
    },
    VARIAZIONE_RIDUZIONE_PREMI: {
        root: 'Quietanza',
        parent: 'Riduzione premi',
        key: 'Variazione riduzione premi'
    },
    CONSOLIDAMENTO_RIDUZIONE_PREMI: {
        root: 'Quietanza',
        parent: 'Riduzione premi',
        key: 'Consolidamento Riduzione Premi'
    },
    GENERAZIONE_AVVISO: {
        root: 'Quietanza',
        parent: '',
        key: 'Generazione avviso'
    },
    STAMPA_SENZA_INCASSO: {
        root: 'Quietanza',
        parent: '',
        key: 'Stampa senza incasso'
    },
}

/**
 * Enum Voci Menu Polizza
 * @readonly
 * @enum {Object}
 */
const VociMenuPolizza = {
    RIPRESA_PREVENTIVO_AUTO: {
        root: 'Polizza',
        parent: '',
        key: 'Ripresa prev. auto'
    },
    SOSTITUZIONE_RAMI_VARI: {
        root: 'Polizza',
        parent: '',
        key: 'Sostituzione rami vari'
    },
    SOSTITUZIONE_RIATTIVAZIONE_AUTO: {
        root: 'Polizza',
        parent: '',
        key: 'Sostituzione / Riattivazione auto'
    },
    CONSULTAZIONE_POLIZZA: {
        root: 'Polizza',
        parent: 'Consultazione',
        key: 'Polizza'
    },
    CONSULTAZIONE_DOCUMENTI_POLIZZA: {
        root: 'Polizza',
        parent: 'Consultazione',
        key: 'Documenti di polizza'
    },
    COMPARATORE_AZ_ULTRA: {
        root: 'Polizza',
        parent: 'Consultazione',
        key: 'Comparatore AZ ultra'
    },
    DETTAGLIO_ABBINATA: {
        root: 'Polizza',
        parent: '',
        key: 'Dettaglio abbinata'
    },
    DISATTIVAZIONE_ALLIANZ_PAY: {
        root: 'Polizza',
        parent: '',
        key: 'Disattivazione Allianz Pay'
    },
    MODIFICA_MODALITA_PAGAMENTO: {
        root: 'Polizza',
        parent: '',
        key: 'Modifica modalità di pagamento preferito della polizza'
    }
    //TODO Modulari quando trovo il parent menu attivo
}

/**
 * Enum Cluster
 * @readonly
 * @enum {Object}
 */
const ClusterMotor = {
    DELTA_PREMIO_NEGATIVO: "Delta premio negativo",
    DELTA_PREMIO_POSITIVO: "Delta premio positivo",
    QUIETANZE_STAMPABILI: "Quietanze Stampabili",
    QUIETANZE_STAMPATE: "Quietanze Stampate",
    IN_MORA: "In mora"
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
    },
    POLIZZA: {
        key: "Polizza",
        values: {
            VUOTO: "Vuoto"
        }
    }
}

/**
 * Enum Data Input Form
 * @enum {Object}
 */
const DateInputForm = {
    DATA_INIZIO_PERIODO: "dataInizioPeriodo",
    DATA_FINE_PERIODO: "dataFinePeriodo"
}

/**
 * Enum Seleziona Righe
 * @enum {Object}
 */
const SelezionaRighe = {
    PAGINA_CORRENTE: "Pagina corrente",
    TUTTE_LE_PAGINE: "Tutte le pagine"
}

/**
 * Enum Colori assegnabili (si basa sulla 01-710000)
 * ? Come si generano nuovi colori ?
 * @enum {Object}
 */
const Colori = {
    NESSUN_COLORE: "Nessun colore",
    SIGNIFICATO_ALFA: "significato alfa",
    TEST: "test",
    TEST_3: "test 3"
}

/**
 * Enum Portafogli selezionabili in estrazione
 * @enum {Object}
 */
const Portafogli = {
    MOTOR: "Motor",
    RAMI_VARI: "RamiVari",
    VITA: "Vita"
}

/**
 * Enum Tab su Scheda Dati Complementari Cliente 
 * @enum {Object}
 */
const TabScheda = {
    PANORAMICA: "Panoramica",
    NOTE: "Note",
    DETTAGLIO_PREMI: "Dettaglio Premi",
    INIZIATIVE: "Iniziative"
}

/**
 * Enum Panel da Panoramica 
 * @enum {Object}
 */
const Pannelli = {
    VALORE_CLIENTE: "Valore Cliente",
    POLIZZE: "Polizze",
    PROPOSTE: "Proposte",
    PREVENTIVI: "Preventivi",
    FASTQUOTE: "Fastquote",
    DISDETTE: "Disdette"
}
/**
 * @class
 * @classdesc Classe per interagire con Sfera 4.0 da Matrix Web
 * @author Andrea 'Bobo' Oboe & Kevin Pusateri
 */
class Sfera {

    /**
     * Funzione che ritorna i portafogli disponibili su cui effettauare le estrazioini
     * @returns {Portafogli} Portafogli disponibili
     */
    static get PORTAFOGLI() {
        return Portafogli
    }

    /**
     * Funzione che ritorna i colori disponibili per le righe
     * @returns {Colori} Colori possibili per le righe
     */
    static get COLORI() {
        return Colori
    }

    /**
     * Funzione che ritorna le voci disponibili per la selezione multipla delle righe di tabella
     * @returns {SelezionaRighe} Righe da selezionare
     */
    static get SELEZIONARIGHE() {
        return SelezionaRighe
    }

    /**
     * Funzione che ritorna le voci di menu Quietanza disponibili su Sfera
     * @returns {VociMenuQuietanza} Voci di Menu Quietanza
     */
    static get VOCIMENUQUIETANZA() {
        return VociMenuQuietanza
    }

    /**
     * Funzione che ritorna le voci di menu Polizza disponibili su Sfera
     * @returns {VociMenuPolizza} Voci di Menu Polizza
     */
    static get VOCIMENUPOLIZZA() {
        return VociMenuPolizza
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
     * Funzione che ritorna Tab nella Scheda Anagrafica
     * @returns {TabScheda} tipo di Scheda
     * @private
     */
    static get TABSCHEDA() {
        return TabScheda
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

    /**
     * Ritorna il pulsante di refresh vicino alle date
     * @returns {Object} pulsante refresh
     * @private
     */
    static aggiorna() {
        return cy.get('nx-icon[class="refresh-icon"]').should('exist').and('be.visible')
    }

    /**
     * 
     * @returns Ritorna il pulsante 'Assegna colore'
     * @return {Object} pulsante 'Assegna colore'
     * @private
     */
    static assegnaColore() {
        return cy.contains('Assegna colore').should('exist').and('be.visible')
    }

    /**
     * 
     * @returns Ritorna il dropdown con i portafogli disponibili
     * @return {Object} dropdown con i portafogli disponibili
     * @private
     */
    static lobPortafogli() {
        return cy.get('nx-dropdown[formcontrolname="lobSelezionate"]').should('exist').and('be.visible')
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

        cy.wait('@infoUtente', { timeout: 60000 })
        cy.wait('@agenzieFonti', { timeout: 60000 })
        cy.wait('@caricaVista', { timeout: 60000 })
        cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
        cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
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

        cy.wait('@infoUtente', { timeout: 60000 })
        cy.wait('@agenzieFonti', { timeout: 60000 })
        cy.wait('@caricaVista', { timeout: 60000 })
        cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
        cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })

        this.bodyTableEstrazione()
    }

    /**
     * Espande il pannello che contiene rami estrazione, date, Incassate, In lavorazione e Da lavorare
     */
    static espandiPannello() {
        cy.get('body').within($body => {
            var espandiPannelloIsVisible = $body.find('span:contains("Espandi Pannello")').is(':visible')
            if (espandiPannelloIsVisible)
                cy.contains('Espandi Pannello').click()
        })
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
                    cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                }
            })
        })
    }

    /**
     * Filtra il tipo di quietanze da estrarre
     * @param {TipoQuietanze} tipoQuietanze Tipo di Quietanze che devono rimanere nell'estrazione
     */
    static filtraTipoQuietanze(tipoQuietanze) {
        //Vediamo se espandere il pannello per le date
        this.espandiPannello()

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
                cy.wait('@estraiQuietanze', { timeout: 120000 })
            })
        })
    }

    /**
     * Effettua l'Estrai delle Quietanze
     */
    static estrai() {
        cy.intercept(estraiQuietanze).as('estraiQuietanze')
        cy.contains('Estrai').should('exist').click()

        cy.wait('@estraiQuietanze', { timeout: 120000 })

        //Verifichiamo che la tabella d'estrazione sia presente
        this.tableEstrazione()

        cy.wait(2000)
    }

    /**
     * Effettua l'accesso al menu contestuale della prima riga o della polizza specificata
     * @param {VociMenuQuietanza} voce 
     * @param {Boolean} [flussoCompleto] default true, se a false effettua solo verifica aggancio applicativo
     * @param {number} [polizza] default null, se specificato clicca sul menu contestuale della polizza passata
     * @param {TipoSostituzioneRiattivazione} [tipoSostituzioneRiattivazione] default null, tipo di sostituzione/riattivazione auto da effettuare
     * 
     * @returns {Promise} polizza su cui sono state effettuate le operazioni
     */
    static apriVoceMenu(voce, flussoCompleto = true, polizza = null, tipoSostituzioneRiattivazione = null) {
        return new Cypress.Promise(resolve => {
            if (polizza === null)
                this.bodyTableEstrazione().find('tr:first').within(() => {
                    this.threeDotsMenuContestuale().click({ force: true })
                })
            else
                this.bodyTableEstrazione().find('tr').contains(polizza).parents('tr').within(() => {
                    this.threeDotsMenuContestuale().click({ force: true })
                })

            //Andiamo a selezionare la root (Quietanza,Polizza...)
            this.menuContestualeParent().within(() => {
                cy.contains(voce.root).should('exist').and('be.visible').click()
            })

            //Andiamo a selezionare prima il menu contestuale 'padre' (se presente)
            if (voce.parent !== '') {
                this.menuContestualeParent().within(() => {
                    cy.contains(voce.parent).should('exist').and('be.visible').click()
                })
            }

            //Andiamo a selezionare il menu contestuale 'figlio'
            this.menuContestualeChild().within(() => {
                //? CONSULTAZIONE_DOCUMENTI_POLIZZA si apre su nuovo tab, quindi gestisto il _self
                if (voce.key === VociMenuPolizza.CONSULTAZIONE_DOCUMENTI_POLIZZA.key) {
                    cy.window().then(win => {
                        cy.stub(win, 'open').callsFake((url) => {
                            return win.open.wrappedMethod.call(win, url, '_self');
                        }).as('Open');
                    })
                    cy.contains(voce.key).click()
                    cy.get('@Open')
                }
                else
                    cy.contains(voce.key).click()
            })

            Common.canaleFromPopup()

            //Salviamo la polizza sulla quale effettuiamo le operazioni per poterla utilizzare successivamente
            let numPolizza = ''
            //Verifichiamo gli accessi in base al tipo di menu selezionato
            switch (voce) {
                case VociMenuQuietanza.INCASSO:
                    IncassoDA.accessoMezziPagam()
                    cy.wait(2000)
                    cy.screenshot('Incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso di incasso completo
                    }
                    else {
                        IncassoDA.clickCHIUDI()
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                    }
                    break;
                case VociMenuQuietanza.DELTA_PREMIO:
                    NGRA2013.verificaAccessoRiepilogo()
                    cy.wait(2000)
                    cy.screenshot('Delta Premio', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso di delta premio
                    }
                    else {
                        NGRA2013.home(true)
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                        break;
                    }
                case VociMenuQuietanza.VARIAZIONE_RIDUZIONE_PREMI:
                    IncassoDA.accessoGestioneFlex()
                    IncassoDA.salvaSimulazione()
                    cy.wait(200)
                    cy.screenshot('Variazione Riduzione Premi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso di incasso completo
                    }
                    else {
                        IncassoDA.clickCHIUDI()
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                    }
                    break;
                case VociMenuQuietanza.RIQUIETANZAMENTO:
                    break;
                case VociMenuPolizza.SOSTITUZIONE_RIATTIVAZIONE_AUTO:
                    //Scegliamo il Tipo di sostituzione dal popup
                    this.dropdownSostituzioneRiattivazione().click()
                    cy.contains(tipoSostituzioneRiattivazione).should('exist').click()
                    this.procedi().click()
                    Common.canaleFromPopup()
                    NGRA2013.verificaAccessoDatiAmministrativi()
                    cy.screenshot('Sostituzione Riattivazione Auto', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso di incasso completo
                    }
                    else {
                        NGRA2013.home(true)
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                    }
                    break;
                case VociMenuQuietanza.STAMPA_SENZA_INCASSO:
                    IncassoDA.accessoMezziPagam()
                    cy.wait(200)
                    cy.screenshot('Stampa Senza Incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        IncassoDA.clickStampa()
                        IncassoDA.getNumeroContratto().then(numContratto => {
                            numPolizza = numContratto
                            IncassoDA.clickCHIUDI()
                            //Verifichiamo il rientro in Sfera
                            this.verificaAccessoSfera()
                            resolve(numPolizza)
                        })
                    }
                    else {
                        IncassoDA.clickCHIUDI()
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                    }
                    break;
                case VociMenuPolizza.CONSULTAZIONE_POLIZZA:
                    InquiryAgenzia.verificaAccessoInquiryAgenzia()
                    cy.screenshot('Inquiry Agenzia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        InquiryAgenzia.clickUscita()
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                    }
                    break;
                case VociMenuPolizza.CONSULTAZIONE_DOCUMENTI_POLIZZA:
                    Folder.verificaCaricamentoFolder()
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.go('back')
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                    }
                    break;
                case VociMenuPolizza.MODIFICA_MODALITA_PAGAMENTO:
                    cy.pause()
                    break;
            }
        })
    }

    /**
     * Seleziona il cluster motor sul quale effettuare l'estrazione
     * @param {ClusterMotor} clusterMotor tipo di cluster da selezionare
     * @param {Boolean} [performEstrai] default false, se true clicca su estrai
     */
    static selezionaCluserMotor(clusterMotor, performEstrai = false) {
        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
        //Vediamo se espandere il pannello per le date
        this.espandiPannello()

        cy.contains(clusterMotor).click()
        cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })

        //Verifichiamo che sia valorizzato il numero tra ()
        cy.contains(clusterMotor).invoke('text').then(clusterMotorText => {
            expect(parseInt(clusterMotorText.match(/\(([^)]+)\)/)[1])).to.be.greaterThan(0)
        })

        if (performEstrai)
            this.estrai()
    }

    /**
     * Imposta la data di inizio e fine sulla quale effettuare l'estrazione
     * @param {Boolean} [performEstrai] default false, se true clicca su estrai
     * @param {string} [dataInizio] default undefined; se non specificata, setta automaticamente la data 1 mese prima da oggi
     * @param {string} [dataFine] default undefined; se non specificata, setta automaticamente la data odierna
     */
    static setDateEstrazione(performEstrai = false, dataInizio = undefined, dataFine = undefined) {

        //Vediamo se espandere il pannello per le date
        this.espandiPannello()

        //Impostiamo la data di inizio estrazione
        if (dataInizio === undefined) {
            //Se non specificata la data, settiamo automaticamente la data a 1 mese prima rispetto ad oggi
            let today = new Date()
            today.setMonth(today.getMonth() - 1)
            dataInizio = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear()
        }

        cy.get(`input[formcontrolname="${DateInputForm.DATA_INIZIO_PERIODO}"]`).clear().wait(500).type(dataInizio).wait(500)

        //Impostiamo la data di fine estrazione
        if (dataFine === undefined) {
            //Se non specificata la data, settiamo automaticamente la data odierna
            let today = new Date()
            dataFine = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear()
        }

        cy.get(`input[formcontrolname="${DateInputForm.DATA_FINE_PERIODO}"]`).clear().wait(500).type(dataFine).wait(500).type('{esc}')

        //Clicchiamo su estrai
        if (performEstrai) this.estrai()

        cy.wait(2000)
    }

    /**
     * Effettua selezione multipla sulle righe della tabella di estrazione
     * @param {SelezionaRighe} righe Tipo di selezione multipla da effettuare
     */
    static selectRighe(righe) {
        cy.get('.nx-checkbox__control:visible').first().should('be.visible').click().wait(500)
        cy.get('div[class^="all-page"]').should('be.visible').within($div => {
            if (righe === SelezionaRighe.PAGINA_CORRENTE)
                cy.get('nx-checkbox').first().click()
            else
                cy.get('nx-checkbox').last().click()
        })
    }

    /**
     * Assegna un colore alle righe precedentemente selezionate
     * @param {Colori} colore da assegnare
     */
    static assegnaColoreRighe(colore) {
        this.assegnaColore().click()
        cy.get('div[id^="cdk-overlay"]').should('be.visible').within(() => {
            cy.contains(colore).parent().find('nx-radio').click()
            if (colore !== Colori.NESSUN_COLORE)
                cy.contains(colore).parents('nx-card').find('div:first').invoke('attr', 'style').as('styleColor')
            cy.contains('Procedi').click()

        })

        cy.wait(5000)

        cy.get('sfera-assegna-colore').should('be.visible').within(() => {

            cy.get('h3').should('include.text', 'Colore assegnato con successo')
            cy.get('button').last().should('be.visible').click()

        })

        //Verifichiamo che la tabella d'estrazione sia presente
        this.tableEstrazione()

        if (colore === Colori.NESSUN_COLORE)
            cy.get('tr[class="nx-table-row ng-star-inserted"]').should('be.visible').and('have.attr', 'style', 'background: white;')
        else
            cy.get('@styleColor').then((color) => {

                cy.get('tr[class="nx-table-row ng-star-inserted"]').should('be.visible').and('have.attr', 'style', 'background: ' + color.split('color: ')[1])
            })
        cy.screenshot('Verifica colori', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Seleziona i portafogli su cui effettuare l'estrazione
     * @param {Boolean} performEstrai clicca su Estrai o meno
     * @param {...any} portafogli da selezionare
     */
    static selezionaPortafoglio(performEstrai, ...portafogli) {
        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

        //Vediamo se espandere il pannello per le date
        this.espandiPannello()
        this.lobPortafogli().click().wait(500)

        cy.get('div[class="nx-dropdown__panel nx-dropdown__panel--in-outline-field ng-star-inserted"]').within(() => {
            //Selezioniamo 
            for (let i = 0; i < portafogli.length; i++) {
                cy.get(`div:contains(${portafogli[i]})`).parents('label').then($chekcBoxChecked => {

                    if (!$chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${portafogli[i]})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                    }
                })
            }

            //Controllo le eventuali lob da de-selezionare
            if (!portafogli.includes(Portafogli.MOTOR))
                cy.get(`div:contains(${Portafogli.MOTOR})`).parents('label').then($chekcBoxChecked => {

                    if ($chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${Portafogli.MOTOR})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                    }
                })
            if (!portafogli.includes(Portafogli.RAMI_VARI))
                cy.get(`div:contains(${Portafogli.RAMI_VARI})`).parents('label').then($chekcBoxChecked => {

                    if ($chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${Portafogli.MOTOR})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                    }
                })
            if (!portafogli.includes(Portafogli.VITA))
                cy.get(`div:contains(${Portafogli.VITA})`).parents('label').then($chekcBoxChecked => {

                    if ($chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${Portafogli.MOTOR})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                    }
                })
        })

        cy.get('body').click()

        if (performEstrai)
            this.estrai()
    }

    /**
     * Seleziona la vista 
     * @param {string} nameVista - nome della Vista
     */
    static selezionaVista(nameVista) {
        // click Seleziona Vista tendina
        cy.get('nx-icon[class="nx-icon--s ndbx-icon nx-icon--chevron-down-small"]').click()

        // Click Le mie viste
        cy.get('div[class="cdk-overlay-pane"]').first().should('be.visible').within(() => {
            cy.contains('Le mie viste').click()
        }).then(() => {

            cy.get('div[class="cdk-overlay-pane"]').last()
                .should('be.visible').within(() => {
                    cy.get('button').contains(nameVista).click({ force: true })
                })
        })

    }

    /**
     * Verifica se colonne mancanti di aggiungerli nella vista
     * @param {Object} colonna - array colonne 
     */
    static gestisciColonne(colonna) {

        cy.get('table').should('be.visible').then(() => {
            var colonneDaAggiungere = []
            var colonnePresenti = []
            // Verifica se le colonne richieste siano già presenti nella tabella
            cy.get('th[class="nx-header-cell ng-star-inserted"]').find('div[class="table-component-th-name"]').each(($nameColonna) => {
                colonnePresenti.push($nameColonna.text())
            }).then(() => {
                for (let index = 0; index < colonna.length; index++) {
                    if (!colonnePresenti.includes(colonna[index])) {
                        colonneDaAggiungere.push(colonna[index])
                    }
                }
                // Se mancanti li aggiungiamo
                if (colonneDaAggiungere.length > 0) {
                    cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
                    cy.get('nx-modal-container').should('be.visible').within(() => {
                        for (let index = 0; index < colonneDaAggiungere.length; index++) {
                            cy.get('input[type="search"]').clear().type(colonneDaAggiungere[index])
                            cy.get('span')
                                .contains(colonneDaAggiungere[index])
                                .parents('div[class="flex-content center-content all-column-element ng-star-inserted"]').find('nx-icon').click()
                        }
                    })
                    cy.contains('Applica vista').click()
                }
            })
        })
    }

    static creaAndInviaCodiceAzPay() {
        //Click tre puntini
        cy.get('nx-icon[class="ndbx-icon nx-icon--ellipsis-v nx-link__icon nx-icon--auto"]')
            .should('be.visible')
            .click().wait(2000)

        cy.get('sfera-az-pay-modal').should('be.visible').click()
        cy.contains('Crea e invia codici AZPay').click()
        cy.contains('Procedi').click()
        cy.pause()

    }

    /**
     * Estrazione Excel e verifica dati estratti correttamente
     */
    static estrazioneReportExcel() {
        var currentColumn = [
            "Info",
            "Pt.",
            "Contraente",
            "Num.\nPolizza",
            "Scad.",
            "Inizio\nCopertura",
            "Evo",
            "Cod\nAgenzia",
            "Cod.\nFraz",
            "Sede",
            "Fonte",
            "Ramo",
            "Premio\nLordo Rata",
            "Gg.Mo.\n/Fuo.Mo.",
            "Descrizione\nProdotto",
            "Decorrenza\nPolizza",
            "Scadenza\nPolizza",
            "Vin",
            "Delta pr.\nNetto RCA",
            "Delta Premio\nNetto ARD",
            "Importo Canone",
            "Ind att.rin",
            "R.abb",
            "Coass.",
            "Val. Extra",
            "Avv Email",
            "Nr Avv\nSms",
            "Avv Pdf",
            "Targa",
            "Pag",
            "FQ\nTot",
            "Dlt pr Qtz €"
        ];
        var rows = []
        cy.get('tr[class="nx-table-row ng-star-inserted selectedRow"]').each((rowsTable) => {
            cy.wrap(rowsTable).find('nx-link[class="nx-link nx-link--small ng-star-inserted"] > a').then(($textCell) => {
                rows.push($textCell.text().trim())
            })
        })
        cy.get('nx-icon[name="arrow-download"]').should('be.visible').click()
        cy.get('sfera-esporta-pdf').should('be.visible').within(() => {
            cy.contains('Procedi').click()
            cy.get('h3').should('include.text', 'Excel esportato con successo')
            cy.contains('Chiudi').click()

            cy.task('getFolderDownload').then((folderDownload) => {
                cy.parseXlsx(folderDownload + "/REPORT.xlsx").then(jsonData => {
                    // Verifica Colonne presenti
                    expect(jsonData[0].data[0]).to.eqls(currentColumn);
                    for (let index = 0; index < rows.length; index++) {
                        // Verifica Clienti presenti
                        expect(jsonData[0].data[index + 1]).to.include(rows[index]);
                    }
                });
            })
        })

    }

    static checkColonnaPresente(colonna) {
        cy.get('div[class="table-component-th-name"]').should('include.text', colonna)
    }
    static checkColonnaAssente(colonna) {
        cy.get('div[class="table-component-th-name"]').should('not.include.text', colonna)
    }

    /**
     * Verifica drag & Drop Di una colonna in prima posizione
     * @param {string} colonna - nome della colonna
     */
    static dragDropColonna(colonna) {
        cy.get('table').should('be.visible').then(() => {
            cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
            cy.get('nx-modal-container:visible').should('be.visible').within(() => {
                cy.wait(5000)
                // const dataTransfer = new DataTransfer();
                cy.get('div[class="cdk-drop-list elements ng-star-inserted"]').should('be.visible').within(() => {
                    cy.contains(colonna)
                        .parents('div[class="cdk-drag flex-content center-content all-column-element element ng-star-inserted"]')
                        .within(() => {
                            cy.get('nx-icon:first').as('column')
                        })
                })
                cy.get('@column').move({ deltaX: 50, deltaY: 50 })
                // .trigger('dragstart', {
                //     dataTransfer
                // })

                // cy.get('div[class="cdk-drop-list elements ng-star-inserted]').trigger('drop', {
                //     dataTransfer
                // })

                // cy.get('')
            })
        })
    }

    /**
     * Verifica la colonna eliminata
     * @param {string} colonna - nome della colonna
     */
    static eliminaColonna(colonna) {
        cy.get('table').should('be.visible').then(() => {
            cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
            cy.get('nx-modal-container:visible').should('be.visible').within(() => {
                cy.wait(5000)
                cy.get('div[class="cdk-drop-list elements ng-star-inserted"]').should('be.visible').within(() => {
                    cy.contains(colonna)
                        .parents('div[class="cdk-drag flex-content center-content all-column-element element ng-star-inserted"]')
                        .within(() => {
                            cy.get('nx-icon[name="minus-circle"]').click()
                        })
                })
                cy.contains('Applica vista').click()
            })
        })
    }

    /**
      * Elimina colonna Permanente
      * @param {string} colonna - nome della colonna
      */
    static eliminaColonna(colonna) {
        cy.get('table').should('be.visible').then(() => {
            cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
            cy.get('nx-modal-container:visible').should('be.visible').within(() => {
                cy.wait(5000)
                cy.get('div[class="cdk-drop-list elements ng-star-inserted"]').should('be.visible').within(() => {
                    cy.contains(colonna)
                        .parents('div[class="cdk-drag flex-content center-content all-column-element element ng-star-inserted"]')
                        .within(() => {
                            cy.get('nx-icon[name="minus-circle"]').click()
                        })
                })
                cy.contains('Applica vista').click()
            })
        })
    }

    /**
     * Verifica il Blocco della Colonna
     * @param {string} colonna - nome della colonna
     */
    static bloccaColonna(colonna) {
        cy.get('table').should('be.visible').then(() => {
            cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
            cy.get('nx-modal-container').should('be.visible').within(() => {
                cy.wait(5000)
                cy.get('div[class="cdk-drop-list elements ng-star-inserted"]').should('be.visible').within(() => {
                    cy.contains(colonna)
                        .parents('div[class="cdk-drag flex-content center-content all-column-element element ng-star-inserted"]')
                        .within(() => {
                            // click blocca colonna
                            cy.get('nx-icon[name="lock-unlock"]').click()
                        })
                })
                cy.contains('Applica vista').click()
            })

            // Verifica il blocco effettuato
            cy.get('th[class="thSticky col-sticky-shadow col-sticky-1 nx-header-cell ng-star-inserted"]').should('include.text', colonna)
        })
    }

    static salvaVistaPersonalizzata() {
        cy.get('table').should('be.visible').then(() => {
            cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
            cy.get('nx-modal-container').should('be.visible').within(() => {
                cy.contains('Applica e salva vista').click()
            })
        })

        cy.get('nx-modal-container').should('be.visible').within(() => {
            cy.contains('Nuova vista').click()
            cy.get('input[placeholder="Inserisci il nome della vista"]').should('be.visible').type('Automatici')
            cy.contains('Salva').click()
        })
    }

    /**
     * Salva Vista Sostituendo una vista esistente
     * @param {string} vista - nome della vista esistente
     */
    static sostituisciVista(vista) {
        // Salva vista
        cy.get('table').should('be.visible').then(() => {
            cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
            cy.get('nx-modal-container').should('be.visible').within(() => {
                cy.contains('Applica e salva vista').click().wait(4000)
            })
        })

        // Sostituisci Vista
        cy.get('nx-modal-container[aria-label="Salva Vista"]').should('be.visible').within(() => {
            cy.contains('Sostituisci esistente').click()
            cy.get('nx-dropdown[placeholder="Seleziona una vista"]').click()
        })
        cy.get('div[role="listbox"]').should('be.visible').find('nx-dropdown-item:contains("' + vista + '")').click().wait(1500)
        cy.get('nx-modal-container[aria-label="Salva Vista"]:visible').within(() => {
            cy.get('button[nxmodalclose="Agree"]').click()
        })
        cy.get('div[class="success-container ng-star-inserted"]').should('be.visible')

    }

    /**
     * Verifica le fonti siano tutte correttamente selezionate
     */
    static fontiAllSelezionati() {
        cy.get('h3').contains('Fonti').click()
        cy.get('nx-modal-container[role="dialog"]').should('be.visible').within(() => {
            cy.screenshot('Fonti Selezionate', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.get('div[class="container-list ng-star-inserted"]').within(() => {
                cy.get('div[class="nx-checkbox__label-text"]').its('length').then((numFonti) => {
                    cy.get('nx-icon[class="ndbx-icon nx-icon--check nx-icon--auto ng-star-inserted"]').its('length').then((numCheckAttivi) => {
                        expect(numFonti).to.eql(numCheckAttivi, 'Fonti non tutti selezionati')
                    })
                })
            })
            cy.contains('Annulla').click()
        })
    }


    /**
    * Verifica le agenzie siano tutte correttamente selezionate
    */
    static agenzieAllSelezionati() {
        cy.get('h3').contains('Agenzie').click()

        cy.get('nx-modal-container[role="dialog"]').should('be.visible').within(() => {
            cy.screenshot('Agenzie Selezionate', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.get('div[class="container-list ng-star-inserted"]').within(() => {
                cy.get('div[class="nx-checkbox__label-text"]')
                    .its('length').then((numAgenzie) => {
                        cy.get('nx-icon[class="ndbx-icon nx-icon--check nx-icon--auto ng-star-inserted"]')
                            .its('length').then((numCheckAttivi) => {
                                expect(numAgenzie).to.eql(numCheckAttivi)
                            })
                    })
            })
            cy.contains('Annulla').click()
        })
    }

    static selectRandomContraente() {
        interceptContraenteScheda()
        cy.get('tr[class="nx-table-row ng-star-inserted"]').should('be.visible').then((rowsTable) => {
            let selected = Cypress._.random(rowsTable.length - 1);
            cy.wrap(rowsTable).eq(selected).find('nx-link[class="nx-link nx-link--small ng-star-inserted"] > a').then(($Contraente) => {
                cy.wrap($Contraente).click()
                cy.wait('@getDatiAnagrafici', { requestTimeout: 50000 })
                cy.wait('@getDatiIniziative', { requestTimeout: 50000 })
                cy.wait('@getContratti', { requestTimeout: 50000 })
                cy.wait('@getFastquote', { requestTimeout: 50000 })
            })
        })
    }

    /**
     * Verifica Tab Scheda 
     * @param {TabScheda} tabScheda Tipo di TabScheda per l'apertura del tab
     * 
     */
    static checkDatiComplementari(tabScheda) {
        // Fa il loop finchè non trova un Contraente con il Tab Iniziative Abilitato
        const loopCheckTabEnabled = (tabScheda) => {
            if (tabScheda === TabScheda.INIZIATIVE) {
                cy.get('button[role="tab"]').should('be.visible').then(($Tabs) => {
                    cy.wait(2500)
                    cy.wrap($Tabs).find('div[class="nx-tab-label__content"]:contains("' + tabScheda + '")')
                        .parents('button[role="tab"]').then(($TabScheda) => {
                            let classDisabled = 'nx-tab-header__item ng-star-inserted nx-tab-header__item--disabled'
                            let tabEnabled = $TabScheda.hasClass(classDisabled)
                            if (tabEnabled) {
                                cy.contains('Chiudi').click()
                                this.selectRandomContraente()
                                loopCheckAllTabEnabled(TabScheda.INIZIATIVE)
                            }
                        })

                })
            }
        }
        loopCheckTabEnabled(tabScheda)

        // Scheda Contraente
        cy.get('div[class="container-dati-complementari"]').should('be.visible').within(() => {
            //#region  Verifica Dati personali
            cy.get('div[class="row-info nx-margin-top-s nx-grid__row"]').within(($tabInfo) => {
                const title = [
                    'Dati personali',
                    'Contatti',
                    'Consensi'
                ]
                cy.get('div[class^="col-title nx-font-weight-bold"]').each(($title, index) => {
                    cy.wrap($title).should('contain.text', title[index])
                })

                const infoDati = [
                    'Cellulare',
                    'Fisso',
                    'E-Mail',
                    'Email',
                    'Grafo',
                    'OTP',
                ]
                for (let index = 0; index < infoDati.length; index++) {
                    cy.wrap($tabInfo).should('include.text', infoDati[index])
                }
            })


            //#region  Verifica dei Tab Presenti
            var currentTabs = []
            cy.get('button[role="tab"]').each(($tab) => {
                currentTabs.push($tab.text().trim())
            }).then(() => {
                expect(Object.values(TabScheda).sort()).to.deep.eq(currentTabs.sort())
            })

            // Inizio Verifica Scheda del TAB
            cy.contains(tabScheda).click()
            switch (tabScheda) {
                case TabScheda.PANORAMICA:
                    cy.screenshot(TabScheda.PANORAMICA, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    checkPanoramica()
                    break;
                case TabScheda.NOTE:
                    cy.screenshot(TabScheda.NOTE, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    // checkNote()
                    break
                case TabScheda.DETTAGLIO_PREMI:
                    cy.screenshot(TabScheda.DETTAGLIO_PREMI, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    checkDettaglioPremi()
                    break;
                case TabScheda.INIZIATIVE:
                    cy.screenshot(TabScheda.INIZIATIVE, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    checkIniziative()
                    break;
                default: throw new Error('Errore: ' + tabScheda + ' non Esiste')
            }
            //#endregion

            function checkNote() {
                cy.wait('@getRecuperaNote', { requestTimeout: 30000 })
                cy.get('button[nxmodalclose="Proceed"]').should('be.visible')
                cy.contains('Aggiungi nuova nota').click()
                cy.get('div[class="new-nota-container"]').should('be.visible').within(() => {
                    cy.get('input[formcontrolname="titolo"]').type('Titolo Automatici')
                    cy.get('textarea[formcontrolname="testo"]').type('Testo Automatici')
                    cy.contains('Salva nota').click()
                })
            }

            function checkPanoramica() {
                //#region  Verifica Panoramica
                cy.get('button[nxmodalclose="Proceed"]').should('be.visible')

                const radioButtonPanoramica = [
                    'Cliente',
                    'Nucleo'
                ]
                cy.get('div[class="horizontal-buttons"]').find('nx-radio').each(($radioButton) => {
                    expect(radioButtonPanoramica).to.include($radioButton.text())
                })

                // Verifica Nucleo disabilitato
                cy.get('nx-radio[nxvalue="nucleo"]').then(($radio) => {
                    const checkEnabledRadio = $radio.find('input[type="radio"]').is(':enabled')
                    if (checkEnabledRadio)
                        cy.get('nx-radio[nxvalue="nucleo"]').find('input[type="radio"]').should('not.have.attr', 'disabled')
                    else
                        cy.get('nx-radio[nxvalue="nucleo"]').find('input[type="radio"]').should('have.attr', 'disabled')
                })

                // Verifica pannelli presenti
                cy.get('nx-expansion-panel-title').should('be.visible').each(($panel) => {
                    expect(Object.values(Pannelli)).to.include($panel.text().trim())
                })

                // Verifica apertura pannelli
                cy.get('nx-expansion-panel-header[aria-disabled="false"]').each(($panel) => {
                    cy.wrap($panel).click()
                    cy.wrap($panel).parents('nx-expansion-panel')
                        .find('div[role="region"]')
                        .should('have.attr', 'style', 'visibility: visible;')
                    cy.wrap($panel).parents('nx-expansion-panel')
                        .find('table').should('be.visible')
                })

                //#endregion
            }

            function checkDettaglioPremi() {
                cy.get('button[nxmodalclose="Proceed"]').should('be.visible')
                cy.get('nx-tab-group').should('be.visible').within(() => {
                    const titleColumn = [
                        'Premio Quietanza anno corrente',
                        'Premio Quietanza anno precedente',
                        'Delta Premio Quietanza',
                        'Rid. Premio',
                        'Premio lavorato',
                    ]
                    cy.get('th').each(($titleColumn) => {
                        if ($titleColumn.text().length > 0) {
                            expect(titleColumn).to.include($titleColumn.text())
                        }
                    })

                    const titleRow = [
                        '% CMC',
                        '% commerciale',
                        '% totale',
                        'Rid. Premio'
                    ]
                    cy.get('td[class="nx-font-weight-bold"]').each(($titleRow) => {
                        if ($titleRow.text().length > 0) {
                            expect(titleRow).to.include($titleRow.text())
                        }
                    })
                })
            }

            function checkIniziative() {
                cy.get('table[class="table-panel ng-star-inserted"]').should('be.visible')
                cy.get('button[nxmodalclose="Proceed"]').should('be.visible')
            }
        })
    }
}
export default Sfera