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
        cy.getIFrame()
        cy.get('@iframe').contains('Persona fisica').click()
        cy.get('#body').should('be.visible').as('body')
        cy.get('@iframe').find('#tabstrip-1').should('be.visible')

        return new Cypress.Promise((resolve, reject) => {
            const loop = () => {

                 const searchClients = () => {
                    cy.get('@iframe').find('[class="search-grid-fisica k-grid k-widget"]').should('be.visible').then(($table) => {
                        const isTrovato = $table.find('tr:contains("Nessun record da visualizzare.")').is(':visible')
                        if (isTrovato) {
                            cy.generateTwoLetters().then(randomChars => {
                                cy.get('@iframe').find('#f-cognome').clear().type(randomChars)
                            })
                            cy.generateTwoLetters().then(randomChars => {
                                cy.get('@iframe').find('#f-nome').clear().type(randomChars)
                            })
                            cy.get('@iframe').find('input[class="k-button pull-right"]').contains('Cerca').click().wait(2000)

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
                    cy.get('@iframe').find('table[role="grid"] > tbody').first().within(() => {
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
                                resolve(clienteCF);
                            })
                        })
                    })
                    cy.get('@body').within(() => {
                        cy.get('@iframe').find('button:contains("Cancella"):visible').click()

                        cy.get('@iframe')
                            .find('div[class="message container"]:contains("Attenzione l\'operazione non è reversibile."):visible')
                            .should('be.visible')
                        cy.get('@iframe').find('form[class="buttons"]:visible').contains('Ok').click().wait(4000)

                        cy.get('@iframe')
                            .find('div[class="message container"]:visible').should('be.visible').then((messaggio) => {
                                let message = messaggio.text()
                                if (message.includes('Il cliente è un titolare effettivo')) {
                                    cy.get('@iframe').find('button[class="k-button"]:contains("Chiudi"):visible').click()
                                    loop()

                                } else {
                                    cy.get('@iframe').find('div[class="message container"]:contains("Cancellazione clienti completata")').should('be.visible')
                                    cy.get('@iframe').find('form[class="buttons"]:visible').contains('Chiudi').click()
                                    cy.get('a[href="/matrix/"]').click()
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
                    cy.get('@iframe').find('div[class="search-grid-giuridica k-grid k-widget"]').should('be.visible').then(($table) => {
                            cy.wait(3000)
                        const isTrovato = $table.find('tr:contains("Nessun record da visualizzare.")').is(':visible')
                        if (isTrovato) {
                            cy.generateTwoLetters().then(randomChars => {
                                cy.get('@iframe').find('#g-denominazione').clear().type(randomChars)
                            })
                            cy.get('@iframe').find('input[class="k-button pull-right"]:visible').contains('Cerca').click().wait(3000)
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
                    cy.get('@iframe').find('table[role="grid"]:visible > tbody').first().within(() => {
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
                                resolve(clienteIVA);
                            })
                        })
                    })
                    cy.then(() => {
                        cy.get('@body').within(() => {
                            cy.get('@iframe').find('button:contains("Cancella"):visible').click()

                            cy.get('@iframe')
                                .find('div[class="message container"]:contains("Attenzione l\'operazione non è reversibile."):visible')
                                .should('be.visible')
                            cy.get('@iframe').find('form[class="buttons"]:visible').contains('Ok').click()

                            cy.get('@iframe')
                                .find('div[class="message container"]:visible').should('be.visible').then((messaggio) => {
                                    let message = messaggio.text()
                                    if (message.includes('Il cliente è un titolare effettivo') ||
                                        message.includes('Il cliente è in relazione con almeno una polizza')) {
                                        cy.get('@iframe').find('button[class="k-button"]:contains("Chiudi"):visible').click()
                                        loop()

                                    } else {
                                        cy.get('@iframe').find('div[class="message container"]:contains("Cancellazione clienti completata"):visible').should('be.visible')
                                        cy.get('@iframe').find('form[class="buttons"]:visible').contains('Chiudi').click()

                                        cy.get('a[href="/matrix/"]').click()
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