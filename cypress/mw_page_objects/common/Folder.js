/// <reference types="Cypress" />

//#region iFrame
const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getFolder = () => {
    getSCU().find('iframe[class="w-100"]')
        .iframe()

    let iframeFolder = getSCU().find('iframe[class="w-100"]')
        .its('0.contentDocument').should('exist')

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

const getDocumentScanner = () => {
    getFolder().find('iframe[src*="IdDocumentScanner"]')
        .iframe()

    let iframeDocumentScanner = getFolder().find('iframe[src*="IdDocumentScanner"]')
        .its('0.contentDocument').should('exist')

    return iframeDocumentScanner.its('body').should('not.be.undefined').then(cy.wrap)
}

const getDocumentoPersonale = () => {
    getDocumentScanner().find('#documentoPersonaleFrame')
        .iframe()

    let iframeDocumentoPersonale = getDocumentScanner().find('#documentoPersonaleFrame')
        .its('0.contentDocument').should('exist')

    return iframeDocumentoPersonale.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class Folder {

    static CaricaDocumentoIdentita() {
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
        //#endregion BackEnd Calls

        getFolder().find('span[class="k-icon k-plus"]:visible').click()
        getFolder().find('span[class="k-icon k-plus"]:first').click()
        getFolder().find('#UploadDocumentFromPortal').click()

        getDocumentScanner().find('button:contains("Continua"):visible').click()
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
    }

    static CaricaAutocertificazione() {
        getFolder().find('span[class="k-icon k-plus"]:visible').click()
        getFolder().find('span[class="k-icon k-plus"]:first').click()
        getFolder().find('#UploadDocument').click()
        getFolder().find('#win-upload-document_wnd_title').click()
        getFolder().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}')
        getFolder().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('{downarrow}').type('{downarrow}').type('{enter}')

        cy.intercept({
            method: 'POST',
            url: /uploadCustomerDocument/
        }).as('uploadCustomerDoc')

        const fileName = 'Autocertificazione_Test.pdf'
        cy.fixture(fileName).then(fileContent => {
            getFolder().find('#file').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })

        getFolder().contains('Upload dei file selezionati').click()
        cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 })

        getIframe().find('button:contains("Conferma")').click()
    }
}

export default Folder