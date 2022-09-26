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
import DenunciaBMP from "../../../mw_page_objects/backoffice/DenunciaBMP"
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

// #region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced({
            //"agentId": "ARCZULIANELLO",
            //"agency": "010319000"
            "agentId": "MESSINACA.0742",
            "agency": "073742000"
            
        })    
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
const IFrameParent = '[class="iframe-content ng-star-inserted"]'
// AG 73 742000
var ramo_pol = '42'
var cliente_cognome = 'ROBBA'
var cliente_nome = 'MARIA CONCETTA'
var cliente_dt_nascita = '10/06/1951'
var cliente_num_pol = '733322477'
var cliente_targa = 'DS246AT'
var cliente_email ='pippo.pluto@allianz.it'

/* 319000
var ramo_pol = '42' //601 - BONUS/MALUS
var cliente_cognome = 'VERDE'
var cliente_nome = 'ALESSIO'
var cliente_CF = 'VRDLSS03S10D789M'
var cliente_dt_nascita = '10/11/2003'
var cliente_num_pol = '502257481'
var cliente_email = 'f.ninno@allianz.it'
*/
var prodotto = 'ULTRA CASA'
var classe_copertura = 'Fabbricato - Incendio, Eventi atmosferici, Allagamento'
var loss_type ='EVENTI ATMOSFERICI'
var sinistro_veicoli_coinvolti = '1'
var sinistro_descrizione_danno = 'Danneggiamento da grandine  (Test Automatizzato by michele.delledonne@allianz.it)'
var sinistro_località = 'GORIZIA'
var sinistro_indirizzo = 'ROMA'
var sinistro_civico = '1'
var sinistro_ZipCode ='34170'
var classe_rischio = 'Fabbricato - Incendio, Eventi atmosferici, Allagamento'

let dtAvvenimento
let dtDenuncia
let controparte_marca
let idx_cop_gar

let cssIdxCmbSelector = 'div.nx-dropdown-results__option-label > span';
//#endregion

describe('Matrix Web - Sinistri>>Denuncia BMP: Test di verifica denuncia FNOL in Matrix', () => {

    it('Atterraggio su BackOffice >> Denuncia BMP', function () {
        TopBar.clickBackOffice()
        cy.wait(1000);
        BackOffice.clickCardLink('Denuncia BMP') 
        cy.wait(1000);
    });        

    it('Denuncia BMP--> Ricerca Cognome Nome cliente: ' + cliente_cognome + " " + cliente_nome, function () {
        // Ricerca cliente per Polizza
        DenunciaBMP.setValue_ById('#keyword', cliente_cognome + " " + cliente_nome);

        Common.clickByIdOnIframe("[name='search']");
        cy.wait(2000);
    
        let csstxtClnt = '.nx-autocomplete-option__label > span';
        // Verifica del testo a comparsa nella ricerca del cliente 
        cy.screenshot('Pagina Ricerca cliente - Testo a comparsa', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        Common.isVisibleText(csstxtClnt, cliente_cognome + " " + cliente_nome); 
        Common.isVisibleText(csstxtClnt, cliente_dt_nascita);

        Common.clickByIdOnIframe(csstxtClnt)
        cy.wait(1000);
        cy.screenshot('Pagina Ricerca cliente -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
    });

    it('Denuncia BMP --> Dettaglio Cliente ' + cliente_cognome + " " + cliente_nome, function () {
        // Controllo valorizzazione informazioni di dettaglio del cliente
        let csslblName = '#fnol-customer-details-ext > div > div > div > dl > div:nth-child(1) > dd'
        Common.isVisibleText(csslblName, cliente_cognome);
        Common.isVisibleText(csslblName, cliente_nome); 

        let csslblDtNsct = '#fnol-customer-details-ext > div > div > div > dl > div:nth-child(3) > dd';
        Common.isVisibleText(csslblDtNsct, cliente_dt_nascita);

        let csslblEmail = '#fnol-customer-details-ext > div > div > div > dl > div:nth-child(6) > dd';
        Common.isVisibleText(csslblEmail, cliente_email);
        cy.wait(1000);
        cy.screenshot('Pagina Ricerca cliente -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });

        let classvalue = "input__icon nx-icon--s ndbx-icon nx-icon--search";
        let btn_class= "nx-button__content-wrapper";
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti');

        cy.screenshot('Denuncia BMP --> Dettaglio Cliente ' + cliente_cognome + " " + cliente_nome, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(3000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Date correlate\' [Inserimento date di sinistro]', function () {
        //Date correlate
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtAvv) => {
            dtAvvenimento = dtAvv;
            cy.log('[it]>> [Data avvenimento del sinistro]: ' + dtAvvenimento);
            DenunciaBMP.setValue_ById('input[name=\"dateOfIncident\"]', dtAvvenimento);
        });           
        
        cy.wait(1000);
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtPer) => {          
            cy.log('[it]>> [Data pervenimento sinistro]: '+dtPer);           
            DenunciaBMP.setValue_ById('input[name=\"undefined\"]', dtPer);
        });

        cy.wait(1000);
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtDen) => {
            dtDenuncia = dtDen
            cy.log('[it]>> [Data denuncia sinistro]: '+dtDenuncia);           
            DenunciaBMP.setValue_ById('input[formcontrolname=\"answer\"]', dtDenuncia);
        });

        cy.screenshot('Pagina Dati denuncia - date del sinistro ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Informazioni sul sinistro\' [Inserimento dati di sinistro]', function () {
        //Informazioni sul sinistro
        //Selezione della classe del prodotto       
        let cssClssPrd =  'nx-dropdown[formcontrolname="selectedClaimClass"] > div ';
        Common.clickFindByIdOnIframe(cssClssPrd);
        cy.wait(500);
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, classe_copertura);
        cy.wait(2000);

        //Selezione della loss type   
        let cssLssTyp = 'nx-dropdown[formcontrolname="selectedLossType"] > div ';
        Common.clickFindByIdOnIframe(cssLssTyp);
        cy.wait(500) 
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector,  ' Impact ');
        cy.wait(1000)

        //Selezione della loss cause
        let cssLssCs = 'nx-dropdown[formcontrolname="selectedLossCause"] > div';
        Common.clickFindByIdOnIframe(cssLssCs)
        cy.wait(500);
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, ' Falling object ');
        cy.wait(1000)

        //Descrizione del sinistro
        let cssDescrClm = 'textarea[formcontrolname="description"]'
        DenunciaBMP.setValue_ById(cssDescrClm, sinistro_descrizione_danno);
        cy.wait(1000)

        cy.screenshot('Pagina Dati denuncia - date del sinistro ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Luogo sinistro\'', function () {

        //Selezione Tipo do strada *
        let cssStrttTyp = 'nx-dropdown[placeholder="Scegliere il tipo di strada"] > div ';
        Common.clickFindByIdOnIframe(cssStrttTyp);
        cy.wait(500) 
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector,  ' VIA ');
        cy.wait(1000)

        //Luogo sinistro
        DenunciaBMP.setValue_ById('input[trackid=\"address-details-form-oe.street\"]', sinistro_indirizzo)  
        cy.wait(1000);
        DenunciaBMP.setValue_ById('input[trackid=\"address-details-form-oe.streetNumber\"]', sinistro_civico)  
        cy.wait(1000);
        DenunciaBMP.setValue_ById('input[trackid=\"address-details-form-oe.zipCode\"]', sinistro_ZipCode)  
        cy.wait(1000);
        DenunciaBMP.setValue_ById('input[trackid=\"address-details-form-oe.city\"]', sinistro_località)  
        cy.wait(1000);

        let cssNtnDscr = 'nx-dropdown[placeholder="Scegliere la nazione"] > div ';
        Common.clickFindByIdOnIframe(cssNtnDscr);
        cy.wait(500) 
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector,  ' ITALIA ');
        cy.wait(1000)

        let cssPvTyp = 'nx-dropdown[placeholder="Scegliere la provincia"] > div ';
        Common.clickFindByIdOnIframe(cssPvTyp);
        cy.wait(500) 
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector,  'Gorizia');
        cy.wait(1000)


        cy.screenshot('Pagina Dati denuncia - date del sinistro ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000); 
    });
    


/*
    it('Denuncia --> Ricerca per numero di polizza cliente: ' + cliente_num_pol, function () {
        // Ricerca cliente per Polizza
        DenunciaBMP.setValue_ById('#keyword', cliente_num_pol);
     
        Common.clickByIdOnIframe("[name='search']")
        cy.wait(2000)
      
        let classtxtClnt = '.nx-autocomplete-option__label > span'
        // Verifica del testo a comparsa nella ricerca del cliente 
        cy.screenshot('Pagina Ricerca cliente - Testo a comparsa', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        Common.isVisibleText(classtxtClnt, cliente_cognome + " " + cliente_nome)   
        Common.isVisibleText(classtxtClnt, cliente_dt_nascita)
       
        let classvalue = "input__icon nx-icon--s ndbx-icon nx-icon--search"
        let btn_class= "nx-button__content-wrapper"
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')

        
        cy.wait(1000);
        cy.screenshot('Pagina Ricerca cliente -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Denuncia --> Ricerca per codice fiscale cliente: ' + cliente_CF, function () {
        // Ricerca cliente per Polizza
        DenunciaBMP.setValue_ById('#keyword', cliente_CF);
        
        Common.clickByIdOnIframe("[name='search']")
        cy.wait(2000)

        let classtxtClnt = '.nx-autocomplete-option__label > span'
        // Verifica del testo a comparsa nella ricerca del cliente 
        cy.screenshot('Pagina Ricerca cliente - Testo a comparsa', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        Common.isVisibleText(classtxtClnt, cliente_cognome + " " + cliente_nome)   
        Common.isVisibleText(classtxtClnt, cliente_dt_nascita)

        let classvalue = "input__icon nx-icon--s ndbx-icon nx-icon--search"
        let btn_class= "nx-button__content-wrapper"
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')

        cy.wait(1000);
        cy.screenshot('Pagina Ricerca cliente -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });
    */
});