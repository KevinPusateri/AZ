/// <reference types="Cypress" />

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
require('cypress-plugin-tab')


class PreventivoMotor {

    //#region Dati quotazione
    static compilaDatiQuotazione(targa, dataNascita) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Targa"]').type(targa).wait(500)

            //String dataNascita = caso.Data_Decorrenza.AddYears(-caso.Eta).AddDays(-10).ToString("ddMMyyyy");
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(dataNascita).wait(1000)

            cy.get('label[id="nx-checkbox-informativa-label"]>span').eq(0).click({ force: true }).wait(500)

            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })

            cy.get('input[aria-label="Indirizzo"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Indirizzo"]').type('roma{enter}').wait(500);

            cy.get('input[aria-label="NumeroCivico"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="NumeroCivico"]').type('12{enter}').wait(500);

            cy.get('input[aria-label="Comune"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Comune"]').type('Codogno').wait(1000);

            cy.contains('Calcola').click({ force: true })
            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })

            //const check = $body.find('OK').is(':visible')
            // if (check) {
            // cy.contains('OK').should('be.visible')
            //cy.contains('OK').click({ force: true })
            // }
        })

    }
    #region

    //#region Provenienza

    static provenienza(provenienza) {
        cy.wait(10000)
        cy.getIFrame()
        // cy.get('@iframe').within(() => {


        //     cy.get('nx-dropdown[aria-haspopup="listbox"]').first().should('be.visible').click()            
        //     cy.get('nx-dropdown-item').should('be.visible').contains(provenienza).click();


        // })

    }

    //#endregion

    //#region Salvataggio quotazione

    static salvaQuotazioneMotorNGA2021() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.contains('Salva quotazione').should('be.visible').click()

            var nomeQuotazione = randomString(10, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

            cy.get('input[formcontrolname="nome"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[formcontrolname="nome"]').type(nomeQuotazione).wait(1000)
            cy.get('button[nxbutton="primary medium"]').click()
            return nomeQuotazione;

        })

    }

    //#endregion

}
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export default PreventivoMotor