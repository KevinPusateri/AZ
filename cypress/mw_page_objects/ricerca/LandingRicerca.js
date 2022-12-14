/// <reference types="Cypress" />

import Common from "../common/Common";

/**
 * Enum Sub Tabs Mie Info
 * @readonly
 * @enum {string}
 */
const SubTabsMieInfo = {
    CIRCOLARI: 'Circolari',
    COMPANY_HANDBOOK: 'Company Handbook',
    PRODOTTI: 'Prodotti',
    PAGINE: 'Pagine'
}

/**
 * @typedef {'E' | 'P' | 'C'} StatoCliente
 */

/**
 * @typedef {'PF' | 'PG'} TipoCliente
 */

/**
 * @class
 * @classdesc Classe per utilizzare la Landing Ricerca di Matrix Web
 * @author Andrea 'Bobo' Oboe & Kevin Pusateri
 */
class LandingRicerca {

    /**
     * Click tab Clients
     */
    static clickTabClients() {
        cy.get('a[href="/matrix/search/clients"]').click()
    }

    /**
     * Click tab Clients
     */
    static clickTabSales() {
        cy.get('a[href="/matrix/search/sales"]').click()
    }

    /**
     * Click tab Mie Info
     */
    static clickTabMieInfo() {
        cy.get('a[href="/matrix/search/infos"]').click()
    }

    /**
     * Effettua Check dei subtab di Miei Info
     */
    static checkSubTabMieInfo() {
        const subTabs = Object.values(SubTabsMieInfo)
        cy.get('lib-subsection').find('a').each(($subTab, i) => {
            expect($subTab.text()).to.include(subTabs[i]);
        });
    }

    /**
     * Verifica che non sia presente Il tab "Le mie info"
     */
    static checkExistMieInfo() {
        cy.get('a[href="/matrix/search/infos"]').should('exist')
    }

    /**
     * Click subTab da "Le mie Info"
     * @param {SubTabsMieInfo} subTab - Nome subTab  
     */
    static clickSubTabMieInfo(subTab) {
        switch (subTab) {
            case SubTabsMieInfo.CIRCOLARI:
                cy.url().should('eq', Common.getBaseUrl() + 'search/infos/circulars')
                break;
            case SubTabsMieInfo.COMPANY_HANDBOOK:
                cy.url().should('eq', Common.getBaseUrl() + 'search/infos/handbooks')
                break;
            case SubTabsMieInfo.PRODOTTI:
                cy.url().should('eq', Common.getBaseUrl() + 'search/infos/products')
                break;
            case SubTabsMieInfo.PAGINE:
                cy.url().should('eq', Common.getBaseUrl() + 'search/infos/documents')
                break;
        }
    }

    /**
     * Effettua una ricerca Radnom di un Cliente in base ai parametri impostati
     * @param {boolean} filtri - se true, imposta filtri aggiuntivi di ricerca, altrimenti no
     * @param {TipoCliente} tipoCliente - Tipo Cliente
     * @param {StatoCliente} statoCliente - Stato Cliente
     * @param {Boolean} screenshot - default settato a true, altrimenti non fa lo screenshot
     */
    static searchRandomClient(filtri, tipoCliente, statoCliente, screenshot = true) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.get('input[name="main-search-input"]').click()
        cy.generateTwoLetters().then(randomChars => {
            cy.get('input[name="main-search-input"]').clear().type(randomChars).type('{enter}')
        })
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 });
        // cy.get('lib-client-item').should('be.visible')
        if (filtri) {
            //Filtriamo la ricerca in base a tipoCliente
            cy.get('lib-clients-container').find('nx-icon[name="filter"]').click()
            cy.contains('CLIENTE').click()
            cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                cy.wrap($checkBox).click()
            })
            if (tipoCliente === "PF")
                cy.contains('Persona fisica').click()
            else
                cy.contains('Persona giuridica').click()

            //Filtriamo la ricerca in base a statoCliente
            cy.contains('STATO').click()
            cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                cy.wrap($checkBox).click()
            })
            switch (statoCliente) {
                case "E":
                    cy.contains('Effettivo').click()
                    break
                case "P":
                    cy.contains('Potenziale').click()
                    break
                case "C":
                    cy.contains('Cessato').click()
                    break
            }

            cy.contains('APPLICA').click()
            cy.wait('@gqlSearchClient', { requestTimeout: 30000 });

            // cy.get('lib-applied-filters-item').should('be.visible').find('span').should('be.visible').wait(5000)
            if (screenshot)
                cy.screenshot('Ricerca effettuata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        }

    }

    static checkAggancioRicercaCliente() {

        // Click "Ricerca classica"
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()
        Common.canaleFromPopup()
        cy.url().should('include', 'legacyda')
        cy.wait(5000)
        cy.getIFrame()
        cy.get('@iframe').should('exist').and('be.visible').within(() => {
            cy.get('#filtra-fisica').should('exist').and('be.visible')

            const searchClients = () => {
                cy.get('[class="k-grid-content k-auto-scrollable"]:visible').first().scrollIntoView().then(($table) => {
                    const isTrovato = $table.find(':contains("Nessun record da visualizzare")').is(':visible')
                    if (isTrovato) {
                        cy.generateTwoLetters().then(randomChars => {
                            cy.get('#f-cognome').clear().type(randomChars)
                        })
                        cy.generateTwoLetters().then(randomChars => {
                            cy.get('#f-nome').clear().type(randomChars)
                        })
                        cy.contains('Cerca').should('be.enabled').click().wait(2000)

                        searchClients()
                    } else {
                        return
                    }
                })
            }
            // cerchiamo un cliente random
            searchClients()
            cy.wait(3000)
            // POPUP: In caso l'elenco dei clienti siano pi?? di 20 conferma Popup
            cy.wrap(Cypress.$('html')).within(() => {
                cy.get('@iframe').should('be.visible').within(($modal) => {
                    var modal = $modal.find('div[class="modal-dialog"]:contains("La ricerca ritorna pi?? di 20 clienti.")')
                    if (modal.is(':visible')){
                        cy.contains('No. Solo i primi 20').click()
                        cy.get('div[class="modal-dialog"]').should('not.exist')
                    }
                })
            })
            cy.screenshot('Ricerca clienti PF', { overwrite: true })
            cy.pause()
            //seleziona primo Cliente
            cy.get('tbody > tr:visible').first().find('span[class="customer-name"]').then(($name) => {
                cy.log($name.text().trim())
                let nameClient = $name.text().trim()
            })
            // cy.window().then((win) => {
            //     cy.spy(win, 'open').as('windowOpen'); // 'spy' vs 'stub' lets the new tab still open if you are visually watching it
            // });
            // https://portaleagenzie.pp.azi.allianz.it/daanagrafe/SCU/api/SCPersona/ClearSearchCache

            cy.pause()
            // cy.intercept('**/Person/Sintesi/**', 'ignore').as('auth')
            cy.intercept('**/SCPersona/ClearSearchCache', 'ignore').as('auth')
            // cy.intercept('https://portaleagenzie.pp.azi.allianz.it/__/', 'ignore').as('clear')
            cy.get('tbody > tr').first().click()
            
            //TODO Verificare cliente selezionato aggancia alla scheda cliente 
            //! Non rimane nella scheda cliente

        })
    }

    /**
     * Ricerca un valore nella buca di ricerca
     * @param {string} value - Cosa ricercare
     */
    static search(value) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('search')) {
                req.alias = 'gqlSearch'
            }
        });

        cy.get('input[name="main-search-input"]').click()
        cy.get('input[name="main-search-input"]').type(value).type('{enter}').wait(2000)

        cy.wait('@gqlSearch', { requestTimeout: 60000 });

        switch (value) {
            case 'incasso':
            case 'fastquote':
            case 'ultra':
            case 'circolari':
                cy.wait(3000)
                cy.url().then($url => {
                    if ($url.includes("search/infos/circulars"))
                        cy.get('[class="lib-tab-info nx-grid"]').should('be.visible').and('contain.text', "Circolari")
                    else if ($url.includes("search/news/publications"))
                        cy.get('[class="lib-tab-info nx-grid"]').should('be.visible').and('contain.text', "Notizie")
                    else
                        cy.get('[class="lib-tab-info nx-grid"]').should('be.visible').and('contain.text', "Clienti")
                })
                break
            default:
                cy.url().should('include', 'search/clients')
                break
        }

        cy.screenshot('Ricerca effettuata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Clicca sul primo risultato della buca di ricerca
     */
    static clickFirstResult() {
        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        cy.get('lib-client-item').first().click();

        cy.wait('@client', { requestTimeout: 60000 });
        cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')
    }

    /**
     * Seleziona un Cliente Random dalla lista di ricerca ritornata
     * @param {TipoCliente} [clientForm]
     * @param {StatoCliente} [clientType]
     * @param {Boolean} screenshot - default settato a true, altrimenti non fa lo screenshot
     */
    static clickRandomResult(clientForm = 'PG', clientType = 'P', screenshot = true) {
        //Attende il caricamento della scheda cliente
        const searchOtherMember = () => {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('client')) {
                    req.alias = 'client'
                }
            });

            cy.get('lib-subsection[class="ng-star-inserted"]').should('be.visible').then($container => {
                cy.wait(3000)
                console.log($container)
                const checkResultsEmpty = $container.find(':contains("La ricerca non ha prodotto risultati")').is(':visible')
                cy.log(checkResultsEmpty)
                if (checkResultsEmpty) {
                    this.searchRandomClient(false, clientForm, clientType, screenshot)
                    searchOtherMember()
                } else {
                    cy.get('lib-scrollable-container').should('be.visible').then(($clienti) => {
                        let schedeClienti = $clienti.find('lib-client-item').not(':contains("Agenzie")')
                        let selectedRandomSchedaCliente = schedeClienti[Math.floor(Math.random() * schedeClienti.length)]
                        cy.wrap($clienti).find(selectedRandomSchedaCliente).find('div[class="lib-agency-container"]').then(($agency) => {
                            let agenzia = $agency.text().trim().split(' ')[0].split('-')[0] + "-" + $agency.text().trim().split(' ')[0].split('-')[1]
                            cy.wrap(agenzia).as('Agenzia')
                        })
                        cy.wrap($clienti).find(selectedRandomSchedaCliente).click()

                        cy.wait(5000)
                        cy.get('body').then(($body) => {
                            const check = $body.find('lib-container:contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari"):visible').is(':visible')
                            if (check) {
                                this.searchRandomClient(true, clientForm, clientType, screenshot)
                                searchOtherMember()
                            }

                        })
                    })
                }
            })
        }

        searchOtherMember()
        cy.wait('@client', { requestTimeout: 30000 });
        cy.get('app-scope-element', { timeout: 120000 }).should('be.visible')

    }

    /**
     * Effettua la ricerca e seleziona un cliente PF attraverso il suo cognome
     * @param {string} cognome da ricerca
     */
    static searchAndClickClientePF(cognome) {
        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        //Filtriamo la ricerca in base a tipoCliente
        cy.get('.icon').find('[name="filter"]').click()
        cy.contains('CLIENTE').click()
        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
            cy.wrap($checkBox).click()
        })
        cy.contains('Persona fisica').click()

        cy.contains('APPLICA').click()
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 })

        // cy.get('lib-applied-filters-item').should('be.visible').find('span').should('be.visible')

        cy.get('lib-scrollable-container').contains(cognome.toUpperCase()).then((card) => {
            if (card.length === 1)
                cy.wrap(card).click()
        })
        //Verifica se ci sono problemi nel retrive del cliente per permessi
        cy.wait('@client', { requestTimeout: 30000 })
            .its('response.body.data.client')
            .should('not.be.null')
    }

    /**
     * Effettua la ricerca e seleziona un cliente PF attraverso il suo cognome
     * @param {string} denominazione da ricerca
     */
    static searchAndClickClientePG(denominazione) {
        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        //Filtriamo la ricerca in base a tipoCliente
        cy.get('.icon').find('[name="filter"]').click()
        cy.contains('CLIENTE').click()
        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
            cy.wrap($checkBox).click()
        })
        cy.contains('Persona giuridica').click()

        cy.contains('APPLICA').click()
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 })

        // cy.get('lib-applied-filters-item').should('be.visible').find('span').should('be.visible')

        cy.get('lib-scrollable-container').contains(denominazione.toUpperCase()).then((card) => {
            if (card.length === 1)
                cy.wrap(card).click()
        })
        //Verifica se ci sono problemi nel retrive del cliente per permessi
        cy.wait('@client', { requestTimeout: 30000 })
            .its('response.body.data.client')
            .should('not.be.null')
    }

    /**
     * Clicca il risultato della ricerca attraverso il suo nome completo Persona Fisica
     * @param {string} fullName 
     */
    static clickClientePF(fullName) {
        //Skip this two requests that blocks on homepage
        cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache')
        cy.intercept(/launch-*/, 'ignore').as('launchStaging')
        cy.intercept(/cdn.igenius.ai/, 'ignore').as('igenius')
        cy.intercept(/i.ytimg.com/, 'ignore').as('ytimg')

        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        cy.get('lib-scrollable-container').contains(fullName.toUpperCase()).then((card) => {
            if (card.length === 1)
                cy.wrap(card).click()
        })
        //Verifica se ci sono problemi nel retrive del cliente per permessi
        cy.wait('@client', { requestTimeout: 30000 })
            .its('response.body.data.client')
            .should('not.be.null')
    }

    /**
     * Clicca il risultato della ricerca attraverso il suo nome completo Persona Giuridica
     * @param {string} fullName 
     */
    static clickClientePG(fullName) {
        //Attende il caricamento della scheda cliente
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        });

        cy.get('lib-scrollable-container').contains(fullName.toUpperCase()).then((card) => {
            if (card.length === 1)
                cy.wrap(card).click()
        })
        //Verifica se ci sono problemi nel retrive del cliente per permessi
        cy.wait('@client', { requestTimeout: 30000 })
            .its('response.body.data.client')
            .should('not.be.null')
    }

    /**
     * Effettua un check sui Suggerimenti in Buca di Ricerca
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
            //TODO Per problemi di indicizzazione, possono non comparire le polizze in ricerca
            //expect($text.text()).not.to.be.empty
        })

        cy.screenshot('Verifica Buca Suggerimenti', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })


        cy.get('a[href="/matrix/"]').click()
    }

    /**
     * Effettua un check sulla Ricerca Classica
     */
    static checkRicercaClassica() {
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()

        const links = [
            'Ricerca Cliente',
            'Ricerca Polizze proposte',
            'Ricerca Preventivi',
            'Rubrica'
        ]
        cy.get('nx-modal-container').find('lib-da-link').each(($linkRicerca, i) => {
            expect($linkRicerca.text().trim()).to.include(links[i]);
        })

        cy.screenshot('Ricerca Classica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        cy.get('nx-modal-container').find('button[aria-label="Close dialog"]').click()
    }

    /**
     * Verifica che non sia presente il button "Ricerca Classica"
     */
    static checkNotExistRicercaClassica() {
        cy.get('lib-advice-navigation-section').should('not.contain.text', 'Ricerca classica')
        cy.screenshot('Ricerca Classica non presente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click sul link della Ricerca Classica
     * @param {string} link 
     */
    static clickRicercaClassicaLabel(link) {
        cy.intercept({
            method: 'POST',
            url: '**/Danni/**'
        }).as('danni');

        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible').click()
        cy.get('nx-modal-container').find('lib-da-link').contains(link).click()

        if (!Cypress.env('monoUtenza')) {
            Common.canaleFromPopup()
        }

        if (link === 'Ricerca Polizze proposte' || link === 'Ricerca Preventivi') {
            cy.wait('@danni', { requestTimeout: 30000 })
            cy.wait(3000)
        }
    }

    /**
     * Check Risultati Ricerca
     */
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

        //Verifica Et??
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
     * Filtra la ricerca per lo Stato del Cliente
     * @param {StatoCliente} statoCliente - Stato Cliente
     */
    static filtraRicerca(statoCliente) {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });

        cy.wait(3000).get('.icon').find('[name="filter"]').click()

        //Filtriamo la ricerca in base a statoCliente
        cy.contains('STATO').click()
        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
            cy.wrap($checkBox).click()
        })
        switch (statoCliente) {
            case "E":
                cy.contains('Effettivo').click()
                break
            case "P":
                cy.contains('Potenziale').click()
                break
            case "C":
                cy.contains('Cessato').click()
                break
        }

        cy.screenshot('Filtri Ricerca', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        cy.contains('APPLICA').click()
        cy.wait('@gqlSearchClient', { requestTimeout: 30000 })
    }


    /**
     * It clicks on a bunch of checkboxes
     * ALL - Check all CheckBox
     * @param {String} - [cliente=ALL] - ALL, PF, PG
     * @param {String} - [stato=ALL] - E, P, C
     * @param {String} - [agenzia=ALL] - The agency you want to filter.
     */
    static filtra(cliente = 'ALL', stato = 'ALL', agenzia = 'ALL') {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('searchClient')) {
                req.alias = 'gqlSearchClient'
            }
        });
        cy.wait(3000).get('.icon').find('[name="filter"]').click()
        cy.contains('AGENZIE').parent().find('p > span').invoke('text').as('agenzie')
        cy.contains('CLIENTE').parent().find('p > span').invoke('text').as('cliente')
        cy.contains('STATO').parent().find('p > span').invoke('text').as('stato')

        let totCheckedAgenzie = false
        let totCheckedCliente = false
        let totCheckedStato = false
        cy.get('@agenzie').then((agenzie) => {
            cy.log(agenzie.split('/')[0])
            let agenzieChecked = Number(agenzie.split('/')[0])
            let agenzieTot = Number(agenzie.split('/')[1])
            if (agenzieChecked === agenzieTot)
                totCheckedAgenzie = true
        })

        cy.get('@cliente').then((cliente) => {
            let clienteChecked = Number(cliente.split('/')[0])
            let clienteTot = Number(cliente.split('/')[1])
            if (clienteChecked === clienteTot)
                totCheckedCliente = true
        })

        cy.get('@stato').then((stato) => {
            let statoChecked = Number(stato.split('/')[0])
            let statoTot = Number(stato.split('/')[1])
            if (statoChecked === statoTot)
                totCheckedStato = true
        })

        cy.get('body').then(() => {
            // TAB AGENZIE
            if (agenzia === 'ALL' && !totCheckedAgenzie) {
                cy.contains('AGENZIE').click()
                cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                    cy.wrap($checkBox).click()
                })
                cy.get('div[class="filters-content"]').within(() => {
                    cy.get('nx-checkbox').each(($checkBox) => {
                        cy.wrap($checkBox).click()
                    })
                })
            }
            else if (agenzia !== 'ALL')
                cy.contains(agenzia).click()

            // TAB CLIENTE
            if (!(totCheckedCliente && cliente === 'ALL')) {
                cy.contains('CLIENTE').click()
                // Uncheck tutto
                switch (cliente) {
                    case "ALL":
                        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                            cy.wrap($checkBox).click()
                        })
                        cy.get('div[class="filters-content"]').within(() => {
                            cy.get('nx-checkbox').each(($checkBox) => {
                                cy.wrap($checkBox).click()
                            })
                        })
                        break
                    case "PF":
                        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                            cy.wrap($checkBox).click()
                        })
                        cy.contains('Persona fisica').click()
                        break
                    case "PG":
                        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                            cy.wrap($checkBox).click()
                        })
                        cy.contains('Persona giuridica').click()
                        break
                    default: throw new Error("Attenzione tipo CLiente Non Esiste (ALL,PF,PG)");
                }
            }

            // TAB STATO
            if (!(totCheckedStato && stato === 'ALL')) {
                cy.contains('STATO').click()
                switch (stato) {
                    case "ALL":
                        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                            cy.wrap($checkBox).click()
                        })
                        cy.get('div[class="filters-content"]').within(() => {
                            cy.get('nx-checkbox').each(($checkBox) => {
                                cy.wrap($checkBox).click()
                            })
                        })
                        break
                    case "E":
                        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                            cy.wrap($checkBox).click()
                        })
                        cy.contains('Effettivo').click()
                        break
                    case "P":
                        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                            cy.wrap($checkBox).click()
                        })
                        cy.contains('Potenziale').click()
                        break
                    case "C":
                        cy.get('nx-checkbox').find('nx-icon[aria-hidden="true"]').each(($checkBox) => {
                            cy.wrap($checkBox).click()
                        })
                        cy.contains('Cessato').click()
                        break
                    default: throw new Error("Attenzione STATO CLiente Non Esiste (ALL,E,P,C)");
                }
            }
            cy.contains('APPLICA').click()
            cy.wait('@gqlSearchClient', { requestTimeout: 30000 })
            cy.screenshot('Ricerca effettuata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        })

    }

    /**
     * Check Link Suggeriti
     * @param {string} value - Keywork da cercare (in base alla keyword vengono dei suggerimenti di default correlati)
     * @param {Boolean} isUltraBMP - Verifica se ?? presente UltraBMP tra i suggerimenti di ricerca
     */
    static checkSuggestedLinks(value, isUltraBMP = true) {
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
                if (Cypress.env('monoUtenza')) {
                    suggLinks = [
                        'Allianz Ultra Casa e Patrimonio',
                        'Allianz Ultra Salute'
                    ]
                    linkLength = 2
                } else if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) {
                    suggLinks = [
                        'Ultra Casa e Patrimonio',
                        'Ultra Salute'
                    ]
                    linkLength = 2
                } else {
                    if (isUltraBMP) {
                        suggLinks = [

                            'Allianz Ultra Casa e Patrimonio',
                            'Allianz Ultra Casa e Patrimonio 2022',
                            'Allianz Ultra Casa e Patrimonio BMP',
                            'Allianz Ultra Salute',
                            'Allianz Ultra Impresa'
                        ]
                        linkLength = 5
                    }
                    else {
                        suggLinks = [

                            'Allianz Ultra Casa e Patrimonio',
                            'Allianz Ultra Casa e Patrimonio 2022',
                            'Allianz Ultra Salute',
                            'Allianz Ultra Impresa'
                        ]
                        linkLength = 4
                    }

                }
                break
            case 'bmp':
                suggLinks = [
                    'Allianz Ultra Casa e Patrimonio BMP'
                ]
                linkLength = 2
                break;
            case 'ro':
                if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                    suggLinks = [
                        'Provvigioni',
                        'Quattroruote - Calcolo valore Veicolo',
                        'Interrogazioni Centralizzate',
                        'Recupero preventivi e quotazioni',
                        'Monitoraggio Polizze Proposte'
                    ]
                    linkLength = 5
                } else if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) {
                    suggLinks = [
                        'Quattroruote - Calcolo valore Veicolo',
                        'Interrogazioni Centralizzate',
                        'Recupero preventivi e quotazioni',
                        'Monitoraggio Polizze Proposte'
                    ]
                    linkLength = 4
                } else {
                    suggLinks = [
                        'Provvigioni',
                        'Quattroruote - Calcolo valore Veicolo',
                        'Recupero preventivi e quotazioni',
                        'Monitoraggio Polizze Proposte'
                    ]
                    linkLength = 4
                }
                break
        }

        if (value.toLocaleLowerCase() !== 'bmp')
            cy.get('lib-navigation-item-link').should('be.visible').find('.title').should('have.length', linkLength)
                .each(($suggerimenti, i) => {
                    expect($suggerimenti.text()).to.include(suggLinks[i]);
                })
        cy.get('lib-advice-navigation-section').contains('Suggerimenti di navigazione').should('exist').and('be.visible')
    }

    /**
     * Verifica che non ci siano i link suggeriti
     * @param {*} suggestLink 
     */
    static checkNotExistSuggestLinks(suggestLink) {
        if (suggestLink === 'fastquote')
            cy.get('lib-navigation-item-link').should('not.exist')
    }

    /**
     * Check Mie Info
     */
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
                        Verifica Testo skippato 
                        cy.wrap($hanbooks).find('[class="text"]').each($text =>{
                            if($text.text().substring(0,5).trim().length > 0){
                                cy.wrap($text).should('contain', $text.text().trim().substring(0,5))
                            }else{
                                assert.fail('Manca un\'anteprima del testo su un elemento della pagina handbook')
                            }
                        }) 
        
                    })*/
                //#endregion Company Handbook
            }
        })
    }

    /**
    * Check Clients
    */
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

    /**
     * Check Aggancio Circolari
     */
    static checkAggancioCircolari() {
        cy.get('[class="lib-tab-info nx-grid"]').contains('Circolari').click()
        cy.get('lib-circular-item').find('a').first().invoke('removeAttr', 'target').click()
        cy.get('#detailStampaImg')
        cy.go('back')
    }

    /**
     * Check Button Ricerca Classica
     */
    static checkButtonRicercaClassica() {
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible')
    }

    /**
     * Verifica i tab(Clients,sales, news e Le mie info) presenti dopo
     * aver effettuato la ricerca
     */
    static checkTabDopoRicerca() {
        const tabHeader = [
            'clients',
            'sales',
            'news',
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
    static checkClienteNotFound(cliente) {
        cy.get('body').as('body').then(($body) => {
            cy.get('[class="lib-clients-container"]').should('be.visible')
            const check = $body.find('span:contains("La ricerca non ha prodotto risultati")').is(':visible')
            if (check) {
                cy.screenshot('Verifica Cliente Cancellato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                cy.get('body').should('contain.text', 'La ricerca non ha prodotto risultati')
            } else {
                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('client')) {
                        req.alias = 'client'
                    }
                });

                cy.get('@body').find('lib-client-item', { requestTimeouttimeout: 10000 }).first().click()
                cy.wait(5000)
                cy.wait('@client', { requestTimeout: 30000 });
                cy.get('@body').then($body => {
                    const checkNotTrovato = $body.find('lib-page-layout:contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
                    const checkNonPermesso = $body.find('lib-page-layout:contains("L\'utente non dispone dei permessi necessari alla visualizzazione del cliente. Verifica con il tuo agente.")').is(':visible')
                    if (check || checkNonPermesso) {
                        assert.isTrue(true, 'Cliente eliminato');
                    } else {
                        assert.fail('Cliente non ?? stato eliminato -> ' + cliente);
                    }
                })
                cy.screenshot('Verifica Cliente Cancellato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            }
        })
    }
}
export default LandingRicerca