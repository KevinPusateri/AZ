/// <reference types="Cypress" />

import Common from "../common/Common";

class LandingRicerca {

    /**
    * @param {boolean} filtri - Se true, imposta filtri aggiuntivi di ricerca, altrimenti no
    * @param {string} tipoCliente - Tipo Cliente a scelta tra "PF" o "PG"
    * @param {string} statoCliente - Stato Cliente a scelta tra "E", "P" o "C"
    */
    static searchRandomClient(filtri, tipoCliente, statoCliente) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.get('input[name="main-search-input"]').click()
        cy.generateTwoLetters().then(randomChars => {
            cy.get('input[name="main-search-input"]').type(randomChars).type('{enter}')
        })
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 });

        if (filtri) {
            //Filtriamo la ricerca in base a tipoCliente
            cy.get('.icon').find('[name="filter"]').click()
            if (tipoCliente === "PF")
                cy.get('.filter-group').contains('Persona giuridica').click()
            else
                cy.get('.filter-group').contains('Persona fisica').click()

            //Filtriamo la ricerca in base a statoCliente
            switch (statoCliente) {
                case "E":
                    cy.get('.filter-group').contains('Potenziale').click()
                    cy.get('.filter-group').contains('Cessato').click()
                    break
                case "P":
                    cy.get('.filter-group').contains('Effettivo').click()
                    cy.get('.filter-group').contains('Cessato').click()
                    break
                case "C":
                    cy.get('.filter-group').contains('Potenziale').click()
                    cy.get('.filter-group').contains('Effettivo').click()
                    break
            }

            cy.get('.footer').find('button').contains('applica').click()
            cy.wait('@gqlSearchClient', { requestTimeout: 30000 });

            cy.get('lib-applied-filters-item').find('span').should('be.visible')
        }
    }

    /**
    * @param {string} value - What to search
    */
    static search(value) {
        switch (value) {
            case 'incasso':
            case 'fastquote':
            case 'ultra':
            case 'circolari':
                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('searchCircular')) {
                        req.alias = 'gqlSearchCircular'
                    }
                });
                break;
            default:
                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('searchClient')) {
                        req.alias = 'gqlSearchClient'
                    }
                });
                break;
        }

        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type(value).type('{enter}').wait(2000)

        switch (value) {
            case 'incasso':
            case 'fastquote':
            case 'ultra':
            case 'circolari':
                cy.wait('@gqlSearchCircular', { requestTimeout: 30000 });
                cy.url().should('include', 'search/infos/circulars')
                break
            default:
                cy.wait('@gqlSearchClient', { requestTimeout: 30000 });
                cy.url().should('eq', Common.getBaseUrl() + 'search/clients/clients')
                break
        }
    }

    static clickFirstResult() {
        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        cy.get('lib-client-item').first().click();

        cy.wait('@client', { requestTimeout: 30000 });
    }

    static clickRandomResult() {
        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });
        cy.get('.ps--active-y').then(($clienti) => {
            let schedeClienti = $clienti.find('lib-client-item')
            let selectedRandomSchedaCliente = schedeClienti[Math.floor(Math.random() * schedeClienti.length)]
            cy.wrap($clienti).find(selectedRandomSchedaCliente).click()
        })

        cy.wait('@client', { requestTimeout: 30000 });
    }

    static clickClientName(clientName) {
        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        cy.get('div:contains("' + clientName + '")').first().click();

        cy.wait('@client', { requestTimeout: 30000 });
    }

    /**
     * 
     * @param {string} pageLanding - nome della pagina 
     */
    static checkBucaRicercaSuggerrimenti() {
        cy.get('input[name="main-search-input"]').click()

        cy.wait(3000)
        const getSection = () => cy.get('lib-shortcut-section-item')
        getSection().find('[class="title"]:contains("Ultime pagine visitate"):visible').should('contain', 'Ultime pagine visitate')
        getSection().find('[class="title"]:contains("Ultimi clienti visualizzati"):visible').should('contain', 'Ultimi clienti visualizzati')
        getSection().find('[class="title"]:contains("Ultime polizze visualizzate"):visible').should('contain', 'Ultime polizze visualizzate')

        getSection().find('[class="left nx-grid__column-6"]').should('exist').and('be.visible')
        getSection().find('a[href^="/matrix/clients/client/"]').should('exist').and('be.visible').and('have.attr', 'href')
        getSection().find('img').should('exist').and('have.attr', 'src')

        getSection().find('[class="right nx-grid__column-6"]').each(($text) => {
            expect($text.text()).not.to.be.empty
        })
        getSection().find('[class="left nx-grid__column-6"]').each(($text) => {
            expect($text.text()).not.to.be.empty
        })


        cy.get('a[href="/matrix/"]').click()
    }

    static checkRicercaClassica() {
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()

        const links = [
            'Ricerca Cliente',
            'Ricerca Polizze proposte',
            'Ricerca Preventivi',
            'Ricerca News',
            'Rubrica'
        ]
        cy.get('nx-modal-container').find('lib-da-link').each(($linkRicerca, i) => {
            expect($linkRicerca.text().trim()).to.include(links[i]);
        })
        cy.get('nx-modal-container').find('button[aria-label="Close dialog"]').click()
    }

    static clickRicercaClassicaLabel(link) {
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('danni');

        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()
        cy.get('nx-modal-container').find('lib-da-link').contains(link).click()

        Common.canaleFromPopup()

        if (link === 'Ricerca Polizze proposte' || link === 'Ricerca Preventivi') {
            cy.wait('@danni', { requestTimeout: 30000 })
            cy.wait(2000)
        }

    }

    static checkRisultatiRicerca() {

        //Verifica Stato Cliente
        cy.get('lib-client-item').each($cliente => {
            cy.wrap($cliente).find('lib-client-status-badge').then(($lettera) => {
                var text = $lettera.text().trim()
                switch (text) {
                    case "p":
                        cy.wrap($lettera).find('[ngclass="status-bubble"]').should('contain', 'p')
                        break
                    case "c":
                        cy.wrap($lettera).find('[ngclass="status-bubble"]').should('contain', 'c')
                        break
                    case "":
                        assert.equal(text, "")
                        break
                }
            })
            cy.wrap($cliente).find('.info > .name').then(($name) => { cy.wrap($name).should('contain', $name.text()) })
            cy.wrap($cliente).find('[class="item"]').then(($adress) => { cy.wrap($adress).should('contain', $adress.text()) })


        })

        //Verifica Età
        cy.get('lib-client-item').find('span[class="icon-mw-person-heart-people-love ng-star-inserted"]').then(() => {
            cy.get('lib-client-item').find('[class="item ng-star-inserted"]').each(($age) => {
                if ($age.text().trim().length > 5) {
                    cy.wrap($age).should('contain', $age.text().trim())
                } else {
                    cy.wrap($age).should('contain', $age.text().trim()).should('have.value', "")
                }
            })
        })
    }

    /** 
    * @param {string} statoCliente - Stato Cliente a scelta tra "E", "P" o "C"
    */
    static filtraRicerca(statoCliente) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.wait(3000).get('.icon').find('[name="filter"]').click()

        //Verifica Stato
        cy.get('.filter-group').find('span:contains("Effettivo"):visible')
        cy.get('.filter-group').find('span:contains("Potenziale"):visible')
        cy.get('.filter-group').find('span:contains("Cessato"):visible')

        //Verifica Tipo
        cy.get('.filter-group').find('span:contains("Persona fisica"):visible')
        cy.get('.filter-group').find('span:contains("Persona giuridica"):visible')

        //Effettuaimo il choose in base a statoCliente
        //Filtriamo la ricerca in base a statoCliente
        switch (statoCliente) {
            case "E":
                cy.get('.filter-group').contains('Potenziale').click()
                cy.get('.filter-group').contains('Cessato').click()
                break
            case "P":
                cy.get('.filter-group').contains('Effettivo').click()
                cy.get('.filter-group').contains('Cessato').click()
                break
            case "C":
                cy.get('.filter-group').contains('Potenziale').click()
                cy.get('.filter-group').contains('Effettivo').click()
                break
        }

        cy.get('.footer').find('button').contains('applica').click()
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 })
        cy.get('lib-applied-filters-item').find('span').should('be.visible')
    }

    static checkTabs() {
        const tabs = ['clients', 'sales', 'le mie info'];
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').find('a').should('have.length', 3)
            .each(($tab, i) => {
                expect($tab.text()).to.include(tabs[i]);
            });
    }

    /**
     * 
     * @param {string} value - Keywork da cercare (in base alla keyword vengono dei suggerimenti di default correlati)
     */
    static checkSuggestedLinks(value) {
        let suggLinks = []
        let linkLength = 0
        switch (value.toLocaleLowerCase()) {
            case 'incasso':
                suggLinks = [
                    'Incasso per conto',
                    'Incasso massivo'
                ]
                linkLength = 2
                break
            case 'fastquote':
                suggLinks = [
                    'FastQuote Infortuni da circolazione',
                    'FastQuote Impresa e Albergo'
                ]
                linkLength = 2
                break
            case 'ultra':
                suggLinks = [
                    'Allianz Ultra Casa e Patrimonio',
                    'Allianz Ultra Casa e Patrimonio BMP',
                    'Allianz Ultra Salute'
                ]
                linkLength = 3
                break
            case 'ro':
                suggLinks = [
                    'Provvigioni',
                    'Quattroruote - Calcolo valore Veicolo',
                    'Interrogazioni Centralizzate',
                    'Recupero preventivi e quotazioni',
                    'Monitoraggio Polizze Proposte'
                ]
                linkLength = 5
                break
        }

        cy.get('lib-navigation-item-link').find('.title').should('have.length', linkLength)
            .each(($suggerimenti, i) => {
                expect($suggerimenti.text()).to.include(suggLinks[i]);
            })
        cy.get('lib-advice-navigation-section').contains('Suggerimenti di navigazione').should('exist').and('be.visible')
    }

    static checkLeMieInfo() {
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').click().should('have.class', 'active')
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('le mie info').invoke('text').then($theElement => {
            const count = $theElement.substring(14, $theElement.length - 2)
            if (count > 0) {
                const tabsContainer = ['Circolari'];
                cy.get('[class="lib-tab-info nx-grid"]').find('[href^="/matrix/search/infos"]').should('have.length', 1).each(($tab, i) => {
                    expect($tab.text()).to.include(tabsContainer[i]);
                })

                cy.get('[class="lib-tab-info nx-grid"]').contains('Circolari')
                cy.get('lib-circular-item').each($circular => {
                    cy.wrap($circular).find('[class="date"]').then($date => {
                        if ($date.text().trim().length > 0) {
                            expect($date.text()).not.to.be.empty
                            // cy.wrap($date).should('contain',$date.text().trim()) 
                        } else {
                            assert.fail('Manca data su un elemento della pagina circulars')
                        }
                    })
                    cy.wrap($circular).find('[class="network"]').then($company => {
                        if ($company.text().trim().length > 0) {
                            expect($company.text()).not.to.be.empty
                            // cy.wrap($company).should('contain',$company.text().trim()) 
                        } else {
                            assert.fail('Manca compagnia su un elemento della pagina circulars')
                        }
                    })
                    cy.wrap($circular).find('[class="info"]').then($info => {
                        if ($info.text().trim().length > 0) {
                            expect($info.text()).not.to.be.empty
                            // cy.wrap($info).should('contain',$info.text().trim()) 
                        } else {
                            assert.fail('Manca info a chi sono indirizzate su un elemento della pagina circulars')
                        }
                    })
                    cy.wrap($circular).find('[class="title"]').then($title => {
                        if ($title.text().trim().length > 0) {
                            expect($title.text()).not.to.be.empty
                            // cy.wrap($title).should('contain',$title.text().trim()) 
                        } else {
                            assert.fail('Manca titolo su un elemento della pagina circulars')
                        }
                    })

                })
                //#region Company Handbook(attualmente rimosso)
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
                //#endregion Company Handbook
            }
        })
    }

    static checkClients() {
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('clients').click().should('have.class', 'active')
        cy.get('[class="docs-grid-colored-row tabs-container nx-grid__row"]').contains('clients').invoke('text').then($theElement => {
            const count = $theElement.substring(10, $theElement.length - 2)
            if (count > 0) {
                const tabsContainer = ['Clienti'];
                cy.get('[class="lib-tab-info nx-grid"]').find('[href^="/matrix/search/clients/clients"]').should('have.length', 1).each(($tab, i) => {
                    expect($tab.text()).to.include(tabsContainer[i]);
                })

                cy.get('[class="lib-tab-info nx-grid"]').contains('Clienti')
                cy.get('lib-client-item').each($client => {

                    cy.wrap($client).find('[class="name"]').then($name => {
                        if ($name.text().trim().length > 0) {
                            expect($name.text()).not.to.be.empty
                            // cy.wrap($name).should('contain',$name.text().trim()) 
                        } else {
                            assert.fail('Manca nome su un elemento della pagina clients')
                        }
                    })
                    cy.wrap($client).find('[class="lib-agency-container"]').then($agency => {
                        if ($agency.text().trim().length > 0) {
                            expect($agency.text()).not.to.be.empty
                            // cy.wrap($agency).should('contain',$agency.text().trim()) 
                        } else {
                            assert.fail('Manca agenzia su un elemento della pagina clients')
                        }
                    })
                    cy.wrap($client).find('[class="item"]').then($item => {
                        if ($item.text().trim().length > 0) {
                            expect($item.text()).not.to.be.empty
                            // cy.wrap($item).should('contain', $item.text().trim()) 
                        } else {
                            assert.fail('Manca indirizzo su un elemento della pagina clients')
                        }
                    })

                })
            }
        })
    }

    static checkAggancioCircolari() {
        cy.get('[class="lib-tab-info nx-grid"]').contains('Circolari').click()
        cy.get('lib-circular-item').find('a').first().invoke('removeAttr', 'target').click()
        cy.get('#detailStampaImg')
        cy.go('back')
    }

    static checkButtonRicercaClassica() {
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible')
    }
    /**
     * Verifica i tab(Clients,sales,Le mie info) presenti dopo
     * aver effettuato la ricerca
     */
    static checkTabDopoRicerca() {
        const tabHeader = [
            'clients',
            'sales',
            'le mie info'
        ]
        cy.get('[class^="docs-grid-colored-row tabs-container"]').find('[class^="tab-header"]').each(($tab, i) => {
            expect($tab.text().trim()).to.include(tabHeader[i]);
        })
    }

    /**
     * Verifica i tab(Clients,sales,Le mie info) presenti dopo
     * aver effettuato la ricerca
     */
    static checkTabSuggerimentiRicerca() {
        const tabHeader = [
            'clients',
            'sales',
            'le mie info'
        ]
        cy.get('[class^="docs-grid-colored-row tabs-container"]').find('[class^="tab-header"]').each(($tab, i) => {
            expect($tab.text().trim()).to.include(tabHeader[i]);
        })
    }

    /**
     * Verifica che la ricerca non ha prodotto risultati
     */
    static checkClienteNotFound() {
        cy.get('lib-client-item').first().click().wait(2000)
        cy.get('body').should('contain.text', 'Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari')
    }
}

export default LandingRicerca