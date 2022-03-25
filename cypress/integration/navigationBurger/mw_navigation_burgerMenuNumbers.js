/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuNumbers from "../../mw_page_objects/burgerMenu/BurgerMenuNumbers"

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
    MONITORAGGIO_FONTI: true,
    MONITORAGGIO_CARICO: true,
    MONITORAGGIO_CARICO_FONTE: true,
    X_ADVISOR: true,
    INCENTIVAZIONE: true,
    INCENTIVAZIONE_RECRUITING: true,
    ANDAMENTI_TECNICI: true,
    ESTRAZIONI_AVANZATE: true,
    SCARICO_DATI: true,
    INDICI_DIGITALI: true,
    NEW_BUSINESS_DANNI: true,
    NEW_BUSINESS_ULTRA_CASA_PATRIMONIO: true,
    NEW_BUSINESS_ULTRA_SALUTE: true,
    NEW_BUSINESS_ULTRA_IMPRESA: true,
    NEW_BUSINESS_VITA: true,
    NEW_BUSINESS_ALLIANZ1: true,
    MONITORAGGIO_PTF_DANNI: true,
    MONITORAGGIO_RISERVE_VITA: true,
    RETENTION_MOTOR: true,
    RETENTION_RAMI_VARI: true,
    MONITORAGGIO_ANDAMENTO_PREMI: true,
    MONITORAGGIO_RICAVI_AGENZIA: true,
    CAPITALE_VITA_SCADENZA: true
}

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        BurgerMenuNumbers.getProfiling(data.tutf, keys)
    })
})


beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
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
describe('Matrix Web : Navigazioni da Burger Menu in Numbers', function () {

    it('Verifica i link da Burger Menu', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.checkExistLinks(keys)
    })

    it('Verifica aggancio Monitoraggio Carico', function () {
        if (!keys.MONITORAGGIO_CARICO)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Carico')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Carico per Fonte', function () {
        if (!keys.MONITORAGGIO_CARICO_FONTE)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Carico per Fonte')
        BurgerMenuNumbers.backToNumbers()

    })

    it('Verifica aggancio X - Advisor', function () {
        if (!keys.X_ADVISOR)
            this.skip()
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                TopBar.clickNumbers()
                BurgerMenuNumbers.clickLink('X - Advisor')
            }
        })
    })

    it('Verifica aggancio Incentivazione', function () {
        if (!keys.INCENTIVAZIONE && !Cypress.env('isAviva'))
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Incentivazione')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Incentivazione Recruiting', function () {
        if (!keys.INCENTIVAZIONE_RECRUITING)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Incentivazione Recruiting')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Andamenti Tecnici', function () {
        if (!keys.ANDAMENTI_TECNICI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Andamenti Tecnici')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Estrazioni Avanzate', function () {
        if (!keys.ESTRAZIONI_AVANZATE)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Estrazioni Avanzate')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Scarico Dati', function () {
        if (!keys.SCARICO_DATI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Scarico Dati')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Indici Digitali', function () {
        if (!keys.INDICI_DIGITALI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Indici Digitali')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Danni', function () {
        if (!keys.NEW_BUSINESS_DANNI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Danni')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Ultra Casa e Patrimonio', function () {
        if (!keys.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Ultra Casa e Patrimonio')
        BurgerMenuNumbers.backToNumbers()
    })

    it.only('Verifica aggancio New Business Ultra Salute', function () {
        if (!keys.NEW_BUSINESS_ULTRA_SALUTE)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Ultra Salute')
        BurgerMenuNumbers.backToNumbers()
    })

    it.only('Verifica aggancio New Business Ultra Impresa', function () {
        if (!keys.NEW_BUSINESS_ULTRA_IMPRESA)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Ultra Impresa')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Vita', function () {
        if (!keys.NEW_BUSINESS_VITA)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Vita')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Allianz1', function () {
        if (!keys.NEW_BUSINESS_ALLIANZ1)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Allianz1')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio PTF Danni', function () {
        if (!keys.MONITORAGGIO_PTF_DANNI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio PTF Danni')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Riserve Vita', function () {
        if (!keys.MONITORAGGIO_RISERVE_VITA)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Riserve Vita')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Retention Motor', function () {
        if (!keys.RETENTION_MOTOR)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Retention Motor')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Retention Rami Vari', function () {
        if (!keys.RETENTION_RAMI_VARI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Retention Rami Vari')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Andamento Premi', function () {
        if (!keys.MONITORAGGIO_ANDAMENTO_PREMI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Andamento Premi')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Ricavi d\'Agenzia', function () {
        if (!keys.MONITORAGGIO_RICAVI_AGENZIA)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Ricavi d\'Agenzia')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Capitale Vita Scadenza', function () {
        if (!keys.CAPITALE_VITA_SCADENZA)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Capitale Vita Scadenza')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Fonti', function () {
        if (!keys.MONITORAGGIO_FONTI)
            this.skip()
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Fonti')
        BurgerMenuNumbers.backToNumbers()
    })
})