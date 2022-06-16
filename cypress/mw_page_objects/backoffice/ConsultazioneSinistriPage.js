/// <reference types="Cypress" />

import Common from "../common/Common"


const mainFrame = '#matrixIframe'
const subFrame = 'iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]'
const getIframe = () => cy.get('iframe').its('0.contentDocument.body')
/*
const getIframe = (iframe) => {    
    cy
        .get(iframe).iframe();
    let iframeSin = cy.get(iframe)
        .its('0.contentDocument').should('exist');

    return iframeSin.its('body').should('not.be.undefined').then(cy.wrap)
}
*/
const findIframeChild = (subFrame) => {
    getIframe().find(subFrame)
        .iframe();

    let iframeChild =  getIframe().find(subFrame)
        .its('0.contentDocument').should('exist');

    return iframeChild.its('body').should('not.be.undefined').then(cy.wrap)
}

class ConsultazioneSinistriPage {
    

    static ConsultazioneSinistriPage() {                  
        getIframe().contains("Ricerca sinistro").should('be.visible').log('Ricerca sinistro')
    }
    
    //#region Generic function
    
    /**
     * Write msg in log console
     */
    static writeInLog(msg) { 
        cy.wrap(msg).then(() => {
            cy.log(msg)
            cy.wait(500)        
        })
    }
    /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     * @param {string} href : url
     */
    static InvokeRmvAttOnClick_ById(id, href) {   
        getIframe().find(id).should('be.visible').then((btn) => {
            cy.wrap(btn).invoke('removeAttr', 'onclick')
            .invoke('attr', 'href', href).click()
        }) 
        cy.wait(2000)
    }
    /**
     * Click on all objects defined by locator id
     * @param {string} id : locator objects id
     */
    static clickOnMultiObj_ById(id) {             
        getIframe().find(id).click({ multiple: true });
        cy.wait(1000)
    }
    /**
     * Click on object defined by html tag and content text displayed as label
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickObj_ByLabel(tag, label) {             
        getIframe().contains(tag, label).should('exist').should('be.visible').click().log('>> object ['+tag+'] with label ['+label+ '] is clicked')
        cy.wait(1000)        
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
     * Click on link ('a') element, defined by href attribute value
     * @param {string} value : href attribute value or part of it
     */
    static clickLnk_ByHref(value) {        
        getIframe().find('a[href*="'+value+'"]').should('exist').click({ multiple: true }).log('>> link (a) with href ['+value+ '] is clicked')      
        cy.wait(1000)        
    }
    /**
     * Check if an object identified by id attribute and its label is displayed
     * @param {string} id : id attribute 
     * @param {string} label : text displayed
     */
    static isTextIncluded_ByIdAndText(id, label) {     
        getIframe().find(id, { timeout: 9000 }).should('exist').and('be.visible').contains(label)
        cy.log('>> object with label: "' + label +'" is defined')

        cy.wait(3000)                 
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
    /**
     * Check if an object identified by locator and its label is displayed
     * @param {string} locator : class attribute 
     * @param {string} label : text displayed
     */
    static checkObj_ByLocatorAndText(locator, label) {       
        return new Cypress.Promise((resolve, reject) => {     
            getIframe().find(locator, { timeout: 9000 }).should('be.visible')
            .then(($val) => {                                       
                expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true              
                let txt = $val.text().trim()                                
                if (txt.includes(label)) {                   
                    cy.log('>> object with label: "' + label +'" is defined')
                    resolve(txt)    
                } else
                    assert.fail('object with label: "' + label +'" is not defined')
            })
        });
        cy.wait(1000)            
    }
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
     * Defined on object identified by its @id, the function return the
     * length list
     * @param {string} id : locator object id
     */
    static getCountElements(id) {        
        return getIframe().find(id)        
        .then(listing => {
            const listingCount = Cypress.$(listing).length;
            expect(listing).to.have.length(listingCount);
            cy.log('>> Length :' + listingCount)          
        });
        getIFrame().find(id)  
    }
    /**
     * Defined on object identified by its @id, the function check all list values
     * if are defined or not null
     * @param {string} id : locator object id
     */
    static checkListValues_ById(id) {
        getIframe().find(id).each(($el, index, $list) => {
            const text = $el.text()
            cy.log('>> Element('+(index)+ ') value: '+text)
            ConsultazioneSinistriPage.isNotNullOrEmpty(text)           
        })
    }
    
    /**
     * Defined on object identified by its @id, the function return the
     * length list
     * @param {string} id : locator object id
     */
    static getCountElements(id) {        
        return  getIframe().find(id)        
        .then(listing => {
            const listingCount = Cypress.$(listing).length;
            expect(listing).to.have.length(listingCount);
            cy.log('>> Length :' + listingCount)          
        });
        getIframe().find(id)  
    }
    
    /**
     * Check if the value is defined
     * @param {string} value : string value to check
     */
    static isNotNullOrEmpty(value) {
        cy.wrap(value).then((validation) => {            
            if ((value === undefined) 
                || (value === null) || (value === '')) 
                validation = false; 
            else 
                validation = true;                       
            assert.isTrue(validation,">> the check value '"+value+"' is defined. ")  
        });
        cy.wait(1000)        
    }
    
    /**
     * Puts a @str value and is verified if its a valid IBAN 
     * @param {string} str : string date format
     */
    /*
    static isValidIBAN(str)
    {       
        const regexExp = /^[A-Z]{2}[0-9A-Z]*$/; //Reg exp. for valid IBAN
        var pattern = new RegExp(regexExp)
        //Tests for a match in a string. It returns true or false.
        validation = pattern.test(str)
        cy.wrap(str).then((validation) => {  
            assert.isTrue(validation,'>> IBAN Validation on string "'+str+'". (IBAN '+myString[0]+') is included.')                
        });
    }
    */
    
    /**
     * Puts a @str value and is verified if its a valid EURO currency @str (ex.: "EURO") 
     * @param {string} str : string value
     */
    static isEuroCurrency(str) {                
            const currency = 'EURO';
            cy.wrap(str).then((validation) => { 
                validation = str.includes(currency)
                assert.isTrue(validation,"EURO Currency Check on '"+str+"' value ");                
        });
    } 
    static getCurrency(str) {               
        const regexExp = /\d{1,3},\d{2}/;      
        Common.isValidCheck(/\$?(([1-9]\d{0,2}(.\d{3})*)|0)?\,\d{1,2}$/, str.match(regexExp)[0], ' is valid currency') 
        //ConsultazioneSinistriPage.isCurrency(amount)
    }
    //#endregion  Generic function
    static getValueInClaimDetails(index) {
        return new Cypress.Promise((resolve) => {
            getIframe()
            .find('#results > div.k-grid-content > table > tbody > tr > td:nth-child('+index+')')
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {           
                const someText = text;           
                cy.log(someText);
                resolve(someText)            
                });
            });
        }
    /**
     * Gets a text defined on object identified by its @id
     * @param {string} id : id locator object
     * @returns text element
     */
    static getPromiseText_ById(id) {              
        return new Cypress.Promise((resolve, reject) => {
            getIframe()
                .find(id)
                .should('be.visible')
                .invoke('text')
                .then(text => {         
                    cy.log('>> read the value: ' + text)              
                    resolve(text.toString())            
                });      
        });
    }


    static printClaimDetailsValue() {
        
        getIframe()
            .find('#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)')
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {               
                const someText = text;              
                cy.log(someText);               
            });
        //getIframe().find('#results > div.k-grid-content > table > tbody > tr').should('exist').log()
    }
}


export default ConsultazioneSinistriPage