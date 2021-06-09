/// <reference types="Cypress" />
import Common from "../common/Common";
import Sales from "../navigation/Sales";

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const LinksBurgerMenu = {
    PREVENTIVO_MOTOR: 'Preventivo Motor',
    FLOTTE_E_CONVENZIONI: 'Flotte e Convenzioni',
    MINIFLOTTE: 'MiniFlotte',
    TRATTATIVE_AUTO_CORPORATE: 'Trattative Auto Corporate',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: 'Allianz Ultra Casa e Patrimonio',
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: 'Allianz Ultra Casa e Patrimonio BMP',
    ALLIANZ_ULTRA_SALUTE: 'Allianz Ultra Salute',
    ALLIANZ1_BUSINESS: 'Allianz1 Business',
    FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE: 'FastQuote Infortuni da circolazione',
    FASTQUOTE_IMPRESA_E_ALBERGO: 'FastQuote Impresa e Albergo',
    ALLIANZ1_PREMORIENZA: 'Allianz1 premorienza',
    PREVENTIVO_ANONIMO_VITA_INDIVIDUALI: 'Preventivo Anonimo Vita Individuali',
    GESTIONE_RICHIESTE_PER_PA: 'Gestione richieste per PA',
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
    ALLIANZ_GLOBAL_ASSISTANCE: 'Allianz Global Assistance',
    ALLIANZ_PLACEMENT_PLATFORM: 'Allianz placement platform',
    QUALITÀ_PORTAFOGLIO_AUTO: 'Qualità portafoglio auto',
    APP_CUMULO_TERREMOTI: 'App cumulo terremoti',
    NOTE_DI_CONTRATTO: 'Note di contratto',
    ACOM_GESTIONE_INIZIATIVE: 'ACOM Gestione iniziative',

}

class BurgerMenuSales extends Sales {

    /**
     * Verifica che i link nel burgerMenu siano presenti
     */
    static checkExistLinks() {

        cy.get('lib-burger-icon').click({force:true})

        const linksBurger = Object.values(LinksBurgerMenu)

        cy.get('nx-expansion-panel').find('a').should('have.length', 36).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurger[i]);
        })
    }

    /**
     * Click sul link richiesto dal BurgerMenu
     * @param {string} page - nome del link 
     */
    static clickLink(page) {
        cy.get('lib-burger-icon').click({force:true})
        cy.contains(page).click()

        this.checkPage(page)
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
                cy.wait('@getMotor', { requestTimeout: 50000 });
                getIFrame().find('button:contains("Calcola"):visible')
                break;
            case LinksBurgerMenu.FLOTTE_E_CONVENZIONI:
                Common.canaleFromPopup()
                getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
                break;
            case LinksBurgerMenu.MINIFLOTTE:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Nuova Trattativa"):visible')
                break;
            case LinksBurgerMenu.TRATTATIVE_AUTO_CORPORATE:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Nuova Trattativa"):visible')
                getIFrame().find('span:contains("Guida"):visible')
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_CASA_E_PATRIMONIO:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP:
                Common.canaleFromPopup()
                cy.wait(8000)
                getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
                break;
            case LinksBurgerMenu.ALLIANZ_ULTRA_SALUTE:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
                break;
            case LinksBurgerMenu.ALLIANZ1_BUSINESS:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible')
                break;
            case LinksBurgerMenu.FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE:
                Common.canaleFromPopup()
                getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
                break;
            case LinksBurgerMenu.FASTQUOTE_IMPRESA_E_ALBERGO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
                break;
            case LinksBurgerMenu.FASTQUOTE_IMPRESA_E_ALBERGO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                getIFrame().find('input[value="› Calcola"]').invoke('attr', 'value').should('equal', '› Calcola')
                break;
            case LinksBurgerMenu.ALLIANZ1_PREMORIENZA:
                cy.intercept({
                    method: 'POST',
                    url: '**/sales/**'
                }).as('getSalesPremo');
                cy.wait(5000)
                Common.canaleFromPopup()
                cy.wait('@getSalesPremo', { requestTimeout: 40000 });
                cy.wait(20000)
                getIFrame().find('button[class="btn btn-info btn-block"]:contains("Ricerca"):visible')
                break;
            case LinksBurgerMenu.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI:
                Common.canaleFromPopup()
                cy.wait(20000)
                getIFrame().find('input[value="Home"]').invoke('attr', 'value').should('equal', 'Home')
                getIFrame().find('input[value="Indietro"]').invoke('attr', 'value').should('equal', 'Indietro')
                getIFrame().find('input[value="Avanti"]').invoke('attr', 'value').should('equal', 'Avanti')
                break;
            case LinksBurgerMenu.GESTIONE_RICHIESTE_PER_PA:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Visualizza"):visible')
                break;
            case LinksBurgerMenu.SFERA:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Applica filtri"):visible')
                break;
            case LinksBurgerMenu.CAMPAGNE_COMMERCIALI:
                Common.canaleFromPopup()
                cy.url().should('include', '/campaign-manager')
                break;
            case LinksBurgerMenu.RECUPERO_PREVENTIVI_E_QUOTAZIONI:
                cy.intercept({
                    method: 'POST',
                    url: /InizializzaApplicazione/
                }).as('inizializzaApplicazione');
                Common.canaleFromPopup()
                cy.wait('@inizializzaApplicazione', { requestTimeout: 30000 });
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.DOCUMENTI_DA_FIRMARE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.GESTIONE_ATTIVITA_IN_SCADENZA:
                cy.intercept({
                    method: 'POST',
                    url: '**/dacommerciale/**'
                }).as('getDacommerciale');
                Common.canaleFromPopup()
                cy.wait('@getDacommerciale', { requestTimeout: 50000 });
                getIFrame().find('#contentPane button:contains("Estrai Dettaglio"):visible')
                break;
            case LinksBurgerMenu.MANUTENZIONE_PORTAFOGLIO_RV_MIDCO:
                cy.intercept({
                    method: 'POST',
                    url: '**/DirMPTF/**'
                }).as('danni');
                Common.canaleFromPopup()
                cy.wait('@danni', { requestTimeout: 40000 });
                cy.wait(15000)
                getIFrame().find('#ctl00_MasterBody_btnApplicaFiltri[value="Applica Filtri"]').invoke('attr', 'value').should('equal', 'Applica Filtri')
                break;
            case LinksBurgerMenu.VITA_CORPORATE:
                cy.intercept({
                    method: 'POST',
                    url: '**/SUV/**'
                }).as('getSUV');
                Common.canaleFromPopup()
                cy.wait('@getSUV', { requestTimeout: 40000 });
                cy.wait(10000)
                getIFrame().find('.k-link:contains("Consultazione Collettive e Versamenti"):visible')
                break;
            case LinksBurgerMenu.MONITORAGGIO_POLIZZE_PROPOSTE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.CERTIFICAZIONE_FISCALE:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.MANUTENZIONE_PORTAFOGLIO_AUTO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Carica Polizze"]').invoke('attr', 'value').should('equal', 'Carica Polizze')
                break;
            case LinksBurgerMenu.CRUSCOTTO_CERTIFICATI_APPLICAZIONI:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.REPORT_CLIENTE_T4L:
                cy.intercept({
                    method: 'POST',
                    url: /Vita*/
                }).as('vita');
                Common.canaleFromPopup()
                // cy.wait('@vita', { requestTimeout: 30000 });
                cy.wait(6000)
                getIFrame().find('input[value="Ricerca"]').invoke('attr', 'value').should('equal', 'Ricerca')
                break;
                case LinksBurgerMenu.DOCUMENTI_ANNULLATI:
                Common.canaleFromPopup()
                getIFrame().find('span:contains("Storico polizze e quietanze distrutte"):visible')
                break;
            case LinksBurgerMenu.GED_GESTIONE_DOCUMENTALE:
                break;
            case LinksBurgerMenu.DOCUMENTI_DA_GESTIRE:
                cy.wait(5000)
                Common.canaleFromPopup()
                getIFrame().find('input[value="Ricerca Attività"]').invoke('attr', 'value').should('equal', 'Ricerca Attività')
                break;
            case LinksBurgerMenu.FOLDER:
                Common.canaleFromPopup()
                getIFrame().find('button:contains("Cerca"):visible')
                break;
            case LinksBurgerMenu.ALLIANZ_GLOBAL_ASSISTANCE:
                break;
            case LinksBurgerMenu.ALLIANZ_PLACEMENT_PLATFORM:
                break;
            case LinksBurgerMenu.QUALITÀ_PORTAFOGLIO_AUTO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksBurgerMenu.APP_CUMULO_TERREMOTI:
                break;
            case LinksBurgerMenu.NOTE_DI_CONTRATTO:
                Common.canaleFromPopup()
                getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
                break;
            case LinksBurgerMenu.ACOM_GESTIONE_INIZIATIVE:
                break;

        }
    }




}

export default BurgerMenuSales