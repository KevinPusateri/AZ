/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Emissione denuncia sinistro rca con 2 veicoli 
 * di tipo card 1 debitore
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

var ramo_pol = '31-Globale Auto'
var cliente_cognome = 'Toccane'
var cliente_nome = 'Francesco'
var cliente_località = 'Conegliano'
var cliente_dt_nascita = '25/03/1983'
var cliente_num_pol = '79323432'
var cliente_targa = 'DS246AT'

var controparte_proprietario_cognome = 'Turco'
var controparte_proprietario_cognome = 'Monica'
var controparte_località = 'Zevio'
var controparte_indirizzo = 'Via Villasbroggia 16B'
var controparte_proprietario_cod_fis = 'TRCMNC69P44M172E'
var controparte_compagnia = 'ALLIANZ SPA'
var controparte_targa = 'EM000AJ'
var controparte_marca = 'automobiles peugeot'
var controparte_modello = 'AUTO SPA 199BXA1A'

var copertura_danno = 'DANNO DA CIRCOLAZIONE (RCA)'

var sinistro_località = 'GORIZIA'
var sinistro_firma_cai = '1 Firma'
var sinistro_veicoli_coinvolti = '2'
var sinistro_dichiarazione = 'Il Cliente Dichiara Ragione (Del Tutto O In Parte)'
var sinistro_descrizione_danno = 'Collisione da Tamponamento'


let dtAvvenimento 
//#endregion

describe('Matrix Web - Sinistri>>Denuncia: Emissione denuncia sinistro rca con 2 veicoli ' +
 'coinvolti e di tipo card 1 debitore ', () => {
   
    it('Atterraggio su BackOffice >> Denuncia --> Ricerca cliente per numero di polizza: '+ cliente_num_pol+
    '', function () {

        // Ricerca cliente per Polizza
        DenunciaSinistriPage.setValue_ById('#CLIENTE_polizza', cliente_num_pol);
        DenunciaSinistriPage.clickBtn_ById('#eseguiRicerca');       
    });

    it('Dati cliente (ai fini della gestione del sinistro): inserimento dati obbligatori di denuncia', function () {
        DenunciaSinistriPage.getPlusMinusDate(-2).then((dtAvv) => {          
            cy.log('[it]>> [Data avvenimento sinistro]: '+dtAvv);           
            DenunciaSinistriPage.setValue_ById('#CLIENTE_dataAvvenimentoRisultato', dtAvv)   
        });
        DenunciaSinistriPage.getPlusMinusDate(-2).then((dtDen) => {          
            cy.log('[it]>> [Data denuncia sinistro]: '+dtDen);           
            DenunciaSinistriPage.setValue_ById('#CLIENTE_dataDenuncia', dtDen)   
        });       
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtPer) => {          
            cy.log('[it]>> [Data pervenimento sinistro]: '+dtPer);           
            DenunciaSinistriPage.setValue_ById('#CLIENTE_dataPervenimento', dtPer)   
        }); 

        DenunciaSinistriPage.setValue_ById('#CLIENTE_descDinamica', sinistro_descrizione_danno)
        DenunciaSinistriPage.setValue_ById('#CLIENTE_localitaAvv', sinistro_località)

        DenunciaSinistriPage.clickBtn_ById('#CmdAvanti');        
    });

    it('Lista polizze: Selezione della polizza'+
    '', function () {

        // Selezione della polizza  
        DenunciaSinistriPage.clickBtn_ById('#avantiListaPolizze');       
    });

    it('Dettaglio di polizza: visualizzazione'+
    '', function () {

        // Visualizzazione del dettaglio di polizza 
        DenunciaSinistriPage.clickObj_ByLabel('a', 'Avanti');        
    });
    it('Elenco coperture - Prodotto Auto. Selezione della garanzia: '+copertura_danno+
    '', function () {

        // Selezione della copertura
        DenunciaSinistriPage.clickObj_ByLabel('td', copertura_danno)
        DenunciaSinistriPage.getIdInListValues_ById('#GARANZIE_listaGaranzie > table > tbody > tr', copertura_danno).then((idx) => {                      
            cy.log('[it]>> [indice garanzaia: '+idx);    
            DenunciaSinistriPage.clickObj_ByIdAndAttr('#SelectedCheckBox', 'myindex', idx); 
        }); 
        
        DenunciaSinistriPage.clickBtn_ById('#cmdAvanti');
    });
    
});