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
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssCliente).then((val) => {          
            cy.log('[it]>> [Cliente]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                clienteAssicurato = val; 
                assert.isTrue(isNull,"[Cliente]: '"+val+"' controllo sul valore null or empty in pagina ricerca sinistro");          
            });   
        });

       const cssTarga = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(4)"   
       ConsultazioneSinistriPage.getPromiseValue_ByCss(cssTarga).then((val) => {          
            cy.log('[it]>> [Targa]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                targaAssicurato = val; 
                assert.isTrue(isNull,"[Targa]: '"+val+"' controllo sul valore null or empty in pagina ricerca sinistro");                           
            }); 
       });

       const cssPolizza = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(3)"
       ConsultazioneSinistriPage.getPromiseValue_ByCss(cssPolizza).then((val) => {          
           cy.log('[it]>> [Polizza]: '+val);
           ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                polizzaAssicurato = val;
                assert.isTrue(isNull,"[Polizza]: '"+val+"' controllo sul valore null or empty in pagina ricerca sinistro");             
            });   
       });

       const cssDtAvv = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
       ConsultazioneSinistriPage.getPromiseDate_ByCss(cssDtAvv).then((val) => {          
            cy.log('[it]>> [Data avvenimento]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                dtAvvenimento = val.trim(); 
                assert.isTrue(isNull,"[Data avvenimento]: '"+val+"' controllo sul valore null or empty in pagina ricerca sinistro");                   
            });
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
        ConsultazioneSinistriPage.getPromiseValue_ByCss(csslocalità).then((val) => {
            let dscrpt = val.split(':')[1];            
            cy.log('[it]>> [Località]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                assert.isTrue(isNull,"[Località]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro");                       
            });   
        });

        //(2): la valorizzazione del CLD
        const csscldDanneggiato = '#soggetti_danneggiati > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(csscldDanneggiato).then((val) => {
            let dscrpt = val.split(':')[1];        
            cy.log('[it]>> [CLD]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                assert.isTrue(isNull,"[CLD]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro");                            
            });                            
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
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssDtIncarico).then((val) => {
            let dscrpt = val.split(':')[1];   
            cy.log('[it]>> [Data incarico]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                dtIncarico = dscrpt.trim()  
                assert.isTrue(isNull,"[Data incarico]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PERIZIE'");                   
            });            
        });
         
         // Verifica : la valorizzazione del campo "Data scarico" in Sezione Perizie
         const cssDtScarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
         ConsultazioneSinistriPage.getPromiseValue_ByCss(cssDtScarico).then((val) => {
            let dscrpt = val.split(':')[1]; 
            cy.log('[it]>> [Data scarico]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                dtScarico = dscrpt.trim() 
                assert.isTrue(isNull,"[Data scarico]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PERIZIE'");                       
            });                 
         });

          // Verifica : la valorizzazione del campo "Fiduciario" in Sezione Perizie
        const cssFiduciario = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssFiduciario).then((val) => {
            let dscrpt = val.split(':')[1];        
            cy.log('[it]>> [Fiduciario]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                assert.isTrue(isNull,"[Fiduciario]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PERIZIE'");      
            });                            
        });   

        // Verifica : la valorizzazione del campo "Tipo incarico" in Sezione Perizie
        const cssTipoIncarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssTipoIncarico).then((val) => {
            let dscrpt = val.split(':')[1];         
            cy.log('[it]>> [Tipo incarico]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                assert.isTrue(isNull,"[Tipo incarico]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PERIZIE'");     
            });                            
        });
        
        // Verifica : la valorizzazione del campo "Stato" in Sezione Perizie
        const cssStato = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssStato).then((val) => {
            let dscrpt = val.split(':')[1];       
            cy.log('[it]>> [Stato]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {               
                assert.isTrue(isNull,"[Stato]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PERIZIE'");    
            });                            
        });
    });

    it('"Pagina di dettaglio" - sezione "PERIZIE" '+
    ' Si verifica che le date incarico e Data scarico siano date valide ' ,
     function () {

        ConsultazioneSinistriPage.containValidDate(dtIncarico).then((isNull) => {                
            assert.isTrue(isNull,"[Data incarico]: '"+dtIncarico+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PERIZIE'");
        });

        ConsultazioneSinistriPage.containValidDate(dtScarico).then((isNull) => {            
            assert.isTrue(isNull,"[Data scarico]: '"+dtScarico+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PERIZIE'");
        });
    });
     
    it('"Pagina di dettaglio" - sezione "PAGAMENTI" '+
    '  Si verifica che i seguenti campi non siano nulli: Data pagamento, Data Invio Banca, causale pagamento, Importo, Percepiente). ' , 
    function () {
            
        // Verifica : la valorizzazione del campo "Data pagamento" in Sezione Pagamenti
        const cssDtPagamento = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > p'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssDtPagamento).then((val) => {
            let dscrpt = val.split(':')[1];  
            cy.log('[it]>> [Data pagamento]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                dtPagamento = dscrpt.trim();
                assert.isTrue(isNull,"[Data pagamento]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PAGAMENTI'");              
            });                 
        });
        
        // Verifica : la valorizzazione del campo "Data invio banca" in Sezione Pagamenti
        const cssDtInvioBanca = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssDtInvioBanca).then((val) => {
            let dscrpt = val.split(':')[1]; 
            cy.log('[it]>> [Data invio banca]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                dtInvioBanca = dscrpt.trim();
                assert.isTrue(isNull,"[Data invio banca]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PAGAMENTI'");               
            });                 
        });

       // Verifica : la valorizzazione del campo "Causale" in Sezione Pagamenti
        const cssCausale = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssCausale).then((val) => {
            let dscrpt = val.split(':')[1];        
            cy.log('[it]>> [Causale]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                assert.isTrue(isNull,"[Causale]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PAGAMENTI'");      
            });
        });

        // Verifica : la valorizzazione del campo "Importo" in Sezione Pagamenti
        const cssImporto = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssImporto).then((val) => {
            let dscrpt = val.split(':')[1];       
            cy.log('[it]>> [Importo]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                impPagam = dscrpt
                assert.isTrue(isNull,"[Importo]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PAGAMENTI'");               
            });                                       
        });

         // Verifica : la valorizzazione del campo "Percepiente pagamento" in Sezione Pagamenti
        const cssPercepiente = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssPercepiente).then((val) => {
            let dscrpt = val.split(':')[1];          
            cy.log('[it]>> [Percepiente]: '+dscrpt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dscrpt).then((isNull) => {
                assert.isTrue(isNull,"[Percepiente]: '"+dscrpt+"' controllo sul valore null or empty in pagina dettaglio sinistro - sezione 'PAGAMENTI'");                             
            });                            
        });
    });


    it('"Pagina di dettaglio" - sezione "PAGAMENTI" Verifica dei dati in formato valido: '+
    ' data pagamento, data invio banca e importo.' ,
     function () {
        ConsultazioneSinistriPage.containValidDate(dtPagamento).then((isdt1) => {
            assert.isTrue(isdt1, "[Data pagamento]: '"+dtPagamento+"' controllo formale sulla data in pagina dettaglio sinistro - sezione 'PAGAMENTI'")
        });

        ConsultazioneSinistriPage.containValidDate(dtInvioBanca).then((isdt2) => {
            assert.isTrue(isdt2,"[Data Invio Banca]: '"+dtInvioBanca+"' controllo formale sulla data in pagina dettaglio sinistro - sezione 'PAGAMENTI'");        
        });

        ConsultazioneSinistriPage.isCurrency(impPagam.trim()).then((isImp) => {
            assert.isTrue(isImp,"[Importo]: '"+impPagam+"' controllo formale sul formato monetario valido in pagina dettaglio sinistro - sezione 'PAGAMENTI'");        
        });                  
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
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Data pagamento]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'");               
                ConsultazioneSinistriPage.containValidDate(val).then((isDate) => {
                    assert.isTrue(isDate,"[Data pagamento]: '"+val+"' controllo formale sulla data in pagina dettaglio sinistro - popUp 'PAGAMENTI'");  
                });               
            });                 
        });
        // Verifica : la valorizzazione del campo "Data invio Banca" nella popup "Dettaglio Pagamento"
        const popUplocator2 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(2) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator2).then((val) => {
            cy.log('[it]>> [Data invio banca]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Data invio banca]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'");               
                ConsultazioneSinistriPage.containValidDate(val).then((isDate) => {
                    assert.isTrue(isDate,"[Data invio banca]: '"+val+"' controllo formale sulla data in pagina dettaglio sinistro - popUp 'PAGAMENTI'");  
                });               
            });  
        });    

        // Verifica : la valorizzazione del campo "Importo" nella popup "Dettaglio Pagamento"
        const popUplocator3 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(3) > td:nth-child(2)" 
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator3).then((val) => {          
            cy.log('[it]>> [Importo]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Importo]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'"); 
                ConsultazioneSinistriPage.isCurrency(val).then((isCurrency) => {
                    assert.isTrue(isCurrency, "[Importo]: '"+val+"' controllo sul valore espresso come monetario nella popUp Dettaglio Pagamento");                         
                });   
            });                               
        });

        // Verifica : la valorizzazione del campo "Valuta" nella popup "Dettaglio Pagamento"
        const popUplocator4 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(4) > td:nth-child(2)" 
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator4).then((val) => {          
            cy.log('[it]>> [Valuta]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Valuta]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'"); 
                ConsultazioneSinistriPage.isEuroCurrency(val).then(isEuro => {
                    assert.isTrue(isNull,"[Valuta]: '"+val+"' controllo sul valore espresso come importo monetario in pagina dettaglio sinistro - popUp 'PAGAMENTI'");                                  
                })     
            });                                        
        });

        // Verifica : la valorizzazione del campo "Causale" nella popup "Dettaglio Pagamento"
        const popUplocator5 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(5) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator5).then((val) => {          
            cy.log('[it]>> [Causale]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Causale]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'");                   
            });                                 
        });

        // Verifica : la valorizzazione del campo "Modalità di pagamento" nella popup "Dettaglio Pagamento"
        const popUplocator6 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(6) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator6).then((val) => {          
            cy.log('[it]>> [Modalità di pagamento]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Modalità di pagamento]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'");                       
            });                                                          
        });

        // Verifica : la valorizzazione del campo "IBAN" nella popup "Dettaglio Pagamento"
        const popUplocator7 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(7) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator7).then(val => {
            cy.log('[it]>> [IBAN]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[IBAN]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'");                       
                ConsultazioneSinistriPage.isValidIBAN(val).then(isIBAN => {
                    assert.isTrue(isIBAN, '[it]>> [IBAN]: controllo di validità codice iban');                        
                })     
            });                                                                
        });
    
        // Verifica : la valorizzazione del campo "Tipo Proposta" nella popup "Dettaglio Pagamento"
        const popUplocator8 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(8) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator8).then((val) => {          
            cy.log('[it]>> [Tipo Proposta]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Tipo Proposta]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'");                        
            });                                                 
        });

        // Verifica : la valorizzazione del campo "Stato Pagamento" nella popup "Dettaglio Pagamento"
        const popUplocator9 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(9) > td:nth-child(2)"       
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator9).then((val) => {          
            cy.log('[it]>> [Stato Pagamento]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Stato Pagamento]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'PAGAMENTI'");                       
            });                                                                                 
        });

        ConsultazioneSinistriPage.clickBtn_ByClassAndText("k-icon k-i-close", "Close")        
    });
    
    it(' Nella sezione "Perizie", - POPUP "Dettaglio Incarico Perizia - anagrafica fiduciario" ' +
    ' verifiche delle seguenti informazioni: Fiduciario, Tipo collaborazione, Indirizzo, Telefono ', function () {
       
        const xpathDettaglioPerizia = "#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > a"
        ConsultazioneSinistriPage.clickBtn_ById(xpathDettaglioPerizia)
      
        // Verifica(1) : la valorizzazione del campo "Fiduciario" nella popup "Dettaglio Incarico Perizia"      
        const popUplocator1 = ".k-widget.k-window > .popup.k-window-content.k-content > table > tbody > tr:nth-child(2) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_ByCss(popUplocator1).then((val) => {                  
            cy.log('[it]>> [Fiduciario]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Fiduciario]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - anagrafica fiduciario'");                     
            });                            
        });                                            

       // Verifica(2) : la valorizzazione del campo "Tipo Collaborazione" nella popup "Dettaglio Incarico Perizia"
        const popUplocator2 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(3) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_ByCss(popUplocator2).then((val) => {                     
            cy.log('[it]>> [Tipo Collaborazione]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Tipo Collaborazione]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - anagrafica fiduciario'");                   
            });                            
        });                                      

       // Verifica(3) : la valorizzazione del campo "Indirizzo" nella popup "Dettaglio Incarico Perizia"
       const popUplocator3 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(4) > td:nth-child(2)"  
       ConsultazioneSinistriPage.getPromiseValue_ByCss(popUplocator3).then((val) => {          
            cy.log('[it]>> [Indirizzo]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Indirizzo]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - anagrafica fiduciario'");               
            });                            
        });                                    

       // Verifica(4) : la valorizzazione del campo "Telefono" nella popup "Dettaglio Incarico Perizia"
       const popUplocator4 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(5) > td:nth-child(2)"  
       ConsultazioneSinistriPage.getPromiseValue_ByCss(popUplocator4).then((val) => {        
            cy.log('[it]>> [Telefono]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Telefono]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - anagrafica fiduciario'");
            });                            
        });                                                      

    });

    it(' Nella sezione "Perizie", - POPUP "Dettaglio Incarico Perizia - Dati incarico" ' +    
    ' verifiche delle seguenti informazioni: Data incarico, Data scarico, Tipo incarico, Stato incarico, Esito perizia, Data verifica perizia, Esito verifica perizia', function () {
    
        // Verifica(1) : la valorizzazione del campo "Data incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator5 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(8) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator5).then((val) => {              
            cy.log('[it]>> [Data incarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Data incarico]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");
                ConsultazioneSinistriPage.containValidDate(val).then((isDate) => {
                    assert.isTrue(isDate, "[Data incarico] controllo formale sulla data in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                       
                });                   
            });             
        }); 

        // Verifica(2) : la valorizzazione del campo "Data scarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator6 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(9) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator6).then((val) => {
            cy.log('[it]>> [Data scarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Data scarico]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                    
                ConsultazioneSinistriPage.containValidDate(val).then((isDate) => {
                    assert.isTrue(isDate, "[Data scarico] controllo formale sulla data in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                                          
                });
            });             
        }); 

        // Verifica(3) : la valorizzazione del campo "Tipo incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator7 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(10) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_ByCss(popUplocator7).then((val) => {                    
            cy.log('[it]>> [Tipo incarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Tipo incarico]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                       
            });                            
        });     
        
        // Verifica(4) : la valorizzazione del campo "Stato incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator8 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(11) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_ByCss(popUplocator8).then((val) => {            
            cy.log('[it]>> [Stato incarico]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Stato incarico]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                        
            });                            
        });     

        // Verifica(5) : la valorizzazione del campo "Perizia" nella popup "Dettaglio Incarico Perizia"
        const popUplocator9 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(12) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_ByCss(popUplocator9).then((val) => {                  
            cy.log('[it]>> [Perizia]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Perizia]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                        
            });                            
        });     
        
        // Verifica(6) : la valorizzazione del campo "Data verifica perizia" nella popup "Dettaglio Incarico Perizia"
        const popUplocator10 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(13) > td:nth-child(2)"  
        ConsultazioneSinistriPage.getPromiseValue_Bylocator(popUplocator10).then((val) => {           
            cy.log('[it]>> [Data verifica perizia]: '+val);
            ConsultazioneSinistriPage.isNotNullOrEmpty(val).then((isNull) => {
                assert.isTrue(isNull,"[Data verifica perizia]: '"+val+"' controllo sul valore null or empty in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                                     
                    ConsultazioneSinistriPage.containValidDate(val).then((isDate) => {
                        assert.isTrue(isDate, "[Data verifica perizia] controllo formale sulla data in pagina dettaglio sinistro - popUp 'Incarico Perizia - Dettaglio Incarico Perizia'");                       
                });
            });             
        }); 
        // TODO: Implementare la chiusura sul secondo close della pop-up
        //const closecss= "body > div:nth-child(5) > div.k-window-titlebar.k-header > div > a > span"
        //csSinObjPage.clickLnk_ByHref("#")        
    });

});