/// <reference types="Cypress" />

//#region iFrame
const getIframe = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getFolder = () => {
    getIframe().find('iframe[class="w-100"]')
        .iframe()

    let iframeFolder = getIframe().find('iframe[class="w-100"]')
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

    /**
     * Verifica accesso a Folder
     * @param {Boolean} [frameBased] default true, se il Folder è all'interno di un frame o meno
     */
    static verificaCaricamentoFolder(frameBased = true) {
        if (frameBased)
            getFolder().find('span[class="k-icon k-plus"]:visible')
        else
            cy.get('span[class="k-icon k-plus"]:visible').should('exist').and('be.visible')

    }
    static caricaDocumentoIdentita() {
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
        getDocumentoPersonale().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        cy.wait('@uploadPdfDoc', { requestTimeout: 30000 })
        cy.wait('@preview', { requestTimeout: 30000 })

        cy.screenshot('Importa Documento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getDocumentoPersonale().find('#importMobileDocument').click()
        cy.wait('@uploadMobileDoc', { requestTimeout: 30000 })
        cy.wait(3000)
    }

    static caricaAutocertificazione() {
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
        getFolder().find('#file').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })

        getFolder().contains('Upload dei file selezionati').click()
        cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 })

        cy.screenshot('Autocertificazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        getIframe().find('button:contains("Conferma")').click()
    }

    /**
    * @param {boolean} isModifica - se in fase di modifica e non censimento, l'iframe è diffrente
    */
    static caricaVisuraCamerale(isModifica = false) {
        if (!isModifica) {
            getFolder().find('span[class="k-icon k-plus"]:visible').click()
            getFolder().find('span[class="k-icon k-plus"]:first').click()
            getFolder().find('#UploadDocument').click()
            getFolder().find('#win-upload-document_wnd_title').click()
            getFolder().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}')
            getFolder().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('Visura').type('{enter}')
            cy.intercept({
                method: 'POST',
                url: /uploadCustomerDocument/
            }).as('uploadCustomerDoc')

            const fileName = 'Autocertificazione_Test.pdf';
            getFolder().find('#file').attachFile({
                filePath: fileName,
                fileName: fileName,
                mimeType: 'application/pdf',
                encoding: 'base64'
            })

            getFolder().contains('Upload dei file selezionati').click()
            cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 })
        }
        else {
            getIframe().find('span[class="k-icon k-plus"]:visible').click()
            getIframe().find('span[class="k-icon k-plus"]:first').click()
            getIframe().find('#UploadDocument').click()
            getIframe().find('#win-upload-document_wnd_title').click()
            getIframe().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}')
            getIframe().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('Visura').type('{enter}')
            cy.intercept({
                method: 'POST',
                url: /uploadCustomerDocument/
            }).as('uploadCustomerDoc')

            const fileName = 'Autocertificazione_Test.pdf';
            getIframe().find('#file').attachFile({
                filePath: fileName,
                fileName: fileName,
                mimeType: 'application/pdf',
                encoding: 'base64'
            })

            cy.screenshot('Visura Camerale', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            getIframe().contains('Upload dei file selezionati').click()
            cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 })
        }
    }

    /**
    * @param {boolean} isModifica - se in fase di modifica e non censimento, l'iframe è diffrente
    * @param {boolean} isPG - se true, il click torna indietro è relativo a una PG con il relativo intercept delle chiamate a SCImpresa
    */
    static clickTornaIndietro(isModifica = false) {
        !isModifica ? getFolder().find('#idUrlBack').click().wait(2000) : getIframe().find('#idUrlBack').click().wait(2000)
        cy.wait(8000)
    }
}

export default Folder