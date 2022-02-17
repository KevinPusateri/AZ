/// <reference types="Cypress" />



import Common from "../common/Common"
import 'cypress-iframe';

/*
const getBaseIframe = (iframe) => {
    
    let ifr = cy.frameLoaded(iframe)
    .iframe(iframe)

    return ifr.should('not.be.undefined').and('exist').then(cy.wrap)
}

const getSecondaryIframe = (baseIframe, childIframe) => {

     let ifrmchld =  getBaseIframe(baseIframe).find(childIframe)
     .iframe()
     return ifrmchld.its('0.contentDocument').should('exist').then(cy.wrap)   
} 
*/
const getIFrame = () => {
    
    cy.get('#matrixIframe')
        .iframe();

    let iframeSin = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist');

    return iframeSin.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameDenuncia = () => {
   
    getIFrame().find('iframe[src="cliente.jsp"]')
        .iframe();

    let iframe = getIFrame().find('iframe[src="cliente.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
    
}

const getIFramePopUp = () => {
    getIFrameDenuncia().find('#popup')
        .iframe();

    let iframe = getIFrameDenuncia().find('#popup')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFramePopUpChiudi = () => {
    getIFrameDenuncia().find('iframe[src="popUpAvvisoScanner.jsp"]')
        .iframe();

    let iframe = getIFrameDenuncia().find('iframe[src="popUpAvvisoScanner.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameGeo = () => {
    getIFrameDenuncia().find('#geoFrame')
        .iframe();

    let iframe = getIFrameDenuncia().find('#geoFrame')
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
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickPopUpObj_ByLabel(tag, label) {             
        getIFramePopUp().contains(tag, label).should('exist').should('be.visible').click().log('>> object ['+tag+'] with label ['+label+ '] is clicked')
        cy.wait(1000)        
    }
    /**
     * Click on popup object identified by locator id, attribute and its value 
     * @param {string} id : locator object id
     * @param {string} attr : attribute object 
     * @param {string} value : attribute value object 
     */
    static clickPopUpObj_ByIdAndAttr(id, attr, value) {             
        getIFramePopUp().find(id).should('have.attr', attr, value).should('be.visible').click({ multiple: true }).log('>> object with attr ['+attr+'="'+value+'"] is clicked')       
        cy.wait(2000)
    }
    /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickPopUpBtn_ById(id) {             
        getIFramePopUp().find(id).should('be.visible').click().log('>> object with [id='+id+'] is clicked')        
        cy.wait(1000)
    }
    /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickSelect_ById(id, text) {             
        getIFrameDenuncia().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('exist')            
            .select(text).log('>> object with [locator="'+id+'"] and text="'+text+'" was selected')
        })       
        cy.wait(2000)
    }
    /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickSelect_ById(id, text) {             
        getIFrameDenuncia().find(id).should('be.visible').then((btn) => {    
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
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickBtn_ById(id) {             
        getIFrameDenuncia().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('be.visible')           
            .click()
            cy.log('>> object with [locator="'+id+'"] is clicked')
        })
        cy.wait(3000)
    }

    static clickBtnByJs(jsfuntion)
    {
        cy.window().then((win) => {
            cy.window().then(win => win.geolocator())            
        });
    }
    /**
     * Click on all objects defined by locator id
     * @param {string} id : locator objects id
     */
    static clickOnMultiObj_ById(id) {             
        getIFrameDenuncia().find(id).click({ multiple: true });
        cy.wait(1000)
    }
    /**
     * Click on object defined by html tag and content text displayed as label
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickObj_ByLabel(tag, label) {
        getIFrameDenuncia().contains(tag, label).should('exist').should('be.visible').click().log('>> object ['+tag+'] with label ['+label+ '] is clicked')
        cy.wait(2000)        
    }
    /**
     * Click on object defined by html tag and content text displayed as label
     * @param {string} tag : html element (button, etc...)
     * @param {string} label : text displayed
     */
    static clickObjPopUpChiudi_ByLabel(tag, label) {             
        getIFramePopUpChiudi().contains(tag, label, { timeout: 3000 }).should('exist').should('be.visible').click().log('>> object ['+tag+'] with label ['+label+ '] is clicked')
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
            debugger
            cy.log('>> object with label : "' +label +'" is clicked')
            
            /* in questo caso non preme il tasto di 'seleziona' */
            /*
            cy.on('window:confirm', (message) => {
                debugger
                getIFrameGeo().contains(tag, label).should('exist').click().then((message) => 
                {
                    debugger
                    expect(message).to.contain('Confermi la selezione della Carrozzeria')            
                })               
                debugger                
                cy.log('>> object with label : "' +label +'" is clicked')         
            })
            */

            /* in questo caso preme il tasto 'Seleziona' e l'alert blocca */
              // test automatically waits for the promise
              /*
              getIFrameGeo().contains(tag, label).should('exist').click().then((message) =>   
                        
                cy.on('window:confirm', (message) => {
                    debugger
                    expect(message).to.contain('Confermi la selezione della Carrozzeria')            
                })
            )
            */

            /* in questo caso non preme il tasto di 'seleziona' */
              // test automatically waits for the promise
              /*
            cy.on('window:confirm', (message) => {
                debugger
                expect(message).to.contain('Confermi la selezione della Carrozzeria') 
                debugger
                getIFrameGeo().contains(tag, label).should('exist').click() 
                cy.log('>> object with label : "' +label +'" is clicked')         
            })
            */        
            debugger                                     
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
        getIFrameDenuncia().find(id, { timeout: 10000 }).should('have.attr', attr, value).click().log('>> object with attr ['+attr+'="'+value+'"] is clicked')       
        cy.wait(1000)      
    }
    /**
     * Click on checkbox obj identified by locator id, and text value 
     * @param {string} id : locator object id
     * @param {string} value : attribute value object 
     */
    static clickOnRadio_ByIdAndText(id, value) {                   
        getIFrameDenuncia().find(id, { timeout: 5000 }).should('exist').and('be.visible').each(li => {          
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
        getIFrameDenuncia().find(id, { timeout: 10000 }).should('be.visible').each(input => {          
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
     * Click on object defined by class attribute and content text displayed as label
     * @param {string} classvalue : class attribute 
     * @param {string} label : text displayed
     */
    static clickBtn_ByClassAndText(classvalue, label) {                          
        getIFrameDenuncia().find('[class="'+classvalue+'"]').contains(label).should('be.visible').click().log('>> object with label [' +label+ '] is clicked')       
        cy.wait(2000)       
    }
    /**
     * Click on link ('a') element, defined by href attribute value
     * @param {string} value : href attribute value or part of it
     */
    static clickLnk_ByHref(value) {        
        getIFrameDenuncia().find('a[href*="'+value+'"]', { timeout: 3000 }).should('exist').click({ multiple: true }).log('>> link (a) with href [' +value+ '] is clicked')      
        cy.wait(1000)        
    }
    /**
     * Check if an object identified by its label is displayed    
     * @param {string} label : text displayed
     */
    static checkObjVisible_ByText(label) {    
        getIFrameDenuncia().contains(label).should('be.visible').log('>> object with label: "' +label+'" is defined')
    }
    /**
     * Check if an object identified by class attribute and its label is displayed
     * @param {string} classvalue : class attribute 
     * @param {string} label : text displayed
     */
    static checkObj_ByClassAndText(classvalue, label) {    
        return new Cypress.Promise((resolve) => {     
            let obj = getIFrameDenuncia().find('[class="'+classvalue+'"]', { timeout: 3000 }).should('be.visible')            
            if (obj.contains(label))
            {
                cy.log('>> object with label: "' +label+'" is defined') 
                resolve(label)
            }            
        });
        cy.wait(1000)                 
    }
    /**
     * Check if an object identified by value 
     * @param {string} value : string value in tag td  
     */
    static checkInTbl_ByValue(value) {
        return new Cypress.Promise((resolve) => {
            let $el = getIFrameDenuncia().contains('td', value) // gives you the cell 
            .siblings() // gives you all the other cells in the row                        
            cy.log('>> object : "' + $el.text() +'" is defined') 
            resolve($el.text())
        }); 
    }
    /**
     * Check if an object identified by id 
     * @param {string} id : class attribute 
     */
     static checkObj_ById(id) {    
        return new Cypress.Promise((resolve) => {
            let $el = getIFrameDenuncia().find(id).should('exist')
            cy.wrap($el).then(() => {         
                cy.log('>> object : "' + $el.text() +'" is defined') 
                resolve($el.text())   
            });                     
        });
        cy.wait(1000)                 
    }
    /**
     * Check if an object identified by id and value
     * @param {string} id : class attribute 
     * @param {string} label : text displayed
     */
    static checkObj_ByIdAndLbl(id, label) {              
        getIFrameDenuncia().find(id).should('exist').then(($input) => {
            const value = $input.val().toUpperCase();
            cy.log('>> val: '+ value)
            if (value.includes(label.toUpperCase())) {                   
                cy.log('>> object with label: "' +value+ '" is defined')                   
            } else
                assert.fail(' object with label: "' +value+ '" is not defined')                
        })                                                                   
        cy.wait(1000)                 
    }
    /**
     * Check if an object identified by locator and its label is displayed
     * @param {string} locator : class attribute 
     * @param {string} label : text displayed
     */
    static checkObj_ByLocatorAndText2(locator, label) {
        return new Cypress.Promise((resolve, reject) => {
            getIFrameDenuncia().find(locator).should('be.visible')
            .then(($val) => {                                       
                expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true              
                let txt = $val.text().trim()                                
                let str = label._rejectionHandler0.toString()
                if (txt.includes(str)) {                   
                    cy.log('>> object with label: "' +str+ '" is defined')
                    resolve(txt)    
                } else
                    assert.fail(' object with label: "' +str+ '" is not defined')
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
            getIFrameDenuncia().find(locator).should('be.visible')
            .then(($val) => {                                       
                expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true              
                let txt = $val.text().trim().toUpperCase()                              
                if (txt.includes(label.toUpperCase())) {                   
                    cy.log('>> object with label: "' +label+ '" is defined')
                    resolve(txt)    
                } else
                    assert.fail('object with label: "' +label+ '" is not defined')
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
            getIFrameDenuncia().find(id).should('exist').clear()
            cy.log('>> clean object value')
            cy.wait(1000)
            getIFrameDenuncia().find(id).should('exist').type(value)
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
        return getIFrameDenuncia().find(id)        
        .then(listing => {
            const listingCount = Cypress.$(listing).length;
            expect(listing).to.have.length(listingCount);
            cy.log('>> length :' + listingCount)          
        });
        getIFrameDenuncia().find(id)
        cy.wait(1000)
    }
    /**
     * Defined on object identified by its @id, the function check all list values
     * if are defined or not null
     * @param {string} id : locator object id
     */
    static checkListValues_ById(id) {
        getIFrameDenuncia().find(id).each(($el, index, $list) => {
            const text = $el.text()
            cy.log('>> Element('+(index)+ ') and value: '+text)
            ConsultazioneSinistriPage.isNotNullOrEmpty(text)           
        })
    }
    /**
     * Get a index value defined on object identified by locator @id and its label is displayed
     * if are defined or not null
     * @param {string} id : locator object id
     * @param {string} value : value to be entered
     */
    static getIdInListValues_ById(id, value) {
        return new Cypress.Promise((resolve, reject) => {            
            getIFrameDenuncia().find(id).each(($el, index, $list) => {
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
     */
    static getPromiseText_ById(id) {
        let value = "";        
        return new Cypress.Promise((resolve, reject) => {
            getIFrameDenuncia()
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
     * Gets a text defined on object identified by its @id
     * @param {string} id : id locator object
     */
    static getPromiseValue_ById(id) {
        let value = "";        
        return new Cypress.Promise((resolve, reject) => {
            getIFrameDenuncia()
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
     * Gets a text value defined on object identified by its @id
     * @param {string} id : id locator object 
     */
    static getPromiseDate_ById(id) {
        let value = "";
        const regexExp = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/; //Check the validity of the date

        return new Cypress.Promise((resolve, reject) => {
            getIFrameDenuncia()
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
                    var msg = '>> the value: "' +value+ '" not contain a valid date' 
                    cy.log(msg)
                    assert.fail(msg)                     
                } else {
                    let myString = value.match(pattern)
                    cy.log('>> the string: "' +value+ '" contain a valid date "'+myString[0]+'"')                
                    resolve(value)
                }
            });      
        });
    }
    /**
     * Gets a text value defined on object identified by its @locator
     * @param {string} locator : id locator object
     */
    static getPromiseValue_Bylocator(locator) {
        cy.log('>> locator value: ' + locator)
        return new Cypress.Promise((resolve) => {            
            getIFrameDenuncia().find(locator).should('be.visible')
            .invoke('text')  // for input or textarea, .invoke('val')        
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
    static isVisible(locator)
    { 
        return new Cypress.Promise((resolve) => {  
            getIFrameDenuncia().find(locator, { timeout: 15000 }).then(($el) => {              
                if ($el === undefined)
                    resolve(false) 
                const len = $el.length;
                if (len > 0) {
                    //element exists do something
                    cy.log('>> Element with [locator="' +locator+ '"] exists!')
                    resolve(true)   
                } else 
                    resolve(false)   
            });
        });
    }
    /**
     * Check if text exist in body
     * @param {string} text : text 
     */
    static isVisibleText(text)
    { 
        let visible = false;
        cy.log('>> check if the text="' +text+ '" is defined...')
        getIFrameDenuncia().contains(text, { timeout: 10000 }).should('exist').and('be.visible')
        .then(() => {       
            visible =  true;
            cy.log('>> [text="' +text+ '"] defined!')
        });        
        assert.isTrue(visible, ">> is text='"+test+"' visible")   
        return visible
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
            assert.isTrue(validation,">> is check value '" +value+ "' defined. ")  
        });
        cy.wait(1000)        
    }
    /**
     * Puts a @str value and is verified if its a valid IBAN 
     * @param {string} str : string date format
     */
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
    /**
     * Puts a @str value and is verified if its a date value is included in a correct format 
     * @param {string} str : string date format
     */
    static containValidDate(str) {
        const regexExp = /\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/; //Check the validity of the date
        var pattern = new RegExp(regexExp)
        //Tests for a match in a string. It returns true or false.       
        cy.wrap(str).then((validation) => {
            validation = pattern.test(str)                       
            assert.isTrue(validation,'>> Date Validation on string "' +str+ '" (contain a valid date "'+str.match(pattern)[0]+'")')         
        });                             
    }
    /**
     * Puts a @numstr (ex.: numStr = "123,20") value and is verified if its a currency correct value 
     * @param {string} numstr : string currency value
     */
    static isCurrency(numstr) {      
        const regexExp = /\$?(([1-9]\d{0,2}(.\d{3})*)|0)?\,\d{1,2}$/;        
        var pattern = new RegExp(regexExp)       
        cy.wrap(numstr).then((validation) => {              
            validation = pattern.test(numstr)
            assert.isTrue(validation,"Currency Check on '" +numstr+ "' value ");                
        });
    }
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
