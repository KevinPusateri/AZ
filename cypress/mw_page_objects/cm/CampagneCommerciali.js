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
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('campaignAgent')) {
                req.alias = 'gqlCampaignAgent'
            }
        })

        cy.wait('@gqlCampaignAgent', { timeout: 120000 }).then(gqlCampaignAgent => {
            expect(gqlCampaignAgent.response.statusCode).to.be.eq(200);
            assert.isNotNull(gqlCampaignAgent.response.body)
        })

        cy.url().should('eq', Common.getBaseUrl() + 'sales/campaign-manager')
        cy.screenshot('Verifica accesso Campagne Commerciali', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static statoCampagneAttive() {
        getIFrame().within(() => {
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('campaignAgent')) {
                    req.alias = 'gqlCampaignAgent'
                } else if (req.body.operationName.includes('campaignsMonitoringTableData')) {
                    req.alias = 'gqlcampaignsMonitoringTableData'
                }
            })
            
            cy.contains("Verifica stato campagne attive").should('exist').and('be.visible').click()

            cy.wait('@gqlCampaignAgent', { timeout: 120000 })
            cy.wait('@gqlcampaignsMonitoringTableData', { timeout: 120000 })

            cy.pause()
        })
    }
}

export default CampagneCommerciali