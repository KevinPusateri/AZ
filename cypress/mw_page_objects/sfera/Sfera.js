/// <reference types="Cypress" />

import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"
import NGRA2013 from "../../mw_page_objects/motor/NGRA2013"
import Common from "../../mw_page_objects/common/Common"
import IncassoDA from "../../mw_page_objects/da/IncassoDA"

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
    SOSTITUZIONE_RIATTIVAZIONE_AUTO: {
        parent: '',
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
                cy.wait('@estraiQuietanze', { requestTimeout: 120000 })
            })
        })
    }

    /**
     * Effettua l'Estrai delle Quietanze
     */
    static estrai() {
        cy.intercept(estraiQuietanze).as('estraiQuietanze')
        cy.contains('Estrai').should('exist').click()

        cy.wait('@estraiQuietanze', { requestTimeout: 120000 })

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
                cy.contains(voce.key).click()
            })

            Common.canaleFromPopup()

            //Salviamo la polizza sulla quale effettuiamo le operazioni per poterla utilizzare successivamente
            let numPolizza = ''
            //Verifichiamo gli accessi in base al tipo di menu selezionato
            switch (voce) {
                case VociMenuQuietanza.INCASSO:
                    IncassoDA.accessoIncassoDA()
                    cy.screenshot('Applicativo Incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso di incasso completo
                    }
                    IncassoDA.clickCHIUDI()
                    //Verifichiamo il rientro in Sfera
                    this.verificaAccessoSfera()
                    break;
                case VociMenuQuietanza.DELTA_PREMIO:
                    NGRA2013.verificaAccessoRiepilogo()
                    break;
                case VociMenuPolizza.SOSTITUZIONE_RIATTIVAZIONE_AUTO:
                    //Scegliamo il Tipo di sostituzione dal popup
                    this.dropdownSostituzioneRiattivazione().click()
                    cy.contains(tipoSostituzioneRiattivazione).should('exist').click()
                    this.procedi().click()
                    cy.pause()
                    break;
                case VociMenuQuietanza.STAMPA_SENZA_INCASSO:
                    IncassoDA.accessoIncassoDA()
                    cy.pause()
                    IncassoDA.clickStampa()
                    IncassoDA.getNumeroContratto().then(numContratto => {
                        numPolizza = numContratto
                        IncassoDA.clickCHIUDI()
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera()
                        resolve(numPolizza)
                    })
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
        cy.wait('@aggiornaCaricoTotale', { requestTimeout: 60000 })

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
                        cy.wait('@aggiornaContatoriCluster', { requestTimeout: 60000 })
                    }
                })
            }

            //Controllo le eventuali lob da de-selezionare
            if (!portafogli.includes(Portafogli.MOTOR))
                cy.get(`div:contains(${Portafogli.MOTOR})`).parents('label').then($chekcBoxChecked => {

                    if ($chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${Portafogli.MOTOR})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { requestTimeout: 60000 })
                    }
                })
            if (!portafogli.includes(Portafogli.RAMI_VARI))
                cy.get(`div:contains(${Portafogli.RAMI_VARI})`).parents('label').then($chekcBoxChecked => {

                    if ($chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${Portafogli.MOTOR})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { requestTimeout: 60000 })
                    }
                })
            if (!portafogli.includes(Portafogli.VITA))
                cy.get(`div:contains(${Portafogli.VITA})`).parents('label').then($chekcBoxChecked => {

                    if ($chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${Portafogli.MOTOR})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { requestTimeout: 60000 })
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
     * @param {string} colonna - array colonne 
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

    /**
     * Verifica Che le colonne siano presenti su excel
     */
    static checkReportExcelColumn() {
    }

}

export default Sfera