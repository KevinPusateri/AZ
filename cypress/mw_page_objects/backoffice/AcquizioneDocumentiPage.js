/// <reference types="Cypress" />

import Common from "../common/Common"

const getIFrame = () => {
    cy.get('#matrixIframe')
        .iframe();

    let iframeSin = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist');

    return iframeSin.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameMovSinistri = () => {
    getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .iframe();

    let iframe = getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameAcqDoc = () => {
    findIframeChild(constIframeMovSin).find('#fileFrame')
        .iframe();

    let iframe = findIframeChild(constIframeMovSin).find('#fileFrame')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

class AcquizioneDocumentiPage {
    
     /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
      static clickBtn_ById(id) {                         
            getIFrameAcqDoc().find(id).then((btn) => {
                cy.wrap(btn)
                .scrollIntoView()
                //.invoke('removeAttr', 'onchange')
                .should('have.css', 'opacity', '0')
                .wait(1000)
                .click().log('>> object with id ['+id+'] is clicked')
                //cy.window().then(win => ShowFile(this.value)) 
            }) 
            
           
    }
   /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickSelect_ById(id, text) {             
        getIFrameAcqDoc().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('be.visible')
            .wait(1000)
            .select(text).log('>> object with id ['+id+'] and text='+text+' is clicked')
        })       
        cy.wait(2000)
    }
    /**
     * Click on link ('a') element, defined by href attribute value
     * @param {string} value : href attribute value or part of it
    */
    static clickLnk_ByHref(value) {        
        getIFrameAcqDoc().find('a[href*="'+value+'"]').should('exist').click({ multiple: true }).log('>> link (a) with href ['+value+ '] is clicked')      
        cy.wait(1000)        
    }
     /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     * @param {int} count : counter object child
     */
      static clickBtn_ByIdAndConterChild(id, count) {   
        getIFrameAcqDoc().find(id).should('be.visible').eq(1).then((btn) => {
            cy.wrap(btn).invoke('removeAttr', 'onclick')
            .invoke('attr', 'href', 'https://portaleagenzie.pp.azi.allianz.it/dasinconfe/OpenScanner?polBra=13&counter='+count+'&scanType=S3').click()
        })       
        cy.wait(2000)
    }

    static clickBtn_LinkByText(locator) {                   
        getIFrameAcqDoc().find('a[href="javascript:;"]').contains('Chiudi').should('be.visible').click()
        .log('>> object with label ['+locator+ '] is clicked')
        cy.wait(1000)        
    }
 
    static selectionText(id, text)
    { 
        getIFrameAcqDoc().get('option').contains(text).click();
    }

    static UploadFile()
    {        
        const fileName = 'CI_Test.pdf'
        getIFrameAcqDoc().find('#pdfUpload').attachFile({
            filePath: fileName,
            fileName: fileName,
            mimeType: 'application/pdf',
            encoding: 'base64'
        })
    }
}

export default AcquizioneDocumentiPage