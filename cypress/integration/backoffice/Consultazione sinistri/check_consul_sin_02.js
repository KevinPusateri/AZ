/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Selezionando 'Sinistri/Consulatazione sinistri'
 *  Lo script esegue una sequenza di test su tale pagina
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"

//#region Username Variables
const userName = 'TUTF012'
const psw = 'P@ssw0rd!'
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
    //LoginPage.logInMW(userName, psw, true, '010375000')
    LoginPage.logInMW(userName, psw, false)
    TopBar.clickBackOffice()
    BackOffice.clickCardLink('Consultazione sinistri')
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

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    'Si entra nella pagina di dettaglio e si verifica l\'intestazione di pagina: ' +
    ' (1) In alto alla pagina di dettaglio è riportato il numero di sinistro ' +
    ' (2) Data di avvenimento e Cliente ', function () {
        let sinistro = '927646985'
        let stato_sin = 'CHIUSO PAGATO'

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        csSinObjPage.setValue_ById('#claim_number', sinistro)
        let classvalue = "search_submit claim_number k-button"
        csSinObjPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        csSinObjPage.checkObj_ByText(stato_sin)
        csSinObjPage.printClaimDetailsValue()
        const css1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        var cliente = csSinObjPage.getPromiseValue_ByCss(css1)
        const css2 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(3)"
        let polizza = csSinObjPage.getPromiseValue_ByCss(css2)
        const css3 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(4)"   
        let targa = csSinObjPage.getPromiseValue_ByCss(css3)
        const css4 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(5)"  
        let tiposin = csSinObjPage.getPromiseValue_ByCss(css4)
        const css5 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(6)"  
        let statosin = csSinObjPage.getPromiseValue_ByCss(css5)
        const css6 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        var dtAvvenimento = csSinObjPage.getPromiseValue_ByCss(css6)        
             
        // Seleziona il sinistro
        csSinObjPage.clickLnk_ByHref(sinistro)
      
        // Verifica (1): numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = "pageTitle"
        csSinObjPage.checkObj_ByClassAndText(clssDtl, sinistro)

          // Verifica (2): Valore della data avvenimento      
          const cssDtAvv = "#sx-detail > table > tbody > tr:nth-child(1) > td.clock"
          csSinObjPage.checkObj_ByLocatorAndText(cssDtAvv, dtAvvenimento)
          // Verifica (2): Cliente
          const cssCliente = "#sx-detail > table > tbody > tr:nth-child(1) > td.people > a"
          csSinObjPage.checkObj_ByLocatorAndText(cssCliente, cliente)
      
    });
    

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    ' Dalla pagina di dettaglio è verificata la sezione INTESTAZIONE ed in particolare quanto segue: ' +
    ' (1) siano valorizzati i campi Località e CLD/Danneggiato ', function () {
       
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)

        // Verifica (2): Valore della località
        const csslocalità = "#sx-detail > table > tbody > tr.last-row > td.pointer"
        csSinObjPage.isNullOrEmpty(csSinObjPage.getPromiseValue_ByCss(csslocalità))
        // Verifica (2): la valorizzazione del CLD
        const csscldDanneggiato = '#soggetti_danneggiati > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a'
        csSinObjPage.isNullOrEmpty(csSinObjPage.getPromiseValue_ByCss(csscldDanneggiato))
    });
    

    
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    ' Dalla pagina di dettaglio è verificato quanto segue: ' +
    ' (1) Selezionando il danneggiato, si analizza la sezione "PERIZIE" verificando la valorizzazione ' +
    ' dei seguenti campi (Data incarico, Data scarico, Fiduciario, Tipo incarico, Stato. ' , function () {

        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        // Verifica (1): Apro la sezione del danneggiato (1)
        const btnDanneggiato = "#soggetti_danneggiati > div > div > a"
        csSinObjPage.clickBtn_ById(btnDanneggiato)

        // Verifica (1): la valorizzazione del campo "Data incarico" in Sezione Perizie
        const cssDtIncarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > p'
        csSinObjPage.getPromiseValue_ByCss(cssDtIncarico).then(dtIncarico => {
            csSinObjPage.isNullOrEmpty(dtIncarico)       
            csSinObjPage.containValidDate(dtIncarico)  
        });
         
         // Verifica (1): la valorizzazione del campo "Data scarico" in Sezione Perizie
         const cssDtScarico= '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
         csSinObjPage.getPromiseValue_ByCss(cssDtScarico).then(dtScarico => {
             csSinObjPage.isNullOrEmpty(dtScarico)       
             csSinObjPage.containValidDate(dtScarico)
         });

          // Verifica (1): la valorizzazione del campo "Fiduciario" in Sezione Perizie
        const cssFiduciario = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        csSinObjPage.getPromiseValue_ByCss(cssFiduciario).then(fiduciario => {
            csSinObjPage.isNullOrEmpty(fiduciario)     
        });

        // Verifica (1): la valorizzazione del campo "Tipo incarico" in Sezione Perizie
        const cssTipoIncarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        csSinObjPage.getPromiseValue_ByCss(cssTipoIncarico).then(tipoIncarico => {
            csSinObjPage.isNullOrEmpty(tipoIncarico)           
        });
        
        // Verifica (1): la valorizzazione del campo "Stato" in Sezione Perizie
        const cssStato = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        csSinObjPage.getPromiseValue_ByCss(cssStato).then(stato => {
            csSinObjPage.isNullOrEmpty(stato)  
        });     
    });


    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    'Dalla pagina di dettaglio è verificato quanto segue: ' +
    ' (1)  Selezionando il danneggiato, si analizza la sezione "PAGAMENTI" verificando la valorizzazione ' +
    ' dei seguenti campi (Data pagamento, Data Invio Banca, causale pagamento, Importo, Percepiente). ' , function () {
    
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        
        // Verifica (1): la valorizzazione del campo "Data pagamento" in Sezione Pagamenti
        const cssDtPagamento = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > p'
        csSinObjPage.getPromiseValue_ByCss(cssDtPagamento).then(dtPagamento => {
            csSinObjPage.isNullOrEmpty(dtPagamento)       
            csSinObjPage.containValidDate(dtPagamento)  
        });     
        
        // Verifica (1): la valorizzazione del campo "Data invio banca" in Sezione Pagamenti
        const cssDtInvioBanca = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
        csSinObjPage.getPromiseValue_ByCss(cssDtInvioBanca).then(dtInvioBanca => {
            csSinObjPage.isNullOrEmpty(dtInvioBanca)       
            csSinObjPage.containValidDate(dtInvioBanca)                     
        });      
 
       // Verifica (1): la valorizzazione del campo "Causale" in Sezione Pagamenti
        const cssCausale = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        csSinObjPage.getPromiseValue_ByCss(cssCausale).then(causale => {
            csSinObjPage.isNullOrEmpty(causale) 
        });        

        // Verifica (1): la valorizzazione del campo "Importo" in Sezione Pagamenti
        const cssImporto = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        csSinObjPage.getPromiseValue_ByCss(cssImporto).then(importo => {
            csSinObjPage.isNullOrEmpty(importo) 
            csSinObjPage.getCurrency(importo)               
        });

         // Verifica (1): la valorizzazione del campo "Percepiente pagamento" in Sezione Pagamenti
        const cssPercepiente = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        csSinObjPage.getPromiseValue_ByCss(cssPercepiente).then(percepiente => {
            csSinObjPage.isNullOrEmpty(percepiente)  
        });

    });

/*
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    ' Dalla pagina di dettaglio è verificato quanto segue: ' +
    ' (1) Nella sezione "Pagamenti", cliccando sul pulsante di "Dettagli", è verificato che nella pop-Up siano riportate ' +
    ' le informazioni riferite a data pagamento, data invio banca, importo, valuta, causale, modalità di pagamento, Iban, tipo proposta e stato pagamento', function () {
    

    });

    */
});