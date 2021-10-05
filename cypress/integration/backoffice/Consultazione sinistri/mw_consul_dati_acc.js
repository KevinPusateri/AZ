/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Selezionando 'Sinistri/Consulatazione sinistri'
 *  Lo script esegue una sequenza di test sulla pagina Consultazione sinistri / dati accessori
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"

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
    cy.getUserWinLogin().then(data => {
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })
        LoginPage.logInMWAdvanced()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
    })
})

beforeEach(() => {
    cy.preserveCookies()
    //Common.visitUrlOnEnv()
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

//#region Script Variables
let sinistro = '929538074'
let stato_sin = 'CHIUSO PAGATO'
let dtAvvenimento 
let cliente
//#endregion

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionare un sinistro in stato PAGATO/CHIUSO ' +
    ' Recupero e controllo preliminare della valorizzazione delle informazioni del cliente e della data avveninmento sinistro', function () {
              
        ConsultazioneSinistriPage.setValue_ById('#claim_number', sinistro)
        let classvalue = "search_submit claim_number k-button"

        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        ConsultazioneSinistriPage.checkObj_ByText(stato_sin)
        ConsultazioneSinistriPage.printClaimDetailsValue()

        const cssCliente1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"      
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssCliente1).then((val) => {
            cliente = val;
            cy.log('[it]>> [Cliente]: '+cliente);              
            ConsultazioneSinistriPage.isNotNullOrEmpty(cliente).then((isNull) => {                
                assert.isTrue(isNull,"[Cliente]: '"+cliente+"' controllo sul null or empty in pagina ricerca sinistro");                                     
            });
        });

        const cssdtAvv1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)" 
        ConsultazioneSinistriPage.getPromiseDate_ByCss(cssdtAvv1).then((val) => {
            dtAvvenimento = val;   
            cy.log('[it]>> [Data avvenimento]: '+dtAvvenimento);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dtAvvenimento).then((isNull) => {               
                assert.isTrue(isNull,"[Data avvenimento]: '"+dtAvvenimento+"' controllo sul null or empty in pagina ricerca sinistro");                                            
            });
        });             

    });
        it('Selezionando dati accessori per il sinistro in stato chiuso/pagato  ' +
    ' verificare che siano presenti le seguenti diciture standard: ' +
    ' "Nessuna nota presente", "Non sono presenti azioni di recupero" e "Nessun soggetto presente" rispettivamente per le sezioni precedenti ', function () {
     
        // Seleziona il sinistro
        ConsultazioneSinistriPage.clickLnk_ByHref(sinistro)
      
        // Verifica : numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = "pageTitle"
        ConsultazioneSinistriPage.checkObj_ByClassAndText(clssDtl, sinistro)

        cy.log('[it]>> [cliente / Data avvenimento]: '+cliente + "/" + dtAvvenimento);
        // Verifica (1): Valore della data avvenimento      
        const cssDtAvv2 = "#sx-detail > table > tbody > tr:nth-child(1) > td.clock"      
        //ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssDtAvv2, dtAvvenimento)
        
        // Verifica (2): Cliente
        const cssCliente2 = "#sx-detail > table > tbody > tr:nth-child(1) > td.people > a"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssCliente2, cliente) 

        // Seleziona il link dati accessori
        ConsultazioneSinistriPage.clickLnk_ByHref("/dasinconfe/DatiAccessoriIngresso")

        ConsultazioneSinistriPage.checkObj_ByText("Nessuna nota presente")  
        
        ConsultazioneSinistriPage.checkObj_ByText("Non sono presenti azioni di recupero")

        ConsultazioneSinistriPage.checkObj_ByText("Nessun soggetto presente")
    });
    

});
