/// <reference types="Cypress" />

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class SCUCancellazioneClienti {

    static eseguiCancellazioneOnPersonaFisica() {
        cy.get('@iframe').contains('Persona fisica').click()
        cy.get('#body').should('be.visible').as('body')
        cy.get('@iframe').find('#tabstrip-1').should('be.visible')

        return new Cypress.Promise((resolve, reject) => {
            const loop = () => {

                 const searchClients = () => {
                    cy.getIFrame().find('[class="search-grid-fisica k-grid k-widget"]').should('be.visible').then(($table) => {
                        const isTrovato = $table.find('tr:contains("Nessun record da visualizzare.")').is(':visible')
                        if (isTrovato) {
                            cy.generateTwoLetters().then(randomChars => {
                                cy.getIFrame().find('#f-cognome').clear().type(randomChars)
                            })
                            cy.generateTwoLetters().then(randomChars => {
                                cy.getIFrame().find('#f-nome').clear().type(randomChars)
                            })
                            cy.getIFrame().find('input[class="k-button pull-right"]').contains('Cerca').click().wait(2000)

                            searchClients()

                        } else {
                            return
                        }
                    })
                }
                searchClients()

                cy.get('@body').then(() => {
                    const listIndex = []
                    var clienteCF = ''
                    var indexCliente = ''
                    cy.getIFrame().find('table[role="grid"] > tbody').first().within(() => {
                        cy.get('tr').each(($ele, index) => {
                            cy.wrap($ele).find('td').eq(3).invoke('text').then((textState) => {
                                if (textState === "P") {
                                    listIndex.push(index)
                                }
                            })
                        })

                        cy.get('tr').then(($tr) => {
                            indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]
                            cy.wait(2000)
                            cy.wrap($tr).eq(indexCliente).find('td').eq(4).click()
                            cy.wrap($tr).eq(indexCliente).find('td').eq(1).invoke('text').then(clientCfText => {
                                clienteCF = clientCfText;
                                cy.log(clienteCF)
                            })
                        })
                    })
                    cy.get('@body').within(() => {
                        cy.getIFrame().find('button:contains("Cancella"):visible').click()

                        cy.getIFrame()
                            .find('div[class="message container"]:contains("Attenzione l\'operazione non è reversibile."):visible')
                            .should('be.visible')
                        cy.getIFrame().find('form[class="buttons"]:visible').contains('Ok').click().wait(4000)

                        cy.getIFrame()
                            .find('div[class="message container"]:visible').should('be.visible').then((messaggio) => {
                                let message = messaggio.text()
                                if (message.includes('Il cliente è un titolare effettivo')) {
                                    cy.getIFrame().find('button[class="k-button"]:contains("Chiudi"):visible').click()
                                    loop()

                                } else {
                                    cy.getIFrame().find('div[class="message container"]:contains("Cancellazione clienti completata")').should('be.visible')
                                    cy.getIFrame().find('form[class="buttons"]:visible').contains('Chiudi').click()

                                    cy.get('a[href="/matrix/"]').click()
                                    resolve(clienteCF);
                                }
                            })
                    })

                })
            }
            loop()
        })
    }

    
    static eseguiCancellazioneOnPersonaGiuridica() {
        cy.getIFrame()
        cy.get('@iframe').contains('Persona giuridica').click()
        cy.get('#body').as('body')
        cy.get('@iframe').find('#tabstrip-2').should('be.visible')

        return new Cypress.Promise((resolve, reject) => {
            const loop = () => {

                const searchClients = () => {
                    cy.getIFrame().find('div[class="search-grid-giuridica k-grid k-widget"]').should('be.visible').then(($table) => {
                            cy.wait(3000)
                        const isTrovato = $table.find('tr:contains("Nessun record da visualizzare.")').is(':visible')
                        if (isTrovato) {
                            cy.generateTwoLetters().then(randomChars => {
                                cy.getIFrame().find('#g-denominazione').clear().type(randomChars)
                            })
                            cy.getIFrame().find('input[class="k-button pull-right"]:visible').contains('Cerca').click().wait(3000)
                            searchClients()

                        } else {
                            return
                        }
                    })
                }
                searchClients()

                cy.get('@body').then(() => {
                    const listIndex = []
                    var clienteIVA = ''
                    var indexCliente = ''
                    cy.getIFrame().find('table[role="grid"]:visible > tbody').first().within(() => {
                        cy.get('tr').each(($ele, index) => {
                            cy.wrap($ele).find('td').eq(3).invoke('text').then((textState) => {
                                if (textState === "P") {
                                    listIndex.push(index)
                                }
                            })
                        })

                        cy.get('tr').then(($tr) => {
                            indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]
                            cy.wait(2000)
                            cy.wrap($tr).eq(indexCliente).find('td').eq(4).click()
                            cy.wrap($tr).eq(indexCliente).find('td').eq(1).invoke('text').then(clientIVAText => {
                                clienteIVA = clientIVAText;
                                cy.log(clienteIVA)
                            })
                        })
                    })
                    cy.then(() => {
                        cy.get('@body').within(() => {
                            cy.getIFrame().find('button:contains("Cancella"):visible').click()

                            cy.getIFrame()
                                .find('div[class="message container"]:contains("Attenzione l\'operazione non è reversibile."):visible')
                                .should('be.visible')
                            cy.getIFrame().find('form[class="buttons"]:visible').contains('Ok').click()

                            cy.getIFrame()
                                .find('div[class="message container"]:visible').should('be.visible').then((messaggio) => {
                                    let message = messaggio.text()
                                    if (message.includes('Il cliente è un titolare effettivo') ||
                                        message.includes('Il cliente è in relazione con almeno una polizza')) {
                                        cy.getIFrame().find('button[class="k-button"]:contains("Chiudi"):visible').click()
                                        loop()

                                    } else {
                                        cy.getIFrame().find('div[class="message container"]:contains("Cancellazione clienti completata"):visible').should('be.visible')
                                        cy.getIFrame().find('form[class="buttons"]:visible').contains('Chiudi').click()

                                        cy.get('a[href="/matrix/"]').click()
                                        resolve(clienteIVA);
                                    }

                                })
                        })
                    })
                })
            }
            loop()
        })
    }
}

export default SCUCancellazioneClienti