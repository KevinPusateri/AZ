/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000
//#endregion

beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
    cy.intercept(/launch-*/,'ignore').as('launchStaging');
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
            req.alias = 'gqlNotifications'
        }
    })
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return true;
        }
    })
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.intercept({
        method: 'POST',
        url: '/portaleagenzie.pp.azi.allianz.it/matrix/'
    }).as('pageMatrix');
    cy.wait('@pageMatrix', { requestTimeout: 20000 });
    cy.wait('@gqlNotifications')
})

after(() => {
    cy.get('.user-icon-container').click()
    cy.contains('Logout').click()
    cy.wait(delayBetweenTests)
})

describe('Buca di Ricerca - Risultati Le mie Info', function () {
    
    
    it('Verifica Ricerca Incasso',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('incasso').type('{enter}').wait(2000)
        cy.url().should('include','search/infos/circulars')

        const tabs = ['clients', 'sales', 'le mie info'];
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').find('a').should('have.length',3)
           .each(($tab, i) => {
                expect($tab.text()).to.include(tabs[i]);
           });

        const suggLinks = [
            'Incasso per conto',
            'Incasso massivo'
        ]
        cy.get('lib-navigation-item-link').find('.title').should('have.length',2)
            .each(($suggerimenti,i) =>{
            expect($suggerimenti.text()).to.include(suggLinks[i]);
        })
    
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').click().should('have.class','active')
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').invoke('text').then($theElement => {
            const count = $theElement.substring(14,$theElement.length-2)
            if(count > 0 ){
                const tabsContainer = ['Circolari'];
                cy.get('[class="lib-tab-info nx-grid"]').find('[href^="/matrix/search/infos"]').should('have.length',1).each(($tab, i) =>{
                    expect($tab.text()).to.include(tabsContainer[i]);
                })
                
                cy.get('[class="lib-tab-info nx-grid"]').contains('Circolari')
                cy.get('lib-circular-item').each($circular =>{
                    cy.wrap($circular).find('[class="date"]').then($date =>{
                        if($date.text().trim().length > 0){
                            expect($date.text()).not.to.be.empty
                            // cy.wrap($date).should('contain',$date.text().trim()) 
                        }else{
                            assert.fail('Manca data su un elemento della pagina circulars')
                        }
                    }) 
                    cy.wrap($circular).find('[class="network"]').then($company =>{
                        if($company.text().trim().length > 0){
                            expect($company.text()).not.to.be.empty
                            // cy.wrap($company).should('contain',$company.text().trim()) 
                        }else{
                            assert.fail('Manca compagnia su un elemento della pagina circulars')
                        }
                    }) 
                    cy.wrap($circular).find('[class="info"]').then($info =>{
                        if($info.text().trim().length > 0){
                            expect($info.text()).not.to.be.empty
                            // cy.wrap($info).should('contain',$info.text().trim()) 
                        }else{
                            assert.fail('Manca info a chi sono indirizzate su un elemento della pagina circulars')
                        }
                    }) 
                    cy.wrap($circular).find('[class="title"]').then($title =>{
                        if($title.text().trim().length > 0){
                            expect($title.text()).not.to.be.empty
                            // cy.wrap($title).should('contain',$title.text().trim()) 
                        }else{
                            assert.fail('Manca titolo su un elemento della pagina circulars')
                        }
                    }) 
        
                })
        /*
                cy.get('[class="lib-tab-info nx-grid"]').contains('Company Handbook').click()
        
                for(var i = 0; i <10; i++){
                    cy.get('#lib-handbook-container').scrollTo('bottom').wait(1000)
                }
                cy.get('lib-handbooks-item').then($hanbooks =>{
        
                    cy.wrap($hanbooks).find('[class="date"]').each($date =>{
                        if($date.text().trim().length > 0){
                            cy.wrap($date).should('contain',$date.text().trim())
                        }else{
                            assert.fail('Manca data su un elemento della pagina handbook')
                        }
                    }) 
                    cy.wrap($hanbooks).find('[class="lib-badge handbook"]').contains('handbook').each($badge =>{
                        if($badge.text().trim().length > 0){
                            cy.wrap($badge).should('contain',$badge.text().trim())
                        }else{
                            assert.fail('Manca badge su un elemento della handbook')
                        }
                    })
                    cy.wrap($hanbooks).find('[class="title"]').each($title =>{
                        if($title.text().trim().length > 0){
                            cy.wrap($title).should('contain', $title.text().trim())
                        }else{
                            assert.fail('Manca titolo su un elemento della su pagina handbook')
                        }
                    })
                    // Verifica Testo skippato 
                    // cy.wrap($hanbooks).find('[class="text"]').each($text =>{
                    //     if($text.text().substring(0,5).trim().length > 0){
                    //         cy.wrap($text).should('contain', $text.text().trim().substring(0,5))
                    //     }else{
                    //         assert.fail('Manca un\'anteprima del testo su un elemento della pagina handbook')
                    //     }
                    // }) 
        
                })*/
            }
        })

    })
    
    it('Verifica Ricerca Fastquote',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('fastquote').type('{enter}').wait(2000)
        cy.url().should('include','search/infos/circulars')

        const tabs = ['clients', 'sales', 'le mie info'];
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').should('have.class','active')
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').find('a').should('have.length',3)
           .each(($tab, i) => {
                expect($tab.text()).to.include(tabs[i]);
           });

        const suggLinks = [
            'FastQuote Auto',
            'FastQuote Infortuni da circolazione',
            'FastQuote Universo Persona',
            'FastQuote Universo Salute',
            'FastQuote Universo Persona Malattie Gravi',
            'FastQuote Impresa e Albergo'
        ]
        cy.get('lib-navigation-item-link').find('.title').should('have.length',6)
            .each(($suggerimenti,i) =>{
            expect($suggerimenti.text()).to.include(suggLinks[i]);
        })
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').click().should('have.class','active')
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').invoke('text').then($theElement => {
            const count = $theElement.substring(14,$theElement.length-2)
            if(count > 0 ){
                const tabsContainer = ['Circolari'];
                cy.get('[class="lib-tab-info nx-grid"]').find('[href^="/matrix/search/infos"]').should('have.length',1).each(($tab, i) =>{
                    expect($tab.text()).to.include(tabsContainer[i]);
                })

                cy.get('[class="lib-tab-info nx-grid"]').contains('Circolari').click()
                cy.get('lib-circular-item').each($circular =>{
                    cy.wrap($circular).find('[class="date"]').then($date =>{
                        if($date.text().trim().length > 0){
                            expect($date.text()).not.to.be.empty
                            // cy.wrap($date).should('contain',$date.text().trim()) 
                        }else{
                            assert.fail('Manca data su un elemento della pagina clients')
                        }
                    }) 
                    cy.wrap($circular).find('[class="network"]').then($company =>{
                        if($company.text().trim().length > 0){
                            expect($company.text()).not.to.be.empty
                            // cy.wrap($company).should('contain',$company.text().trim()) 
                        }else{
                            assert.fail('Manca compagnia su un elemento della pagina clients')
                        }
                    }) 
                    cy.wrap($circular).find('[class="info"]').then($info =>{
                        if($info.text().trim().length > 0){
                            // cy.wrap($info).should('contain',$info.text().trim())
                            expect($info.text()).not.to.be.empty
                        }else{
                            assert.fail('Manca info a chi sono indirizzate su un elemento della pagina clients')
                        }
                    }) 
                    cy.wrap($circular).find('[class="title"]').then($title =>{
                        if($title.text().trim().length > 0){
                            expect($title.text()).not.to.be.empty
                            // cy.wrap($title).should('contain',$title.text().trim()) 
                        }else{
                            assert.fail('Manca titolo su un elemento della pagina clients')
                        }
                    }) 
                
                })

               /* cy.get('[class="lib-tab-info nx-grid"]').contains('Company Handbook').click()
                for(var i = 0; i <10; i++){
                    cy.get('#lib-handbook-container').scrollTo('bottom').wait(1000)
                }
                cy.get('lib-handbooks-item').then($hanbooks =>{

                    cy.wrap($hanbooks).find('[class="date"]').each($date =>{
                        if($date.text().trim().length > 0){
                            cy.wrap($date).should('contain',$date.text().trim())
                        }else{
                            assert.fail('Manca data su un elemento della pagina handbook')
                        }
                    }) 
                    cy.wrap($hanbooks).find('[class="lib-badge handbook"]').contains('handbook').each($badge =>{
                        if($badge.text().trim().length > 0){
                            cy.wrap($badge).should('contain',$badge.text().trim())
                        }else{
                            assert.fail('Manca badge su un elemento della handbook')
                        }
                    })
                    cy.wrap($hanbooks).find('[class="title"]').each($title =>{
                        if($title.text().trim().length > 0){
                            cy.wrap($title).should('contain', $title.text().trim())
                        }else{
                            assert.fail('Manca titolo su un elemento della su pagina handbook')
                        }
                    }) 
                    cy.wrap($hanbooks).find('[class="text"]').each($text =>{
                        if($text.text().substring(0,5).trim().length > 0){
                            cy.wrap($text).should('contain', $text.text().trim().substring(0,5))
                        }else{
                            assert.fail('Manca un\'anteprima del testo su un elemento della pagina handbook')
                        }
                    })
                })*/
            }
        })
    })

    it('Verifica Ricerca Prodotto: Ultra',function(){
        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type('ultra').type('{enter}').wait(2000)
        cy.url().should('include','/search/infos/circulars')
        const suggLinks = [
            'Allianz Ultra Casa e Patrimonio',
            'Allianz Ultra Casa e Patrimonio BMP',
            'Allianz Ultra Salute'
        ]
        cy.get('lib-navigation-item-link').find('.title').should('have.length',3)
            .each(($suggerimenti,i) =>{
            expect($suggerimenti.text()).to.include(suggLinks[i]);
        })
        const tabs = ['clients', 'sales', 'le mie info'];
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').find('a').should('have.length',3)
           .each(($tab, i) => {
                expect($tab.text()).to.include(tabs[i]);
            });

        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('clients').click().should('have.class','active')
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('clients').invoke('text').then($theElement => {
            const count = $theElement.substring(10,$theElement.length-2)
            if(count > 0 ){
                const tabsContainer = ['Clienti'];
                cy.get('[class="lib-tab-info nx-grid"]').find('[href^="/matrix/search/clients/clients"]').should('have.length',1).each(($tab, i) =>{
                    expect($tab.text()).to.include(tabsContainer[i]);
                })
                
                cy.get('[class="lib-tab-info nx-grid"]').contains('Clienti')
                cy.get('lib-client-item').each($client =>{
          
                    cy.wrap($client).find('[class="name"]').then($name =>{
                        if($name.text().trim().length > 0){
                            expect($name.text()).not.to.be.empty
                            // cy.wrap($name).should('contain',$name.text().trim()) 
                        }else{
                            assert.fail('Manca nome su un elemento della pagina clients')
                        }
                    }) 
                    cy.wrap($client).find('[class="lib-agency-container"]').then($agency =>{
                        if($agency.text().trim().length > 0){
                            expect($agency.text()).not.to.be.empty
                            // cy.wrap($agency).should('contain',$agency.text().trim()) 
                        }else{
                            assert.fail('Manca agenzia su un elemento della pagina clients')
                        }
                    }) 
                    cy.wrap($client).find('[class="item"]').then($item =>{
                        if($item.text().trim().length > 0){
                            expect($item.text()).not.to.be.empty
                            // cy.wrap($item).should('contain', $item.text().trim()) 
                        }else{
                            assert.fail('Manca indirizzo su un elemento della pagina clients')
                        }
                    }) 
        
                })
            }

            cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').click().should('have.class','active')
            cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').invoke('text').then($theElement => {
                const count = $theElement.substring(14,$theElement.length-2)
                if(count > 0 ){
                    const tabsContainer = ['Circolari'];
                    cy.get('[class="lib-tab-info nx-grid"]').find('[href^="/matrix/search/infos"]').should('have.length',1).each(($tab, i) =>{
                        expect($tab.text()).to.include(tabsContainer[i]);
                    })
                    
                    cy.get('[class="lib-tab-info nx-grid"]').contains('Circolari').click()
                    cy.get('lib-circular-item').each($circular =>{
                        cy.wrap($circular).find('[class="date"]').then($date =>{
                            if($date.text().trim().length > 0){
                                expect($date.text()).not.to.be.empty
                                // cy.wrap($date).should('contain',$date.text().trim()) 
                            }else{
                                assert.fail('Manca data su un elemento della pagina clients')
                            }
                        }) 
                        cy.wrap($circular).find('[class="network"]').then($company =>{
                            if($company.text().trim().length > 0){
                                expect($company.text()).not.to.be.empty
                                // cy.wrap($company).should('contain',$company.text().trim()) 
                            }else{
                                assert.fail('Manca compagnia su un elemento della pagina clients')
                            }
                        }) 
                        cy.wrap($circular).find('[class="info"]').then($info =>{
                            if($info.text().trim().length > 0){
                                expect($info.text()).not.to.be.empty
                                // cy.wrap($info).should('contain',$info.text().trim()) 
                            }else{
                                assert.fail('Manca info a chi sono indirizzate su un elemento della pagina clients')
                            }
                        }) 
                        cy.wrap($circular).find('[class="title"]').then($title =>{
                            if($title.text().trim().length > 0){
                                expect($title.text()).not.to.be.empty
                                // cy.wrap($title).should('contain',$title.text().trim()) 
                            }else{
                                assert.fail('Manca titolo su un elemento della pagina clients')
                            }
                        }) 

                    })

                 /*   cy.get('[class="lib-tab-info nx-grid"]').contains('Company Handbook').click()
                    for(var i = 0; i <10; i++){
                        cy.get('#lib-handbook-container').scrollTo('bottom').wait(1000)
                    }
                    cy.get('lib-handbooks-item').then($hanbooks =>{

                        cy.wrap($hanbooks).find('[class="date"]').each($date =>{
                            if($date.text().trim().length > 0){
                                cy.wrap($date).should('contain',$date.text().trim())
                            }else{
                                assert.fail('Manca data su un elemento della pagina handbook')
                            }
                        }) 
                        cy.wrap($hanbooks).find('[class="lib-badge handbook"]').contains('handbook').each($badge =>{
                            if($badge.text().trim().length > 0){
                                cy.wrap($badge).should('contain',$badge.text().trim())
                            }else{
                                assert.fail('Manca badge su un elemento della handbook')
                            }
                        })
                        cy.wrap($hanbooks).find('[class="title"]').each($title =>{
                            if($title.text().trim().length > 0){
                                cy.wrap($title).should('contain', $title.text().trim())
                            }else{
                                assert.fail('Manca titolo su un elemento della su pagina handbook')
                            }
                        }) 
                        cy.wrap($hanbooks).find('[class="text"]').each($text =>{
                            if($text.text().substring(0,5).trim().length > 0){
                                cy.wrap($text).should('contain', $text.text().trim().substring(0,5))
                            }else{
                                assert.fail('Manca un\'anteprima del testo su un elemento della pagina handbook')
                            }
                        }) 

                    })*/
                }
            })
        })
    })

    // TODO: Apertura Pagina secondaria da verificare
    // it.only('Verifica Click su card di una Circolare',function(){
    //     cy.get('input[name="main-search-input"]').click()
    //     cy.get('input[name="main-search-input"]').type('incasso').type('{enter}').wait(4000)
    //     cy.get('[class="lib-tab-info nx-grid"]').contains('Circolari').click()
    //     cy.get('lib-circular-item').find('a').first().click()
    // })

    // it('Verifica Click sulla card del Company Handbook',function(){
    //     cy.get('input[name="main-search-input"]').click()
    //     cy.get('input[name="main-search-input"]').type('incasso').type('{enter}').wait(4000)
    //     cy.get('[class="lib-tab-info nx-grid"]').contains('Company Handbook').click()
    //     cy.get('lib-handbooks-item').first().click()
    // })

})