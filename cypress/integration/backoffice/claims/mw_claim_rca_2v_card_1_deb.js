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

var controparte_conducente_cognome = 'Turco'
var controparte_conducente_nome = 'Monica'
var controparte_conducente_sesso = 'F'
var controparte_conducente_località = 'Zevio'
var controparte_conducente_indirizzo = 'Via Villasbroggia 16B'
var controparte_conducente_cod_fis = 'TRCMNC69P44M172E'
var controparte_compagnia = 'ALLIANZ SPA'
var controparte_targa = 'EM000AJ'
var controparte_marca = 'automobiles peugeot'
var controparte_modello = 'AUTO SPA 199BXA1A'

var copertura_danno = 'DANNO DA CIRCOLAZIONE (RCA)'

var sinistro_località = 'GORIZIA'
var sinistro_firma_cai = '1 Firma'
var sinistro_veicoli_coinvolti = '2'
var sinistro_dichiarazione = 'Il Cliente Ammette Torto'
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

    
    it('Dati cliente (ai fini della gestione del sinistro): inserimento dati obbligatori di denuncia: '+
    'data avvenimento, data denuncia, data pervenimento è località dell\'avvenuto sinistro', function () {
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

    it('Dettaglio di polizza: visualizzazione e selezione'+
    '', function () {

        // Visualizzazione del dettaglio di polizza 
        DenunciaSinistriPage.clickObj_ByLabel('a', 'Avanti');        
    });
    it('Elenco coperture - Prodotto Auto. Selezione della garanzia: '+
    copertura_danno, function () {

        // Selezione della copertura
        DenunciaSinistriPage.clickObj_ByLabel('td', copertura_danno)
           
        let idx = DenunciaSinistriPage.getIdInListValues_ById('#GARANZIE_listaGaranzie > table > tbody > tr', copertura_danno)  
        DenunciaSinistriPage.clickObj_ByIdAndAttr('#SelectedCheckBox', 'myindex', 0);
        cy.log('[it]>> [indice garanzia (i): '+idx);
                        
    });

    it('Inserimento dati per il risarcimento diretto con 2 veicoli conivolti e con la ' +
    'seguente dichiarazione di responsabilità del cliente: "'+sinistro_dichiarazione+'"', function () {
        
        // Selezione della dichiarazione di responsabilità
        DenunciaSinistriPage.clickSelect_ById('#GARANZIE_dichiarazioneRespons', sinistro_dichiarazione)
        // Selezione dei veicoli coinvolti
        DenunciaSinistriPage.clickSelect_ById('#GARANZIE_numVeicoli', '2')        
         // Selezione della firma cai
        DenunciaSinistriPage.clickSelect_ById('#GARANZIE_flagCAI2firme', sinistro_firma_cai)
    
        //Il Conducente veicolo cliente è anche il contraente
        DenunciaSinistriPage.clickObj_ByIdAndAttr('#GARANZIE_contraente', 'value', 'si');

        DenunciaSinistriPage.clickBtn_ById('#cmdAvanti');
    });

    it('Lista veicolo/soggetti coinvolti --> selezionare "veicolo"' +
    '', function () {
        
        // Nuovo soggetto coinvolto
        DenunciaSinistriPage.clickBtn_ById('#newSoggettoCoinvolto')
        // Selezione soggetto/veicolo coinvolto: veicolo
        DenunciaSinistriPage.checkObj_ByClassAndText('k-window-title',  'soggetto/ veicolo coinvolto')
        //DenunciaSinistriPage.checkObj_ById('popup') 
        DenunciaSinistriPage.clickPopUpObj_ByIdAndAttr('#chkRuolo', 'value', 'veicolo');
        DenunciaSinistriPage.clickPopUpBtn_ById('#CmdOk')
    });
    it('Dati del veicolo controparte (Targa: "' +controparte_targa + '" e compagnia ass.: "' +
    controparte_compagnia + ") con visualizzazione popUp della lista compagnie e ricerca in base dati Ania", function () {

        DenunciaSinistriPage.setValue_ById('#VEICOLO_targaTarga', controparte_targa);
        DenunciaSinistriPage.setValue_ById('#VEICOLO_compagnia', controparte_compagnia);
        DenunciaSinistriPage.clickBtn_ById('#CmdRicercaCompagnia')

        DenunciaSinistriPage.clickPopUpObj_ByLabel('td', controparte_compagnia)       
        DenunciaSinistriPage.clickPopUpObj_ByIdAndAttr('.field.label-grid > tbody > tr > td:nth-child(2) > .btn', 'onclick', 'closePage(\'OK\')');

        DenunciaSinistriPage.clickBtn_ById('#VEICOLO_datiAnia')
        cy.wait(3000)  
    });

    it('Dati del conducente di controparte (Cognome: "' +controparte_conducente_cognome + '" e nome: "' +
    controparte_conducente_nome + '") ', function () {

        DenunciaSinistriPage.clickBtn_ById('#VEICOLO_soggettoConducenteControparte')
        DenunciaSinistriPage.setValue_ById('#TxtCognome', controparte_conducente_cognome);
        DenunciaSinistriPage.setValue_ById('#TxtNome', controparte_conducente_nome);
        DenunciaSinistriPage.clickSelect_ById('#SOGGETTO_sesso', controparte_conducente_sesso) 
        DenunciaSinistriPage.setValue_ById('#TxtLocalitaRuo', controparte_conducente_località) 
        DenunciaSinistriPage.setValue_ById('#TxtIndirizzoRuo', controparte_conducente_indirizzo) 
        DenunciaSinistriPage.clickBtn_ById('#CmdRicercaLocalita')
        DenunciaSinistriPage.setValue_ById('#SOGGETTO_codiceFisIVA', controparte_conducente_cod_fis)        
        DenunciaSinistriPage.clickBtn_ById('#cercaRuolo')
        cy.wait(2000)
        //Salva i dati anagrafici del conducente
        DenunciaSinistriPage.clickBtn_ById('#CmdSalva');
        DenunciaSinistriPage.clickBtn_ById('#avantiVeicolo');    
        cy.wait(2000)              
    });

    it('Verifica dei dati dei soggetti coinvolti nella lista riproposta in tabella ', function () {
        
        DenunciaSinistriPage.checkObj_ByText("Conducente Veicolo Controparte");
        DenunciaSinistriPage.checkObj_ByText(controparte_conducente_cognome)
        DenunciaSinistriPage.checkObj_ByText(controparte_conducente_nome)
        DenunciaSinistriPage.checkObj_ByText(controparte_marca)
        
        DenunciaSinistriPage.checkObj_ByText("Conducente Veicolo Cliente");
        DenunciaSinistriPage.checkObj_ByText(cliente_cognome)
        DenunciaSinistriPage.checkObj_ByText(cliente_nome)

        DenunciaSinistriPage.clickBtn_ById('#avantiListaDanni')    
        cy.wait(2000)           
    });
});