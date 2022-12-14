/// <reference types="Cypress" />

import Sales from "../../mw_page_objects/navigation/Sales"
import Common from "../../mw_page_objects/common/Common"
import HomePage from "../../mw_page_objects/common/HomePage"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

let keys = {
    interrogazioniCentralizzateEnabled: true,
    PIATTAFORMA_CONTRATTI_AZ_TELEMATICS: false,
    MONITOR_SCORING_AZ_BONUS_DRIVE: false,
    REPORT_ALLIANZ_NOW: true,
    GESTIONE_CERTIFICATI: true,
    srmOnlineEnabled: true,
    siscoEnabled: true,
    SERVICENOW: true,
    obuEnabled: false,
    satellitareEnabled: false
}


before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
            if (!Cypress.env('internetTesting'))
                cy.getProfiling(data.tutf).then(profiling => {
                    cy.filterProfile(profiling, 'COMMON_PIATTAFORMA_TMX').then(profiled => { keys.PIATTAFORMA_CONTRATTI_AZ_TELEMATICS = false })
                    cy.filterProfile(profiling, 'COMMON_CRUSCOTTO_SCORING_ABD').then(profiled => { keys.MONITOR_SCORING_AZ_BONUS_DRIVE = false })
                    cy.filterProfile(profiling, 'COMMON_REPORTING_INTERROGAZIONI_CENTRALIZZATE').then(profiled => { keys.interrogazioniCentralizzateEnabled = profiled })
                    cy.filterProfile(profiling, 'COMMON_SERVIZI_SOL').then(profiled => { keys.srmOnlineEnabled = profiled })
                    cy.filterProfile(profiling, 'VITA_SISCO').then(profiled => { keys.siscoEnabled = profiled })
                    cy.filterProfile(profiling, 'PO_SERVICENOW').then(profiled => { keys.SERVICENOW = profiled })
                    cy.filterProfile(profiling, 'COMMON_SCARICO_CERTIFICATI').then(profiledCert => {
                        cy.filterProfile(profiling, 'COMMON_REPORTING_SCARICO_AGENZIA').then(profiledScaricoAgenzia => {
                            cy.filterProfile(profiling, 'DAS_GIORNATA_ESTRAZIONE_SUITE_ESTERNE').then(profiledEstrazioneSuite => {
                                if (!(profiledCert && (profiledScaricoAgenzia || profiledEstrazioneSuite)))
                                    keys.GESTIONE_CERTIFICATI = false
                            })
                        })
                    })

                    cy.filterProfile(profiling, 'PO_REPORT_ALLIANZNOW').then(profiled => { keys.REPORT_ALLIANZ_NOW = profiled })
                    //? Rimosso dalla Release 124, default a false
                    cy.filterProfile(profiling, 'COMMON_MICROSTOCK').then(profiled => {
                        keys.obuEnabled = false
                        keys.satellitareEnabled = false
                    })
                })
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
})

after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion

})

describe('Matrix Web : Navigazioni da Home Page - ', function () {
    it('Verifica Top Menu Principali', function () {
        TopBar.clickIconCalendar()
        TopBar.clickIconIncident()
        TopBar.clickIconNotification()
        TopBar.clickIconUser()
        TopBar.clickIconSwitchPage()
    })

    it('Aggiungi e Verifica Preferiti in MW Home Page', function () {
        HomePage.aggiungiPreferito(HomePage.PREFERITI.NUOVOSFERA)
        HomePage.aggiungiPreferito(HomePage.PREFERITI.BANCHEDATIANIA)
        HomePage.aggiungiPreferito(HomePage.PREFERITI.QUATTRORUOTE)

        //Effettuiamo un reload per vedere se si sono mantenute le modifiche
        Common.visitUrlOnEnv()

        HomePage.checkPreferiti(true,
            HomePage.PREFERITI.NUOVOSFERA,
            HomePage.PREFERITI.BANCHEDATIANIA,
            HomePage.PREFERITI.QUATTRORUOTE)

    })

    it('Rimuovi e Verifica Preferiti in MW Home Page', function () {
        HomePage.rimuoviPreferito(HomePage.PREFERITI.BANCHEDATIANIA)
        HomePage.rimuoviPreferito(HomePage.PREFERITI.QUATTRORUOTE)

        //Effettuiamo un reload per vedere se si sono mantenute le modifiche
        Common.visitUrlOnEnv()

        HomePage.checkPreferiti(false,
            HomePage.PREFERITI.BANCHEDATIANIA,
            HomePage.PREFERITI.QUATTRORUOTE)

    })

    it('Sezione Operativit?? in Buca di Ricerca', function() {
        TopBar.searchAndClickSuggestedNavigations('Sezione Operativit??')
        Sales.checkAccordionOperativita()
    })

    it('Aggiungi e Verifica Preferito Sezione Operativita', function () {
        HomePage.aggiungiPreferito(HomePage.PREFERITI.SEZIONE_OPERATIVITA)

        //Effettuiamo un reload per vedere se si sono mantenute le modifiche
        Common.visitUrlOnEnv()

        HomePage.checkPreferiti(true, HomePage.PREFERITI.SEZIONE_OPERATIVITA)
    })

    it('Rimuovi e Verifica Preferito Sezione Operativita', function () {
        HomePage.rimuoviPreferito(HomePage.PREFERITI.SEZIONE_OPERATIVITA)

        //Effettuiamo un reload per vedere se si sono mantenute le modifiche
        Common.visitUrlOnEnv()

        HomePage.checkPreferiti(false, HomePage.PREFERITI.SEZIONE_OPERATIVITA)
    })

    if (keys.srmOnlineEnabled && keys.siscoEnabled && keys.SERVICENOW)
        it('Verifica Top Menu incident - Verifica presenza dei link', function () {
            TopBar.clickIconIncident()
            TopBar.checkLinksIncident(keys)
        })
    else
        it('Verifica Top Menu incident - Verifica ASSENZA dei link', function () {
            TopBar.clickIconIncident()
            TopBar.checkLinksIncident(keys)
        })

    it('Verifica Top Menu incident - Verifica atterraggio SRM Online', function () {
        if (keys.srmOnlineEnabled)
            TopBar.clickLinkOnIconIncident('SRM Online')
        else
            this.skip()
    })

    it('Verifica Top Menu incident - Verifica atterraggio SisCo', function () {
        if (keys.siscoEnabled)
            TopBar.clickLinkOnIconIncident('SisCo')
        else this.skip()
    })

    it('Verifica Top Menu incident - Verifica atterraggio Elenco telefonico', function () {
        if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            cy.task('getHostName').then(hostName => {
                let currentHostName = hostName
                if (!currentHostName.includes('SM'))
                    TopBar.clickLinkOnIconIncident('Elenco telefonico')
            })
        } else this.skip()
    })

    it('Verifica Top Menu User - Verifica apertura icona User', function () {
        TopBar.clickIconUser()
    })

    it('Verifica Top Menu notifiche - Verifica presenza dei link', function () {
        TopBar.clickIconNotification()
        TopBar.checkNotificheEvidenza()
    })

    it('Verifica presenza links da Utilit??', function () {
        TopBar.clickIconSwitchPage()
        TopBar.checkLinksUtility(keys)
    })

    it('Verifica atterraggio da Utilit?? - Cruscotto resilience', function () {
        TopBar.clickIconSwitchPage()
        TopBar.clickLinkOnUtilita('Cruscotto resilience')
    })

    // --add excel porta su microsoft(apre per forza una new window)
    // it.skip('Verifica atterraggio da Utilit?? - Casella di posta agente ed agenzia', function () {
    //     TopBar.clickIconSwitchPage()
    //     TopBar.clickLinkOnUtilita('Casella di posta agente ed agenzia')
    // })

    it('Verifica atterraggio da Utilit?? - Quattroruote - Calcolo valore veicolo', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Quattroruote - Calcolo valore veicolo')
        } else this.skip()
    })

    // ! NON SEI AUTORIZZATO AD ACCEDERE ALLA PAGINA DI BACKOFFICE
    // Mostra non sei autorizzato ad accedere alla pagina backoffice --add excel
    // it.skip('Verifica atterraggio da Utilit?? - Report Allianz Now', function () {
    //     TopBar.clickIconSwitchPage()
    //     TopBar.clickLinkOnUtilita('Report Allianz Now')
    // })

    it('Verifica atterraggio da Utilit?? - Interrogazioni centralizzate', function () {
        //! HTML ancora Vuoto Aspettare per AVIVA Febbraio
        if (keys.interrogazioniCentralizzateEnabled) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Interrogazioni centralizzate')
        }
        else
            this.skip()
    })

    it('Verifica atterraggio da Utilit?? - Banche Dati ANIA', function () {
        TopBar.clickIconSwitchPage()
        TopBar.clickLinkOnUtilita('Banche Dati ANIA')
    })

    it('Verifica atterraggio da Utilit?? - Gestione certificati', function () {
        if (!keys.GESTIONE_CERTIFICATI)
            this.skip()
        TopBar.clickIconSwitchPage()
        TopBar.clickLinkOnUtilita('Gestione certificati')
    })

    it('Verifica atterraggio da Utilit?? - Gestione Magazzino OBU', function () {
        if (keys.obuEnabled) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Gestione Magazzino OBU')
        } else this.skip()
    })

    // Accesso non autorizzato --add excel
    // ! IMPOSSIBILE Pagina inesistente
    // it.skip('Verifica atterraggio da Utilit?? - Piattaforma contratti AZ Telematics', function () {
    //     TopBar.clickIconSwitchPage()
    //     TopBar.clickLinkOnUtilita('Piattaforma contratti AZ Telematics')
    // })

    // it('Verifica atterraggio da Utilit?? - Cruscotto Installazione Dispositivo Satellitare', function () {
    //     if (!Cypress.env('monoUtenza') && keys.satellitareEnabled) {
    //         TopBar.clickIconSwitchPage()
    //         TopBar.clickLinkOnUtilita('Cruscotto Installazione Dispositivo Satellitare')
    //     } else this.skip()
    // })

    it('Verifica atterraggio da Utilit?? - Monitor Scoring AZ Bonus Drive', function () {
        if (keys.MONITOR_SCORING_AZ_BONUS_DRIVE) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Monitor Scoring AZ Bonus Drive')
        }
        else
            this.skip()
    })

    it('Verifica Top Menu Clients', function () {
        TopBar.clickIconSwitchPage('Clients')
    })

    it('Verifica Top Menu Sales', function () {
        TopBar.clickIconSwitchPage('Sales')
    })

    it('Verifica Top Menu Numbers', function () {
        TopBar.clickIconSwitchPage('Numbers')
    });

    it('Verifica Top Menu Backoffice', function () {
        TopBar.clickIconSwitchPage('Backoffice')
    });

    it('Verifica Top Menu News e Info', function () {
        TopBar.clickIconSwitchPage('News e Info')
    });

    it('Verifica Buca di Ricerca', function () {
        TopBar.clickBucaRicerca()
    });

    it('Verifica Button Clients', function () {
        TopBar.clickClients()
    });

    it('Verifica Button Sales', function () {
        TopBar.clickSales()
    });

    it('Verifica Button Numbers', function () {
        TopBar.clickNumbers()
    });

    it('Verifica Button Backoffice', function () {
        TopBar.clickBackOffice()
    });

    it('Verifica Button News e Info', function () {
        TopBar.clickNewsInfo()
    });

    it('Verifica link "Vai al Centro notifiche"', function () {
        HomePage.clickVaiAlCentroNotifiche()
    });

    it('Verifica link: "Vedi tutte"', function () {
        HomePage.clickVediTutte()
    });

    it('Verifica Click Pannello "Notifiche in evidenza"', function () {
        HomePage.clickPanelNotifiche()
    })

    // ADD TFS
    // it.skip('Verifica testi e link delle notifiche', function () {
    //     HomePage.clickPanelNotifiche()
    //     HomePage.checkNotifiche()
    // })
});