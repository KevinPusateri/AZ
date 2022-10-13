/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Nella sezione 'Sinistri/Consulatazione sinistri'
 *  E' selezionato un sinistro con multi danneggiti verificando che
 * siano presenti determinate informazioni
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"
import { isDate } from "lodash"


//#region Mysql DB Variables
//const testName = Cypress.spec.name.split('.')[2].split('.')[0].toUpperCase()
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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
        LoginPage.logInMWAdvanced({         
            "agency": "010375000",
            "agentId": "ARALONGO7"
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

afterEach(function () {
    /*
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
    */
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
var numsin = '927646275'


const lblnumsin = ".k-grid-content"
let dtAvvenimento 
let clienteAssicurato
let targaAssicurato
let polizzaAssicurato
let dtIncarico
let dtScarico
let dtPagamento
let dtInvioBanca
let impPagam
//#endregion

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro con mutidanneggiati ' +
' si verifica che siano sempre valorizzate le informazioni del danneggiato, ruolo e CLD ', () => {
    var ass = "";
    it('Atterraggio su BackOffice >> Consultazione sinistri', function () {             
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
        cy.wait(1000);        
    });

    it('Selezionato un sinistro con multidanneggiato' +
    '"pagina di ricerca" si controllano i valori: num sinistro.', function () {

        let classvalue = "search_submit claim_number k-button"

        ConsultazioneSinistriPage.setValue_ById('#claim_number', numsin)
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')       

        Common.isVisibleText(lblnumsin, numsin)
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('"Pagina di ricerca" è verificato che il nome associato al cliente assicurato, la targa, la polizza e la data di avvenimento del sinistro non siano nulli.', function () {
        const cssCliente = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        ConsultazioneSinistriPage.getPromiseText_ById(cssCliente).then((val) => {          
            cy.log('[it]>> [Cliente]: '+val);
            clienteAssicurato = val; 
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
        });

        const cssTarga = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(4)"   
        ConsultazioneSinistriPage.getPromiseText_ById(cssTarga).then((val) => {          
            cy.log('[it]>> [Targa]: '+val);
            targaAssicurato = val; 
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
        });

        const cssPolizza = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(3)"
        ConsultazioneSinistriPage.getPromiseText_ById(cssPolizza).then((val) => {          
            cy.log('[it]>> [Polizza]: '+val);
            polizzaAssicurato = val;
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            Common.isValidCheck(/^-?(0|[1-9]\d*)$/, polizzaAssicurato, 'is valid number')
        });

        const cssDtAvv = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        ConsultazioneSinistriPage.getPromiseText_ById(cssDtAvv).then((val) => {          
            cy.log('[it]>> [Data avvenimento]: '+val);
            dtAvvenimento = val.trim(); 
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, val, ' contain a valid date')
        }); 
    });

    
    it('"Pagina di dettaglio" --> controllo che in pagina siano riportate le seguenti informazioni: numero di sinistro,' +
    ' data di avvenimento e il cliente assicurato', function () {
            
        ConsultazioneSinistriPage.printClaimDetailsValue()
    
        // Seleziona il sinistro dalla pagina di ricerca
        ConsultazioneSinistriPage.clickLnk_ByHref(numsin)        
        // Verifica (1) : numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = ".pageTitle"
        Common.isVisibleText(clssDtl, numsin)
        // Verifica (2): Valore della data avvenimento      
        const cssDtAvv = "#sx-detail > h2 > table > tbody > tr:nth-child(1) > td.clock"      
        ConsultazioneSinistriPage.checkObj_ByIdAndText(cssDtAvv, dtAvvenimento)         
        // Verifica (3): Cliente
        const cssCliente = "#sx-detail > h2 > table > tbody > tr:nth-child(1) > td.people > a"
        ConsultazioneSinistriPage.checkObj_ByIdAndText(cssCliente, clienteAssicurato);
        cy.screenshot('Pagina Dettaglio sinistro - Atterraggio pagina', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });
    
    it('"Pagina di dettaglio" --> Controllo della sezione intestazione di pagina, con valorizzazione dei campi ' +
    ' Località e CLD/Danneggiato ', function () {
        
        let cssSezDanneggiato = ".dynamic_content > .block > a "
        // Apertura di tutte le sezioni dei danneggiati in pagina
        ConsultazioneSinistriPage.clickOnMultiObj_ById(cssSezDanneggiato)
        // Conteggio del numero dei multidanneggiati
        let count = ConsultazioneSinistriPage.getCountElements(cssSezDanneggiato)
        // Controllo valorizzazione dei danneggiati
        let cssNomeDanneggiato = ".dynamic_content > .block > table > tbody > tr:nth-child(1) > td:nth-child(1) > a"
        ConsultazioneSinistriPage.checkListValues_ById(cssNomeDanneggiato)
        // Controllo valorizzazione CLD
        let cssCLD = ".dynamic_content > .block > table > tbody > tr:nth-child(1) > td:nth-child(2) > a"
        ConsultazioneSinistriPage.checkListValues_ById(cssCLD);

        cy.screenshot('Pagina Dettaglio sinistro - Controllo intestazione di pagina', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

});