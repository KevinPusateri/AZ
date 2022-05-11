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

    it('Verifica aggancio Allianz Placement Platform', function () {
        if (!keys.ALLIANZ_PLACEMENT_PLATFORM)
            this.skip()
        TopBar.clickSales()
        cy.pause()
        BurgerMenuSales.clickLink('Allianz placement platform')
    })
})