/// <reference types="Cypress" />


class NoteContratto {

    /**
     * Verifica inserimento di una nota di contratto
     */
    static inserisciNotaContratto() {
        cy.get('app-contract-card').should('be.visible')
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

        //#region Loop elimina le note se presenti
        const loopDeleteNotes = () => {
            cy.wait(3000)
            cy.get('@polizza').first().should('exist').then(() => {
                cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                    if ($note.find("nx-icon").length > 0) {
                        cy.get('lib-contract-notes-badge').should('be.visible')
                        cy.wrap($note).click()

                        cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                            cy.get('div[class="note-content"]').should('exist').and('be.visible')
                            cy.get('nx-modal-container')
                                .should('be.visible')
                                .find('nx-icon[aria-label="Apri menu"]').first().click()
                            cy.get('button[role="menuitem"]').should('exist').and('be.visible')
                        })

                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Elimina Nota')
                            .find('span:contains("Elimina Nota")').click()
                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Stai per eliminare la nota.')
                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Elimina Nota')
                        cy.get('lib-note-action-modal').find('span:contains("Elimina Nota")').click()

                        loopDeleteNotes()
                    }

                })

            })
        }
        loopDeleteNotes()
        cy.get('nx-icon[name="product-board-paper-note"]').should('not.exist')
        //#endregion

        //#region Aggiungi una nota di contratto 
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').first().should('exist').then(($contract) => {
            cy.wrap($contract)
                .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h ellipsis-icon"]').click()
            cy.get('.cdk-overlay-container').should('contain.text', 'Note di contratto').within(($overlay) => {
                cy.get('button').should('be.visible')
                cy.wrap($overlay).find('button:contains("Note di contratto")').click()
            })
            cy.get('nx-modal-container').should('be.visible').within(() => {
                cy.get('button').find('span:contains("Aggiungi nota")').click()
            })

            cy.get('.cdk-overlay-container').should('be.visible')
            cy.get('lib-note-action-modal').should('be.visible').within(() => {
                cy.get('span').should('be.visible').and('contain.text', 'Salva')
                cy.get('input[name="title"]').should('be.visible').type('Test Nota')

                cy.fixture('Nota.json').then((data) => {
                    cy.get('textarea[name="description"]').should('be.visible').type(JSON.stringify(data.nota))
                    cy.get('button').find('span:contains("Salva")').first().click()
                })

            })
            // cy.get('lib-note-action-modal').should('be.visible').within(() => {
            //TODO: Verifica se c'è disamgiguaione allotra fai altrimenti no 
            cy.get('body').then($body => {
                cy.get('nx-modal-container').should('be.visible')
                if ($body.find('nx-modal-container').length > 0) {
                    cy.wait(2000)
                    cy.get('div[ngclass="agency-row"]').should('be.visible')
                    cy.get('div[ngclass="agency-row"]').first().click()
                }
            })
            // cy.get('lib-disambiguation').should('be.visible').find('div[ngclass="agency-row"]').first().click()
            // })

            cy.get('lib-contract-notes-badge').should('exist').and('be.visible')
                .find('[class="badge-label"]:contains("Note")').should('be.visible')

        })
        //#endregion
    }

    /**
     * Verifica il numero di note dal tooltip
     * @param {string} count - numero di note 
     */
    static checkTooltipNote(count) {
        if (parseInt(count) === 1)
            cy.get('#cdk-describedby-message-container').should('exist').and('contain.text', count + ' nota')
        else if (parseInt(count) === 3)
            cy.get('#cdk-describedby-message-container').should('exist').and('contain.text', count + ' note di cui 1 importante')
        else
            cy.get('#cdk-describedby-message-container').should('exist').and('contain.text', count + ' note')


    }


    /**
     * Verifica:
     * - si apra la modale
     * - sia presente Aggiungi nota
     * - sia presente il menu contestuale(tre puntini)
     */
    static checkBadgeNota() {
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')
        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                cy.wait(1000)
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()
                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('#buttonNewNote').should('exist').and('be.visible').and('contain.text', 'Aggiungi nota')
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .find('nx-icon[aria-label="Apri menu"]').first().click()
                        cy.get('button[role="menuitem"]').should('exist').and('be.visible')

                    })
                    cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Elimina Nota')
                    cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Modifica Nota')

                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non è presente')
                }
            })
        })
    }


    /**
     * Verifica che la nota venga modificata
     */
    static modificaNota() {
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')
        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                cy.wait(1000)
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()
                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .find('nx-icon[aria-label="Apri menu"]').first().click()
                        cy.get('button[role="menuitem"]').should('exist').and('be.visible')

                    })

                    cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Modifica Nota')
                        .find('span:contains("Modifica Nota")').click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('lib-note-action-modal').should('exist').and('be.visible').within(() => {
                            cy.get('input[name="title"]').clear().type('TEST NOTA MODIFICATA')
                            cy.get('textarea[name="description"]').clear().type('TEST DESCRIZIONE NOTA MODIFICATA')
                            cy.get('button').find('span:contains("Salva modifica")').first().click()

                        })

                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non è presente')
                }
            })
        })

        cy.get('@polizza').first().should('exist').then(() => {

            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                cy.wait(1000)
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .and('contain.text', 'TEST NOTA MODIFICA')
                            .and('contain.text', 'TEST DESCRIZIONE NOTA MODIFICATA')
                    })
                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non è presente')
                }
            })
        })
    }

    /**
     * Verifica Inserimento di una nota direttamente dal "badge"(icona) Note 
     */
    static inserisciNotaFromBadge() {
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .find('button:contains("Aggiungi nota"):visible').click()
                    })

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('lib-note-action-modal').should('exist').and('be.visible').within(() => {
                            cy.get('input[name="title"]').clear().type('TEST BADGE')
                            cy.get('textarea[name="description"]').clear().type('TEST AGGIUNTO NOTA DA BADGE')
                            cy.get('button').find('span:contains("Salva")').first().click()
                        })
                    })

                    cy.get('lib-note-action-modal').should('be.visible').within(() => {
                        cy.get('lib-disambiguation').find('div[ngclass="agency-row"]').first().click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                    cy.wait(2500)
                    cy.get('lib-contract-notes-badge').first().click()
                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .and('contain.text', 'TEST BADGE')
                            .and('contain.text', 'TEST AGGIUNTO NOTA DA BADGE')
                    })

                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')

                } else {
                    assert.fail('badge non è presente')
                }
            })
        })
    }

    /**
     * Verifica nota con flag Importante sia stato inserito
     */
    static checkImportante() {
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .find('button:contains("Aggiungi nota"):visible').click()
                    })

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('lib-note-action-modal').should('exist').and('be.visible').within(() => {
                            cy.get('input[name="title"]').clear().type('TEST IMPORTANTE')
                            cy.get('textarea[name="description"]').clear().type('TEST AGGIUNTO NOTA IMPORTANTE')
                            cy.get('span[class="nx-checkbox__control"]').click()
                            cy.get('button').find('span:contains("Salva")').first().click()
                        })
                    })

                    cy.get('lib-note-action-modal').should('be.visible').within(() => {
                        cy.get('lib-disambiguation').find('div[ngclass="agency-row"]').first().click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                    cy.wait(2500)
                    cy.get('lib-contract-notes-badge').first().click()
                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .and('contain.text', 'TEST IMPORTANTE')
                            .and('contain.text', 'TEST AGGIUNTO NOTA IMPORTANTE')
                        cy.get('[class="important-icon ng-star-inserted"]').should('contain.text', '!')
                    })

                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')

                } else {
                    assert.fail('badge non è presente')
                }
            })
        })
    }

    /**
     * Ritorna l'oggetto polizza con numero e tipo di polizza
     * @returns {object} polizza = { numebrPolizza, lob}
     * numberPolizza -> numero della polizz
     * lob -> Rami Vari/Auto/Vita
     */
    static getPolizza() {
        return new Cypress.Promise((resolve, reject) => {
            cy.get('body')
                .then(() => {
                    const polizza = {
                        numberPolizza: '',
                        lob: ''
                    }
                    cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

                    cy.get('@polizza').first().should('exist').then(() => {

                        cy.get('div[class="contract-number"]:first').then((polizzaContract) => {
                            polizza.numberPolizza = polizzaContract.text().split('-')[1].trim()
                        })

                        cy.get('app-lob-bubble').first().within(() => {
                            cy.get('div').first().then(($lobIcon) => {
                                if ($lobIcon.hasClass('icon-bubble motor'))
                                    polizza.lob = 'Auto'
                                if ($lobIcon.hasClass('icon-bubble life'))
                                    polizza.lob = 'Vita'
                                if ($lobIcon.hasClass('icon-bubble retail'))
                                    polizza.lob = 'Rami Vari'
                            })
                        })

                        cy.then(() => {
                            cy.log('Retrived Polizza : ' + polizza)
                            resolve(polizza)
                        })
                    })

                })
        })
    }


    /**
     * Verifica dal badge delle note la modifica effettuata
     * @param {string} testo - titolo o testo modificato 
     */
    static checkNotaModificata(testo) {
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')
        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .and('contain.text', testo)
                    })
                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non è presente')
                }
            })
        })
    }

    /**
     * Cancella tutte le note della prima polizza
     */
    static cancellaNote() {
        cy.get('app-contract-card').should('be.visible')
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

        //#region Loop elimina le note se presenti
        const loopDeleteNotes = () => {
            cy.wait(3000)
            cy.get('@polizza').first().should('exist').then(() => {
                cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                    if ($note.find("nx-icon").length > 0) {
                        cy.get('lib-contract-notes-badge').should('be.visible')
                        cy.wrap($note).click()

                        cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                            cy.get('div[class="note-content"]').should('exist').and('be.visible')
                            cy.get('nx-modal-container')
                                .should('be.visible')
                                .find('nx-icon[aria-label="Apri menu"]').first().click()
                            cy.get('button[role="menuitem"]').should('exist').and('be.visible')
                        })

                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Elimina Nota')
                            .find('span:contains("Elimina Nota")').click()
                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Stai per eliminare la nota.')
                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Elimina Nota')
                        cy.get('lib-note-action-modal').find('span:contains("Elimina Nota")').click()

                        loopDeleteNotes()
                    }

                })

            })
        }
        loopDeleteNotes()
        cy.get('nx-icon[name="product-board-paper-note"]').should('not.exist')
    }
}
export default NoteContratto