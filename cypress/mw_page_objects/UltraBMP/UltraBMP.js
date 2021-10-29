import { exit } from "cypress/lib/util"

class UltraBMP {

    //#region Dati quotazione
    static compilaDatiQuotazione() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            
            cy.get('div[class="nx-dropdown__container"]').first().then(($div)=>{
                cy.pause()
                cy.get('span').contains('appartamento').should('exist').click()
                cy.get('span').contains('villa indipendente').should('exist').click()
                //cy.get('input[id="nx-input-0"]').should('exist').type('250')
            })

            //cy.get('div[class="nx-dropdown__container"]').first().find('span').contains('appartamento').should(be.visible)
            
        })

    }
    //#endregion
}

export default UltraBMP