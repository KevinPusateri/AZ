/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


let keys = {
    PREVENTIVO_MOTOR: true,
    FLOTTE_E_CONVENZIONI: true,
    MINIFLOTTE: true,
    TRATTATIVE_AUTO_CORPORATE: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO: true,
    ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP: true,
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
    ALLIANZ_GLOBAL_ASSISTANCE: true,
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
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
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

describe('Matrix Web : Navigazioni da Burger Menu in Sales', function () {

    it('Verifica i link da Burger Menu', function () {
        TopBar.clickSales()
        BurgerMenuSales.checkExistLinks(keys)
    });

    //#region New Business
    //#region Motor
    it('Verifica aggancio Preventivo Motor', function () {
        if (!keys.PREVENTIVO_MOTOR)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Preventivo Motor')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Safe Drive Autovetture', function () {
        if (!keys.SAFE_DRIVE_AUTOVETTURE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Safe Drive Autovetture')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Flotte e Convenzioni', function () {
        if (!keys.FLOTTE_E_CONVENZIONI || Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Flotte e Convenzioni')
        BurgerMenuSales.backToSales()

    });

    it('Verifica aggancio MiniFlotte', function () {
        if (!keys.MINIFLOTTE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('MiniFlotte')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Trattative Auto Corporate', function () {
        if (!keys.TRATTATIVE_AUTO_CORPORATE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Trattative Auto Corporate')
        BurgerMenuSales.backToSales()
    })
    // #endregion

    // #region  Rami Vari
    it('Verifica aggancio ' + (Cypress.env('isAviva')) ? 'Ultra Casa e Patrimonio' : 'Allianz Ultra Casa e Patrimonio', function () {
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink(Cypress.env('isAviva') ? 'Ultra Casa e Patrimonio' : 'Allianz Ultra Casa e Patrimonio')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Allianz Ultra Casa e Patrimonio BMP', function () {
        if (!keys.ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio ' + (Cypress.env('isAviva')) ? 'Ultra Salute' : 'Allianz Ultra Salute', function () {
        if (!keys.ALLIANZ_ULTRA_SALUTE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink(Cypress.env('isAviva') ? 'Ultra Salute' : 'Allianz Ultra Salute')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio ' + (Cypress.env('isAviva')) ? 'Ultra Impresa' : 'Allianz Ultra Impresa', function () {
        if (!keys.ALLIANZ_ULTRA_IMPRESA)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink(Cypress.env('isAviva') ? 'Ultra Impresa' : 'Allianz Ultra Impresa')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Allianz1 Business', function () {
        if (!keys.ALLIANZ1_BUSINESS)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz1 Business')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio FastQuote Infortuni da circolazione', function () {
        if (!keys.FASTQUOTE_INFORTUNI_DA_CIRCOLAZIONE || Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('FastQuote Infortuni da circolazione')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio FastQuote Impresa e Albergo', function () {
        if (!keys.FASTQUOTE_IMPRESA_E_ALBERGO)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('FastQuote Impresa e Albergo')
        BurgerMenuSales.backToSales()
    })
    // #endregion

    // #region Vita
    it('Verifica aggancio Allianz1 premorienza', function () {
        if (!keys.ALLIANZ1_PREMORIENZA)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz1 premorienza')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Preventivo Anonimo Vita Individuali', function () {
        if (!keys.PREVENTIVO_ANONIMO_VITA_INDIVIDUALI)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Preventivo Anonimo Vita Individuali')
        BurgerMenuSales.backToSales()
    })
    // #endregion

    // #region Mid Corporate
    it('Verifica aggancio Gestione richieste per PA', function () {
        if (!keys.GESTIONE_RICHIESTE_PER_PA)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Gestione richieste per PA')
        BurgerMenuSales.backToSales()
    })
    // #endregion
    // #endregion

    //#region Gestione
    it('Verifica aggancio Nuovo Sfera', function () {
        if (!keys.NUOVO_SFERA)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Nuovo Sfera')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Sfera', function () {
        if (!keys.SFERA || Cypress.env('isAviva'))
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Sfera')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Campagne Commerciali', function () {
        if (!keys.CAMPAGNE_COMMERCIALI)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Campagne Commerciali')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function () {
        if (!keys.RECUPERO_PREVENTIVI_E_QUOTAZIONI)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Recupero preventivi e quotazioni')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Documenti da firmare', function () {
        if (!keys.DOCUMENTI_DA_FIRMARE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Documenti da firmare')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Gestione attività in scadenza', function () {
        if (!keys.GESTIONE_ATTIVITA_IN_SCADENZA)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Gestione attività in scadenza')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Manutenzione portafoglio RV Midco', function () {
        if (!keys.MANUTENZIONE_PORTAFOGLIO_RV_MIDCO)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Manutenzione portafoglio RV Midco')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Vita Corporate', function () {
        if (!keys.VITA_CORPORATE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Vita Corporate')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function () {
        if (!keys.MONITORAGGIO_POLIZZE_PROPOSTE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Monitoraggio Polizze Proposte')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Certificazione fiscale', function () {
        if (!keys.CERTIFICAZIONE_FISCALE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Certificazione fiscale')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Manutenzione Portafoglio Auto', function () {
        if (!keys.MANUTENZIONE_PORTAFOGLIO_AUTO)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Manutenzione Portafoglio Auto')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Cruscotto certificati applicazioni', function () {
        if (!keys.CRUSCOTTO_CERTIFICATI_APPLICAZIONI)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Cruscotto certificati applicazioni')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Cruscotto riepiloghi polizze abb.', function () {
        if (!keys.CRUSCOTTO_RIEPILOGHI_POLIZZE_ABB)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Cruscotto riepiloghi polizze abb.')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Report Cliente T4L', function () {
        if (!keys.REPORT_CLIENTE_T4L)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Report Cliente T4L')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Documenti annullati', function () {
        if (!keys.DOCUMENTI_ANNULLATI)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Documenti annullati')
        BurgerMenuSales.backToSales()
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
        if (!keys.DOCUMENTI_DA_GESTIRE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Documenti da gestire')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Folder', function () {
        if (!keys.FOLDER)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Folder')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Allianz Global Assistance', function () {
        if (!keys.ALLIANZ_GLOBAL_ASSISTANCE)
            this.skip()
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                TopBar.clickSales()
                BurgerMenuSales.clickLink('Allianz Global Assistance')
            }
        })
    })

    it('Verifica aggancio Allianz Placement Platform', function () {
        if (!keys.ALLIANZ_PLACEMENT_PLATFORM)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz placement platform')
    })

    it('Verifica aggancio Qualità portafoglio auto', function () {
        if (!keys.QUALITÀ_PORTAFOGLIO_AUTO)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Qualità portafoglio auto')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Note di contratto', function () {
        if (!keys.NOTE_DI_CONTRATTO)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Note di contratto')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio ACOM Gestione iniziative', function () {
        if (!keys.ACOM_GESTIONE_INIZIATIVE)
            this.skip()
        TopBar.clickSales()
        BurgerMenuSales.clickLink('ACOM Gestione iniziative')
    })
    //#endregion
})