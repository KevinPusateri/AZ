/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import HomePage from "../../mw_page_objects/common/HomePage"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

let keys = {
    interrogazioniCentralizzateEnabled: true,
    REPORT_ALLIANZ_NOW: true,
    srmOnlineEnabled: true,
    siscoEnabled: true,
    obuEnabled: true,
    satellitareEnabled: true,
    monitorScoringAZBonusDrive: true,
    newsMieInfo: true
}


before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()

        cy.getProfiling(data.tutf).then(profiling => {
            cy.filterProfile(profiling, 'COMMON_REPORTING_INTERROGAZIONI_CENTRALIZZATE').then(profiled => { keys.interrogazioniCentralizzateEnabled = profiled })
            cy.filterProfile(profiling, 'COMMON_SERVIZI_SOL').then(profiled => { keys.srmOnlineEnabled = profiled })
            cy.filterProfile(profiling, 'VITA_SISCO').then(profiled => { keys.siscoEnabled = profiled })
            cy.filterProfile(profiling, 'PO_REPORT_ALLIANZNOW').then(profiled => { keys.REPORT_ALLIANZ_NOW = profiled })
            cy.filterProfile(profiling, 'COMMON_MICROSTOCK').then(profiled => {
                keys.obuEnabled = profiled
                keys.satellitareEnabled = profiled
            })
            cy.filterProfile(profiling, 'COMMON_CRUSCOTTO_SCORING_ABD').then(profiled => { keys.monitorScoringAZBonusDrive = profiled })

            if (Cypress.env('isAviva'))
                keys.newsMieInfo = false
            else
                keys.newsMieInfo = true
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
    });

    if (!keys.srmOnlineEnabled && !keys.siscoEnabled)
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
        if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva')) {
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

    it('Verifica presenza links da Utilità', function () {
        TopBar.clickIconSwitchPage()
        TopBar.checkLinksUtility(keys)
    })

    it('Verifica atterraggio da Utilità - Cruscotto resilience', function () {
        TopBar.clickIconSwitchPage()
        TopBar.clickLinkOnUtilita('Cruscotto resilience')
    })

    // --add excel porta su microsoft(apre per forza una new window)
    // it.skip('Verifica atterraggio da Utilità - Casella di posta agente ed agenzia', function () {
    //     TopBar.clickIconSwitchPage()
    //     TopBar.clickLinkOnUtilita('Casella di posta agente ed agenzia')
    // })

    it('Verifica atterraggio da Utilità - Quattroruote - Calcolo valore veicolo', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Quattroruote - Calcolo valore veicolo')
        } else this.skip()
    })

    // ! NON SEI AUTORIZZATO AD ACCEDERE ALLA PAGINA DI BACKOFFICE
    // Mostra non sei autorizzato ad accedere alla pagina backoffice --add excel
    // it.skip('Verifica atterraggio da Utilità - Report Allianz Now', function () {
    //     TopBar.clickIconSwitchPage()
    //     TopBar.clickLinkOnUtilita('Report Allianz Now')
    // })

    it('Verifica atterraggio da Utilità - Interrogazioni centralizzate', function () {
        //! HTML ancora Vuoto Aspettare per AVIVA Febbraio
        if (keys.interrogazioniCentralizzateEnabled) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Interrogazioni centralizzate')
        }
        else
            this.skip()
    })

    it('Verifica atterraggio da Utilità - Banche Dati ANIA', function () {
        TopBar.clickIconSwitchPage()
        TopBar.clickLinkOnUtilita('Banche Dati ANIA')
    })

    it('Verifica atterraggio da Utilità - Gestione Magazzino OBU', function () {
        if (keys.obuEnabled) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Gestione Magazzino OBU')
        } else this.skip()
    })

    // Accesso non autorizzato --add excel
    // ! IMPOSSIBILE Pagina inesistente
    // it.skip('Verifica atterraggio da Utilità - Piattaforma contratti AZ Telematics', function () {
    //     TopBar.clickIconSwitchPage()
    //     TopBar.clickLinkOnUtilita('Piattaforma contratti AZ Telematics')
    // })

    it('Verifica atterraggio da Utilità - Cruscotto Installazione Dispositivo Satellitare', function () {
        if (!Cypress.env('monoUtenza') && keys.satellitareEnabled) {
            TopBar.clickIconSwitchPage()
            TopBar.clickLinkOnUtilita('Cruscotto Installazione Dispositivo Satellitare')
        } else this.skip()
    })

    it('Verifica atterraggio da Utilità - Monitor Scoring AZ Bonus Drive', function () {
        if (keys.monitorScoringAZBonusDrive) {
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

    it('Verifica Top Menu News', function () {
        if (!keys.newsMieInfo)
            this.skip()
        else
            TopBar.clickIconSwitchPage('News')
    });

    it('Verifica Top Menu Le mie info', function () {
        if (!keys.newsMieInfo)
            this.skip()
        else
            TopBar.clickIconSwitchPage('Le mie info')
    });

    it('Verica buca di ricerca', function () {
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


    it('Verifica Button News', function () {
        if (!keys.newsMieInfo)
            this.skip()
        else
            TopBar.clickNews()
    });

    it('Verifica Button Le mie info', function () {
        if (!keys.newsMieInfo)
            this.skip()
        else
            TopBar.clickMieInfo()
    });

    if (Cypress.env('isAviva')) {
        it('Verifica assenza Button News', function () {
            TopBar.checkNotExistLanding('News')
        });

        it('Verifica assenza Button Le mie info', function () {
            TopBar.checkNotExistLanding('Le mie info')
        });
    }

    it('Verifica link "Vai al Centro notifiche"', function () {
        HomePage.clickVaiAlCentroNotifiche()
    });

    if (!Cypress.env('isAviva')) {
        it('Verifica link: "Vedi tutte"', function () {
            HomePage.clickVediTutte()
        });
    } else {
        it('Verifica assenza link: "Vedi tutte"', function () {
            HomePage.checkNotExistVediTutte()
        });
    }

    it('Verifica Click Pannello "Notifiche in evidenza"', function () {
        HomePage.clickPanelNotifiche()
    })

    // ADD TFS
    // it.skip('Verifica testi e link delle notifiche', function () {
    //     HomePage.clickPanelNotifiche()
    //     HomePage.checkNotifiche()
    // })
})