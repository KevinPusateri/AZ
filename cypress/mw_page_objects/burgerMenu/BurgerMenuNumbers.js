/// <reference types="Cypress" />
import Common from "../common/Common";
import Numbers from "../navigation/Numbers";
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const interceptGetAgenziePDF = () => {
    cy.intercept({
        method: 'GET',
        url: '**/dacommerciale/**'
    }).as('getDacommercialeGET');
    cy.intercept({
        method: 'POST',
        url: '**/dacommerciale/**'
    }).as('getDacommercialePOST');
}

const interceptGetPentahoDA = () => {
    cy.intercept({
        method: 'GET',
        url: '**/pentahoDA/**'
    }).as('pentahoDA');
    cy.intercept({
        method: 'GET',
        url: '**/pentahoDama/**'
    }).as('pentahoDama');
}

const interceptSaveOperation = () => {
    cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName.includes('saveOperationAccount')) {
            req.alias = 'gqlsaveoperation'
        }
    });
}

const LinksBurgerMenu = {
    HOME_NUMBERS: 'Home Numbers',
    MONITORAGGIO_FONTI: 'Monitoraggio Fonti',
    MONITORAGGIO_CARICO: 'Monitoraggio Carico',
    MONITORAGGIO_CARICO_FONTE: 'Monitoraggio Carico per Fonte',
    X_ADVISOR: 'X - Advisor',
    INCENTIVAZIONE: 'Incentivazione',
    INCENTIVAZIONE_RECRUITING: 'Incentivazione Recruiting',
    ANDAMENTI_TECNICI: 'Andamenti Tecnici',
    ESTRAZIONI_AVANZATE: 'Estrazioni Avanzate',
    SCARICO_DATI: 'Scarico Dati',
    INDICI_DIGITALI: 'Indici Digitali',
    NEW_BUSINESS_DANNI: 'New Business Danni',
    NEW_BUSINESS_ULTRA_CASA_PATRIMONIO_2022: 'New Business Ultra Casa e Patrimonio 2022',
    NEW_BUSINESS_ULTRA_CASA_PATRIMONIO: 'New Business Ultra Casa e Patrimonio',
    NEW_BUSINESS_ULTRA_SALUTE: 'New Business Ultra Salute',
    NEW_BUSINESS_ULTRA_IMPRESA: 'New Business Ultra Impresa',
    NEW_BUSINESS_VITA: 'New Business Vita',
    NEW_BUSINESS_ALLIANZ1: 'New Business Allianz1',
    MONITORAGGIO_PTF_DANNI: 'Monitoraggio PTF Danni',
    MONITORAGGIO_RISERVE_VITA: 'Monitoraggio Riserve Vita',
    RETENTION_MOTOR: 'Retention Motor',
    RETENTION_RAMI_VARI: 'Retention Rami Vari',
    MONITORAGGIO_ANDAMENTO_PREMI: 'Monitoraggio Andamento Premi',
    MONITORAGGIO_RICAVI_AGENZIA: 'Monitoraggio Ricavi d\'Agenzia',
    CAPITALE_VITA_SCADENZA: 'Capitale Vita Scadenza',
    deleteKey: function (keys) {
        if (!keys.MONITORAGGIO_FONTI) delete this.MONITORAGGIO_FONTI
        if (!keys.MONITORAGGIO_CARICO) delete this.MONITORAGGIO_CARICO
        if (!keys.MONITORAGGIO_CARICO_FONTE) delete this.MONITORAGGIO_CARICO_FONTE
        if (!keys.X_ADVISOR) delete this.X_ADVISOR
        if (!keys.INCENTIVAZIONE) delete this.INCENTIVAZIONE
        if (!keys.INCENTIVAZIONE_RECRUITING) delete this.INCENTIVAZIONE_RECRUITING
        if (!keys.ANDAMENTI_TECNICI) delete this.ANDAMENTI_TECNICI
        if (!keys.ESTRAZIONI_AVANZATE) delete this.ESTRAZIONI_AVANZATE
        if (!keys.SCARICO_DATI) delete this.SCARICO_DATI
        if (!keys.INDICI_DIGITALI) delete this.INDICI_DIGITALI
        if (!keys.NEW_BUSINESS_DANNI) delete this.NEW_BUSINESS_DANNI
        if (!keys.NEW_BUSINESS_ULTRA_IMPRESA) delete this.NEW_BUSINESS_ULTRA_IMPRESA
        if (!keys.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO_2022) delete this.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO_2022
        if (!keys.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO) delete this.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO
        if (!keys.NEW_BUSINESS_ULTRA_SALUTE) delete this.NEW_BUSINESS_ULTRA_SALUTE
        if (!keys.NEW_BUSINESS_VITA) delete this.NEW_BUSINESS_VITA
        if (!keys.NEW_BUSINESS_ALLIANZ1) delete this.NEW_BUSINESS_ALLIANZ1
        if (!keys.MONITORAGGIO_PTF_DANNI) delete this.MONITORAGGIO_PTF_DANNI
        if (!keys.MONITORAGGIO_RISERVE_VITA) delete this.MONITORAGGIO_RISERVE_VITA
        if (!keys.RETENTION_MOTOR) delete this.RETENTION_MOTOR
        if (!keys.RETENTION_RAMI_VARI) delete this.RETENTION_RAMI_VARI
        if (!keys.MONITORAGGIO_ANDAMENTO_PREMI) delete this.MONITORAGGIO_ANDAMENTO_PREMI
        if (!keys.MONITORAGGIO_RICAVI_AGENZIA) delete this.MONITORAGGIO_RICAVI_AGENZIA
        if (!keys.CAPITALE_VITA_SCADENZA) delete this.CAPITALE_VITA_SCADENZA
    }
}


class BurgerMenuNumbers extends Numbers {

    /**
     * Otteniamo i link in base alle chiavi di profilzazioni settate
     * @param {string} tutf - utenza impersonificata 
     * @param {Object} keys  - Chiavi di profilazione 
     */
    static getProfiling(tutf, keys) {
        cy.getProfiling(tutf).then(profiling => {
            cy.filterProfile(profiling, 'COMMON_MONITOR_FONTI').then(profiled => { keys.MONITORAGGIO_FONTI = profiled })
            cy.filterProfile(profiling, 'SCAD_MONITORA_CARICO').then(profiled => { keys.MONITORAGGIO_CARICO = profiled })
            cy.filterProfile(profiling, 'SCAD_MONITORA_CARICO_FONTE').then(profiled => { keys.MONITORAGGIO_CARICO_FONTE = profiled })
            cy.filterProfile(profiling, 'COMMON_CRYSTAL').then(profiled => { keys.X_ADVISOR = profiled })

            if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
                cy.filterProfile(profiling, 'COMMON_REPORTING_INCENTIVAZIONE_AVIVA').then(profiled => { keys.INCENTIVAZIONE = profiled })
            else
                cy.filterProfile(profiling, 'COMMON_REPORTING_INCENTIVAZIONE').then(profiled => { keys.INCENTIVAZIONE = profiled })

            cy.filterProfile(profiling, 'COMMON_REPORTING_INCENTIVAZIONE_RECRUITING').then(profiled => { keys.INCENTIVAZIONE_RECRUITING = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_ANDAMENTI_TECNICI').then(profiled => { keys.ANDAMENTI_TECNICI = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_ESTRAZIONI_AVANZATE').then(profiled => { keys.ESTRAZIONI_AVANZATE = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_SCARICO_AGENZIA').then(profiled => { keys.SCARICO_DATI = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_INDICEDIGITALE').then(profiled => { keys.INDICI_DIGITALI = profiled })
            cy.filterProfile(profiling, 'REPORTING_NB_DANNI').then(profiled => { keys.NEW_BUSINESS_DANNI = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRACASA2022').then(profiled => { keys.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO_2022 = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRA').then(profiled => { keys.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRAPMI').then(profiled => { keys.NEW_BUSINESS_ULTRA_IMPRESA = profiled })
            cy.filterProfile(profiling, 'REPORTING_NB_VITA').then(profiled => { keys.NEW_BUSINESS_VITA = profiled })
            cy.filterProfile(profiling, 'REPORTING_NB_A1').then(profiled => { keys.NEW_BUSINESS_ALLIANZ1 = profiled })
            cy.filterProfile(profiling, 'REPORTING_MONITOR_PTF_DANNI').then(profiled => { keys.MONITORAGGIO_PTF_DANNI = profiled })
            cy.filterProfile(profiling, 'REPORTING_MONITOR_PTF_VITA').then(profiled => { keys.MONITORAGGIO_RISERVE_VITA = profiled })
            cy.filterProfile(profiling, 'REPORTING_RETENTION_MOTOR').then(profiled => { keys.RETENTION_MOTOR = profiled })
            cy.filterProfile(profiling, 'REPORTING_RETENTION_RV').then(profiled => { keys.RETENTION_RAMI_VARI = profiled })
            cy.filterProfile(profiling, 'REPORTING_INCASSI_AGENZIA').then(profiled => { keys.MONITORAGGIO_ANDAMENTO_PREMI = profiled })
            cy.filterProfile(profiling, 'REPORTING_RICAVI_AGENZIA').then(profiled => { keys.MONITORAGGIO_RICAVI_AGENZIA = profiled })
            cy.filterProfile(profiling, 'REPORTING_CAPITALI_VITA_SCAD').then(profiled => { keys.CAPITALE_VITA_SCADENZA = profiled })
        })
    }



    /**
     * Torna indetro su Numbers
     * @param {string} checkUrl - Verifica url della pagina di atterraggio
     */
    static backToNumbers() {
        super.backToNumbers('business-lines')
    }

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkExistLinks(keys) {
        cy.get('lib-burger-icon').click()

        LinksBurgerMenu.deleteKey(keys)
        const linksBurger = Object.values(LinksBurgerMenu)
        cy.get('lib-side-menu-link').find('a').each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
        cy.screenshot('Verifica Links Numbers', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLink(page) {
        cy.get('lib-burger-icon').click({ force: true })
        if (page === LinksBurgerMenu.ESTRAZIONI_AVANZATE)
            interceptGetPentahoDA()
        else {
            interceptSaveOperation()
            interceptGetAgenziePDF()
        }

        if (page === LinksBurgerMenu.X_ADVISOR)
            cy.contains('X - Advisor').invoke('removeAttr', 'target').click()
        else
            cy.contains(page, { timeout: 5000 }).click()

        Common.canaleFromPopup()
        this.checkPage(page)
    }

    /**
     * Verifica atterraggio alla pagina
     * @param {string} page - Nome della pagina 
     */
    static checkPage(page) {
        switch (page) {
            case LinksBurgerMenu.MONITORAGGIO_FONTI:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait('@getDacommercialePOST', { timeout: 150000 });
                getIFrame().find('a:contains("Filtra")')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.MONITORAGGIO_CARICO:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait(15000)
                getIFrame().find('#btnFonti').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.MONITORAGGIO_CARICO_FONTE:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait(15000)
                getIFrame().find('#contentPane:contains("Apri filtri"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.X_ADVISOR:
                cy.contains('Advisor', { timeout: 20000 })
                cy.contains('Dashboard', { timeout: 20000 })
                cy.get('textarea').should('be.visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                Common.visitUrlOnEnv()
                break;
            case LinksBurgerMenu.INCENTIVAZIONE:
                cy.wait('@getDacommercialeGET', { timeout: 150000 })
                cy.wait(10000)
                getIFrame().find('h1').should('contain.text', (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Incentivazioni Allianz Viva' : 'Cruscotto Incentivazione')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.INCENTIVAZIONE_RECRUITING:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                if (!Cypress.env('monoUtenza'))
                    getIFrame().find('[class="menu-padre"]:contains("Report"):visible')
                else
                    getIFrame().find('#likelyCauses').should('be.visible')
                        .and('contain.text', 'Non esistono piani di incentivazioni recruiting per l\'agenzia.')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ANDAMENTI_TECNICI:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                getIFrame().find('button:contains("Fonti produttive"):visible')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.ESTRAZIONI_AVANZATE:
                cy.wait('@pentahoDA', { timeout: 40000 });
                cy.wait('@pentahoDama', { timeout: 40000 });
                getIFrame().find('a:contains("Nuovo Report"):visible')
                break;
            case LinksBurgerMenu.SCARICO_DATI:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait('@gqlsaveoperation', { timeout: 40000 });
                getIFrame().find('form:contains("Esporta tracciato")')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.INDICI_DIGITALI:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait('@gqlsaveoperation', { timeout: 40000 });
                getIFrame().find('#toggleFilters:contains("Apri filtri")')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.NEW_BUSINESS_DANNI:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait('@gqlsaveoperation', { timeout: 40000 });
                getIFrame().find('#ricerca_cliente').should('be.visible').and('contain.text', 'Filtra')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO:
            case LinksBurgerMenu.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO_2022:
            case LinksBurgerMenu.NEW_BUSINESS_ULTRA_SALUTE:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait('@gqlsaveoperation', { timeout: 40000 });
                getIFrame().find('#submit-Mon_PTF').should('be.visible').and('contain.text', 'Filtra')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.NEW_BUSINESS_VITA:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait('@gqlsaveoperation', { timeout: 40000 });
                cy.wait(15000)
                getIFrame().find('[class="page-container"]').should('be.visible').and('contain.text', 'Filtra')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
            case LinksBurgerMenu.NEW_BUSINESS_ALLIANZ1:
            case LinksBurgerMenu.MONITORAGGIO_RISERVE_VITA:
            case LinksBurgerMenu.MONITORAGGIO_PTF_DANNI:
            case LinksBurgerMenu.RETENTION_MOTOR:
            case LinksBurgerMenu.RETENTION_RAMI_VARI:
            case LinksBurgerMenu.MONITORAGGIO_ANDAMENTO_PREMI:
            case LinksBurgerMenu.MONITORAGGIO_RICAVI_AGENZIA:
            case LinksBurgerMenu.CAPITALE_VITA_SCADENZA:
            case LinksBurgerMenu.NEW_BUSINESS_ULTRA_IMPRESA:
                cy.wait('@getDacommercialeGET', { timeout: 150000 });
                cy.wait('@getDacommercialePOST', { timeout: 150000 });
                cy.wait('@gqlsaveoperation', { timeout: 40000 });
                getIFrame().find('[class="page-container"]').should('be.visible').and('contain.text', 'Filtra')
                cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                break;
        }
    }
}

export default BurgerMenuNumbers