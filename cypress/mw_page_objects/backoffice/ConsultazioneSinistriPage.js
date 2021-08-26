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
    
    /**
   * Write msg in log console
   */
    static writeInLog(value) {
        cy.log(value)
        cy.wait(500)
    }

   /**
     * Click button by locator id
     */
    static clickBtn_ById(id) {             
        getIFrame().find(id).should('be.visible').then((btn) => {    
            expect(Cypress.dom.isJquery(btn), 'jQuery object').to.be.true          
            const $btn = Cypress.$(btn)
            cy.wrap($btn)
            .should('be.visible')
            .wait(1000)
            .click()  
        })
    }

    /*
    static putValue_ById(id, value) {             
        getIFrame().find(id).should('be.visible').then((obj) => {    
            expect(Cypress.dom.isJquery(obj), 'jQuery object').to.be.true          
            const $obj = Cypress.$(obj)
            cy.wrap($obj)
            .should('be.visible')
            .wait(1000)
            .type(value)
            cy.type()
        })
       
        cy.wait(1000)
    }
*/
    static putValue_ById(id, value) {  
        if (value === '')
            getIFrame().find(id).should('be.visible').and('exist').clear()
        else
            getIFrame().find(id).should('be.visible').and('exist').type(value)          
        cy.wait(1000)        
    }
    
    static clickObj_ByLabel(tag, value) {             
        getIFrame().contains(tag, value).should('exist').click()
        cy.wait(1000)        
    }

    static clickBtn_ByClassAndText(clssvl, value) {    
              
        getIFrame().find('[class="search_submit '+ clssvl +' k-button"]').should('be.visible')
        getIFrame().find('button:contains('+value+'):visible').click()
        cy.wait(1000)        
    }

    static checkVisibleTextValue(value) {    
        getIFrame().contains(value).should('be.visible').log('Verificato il valore: '+value)
        cy.wait(1000)        
    }
    
    static checkVisibleClaimNumberInPageDetails(value)
    {    
        getIFrame().find('[class="pageTitle"]').should('be.visible').contains(value).log('Verificato il valore: '+value)
        cy.wait(1000)        
    }

    static clickSelectClaim(value)
    {        
        getIFrame().find('a[href*="'+value+'"]').should('exist').click()       
        cy.wait(1000)        
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

    static getValueInClaimDetails(index)
    {
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


    static printClaimDetailsValue()   
    {
        
        getIFrame()
            .find('#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)')
            .invoke('text')  // for input or textarea, .invoke('val')
            .then(text => {               
                const someText = text;              
                cy.log(someText);               
            });
        //getIFrame().find('#results > div.k-grid-content > table > tbody > tr').should('exist').log()
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

export default ConsultazioneSinistriPage