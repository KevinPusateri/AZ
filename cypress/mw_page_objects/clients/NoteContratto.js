/// <reference types="Cypress" />

import Common from "../common/Common"


class NoteContratto {

    /**
     * Verifica inserimento di una nota di contratto
     */
    static inserisciNotaContratto() {
        cy.get('app-contract-card').should('be.visible').as('polizza').should('be.visible').as('polizza')

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
        cy.get('app-contract-card').should('be.visible').as('polizza').first().should('exist').then(($contract) => {
            cy.wrap($contract)
                .find('app-contract-context-menu > nx-icon').click()
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
                    cy.screenshot('Inserimento nota', { capture: 'fullPage' }, { overwrite: true })
                    cy.get('button').find('span:contains("Salva")').first().click().wait(2000)
                })

            })
            Common.canaleFromPopup()

            cy.get('lib-contract-notes-badge').should('exist').and('be.visible')
                .find('[class="badge-label"]:contains("Note")').should('be.visible')

            cy.screenshot('Verifica Badge Nota', { capture: 'fullPage' }, { overwrite: true })


        })
        //#endregion
    }

    /**
     *  Verifica la nota inserita con descrizione presa dal file nota.json
     */
    static checkNotaInserita() {
        cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')
        cy.get('@polizza').first().should('exist').then(() => {

            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                cy.wait(1000);
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')

                        cy.fixture('Nota.json').then((data) => {
                            cy.get('nx-modal-container')
                                .should('be.visible')
                                .and('contain.text', JSON.stringify(data.nota).toUpperCase())
                        })
                    })
                    cy.screenshot('Verifica Nota Inserita', { capture: 'fullPage' }, { overwrite: true })
                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non ?? presente')
                }
            })
        })
    }

    /**
     * Verifica il numero di note dal tooltip
     * @param {string} count - numero di note 
     */
    static checkTooltipNote(count) {
        cy.get('lib-contract-notes-badge').first().should('exist').rightclick()
        if (parseInt(count) === 1) {
            cy.get('#cdk-describedby-message-container').should('exist').and('contain.text', count + ' nota')
            cy.screenshot('Verifica Tooltip 1 Nota Presente', { capture: 'fullPage' }, { overwrite: true })
        }
        else if (parseInt(count) === 3) {
            cy.get('#cdk-describedby-message-container').should('exist').and('contain.text', count + ' note di cui 1 importante')
            cy.screenshot('Verifica Tooltip note Presenti di cui 1 importante', { capture: 'fullPage' }, { overwrite: true })
        }
        else {
            cy.get('#cdk-describedby-message-container').should('exist').and('contain.text', count + ' note')
            cy.screenshot('Verifica Tooltip note Presenti', { capture: 'fullPage' }, { overwrite: true })
        }

    }


    /**
     * Verifica:
     * - si apra la modale
     * - sia presente Aggiungi nota
     * - sia presente il menu contestuale(tre puntini)
     */
    static checkBadgeNota() {
        cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')
        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                cy.wait(1000);
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()
                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('#buttonNewNote').should('exist').and('be.visible').and('contain.text', 'Aggiungi nota')
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .screenshot('Verifica Badge nota presente', { capture: 'fullPage' }, { overwrite: true })
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
                    assert.fail('badge non ?? presente')
                }
            })
        })
    }


    /**
     * Verifica che la nota venga modificata
     */
    static modificaNota() {
        cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')
        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                cy.wait(1000);
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()
                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .find('nx-icon[aria-label="Apri menu"]').first().click()
                        cy.get('button[role="menuitem"]').should('exist').and('be.visible').wait(2000)
                        cy.screenshot('Button Modifica', { capture: 'fullPage' }, { overwrite: true })

                    })

                    cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Modifica Nota')
                        .find('span:contains("Modifica Nota")').click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('lib-note-action-modal').should('exist').and('be.visible').within(() => {
                            cy.get('input[name="title"]').clear().type('TEST NOTA MODIFICATA')
                            cy.get('textarea[name="description"]').clear().type('TEST DESCRIZIONE NOTA MODIFICATA')
                            cy.screenshot('Inizio Modifica Nota', { capture: 'fullPage' }, { overwrite: true })
                            cy.get('button').find('span:contains("Salva modifica")').first().click()
                        })
                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non ?? presente')
                }
            })
        })

        cy.wait(2000)

        cy.get('@polizza').first().should('exist').then(() => {

            cy.get('lib-contract-notes-badge').first().should('exist').and('be.visible').then(($note) => {
                cy.wait(1000);
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
                    cy.screenshot('Verifica nota Modificata', { capture: 'fullPage' }, { overwrite: true })
                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non ?? presente')
                }
            })
        })
    }

    /**
     * Verifica Inserimento di una nota direttamente dal "badge"(icona) Note 
     */
    static inserisciNotaFromBadge() {
        cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')

        cy.get('@polizza').first().should('exist').then(() => {
            cy.get('lib-contract-notes-badge').first().should('exist').then(($note) => {
                if ($note.find("nx-icon").length > 0) {
                    cy.get('lib-contract-notes-badge').should('be.visible')
                    cy.wrap($note).click()

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {

                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .screenshot('Modale Aggiungi nota', { capture: 'fullPage' }, { overwrite: true })
                            .find('button:contains("Aggiungi nota"):visible').click()
                    })

                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('lib-note-action-modal').should('exist').and('be.visible').within(() => {
                            cy.get('input[name="title"]').clear().type('TEST BADGE')
                            cy.get('textarea[name="description"]').clear().type('TEST AGGIUNTO NOTA DA BADGE')
                            cy.screenshot('Inserimento Nota da Badge', { capture: 'fullPage' }, { overwrite: true })
                            cy.get('button').find('span:contains("Salva")').first().click()
                        })
                    })

                    Common.canaleFromPopup()

                    cy.get('nx-modal-container').should('not.exist')
                    cy.wait(2500)
                    cy.get('lib-contract-notes-badge').first().click()
                    cy.get('.cdk-overlay-container').should('be.visible').within(() => {
                        cy.get('div[class="note-content"]').should('exist').and('be.visible')
                        cy.get('nx-modal-container')
                            .should('be.visible')
                            .and('contain.text', 'TEST BADGE')
                            .and('contain.text', 'TEST AGGIUNTO NOTA DA BADGE')
                        cy.screenshot('Nota inserita da Badge', { capture: 'fullPage' }, { overwrite: true })
                    })

                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')

                } else {
                    assert.fail('badge non ?? presente')
                }
            })
        })
    }

    /**
     * Verifica nota con flag Importante sia stato inserito
     */
    static checkImportante() {
        cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')

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
                            cy.screenshot('Nota inserita con flag Importante', { capture: 'fullPage' }, { overwrite: true })
                            cy.get('button').find('span:contains("Salva")').first().click()
                        })
                    })

                    Common.canaleFromPopup()

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
                        cy.screenshot('Verifica Nota con flag Importante inserita', { capture: 'fullPage' }, { overwrite: true })
                    })

                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')

                } else {
                    assert.fail('badge non ?? presente')
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
                    cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')

                    cy.get('@polizza').first().should('exist').then(() => {

                        cy.get('div[class="contract-number"]:first').then((polizzaContract) => {
                            polizza.numberPolizza = polizzaContract.text().split('-')[1].trim()
                        })

                        cy.get('app-lob-bubble').first().within(() => {
                            cy.get('div').first().then(($lobIcon) => {
                                if ($lobIcon.hasClass('icon-bubble motor'))
                                    polizza.lob = 'Auto'
                                else if ($lobIcon.hasClass('icon-bubble life'))
                                    polizza.lob = 'Vita'
                                else if ($lobIcon.hasClass('icon-bubble retail'))
                                    polizza.lob = 'Rami Vari'
                                else
                                    polizza.lob = 'Quadro'

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
        cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')
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
                    cy.screenshot('Verifica Nota Modificata Da Sales corrisponda', { capture: 'fullPage' }, { overwrite: true })
                    cy.get('.cdk-overlay-container').within(() => {
                        cy.get('nx-icon[name="close"]').click()
                    })

                    cy.get('nx-modal-container').should('not.exist')
                } else {
                    assert.fail('badge non ?? presente')
                }
            })
        })
    }

    /**
     * Cancella tutte le note della prima polizza
     */
    static cancellaNote() {
        cy.get('app-contract-card').should('be.visible').as('polizza').should('be.visible')
        cy.get('app-contract-card').should('be.visible').as('polizza').as('polizza')

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
                            cy.screenshot('Inizio Eliminazione Nota', { capture: 'fullPage' }, { overwrite: true })

                        })

                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Elimina Nota')
                            .find('span:contains("Elimina Nota")').click()
                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Stai per eliminare la nota.')
                        cy.get('.cdk-overlay-container').should('be.visible').and('contain.text', 'Elimina Nota')
                        cy.screenshot('Verifica Nota Eliminata', { capture: 'fullPage' }, { overwrite: true })
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