/// <reference types="Cypress" />



import Common from "../common/Common"
import 'cypress-iframe';

const IframeDen = 'iframe[src="cliente.jsp"]'
const IframePopUp = '#popup'
const getIframe = () => cy.get('iframe').its('0.contentDocument.body')

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
    findIframeChild(IframeDen).find(popUpFrame)
        .iframe();

    let iframe = findIframeChild(IframeDen).find(popUpFrame)
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFramePopUpChiudi = () => {
    findIframeChild(IframeDen).find('iframe[src="popUpAvvisoScanner.jsp"]')
        .iframe();

    let iframe = findIframeChild(IframeDen).find('iframe[src="popUpAvvisoScanner.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameGeo = () => {
    findIframeChild(IframeDen).find('#geoFrame')
        .iframe();

    let iframe = findIframeChild(IframeDen).find('#geoFrame')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}
class DenunciaSinistriPage {  
    
    static manageDialogWin(confirm)
    {
        debugger
        cy.on('window:confirm', () => confirm);
        debugger
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
     * Click on popup object defined by html tag and content text displayed as label     
     * @param {string} label : text displayed
     */
    static getPopUpObj_ByLabel(label) {             
        return getIFramePopUp(IframePopUp).within(() => {              
            cy.contains(label).should('exist').and('be.visible').click();
            cy.log('>> object with label [' +label+ '] is defined')         
        })    
    }
    /**
     * Click on popup object identified by locator id, attribute and its value 
     * @param {string} id : locator object id
     * @param {string} attr : attribute object 
     * @param {string} value : attribute value object 
     */
    static clickPopUpObj_ByIdAndAttr(id, attr, value) {             
        getIFramePopUp(IframePopUp).find(id).should('have.attr', attr, value).should('be.visible').click({ multiple: true }).log('>> object with attr ['+attr+'="'+value+'"] is clicked')       
        cy.wait(2000)
    }
    /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickPopUpBtn_ById(id) {             
        getIFramePopUp(IframePopUp).find(id).should('be.visible').click().log('>> object with [id='+id+'] is clicked')        
        cy.wait(1000)
    }
    /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickSelect_ById(id, text) {             
        findIframeChild(IframeDen).find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('exist')            
            .select(text).log('>> object with [locator="'+id+'"] and text="'+text+'" was selected')
        })       
        cy.wait(2000)
    }
    
    /**
     * Click on object defined by locator id on Geo Locator Window
     * @param {string} id : locator object id
     */
    static clickSelectOnGeo_ById(id, text) {             
        getIFrameGeo().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('exist')          
            .select(text).log('>> object with [locator="'+id+'"] and text="'+text+'" was selected')
        })       
        cy.wait(2000)
    }
    
    /**
     * Click on object defined by html tag and content text displayed as label
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickObj_ByLabel(tag, label) {
        findIframeChild(IframeDen).contains(tag, label).should('exist').should('be.visible').click().log('>> object ['+tag+'] with label ['+label+ '] is clicked')
        cy.wait(2000)        
    }
    /**
     * Click on object defined by html tag and content text displayed as label
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickObjPopUpChiudi_ByLabel(tag, label) {             
        getIFramePopUpChiudi().contains(tag, label, { timeout: 5000 }).should('exist').should('be.visible').click().log('>> object ['+tag+'] with label ['+label+ '] is clicked')
        cy.wait(2000)        
    }
    /**
     * Click on object defined by html tag and content text displayed as label on Geo Location window
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickObjGeo_ByTagAndLabel(tag, label) {         
        return new Cypress.Promise((resolve) => {     
            let $el = getIFrameGeo().contains(tag, label, { timeout: 5000 }).should('exist').and('be.visible')
            $el.click()
            cy.log('>> object : "' + label +'" is clicked')            
            cy.wait(3000)
            resolve(true) 
        })
    }
    /**
     * Click on object defined by html tag and content text displayed as label on Geo Location window
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
        static clickObjGeoModal_ByIDAndLabel(tag, label, carrozzeria) {           
            debugger
    
            getIFrameGeo().contains(carrozzeria).should('exist').click().log('>> object with label: "' +label+'" is clicked')
            getIFrameGeo().contains(tag, label).should('be.visible').click()
        
           /*
            getIFrameGeo().contains(tag, label).should('exist').click().then(() =>                      
                //cy.on('window:confirm', () => true )                                                
                cy.on('window:alert', () => true )  
            )
            */
            
            cy.wait(1000)               
        }
     /**
     * Click object identified by its label is displayed on Geo Location window  
     * @param {string} label : text displayed
     */
    static clickObjGeo_ByLabel(label) {    
        getIFrameGeo().contains(label).should('exist').click().log('>> object with label: "' +label+'" is clicked')
        cy.wait(1000)
    }
    /**
     * Click on object identified by locator id, attribute and its value 
     * @param {string} id : locator object id
     * @param {string} attr : attribute object 
     * @param {string} value : attribute value object 
     */
    static clickObj_ByIdAndAttr(id, attr, value) {           
        findIframeChild(IframeDen).find(id, { timeout: 10000 }).should('have.attr', attr, value).click().log('>> object with attr ['+attr+'="'+value+'"] is clicked')       
        cy.wait(1000)      
    }
    /**
     * Click on checkbox obj identified by locator id, and text value 
     * @param {string} id : locator object id
     * @param {string} value : attribute value object 
     */
    static clickOnRadio_ByIdAndText(id, value) {                   
        findIframeChild(IframeDen).find(id, { timeout: 5000 }).should('exist').and('be.visible').each(li => {          
            let $txt = li.text().trim()              
            if ($txt.includes(value)) {                
                cy.wrap(li).children('input').check({force: true}).should('be.checked')
                cy.wait(2000).log('>> object with id ['+id+'="'+value+'"] is checked')
                return;
            }
        })            
    }
    /**
     * Click on checkbox obj identified by locator id, attribute and its value 
     * @param {string} id : locator object id
     * @param {string} attr : attribute object 
     * @param {string} value : attribute value object 
     */
    static clickOnCheck_ByIdAndAttr(id, attr, value) {           
        findIframeChild(IframeDen).find(id, { timeout: 10000 }).should('be.visible').each(input => {          
            let $gar = input.attr(attr)
            if ($gar === value) {
                cy.wrap(input).click()
                cy.log('>> object with attr ['+attr+'="'+value+'"] is checked')
                cy.wait(2000)
                return;
            }
        })            
    }
    
    /**
     * Click on link ('a') element, defined by href attribute value
     * @param {string} value : href attribute value or part of it
     */
    static clickLnk_ByHref(value) {        
        findIframeChild(IframeDen).find('a[href*="'+value+'"]', { timeout: 3000 }).should('exist').click({ multiple: true }).log('>> link (a) with href [' +value+ '] is clicked')      
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
            findIframeChild(IframeDen).find(id).should('exist').clear()
            cy.log('>> clean object value')
            cy.wait(1000)
            findIframeChild(IframeDen).find(id).should('exist').type(value)
            cy.log('>> value: [' + value +'] entered')                   
            cy.wait(1000)
            resolve(true)            
        });
    }
    
    /**
     * Inserts a string @value into the object identified by its @id Geo Location window
     * @param {string} id : locator object id
     * @param {string} value : value to be entered
     */
    static setValueOnGeo_ById(id, value) {
        return new Cypress.Promise((resolve) => {
            cy.wait(500)             
            getIFrameGeo().find(id).should('be.visible').and('exist').clear().log('>> clean object value')
            cy.wait(500)              
            getIFrameGeo().find(id).should('be.visible').and('exist').type(value).log('>> value: [' + value +'] entered')                   
            cy.wait(1000)
            resolve(true)            
        });
    }
    /**
     * Defined on object identified by its @id, the function return the
     * length list
     * @param {string} id : locator object id
     */
    static getCountElements(id) {        
        return findIframeChild(IframeDen).find(id)        
        .then(listing => {
            const listingCount = Cypress.$(listing).length;
            expect(listing).to.have.length(listingCount);
            cy.log('>> length :' + listingCount)          
        });
        findIframeChild(IframeDen).find(id)
        cy.wait(1000)
    }
    
    /**
     * Get a index value defined on object identified by locator @id and its label is displayed
     * if are defined or not null
     * @param {string} id : locator object id
     * @param {string} value : value to be entered
     */
    static getIdInListValues_ById(id, value) {
        return new Cypress.Promise((resolve, reject) => {            
            findIframeChild(IframeDen).find(id).each(($el, index, $list) => {
                if ($el.text().includes(value)) {                                                              
                    cy.log('>> Element('+(index)+ ') and value: '+value) 
                    cy.wait(2000)
                    resolve (index)                                                 
                }                   
            })                                           
        }); 
        cy.wait(2000)     
    }
    /**
     * Gets a text value defined on object identified by its @id
     * @param {string} id : id locator object
     * @returns {Promise<string>} Promise (text)
     */
    static getPromiseText_ById(id) {
        cy.log('>> locator value: ' + id)       
        return new Cypress.Promise((resolve, reject) => {
            findIframeChild(IframeDen)
            .find(id)
            .should('be.visible')
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {         
                cy.log('>> read the text: ' + text)              
                resolve(text.toString())            
            });      
        });
    }

    /**
     * Gets a text defined on object identified by its @locator
     * @param {string} locator : id locator object
     * @returns {Promise<string>} Promise (value)
     */
    static getPromiseValue_ByID(locator) {
        cy.log('>> locator value: ' + locator)
        return new Cypress.Promise((resolve) => {            
            findIframeChild(IframeDen).find(locator).should('be.visible')
            .invoke('val')  // for input or textarea, .invoke('val')        
            .then(text => {         
                cy.log('>> read the value: ' + text)
                resolve((text.toString()))                
            });
        });
    }
    /**
     * Check if exist id object in body
     * @param {string} locator : id locator object
     */
    static isVisible(id)
    {
        return findIframeChild(IframeDen).within(() => {           
            cy.find(id, { timeout: 5000 }).should('exist').and('be.visible')
            cy.log('>> Element with [locator="' +id+ '"] exist and is visible!')      
        })
    }
    
    /**
     * Ritorna un Promise true se presente un testo @txt, false se assente
     * @param {string} txt text
     * @returns {Promise<boolean>} Promise (true) or Promise (false)
     */
    static isVisibleText(txt)
    {
        return new Promise((resolve) => {
            check = false
            findIframeChild(IframeDen).within(($body) => {              
                // cy.contains(txt).should('exist').and('be.visible')
                const check = $body.find('span:contains("'+txt+'")').is(':visible')

                cy.log('>> Text : [' +txt+ '] is visible! ')            
                resolve(check)                
            })
            resolve(false)    
        })
    }
    /*
    static isVisibleText(text)
    { 
        let visible = false;
        cy.log('>> check if the text="' +text+ '" is defined...')
        findIframeChild(IframeDen).contains(text, { timeout: 10000 }).should('exist').and('be.visible')
        .then(() => {       
            visible =  true;
            cy.log('>> [text="' +text+ '"] defined!')
        });        
        assert.isTrue(visible, ">> is text='"+test+"' visible")   
        return visible
    }
    */
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
            assert.isTrue(validation,'>> IBAN Validation on string "' +str+ '". (IBAN '+myString[0]+') is included.')                
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
                assert.isTrue(validation,"EURO Currency Check on '" +str+ "' value ");                
        });
    } 
    /**
     * Get a date before or after today's date of +-ndays (in local format)
     * @param {int} ndays : plus or miuns days
     */
    static getPlusMinusDate(ndays)
    {
        return new Cypress.Promise((resolve) => {
            let dt = new Date();
            cy.wrap(dt).then(()  => {            
                dt.setDate(dt.getDate() + ndays);                
                let retval = dt.toLocaleDateString('en-GB')                
                cy.log(retval) 
                resolve(retval)
            });
        });
    }
    //#endregion  Generic function
    static getValueInClaimDetails(index) {
        return new Cypress.Promise((resolve) => {
        getIFrameDenuncia()
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
        
        getIFrameDenuncia()
        .find('#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)')
        .invoke('text')  // for input or textarea, .invoke('val')
        .then(text => {               
            const someText = text;              
            cy.log(someText);               
        });
        //getIFrame().find('#results > div.k-grid-content > table > tbody > tr').should('exist').log()
    }
}


export default DenunciaSinistriPage
