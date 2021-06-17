/// <reference types="Cypress" />

class DettaglioAnagrafica {

    static verificaDatiDettaglioAnagrafica(cliente) {

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        })
        cy.contains('DETTAGLIO ANAGRAFICA').click()

        cy.wait('@gqlClient', { requestTimeout: 30000 })

        if (cliente.isPEC)
            cy.contains('Invio documento via PEC')
                .parent('div')
                .get('nx-icon').should('have.class', 'nx-icon--s nx-icon--check-circle color-true')
    }

    static aggiungiDocumento() {
        cy.contains('Aggiungi documento').click()
    }

    static checkDocumento(documentType) {
        return new Promise((resolve, reject) => {
            cy.get('body')
                .then(body => {
                    if (body.find('div:contains("' + documentType + '")').length > 0)
                        resolve(true)
                    else
                        resolve(false)
                })
        })
    }

    static modificaCliente() {
        cy.contains('DETTAGLIO ANAGRAFICA').click()
        cy.contains('Modifica dati cliente').click()
    }

    static sezioneDocumenti() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        debugger
        cy.contains('DETTAGLIO ANAGRAFICA').click()
        cy.contains('Documenti').click()

        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }

    static clickTabDettaglioAnagrafica() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        });

        cy.contains('DETTAGLIO ANAGRAFICA').click()

        cy.wait('@gqlClient', { requestTimeout: 30000 });
    }

    /**
     * Click sub-tab
     * @param {string} subTab - nome sel subTab  
     */
    static clickSubTab(subTab) {

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        });

        cy.contains(subTab).click()
        cy.wait('@gqlClient', { requestTimeout: 30000 });
    }


    /**
     * Verifica contatto creato sia presente
     * @param {string} contatto - Object contatto creato
     */
    static checkContatti(contatto) {
        cy.then(() => {
            cy.get('app-client-other-contacts').find('app-client-contact-table-row').then((list) => {
                console.log(list.text())
                expect(list.text()).to.include(contatto.tipo)
                expect(list.text()).to.include(contatto.principale)
                if (contatto.tipo === 'E-Mail' || contatto.tipo === 'PEC') {
                    expect(list.text()).to.include(contatto.email)
                } else if (contatto.tipo === 'Sito Web') {
                    expect(list.text()).to.include(contatto.url)
                } else {
                    expect(list.text()).to.include(contatto.prefissoInt)
                    expect(list.text()).to.include(contatto.prefisso)
                    expect(list.text()).to.include(contatto.phone)
                    expect(list.text()).to.include(contatto.orario)
                }
            })
        })
    }

}

export default DettaglioAnagrafica