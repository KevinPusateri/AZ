/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion

//#region Before and After
beforeEach(() => {
    cy.clearCookies();
    cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
    cy.intercept(/launch-*/,'ignore').as('launchStaging');

    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName.includes('news')) {
            req.alias = 'gqlNews'
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
    cy.wait('@gqlNews')
})

afterEach(() => {
    cy.get('body').then($body => {
        if ($body.find('.user-icon-container').length > 0) {   
            cy.get('.user-icon-container').click();
            cy.wait(1000).contains('Logout').click()
            cy.wait(delayBetweenTests)
        }
    });
    cy.clearCookies();
})
//#endregion Before and After

describe('Matrix Web : Navigazioni da Burger Menu in Sales', function () {

    it('Verifica i link da Burger Menu', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        const linksBurgerMotor = [
            'FastQuote Auto',
            'Preventivo anonimo Motor',
            'MiniFlotte',
            'Allianz Ultra Casa e Patrimonio',
            'Allianz Ultra Casa e Patrimonio BMP',
            'Allianz Ultra Salute',
            'Allianz1 Business',
            'FastQuote Infortuni da circolazione',
            'FastQuote Universo Persona',
            'FastQuote Universo Salute',
            'FastQuote Universo Persona Malattie Gravi',
            'FastQuote Impresa e Albergo',
            'Allianz1 premorienza',
            'Preventivo Anonimo Vita Individuali',
            'Trattative Auto corporate',
            'Gestione richieste per PA',
            'Sfera',
            'Campagne Commerciali',
            'Recupero preventivi e quotazioni',
            'Documenti da firmare',
            'Gestione attività in scadenza',
            'Manutenzione portafoglio RV Midco',
            'Vita Corporate',
            'Monitoraggio Polizze Proposte',
            'Certificazione fiscale',
            'Manutenzione Portafoglio Auto',
            'Cruscotto certificati applicazioni',
            'Cruscotto riepiloghi polizze abb.',
            'Report Cliente T4L',
            'Documenti annullati',
            'GED – Gestione Documentale',
            'Documenti da gestire',
            'Folder',
            'AllianzGlobalAssistance',
            'Allianz placement platform',
            'Qualità portafoglio auto',
            'App cumulo terremoti',
            'Note di contratto',
            'ACOM Gestione iniziative',
        ]
        cy.get('nx-expansion-panel').find('a').should('have.length',39).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurgerMotor[i]);
        })

    });

    //#region New Business
    //#region Motor
    it('Verifica aggancio FasqtQuote Auto', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Auto').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
    });
    
    it('Verifica aggancio Preventivo anonimo Motor', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Preventivo anonimo Motor').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="› Home"]').invoke('attr','value').should('equal','› Home')
        getIFrame().find('input[value="› Avanti"]').invoke('attr','value').should('equal','› Avanti')
        cy.get('a').contains('Sales').click()
    });
    
    it('Verifica aggancio MiniFlotte', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('MiniFlotte').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
        cy.get('a').contains('Sales').click()
    });
    //#endregion
    
    //#region  Rami Vari
    it('Verifica aggancio Allianz Ultra Casa e Patrimonio', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz Ultra Casa e Patrimonio').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
    });
    
    it('Verifica aggancio Allianz Ultra Casa e Patrimonio BMP', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz Ultra Casa e Patrimonio BMP').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
    });

    it('Verifica aggancio Allianz Ultra Salute', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz Ultra Salute').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
    });

    it('Verifica aggancio Allianz1 Business', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz1 Business').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio FastQuote Universo Persona', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Universo Persona').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio FastQuote Universo Salute', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Universo Salute').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio FastQuote Universo Persona Malattie Gravi', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Universo Persona Malattie Gravi').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio FastQuote Infortuni da circolazione', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Infortuni da circolazione').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
    })
    
    it('Verifica aggancio FastQuote Impresa e Albergo', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Impresa e Albergo').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
    })
    //#endregion

    //#region Vita
    it('Verifica aggancio Allianz1 premorienza', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz1 premorienza').click()
        cy.intercept({
            method: 'POST',
            url: /RicercaContrattoQuadro*/
        }).as('ricercaContrattoQuadro');
        cy.get('nx-modal-container').find('.agency-row').first().click()
        cy.wait('@ricercaContrattoQuadro', { requestTimeout: 25000 });

        getIFrame().find('[class="col-sm-3 col-md-offset-1 col-md-2"]:contains("Ricerca"):visible')
        cy.get('a').contains('Sales').click()
    })
    it('Verifica aggancio Preventivo Anonimo Vita Individuali', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Preventivo Anonimo Vita Individuali').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="Home"]').invoke('attr','value').should('equal','Home')
        getIFrame().find('input[value="Indietro"]').invoke('attr','value').should('equal','Indietro')
        getIFrame().find('input[value="Avanti"]').invoke('attr','value').should('equal','Avanti')
        cy.get('a').contains('Sales').click()
    })
    //#endregion

    //#region Mid Corporate
    it('Verifica aggancio Trattative Auto corporate', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Trattative Auto corporate').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
        getIFrame().find('span:contains("Guida"):visible')
        cy.get('a').contains('Sales').click()
    })
    
    it('Verifica aggancio Gestione richieste per PA', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Gestione richieste per PA').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Visualizza"):visible')
        cy.get('a').contains('Sales').click()
    })
    //#endregion
    //#endregion

    //#region Gestione
    it('Verifica aggancio Sfera', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Sfera').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Applica filtri"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Campagne Commerciali', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Campagne Commerciali').click()
        cy.url().should('include', '/campaign-manager')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Recupero preventivi e quotazioni').click()
        cy.intercept({
            method: 'POST',
            url: /InizializzaApplicazione/
          }).as('inizializzaApplicazione');
        cy.get('nx-modal-container').find('.agency-row').first().click()
        cy.wait('@inizializzaApplicazione', { requestTimeout: 20000 });
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })
            
    it('Verifica aggancio Documenti da firmare', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Documenti da firmare').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })


    // TODO: Non sono visibili 
    // it('Verifica aggancio Manutenzione portafoglio RV MIDCO', function () {
    //     cy.url().should('include', '/sales')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('Manutenzione portafoglio RV Midco').click()
    //     cy.intercept({
    //         method: 'POST',
    //         url: /DirMPTF*/
    //     }).as('danni');
    //     cy.get('nx-modal-container').find('.agency-row').first().click()
    //     cy.wait('@danni', { requestTimeout: 25000 });
    //     getIFrame().find('form > input[value="Applica Filtri"]').invoke('attr','value').should('equal','Applica Filtri')  
    //     cy.get('a').contains('Sales').click()
    // })

    // TODO: Non sono visibili
    // it('Verifica aggancio Vita Corporate', function () {
    //     cy.url().should('include', '/sales')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('Vita Corporate').click()
    //     // cy.intercept({
    //     //     method: 'POST',
    //     //     url: 'https://portaleagenzie.pp.azi.allianz.it/Vita/'
    //     // }).as('prova');
    //     cy.get('nx-modal-container').find('.agency-row').first().click()
    //     // cy.wait('@prova', { requestTimeout: 25000 });

    //     getIFrame().find('form').within($form =>{
      
    //         // cy.get('input[name="email"]').type('john.doe@email.com')
    //     })
    //     cy.get('a').contains('Sales').click()
    // })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Polizze Proposte').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })
    
    it('Verifica aggancio Certificazione fiscale', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Certificazione fiscale').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Manutenzione Portafoglio', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Manutenzione Portafoglio').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="Carica Polizze"]').invoke('attr','value').should('equal','Carica Polizze')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Cruscotto certificati applicazioni', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Cruscotto certificati applicazioni').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })

    
    it('Verifica aggancio Cruscotto riepiloghi polizze abb.', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Cruscotto riepiloghi polizze abb.').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })

    // TODO : non vede Ricerca
    it('Verifica aggancio Report Cliente T4L', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Report Cliente T4L').click()
        cy.intercept({
            method: 'POST',
            url: /Vita*/
        }).as('prova');
        cy.get('nx-modal-container').find('.agency-row').first().click()
        cy.wait('@prova', { requestTimeout: 25000 });
        getIFrame().find('input[value="Ricerca"]').invoke('attr','value').should('equal','Ricerca')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Documenti annullati', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Documenti annullati').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('span:contains("Storico polizze e quietanze distrutte"):visible')
        cy.get('a').contains('Sales').click()
    })

    // // Unauthorize! Interrompre cypress
    // it('Verifica aggancio GED – Gestione Documentale', function () {
    //     cy.url().should('include', '/sales')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('GED – Gestione Documentale').click()
    //     cy.get('nx-modal-container').find('.agency-row').first().click()

    //     cy.get('a').contains('Sales').click()
    // })

    it('Verifica aggancio Documenti da gestire', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Documenti da gestire').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="Ricerca Attività"]').invoke('attr','value').should('equal','Ricerca Attività')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio Folder', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Folder').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
    })

    it('Verifica aggancio AllianzGlobalAssistance', function () {
    cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('AllianzGlobalAssistance').invoke('removeAttr','target').click()
        cy.get('#logo-oazis-header')
        cy.go('back')
    })

    //TODO Al momento rimosso in quanto il target non è presente in quanto c'è la finestra di disambiguazione di mezzo
    // it('Verifica aggancio Allianz Placement Platform', function () {
    // cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('include', '/sales')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('Allianz placement platform').click()
    //     cy.get('nx-modal-container').find('.agency-row').first().click()
    // })

    it('Verifica aggancio Qualità portafoglio auto', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Qualità portafoglio auto').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('a').contains('Sales').click()
    })

    // Accesso Negato
    // it('Verifica aggancio App cumulo terremoti', function () {
    //     cy.url().should('include', '/sales')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('App cumulo terremoti').click()
    //     cy.get('nx-modal-container').find('.agency-row').first().click()

    //     cy.get('a').contains('Sales').click()
    // })

    it('Verifica aggancio Note di contratto', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('include', '/sales')
        cy.get('lib-burger-icon').click()
        cy.contains('Note di contratto').click()
        cy.get('nx-modal-container').find('.agency-row').first().click()
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('a').contains('Sales').click()
    })

    //TODO Al momento rimosso in quanto il target non è presente in quanto c'è la finestra di disambiguazione di mezzo
    // it('Verifica aggancio ACOM Gestione iniziative', function () {
    // cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('include', '/sales')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('ACOM Gestione iniziative').click()
    //     cy.get('nx-modal-container').find('.agency-row').first().click()

    // })
    //#endregion
})