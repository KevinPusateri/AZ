/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import HomePage from "../../mw_page_objects/common/HomePage"

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
const agency = '010710000'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

before(() => {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    LoginPage.logInMW(userName, psw)


})

beforeEach(() => {
    cy.preserveCookies()
    HomePage.reloadMWHomePage()
    if (!Cypress.env('monoUtenza')) {
        TopBar.search('Pulini Francesco')
        SintesiCliente.wait()
    } else {
        TopBar.search('SLZNLL54A04H431Q')
        SintesiCliente.wait()
    }
})
after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

})
describe('MW: Navigazioni Scheda Cliente -> Tab Sintesi Cliente', function () {

    it('Verifica i tab', function () {
        SintesiCliente.checkTabs()
    })

    it('Verifica Situazione cliente', function () {
        SintesiCliente.checkSituazioneCliente()
    })

    it('Verifica FastQuote: Tab Utra - subTabs', function () {
        SintesiCliente.checkFastQuoteUltra()
    })

    it('Verifica FastQuote: Tab Auto', function () {
        SintesiCliente.checkFastQuoteAuto()
    })

    it('Verifica FastQuote: Tab Albergo', function () {
        SintesiCliente.checkFastQuoteAlbergo()
    })

    it('Verifica le Cards Emissioni', function () {
        SintesiCliente.checkCardsEmissioni()
    })

    // !ADD TFS
    it.skip('Verifica Link da Card Auto', function () {
        // TODO: completare
        SintesiCliente.clickAuto()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first().should('exist').and('be.visible').within(() => {
            const linksAuto = [
                'Emissione',
                'Prodotti particolari',
                'Passione BLU'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksAuto[i])
            })
        })
    })

    // !ADD TFS
    it.skip('Verifica Link da Card Auto -> Emissione', function () {
        SintesiCliente.clickAuto()
        cy.get('.cdk-overlay-container').find('button').contains('Emissione').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            const linksEmissione = [
                'Preventivo Motor',
                'Flotte e Convenzioni'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksEmissione[i])
            })
        })
    })

    // !ADD TFS
    it.skip('Verifica Link da Card Auto -> Prodotti particolari', function () {
        SintesiCliente.clickAuto()
        cy.get('.cdk-overlay-container').find('button').contains('Prodotti particolari').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            const linksProdottiParticolari = [
                'Assunzione guidata (con cod. di autorizz.)',
                'Veicoli d\'epoca durata 10 giorni',
                'Libri matricola',
                'Kasko e ARD per \'Dipendenti in Missione\'',
                'Polizza aperta',
                'Coassicurazione'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksProdottiParticolari[i])
            })
        })
    })

    // !ADD TFS
    it.skip('Verifica Link da Card Auto -> Passione BLU', function () {
        SintesiCliente.clickAuto()
        cy.get('.cdk-overlay-container').find('button').contains('Passione BLU').click()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').eq(1).should('exist').and('be.visible').within(() => {
            const linksPassioneBlu = [
                'Nuova polizza',
                'Nuova polizza guidata',
                'Nuova polizza Coassicurazione'
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksPassioneBlu[i])
            })
        })
    })

    // !ADD TFS

    it.skip('Verifica Link da Card Rami vari', function () {
        // TODO: completare
        SintesiCliente.clickRamiVari()
        cy.get('.cdk-overlay-container').find('[class="cdk-overlay-pane"]').first.should('exist').and('be.visible').within(() => {
            const linksPassioneBlu = [
                'Allianz Ultra Casa e Patrimonio',
                'Allianz Ultra Casa e Patrimonio BMP',
                'Allianz Ultra Salute',
                'Allianz1 Business',
                'FastQuote Universo Salute',
                'FastQuote Infortuni'
                //TODO: Finire
            ]
            cy.get('div[role="menu"]').find('button').each(($buttonLinks, i) => {
                expect($buttonLinks).to.contain(linksPassioneBlu[i])
            })
        })
    })

    it('Verifica Card Auto: Emissione -> Preventivo Motor', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickPreventivoMotor()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Emissione -> Flotte e Convenzioni', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickFlotteConvenzioni()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Assunzione Guidata', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickAssunzioneGuidata()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Veicoli d\'epoca durata 10 giorni', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickVeicoliEpoca()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Libri matricola', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickLibriMatricola()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD al Chilometro', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickKaskoARDChilometro()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Giornata', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickKaskoARDGiornata()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Kasko e ARD a Veicolo', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickKaskoARDVeicolo()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Polizza aperta(base)', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickPolizzaBase()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Prodotti particolari -> Coassicurazione', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickCoassicurazione()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickNuovaPolizza()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza guidata', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickNuovaPolizzaGuidata()
        SintesiCliente.back()
    })

    it('Verifica Card Auto: Passione Blu -> Nuova polizza Coassicurazione', function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickNuovaPolizzaCoassicurazione()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraCasaPatrimonio()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz Ultra Casa e Patrimonio BMP', function () {
        if (!Cypress.env('monoUtenza')) {
            SintesiCliente.clickRamiVari()
            SintesiCliente.clickAllianzUltraCasaPatrimonioBMP()
            SintesiCliente.back()
        } else this.skip()
    })


    it('Verifica Card Rami Vari: Allianz Ultra Salute', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianzUltraSalute()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: Allianz1 Business', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickAllianz1Business()
        SintesiCliente.back()
    })

    it('Verifica Card Rami Vari: FastQuote Universo Salute', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteUniversoSalute()
        SintesiCliente.back()
    })
    it('Verifica Card Rami Vari: FastQuote Infortuni Da Circolazione', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteInfortuniDaCircolazione()
        SintesiCliente.back()
    })


    it('Verifica Card Rami Vari: FastQuote Impresa Sicura', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteImpresaSicura()
        SintesiCliente.back()
    })
    //TODO: Fare quelli in basso
    it('Verifica Card Rami Vari: FastQuote Albergo', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickFastQuoteAlbergo()
        SintesiCliente.back()
    })

    //TODO: canale + new window -> trovare un modo
    // it('Verifica Card Rami Vari: Gestione Grandine', function () {
    //     SintesiCliente.clickRamiVari()
    //     SintesiCliente.clickGestioneGrandine()
    //     SintesiCliente.back()
    // })

    it('Verifica Card Rami Vari: Emissione - Polizza Nuova', function () {
        SintesiCliente.clickRamiVari()
        SintesiCliente.clickPolizzaNuova()
        SintesiCliente.back()
    })

    it('Verifica Card Vita: Accedi al servizio di consulenza', function () {
        SintesiCliente.clickVita()
        SintesiCliente.clickSevizioConsulenza()
        SintesiCliente.back()
    })

    it('Verifica Contratti in evidenza', function () {
        SintesiCliente.checkContrattiEvidenza()
        SintesiCliente.back()
    })
})