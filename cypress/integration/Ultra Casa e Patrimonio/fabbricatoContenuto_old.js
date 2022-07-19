///<reference types="cypress"/>

//#region imports
import Common from "../../mw_page_objects/common/Common"
import TopBar from "../../mw_page_objects/common/TopBar"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Ultra from "../../mw_page_objects/ultra/Ultra"
import DatiIntegrativi from "../../mw_page_objects/UltraBMP/DatiIntegrativi"
import PersonaFisica from "../../mw_page_objects/common/PersonaFisica"
import 'cypress-iframe';
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region  variabili iniziali
let cliente = PersonaFisica.GalileoGalilei()
var ambiti = ['Fabbricato', 'Contenuto']
var frazionamento = "annuale"
let nuovoCliente;
let iFrameUltra = '[class="iframe-content ng-star-inserted"]'
let iFrameFirma = '[id="iFrameResizer0"]'
//#endregion variabili iniziali

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
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

/* afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        TopBar.logOutMW()
        //#region Mysql
        cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion
        Cypress.runner.stop();
    }
}) */

describe("FABBRICATO E CONTENUTO", () => {
    /* it("Login", ()=>{
        cy.loginMatrix(ambiente, "TUTF004", "P@ssw0rd!")
    }) */

    it("Ricerca cliente", () => {
        cy.get('body').within(() => {
            cy.get('input[name="main-search-input"]').click()
            cy.get('input[name="main-search-input"]').type(cliente.codiceFiscale).type('{enter}')
            cy.get('lib-client-item').first().click()
        }).then(($body) => {
            cy.wait(7000)
            const check = $body.find(':contains("Cliente non trovato o l\'utenza utilizzata non dispone dei permessi necessari")').is(':visible')
            //const check = cy.get('div[class="client-null-message"]').should('be.visible')
            cy.log('permessi: ' + check)
            if (check) {
                cy.get('input[name="main-search-input"]').type(cliente).type('{enter}')
                cy.get('lib-client-item').first().next().click()
            }
        })
    })

    it("Selezione ambiti FastQuote", () => {
        SintesiCliente.FQ_tabUltra('Casa e Patrimonio')
        //cy.get('.fast-quote-card', { timeout: 30000 }).should('be.visible')

        for (var i = 0; i < ambiti.length; i++) {
            cy.contains('div', ambiti[i]).parent().children('nx-icon').click()
        }
 
        cy.get('span').contains('Calcola').click({ force: true })
        cy.get('lib-format-numbers').should('be.visible')
        cy.get('lib-da-link[calldaname$="Configura"]').should('be.visible').click()
        

        Common.canaleFromPopup()
    })

    it("Verifica selezione ambiti su home Ultra Casa e Patrimonio", () => {
        Ultra.caricamentoUltraHome()
        Ultra.verificaAmbitiHome(ambiti)
    })

    it("Seleziona fonte", () => {
        Ultra.selezionaFonteRandom()
    })

    it("Seleziona frazionamento", () => {
        Ultra.selezionaFrazionamento(frazionamento)
    })

    it("Modifica soluzione per Fabbricato", () => {
        Ultra.modificaSoluzioneHome('Fabbricato', 'Top')
    })

    it("Configurazione Contenuto e procedi", () => {
        Ultra.configuraContenuto()
        Ultra.procediHome()
    })

    it("Conferma dati quotazione", () => {
        Ultra.confermaDatiQuotazione()
    })

    it("Riepilogo ed emissione", () => {
        Ultra.riepilogoEmissione()
    })

    it("Censimento anagrafico", () => {
        Ultra.caricamentoCensimentoAnagrafico()
        Ultra.censimentoAnagrafico(cliente.cognomeNome(), cliente.ubicazione())
    })

    it("Dati integrativi", () => {
        //Ultra.caricaDatiIntegrativi()
        Ultra.datiIntegrativi()
        DatiIntegrativi.popupDichiarazioni()
        Ultra.caricamentoConsensi()
    })

    it("Consensi e privacy", () => {
        Ultra.avantiConsensi()
    })

    it("salvataggio Contratto", () => {
        Ultra.salvataggioContratto()
    })

    it("Intermediario", () => {
        Ultra.inserimentoIntermediario()
    })

    it("Visualizza documenti e prosegui", () => {
        Ultra.riepilogoDocumenti()
    })

    it("Adempimenti precontrattuali e Perfezionamento", () => {
        Ultra.stampaAdempimentiPrecontrattuali()
    })

    it("Incasso - parte 1", () => {
        //attende caricamento sezione Precontrattuali
        cy.intercept({
            method: 'POST',
            url: '**/InitMezziPagam'
        }).as('pagamento')

        cy.wait('@pagamento', { requestTimeout: 60000 })

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#pnlMainTitoli', { timeout: 15000 })
            .should('be.visible')

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[value="> Incassa"]')
            .should('be.visible')
            .click()

        //cy.wait(5000)

        //attende il caricamento
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[class="divAttenderePrego"]').should('be.visible')

        //cy.wait(1000)
        //cy.pause()
    })

    it("Incasso - parte 2", () => {
        cy.intercept({
            method: 'GET',
            url: '**/GetListaCassettiIncassoCompleto'
        }).as('incassoCompleto')

        cy.wait('@incassoCompleto', { requestTimeout: 60000 })

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#TabIncassoPanelBar-2')
            .should('be.visible')

        //selezione mensilità
        // cy.frameLoaded(iFrameUltra)
        //     .iframeCustom().find(iFrameFirma)
        //     .iframeCustom().find('[aria-owns="TabIncassoTipoMens_listbox"]')
        //     .should('be.visible')
        //     .click()

        // cy.wait(1000)
        // cy.frameLoaded(iFrameUltra)
        //     .iframeCustom().find(iFrameFirma)
        //     .iframeCustom().find('li').contains('SDD')
        //     .should('be.visible')
        //     .click()

        //selezione tipo di pagamento
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[aria-owns="TabIncassoModPagCombo_listbox"]')
            .should('be.visible')
            .click()

        cy.wait(1000)
        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#TabIncassoModPagCombo_listbox')
            .find('li').contains('Assegno')
            .should('be.visible')
            .click()

        //cy.wait(1000) tipo di delega

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('button').contains('Incassa')
            .should('be.visible')
            .click()

        //cy.pause()
    })

    it("Esito incasso", () => {
        //attende caricamento sezione Peecontrattuali etPostIncassoData
        cy.intercept({
            method: 'POST',
            url: '**/GetPostIncassoData'
        }).as('postIncasso')

        cy.wait('@postIncasso', { requestTimeout: 60000 })

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('#pnlContrattoIncasso', { timeout: 30000 })
            .should('be.visible')

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[data-bind="foreach: Result.Steps"]')
            .find('img')//lista esiti
            .each(($img, index, $list) => {
                cy.wrap($img).should('have.attr', 'src').and('contain', 'confirm_green') //verifica la presenza della spunta verde
            });

        cy.frameLoaded(iFrameUltra)
            .iframeCustom().find(iFrameFirma)
            .iframeCustom().find('[value="> CHIUDI"]')
            .should('be.visible')
            .click()
    })

    /* it("Chiusura", ()=>{
        cy.pause()
        
        Ultra.chiudiFinale()
    }) */
})