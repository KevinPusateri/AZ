/// <reference types="Cypress" />

import Common from "../common/Common"

//#region iFrame
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

//#region Intercept
const gqlCampaing = () => {
    cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName.includes('campaignAgent')) {
            req.alias = 'gqlCampaignAgent'
        } else if (req.body.operationName.includes('campaignsMonitoringTableData')) {
            req.alias = 'gqlCampaignsMonitoringTableData'
        } else if (req.body.operationName.includes('campaignList')) {
            req.alias = 'gqlCampaignList'
        } else if (req.body.operationName.includes('campaignsMonitoring')) {
            req.alias = 'gqlCampaignsMonitoring'
        } else if (req.body.operationName.includes('campaignUser')) {
            req.alias = 'gqlCampaignUser'
        } else if (req.body.operationName.includes('multipleCampaignMassCommunicationKpi')) {
            req.alias = 'gqlMultipleCampaignMassCommunicationKpi'
        } else if (req.body.operationName.includes('campaign')) {
            req.alias = 'gqlCampaign'
        } else if (req.body.operationName.includes('taskTable')) {
            req.alias = 'gqlTaskTable'
        } else if (req.body.operationName.includes('campaignMassCommunicationKpi')) {
            req.alias = 'gqlCampaignMassCommunicationKpi'
        } else if (req.body.operationName.includes('massCommunicationOrderDetails')) {
            req.alias = 'gqlMassCommunicationOrderDetails'
        }
    })
}

const waitCheckGQL = (operationName) => {
    cy.wait(`@${operationName}`, { timeout: 120000 }).then(operationName => {
        expect(operationName.response.statusCode).to.be.eq(200);
        assert.isNotNull(operationName.response.body)
    })
}
//#endregion

//#region Enum
/**
 * Enum Tipo Quietanze
 * @readonly
 * @enum {Object}
 * @private
 */
const Filtro = {
    PERIODO: 'Periodo',
    TIPOLOGIA_CAMPAGNA: 'Tipologia campagna',
    LINEA_BUSINESS: 'Linea di business',
    SORGENTE_DATI: 'Sorgente dati'
}
//#endregion

/**
 * @class
 * @classdesc Classe per interagire con Campagne Commerciali MW
 * @author Andrea 'Bobo' Oboe
 */
class CampagneCommerciali {

    /**
     * Funzione che ritorna i tipi di filtri
     * @returns {Filtro} tipo di filtro
     */
    static get FILTRO() {
        return Filtro
    }

    /**
     * Verifica accesso a Campagne Commerciali
     */
    static verificaAccessoCampagneCommerciali() {

        gqlCampaing()

        waitCheckGQL('gqlCampaignUser')
        waitCheckGQL('gqlCampaignList')
        waitCheckGQL('gqlCampaignsMonitoring')
        waitCheckGQL('gqlCampaignAgent')

        cy.url().should('eq', Common.getBaseUrl() + 'sales/campaign-manager')

        cy.screenshot('Verifica accesso Campagne Commerciali', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static statoCampagneAttive() {
        getIFrame().within(() => {

            gqlCampaing()

            cy.contains("Verifica stato campagne attive").should('exist').and('be.visible').click()

            waitCheckGQL('gqlCampaignsMonitoringTableData')
            waitCheckGQL('gqlMultipleCampaignMassCommunicationKpi')
            waitCheckGQL('gqlCampaignAgent')

            cy.contains("Campagne attive").should('exist').and('be.visible')
            cy.contains("Numeri chiave").should('exist').and('be.visible')

            //Card list con i Numeri chiave
            cy.get('lib-interaction-card-list').should('exist').and('be.visible')
            //Tabella con le campagne attive
            cy.get('.lib-active-campaigns-table').should('exist').and('be.visible')

            cy.screenshot('Stato Campagne Attive', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains("Indietro").should('exist').and('be.visible').click()

            waitCheckGQL('gqlCampaignList')
            waitCheckGQL('gqlCampaignsMonitoring')
            waitCheckGQL('gqlCampaignAgent')
        })
    }

    static risultatiDelleVendite() {
        getIFrame().within(() => {
            gqlCampaing()

            cy.contains("Controlla i risultati delle vendite").should('exist').and('be.visible').click()

            waitCheckGQL('gqlCampaignsMonitoringTableData')
            waitCheckGQL('gqlCampaignsMonitoring')
            waitCheckGQL('gqlCampaignAgent')

            cy.contains("Risultati di vendita di campagne attive").should('exist').and('be.visible')

            //Tabella con le campagne attive
            cy.get('.lib-active-campaigns-table').should('exist').and('be.visible')

            cy.screenshot('Risultati Delle Vendite', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains("Indietro").should('exist').and('be.visible').click()

            waitCheckGQL('gqlCampaignList')
            waitCheckGQL('gqlCampaignsMonitoring')
            waitCheckGQL('gqlCampaignAgent')
        })
    }

    static filtri(filtro) {
        getIFrame().within(() => {
            cy.contains(filtro).should('exist').parent().parent().find('nx-dropdown').click()

            //clicchiamo sull'ultima voce disponible
            cy.get('nx-dropdown-item:visible').last().click()
        })
    }

    static vediCampagna() {
        getIFrame().within(() => {
            gqlCampaing()

            //clicchiamo sulla prima disponibile
            cy.contains('Vedi campagna').first().should('exist').click()

            waitCheckGQL('gqlCampaign')
            waitCheckGQL('gqlTaskTable')
            waitCheckGQL('gqlMassCommunicationOrderDetails')
            waitCheckGQL('gqlCampaignAgent')
            waitCheckGQL('gqlCampaignsMonitoring')

            cy.screenshot('Vedi Campagna', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains("Indietro").should('exist').and('be.visible').click()

            waitCheckGQL('gqlCampaignList')
            waitCheckGQL('gqlCampaignsMonitoring')
            waitCheckGQL('gqlCampaignAgent')
        })
    }

    static campagneInArrivo() {
        gqlCampaing()

        getIFrame().within(() => {

            cy.get('.lib-upcoming-campaigns-carousel').should('exist').within(() => {
                //clicchiamo sulla prima disponibile
                cy.contains('Vedi campagna').first().should('exist').click()
            })
        })

        waitCheckGQL('gqlCampaign')
        waitCheckGQL('gqlCampaignAgent')

        //Verifichiamo che il pulsante 'Configura e attiva' sia disabilitato
        getIFrame().within(() => {
            cy.get('button:contains("Configura e attiva")').should('exist').and('be.visible').and('have.attr', 'disabled')

            cy.screenshot('Campagne in Arrivo', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains("Indietro").should('exist').and('be.visible').click()

            waitCheckGQL('gqlCampaignList')
            waitCheckGQL('gqlCampaignsMonitoring')
            waitCheckGQL('gqlCampaignAgent')
        })
    }

    static campagneNuove() {
        gqlCampaing()

        getIFrame().within(() => {

            cy.get('.lib-campaign-card').should('exist').within(() => {
                //clicchiamo sulla prima disponibile
                cy.contains('Vedi campagna').first().should('exist').click()
            })
        })

        waitCheckGQL('gqlCampaign')
        waitCheckGQL('gqlCampaignAgent')

        //Verifichiamo che il pulsante 'Configura e attiva' sia abilitato
        getIFrame().within(() => {
            cy.get('button:contains("Configura e attiva")').should('exist').and('be.visible').and('not.have.attr', 'disabled')

            cy.screenshot('Campagne Nuove', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains("Indietro").should('exist').and('be.visible').click()

            waitCheckGQL('gqlCampaignList')
            waitCheckGQL('gqlCampaignsMonitoring')
            waitCheckGQL('gqlCampaignAgent')
        })
    }

    static suggerimentoCampagna() {
        getIFrame().within(() => {
            cy.contains('Suggerisci una campagna').should('exist').click()

            cy.get('nx-modal-container').should('exist').and('be.visible').within(() => {
                cy.contains('Suggerisci una campagna').should('exist').and('be.visible')
                cy.get('textarea').should('exist').and('be.visible')
                cy.screenshot('Suggerisci una campagna', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                cy.contains('Annulla').should('exist').and('be.visible').click()
            })
        })
    }
}

export default CampagneCommerciali