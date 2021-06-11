/// <reference types="Cypress" />
import Common from "../common/Common"

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

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

class Numbers {

    /**
     * Torna indetro su Numbers
     * @param {string} checkUrl - Verifica url della pagina di atterraggio
     * url: business-lines, products, operational-indicators, incentives
     */
    static backToNumbers(checkUrl) {
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', Common.getBaseUrl() + 'numbers/' + checkUrl)
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
        cy.wait('@postDacommerciale', { requestTimeout: 80000 });
        getIFrame().find('a:contains("Filtra"):visible')
    }

    /**
     * 
     * @param {string} tab - titolo del tab
     * @param {string} link - titolo del link: 
     */
    static clickAndCheckAtterraggio(tab, link) {
        switch (tab) {
            case 'DANNI':
            case 'VITA':
                interceptPostAgenziePDF()
                cy.get('app-kpi-card').contains(link).click()
                break;
            case 'MOTOR':
            case 'RAMI VARI RETAIL':
            case 'MIDCO':
            case 'ALTRO':
                interceptPostAgenziePDF()
                cy.get('app-lob-title').contains(tab).parents('app-border-card')
                    .find('lib-da-link:contains("'+link+'")').click()
                break;

        }
        cy.wait('@postDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#ricerca_cliente:contains("Filtra"):visible')

    }


    /**
     * Verifica Atterraggio Primo indice prodotto
     */
    static clickAndCheckAtterraggioPrimoIndiceProdotto() {
        interceptPostAgenziePDF()
        cy.get('lib-card').first().click()
        cy.wait('@postDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#ricerca_cliente:contains("Filtra"):visible')
    }

    /**
     * Verifica Atterraggio Primo indice digitale
     */
    static clickAndCheckAtterraggioPrimoIndiceDigitale() {
        interceptPostAgenziePDF()
        cy.get('app-digital-indexes').find('lib-card').first().click()
        cy.wait('@postDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('a:contains("Apri filtri"):visible')
    }

    /**
     * Verifica Atterraggio Incentivi dal panel "GRUPPO INCENTIVATO 178 DAN"
     */
    static checkAtterraggioPrimoIndiceIncentivi() {
        cy.get('app-incentives').find('[class="text-panel-header"]').should('contain', 'TOTALE MATURATO INCENTIVI')
        interceptPostAgenziePDF()
        cy.contains('GRUPPO INCENTIVATO 178 DAN').click()
        cy.get('app-incentive-card').find('lib-card').first().click()
        Common.canaleFromPopup()
        cy.wait('@postDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#btnRicerca_CapoGruppo:contains("Nuova ricerca"):visible')
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
        cy.contains('VITA').click().then(() => {
            cy.get('app-kpi-card').each((link) => {
                cy.wrap(link).find('[class="title"]').then((title) => {
                    const titleCardTitle = [
                        'New business',
                        'Incassi',
                        'Riserve'
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
                    break;
            }
        })

    }

}

export default Numbers