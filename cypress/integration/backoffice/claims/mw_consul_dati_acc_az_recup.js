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
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )
        LoginPage.logInMWAdvanced()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
    })
})

beforeEach(() => {
    cy.preserveCookies()
    //Common.visitUrlOnEnv()
})

afterEach(function () {
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

//#region Script Variables
let numsin = '929538398'
let stato_sin = 'CHIUSO PAGATO'
let dtAvvenimento 
let cliente
//#endregion

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionare un sinistro in stato PAGATO/CHIUSO ' +
    ' per il quale siano valorizzate le "Azioni di recupero".' +
    ' Nella sezione dati accessori si verifica che siano valorizzati i seguenti campi: Tipologia, Importo, Soggetto debitore, Data inizio e Stato." ', function () {
      
        ConsultazioneSinistriPage.setValue_ById('#claim_number', numsin)
        let classvalue = "search_submit claim_number k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        ConsultazioneSinistriPage.checkObjVisible_ByText(stato_sin)
        ConsultazioneSinistriPage.printClaimDetailsValue()

        const cssCliente1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        cliente = ConsultazioneSinistriPage.getPromiseText_ById(cssCliente1)
    
        const cssdtAvv1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        var dtAvvenimento = ConsultazioneSinistriPage.getPromiseText_ById(cssdtAvv1)        

        // Seleziona il sinistro
        ConsultazioneSinistriPage.clickLnk_ByHref(numsin)
    
        // Verifica : numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = "pageTitle"
        ConsultazioneSinistriPage.checkObj_ByClassAndText(clssDtl, numsin)

        // Verifica (1): Valore della data avvenimento      
        const cssDtAvv2 = "#sx-detail > table > tbody > tr:nth-child(1) > td.clock"
        ConsultazioneSinistriPage.getPromiseDate_ById(cssDtAvv2).then((val) => {          
            cy.log('[it]>> [Data avvenimento]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {                               
                dtAvvenimento = val;        
            });
        }); 

        // Verifica (2): Cliente
        const cssCliente2 = "#sx-detail > table > tbody > tr:nth-child(1) > td.people > a"
        //ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssCliente2, cliente) 

        // Seleziona il link dati accessori
        ConsultazioneSinistriPage.clickLnk_ByHref("/dasinconfe/DatiAccessoriIngresso")

        // Verifica (3): valorizzazione 'Tipologia' nella sezione 'Azioni di recupero'
        const cssType = "#azioni_recupero > div > div > table > tbody > tr.odd > td:nth-child(1) "  
        ConsultazioneSinistriPage.getPromiseText_ById(cssType).then((val) => {
            let dscrpt = val.split(':')[1];       
            cy.log('[it]>> [Tipologia]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        });         
        
        // Verifica (4) : la valorizzazione del campo "Data inizio" nella sezione "Azioni di Recupero"
        const cssDtInizio = '#azioni_recupero > div > div > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseDate_ById(cssDtInizio).then(val => {
            cy.log('[it]>> [Data inizio]: '+val); 
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.containValidDate(val)
        });
        
        // Verifica (5): valorizzazione 'Stato' nella sezione 'Azioni di recupero'
        const cssStato = "#azioni_recupero > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseText_ById(cssStato).then((val) => {   
            let dscrpt = val.split(':')[1];    
            cy.log('[it]>> [Stato]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        });  
        
        // Verifica (6): valorizzazione 'Soggetto debitore' nella sezione 'Azioni di recupero'
        const cssSgtDbt = "#azioni_recupero > div > div > table > tbody > tr.odd > td:nth-child(3)"  
        ConsultazioneSinistriPage.getPromiseText_ById(cssSgtDbt).then((val) => {   
            let dscrpt = val.split(':')[1];    
            cy.log('[it]>> [Soggetto debitore]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        });  

        // Verifica (7): la valorizzazione del campo 'Importo' nella sezione 'Azioni di recupero'
        const cssImporto = '#azioni_recupero > div > div > table > tbody > tr.odd > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssImporto).then((val) => {  
            let dscrpt = val.split(':')[1]        
            cy.log('[it]>> [Importo]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        })
      
       ConsultazioneSinistriPage.getPromiseText_ById(cssImporto).then((val) => {  
            let dscrpt = val.split(':')[1]        
            cy.log('[it]>> [Importo]: '+dscrpt);           
            ConsultazioneSinistriPage.isCurrency(dscrpt)  
        });
        
    });
    

    it('Dalla sezione "Azioni di recupero" cliccando sul "soggetto debitore" verificare '+
       'che sia apra la finestra di pop up di dettaglio anagrafico del soggetto', function () {
        
        
        let cssLinkSgt = "#azioni_recupero > div > div > table > tbody > tr.odd > td:nth-child(3) > a"
        ConsultazioneSinistriPage.clickObj_ByLabel('a', cliente)        
    });
    
});
