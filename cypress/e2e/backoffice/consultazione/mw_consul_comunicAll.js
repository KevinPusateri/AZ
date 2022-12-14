/**
 * @author Michele Delle Donne <michele.delledonne@allianz.it>
 *
 * @description Selezionando 'Sinistri/Consulatazione sinistri'
 *  Lo script esegue una sequenza di test sulla pagina Consultazione sinistri -->
 * Dettaglio del Sinistro  --> Accesso Al comunicAll
 */

/// <reference types="Cypress" />
import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import BackOffice from "../../../mw_page_objects/Navigation/BackOffice"
import ConsultazioneSinistriPage from "../../../mw_page_objects/backoffice/ConsultazioneSinistriPage"

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
let numsin = '929538074'
let stato_sin = 'CHIUSO PAGATO'
let dtAvvenimento 
let cliente
let categorieComunicazioni = ['Fiduciari', 'Stato Pratica', ' Info Pagamento', 'Storno Pagamento', 'Richiesta Info Generiche', 'Condizioni Di Polizza', 'Varie']
let spclTxtValue = '\\|!??$%&/()=\'???^??+??????-???????????@#-[*].'
//#endregion

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica sulla consultazione del comunicAll', () => {

    it('Atterraggio su BackOffice >> Consultazione sinistri', function () {             
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri') 
        cy.wait(1000);        
    });

    it('Consultazione Sinistri: Selezionare un sinistro in stato PAGATO/CHIUSO ', function () {              
        ConsultazioneSinistriPage.setValue_ById('#claim_number', numsin)
        let classvalue = "search_submit claim_number k-button"
        ConsultazioneSinistriPage.clickBtn_ByClassAndText(classvalue, 'Cerca')
        Common.getObjByTextOnIframe(stato_sin)
        ConsultazioneSinistriPage.printClaimDetailsValue()
        cy.screenshot('Pagina Consultazione sinistro - Ricerca del sinistro', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });
    
    it('Recupero e controllo preliminare della valorizzazione delle informazioni del cliente e della data avveninmento sinistro', function () {
        const cssCliente1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(2)"
        ConsultazioneSinistriPage.getPromiseText_ById(cssCliente1).then((val) => {
            cliente = val;         
            cy.log('[it]>> [Cliente]: '+cliente);
            ConsultazioneSinistriPage.isNotNullOrEmpty(cliente)
        }); 
    
        const cssdtAvv1 = "#results > div.k-grid-content > table > tbody > tr > td:nth-child(7)"  
        ConsultazioneSinistriPage.getPromiseText_ById(cssdtAvv1).then((val) => {
            dtAvvenimento = val;  
            cy.log('[it]>> [Data avvenimento]: '+dtAvvenimento);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dtAvvenimento)
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, dtAvvenimento, ' contain a valid date') 
        });       

        // Seleziona il sinistro
        const css_ico_arrow_right ="#results > div.k-grid-content > table > tbody > tr > td:nth-child(9) > a"
        Common.clickByIdOnIframe(css_ico_arrow_right)
        cy.wait(3000)
        cy.screenshot('Pagina Dettaglio sinistro - Atterraggio pagina', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Verifica presenza pulsante immagine \'Megafono\' associata al comunicAll e raggiungibilit?? pagina comunicAll', function () {

        // Verifica presenza immagine megafono
        const css_ico_mega = 'td.actions > ul > li.listen.off > a'
        Common.isVisibleTitleTag("a", "ComunicAll")       
        cy.screenshot('Pagina Dettaglio sinistro - Presenza icona megafono', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        // Seleziona il link del comunicAll ver
        ConsultazioneSinistriPage.InvokeRmvAttOnClick_ById(css_ico_mega, "https://portaleagenzie.pp.azi.allianz.it/dasinconfe/OpenFolder?counter=1")
        cy.wait(10000);
        cy.screenshot('Pagina Dettaglio sinistro - Atterraggio comunicAll', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Controllo struttura ad Albero pagina del comunicAll' , function () {

        const cssFldrDocumentiComuni =  '#Nodo_Sinistro_NodeText'
        Common.isVisibleTextOnIframeChild('#MAIN_IFRAME', cssFldrDocumentiComuni, "Documenti Comuni")

        const cssFldrIncarichi =  '#Nodo_1_inc > table > tbody > tr > td > span#Nodo_1_inc_NodeText'
        Common.isVisibleTextOnIframeChild('#MAIN_IFRAME', cssFldrIncarichi, "Incarichi")

        const cssFldrComunicAll =  '#Nodo_ComunicAll1_NodeText'
        Common.isVisibleTextOnIframeChild('#MAIN_IFRAME', cssFldrComunicAll, "ComunicAll")
        const cssNewTrattazione = "#Nodo_ComunicAll1_NodePlus"
        cy.screenshot('pagina comunicAll - Controllo struttura pagina ad albero', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(2000)
        Common.clickFindByIdOnIframeChild('#MAIN_IFRAME', cssNewTrattazione)
        cy.screenshot('Pagina comunicAll - Atterraggio pagina nuova comunicazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.wait(1000);
    });

    it('Controllo formale sulla struttura di pagina per una nuova comunicazione', function () {

        const cssLblCategoria =  '#lblCategoriaComunicAll'
        const cssLblOggetto =  '#lblOggettoComunicAll'
        const cssLblMessaggio =  '#lblMessaggio'
        const cssBtnAnnulla =  '#btnAnnullaComunicAll'
        const cssBtnInviaPratica =  '#btnInviaComunicAll'

        ConsultazioneSinistriPage.isVisibleTextOnIframeChild(Common.getIFrameChildByParent('#MAIN_IFRAME', 'iframe[frameborder="0"]'),  cssLblCategoria, "Categoria Pratica")
        ConsultazioneSinistriPage.isVisibleTextOnIframeChild(Common.getIFrameChildByParent('#MAIN_IFRAME', 'iframe[frameborder="0"]'),  cssLblOggetto, "Oggetto")
        ConsultazioneSinistriPage.isVisibleTextOnIframeChild(Common.getIFrameChildByParent('#MAIN_IFRAME', 'iframe[frameborder="0"]'),  cssLblMessaggio, "Messaggio")
        ConsultazioneSinistriPage.isVisibleTextOnIframeChild(Common.getIFrameChildByParent('#MAIN_IFRAME', 'iframe[frameborder="0"]'),  cssBtnAnnulla, "Annulla")
        ConsultazioneSinistriPage.isVisibleTextOnIframeChild(Common.getIFrameChildByParent('#MAIN_IFRAME', 'iframe[frameborder="0"]'),  cssBtnInviaPratica, "Invia Pratica")

        cy.wait(1000);
        cy.screenshot('Nuova Comunicazione --> Controllo formale sulla struttura della pagina', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    });

    it('Controllo delle categorie per nuova pratica di comunicazione comunicAll', function () {
    
        ConsultazioneSinistriPage.comunicAllCategoryCheck(categorieComunicazioni)
        cy.wait(1000);
        cy.screenshot('Nuova Comunicazione --> Controllo delle categorie presenti nell\'omonimo menu a tendina', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    })
    
    it('Controllo e utilizzo dei caratteri speciali nel testo dell\'oggetto della comunicazione comunicAll', function () {

        let obj = Common.getIFrameChildByParent('#MAIN_IFRAME', 'iframe[frameborder="0"]').find('#cmbCategoriaComunicAll', { timeout: 3000 }).should('exist')
        obj.scrollIntoView().select('Stato Pratica');

        ConsultazioneSinistriPage.comunicAllSpecialCharsCheck('#txtComunicAllObject', spclTxtValue)
        cy.screenshot('Pagina comunicAll - Utilizzo caratteri speciali in oggetto pratica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    })

    it('Controllo utilizzo dei caratteri speciali nell\'area di testo della comunicazione comunicAll,', function () {
    
        ConsultazioneSinistriPage.comunicAllSpecialCharsCheck('#txtComunicAllMessage', spclTxtValue) 
        cy.screenshot('Pagina comunicAll - Utilizzo caratteri speciali in area di testo pratica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })       
    })

    it('Controllo invio nuova comunicazione ', function () {
        const cssIdFrameChild ='#cmIFramePdf'
        const cssBtnInviaComunicazione =  '#btnInviaComunicAll'
        const cssTxtObjCmncton = "#foldCommDetail0R1C1_CELL_TEXT"
        const cssTxtMssg = '#foldCommDetail0R2C1_Div'

        let obj = Common.getIFrameChildByParent('#MAIN_IFRAME', 'iframe[frameborder="0"]')
        obj.find(cssBtnInviaComunicazione, { timeout: 3000 } ).should('exist').and('be.visible').click()
    
        Common.isVisibleTextOnIframeChild(cssIdFrameChild, cssTxtObjCmncton, "Inviato da: CONEGLIANO MARCA TREVI")
        Common.isVisibleTextOnIframeChild(cssIdFrameChild, cssTxtObjCmncton, "Categoria: Stato Pratica")
        Common.isVisibleTextOnIframeChild(cssIdFrameChild, cssTxtObjCmncton, spclTxtValue)
        Common.isVisibleTextOnIframeChild(cssIdFrameChild, cssTxtMssg, spclTxtValue) 

        cy.screenshot('Pagina comunicAll - Controllo invio nuova comunicazione ', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    })
});
