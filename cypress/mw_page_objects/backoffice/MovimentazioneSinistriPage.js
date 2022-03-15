/// <reference types="Cypress" />


import Common from "../common/Common"

const getIframe = () => cy.get('iframe').its('0.contentDocument.body')
const IframeMovSin = 'iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]'
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

    let iframeFolder =  getIframe().find(subFrame)
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameMovSinistri = () => {
    getIframe().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .iframe();

    let iframe = getIframe().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameAcqDoc = () => {
    findIframeChild(IframeMovSin).find('#fileFrame')
        .iframe();

    let iframe = findIframeChild(IframeMovSin).find('#fileFrame')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

var x = -1;
class MovimentazioneSinistriPage {
 /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
  static clickBtn_ById(idFrame, id) {
    return new Cypress.Promise((resolve, reject) => {
        debugger
        findIframeChild(idFrame).find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('be.visible')
            .wait(1000)
            .click()  
        })
    })
    resolve(tot)  
    cy.wait(2000)
}
    /**
     * Click on link ('a') element, defined by href attribute value
     * @param {string} value : href attribute value or part of it
    */
    static clickLnk_ByHref(value) {        
        findIframeChild(IframeMovSin).find('a[href*="'+value+'"]').should('be.visible').click({ multiple: true }).log('>> link (a) with href ['+value+ '] is clicked')      
        cy.wait(1000)
    }
    /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     * @param {int} count : counter object child
     */
    static clickBtn_ByIdAndConterChild(id, count) {   
        findIframeChild(IframeMovSin).find(id).should('be.visible').eq(1).then((btn) => {
            cy.wrap(btn).invoke('removeAttr', 'onclick')
            .invoke('attr', 'href', 'https://portaleagenzie.pp.azi.allianz.it/dasinconfe/OpenScanner?polBra=13&counter='+count+'&scanType=S3').click()
        }) 
        cy.wait(2000)
    }
    static clickBtn_LinkByText(locator) {                   
        findIframeChild(IframeMovSin).find('a[href="javascript:;"]').contains('Chiudi').should('be.visible').click()
        .log('>> object with label ['+locator+ '] is clicked')
        cy.wait(1000)        
    }
    /**
     * Check if an object identified by locator and its label is displayed
     * @param {string} locator : class attribute 
     * @param {string} label : text displayed
     */
    static checkObj_ByLocatorAndText(locator, label) {
        return new Cypress.Promise((resolve, reject) => {
            findIframeChild(IframeMovSin).find(locator).should('be.visible')
            .then(($val) => {                                       
                expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true              
                let txt = $val.text().trim()
                if (txt.includes(label)) {                   
                    cy.log('>> object with label: "' + label +'" is defined')
                    resolve(txt)    
                } else
                    assert.fail(' object with label: "' + label +'" is not defined')
            })
        });
        cy.wait(1000)            
    }
    /**
     * Defined on object identified by its @id, the function check all list values
     * if are defined or not null
     * @param {string} id : locator object id
     */
    static checkListValues_ById(id) {
        findIframeChild(IframeMovSin).find(id).each(($el, index, $list) => {
            const text = $el.text()
            cy.log('>> Element['+(index)+ '] value: '+text)
            MovimentazioneSinistriPage.isNotNullOrEmpty(text)           
        })
    }
    /**
     * Check if an object identified by locator is displayed and disabled
     */
    static checkObjDisabled(id) {
        findIframeChild(IframeMovSin).find(id).should('exist').and('be.disabled')
        cy.log('>> Element: ['+id+'] --> exist and disabled')
    }
    /**
     * Gets a text value defined on object identified by its @id
     * @param {string} id : id locator object
     */
    static getPromiseText_ById(id) {
        let value = "";        
        return new Cypress.Promise((resolve, reject) => {
            findIframeChild(IframeMovSin)
            .find(id)
            .should('be.visible')
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {         
                cy.log('>> read value: ' + text)
                value = text.toString()
                resolve(value)          
            });      
        });
    }
    /**
     * Gets a text value defined on object identified by its @locator
     * @param {string} locator : id locator object
     */
     static getPromiseText_ByID(locator) {
        let value = ""; 
        cy.log('>> locator value: ' + locator)
        return new Cypress.Promise((resolve) => {            
            findIframeChild(IframeMovSin).find(locator).should('exist').invoke('val')                    
            .then(text => {         
                cy.log('>> read value: ' + text)
                value = text.toString()
                resolve(value)          
            });
        });
    }
    /**
     * Gets total moviments in page
     */
    static getNumTotaleMovimenti() {
        var tot = 0       
        cy.wait(2000)
        return new Cypress.Promise((resolve, reject) => {
        
            findIframeChild(IframeMovSin).find('td[class="numCruscottoTOT"]:first').then($val => {  
                expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true
                tot = $val.text().trim()                           
                cy.log('Totale Movimenti riportati: ' +tot)                                  
            });                 
        })
        resolve(tot)     
    }
    /**
     * Defined on object identified by its @id, the function return the
     * length list
     * @param {string} id : locator object id
     */
    static getCountElements(id) {        
        return findIframeChild(IframeMovSin).find(id)        
        .then(listing => {
            const listingCount = Cypress.$(listing).length;
            expect(listing).to.have.length(listingCount);
            cy.log('>> Length :' + listingCount)          
        });
        
        getIframe().find(id)  
    }

    static analyzeClaimFields(id)
    {        
        var table = findIframeChild(IframeMovSin).find(id).eq(2).children('tr[header="false"]')
            .each(($tr, index, $list) => {            
            var name = $tr.attr('name')            
            var i = index + 2;                 
            //num sin
            Common.isValidCheck(/^\d{9}\-?([0-9]{3})$/, $tr.find('#'+name.replace('R'+i+'_Div', 'R'+i+'C1_Div') +' span').text().trim(), ' is valid claim number')
            //Dt Mov
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, $tr.find('#'+name.replace('R'+i+'_Div', 'R'+i+'C2_Div') +' span').text(), ' contain a valid date')
            //Dt Avv
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/,  $tr.find('#'+name.replace('R'+i+'_Div', 'R'+i+'C4_Div') +' span').text(), ' contain a valid date')            
            //const tpDann =  $tr.find(locTpDann).text()          
        })         
    }

    static selectionText(id, text)
    { 
        getIFrameAcqDoc().get(id).click()
        getIFrameAcqDoc().get('option').contains(text).click();
    }

    static UploadFile()
    {        
        const fileName = 'CI_Test.pdf'

        cy.fixture(fileName).then(fileContent => {
            findIframeChild(IframeMovSin).find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })
    }
    
    /**
    * Compare the total value of the movements with the sum of all movements by type
    */
    static checkTotAndSumMovimenti() {
        var sum = 0
        var tot = 0
        
        var elements = new Array();      
        findIframeChild(IframeMovSin).find('td[class="numCruscottoTOT"]:first').then($val => {  
            expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true
            tot = $val.text().trim()                                                                          
        });
            cy.wait(1000) 
            findIframeChild(IframeMovSin).find('td[class="numCruscotto"]').then(($els) => {             
            expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
            
            elements = Cypress.$.makeArray($els)
            expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
            expect(elements, 'to array').to.be.an('array')
            for (let i=0; i<elements.length; i++)
            {              
                sum += parseInt(elements[i].textContent.trim(), 10)
                cy.log('Somma parziale ['+i+']: ' +sum)  
            } 
            cy.wait(1000) 
            cy.log('Totale Somma Movimenti: ' +sum)            
            cy.log('Totale Movimenti Riportati: ' +tot)
            
            if (tot===sum.toString())
                assert.ok('I valori coincidono: tot===sum==='+tot)     
            else
                assert.notOk('I valori sono discordanti sum='+sum+ ' tot='+tot)
        })
    }

    /**
     * Gets the number of movements associated with the table row index
     * @param {*} idx : index of row in table
     * @returns numbers of moviments
     */
    static getNumMovimentiByIndex(idx)
    {
        let value = [];
        let retval = -1;
        return new Cypress.Promise((resolve, reject) => {  
            findIframeChild(IframeMovSin).find('.zebra').should('be.visible').then(($td) => {
                
            value = Array.from($td.find('.numCruscotto'), $td => $td.innerText);        
                cy.log('Valori: ' +value)
                retval = value[idx]
                cy.log('Valore['+idx+']: ' +retval ) 
                resolve (cy.wrap(retval).as('x'+idx))     
            }) 
        }) 
        reject () 
    }

    static getElementiMovimentazioneSinistri() {
        findIframeChild(IframeMovSin).find('td[class="numCruscotto"]').then(($els) => {                                  
                expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
                const elements = Cypress.$.makeArray($els)
                expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
                expect(elements, 'to array').to.be.an('array')
                // we are returning an array of DOM elements                                 
                return elements
        })    
    }
    
    static getArrayLengthMovimentazioneSinistri() {
        findIframeChild(IframeMovSin).find('td[class="numCruscotto"]').then(($els) => {                     
                expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
                const elements = Cypress.$.makeArray($els)
                expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
                expect(elements, 'to array').to.be.an('array')
                // we are returning an array of DOM elements                  
                return elements.length
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
    static VerifySxPayedFields()
    {
        findIframeChild(IframeMovSin).find('td[class="numCruscotto"]').then(($els) => {             
            expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
            elements = Cypress.$.makeArray($els)
            expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
            expect(elements, 'to array').to.be.an('array')
            for (let i=0; i<elements.length; i++)
            {              
                sum += parseInt(elements[i].textContent.trim(), 10)
                cy.log('sum tot ['+i+']: ' +sum)  
            }                 
        })
    }
}

export default MovimentazioneSinistriPage