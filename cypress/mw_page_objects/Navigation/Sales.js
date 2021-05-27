/// <reference types="Cypress" />
import Common from "../common/Common"

//#region variables globals
const getIFrame = () => {

    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
const buttonEmettiPolizza = () => cy.get('app-emit-policy-popover').find('button:contains("Emetti polizza"):visible').click()
const popoverEmettiPolizza = () => cy.get('.card-container').find('lib-da-link')
//#endregion

const LinksRapidi = {
    SFERA: 'Sfera',
    CAMPAGNE_COMMERCIALI: 'Campagne Commerciali',
    RECUPERO_PREVENTIVI_E_QUOTAZIONI: 'Recupero preventivi e quotazioni',
    MONITORAGGIO_POLIZZE_PROPOSTE: 'Monitoraggio Polizze Proposte',
    GED_GESTIONE_DOCUMENTALE: 'GED – Gestione Documentale'
}

const LinksOnEmettiPolizza = {
    PREVENTIVO_MOTOR: 'Preventivo Motor',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: 'Allianz Ultra Casa e Patrimonio',
    ALLIANZ_ULTRA_SALUTE: 'Allianz Ultra Salute',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: 'Allianz Ultra Casa e Patrimonio BMP',
    ALLIANZ1_BUSINESS: 'Allianz1 Business',
    FASTQUOTE_IMPRESA_E_ALBERGO: 'FastQuote Impresa e Albergo',
    FLOTTE_E_CONVENZIONI: 'Flotte e Convenzioni',
    PREVENTIVO_ANONIMO_VITA_INDIVIDUALI: 'Preventivo anonimo Vita Individuali',
    MINIFLOTTE: 'MiniFlotte',
    TRATTATIVE_AUTO_CORPORATE: 'Trattative Auto Corporate',
    GESTIONE_RICHIESTE_PER_PA: 'Gestione Richieste per PA'
}

class Sales {

    /**
     * Torna indietro su Sales
     */
    static backToSales() {
        cy.get('a').contains('Sales').click()
        cy.url().should('eq', Common.getBaseUrl() + 'sales/')
    }

    /**
     * Verifica che i link dei collegamenti rapidi siano presenti nella pagina
     */
    static checkExistLinksCollegamentiRapidi() {
        const linksCollegamentiRapidi = Object.values(LinksRapidi)

        cy.get('app-quick-access').find('[class="link-item ng-star-inserted"]').should('have.length', 5).each(($link, i) => {
            expect($link.text().trim()).to.include(linksCollegamentiRapidi[i]);
        })
    }

    /**
     * Click link nella sezione "Collegamenti rapidi"
     * @param {string} page - nome del link
     */
    static clickLinkRapido(page) {
        switch (page) {
            case LinksRapidi.SFERA:
                cy.intercept({
                    method: 'POST',
                    url: '**/dacommerciale/**'
                }).as('getDacommerciale');
                cy.get('app-quick-access').contains('Sfera').click()
                Common.canaleFromPopup()
                cy.wait('@getDacommerciale', { requestTimeout: 40000 });
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
                cy.wait(10000);
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
     * Click link nel button "Emetti polizza"
     * @param {string} page - nome del link
     */
    static clickLinkOnEmettiPolizza(page) {
        cy.wait(3000)
        // buttonEmettiPolizza()
        // popoverEmettiPolizza().contains(page).click()
        cy.contains('Emetti polizza').click({ force: true })
        // cy.get('app-emit-policy-popover').find('button:contains("Emetti polizza"):visible').click().wait()
        cy.get('.card-container').find('lib-da-link').contains(page).click()
        switch (page) {
            case LinksOnEmettiPolizza.PREVENTIVO_MOTOR:
                cy.intercept({
                    method: 'POST',
                    url: '**/assuntivomotor/**'
                }).as('getMotor');
                Common.canaleFromPopup()
                cy.wait('@getMotor', { requestTimeout: 100000 });
                getIFrame().find('button:contains("Calcola"):visible')
                break;
            case LinksOnEmettiPolizza.ALLIANZ_ULTRA_CASA_E_PATRIMONIO:
                cy.intercept({
                    method: 'GET',
                    url: '**/ultra/**'
                }).as('getUltra');
                Common.canaleFromPopup()
                cy.wait('@getUltra', { requestTimeout: 30000 });
                cy.wait(5000)
                getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
                break;
            case LinksOnEmettiPolizza.ALLIANZ_ULTRA_SALUTE:
                cy.intercept({
                    method: 'GET',
                    url: '**/ultra/**'
                }).as('getUltra');
                Common.canaleFromPopup()
                cy.wait('@getUltra', { requestTimeout: 50000 });
                cy.wait(5000)
                getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
                break;
            case LinksOnEmettiPolizza.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP:
                // cy.intercept({
                //     method: 'GET',
                //     url: '/ultra2/**'
                // }).as('getUltra2');
                Common.canaleFromPopup()
                // cy.wait('@getUltra2', { requestTimeout: 30000 });
                cy.wait(15000)
                getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
                break;
            case LinksOnEmettiPolizza.ALLIANZ1_BUSINESS:
                cy.intercept({
                    method: 'POST',
                    url: '**/Danni/**'
                }).as('getDanni');
                Common.canaleFromPopup()
                cy.wait('@getDanni', { requestTimeout: 30000 });
                getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible')
                break;
            case LinksOnEmettiPolizza.FASTQUOTE_IMPRESA_E_ALBERGO:
                cy.intercept({
                    method: 'POST',
                    url: '**/Auto/**'
                }).as('getAuto');
                Common.canaleFromPopup()
                cy.wait('@getAuto', { requestTimeout: 30000 });
                getIFrame().find('form input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksOnEmettiPolizza.FLOTTE_E_CONVENZIONI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
                break;
            case LinksOnEmettiPolizza.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI:
                Common.canaleFromPopup()
                cy.wait(20000)
                getIFrame().find('#AZBuilder1_ctl15_cmdIndietro[value="Indietro"]').invoke('attr', 'value').should('equal', 'Indietro')

                break;
            case LinksOnEmettiPolizza.MINIFLOTTE:
                cy.intercept({
                    method: 'POST',
                    url: '**/Auto/**'
                }).as('getAuto');
                Common.canaleFromPopup()
                cy.wait('@getAuto', { requestTimeout: 30000 });
                getIFrame().find('span:contains("Nuova Trattativa"):visible')
                break;
            case LinksOnEmettiPolizza.TRATTATIVE_AUTO_CORPORATE:
                cy.intercept({
                    method: 'POST',
                    url: '**/Auto/**'
                }).as('getAuto');
                Common.canaleFromPopup()
                cy.wait('@getAuto', { requestTimeout: 30000 });
                getIFrame().find('span:contains("Nuova Trattativa"):visible')
                break;
            case LinksOnEmettiPolizza.GESTIONE_RICHIESTE_PER_PA:
                cy.intercept({
                    method: 'POST',
                    url: /Danni*/
                }).as('getDanni');
                Common.canaleFromPopup()
                cy.wait('@getDanni', { requestTimeout: 40000 });
                getIFrame().find('#main-wrapper input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
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
        cy.wait('@gqlReceipts')
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
        cy.get('app-paginated-cards').find('button:contains("Danni")').click()
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
        cy.get('app-paginated-cards').find('button:contains("Vita")').click()
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
        getIFrame().find('#AZBuilder1_ctl08_cmdNote').invoke('attr', 'value').should('equal', 'Note')
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
        cy.get('app-proposals-section').contains('Proposte').click()
        cy.wait('@gqlDamage')
        cy.get('app-paginated-cards').find('button:contains("Danni")').click()
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
        cy.wait('@gqlLife')
        cy.get('app-paginated-cards').find('button:contains("Vita")').click()
    }

    /**
      * Click sulla prima card Danni 
      */
    static clickPrimaCardDanniOnProposte() {
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('getAuto');
        cy.get('.cards-container').find('.card').first().click()
        Common.canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 30000 });
        getIFrame().find('a:contains("« Uscita"):visible')
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


}

export default Sales