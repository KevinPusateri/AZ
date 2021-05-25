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
const buttonEmettiPolizza = () => cy.get('app-emit-policy-popover').find('button:contains("Emetti polizza")').click()
const popoverEmettiPolizza = () => cy.get('.card-container').find('lib-da-link')

//#endregion

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
    static checkLinksCollegamentiRapidi() {
        const linksCollegamentiRapidi = [
            'Sfera',
            'Campagne Commerciali',
            'Recupero preventivi e quotazioni',
            'Monitoraggio Polizze Proposte',
            'GED – Gestione Documentale'
        ]
        cy.get('app-quick-access').find('[class="link-item ng-star-inserted"]').should('have.length', 5).each(($link, i) => {
            expect($link.text().trim()).to.include(linksCollegamentiRapidi[i]);
        })
    }

//#region links collegamenti rapidi
    /**
     * Click sul link rapido Sfera e verifica atterraggio
     */
    static clickLinkRapidoSfera() {
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
    }

    /**
     * Click sul link rapido Campagne Commerciali e verifica atterraggio
     */
    static clickLinkRapidoCampagneCommerciali() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('campaignAgent')) {
                req.alias = 'gqlCampaignAgent'
            }
        })
        cy.get('app-quick-access').contains('Campagne Commerciali').click()
        Common.canaleFromPopup()
        cy.wait('@gqlCampaignAgent', { requestTimeout: 60000 });
        cy.url().should('eq', Common.getBaseUrl() + 'sales/campaign-manager')
    }

    /**
     * Click sul link rapido Recupero preventivi e quotazioni e verifica atterraggio
     */
    static clickLinkRapidoRecuperoPreventiviQuotazioni() {
        cy.get('app-quick-access').contains('Recupero preventivi e quotazioni').click()
        Common.canaleFromPopup()
        cy.wait(10000);
        getIFrame().find('button:contains("Cerca"):visible')
    }

    /**
     * Click sul link rapido Monitoraggio Polizze Proposte e verifica atterraggio
     */
    static clickLinkRapidoMonitoraggioPolizzeProposte() {
        cy.intercept({
            method: 'POST',
            url: /InizializzaContratti/
        }).as('inizializzaContratti');
        cy.get('app-quick-access').contains('Monitoraggio Polizze Proposte').click()
        Common.canaleFromPopup()
        cy.wait('@inizializzaContratti', { requestTimeout: 30000 });
        getIFrame().find('button:contains("Cerca"):visible')
    }
//#endregion

//#region popover Emetti Polizza
    /**
     * Click "Preventivo Motor" e verifica atterraggio
     */
    static clickPreventivoMotor() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Preventivo Motor').click()
        cy.intercept({
            method: 'POST',
            url: '**/assuntivomotor/**'
        }).as('getMotor');
        Common.canaleFromPopup()
        cy.wait('@getMotor', { requestTimeout: 120000 });
        getIFrame().find('button:contains("Calcola"):visible')
    }

    /**
     * Click "Allianz Ultra Casa e Patrimonio" e verifica atterraggio
     */
    static clickAllianzUltraCasaPatrimonio() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio').click()
        cy.intercept({
            method: 'GET',
            url: '**/ultra/**'
        }).as('getUltra');
        Common.canaleFromPopup()
        cy.wait('@getUltra', { requestTimeout: 30000 });
        cy.wait(5000)
        getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
    }

    /**
     * Click "Allianz Ultra Salute" e verifica atterraggio
     */
    static clickAllianzUltraSalute() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Salute').click()
        cy.intercept({
            method: 'GET',
            url: '**/ultra/**'
        }).as('getUltra');
        Common.canaleFromPopup()
        cy.wait('@getUltra', { requestTimeout: 50000 });
        cy.wait(5000)
        getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
    }

    /**
     * Click "Allianz Ultra Salute" e verifica atterraggio
     */
    static clickAllianzUltraCasaPatrimonioBMP() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz Ultra Casa e Patrimonio BMP').click()
        // cy.intercept({
        //     method: 'GET',
        //     url: '/ultra2/**'
        // }).as('getUltra2');
        Common.canaleFromPopup()
        // cy.wait('@getUltra2', { requestTimeout: 30000 });
        cy.wait(15000)
        getIFrame().find('app-root span:contains("Calcola nuovo preventivo"):visible')
    }

    /**
     * Click "Allianz1 Business" e verifica atterraggio
     */
    static clickAllianz1Business() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Allianz1 Business').click()
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('getDanni');
        Common.canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 30000 });
        getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible')
    }

    /**
     * Click "Allianz FastQuote Impresa" e Albergo e verifica atterraggio
     */
    static clickAllianz1Business() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('FastQuote Impresa e Albergo').click()
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('getAuto');
        Common.canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 30000 });
        getIFrame().find('form input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
    }

    /**
     * Click "Flotte e Convenzioni" e verifica atterraggio
     */
    static clickFlotteConvenzioni() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Flotte e Convenzioni').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }

    /**
     * Click "Preventivo anonimo Vita Individuali" e verifica atterraggio
     */
    static clickPreventivoAnonimoVitaIndividuali() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Preventivo anonimo Vita Individuali').click()
        Common.canaleFromPopup()
        cy.wait(20000)
        getIFrame().find('#AZBuilder1_ctl15_cmdIndietro[value="Indietro"]').invoke('attr', 'value').should('equal', 'Indietro')
    }

    /**
     * Click "MiniFlotte" e verifica atterraggio
     */
    static clickMiniFlotte() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('MiniFlotte').click()
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('getAuto');
        Common.canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 30000 });
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
    }

    /**
     * Click "Trattative Auto Corporate" e verifica atterraggio
     */
    static clickTrattativeAutoCorporate() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Trattative Auto Corporate').click()
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('getAuto');
        Common.canaleFromPopup()
        cy.wait('@getAuto', { requestTimeout: 30000 });
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
    }

    /**
     * Click "Gestione Richieste per PA" e verifica atterraggio
     */
    static clickGestioneRichiestePerPA() {
        buttonEmettiPolizza()
        popoverEmettiPolizza().contains('Gestione Richieste per PA').click()
        cy.intercept({
            method: 'POST',
            url: /Danni*/
        }).as('getDanni');
        Common.canaleFromPopup()
        cy.wait('@getDanni', { requestTimeout: 40000 });
        getIFrame().find('#main-wrapper input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
    }
    //#endregion

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