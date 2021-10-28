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

    let iframeFolder = getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

class ConsultazioneSinistriPage {
    

    static ConsultazioneSinistriPage() {                  
        getIFrame().contains("Ricerca sinistro").should('be.visible').log('Ricerca sinistro')
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
     */
    static clickBtn_ById(id) {             
        getIFrame().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('be.visible')
            .wait(1000)
            .click().log('>> object with id ['+id+'] is clicked')
        })
        cy.wait(1000)
    }
    /**
     * Click on all objects defined by locator id
     * @param {string} id : locator objects id
     */
     static clickOnMultiObj_ById(id) {             
        getIFrame().find(id).click({ multiple: true });
        cy.wait(1000)
    }
    /**
     * Click on object defined by html tag and content text displayed as label
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickObj_ByLabel(tag, label) {             
        getIFrame().contains(tag, label).should('exist').should('be.visible').click().log('>> object ['+tag+'] with label ['+label+ '] is clicked')
        cy.wait(1000)        
    }
    /**
     * Click on object defined by class attribute and content text displayed as label
     * @param {string} classvalue : class attribute 
     * @param {string} label : text displayed
     */
    static clickBtn_ByClassAndText(classvalue, label) {             
        getIFrame().find('[class="'+classvalue+'"]').contains(label).should('be.visible').click().log('>> object with label ['+label+ '] is clicked')       
        cy.wait(2000)        
    }
    /**
     * Click on link ('a') element, defined by href attribute value
     * @param {string} value : href attribute value or part of it
     */
    static clickLnk_ByHref(value) {        
        getIFrame().find('a[href*="'+value+'"]').should('exist').click({ multiple: true }).log('>> link (a) with href ['+value+ '] is clicked')      
        cy.wait(1000)        
    }
    /**
     * Check if an object identified by its label is displayed    
     * @param {string} label : text displayed
     */
    static checkObjVisible_ByText(label) {    
        getIFrame().contains(label).should('be.visible').log('>> object with label: "' + label +'" is defined')
        cy.wait(1000)        
    }
    /**
     * Check if an object identified by class attribute and its label is displayed
     * @param {string} classvalue : class attribute 
     * @param {string} label : text displayed
     */
    static checkObj_ByClassAndText(classvalue, label) {    
        return new Cypress.Promise((resolve) => {     
            let obj = getIFrame().find('[class="'+classvalue+'"]').should('be.visible')            
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
    static checkObj_ByLocatorAndText2(locator, label) {
        return new Cypress.Promise((resolve, reject) => {
            getIFrame().find(locator).should('be.visible')
            .then(($val) => {                                       
                expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true              
                let txt = $val.text().trim()                
                
                let str = label._rejectionHandler0.toString()
                if (txt.includes(str)) {                   
                    cy.log('>> object with label: "' + str +'" is defined')
                    resolve(txt)    
                } else
                    assert.fail(' object with label: "' + str +'" is not defined')
            })
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
            getIFrame().find(locator).should('be.visible')
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
            getIFrameDenuncia().find(id).should('be.visible').and('exist').clear().log('>> clean object value')
            cy.wait(500)              
            getIFrameDenuncia().find(id).should('be.visible').and('exist').type(value).log('>> value: [' + value +'] entered')                   
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
        return getIFrame().find(id)        
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
        getIFrame().find(id).each(($el, index, $list) => {
            const text = $el.text()
            cy.log('>> Element('+(index)+ ') value: '+text)
            ConsultazioneSinistriPage.isNotNullOrEmpty(text)           
        })
    }
    /**
     * Get a text defined on object identified by its @id
     * @param {string} id : id locator object
     */
    static getPromiseText_ById(id) {
        let value = "";        
        return new Cypress.Promise((resolve, reject) => {
            getIFrame()
            .find(id)
            .should('be.visible')
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {         
                cy.log('>> read the value: ' + text)              
                resolve(text.toString())            
            });      
        });
    }
     /**
     * Get a text defined on object identified by its @id
     * @param {string} id : id locator object
     */
      static getPromiseValue_ById(id) {
        let value = "";        
        return new Cypress.Promise((resolve, reject) => {
            getIFrame()
            .find(id)
            .should('be.visible')
            .invoke('val')  // for input or textarea, .invoke('val')
            .then(text => {         
                cy.log('>> read the value: ' + text)              
                resolve(text.toString())            
            });      
        });
    }
    /**
         * Get a text value defined on object identified by its @id
         * @param {string} id : id locator object 
         */
    static getPromiseDate_ById(id) {
        let value = "";
        const regexExp = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/; //Check the validity of the date

        return new Cypress.Promise((resolve, reject) => {
            getIFrame()
            .find(id)
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {         
                cy.log('>> read the value: ' + text)
                value = text.toString()
                var pattern = new RegExp(regexExp)
                //Tests for a match in a string. It returns true or false.
                let validation = pattern.test(value)                  
                if (!validation)
                {               
                    var msg = '>> the value: "'+value+'" not contain a valid date' 
                    cy.log(msg)
                    assert.fail(msg)                     
                } else {
                    let myString = value.match(pattern)
                    cy.log('>> the string: "'+value+'" contain a valid date "'+myString[0]+'"')                
                    resolve(value)
                }
            });      
        });
    }
    /**
     * Get a text value defined on object identified by its @locator
     * @param {string} locator : id locator object
     */
    static getPromiseValue_Bylocator(locator) {
        cy.log('>> locator value: ' + locator)
        return new Cypress.Promise((resolve) => {            
            getIFrame().find(locator).should('be.visible')
            .invoke('text')  // for input or textarea, .invoke('val')        
            .then(text => {         
                cy.log('>> read the value: ' + text)
                resolve((text.toString()))                
                });
        });
    }
    /**
     * Check if exist id object in body
     */
    static IdExist(id) {
        cy.get('body').then(($body) => {
            if ($body.find(id).length > 0) {
                cy.log('>> ' + id + ' element exists!')
                return true
            } else { 
                cy.log('>> ' + id + ' element not exists!')
                return false
            }
        })
    }
    /**
     * Check if the value is defined
     * @param {string} value : string value to check
     */
    static isNotNullOrEmpty(value) {
        cy.wrap(value).then((validation) => {            
            if(value === undefined) {
                validation = false;
            } else if(value === null) {
                validation = false;
            } else if(value === '') {
                validation = false; 
            } else {
                validation = true;           
            }
            assert.isTrue(validation,">> the check value '"+value+"' is defined. ")  
        });
        cy.wait(1000)        
    }
    /**
     * Put a @str value and is verified if its a valid IBAN 
     * @param {string} str : string date format
     */
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
    /**
     * Put a @str value and is verified if its a date value is included in a correct format 
     * @param {string} str : string date format
     */
     static containValidDate(str) {
          
        const regexExp = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/; //Check the validity of the date
        var pattern = new RegExp(regexExp)
        //Tests for a match in a string. It returns true or false.       
        cy.wrap(str).then((validation) => {
            validation = pattern.test(str)                       
            assert.isTrue(validation,'>> Date Validation on string "'+str+'" (contain a valid date "'+str.match(pattern)[0]+'")')         
        });                             
    }
    /**
     * Put a @numstr (ex.: numStr = "123,20") value and is verified if its a currency correct value 
     * @param {string} numstr : string currency value
     */
    static isCurrency(numstr) {      
       
        const regexExp = /\$?(([1-9]\d{0,2}(.\d{3})*)|0)?\,\d{1,2}$/;        
        var pattern = new RegExp(regexExp)       
        cy.wrap(numstr).then((validation) => {  
            validation = pattern.test(numstr)
            assert.isTrue(validation,"Currency Check on '"+numstr+"' value ");                
        });
    }
    /**
     * Put a @str value and is verified if its a valid EURO currency @str (ex.: "EURO") 
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
        var amount = str.match(regexExp)[0]
        ConsultazioneSinistriPage.isCurrency(amount)
    }
    //#endregion  Generic function
    static getValueInClaimDetails(index) {
        return new Cypress.Promise((resolve) => {
        getIFrame()
        .find('#results > div.k-grid-content > table > tbody > tr > td:nth-child('+index+')')
        .invoke('text')  // for input or textarea, .invoke('val')
        .then(text => {           
            const someText = text;           
            cy.log(someText);
            resolve(someText)            
            });
        });
    }

    static printClaimDetailsValue() {
        
        getIFrame()
            .find('#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)')
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {               
                const someText = text;              
                cy.log(someText);               
            });
        //getIFrame().find('#results > div.k-grid-content > table > tbody > tr').should('exist').log()
    }
}


export default ConsultazioneSinistriPage