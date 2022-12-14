/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Emissione denuncia di un sinistro motor avente come copertura 
 * di garanzia la "Eventi Naturali - Grandine"
 */


/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import DenunciaSinistriPage from "../../../mw_page_objects/backoffice/DenunciaSinistriPage"
import { isDate } from "lodash"


//#region Mysql DB Variables
//const testName = Cypress.spec.name.split('.')[2].split('.')[0].toUpperCase()
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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
        LoginPage.logInMWAdvanced({         
            "agency": "010375000",
            "agentId": "ARALONGO7"
        })    
    })
})


beforeEach(() => {
    cy.preserveCookies()
})

afterEach(function () {
    /*
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
    */
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
const IFrameParent = 'iframe[src="cliente.jsp"]'
/*
var ramo_pol = '31-Globale Auto'
var cliente_cognome = 'Toccane'
var cliente_nome = 'Francesco'
var cliente_dt_nascita = '25/03/1983'
var cliente_num_pol = '79323432'
var cliente_targa = 'DS246AT'
*/
var ramo_pol = '31' //601 - BONUS/MALUS
var cliente_cognome = 'Croce'
var cliente_nome = 'Alessandro'
var cliente_dt_nascita = '15/06/1975'
var cliente_num_pol = '531944319'
var cliente_targa = 'Gz787rt'

var copertura_danno = 'EVENTI NATURALI'

var sinistro_veicoli_coinvolti = '1'
var sinistro_descrizione_danno = 'Danneggiamento da grandine'
var sinistro_localit?? = 'GORIZIA'

var tipo_danno = 'Eventi Naturali'

let dtAvvenimento
let dtDenuncia
let controparte_marca
let idx_cop_gar
//#endregion

describe('Matrix Web - Sinistri>>Denuncia: Emissione denuncia di un sinistro motor avente come copertura' +
' di garanzia la "' + copertura_danno + '"', () => {

    it('Atterraggio su BackOffice >> Denuncia', function () {
        TopBar.clickBackOffice()
        cy.wait(1000);
        BackOffice.clickCardLink('Denuncia') 
        cy.wait(1000);    
    });        

    it('Denuncia --> Ricerca cliente per numero di polizza: ' + cliente_num_pol, function () {
        // Ricerca cliente per Polizza
        DenunciaSinistriPage.setValue_ById('#CLIENTE_polizza', cliente_num_pol);
        Common.clickFindByIdOnIframeChild(IFrameParent, '#eseguiRicerca');
        cy.wait(1000);
        cy.screenshot('Pagina Ricerca cliente -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Dati cliente (ai fini della gestione del sinistro): inserimento dati obbligatori di denuncia: ' +
        'data avvenimento, data denuncia, data pervenimento ?? localit?? dell\'avvenuto sinistro',
        function () {
            DenunciaSinistriPage.getPlusMinusDate(-2).then((dtAvv) => {
                dtAvvenimento = dtAvv
                cy.log('[it]>> [Data avvenimento sinistro]: ' + dtAvvenimento);
                DenunciaSinistriPage.setValue_ById('#CLIENTE_dataAvvenimentoRisultato', dtAvvenimento)
            });
            cy.wait(1000);
            DenunciaSinistriPage.getPlusMinusDate(-2).then((dtDen) => {
                dtDenuncia = dtDen
                cy.log('[it]>> [Data denuncia sinistro]: ' + dtDenuncia);
                DenunciaSinistriPage.setValue_ById('#CLIENTE_dataDenuncia', dtDenuncia)
            });
            cy.wait(1000);
            DenunciaSinistriPage.getPlusMinusDate(-1).then((dtPer) => {
                cy.log('[it]>> [Data pervenimento sinistro]: ' + dtPer);
                DenunciaSinistriPage.setValue_ById('#CLIENTE_dataPervenimento', dtPer)
            });
            cy.wait(1000);
            cy.screenshot('Pagina Dati denuncia - date del sinistro ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.wait(1000); 
    });

    it('Dati cliente altri dati di denuncia: ' +
        'Descrizione della dinamica ?? localit?? dell\'avvenuto sinistro', function() {
        DenunciaSinistriPage.setValue_ById('#CLIENTE_descDinamica', sinistro_descrizione_danno)
        DenunciaSinistriPage.setValue_ById('#CLIENTE_localitaAvv', sinistro_localit??)
        Common.clickFindByIdOnIframeChild(IFrameParent, '#CmdRicercaLocalita2');
        cy.wait(2000)
        DenunciaSinistriPage.getPromiseValue_ByID('#CLIENTE_capAvv').then((sin_cap) => {                                
            cy.log('[it]>> [CAP]: '+sin_cap);
            DenunciaSinistriPage.isNotNullOrEmpty(sin_cap)
        });
        cy.screenshot('Pagina Dati denuncia - Localit?? ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);      
        Common.clickFindByIdOnIframeChild(IFrameParent, '#CmdAvanti');
        cy.wait(2000)
    });

    it('Sinistri potenzialmente doppi', function () {
        Cypress.on('fail', (err, runnable) => {
            cy.log(runnable);
            // returning false here prevents Cypress from
            // failing the test   
            return false
        })
    
        const isPresent = DenunciaSinistriPage.isVisibleText('Sinistri potenzialmente doppi')
        if (isPresent)
        {           
            let cssrdbtn = "#workarea2 > fieldset:nth-child(4) > table > tbody > tr:nth-child(2) > td > ul > li"
            DenunciaSinistriPage.clickOnRadio_ByIdAndText(cssrdbtn, 'Prosegui denuncia in corso');
            cy.wait(1000);
            Common.clickFindByIdOnIframeChild(IFrameParent, '#SINISTRI_DOPPI_continua');
            cy.wait(1000);    
        }
        cy.log('Pagina Sinistri potenzialmente doppi: ' +isPresent);          
    });

/*
    it('Dettaglio di polizza: visualizzazione e selezione', function () {     
        // Nel caso la polizza sia in periodo di mora si attiva la
         //pagina di dettaglio polizza
        cy.screenshot('Pagina Dettaglio di polizza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);      
        DenunciaSinistriPage.clickObj_ByLabel('a','Avanti')  
        cy.wait(1000);  
    });
*/
  

    it('Elenco coperture - Prodotto Auto. Selezione della garanzia: '+copertura_danno, function () {              
        Common.clickFindByIdOnIframeChild(IFrameParent, '#CmdRicercaLocalita');       
        // Selezione della copertura
        DenunciaSinistriPage.clickObj_ByLabel('td', copertura_danno)

        DenunciaSinistriPage.getIdInListValues_ById('#GARANZIE_listaGaranzie > table > tbody > tr ', copertura_danno).then((idx) => {  
            idx_cop_gar = ""+idx+""
            cy.log('[it]>> indice copertura garanzia: '+idx_cop_gar);  
            if (idx !== undefined) {                
                DenunciaSinistriPage.clickOnCheck_ByIdAndAttr('.SelectedCheckBox', 'myindex', idx_cop_gar);
            }
        });
         //Evento naturale: Grandine
        DenunciaSinistriPage.clickSelect_ById('#GARANZIE_flgGrandine', "Si")
        cy.wait(1000);
        cy.screenshot('Elenco coperture - Selezione della garanzia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);        
        DenunciaSinistriPage.clickObj_ByLabel('a','Avanti')   
        cy.wait(3000);  
    });

    it('Verifica dei dati dei soggetti coinvolti nella lista riproposta in tabella ', function () {        
        Common.getObjByTextOnIframeChild(IFrameParent, 'Contraente');       
        Common.getObjByTextOnIframeChild(IFrameParent, cliente_cognome + " " +cliente_nome)       
        Common.getObjByTextOnIframeChild(IFrameParent, cliente_targa)
        cy.screenshot('Soggetti coinvolti nel sinistro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);
        Common.clickFindByIdOnIframeChild(IFrameParent, '#avantiListaDanni')    
        cy.wait(4000)            
    });

    it('Riepilogo denuncia - verifica dati danneggiato ', function () {
       // il danneggiato
       Common.getObjByTextOnIframeChild(IFrameParent, 'Veicolo');
       Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#PRECOMMIT_listaDanneggiatiBUFF', cliente_cognome + " " + cliente_nome)   
       Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#PRECOMMIT_listaDanneggiatiBUFF', cliente_targa);
       Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#PRECOMMIT_listaDanneggiatiBUFF', tipo_danno);        
    });

    it('Riepilogo denuncia - verifica dati di denuncia ', function () {
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_dataAvvenimento', dtAvvenimento);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_dataDenuncia', dtDenuncia);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#CLIENTE_LOCALITA', sinistro_localit??);       
    });

    it('Riepilogo denuncia - verifica dati di contraenza polizza ', function () {
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_numeroPolizza', cliente_num_pol);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_targa', cliente_targa);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_datiAnagrafici', cliente_cognome);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_datiAnagrafici', cliente_nome);       
    });

    it('Riepilogo denuncia - salvataggio e chiusura di denuncia ', function () {
        
        Common.clickFindByIdOnIframeChild(IFrameParent, '#CmdSalva');
        cy.wait(3000)  
        DenunciaSinistriPage.clickObjPopUpChiudi_ByLabel('a','Chiudi')
        cy.wait(1000); 
        cy.screenshot('Riepilogo dati di denuncia - Salvataggio e chiusura', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000); 
    });

    it('Riepilogo - Verifica dati di sinistro', function () {
        
        const cssNumSin = "#PRECOMMIT_listaDanneggiatiBUFF > table > tbody > tr > td:nth-child(1)"
        DenunciaSinistriPage.getPromiseText_ById(cssNumSin).then((numsin) => {                 
            cy.log('[it]>> numero di sinistro: ' + numsin)
            numsin = numsin.substring(0,9)
            DenunciaSinistriPage.isNotNullOrEmpty(numsin)                 
            Common.isValidCheck(/^-?(0|[1-9]\d*)$/, numsin, 'is valid number')
        });

        // il danneggiato 
        Common.getObjByTextOnIframeChild(IFrameParent, 'Veicolo');
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#PRECOMMIT_listaDanneggiatiBUFF', cliente_cognome + " " + cliente_nome);

        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#PRECOMMIT_listaDanneggiatiBUFF', cliente_targa);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#PRECOMMIT_listaDanneggiatiBUFF', tipo_danno);        
        // Dati di denuncia
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_dataAvvenimento', dtAvvenimento);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_dataDenuncia', dtDenuncia);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#CLIENTE_LOCALITA', sinistro_localit??);

         // dati di contraenza
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_numeroPolizza', cliente_num_pol);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_targa', cliente_targa);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_datiAnagrafici', cliente_cognome);
        Common.getObjByIdAndTextOnIframeChild(IFrameParent, '#RIEPILOGO_datiAnagrafici', cliente_nome);
    });
    /*
    it('Ricerca della carrozzeria amica con geolocalizzazione Google', function () {
        DenunciaSinistriPage.clickObj_ByLabel('a', 'Altre carroz.')
        //DenunciaSinistriPage.clickBtnByJs('document.getElementById("CmdRicercaLocalita").click()')
        //Common.clickFindByIdOnIframeChild(IFrameParent, '#CmdRicercaLocalita')
        cy.wait(3000);
        
        DenunciaSinistriPage.setValueOnGeo_ById("#indirizzo1", "Trieste")
        DenunciaSinistriPage.clickSelectOnGeo_ById("#CM", "Tutti");
        DenunciaSinistriPage.clickObjGeo_ByTagAndLabel('button', ' ??? Cerca')
        cy.wait(2000)
        //cy.get('section.ModalSection__StyledModalSection-sc-1ayrdn8-0 button').contains('Accept').click({force: true})

    });

    it('Selezione della carrozzeria amica con geolocalizzazione Google', function () {
        //DenunciaSinistriPage.clickObjGeo_ByLabel('SOL-CAR MIANI')
        cy.wait(5000)
        DenunciaSinistriPage.clickObjGeoModal_ByIDAndLabel('a', 'Seleziona', 'SOL-CAR MIANI')
    
        cy.on("window:confirm", (str) => {               
            expect(str).to.include(carrozzeria);
        });
        cy.on('window:confirm', () => true);
        
        cy.wait(2000)
    });
    */
    
});