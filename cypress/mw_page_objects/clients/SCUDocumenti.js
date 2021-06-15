/// <reference types="Cypress" />

//#region iFrame
const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getDocumentoPersonale = () => {
    getSCU().find('#documentoPersonaleFrame')
        .iframe()

    let iframeDocumentoPersonale = getSCU().find('#documentoPersonaleFrame')
        .its('0.contentDocument').should('exist')

    return iframeDocumentoPersonale.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class SCUDocumenti {

    static nuovaCartaIdentita() {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("CARTA")').click()
        getSCU().find('#numero-documento').type('AR666')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(1000)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('button:contains("Salva")').click()

        //#region BackEnd Calls
        cy.intercept({
            method: 'POST',
            url: /uploadPdfDocument/
        }).as('uploadPdfDoc')

        cy.intercept({
            method: 'POST',
            url: /previewPdfTemplate/
        }).as('preview')

        cy.intercept({
            method: 'POST',
            url: /uploadMobileDocument/
        }).as('uploadMobileDoc')

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        //#endregion BackEnd Calls

        getDocumentoPersonale().find('#pupload').click()

        const fileName = 'CI_Test.pdf'

        cy.fixture(fileName).then(fileContent => {
            getDocumentoPersonale().find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })

        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }

    static nuovaPatente() {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("PATENTE")').click()
        getSCU().find('#numero-documento').type('U1H851592X')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('span[aria-owns="descrizione-documento-patente_listbox"]').click()
        getSCU().find('li:contains("B")').click({ multiple: true })
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(1000)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('button:contains("Salva")').click()

        //#region BackEnd Calls
        cy.intercept({
            method: 'POST',
            url: /uploadPdfDocument/
        }).as('uploadPdfDoc')

        cy.intercept({
            method: 'POST',
            url: /previewPdfTemplate/
        }).as('preview')

        cy.intercept({
            method: 'POST',
            url: /uploadMobileDocument/
        }).as('uploadMobileDoc')
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        //#endregion BackEnd Calls

        getDocumentoPersonale().find('#pupload').click()

        const fileName = 'CI_Test.pdf'

        cy.fixture(fileName).then(fileContent => {
            getDocumentoPersonale().find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })

        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }

    static nuovoPassaporto() {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("PASSAPORTO")').click()
        getSCU().find('#numero-documento').type('123456789')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(1000)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('button:contains("Salva")').click()

        //#region BackEnd Calls
        cy.intercept({
            method: 'POST',
            url: /uploadPdfDocument/
        }).as('uploadPdfDoc')

        cy.intercept({
            method: 'POST',
            url: /previewPdfTemplate/
        }).as('preview')

        cy.intercept({
            method: 'POST',
            url: /uploadMobileDocument/
        }).as('uploadMobileDoc')
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        //#endregion BackEnd Calls

        getDocumentoPersonale().find('#pupload').click()

        const fileName = 'CI_Test.pdf'

        cy.fixture(fileName).then(fileContent => {
            getDocumentoPersonale().find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })

        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }

    static nuovoPortoArmi() {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("ARMI")').click()
        getSCU().find('#numero-documento').type('123456789')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(1000)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('button:contains("Salva")').click()

        //#region BackEnd Calls
        cy.intercept({
            method: 'POST',
            url: /uploadPdfDocument/
        }).as('uploadPdfDoc')

        cy.intercept({
            method: 'POST',
            url: /previewPdfTemplate/
        }).as('preview')

        cy.intercept({
            method: 'POST',
            url: /uploadMobileDocument/
        }).as('uploadMobileDoc')
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        //#endregion BackEnd Calls

        getDocumentoPersonale().find('#pupload').click()

        const fileName = 'CI_Test.pdf'

        cy.fixture(fileName).then(fileContent => {
            getDocumentoPersonale().find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })

        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }

    static nuovaTesseraPostale () {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("POSTALE")').click()
        getSCU().find('#numero-documento').type('123456789')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(1000)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('button:contains("Salva")').click()

        //#region BackEnd Calls
        cy.intercept({
            method: 'POST',
            url: /uploadPdfDocument/
        }).as('uploadPdfDoc')

        cy.intercept({
            method: 'POST',
            url: /previewPdfTemplate/
        }).as('preview')

        cy.intercept({
            method: 'POST',
            url: /uploadMobileDocument/
        }).as('uploadMobileDoc')
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        //#endregion BackEnd Calls

        getDocumentoPersonale().find('#pupload').click()

        const fileName = 'CI_Test.pdf'

        cy.fixture(fileName).then(fileContent => {
            getDocumentoPersonale().find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })

        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }

    static nuovoAltroDocumento () {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("ALTRO")').click()
        getSCU().find('#autorita-rilascio').type('CLERO')
        getSCU().find('#numero-documento').type('123456789')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(500)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('#descrizione-documento').type('AUTORIZZAZIONE ESORCISMI')
        getSCU().find('button:contains("Salva")').click()

        //#region BackEnd Calls
        cy.intercept({
            method: 'POST',
            url: /uploadPdfDocument/
        }).as('uploadPdfDoc')

        cy.intercept({
            method: 'POST',
            url: /previewPdfTemplate/
        }).as('preview')

        cy.intercept({
            method: 'POST',
            url: /uploadMobileDocument/
        }).as('uploadMobileDoc')
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        //#endregion BackEnd Calls

        getDocumentoPersonale().find('#pupload').click()

        const fileName = 'CI_Test.pdf'

        cy.fixture(fileName).then(fileContent => {
            getDocumentoPersonale().find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })

        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }
}

export default SCUDocumenti