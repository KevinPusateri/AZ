/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Common from "../../mw_page_objects/common/Common"
import ArchivioCliente from "../../mw_page_objects/clients/ArchivioCliente"

Cypress.config('defaultCommandTimeout', 60000)

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
const agency = '010710000'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion


before(() => {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
      LoginPage.logInMW(userName, psw)


})


beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
    if (!Cypress.env('monoUtenza')) {
        TopBar.search('Pulini Francesco')
        SintesiCliente.wait()
    } else{
        TopBar.search('Giuseppe Nazzarro')
        SintesiCliente.wait()
    }
})

after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

})

describe('MW: Navigazioni da Scheda Cliente - Tab Archivio Cliente', function () {

    it('Verifica Subtab Archivio Cliente', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.checkLinksSubTabs()
    })

    it('Verifica subTab Note', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.clickSubTab('Note')
        ArchivioCliente.checkNote()
    })

    // TODO: NON ha nessuna attività
    // it.skip('Verifica subTab Attività', function () {
    // ArchivioCliente.clickTabArchivioCliente()
    // ArchivioCliente.clickSubTab('Attività')
    // ArchivioCliente.checkAttivita()
    // })

    it('Verifica subTab Comunicazioni', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.clickSubTab('Comunicazioni')
        ArchivioCliente.checkComunicazioni()
    })

    // TODO: Apri PDF in failed
    it('Verifica subTab Unico', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.clickSubTab('Unico')
        ArchivioCliente.checkUnico()
    })

    // TODO: Sezione sarà disponibile a breve
    // it.skip('Verifica subTab Documentazione', function () {

    // })


    //TODO: NON contiene richieste
    // it.skip('Verifica subTab Digital Me', function () {
    //     ArchivioCliente.clickTabArchivioCliente()
    //     ArchivioCliente.clickSubTab('Digital Me')
    //     ArchivioCliente.checkDigitalMe()
    // })
})
