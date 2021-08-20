/// <reference types="Cypress" />

//import Common from "../common/Common";




class DatiPreventivo {

    static ClickCheckTarga() {
        cy.contains('NON CONOSCI LA TARGA?').click()
    }
    static verificaUnico() {
        cy.contains('Unico').click()
        //TODO" 1 Aggiornamento unico"
    }
    static clickP2() {
        cy.get('nx-tab-header').contains('NON TARGA?').click()
    }


    static clickPreventivoMotor_() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Preventivo Motor').click()
        cy.intercept({
            method: 'POST',
            url: '**/assuntivomotor/**'
        }).as('getMotor');
        Common.canaleFromPopup()
        cy.wait('@getMotor', { requestTimeout: 50000 });
        getIFrame().find('button:contains("Calcola"):visible')
    }
    static clickPassioneBlu() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')


    }
    static clickAuto_() {
        cy.get('lib-container').find('app-client-resume-emissions:visible').then(($fastquote) => {
            const check = $fastquote.find(':contains("Auto")').is(':visible')
            if (check)
                cy.get('.card-container').find('app-kpi-dropdown-card').contains('Auto').click()
            else
                assert.fail('Card Auto non è presente')


        })
    }

    static clickNuovaPolizza_() {
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.wait(2000)
        cy.get('.cdk-overlay-container').find('button').contains('Nuova polizza').click()
        Common.canaleFromPopup()
        getIFrame().find('input[value="› Home"]').invoke('attr', 'value').should('equal', '› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr', 'value').should('equal', '› Avanti')
    }



 }