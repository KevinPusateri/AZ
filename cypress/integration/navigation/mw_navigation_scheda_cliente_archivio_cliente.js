/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Common from "../../mw_page_objects/common/Common"
import ArchivioCliente from "../../mw_page_objects/clients/ArchivioCliente"

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

after(() => {
    TopBar.logOutMW()
})

describe('MW: Navigazioni da Scheda Cliente - Tab Archivio Cliente', function () {

    it('Verifica Subtab Archivio Cliente', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.checkLinksSubTabs()
    })

    it('Verifica Tab Note', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.clickSubTab('Note')
        ArchivioCliente.checkNote()
    })

    // TODO: NON ha nessuna attività
    // it.skip('Verifica Tab Attività', function () {
    // ArchivioCliente.clickTabArchivioCliente()
    // ArchivioCliente.clickSubTab('Attività')
    // ArchivioCliente.checkAttivita()
    // })

    it('Verifica Tab Comunicazioni', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.clickSubTab('Comunicazioni')
        ArchivioCliente.checkComunicazioni()
    })

    // TODO: Apri PDF in failed
    it('Verifica Tab Unico', function () {
        ArchivioCliente.clickTabArchivioCliente()
        ArchivioCliente.clickSubTab('Unico')
        ArchivioCliente.checkUnico()
    })

    // TODO: Sezione sarà disponibile a breve
    // it.skip('Verifica Tab Documentazione', function () {

    // })


    //TODO: NON contiene richieste
    // it.skip('Verifica Tab Digital Me', function () {
    //     ArchivioCliente.clickTabArchivioCliente()
    //     ArchivioCliente.clickSubTab('Digital Me')
    //     ArchivioCliente.checkDigitalMe()
    // })
})
