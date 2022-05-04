/// <reference types="Cypress" />

import Common from "../common/Common"

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

    //#region Elementi Campagne Commerciali
    //#endregion

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
}

export default CampagneCommerciali