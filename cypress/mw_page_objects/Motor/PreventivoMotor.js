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


            cy.get('input[ng-reflect-name="DataNascitaProprietario"]').should('exist').and('be.visible').type(dataNascita)
            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').type(targa);

            cy.get('nx-checkbox[id="informativa"]').should('exist').and('be.visible').within(() => {
                cy.get('span[class="nx-checkbox__control"]').click()
            })
            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').type(targa);

            cy.wait(2000);
            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })

            cy.wait(2000);

            cy.get('input[ng-reflect-name="Indirizzo"]').should('exist').and('be.visible').type('vittorio veneto{enter}');
            cy.wait(200);

            cy.get('input[ng-reflect-name="NumeroCivico"]').should('exist').and('be.visible').type('52{enter}')
            cy.wait(200);

            cy.get('input[ng-reflect-name="Comune"]').should('exist').and('be.visible').type('Savona')


        })

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            const loopClickCalcola = () => {

                cy.get('button').then(($calcola) => {
                    debugger
                    const checkButton = $calcola.find(':contains("Calcola")').is(':visible')
                    if (checkButton) {
                        cy.contains('Calcola').should('be.visible')
                        cy.contains('Calcola').click({ force: true })
                    } else
                        loopClickCalcola()

                })
            }

            loopClickCalcola()
        })


    }
    // const loopClickCalcola = () => {
    //     cy.get('nx-modal-container').should('exist').then(($note) => {
    //         const checkButtonOk = $note.find(':contains("OK")').is(':visible')
    //         if (checkButtonOk) {
    //             cy.contains('Ok').should('be.visible')
    //             cy.contains('Ok').click({ force: true })
    //         }
    //         else {

    //             loopClickCalcola()
    //         }
    //     })

    // }
    // loopClickCalcola()
}

export default PreventivoMotor