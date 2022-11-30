/// <reference types="Cypress" />
import Common from "../common/Common";
import Sales from "../navigation/Sales";

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframe = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const LinksBurgerMenu = {
    PREVENTIVO_MOTOR: 'Preventivo Motor',
    SAFE_DRIVE_AUTOVETTURE: 'Safe Drive Autovetture',
    FLOTTE_E_CONVENZIONI: 'Flotte e Convenzioni',
    MINIFLOTTE: 'MiniFlotte',
    TRATTATIVE_AUTO_CORPORATE: 'Trattative Auto Corporate',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Casa e Patrimonio 2022' : 'Allianz Ultra Casa e Patrimonio 2022',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Casa e Patrimonio' : 'Allianz Ultra Casa e Patrimonio',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Casa e Patrimonio BMP' : 'Allianz Ultra Casa e Patrimonio BMP',
    ALLIANZ_ULTRA_SALUTE: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Salute' : 'Allianz Ultra Salute',
    ALLIANZ_ULTRA_IMPRESA: (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Impresa' : 'Allianz Ultra Impresa',
    ALLIANZ1_BUSINESS: 'Allianz1 Business',
    FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE: 'FastQuote Infortuni da circolazione',
    FASTQUOTE_UNIVERSO_PERSONA: 'FastQuote Universo Persona',
    FASTQUOTE_UNIVERSO_SALUTE: 'FastQuote Universo Salute',
    FASTQUOTE_UNIVERSO_PERSONA_MALATTIE_GRAVI: 'FastQuote Universo Persona Malattie Gravi',
    FASTQUOTE_IMPRESA_E_ALBERGO: 'FastQuote Impresa e Albergo',
    ALLIANZ1_PREMORIENZA: 'Allianz1 premorienza',
    PREVENTIVO_ANONIMO_VITA_INDIVIDUALI: 'Preventivo Anonimo Vita Individuali',
    GESTIONE_RICHIESTE_PER_PA: 'Gestione richieste per PA',
    NUOVO_SFERA: 'Nuovo Sfera',
    SFERA: 'Sfera',
    CAMPAGNE_COMMERCIALI: 'Campagne Commerciali',
    RECUPERO_PREVENTIVI_E_QUOTAZIONI: 'Recupero preventivi e quotazioni',
    DOCUMENTI_DA_FIRMARE: 'Documenti da firmare',
    GESTIONE_ATTIVITA_IN_SCADENZA: 'Gestione attività in scadenza',
    MANUTENZIONE_PORTAFOGLIO_RV_MIDCO: 'Manutenzione portafoglio RV Midco',
    VITA_CORPORATE: 'Vita Corporate',
    MONITORAGGIO_POLIZZE_PROPOSTE: 'Monitoraggio Polizze Proposte',
    CERTIFICAZIONE_FISCALE: 'Certificazione fiscale',
    MANUTENZIONE_PORTAFOGLIO_AUTO: 'Manutenzione Portafoglio Auto',
    CRUSCOTTO_CERTIFICATI_APPLICAZIONI: 'Cruscotto certificati applicazioni',
    CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB: 'Cruscotto riepiloghi polizze abb.',
    REPORT_CLIENTE_T4L: 'Report Cliente T4L',
    DOCUMENTI_ANNULLATI: 'Documenti annullati',
    GED_GESTIONE_DOCUMENTALE: 'GED – Gestione Documentale',
    DOCUMENTI_DA_GESTIRE: 'Documenti da gestire',
    FOLDER: 'Folder',
    ALLIANZ_GLOBAL_ASSISTANCE_OAZIS: 'Allianz global assistance - OAZIS',
    ALLIANZ_GLOBAL_ASSISTANCE_GLOBY: 'Allianz global assistance - GLOBY',
    ALLIANZ_PLACEMENT_PLATFORM: 'Allianz placement platform',
    QUALITÀ_PORTAFOGLIO_AUTO: 'Qualità portafoglio auto',
    APP_CUMULO_TERREMOTI: 'App cumulo terremoti',
    NOTE_DI_CONTRATTO: 'Note di contratto',
    ACOM_GESTIONE_INIZIATIVE: 'ACOM Gestione iniziative',
    deleteKey: function (keys) {
        if (!keys.PREVENTIVO_MOTOR) delete this.PREVENTIVO_MOTOR
        if (!keys.SAFE_DRIVE_AUTOVETTURE) delete this.SAFE_DRIVE_AUTOVETTURE
        if ((!keys.FLOTTE_E_CONVENZIONI || Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))) delete this.FLOTTE_E_CONVENZIONI
        if (!keys.MINIFLOTTE) delete this.MINIFLOTTE
        if (!keys.TRATTATIVE_AUTO_CORPORATE) delete this.TRATTATIVE_AUTO_CORPORATE
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP
        if (!keys.ALLIANZ_ULTRA_SALUTE) delete this.ALLIANZ_ULTRA_SALUTE
        if (!keys.ALLIANZ1_BUSINESS) delete this.ALLIANZ1_BUSINESS
        if (!keys.FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE || Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE
        if (!keys.FASTQUOTE_UNIVERSO_PERSONA) delete this.FASTQUOTE_UNIVERSO_PERSONA
        if (!keys.FASTQUOTE_UNIVERSO_SALUTE) delete this.FASTQUOTE_UNIVERSO_SALUTE
        if (!keys.ALLIANZ_ULTRA_IMPRESA) delete this.ALLIANZ_ULTRA_IMPRESA
        if (!keys.FASTQUOTE_UNIVERSO_PERSONA_MALATTIE_GRAVI) delete this.FASTQUOTE_UNIVERSO_PERSONA_MALATTIE_GRAVI
        if (!keys.FASTQUOTE_IMPRESA_E_ALBERGO) delete this.FASTQUOTE_IMPRESA_E_ALBERGO
        if (!keys.ALLIANZ1_PREMORIENZA) delete this.ALLIANZ1_PREMORIENZA
        if (!keys.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI) delete this.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI
        if (!keys.GESTIONE_RICHIESTE_PER_PA) delete this.GESTIONE_RICHIESTE_PER_PA
        if (!keys.NUOVO_SFERA) delete this.NUOVO_SFERA
        if (!keys.SFERA || Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) delete this.SFERA
        if (!keys.CAMPAGNE_COMMERCIALI) delete this.CAMPAGNE_COMMERCIALI
        if (!keys.RECUPERO_PREVENTIVI_E_QUOTAZIONI) delete this.RECUPERO_PREVENTIVI_E_QUOTAZIONI
        if (!keys.DOCUMENTI_DA_FIRMARE) delete this.DOCUMENTI_DA_FIRMARE
        if (!keys.GESTIONE_ATTIVITA_IN_SCADENZA) delete this.GESTIONE_ATTIVITA_IN_SCADENZA
        if (!keys.MANUTENZIONE_PORTAFOGLIO_RV_MIDCO) delete this.MANUTENZIONE_PORTAFOGLIO_RV_MIDCO
        if (!keys.VITA_CORPORATE) delete this.VITA_CORPORATE
        if (!keys.MONITORAGGIO_POLIZZE_PROPOSTE) delete this.MONITORAGGIO_POLIZZE_PROPOSTE
        if (!keys.CERTIFICAZIONE_FISCALE) delete this.CERTIFICAZIONE_FISCALE
        if (!keys.MANUTENZIONE_PORTAFOGLIO_AUTO) delete this.MANUTENZIONE_PORTAFOGLIO_AUTO
        if (!keys.CRUSCOTTO_CERTIFICATI_APPLICAZIONI) delete this.CRUSCOTTO_CERTIFICATI_APPLICAZIONI
        if (!keys.CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB) delete this.CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB
        if (!keys.REPORT_CLIENTE_T4L) delete this.REPORT_CLIENTE_T4L
        if (!keys.DOCUMENTI_ANNULLATI) delete this.DOCUMENTI_ANNULLATI
        if (!keys.GED_GESTIONE_DOCUMENTALE) delete this.GED_GESTIONE_DOCUMENTALE
        if (!keys.DOCUMENTI_DA_GESTIRE) delete this.DOCUMENTI_DA_GESTIRE
        if (!keys.FOLDER) delete this.FOLDER
        if (!keys.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS) delete this.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS
        if (!keys.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY) delete this.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY
        if (!keys.ALLIANZ_PLACEMENT_PLATFORM) delete this.ALLIANZ_PLACEMENT_PLATFORM
        if (!keys.QUALITÀ_PORTAFOGLIO_AUTO) delete this.QUALITÀ_PORTAFOGLIO_AUTO
        if (!keys.APP_CUMULO_TERREMOTI) delete this.APP_CUMULO_TERREMOTI
        if (!keys.NOTE_DI_CONTRATTO) delete this.NOTE_DI_CONTRATTO
        if (!keys.ACOM_GESTIONE_INIZIATIVE) delete this.ACOM_GESTIONE_INIZIATIVE
    }
}


class BurgerMenuSales extends Sales {

    static getLinks(){
        return LinksBurgerMenu
    }

    static getProfiling(tutf, keys) {
        cy.getProfiling(tutf).then(profiling => {
            cy.filterProfile(profiling, 'COMMON_MATRIX_MOTOR_ASSUNTIVO').then(profiled => { keys.PREVENTIVO_MOTOR = profiled })
            cy.filterProfile(profiling, 'COMMON_MATRIX_MOTOR_ASSUNTIVO').then(profiled => { keys.FLOTTE_E_CONVENZIONI = profiled })
            cy.filterProfile(profiling, 'COMMON_MINIFLOTTE').then(profiled => { keys.MINIFLOTTE = profiled })
            cy.filterProfile(profiling, 'COMMON_TOOL_TRATTATIVE').then(profiled => { keys.TRATTATIVE_AUTO_CORPORATE = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRA').then(profiled => { keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRA_BMP').then(profiled => { keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRACASA2022').then(profiled => { keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022 = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRAS').then(profiled => { keys.ALLIANZ_ULTRA_SALUTE = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRAPMI').then(profiled => { keys.ALLIANZ_ULTRA_IMPRESA = profiled })
            cy.filterProfile(profiling, 'COMMON_ALLIANZ1_BUSINESS').then(profiled => { keys.ALLIANZ1_BUSINESS = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRA').then(profiled => { keys.FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRAS_OLDPROD').then(profiled => { keys.FASTQUOTE_UNIVERSO_PERSONA = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRAS_OLDPROD').then(profiled => { keys.FASTQUOTE_UNIVERSO_SALUTE = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRAS_OLDPROD').then(profiled => { keys.FASTQUOTE_UNIVERSO_PERSONA_MALATTIE_GRAVI = profiled })
            cy.filterProfile(profiling, 'COMMON_FASTQUOTE_IMPRESA_SICURA').then(profiled => { keys.FASTQUOTE_IMPRESA_E_ALBERGO = profiled })
            cy.filterProfile(profiling, 'VITA_EMISSIONE_LEAN').then(profiled => { keys.ALLIANZ1_PREMORIENZA = profiled })
            cy.filterProfile(profiling, 'VITA_PREVENTIVAZIONE_ANONIMA').then(profiled => { keys.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI = profiled })
            cy.filterProfile(profiling, 'RV_GARE').then(profiled => { keys.GESTIONE_RICHIESTE_PER_PA = profiled })
            cy.filterProfile(profiling, 'COMMON_SFERA_MATRIX').then(profiled => { keys.SFERA = profiled })
            cy.filterProfile(profiling, 'COMMON_GESTIONE_SCADENZE').then(profiled => { keys.NUOVO_SFERA = profiled })
            cy.filterProfile(profiling, 'RUOLO_CAMPAIGN').then(profiled => { keys.CAMPAGNE_COMMERCIALI = profiled })
            cy.filterProfile(profiling, 'COMMON_OFFERTA_PREVENTIVI').then(profiled => { keys.RECUPERO_PREVENTIVI_E_QUOTAZIONI = profiled })
            cy.filterProfile(profiling, 'COMMON_GESTIONE_DOCUMENTI_SOSPESI').then(profiled => { keys.DOCUMENTI_DA_FIRMARE = profiled })
            cy.filterProfile(profiling, 'COMMON_MOKA_AGENZIA').then(profiled => { keys.GESTIONE_ATTIVITA_IN_SCADENZA = profiled })
            cy.filterProfile(profiling, 'COMMON_GESTIONE_MANUT_PORTAF_RV_MID_CO').then(profiled => { keys.MANUTENZIONE_PORTAFOGLIO_RV_MIDCO = profiled })
            cy.filterProfile(profiling, 'VITA_CORPORATE').then(profiled => { keys.VITA_CORPORATE = profiled })
            cy.filterProfile(profiling, 'COMMON_GESTIONE_MONITORAGGIO_PROPOSTE').then(profiled => { keys.MONITORAGGIO_POLIZZE_PROPOSTE = profiled })
            cy.filterProfile(profiling, 'COMMON_CERTIFICAZIONI_FISCALI').then(profiled => { keys.CERTIFICAZIONE_FISCALE = profiled })
            cy.filterProfile(profiling, 'COMMON_RISANAMENTO').then(profiled => { keys.MANUTENZIONE_PORTAFOGLIO_AUTO = profiled })
            cy.filterProfile(profiling, 'COMMON_CERTIFICATI_ONLINE').then(profiled => { keys.CRUSCOTTO_CERTIFICATI_APPLICAZIONI = profiled })
            cy.filterProfile(profiling, 'COMMON_CERTIFICATI_ONLINE').then(profiled => { keys.CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB = profiled })
            cy.filterProfile(profiling, 'PO_PULSANTE_AGL').then(profiled => { keys.REPORT_CLIENTE_T4L = profiled })
            cy.filterProfile(profiling, 'COMMON_DANNI_DOCUMENTI_ANNULLATI').then(profiled => { keys.DOCUMENTI_ANNULLATI = profiled })
            cy.filterProfile(profiling, 'COMMON_GED').then(profiled => { keys.GED_GESTIONE_DOCUMENTALE = profiled })
            cy.filterProfile(profiling, 'COMMON_GESTIONE_DOCUMENTALE').then(profiled => { keys.DOCUMENTI_DA_GESTIRE = profiled })
            cy.filterProfile(profiling, 'COMMON_SERVIZI_FOLDERDA').then(profiled => { keys.FOLDER = profiled })
            cy.filterProfile(profiling, 'PO_PULSANTE_AGA').then(profiled => { keys.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS = profiled })
            cy.filterProfile(profiling, 'PO_PULSANTE_AGA').then(profiled => { keys.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY = profiled })
            cy.filterProfile(profiling, 'PO_PULSANTE_APP').then(profiled => { keys.ALLIANZ_PLACEMENT_PLATFORM = profiled })
            cy.filterProfile(profiling, 'COMMON_MONITOR_QUALITA_DATI').then(profiled => { keys.QUALITÀ_PORTAFOGLIO_AUTO = profiled })
            // cy.filterProfile(profiling, 'COMMON_GESTIONE_APP_CUMULI_PRODOTTO_TERREMOTO').then(profiled => { keys.APP_CUMULO_TERREMOTI = profiled })
            cy.filterProfile(profiling, 'PO_CLIENTE_SCHEDA_CLIENTE').then(profiled => { keys.NOTE_DI_CONTRATTO = profiled })
            cy.filterProfile(profiling, 'COMMON_CLIENTE_ACOM').then(profiled => { keys.ACOM_GESTIONE_INIZIATIVE = profiled })
            cy.filterProfile(profiling, 'COMMON_SAFE_DRIVE').then(profiled => { keys.SAFE_DRIVE_AUTOVETTURE = profiled })

        })
    }

    static clickBurgerMenu() {
        cy.get('lib-burger-icon').click({ force: true })
    }

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkExistLinks(keys) {

        cy.get('lib-burger-icon').click({ force: true })
        LinksBurgerMenu.deleteKey(keys)
        const linksBurger = Object.values(LinksBurgerMenu)
        cy.get('nx-expansion-panel').find('a').each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i].trim());
        })

        cy.screenshot('Verifica Links Sales', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     * @param {boolean} clickBurgerMenu - default settato a true, altrimenti non clicca l'icona burgerMenu
     */
    static clickLink(page, clickBurgerMenu = true) {

        if (clickBurgerMenu)
            cy.get('lib-burger-icon').click({ force: true })
        if (page === LinksBurgerMenu.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY ||
            page === LinksBurgerMenu.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS) {
            this.checkPage(page)
        } else {
            let pageRegex = new RegExp("\^" + page + "\$")
            cy.contains(pageRegex, { timeout: 5000 }).click()
            this.checkPage(page)
        }
    }

    /**
     * Verifica atterraggio alla pagina
     * @param {string} page - Nome della pagina 
     */
    static checkPage(page) {
        switch (page) {
            case LinksBurgerMenu.PREVENTIVO_MOTOR:
                cy.intercept({
                    method: 'POST',
                    url: '**/assuntivomotor/**'
                }).as('getMotor');
                Common.canaleFromPopup()
                cy.wait('@getMotor', { timeout: 50000 });
                getIFrame().find('button:contains("Calcola"):visible', { timeout: 20000 })
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.SAFE_DRIVE_AUTOVETTURE:
                cy.intercept({
                    method: 'POST',
                    url: '**/assuntivomotor/**'
                }).as('getMotor');
                Common.canaleFromPopup()
                cy.wait('@getMotor', { timeout: 50000 });
                getIFrame().find('button:contains("Calcola"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.FLOTTE_E_CONVENZIONI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.MINIFLOTTE:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Nuova Trattativa"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.TRATTATIVE_AUTO_CORPORATE:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Nuova Trattativa"):visible')
                getIFrame().find('span:contains("Guida"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_CASA_E_PATRIMONIO:
                Common.canaleFromPopup()
                getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) ? './assets/img/allianz-logo-casa.png' : './assets/img/aviva-logo-cp.png')
                getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022:
                Common.canaleFromPopup()
                cy.wait(15000)
                getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible', { timeout: 10000 })
                getIFrame().find('img[alt="immagine_attivita"]').should('have.attr', 'src', './assets/img/tipo_edificio/appartamento.svg')
                cy.screenshot('Verifica aggancio' + LinksBurgerMenu.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022, { clip: { x: 0, y: 0, width: 1920, height: 1200 } }, { overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP:
                Common.canaleFromPopup()
                cy.wait(8000)
                getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_SALUTE:
                Common.canaleFromPopup()
                getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) ? './assets/img/allianz-logo-salute.png' : './assets/img/aviva-logo-salute.png')
                getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_IMPRESA:
                Common.canaleFromPopup()
                getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', './assets/img/logo/impresa.svg')
                getIFrame().find('ultra-fast-quote-impresa-form').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ1_BUSINESS:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE:
                Common.canaleFromPopup()
                getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.FASTQUOTE_IMPRESA_E_ALBERGO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.FASTQUOTE_IMPRESA_E_ALBERGO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ1_PREMORIENZA:
                cy.intercept({
                    method: 'POST',
                    url: '**/sales/**'
                }).as('getSalesPremo');
                // cy.wait(5000)
                Common.canaleFromPopup()
                cy.wait('@getSalesPremo', { timeout: 40000 });
                cy.wait(30000)
                cy.getIFrame()
                cy.get('iframe').should('be.visible').within(() => {
                    getIFrame().should('be.visible')
                    getIFrame().find('input[value="Home"]').should('be.visible')
                })
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI:
                cy.intercept({
                    method: 'GET',
                    url: '**/ImagesArch/**'
                }).as('getImage');
                Common.canaleFromPopup()
                cy.wait('@getImage', { timeout: 60000 });
                // cy.wait(25000)
                getIFrame().find('input[value="Home"]').invoke('attr', 'value').should('equal', 'Home')
                getIFrame().find('input[value="Indietro"]').invoke('attr', 'value').should('equal', 'Indietro')
                getIFrame().find('input[value="Avanti"]').invoke('attr', 'value').should('equal', 'Avanti')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.GESTIONE_RICHIESTE_PER_PA:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Visualizza"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.NUOVO_SFERA:
                Common.canaleFromPopup()
                cy.get('sfera-quietanzamento-page').find('a:contains("Quietanzamento")').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.SFERA:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Applica filtri"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CAMPAGNE_COMMERCIALI:
                Common.canaleFromPopup()
                cy.url().should('include', '/campaign-manager')
                cy.get('lib-campaign-monitoring').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.RECUPERO_PREVENTIVI_E_QUOTAZIONI:
                cy.intercept({
                    method: 'POST',
                    url: /InizializzaApplicazione/
                }).as('inizializzaApplicazione');
                Common.canaleFromPopup()
                cy.wait('@inizializzaApplicazione', { timeout: 30000 });
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.DOCUMENTI_DA_FIRMARE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.GESTIONE_ATTIVITA_IN_SCADENZA:
                cy.intercept({
                    method: 'POST',
                    url: '**/dacommerciale/**'
                }).as('getDacommerciale');

                cy.intercept({
                    method: 'POST',
                    url: /RicercaDatiAnagraficiRipetitore/
                }).as('ricercaDatiAnagraficiRipetitore');

                Common.canaleFromPopup()
                cy.wait('@getDacommerciale', { timeout: 60000 });
                cy.wait('@ricercaDatiAnagraficiRipetitore', { timeout: 60000 });
                getIFrame().find('#contentPane button:contains("Estrai Dettaglio"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.MANUTENZIONE_PORTAFOGLIO_RV_MIDCO:
                cy.intercept({
                    method: '+(GET|POST)',
                    url: '**/Danni/**'
                }).as('Danni');

                Common.canaleFromPopup()
                cy.wait('@Danni', { timeout: 40000 })
                cy.wait(15000)
                getIFrame().find('#ctl00_MasterBody_btnApplicaFiltri').should('be.visible').invoke('attr', 'value').should('equal', 'Applica Filtri')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.VITA_CORPORATE:
                cy.intercept({
                    method: 'POST',
                    url: '**/SUV/**'
                }).as('getSUV');
                Common.canaleFromPopup()
                cy.wait('@getSUV', { timeout: 40000 });
                cy.wait(10000)
                getIFrame().find('.k-link:contains("Consultazione Collettive e Versamenti"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.MONITORAGGIO_POLIZZE_PROPOSTE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CERTIFICAZIONE_FISCALE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.MANUTENZIONE_PORTAFOGLIO_AUTO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Carica Polizze"]').invoke('attr', 'value').should('equal', 'Carica Polizze')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CRUSCOTTO_CERTIFICATI_APPLICAZIONI:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.REPORT_CLIENTE_T4L:
                cy.intercept({
                    method: 'POST',
                    url: '**/Vita/**'
                }).as('vita');
                Common.canaleFromPopup()
                cy.wait('@vita', { timeout: 30000 });
                cy.wait(6000)
                getIFrame().find('input[value="Ricerca"]:visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.DOCUMENTI_ANNULLATI:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Storico polizze e quietanze distrutte"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.GED_GESTIONE_DOCUMENTALE:
                cy.window().then(win => {
                    cy.stub(win, 'open').callsFake((url) => {
                        return win.open.wrappedMethod.call(win, url, '_self');
                    }).as('Open');
                })
                Common.canaleFromPopup()
                cy.get('@Open')
                cy.wait(5000)
                cy.contains('button', 'Accedi').should('be.visible')
                // cy.get('h3').should('be.visible').and('contain.text','Leggi barcode')
                cy.go('back')
                break;
            case LinksBurgerMenu.DOCUMENTI_DA_GESTIRE:
                cy.wait(5000)
                Common.canaleFromPopup()
                getIFrame().find('input[value="Ricerca Attività"]').invoke('attr', 'value').should('equal', 'Ricerca Attività')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.FOLDER:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS:
                // if (Cypress.isBrowser('firefox')) {
                //     cy.get('lib-side-menu').find('a:contains("Allianz global assistance - OAZIS")')
                //         .should('have.attr', 'href', 'http://oazis.allianz-assistance.it')
                //     this.clickBurgerMenu()
                // } else {
                    cy.contains('Allianz global assistance - OAZIS').invoke('removeAttr', 'target').click()
                    cy.url().should('eq', 'https://oazis.allianz-assistance.it/dynamic/home/index')
                    cy.get('#logo-oazis-header').should('be.visible')
                // }
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true }).wait(3000)
                cy.go('back').wait(3000)
                break;
            case LinksBurgerMenu.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY:
                // if (Cypress.isBrowser('firefox')) {
                //     cy.get('lib-side-menu').find('a:contains("Allianz global assistance - GLOBY")')
                //         .should('have.attr', 'href', 'https://allianztravel-globy.it/onePortalUI/#/login')
                //     this.clickBurgerMenu()
                // } else {
                    cy.contains('Allianz global assistance - GLOBY').invoke('removeAttr', 'target').click()
                    cy.url().should('eq', 'https://allianztravel-globy.it/onePortalUI/#/login')
                    cy.get('#box-form').should('be.visible')
                // }
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true }).wait(3000)
                cy.go('back').wait(3000)
                break
            case LinksBurgerMenu.ALLIANZ_PLACEMENT_PLATFORM:
                cy.window().then(win => {
                    cy.stub(win, 'open').callsFake((url) => {
                        return win.open.wrappedMethod.call(win, url, '_self');
                    }).as('Open');
                })
                Common.canaleFromPopup()
                cy.get('@Open')
                cy.get('#abstract').should('be.visible')
                cy.url().should('include', '/DATrxCont/htmlFragment/matrix_app.html')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                cy.go('back')
                break;
            case LinksBurgerMenu.QUALITÀ_PORTAFOGLIO_AUTO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.NOTE_DI_CONTRATTO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ACOM_GESTIONE_INIZIATIVE:
                cy.window().then(win => {
                    cy.stub(win, 'open').callsFake((url) => {
                        return win.open.wrappedMethod.call(win, url, '_self');
                    }).as('Open');
                })
                Common.canaleFromPopup()
                cy.get('@Open')
                cy.get('#AreaUtile').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                cy.go('back')
                break;
        }
    }
}

export default BurgerMenuSales