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
import { isDate } from "lodash"


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
var numsin = '927646985'
var stato_sin = 'CHIUSO PAGATO'

const lblnumsin = "k-grid-content"
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

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {
    var ass = "";
    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    '"pagina di ricerca" si controllano i valori: num sinistro, stato sinistro.', function () {

        let classvalue = "search_submit claim_number k-button"

        ConsultazioneSinistriPage.setValue_ById('#claim_number', numsin)
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')       

        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numsin)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, stato_sin)       
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
       });

       const cssDtAvv = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
       ConsultazioneSinistriPage.getPromiseDate_ById(cssDtAvv).then((val) => {          
            cy.log('[it]>> [Data avvenimento]: '+val);
            dtAvvenimento = val.trim(); 
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
       }); 
    });

    
    it('"Pagina di dettaglio" è verificato che in pagina siano riportati numero di sinistro, ' +
    ' data di avvenimento e il cliente assicurato', function () {
            
        ConsultazioneSinistriPage.printClaimDetailsValue()
    
        // Seleziona il sinistro dalla pagina di ricerca
        ConsultazioneSinistriPage.clickLnk_ByHref(numsin)
        
        // Verifica (1) : numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = "pageTitle"
        ConsultazioneSinistriPage.checkObj_ByClassAndText(clssDtl, numsin)

        // Verifica (2): Valore della data avvenimento      
        const cssDtAvv = "#sx-detail > table > tbody > tr:nth-child(1) > td.clock"      
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssDtAvv, dtAvvenimento) 
        
        // Verifica (3): Cliente
        const cssCliente = "#sx-detail > table > tbody > tr:nth-child(1) > td.people > a"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssCliente, clienteAssicurato);

    });
    
    it('"Pagina di dettaglio" è verificata la sezione INTESTAZIONE con valorizzazione dei campi ' +
    ' Località e CLD/Danneggiato ', function () {
      
        //(1): Valore della località
        const csslocalità = "#sx-detail > table > tbody > tr.last-row > td.pointer"
        ConsultazioneSinistriPage.getPromiseText_ById(csslocalità).then((val) => {
            let dscrpt = val.split(':')[1];            
            cy.log('[it]>> [Località]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        });

        //(2): la valorizzazione del CLD
        const csscldDanneggiato = '#soggetti_danneggiati > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseText_ById(csscldDanneggiato).then((val) => {
            let dscrpt = val.split(':')[1];        
            cy.log('[it]>> [CLD]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)                      
        });   
    });

    it('"Pagina di dettaglio" - sezione "PERIZIE" '+
    ' Si verifica che i seguenti campi non siano nulli: Data incarico, Data scarico, Fiduciario, Tipo incarico, Stato. ' ,
     function () {
        
        // Apro la sezione del danneggiato (1)
        const btnDanneggiato = "#soggetti_danneggiati > div > div > a"
        ConsultazioneSinistriPage.clickBtn_ById(btnDanneggiato)

        // Verifica : la valorizzazione del campo "Data incarico" in Sezione Perizie
        const cssDtIncarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > p'
        ConsultazioneSinistriPage.getPromiseText_ById(cssDtIncarico).then((val) => {
            let dscrpt = val.split(':')[1];   
            cy.log('[it]>> [Data incarico]: '+dscrpt);
            dtIncarico = dscrpt.trim()  
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        });
         
         // Verifica : la valorizzazione del campo "Data scarico" in Sezione Perizie
         const cssDtScarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
         ConsultazioneSinistriPage.getPromiseText_ById(cssDtScarico).then((val) => {
            let dscrpt = val.split(':')[1]; 
            cy.log('[it]>> [Data scarico]: '+dscrpt);
            dtScarico = dscrpt.trim() 
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
         });

          // Verifica : la valorizzazione del campo "Fiduciario" in Sezione Perizie
        const cssFiduciario = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssFiduciario).then((val) => {
            let dscrpt = val.split(':')[1];        
            cy.log('[it]>> [Fiduciario]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)                  
        });   

        // Verifica : la valorizzazione del campo "Tipo incarico" in Sezione Perizie
        const cssTipoIncarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssTipoIncarico).then((val) => {
            let dscrpt = val.split(':')[1];         
            cy.log('[it]>> [Tipo incarico]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)                   
        });
        
        // Verifica : la valorizzazione del campo "Stato" in Sezione Perizie
        const cssStato = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssStato).then((val) => {
            let dscrpt = val.split(':')[1];       
            cy.log('[it]>> [Stato]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)                         
        });
    });

    it('"Pagina di dettaglio" - sezione "PERIZIE" '+
    ' Si verifica che le date incarico e Data scarico siano date valide ' ,
     function () {

        ConsultazioneSinistriPage.containValidDate(dtIncarico)
        ConsultazioneSinistriPage.containValidDate(dtScarico)
    });
     
    it('"Pagina di dettaglio" - sezione "PAGAMENTI" '+
    '  Si verifica che i seguenti campi non siano nulli: Data pagamento, Data Invio Banca, causale pagamento, Importo, Percepiente). ' , 
    function () {
            
        // Verifica : la valorizzazione del campo "Data pagamento" in Sezione Pagamenti
        const cssDtPagamento = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > p'
        ConsultazioneSinistriPage.getPromiseText_ById(cssDtPagamento).then((val) => {
            let dscrpt = val.split(':')[1];  
            cy.log('[it]>> [Data pagamento]: '+dscrpt);
            dtPagamento = dscrpt.trim();
            ConsultazioneSinistriPage.isNotNullOrEmpty(dtPagamento)
        });
        
        // Verifica : la valorizzazione del campo "Data invio banca" in Sezione Pagamenti
        const cssDtInvioBanca = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssDtInvioBanca).then((val) => {
            let dscrpt = val.split(':')[1]; 
            cy.log('[it]>> [Data invio banca]: '+dscrpt);
            dtInvioBanca = dscrpt.trim();
            ConsultazioneSinistriPage.isNotNullOrEmpty(dtInvioBanca)
        });

       // Verifica : la valorizzazione del campo "Causale" in Sezione Pagamenti
        const cssCausale = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssCausale).then((val) => {
            let dscrpt = val.split(':')[1];        
            cy.log('[it]>> [Causale]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        });

        // Verifica : la valorizzazione del campo "Importo" in Sezione Pagamenti
        const cssImporto = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssImporto).then((val) => {
            let dscrpt = val.split(':')[1];
            impPagam = dscrpt;
            cy.log('[it]>> [Importo]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)
        });

         // Verifica : la valorizzazione del campo "Percepiente pagamento" in Sezione Pagamenti
        const cssPercepiente = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseText_ById(cssPercepiente).then((val) => {
            let dscrpt = val.split(':')[1];          
            cy.log('[it]>> [Percepiente]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt)                          
        });
    });


    it('"Pagina di dettaglio" - sezione "PAGAMENTI" Verifica dei dati in formato valido: '+
    ' data pagamento, data invio banca e importo.' ,
     function () {
        ConsultazioneSinistriPage.containValidDate(dtPagamento)

        ConsultazioneSinistriPage.containValidDate(dtInvioBanca)

        ConsultazioneSinistriPage.isCurrency(impPagam.trim())
    });
    
    it('Sezione "Pagamenti", - POPUP "Dettaglio Pagamento" ' +
    ' verificare che le informazioni riferite a data pagamento, data invio banca, importo, valuta, causale, modalità di pagamento, Iban, tipo proposta e stato pagamento', function () {
        //const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        const xpathDettaglioPagamento = "#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > a"
        ConsultazioneSinistriPage.clickBtn_ById(xpathDettaglioPagamento)

        // Verifica : la valorizzazione del campo "Data pagamento" nella popup "Dettaglio Pagamento"      
        const popUplocator1 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(1) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator1).then((val) => {
            cy.log('[it]>> [Data pagamento]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.containValidDate(val)
        });
        // Verifica : la valorizzazione del campo "Data invio Banca" nella popup "Dettaglio Pagamento"
        const popUplocator2 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(2) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator2).then((val) => {
            cy.log('[it]>> [Data invio banca]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.containValidDate(val)
        });    

        // Verifica : la valorizzazione del campo "Importo" nella popup "Dettaglio Pagamento"
        const popUplocator3 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(3) > td:nth-child(2)" 
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator3).then((val) => {          
            cy.log('[it]>> [Importo]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.isCurrency(val)
        });

        // Verifica : la valorizzazione del campo "Valuta" nella popup "Dettaglio Pagamento"
        const popUplocator4 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(4) > td:nth-child(2)" 
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator4).then((val) => {          
            cy.log('[it]>> [Valuta]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.isEuroCurrency(val)
        });

        // Verifica : la valorizzazione del campo "Causale" nella popup "Dettaglio Pagamento"
        const popUplocator5 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(5) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator5).then((val) => {          
            cy.log('[it]>> [Causale]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                               
        });

        // Verifica : la valorizzazione del campo "Modalità di pagamento" nella popup "Dettaglio Pagamento"
        const popUplocator6 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(6) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator6).then((val) => {          
            cy.log('[it]>> [Modalità di pagamento]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                                                      
        });

        // Verifica : la valorizzazione del campo "IBAN" nella popup "Dettaglio Pagamento"
        const popUplocator7 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(7) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator7).then(val => {
            cy.log('[it]>> [IBAN]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.isValidIBAN(val)        
        });
    
        // Verifica : la valorizzazione del campo "Tipo Proposta" nella popup "Dettaglio Pagamento"
        const popUplocator8 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(8) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator8).then((val) => {          
            cy.log('[it]>> [Tipo Proposta]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                                           
        });

        // Verifica : la valorizzazione del campo "Stato Pagamento" nella popup "Dettaglio Pagamento"
        const popUplocator9 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(9) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator9).then((val) => {          
            cy.log('[it]>> [Stato Pagamento]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                                                                                
        });

        ConsultazioneSinistriPage.clickBtn_ByClassAndText("k-icon k-i-close", "Close")        
    });
    
    it(' Nella sezione "Perizie", - POPUP "Dettaglio Incarico Perizia - anagrafica fiduciario" ' +
    ' verifiche delle seguenti informazioni: Fiduciario, Tipo collaborazione, Indirizzo, Telefono ', function () {
       
        const xpathDettaglioPerizia = "#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > a"
        ConsultazioneSinistriPage.clickBtn_ById(xpathDettaglioPerizia)
      
        // Verifica(1) : la valorizzazione del campo "Fiduciario" nella popup "Dettaglio Incarico Perizia"      
        const popUplocator1 = ".k-widget.k-window > .popup.k-window-content.k-content > table > tbody > tr:nth-child(2) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseText_ById(popUplocator1).then((val) => {                  
            cy.log('[it]>> [Fiduciario]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                          
        });                                            

       // Verifica(2) : la valorizzazione del campo "Tipo Collaborazione" nella popup "Dettaglio Incarico Perizia"
        const popUplocator2 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(3) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseText_ById(popUplocator2).then((val) => {                     
            cy.log('[it]>> [Tipo Collaborazione]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                          
        });                                      

       // Verifica(3) : la valorizzazione del campo "Indirizzo" nella popup "Dettaglio Incarico Perizia"
       const popUplocator3 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(4) > td:nth-child(2)"  
       ConsultazioneSinistriPage.getPromiseText_ById(popUplocator3).then((val) => {          
            cy.log('[it]>> [Indirizzo]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                         
        });                                    

       // Verifica(4) : la valorizzazione del campo "Telefono" nella popup "Dettaglio Incarico Perizia"
       const popUplocator4 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(5) > td:nth-child(2)"  
       ConsultazioneSinistriPage.getPromiseText_ById(popUplocator4).then((val) => {        
            cy.log('[it]>> [Telefono]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                            
        });                                                      

    });

    it(' Nella sezione "Perizie", - POPUP "Dettaglio Incarico Perizia - Dati incarico" ' +    
    ' verifiche delle seguenti informazioni: Data incarico, Data scarico, Tipo incarico, Stato incarico, Esito perizia, Data verifica perizia, Esito verifica perizia', function () {
    
        // Verifica(1) : la valorizzazione del campo "Data incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator5 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(8) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator5).then((val) => {              
            cy.log('[it]>> [Data incarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.containValidDate(val)
        }); 

        // Verifica(2) : la valorizzazione del campo "Data scarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator6 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(9) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator6).then((val) => {
            cy.log('[it]>> [Data scarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.containValidDate(val)
        }); 

        // Verifica(3) : la valorizzazione del campo "Tipo incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator7 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(10) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseText_ById(popUplocator7).then((val) => {                    
            cy.log('[it]>> [Tipo incarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                           
        });     
        
        // Verifica(4) : la valorizzazione del campo "Stato incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator8 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(11) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseText_ById(popUplocator8).then((val) => {            
            cy.log('[it]>> [Stato incarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                           
        });     

        // Verifica(5) : la valorizzazione del campo "Perizia" nella popup "Dettaglio Incarico Perizia"
        const popUplocator9 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(12) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseText_ById(popUplocator9).then((val) => {                  
            cy.log('[it]>> [Perizia]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)                         
        });     
        
        // Verifica(6) : la valorizzazione del campo "Data verifica perizia" nella popup "Dettaglio Incarico Perizia"
        const popUplocator10 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(13) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator10).then((val) => {           
            cy.log('[it]>> [Data verifica perizia]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val)
            ConsultazioneSinistriPage.containValidDate(val)
        }); 
        // TODO: Implementare la chiusura sul secondo close della pop-up
        //const closecss= "body > div:nth-child(5) > div.k-window-titlebar.k-header > div > a > span"
        //csSinObjPage.clickLnk_ByHref("#")        
    });

});