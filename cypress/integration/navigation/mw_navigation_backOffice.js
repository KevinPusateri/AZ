/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BackOffice from "../../mw_page_objects/Navigation/BackOffice"

//#region Variables
const userName = 'le00080'
const psw = 'Dragonball3'
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
})

after(() => {
    TopBar.logOutMW()
})

describe('Matrix Web : Navigazioni da BackOffice', function () {

    it('Verifica atterraggio su BackOffice', function () {
        TopBar.clickBackOffice()

    });

    it('Verifica atterraggio Appuntamenti Futuri', function () {
        TopBar.clickBackOffice()
        BackOffice.checkAtterraggioAppuntamentiFuturi()
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
        BackOffice.checkLinksOnSinistriExist()
    });

    it('Verifica links Contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.checkLinksOnContabilitaExist()
    });

    it('Verifica apertura Common: Movimentazione Sinistri', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioMovimentazioneSinistri()
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura Common: Denuncia', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioDenuncia()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Denuncia BMP', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia BMP')
        cy.wait(5000)
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioDenunciaBMP()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Consultazione sinistri', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioConsultazioneSinistri()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Sinistri incompleti', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sinistri incompleti')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioSinistriIncompleti()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Sinistri canalizzati', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sinistri canalizzati')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioSinistriCanalizzati()
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura Common: Sintesi Contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Sintesi Contabilità')
        BackOffice.clickCardLink('Sintesi Contabilità')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioSintesiContabilita()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Giornata contabile', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Giornata contabile')
        BackOffice.clickCardLink('Giornata contabile')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioGiornataContabile()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Consultazione Movimenti', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Consultazione Movimenti')
        BackOffice.clickCardLink('Consultazione Movimenti')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioConsultazioneMovimenti()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Estrazione Contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Estrazione Contabilità')
        BackOffice.clickCardLink('Estrazione Contabilità')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioEstrazioneContabilita()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Deleghe SDD', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Deleghe SDD')
        BackOffice.clickCardLink('Deleghe SDD')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioDelegheSDD()
        BackOffice.backToBackOffice()

    })

    /*    it('Verifica apertura Common: Quadratura unificata', function () {
            TopBar.clickBackOffice()
           
            cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain','Quadratura unificata')
           BackOffice.clickCardLink('Quadratura unificata')
            Common.canaleFromPopup()()
            getIFrame().find('#quadNavigationBar:contains("Q.U.A.D. - home page"):visible')
            getIFrame().find('#quadMenu:contains("Quadratura Unificata"):visible')
            getIFrame().find('#quadMenu:contains("Agenzie Digital"):visible')
            getIFrame().find('#ApriPdfAdesioneQuad:contains("PDF di Adesione"):visible')
           BackOffice.backToBackOffice()
           
        })*/

    it('Verifica apertura Common: Incasso per conto', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Incasso per conto')
        BackOffice.clickCardLink('Incasso per conto')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioIncassoPerConto()
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura Common: Incasso massivo', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Incasso massivo')
        BackOffice.clickCardLink('Incasso massivo')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioIncassoMassivo()
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura Common: Sollecito titoli', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Sollecito titoli')
        BackOffice.clickCardLink('Sollecito titoli')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioSollecitoTitoli()
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura Common: Impostazione contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Impostazione contabilità')
        BackOffice.clickCardLink('Impostazione contabilità')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioImpostazioneContabilita()
        BackOffice.backToBackOffice()
    });

    it('Verifica apertura Common: Convenzioni in trattenuta', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Convenzioni in trattenuta')
        BackOffice.clickCardLink('Convenzioni in trattenuta')
        Common.canaleFromPopup()
        BackOffice.checkAtterraggioConvenzioniInTrattenuta()
        BackOffice.backToBackOffice()

    });

    it('Verifica apertura Common: Monitoraggio Customer Digital Footprint', function () {
        TopBar.clickBackOffice()
        BackOffice.checkCardExistOnContabilita('Monitoraggio Customer Digital Footprint')
        BackOffice.checkAtterraggioMonitoraggioCustomerDigitalFootprint()
        BackOffice.backToBackOffice()

    });
})

