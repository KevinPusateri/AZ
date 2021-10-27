/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Emissione denuncia di un sinistro motor avente come copertura 
 * di garanzia la "Rottura Cristalli"
 */


/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import DenunciaSinistriPage from "../../../mw_page_objects/backoffice/DenunciaSinistriPage"
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

/*
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })
        LoginPage.logInMWAdvanced()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia') 
    })
})
*/

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )
        LoginPage.logInMWAdvanced()
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia') 
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
/*
var ramo_pol = '31-Globale Auto'
var cliente_cognome = 'Toccane'
var cliente_nome = 'Francesco'
var cliente_dt_nascita = '25/03/1983'
var cliente_num_pol = '79323432'
var cliente_targa = 'DS246AT'
*/
var ramo_pol = '31' //601 - BONUS/MALUS
var cliente_cognome = 'Appolonio'
var cliente_nome = 'Gianluca'
var cliente_dt_nascita = '23/02/1979'
var cliente_num_pol = '530053391'
var cliente_targa = 'FJ103DT'


var copertura_danno = 'ROTTURA CRISTALLI'

var sinistro_veicoli_coinvolti = '2'
var sinistro_descrizione_danno = 'Collisione da Tamponamento'
var sinistro_località = 'GORIZIA'

var sinistro_firma_cai = '1 Firma'
var sinistro_dichiarazione = 'Il Cliente Dichiara Ragione (Del Tutto O In Parte)'
var sinistro_card = 'Card Mandatario 1 Firma'


let dtAvvenimento 
let dtDenuncia
let controparte_marca
let idx_cop_gar
//#endregion

describe('Matrix Web - Sinistri>>Denuncia: Emissione denuncia sinistro rca con 2 veicoli ' +
'coinvolti in completezza base e di tipo card 1 mandatario ', () => {

    it('Atterraggio su BackOffice >> Denuncia --> Ricerca cliente per numero di polizza: '+ cliente_num_pol+
    '', function () {

        // Ricerca cliente per Polizza
        DenunciaSinistriPage.setValue_ById('#CLIENTE_polizza', cliente_num_pol);
        DenunciaSinistriPage.clickBtn_ById('#eseguiRicerca');       
    });

    it('Dati cliente (ai fini della gestione del sinistro): inserimento dati obbligatori di denuncia: '+
    'data avvenimento, data denuncia, data pervenimento è località dell\'avvenuto sinistro', function () {
        DenunciaSinistriPage.getPlusMinusDate(-2).then((dtAvv) => { 
            dtAvvenimento =  dtAvv      
            cy.log('[it]>> [Data avvenimento sinistro]: '+dtAvvenimento);           
            DenunciaSinistriPage.setValue_ById('#CLIENTE_dataAvvenimentoRisultato', dtAvvenimento)   
        });
        DenunciaSinistriPage.getPlusMinusDate(-2).then((dtDen) => {
            dtDenuncia = dtDen
            cy.log('[it]>> [Data denuncia sinistro]: '+dtDenuncia);           
            DenunciaSinistriPage.setValue_ById('#CLIENTE_dataDenuncia', dtDenuncia)   
        });       
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtPer) => {          
            cy.log('[it]>> [Data pervenimento sinistro]: '+dtPer);           
            DenunciaSinistriPage.setValue_ById('#CLIENTE_dataPervenimento', dtPer)   
        }); 

        DenunciaSinistriPage.setValue_ById('#CLIENTE_descDinamica', sinistro_descrizione_danno)
        DenunciaSinistriPage.setValue_ById('#CLIENTE_localitaAvv', sinistro_località)
        DenunciaSinistriPage.clickBtn_ById('#CmdRicercaLocalita2');
        cy.wait(2000)
        DenunciaSinistriPage.clickBtn_ById('#CmdAvanti');        
    });

    /*
    it('Lista polizze: Selezione della polizza'+
    '', function () {

        // Selezione della polizza  
          var  isVisible = DenunciaSinistriPage.isVisible('#avantiListaPolizze')
        if (isVisible) {         
            DenunciaSinistriPage.clickBtn_ById('#avantiListaPolizze');
        } 
    });
      

    it('Dettaglio di polizza: visualizzazione e selezione'+
    '', function () {

        // Visualizzazione del dettaglio di polizza 
        DenunciaSinistriPage.clickObj_ByLabel('a', 'Avanti');        
    });
*/
    it('Sinistri potenzialmente doppi', function () {
        Cypress.on('fail', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test   
            return false
        })

        DenunciaSinistriPage.isVisible('#LISTADENUNCE_listaDenDoppie1').then(isVisible => {
            if (isVisible) {
                DenunciaSinistriPage.clickObj_ByLabel('td', "DENUNCIATO")
                DenunciaSinistriPage.clickObj_ByIdAndAttr('#SINISTRI_DOPPI_proseguiDenunciaCorso', 'value', 'si');
                DenunciaSinistriPage.clickBtn_ById('#SINISTRI_DOPPI_continua');
            } 
        }); 
    });
 

    it('Elenco coperture - Prodotto Auto. Selezione della garanzia: '+
    copertura_danno, function () {
        Cypress.off('fail', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test   
            return true
        })
        // Selezione della copertura
        DenunciaSinistriPage.clickObj_ByLabel('td', copertura_danno)

        DenunciaSinistriPage.getIdInListValues_ById('#GARANZIE_listaGaranzie > table > tbody > tr > td', copertura_danno).then((idx) => {  
            idx_cop_gar = idx
            cy.log('[it]>> indice copertura garanzia: '+idx_cop_gar);  
            DenunciaSinistriPage.clickObj_ByIdAndAttr('#SelectedCheckBox', 'myindex', idx_cop_gar);
        });
    });

    it('Verifica dei dati dei soggetti coinvolti nella lista riproposta in tabella ', function () {
        
        DenunciaSinistriPage.checkObjVisible_ByText("Conducente Veicolo Controparte");
        DenunciaSinistriPage.checkObjVisible_ByText(controparte_conducente_cognome)
        DenunciaSinistriPage.checkObjVisible_ByText(controparte_conducente_nome)
        DenunciaSinistriPage.checkObjVisible_ByText(controparte_marca)
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#DANNI_listaVeicoliSoggetti', controparte_targa)

        DenunciaSinistriPage.clickBtn_ById('#avantiListaDanni')    
        cy.wait(2000)           
    });
   
    it('Riepilogo denuncia - verifica dati danneggiato ', function () {
        // il Mandatario
        DenunciaSinistriPage.checkObjVisible_ByText("Veicolo");
        DenunciaSinistriPage.checkInTbl_ByValue(cliente_cognome + " " + cliente_nome);
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#PRECOMMIT_listaDanneggiatiBUFF', cliente_targa);
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#PRECOMMIT_listaDanneggiatiBUFF', sinistro_card);        
    });

    it('Riepilogo denuncia - verifica dati di denuncia ', function () {
        
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_dataAvvenimento', dtAvvenimento);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_dataDenuncia', dtDenuncia);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#CLIENTE_LOCALITA', sinistro_località);       
    });

    it('Riepilogo denuncia - verifica dati di contraenza polizza ', function () {
        
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_numeroPolizza', cliente_num_pol);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_targa', cliente_targa);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_datiAnagrafici', cliente_cognome);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_datiAnagrafici', cliente_nome);       
    });

});