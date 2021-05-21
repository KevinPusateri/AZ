/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Disambiguazione from "../../mw_page_objects/common/Disambiguazione"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BackOffice from "../../mw_page_objects/Navigation/BackOffice"

//#region Variables
// const userName = 'TUTF021'
// const psw = 'P@ssw0rd!'

const userName = 'le00080'
const psw = 'Dragonball3'

//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const baseUrl = Cypress.env('baseUrl')
//#endregion


//#region Global Variables
const checkCardExistOnSinistri = (titlePage) => BackOffice.BackOffice.checkCardExistOnSinistri(titlePage)
const checkCardExistOnContabilita = (titlePage) => BackOffice.checkCardExistOnContabilita(titlePage)

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameMoveSinistri = () => {
    getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .iframe();

    let iframeFolder = getIFrame().find('iframe[src="/dasincruscotto/cruscotto/cruscotto.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameDenuncia = () => {
    getIFrame().find('iframe[src="cliente.jsp"]')
        .iframe();

    let iframeFolder = getIFrame().find('iframe[src="cliente.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}


before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    cy.preserveCookies()
})

after(() => {
    // TopBar.logOutMW()
})

describe('Matrix Web : Navigazioni da BackOffice', function () {

    it('Verifica atterraggio su BackOffice', function () {
        TopBar.clickBackOffice()

    });

    it('Verifica atterraggio Appuntamenti Futuri', function () {
        TopBar.clickBackOffice()

        cy.get('lib-upcoming-dates').click()
        cy.checkUrl('event-center')
        cy.get('lib-sub-header-right').click()

    });

    // non compare piu
    // it('Verifica Gestione Documentale', function () {
    //    
    //     cy.get('lib-news-image').click();
    //     cy.get('nx-modal-container').find('.agency-row').first().click().wait(5000)
    //     //TODO 2 minuti dura TROPPO
    //     getIFrame().find('a:contains("Primo Piano"):visible')
    //     getIFrame().find('span:contains("Primo comandamento: GED, GED e solo GED"):visible')

    //    BackOffice.backToBackOffice()
    //    
    // });

    it('Verifica links Sinistri', function () {
        TopBar.clickBackOffice()
        checkLinksOnSinistriExist()
    });

    it('Verifica links Contabilità', function () {
        TopBar.clickBackOffice()
        checkLinksOnContabilitaExist()
    });

    it.only('Verifica apertura disambiguazione: Movimentazione Sinistri', function () {
        TopBar.clickBackOffice()
        cy.wait(5000)
        cy.get('app-backoffice-cards-list').first().find('a').should('contain', 'Movimentazione Sinistri')
        BackOffice.checkCardExistOnSinistri('Movimentazione Sinistri')
        BackOffice.clickCardLink('Movimentazione sinistri')
        Disambiguazione.canaleFromPopup()
        getIFrameMoveSinistri().find('[class="pageTitle"]:contains("Movimentazione Sinistri"):visible')
        getIFrameMoveSinistri().find('h2 strong:contains("Sintesi Movimenti nel periodo"):visible')
        getIFrameMoveSinistri().find('a:contains("Ricerca"):visible')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Denuncia', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnSinistri('Denuncia')
        BackOffice.clickCardLink('Denuncia')
        Disambiguazione.canaleFromPopup()
        cy.wait(10000)
        getIFrameDenuncia().find('[class="pageTitle"]:contains("Ricerca cliente"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per polizza"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per targa"):visible')
        getIFrameDenuncia().find('h3:contains("Ricerca per dati anagrafici"):visible')
        getIFrameDenuncia().find('a:contains("Esegui Ricerca"):visible')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Denuncia BMP', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnSinistri('Denuncia BMP')
        BackOffice.clickCardLink('Denuncia BMP')
        cy.wait(5000)
        Disambiguazione.canaleFromPopup()
        cy.wait(20000)
        getIFrame().find('h4:contains("Dettaglio cliente"):visible')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Consultazione sinistri', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnSinistri('Consultazione sinistri')
        BackOffice.clickCardLink('Consultazione sinistri')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Sinistri incompleti', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnSinistri('Sinistri incompleti')
        BackOffice.clickCardLink('Sinistri incompleti')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('h2:contains("Sinistri Incompleti"):visible')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Sinistri canalizzati', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnSinistri('Sinistri canalizzati')
        BackOffice.clickCardLink('Sinistri canalizzati')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('a:contains("Filtra"):visible')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sintesi Contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Sintesi Contabilità')
        BackOffice.clickCardLink('Sintesi Contabilità')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('span:contains("Situazione finanziaria riepilogativa"):visible').click()
        getIFrame().find('span:contains("Esporta"):visible').click()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Giornata contabile', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Giornata contabile')
        BackOffice.clickCardLink('Giornata contabile')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('span:contains("Calendario"):visible')
        getIFrame().find('button:contains("Chiudi giornata contabile"):visible')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Consultazione Movimenti', function () {
        TopBar.clickBackOffice()

        BackOffice.checkCardExistOnContabilita('Consultazione Movimenti')
        BackOffice.clickCardLink('Consultazione Movimenti')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('button:contains("Cerca"):visible')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Estrazione Contabilità', function () {
        TopBar.clickBackOffice()

        BackOffice.checkCardExistOnContabilita('Estrazione Contabilità')
        BackOffice.clickCardLink('Estrazione Contabilità')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('h3:contains("ExtraDAS"):visible')
        getIFrame().find('p:contains("Ricerca Estrazioni"):visible')
        getIFrame().find('p:contains("Legenda"):visible')
        getIFrame().find('button:contains("Ricerca"):visible')
        BackOffice.backToBackOffice()

    })

    it.only('Verifica apertura disambiguazione: Deleghe SDD', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Deleghe SDD')
        BackOffice.clickCardLink('Deleghe SDD')
        Disambiguazione.canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('input[value="Carica"]').invoke('attr', 'value').should('equal', 'Carica')
        BackOffice.backToBackOffice()

    })

    /*    it('Verifica apertura disambiguazione: Quadratura unificata', function () {
            TopBar.clickBackOffice()
           
            cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Quadratura unificata')
           BackOffice.clickCardLink('Quadratura unificata')
            Disambiguazione.canaleFromPopup()()
            getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
            getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
            getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
            getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
           BackOffice.backToBackOffice()
           
        })*/

    it('Verifica apertura disambiguazione: Incasso per conto', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Incasso per conto')
        BackOffice.clickCardLink('Incasso per conto')
        Disambiguazione.canaleFromPopup()
        cy.wait(10000)
        getIFrame().find('input[value="Cerca"]').invoke('attr', 'value').should('equal', 'Cerca')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Incasso massivo', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Incasso massivo')
        BackOffice.clickCardLink('Incasso massivo')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('a:contains("Apri filtri"):visible')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sollecito titoli', function () {
        TopBar.clickBackOffice()
        checkCardExistOnContabilita('Sollecito titoli')
        BackOffice.clickCardLink('Sollecito titoli')
        Disambiguazione.canaleFromPopup()()
        getIFrame().find('span:contains("Gestione Sollecito Titoli")')
        getIFrame().find('#buttonCerca:contains("Cerca"):visible')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Impostazione contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Impostazione contabilità')
        BackOffice.clickCardLink('Impostazione contabilità')
        Disambiguazione.canaleFromPopup()
        getIFrame().find('ul > li > span:contains("Gestione dispositivi POS"):visible')
        getIFrame().find('ul > li > span:contains("Prenotazione POS"):visible')
        getIFrame().find('ul > li > span:contains("Retrocessioni Provv."):visible')
        getIFrame().find('ul > li > span:contains("Impostazioni DAS"):visible')
        BackOffice.backToBackOffice()
    });

    it('Verifica apertura disambiguazione: Convenzioni in trattenuta', function () {
        TopBar.clickBackOffice()

        BackOffice.checkCardExistOnContabilita('Convenzioni in trattenuta')
        BackOffice.clickCardLink('Convenzioni in trattenuta').click()
        Disambiguazione.canaleFromPopup()()
        cy.wait(10000)
        getIFrame().find('#contentPane:contains("Gestione"):visible')
        cy.get('a').contains('Backoffice').click()

    });

    it('Verifica apertura disambiguazione: Monitoraggio Customer Digital Footprint', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Monitoraggio Customer Digital Footprint')
        cy.get('app-backoffice-cards-list').eq(1).find('a[href="https://portaleagenzie.pp.azi.allianz.it/cdf/"]')
            .invoke('removeAttr', 'target').click()
        cy.url().should('include', 'cdf')
        cy.go('back')
        cy.get('a').contains('Backoffice').click()

    });
})

