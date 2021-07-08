/// <reference types="Cypress" />

class DettaglioAnagrafica {


    static checkLinksSubTabs() {
        const tabAnagrafica = [
            'Dati anagrafici',
            'Altri contatti',
            'Altri indirizzi',
            'Documenti',
            'Legami',
            'Conti correnti',
            'Convenzioni'
        ]
        cy.get('nx-tab-header').find('button').each(($checkTabAnagrafica, i) => {
            expect($checkTabAnagrafica.text().trim()).to.include(tabAnagrafica[i]);
        })
    }

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

        cy.contains(subTab).click({force:true})
        cy.wait('@gqlClient', { requestTimeout: 30000 });
    }

    static checkSubTabDatiAnagrafici() {
        cy.get('app-section-title').find('.title:contains("Dati principali persona fisica"):visible')
        cy.get('app-physical-client-main-data').find('button:contains("Modifica dati cliente"):visible')
        cy.get('app-client-risk-profiles').find('.title:contains("Identificazione e adeguata verifica"):visible')
        cy.get('app-client-consents-accordion').find('.title:contains("Consensi"):visible')
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza').click()
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza AGL').click()
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza Leben').click()
        cy.get('app-section-title').find('.title:contains("Residenza anagrafica"):visible')
        cy.get('app-section-title').find('.title:contains("Domicilio"):visible')
        cy.get('app-section-title').find('.title:contains("Numero di telefono principale"):visible')
        cy.get('app-section-title').find('.title:contains("Email"):visible')
        cy.get('app-section-title').find('.title:contains("Documento principale"):visible')
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

    static checkCampiDatiAnagrficiPF() {
        cy.get('app-physical-client-main-data').find('[class="box-unico"]').then((box) => {
            cy.wrap(box).find('app-section-title').should('contain.text', 'Dati principali persona fisica')
            cy.wrap(box).find('button[class="button-edit-client nx-button--primary nx-button--small-medium"]')
                .should('contain.text', 'Modifica dati cliente')
            cy.get('app-physical-client-main-data').find('[class="label"]').then((text) => {
                expect(text.text().trim()).to.include('Titolo');
            })

        })
    }

}

export default DettaglioAnagrafica