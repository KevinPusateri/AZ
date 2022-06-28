/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Emissione denuncia sinistro rca con 2 veicoli 
 * in completezza base e di tipo card 1 debitore
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
const IframeDen = 'iframe[src="cliente.jsp"]'

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

var sinistro_firma_cai = '1 Firma'
var sinistro_dichiarazione = 'Il Cliente Ammette Torto'
var tipo_danno = 'Card Debitore 1 Firma'


let dtAvvenimento 
let dtDenuncia
let controparte_marca
let idx_cop_gar
//#endregion

describe('Matrix Web - Sinistri>>Denuncia: Emissione denuncia sinistro rca con 2 veicoli ' +
'coinvolti in completezza base e di tipo card 1 debitore ', () => {

    it('Atterraggio su BackOffice >> Denuncia', function () {             
        TopBar.clickBackOffice()
        cy.wait(1000)
        BackOffice.clickCardLink('Denuncia') 
        cy.wait(1000)        
    });    

    it('Denuncia --> Ricerca cliente per numero di polizza: ' + cliente_num_pol, function() {               
        // Ricerca cliente per Polizza
        DenunciaSinistriPage.setValue_ById('#CLIENTE_polizza', cliente_num_pol);
        Common.clickFindByIdOnIframeChild(IframeDen, '#eseguiRicerca');
        cy.wait(1000)
        cy.screenshot('Pagina Ricerca cliente -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
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
            cy.screenshot('Pagina Dati denuncia - date del sinistro ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.wait(1000) 
    });

    it('Dati cliente altri dati di denuncia: ' +
        'Descrizione della dinamica è località dell\'avvenuto sinistro', function() {
        DenunciaSinistriPage.setValue_ById('#CLIENTE_descDinamica', sinistro_descrizione_danno)
        DenunciaSinistriPage.setValue_ById('#CLIENTE_localitaAvv', sinistro_località)
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdRicercaLocalita2');
        cy.wait(2000)
        DenunciaSinistriPage.getPromiseValue_ByID('#CLIENTE_capAvv').then((sin_cap) => {                                
            cy.log('[it]>> [CAP]: '+sin_cap);
            DenunciaSinistriPage.isNotNullOrEmpty(sin_cap)
        });
        cy.screenshot('Pagina Dati denuncia - Località ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)                
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdAvanti');
        cy.wait(2000)
    });

    it('Lista polizze: Selezione della polizza', function () {
        // Selezione della polizza 
        cy.screenshot('Pagina Lista polizze', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)      
        Common.clickFindByIdOnIframeChild(IframeDen, '#avantiListaPolizze'); 
        cy.wait(3000)     
    });

    it('Dettaglio di polizza: visualizzazione e selezione', function () {     
        // Nel caso la polizza sia in periodo di mora si attiva la
         //pagina di dettaglio polizza
        cy.screenshot('Pagina Dettaglio di polizza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)      
        DenunciaSinistriPage.clickObj_ByLabel('a','Avanti')  
        cy.wait(1000)  
    });

    it('Sinistri potenzialmente doppi', function () {
        const isPresent = DenunciaSinistriPage.isVisibleText('Sinistri potenzialmente doppi')
        cy.wait(2000)
        if (!isPresent)
        {           
            let cssrdbtn = "#workarea2 > fieldset:nth-child(4) > table > tbody > tr:nth-child(2) > td > ul > li"
            DenunciaSinistriPage.clickOnRadio_ByIdAndText(cssrdbtn, 'Prosegui denuncia in corso');
            cy.wait(1000)
            Common.clickFindByIdOnIframeChild(IframeDen, '#SINISTRI_DOPPI_continua');
            cy.wait(1000)    
        }
        cy.log('Pagina Sinistri potenzialmente doppi: ' +isPresent);                
    });
    
    it('Elenco coperture - Prodotto Auto. Selezione della garanzia: '+copertura_danno, function () {       
        DenunciaSinistriPage.clickObj_ByLabel('td', copertura_danno)

        DenunciaSinistriPage.getIdInListValues_ById('#GARANZIE_listaGaranzie > table > tbody > tr ', copertura_danno).then((idx) => {  
            idx_cop_gar = ""+idx+""
            cy.log('[it]>> indice copertura garanzia: '+idx_cop_gar);  
            if (idx !== undefined) {                
                DenunciaSinistriPage.clickOnCheck_ByIdAndAttr('.SelectedCheckBox', 'myindex', idx_cop_gar);
            }
        });
        cy.wait(2000)
        cy.screenshot('Elenco coperture - Selezione della garanzia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)        
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
        cy.screenshot('Pagina Dichiarazione di responsabilità', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000) 
        Common.clickFindByIdOnIframeChild(IframeDen, '#cmdAvanti');
        cy.wait(2000)
    });

    it('Lista veicolo/soggetti coinvolti --> selezionare "veicolo"', function () {        
        // Nuovo soggetto coinvolto
        Common.clickFindByIdOnIframeChild(IframeDen, '#newSoggettoCoinvolto')
        cy.wait(1000) 
        // Selezione soggetto/veicolo coinvolto: veicolo
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '.k-window-title',  'soggetto/ veicolo coinvolto')
        cy.wait(2000)
        DenunciaSinistriPage.clickPopUpObj_ByIdAndAttr('#chkRuolo', 'value', 'veicolo');
        DenunciaSinistriPage.clickPopUpBtn_ById('#CmdOk')
    });

    it('Dati del veicolo controparte (Targa: "' +controparte_targa + '" e compagnia ass.: "' +
    controparte_compagnia + ") con visualizzazione popUp della lista compagnie e ricerca in base dati Ania", function () {

        DenunciaSinistriPage.setValue_ById('#VEICOLO_targaTarga', controparte_targa);
        DenunciaSinistriPage.setValue_ById('#VEICOLO_compagnia', controparte_compagnia);
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdRicercaCompagnia')
        cy.wait(2000)
        DenunciaSinistriPage.getPopUpObj_ByLabel(controparte_compagnia)
        cy.wait(2000)    
        DenunciaSinistriPage.clickPopUpObj_ByIdAndAttr('.field.label-grid > tbody > tr > td:nth-child(2) > .btn', 'onclick', 'closePage(\'OK\')');

        Common.clickFindByIdOnIframeChild(IframeDen, '#VEICOLO_datiAnia')
        cy.wait(8000)
        DenunciaSinistriPage.getPromiseValue_ByID('#VEICOLO_marcaVeicolo').then((val) => {  
            controparte_marca = val
            cy.log('[it]>> marca vettura: ' + controparte_marca)
        })
        cy.wait(1000)
        cy.screenshot('Dati del veicolo controparte', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)   
    });

    it('Dati del conducente di controparte (Cognome: "' +controparte_conducente_cognome + '" e nome: "' +
    controparte_conducente_nome + '") ', function () {

        Common.clickFindByIdOnIframeChild(IframeDen, '#VEICOLO_soggettoConducenteControparte')
        cy.wait(1000) 
        DenunciaSinistriPage.setValue_ById('#TxtCognome', controparte_conducente_cognome);
        DenunciaSinistriPage.setValue_ById('#TxtNome', controparte_conducente_nome);
        DenunciaSinistriPage.clickSelect_ById('#SOGGETTO_sesso', controparte_conducente_sesso) 
        DenunciaSinistriPage.setValue_ById('#TxtLocalitaRuo', controparte_conducente_località) 
        DenunciaSinistriPage.setValue_ById('#TxtIndirizzoRuo', controparte_conducente_indirizzo) 
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdRicercaLocalita')
        cy.wait(3000)
        DenunciaSinistriPage.setValue_ById('#SOGGETTO_codiceFisIVA', controparte_conducente_cod_fis)        
        Common.clickFindByIdOnIframeChild(IframeDen, '#cercaRuolo')
        cy.wait(4000)
        cy.screenshot('Dati del conducente di controparte', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)
        //Salva i dati anagrafici del conducente
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdSalva');
        cy.wait(1000)               
    });

    it('Dati assicurato di controparte (Cognome: "' +controparte_conducente_cognome + '" e nome: "' +
    controparte_conducente_nome + '") ', function () {

        Common.clickFindByIdOnIframeChild(IframeDen, '#VEICOLO_soggettoAssicuratoControparte')
        cy.wait(1000) 
        DenunciaSinistriPage.setValue_ById('#TxtCognome', controparte_conducente_cognome);
        DenunciaSinistriPage.setValue_ById('#TxtNome', controparte_conducente_nome);
        DenunciaSinistriPage.clickSelect_ById('#SOGGETTO_sesso', controparte_conducente_sesso) 
        DenunciaSinistriPage.setValue_ById('#TxtLocalitaRuo', controparte_conducente_località) 
        DenunciaSinistriPage.setValue_ById('#TxtIndirizzoRuo', controparte_conducente_indirizzo) 
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdRicercaLocalita')
        cy.wait(3000)
        DenunciaSinistriPage.setValue_ById('#SOGGETTO_codiceFisIVA', controparte_conducente_cod_fis)        
        Common.clickFindByIdOnIframeChild(IframeDen, '#cercaRuolo')
        cy.wait(4000)       
        //Salva i dati anagrafici del conducente
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdSalva');
        cy.wait(1000)
        cy.screenshot('Dati assicurato di controparte', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)
        Common.clickFindByIdOnIframeChild(IframeDen, '#avantiVeicolo');
        cy.wait(2000)              
    });
    
    it('Verifica dati dei soggetti coinvolti nella lista riproposta in tabella ', function () {
        
        Common.getObjByTextOnIframeChild(IframeDen, "Conducente Veicolo Controparte");
        Common.getObjByTextOnIframeChild(IframeDen, controparte_conducente_cognome)
        Common.getObjByTextOnIframeChild(IframeDen, controparte_conducente_nome)
        Common.getObjByTextOnIframeChild(IframeDen, controparte_marca)
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#DANNI_listaVeicoliSoggetti', controparte_targa)

        Common.getObjByTextOnIframeChild(IframeDen, "Conducente Veicolo Cliente");
        Common.getObjByTextOnIframeChild(IframeDen, cliente_cognome)
        Common.getObjByTextOnIframeChild(IframeDen, cliente_nome)
        cy.screenshot('Soggetti coinvolti nel sinistro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)
        Common.clickFindByIdOnIframeChild(IframeDen, '#avantiListaDanni')    
        cy.wait(2000)           
    });

    it('Riepilogo denuncia - verifica dati danneggiato ', function () {
        // il danneggiato 
        Common.getObjByTextOnIframeChild(IframeDen, "Veicolo");
        //Common.getObjByTextOnIframeChild(IframeDen, controparte_conducente_cognome + " " + controparte_conducente_nome);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#PRECOMMIT_listaDanneggiatiBUFF', controparte_targa);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#PRECOMMIT_listaDanneggiatiBUFF', tipo_danno);        
    });

    it('Riepilogo denuncia - verifica dati di denuncia ', function () {
        // Dati di denuncia
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_dataAvvenimento', dtAvvenimento);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_dataDenuncia', dtDenuncia);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#CLIENTE_LOCALITA', sinistro_località);       
    });

    it('Riepilogo denuncia - verifica dati di contraenza polizza ', function () {
        // dati di contraenza
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_numeroPolizza', cliente_num_pol);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_targa', cliente_targa);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_datiAnagrafici', cliente_cognome);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_datiAnagrafici', cliente_nome);       
    });

    it('Riepilogo denuncia - salvataggio e chiusura di denuncia ', function () {
        
        Common.clickFindByIdOnIframeChild(IframeDen, '#CmdSalva');
        cy.wait(3000)  
        DenunciaSinistriPage.clickObjPopUpChiudi_ByLabel('a','Chiudi')
        cy.wait(1000) 
        cy.screenshot('Riepilogo dati di denuncia - Salvataggio e chiusura', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000) 
    });

    it('Riepilogo - Verifica dati di sinistro  ', function () {
        
        const cssNumSin = "#PRECOMMIT_listaDanneggiatiBUFF > table > tbody > tr > td:nth-child(1)"
        DenunciaSinistriPage.getPromiseText_ById(cssNumSin).then((numsin) => {                 
            cy.log('[it]>> numero di sinistro: ' + numsin)
            numsin = numsin.substring(0,9)
            DenunciaSinistriPage.isNotNullOrEmpty(numsin)                 
            Common.isValidCheck(/^-?(0|[1-9]\d*)$/, numsin, 'is valid number')
        });

        // il danneggiato 
        Common.getObjByTextOnIframeChild(IframeDen, "Veicolo");
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#PRECOMMIT_listaDanneggiatiBUFF',controparte_conducente_cognome + " " + controparte_conducente_nome);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#PRECOMMIT_listaDanneggiatiBUFF', controparte_targa);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#PRECOMMIT_listaDanneggiatiBUFF', tipo_danno);        

         // Dati di denuncia
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_dataAvvenimento', dtAvvenimento);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_dataDenuncia', dtDenuncia);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#CLIENTE_LOCALITA', sinistro_località);

         // dati di contraenza
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_numeroPolizza', cliente_num_pol);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_targa', cliente_targa);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_datiAnagrafici', cliente_cognome);
        Common.getObjByIdAndTextOnIframeChild(IframeDen, '#RIEPILOGO_datiAnagrafici', cliente_nome);
    });
});