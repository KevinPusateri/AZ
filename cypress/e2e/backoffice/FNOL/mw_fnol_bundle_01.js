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
var cliente_cognome = 'ROBBA'
var cliente_nome = 'MARIA CONCETTA'
var cliente_CF = 'RBBMCN51H50F795Q'
var cliente_dt_nascita = '10/06/1951'
var cliente_num_pol = '733322489'
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
var ambito_garanzia_fabbricato = 'Persona'
var classe_garanzia_prodotto = 'Fabbricato - Incendio, Eventi atmosferici, Allagamento'
var loss_type = 'EVENTI ATMOSFERICI'
var loss_cause = 'PIOGGIA'
var oggetto_fabbricato

var sinistro_descrizione_danno = 'Emissione denuncia BMP con test automatizzato - Polizza Bundle Ultra Casa & Patrimonio.'
var sinistro_località = 'TRIESTE'
var sinistro_indirizzo = 'COPODISTRIA'
var sinistro_civico = '3'
var sinistro_ZipCode ='34145'

let dtAvvenimento
let dtPervenimento
let dtDenuncia


let cssIdxCmbSelector = 'div.nx-dropdown-results__option-label > span';
let cssCmbFrstElement = 'div.nx-dropdown__panel-body[role=\"listbox\"] > nx-dropdown-item:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)'
let btn_class= "nx-button__content-wrapper";
//#endregion

describe('Matrix Web - Sinistri>>Denuncia BMP in Matrix Web: Test di verifica denuncia Bundle Contract con accesso per  cliente ('+cliente_cognome+' ' +cliente_nome+') e ambito. ', () => {

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
        cy.screenshot('Bndl-01- Pagina Ricerca cliente - Inserimento cliente e testo a comparsa', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        Common.isVisibleText(csstxtClnt, cliente_cognome + " " + cliente_nome); 
        Common.isVisibleText(csstxtClnt, cliente_dt_nascita);

        Common.clickByIdOnIframe(csstxtClnt)
        cy.wait(2000);
        cy.screenshot('Bndl-02- Pagina Ricerca cliente -  Esito ricerca cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
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

        let csslblPolizza = '#fnol-customer-details-ext > div > div > div > dl > div:nth-child(7) > dd';
        Common.isVisibleText(csslblPolizza, cliente_num_pol);
        cy.wait(1000);

        cy.screenshot('Bndl-03- Controllo anagrafico dati del cliente ' + cliente_cognome + " " + cliente_nome, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
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
        cy.screenshot('Bndl-04- Pagina Dati denuncia - inserimento date di avvenimento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(5000);

        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtPer) => {         
            dtPervenimento = dtPer 
            cy.log('[it]>> [Data pervenimento sinistro]: '+dtPer);           
            DenunciaBMP.setValue_ById('input[name=\"undefined\"]', dtPer);
        });
        cy.screenshot('Bndl-05- Pagina Dati denuncia - inserimento date di pervenimento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);

        
        DenunciaSinistriPage.getPlusMinusDate(-1).then((dtDen) => {
            dtDenuncia = dtDen
            cy.log('[it]>> [Data denuncia sinistro]: '+dtDenuncia);           
            DenunciaBMP.setValue_ById('input[formcontrolname=\"answer\"]', dtDenuncia);
        });
        cy.screenshot('Bndl-06- Pagina Dati denuncia - inserimento data di denuncia', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Polizza interessata\' --> Selezione della polizza', function () {
        let cssRdnBtn =  '#fnol-affected-policy-list > table > tbody >tr:nth-child(1) > td > nx-radio.nx-radio-button--big-label > input.nx-radio__input';
        Common.clickFindByIdOnIframe(cssRdnBtn);
        cy.wait(500);

        cy.screenshot('Bndl-07- Pagina Dati denuncia - Dettaglio sulla Polizza interessata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Informazioni sul sinistro\' --> [Inserimento dati di sinistro]: ambito/soggetto coinvolto, etc..', function () {
        //Informazioni sul sinistro
        //Selezione di quale ambito è coinvolto? *     
        let cssClssPrd =  'nx-dropdown[formcontrolname="selectedAffectedType"] > div ';
        Common.clickFindByIdOnIframe(cssClssPrd);
        cy.wait(500); // 
        Common.clickFindByIdOnIframe(cssCmbFrstElement);
        //Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, ambito_garanzia_fabbricato);
        cy.wait(2000);

        //Selezione di quale soggetto / oggetto è coinvolto?
        let cssAffctdObj = 'nx-dropdown[formcontrolname="selectedAffectedObject"] > div ';
        Common.clickFindByIdOnIframe(cssAffctdObj);
        cy.wait(500) 
        Common.clickFindByIdOnIframe(cssCmbFrstElement);
        cy.wait(1000)

        cy.screenshot('Bndl-08- Pagina Dati denuncia - Polizza selezionata', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);

        //Selezione della classe di prodotto
        let cssClsPrd = 'nx-dropdown[formcontrolname="selectedClaimClass"] > div';
        Common.clickFindByIdOnIframe(cssClsPrd)
        cy.wait(500);
        Common.clickFindByIdOnIframe(cssCmbFrstElement);
        //Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector, classe_garanzia_prodotto);
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
        DenunciaBMP.setValue_ById(cssDescrClm, sinistro_descrizione_danno);
        cy.wait(1000)

        cy.screenshot('Bndl-09- Pagina Dati denuncia - Altri dati del sinistro: loss type, loss cause e descrizione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true });
        cy.wait(1000);
    });

    it('Denuncia BMP --> Dettaglio del sinistro --> Sezione \'Luogo del sinistro\' - Verifica inserimento dati: '+ sinistro_località +", VIA "+sinistro_indirizzo+" "+sinistro_civico+ " ...", function () {

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
        Common.clickByAttrAndLblOnIframe(cssIdxCmbSelector,  'Trieste');
        cy.wait(1000)

        cy.screenshot('Bndl-10- Pagina Dati denuncia - Sezione Luogo sinistro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000); 

        DenunciaBMP.clickBtn_ByClassAndText(btn_class, 'Avanti');
    });
    


    it('Denuncia BMP --> Dettaglio del danno --> Danni alla proprieta\' del cliente', function () {
        // Scegliere un'opzione
        let cssSlctPrt = 'div[cdkoverlayorigin] > div.nx-dropdown__rendered  > span.ng-star-inserted';
        Common.clickFindByIdOnIframe(cssSlctPrt);
        //Contenuto nei locali - Arredamento e Vestiario
        Common.clickFindByIdOnIframe(cssCmbFrstElement);
        cy.wait(1000)

        // Marca - Modello
        DenunciaBMP.setValue_ById('input[formcontrolname="brand"]', 'Ikea - libreria');
        //Anno di acquisto
        DenunciaBMP.setValue_ById('input[ name="yearOfPurchase"]', '2020');

        cy.screenshot('Bndl-11- Dettaglio del danno ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);

        // Avvocato del cliente (Si/No)
        let cssBtnNoLawayer = 'nx-circle-toggle-group[data-testid="circleToggleOptions"] > div > div:nth-child(2) > nx-circle-toggle > label.nx-circle-toggle__label > nx-icon-toggle-button';
        Common.clickFindByIdOnIframe(cssBtnNoLawayer);
        cy.wait(1000);

        cy.screenshot('Bndl-12- Dettaglio del danno - Avvocato del cliente (Si o No): No', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')

        cy.wait(1000);
        cy.screenshot('Bndl-13- Dettaglio del danno - Danni per il cliente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Denuncia BMP --> Dettaglio del danno -- Danno per il cliente ' , { scrollBehavior: false }, function () {
        // Altre parti Coinvolte
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')

        //Erano presenti le autorità sul luogo del sinistro?
        cy.wait(1000);
        cy.screenshot('Bndl-14- Dettaglio del danno - Altre parti coinvolte - autorità sul luogo del sinistro?', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);
        DenunciaBMP.clickBtn_ByClassAndText(btn_class,'Avanti')
    });

    it('Denuncia BMP --> Sommario -- Riepilogo sinistro  ', function () {
        // Altre parti Coinvolte
        cy.wait(1000);
        cy.screenshot('Bndl-15- Sommario - Riepilogo sinistro -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);
    });

    it('Denuncia BMP --> Sommario -- Riepilogo sinistro - Note legali - ',  function () {
         //  Il cliente conferma che le informazioni fornite sono corrette
         let cssChkConferma = 'nx-checkbox[formcontrolname="legalConsent"] > input.nx-checkbox__input';
        Common.clickFindByIdOnIframe(cssChkConferma);
        cy.wait(500);
        Common.getObjByIdOnIframe(cssChkConferma).trigger('keydown', { keyCode: 17 }, {force: true}) 
        cy.wait(1000)
        /*
        let cssChkAccetta = 'nx-checkbox[formcontrolname="waiveDocumentationConsent"] > input.nx-checkbox__input';
        Common.clickFindByIdOnIframe(cssChkAccetta);
        cy.wait(500);
        */
        cy.screenshot('Bndl-16- Sommario - Riepilogo sinistro - Note legali -', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000)

        let cssBtnInviaRichiesta = '#fnol-submit-claim-ext > div > div.wrap-submit-btn.ng-star-inserted > bc-fnol-submit-claim-button > button > span';
        Common.clickFindByIdOnIframe(cssBtnInviaRichiesta)
        cy.wait(3000)

        cy.screenshot('Bndl-17- Sommario - Riepilogo sinistro - Invia Richiesta', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(5000);
    });

    it('Denuncia BMP --> Protocollazione Sinistro -', function () {
        let cssTxtWthSccss = '#fnol-expert-claim-confirmation-ext > div:nth-child(2) > h3';
        Common.isVisibleText(cssTxtWthSccss, 'La conferma del sinistro è stata inviata.');
        cy.wait(1000);

        Common.getObjByIdOnIframe(cssTxtWthSccss).trigger('keyup', { keyCode: 17 }, {force: true}) 
        cy.wait(500)

        cy.screenshot('18- Sommario - Riepilogo sinistro - conferma del sinistro ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(3000);
    });
});