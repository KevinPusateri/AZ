/// <reference types="Cypress" />


class Legami {

    /**
     * Clicca button Crea gruppo
     */
    static creaGruppo() {
        cy.wait(2000)
        cy.contains('Crea gruppo').click({ force: true })

        cy.get('.cdk-overlay-container').find('nx-message-toast')
            .should('be.visible').and('contain.text', 'Gruppo aziendale creato')
        cy.get('nx-modal').find('h4:visible').should('contain.text', 'Aggiunta di un membro al gruppo aziendale')
        cy.get('nx-modal').find('div[class="nx-grid"]').should('be.visible')
    }

    /**
     * Inserisci membro dopo aver creato al gruppo
     */
    static inserisciMembroFromGroup() {
        return new Cypress.Promise((resolve, reject) => {

            cy.get('nx-modal').should('be.visible').then(($modal) => {
                const searchOtherMember = () => {
                    cy.generateTwoLetters().then(randomChars => {
                        cy.get('nx-modal').find('div[class="nx-grid"]')
                            .clear().type(randomChars).type('{enter}')
                        cy.wait(3000)
                        cy.get('nx-modal').then(($modalSearch) => {
                            const checkSearchIsPresente = $modalSearch.find(':contains("Nessun cliente trovato")').is(':visible')
                            if (checkSearchIsPresente)
                                searchOtherMember()
                        })
                    })
                    cy.get('nx-modal').should('be.visible').then(() => {
                        var listIndex = []
                        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').should('be.visible')
                        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').each(($person, index) => {
                            listIndex.push(index)
                        })
                        cy.get('nx-modal').then(() => {
                            var name = ''
                            var indexPerson = listIndex[Math.floor(Math.random() * listIndex.length)]

                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson)
                                .find('div[class="name-surname"]').then((textName) => {
                                    name = textName.text()
                                })
                            cy.get('div[class="person ng-star-inserted"]').should('be.visible')
                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson).scrollIntoView().click()

                            cy.get('div[class="selected-person ng-star-inserted"]').should('exist').and('be.visible')
                            cy.wrap($modal).find('span:contains("Aggiungi"):visible').click()

                            cy.get('nx-message-toast').should('be.visible')
                            cy.get('.cdk-overlay-container').find('nx-message-toast').then($overlay => {

                                const checkIsPresente = $overlay.find(':contains("Aderente già presente in altro Gruppo Aziendale.")').is(':visible')
                                const checkError = $overlay.find(':contains("ERROR")').is(':visible')
                                const checkNotImprese = $overlay.find(':contains("In un gruppo aziendale possono esser inserite solamente imprese")').is(':visible')

                                if (checkIsPresente || checkError || checkNotImprese)
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

    /**
     * Verifica che il membro e il capogruppo siano presenti sulla pagina Legami
     * @param {string} membro - uno dei membri
     * @param {string} capogruppo - il capogruppo
     * @param {boolean} check - default settato a true verifico inserito appartenente dalla scheda cliente del capogruppo,
     *                          altrimenti false se verifico i legami dalla scheda cliente dell'appartenente 
     */
    static checkMembroInserito(membro, capogruppo, check = true) {
        cy.wait(4000)
        if (check) {
            // CAPOGRUPPO
            cy.get('ac-anagrafe-panel').should('be.visible').find('div[class="gruppo-panel"]:first:visible').within(($panel) => {
                    cy.get('div[class="member-name"]:first:visible').find('div[class^="data"]').not(':contains("Membro")').then((name) => {
                        cy.wrap($panel).should('include.text', capogruppo)
                        expect(name.text().trim()).to.include(capogruppo)
                    })
                })
                // APPARTENENTE
            cy.get('ac-anagrafe-panel').should('be.visible').find('div[class="gruppo-panel"]:first:visible').within(($panel) => {
                cy.get('div[class="member-name"]:visible').eq(1).find('nx-link:first:visible').then((name) => {
                    cy.wrap($panel).should('include.text', membro)
                    expect(name.text().trim()).to.include(membro)
                })
            })
        } else {
            // CAPOGRUPPO
            cy.get('ac-anagrafe-panel').should('be.visible').find('div[class="gruppo-panel"]:first:visible').within(($panel) => {
                    cy.get('div[class="member-name"]:first').find('nx-link:first:visible').then((name) => {
                        cy.wrap($panel).should('include.text', capogruppo)
                        expect(name.text().trim()).to.include(capogruppo)
                    })
                })
                // APPARTENTENTE
            cy.get('ac-anagrafe-panel').should('be.visible').find('div[class="gruppo-panel"]:first:visible').within(($panel) => {
                cy.get('div[class="member-name"]:visible').eq(1).find('div[class^="data"]').not(':contains("Membro")').then((name) => {
                    cy.wrap($panel).should('include.text', membro)
                    expect(name.text().trim()).to.include(membro)
                })
            })
        }
    }

    /**
     * Click button Elimina gruppo
     */
    static clickEliminaGruppo() {
        cy.contains('Elimina gruppo').click()
        cy.get('.cdk-overlay-container').find('span[class="text"]:visible').should('include.text', 'Eliminare il gruppo aziendale?')
        cy.contains('Si').click()

        cy.get('.cdk-overlay-container').find('nx-message-toast')
            .should('be.visible').and('include.text', 'Gruppo aziendale eliminato')
    }

    /**
     * Click link membro
     * @param {string} membro - link membro
     * @param {Boolean} editMembro - default a true, effettuato trim e substring per i test di mw_legami
     */
    static clickLinkMembro(membro, editMembro = true) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        let currentMembro = editMembro ? membro.trim().substring(0, 5) : membro

        cy.get('ac-anagrafe-panel').should('be.visible').find('a[class="data"]:contains("' + currentMembro + '"):first:visible').click()

        cy.wait('@client', { requestTimeout: 30000 });
    }

    /**
     * Verifica membro gia presente in un altro Gruppo aziendale
     * @param {string} membro 
     */
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

    /**
     * Click icona di eliminazione del membro
     * @param {string} membro - nome del membro 
     */
    static eliminaMembro(membro) {
        cy.get('div[class^="member-name"]').should('exist').and('be.visible')
        cy.wait(4000)
        cy.contains('div[class^="member-name"]', membro).parents()
        cy.contains('div[class^="member-name"]', membro)
            .parents('div[class^="member"]').find('nx-icon[class="trash-icon nx-icon--s ndbx-icon nx-icon--trash"]').click()
        cy.get('.cdk-overlay-container').find('span[class="text"]:visible').should('contain.text', 'Rimuovere')
        cy.contains('Si').click()

        cy.get('.cdk-overlay-container').find('nx-message-toast')
            .should('be.visible').and('contain.text', 'Membro rimosso dal gruppo')
        cy.wait(5000)
        cy.get('ac-anagrafe-panel').find('div[class="member-name"]')
            .should('be.visible').then((name) => {
                expect(name.text()).to.not.include(membro)
            })
    }

    /**
     * Verifica se il membro è stato eliminato
     * @param {string} membro - nome del membro 
     */
    static checkMembroEliminato(membro) {
        cy.wait(6000)
        cy.get('ac-anagrafe-panel').find('div[class="member-name"]')
            .should('be.visible').then((name) => {
                expect(name.text()).to.not.include(membro)
            })
    }

    /**
     * Verifica che il terzo membro non si possa inserire
     */
    static checkTerzoMembroNonInseribile() {
        cy.contains('Inserisci membro').click()
        cy.get('nx-modal').should('be.visible').then(($modal) => {
            const searchOtherMember = () => {

                cy.generateTwoLetters().then(randomChars => {

                    cy.get('nx-modal').find('div[class="nx-grid"]')
                        .clear().type(randomChars).type('{enter}')
                    cy.wait(3000)
                    const checkSearchIsPresente = $modal.find(':contains("Nessun cliente trovato")').is(':visible')
                    if (checkSearchIsPresente)
                        searchOtherMember()
                })

                cy.get('nx-modal').should('be.visible').then(() => {
                    var listIndex = []

                    cy.get('nx-modal').find('div[class="person ng-star-inserted"]').should('be.visible')
                    cy.get('nx-modal').find('div[class="person ng-star-inserted"]').each(($person, index) => {
                        listIndex.push(index)
                    })
                    cy.get('nx-modal').then(() => {

                        var indexPerson = listIndex[Math.floor(Math.random() * listIndex.length)]
                        cy.get('div[class="person ng-star-inserted"]').should('be.visible')
                        cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson).scrollIntoView().click()

                        cy.get('div[class="selected-person ng-star-inserted"]').should('exist').and('be.visible')
                        cy.wrap($modal).find('span:contains("Aggiungi"):visible').click()

                        cy.get('nx-message-toast').should('be.visible')
                        cy.get('.cdk-overlay-container').find('nx-message-toast').then($overlay => {
                            const checkIsPresente = $overlay.find(':contains("Aderente già presente in altro Gruppo Aziendale.")').is(':visible')
                            const checkError = $overlay.find(':contains("ERROR")').is(':visible')
                            const checkNotImprese = $overlay.find(':contains("In un gruppo aziendale possono esser inserite solamente imprese")').is(':visible')
                            if (checkIsPresente || checkError || checkNotImprese)
                                searchOtherMember()
                            else {
                                cy.get('.cdk-overlay-container').find('nx-message-toast')
                                    .should('be.visible').and('contain.text', 'E\' stato raggiunto il numero massimo di imprese (3) per Nucleo Aziendale')
                                cy.get('nx-modal').find('nx-icon[name="close"]:visible').click()
                            }
                        })
                    })
                })
            }
            searchOtherMember()
        })

    }

    /**
     * Click button Inserisci membro
     */
    static clickInserisciMembro() {
        cy.contains('Inserisci membro').click()
        return new Cypress.Promise((resolve, reject) => {

            cy.get('nx-modal').should('be.visible').then(($modal) => {
                const searchOtherMember = () => {
                    cy.generateTwoLetters().then(randomChars => {
                        cy.get('nx-modal').find('div[class="nx-grid"]')
                            .clear().type(randomChars).type('{enter}')
                        cy.wait(3000)

                        const checkSearchIsPresente = $modal.find(':contains("Nessun cliente trovato")').is(':visible')
                        if (checkSearchIsPresente)
                            searchOtherMember()
                    })
                    cy.get('nx-modal').should('be.visible').then(() => {
                        var listIndex = []
                        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').should('be.visible')
                        cy.get('nx-modal').find('div[class="person ng-star-inserted"]').each(($person, index) => {
                            listIndex.push(index)
                        })
                        cy.get('nx-modal').should('be.visible').then(() => {
                            var name = ''
                            var indexPerson = listIndex[Math.floor(Math.random() * listIndex.length)]
                            cy.wait(5000)

                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson)
                                .find('div[class="name-surname"]').then((textName) => {
                                    name = textName.text()
                                })

                            cy.get('div[class="person ng-star-inserted"]').should('be.visible')
                            cy.wrap($modal).find('div[class="person ng-star-inserted"]').eq(indexPerson).scrollIntoView().click()

                            cy.get('div[class="selected-person ng-star-inserted"]').should('exist').and('be.visible')
                            cy.wrap($modal).find('span:contains("Aggiungi"):visible').click()

                            cy.get('nx-message-toast').should('be.visible')
                            cy.get('.cdk-overlay-container').find('nx-message-toast').then($overlay => {

                                const checkIsPresente = $overlay.find(':contains("Aderente già presente in altro Gruppo Aziendale.")').is(':visible')
                                const checkError = $overlay.find(':contains("ERROR")').is(':visible')
                                const checkNotImprese = $overlay.find(':contains("In un gruppo aziendale possono esser inserite solamente imprese")').is(':visible')

                                if (checkIsPresente || checkError || checkNotImprese)
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

    /**
     * Verifica Gruppo aziendale non è presente (Legami non utilizzabile)
     */
    static checkLegameIsNotPresent() {
        cy.get('ac-anagrafe-panel').should('not.contain.text', 'Crea gruppo')
        cy.get('ac-anagrafe-panel').should('not.contain.text', 'Inserisci membro')
    }
}

export default Legami