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

const getIFrameCampagne = () => {

        cy.get('iframe[class="iframe-container"]')
            .iframe();

        let iframeSCU = cy.get('iframe[class="iframe-container"]')
            .its('0.contentDocument').should('exist');

        return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
    }
    //#endregion

const LinksRapidi = {
    NUOVO_SFERA: 'Nuovo Sfera', //! seconda finestra
    SFERA: 'Sfera',
    CAMPAGNE_COMMERCIALI: 'Campagne Commerciali', //! seconda finestra
    RECUPERO_PREVENTIVI_E_QUOTAZIONI: 'Recupero preventivi e quotazioni',
    MONITORAGGIO_POLIZZE_PROPOSTE: 'Monitoraggio Polizze Proposte',
    GED_GESTIONE_DOCUMENTALE: 'GED – Gestione Documentale'
}

const LinksOnEmettiPolizza = {
    PREVENTIVO_MOTOR: 'Preventivo Motor',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: 'Allianz Ultra Casa e Patrimonio',
    ALLIANZ_ULTRA_SALUTE: Cypress.env('isAviva') ? 'Ultra Salute' : 'Allianz Ultra Salute',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: 'Allianz Ultra Casa e Patrimonio BMP', //! seconda finestra
    ALLIANZ1_BUSINESS: 'Allianz1 Business',
    FASTQUOTE_IMPRESA_E_ALBERGO: 'FastQuote Impresa e Albergo',
    FLOTTE_E_CONVENZIONI: 'Flotte e Convenzioni',
    PREVENTIVO_ANONIMO_VITA_INDIVIDUALI: 'Preventivo anonimo Vita Individuali',
    MINIFLOTTE: 'MiniFlotte',
    TRATTATIVE_AUTO_CORPORATE: 'Trattative Auto Corporate',
    GESTIONE_RICHIESTE_PER_PA: 'Gestione Richieste per PA' //! seconda finestra
}

class Sales {

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
        cy.get('app-lob-link').each((lob) => {
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
        cy.get('app-lob-link').each((lob) => {
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
    static checkExistLinksCollegamentiRapidi() {

        if (Cypress.env('monoUtenza')) {
            delete LinksRapidi.NUOVO_SFERA
            delete LinksRapidi.CAMPAGNE_COMMERCIALI
            const linksCollegamentiRapidi = Object.values(LinksRapidi)
            cy.get('app-quick-access').find('a').should('have.length', 4).each(($link, i) => {
                expect($link.text().trim()).to.include(linksCollegamentiRapidi[i]);
            })
        } else if (Cypress.env('isAviva')) {
            delete LinksRapidi.GED_GESTIONE_DOCUMENTALE
            delete LinksRapidi.SFERA
            const linksCollegamentiRapidi = Object.values(LinksRapidi)
            cy.get('app-quick-access').find('a').should('have.length', 4).each(($link, i) => {
                expect($link.text().trim()).to.include(linksCollegamentiRapidi[i]);
            })
        } else {
            const linksCollegamentiRapidi = Object.values(LinksRapidi)
            cy.get('app-quick-access').find('a').should('have.length', 6).each(($link, i) => {
                expect($link.text().trim()).to.include(linksCollegamentiRapidi[i]);
            })
        }
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
    static checkLinksOnEmettiPolizza() {
        cy.contains('Emetti polizza').click({ force: true })
        const linksEmettiPolizza = Object.values(LinksOnEmettiPolizza)

        if (Cypress.env('monoUtenza')) {
            delete LinksOnEmettiPolizza.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP
            delete LinksOnEmettiPolizza.GESTIONE_RICHIESTE_PER_PA
            const linksEmettiPolizza = Object.values(LinksOnEmettiPolizza)
            cy.get('.card-container').find('lib-da-link').each(($link, i) => {
                expect($link.text().trim()).to.include(linksEmettiPolizza[i]);
            })
        } else if (Cypress.env('isAviva')) {
            const linksEmettiPolizza = [
                LinksOnEmettiPolizza.PREVENTIVO_MOTOR,
                LinksOnEmettiPolizza.ALLIANZ_ULTRA_SALUTE
            ]
            cy.get('.card-container').find('lib-da-link').each(($link, i) => {
                expect($link.text().trim()).to.include(linksEmettiPolizza[i]);
            })
        } else {
            cy.get('.card-container').find('lib-da-link').each(($link, i) => {
                expect($link.text().trim()).to.include(linksEmettiPolizza[i]);
            })
        }
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
                    method: 'GET',
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
        getIFrame().find('#AZBuilder1_ctl14_cmdEsci').invoke('attr', 'value').should('equal', '  Esci  ')
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
            cy.get('.cards-container').should('be.visible').find('.card').first().click()
            cy.wait(15000)
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
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('getTotalSferaReceipts')) {
                req.alias = 'gqlSfera'
            }
        })
        cy.get('app-lob-link').should('be.visible').contains(lob).click()
        cy.wait('@gqlSfera')
        cy.get('app-receipt-manager-footer').find('button:contains("Estrai"):visible').click()
        cy.get('app-table-component').should('be.visible')
        cy.get('nx-header-actions').should('contain.text', 'Espandi Pannello')
    }

}

export default Sales