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

    static compilaDatiQuotazione(targa, dataNascita) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {


            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').type(dataNascita)
            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').type(targa);

            cy.get('nx-checkbox[id="informativa"]').should('exist').and('be.visible').within(() => {
                cy.get('span[class="nx-checkbox__control"]').click()
            })
            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').type(targa);

        })

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('motor-root').as('corpo')

            cy.get('button').as('Calcola')
            const loopClickCalcola = () => {

                cy.get('@Calcola').then(($calcola) => {

                    const checkButton = $calcola.find(':contains("Calcola")').is(':visible')
                    if (checkButton) {
                        cy.wait(2000);
                        cy.contains('Calcola').should('be.visible')
                        cy.contains('Calcola').click({ force: true })
                        cy.wait(3000);
                        cy.get('@corpo').then(($corpo) => {

                            const checkNextPage = $corpo.find(':contains("Provenienza")').is(':visible')
                            if (!checkNextPage) {
                                cy.get('nx-natural-language-form').then(($container) => {
                                    const checkContainerChanged = $container.find(':contains("Risiede")').is(':visible')
                                    if (checkContainerChanged) {
                                        cy.get('input[aria-label="Indirizzo"]').should('exist').and('be.visible').clear().type('vittorio veneto{enter}');
                                        cy.wait(500);

                                        cy.get('input[aria-label="NumeroCivico"]').should('exist').and('be.visible').clear().type('52{enter}')
                                        cy.wait(500);

                                        cy.get('input[aria-label="Comune"]').should('exist').and('be.visible').clear().type('Savona')
                                        cy.wait(500);
                                        loopClickCalcola()
                                    } else
                                        loopClickCalcola()
                                })
                            }

                        })



                    }

                })
            }

            loopClickCalcola()
        })
        cy.getIFrame()


        cy.get('@iframe').within(() => {

            cy.contains('OK').should('be.visible')
            cy.contains('OK').click({ force: true })
        })

    }

}

export default PreventivoMotor