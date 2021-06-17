/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import SCUContatti from "../../../mw_page_objects/clients/SCUContatti"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let contatto
//#endregion

//#region Support
/**
 * 
 * @param {*} contactType : tipo di contatto a scelta tra 'numero' e 'mail'
 */
const searchClientWithoutContattiPrincipali = (contactType) => {
    LandingRicerca.searchRandomClient(true, "PF", "P")
    LandingRicerca.clickRandomResult()

    SintesiCliente.checkContattoPrincipale(contactType).then(contactIsPresent => {
        if (!contactIsPresent)
            return
        else
            searchClientWithoutContattiPrincipali(contactType)

    })
}
//#endregion

//#region Before After
before(() => {
    cy.task('nuovoContatto').then((object) => {
        contatto = object
    })

    LoginPage.logInMW(userName, psw)
})
beforeEach(() => {
    cy.preserveCookies()
})
afterEach(function () {
    if (this.currentTest.state === 'failed' &&
        //@ts-ignore
        this.currentTest._currentRetry === this.currentTest._retries) {
        //@ts-ignore
        Cypress.runner.stop();
    }
});
// after(() => {
//     TopBar.logOutMW()
// })
//#endregion Before After

describe('Matrix Web : Clients Numero e Mail Principali', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {
    context('Cellulare Principale', () => {
        it('Cerca Cliente senza Numero Principale', () => {
            searchClientWithoutContattiPrincipali('numero')
        })

        it('Aggiungi Numero Principale', () => {
            SintesiCliente.aggiungiContattoPrincipale('numero')
            SCUContatti.aggiungiNuovoTelefonoPrincipale(contatto)
        })
    })
})