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

var numsin = '927646985'
var stato_sin = 'CHIUSO PAGATO'
var dtAvvenimento = "";
var cliente = "";

const lblnumsin = "k-grid-content"

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione sinistro in stato Stato: CHIUSO PAGATO', () => {

    it('Atterraggio su BackOffice >> Consultazione Sinistri: Selezionato un sinistro in stato PAGATO/CHIUSO ' +
    '"pagina di ricerca" si controllano i valori: num sinistro, stato sinistro.', function () {
                     
        let classvalue = "search_submit claim_number k-button"

        ConsultazioneSinistriPage.setValue_ById('#claim_number', numsin)
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')       

        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, numsin)
        ConsultazioneSinistriPage.checkObj_ByClassAndText(lblnumsin, stato_sin)       
    });

    it('"Pagina di ricerca" si controlla il nome associato al cliente assicurato.', function () {
        const cssCliente = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        cliente = ConsultazioneSinistriPage.getPromiseValue_ByCss(cssCliente).then((cliente)  => {
           ass = cliente;
           ConsultazioneSinistriPage.isNullOrEmpty(cliente)  
           cy.log('ass: '+ass);
           cy.log('cliente: '+cliente);
       });
       cy.log('CLIENTE: '+ cliente)
    });

    it('"Pagina di ricerca" si controllano i valori: targa e polizza.', function () {                 
        const cssTarga = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(4)"   
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssTarga)
    
        const cssPolizza = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(3)"
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssPolizza)      
    });

    it('"Pagina di ricerca" si controlla il valore della data di avvenimento sinistro.', function () {                
        const cssDtAvv = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        ConsultazioneSinistriPage.getPromiseDate_ByCss(cssDtAvv).then(dtAvvenimento => {
            cy.log('Dt Avv: '+dtAvvenimento)
        }); 
    });
    
    it('"Pagina di dettaglio" si controlla che siano riportati numero di sinistro, ' +
    ' data di avvenimento e il cliente assicurato', function () {
            
        ConsultazioneSinistriPage.printClaimDetailsValue()
    
        // Seleziona il sinistro dalla pagina di ricerca
        ConsultazioneSinistriPage.clickLnk_ByHref(numsin)
        
        // Verifica (1) : numero di sinistro in alto alla pagina di dettaglio
        const clssDtl = "pageTitle"
        ConsultazioneSinistriPage.checkObj_ByClassAndText(clssDtl, numsin)

        // Verifica (2): Valore della data avvenimento      
        const cssDtAvv = "#sx-detail > table > tbody > tr:nth-child(1) > td.clock"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText2(cssDtAvv, dtAvvenimento)
        
        // Verifica (3): Cliente
        const cssCliente = "#sx-detail > table > tbody > tr:nth-child(1) > td.people > a"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText2(cssCliente, cliente)
    });
    
    it('"Pagina di dettaglio" è verificata la sezione INTESTAZIONE con valorizzazione dei campi ' +
    ' Località e CLD/Danneggiato ', function () {
      
        //(1): Valore della località
        const csslocalità = "#sx-detail > table > tbody > tr.last-row > td.pointer"
        ConsultazioneSinistriPage.getPromiseValue_ByCss(csslocalità)

        //(2): la valorizzazione del CLD
        const csscldDanneggiato = '#soggetti_danneggiati > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(csscldDanneggiato)
    });

    it('"Pagina di dettaglio" selezionando il danneggiato si analizza la sezione "PERIZIE" '+
    ' valorizzazione dei seguenti campi (Data incarico, Data scarico, Fiduciario, Tipo incarico, Stato). ' , function () {
        
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        // Verifica : Apro la sezione del danneggiato (1)
        const btnDanneggiato = "#soggetti_danneggiati > div > div > a"
        ConsultazioneSinistriPage.clickBtn_ById(btnDanneggiato)

        // Verifica : la valorizzazione del campo "Data incarico" in Sezione Perizie
        const cssDtIncarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > p'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssDtIncarico).then(dtIncarico => {
            ConsultazioneSinistriPage.isNullOrEmpty(dtIncarico)       
            ConsultazioneSinistriPage.containValidDate(dtIncarico)  
        });
         
         // Verifica : la valorizzazione del campo "Data scarico" in Sezione Perizie
         const cssDtScarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
         ConsultazioneSinistriPage.getPromiseValue_ByCss(cssDtScarico).then(dtScarico => {
            ConsultazioneSinistriPage.isNullOrEmpty(dtScarico)       
            ConsultazioneSinistriPage.containValidDate(dtScarico)
         });

          // Verifica : la valorizzazione del campo "Fiduciario" in Sezione Perizie
        const cssFiduciario = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssFiduciario).then(fiduciario => {
            ConsultazioneSinistriPage.isNullOrEmpty(fiduciario)     
        });

        // Verifica : la valorizzazione del campo "Tipo incarico" in Sezione Perizie
        const cssTipoIncarico = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssTipoIncarico).then(tipoIncarico => {
            ConsultazioneSinistriPage.isNullOrEmpty(tipoIncarico).then(isok => {
                if (!isnull)
                    assert.fail('Valore vuoto o nullo')
                else
                    assert.isTrue(isok, 'è un valore definito');           
            });
            ConsultazioneSinistriPage.containValidDate(tipoIncarico).then(isdate => {
                if (!isdate)
                    assert.fail('Data non valida')
                else
                    assert.isTrue(isdate, 'è una data valida');           
            });
        })
        
        // Verifica : la valorizzazione del campo "Stato" in Sezione Perizie
        const cssStato = '#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        ConsultazioneSinistriPage.getPromiseValue_ByCss(cssStato).then(stato => {
            ConsultazioneSinistriPage.isNullOrEmpty(stato)  
        });     
    });


    it('"Pagina di dettaglio" selezionando il danneggiato si analizza la sezione "PAGAMENTI" '+
    ' verificando la valorizzazione dei seguenti campi (Data pagamento, Data Invio Banca, causale pagamento, Importo, Percepiente). ' , function () {
    
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        
        // Verifica : la valorizzazione del campo "Data pagamento" in Sezione Pagamenti
        const cssDtPagamento = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > p'
        csSinObjPage.getPromiseValue_ByCss(cssDtPagamento).then(dtPagamento => {
            csSinObjPage.isNullOrEmpty(dtPagamento)       
            csSinObjPage.containValidDate(dtPagamento)  
        });     
        
        // Verifica : la valorizzazione del campo "Data invio banca" in Sezione Pagamenti
        const cssDtInvioBanca = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(1)'
        csSinObjPage.getPromiseValue_ByCss(cssDtInvioBanca).then(dtInvioBanca => {
            csSinObjPage.isNullOrEmpty(dtInvioBanca)       
            csSinObjPage.containValidDate(dtInvioBanca)                     
        });      
 
       // Verifica : la valorizzazione del campo "Causale" in Sezione Pagamenti
        const cssCausale = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr.odd > td:nth-child(2)'
        csSinObjPage.getPromiseValue_ByCss(cssCausale).then(causale => {
            csSinObjPage.isNullOrEmpty(causale) 
        });        

        // Verifica : la valorizzazione del campo "Importo" in Sezione Pagamenti
        const cssImporto = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        csSinObjPage.getPromiseValue_ByCss(cssImporto).then(importo => {
            csSinObjPage.isNullOrEmpty(importo) 
            csSinObjPage.getCurrency(importo)               
        });

         // Verifica : la valorizzazione del campo "Percepiente pagamento" in Sezione Pagamenti
        const cssPercepiente = '#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        csSinObjPage.getPromiseValue_ByCss(cssPercepiente).then(percepiente => {
            csSinObjPage.isNullOrEmpty(percepiente)  
        });
    });

    it('Nella sezione "Pagamenti", cliccando sul pulsante di "Dettagli", si apre la POPUP "Dettaglio Pagamento" ' +
    ' verificare che le informazioni riferite a data pagamento, data invio banca, importo, valuta, causale, modalità di pagamento, Iban, tipo proposta e stato pagamento', function () {
    
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        const xpathDettaglioPagamento = "#soggetti_danneggiati > div > div > div > div:nth-child(2) > div:nth-child(2) > a"
        csSinObjPage.clickBtn_ById(xpathDettaglioPagamento)

        // Verifica : la valorizzazione del campo "Data pagamento" nella popup "Dettaglio Pagamento"      
        const popUplocator1 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(1) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator1).then(dtPagamento => {
            csSinObjPage.isNullOrEmpty(dtPagamento)       
            csSinObjPage.containValidDate(dtPagamento).then(dtPagamento => {
                if (!dtInvioBanca)
                    assert.fail('Data pagamento field is null or empty')
                else
                    assert.isTrue(importo, 'Data pagamento field is defined!');
            })                                                            
        });

        // Verifica : la valorizzazione del campo "Data invio Banca" nella popup "Dettaglio Pagamento"
        const popUplocator2 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(2) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator2).then(dtInvioBanca => {
            csSinObjPage.isNullOrEmpty(dtInvioBanca)       
            csSinObjPage.containValidDate(dtInvioBanca).then(dtInvioBanca => {
                if (!dtInvioBanca)
                    assert.fail('Data invio Banca field is null or empty')
                else
                    assert.isTrue(importo, 'Data invio Banca field is defined!');
            })                                   
        });

        // Verifica : la valorizzazione del campo "Importo" nella popup "Dettaglio Pagamento"
        const popUplocator3 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(3) > td:nth-child(2)" 
        csSinObjPage.getPromiseValue_Bylocator(popUplocator3).then(importo => {
            csSinObjPage.isNullOrEmpty(importo).then(importo => {
                if (!importo)
                    assert.fail('Importo field is null or empty')
                else
                    assert.isTrue(importo, 'Importo field is defined!');
            })          
        });

        // Verifica : la valorizzazione del campo "Valuta" nella popup "Dettaglio Pagamento"
        const popUplocator4 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(4) > td:nth-child(2)" 
        csSinObjPage.getPromiseValue_Bylocator(popUplocator4).then(valuta => {
            csSinObjPage.isNullOrEmpty(valuta).then(isValuta => {
                if (!isValuta)
                    assert.fail('Valuta field is null')
                else
                    assert.isTrue(isValuta, 'Valuta field is defined!');
            })
            csSinObjPage.isEuroCurrency(valuta).then(isEuro => {
                if (!isEuro)
                    assert.fail('Valuta field is defined as not EURO')
                else
                    assert.isTrue(isEuro, 'Valuta field is defined as EURO!');
            })                             
        });

        // Verifica : la valorizzazione del campo "Causale" nella popup "Dettaglio Pagamento"
        const popUplocator5 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(5) > td:nth-child(2)"       
        csSinObjPage.getPromiseValue_Bylocator(popUplocator5).then(causale => {
            csSinObjPage.isNullOrEmpty(causale)                                         
        });

        // Verifica : la valorizzazione del campo "Modalità di pagamento" nella popup "Dettaglio Pagamento"
        const popUplocator6 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(6) > td:nth-child(2)"       
        csSinObjPage.getPromiseValue_Bylocator(popUplocator6).then(modPagamento => {
            csSinObjPage.isNullOrEmpty(modPagamento)                                        
        });

        // Verifica : la valorizzazione del campo "IBAN" nella popup "Dettaglio Pagamento"
        const popUplocator7 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(7) > td:nth-child(2)"       
        csSinObjPage.getPromiseValue_Bylocator(popUplocator7).then(iban => {
            csSinObjPage.isNullOrEmpty(iban)       
            csSinObjPage.isValidIBAN(iban).then(isIBAN => {
                if (!isIBAN)
                    assert.fail('IBAN field is defined with not correct value')
                else
                    assert.isTrue(isValuta, 'IBAN field is defined with correct value!');
            })                                                       
        });
    
        // Verifica : la valorizzazione del campo "Tipo Proposta" nella popup "Dettaglio Pagamento"
        const popUplocator8 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(8) > td:nth-child(2)"       
        csSinObjPage.getPromiseValue_Bylocator(popUplocator8).then(tipoProposta => {
            csSinObjPage.isNullOrEmpty(tipoProposta)       
            //csSinObjPage.containValidDate(tipoProposta)                          
        });

        // Verifica : la valorizzazione del campo "Stato Pagamento" nella popup "Dettaglio Pagamento"
        const popUplocator9 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(9) > td:nth-child(2)"       
        csSinObjPage.getPromiseValue_Bylocator(popUplocator9).then(statoPagamento => {
            csSinObjPage.isNullOrEmpty(statoPagamento)                                            
        });

        csSinObjPage.clickBtn_ByClassAndText("k-icon k-i-close", "Close")        
    });

    it(' Nella sezione "Perizie", cliccando sul pulsante di "Dettagli", si apre la POPUP "Dettaglio Incarico Perizia" ' +
    ' (1) verificare che le informazioni riferite all\'anagrafica fiduciario (Fiduciario,Tipo collaborazione, Indirizzo, Telefono ) ' +
    ' (2) verificare che le informazioni riferite ai dati di incarico (Data incarico, Data scarico, Tipo incarico, Stato incarico, Esito perizia, Data verifica perizia, Esito verifica perizia)', function () {
    
        const csSinObjPage = Object.create(ConsultazioneSinistriPage)
        const xpathDettaglioPerizia = "#soggetti_danneggiati > div > div > div > div:nth-child(1) > div:nth-child(2) > a"
        csSinObjPage.clickBtn_ById(xpathDettaglioPerizia)

         // Verifica(1) : la valorizzazione del campo "Fiduciario" nella popup "Dettaglio Incarico Perizia"      
         const popUplocator1 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(2) > td:nth-child(2)"  
         csSinObjPage.getPromiseValue_Bylocator(popUplocator1).then(fiduciario => {
             csSinObjPage.isNullOrEmpty(fiduciario)                                           
         });

        // Verifica(1) : la valorizzazione del campo "Tipo Collaborazione" nella popup "Dettaglio Incarico Perizia"
         const popUplocator2 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(3) > td:nth-child(2)"  
         csSinObjPage.getPromiseValue_Bylocator(popUplocator2).then(tipoCollaborazione => {
             csSinObjPage.isNullOrEmpty(tipoCollaborazione)                                           
         });

        // Verifica(1) : la valorizzazione del campo "Indirizzo" nella popup "Dettaglio Incarico Perizia"
        const popUplocator3 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(4) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator3).then(indirizzo => {
            csSinObjPage.isNullOrEmpty(indirizzo)                                           
        });

        // Verifica(1) : la valorizzazione del campo "Telefono" nella popup "Dettaglio Incarico Perizia"
        const popUplocator4 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(5) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator4).then(telefono => {
            csSinObjPage.isNullOrEmpty(telefono)                                           
        });

        // Verifica(2) : la valorizzazione del campo "Data incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator5 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(8) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator5).then(dtIncarico => {
            csSinObjPage.isNullOrEmpty(dtIncarico)       
            csSinObjPage.containValidDate(dtIncarico)                                          
        });

        // Verifica(2) : la valorizzazione del campo "Data scarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator6 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(9) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator6).then(dtScarico => {
            csSinObjPage.isNullOrEmpty(dtScarico)       
            csSinObjPage.containValidDate(dtScarico)                                          
        });
        
        // Verifica(2) : la valorizzazione del campo "Tipo incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator7 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(10) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator7).then(tipoIncarico => {
            csSinObjPage.isNullOrEmpty(tipoIncarico)                                           
        });
        
        // Verifica(2) : la valorizzazione del campo "Stato incarico" nella popup "Dettaglio Incarico Perizia"
        const popUplocator8 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(11) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator8).then(statoIncarico => {
            csSinObjPage.isNullOrEmpty(statoIncarico)                                           
        });

        // Verifica(2) : la valorizzazione del campo "Perizia" nella popup "Dettaglio Incarico Perizia"
        const popUplocator9 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(12) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator9).then(perizia => {
            csSinObjPage.isNullOrEmpty(perizia)                                           
        });
        
        // Verifica(2) : la valorizzazione del campo "Data verifica perizia" nella popup "Dettaglio Incarico Perizia"
        const popUplocator10 = ".popup.k-window-content.k-content > table > tbody > tr:nth-child(13) > td:nth-child(2)"  
        csSinObjPage.getPromiseValue_Bylocator(popUplocator10).then(dtVerificaPerizia => {
            csSinObjPage.isNullOrEmpty(dtVerificaPerizia)       
            csSinObjPage.containValidDate(dtVerificaPerizia)                                          
        });
        // TODO: Implementare la chiusura sul secondo close della pop-up
        //const closecss= "body > div:nth-child(5) > div.k-window-titlebar.k-header > div > a > span"
        //csSinObjPage.clickLnk_ByHref("#")        
    });

});