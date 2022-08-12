/// <reference types="Cypress" />

import TopBar from "../../mw_page_objects/common/TopBar"
import NGRA2013 from "../../mw_page_objects/motor/NGRA2013"
import Common from "../../mw_page_objects/common/Common"
import IncassoDA from "../../mw_page_objects/da/IncassoDA"
import InquiryAgenzia from "../../mw_page_objects/da/InquiryAgenzia"
import Folder from "../../mw_page_objects/common/Folder"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"


const getAppJump = () => {
    cy.get('iframe[title="app jump"]')
        .iframe()

    let iframeSCU = cy.get('iframe[title="app jump"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

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

const estraiTotaleQuietanzeScartate = {
    method: 'POST',
    url: /estraiTotaleQuietanzeScartate/
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

const cambiaModalitaPagamentoPreferita = {
    method: 'POST',
    url: '**/cambiaModalitaPagamentoPreferita'
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
 * Enum Viste Suggerite
 * @readonly
 * @enum {Object}
 * @private
 */
const VisteSuggerite = {
    VISTA_STANDARD: 'Vista Standard',
    CARICO_MANCANTE: 'Carico Mancante',
    DELTA_PREMIO: 'Delta premio – riduzione premio a cura dell’agenzia',
    QUIETANZE_SCARTATE: 'Quietanze Scartate',
    STAMPA_QUIETANZE: 'Stampa Quietanze',
    GESTIONE_ENTE: 'Gestione Ente',
    AVVISI_SCADENZA: 'Avvisi Scadenza'
}

/**
 * Enum Tipo avviso
 * @readonly
 * @enum {Object}
 * @private
 */
const TipoAvviso = {
    AVVISI_CARTACEI: 'Avvisi Cartacei',
    EMAIL: 'E-mail',
    SMS: 'Sms',
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
    QUIETANZAMENTO_ONLINE: {
        root: 'Quietanzamento online',
        parent: '',
        key: 'Quietanzamento online'
    },
}

/**
 * Enum Voci Menu Consultazione
 * @readonly
 * @enum {Object}
 */
const VociMenuConsultazione = {
    POLIZZA: {
        root: 'Consultazione',
        parent: '',
        key: 'Polizza'
    },
    DOCUMENTI_POLIZZA: {
        root: 'Consultazione',
        parent: '',
        key: 'Documenti di polizza'
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
 * Enum Voci Menu Cliente
 * @readonly
 * @enum {Object}
 */
const VociMenuCliente = {
    SCHEDA_CLIENTE: {
        root: 'Cliente',
        parent: '',
        key: 'Scheda cliente'
    },
    LISTA_POLIZZE: {
        root: 'Cliente',
        parent: '',
        key: 'Lista polizze'
    },
    LISTA_SINISTRI: {
        root: 'Cliente',
        parent: '',
        key: 'Lista sinistri'
    },
    REPORT_PROFILO_VITA: {
        root: 'Cliente',
        parent: '',
        key: 'Report profilo vita'
    }
}

/**
 * Enum Voci Menu Emissione
 * @readonly
 * @enum {Object}
 */
const VociMenuEmissione = {
    AUTO: {
        root: 'Emissione',
        parent: '',
        key: 'Nuova polizza Auto'
    },
    RAMI_VARI: {
        root: 'Emissione',
        parent: '',
        key: 'Nuova polizza Rami Vari'
    },
    SERVIZIO_CONSULENZA_VITA: {
        root: 'Emissione',
        parent: '',
        key: 'Servizio consulenza del Vita'
    },
    ULTRA_CASA_PATRIMONIO: {
        root: 'Emissione',
        parent: '',
        key: 'Nuova polizza Allianz Ultra Casa e Patrimonio'
    },
    ULTRA_SALUTE: {
        root: 'Emissione',
        parent: '',
        key: 'Nuova polizza Allianz Ultra Salute'
    },
    ULTRA_IMPRESA: {
        root: 'Emissione',
        parent: '',
        key: 'Nuova polizza Allianz Ultra Impresa'
    },
    PREVENTIVO_MOTOR: {
        root: 'Emissione',
        parent: '',
        key: 'Preventivo Motor'
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
    IN_MORA: "In mora",
    FUORI_MORA: "Fuori mora",
    SINISTROSE: "Sinistrose",
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
 * Enum TipoModalitaPgamento
 * @readonly
 * @enum {Object}
 */
const TipoModalitaPagamento = {
    ASSEGNO: "Assegno",
    BONIFICO: "Bonifico",
    CONTANTI: "Contanti",
    POS_DIREZIONALE: "Pos Direzionale",
    POS_AGENZIA: "Pos Agenzia",
    AZ_BANK: "Az Bank",
    TRATTENUTA_STIPENDIO: "Trattenuta sullo stipendio",
    RID_DIREZIONALE: "Rid Direzionale",
    POS_VIRTUALE: "Pos Virtuale",
    ALTRO: "Altro"
}

/**
 * Enum AzioniVeloci
 * @readonly
 * @enum {Object}
 */
const AzioniVeloci = {
    CREA_INIZIATIVA: "Crea iniziativa",
    ESPORTA_PDF_EXCEL: "Esporta pdf / excel",
    CREA_E_INVIA_CODICI_AZPAY: "Crea e invia codici AZpay",
    PUBBLICA_IN_AREA_PERSONALE: "Pubblica in Area Personale",
    LANCIA_FQ_MASSIVA: "Lancia FQ Massiva",
    SMS_MAIL_A_TESTO_LIBERO: "SMS/Mail a testo libero",
    ASSEGNA_COLORE: "SMS/Mail a testo libero"
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
    },
    RAMO: {
        key: "Ramo",
        values: {
            RAMO_31: '31',
            RAMO_32: '32',
            RAMO_35: '35',
            RAMO_13: '13',
            VUOTO: "Vuoto"
        }
    },
    AGENZIA: {
        key: "Agenzia",
        values: {
            VUOTO: "Vuoto",
            A_710000: "710000",
            A_1960: "1960",
            A_712000: "712000"
        }
    },
    ULT_TIPO_INVIO: {
        key: "Ult. Tipo Invio",
        values: {
            VUOTO: "Vuoto",
            SMS: "Sms"
        }
    },
    ULT_RICH_AVVISO_CPP: {
        key: "Ult. Rich. Avviso / CCP",
        values: {
            VUOTO: "Vuoto",
        }
    },
    NUM_GG_PER_MO: {
        key: "Num. Gg. Per. Mo.",
        values: {
            VUOTO: "Vuoto",
            MORA_1: '1',
            MORA_2: '2',
            MORA_3: '3',
            MORA_4: '4',
            MORA_5: '5',
            MORA_6: '6',
            MORA_7: '7',
            MORA_8: '8',
            MORA_9: '9',
            MORA_10: '10',
            MORA_11: '11',
            MORA_12: '12',
            MORA_13: '13',
            MORA_14: '14'
        }
    },
    CONS_EMAIL_POL: {
        key: "Cons. Email Pol",
        values: {
            SI: 'Si',
            NO: 'No'
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
 * Enum Colonne in vista Standard
 * @enum {Object}
 */
const ColumnStandard = {
    PT: {
        key: 'Pt.',
        tooltip: 'Area Portafoglio (Auto, Rami Vari, Vita, Modulari)'
    },
    CONTRAENTE: {
        key: 'Contraente',
        tooltip: 'Denominazione Cliente'
    },
    POLIZZA: {
        key: 'Polizza',
        tooltip: 'Numero Polizza'
    },
    TARGA: {
        key: 'Targa',
        tooltip: 'Numero di Targa'
    },
    FR: {
        key: 'Fr.',
        tooltip: 'Frazionamento'
    },
    EVO: {
        key: 'Evo',
        tooltip: ''
    },
    CP: {
        key: 'Cp.',
        tooltip: 'Compagnia'
    },
    AGENZIA: {
        key: 'Agenzia',
        tooltip: 'Agenzia'
    },
    SEDE: {
        key: 'Sede',
        tooltip: 'Codice Sede di appartenenza della fonte'
    },
    FONTE: {
        key: 'Fonte',
        tooltip: 'Fonte'
    },
    RAMO: {
        key: 'Ramo',
        tooltip: 'Ramo'
    },
    PR_LORDO_RATA: {
        key: 'Pr. Lordo Rata',
        tooltip: ''
    },
    ST_TIT: {
        key: 'St. Tit.',
        tooltip: 'Stato Titolo'
    },
    INIZIO_COP: {
        key: 'Inizio Cop.',
        tooltip: 'Data Inizio Copertura'
    },
    AP_CL: {
        key: 'Ap. Cl',
        tooltip: ''
    },
    INIZIATIVE_CL: {
        key: 'Iniziative Cl',
        tooltip: ''
    },
    PRV_AGE: {
        key: 'Prv Age',
        tooltip: ''
    },
    GG_EF_MORA: {
        key: 'Gg. E/F Mora',
        tooltip: ''
    },
    PAG: {
        key: 'Pag',
        tooltip: 'Tipo Pagamento'
    },
    EMAIL: {
        key: 'Email',
        tooltip: 'Indirizzo Email'
    },
    CELLULARE: {
        key: 'Cellulare',
        tooltip: ''
    },
    DESC_PRODOTTO: {
        key: 'Descrizione Prodotto',
        tooltip: 'Descrizione Prodotto'
    },
    DECORRENZA_POL: {
        key: 'Decorrenza Pol.',
        tooltip: ''
    },
    SCADENZA_POL: {
        key: 'Scadenza Pol.',
        tooltip: ''
    },
    VINC: {
        key: 'Vinc.',
        tooltip: ''
    },
    FQ: {
        key: 'FQ',
        tooltip: ''
    },
    AVV_EMAIL: {
        key: 'Avv Email',
        tooltip: ''
    },
    AVV_SMS: {
        key: 'Avv Sms',
        tooltip: ''
    },
    AVV_PDF: {
        key: 'Avv Pdf',
        tooltip: ''
    },
    DLT_PR_QTZ: {
        key: 'Dlt pr Qtz €',
        tooltip: ''
    },
    DLT_PR_NET_ARD: {
        key: 'Dlt pr Net ARD',
        tooltip: ''
    },
    DLT_PR_NET_RCA: {
        key: 'Dlt pr Net RCA',
        tooltip: ''
    },
    PUBLE_AREA_PERS: {
        key: 'Pub.le Area Pers.',
        tooltip: ''
    },
    PUBTA_AREA_PERS: {
        key: 'Pub.ta Area Pers.',
        tooltip: ''
    },
    CODFISC_IVA: {
        key: 'Cod.Fiscale / P.IVA',
        tooltip: ''
    },
    CANONE: {
        key: 'Canone',
        tooltip: ''
    },
    IND_ATT_RIN: {
        key: 'Ind att.rin',
        tooltip: ''
    },
    VAL_EXTRA: {
        key: 'Val. Extra',
        tooltip: ''
    },
    R_ABB: {
        key: 'R.abb',
        tooltip: ''
    },
    COAS: {
        key: 'Coas',
        tooltip: ''
    },
}

/**
 * Enum Colonne in vista Quietanze Scartate
 * @enum {Object}
 */
const ColumnQuietanzeScartate = {
    CONTRAENTE: {
        key: 'Contraente',
        tooltip: 'Denominazione Cliente'
    },
    POLIZZA: {
        key: 'Polizza',
        tooltip: 'Numero Polizza'
    },
    CP: {
        key: 'Cp.',
        tooltip: 'Compagnia'
    },
    AGENZIA: {
        key: 'Agenzia',
        tooltip: 'Agenzia'
    },
    FONTE: {
        key: 'Fonte',
        tooltip: 'Fonte'
    },
    RAMO: {
        key: 'Ramo',
        tooltip: 'Ramo'
    },
    INIZIO_COP: {
        key: 'Inizio Cop.',
        tooltip: 'Data Inizio Copertura'
    },
    CONV_TECN: {
        key: 'Conv. Tecn.',
        tooltip: 'Convenzione Tecnica'
    },
    TARGA: {
        key: 'Targa',
        tooltip: 'Numero di Targa'
    },
    ERRORE_QUIET: {
        key: 'Errore Quiet',
        tooltip: 'Errore per il mancato Quietanzamento'
    },
    NOTE: {
        key: 'Note',
        tooltip: 'Motivazione per il mancato Quietanzamento'
    },
    SOLUZIONE_PER_AGENZIA: {
        key: 'Soluzione per Agenzia',
        tooltip: 'Soluzione per Agenzia'
    },
    CLA_BM_CIP_PROV: {
        key: 'Cla. BM CIP Prov.',
        tooltip: 'Classe Bonus CIP di provenienza'
    },
    CLA_BM_RINN: {
        key: 'Cla. BM Rinn.',
        tooltip: 'Classe Bonus Malus di Rinnovo'
    },
    CLA_BM_CIP: {
        key: 'Cla. BM CIP',
        tooltip: 'Classe Bonus CIP'
    }

}

/**
 * Enum Colonne in vista Gestione Ente
 * @enum {Object}
 */
const ColumnGestioneEnte = {
    DEC: {
        key: 'Dec.',
        tooltip: 'Decade'
    },
    PT: {
        key: 'Pt.',
        tooltip: 'Area Portafoglio (Auto, Rami Vari, Vita, Modulari)'
    },
    CONTRAENTE: {
        key: 'Contraente',
        tooltip: 'Denominazione Cliente'
    },
    POLIZZA: {
        key: 'Polizza',
        tooltip: 'Numero Polizza'
    },
    ENTE_GEN_AVV: {
        key: 'Ente gen Avv',
        tooltip: 'Ente di generazione avvisi'
    },
    FR: {
        key: 'Fr.',
        tooltip: 'Frazionamento'
    },
    MENS: {
        key: 'Mens.',
        tooltip: 'Informazioni sulla Mensilizzazione'
    },
    PAG: {
        key: 'Pag',
        tooltip: 'Tipo Pagamento'
    },
    PREF: {
        key: 'Pref',
        tooltip: 'Tipo Pagamento Preferito della Polizza'
    },
    E_P: {
        key: 'e-P',
        tooltip: 'e-Payment'
    },
    SC: {
        key: 'Sc.',
        tooltip: 'Tipo Scadenza (Rata, Annuale, Promemoria, Simulazione)'
    },
    INIZIO_COP: {
        key: 'Inizio Cop.',
        tooltip: 'Data Inizio Copertura'
    },
    ST_TIT: {
        key: 'St. Tit.',
        tooltip: 'Stato Titolo'
    },
    CP: {
        key: 'Cp.',
        tooltip: 'Compagnia'
    },
    AGENZIA: {
        key: 'Agenzia',
        tooltip: 'Agenzia'
    },
    FONTE: {
        key: 'Fonte',
        tooltip: 'Fonte'
    },
    RAMO: {
        key: 'Ramo',
        tooltip: 'Ramo'
    },
    AVRI: {
        key: 'AVRI',
        tooltip: 'Polizza AVRI Trasporti'
    },
    VINC: {
        key: 'Vinc.',
        tooltip: 'Presenza di Vincolo'
    },
    INDIRIZZO: {
        key: 'Indirizzo',
        tooltip: 'Indirizzo Contraente'
    },
    EMAIL: {
        key: 'Email',
        tooltip: 'Indirizzo Email'
    },
    CONS_EMAIL_POL: {
        key: 'Cons. Email Pol',
        tooltip: 'Consenso Invio Email di polizza'
    },
    CONS_EMAIL_CL: {
        key: 'Cons. Email Cl',
        tooltip: 'Consenso Invio Email del Cliente'
    },
}

/**
 * Enum Colonne in vista Carico Mancante
 * @enum {Object}
 */
const ColumnCaricoMancante = {
    PT: {
        key: 'Pt.',
        tooltip: 'Area Portafoglio (Auto, Rami Vari, Vita, Modulari)'
    },
    CONTRAENTE: {
        key: 'Contraente',
        tooltip: 'Denominazione Cliente'
    },
    POLIZZA: {
        key: 'Polizza',
        tooltip: 'Numero Polizza'
    },
    VIA: {
        key: 'Via',
        tooltip: 'Via e n° civico'
    },
    CP: {
        key: 'Cp.',
        tooltip: 'Compagnia'
    },
    AGENZIA: {
        key: 'Agenzia',
        tooltip: 'Agenzia'
    },
    SEDE: {
        key: 'Sede',
        tooltip: 'Codice Sede di appartenenza della fonte'
    },
    FONTE: {
        key: 'Fonte',
        tooltip: 'Fonte'
    },
    RAMO: {
        key: 'Ramo',
        tooltip: 'Ramo'
    },
    FR: {
        key: 'Fr.',
        tooltip: 'Frazionamento'
    },
    DESC_PRODOTTO: {
        key: 'Descrizione Prodotto',
        tooltip: 'Descrizione Prodotto'
    },
    TARGA: {
        key: 'Targa',
        tooltip: 'Numero di Targa'
    },
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
     * Funzione che ritorna le colonne della vista Quietanze Scartate
     * @returns {ColumnQuietanzeScartate} Colonne disponibili
     */
    static get COLUMNQUIETANZESCARTATE() {
        return ColumnQuietanzeScartate
    }

    /**
     * Funzione che ritorna le colonne della vista Quietanze Scartate
     * @returns {ColumnStandard} Colonne disponibili
     */
    static get COLUMNSTANDARD() {
        return ColumnStandard
    }

    /**
     * Funzione che ritorna le colonne della vista Gestione Ente
     * @returns {ColumnGestioneEnte} Colonne disponibili
     */
    static get COLUMNGESTIONEENTE() {
        return ColumnGestioneEnte
    }

    /**
     * Funzione che ritorna le colonne della vista Carico Mancante
     * @returns {ColumnCaricoMancante} Colonne disponibili
     */
    static get COLUMNCARICOMANCANTE() {
        return ColumnCaricoMancante
    }

    /**
     * Funzione che ritorna le voci di menu Consultazioni disponibili su Sfera
     * @returns {VociMenuConsultazione} Consultazioni disponibili
     */
    static get VOCIMENUCONSULTAZIONE() {
        return VociMenuConsultazione
    }

    /**
     * Funzione che ritorna le Azioni Veloci disponibili
     * @returns {AzioniVeloci} AzioniVeloci disponibili
     */
    static get AZIONIVELOCI() {
        return AzioniVeloci
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
     * Funzione che ritorna le voci di menu Cliente disponibili su Sfera
     * @returns {VociMenuCliente} Voci di Menu Cliente
     */
    static get VOCIMENUCLIENTE() {
        return VociMenuCliente
    }

    /**
     * Funzione che ritorna le voci di menu Cliente disponibili su Sfera
     * @returns {VociMenuEmissione} Voci di Menu Cliente
     */
    static get VOCIMENUEMISSIONE() {
        return VociMenuEmissione
    }

    /**
     * Funzione che ritorna i Cluster Motor
     * @returns {ClusterMotor} Cluster Motor
     */
    static get CLUSTERMOTOR() {
        return ClusterMotor
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
     * @returns {TipoAvviso} tipo di Quietanze
     */
    static get TIPOAVVISO() {
        return TipoAvviso
    }
    /**
     * Funzione che ritorna i tipi di quietanze
     * @returns {TipoQuietanze} tipo di Quietanze
     */
    static get TIPOQUIETANZE() {
        return TipoQuietanze
    }

    /**
     * Funzione che ritorna le viste suggerite
     * @returns {VisteSuggerite} vista suggerita
     */
    static get VISTESUGGERITE() {
        return VisteSuggerite
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

    /**
     * Funzione che ritorna i tipi di modalità di pagamento
     * @returns {TipoModalitaPagamento} tipo modalità di pagamento
     */
    static get TIPOMODALITAPAGAMENTO() {
        return TipoModalitaPagamento
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
        return cy.get('nx-icon[name="ellipsis-h"]').should('exist')
    }

    /**
     * Ritorna il check box control delle righe di estrazione
     * @returns {Object} ritorna il check box control delle righe di estrazione
     * @private
     */
    static checkBoxControl() {
        return cy.get('span[class="nx-checkbox__control"]').should('exist')
    }

    /**
     * Ritorna la sezione di Sfera Delta Premio
     * @returns {Object} ritorna la sezione di Sfera Delta Premio
     * @private
     */
    static sferaDeltaPremioSection() {
        return cy.get('sfera-deltapremio').should('exist').and('be.visible')
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
 * Ritorna il dropdown Modalità Pagamento preferita
 * @returns {Object} Modalità Pagamento Preferitadropdown da popup
 * @private
 */
    static dropdownModalitaPagamentoPreferita() {
        return cy.get('sfera-pagamento-preferito-modal').find('nx-dropdown').should('exist').and('be.visible')
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

    /**
     * Accedi a Sfera da Home Page MW
     * @param [reloadMW=false] - boolean; se true, evita di intercettare alcune BFF call (che non avviene su reload di MW)
     */
    static accediSferaDaHomePageMW(reloadMW = false) {

        if (!reloadMW) {
            cy.intercept(infoUtente).as('infoUtente')
            cy.intercept(agenzieFonti).as('agenzieFonti')
            cy.intercept(caricaVista).as('caricaVista')
            cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
            cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

            TopBar.searchAndClickSuggestedNavigations('Nuovo Sfera')


            cy.wait('@infoUtente', { timeout: 60000 })
            cy.wait('@agenzieFonti', { timeout: 60000 })
            cy.wait('@caricaVista', { timeout: 60000 })
            cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
            cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
        }
        //? su reload skippo agenzieFonti e caricaVista
        else {
            cy.intercept(infoUtente).as('infoUtente')
            cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
            cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

            TopBar.searchAndClickSuggestedNavigations('Nuovo Sfera')

            cy.wait('@infoUtente', { timeout: 60000 })
            cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
            cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
        }
    }

    /**
     * Verifica accesso a Sfera
     */
    static verificaAccessoSfera(aggiornaCarico = true) {
        cy.intercept(infoUtente).as('infoUtente')
        cy.intercept(agenzieFonti).as('agenzieFonti')
        cy.intercept(caricaVista).as('caricaVista')
        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

        if (aggiornaCarico) {
            cy.wait('@infoUtente', { timeout: 60000 })
            cy.wait('@agenzieFonti', { timeout: 60000 })
            cy.wait('@caricaVista', { timeout: 60000 })
            cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
            cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
        }

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
    * It clicks on a column header, then it clicks on a checkbox in a popover.
    * @param {Filtri} filtro da utilizzare
    * @param {String} valore da ricercare
    */
    static filtraSuColonna(filtro, valore) {
        cy.get('thead').within(() => {
            if (filtro === Filtri.INFO)
                cy.get('th[class~="customBandierinaSticky"]').find('nx-icon:last').click()
            else
                cy.get(`div:contains(${filtro.key}):first`).scrollIntoView().parent().find('nx-icon:last').click()
        })

        if (filtro === Filtri.ULT_RICH_AVVISO_CPP) {
            cy.pause()
            cy.get('div[class="filterPopover ng-star-inserted"]').within(() => {
                cy.get('input').type(valore)
                cy.wait(500)
                cy.get('span[class="nx-checkbox__control"]:first:visible').click()
            })
        } else {
            if (filtro === Filtri.INFO)
                cy.get('div[class="filterPopover filterPopoverV2 ng-star-inserted"]').within(() => {
                    cy.get(`span:contains(${valore})`).click()
                })
            else
                cy.get('div[class="filterPopover ng-star-inserted"]').within(() => {

                    cy.get('input:visible').type(valore)
                    cy.wait(500)
                    cy.get('span[class="nx-checkbox__control"]:visible').click()
                })
        }
        cy.intercept(estraiQuietanze).as('estraiQuietanze')
        cy.contains('Applica').should('be.enabled').click().wait(5000)
        // cy.wait('@estraiQuietanze', { timeout: 120000 }) //?SERVE?
    }

    /**
     * Effettua l'Estrai delle Quietanze
     * @param {Boolean} request - default settato a true, altrimenti non intercetta Estrai Quietanze
     */
    static estrai(request = true) {
        cy.intercept(estraiQuietanze).as('estraiQuietanze')
        cy.contains('Estrai').should('exist').and('be.visible').click()

        if (request)
            cy.wait('@estraiQuietanze', { timeout: 120000 })

        //Verifichiamo che la tabella d'estrazione sia presente
        this.tableEstrazione()

        cy.wait(5000)
    }

    /**
     * Effettua l'accesso al menu contestuale della prima riga o della polizza specificata
     * @param {VociMenuQuietanza} voce 
     * @param {Boolean} [flussoCompleto] default true, se a false effettua solo verifica aggancio applicativo
     * @param {number} [polizza] default null, se specificato clicca sul menu contestuale della polizza passata
     * @param {TipoSostituzioneRiattivazione} [tipoSostituzioneRiattivazione] default null, tipo di sostituzione/riattivazione auto da effettuare
     * @param {TipoModalitaPagamento} [modalitaPagamentoPreferita] default null, tipo di modalità di pagamento preferita
     * @param {Boolean} [random] default false, se a true seleziona una quietanza random
     * @param {Number} [index] default false, se a true seleziona una quietanza random
     * 
     * @returns {Promise} polizza su cui sono state effettuate le operazioni
     */
    static apriVoceMenu(voce, flussoCompleto = true, polizza = null, tipoSostituzioneRiattivazione = null, modalitaPagamentoPreferita = null, random = false, vista = null) {
        return new Cypress.Promise(resolve => {
            if (polizza === null)
                if (random)
                    cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then((rowsTable) => {
                        let selected = Cypress._.random(rowsTable.length - 1);
                        cy.wrap(rowsTable).eq(selected).within(($sa) => {
                            cy.log($sa.text())
                            this.threeDotsMenuContestuale().click({ force: true })
                        })
                    })
                else
                    this.bodyTableEstrazione().find('tr:first').within(() => {
                        this.threeDotsMenuContestuale().click({ force: true })
                    })
            else
                this.bodyTableEstrazione().find('tr').contains(polizza).parents('tr').within(() => {
                    this.threeDotsMenuContestuale().click({ force: true })
                })

            //Andiamo a selezionare la root (Quietanza,Polizza...)
            if (voce.key !== VociMenuQuietanza.QUIETANZAMENTO_ONLINE.key)
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
                //? CONSULTAZIONE_DOCUMENTI_POLIZZA, Voci menu Cliente si apre su nuovo tab, quindi gestisto il _self
                if (voce.key === VociMenuPolizza.CONSULTAZIONE_DOCUMENTI_POLIZZA.key ||
                    voce.root === 'Cliente') {
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

            Common.canaleFromPopup({}, true)
            //Salviamo la polizza sulla quale effettuiamo le operazioni per poterla utilizzare successivamente
            let numPolizza = ''
            //Verifichiamo gli accessi in base al tipo di menu selezionato
            switch (voce) {
                case VociMenuQuietanza.INCASSO:
                    if (Cypress.env('currentEnv') === 'TEST') {
                        IncassoDA.accessoMezziPagam()
                        cy.wait(10000)
                        if (flussoCompleto) {
                            getAppJump().within(() => {

                                IncassoDA.ClickIncassa()
                            })
                            getAppJump().within(($iframe) => {
                                IncassoDA.ClickPopupWarning($iframe)
                            })
                            cy.wait('@getIncasso', { timeout: 40000 })
                            getAppJump().within(() => {
                                IncassoDA.SelezionaIncassa()
                            })

                            getAppJump().within(() => {
                                IncassoDA.TerminaIncasso()
                            })
                        }
                        else
                            getAppJump().within(() => {
                                IncassoDA.clickCHIUDI()
                            })
                    }
                    else {
                        IncassoDA.accessoMezziPagam()
                        cy.wait(10000)
                        if (flussoCompleto) {
                            IncassoDA.ClickIncassa()
                            IncassoDA.ClickPopupWarning()
                            IncassoDA.SelezionaIncassa()
                            IncassoDA.TerminaIncasso()
                        }
                        else
                            IncassoDA.clickCHIUDI()
                    }

                    cy.wait('@estraiQuietanze', { timeout: 120000 })
                    cy.get('sfera-quietanzamento-page').find('a:contains("Quietanzamento")').should('be.visible')
                    cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then(() => {
                        cy.screenshot('Conferma aggancio ritorno a Sfera', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    })

                    break;
                case VociMenuQuietanza.DELTA_PREMIO:
                    if (Cypress.env('currentEnv') === 'TEST') {
                        if (flussoCompleto) {
                            //TODO implementare flusso di delta premio
                        }
                        else {
                            NGRA2013.verificaAccessoRiepilogo()
                            getAppJump().within(() => {
                                NGRA2013.avanti()
                                cy.wait(2000)
                                cy.screenshot('Delta Premio', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                                NGRA2013.home(true)
                            })
                        }
                    } else {
                        if (flussoCompleto) {
                            //TODO implementare flusso di delta premio
                        } else {
                            NGRA2013.verificaAccessoRiepilogo()
                            NGRA2013.avanti()
                            cy.wait(2000)
                            cy.screenshot('Delta Premio', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                            NGRA2013.home(true)
                        }
                    }
                    this.verificaAccessoSfera(false)
                    break;
                case VociMenuQuietanza.VARIAZIONE_RIDUZIONE_PREMI:
                    if (Cypress.env('currentEnv') === 'TEST') {
                        IncassoDA.accessoGestioneFlex()
                        if (flussoCompleto) {
                            //TODO implementare flusso di delta premio
                        }
                        else {
                            getAppJump().within(() => {
                                IncassoDA.salvaSimulazione()
                                cy.wait(200)
                                cy.screenshot('Variazione Riduzione Premi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

                                IncassoDA.clickCHIUDI()
                                //Verifichiamo il rientro in Sfera
                            })
                        }
                    } else {
                        IncassoDA.accessoGestioneFlex()
                        if (flussoCompleto) {
                            //TODO implementare flusso di delta premio
                        } else {
                            IncassoDA.clickCHIUDI()
                            //Verifichiamo il rientro in Sfera
                        }
                    }
                    this.verificaAccessoSfera(false)
                    break;
                case VociMenuQuietanza.RIQUIETANZAMENTO:
                    break;
                case VociMenuPolizza.SOSTITUZIONE_RIATTIVAZIONE_AUTO:
                    //Scegliamo il Tipo di sostituzione dal popup
                    this.dropdownSostituzioneRiattivazione().click()
                    cy.contains(tipoSostituzioneRiattivazione).should('exist').click()
                    this.procedi().click()
                    Common.canaleFromPopup({}, true)
                    NGRA2013.verificaAccessoDatiAmministrativi()
                    if (Cypress.env('currentEnv') === 'TEST') {
                        if (flussoCompleto) {
                            getAppJump().within(() => {
                                NGRA2013.sostituzioneAScadenza()
                                cy.screenshot('Sostituzione Riattivazione Auto', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                            })
                        }
                        else {
                            getAppJump().within(() => {
                                NGRA2013.home(true)
                            })
                        }
                    }
                    else {
                        if (flussoCompleto) {
                            NGRA2013.verificaAccessoDatiAmministrativi()
                            cy.screenshot('Sostituzione Riattivazione Auto', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                        }
                        else {
                            NGRA2013.home(true)
                        }
                    }
                    //Verifichiamo il rientro in Sfera
                    this.verificaAccessoSfera(false)
                    break;
                case VociMenuQuietanza.STAMPA_SENZA_INCASSO:
                    //! DA PROVARE
                    IncassoDA.accessoMezziPagam()
                    cy.wait(200)
                    cy.screenshot('Stampa Senza Incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (Cypress.env('currentEnv') === 'TEST') {
                        if (flussoCompleto) {
                            //! DA VERIFICA SE FUNZIONA il FLUSSO
                            getAppJump().within(() => {
                                IncassoDA.clickStampa()
                            })
                            getAppJump().within(() => {
                                IncassoDA.getNumeroContratto().then(numContratto => {
                                    numPolizza = numContratto
                                    IncassoDA.clickCHIUDI()
                                })
                            })
                            this.verificaAccessoSfera(false)
                            resolve(numPolizza)
                        }
                        else {
                            getAppJump().within(() => {
                                IncassoDA.clickCHIUDI()
                            })
                            this.verificaAccessoSfera(false)
                        }
                    } else {
                        if (flussoCompleto) {
                            IncassoDA.clickStampa()
                            IncassoDA.getNumeroContratto().then(numContratto => {
                                numPolizza = numContratto
                                IncassoDA.clickCHIUDI()
                                //Verifichiamo il rientro in Sfera
                                this.verificaAccessoSfera(false)
                                resolve(numPolizza)
                            })
                        }
                        else {
                            IncassoDA.clickCHIUDI()
                            this.verificaAccessoSfera(false)
                        }
                    }
                    break;
                case VociMenuQuietanza.QUIETANZAMENTO_ONLINE:
                    NGRA2013.verificaAccessoPagamento()
                    cy.wait(15000)
                    cy.screenshot('Verifica Accesso a Pagamenti NGRA2013', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (Cypress.env('currentEnv') === 'TEST') {
                        if (flussoCompleto) {
                            getAppJump().within(() => { NGRA2013.ClickConfermaPagamento() })
                            getAppJump().within(() => { NGRA2013.ClickIncassa() })
                            getAppJump().within(($iframe) => { NGRA2013.ClickPopupWarning($iframe) })
                            getAppJump().within(() => { IncassoDA.SelezionaIncassa() })
                            getAppJump().within(() => { NGRA2013.TerminaIncasso() })
                        } else
                            getAppJump().within(() => { NGRA2013.home(true) })
                    } else {
                        if (flussoCompleto) {
                            NGRA2013.ClickConfermaPagamento()
                            NGRA2013.ClickIncassa()
                            NGRA2013.ClickPopupWarning(undefined)
                            IncassoDA.SelezionaIncassa()
                            NGRA2013.TerminaIncasso()
                        }
                        else
                            NGRA2013.home(true)
                    }
                    cy.get('sfera-quietanzamento-page').find('a:contains("Quietanzamento")').should('be.visible')
                    cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then(() => {
                        cy.screenshot('Conferma aggancio ritorno a Sfera', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    })
                    break;
                case VociMenuPolizza.CONSULTAZIONE_POLIZZA:

                    InquiryAgenzia.verificaAccessoInquiryAgenzia()
                    cy.screenshot('Inquiry Agenzia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (Cypress.env('currentEnv') === 'TEST') {
                        if (flussoCompleto) {
                            //TODO implementare flusso completo
                        }
                        else {
                            getAppJump().within(() => { InquiryAgenzia.clickUscita() })
                        }
                    } else {
                        if (flussoCompleto) {
                            //TODO implementare flusso completo
                        }
                        else {
                            InquiryAgenzia.clickUscita()
                        }
                    }
                    this.verificaAccessoSfera(false)
                    break;
                case VociMenuConsultazione.POLIZZA:
                    cy.screenshot('Inquiry Agenzia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        if (Cypress.env('currentEnv') === 'TEST') {
                            getAppJump().within(() => { InquiryAgenzia.clickUscita() })
                        } else {
                            InquiryAgenzia.clickUscita()
                        }
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera(false)
                    }
                    break;
                case VociMenuPolizza.CONSULTAZIONE_DOCUMENTI_POLIZZA:
                    Folder.verificaCaricamentoFolder(false)
                    cy.screenshot('Consultazione Documenti Polizza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        // cy.wait('@agenzieFonti', { timeout: 60000 })
                        // cy.wait('@caricaVista', { timeout: 60000 })
                        // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                        // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                        //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                        // this.estrai()
                        this.verificaAccessoSfera(false)
                    }
                    break;
                case VociMenuConsultazione.DOCUMENTI_POLIZZA:
                    Folder.verificaCaricamentoFolder(false)
                    cy.screenshot('Consultazione Documenti Polizza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            // this.estrai()
                            this.verificaAccessoSfera(false)
                        }
                    }
                    break
                case VociMenuPolizza.MODIFICA_MODALITA_PAGAMENTO:
                    cy.intercept(cambiaModalitaPagamentoPreferita).as('cambiaModalitaPagamentoPreferita')
                    this.dropdownModalitaPagamentoPreferita().click()
                    cy.contains(modalitaPagamentoPreferita).should('exist').click()
                    cy.screenshot('Setta Modalità Pagamento Preferita', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    this.procedi().click()
                    //Verifichiamo che sia andato a compimento
                    cy.wait('@cambiaModalitaPagamentoPreferita', { timeout: 120000 }).then(bffCambiaModalitaPagamento => {
                        expect(bffCambiaModalitaPagamento.response.statusCode).to.be.eq(200)
                        expect(bffCambiaModalitaPagamento.response.body.esito).to.include("Effettuato ScriviModalitaPagamentoPreferita")
                        cy.screenshot('Modalità Pagamento Preferita settata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                        cy.contains('Chiudi').click()
                    })
                    break;
                case VociMenuCliente.SCHEDA_CLIENTE:
                    SintesiCliente.checkAtterraggioSintesiCliente()
                    cy.screenshot('Scheda Cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            this.estrai()
                            this.verificaAccessoSfera(false)

                        }
                    }
                    break;
                case VociMenuCliente.LISTA_POLIZZE:
                    Portafoglio.checkPolizzeAttive(false)
                    cy.screenshot('Lista Polizze', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            this.estrai()
                            this.verificaAccessoSfera(false)
                        }
                    }
                    break;
                case VociMenuCliente.LISTA_SINISTRI:
                    cy.screenshot('Lista Sinistri', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        Portafoglio.checkSinistri()
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            this.estrai()
                            this.verificaAccessoSfera(false)

                        }
                    }
                    break;
            }
        })
    }

    /**
 * Effettua l'accesso al menu contestuale della prima riga o della polizza specificata
 * @param {VociMenuQuietanza} voce 
 * @param {Boolean} [flussoCompleto] default true, se a false effettua solo verifica aggancio applicativo
 * @param {number} [polizza] default null, se specificato clicca sul menu contestuale della polizza passata
 * @param {TipoSostituzioneRiattivazione} [tipoSostituzioneRiattivazione] default null, tipo di sostituzione/riattivazione auto da effettuare
 * @param {TipoModalitaPagamento} [modalitaPagamentoPreferita] default null, tipo di modalità di pagamento preferita
 * @param {Boolean} [random] default false, se a true seleziona una quietanza random
 * @param {Number} [index] default false, se a true seleziona una quietanza random
 * 
 * @returns {Promise} polizza su cui sono state effettuate le operazioni
 */
    static accessiApplicativi(voce, flussoCompleto = true, polizza = null, tipoSostituzioneRiattivazione = null, modalitaPagamentoPreferita = null, random = false, vista = null) {
        return new Cypress.Promise(resolve => {
            if (polizza === null)
                if (random)
                    cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then((rowsTable) => {
                        let selected = Cypress._.random(rowsTable.length - 1);
                        cy.wrap(rowsTable).eq(selected).within(() => {
                            this.threeDotsMenuContestuale().click({ force: true })
                        })
                    })
                else
                    this.bodyTableEstrazione().find('tr:first').within(() => {
                        this.threeDotsMenuContestuale().click({ force: true })
                    })
            else
                this.bodyTableEstrazione().find('tr').contains(polizza).parents('tr').within(() => {
                    this.threeDotsMenuContestuale().click({ force: true })
                })

            //Andiamo a selezionare la root (Quietanza,Polizza...)
            if (voce.key !== VociMenuQuietanza.QUIETANZAMENTO_ONLINE.key)
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
                //? CONSULTAZIONE_DOCUMENTI_POLIZZA, Voci menu Cliente si apre su nuovo tab, quindi gestisto il _self
                if (voce.key === VociMenuPolizza.CONSULTAZIONE_DOCUMENTI_POLIZZA.key ||
                    voce.root === 'Cliente') {
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
                //TODO
                case VociMenuQuietanza.INCASSO:
                    break;
                case VociMenuQuietanza.DELTA_PREMIO:
                    NGRA2013.verificaAccessoRiepilogo()
                    cy.wait(2000)
                    cy.screenshot('Delta Premio', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (Cypress.env('isSecondWindow'))
                        getAppJump().within(() => {
                            NGRA2013.home(true)
                        })
                    else
                        NGRA2013.home(true)
                    //Verifichiamo il rientro in Sfera
                    this.verificaAccessoSfera(false)
                    break;
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
                        this.verificaAccessoSfera(false)
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
                        this.verificaAccessoSfera(false)
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
                            this.verificaAccessoSfera(false)
                            resolve(numPolizza)
                        })
                    }
                    else {
                        IncassoDA.clickCHIUDI()
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera(false)
                    }
                    break;
                case VociMenuQuietanza.QUIETANZAMENTO_ONLINE:
                    NGRA2013.verificaAccessoPagamento()
                    cy.wait(10000)
                    cy.screenshot('Verifica Accesso a Pagamenti NGRA2013', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        NGRA2013.flussoQuietanzamentoOnline()
                        this.verificaAccessoSfera(false)
                    }
                    else {
                        NGRA2013.home(true)
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera(false)
                        break;
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
                        this.verificaAccessoSfera(false)
                    }
                    break;
                case VociMenuConsultazione.POLIZZA:
                    cy.screenshot('Inquiry Agenzia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        InquiryAgenzia.clickUscita()
                        //Verifichiamo il rientro in Sfera
                        this.verificaAccessoSfera(false)
                    }
                    break;
                case VociMenuPolizza.CONSULTAZIONE_DOCUMENTI_POLIZZA:
                    Folder.verificaCaricamentoFolder(false)
                    cy.screenshot('Consultazione Documenti Polizza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        // cy.wait('@agenzieFonti', { timeout: 60000 })
                        // cy.wait('@caricaVista', { timeout: 60000 })
                        // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                        // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                        //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                        // this.estrai()
                        this.verificaAccessoSfera(false)
                    }
                    break;
                case VociMenuConsultazione.DOCUMENTI_POLIZZA:
                    Folder.verificaCaricamentoFolder(false)
                    cy.screenshot('Consultazione Documenti Polizza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            // this.estrai()
                            this.verificaAccessoSfera(false)
                        }
                    }
                    break
                case VociMenuPolizza.MODIFICA_MODALITA_PAGAMENTO:
                    cy.intercept(cambiaModalitaPagamentoPreferita).as('cambiaModalitaPagamentoPreferita')
                    this.dropdownModalitaPagamentoPreferita().click()
                    cy.contains(modalitaPagamentoPreferita).should('exist').click()
                    cy.screenshot('Setta Modalità Pagamento Preferita', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    this.procedi().click()
                    //Verifichiamo che sia andato a compimento
                    cy.wait('@cambiaModalitaPagamentoPreferita', { timeout: 120000 }).then(bffCambiaModalitaPagamento => {
                        expect(bffCambiaModalitaPagamento.response.statusCode).to.be.eq(200)
                        expect(bffCambiaModalitaPagamento.response.body.esito).to.include("Effettuato ScriviModalitaPagamentoPreferita")
                        cy.screenshot('Modalità Pagamento Preferita settata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                        cy.contains('Chiudi').click()
                    })
                    break;
                case VociMenuCliente.SCHEDA_CLIENTE:
                    SintesiCliente.checkAtterraggioSintesiCliente()
                    cy.screenshot('Scheda Cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            // this.estrai()
                            this.verificaAccessoSfera(false)

                        }
                    }
                    break;
                case VociMenuCliente.LISTA_POLIZZE:
                    Portafoglio.checkPolizzeAttive(false)
                    cy.screenshot('Lista Polizze', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            // this.estrai()
                            this.verificaAccessoSfera(false)
                        }
                    }
                    break;
                case VociMenuCliente.LISTA_SINISTRI:
                    cy.screenshot('Lista Sinistri', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    if (flussoCompleto) {
                        Portafoglio.checkSinistri()
                        //TODO implementare flusso completo
                    }
                    else {
                        cy.intercept(infoUtente).as('infoUtente')
                        cy.intercept(agenzieFonti).as('agenzieFonti')
                        cy.intercept(caricaVista).as('caricaVista')
                        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
                        cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

                        cy.go('back')

                        // cy.wait('@infoUtente', { timeout: 60000 })
                        if (vista !== VisteSuggerite.CARICO_MANCANTE) {
                            // cy.wait('@agenzieFonti', { timeout: 60000 })
                            // cy.wait('@caricaVista', { timeout: 60000 })
                            // cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
                            // cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                            //Essendo wrappato, facendo il back, verfico che ci sia il pulsante di estrazione
                            // this.estrai()
                            this.verificaAccessoSfera(false)

                        }
                    }
                    break;
            }
        })
    }

    /**
     * Seleziona il cluster motor sul quale effettuare l'estrazione
     * @param {ClusterMotor} clusterMotor tipo di cluster da selezionare
     * @param {Boolean} [performEstrai] default false, se true clicca su estrai
     */
    static selezionaClusterMotor(clusterMotor, performEstrai = false) {
        cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
        //Vediamo se espandere il pannello per le date
        this.espandiPannello()

        cy.contains(clusterMotor).click({ force: true })
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

        cy.get(`input[formcontrolname="${DateInputForm.DATA_INIZIO_PERIODO}"]`).clear().wait(500).click().type(dataInizio).wait(1000)

        //Impostiamo la data di fine estrazione
        if (dataFine === undefined) {
            //Se non specificata la data, settiamo automaticamente la data odierna
            let today = new Date()
            dataFine = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear()
        }

        cy.get(`input[formcontrolname="${DateInputForm.DATA_FINE_PERIODO}"]`).clear().wait(700).type(dataFine).wait(700).type('{esc}').wait(1000)

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
     * Assegna un colore random alle righe precedentemente selezionate (escluso Nessun Colore)
     */
    static assegnaColoreRandom() {
        this.assegnaColore().click()

        cy.wait(3000)
        cy.get('sfera-assegna-colore').should('be.visible').within(() => {
            cy.get('nx-card').then((colori) => {
                let selected = Math.floor(Math.random() * (colori.length - 1)) + 1;

                cy.get('nx-card').eq(selected).find('nx-radio').click()
                cy.get('nx-card').eq(selected).find('div:first').invoke('attr', 'style').as('styleColor')
                cy.contains('Procedi').click()
            })

        })

        cy.wait(5000)

        cy.get('sfera-assegna-colore').should('be.visible').within(() => {

            cy.get('h3').should('include.text', 'Colore assegnato con successo')
            cy.get('button').last().should('be.visible').click()

        })

        //Verifichiamo che la tabella d'estrazione sia presente
        this.tableEstrazione()

        cy.get('@styleColor').then((color) => {
            cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').and('have.attr', 'style', 'background: ' + color.split('color: ')[1])
        })
        cy.screenshot('Verifica colori', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static assegnaNessunColore() {
        this.assegnaColore().click()

        cy.get('sfera-assegna-colore').should('be.visible').within(() => {
            cy.get('nx-card').eq(0).find('nx-radio').click()
            cy.contains('Procedi').click()
        })

        cy.wait(5000)

        cy.get('sfera-assegna-colore').should('be.visible').within(() => {
            cy.get('h3').should('include.text', 'Colore assegnato con successo')
            cy.get('button').last().should('be.visible').click()

        })

        //Verifichiamo che la tabella d'estrazione sia presente
        this.tableEstrazione()

        cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').and('have.attr', 'style', 'background: white;')

        cy.screenshot('Verifica Nessun Colore', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
        this.lobPortafogli().click({ force: true }).wait(500)

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
                        cy.get(`div:contains(${Portafogli.RAMI_VARI})`).parents('nx-dropdown-item').click()
                        cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
                    }
                })
            if (!portafogli.includes(Portafogli.VITA))
                cy.get(`div:contains(${Portafogli.VITA})`).parents('label').then($chekcBoxChecked => {

                    if ($chekcBoxChecked.find('nx-icon').is(':visible')) {
                        cy.get(`div:contains(${Portafogli.VITA})`).parents('nx-dropdown-item').click()
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
        cy.get('nx-icon[class^="nx-icon--s ndbx-icon nx-icon--chevron-down-small"]').click()

        // Click Le mie viste
        cy.get('div[class="cdk-overlay-pane"]').first().should('be.visible').within(() => {
            cy.contains('Le mie viste').click()
        }).then(() => {

            cy.get('div[class="cdk-overlay-pane"]').last()
                .should('be.visible').within(() => {
                    cy.get('button').contains(nameVista).click({ force: true }).wait(2000)
                })
        })
        cy.get('h2[class="nx-font-weight-semibold"]').should('include.text', nameVista)

    }

    /**
     * Seleziona la vista suggerita 
     * @param {VisteSuggerite} nameVista - nome della Vista
     */
    static selezionaVistaSuggerita(nameVista) {
        // click Seleziona Vista tendina
        cy.get('nx-icon[class^="nx-icon--s ndbx-icon nx-icon--chevron-down-small"]').click()

        // Click Le mie viste
        cy.get('div[class="cdk-overlay-pane"]').first().scrollIntoView().should('be.visible').within(() => {
            cy.contains('Viste suggerite').click()
        }).then(() => {

            cy.get('div[class="cdk-overlay-pane"]').last()
                .should('be.visible').within(() => {
                    cy.get('button').contains(nameVista).click({ force: true }).wait(2000)
                })
        })
        cy.get('h2[class="nx-font-weight-semibold"]').should('include.text', nameVista)
        cy.screenshot('Verifica Vista ' + nameVista, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

    }

    static eliminaVista(nameVista) {
        cy.get('nx-icon[class^="nx-icon--s ndbx-icon nx-icon--chevron-down-small"]').click()

        // Click Le mie viste
        cy.get('div[class="cdk-overlay-pane"]').first().should('be.visible').within(() => {
            cy.contains('Gestisci viste').click()
        }).then(() => {

            cy.get('div[class="modal-gestisci-viste-content ng-star-inserted"]')
                .should('be.visible').within(() => {
                    cy.get('div[class="flex-content center-content row-view ng-star-inserted"]:contains("' + nameVista + '")').within(() => {
                        cy.get('nx-icon[class~="nx-icon--trash-o"]').click()
                    })
                })
            //cy.intercept(caricaVista).as('caricaVista')
            cy.intercept(aggiornaCaricoTotale).as('aggiornaCaricoTotale')
            cy.intercept(aggiornaContatoriCluster).as('aggiornaContatoriCluster')

            cy.get('button[nxmodalclose="Agree"]').click()

            //cy.wait('@caricaVista', { timeout: 60000 })
            cy.wait('@aggiornaCaricoTotale', { timeout: 60000 })
            cy.wait('@aggiornaContatoriCluster', { timeout: 60000 })
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

    }

    /**
     * Estrazione Excel e verifica dati estratti correttamente
     */
    static estrazioneReportExcel(currentColumn = []) {
        let columnView = []
        if (currentColumn.length !== 0)
            for (const [key, value] of Object.entries(currentColumn))
                columnView.push(value.key)

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
                    // console.log(Object.values(jsonData[0].data[0]).sort())
                    // console.log(columnView.sort())
                    // Verifica Colonne presenti
                    if (columnView.length > 0)
                        expect(Object.values(jsonData[0].data[0]).sort()).to.eqls(columnView.sort());
                    else
                        expect(Object.values(jsonData[0].data[0]).sort()).to.eqls(currentColumn.sort());

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
                cy.get('div[class="cdk-drop-list elements ng-star-inserted"]').should('be.visible').within(() => {
                    cy.contains(colonna)
                        .parents('div[class="cdk-drag flex-content center-content all-column-element element ng-star-inserted"]')
                        .within(($colonna) => {
                            cy.wrap($colonna).as('colonna')
                        })

                    cy.get('div[class="cdk-drag flex-content center-content all-column-element element ng-star-inserted"]')
                        .eq(3).as('otherColumn')
                    cy.get('@colonna')
                        .drag('@otherColumn', {
                            force: true,
                            source: { x: 100, y: 100 }
                        })
                    // .then((success) => {
                    //     assert.isTrue(success)
                    // })
                    // const dataTransfer = new DataTransfer();
                    // cy.get('@colonna').trigger('dragstart', { dataTransfer }, { force: true }).wait(500)
                    // cy.get('@otherColumn')
                    //     .trigger('dragover', { force: true }).wait(500)
                    // cy.get('@otherColumn')
                    //     .trigger('drop', { dataTransfer }).wait(500)
                    // cy.get('@colonna').trigger('dragend', { force: true })
                })
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

    static salvaVistaPersonalizzata(nameVista) {
        cy.get('table').should('be.visible').then(() => {
            cy.get('th').find('nx-icon[name="setting-o"]').should('be.visible').click()
            cy.get('nx-modal-container').should('be.visible').within(() => {
                cy.contains('Applica e salva vista').click().wait(3000)
            })
        })

        cy.get('nx-modal-container').should('be.visible').within(() => {
            cy.contains('Nuova vista').click().wait(3000)
            cy.get('input[placeholder="Inserisci il nome della vista"]:visible').type(nameVista)
            cy.get('button[nxmodalclose="Agree"]:visible').click()
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
        cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then((rowsTable) => {
            let selected = Cypress._.random(rowsTable.length - 1);
            cy.wrap(rowsTable).eq(selected).find('nx-link[class="nx-link nx-link--small ng-star-inserted"] > a').then(($Contraente) => {
                cy.wrap($Contraente).click()
                cy.wait('@getDatiAnagrafici', { requestTimeout: 50000 })
                cy.wait('@getDatiIniziative', { requestTimeout: 50000 })
                cy.wait('@getContratti', { requestTimeout: 50000 }).its('response.body').then((body) => {
                    cy.writeFile('cypress/fixtures/Sfera/DatiComplementariContratti.json', body)
                })
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
                                loopCheckTabEnabled(TabScheda.INIZIATIVE)
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
                    checkNote()
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
                cy.get('button[nxmodalclose="Proceed"]').should('be.visible')
                cy.contains('Aggiungi nuova nota').click()
                cy.get('div[class="new-nota-container"]').should('be.visible').within(() => {
                    cy.get('input[formcontrolname="titolo"]').type('Titolo Automatici')
                    cy.get('textarea[formcontrolname="testo"]').type('Testo Automatici')
                    cy.contains('Salva nota').click()
                })
                cy.wait(3000)
                cy.get('div[class^="container-nota"]').should('be.visible').and('include.text', 'TITOLO AUTOMATICI')
                cy.get('div[class^="container-nota"]').should('be.visible').and('include.text', 'TESTO AUTOMATICI')
                cy.get('div[class^="container-nota"]:contains("TITOLO AUTOMATICI")').find('nx-icon[name="trash"]').click()
                cy.contains('Elimina').click()
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
                    cy.wait(2000)
                    cy.wrap($panel).click()
                    cy.wait(2000)
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
                        'Rid. Premio',
                        'Da Rid. Premio',
                        'Da preventivo'
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

    /**
     * Verifica La Griglia "Valore Cliente"
     */
    static checkGrigliaValoreCliente() {
        // Apri Pannello Valore CLiente
        cy.get('nx-expansion-panel-header[aria-disabled="false"]:contains("Valore Cliente")').then(($panel) => {
            cy.wrap($panel).click()
            cy.wrap($panel).parents('nx-expansion-panel')
                .find('div[role="region"]')
                .should('have.attr', 'style', 'visibility: visible;')
            // Check della Griglia
            cy.wrap($panel).parents('nx-expansion-panel')
                .find('table').should('be.visible').within(() => {
                    cy.get('tr').eq(0).find('td:last').then(($valore) => {
                        expect($valore.text().trim()).to.not.equal('-')
                        expect($valore.text().trim()).not.to.be.empty
                    })
                    cy.get('tr').eq(1).find('td:last').then(($valore) => {
                        expect($valore.text().trim()).to.not.equal('-')
                        expect($valore.text().trim()).not.to.be.empty
                    })
                    cy.screenshot('Verifica Griglia Valore Cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                })

        })
    }

    /**
     * Verifica La Griglia "Polizze"
     */
    static checkPolizze() {
        // Apri Pannello Polizze
        cy.get('nx-expansion-panel-header[aria-expanded="false"]:contains("Polizze"):visible').then(($panel) => {
            cy.wrap($panel).click()
            cy.wrap($panel).parents('nx-expansion-panel')
                .find('div[role="region"]')
                .should('have.attr', 'style', 'visibility: visible;')
            cy.wrap($panel).parents('nx-expansion-panel')
                .find('table').should('be.visible').within(() => {
                    cy.fixture('Sfera/DatiComplementariContratti.json').then((data) => {
                        for (let index = 0; index < data.listaPolizze.length; index++) {
                            cy.get('tr[class="ng-star-inserted"]').eq(index).then(($checkDato) => {
                                expect($checkDato.text()).to.include(data.listaPolizze[index].contraente)
                                expect($checkDato.text()).to.include(data.listaPolizze[index].areaPortafoglio)
                                expect($checkDato.text()).to.include(data.listaPolizze[index].numeroContratto)
                                expect($checkDato.text()).to.include(data.listaPolizze[index].prodotto)
                                // expect($checkDato.text()).to.include(data.listaPolizze[index].premioLordo.split('EUR ')[1])
                                let date = new Date(data.listaPolizze[index].dataProssimaQuietanza)
                                let formatDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
                                expect($checkDato.text()).to.include(formatDate)
                            })
                        }
                    })
                    cy.screenshot('Verifica Griglia Polizze', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                })
        })
    }

    /**
     * Click the three dots, then check that the menu does not include the text of the link.
     * @param {string} link - the link to be checked
     */
    static checkLinkMenu(link) {
        //Click tre puntini
        cy.get('nx-icon[class="ndbx-icon nx-icon--ellipsis-v nx-link__icon nx-icon--auto"]')
            .should('be.visible')
            .click().wait(2000)

        cy.get('div[role="menu"]:visible').should('not.include.text', link)
    }


    /**
     * Verifica Azioni veloci dal Cluster richeisto
     * @param {ClusterMotor} cluster - nome del cluster
     */
    static checkVoceAzioniVeloci(cluster) {
        cy.contains('Azioni veloci').click()
        cy.get('nx-modal-container').should('be.visible').within(() => {

            switch (cluster) {
                case ClusterMotor.SINISTROSE:
                    const titles = []
                    cy.get('nx-expansion-panel-title').each(($title) => {
                        titles.push($title.text().trim().split(' (')[0])
                    }).then(() => {
                        expect(titles).to.have.length(2)
                        expect(titles).to.include('Per tutti i cluster selezionati')
                        expect(titles).to.include('Sinistrose')
                    })
                    const span = []
                    cy.get('span[class="nx-radio__label--text"]').each(($span) => {

                        if ($span.text().includes('Assegna Colore'))
                            span.push($span.text().trim().substring(0, 14))
                        else
                            span.push($span.text().trim())
                    }).then(() => {

                        expect(span).to.have.length(5)
                        expect(span).to.include('Esporta pdf / excel')
                        expect(span).to.include('Assegna Colore')
                        expect(span).to.include('SMS/Mail a testo libero')
                        expect(span).to.include('Verifica delta premio')
                    })
                    break;
            }
            cy.get('nx-icon[name="close"]').click()
        })
    }

    /**
     * It checks if the checkbox of the agency passed as parameter is checked and if all the other
     * checkboxes are disabled.
     * @param {String} agenzia - the name of the agency
     */
    static checkAgenzieSabbiate(agenzia) {
        cy.get('h3').contains('Agenzie').click()
        cy.get('nx-modal-container[role="dialog"]').should('be.visible').within(() => {
            cy.screenshot('Agenzie Sabbiate', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.get('div[class="container-list ng-star-inserted"]').within(() => {
                cy.get('nx-checkbox:contains("' + agenzia + '")').within(() => {
                    cy.get('input[type="checkbox"]').should('have.attr', 'value', 'true').and('not.have.attr', 'disabled')
                })

                cy.get('nx-checkbox').not(':contains("' + agenzia + '")').within(() => {
                    cy.get('input[type="checkbox"]').should('have.attr', 'value', 'false').and('have.attr', 'disabled')
                })
            })
            cy.contains('Annulla').click()
        })
    }

    /**
     * Verifica se su AVIVA è selezionato solo Motor
     * @param {Portafogli} portafoglio
     */
    static checkLob(portafoglio) {
        cy.get('nx-dropdown[formcontrolname="lobSelezionate"]')
            .find('span[class="ng-star-inserted"]').should('contain.text', portafoglio)
    }

    /**
     * Verifica se su AVIVA Lob non è presente la voce
     * @param {Portafogli} portafoglio
     */
    static checkNotExistLob(portafoglio) {
        cy.get('nx-dropdown[formcontrolname="lobSelezionate"]')
            .find('span[class="ng-star-inserted"]').should('not.contain.text', portafoglio)
    }

    /**
     * Verifica se la voce non è presente
     * @param {VociMenuEmissione} voceMenu 
     */
    static checkVociMenuNotExist(voce) {

        // Selezioniamo una riga a random
        cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then((rowsTable) => {
            let selected = Cypress._.random(rowsTable.length - 1);
            cy.wrap(rowsTable).eq(selected).within(() => {
                this.threeDotsMenuContestuale().click({ force: true })
            })
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

        //Andiamo a verificare che il menu contestuale 'figlio' sia ASSENTE
        this.menuContestualeChild().within(() => {
            //? CONSULTAZIONE_DOCUMENTI_POLIZZA, Voci menu Cliente si apre su nuovo tab, quindi gestisto il _self
            cy.get('button[role="menuitem"]', { timeout: 10000 }).should('not.contain.text', voce.key)
        })
    }


    /**
   * Verifica se su AVIVA è selezionato solo Motor
   * @param {Portafogli} portafoglio
   */
    static checkLob(portafoglio) {
        cy.get('nx-dropdown[formcontrolname="lobSelezionate"]')
            .find('span[class="ng-star-inserted"]').should('contain.text', portafoglio)
    }

    /**
     * Flusso Azioni Veloci
     * @param {AzioniVeloci} azioni 
     */
    static azioniVeloci(azioni) {
        cy.contains('Azioni veloci').click()
        cy.get('nx-modal-container[role="dialog"]').should('be.visible')
        switch (azioni) {
            case AzioniVeloci.CREA_INIZIATIVA:
                //TODO
                throw new Error("Da implementare il flusso")
                break;
            case AzioniVeloci.CREA_E_INVIA_CODICI_AZPAY:
                //TODO
                throw new Error("Da implementare il flusso")
                break;
            case AzioniVeloci.ESPORTA_PDF_EXCEL:
                cy.contains(AzioniVeloci.ESPORTA_PDF_EXCEL).click()
                cy.contains('button', 'Procedi').click().wait(500)
                cy.get('nx-modal-container[role="dialog"]').should('be.visible')
                cy.contains('Procedi').click()
                cy.get('h3').should('include.text', 'Excel esportato con successo')
                cy.contains('Torna alle azioni veloci').click()
                cy.contains('Annulla').click()
                break;
            case AzioniVeloci.LANCIA_FQ_MASSIVA:
                //TODO
                throw new Error("Da implementare il flusso")
                break;
            case AzioniVeloci.PUBBLICA_IN_AREA_PERSONALE:
                //TODO
                throw new Error("Da implementare il flusso")
                break;
            case AzioniVeloci.SMS_MAIL_A_TESTO_LIBERO:
                //TODO
                throw new Error("Da implementare il flusso")
                break;
            case AzioniVeloci.ASSEGNA_COLORE:
                //TODO
                throw new Error("Da implementare il flusso")
                break;
            default:
                throw new Error("Azione veloce non presente")
        }
    }

    /**
     * It gets the folder path of the download folder, then parses the excel file in that folder and
     * checks if the number of rows in the excel file is equal to the number of rows in the table.
     * @param dateLength - The number of rows in the excel file
     */
    static checkExcel(dateLength) {
        cy.task('getFolderDownload').then((folderDownload) => {
            cy.parseXlsx(folderDownload + "/REPORT.xlsx").then(jsonData => {
                expect((jsonData[0].data.length - 1).toString()).to.eqls(dateLength);
            });
        })
    }

    /**
     * It selects a random cluster from a list of clusters, and then it gets the number of elements in that
     * cluster and stores it in a variable.
     */
    static selectRandomCluster() {
        cy.get('app-cluster').should('be.visible').within(($appCluster) => {
            const checkCluster = $appCluster.is(':contains("Avviso da Inviare")')
            if (checkCluster)
                cy.contains('Avviso da Inviare').click()
            cy.get('nx-badge').not('nx-badge[style*="opacity"]').then(($clusterEnabled) => {
                let selected = Cypress._.random($clusterEnabled.length - 1);
                cy.wrap($clusterEnabled).eq(selected).click()
                cy.wrap($clusterEnabled).eq(selected).invoke('text').then((nameCluster) => {
                    var number = nameCluster.replace(/\D/g, "");
                    cy.wrap(number).as('clusterLength')
                })
            })
        })
    }


    /**
     * It takes a list of column names, and checks that the table has those columns.
     * @param {Object} listColumn - is an object that contains the list of columns that should be present in the
     * table.
     */
    static checkAllColonnePresenti(listColumn) {
        cy.get('table').then(($table) => {
            const currentLinks = []
            const checkLinks = []
            for (const [key, value] of Object.entries(listColumn)) {
                checkLinks.push(value.key)
            }
            cy.wrap($table).find('div[class="table-component-th-name"]').each(($link, i) => {
                currentLinks.push($link.text().trim())
            }).then(() => {
                var difference = checkLinks.filter(x => currentLinks.indexOf(x) === -1);
                console.log(difference);

                expect(currentLinks.sort()).to.deep.eq(checkLinks.sort());
            })

        })
    }

    /**
     * It checks that the dropdown menu contains the number of rows that you want to see on the page.
     * @param {String} numberRows - the number of rows you want to display on the page
     */
    static checkRisultatiPaginaRighe(numberRows) {
        cy.contains('Risultati per pagina').parent().find('nx-dropdown').should('contain.text', numberRows)
    }


    /**
     * Verifica se la voce non è presente
     * @param {VociMenuEmissione} voce 
     */
    static checkVociMenuExist(voce) {
        // Selezioniamo una riga a random
        cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then((rowsTable) => {
            let selected = Cypress._.random(rowsTable.length - 1);
            cy.wrap(rowsTable).eq(selected).within(() => {
                this.threeDotsMenuContestuale().click({ force: true })
            })
        })

        //Andiamo a selezionare la root (Quietanza,Polizza...)

        //Andiamo a selezionare prima il menu contestuale 'padre' (se presente)
        if (voce.parent !== '') {
            this.menuContestualeParent().within(() => {
                cy.contains(voce.parent).should('exist').and('be.visible').click()
            })

            //Andiamo a verificare che il menu contestuale 'figlio' sia ASSENTE
            this.menuContestualeChild().within(() => {
                cy.get('button[role="menuitem"]', { timeout: 10000 }).should('contain.text', voce.key)
            })
            cy.get('div[class="row-search nx-grid__row"]').next('div').click()
        } else {
            if (voce.root === 'Cliente' || voce.root === 'Consultazione')
                this.menuContestualeParent().within(() => {
                    cy.contains(voce.root).should('exist').and('be.visible').click()
                })
            this.menuContestualeParent().within(() => {
                cy.get('button[role="menuitem"]', { timeout: 10000 }).should('contain.text', voce.key)
            })
            cy.get('div[class="row-search nx-grid__row"]').click().next('div').click()
        }


    }

    /**
     * It checks if a table is visible and if it is, it takes a screenshot.
     * @param vista - the name of the view you want to check
     */
    static checkVistaExist(vista) {
        cy.get('app-view').should('be.visible').find('h2:first').should('be.visible').and('contain.text', vista)
        cy.screenshot('Conferma Vista', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(5000)
    }


    /**
     * It clicks on a dropdown menu, then clicks on a submenu, then checks if the submenu contains a
     * specific text.
     * @param {VisteSuggerite} vista - the name of the view
     */
    static checkVistaSuggeriteExistByMenu(vista) {
        cy.get('nx-icon[class^="nx-icon--s ndbx-icon nx-icon--chevron-down-small"]').click()

        // Click Le mie viste
        cy.get('div[class="cdk-overlay-pane"]').first().should('be.visible').within(() => {
            cy.contains('Viste suggerite').click()
        }).then(() => {
            cy.get('div[class="cdk-overlay-pane"]').last()
                .should('be.visible').within(($menuVisteSuggerite) => {
                    expect($menuVisteSuggerite).to.contain(vista)
                })

        })
    }

    /**
     * It clicks on a menu, then clicks on a submenu, then checks that the submenu does not contain a
     * certain string.
     * @param {VisteSuggerite} vista - the name of the view
     */
    static checkVistaSuggeriteNotExistByMenu(vista) {
        cy.get('nx-icon[class^="nx-icon--s ndbx-icon nx-icon--chevron-down-small"]').click()

        // Click Le mie viste
        cy.get('div[class="cdk-overlay-pane"]').first().should('be.visible').within(() => {
            cy.contains('Viste suggerite').click()
        }).then(() => {
            cy.get('div[class="cdk-overlay-pane"]').last()
                .should('be.visible').within(($menuVisteSuggerite) => {
                    expect($menuVisteSuggerite).to.not.contain(vista)
                })

        })
    }

    /**
     * It checks if the tooltip of a column header is correct.
     * @param {Object} columns - columns of the view 
     */
    static checkTooltipHeadersColonne(columns) {
        let regexKey
        for (const [key, value] of Object.entries(columns)) {
            cy.get('table').within(() => {

                regexKey = new RegExp('\^' + value.key + '\$');
                cy.contains(regexKey).scrollIntoView().should('exist').rightclick().focused().wait(1500)
            })
            cy.get('.cdk-overlay-container').within((tooltip) => {
                expect(tooltip.text()).to.contain(value.tooltip)
            })
        }
    }

    /**
    * It selects a random row from a table and clicks on the checkbox in that row.
    * 
    */
    static selezionaRigaRandom() {
        cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').should('be.visible').then((rowsTable) => {
            let selected = Cypress._.random(rowsTable.length - 1);
            cy.wrap(rowsTable).eq(selected).as('selectRiga')
            cy.wrap(rowsTable).eq(selected).within(() => {
                this.checkBoxControl().click({ force: true })
            })
        })
    }

    /**
     * It checks if the section "Delta Premio" is visible and if it contains the text "Plafond", "Calcolo
     * prenotazione Riduzione Premi" and the refresh icon.
     */
    static verificaSezioneDeltaPremio() {
        this.sferaDeltaPremioSection().within(() => {
            cy.contains("Plafond").should('exist').and('be.visible')
            cy.contains("Calcolo prenotazione Riduzione Premi").should('exist').and('be.visible')
            cy.get('nx-icon[class="refresh-icon nx-icon--auto"]').should('exist').and('be.visible')
        })
    }

    /**
     * It takes a column name and a value, finds the column index, then iterates through each row and
     * checks if the value is present in the column.
     * @param colonna - is the column name
     * @param valore - the value to be checked
     */
    static checkValoreInColonna(colonna, valore) {
        cy.contains('th', `${colonna.key}`).invoke('index').then((i) => {
            cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]').each((rowsTable) => {
                cy.wrap(rowsTable).find('td').eq(i - 2).then(($textCell) => {
                    expect($textCell.text().trim()).to.contain(valore)
                })
            })
        })
    }

    static checkExistRipetitoreDati(vista, dataInizio, dataFine) {
        cy.intercept(estraiTotaleQuietanzeScartate).as('estraiTotaleQuietanzeScartate')
        switch (vista) {
            case VisteSuggerite.QUIETANZE_SCARTATE:
                cy.get('div[class="row-total-2 nx-grid__row"]').should('be.visible')
                    .then(contents => {
                        expect(contents.text().trim()).to.include(dataInizio)
                        expect(contents.text().trim()).to.include(dataFine)
                        expect(contents.text().trim()).to.include('Motor')
                        expect(contents.text().trim()).to.include('quietanzamento on-line in: Viste suggerite > Carico Mancante')

                    })
                break
            default:
                cy.get('p[class="nx-margin-right-xs nx-copy nx-copy--normal"]').should('be.visible').then((title) => {
                    expect(title.text().trim()).to.include('Elementi')
                    expect(title.text().trim()).to.include('Selezionati')
                    expect(title.text().trim()).to.include('Data:')
                    expect(title.text().trim()).to.include('Cluster:')
                    expect(title.text().trim()).to.include('Fonti:')
                })
                break;
            // default: throw new Error('Vista non presente')
        }
    }

    /**
     * It checks if the checkboxes are checked or not.
     * @param {VisteSuggerite} vista - the name of the view
     */
    static checkTipoQuietanzeCheckedDefault(vista) {
        switch (vista) {
            case VisteSuggerite.GESTIONE_ENTE:
                cy.get('nx-checkbox[formcontrolname="' + TipoQuietanze.IN_LAVORAZIONE + '"]').within(() => {
                    cy.get('input').invoke('attr', 'value', 'true')
                })
                cy.get('nx-checkbox[formcontrolname="' + TipoQuietanze.DA_LAVORARE + '"]').within(() => {
                    cy.get('input').invoke('attr', 'value', 'true')
                })
                cy.get('nx-checkbox[formcontrolname="' + TipoQuietanze.INCASSATE + '"]').within(() => {
                    cy.get('input').invoke('attr', 'value', 'false')
                })
                break;
            default: throw new Error('Errore vista non ')
        }
    }

    /**
     * It checks that the sum of the numbers in the "h3"(tipoQuietanze) tags is equal to the number in the "button"
     * tag(Estrai). => Check Cluster are unchecked
     */
    static checkClusterAllUnchecked() {
        cy.wait(10000)
        cy.get('app-card-panel').should('be.visible').then(() => {
            let numQuietanze = []
            cy.get('h3[class="big-num nx-font-weight-semibold nx-heading--subsection-small"]').each(($num, i) => {
                numQuietanze.push(parseInt($num.text().trim()))
            }).then(() => {
                cy.get('footer').find('button:contains("Estrai") > span').then((numEstrai) => {
                    const sum = numQuietanze.reduce((partialSum, a) => partialSum + a, 0);
                    var number = parseInt(numEstrai.text().trim().replace(/\D/g, ""))
                    expect(sum.toString()).to.eq(number.toString())
                })
            })
        })
    }

    static setDateInizio(dataInizio) {
        cy.get(`input[formcontrolname="${DateInputForm.DATA_INIZIO_PERIODO}"]`).clear().wait(500).click().type(dataInizio).wait(1000)
    }

    /**
     * It checks if the date is one month later than the current date.
     */
    static checkDateModifiedOneMonthLater(dataInizio) {
        this.setDateInizio(dataInizio)

        cy.get('nx-icon[name="calendar"]:last').click()
        cy.get('tbody[class="nx-calendar-body"]').should('be.visible').find('tr[role="row"]:last')
            .find('div[class="nx-calendar-body-cell-content nx-calendar-body-selected"]').then((day) => {
                if (day.text().includes('30') || day.text().includes('28') || day.text().includes('29') || day.text().includes('31'))
                    assert.isOk('Data Cambiata correttamente')
                else
                    assert.fail('ERRORE -> Data non cambiata automaticamente')
            })

        cy.get('nx-icon[name="close"]:last').click()

    }

    /**
     * Click the ellipsis icon, check that the menu is visible, check that the menu contains the link
     * text, click the ellipsis icon again.
     * @param {String} link - the text of the link you want to check if exist
     */
    static checkTrePuntiniLink(link) {
        //Click tre puntini
        cy.get('nx-icon[class="ndbx-icon nx-icon--ellipsis-v nx-link__icon nx-icon--auto"]')
            .should('be.visible')
            .click().wait(2000)

        cy.get('div[role="menu"]').should('be.visible').within(() => {
            cy.get('button[role="menuitem"]').should('include.text', link)
        })

        cy.get('nx-icon[class="ndbx-icon nx-icon--ellipsis-v nx-link__icon nx-icon--auto"]')
            .should('be.visible')
            .click().wait(2000)

    }

    /**
     * It clicks on the calendar icon, then clicks on the next month button twice, and then closes the
     * calendar.
     */
    static checkCalendarNextOnlyTwoMonth() {
        cy.get('nx-icon[name="calendar"]:last').click()
        cy.get('nx-calendar').should('be.visible').within(() => {
            cy.get('button[aria-label="Next month"]').click()
            cy.get('button[aria-label="Next month"]').should('not.have.attr', 'disabled')
            cy.get('button[aria-label="Next month"]').click()
            cy.get('button[aria-label="Next month"]').should('have.attr', 'disabled')

        })

        cy.get('nx-datepicker-content').should('be.visible').within(() => {
            cy.get('nx-icon[name="close"]').should('be.visible').click()
        })
    }


    /**
     * This function checks if the three flags are visible on the page.
     */
    static checkSezioniDecadi() {
        cy.get('p:contains("Limiti decadi:")').parent().within(() => {
            cy.get('div[class="LD1 bandierinaPiccola ng-star-inserted"]').should('be.visible')
            cy.get('div[class="LD2 bandierinaPiccola ng-star-inserted"]').should('be.visible')
            cy.get('div[class="LD3 bandierinaPiccola ng-star-inserted"]').should('be.visible')
            cy.screenshot('Verifica Limiti Decadi')
        })
    }

    /**
     * It checks if the tooltip is visible and then it checks if the tooltip contains the correct text.
     */
    static checkTooltipSezioniDecadi() {
        cy.get('p:contains("Limiti decadi:")').parent().then(() => {
            const tooltipDecadi = [
                'Limite prima decade',
                'Limite seconda decade',
                'Limite terza decade'
            ]
            cy.get('p[class="nx-margin-right-s nx-copy nx-copy--normal ng-star-inserted"]').should('be.visible').each(($sezione, i) => {
                cy.wrap($sezione).rightclick().wait(1500)
                cy.get('.cdk-overlay-container').within((tooltip) => {
                    expect(tooltip.text()).to.contain(tooltipDecadi[i])
                })
            })
        })
    }

    /**
     * Check if the decade section also changes as the calendar changes
     */
    static checkVaraziazioneDecadiByCalendar() {
        let dataInizio = Common.setDate(undefined, 1, false)
        this.setDateInizio(dataInizio)
        this.estrai()
        cy.get('p:contains("Limiti decadi:")').parent().within(() => {
            cy.screenshot('Verifica Limiti Decadi Mese Corrente')
        })
        let decadi = []
        cy.get('p[class="nx-margin-right-s nx-copy nx-copy--normal ng-star-inserted"]').should('be.visible').each(($sezione) => {
            decadi.push($sezione.text().trim())
        })

        dataInizio = Common.setDate(undefined, 1, true)
        this.espandiPannello()
        this.setDateInizio(dataInizio)
        this.estrai()

        cy.get('p:contains("Limiti decadi:")').parent().within(() => {
            cy.screenshot('Verifica Limiti Decadi Mese Successivo')
        })
        cy.get('p[class="nx-margin-right-s nx-copy nx-copy--normal ng-star-inserted"]').should('be.visible').each(($sezione, i) => {
            expect($sezione.text().trim()).not.eq(decadi[i])
        })
    }

    /**
     * It checks if the tooltip of a single column header is correct.
     * @param {Object} column - One columns of the view 
     */
    static checkTooltipSingleColumn(column) {
        let regexKey
        cy.get('table').within(() => {

            regexKey = new RegExp('\^' + column.key + '\$');
            cy.contains(regexKey).scrollIntoView().should('exist').rightclick().focused().wait(1500)
        })
        cy.get('.cdk-overlay-container').within((tooltip) => {
            expect(tooltip.text()).to.contain(column.tooltip)
        })
    }



    static selezionaRigaIndex(riga) {
        cy.wrap(riga).within(() => {
            this.checkBoxControl().click({ force: true })
        })
    }

    static checkExistUltTipoInvio(RigaConAvviso) {
        cy.get(RigaConAvviso).then($riga => {
            let checkExist = $riga.find('td').is(':contains(Sms)')
            console.log(checkExist)
        })
    }

    static checkAvvisoInviato(tipo) {
        switch (tipo) {
            case Sfera.TIPOAVVISO.SMS:
                selectRandomClientWithPhone().then(polizza => {
                    sendAvviso(Sfera.TIPOAVVISO.SMS)
                    this.espandiPannello()
                    this.estrai()
                    checkAvviso(Sfera.TIPOAVVISO.SMS, polizza)
                })
                break;
            case Sfera.TIPOAVVISO.EMAIL:
                selectRandomClientWithEmail().then(polizza => {
                    sendAvviso(Sfera.TIPOAVVISO.EMAIL)
                    cy.wait(60000)
                    this.espandiPannello()
                    this.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.AVVISI_SCADENZA)
                    cy.contains('Avviso da Inviare').click() // Tolgo il cluster
                    cy.contains('Avviso Inviato').click() // Aggiungo il cluster
                    this.estrai()
                    checkAvviso('Email', polizza)
                })
                break;
            default:
                break;
        }

        /**
         * It selects a random row With Number Phone(+39-) from a table, then clicks on the checkbox in that row.
         * @returns {Promise<string>} Promise (Polizza)
         */
        function selectRandomClientWithPhone() {
            return new Cypress.Promise(resolve => {
                cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]')
                    .filter(':contains("+39-")').not('Sms')
                    .should('be.visible')
                    .then(($tr) => {
                        const items = $tr.toArray()
                        return Cypress._.sample(items)
                    })
                    .then(($tr) => {
                        expect(Cypress.dom.isJquery($tr), 'jQuery element').to.be.true
                        cy.log(`you picked "${$tr.text()}"`)
                        const polizza = $tr.find('td').eq(2).text().trim()
                        cy.wrap($tr).within(() => {
                            Sfera.checkBoxControl().click({ force: true })
                        })
                        resolve(polizza)
                    })
            })
        }

        function selectRandomClientWithEmail() {
            // Filtro su polizze con consenso Email SI
            Sfera.filtraSuColonna(Sfera.FILTRI.CONS_EMAIL_POL,Sfera.FILTRI.CONS_EMAIL_POL.values.SI)
            return new Cypress.Promise(resolve => {
                cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]')
                    .filter(':contains("@")').not('Sms')
                    .should('be.visible')
                    .then(($tr) => {
                        const items = $tr.toArray()
                        return Cypress._.sample(items)
                    })
                    .then(($tr) => {
                        expect(Cypress.dom.isJquery($tr), 'jQuery element').to.be.true
                        cy.log(`you picked "${$tr.text()}"`)
                        const polizza = $tr.find('td').eq(2).text().trim()
                        cy.wrap($tr).within(() => {
                            Sfera.checkBoxControl().click({ force: true })
                        })
                        resolve(polizza)
                    })
            })
        }

        /**
         *  Send Advise  
         * @param {TipoAvviso} type - Sms, Email, Cartacei
         */
        function sendAvviso(type) {
            cy.get('nx-icon[class="ndbx-icon nx-icon--ellipsis-v nx-link__icon nx-icon--auto"]')
                .should('be.visible')
                .click().wait(2000)

            cy.contains('Invia avviso').click()

            cy.get('nx-modal-container').should('be.visible').within(() => {
                switch (type) {
                    case TipoAvviso.AVVISI_CARTACEI:
                        cy.get('nx-radio[nxvalue="Avvisi Cartacei"]').click()
                        break;
                    case TipoAvviso.EMAIL:
                        cy.get('nx-radio[nxvalue="Avvisi via e-mail"]').click()
                        break;
                    case TipoAvviso.SMS:
                        cy.get('nx-radio[nxvalue="Avvisi via sms"]').click()
                        break;
                    default: throw new Error('Tipo avviso Errato')
                }
                cy.contains('Procedi').click()
            })
            cy.get('nx-modal-container').should('be.visible').within(() => {
                switch (type) {
                    case TipoAvviso.AVVISI_CARTACEI:
                        cy.contains('Crea PDF selezionati').click()
                        break;
                    case TipoAvviso.EMAIL:
                        cy.contains('Invia email selezionate').click()
                        cy.get('h3[nxheadline="subsection-small"]').should('include.text', 'Email accodate con successo')
                        break;
                    case TipoAvviso.SMS:
                        cy.contains('Invia sms selezionati').click()
                        cy.get('h3[nxheadline="subsection-small"]').should('include.text', 'Sms accodati con successo')
                        break;
                    default: throw new Error('Tipo avviso Errato')
                }

                cy.contains('Chiudi').click().wait(30000)
            })
        }

        /**
         * "Check if the Notification has been sent in the table
         * @param type - TipoAvviso.AVVISI_CARTACEI, TipoAvviso.EMAIL, TipoAvviso.SMS
         * @param contraente - the name of the person
         */
        function checkAvviso(type, polizza) {
            Sfera.filtraSuColonna(Sfera.FILTRI.POLIZZA, polizza)
            let dataInizio = Common.setDate()
            cy.get('tr[class="nx-table-row nx-table-row--selectable ng-star-inserted"]')
                .filter(':contains("' + polizza + '")').then(($tr) => {
                    let someText = $tr.text().trim().replace(/(\r\n|\n|\r)/gm, "");
                    console.log(someText)
                    expect(someText).to.include(dataInizio)
                    expect(someText).to.include(type)
                })
        }
    }
}
export default Sfera