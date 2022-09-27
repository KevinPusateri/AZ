/// <reference types="Cypress" />



import Common from "../common/Common"
import 'cypress-iframe';

const IFrameParent = '#matrixIframe'
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
    
    static clickObj_ByExpression(expression)
    {
        getIframe().contains(expression).should('be.visible').and('exist').click().log('>> click on ID: [' + id +'] !') 
        cy.wait(500)
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
        cy.wait(1000);                 
    }

    static clickSelect_ById(id, text) {             
            getIframe().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('exist')            
            .select(text).log('>> object with [locator="'+id+'"] and text="'+text+'" was selected')
        })       
        cy.wait(2000)
    }

    /**
     * Click on checkbox obj identified by locator id, and text value 
     * @param {string} id : locator object id
     * @param {string} value : attribute value object 
     */
     static clickOnRadio_ByIdAndText(id, value) {
        getIframe().find(id, { timeout: 5000 }).should('be.visible').each(li => {          
            let $txt = li.text().trim()              
            if ($txt.includes(value)) {                
                cy.wrap(li).children('input').check({force: true}).should('be.checked')
                cy.wait(2000).log('>> object with id ['+id+'="'+value+'"] is checked')
                return;
            }
        })            
    }
    /**
 * Click on object defined by locator id
 * @param {string} id : locator object id
 */
    static clickSelect_ByIdOnIframeChild(idIframe, id, text) {             
        findIframeChild(IFrameParent).find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('exist')            
            .select(text).log('>> object with [locator="'+id+'"] and text="'+text+'" was selected')
        })       
        cy.wait(2000)
    }
}


export default DenunciaBMP
