/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *  const userName = 'TUTF012'
*  const psw = 'P@ssw0rd!'
 * @description Selezionando 'Sinistri/Movimentazione sinistri'
 *  Lo script esegue una sequenza di test su tale pagina
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import MovimentazioneSinistriPage from "../../../mw_page_objects/backoffice/MovimentazioneSinistriPage"
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
    //Common.visitUrlOnEnv()
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

describe('Matrix Web - Sinistri>>Movimentazione: Test di verifica sulla movimentazione sinistri', () => {
    
    it('Atterraggio su BackOffice >> Movimentazioni Sinistri', function () {      
       
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri') 
        cy.wait(1000) 
       
    });
    
    it('MW: Movimentazioni Sinistri: Formattazione pagina', function () {         
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('.pageTitle','Movimentazione Sinistri')
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('#CRUSCOTTO_tipoPortafoglio','Tutto il portafoglio')
        MovimentazioneSinistriPage.checkListValues_ById('#CRUSCOTTO_tipoPortafoglio')        
       // Verifica data associata all'aggiornamento dati
       const idAggDate = '#CRUSCOTTO_datiAggiornatiAl'
       MovimentazioneSinistriPage.checkObjDisabled(idAggDate)
       MovimentazioneSinistriPage.getPromiseText_ByID(idAggDate).then((dscrpt) => {                
           cy.log('[it]>> [	Dati Aggiornati al]: '+dscrpt);
           MovimentazioneSinistriPage.isNotNullOrEmpty(dscrpt)
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, dscrpt, ' contain a valid date')
           //ConsultazioneSinistriPage.containValidDate(dscrpt)
       });
        cy.wait(2000)        
    });

    
    it('MW: Movimentazioni sinistri: controllo che la somma dei singoli movimenti coincida con il totale della movimentazione riportata', function () {      
       
        MovimentazioneSinistriPage.checkTotAndSumMovimenti();
        cy.wait(2000)        
    });
    
    it('MW: Movimentazioni sinistri: controllo presenza descrizioni associate alle diverse tipologie di sinistro', function () {             
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('#container > table > tbody > tr', 'Protocollati');
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('#container > table > tbody > tr', 'Presi in carico da CLD');
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('#container > table > tbody > tr', 'Trasferiti CLD');
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('#container > table > tbody > tr', 'Chiusi Senza Seguito');
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('#container > table > tbody > tr', 'Pagati');
        MovimentazioneSinistriPage.checkObj_ByLocatorAndText('#container > table > tbody > tr', 'Periziati');
        cy.wait(2000)        
    });
    
    it('MW: Movimentazione sinistri - corretta esposizione del numero dei sinistri \'Protocollati\'', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(0)
        cy.get('@x0').then((mov) => {                     
            cy.log('[it]>> idx[0] - Sinistri Protocollati: '+mov); 
            if (parseInt(mov)>0)
            {               
                MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioDenunciati') 
                cy.wait(2000)
                MovimentazioneSinistriPage.checkObj_ByLocatorAndText('.bottonTable', 'Totali: '+mov)
                cy.wait(2000)                
                MovimentazioneSinistriPage.clickBtn_ById('#CmdEsci') 
                cy.wait(2000)  
            }
        }) 

    });

    it('MW: Movimentazione sinistri - corretta esposizione del numero dei sinistri \'Presi in carico da CLD\'', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(1)
        cy.get('@x1').then((mov) => {                     
            cy.log('[it]>> idx[1] - Sinistri Presi in carico da CLD: '+mov); 
            if (parseInt(mov)>0)
            {
                MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioAperti') 
                cy.wait(2000)
                MovimentazioneSinistriPage.checkObj_ByLocatorAndText('.bottonTable', 'Totali: '+mov)
                cy.wait(2000)
                MovimentazioneSinistriPage.clickBtn_ById('#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    });

    it('MW: Movimentazione  sinistri - corretta esposizione del numero dei sinistri \'Trasferiti\'', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(2)
        cy.get('@x2').then((mov) => {                     
            cy.log('[it]>> idx[2] - Sinistri Trasferiti: '+mov); 
            if (parseInt(mov)>0)
            {
                MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioTrasferiti') 
                cy.wait(2000)
                MovimentazioneSinistriPage.checkObj_ByLocatorAndText('.bottonTable', 'Totali: '+mov)
                cy.wait(2000)
                MovimentazioneSinistriPage.clickBtn_ById('#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    });

    it('MW: Movimentazione sinistri - corretta esposizione del numero dei sinistri \'Sinistri Chiusi SS\'', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(3)
        cy.get('@x3').then((mov) => {                     
            cy.log('[it]>> idx[3 - Sinistri Chiusi SS: '+mov); 
            if (parseInt(mov)>0)
            {
                MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioChiusiSS') 
                cy.wait(2000)
                MovimentazioneSinistriPage.checkObj_ByLocatorAndText('.bottonTable', 'Totali: '+mov)
                cy.wait(2000)
                MovimentazioneSinistriPage.clickBtn_ById('#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    });

    it('MW: Movimentazione sinistri - corretta esposizione del numero dei sinistri \'Pagati\'', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(4)
        cy.get('@x4').then((mov) => {                     
            cy.log('[it]>> idx[4 - Sinistri Pagati: '+mov); 
            if (parseInt(mov)>0)
            {
                MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioPagati') 
                cy.wait(2000)
                MovimentazioneSinistriPage.checkObj_ByLocatorAndText('.bottonTable', 'Totali: '+mov)
                cy.wait(2000)
                MovimentazioneSinistriPage.clickBtn_ById('#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    });

    it('MW: Movimentazione sinistri - corretta esposizione del numero dei sinistri \'Periziati\'', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(5)
        cy.get('@x5').then((mov) => {                     
            cy.log('[it]>> idx[5 - Sinistri Periziati: '+mov); 
            if (parseInt(mov)>0)
            {
                MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioPeriziati') 
                cy.wait(2000)
                MovimentazioneSinistriPage.checkObj_ByLocatorAndText('.bottonTable', 'Totali: '+mov)
                cy.wait(2000)
                MovimentazioneSinistriPage.clickBtn_ById('#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    });
    
    it('MW: Movimentazione sinistri - Per ciascuna tipologia di sinistro con movimentazione a 0 non sia visibile (non esiste) il pulsante di \'Dettaglio\' ', function () {  
        
        var i = 0;
        for (i = 0; i < 6 ; i++) { 
            MovimentazioneSinistriPage.getNumMovimentiByIndex(i)
        }
        cy.get('@x0').then((mov) => {            
            if (parseInt(mov)==0)
            {                
                cy.get('#CmddettaglioDenunciati').should('not.exist'); 
                cy.log('[it]>> idx[0] - Mov. sinistri Protocollati: ' + mov + ' movimenti e pulsante \'Dettaglio\' non visualizzato');          
                cy.wait(1000)               
            }
        }) 
        cy.get('@x1').then((mov) => {                           
            if (parseInt(mov)==0)
            {               
                cy.get('#CmddettaglioAperti').should('not.exist'); 
                cy.log('[it]>> idx[1] - Mov. sinistri Presi in carico da CLD: ' + mov + ' e pulsante \'Dettaglio\' non visualizzato');            
                cy.wait(1000)               
            }
        }) 
        cy.get('@x2').then((mov) => {
            if (parseInt(mov)==0)
            {               
                cy.get('#CmddettaglioTrasferiti').should('not.exist');               
                cy.log('[it]>> idx[2] - Mov. sinistri Trasferiti: ' + mov + ' e pulsante \'Dettaglio\' non visualizzato'); 
                cy.wait(1000)               
            }                           
        })      
        cy.get('@x3').then((mov) => {                     
            if (parseInt(mov)==0)
            {               
                cy.get('#CmddettaglioChiusiSS').should('not.exist');               
                cy.log('[it]>> idx[3] - Mov. sinistri Chiusi SS: ' + mov + ' e pulsante \'Dettaglio\' non visualizzato'); 
                cy.wait(1000)               
            }           
        }) 
        cy.get('@x4').then((mov) => {                     
            if (parseInt(mov)==0)
            {               
                cy.get('#CmddettaglioPagati').should('not.exist');               
                cy.log('[it]>> idx[4] - Mov. sinistri Pagati: ' + mov + ' e pulsante \'Dettaglio\' non visualizzato'); 
                cy.wait(1000)               
            }                  
        }) 
        cy.get('@x5').then((mov) => {
            if (parseInt(mov)==0)
            {               
                cy.get('#CmddettaglioPeriziati').should('not.exist');
                cy.log('[it]>> idx[5] - Mov. sinistri Periziati: ' + mov + ' e pulsante \'Dettaglio\' non visualizzato');        
                cy.wait(1000)               
            }          
        })
    })

    it('MW: Movimentazione  sinistri - \'Pagati\' corretta esposizione dei dati (numero sinistro, data movimentazione e data avvenimento)', function () { 
        MovimentazioneSinistriPage.getNumMovimentiByIndex(4)
        cy.get('@x4').then((mov) => {                     
            cy.log('[it]>> idx[4 - Sinistri Pagati: '+mov); 
            if (parseInt(mov)>0)
            {
                MovimentazioneSinistriPage.clickBtn_ById('#CmddettaglioPagati') 
                cy.wait(2000)            
                MovimentazioneSinistriPage.analyzeClaimFields('#listaDettaglio_Table > tbody')
                cy.wait(2000)
                MovimentazioneSinistriPage.clickBtn_ById('#CmdEsci') 
                cy.wait(2000)  
            }
        }) 
    })
});


