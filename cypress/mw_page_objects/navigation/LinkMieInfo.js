const LinksMenu = {
    PRIMO_PIANO: 'Primo piano',
    RACCOLTE: 'Raccolte',
    TUTTE_LE_NOTIZIE: 'Tutte le Notizie',
    CONTENUTI_SALVATI: 'Contenuti salvati',
    PRODOTTI: 'Prodotti',
    INIZIATIVE: 'Iniziative',
    MOMENTO_DELLA_VERITA: 'Momento della Verità',
    SALES_ACADEMY: 'Sales Academy',
    EVENTI_E_SPONSORIZZAZIONI: 'Eventi e Sponsorizzazioni',
    RILASCI_INFORMATICI: 'Rilasci informatici',
    MANUALI_INFORMATICI: 'Manuali informatici',
    CIRCOLARI: 'Circolari',
    COMPANY_HANDBOOK: 'Company Handbook',
    ANTIRICICLAGGIO: 'Antiriciclaggio',
    RISORSE_PER_AGENZIA: 'Risorse per l\'Agenzia',
    OPERATIVITA: 'Operatività',
    RISORSE_PER_AGENTE: 'Risorse per l\'Agente',
    IL_MONDO_ALLIANZ: 'Il mondo Allianz',
    deleteKey: function (keys) {
        if (!keys['primo-piano']) delete this.PRIMO_PIANO
        if (!keys['raccolte']) delete this.RACCOLTE
        if (!keys['tutte-le-notizie']) delete this.TUTTE_LE_NOTIZIE
    }
    // NEW_COMPANY_HANDBOOK: 'New company handbook',
}

const LinksSubMenu = {
    PRODOTTI: {
        ALLIANZ_ULTRA: 'Allianz Ultra',
        ALLIANZ1_BUSINESS: 'Allianz1 Business',
        AUTO_E_MOTORI: 'Auto e motori',
        CASA_CONDOMINIO_E_PETCARE: 'Casa condominio e petcare',
        INFORTUNI_E_SALUTE: 'Infortuni e salute',
        IMPRESA_E_RISCHI_DEDICATI: 'Impresa e rischi dedicati',
        TUTELA_LEGALE: 'Tutela legale',
        VITA: 'Vita',
        VITA_CORPORATE: 'Vita Corporate',
        CONVENZIONI_NAZIONALI: 'Convenzioni nazionali',
        CONVENZIONI_LOCALI_E_OFFERTE_DEDICATE: 'Convenzioni locali e offerte dedicate',
        AGCS_ITALIA: 'AGCS Italia',
        FINANZIAMENTI_COMPASS: 'Finanziamenti Compass',
    },
    INIZIATIVE: {
        STOPDRIVE: 'Stop&Drive',
        PROPONI_LTC: 'Proponi LTC',
        PROPONI_TCM: 'Proponi TCM',
        MENSILIZZAZIONE_RAMI_VARI: 'Mensilizzazione Rami Vari',
        MENSILIZZAZIONE_AUTO: 'Mensilizzazione Auto',
        CLIENTI_VALORE_EXTRA: 'Clienti Valore Extra',
        ALLIANZPAY: 'AllianzPay',
        BUSTA_ARANCIONE: 'Busta arancione',
        WINBACK_MOTOR: 'Winback Motor',
        DECOMMISSIONING_TELEMATICI: 'Decommissioning telematici',
        DIGITALIZZAZIONE_DEL_CERTIFICATO_ASSICURAZTIVO_MOTOR: 'Digitalizzazione del certificato assicurativo Motor',
        ATTESTATO_DI_RISCHIO_DINAMICO: 'Attestato di rischio dinamico'
    },
    SALES_ACADEMY: {
        CHI_SIAMO: 'Chi siamo',
        //MASTER_PROFESSIONE_AGENTE: 'Master Professione Agente',
        ALLIANZ_BUSINESS_SCHOOL: 'Allianz Business School',
        PERCORSI_DI_RUOLO: 'Percorsi di ruolo',
        // OBBLIGHI_IVASS: 'Obblighi IVASS',
        CAMPUS_IVASS: 'Campus e IVASS',
        FORMAZIONE_MULTICANALE: 'Formazione Multicanale'
    },
    // NEW_COMPANY_HANDBOOK: {
    //     GESTIONE_CONTRATTUALE: 'Gestione Contrattuale',
    //     ACH: 'CH Prova',
    // },
    ANTIRICICLAGGIO: {
        NORMATIVA: 'Normativa',
        MODULI_MANUALI_E_PROCEDURE: 'Moduli, manuali e procedure',
        LINK_UTILI: 'Link utili'
    },
    RISORSE_PER_AGENZIA: {
        RECLUTAMENTO: 'Reclutamento',
        ARREDARE_AGENZIA: 'Arredare l\'Agenzia',
        DIGITAL_MARKETING_E_SOCIAL_MEDIA: 'Digital Marketing e Social Media',
        MATERIALI_DI_COMUNICAZIONE: 'Materiali di comunicazione',
        RICHIESTA_STAMPATI: 'Richiesta stampati',
        ORDINI_DI_TONER_E_CARTA: 'Ordini di toner e carta',
        CATALOGO_PRODOTTI_TECNOLOGICI: 'Catalogo prodotti tecnologici',
        SICUREZZA_IT: 'Sicurezza IT',
        APP_ADAM: 'L\'app ADAM',
        PACCHETTI_DI_SICUREZZA: 'Pacchetti di sicurezza',
        RIFERIMENTI_AZIENDALI: 'Riferimenti aziendali',
        LINK_UTILI: 'Link utili',
        IDD: 'IDD',
    },
    RISORSE_PER_AGENTE: {
        TRATTAMENTI_PROVVIGIONALI: 'Trattamenti provvigionali',
        INCENTIVAZIONI_MISSION_REGOLAMENTI: 'Incentivazioni, mission, regolamenti',
        CASA_ALLIANZ: 'Casa Allianz',
        COLLABORAZIONI_ORIZZONTALI: 'Collaborazioni orizzontali',
        CONVENZIONI_PRODOTTI_ALLIANZ: 'Convenzioni Prodotti Allianz',
        CASSA_PREVIDENZA_AGENTI: 'Cassa Previdenza Agenti',
        //LE_SCELTE_DI_INVESTIMENTO: 'Le scelte di investimento',
        CATALOGO_IDEE: 'Catalogo idee'
    },
    IL_MONDO_ALLIANZ: {
        I_CODICI_DI_ALLIANZ_SPA: 'I codici di Allianz SpA',
        LA_RASSEGNA_STAMPA: 'La rassegna stampa',
        AGRICOLA_SAN_FELICE: 'Agricola San Felice'
    }
}

//TODO: Sublinks livello 2
// const SubLinksProdotti = {
//     ALLIANZ_ULTRA,
//     ALLIANZ1_BUSINESS,
//     AUTO_E_MOTORI,
//     CASA_CONDOMINIO_E_PETCARE,
//     INFORTUNI_E_SALUTE,
//     IMPRESA_E_RISCHI_DEDICATI
// }

// const ALLIANZ_ULTRA = {
//     AMBITO_FABBRICATO: 'Ambito Fabbricato',
//     AMBITO_CONTENUTO: 'Ambito Contenuto',
//     AMBITO_CATASTROFI_NATURALI: 'Ambito Catastrofi naturali',
//     AMBITO_TUTELA_LEGALE: 'Ambito Animali domestici',
//     ALLIANZ_ULTRA_SALUTE: 'Allianz Ultra Salute',
//     AMBITO_SPESE_MEDICHE: 'Ambito Spese mediche',
//     AMBITO_DIARIA_DA_RICOVERO: 'Ambito Diaria da ricovero',
//     AMBITO_INVALIDITA_PERMANENTE_DA_INFORTUNIO: 'Ambito Invalidità permanente da infortunio',
//     AMBITO_INVALIDITA_PERMANENTE_DA_MALATTIA: 'Ambito Invalidità permanente da malattia'
// }

// const ALLIANZ1_BUSINESS = {
//     ALLIANZ1_BUSINESS: 'Allianz1 Business',
//     DANNI_AI_BENI: 'Danni ai beni',
//     RESPONSABILITA_CIVILE: 'Responsabilità civile',
//     ASSISTENZA: 'Assistenza',
//     PROTEZIONE_SOCI: 'Protezione Soci',
//     DANNI_AI_LOCALI: 'Danni ai locali',
//     DANNI_AL_CONTENUTO: 'Danni al contenuto',
//     FURTO_E_RAPINA: 'Furto e rapina',
//     ROTTURA_ACCIDENTALE_DI_VETRI_E_LASTRE: 'Rottura accidentale di vetri e lastre',
//     CATASTROFI_NATURALI: 'Catastrofi naturali',
//     RESPONSABILITA_CIVILE: 'Responsabilità civile',
//     DANNI_A_TERZI: 'Danni ai terzi',
//     ASSISTENZA: 'Emergenze in azienda',
//     TUTELA_LEGALE: 'Tutela Legale',
//     PROTEZIONE_SOCI: 'Protezione Soci',
//     PREMORIENZA_E_INVALIDITA: 'Premorienza e invalidità'
// }

// const AUTO_E_MOTORI = {
//     AUTO: 'Auto',
//     ULTRA_4R: 'Ultra 4R',
//     BONUS_MALUS_TEST: 'Bonus Malus Test',
//     NUOVA_4R: 'Nuova 4R',
//     PATTO_PER_I_GIOVANI: 'Patto per i giovani',
//     SALVADANNI: 'SalvaDanni',
//     MOTO: 'Moto',
//     BONUS_MALUS_MOTOCICLI: 'Bonus Malus Motocicli',
//     BONUS_MALUS_CICLOMOTORI: 'Bonus Malus Ciclomotori',
//     NAUTICA: 'Nautica',
//     PASSIONE_BLU: 'Passione Blu',
//     ALTRI_VEICOLI: 'Altri Veicoli'
// }

// const CASA_CONDOMINIO_E_PETCARE = {
//     CONDOMINIO: 'Condominio',
//     GLOBALE_FABBRICATI_CIVILI: 'Globale Fabbricati Civili',
// }

// const INFORTUNI_E_SALUTE = {
//     INFORTUNI: 'Infortuni',
//     UNIVERSO_PERSONA: 'Universo Persona',
//     BLU_SUITE: 'Blu Suite',
//     INFORTUNI_DA_CIRCOLAZIONE: 'Infortuni da circolazione',
//     ALL_SALUTE_INFORTUNI_IMPRESE: 'All Salute - Infortuni Imprese',
//     ALL_SALUTE_INFORTUNI_ASSO: 'All Salute - Infortuni ASSO',
//     SALUTE: 'Salute',
//     UNIVERSO_PERSONA_MALATTIE_GRAVI: 'Universo Persona Malattie Gravi',
//     UNIVERSO_SALUTE: 'Universo Salute',
//     BLU_SUITE: 'Blu Suite',
//     ALLIANZ_PROTEZIONE_ONCOLOGICA: 'Allianz Protezione Oncologica',
//     INVALIDITA_PERMANENTE_DA_MALATTIA: 'Invalidita Permanente da Malattia',
//     ALL_SALUTE_RSM_IMPRESE: 'All Salute - RSM Imprese',
//     INVALIDITA_PERMANENTE_DA_MALATTIA_IMPRESE: 'Invalidita Permanente da Malattia Imprese'
// }

// const IMPRESA_E_RISCHI_DEDICATI = {
//     IMPRESA: 'Impresa',
//     AGRICOLTURA: 'Agricoltura',
//     ALBERGHI: 'Alberghi',
//     BANCHE: 'Banche',
//     CAUZIONI: 'Cauzioni',
//     FINE_ART: 'Fine Art',
//     MERCI: 'Merci',
//     NAUTICA: 'Nautica',
//     RISCHI_TECNOLOGICI: 'Rischi Tecnologici',
//     RISCHI_VARI: 'Rischi Vari',
//     SCUOLE: 'Scuole',
//     STUDI_PROFESSIONALI: 'Studi Professionali',
// }

// const SUBLINKS_IMPRESA_E_RISCHI_DEDICATI = {
//     IMPRESA : {
//         CYBER_PROTECTION:'Cyber Protection',
//         IMPRESA_SICURA_EDIZIONE_2017: 'Impresa Sicura - Edizione 2017',
//         ALLIANZ_BOARD_PROTECTION: 'Allianz Board Protection',
//         ALLIANZ_ENTERPRISE_LIABILITY: 'allianz enterprise liability',
//         MODULARE_PROPERTY: 'Modulare Property',
//         BLOCK_POLICY_GIOIELLIERI: 'Block policy gioiellieri'
//     },
//     AGRICOLTURA: {
//         ALLIANZ_UNIVERSO_AGRICOLTURA:'Allianz Universo Agricoltura',
//         GRANDINE_E_ALTRE_AVVERSITA: 'grandine e altre avversità',
//         MODELLO_GENERICO_AGRICOLTURA: 'modello generico agricoltura'
//     },
//     ALBERGHI:{
//         //TODO:finire
//     }
//     BANCHE: 'Banche',
//     CAUZIONI: 'Cauzioni',
//     FINE_ART: 'Fine Art',
//     MERCI: 'Merci',
//     NAUTICA: 'Nautica',
//     RISCHI_TECNOLOGICI: 'Rischi Tecnologici',
//     RISCHI_VARI: 'Rischi Vari',
//     SCUOLE: 'Scuole',
//     STUDI_PROFESSIONALI: 'Studi Professionali',
// }

let keysLinksMenu = {
    'primo-piano': true,
    'raccolte': true,
    'tutte-le-notizie': true,
    // PRIMO_PIANO: true,
    // RACCOLTE: true,
    // TUTTE_LE_NOTIZIE: true,
    // CONTENUTI_SALVATI: true,
    // PRODOTTI: true,
    // INIZIATIVE: true,
    // MOMENTO_DELLA_VERITA: true,
    // SALES_ACADEMY: true,
    // EVENTI_E_SPONSORIZZAZIONI: true,
    // RILASCI_INFORMATICI: true,
    // MANUALI_INFORMATICI: true,
    // CIRCOLARI: true,
    // COMPANY_HANDBOOK: true,
    // ANTIRICICLAGGIO: true,
    // RISORSE_PER_AGENZIA: true,
    // OPERATIVITA: true,
    // RISORSE_PER_AGENTE: true,
    // IL_MONDO_ALLIANZ: true,
}


class LinkMieInfo {

    static getLinksMenu() {
        return LinksMenu;
    }

    static getLinksSubMenu() {
        return LinksSubMenu
    }

    static profilingLinksMenu(tutf) {
        for (let key in keysLinksMenu) {
            cy.slugMieInfo(tutf, key.toString()).then((stateKey) => {
                if (!stateKey) {
                    keysLinksMenu[key] = false
                    LinksMenu.deleteKey(keysLinksMenu)
                }
            })
        }
    }

    static getKeysLinksMenu() {
        return keysLinksMenu
    }

} export default LinkMieInfo