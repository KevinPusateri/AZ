/// <reference types="Cypress" />

import Common from "../common/Common";

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
class SCUCancellazioneClienti {

    static eseguiCancellazioneOnPersonaFisica() {
        Common.clickByTextOnIframe('Persona fisica')

        Common.clickByIdOnIframe('#tabstrip-1')

        return new Cypress.Promise((resolve, reject) => {
            const loop = () => {

                const searchClients = () => {
                    Common.getByIdOnIframe('[class="search-grid-fisica k-grid k-widget"]').then(($table) => {

                        const isTrovato = $table.find('tr:contains("Nessun record da visualizzare")').is(':visible')
                        if (isTrovato) {
                            cy.generateTwoLetters().then(randomChars => {
                                Common.getByIdWithTypeOnIframe('#f-cognome', randomChars)
                            })
                            cy.generateTwoLetters().then(randomChars => {
                                Common.getByIdWithTypeOnIframe('#f-nome', randomChars)
                            })
                            Common.clickByIdOnIframe('input[value="Cerca"]:visible').wait(2000)

                            searchClients()

                        } else {
                            return
                        }
                    })
                }
                searchClients()

                Common.getById('#body').then(() => {
                    const listIndex = []
                    var clienteCF = ''
                    var indexCliente = ''
                    Common.findByIdOnIframe('table[role="grid"] > tbody').first().within(() => {
                        Common.getById('tr').each(($ele, index) => {
                            listIndex.push(index)
                        })

                        Common.getById('tr').then(($tr) => {
                            indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]
                            cy.wait(2000)
                            cy.wrap($tr).eq(indexCliente).find('td').eq(5).find('input').click()
                            cy.wrap($tr).eq(indexCliente).find('td').eq(2).find('span[class="value"]:first')
                                .invoke('text').then(clientCfText => {
                                    clienteCF = clientCfText;
                                    cy.log(clienteCF)
                                    resolve(clienteCF);
                                })

                        })
                    })
                    cy.screenshot('Cliente da Cancellare', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    Common.getById('#body').within(() => {
                        Common.getByIdOnIframe('div[class="selected-grid-fisica k-grid k-widget"]').and('include.text', clienteCF)
                        Common.clickFindByIdOnIframe('button:contains("Cancella"):visible')
                    })

                    Common.getById('#body').within(() => {
                        Common.getByIdOnIframe('div[class="modal-body"]').and('contain.text', 'Attenzione l\'operazione non è reversibile.Confermi di voler cancellare questi clienti?')
                        Common.clickByTextOnIframe('Ok').wait(4000)
                    })

                    Common.getById('#body').within(() => {
                        Common.clickFindByIdOnIframe('button:contains("Chiudi"):visible')
                    })

                })
            }
            loop()
        })
    }


    static eseguiCancellazioneOnPersonaGiuridica() {
        Common.clickByTextOnIframe('Persona giuridica')

        Common.clickByIdOnIframe('#tabstrip-2')

        return new Cypress.Promise((resolve, reject) => {
            const loop = () => {

                const searchClients = () => {
                    Common.getByIdOnIframe('div[class="search-grid-giuridica k-grid k-widget"]').then(($table) => {

                        cy.wait(3000)
                        const isTrovato = $table.find('tr:contains("Nessun record da visualizzare")').is(':visible')
                        if (isTrovato) {
                            cy.generateTwoLetters().then(randomChars => {
                                Common.getByIdWithTypeOnIframe('#g-denominazione', randomChars)

                            })
                            Common.clickByIdOnIframe('input[value="Cerca"]:visible').wait(2000)

                            searchClients()

                        } else {
                            return
                        }
                    })
                }
                searchClients()

                Common.getById('#body').then(() => {
                    const listIndex = []
                    var clienteIVA = ''
                    var indexCliente = ''
                    Common.findByIdOnIframe('table[role="grid"]:visible > tbody').first().within(() => {

                        Common.getById('tr').each(($ele, index) => {
                            listIndex.push(index)
                        })

                        Common.getById('tr').then(($tr) => {
                            indexCliente = listIndex[Math.floor(Math.random() * listIndex.length)]
                            cy.wait(2000)
                            cy.wrap($tr).eq(indexCliente).find('td').eq(5).find('input').click()
                            cy.wrap($tr).eq(indexCliente).find('td').eq(2).find('span[class="value"]:first')
                                .invoke('text').then(clientIVAText => {
                                    clienteIVA = clientIVAText;
                                    cy.log(clienteIVA)
                                    resolve(clienteIVA);
                                })
                        })
                    })
                    cy.screenshot('Cliente da Cancellare', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    Common.getById('#body').within(() => {
                        Common.getByIdOnIframe('div[class="selected-grid-giuridica k-grid k-widget"]').and('include.text', clienteIVA)
                        Common.clickFindByIdOnIframe('button:contains("Cancella"):visible')
                    })

                    Common.getById('#body').within(() => {
                        Common.getByIdOnIframe('div[class="modal-body"]').and('contain.text', 'Attenzione l\'operazione non è reversibile.Confermi di voler cancellare questi clienti?')
                        Common.clickByTextOnIframe('Ok').wait(4000)
                    })

                    Common.getById('#body').within(() => {
                        Common.getByIdOnIframe('div[class="modal-dialog"]').and('contain.text', 'Cancellazione clienti completata')
                        Common.clickByIdOnIframe('button:contains("Chiudi"):visible').wait(4000)
                    })
                })
            }
            loop()
        })
    }
}

export default SCUCancellazioneClienti