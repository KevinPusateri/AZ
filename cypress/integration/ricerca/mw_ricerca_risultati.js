/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"

//#region Variables
const userName = 'TUTF021'
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

describe('Buca di Ricerca - Risultati', function () {

    it('Verifica Atterraggio nella Pagina',function(){
        LandingRicerca.search('RO')
        LandingRicerca.checkTabs()
        LandingRicerca.checkSuggestedLinks('RO')
        LandingRicerca.checkButtonRicercaClassica()

        LandingRicerca.searchRandomClient(false)
        LandingRicerca.checkTabDopoRicerca()

        cy.get('lib-advice-navigation-section').contains('Suggerimenti di navigazione').should('exist').and('be.visible')

        const suggLinks = [
            'Provvigioni',
            'Quattroruote - Calcolo valore Veicolo',
            'Interrogazioni Centralizzate',
            'Recupero preventivi e quotazioni',
            'Monitoraggio Polizze Proposte'
        ]
        cy.get('lib-advice-navigation-section').find('.position-sidebar>.title').should('have.length',5).each(($suggerimenti,i) =>{
            expect($suggerimenti.text().trim()).to.include(suggLinks[i]);
        })
        cy.get('lib-advice-navigation-section').find('button').contains('Ricerca classica').should('exist').and('be.visible')
    })
})
