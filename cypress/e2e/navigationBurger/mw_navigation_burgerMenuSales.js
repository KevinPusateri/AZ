/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
var url = Common.getUrlBeforeEach() + 'sales/'
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
//#endregion


let keys = {
    PREVENTIVO_MOTOR: true,
    FLOTTE_E_CONVENZIONI: true,
    MINIFLOTTE: true,
    TRATTATIVE_AUTO_CORPORATE: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022: true,
    ALLIANZ_ULTRA_SALUTE: true,
    ALLIANZ_ULTRA_IMPRESA: true,
    ALLIANZ1_BUSINESS: true,
    FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE: true,
    FASTQUOTE_UNIVERSO_PERSONA: true,
    FASTQUOTE_UNIVERSO_SALUTE: true,
    FASTQUOTE_UNIVERSO_PERSONA_MALATTIE_GRAVI: true,
    FASTQUOTE_IMPRESA_E_ALBERGO: true,
    ALLIANZ1_PREMORIENZA: true,
    PREVENTIVO_ANONIMO_VITA_INDIVIDUALI: true,
    GESTIONE_RICHIESTE_PER_PA: true,
    NUOVO_SFERA: true,
    SFERA: true,
    CAMPAGNE_COMMERCIALI: true,
    RECUPERO_PREVENTIVI_E_QUOTAZIONI: true,
    DOCUMENTI_DA_FIRMARE: true,
    GESTIONE_ATTIVITA_IN_SCADENZA: true,
    MANUTENZIONE_PORTAFOGLIO_RV_MIDCO: true,
    VITA_CORPORATE: true,
    MONITORAGGIO_POLIZZE_PROPOSTE: true,
    CERTIFICAZIONE_FISCALE: true,
    MANUTENZIONE_PORTAFOGLIO_AUTO: true,
    CRUSCOTTO_CERTIFICATI_APPLICAZIONI: true,
    CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB: true,
    REPORT_CLIENTE_T4L: true,
    DOCUMENTI_ANNULLATI: true,
    GED_GESTIONE_DOCUMENTALE: true,
    DOCUMENTI_DA_GESTIRE: true,
    FOLDER: true,
    ALLIANZ_GLOBAL_ASSISTANCE_OAZIS: true,
    ALLIANZ_GLOBAL_ASSISTANCE_GLOBY: true,
    ALLIANZ_PLACEMENT_PLATFORM: true,
    QUALITÀ_PORTAFOGLIO_AUTO: true,
    APP_CUMULO_TERREMOTI: false,
    NOTE_DI_CONTRATTO: true,
    ACOM_GESTIONE_INIZIATIVE: true,
    SAFE_DRIVE_AUTOVETTURE: true
}

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        BurgerMenuSales.getProfiling(data.tutf, keys)
    })
    TopBar.clickSales()
})
beforeEach(() => {
    cy.preserveCookies()
    cy.ignoreRequest()
    BurgerMenuSales.clickBurgerMenu()
})
afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        cy.ignoreRequest()
        cy.visit(url)
        cy.wait(5000)
    }
})
after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
})

describe('Matrix Web : Navigazioni da Burger Menu in Sales', options, function () {

    it('Verifica i link da Burger Menu', function () {
        BurgerMenuSales.checkExistLinks(keys)
    });

    //#region New Business
    //#region Motor
    it('Verifica aggancio Preventivo Motor', function () {
        if (!keys.PREVENTIVO_MOTOR)
            this.skip()

        BurgerMenuSales.clickLink('Preventivo Motor', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Safe Drive Autovetture', function () {
        if (!keys.SAFE_DRIVE_AUTOVETTURE)
            this.skip()

        BurgerMenuSales.clickLink('Safe Drive Autovetture', false)
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Flotte e Convenzioni', function () {
        if (!keys.FLOTTE_E_CONVENZIONI || (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')))
            this.skip()

        BurgerMenuSales.clickLink('Flotte e Convenzioni', false)
        BurgerMenuSales.backToSales()

    });

    it('Verifica aggancio MiniFlotte', function () {
        if (!keys.MINIFLOTTE)
            this.skip()

        BurgerMenuSales.clickLink('MiniFlotte', false)
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Trattative Auto Corporate', function () {
        if (!keys.TRATTATIVE_AUTO_CORPORATE)
            this.skip()

        BurgerMenuSales.clickLink('Trattative Auto Corporate', false)
        BurgerMenuSales.backToSales()
    })
    // #endregion

    // #region  Rami Vari
    it((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Verifica aggancio Ultra Casa e Patrimonio' : 'Verifica aggancio Allianz Ultra Casa e Patrimonio', function () {
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO)
            this.skip()

        BurgerMenuSales.clickLink((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Casa e Patrimonio' : 'Allianz Ultra Casa e Patrimonio', false)
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Allianz Ultra Casa e Patrimonio BMP', function () {
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP)
            this.skip()

        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP', false)
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Allianz Ultra Casa e Patrimonio 2022', function () {
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_2022)
            this.skip()

        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio 2022', false)
        BurgerMenuSales.backToSales()
    });

    it((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Verifica aggancio Ultra Salute' : 'Verifica aggancio Allianz Ultra Salute', function () {
        if (!keys.ALLIANZ_ULTRA_SALUTE)
            this.skip()

        BurgerMenuSales.clickLink((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Salute' : 'Allianz Ultra Salute', false)
        BurgerMenuSales.backToSales()
    });

    it((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Verifica aggancio Ultra Impresa' : ' Verifica aggancio Allianz Ultra Impresa', function () {
        if (!keys.ALLIANZ_ULTRA_IMPRESA)
            this.skip()

        BurgerMenuSales.clickLink((Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? 'Ultra Impresa' : 'Allianz Ultra Impresa', false)
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Allianz1 Business', function () {
        if (!keys.ALLIANZ1_BUSINESS)
            this.skip()

        BurgerMenuSales.clickLink('Allianz1 Business', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio FastQuote Infortuni da circolazione', function () {
        if (!keys.FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE || (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')))
            this.skip()

        BurgerMenuSales.clickLink('FastQuote Infortuni da circolazione', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio FastQuote Impresa e Albergo', function () {
        if (!keys.FASTQUOTE_IMPRESA_E_ALBERGO)
            this.skip()

        BurgerMenuSales.clickLink('FastQuote Impresa e Albergo', false)
        BurgerMenuSales.backToSales()
    })
    // #endregion

    // #region Vita
    it('Verifica aggancio Allianz1 premorienza', function () {
        if (!keys.ALLIANZ1_PREMORIENZA)
            this.skip()

        BurgerMenuSales.clickLink('Allianz1 premorienza', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Preventivo Anonimo Vita Individuali', function () {
        if (!keys.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI)
            this.skip()

        BurgerMenuSales.clickLink('Preventivo Anonimo Vita Individuali', false)
        BurgerMenuSales.backToSales()
    })
    // #endregion

    // #region Mid Corporate
    it('Verifica aggancio Gestione richieste per PA', function () {
        if (!keys.GESTIONE_RICHIESTE_PER_PA)
            this.skip()

        BurgerMenuSales.clickLink('Gestione richieste per PA', false)
        BurgerMenuSales.backToSales()
    })
    // #endregion
    // #endregion

    //#region Gestione
    it('Verifica aggancio Nuovo Sfera', function () {
        if (!keys.NUOVO_SFERA)
            this.skip()

        BurgerMenuSales.clickLink('Nuovo Sfera', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Sfera', function () {
        if (!keys.SFERA || (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')))
            this.skip()

        BurgerMenuSales.clickLink('Sfera', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Campagne Commerciali', function () {
        if (!keys.CAMPAGNE_COMMERCIALI)
            this.skip()

        BurgerMenuSales.clickLink('Campagne Commerciali', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function () {
        if (!keys.RECUPERO_PREVENTIVI_E_QUOTAZIONI)
            this.skip()

        BurgerMenuSales.clickLink('Recupero preventivi e quotazioni', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Documenti da firmare', function () {
        if (!keys.DOCUMENTI_DA_FIRMARE)
            this.skip()

        BurgerMenuSales.clickLink('Documenti da firmare', false)
        BurgerMenuSales.backToSales()
    })

    //! SOLO in Firefox Funziona
    it('Verifica aggancio Gestione attività in scadenza', function () {
        if (!keys.GESTIONE_ATTIVITA_IN_SCADENZA)
            this.skip()

        BurgerMenuSales.clickLink('Gestione attività in scadenza', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Manutenzione portafoglio RV Midco', function () {
        if (!keys.MANUTENZIONE_PORTAFOGLIO_RV_MIDCO)
            this.skip()

        BurgerMenuSales.clickLink('Manutenzione portafoglio RV Midco', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Vita Corporate', function () {
        if (!keys.VITA_CORPORATE)
            this.skip()

        BurgerMenuSales.clickLink('Vita Corporate', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function () {
        if (!keys.MONITORAGGIO_POLIZZE_PROPOSTE)
            this.skip()

        BurgerMenuSales.clickLink('Monitoraggio Polizze Proposte', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Certificazione fiscale', function () {
        if (!keys.CERTIFICAZIONE_FISCALE)
            this.skip()

        BurgerMenuSales.clickLink('Certificazione fiscale', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Manutenzione Portafoglio Auto', function () {
        if (!keys.MANUTENZIONE_PORTAFOGLIO_AUTO)
            this.skip()

        BurgerMenuSales.clickLink('Manutenzione Portafoglio Auto', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Cruscotto certificati applicazioni', function () {
        if (!keys.CRUSCOTTO_CERTIFICATI_APPLICAZIONI)
            this.skip()

        BurgerMenuSales.clickLink('Cruscotto certificati applicazioni', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Cruscotto riepiloghi polizze abb.', function () {
        if (!keys.CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB)
            this.skip()

        BurgerMenuSales.clickLink('Cruscotto riepiloghi polizze abb.', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Report Cliente T4L', function () {
        if (!keys.REPORT_CLIENTE_T4L)
            this.skip()

        BurgerMenuSales.clickLink('Report Cliente T4L', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Documenti annullati', function () {
        if (!keys.DOCUMENTI_ANNULLATI)
            this.skip()

        BurgerMenuSales.clickLink('Documenti annullati', false)
        BurgerMenuSales.backToSales()
    })

    it.only('Verifica aggancio GED – Gestione Documentale', function () {
        if (Cypress.env('isAviva'))
            this.skip()

        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                //! Settare HTTP_PROXY e NO_PROXY(vedi file BurgerMenuLinkEsterni.js)
                cy.task('warn', 'Eseguire questo Test in Locale con Proxy')
                // BurgerMenuSales.clickLink('GED – Gestione Documentale', false)
            } else {
                //! Settare HTTP_PROXY e NO_PROXY(vedi file BurgerMenuLinkEsterni.js)
                cy.task('warn', 'Eseguire questo Test in Locale con Proxy')
                this.skip()
            }
        })
    })

    it('Verifica aggancio Documenti da gestire', function () {
        if (!keys.DOCUMENTI_DA_GESTIRE)
            this.skip()

        BurgerMenuSales.clickLink('Documenti da gestire', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Folder', function () {
        if (!keys.FOLDER)
            this.skip()

        BurgerMenuSales.clickLink('Folder', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Allianz Global Assistance - OAZIS', function () {
        if (!keys.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS)
            this.skip()
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                //! Settare HTTP_PROXY e NO_PROXY(vedi file BurgerMenuLinkEsterni.js)
                cy.task('warn', 'Eseguire questo Test in Locale con Proxy')
                // BurgerMenuSales.clickLink('Allianz global assistance - OAZIS', false)
            } else {
                //! Settare HTTP_PROXY e NO_PROXY(vedi file BurgerMenuLinkEsterni.js)
                cy.task('warn', 'Eseguire questo Test in Locale con Proxy')
                this.skip()
            }
        })
    })

    it('Verifica aggancio Allianz Global Assistance - GLOBY', function () {
        // throw new Error('Settare il proxy')
        if (!keys.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY)
            this.skip()
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                //! Settare HTTP_PROXY e NO_PROXY(vedi file BurgerMenuLinkEsterni.js)
                cy.task('warn', 'Eseguire questo Test in Locale con Proxy')
                // BurgerMenuSales.clickLink('Allianz global assistance - GLOBY', false)
            } else {
                //! Settare HTTP_PROXY e NO_PROXY(vedi file BurgerMenuLinkEsterni.js)
                cy.task('warn', 'Eseguire questo Test in Locale con Proxy')
                this.skip()
            }
        })
    })

    it('Verifica aggancio Allianz Placement Platform', function () {
        if (!keys.ALLIANZ_PLACEMENT_PLATFORM)
            this.skip()

        BurgerMenuSales.clickLink('Allianz placement platform', false)
    })

    it('Verifica aggancio Qualità portafoglio auto', function () {
        if (!keys.QUALITÀ_PORTAFOGLIO_AUTO)
            this.skip()

        BurgerMenuSales.clickLink('Qualità portafoglio auto', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Note di contratto', function () {
        if (!keys.NOTE_DI_CONTRATTO)
            this.skip()

        BurgerMenuSales.clickLink('Note di contratto', false)
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio ACOM Gestione iniziative', function () {
        if (!keys.ACOM_GESTIONE_INIZIATIVE)
            this.skip()

        BurgerMenuSales.clickLink('ACOM Gestione iniziative', false)
    })
    //#endregion
})