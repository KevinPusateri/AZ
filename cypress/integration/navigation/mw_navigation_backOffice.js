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
const userName = 'TUF021'
const psw = 'P@ssw0rd!'
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
        BackOffice.clickAppuntamentiFuturi()
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

    it('Verifica apertura disambiguazione: Movimentazione Sinistri', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Movimentazione sinistri')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Denuncia', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Denuncia BMP', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Denuncia BMP')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Consultazione sinistri', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione sinistri')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sinistri incompleti', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sinistri incompleti')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sinistri canalizzati', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sinistri canalizzati')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sintesi Contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sintesi Contabilità')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Giornata contabile', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Giornata contabile')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Consultazione Movimenti', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Consultazione Movimenti')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Estrazione Contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Estrazione Contabilità')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Deleghe SDD', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Deleghe SDD')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Quadratura unificata', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Quadratura unificata')
        BackOffice.backToBackOffice()

    }) 

    it('Verifica apertura disambiguazione: Incasso per conto', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Incasso per conto')
        BackOffice.backToBackOffice()

    })

    it('Verifica apertura disambiguazione: Incasso massivo', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Incasso massivo')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Sollecito titoli', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Sollecito titoli')
        BackOffice.backToBackOffice()
    })

    it('Verifica apertura disambiguazione: Impostazione contabilità', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Impostazione contabilità')
        BackOffice.backToBackOffice()
    });

    it('Verifica apertura disambiguazione: Convenzioni in trattenuta', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Convenzioni in trattenuta')
        BackOffice.backToBackOffice()

    });

    it('Verifica apertura disambiguazione: Monitoraggio Customer Digital Footprint', function () {
        TopBar.clickBackOffice()
        BackOffice.clickCardLink('Monitoraggio Customer Digital Footprint')
        BackOffice.backToBackOffice()

    });
})

