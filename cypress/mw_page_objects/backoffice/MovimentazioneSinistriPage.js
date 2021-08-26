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

class MovimentazioneSinistriPage {
    
    
   /**
     * Click button by locator id
     */
    static clickBtn_ById(id) {             
        getIFrameMovSinistri().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('be.visible')
            .wait(1000)
            .click()  
        })
       
        cy.wait(2000)
    }


    static IdExist(id)
    {
        cy.get('body').then(($body) => {
            if ($body.find(id).length > 0) {
                console.log(id + ' element exists!')
                return true
            } else
            { 
                console.log(id + ' element exists!')
                return false
            }
        })
    }

    /**
     * Return total moviments in page
     */
    static getNumTotaleMovimenti() {
        var tot = 0
        cy.wait(2000)       
        getIFrameMovSinistri().find('td[class="numCruscottoTOT"]:first').then(($val) => {                                       
            expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true
                tot = $val.text().trim()
                console.log(tot)   
        })
        return tot 
    }

    /**
     * returns the sum of all movements divided by type
     */
    static getSumMovimenti() {
        var sum = 0
        var elements = new Array();
        cy.wait(2000) 

        getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {             
            expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
            elements = Cypress.$.makeArray($els)
            expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
            expect(elements, 'to array').to.be.an('array')
            for (let i=0; i<elements.length; i++)
            {              
                sum += parseInt(elements[i].textContent.trim(), 10)
                console.log('sum tot ['+i+']: ' +sum)  
            }                 
        })
        return sum
    }
    
    /**
    * Compare the total value of the movements with the sum of all movements by type
    */
    static compareTotMovimenti() {
        var sum = MovimentazioneSinistriPage.getSumMovimenti()
        var tot = MovimentazioneSinistriPage.getNumTotaleMovimenti()
        debugger
        if (tot===sum)
            assert.ok('Somma totali movimenti sinistri')
        else
            assert.notOk('Somma totali movimenti sinistri ko')
    }


    
    static compareTotMovimenti2() {
        var msg = 'Verifica somma dei movimenti sinistri'
        var totMov = 0
        var tot = 0
        var elements = new Array();

        cy.wait(2000)       
        getIFrameMovSinistri().find('td[class="numCruscottoTOT"]:first').then(($val) => {                                
            expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true
                totMov = $val.text().trim()
                console.log('Totale Movimenti: ' +totMov)            
        })

        getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {                                  
            expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
            elements = Cypress.$.makeArray($els)
            expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
            expect(elements, 'to array').to.be.an('array')
            for (let i=0; i<elements.length; i++)
            {              
                tot += parseInt(elements[i].textContent.trim(), 10)
                console.log('sum tot ['+i+']: ' +tot)  
            }                        
            if (tot == totMov)
                assert.ok(msg)
            else
                assert.notOk(msg)
        })    
    }


    static GetElementiMovimentazioneSinistri() {
        getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {                                  
                expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
                const elements = Cypress.$.makeArray($els)
                expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
                expect(elements, 'to array').to.be.an('array')
                // we are returning an array of DOM elements                                 
                return elements
        })    
    }
    
    static GetArrayLengthMovimentazioneSinistri() {
        getIFrameMovSinistri().find('td[class="numCruscotto"]').then(($els) => {
                     
                expect(Cypress.dom.isJquery($els), 'jQuery object').to.be.true
                const elements = Cypress.$.makeArray($els)
                expect(Cypress.dom.isJquery(elements), 'converted').to.be.false
                expect(elements, 'to array').to.be.an('array')
                // we are returning an array of DOM elements    
              
                return elements.length
        })    
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
                console.log('sum tot ['+i+']: ' +sum)  
            }                 
        })
    }
}

export default MovimentazioneSinistriPage