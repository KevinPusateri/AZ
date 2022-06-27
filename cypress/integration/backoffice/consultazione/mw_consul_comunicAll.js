/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Selezionando 'Sinistri/Consulatazione sinistri'
 *  Lo script esegue una sequenza di test sulla pagina Consultazione sinistri -->
 * Dettaglio del Sinistro  --> Accesso Al comunicAll
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[2].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

afterEach(function () {
    if (this.currentTest.state !== 'passed') {
        //TopBar.logOutMW()
        //#region Mysql
        cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion
        //Cypress.runner.stop();
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
     Cypress.runner.stop();
})

//#region Script Variables
let numsin = '929538074'
let stato_sin = 'CHIUSO PAGATO'
let dtAvvenimento 
let cliente
//#endregion

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {

    it('Atterraggio su BackOffice >> Consultazione sinistri', function () {             
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
        cy.wait(1000)        
    });

    it('Consultazione Sinistri: Selezionare un sinistro in stato PAGATO/CHIUSO ', function () {              
        ConsultazioneSinistriPage.setValue_ById('#claim_number', numsin)
        let classvalue = "search_submit claim_number k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        Common.getObjByTextOnIframe(stato_sin)
        ConsultazioneSinistriPage.printClaimDetailsValue()
    });
    
    it('Recupero e controllo preliminare della valorizzazione delle informazioni del cliente e della data avveninmento sinistro', function () {
        const cssCliente1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        ConsultazioneSinistriPage.getPromiseText_ById(cssCliente1).then((val) => {
            cliente = val;         
            cy.log('[it]>> [Cliente]: '+cliente);
            ConsultazioneSinistriPage.isNotNullOrEmpty(cliente)
        }); 
    
        const cssdtAvv1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        ConsultazioneSinistriPage.getPromiseText_ById(cssdtAvv1).then((val) => {
            dtAvvenimento = val;  
            cy.log('[it]>> [Data avvenimento]: '+dtAvvenimento);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dtAvvenimento)
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, dtAvvenimento, ' contain a valid date') 
        });       

        // Seleziona il sinistro
        const css_ico_arrow_right ="#results > div.k-grid-content > table > tbody > tr > td:nth-child(9) > a"
        Common.clickByIdOnIframe(css_ico_arrow_right)
        cy.wait(3000)
    });
    it('Verifica presenza pulsante immagine \'Megafono\' associata al comunicAll e raggiungibilità pagina comunicAll', function () {

        // Verifica presenza immagine megafono
        const css_ico_mega = "li.listen.off > span"
        Common.isVisibleTitleTag("a", "ComunicAll")
        
        cy.screenshot('Verifica aggancio ' + "Dettaglio sinistro", { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        // Seleziona il link del comunicAll ver
        ConsultazioneSinistriPage.InvokeRmvAttOnClick_ById(css_ico_mega, "https://portaleagenzie.pp.azi.allianz.it/dafolder/?FORWARD=folder&TRANS_KEY=ingresso&C_SYS_USER_ID=&RELOAD_SUSPEND_PARAMS=S&Name=&ARCH_APPLICATION_RETURN=SINISTRI&APPL_NAME_RETURN=SINISTRI")        
    });
    it('Atterraggio pagina nella gestione del comunicAll' , function () {

        // Verifica struttura 
        const css_ico_mega = ".listen > a:nth-child(2)"
        //ConsultazioneSinistriPage.isTextIncluded_ByIdAndText(clssDtl, numsin)

        // Seleziona il link del comunicAll
        ConsultazioneSinistriPage.InvokeRmvAttOnClick_ById(css_ico_mega, "https://portaleagenzie.pp.azi.allianz.it/dafolder/?FORWARD=folder&TRANS_KEY=ingresso&C_SYS_USER_ID=&RELOAD_SUSPEND_PARAMS=S&Name=&ARCH_APPLICATION_RETURN=SINISTRI&APPL_NAME_RETURN=SINISTRI")        
    });

});
