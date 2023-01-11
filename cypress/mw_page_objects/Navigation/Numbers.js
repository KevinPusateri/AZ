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
//#endregion

//#region Intercept
const interceptPostAgenziePDF = () => {
    cy.intercept({
        method: 'POST',
        url: '**/dacommerciale/**'
    }).as('postDacommerciale');
}

const interceptGetAgenziePDF = () => {
    cy.intercept({
        method: 'GET',
        url: '**/dacommerciale/**'
    }).as('getDacommerciale');
}
//#endregion

/**
 * Classe di accesso alla sezione Numbers di Matrix Web
 */
class Numbers {

    /**
     * Torna indetro su Numbers
     * @param {string} checkUrl - Verifica url della pagina di atterraggio
     * url: business-lines, products, operational-indicators, incentives
     */
    static backToNumbers(checkUrl) {
        cy.get('a').contains('Numbers').click()
        cy.url().should('include', 'numbers/' + checkUrl)
    }

    /**
     * 
     * @param {string} nameTab - Nome del tab da cliccare 
     * @param {string} checkUrlTab - Verifica url del tab cliccato
     */
    static clickTab(nameTab, checkUrlTab) {
        cy.contains(nameTab).click().should('have.class', 'active')
        cy.url().should('eq', Common.getBaseUrl() + 'numbers/' + checkUrlTab)
    }

    /**
     * Verifica che il button  di filtro sia cliccato e chiuso 
     */
    static verificaFiltro() {
        cy.get('lib-container').find('nx-icon[name="filter"]').click().wait(2000)
        cy.get('app-filters').find('h3:contains("AGENZIE"):visible')
        cy.get('app-filters').find('h3:contains("COMPAGNIE"):visible')
        cy.get('app-filters').find('h3:contains("FONTI"):visible')
        cy.get('app-filters').find('h3:contains("PERIODO"):visible')
        cy.screenshot('Verifica filtro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.contains('ANNULLA').click()
    }

    /**
     * Verifica che il button PDF sia cliccato  
     */
    static verificaPDF() {
        cy.get('lib-container').find('a[class="circle icon-glossary btn-icon"]')
            .should('have.attr', 'href', 'https://portaleagenzie.pp.azi.allianz.it/dacommerciale/DSB/Content/PDF/Regole_Classificazione_Reportistica.pdf')
    }

    /**
     * Verifica Atterraggio Ricavi di Agenzia
     */
    static checkAtterraggioRicaviDiAgenzia() {
        interceptPostAgenziePDF()
        cy.get('app-agency-incoming').contains('RICAVI DI AGENZIA').click()
        cy.wait('@postDacommerciale', { requestTimeout: 80000 })
        getIFrame().find('a:contains("Filtra"):visible')
        cy.screenshot('Verifica atterraggio Ricavi di Agenzia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * 
     * @param {string} tab - titolo del tab
     * @param {string} link - titolo del link 
     */
    static clickAndCheckAtterraggio(tab, link) {
        switch (tab) {
            case 'DANNI':
            case 'VITA':
                // interceptPostAgenziePDF()
                interceptGetAgenziePDF()
                cy.get('app-kpi-card').contains(link).click()
                // if (link.includes('Portafoglio'))
                //     cy.get('nx-modal-container').should('be.visible').find('button:contains("OK")').click()
                cy.get('div[class="cdk-overlay-container"]').then(($popup) => {
                    cy.wait(1000);
                    const checkPopup = $popup.find(':contains(OK)').is(':visible')
                    if (checkPopup)
                        cy.get('nx-modal-container').should('be.visible').find('button:contains("OK")').click()
                })
                cy.wait('@getDacommerciale', { requestTimeout: 180000 });
                break;
            case 'MOTOR':
            case 'RAMI VARI RETAIL':
            case 'MIDCO':
            case 'ALTRO':
                interceptPostAgenziePDF()
                cy.get('app-lob-title').contains(tab).parents('app-border-card')
                    .find('lib-da-link:contains("' + link + '")').click()
                cy.get('div[class="cdk-overlay-container"]').then(($popup) => {
                    cy.wait(1000);
                    const checkPopup = $popup.find(':contains(OK)').is(':visible')
                    if (checkPopup)
                        cy.get('nx-modal-container').should('be.visible').find('button:contains("OK")').click()
                })
                // if ((link.includes('Portafoglio') || link.includes('Retention')) && (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')))
                //     cy.get('nx-modal-container').should('be.visible').find('button:contains("OK")').click()
                cy.wait('@postDacommerciale', { requestTimeout: 180000 });
                break;

        }
        cy.screenshot(`Verifica atterraggio ${tab} ${link}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getIFrame().find('#ricerca_cliente', { timeout: 15000 }).should('be.visible').and('contain.text', 'Filtra')
    }


    /**
     * Verifica Atterraggio Primo indice prodotto
     */
    static clickAndCheckAtterraggioPrimoIndiceProdotto() {
        interceptPostAgenziePDF()
        cy.get('lib-card').should('be.visible').first().click()
        cy.wait('@postDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#ricerca_cliente:contains("Filtra"):visible')
        cy.screenshot('Verifica atterraggio Primo indice di prodotto', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica Atterraggio Primo indice Monitoraggio Carico
     */
    static clickAndCheckAtterraggioMonitoraggioCarico() {
        cy.get('app-load-monitoring').should('be.visible')
        cy.get('app-load-monitoring').find('lib-da-link').should('be.visible')
        cy.get('app-load-monitoring').find('app-lob-title').should('contain.text', 'DANNI')
        cy.get('app-load-monitoring').find('app-lob-title').should('contain.text', 'MOTOR')
        cy.get('app-load-monitoring').find('app-lob-title').should('contain.text', 'RAMI VARI RETAIL')
        cy.screenshot('Verifica atterraggio Primo indice Monitoraggio Carico', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * It waits for 4 seconds, then checks if the element with the text "Questi KPI non sono
     * compatibili con i filtri selezionati" is visible". If it is, it resolves the promise with true.
     * @returns A promise that resolves to true if the element is visible.
     */
    static checkKPI() {
        return new Cypress.Promise((resolve) => {
            cy.wait(4000)
            cy.get('app-digital-indexes').should('exist').and('be.visible').then(($indiciDigitali) => {
                if ($indiciDigitali.find(':contains("Questi KPI non sono compatibili con i filtri selezionati")').is(':visible'))
                    resolve(true)
                else 
                    resolve(false)
            })
        });
    }

    /**
     * Verifica Atterraggio Primo indice digitale
     */
    static clickAndCheckAtterraggioPrimoIndiceDigitale() {
        cy.wait(5000)
        interceptGetAgenziePDF()
        cy.get('app-digital-indexes').should('exist').and('be.visible').within(($indici) => {
                cy.wrap($indici).find('lib-card').first().click()
        })
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('a:contains("Apri filtri"):visible')
        cy.screenshot('Verifica atterraggio Primo indice digitale', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * 
     * Verifica Atterraggio Incentivi dal panel 
     * @param {string} panel - titolo del panel: ("GRUPPO INCENTIVATO 178 DAN","GRUPPO INCENTIVATO 178" )
     */
    static checkAtterraggioPrimoIndiceIncentivi(panel) {
        cy.get('app-incentives').find('[class="text-panel-header"]').should('contain', 'TOTALE MATURATO INCENTIVI')
        interceptPostAgenziePDF()
        cy.contains(panel).click()
        cy.get('app-incentive-card').first().click({ force: true })
        Common.canaleFromPopup()
        cy.wait('@postDacommerciale', { requestTimeout: 60000 });
        getIFrame().contains('Report').should('be.visible')
        cy.screenshot(`Verifica atterraggio Incentivi dal panel ${panel}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica dati delle card siano visibili e corretti
     */
    static checkCards() {

        cy.contains('DANNI').click().then(() => {
            cy.get('[class="docs-grid-colored-row sum-container nx-grid__row"]').find('lib-da-link').each((link) => {
                cy.wrap(link).find('[class="title"]').then((title) => {
                    const titleCardTitle = [
                        'New business',
                        'Incassi',
                        'Portafoglio',
                        'Retention'
                    ]
                    expect(titleCardTitle).include(title.text())
                })
            })

        })
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            cy.contains('VITA').click().then(() => {
                cy.get('app-kpi-card').each((link) => {
                    cy.wrap(link).find('[class="title"]').then((title) => {
                        const titleCardTitle = [
                            'New business',
                            'Incassi',
                            'Riserve',
                            'Capitali vita in scadenza',
                            'Capitale reinvestito'
                        ]
                        expect(titleCardTitle).include(title.text())
                    })
                })
            })

        cy.contains('DANNI').click()
        cy.get('app-border-card').find('app-lob-title').each((titleLobCard) => {
            var title = titleLobCard.text()
            switch (title) {
                case 'MOTOR':
                case 'RAMI VARI RETAIL':
                case 'MIDCO':
                case 'ALTRO':
                    cy.wrap(titleLobCard).parents('app-border-card').find('lib-da-link').each((link) => {
                        cy.wrap(link).find('[class="title"]').then((title) => {
                            const titleCardTitle = [
                                'New business',
                                'Incassi',
                                'Portafoglio',
                                'Retention'
                            ]
                            expect(titleCardTitle).include(title.text())
                        })
                    })
                    cy.screenshot(`Check Card ${title}`, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    break;
            }
        })

    }

    /**
     * Filtro Cambiando il periodo
     * @param {string} year - data: anno
     */
    static filtri(year) {
        cy.get('nx-icon[name="filter"]').click()
        cy.get('app-filters').should('be.visible').within(($filterDialog) => {
            //Selezioniamo tutte le Agenzie
            const check = $filterDialog.find('span:contains("Seleziona tutti")').is(':visible')
            if (check)
                cy.contains('Seleziona tutti').should('be.visible').click()

            //Selezioniamo tutte le Compagnie
            cy.contains('COMPAGNIE').click()
            cy.contains('span', 'Tutte').should('be.visible').click()

            cy.contains(year).click()
            cy.contains('APPLICA').click()
        })
    }
}

export default Numbers