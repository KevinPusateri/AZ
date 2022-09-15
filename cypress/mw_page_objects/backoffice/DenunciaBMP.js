/// <reference types="Cypress" />



import Common from "../common/Common"
import 'cypress-iframe';

const IFrameParent = '[class="iframe-content ng-star-inserted"]'
const IframePopUp = '#popup'
const getIframe = () => cy.get('iframe').its('0.contentDocument.body')
//getIframe().find(locator, { timeout: 9000 }).should('be.visible').should('have.attr', 'src').and('contain', src);

/*
const getIFrame = () => {
    
    cy.get('#matrixIframe')
        .iframe();

    let iframeSin = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist');

    return iframeSin.its('body').should('not.be.undefined').then(cy.wrap)
}
*/

const findIframeChild = (subFrame) => {
    getIframe().find(subFrame)
        .iframe();

    let iframeChild = getIframe().find(subFrame)
        .its('0.contentDocument').should('exist');

    return iframeChild.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFramePopUp = (popUpFrame) => {
    findIframeChild(IFrameParent).find(popUpFrame)
        .iframe();

    let iframe = findIframeChild(IFrameParent).find(popUpFrame)
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFramePopUpChiudi = () => {
    findIframeChild(IFrameParent).find('iframe[src="popUpAvvisoScanner.jsp"]')
        .iframe();

    let iframe = findIframeChild(IFrameParent).find('iframe[src="popUpAvvisoScanner.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameGeo = () => {
    findIframeChild(IFrameParent).find('#geoFrame')
        .iframe();

    let iframe = findIframeChild(IFrameParent).find('#geoFrame')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

class DenunciaBMP {  
    
    static manageDialogWin(confirm)
    {
        debugger
        cy.on('window:confirm', () => confirm);
        debugger
    }
    //#region Generic function
    
    /**
     * Inserts a string @value into the object identified by its @id
     * @param {string} id : locator object id
     * @param {string} value : value to be entered
     */
    static setValue_ById(id, value) {
        return new Cypress.Promise((resolve) => {
            cy.wait(500)             
            getIframe().find(id).should('be.visible').and('exist').clear().log('>> clean object value')
            cy.wait(500)
            if (value !== '')          
            getIframe().find(id).should('be.visible').and('exist').type(value).log('>> value: [' + value +'] entered')                   
            cy.wait(500)
            resolve(true)            
        });
    }
    
    /**
     * Click on object defined by class attribute and content text displayed as label
     * @param {string} classvalue : class attribute 
     * @param {string} label : text displayed
     */
     static clickBtn_ByClassAndText(classvalue, label) {             
        getIframe().find('[class="'+classvalue+'"]').contains(label).should('be.visible').click().log('>> object with label ['+label+ '] is clicked')       
        cy.wait(2000)        
    }

     /**
     * Check if an object identified by class attribute and its label is displayed
     * @param {string} id : class attribute 
     * @param {string} label : text displayed
     */
    static checkObj_ByIdAndText(id, label) {    
        return new Cypress.Promise((resolve) => {     
            let obj =  getIframe().find(id, { timeout: 9000 }).should('be.visible')            
            if (obj.contains(label))
            {
                cy.log('>> object with label: "' + label +'" is defined') 
                resolve(label)
            }            
        });
        cy.wait(1000)                 
    }
}


export default DenunciaBMP
