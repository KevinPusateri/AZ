/// <reference types="Cypress" />
import Common from "../common/Common"

//#region Iframe
const getIFrame = () => {

    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameCampagne = () => {

    cy.get('iframe[class="iframe-container"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-container"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion

const LinksRapidi = {
    NUOVO_SFERA: 'Nuovo Sfera',
    SFERA: 'Sfera',
    CAMPAGNE_COMMERCIALI: 'Campagne Commerciali',
    RECUPERO_PREVENTIVI_E_QUOTAZIONI: 'Recupero preventivi e quotazioni',
    MONITORAGGIO_POLIZZE_PROPOSTE: 'Monitoraggio Polizze Proposte',
    GED_GESTIONE_DOCUMENTALE: 'GED – Gestione Documentale',
    deleteKey: function (keys) {
        if (!keys.NUOVO_SFERA) delete this.NUOVO_SFERA
        if (!keys.SFERA || Cypress.env('isAviva')) delete this.SFERA
        if (!keys.CAMPAGNE_COMMERCIALI || Cypress.env('isAviva')) delete this.CAMPAGNE_COMMERCIALI
        if (!keys.RECUPERO_PREVENTIVI_E_QUOTAZIONI) delete this.RECUPERO_PREVENTIVI_E_QUOTAZIONI
        if (!keys.MONITORAGGIO_POLIZZE_PROPOSTE) delete this.MONITORAGGIO_POLIZZE_PROPOSTE
        if (!keys.GED_GESTIONE_DOCUMENTALE || Cypress.env('isAviva')) delete this.GED_GESTIONE_DOCUMENTALE
    }
}

const LinksOnEmettiPolizza = {
    PREVENTIVO_MOTOR: 'Preventivo Motor',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: Cypress.env('isAviva') ? 'Ultra Casa e Patrimonio' : 'Allianz Ultra Casa e Patrimonio',
    ALLIANZ_ULTRA_SALUTE: Cypress.env('isAviva') ? 'Ultra Salute' : 'Allianz Ultra Salute',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: 'Allianz Ultra Casa e Patrimonio BMP',
    ALLIANZ_ULTRA_IMPRESA: Cypress.env('isAviva') ? 'Ultra Impresa' : 'Allianz Ultra Impresa',
    ALLIANZ1_BUSINESS: 'Allianz1 Business',
    FASTQUOTE_IMPRESA_E_ALBERGO: 'FastQuote Impresa e Albergo',
    FLOTTE_E_CONVENZIONI: 'Flotte e Convenzioni',
    PREVENTIVO_ANONIMO_VITA_INDIVIDUALI: 'Preventivo anonimo Vita Individuali',
    MINIFLOTTE: 'MiniFlotte',
    TRATTATIVE_AUTO_CORPORATE: 'Trattative Auto Corporate',
    deleteKey: function (keys) {
        if (!keys.PreventivoMotorEnabled) delete this.PREVENTIVO_MOTOR
        if (!keys.UltraUltraCasaPatrimonioEnabled) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO
        if (!keys.UltraSaluteEnabled) delete this.ALLIANZ_ULTRA_SALUTE
        if (!keys.BMPenabled) delete this.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP
        if (!keys.UltraImpresaEnabled) delete this.ALLIANZ_ULTRA_IMPRESA
        if (!keys.Allianz1BusinessEnabled) delete this.ALLIANZ1_BUSINESS
        if (!keys.FasquoteImpresaAlbergoEnabled) delete this.FASTQUOTE_IMPRESA_E_ALBERGO
        if (!keys.FlotteConvenzioniEnabled) delete this.FLOTTE_E_CONVENZIONI
        if (!keys.PreventivoAnonimoVitaenabled) delete this.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI
        if (!keys.MiniflotteEnabled) delete this.MINIFLOTTE
        if (!keys.TrattativeAutoCorporateEnabled && !Cypress.env('isAviva')) delete this.TRATTATIVE_AUTO_CORPORATE
    }
}
class Sales {

    /**
     * click Refresh del Quietanzamento
     */
    static refresh() {
        cy.get('button[aria-label="refresh"]').should('be.visible').click()
        cy.get('app-receipt-manager-cluster').should('be.visible')
        cy.get('app-receipt-manager-footer').should('be.visible').find('button:contains("Estrai")').should('be.visible')
    }

    /**
     * click Filtro del Quietanzamento
     */
    static filtro() {
        cy.get('button[aria-label="filter"]').should('be.visible').click()
        cy.get('nx-modal-container').should('be.visible')
    }

    /**
     * Click checkBox Cluster 
     * @param {string} cluster 
     */
    static clickCluster(cluster) {
        cy.contains(cluster).parents('app-receipt-manager-cluster').within(() => {
            cy.get('nx-checkbox').click()
        })

        // Verifico che il Cluster sia stato selezionato
        cy.contains(cluster)
            .parents('app-receipt-manager-cluster')
            .children()
            .should('have.class', 'app-receipt-manager-cluster selected')
    }

    /**
     * Torna indietro su Sales
     */
    static backToSales() {
        cy.get('a').contains('Sales').scrollIntoView().click({ force: true })
        cy.url().should('eq', Common.getBaseUrl() + 'sales/')
    }

    /**
     * Verifica se i "pz" sono presenti 
     */
    static checkExistPezzi() {
        cy.get('app-lob-link').find('div[class="app-lob-link ng-star-inserted"]:visible').each((lob) => {
            cy.wrap(lob).find('span:contains("' + lob.text() + '")').click()
            cy.get('app-receipt-header').find('span:contains("Pezzi")').click()
            cy.get('app-receipt-header').find('span[class="value ng-star-inserted"]').invoke('text').should('not.include', '€')
            cy.get('app-receipt-manager-header-item').invoke('text').should('not.include', '€')
            cy.get('app-receipt-manager-footer').invoke('text').should('not.include', '€')
        })
    }

    /**
     * Verifica se i "pz" sono presenti 
     */
    static checkExistPremi() {
        cy.get('app-lob-link').find('div[class="app-lob-link ng-star-inserted"]:visible').each((lob) => {
            cy.wrap(lob).find('span:contains("' + lob.text() + '")').click()
            cy.get('app-receipt-header').find('span:contains("Pezzi")').click()
            cy.get('app-receipt-header').find('span[class="value ng-star-inserted"]').invoke('text').should('not.include', '€')
            cy.get('app-receipt-manager-header-item').invoke('text').should('not.include', '€')
            cy.get('app-receipt-manager-footer').invoke('text').should('not.include', '€')
        })
    }

    /**
     * Verifica che i link dei collegamenti rapidi siano presenti nella pagina
     */
    static checkExistLinksCollegamentiRapidi(keys) {



        LinksRapidi.deleteKey(keys)
        const linksCollegamentiRapidi = Object.values(LinksRapidi)

        cy.get('app-quick-access').find('a').each(($link, i) => {
            expect($link.text().trim()).to.include(linksCollegamentiRapidi[i]);
        })

    }

    /**
     * Click link nella sezione "Collegamenti rapidi"
     * @param {string} page - nome del link
     */
    static clickLinkRapido(page) {
        switch (page) {
            case LinksRapidi.NUOVO_SFERA:
                cy.get('app-quick-access').contains('Nuovo Sfera').click()
                cy.get('sfera-quietanzamento-page').find('a:contains("Quietanzamento")').should('be.visible')
                break;
            case LinksRapidi.SFERA:
                cy.intercept({
                    method: 'POST',
                    url: '**/dacommerciale/**'
                }).as('getDacommerciale');
                cy.get('app-quick-access').find('lib-da-link').contains('Sfera').click()
                Common.canaleFromPopup()
                cy.wait('@getDacommerciale', { requestTimeout: 50000 });
                getIFrame().find('ul > li > span:contains("Quietanzamento"):visible')
                getIFrame().find('ul > li > span:contains("Visione Globale"):visible')
                getIFrame().find('ul > li > span:contains("Portafoglio"):visible')
                getIFrame().find('ul > li > span:contains("Clienti"):visible')
                getIFrame().find('ul > li > span:contains("Uscite Auto"):visible')
                getIFrame().find('ul > li > span:contains("Gestore Attività"):visible')
                getIFrame().find('ul > li > span:contains("Operatività"):visible')
                getIFrame().find('button:contains("Applica filtri"):visible')
                break;
            case LinksRapidi.CAMPAGNE_COMMERCIALI:
                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('campaignAgent')) {
                        req.alias = 'gqlCampaignAgent'
                    }
                })
                cy.get('app-quick-access').contains('Campagne Commerciali').click()
                Common.canaleFromPopup()
                cy.wait('@gqlCampaignAgent', { requestTimeout: 60000 });
                cy.url().should('eq', Common.getBaseUrl() + 'sales/campaign-manager')
                break;
            case LinksRapidi.RECUPERO_PREVENTIVI_E_QUOTAZIONI:
                cy.get('app-quick-access').contains('Recupero preventivi e quotazioni').click()
                Common.canaleFromPopup()
                cy.wait(12000);
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksRapidi.MONITORAGGIO_POLIZZE_PROPOSTE:
                cy.intercept({
                    method: 'POST',
                    url: /InizializzaContratti/
                }).as('inizializzaContratti');
                cy.get('app-quick-access').contains('Monitoraggio Polizze Proposte').click()
                Common.canaleFromPopup()
                cy.wait('@inizializzaContratti', { requestTimeout: 30000 });
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksRapidi.GED_GESTIONE_DOCUMENTALE:
                cy.intercept({
                    method: 'POST',
                    url: /InizializzaContratti/
                }).as('inizializzaContratti');
                cy.get('app-quick-access').contains('Monitoraggio Polizze Proposte').click()
                Common.canaleFromPopup()
                cy.wait('@inizializzaContratti', { requestTimeout: 30000 });
                getIFrame().find('button:contains("Cerca"):visible')
                break;
        }
    }


    /**
     * Verifica link presenti su Emetti Polizza
     */
    static checkLinksOnEmettiPolizza(keys) {
        cy.contains('Emetti polizza').click({ force: true })

        LinksOnEmettiPolizza.deleteKey(keys)
        const linksEmettiPolizza = Object.values(LinksOnEmettiPolizza)

        if (Cypress.env('monoUtenza')) {
            delete LinksOnEmettiPolizza.GESTIONE_RICHIESTE_PER_PA
            const linksEmettiPolizza = Object.values(LinksOnEmettiPolizza)
            cy.get('.card-container').find('lib-da-link').each(($link, i) => {
                expect($link.text().trim()).to.include(linksEmettiPolizza[i]);
            })
        } else// if (Cypress.env('isAviva')) {
            //!DA PROVARE SENZA
            cy.get('.card-container').find('lib-da-link').each(($link, i) => {
                expect($link.text().trim()).to.include(linksEmettiPolizza[i]);
            })
        // } else {
        //     cy.get('.card-container').find('lib-da-link').each(($link, i) => {
        //         expect($link.text().trim()).to.include(linksEmettiPolizza[i]);
        //     })
        // }
    }

    /**
     * Click link nel button "Emetti polizza"
     * @param {string} page - nome del link
     */
    static clickLinkOnEmettiPolizza(page) {
        cy.wait(3000)
        cy.contains('Emetti polizza').click({ force: true })
        cy.get('.card-container').find('lib-da-link').contains(page).click()
        switch (page) {
            case LinksOnEmettiPolizza.PREVENTIVO_MOTOR:
                cy.intercept({
                    method: 'POST',
                    url: '**/assuntivomotor/**'
                }).as('getMotor');
                Common.canaleFromPopup()
                cy.wait('@getMotor', { requestTimeout: 100000 });
                getIFrame().find('button:contains("Calcola"):visible', { timeout: 10000 })
                break;
            case LinksOnEmettiPolizza.ALLIANZ_ULTRA_CASA_E_PATRIMONIO:
                cy.intercept({
                    method: 'GET',
                    url: '**/ultra/**'
                }).as('getUltra');
                Common.canaleFromPopup()
                cy.wait('@getUltra', { requestTimeout: 30000 });
                cy.wait(5000)
                getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', (!Cypress.env('isAviva')) ? './assets/img/allianz-logo-casa.png' : './assets/img/aviva-logo-cp.png')
                getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible', { timeout: 10000 })
                break;
            case LinksOnEmettiPolizza.ALLIANZ_ULTRA_IMPRESA:
                Common.canaleFromPopup()
                getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', './assets/img/logo/impresa.svg')
                getIFrame().find('ultra-fast-quote-impresa-form').should('be.visible')
                break;
            case LinksOnEmettiPolizza.ALLIANZ_ULTRA_SALUTE:
                cy.intercept({
                    method: 'GET',
                    url: '**/ultra/**'
                }).as('getUltra');
                Common.canaleFromPopup()
                cy.wait('@getUltra', { requestTimeout: 50000 });
                cy.wait(5000)
                getIFrame().find('ultra-product-logo').find('img').should('have.attr', 'src', (!Cypress.env('isAviva')) ? './assets/img/allianz-logo-salute.png' : './assets/img/aviva-logo-salute.png')
                getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible', { timeout: 10000 })
                break;
            case LinksOnEmettiPolizza.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP:
                // cy.intercept({
                //     method: 'GET',
                //     url: '/ultra2/**'
                // }).as('getUltra2');
                Common.canaleFromPopup()
                // cy.wait('@getUltra2', { requestTimeout: 30000 });
                cy.wait(15000)
                getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible', { timeout: 10000 })
                break;
            case LinksOnEmettiPolizza.ALLIANZ1_BUSINESS:
                cy.intercept({
                    method: 'POST',
                    url: '**/Danni/**'
                }).as('getDanni');
                Common.canaleFromPopup()
                cy.wait('@getDanni', { requestTimeout: 30000 });
                getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible', { timeout: 10000 })
                break;
            case LinksOnEmettiPolizza.FASTQUOTE_IMPRESA_E_ALBERGO:
                cy.intercept({
                    method: 'GET',
                    url: '**/Auto/**'
                }).as('getAuto');
                Common.canaleFromPopup()
                cy.wait('@getAuto', { requestTimeout: 30000 });
                getIFrame().find('form input[value="Cerca"]', { timeout: 10000 }).invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksOnEmettiPolizza.FLOTTE_E_CONVENZIONI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
                break;
            case LinksOnEmettiPolizza.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI:
                Common.canaleFromPopup()
                cy.wait(20000)
                getIFrame().find('#AZBuilder1_ctl15_cmdIndietro[value="Indietro"]', { timeout: 10000 }).invoke('attr', 'value').should('equal', 'Indietro')

                break;
            case LinksOnEmettiPolizza.MINIFLOTTE:
                cy.intercept({
                    method: 'POST',
                    url: '**/Auto/**'
                }).as('getAuto');
                Common.canaleFromPopup()
                cy.wait('@getAuto', { requestTimeout: 30000 });
                getIFrame().find('span:contains("Nuova Trattativa"):visible', { timeout: 10000 })
                break;
            case LinksOnEmettiPolizza.TRATTATIVE_AUTO_CORPORATE:
                cy.intercept({
                    method: 'POST',
                    url: '**/Auto/**'
                }).as('getAuto');
                Common.canaleFromPopup()
                cy.wait('@getAuto', { requestTimeout: 30000 });
                getIFrame().find('span:contains("Nuova Trattativa"):visible', { timeout: 10000 })
                break;
            case LinksOnEmettiPolizza.GESTIONE_RICHIESTE_PER_PA:
                cy.intercept({
                    method: 'POST',
                    url: /Danni*/
                }).as('getDanni');
                Common.canaleFromPopup()
                cy.wait('@getDanni', { requestTimeout: 40000 });
                getIFrame().find('#main-wrapper input[value="Cerca"]', { timeout: 10000 }).invoke('attr', 'value').should('equal', 'Cerca')
                break;

        }
    }


    /**
     * Click su una delle attività in scadenza dopodichè click Estrai Dettaglio
     */
    static clickEstraiDettaglio() {
        // fino al primo disponibile
        var nextCheckbox = cy.get('app-expiring-card').next().find('nx-checkbox').first()
        nextCheckbox.then(($btn) => {
            var check = true;
            cy.intercept({
                method: 'POST',
                url: /dacommerciale*/
            }).as('getDacommerciale');
            while (check) {
                if (!$btn.hasClass('disabled')) {
                    cy.wrap($btn).click()
                    cy.get('.details-container').find('button:contains("Estrai dettaglio")').click()
                    cy.wait('@getDacommerciale', { requestTimeout: 50000 });
                    getIFrame().find('#contentPane button:contains("Estrai Dettaglio"):visible')
                    check = false
                }
            }
        })
    }

    /**
     * Click su appuntamento e torna indietro
     */
    static clickAppuntamento() {
        cy.get('lib-upcoming-dates').click()
        cy.url().should('eq', Common.getBaseUrl() + 'sales/event-center')
        cy.get('lib-sub-header-right').click()
        cy.url().should('eq', Common.getBaseUrl() + 'sales/')
    }

    /**
     * Click sulla prima immagine news e verifica atterraggio
     */
    static clickNewsImagePrimoComandamento() {
        cy.get('lib-news-image').click();
        Common.canaleFromPopup()
        getIFrame().find('app-header:contains("Primo Piano"):visible')
        getIFrame().find('app-header:contains("Tutte"):visible')
    }


    /**
     * Click sul pannello "Attivita in scadenza" atterraggio su tab Danni
     */
    static clickAttivitaInScadenza() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('countReceipts')) {
                req.alias = 'gqlReceipts'
            }
        })
        cy.get('app-expiring-activities-accordion').contains('Attività in scadenza').click()
        cy.wait('@gqlReceipts', { timeout: 15000 })
    }


    //#region Preventivi e quotazioni
    /**
     * Click sul pannello "Preventivi e quotazioni" atterraggio su tab Danni
     */
    static clickPreventiviQuotazioniOnTabDanni() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
                req.body.variables.filter.tabCallType.includes('DAMAGE')) {
                req.alias = 'gqlDamage'
            }
        })
        cy.get('app-quotations-section').contains('Preventivi e quotazioni').click()
        cy.wait('@gqlDamage')
        cy.get('app-paginated-cards').find('button:contains("Danni")').click().wait(3000)
    }

    /**
     * Click sul pannello "Preventivi e quotazioni" atterraggio su tab Danni
     */
    static clickPreventiviQuotazioniOnTabVita() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
                req.body.variables.filter.tabCallType.includes('LIFE')) {
                req.alias = 'gqlLife'
            }
        })
        cy.get('app-quotations-section').contains('Preventivi e quotazioni').click()
        cy.wait('@gqlLife')
        cy.get('app-paginated-cards').find('button:contains("Vita")').click().wait(3000)
    }

    // Verifica che non sia presente il tab vita 
    // nel pannello "Preventivi e Quotazioni"
    static checkNotExistTabVitaOnPreventiviQuot() {
        cy.get('app-quotations-section').contains('Preventivi e quotazioni').click()
        cy.get('app-quotations-section').find('nx-tab-header:visible').should('not.contain.text', 'Vita')
    }
    static checkNotExistTabVitaOnProposte() {
        cy.get('app-proposals-section').contains('Proposte').click()
        cy.get('app-proposals-section').find('nx-tab-header:visible').should('not.contain.text', 'Vita')
    }

    /**
     * Click sulla prima card Danni 
     */
    static clickPrimaCardDanniOnPreventivo() {
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('getDanni');
        cy.get('.cards-container').find('.card').first().click()
        Common.canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 30000 });
        getIFrame().find('button:contains("Cerca"):visible')
    }

    /**
     * Click sulla prima card Vita 
     */
    static clickPrimACardVitaOnPreventivo() {
        cy.get('.cards-container').find('.card').first().click()
        Common.canaleFromPopup()
        cy.wait(20000)
        getIFrame().find('#AZBuilder1_ctl13_cmdEsci').invoke('attr', 'value').should('equal', '  Esci  ')
    }

    /**
     * Sul pannello "preventivi e quotazioni", all'apertura del pannello
     * click sul button "Vedi tutti"
     */
    static clickButtonVediTutti() {
        cy.get('app-quotations-section').find('button:contains("Vedi tutti")').click()
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('getDanni');
        cy.intercept({
            method: 'GET',
            url: '**/Danni/**'
        }).as('getDanniG');
        Common.canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 40000 });
        cy.wait('@getDanniG', { requestTimeout: 40000 });
        cy.wait(10000)
        cy.get('#iframe-container').within(() => {
            getIFrame().find('form:contains("Cerca"):visible')
        })
    }
    //#endregion

    //#region Proposte Danni
    /**
     * Click sul pannello "Proposte danni" atterraggio su tab Danni
     */
    static clickTabDanniOnProposte() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
                req.body.variables.filter.tabCallType.includes('DAMAGE')) {
                req.alias = 'gqlDamage'
            }
        })
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('salesDamagePremium')) {
                req.alias = 'gqlsalesDamagePremium'
            }
        })
        cy.get('app-proposals-section').contains('Proposte').click()
        cy.wait('@gqlDamage', { requestTimeout: 50000 });
        cy.wait('@gqlsalesDamagePremium', { requestTimeout: 50000 });
        cy.get('app-paginated-cards').find('button:contains("Danni")').click()
        cy.get('div[class="damages prop-card ng-star-inserted"]').should('be.visible')
        cy.wait(10000)
    }

    /**
     * Click sul pannello "Proposte danni" atterraggio su tab Vita
     */
    static clickTabVitaOnProposte() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('salesContract') &&
                req.body.variables.filter.tabCallType.includes('LIFE')) {
                req.alias = 'gqlLife'
            }
        })
        cy.get('app-proposals-section').contains('Proposte').click()
        cy.wait('@gqlLife', { requestTimeout: 30000 });
        cy.get('app-paginated-cards').find('button:contains("Vita")').click().wait(3000)
    }

    /**
     * Click sulla prima card Danni 
     */
    static clickPrimaCardDanniOnProposte() {
        // cy.intercept({
        //     method: 'POST',
        //     url: '**/InquiryAgenzia_AD/**'
        // }).as('getAuto');
        cy.get('div[class="damages prop-card ng-star-inserted"]').should('be.visible')
        cy.get('div[class="damages prop-card ng-star-inserted"]').first().find('lib-da-link').first().click()
        // cy.wait(10000)
        // cy.wait('@getAuto', { requestTimeout: 40000 });
        getIFrame().within(() => {
            cy.get('#menuContainer').should('be.visible')
            cy.get('#menuContainer').find('a').should('be.visible').and('contain.text', '« Uscita')
        })
        // .find('#menuContainer > a').should('be.visible').and('contain.text','« Uscita')
        // getIFrame().find('a:contains("« Uscita"):visible')
    }

    /**
     * Click sulla prima card Vita 
     */
    static clickPrimaCardVitaOnProposte() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('digitalAgencyLink')) {
                req.alias = 'digitalAgencyLink'
            }
        });
        cy.get('div[class="life prop-card ng-star-inserted"]').should('be.visible')
        cy.wait(5000)
        cy.get('.cards-container').should('be.visible').find('.card').first().as('firstCard')
        cy.get('@firstCard').trigger('mouseover')
        cy.get('@firstCard').click({ force: true })
        cy.wait(20000)
        cy.wait('@digitalAgencyLink', { requestTimeout: 30000 });
        getIFrame().within(() => {
            cy.get('#AZBuilder1_ctl13_cmdEsci').should('be.visible').invoke('attr', 'value').should('equal', '  Esci  ')
        })

    }
    /**
     * Sul pannello "Proposte Danni", all'apertura del pannello
     * click sul button "Vedi tutte"
     */
    static clickButtonVediTutte() {
        cy.get('app-proposals-section').find('button:contains("Vedi tutte")').click()
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('getDanni');
        cy.intercept({
            method: 'GET',
            url: '**/Danni/**'
        }).as('getDanniG');
        Common.canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 40000 });
        cy.wait('@getDanniG', { requestTimeout: 40000 });
        cy.wait(5000)
        cy.get('#iframe-container').within(() => {
            getIFrame().find('form:contains("Cerca"):visible')
        })
    }
    //#endregion

    // Click tab "CAMPAGNE"
    static clickTabCampagne() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('campaignAgent')) {
                req.alias = 'gqlCampaignAgent'
            }
        })
        cy.get('nx-tab-header').find('button:contains("CAMPAGNE")').click()
        Common.canaleFromPopup()
        cy.wait('@gqlCampaignAgent', { requestTimeout: 60000 });
        cy.url().should('eq', Common.getBaseUrl() + 'sales/campaign-manager')
        getIFrame().find('button:contains("Verifica stato campagne attive"):visible')
    }

    /**
     * Clicca il lob di interess e fa l'Estrai -
     * Verifica l'aggancio alla pagina
     * @param {string} lob - nome del lob
     */
    static lobDiInteresse(lob) {
        return new Cypress.Promise((resolve, reject) => {
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('getTotalSferaReceipts')) {
                    req.alias = 'gqlSfera'
                }
            })
            cy.get('app-lob-link').should('be.visible').contains(lob).click()
            if (lob !== 'Motor')
                cy.wait('@gqlSfera')
            cy.wait(2000)
            let enable
            cy.get('app-receipt-header').find('span').eq(1).invoke('text').then((numPezzi) => {
                if (numPezzi.substring(0, 1) === "0")
                    enable = false
                else
                    enable = true

                if (!enable)
                    resolve(enable)
                else {
                    cy.get('app-receipt-manager-footer').find('button:contains("Estrai"):visible').click()
                    cy.get('app-table-component').should('be.visible')
                    cy.get('nx-header-actions').should('contain.text', 'Espandi Pannello')
                    resolve(enable)
                }
            })
        })

    }

    /**
     * Verifica che il link sia assente nella Pagina si Sales
     * @param {string} element - elemento html da utilizzare nella get
     * @param {string} link - testo del link
     */
    static checkNotExistLink(element, textLink) {
        cy.get(element, { timeout: 10000 }).should('not.contain.text', textLink)
    }

    /**
     * Check Refresh QUIETANZAMENTO
     * Selezioniamo due cluster Random e verifichiamo dopo il refresh 
     * il ripristino dei checkBox selezionati in precedenza
     */
    static checkRefreshQuietanzamento() {

        this.clickCluster('Modalità pagamento da remoto')
        this.clickCluster('Monocoperti')
        cy.screenshot('Verifica checkBox Selezionati', { clip: { x: 0, y: 0, width: 1920, height: 1200 } }, { overwrite: true })

        this.refresh()
        cy.screenshot('Refresh', { clip: { x: 0, y: 0, width: 1920, height: 1200 } }, { overwrite: true })


        // Verifica che il CheckBox non sia selezionato dopo il refresh
        cy.contains('Modalità pagamento da remoto')
            .parents('app-receipt-manager-cluster')
            .children()
            .should('not.have.class', 'app-receipt-manager-cluster selected')

        cy.screenshot('Verifica checkBox non presente', { clip: { x: 0, y: 0, width: 1920, height: 1200 } }, { overwrite: true })


    }

    /**
     * Verifica il corretto funzionamento del Filtro 
     */
    static checkFiltriQuietanzamento() {

        // Mi salvo Il numero di Agenzie pre-Filtro
        cy.get('div[class="single-info"]').first().should('be.visible').within(() => {
            cy.get('span[class="value"]').invoke('text').as('numAgenzieTot')
        })

        cy.get('@numAgenzieTot').then((numAgenzie) => {
            cy.log(numAgenzie)
            this.filtro()

            // Deseleziono la prima Agenzia
            cy.get('nx-checkbox-group').find('nx-checkbox:first').click()
            cy.contains('APPLICA').click().wait(3500)
            cy.get('app-receipt-manager-cluster').should('be.visible')

            cy.get('div[class="single-info"]').first().should('be.visible').within(() => {
                cy.get('span[class="value"]').invoke('text').then((numAgenzieRimaste) => {
                    cy.log(numAgenzieRimaste)

                    // Verifico che dopo il filtro l'agenzia sia stata modificata
                    if (numAgenzie !== numAgenzieRimaste)
                        assert.isTrue(true, numAgenzie + ' diverso da ' + numAgenzieRimaste)
                    else
                        assert.fail('L\'agenzia non è stata tolta dal filtro')


                })
            })
        })


    }
}

export default Sales