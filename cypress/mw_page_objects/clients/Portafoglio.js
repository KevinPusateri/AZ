/// <reference types="Cypress" />

import Common from "../common/Common";
import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
import LandingRicerca from "../ricerca/LandingRicerca";

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class Portafoglio {

    /**
     * Loop
     * Ricerca un cliente fino a quando non trova
     * una polizza attiva presente
     */
    static checkClientWithPolizza() {
        const searchClientWithPolizza = () => {
            LandingRicerca.searchRandomClient(true, "PF", "E")
            LandingRicerca.clickRandomResult()
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
            cy.get('app-wallet-active-contracts').should('be.visible')
            cy.get('body').should('be.visible')
                .then($body => {
                    const isTrovato = $body.find('app-wallet-active-contracts:contains("Il cliente non possiede Polizze attive"):visible').is(':visible')
                    if (isTrovato)
                        searchClientWithPolizza()
                    else
                        return
                })
        }

        searchClientWithPolizza()
    }

    static back() {
        cy.get('a').contains('Clients').click()
    }

    static clickTabPortafoglio() {
        cy.intercept('POST', '**/graphql', (req) => {
            aliasQuery(req, 'contract')
        })

        cy.get('app-client-profile-tabs').should('be.visible').within(() => {
            cy.get('a').should('be.visible')
        })
        cy.contains('PORTAFOGLIO').click()
        cy.wait('@gqlcontract', { requestTimeout: 60000 });

    }

    static checkLinksSubTabs() {
        cy.get('nx-tab-header').should('be.visible')
        cy.get('button').should('be.visible')
        const tabPortafoglio = [
            'Polizze attive',
            'Proposte',
            'Preventivi',
            'Non in vigore',
            'Sinistri'
        ]
        cy.get('nx-tab-header').find('button').each(($checkTabPortafoglio, i) => {
            expect($checkTabPortafoglio.text().trim()).to.include(tabPortafoglio[i]);
        })
    }

    static checkPolizzeAttive() {
        cy.get('app-wallet-active-contracts').should('be.visible').and('contain.text', 'Polizze attive')
        cy.get('app-wallet-active-contracts').find('span[class="nx-button__content-wrapper"]')
            .should('be.visible').and('include.text', 'Incassa').and('include.text', 'Modifica consensi')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-contract-card').should('be.visible').first().click()
        Common.canaleFromPopup()
        getIFrame().find('#navigation-area:contains("Contratto"):visible')
    }

    static checkPreventivi() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('contract')) {
                req.alias = 'gqlcontract'
            }

        })
        cy.get('app-wallet-quotations').find('app-section-title').should('contain.text', 'Preventivi')
        // cy.wait('@gqlcontract', { requestTimeout: 40000 }).then((interception) => {
        //     expect(interception.response.statusCode).to.be.eq(200);
        // });
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-contract-card').should('be.visible')
        cy.get('app-contract-card').first().within(() => {
            // cy.get('div[class="title-info"]').find('[class="value"]').should('contain.text','202')
            // cy.get('div[class="title-info"]').find('[class="value"]').then(($textDate) => {
            //     cy.wrap($textDate).contains('giu 2021')
            // })
        })
        cy.get('app-contract-card').first().then(() => {
            cy.wait(10000)
            cy.get('app-contract-card').first().click()
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('digitalAgencyLink')) {
                    req.alias = 'gqlDigitalAgencyLink'
                }
            })
            // cy.wait(10000)
            Common.canaleFromPopup()
            // cy.wait(10000)
            cy.wait('@gqlDigitalAgencyLink', { requestTimeout: 40000 }).then((interception) => {
                expect(interception.response.statusCode).to.be.eq(200);
            });

            getIFrame().find('#casella-ricerca').should('be.visible').and('contain.text', 'Cerca')
        })
    }

    static checkProposte() {
        cy.get('app-wallet-proposals').should('be.visible')
        cy.get('app-contract-card').should('be.visible')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.wait(10000)
        cy.get('app-contract-card').first().click()
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('digitalAgencyLink')) {
                req.alias = 'gqlDigitalAgencyLink'
            }
        })
        Common.canaleFromPopup()
        cy.wait('@gqlDigitalAgencyLink', { requestTimeout: 40000 })
        cy.wait(10000)
        getIFrame().find('#AZBuilder1_ctl08_cmdNote').should('exist').and('be.visible')

    }

    static checkNonInVigore() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('app-wallet-inactive-contracts').find('app-section-title').should('contain.text', 'Polizze')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-wallet-inactive-contracts').find('span[class="nx-button__content-wrapper"]')
            .should('be.visible').and('include.text', 'Incassa')
        cy.get('app-contract-card').should('be.visible').first().click()
        cy.wait(10000)
        Common.canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('#navigation-area').should('be.visible').and('contain.text', '« Uscita')
    }

    static checkSinistri() {
        cy.get('lib-da-link').should('be.visible')
        cy.get('lib-filters-sorting').should('be.visible')
        cy.get('app-wallet-claims').find('app-section-title').should('contain.text', 'Sinistri')
        cy.get('lib-filter-button-with-modal').should('be.visible')
        cy.get('app-claim-card').first()
            .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h ellipsis-icon"]').click()

        cy.get('.cdk-overlay-container').find('button').contains('Consulta sinistro').click()
        getIFrame().find('a[class="active"]').should('contain.text', 'Dettaglio del Sinistro')
    }

    /**
     * 
     * @param {string} subTab - nome di una subtab
     * ("Polizze attive")
     */
    static clickSubTab(subTab) {
        cy.get('nx-tab-header').contains(subTab).click({ force: true })
    }

    /**
     * Filtraggio Polizze estratte in base ai filtri passati
     * @param {String} lob a scelta tra Motor,Rami vari, Vita, Allianz 1 e Allianz Ultra
     * @param {String} stato opzionale, a scelta tra Da incassare, Sostituzione, Annullata, Bloccata, Bloccata Parz., Sospesa
     */
    static filtraPolizze(lob, stato = '') {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('contract')) {
                req.alias = 'gqlcontract'
            }

        })

        cy.get('lib-filter-button-with-modal').find('nx-icon[name="filter"]').click()
        cy.get('lib-modal-container').should('be.visible').within(() => {
            //Stato della polizza (opzionale)
            if (stato !== '')
                cy.contains(stato).click()

            //Lob della polizza
            cy.contains(lob).click()
        })

        cy.wait(1000)

        cy.get('.footer').find('button').contains('applica').click()
        cy.wait('@gqlcontract', { timeout: 30000 })
    }


    static clickAnnullamento() {
        cy.get('app-contract-card').should('be.visible')
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

        // Click tre puntini dalla prima polizza
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').first().should('exist').then(($contract) => {
            cy.wrap($contract)
                .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h ellipsis-icon"]').click()
        })

        // Click Link Annullamento
        cy.get('.cdk-overlay-container').should('contain.text', 'Annullamento').within(($overlay) => {
            cy.get('button').should('be.visible')
            cy.wrap($overlay).find('button:contains("Annullamento")').click()
        })

        Common.canaleFromPopup()

        cy.getIFrame()
        cy.get('@iframe').within(() =>{
            cy.get('td[title="Vendita]').click()
        })
    }
}

export default Portafoglio