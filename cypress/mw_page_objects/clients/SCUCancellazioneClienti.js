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
        getIFrame().contains('Persona fisica').click()
        return new Promise((resolve, reject) => {
            const searchClients = () => {
                getIFrame().find('[class="search-grid-fisica k-grid k-widget"]').then(($table) => {
                    const isTrovato = $table.find('tr:contains("Nessun record da visualizzare.")').is(':visible')
                    if (isTrovato) {
                        cy.generateTwoLetters().then(randomChars => {
                            getIFrame().find('#f-cognome').clear().type(randomChars)
                        })
                        cy.generateTwoLetters().then(randomChars => {
                            getIFrame().find('#f-nome').clear().type(randomChars)
                        })
                        getIFrame().find('input[class="k-button pull-right"]').contains('Cerca').click().wait(2000)

                        searchClients()

                    } else {
                        return
                    }
                })
            }
            searchClients()

            cy.get('#body').then(() => {
                const listIndex = []
                var clienteCF = ''
                var indexCliente = ''
                getIFrame().find('table[role="grid"] > tbody').first().within(() => {
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
                cy.then(() => {
                    cy.get('body').within(() => {
                        getIFrame().find('button:contains("Cancella"):visible').click()

                        getIFrame()
                            .find('div[class="message container"]:contains("Attenzione l\'operazione non è reversibile."):visible')
                            .should('be.visible')
                        getIFrame().find('form[class="buttons"]:visible').contains('Ok').click()

                        getIFrame().find('div[class="message container"]:contains("Cancellazione clienti completata")').should('be.visible')
                        getIFrame().find('form[class="buttons"]:visible').contains('Chiudi').click()

                        cy.get('a[href="/matrix/"]').click()
                        resolve(clienteCF);
                    })

                })
            })
        })
    }

    static eseguiCancellazioneOnPersonaGiuridica() {
        getIFrame().contains('Persona giuridica').click()
        return new Cypress.Promise((resolve, reject) => {
            const searchClients = () => {
                getIFrame().find('div[class="search-grid-giuridica k-grid k-widget"]:visible').then(($table) => {
                    const isTrovato = $table.find('tr:contains("Nessun record da visualizzare."):visible').is(':visible')
                    if (isTrovato) {
                        cy.generateTwoLetters().then(randomChars => {
                            getIFrame().find('#g-denominazione').clear().type(randomChars)
                        })
                        getIFrame().find('input[class="k-button pull-right"]:visible').contains('Cerca').click().wait(2000)

                        searchClients()

                    } else {
                        return
                    }
                })
            }
            searchClients()

            cy.get('#body').then(() => {
                const listIndex = []
                var clienteIVA = ''
                var indexCliente = ''
                getIFrame().find('table[role="grid"]:visible > tbody').first().within(() => {
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
                    cy.get('body').within(() => {
                        getIFrame().find('button:contains("Cancella"):visible').click()

                        getIFrame()
                            .find('div[class="message container"]:contains("Attenzione l\'operazione non è reversibile."):visible')
                            .should('be.visible')
                        getIFrame().find('form[class="buttons"]:visible').contains('Ok').click()

                        getIFrame().find('div[class="message container"]:contains("Cancellazione clienti completata"):visible').should('be.visible')
                        getIFrame().find('form[class="buttons"]:visible').contains('Chiudi').click()

                        cy.get('a[href="/matrix/"]').click()
                        resolve(clienteIVA);
                    })

                })
            })
        })
    }
}

export default SCUCancellazioneClienti