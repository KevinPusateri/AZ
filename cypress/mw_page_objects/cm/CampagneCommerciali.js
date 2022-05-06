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
        } else if(req.body.operationName.includes('multipleCampaignMassCommunicationKpi')){
            req.alias = 'gqlMultipleCampaignMassCommunicationKpi'
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
//#endregion

/**
 * @class
 * @classdesc Classe per interagire con Campagne Commerciali MW
 * @author Andrea 'Bobo' Oboe
 */
class CampagneCommerciali {
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

            waitCheckGQL('gqlCampaignAgent')
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
}

export default CampagneCommerciali