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

//#region Script Header Variables
let dscr_titlePage = 'Sinistri Canalizzati'
let dscr_lblCmpgn = 'Compagnia selezionata:' 
let dscr_Cmpgn = 'Allianz'
let dscr_lblDtAggrnmnt = 'Dati Aggiornati'
let dscr_lblGlssr = 'Glossario'
let dscr_lblFnt = 'Seleziona Fonti'
let dscr_lblPrd = 'Seleziona Periodo'
let dscr_btnFltr = "Filtra"
let dscr_btn_ClsFltr = 'Chiudi filtri'
//#endregion

//#region Script Body Variables
let dscr_titleBdyPg = "CANALIZZATI vs CANALIZZABILI"
let dscr_tb_Sinistri = "SINISTRI"
let dscr_fltr_tmp = "Filtro temporale giornaliero"
let dscr_xprt_tbl = "ESPORTA TABELLE"

//#endregion

describe('Matrix Web - Sinistri>>Consulatazione: Test di verifica dei sinistri canalizzati', () => {

    it('Atterraggio su BackOffice >> Sinistri canalizzati', function () {             
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sinistri canalizzati') 
        cy.wait(1000)        
    });

    it('Sinistri canalizzati: verifica strutturale degli elementi dello header di pagina', function () {              
        const clssTtl = ".breadCrumbs_ActPos"
        // Verifica presenza titolo di pagina
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssTtl, dscr_titlePage)
        //Verifica della label " Compagnia selezionata:"
        const clssLbl = ".lblTitle4"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssLbl, dscr_lblCmpgn)
        //Verifica presenza della Descrizione della compagnia
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssLbl, dscr_Cmpgn)
        //Verifica presenza della label di della data di aggiornamento
        const clssDtAggrnmnt = ".lblTitle4"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssLbl, dscr_lblDtAggrnmnt)
        //Verifica presenza della label "Seleziona Fonti"
        const clssSlznFnt = '.tdEtichettaMEFP' 
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssSlznFnt, dscr_lblFnt)
        //Verifica presenza della label "Seleziona Periodo"
        const clssSlznPrd = '.tdEtichettaMEFD' 
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssSlznPrd, dscr_lblPrd)
        //Verifica presenza della label posizionata in alto a destra riportante la descrizione: ' Glossario'
        const clssGlssr = '.btnDownloadPDF'
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssGlssr, dscr_lblGlssr)
        //Verifica della presenza del pulsante 'Filtra' 
        const clssBtnFltr = '.btnFiltra'
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssBtnFltr, dscr_btnFltr)
         //Verifica della presenza del pulsante 'Chiudi Filtri' 
        const clssBtnClsFltr = '.filter-close'
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(clssBtnClsFltr, dscr_btn_ClsFltr)
        //Verifica formale sulla data di aggiornamento
        const cssdtAggrmnt = "#dataRiferimentoInt"  
        ConsultazioneSinistriPage.getPromiseText_ById(cssdtAggrmnt).then((val) => {
            dtAggrmnt = val;  
            cy.log('[it]>> [Data aggiornamento]: '+dtAggrmnt);
            ConsultazioneSinistriPage.isNotNullOrEmpty(dtAggrmnt)
            Common.isValidCheck(/\d{2}[-.\/]\d{2}(?:[-.\/]\d{2}(\d{2})?)?/, dtAggrmnt, ' contain a valid date') 
        });       
    });
    
    it('Sinistri canalizzati verifica strutturale degli elementi del body di pagina', function () {

        // Verifica presenza titolo di pagina
        const cssLblBody = ".labelSchedaFonteIndicatori"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssLblBody, dscr_titleBdyPg)
        // Verifica della descrizione del tab Sinistri
        const cssTbSinistri = ".tabSelezionato"        
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssTbSinistri, dscr_tb_Sinistri)
        //Verifica descrizione sul filtro temporale presente in tabella 
        const cssFltrTmp = ".tdEtichettaMEFP"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssFltrTmp, dscr_fltr_tmp)
        //Verifica presenza descrizione esporta tabella in excel 
        const cssDcrExpTbl = "#example > div:nth-child(3) > a:nth-child(1)"
        ConsultazioneSinistriPage.checkObj_ByLocatorAndText(cssDcrExpTbl, dscr_xprt_tbl)
         //Verifica presenza immagine "Excel"
        const cssImgXls = "#example > div:nth-child(3) > a:nth-child(2) > img"  
        Common.isVisibleImg(cssImgXls, "excel.png")
        //Verifica presenza immagine "Euro"
        const cssImgEuro = "#imgEuro"
        Common.isVisibleImg(cssImgEuro, "Euro.gif")
        ConsultazioneSinistriPage.isVisibleText(cssImgEuro, "Importo")
        //Verifica presenza immagine "Pezzi"
        const cssImgPezzi = "#imgPezzi"
        Common.isVisibleImg(cssImgPezzi, "Pezzi.gif")
        ConsultazioneSinistriPage.isVisibleText("#dataAl", "Pezzo")
        //Verifica presenza immagine "Delta"
        const cssImgDelta = "#imgDelta"
        Common.isVisibleImg(cssImgDelta, "Delta.gif")
        ConsultazioneSinistriPage.isVisibleText("#dataAl", "Percentuale")
    });

    it('Sinistri canalizzati verifica dati di tabella in homepage', function () {

        
        
    });

});
