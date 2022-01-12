const LinksMenu = {
    PRIMO_PIANO: 'Primo piano',
    RACCOLTE: 'Raccolte',
    TUTTE_LE_NOTIZIE: 'Tutte le notizie',
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
        if (!keys['prodotti']) delete this.PRODOTTI
        if (!keys['iniziative']) delete this.INIZIATIVE
        if (!keys['sinistri']) delete this.MOMENTO_DELLA_VERITA
        if (!keys['sales-academy']) delete this.SALES_ACADEMY
        if (!keys['eventi-e-sponsorizzazioni']) delete this.EVENTI_E_SPONSORIZZAZIONI
        if (!keys['le-release']) delete this.RILASCI_INFORMATICI
        if (!keys['manuali-informatici']) delete this.MANUALI_INFORMATICI
        if (!keys['circolari']) delete this.CIRCOLARI
        if (!keys['company-handbook']) delete this.COMPANY_HANDBOOK
        if (!keys['antiriciclaggio']) delete this.ANTIRICICLAGGIO
        if (!keys['risorse-per-l\'agenzia']) delete this.RISORSE_PER_AGENZIA
        if (!keys['operativita']) delete this.OPERATIVITA
        if (!keys['risorse-per-l\'agente']) delete this.RISORSE_PER_AGENTE
        if (!keys['il-mondo-allianz']) delete this.IL_MONDO_ALLIANZ
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
        deleteKey: function (keys) {
            if (!keys['prodotti/allianz-ultra']) delete this.ALLIANZ_ULTRA
            if (!keys['prodotti/allianz1-business']) delete this.ALLIANZ1_BUSINESS
            if (!keys['prodotti/auto-e-motori']) delete this.AUTO_E_MOTORI
            if (!keys['prodotti/casa-condominio-e-petcare']) delete this.CASA_CONDOMINIO_E_PETCARE
            if (!keys['prodotti/impresa-e-rischi-dedicati']) delete this.IMPRESA_E_RISCHI_DEDICATI
            if (!keys['prodotti/tutela-legale']) delete this.TUTELA_LEGALE
            if (!keys['prodotti/vita']) delete this.VITA
            if (!keys['prodotti/vita-corporate']) delete this.VITA_CORPORATE
            if (!keys['prodotti/convenzioni-nazionali']) delete this.CONVENZIONI_NAZIONALI
            if (!keys['prodotti/convenzioni-locali-e-offerte-dedicate']) delete this.CONVENZIONI_LOCALI_E_OFFERTE_DEDICATE
            if (!keys['prodotti/agcs-italia']) delete this.AGCS_ITALIA
            if (!keys['prodotti/finanziamenti-compass']) delete this.FINANZIAMENTI_COMPASS
            if (!keys['prodotti/allianz-ultra']) delete this.ALLIANZ_ULTRA
        }
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
        ATTESTATO_DI_RISCHIO_DINAMICO: 'Attestato di rischio dinamico',
        TEXT: 'Test',
        deleteKey: function (keys) {
            if (!keys['iniziative/stop&drive']) delete this.STOPDRIVE
            if (!keys['iniziative/proponi-ltc']) delete this.PROPONI_LTC
            if (!keys['iniziative/proponi-tcm']) delete this.PROPONI_TCM
            if (!keys['iniziative/mensilizzazione-rami-vari']) delete this.MENSILIZZAZIONE_RAMI_VARI
            if (!keys['iniziative/mensilizzazione-auto']) delete this.MENSILIZZAZIONE_AUTO
            if (!keys['iniziative/clienti-valore-extra']) delete this.CLIENTI_VALORE_EXTRA
            if (!keys['iniziative/allianzpay']) delete this.ALLIANZPAY
            if (!keys['iniziative/busta-arancione']) delete this.BUSTA_ARANCIONE
            if (!keys['iniziative/winback-motor']) delete this.WINBACK_MOTOR
            if (!keys['iniziative/decommissioning-telematici']) delete this.DECOMMISSIONING_TELEMATICI
            if (!keys['iniziative/digitalizzazione-del-certificato-assicurativo-motor']) delete this.DIGITALIZZAZIONE_DEL_CERTIFICATO_ASSICURAZTIVO_MOTOR
            if (!keys['iniziative/attestato-di-rischio-dinamico']) delete this.ATTESTATO_DI_RISCHIO_DINAMICO
            if (!keys['iniziative/test']) delete this.TEXT
        }
    },
    SALES_ACADEMY: {
        CHI_SIAMO: 'Chi siamo',
        MASTER_PROFESSIONE_AGENTE: 'Master Professione Agente',
        ALLIANZ_BUSINESS_SCHOOL: 'Allianz Business School',
        PERCORSI_DI_RUOLO: 'Percorsi di ruolo',
        // OBBLIGHI_IVASS: 'Obblighi IVASS',
        CAMPUS_IVASS: 'Campus e IVASS',
        FORMAZIONE_MULTICANALE: 'Formazione Multicanale',
        deleteKey: function (keys) {
            if (!keys['sales-academy/chi-siamo']) delete this.CHI_SIAMO
            if (!keys['sales-academy/master-professione-agente']) delete this.MASTER_PROFESSIONE_AGENTE
            if (!keys['sales-academy/allianz-business-school']) delete this.ALLIANZ_BUSINESS_SCHOOL
            if (!keys['sales-academy/percorsi-di-ruolo']) delete this.PERCORSI_DI_RUOLO
            if (!keys['sales-academy/obblighi-ivass']) delete this.CAMPUS_IVASS
            if (!keys['sales-academy/canali']) delete this.FORMAZIONE_MULTICANALE
        }
    },
    // NEW_COMPANY_HANDBOOK: {
    //     GESTIONE_CONTRATTUALE: 'Gestione Contrattuale',
    //     ACH: 'CH Prova',
    // },
    ANTIRICICLAGGIO: {
        NORMATIVA: 'Normativa',
        MODULI_MANUALI_E_PROCEDURE: 'Moduli, manuali e procedure',
        LINK_UTILI: 'Link utili',
        deleteKey: function (keys) {
            if (!keys['antiriciclaggio/normative']) delete this.NORMATIVA
            if (!keys['antiriciclaggio/moduli,-manuali-e-procedure']) delete this.MODULI_MANUALI_E_PROCEDURE
            if (!keys['antiriciclaggio/link-utili']) delete this.LINK_UTILI
        }
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
        deleteKey: function (keys) {
            if (!keys['risorse-per-l\'agenzia/reclutamento']) delete this.RECLUTAMENTO
            if (!keys['risorse-per-l\'agenzia/arredare-l\'agenzia']) delete this.ARREDARE_AGENZIA
            if (!keys['risorse-per-l\'agenzia/digital-marketing-e-social-media']) delete this.DIGITAL_MARKETING_E_SOCIAL_MEDIA
            if (!keys['risorse-per-l\'agenzia/materiali-di-comunicazione']) delete this.MATERIALI_DI_COMUNICAZIONE
            if (!keys['risorse-per-l\'agenzia/richiesta-stampati']) delete this.RICHIESTA_STAMPATI
            if (!keys['risorse-per-l\'agenzia/ordini-di-toner-e-carta']) delete this.ORDINI_DI_TONER_E_CARTA
            if (!keys['risorse-per-l\'agenzia/cataloghi-prodotti-tecnologici']) delete this.CATALOGO_PRODOTTI_TECNOLOGICI
            if (!keys['risorse-per-l\'agenzia/sicurezza-it']) delete this.SICUREZZA_IT
            if (!keys['risorse-per-l\'agenzia/l\'app-adam']) delete this.APP_ADAM
            if (!keys['risorse-per-l\'agenzia/pacchetti-di-sicurezza']) delete this.PACCHETTI_DI_SICUREZZA
            if (!keys['risorse-per-l\'agenzia/riferimenti-aziendali']) delete this.RIFERIMENTI_AZIENDALI
            if (!keys['risorse-per-l\'agenzia/link-utili']) delete this.LINK_UTILI
            if (!keys['risorse-per-l\'agenzia/minisito-idd']) delete this.IDD
        }
    },
    RISORSE_PER_AGENTE: {
        TRATTAMENTI_PROVVIGIONALI: 'Trattamenti provvigionali',
        INCENTIVAZIONI_MISSION_REGOLAMENTI: 'Incentivazioni, mission, regolamenti',
        // CASA_ALLIANZ: 'Casa Allianz',
        COLLABORAZIONI_ORIZZONTALI: 'Collaborazioni orizzontali',
        CONVENZIONI_PRODOTTI_ALLIANZ: 'Convenzioni Prodotti Allianz',
        CASSA_PREVIDENZA_AGENTI: 'Cassa Previdenza Agenti',
        LE_SCELTE_DI_INVESTIMENTO: 'Le scelte di investimento',
        CATALOGO_IDEE: 'Catalogo idee',
        deleteKey: function (keys) {
            if (!keys['risorse-per-l\'agente/trattamenti-provvigionali']) delete this.TRATTAMENTI_PROVVIGIONALI
            if (!keys['risorse-per-l\'agente/incentivazione,-mission,-regolamenti']) delete this.INCENTIVAZIONI_MISSION_REGOLAMENTI
            if (!keys['risorse-per-l\'agente/collaborazioni-orizzontali']) delete this.COLLABORAZIONI_ORIZZONTALI
            if (!keys['risorse-per-l\'agente/convenzioni-prodotti-allianz']) delete this.CONVENZIONI_PRODOTTI_ALLIANZ
            if (!keys['risorse-per-l\'agente/cassa-previdenza-agenti']) delete this.CASSA_PREVIDENZA_AGENTI
            if (!keys['risorse-per-l\'agente/le-scelte-di-investimento']) delete this.LE_SCELTE_DI_INVESTIMENTO
            if (!keys['risorse-per-l\'agente/catalogo-idee']) delete this.CATALOGO_IDEE
        }
    },
    IL_MONDO_ALLIANZ: {
        I_CODICI_DI_ALLIANZ_SPA: 'I codici di Allianz SpA',
        LA_RASSEGNA_STAMPA: 'La rassegna stampa',
        AGRICOLA_SAN_FELICE: 'Agricola San Felice',
        deleteKey: function (keys) {
            if (!keys['il-mondo-allianz/i-codici-di-allianz-spa']) delete this.I_CODICI_DI_ALLIANZ_SPA
            if (!keys['il-mondo-allianz/la-rassegna-stampa']) delete this.LA_RASSEGNA_STAMPA
            if (!keys['il-mondo-allianz/agricola-san-felice']) delete this.AGRICOLA_SAN_FELICE
        }
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
    'prodotti': true,
    'iniziative': true,
    'sinistri': true,
    'sales-academy': true,
    'eventi-e-sponsorizzazioni': true,
    'le-release': true,
    'manuali-informatici': true,
    'circolari': true,
    'company-handbook': true,
    'antiriciclaggio': true,
    'risorse-per-l\'agenzia': true,
    'operativita': true,
    'risorse-per-l\'agente': true,
    'il-mondo-allianz': true,
}

let keysLinksSubMenu = {
    PRODOTTI: {
        'prodotti/allianz-ultra': true,
        'prodotti/allianz1-business': true,
        'prodotti/auto-e-motori': true,
        'prodotti/casa-condominio-e-petcare': true,
        'prodotti/impresa-e-rischi-dedicati': true,
        'prodotti/tutela-legale': true,
        'prodotti/vita': true,
        'prodotti/vita-corporate': true,
        'prodotti/convenzioni-nazionali': true,
        'prodotti/convenzioni-locali-e-offerte-dedicate': true,
        'prodotti/agcs-italia': true,
        'prodotti/finanziamenti-compass': true
    },
    INIZIATIVE: {
        'iniziative/stop&drive': true,
        'iniziative/proponi-ltc': true,
        'iniziative/proponi-tcm': true,
        'iniziative/mensilizzazione-rami-vari': true,
        'iniziative/mensilizzazione-auto': true,
        'iniziative/clienti-valore-extra': true,
        'iniziative/allianzpay': true,
        'iniziative/busta-arancione': true,
        'iniziative/winback-motor': true,
        'iniziative/decommissioning-telematici': true,
        'iniziative/digitalizzazione-del-certificato-assicurativo-motor': true,
        'iniziative/attestato-di-rischio-dinamico': true,
        'iniziative/test': true
    },
    SALES_ACADEMY: {
        'sales-academy/chi-siamo': true,
        'sales-academy/master-professione-agente': true,
        'sales-academy/allianz-business-school': true,
        'sales-academy/percorsi-di-ruolo': true,
        'sales-academy/obblighi-ivass': true,
        'sales-academy/canali': true,
    },
    ANTIRICICLAGGIO: {
        'antiriciclaggio/normative': true,
        'antiriciclaggio/moduli,-manuali-e-procedure': true,
        'antiriciclaggio/link-utili': true,
    },
    RISORSE_PER_AGENZIA: {
        'risorse-per-l\'agenzia/reclutamento': true,
        'risorse-per-l\'agenzia/arredare-l\'agenzia': true,
        'risorse-per-l\'agenzia/digital-marketing-e-social-media': true,
        'risorse-per-l\'agenzia/materiali-di-comunicazione': true,
        'risorse-per-l\'agenzia/richiesta-stampati': true,
        'risorse-per-l\'agenzia/ordini-di-toner-e-carta': true,
        'risorse-per-l\'agenzia/cataloghi-prodotti-tecnologici': true,
        'risorse-per-l\'agenzia/sicurezza-it': true,
        'risorse-per-l\'agenzia/l\'app-adam': true,
        'risorse-per-l\'agenzia/pacchetti-di-sicurezza': true,
        'risorse-per-l\'agenzia/riferimenti-aziendali': true,
        'risorse-per-l\'agenzia/link-utili': true,
        'risorse-per-l\'agenzia/minisito-idd': true
    },
    RISORSE_PER_AGENTE: {
        'risorse-per-l\'agente/trattamenti-provvigionali': true,
        'risorse-per-l\'agente/incentivazione,-mission,-regolamenti': true,
        'risorse-per-l\'agente/collaborazioni-orizzontali': true,
        'risorse-per-l\'agente/convenzioni-prodotti-allianz': true,
        'risorse-per-l\'agente/cassa-previdenza-agenti': true,
        'risorse-per-l\'agente/le-scelte-di-investimento': true,
        'risorse-per-l\'agente/catalogo-idee': true,
    },
    IL_MONDO_ALLIANZ: {
        'il-mondo-allianz/i-codici-di-allianz-spa': true,
        'il-mondo-allianz/la-rassegna-stampa': true,
        'il-mondo-allianz/agricola-san-felice': true,
    }
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
                }
            })
        }
    }

    static profilingLinksSubMenu(tutf) {

        for (let key in keysLinksSubMenu) {
            for (let subKey in keysLinksSubMenu[key]) {
                cy.slugMieInfo(tutf, subKey.toString()).then((stateKey) => {
                    if (!stateKey) {
                        keysLinksSubMenu[subKey] = false
                    }
                })
            }
        }
    }

    static getKeysLinksMenu() {
        return keysLinksMenu
    }
    static getKeysLinksSubMenu() {
        return keysLinksSubMenu
    }

} export default LinkMieInfo