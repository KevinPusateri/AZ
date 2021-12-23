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
        cy.getProfiling(data.tutf).then(profiling => {
            cy.filterProfile(profiling, 'COMMON_MONITOR_FONTI').then(profiled => { keys.MONITORAGGIO_FONTI = profiled })
            cy.filterProfile(profiling, 'SCAD_MONITORA_CARICO').then(profiled => { keys.MONITORAGGIO_CARICO = profiled })
            cy.filterProfile(profiling, 'SCAD_MONITORA_CARICO_FONTE').then(profiled => { keys.MONITORAGGIO_CARICO_FONTE = profiled })
            cy.filterProfile(profiling, 'COMMON_CRYSTAL').then(profiled => { keys.X_ADVISOR = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_INCENTIVAZIONE').then(profiled => { keys.INCENTIVAZIONE = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_INCENTIVAZIONE_RECRUITING').then(profiled => { keys.INCENTIVAZIONE_RECRUITING = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_INCENTIVAZIONE_RECRUITING').then(profiled => { keys.INCENTIVAZIONE_RECRUITING = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_ANDAMENTI_TECNICI').then(profiled => { keys.ANDAMENTI_TECNICI = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_ESTRAZIONI_AVANZATE').then(profiled => { keys.ESTRAZIONI_AVANZATE = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_SCARICO_AGENZIA').then(profiled => { keys.SCARICO_DATI = profiled })
            cy.filterProfile(profiling, 'COMMON_REPORTING_INDICEDIGITALE').then(profiled => { keys.INDICI_DIGITALI = profiled })
            cy.filterProfile(profiling, 'REPORTING_NB_DANNI').then(profiled => { keys.NEW_BUSINESS_DANNI = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRA').then(profiled => { keys.NEW_BUSINESS_ULTRA_CASA_PATRIMONIO = profiled })
            cy.filterProfile(profiling, 'COMMON_ULTRAS').then(profiled => { keys.NEW_BUSINESS_ULTRA_SALUTE = profiled })
            cy.filterProfile(profiling, 'REPORTING_NB_VITA').then(profiled => { keys.NEW_BUSINESS_VITA = profiled })
            cy.filterProfile(profiling, 'REPORTING_NB_A1').then(profiled => { keys.NEW_BUSINESS_ALLIANZ1 = profiled })
            cy.filterProfile(profiling, 'REPORTING_MONITOR_PTF_DANNI').then(profiled => { keys.MONITORAGGIO_PTF_DANNI = profiled })
            cy.filterProfile(profiling, 'REPORTING_MONITOR_PTF_VITA').then(profiled => { keys.MONITORAGGIO_RISERVE_VITA = profiled })
            cy.filterProfile(profiling, 'REPORTING_RETENTION_MOTOR').then(profiled => { keys.RETENTION_MOTOR = profiled })
            cy.filterProfile(profiling, 'REPORTING_RETENTION_MOTOR').then(profiled => { keys.RETENTION_MOTOR = profiled })
            cy.filterProfile(profiling, 'REPORTING_RETENTION_RV').then(profiled => { keys.RETENTION_RAMI_VARI = profiled })
            cy.filterProfile(profiling, 'REPORTING_INCASSI_AGENZIA').then(profiled => { keys.MONITORAGGIO_RICAVI_AGENZIA = profiled })
            cy.filterProfile(profiling, 'REPORTING_CAPITALI_VITA_SCAD').then(profiled => { keys.CAPITALE_VITA_SCADENZA = profiled })
            cy.filterProfile(profiling, 'REPORTING_CAPITALI_VITA_SCAD').then(profiled => { keys.CAPITALE_VITA_SCADENZA = profiled })
        })
    })
})


beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
})

after(function() {
    TopBar.logOutMW()
        //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion

})

if (Cypress.env('isAviva'))
    describe(' AVIVA Matrix Web : Navigazioni da Burger Menu in Numbers', function() {
        it('AVIVA - Verifica i link da Burger Menu', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.checkExistLinks(keys)
        })

        it('AVIVA - Verifica aggancio Monitoraggio Fonti', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Fonti')
            BurgerMenuNumbers.backToNumbers()
        })

        it('AVIVA - Verifica aggancio New Business Danni', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('New Business Danni')
            BurgerMenuNumbers.backToNumbers()
        })

        it('AVIVA - Verifica aggancio New Business Ultra Salute', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('New Business Ultra Salute')
            BurgerMenuNumbers.backToNumbers()
        })

        it('AVIVA - Verifica aggancio Monitoraggio PTF Danni', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio PTF Danni')
            BurgerMenuNumbers.backToNumbers()
        })

        it('AVIVA - Verifica aggancio Monitoraggio Andamento Premi', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Andamento Premi')
            BurgerMenuNumbers.backToNumbers()
        })

        it('AVIVA - Verifica aggancio Monitoraggio Ricavi d\'Agenzia', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Ricavi d\'Agenzia')
            BurgerMenuNumbers.backToNumbers()
        })
    })
else
    describe('Matrix Web : Navigazioni da Burger Menu in Numbers', function() {

        it('Verifica i link da Burger Menu', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.checkExistLinks()
        })

        it('Verifica aggancio Monitoraggio Fonti', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Fonti')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Monitoraggio Carico', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Carico')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Monitoraggio Carico per Fonte', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Carico per Fonte')
            BurgerMenuNumbers.backToNumbers()

        })

        it('Verifica aggancio X - Advisor', function() {
            cy.task('getHostName').then(hostName => {
                let currentHostName = hostName
                if (!currentHostName.includes('SM')) {
                    TopBar.clickNumbers()
                    BurgerMenuNumbers.clickLink('X - Advisor')
                }
            })
        })

        it('Verifica aggancio Incentivazione', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Incentivazione')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Incentivazione Recruiting', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Incentivazione Recruiting')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Andamenti Tecnici', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Andamenti Tecnici')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Estrazioni Avanzate', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Estrazioni Avanzate')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Scarico Dati', function() {
            if (!Cypress.env('monoUtenza')) {
                TopBar.clickNumbers()
                BurgerMenuNumbers.clickLink('Scarico Dati')
                BurgerMenuNumbers.backToNumbers()
            } else this.skip()

        })

        it('Verifica aggancio Indici Digitali', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Indici Digitali')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio New Business Danni', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('New Business Danni')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio New Business Ultra Casa e Patrimonio', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('New Business Ultra Casa e Patrimonio')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio New Business Ultra Salute', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('New Business Ultra Salute')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio New Business Vita', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('New Business Vita')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio New Business Allianz1', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('New Business Allianz1')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Monitoraggio PTF Danni', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio PTF Danni')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Monitoraggio Riserve Vita', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Riserve Vita')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Retention Motor', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Retention Motor')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Retention Rami Vari', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Retention Rami Vari')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Monitoraggio Andamento Premi', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Andamento Premi')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Monitoraggio Ricavi d\'Agenzia', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Monitoraggio Ricavi d\'Agenzia')
            BurgerMenuNumbers.backToNumbers()
        })

        it('Verifica aggancio Capitale Vita Scadenza', function() {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Capitale Vita Scadenza')
            BurgerMenuNumbers.backToNumbers()
        })
    })