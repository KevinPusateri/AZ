/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Common from "../../mw_page_objects/common/Common"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"

Cypress.config('defaultCommandTimeout', 60000)

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region  Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
    TopBar.search('Pulini Francesco')
    SintesiCliente.wait()
})

// afterEach(function () {
//     if (this.currentTest.state === 'failed' &&
//         //@ts-ignore
//         this.currentTest._currentRetry === this.currentTest._retries) {
//         //@ts-ignore
//             Common.visitUrlOnEnv()
// cy.preserveCookies()
// TopBar.search('Pulini Francesco')
// SintesiCliente.wait()
//     }
// });

after(() => {
    // TopBar.logOutMW()
})

describe('Matrix Web : Navigazioni da Scheda Cliente - Tab Portafoglio', function () {

    it('Verifica Subtab Portafoglio', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkLinksSubTabs()
    })

    it('Verifica Tab Polizze attive', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        Portafoglio.checkPolizzeAttive()
        Portafoglio.back()
    })

    // NON CLICCA 
    // it('Verifica Tab Proposte',function(){
    //     Portafoglio.clickTabPortafoglio()
    //     Portafoglio.clickSubTab('Proposte')
    //     Portafoglio.back()
    // })

    // NON CLICCA 
    // it('Verifica Tab Preventivi', function () {
    //     Portafoglio.clickTabPortafoglio()
    //     Portafoglio.clickSubTab('Preventivi')
    //     Portafoglio.checkPreventivi()
    //     Portafoglio.back()
    // })

    // NON CLICCA 
    it.only('Verifica Tab Non in vigore', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Non in vigore')
        Portafoglio.checkNonInVigore()
        Portafoglio.back()
    })

    // FUNZIA
    it('Verifica Tab Sinistri', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Sinistri')
        Portafoglio.checkSinistri()
        Portafoglio.back()
    })
})