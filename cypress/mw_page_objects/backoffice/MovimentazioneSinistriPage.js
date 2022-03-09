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
    getIFrameMovSinistri().find('#fileFrame')
        .iframe();

    let iframe = getIFrameMovSinistri().find('#fileFrame')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

var x = -1;
class MovimentazioneSinistriPage {
   
   /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     */
    static clickBtn_ById(id) {
        return new Cypress.Promise((resolve, reject) => {     
            getIFrameMovSinistri().find(id).should('be.visible').then((btn) => {    
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
        getIFrameMovSinistri().find('a[href*="'+value+'"]').should('be.visible').click({ multiple: true }).log('>> link (a) with href ['+value+ '] is clicked')      
        cy.wait(1000)
    }
     /**
     * Click on object defined by locator id
     * @param {string} id : locator object id
     * @param {int} count : counter object child
     */
    static clickBtn_ByIdAndConterChild(id, count) {   
        getIFrameMovSinistri().find(id).should('be.visible').eq(1).then((btn) => {
            cy.wrap(btn).invoke('removeAttr', 'onclick')
            .invoke('attr', 'href', 'https://portaleagenzie.pp.azi.allianz.it/dasinconfe/OpenScanner?polBra=13&counter='+count+'&scanType=S3').click()
        }) 
        cy.wait(2000)
    }
    static clickBtn_LinkByText(locator) {                   
        getIFrameMovSinistri().find('a[href="javascript:;"]').contains('Chiudi').should('be.visible').click()
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
            getIFrameMovSinistri().find(locator).should('be.visible')
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
        getIFrameMovSinistri().find(id).each(($el, index, $list) => {
            const text = $el.text()
            cy.log('>> Element['+(index)+ '] value: '+text)
            MovimentazioneSinistriPage.isNotNullOrEmpty(text)           
        })
    }
    /**
     * Check if an object identified by locator is displayed and disabled
     */
    static checkObjDisabled(id) {
        getIFrameMovSinistri().find(id).should('exist').and('be.disabled')
        cy.log('>> Element: ['+id+'] --> exist and disabled')
    }
    /**
     * Gets a text value defined on object identified by its @id
     * @param {string} id : id locator object
     */
    static getPromiseText_ById(id) {
        let value = "";        
        return new Cypress.Promise((resolve, reject) => {
            getIFrameMovSinistri()
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
     static getPromiseText_BylD(locator) {
        let value = ""; 
        cy.log('>> locator value: ' + locator)
        return new Cypress.Promise((resolve) => {            
            getIFrameMovSinistri().find(locator).should('exist').invoke('val')                    
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
        
            getIFrameMovSinistri().find('td[class="numCruscottoTOT"]:first').then($val => {  
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
        return getIFrameMovSinistri().find(id)        
        .then(listing => {
          const listingCount = Cypress.$(listing).length;
          expect(listing).to.have.length(listingCount);
          cy.log('>> Length :' + listingCount)          
        });
        
        getIFrame().find(id)  
    }

    static analyzeClaimFields(id)
    {
        debugger
        var table = getIFrameMovSinistri().find(id).eq(2).children('tr[header="false"]')
            .each(($tr, index, $list) => {
            debugger
            var name = $tr.attr('name')
            var size = getIFrameMovSinistri().find(id).its("length").as("size");
            var i = index + 2;
            const locSin = '#'+name.replace('R'+i+'_Div', 'R'+i+'C1_Div') +' span'
            const locDtMov = '#'+name.replace('R'+i+'_Div', 'R'+i+'C2_Div') +' span'
            const locDtAvv = '#'+name.replace('R'+i+'_Div', 'R'+i+'C4_Div') +' span'
            const locTpDann = '#'+name.replace('R'+i+'_Div', 'R'+i+'C9_Div') +' span'

            Common.isValidCheck(/^\d{9}\-?([0-9]{3})$/, $tr.find(locSin).text().trim(), ' is valid claim number')
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, $tr.find(locDtMov).text(), ' contain a valid date')
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, $tr.find(locDtAvv).text(), ' contain a valid date')
            
            const tpDann =  $tr.find(locTpDann).text()          
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
            getIFrameMovSinistri().find('#pdfUpload').attachFile({
                fileContent,
                fileName,
                mimeType: 'application/pdf'
            }, { subjectType: 'input' })
        })
    }
    static IdExist(id)
    {
        cy.get('body').then(($body) => {
            if ($body.find(id).length > 0) {
                cy.log(id + ' element exists!')
                return true
            } else
            { 
                cy.log(id + ' element exists!')
                return false
            }
        })
    }    

    /**
    * Compare the total value of the movements with the sum of all movements by type
    */
    static checkTotAndSumMovimenti() {
        var sum = 0
        var tot = 0
        
        var elements = new Array();      
        getIFrameMovSinistri().find('td[class="numCruscottoTOT"]:first').then($val => {  
            expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true
            tot = $val.text().trim()                                                                          
        });
            cy.wait(1000) 
            getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {             
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
            getIFrameMovSinistri().find('.zebra').should('be.visible').then(($td) => {
                
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
        getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {                                  
                expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
                const elements = Cypress.$.makeArray($els)
                expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
                expect(elements, 'to array').to.be.an('array')
                // we are returning an array of DOM elements                                 
                return elements
        })    
    }
    
    static getArrayLengthMovimentazioneSinistri() {
        getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {                     
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
        getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {             
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