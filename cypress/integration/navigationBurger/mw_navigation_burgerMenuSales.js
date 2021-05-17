/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
const baseUrl = Cypress.env('baseUrl') 
//#endregion


//#region Global Variables
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .iframe();
  
    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
    .its('0.contentDocument').should('exist');
  
    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const canaleFromPopup = () => {cy.get('body').then($body => {
    if ($body.find('nx-modal-container').length > 0) {   
        cy.get('nx-modal-container').find('.agency-row').first().click()
    }
});
}
//#endregion

//#region Before and After
before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  
    cy.intercept('POST', '/graphql', (req) => {
    // if (req.body.operationName.includes('notifications')) {
    //     req.alias = 'gqlNotifications'
    // }
    if (req.body.operationName.includes('news')) {
        req.alias = 'gqlNews'
    }
    })
    cy.viewport(1920, 1080)
  
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait(2000).wait('@gqlNews')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
  })
  
  after(() => {
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
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        const linksBurgerMotor = [
            // 'FastQuote Auto',
            'Preventivo Motor',//NEW
            // 'Preventivo anonimo Motor',
            'Flotte e Convenzioni', // NEW
            'MiniFlotte',
            'Trattative Auto Corporate',
            'Allianz Ultra Casa e Patrimonio',
            'Allianz Ultra Casa e Patrimonio BMP',
            'Allianz Ultra Salute',
            'Allianz1 Business',
            'FastQuote Infortuni da circolazione',
            //'FastQuote Universo Persona',
            //'FastQuote Universo Salute',
            //'FastQuote Universo Persona Malattie Gravi',
            'FastQuote Impresa e Albergo',
            'Allianz1 premorienza',
            'Preventivo Anonimo Vita Individuali',
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
            'Allianz Global Assistance',
            'Allianz placement platform',
            'Qualità portafoglio auto',
            'App cumulo terremoti',
            'Note di contratto',
            'ACOM Gestione iniziative',
        ]
        cy.get('nx-expansion-panel').find('a').should('have.length',36).each(($checkLinksBurger, i) => {
            expect($checkLinksBurger.text().trim()).to.include(linksBurgerMotor[i]);
        })

    });

    //#region New Business

    // è stato TOLTO
    //#region Motor
    // it('Verifica aggancio FasqtQuote Auto', function () {
    //     cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('FastQuote Auto').click()
    //     canaleFromPopup()
    //     getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
    //     cy.get('a').contains('Sales').click()
    //     cy.url().should('eq',baseUrl+ 'sales/')
    // });
    
    it('Verifica aggancio Preventivo Motor', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Preventivo Motor').click()
        cy.intercept({
            method: 'POST',
            url: '**/assuntivomotor/**'
        }).as('getMotor');
        canaleFromPopup()
        cy.wait('@getMotor', { requestTimeout: 50000 });
        getIFrame().find('button:contains("Calcola"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    // è stato TOLTO
    // it('Verifica aggancio Preventivo anonimo Motor', function () {
    //     cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('Preventivo anonimo Motor').click()
    //     canaleFromPopup()
    //     getIFrame().find('input[value="› Home"]').invoke('attr','value').should('equal','› Home')
    //     getIFrame().find('input[value="› Avanti"]').invoke('attr','value').should('equal','› Avanti')
    //     cy.get('a').contains('Sales').click()
    //     cy.url().should('eq',baseUrl+ 'sales/')
    // });
    
    it('Verifica aggancio Flotte e Convenzioni', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Flotte e Convenzioni').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Avanti"]').invoke('attr','value').should('equal','› Avanti')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    });

    it('Verifica aggancio MiniFlotte', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('MiniFlotte').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    });

    it('Verifica aggancio Trattative Auto corporate', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Trattative Auto Corporate').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Nuova Trattativa"):visible')
        getIFrame().find('span:contains("Guida"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    //#endregion
    
    //#region  Rami Vari
    it('Verifica aggancio Allianz Ultra Casa e Patrimonio', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz Ultra Casa e Patrimonio').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    });
    
    it('Verifica aggancio Allianz Ultra Casa e Patrimonio BMP', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz Ultra Casa e Patrimonio BMP').click()
        canaleFromPopup()
        cy.wait(8000)
        getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    });

    it('Verifica aggancio Allianz Ultra Salute', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz Ultra Salute').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Calcola nuovo preventivo"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    });

    it('Verifica aggancio Allianz1 Business', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz1 Business').click()
        canaleFromPopup()
        getIFrame().find('button:contains("CALCOLA IL TUO PREZZO"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

 /*   it('Verifica aggancio FastQuote Universo Persona', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Universo Persona').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio FastQuote Universo Salute', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Universo Salute').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio FastQuote Universo Persona Malattie Gravi', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Universo Persona Malattie Gravi').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })*/

    it('Verifica aggancio FastQuote Infortuni da circolazione', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Infortuni da circolazione').click()
        canaleFromPopup()
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    
    it('Verifica aggancio FastQuote Impresa e Albergo', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('FastQuote Impresa e Albergo').click()
        canaleFromPopup()
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        getIFrame().find('input[value="› Calcola"]').invoke('attr','value').should('equal','› Calcola')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    //#endregion

    // da verificare il wait
    //#region Vita
    it('Verifica aggancio Allianz1 premorienza', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.intercept({
            method: 'POST',
            url: '**/sales/**'
        }).as('getSalesPremo');
        cy.contains('Allianz1 premorienza').click()
        cy.wait(5000)
        canaleFromPopup()
        cy.wait('@getSalesPremo', { requestTimeout: 40000 });
        cy.wait(20000)
        getIFrame().find('button[class="btn btn-info btn-block"]:contains("Ricerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Preventivo Anonimo Vita Individuali', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Preventivo Anonimo Vita Individuali').click()
        canaleFromPopup()
        cy.wait(20000)
        getIFrame().find('input[value="Home"]').invoke('attr','value').should('equal','Home')
        getIFrame().find('input[value="Indietro"]').invoke('attr','value').should('equal','Indietro')
        getIFrame().find('input[value="Avanti"]').invoke('attr','value').should('equal','Avanti')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    //#endregion

    //#region Mid Corporate
    it('Verifica aggancio Gestione richieste per PA', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Gestione richieste per PA').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Visualizza"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    //#endregion
    //#endregion

    //#region Gestione
    it('Verifica aggancio Sfera', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Sfera').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Applica filtri"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Campagne Commerciali', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Campagne Commerciali').click()
        canaleFromPopup()
        cy.url().should('include', '/campaign-manager')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.intercept({
            method: 'POST',
            url: /InizializzaApplicazione/
        }).as('inizializzaApplicazione');
        cy.contains('Recupero preventivi e quotazioni').click()
          canaleFromPopup()
          cy.wait('@inizializzaApplicazione', { requestTimeout: 30000 });
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
            
    it('Verifica aggancio Documenti da firmare', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Documenti da firmare').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    
    it('Verifica aggancio Manutenzione portafoglio RV MIDCO', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Manutenzione portafoglio RV Midco').click()
        cy.intercept({
            method: 'POST',
            url: /DirMPTF*/
        }).as('danni');
        canaleFromPopup()
        cy.wait('@danni', { requestTimeout: 25000 });
        cy.wait(15000)
        getIFrame().find('#ctl00_MasterBody_btnApplicaFiltri[value="Applica Filtri"]').invoke('attr','value').should('equal','Applica Filtri')  
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Vita Corporate', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Vita Corporate').click()
        cy.intercept({
            method: 'POST',
            url: 'https://portaleagenzie.pp.azi.allianz.it/Vita/'
        }).as('getVita');
        canaleFromPopup()
        cy.wait('@getVita', { requestTimeout: 25000 });
        cy.wait(10000)
        getIFrame().find('.k-link:contains("Consultazione Collettive e Versamenti"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Monitoraggio Polizze Proposte').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    
    it('Verifica aggancio Certificazione fiscale', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Certificazione fiscale').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Manutenzione Portafoglio', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Manutenzione Portafoglio').click()
        canaleFromPopup()
        getIFrame().find('input[value="Carica Polizze"]').invoke('attr','value').should('equal','Carica Polizze')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Cruscotto certificati applicazioni', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Cruscotto certificati applicazioni').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })
    
    it('Verifica aggancio Cruscotto riepiloghi polizze abb.', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Cruscotto riepiloghi polizze abb.').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Report Cliente T4L', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.intercept({
            method: 'POST',
            url: /Vita*/
        }).as('vita');
        cy.contains('Report Cliente T4L').click()
        canaleFromPopup()
        // cy.wait('@vita', { requestTimeout: 30000 });
        cy.wait(6000)
        getIFrame().find('input[value="Ricerca"]').invoke('attr','value').should('equal','Ricerca')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Documenti annullati', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Documenti annullati').click()
        canaleFromPopup()
        getIFrame().find('span:contains("Storico polizze e quietanze distrutte"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    // // // Unauthorize! apre nuova pagina ma ha un canale e aggiungere excel TFS
    // it('Verifica aggancio GED – Gestione Documentale', function () {
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('GED – Gestione Documentale').click()
    //      canaleFromPopup()
    //      cy.get('body').then($body => {
    //         $body.find('h1:contains("Unauthorized!"):visible')
    //     })
    //     cy.get('a').contains('Sales').click()
    // })

    it('Verifica aggancio Documenti da gestire', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Documenti da gestire').click()
        cy.wait(5000)
        canaleFromPopup()
        getIFrame().find('input[value="Ricerca Attività"]').invoke('attr','value').should('equal','Ricerca Attività')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    it('Verifica aggancio Folder', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Folder').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    // TODO:non clicca il button
 /*   it('Verifica aggancio Allianz Global Assistance', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Allianz Global Assistance').invoke('removeAttr','target').click()
        cy.get('#logo-oazis-header')
        cy.go('back')
        cy.url().should('eq',baseUrl+ 'sales/')
    })*/

    //TODO Al momento rimosso in quanto il target non è presente in quanto c'è la finestra di disambiguazione di mezzo e aggiungere su excel
    // it('Verifica aggancio Allianz Placement Platform', function () {
    // cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('Allianz placement platform').click()
    //     cy.get('nx-modal-container').find('.agency-row').first().click()
    // })

    it('Verifica aggancio Qualità portafoglio auto', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Qualità portafoglio auto').click()
        canaleFromPopup()
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    // Accesso Negato e su excel
    // it('Verifica aggancio App cumulo terremoti', function () {
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('App cumulo terremoti').click()
    // canaleFromPopup()

    //     cy.get('a').contains('Sales').click()
    // })

    it('Verifica aggancio Note di contratto', function () {
        cy.get('app-product-button-list').find('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
        cy.get('lib-burger-icon').click()
        cy.contains('Note di contratto').click()
        canaleFromPopup()
        getIFrame().find('input[value="Cerca"]').invoke('attr','value').should('equal','Cerca')
        cy.get('a').contains('Sales').click()
        cy.url().should('eq',baseUrl+ 'sales/')
    })

    //TODO Al momento rimosso in quanto il target non è presente in quanto c'è la finestra di disambiguazione di mezzo e excel
    // it('Verifica aggancio ACOM Gestione iniziative', function () {
    // cy.get('app-product-button-list').find('a').contains('Sales').click()
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('ACOM Gestione iniziative').click()
    // canaleFromPopup()

    // })
    //#endregion
})