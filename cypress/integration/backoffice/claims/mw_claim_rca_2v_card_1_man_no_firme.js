/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Emissione denuncia sinistro rca con 2 veicoli 
 * in completezza base e di tipo card 1 mandatario - senza firme
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import DenunciaSinistriPage from "../../../mw_page_objects/backoffice/DenunciaSinistriPage"
import { isDate } from "lodash"


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
//#region Script Variables

var ramo_pol = '31-Globale Auto'
var cliente_cognome = 'Toccane'
var cliente_nome = 'Francesco'
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

var copertura_danno = 'DANNO DA CIRCOLAZIONE (RCA)'

var sinistro_veicoli_coinvolti = '2'
var sinistro_descrizione_danno = 'Collisione da Tamponamento'
var sinistro_località = 'GORIZIA'

var sinistro_firma_cai = 'Assente'
var sinistro_dichiarazione = 'Il Cliente Dichiara Ragione (Del Tutto O In Parte)'
var tipo_danno = 'Card Mandatario 1 Firma'


let dtAvvenimento 
let dtDenuncia
let controparte_marca
let idx_cop_gar
//#endregion

describe('Matrix Web - Sinistri>>Denuncia: Emissione denuncia sinistro rca con 2 veicoli ' +
 'coinvolti in completezza base e di tipo card 1 mandatario - senza firme ', () => {

    it('Atterraggio su BackOffice >> Denuncia', function () {             
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia') 
        cy.wait(1000)        
    });
    
    it('Denuncia --> Ricerca cliente per numero di polizza: ' + cliente_num_pol, function() {               
        // Ricerca cliente per Polizza
        DenunciaSinistriPage.setValue_ById('#CLIENTE_polizza', cliente_num_pol);
        DenunciaSinistriPage.clickBtn_ById('#eseguiRicerca');
    });

    it('Dati cliente (ai fini della gestione del sinistro): inserimento dati obbligatori di denuncia: ' +
        'data avvenimento, data denuncia, data pervenimento è località dell\'avvenuto sinistro',
        function() {
            DenunciaSinistriPage.getPlusMinusDate(-2).then((dtAvv) => {
                dtAvvenimento = dtAvv
                cy.log('[it]>> [Data avvenimento sinistro]: ' + dtAvvenimento);
                DenunciaSinistriPage.setValue_ById('#CLIENTE_dataAvvenimentoRisultato', dtAvvenimento)
            });
            cy.wait(1000)
            DenunciaSinistriPage.getPlusMinusDate(-2).then((dtDen) => {
                dtDenuncia = dtDen
                cy.log('[it]>> [Data denuncia sinistro]: '+dtDenuncia);           
                DenunciaSinistriPage.setValue_ById('#CLIENTE_dataDenuncia', dtDenuncia)   
            }); 
            cy.wait(1000)
            DenunciaSinistriPage.getPlusMinusDate(-1).then((dtPer) => {          
                cy.log('[it]>> [Data pervenimento sinistro]: '+dtPer);           
                DenunciaSinistriPage.setValue_ById('#CLIENTE_dataPervenimento', dtPer)   
            }); 
            cy.wait(1000)

    });

    it('Dati cliente Altri dati di denuncia: ' +
            'Descrizione della dinamica è località dell\'avvenuto sinistro', function() {
            DenunciaSinistriPage.setValue_ById('#CLIENTE_descDinamica', sinistro_descrizione_danno)
            DenunciaSinistriPage.setValue_ById('#CLIENTE_localitaAvv', sinistro_località)
            DenunciaSinistriPage.clickBtn_ById('#CmdRicercaLocalita2');
            cy.wait(2000)
            DenunciaSinistriPage.clickBtn_ById('#CmdAvanti');
            cy.wait(2000)
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

    it('Sinistri potenzialmente doppi', function () {
        Cypress.on('fail', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test   
            return false
        })
        cy.wait(3000)
        DenunciaSinistriPage.isVisible('#LISTADENUNCE_listaDenDoppie1').then(isVisible => {
            if (isVisible) {                              
                let cssrdbtn = "#workarea2 > fieldset:nth-child(4) > table > tbody > tr:nth-child(2) > td > ul > li"
                DenunciaSinistriPage.clickOnRadio_ByIdAndText(cssrdbtn, 'Prosegui denuncia in corso');
                cy.wait(1000)
                DenunciaSinistriPage.clickBtn_ById('#SINISTRI_DOPPI_continua');
                cy.wait(1000)
            }            
        }); 
    });

    it('Elenco coperture - Prodotto Auto. Selezione della garanzia: '+
    copertura_danno, function () {        
        Cypress.on('fail', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test   
            throw err
        })    
        // Selezione della copertura
        DenunciaSinistriPage.clickObj_ByLabel('td', copertura_danno)

        DenunciaSinistriPage.getIdInListValues_ById('#GARANZIE_listaGaranzie > table > tbody > tr ', copertura_danno).then((idx) => {  
            idx_cop_gar = ""+idx+""
            cy.log('[it]>> indice copertura garanzia: '+idx_cop_gar);  
            if (idx !== undefined) {                
                DenunciaSinistriPage.clickOnCheck_ByIdAndAttr('.SelectedCheckBox', 'myindex', idx_cop_gar);
            }
        });
          // in questo caso non va impostato l'avanti pagina        
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
        cy.wait(3000)
        DenunciaSinistriPage.clickBtn_ById('#cmdAvanti');
        cy.wait(2000)
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
        cy.wait(4000)
        DenunciaSinistriPage.getPromiseValue_ById('#VEICOLO_marcaVeicolo').then((val) => {    
            controparte_marca = val              
            cy.log('[it]>> marca vettura: ' + controparte_marca)
        });
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
        cy.wait(4000)
        DenunciaSinistriPage.setValue_ById('#SOGGETTO_codiceFisIVA', controparte_conducente_cod_fis)        
        DenunciaSinistriPage.clickBtn_ById('#cercaRuolo')
        cy.wait(4000)
        //Salva i dati anagrafici del conducente
        DenunciaSinistriPage.clickBtn_ById('#CmdSalva');                       
    });

    it('Dati dell\'assicurato di controparte (Cognome: "' +controparte_conducente_cognome + '" e nome: "' +
    controparte_conducente_nome + '") ', function () {

        DenunciaSinistriPage.clickBtn_ById('#VEICOLO_soggettoAssicuratoControparte')
        DenunciaSinistriPage.setValue_ById('#TxtCognome', controparte_conducente_cognome);
        DenunciaSinistriPage.setValue_ById('#TxtNome', controparte_conducente_nome);
        DenunciaSinistriPage.clickSelect_ById('#SOGGETTO_sesso', controparte_conducente_sesso) 
        DenunciaSinistriPage.setValue_ById('#TxtLocalitaRuo', controparte_conducente_località) 
        DenunciaSinistriPage.setValue_ById('#TxtIndirizzoRuo', controparte_conducente_indirizzo) 
        DenunciaSinistriPage.clickBtn_ById('#CmdRicercaLocalita')
        cy.wait(4000)
        DenunciaSinistriPage.setValue_ById('#SOGGETTO_codiceFisIVA', controparte_conducente_cod_fis)        
        DenunciaSinistriPage.clickBtn_ById('#cercaRuolo')
        cy.wait(4000)
        //Salva i dati anagrafici del conducente
        DenunciaSinistriPage.clickBtn_ById('#CmdSalva');
        cy.wait(1000)
        DenunciaSinistriPage.clickBtn_ById('#avantiVeicolo');
        cy.wait(2000)              
    });
    
    it('Verifica dei dati dei soggetti coinvolti nella lista riproposta in tabella ', function () {
        
        DenunciaSinistriPage.checkObjVisible_ByText("Conducente Veicolo Controparte");
        DenunciaSinistriPage.checkObjVisible_ByText(controparte_conducente_cognome)
        DenunciaSinistriPage.checkObjVisible_ByText(controparte_conducente_nome)
        DenunciaSinistriPage.checkObjVisible_ByText(controparte_marca)
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#DANNI_listaVeicoliSoggetti', controparte_targa)

        DenunciaSinistriPage.checkObjVisible_ByText("Conducente Veicolo Cliente");
        DenunciaSinistriPage.checkObjVisible_ByText(cliente_cognome)
        DenunciaSinistriPage.checkObjVisible_ByText(cliente_nome)

        DenunciaSinistriPage.clickBtn_ById('#avantiListaDanni')    
        cy.wait(2000)           
    });

    it('Riepilogo denuncia - verifica dati danneggiato ', function () {
        // il Mandatario
        DenunciaSinistriPage.checkObjVisible_ByText("Veicolo");
        DenunciaSinistriPage.checkInTbl_ByValue(cliente_cognome + " " + cliente_nome);
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#PRECOMMIT_listaDanneggiatiBUFF', cliente_targa);
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#PRECOMMIT_listaDanneggiatiBUFF', tipo_danno);        
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

    it('Riepilogo denuncia - salvataggio e chiusura di denuncia ', function () {
        
        DenunciaSinistriPage.clickBtn_ById('#CmdSalva');
        cy.wait(3000)  
        DenunciaSinistriPage.clickObjPopUpChiudi_ByLabel('a','Chiudi')
        cy.wait(1000)  
    });

    it('Riepilogo - Verifica dati di sinistro ', function () {
       
        const cssNumSin = "#PRECOMMIT_listaDanneggiatiBUFF > table > tbody > tr > td:nth-child(1)"
        DenunciaSinistriPage.getPromiseText_ById(cssNumSin).then((numsin) => {                 
            cy.log('[it]>> numero di sinistro: ' + numsin)
            numsin = numsin.substring(0,9)
            DenunciaSinistriPage.isNotNullOrEmpty(numsin)                 
            DenunciaSinistriPage.isPositiveNumber(numsin) 
        });

        // il dannegiato 
        DenunciaSinistriPage.checkObjVisible_ByText("Veicolo");
        DenunciaSinistriPage.checkInTbl_ByValue(cliente_cognome + " " + cliente_nome);
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#PRECOMMIT_listaDanneggiatiBUFF', cliente_targa);
        DenunciaSinistriPage.checkObj_ByLocatorAndText('#PRECOMMIT_listaDanneggiatiBUFF', tipo_danno);        
        // Dati di denuncia
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_dataAvvenimento', dtAvvenimento);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_dataDenuncia', dtDenuncia);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#CLIENTE_LOCALITA', sinistro_località);

         // dati di contraenza
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_numeroPolizza', cliente_num_pol);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_targa', cliente_targa);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_datiAnagrafici', cliente_cognome);
        DenunciaSinistriPage.checkObj_ByIdAndLbl('#RIEPILOGO_datiAnagrafici', cliente_nome);
    });
    
});