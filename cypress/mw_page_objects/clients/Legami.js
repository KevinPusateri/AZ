/// <reference types="Cypress" />

var name = ''

class Legami {

    static creaGruppo() {
        cy.contains('Crea gruppo').click()
        cy.get('.cdk-overlay-container').find('nx-message-toast')
            .should('be.visible').and('contain.text', 'Gruppo aziendale creato')
        cy.get('nx-modal').should('be.visible')
        cy.get('nx-modal').find('h4:visible').should('contain.text', 'Aggiunta di un membro al gruppo aziendale')
        cy.get('nx-modal').find('div[class="nx-grid"]').should('be.visible')

        cy.generateTwoLetters().then(randomChars => {
            cy.get('nx-modal').find('div[class="nx-grid"]')
                .clear().type(randomChars).type('{enter}')
        })

        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').should('be.visible')

        cy.get('nx-modal').then(() => {
            var listIndex = []

            cy.get('nx-modal').find('div[class="person ng-star-inserted"]').each(($person, index) => {
                cy.wrap($person).then(() => {
                    listIndex.push(index)
                })
            })

            cy.get('nx-modal').then(($modal) => {
                var indexPerson = listIndex[Math.floor(Math.random() * listIndex.length)]
                cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson)
                    .find('div[class="name-surname"]').then((textName) => {
                        name = textName
                        debugger
                    }).click()
            })
        })
    }

    static nuovoMembro() {
        // cy.contains('Crea gruppo').click()
    }

    static eliminaGruppo() {
        cy.contains('Elimina gruppo').click()
        cy.get('.cdk-overlay-container').find('span[class="text"]')
            .should('be.visible').and('contain.text', 'Eliminare il gruppo aziendale?')
        cy.get('.cdk-overlay-container').find('button:contains("Si)')
            .should('be.visible').click()
    }

}

export default Legami