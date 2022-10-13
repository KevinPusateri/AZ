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
import DenunciaBMP from "../../../mw_page_objects/backoffice/DenunciaBMPPage"
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
var cliente_cognome = 'RAI'
var cliente_nome = 'GUIDO'
var cliente_CF = 'RAIGDU65B09L424C'
var cliente_dt_nascita = '09/02/1965'
var cliente_num_pol = '733323007'
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
var ambito_garanzia_fabbricato = 'Fabbricato'
var classe_garanzia_prodotto = 'Fabbricato - Incendio, Eventi atmosferici, Allagamento'
var loss_type = 'EVENTI ATMOSFERICI'
var loss_cause = 'PIOGGIA'
var oggetto_fabbricato

var sinistro_descrizione_danno = 'Emissione denuncia BMP con test automatizzato - Polizza Hybrid Ultra Casa & Patrimonio.'
var sinistro_località = 'TRIESTE'
var sinistro_indirizzo = 'LUCREZIO'
var sinistro_civico = '7'
var sinistro_ZipCode ='34134'

let dtAvvenimento
let dtPervenimento
let dtDenuncia


let cssIdxCmbSelector = 'div.nx-dropdown-results__option-label > span';
let cssCmbFrstElement = 'div.nx-dropdown__panel-body[role=\"listbox\"] > nx-dropdown-item:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)'
let btn_class= "nx-button__content-wrapper";
//#endregion

describe('Matrix Web - Sinistri>>Denuncia BMP in Matrix Web: Test di verifica denuncia Hybrid con accesso per cliente ('+cliente_cognome+' ' +cliente_nome+') e ambito \'Fabbricato\'', () => {

    it('Atterraggio su BackOffice >> Denuncia BMP', function () {
        TopBar.clickBackOffice()
        cy.wait(1000);
        BackOffice.clickCardLink('Denuncia BMP') 
        cy.wait(1000);
    });        

    it('Denuncia BMP --> Ricerca Cognome Nome cliente: ' + cliente_cognome + " " + cliente_nome, function () {
        // Ricerca cliente per Polizza
        DenunciaBMP.setValue_ById('#keyword', cliente_cognome + " " + cliente_nome);

        Common.clickByIdOnIframe("[name='search']");
        cy.wait(3000);
    
        let csstxtClnt = '.nx-autocomplete-option__label > span';
        // Verifica del testo a comparsa nella ricerca del cliente 
        cy.screenshot('01- Pagina Ricerca cliente - Inserimento cliente e testo a comparsa', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        Common.isVisibleText(csstxtClnt, cliente_cognome + " " + cliente_nome); 
        Common.isVisibleText(csstxtClnt, cliente_dt_nascita);

        Common.clickByIdOnIframe(csstxtClnt)
        cy.wait(2000);
        cy.screenshot('02- Pagina Ricerca cliente -  Esito ricerca cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
    });

    it('Denuncia BMP --> Dettaglio Cliente ' + cliente_cognome + " " + cliente_nome + " e controllo dati anagrafici", function () {
        // Controllo valorizzazione informazioni di dettaglio del cliente
        let csslblName = '#fnol-customer-details-ext > div > div > div > dl > div:nth-child(1) > dd'
        Common.isVisibleText(csslblName, cliente_cognome);
        Common.isVisibleText(csslblName, cliente_nome); 

        let csslblDtNsct = '#fnol-customer-details-ext > div > div > div > dl > div:nth-child(3) > dd';
        Common.isVisibleText(csslblDtNsct, cliente_dt_nascita);

        let csslblEmail = '#fnol-customer-details-ext > div > div > div > dl > div:nth-child(6) > dd';
        Common.isVisibleText(csslblEmail, cliente_email);
        cy.wait(1000);

        cy.screenshot('03- Controllo anagrafico dati del cliente ' + cliente_cognome + " " + cliente_nome, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);

        DenunciaBMP.clickBtn_ByClassAndText(btn_class, 'Avanti');

    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Date correlate\' [Inserimento date di sinistro]', function () {
        //Date correlate
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtAvv) => {
            dtAvvenimento = dtAvv;
            cy.log('[it]>> [Data avvenimento del sinistro]: ' + dtAvvenimento);
            DenunciaBMP.setValue_ById('input[name=\"dateOfIncident\"]', dtAvvenimento);
        }); 
        cy.wait(1000);   
        cy.screenshot('04- Pagina Dati denuncia - inserimento date di avvenimento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(5000);

        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtPer) => {         
            dtPervenimento = dtPer 
            cy.log('[it]>> [Data pervenimento sinistro]: '+dtPer);           
            DenunciaBMP.setValue_ById('input[name=\"undefined\"]', dtPer);
        });
        cy.screenshot('05- Pagina Dati denuncia - inserimento date di pervenimento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);

        
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtDen) => {
            dtDenuncia = dtDen
            cy.log('[it]>> [Data denuncia sinistro]: '+dtDenuncia);           
            DenunciaBMP.setValue_ById('input[formcontrolname=\"answer\"]', dtDenuncia);
        });
        cy.screenshot('06- Pagina Dati denuncia - inserimento data di denuncia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Polizza interessata\' --> Selezione della polizza', function () {
        //Apertura accordion nella sezione Polizza interessata
        let cssAccrdn = '#fnol-affected-policy-list > nx-expansion-panel > nx-expansion-panel-header > div';
        Common.clickFindByIdOnIframe(cssAccrdn);

        let cssRdnBtn =  '#nx-radio-0-label > div.nx-radio__circle';
        Common.clickFindByIdOnIframe(cssRdnBtn);
        cy.wait(500);

        cy.screenshot('07- Pagina Dati denuncia - Dettaglio sulla Polizza interessata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Informazioni sul sinistro\' --> [Inserimento dati di sinistro]: ambito/soggetto coinvolto, etc..', function () {
        //Informazioni sul sinistro
        //Selezione di quale ambito è coinvolto? *     
        let cssClssPrd =  '#fnol-nmt-incident-info > div > form > div:nth-child(1) > div:nth-child(1) > nx-formfield > div > div.nx-formfield__row > div.nx-formfield__flexfield > div > div > nx-dropdown > div > div.nx-dropdown__icon > nx-icon';
        Common.clickFindByIdOnIframe(cssClssPrd);
        cy.wait(500); 
        Common.clickFindByIdOnIframe(cssCmbFrstElement);

        cy.wait(2000);

        //Selezione di quale soggetto / oggetto è coinvolto?
        let cssAffctdObj = 'nx-dropdown[formcontrolname="selectedAffectedObject"] > div ';
        Common.clickFindByIdOnIframe(cssAffctdObj);
        cy.wait(500) 
        Common.clickFindByIdOnIframe(cssCmbFrstElement);
        //Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, ambito_garanzia_fabbricato);
        cy.wait(1000)

        cy.screenshot('08- Pagina Dati denuncia - Polizza selezionata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);

        //Selezione della classe di prodotto
        let cssClsPrd = 'nx-dropdown[formcontrolname="selectedClaimClass"] > div';
        Common.clickFindByIdOnIframe(cssClsPrd)
        cy.wait(500);
        //Common.clickFindByIdOnIframe(cssCmbFrstElement);
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, classe_garanzia_prodotto);
        cy.wait(1000)
    
        //Selezione della loss type   
        let cssLssTyp = 'nx-dropdown[formcontrolname="selectedLossType"] > div ';
        Common.clickFindByIdOnIframe(cssLssTyp);
        cy.wait(500) 
        Common.clickFindByIdOnIframe(cssCmbFrstElement);
        //Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, loss_type);
        cy.wait(1000)

        //Selezione della loss cause   
        let cssLssCs = 'nx-dropdown[formcontrolname="selectedLossCause"] > div ';
        Common.clickFindByIdOnIframe(cssLssCs);
        cy.wait(500) 
        Common.clickFindByIdOnIframe(cssCmbFrstElement);
        //Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, loss_cause);
        cy.wait(1000)

        //Descrizione del sinistro
        let cssDescrClm = 'textarea[formcontrolname="description"]'
        DenunciaBMP.setValue_ById(cssDescrClm, sinistro_descrizione_danno + " - Ambito: "+ambito_garanzia_fabbricato + " - Classe: "+classe_garanzia_prodotto);
        cy.wait(1000)-

        cy.screenshot('09- Pagina Dati denuncia - Altri dati del sinistro: loss type, loss cause e descrizione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);

        DenunciaBMP.clickBtn_ByClassAndText(btn_class, 'Avanti');
    });


    it('Denuncia BMP --> Dettaglio del danno --> Danni alla proprietà del cliente', function () {
        
        let cssRdBtn1PrtNo ='#nx-radio-13-label > div:nth-child(1)'
        Common.clickFindByIdOnIframe(cssRdBtn1PrtNo);
        cy.wait(500)
        let cssRdBtn2PrtNo ='#nx-radio-16-label > div'
        Common.clickFindByIdOnIframe(cssRdBtn2PrtNo);
        cy.wait(500)

        let cssTxtPrcs ='input[formcontrolname=\"costOfReinstatement\"]'
        DenunciaBMP.setValue_ById(cssTxtPrcs, '2000');
        cy.wait(2000)
        
        // Avvocato del cliente (Si/No)
        let cssBtnNoLawayer = 'nx-circle-toggle-group[data-testid="circleToggleOptions"] > div > div:nth-child(2) > nx-circle-toggle > label.nx-circle-toggle__label > nx-icon-toggle-button';
        Common.clickFindByIdOnIframe(cssBtnNoLawayer);
        cy.wait(2000);

        cy.screenshot('10- Dettaglio del danno - Avvocato del cliente (Si o No): No', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);

        // Scegliere un'opzione del danno () Parte o parti interessate dell'edificio)
        let cssSlctPrt = 'nx-dropdown[placeholder="Scegliere un\'opzione"] > div.nx-dropdown__container > div.nx-dropdown__icon > nx-icon';
        Common.clickFindByIdOnIframe(cssSlctPrt);
        let cssFrstElem ='#nx-checkbox-0-label > span'
        Common.clickFindByIdOnIframe(cssFrstElem);
        cy.wait(2000)
        
        cy.screenshot('11- Dettaglio del danno - Opzione del danno ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);

        DenunciaBMP.clickBtn_ByClassAndText(btn_class, 'Avanti');
        cy.wait(1000);

        cy.screenshot('12- Dettaglio del danno - Danni alla proprietà del cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(3000);
    });

    it('Denuncia BMP --> Dettaglio del danno --> Danno per il cliente ', function () {
        // Altre parti Coinvolte
        Common.getObjByIdOnIframe('div.action-buttons-div > nx-link > a > nx-icon').trigger('keyup', { keyCode: 17 }, {force: true}) 
        cy.wait(500)

        cy.screenshot('13- Dettaglio del danno - Danni per il cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(3000);

        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')

        //Erano presenti le autorità sul luogo del sinistro?
        cy.screenshot('14- Dettaglio del danno - Altre parti coinvolte - Autorità sul luogo del sinistro?', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(500)
        
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')
        cy.wait(1000);        
    });

    it('Denuncia BMP --> Sommario --> Riepilogo sinistro  ', function () {
        // Altre parti Coinvolte
        cy.screenshot('15- Sommario - Riepilogo sinistro - Apertura Pagina', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);
    });

    it('Denuncia BMP --> Sommario --> Riepilogo sinistro - Note legali - ', function () {
       // Verifica funzionalità accordion
        let cssAccordion_Carica_documentazione = 'bc-summary-panel[title="Carica documentazione aggiuntiva"]> nx-expansion-panel > nx-expansion-panel-header > div';
        Common.clickFindByIdOnIframe(cssAccordion_Carica_documentazione);
        cy.wait(500);
        let cssAccordion_Dettaglio_danno = 'bc-summary-panel[title="Dettaglio del danno"]> nx-expansion-panel > nx-expansion-panel-header > div';
        Common.clickFindByIdOnIframe(cssAccordion_Dettaglio_danno);
        cy.wait(500);

        Common.getObjByIdOnIframe(cssAccordion_Carica_documentazione).trigger('keyup', { keyCode: 17 }, {force: true}) 
        cy.wait(500)
        /*
        let cssAccordion_Polizza_interessata  = 'bc-summary-panel[title="Polizza interessata e dettaglio sinistro"]> nx-expansion-panel > nx-expansion-panel-header > div';
        Common.clickFindByIdOnIframe(cssAccordion_Polizza_interessata);
        cy.wait(500);
        let cssAccordion_Dettaglio_cliente = 'bc-summary-panel[title="Dettaglio cliente"]> nx-expansion-panel > nx-expansion-panel-header > div';
        Common.clickFindByIdOnIframe(cssAccordion_Dettaglio_cliente);
        cy.wait(500);
        */
        //  Il cliente conferma che le informazioni fornite sono corrette
        let cssChkConferma = 'nx-checkbox[formcontrolname="legalConsent"] > input.nx-checkbox__input';
        Common.clickFindByIdOnIframe(cssChkConferma);

        /*
        let cssChkAccetta = 'nx-checkbox[formcontrolname="waiveDocumentationConsent"] > input.nx-checkbox__input';
        Common.clickFindByIdOnIframe(cssChkAccetta);
        cy.wait(500);

        */
        cy.screenshot('16- Sommario - Riepilogo sinistro - Note legali -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);

        let cssBtnInviaRichiesta = '#fnol-submit-claim-ext > div > div.wrap-submit-btn.ng-star-inserted > bc-fnol-submit-claim-button > button > span';
        Common.clickFindByIdOnIframe(cssBtnInviaRichiesta)
        cy.wait(1000)

        cy.screenshot('17- Sommario - Riepilogo sinistro - Invia Richiesta', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(5000);
    });

    it('Denuncia BMP -->  Protocollazione Sinistro - Conferma del sinistro  ', function () {
        let cssTxtWthSccss = '#fnol-expert-claim-confirmation-ext > div:nth-child(2) > h3';
        Common.isVisibleText(cssTxtWthSccss, 'La conferma del sinistro è stata inviata.');
        cy.wait(1000);

        Common.getObjByIdOnIframe(cssTxtWthSccss).trigger('keyup', { keyCode: 17 }, {force: true}) 
        cy.wait(1000);

        cy.screenshot('18- Sommario - Riepilogo sinistro - conferma del sinistro ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(10000);
    });
});