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
        getSCU().find('h4:contains("Riepilogo")').click()
        cy.screenshot('Riepilogo Carta Identita', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
        getDocumentoPersonale().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })
        cy.screenshot('Carta d\'identita Caricato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(10000)
    }

    static nuovaPatente() {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("PATENTE")').click()
        getSCU().find('#numero-documento').type('U1H851592X')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('span[aria-owns="descrizione-documento-patente_listbox"]').click()
        getSCU().find('#descrizione-documento-patente_listbox > li:contains("B")').click()
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(1000)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('h4:contains("Riepilogo")').click()
        cy.screenshot('Riepilogo Patente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
        getDocumentoPersonale().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })
        cy.screenshot('Patente Caricato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait(10000)

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
        getSCU().find('h4:contains("Riepilogo")').click()
        cy.screenshot('Riepilogo Passaporto', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
        getDocumentoPersonale().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })
        cy.screenshot('Passaporto Caricato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait(10000)

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
        getSCU().find('h4:contains("Riepilogo")').click()
        cy.screenshot('Riepilogo Porto d\'armi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
        getDocumentoPersonale().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })
        cy.screenshot('Porto armi caricato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait(10000)

    }

    static nuovaTesseraPostale() {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("POSTALE")').click()
        getSCU().find('#numero-documento').type('123456789')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012025')
        getSCU().find('#luogo-emissione').type('TRIESTE')
        cy.wait(1000)
        getSCU().find('li:contains("TRIESTE")').click()
        getSCU().find('h4:contains("Riepilogo")').click()
        cy.screenshot('Riepilogo Tessera Postale', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
        getDocumentoPersonale().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })
        cy.screenshot('Tessera postale caricato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait(10000)

    }

    static nuovoAltroDocumento() {
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
        getSCU().find('h4:contains("Riepilogo")').click()
        cy.screenshot('Riepilogo Altro Documento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
        getDocumentoPersonale().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })
        cy.screenshot('Altro documento caricato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
        cy.wait(10000)

    }
}

export default SCUDocumenti