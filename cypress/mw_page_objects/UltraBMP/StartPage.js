/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class StartPage {

    static startScopriProtezione() {
        ultraIFrame().within(() => {
            cy.get('button').contains('SCOPRI LA PROTEZIONE').should('be.visible').click() //click su Scopri la Protezione
            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
        })
    }

    //ricerca la professione e seleziona il primo risultato
    static startModificaProfessione(professione) {
        ultraIFrame().within(() => {
            cy.get('span').contains('professione').should('be.visible')
                .next('a').click() //apre il popup per la ricerca professioni

            cy.get('#professioni-modal').find('input')
                .type(professione) //ricerca professione

            cy.wait(1000);

            cy.get('#list-one').find('span').first().click() //seleziona il primo risultato
            cy.get('#list-one').find('span').first().prev('nx-icon[name="check"]')
                .should('be.visible') //verifica che compaia il segno di spunta

            cy.get('button[aria-disabled="false"]')
                .children('span').contains('CONFERMA').click() //conferma il popup

            cy.get('span').contains('professione').should('be.visible')
                .next('a').contains(professione).should('be.visible') //verifica che la professione sia stata modificata nella pagina start
        })
    }
}

export default StartPage