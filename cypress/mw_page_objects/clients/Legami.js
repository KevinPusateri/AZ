/// <reference types="Cypress" />


class Legami {

    static creaGruppo() {
        cy.wait(2000)
        cy.contains('Crea gruppo').click({ force: true })

        cy.get('.cdk-overlay-container').find('nx-message-toast')
            .should('be.visible').and('contain.text', 'Gruppo aziendale creato')
        cy.get('nx-modal').find('h4:visible').should('contain.text', 'Aggiunta di un membro al gruppo aziendale')
        cy.get('nx-modal').find('div[class="nx-grid"]').should('be.visible')


    }

    static inserisciMembro() {
        return new Promise((resolve, reject) => {

            cy.get('nx-modal').then(($modal) => {
                const searchOtherMember = () => {
                    cy.generateTwoLetters().then(randomChars => {
                        cy.get('nx-modal').find('div[class="nx-grid"]')
                            .clear().type(randomChars).type('{enter}')
                    })
                    cy.get('nx-modal').then(() => {
                        var listIndex = []
                        cy.wait(5000)
                        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').each(($person, index) => {
                            listIndex.push(index)
                        })
                        cy.get('nx-modal').then(() => {
                            var name = ''
                            console.log(listIndex)

                            var indexPerson = listIndex[Math.floor(Math.random() * listIndex.length)]

                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson)
                                .find('div[class="name-surname"]').then((textName) => {
                                    name = textName.text()
                                })
                            cy.wait(2000)
                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson).scrollIntoView().click()
                            cy.wait(2000)
                            cy.wrap($modal).find('span:contains("Aggiungi"):visible').click()
                            cy.wait(2000)
                            cy.get('.cdk-overlay-container').find('nx-message-toast').then($overlay => {

                                const checkIsPresente = $overlay.find(':contains("Aderente già presente in altro Gruppo Aziendale.")').is(':visible')
                                const checkError = $overlay.find('nx-message-toast:contains("ERROR")').is(':visible')

                                if (checkIsPresente || checkError)
                                    searchOtherMember()
                                else {
                                    cy.get('.cdk-overlay-container').find('nx-message-toast')
                                        .should('be.visible').and('contain.text', 'Membro aggiunto al gruppo')
                                    resolve(name)
                                }

                            })
                        })
                    })
                }
                searchOtherMember()

            })

        })
    }

    static eliminaGruppo() {
        cy.contains('Elimina gruppo').click()
        cy.get('.cdk-overlay-container').find('span[class="text"]')
            .should('be.visible').and('contain.text', 'Eliminare il gruppo aziendale?')
        cy.get('.cdk-overlay-container').find('button:contains("Si)')
            .should('be.visible').click()
    }

    static checkMembroInserito(membro, capogruppo) {
        cy.get('ac-anagrafe-panel')
            .should('be.visible').then((name) => {
                expect(capogruppo).to.include(name.text())
            })
        cy.get('ac-anagrafe-panel').find('div[class="member-name"]').eq(0)
            .parents('div[class="member ng-star-inserted"]')
            .find('div[class="member-data"] > div[class="data"]').should('contain.text', 'Capogruppo')

        cy.get('ac-anagrafe-panel')
            .should('be.visible').then((name) => {
                expect(membro).to.include(name.text())
            })
        cy.get('ac-anagrafe-panel').find('div[class="member-name"]').eq(1)
            .parents('div[class="member ng-star-inserted"]')
            .find('div[class="member-data"] > div[class="data"]').should('contain.text', 'Appartenente')

    }

    static clickEliminaGruppo() {
        cy.contains('Elimina gruppo').click()
        cy.get('.cdk-overlay-container').find('span[class="text"]:visible').should('contain.text', 'Eliminare il gruppo aziendale?')
        cy.contains('Si').click()

        cy.get('.cdk-overlay-container').find('nx-message-toast')
            .should('be.visible').and('contain.text', 'Gruppo aziendale eliminato')
    }

    static clickLinkMembro(membro) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });
        cy.get('ac-anagrafe-panel').find('a[class="data"]:contains("' + membro + '")').click()


        cy.wait('@client', { requestTimeout: 30000 });
    }

    static checkMembroNonInseribile(membro) {
        cy.contains('Inserisci membro').click()
        cy.get('nx-modal').should('be.visible')
        cy.get('nx-modal').find('h4:visible').should('contain.text', 'Aggiunta di un membro al gruppo aziendale')
        cy.get('nx-modal').find('div[class="nx-grid"]').should('be.visible')

        cy.get('nx-modal').find('div[class="nx-grid"]')
            .clear().type(membro).type('{enter}')

        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').should('be.visible')

        cy.get('nx-modal').then(($modal) => {
            cy.wrap($modal).find('div[class="person ng-star-inserted"]:contains("' + membro + '")').first().click()
            cy.wrap($modal).find('span:contains("Aggiungi"):visible').click()
            cy.get('.cdk-overlay-container').find('nx-message-toast')
                .should('be.visible').and('contain.text', 'Aderente già presente in altro Gruppo Aziendale.')
            cy.wrap($modal).find('nx-icon[name="close"]:visible').click()
        })
    }

    static clickLinkMembro(membro) {
        cy.contains(membro).click()
    }

    static eliminaMembro() {
        cy.get('nx-icon[class="trash-icon nx-icon--s ndbx-icon nx-icon--trash"]').first().click()
        cy.get('.cdk-overlay-container').find('span[class="text"]:visible').should('contain.text', 'Rimuovere')
        cy.contains('Si').click()

        cy.get('.cdk-overlay-container').find('nx-message-toast')
            .should('be.visible').and('contain.text', 'Membro rimosso dal gruppo')

        cy.get('ac-anagrafe-panel').find('div[class="member-name"]')
            .should('be.visible').then((name) => {
                expect(name.text()).to.not.include(membro)
            })
    }

    static checkTerzoMembroNonInseribile() {
        cy.contains('Inserisci membro').click()
        cy.get('nx-modal').then(($modal) => {
            const searchOtherMember = () => {

                cy.generateTwoLetters().then(randomChars => {

                    cy.get('nx-modal').find('div[class="nx-grid"]')
                        .clear().type(randomChars).type('{enter}')
                })

                cy.get('nx-modal').then(() => {
                    var listIndex = []

                    cy.wait(5000)
                    cy.get('nx-modal').find('div[class="person ng-star-inserted"]').each(($person, index) => {
                        listIndex.push(index)
                    })
                    cy.get('nx-modal').then(() => {

                        var indexPerson = listIndex[Math.floor(Math.random() * listIndex.length)]
                        cy.wait(2000)
                        cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson).scrollIntoView().click()
                        cy.wait(2000)
                        cy.wrap($modal).find('span:contains("Aggiungi"):visible').click()
                        cy.wait(2000)
                        cy.get('.cdk-overlay-container').then($overlay => {
                            const checkIsPresente = $overlay.find('nx-message-toast:contains("Aderente già presente in altro Gruppo Aziendale.")').is(':visible')
                            const checkError = $overlay.find('nx-message-toast:contains("ERROR")').is(':visible')

                            if (checkIsPresente || checkError)
                                searchOtherMember()
                            else
                                cy.get('.cdk-overlay-container').find('nx-message-toast')
                                    .should('be.visible').and('contain.text', 'E\' stato raggiunto il numero massimo di imprese (3) per Nucleo Aziendale')
                            cy.wrap($modal).find('nx-icon[name="close"]:visible').click()

                        })
                    })
                })

            }

            searchOtherMember()

        })

    }

    static clickInserisciMembro() {
        cy.contains('Inserisci membro').click()
        return new Promise((resolve, reject) => {

            cy.get('nx-modal').then(($modal) => {
                const searchOtherMember = () => {
                    cy.generateTwoLetters().then(randomChars => {
                        cy.get('nx-modal').find('div[class="nx-grid"]')
                            .clear().type(randomChars).type('{enter}')
                    })
                    cy.get('nx-modal').then(() => {
                        var listIndex = []
                        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').each(($person, index) => {
                            listIndex.push(index)
                        })
                        cy.get('nx-modal').then(() => {
                            var name = ''
                            console.log(listIndex)

                            var indexPerson = listIndex[Math.floor(Math.random() * listIndex.length)]
                            cy.wait(5000)

                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson)
                                .find('div[class="name-surname"]').then((textName) => {
                                    name = textName.text()
                                })
                            cy.wait(2000)
                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson).scrollIntoView().click()
                            cy.wait(2000)
                            cy.wrap($modal).find('span:contains("Aggiungi"):visible').click()
                            cy.wait(2000)
                            cy.get('.cdk-overlay-container').find('nx-message-toast').then($overlay => {

                                const checkIsPresente = $overlay.find(':contains("Aderente già presente in altro Gruppo Aziendale.")').is(':visible')
                                const checkError = $overlay.find('nx-message-toast:contains("ERROR")').is(':visible')

                                if (checkIsPresente || checkError)
                                    searchOtherMember()
                                else {
                                    cy.get('.cdk-overlay-container').find('nx-message-toast')
                                        .should('be.visible').and('contain.text', 'Membro aggiunto al gruppo')
                                    resolve(name);
                                }

                            })
                        })
                    })
                }
                searchOtherMember()

            })

        })
    }
}

export default Legami