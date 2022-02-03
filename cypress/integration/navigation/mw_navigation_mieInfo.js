/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */
/// <reference types="Cypress" />


import LinkMieInfo from "../../mw_page_objects/navigation/LinkMieInfo"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Mieinfo from "../../mw_page_objects/navigation/Mieinfo"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 20000)
//#endregion

let keysLinksMenu = LinkMieInfo.getKeysLinksMenu()
let keysLinksSubMenuProdotti = LinkMieInfo.getKeysLinksProdotti()
let keysLinksSubMenuIniziative = LinkMieInfo.getKeysLinksIniziative()
let keysLinksSubMenuSalesAccademy = LinkMieInfo.getKeysLinksSalesAcademy()
let keysLinksSubMenuIlMondoAllianz = LinkMieInfo.getKeysLinksIlMondoAllianz()
let keysLinksSubMenuAntiriciclaggio = LinkMieInfo.getKeysLinksAntiriciclaggio()
let keysLinksSubMenuRisorsePerAgenzia = LinkMieInfo.getKeysLinksRisorsePerAgenzia()
let keysLinksSubMenuRisorsePerAgente = LinkMieInfo.getKeysLinksRisorsePerAgente()
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        cy.profilingLinksMenu(data.tutf, keysLinksMenu)
        cy.profilingLinksMenu(data.tutf, keysLinksSubMenuProdotti)
        cy.profilingLinksMenu(data.tutf, keysLinksSubMenuIniziative)
        cy.profilingLinksMenu(data.tutf, keysLinksSubMenuSalesAccademy)
        cy.profilingLinksMenu(data.tutf, keysLinksSubMenuIlMondoAllianz)
        cy.profilingLinksMenu(data.tutf, keysLinksSubMenuAntiriciclaggio)
        cy.profilingLinksMenu(data.tutf, keysLinksSubMenuRisorsePerAgenzia)
        cy.profilingLinksMenu(data.tutf, keysLinksSubMenuRisorsePerAgente)
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

describe('Matrix Web : Navigazioni da Le Mie Info', function () {

    it('Verifica aggancio Le Mie Info',  {
        // Settato in caso di FAILED nel Before(Mostra l'errore)
        retries: {
            runMode: 0,
            openMode: 0,
        }
    }, function()  {
        TopBar.clickMieInfo()
    })
    

    it('Verifica presenza links Menu', function () {
        TopBar.clickMieInfo()
        Mieinfo.checkLinksOnMenuInfo(keysLinksMenu)
    })

    it('Verifica aggancio Primo piano', function () {
        if (!keysLinksMenu['primo-piano'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Primo piano')
    })

    it('Verifica aggancio Raccolte', function () {
        if (!keysLinksMenu['raccolte'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Raccolte')
    });

    it('Verifica aggancio Contenuti salvati', function () {
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Contenuti salvati')
    });

    it('Verifica aggancio Prodotti', function () {
        if (!keysLinksMenu['prodotti'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Prodotti')
        Mieinfo.checkLinksOnSubMenu('Prodotti', keysLinksSubMenuProdotti)
        Mieinfo.checkLinksOnIcon('Prodotti')
    });

    it('Verifica aggancio su tutte le sotto pagine di Prodotti', function () {
        if (!keysLinksMenu['prodotti'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Prodotti');
        Mieinfo.checkPageOnSubMenu('Prodotti', keysLinksSubMenuProdotti)
    })

    it('Verifica aggancio Iniziative', function () {
        if (!keysLinksMenu['iniziative'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Iniziative')
        Mieinfo.checkLinksOnSubMenu('Iniziative', keysLinksSubMenuIniziative)
        Mieinfo.checkLinksOnIcon('Iniziative')
    });

    it('Verifica aggancio su tutte le sotto pagine di Iniziative', function () {
        if (!keysLinksMenu['iniziative'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Iniziative');
        Mieinfo.checkPageOnSubMenu('Iniziative', keysLinksSubMenuIniziative)
    })

    it('Verifica aggancio Eventi e Sponsorizzazioni', function () {
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Eventi e Sponsorizzazioni')
    });

    it('Verifica aggancio Sales Academy', function () {
        if (!keysLinksMenu['sales-academy'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Sales Academy')
        Mieinfo.checkLinksOnSubMenu('Sales Academy', keysLinksSubMenuSalesAccademy)
        Mieinfo.checkLinksOnIcon('Sales Academy')
    });

    it('Verifica aggancio su tutte le sotto pagine di Sales Academy', function () {
        if (!keysLinksMenu['sales-academy'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Sales Academy');
        Mieinfo.checkPageOnSubMenu('Sales Academy', keysLinksSubMenuSalesAccademy)
    })

    it('Verifica aggancio Momento della Verità', function () {
        if (!keysLinksMenu['sinistri'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Momento della Verità')
        Mieinfo.checkLinksOnIcon('Momento della Verità')
    });


    //! DA VERIFICARE
    // it('Verifica aggancio Le release', function () {
    //     TopBar.clickMieInfo()
    //     Mieinfo.clickLinkOnMenu('Le release')
    //     Mieinfo.checkPanelsOnRelease()
    // });

    it('Verifica aggancio Rilasci informatici', function () {
        if (!keysLinksMenu['le-release'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Rilasci informatici')
        // Mieinfo.checkPanelsOnRelease()
    });

    it('Verifica aggancio Manuali informatici', function () {
        if (!keysLinksMenu['manuali-informatici'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Manuali informatici')
        Mieinfo.checkPanelsOnManualiInformatici()
    });

    it('Verifica aggancio Circolari', function () {
        if (!keysLinksMenu['circolari'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Circolari')
    });

    it('Verifica aggancio Company Handbook', function () {
        if (!keysLinksMenu['company-handbook'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Company Handbook')
    })

    it('Verifica aggancio Antiriciclaggio', function () {
        if (!keysLinksMenu['antiriciclaggio'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Antiriciclaggio')
        Mieinfo.checkLinksOnSubMenu('Antiriciclaggio', keysLinksSubMenuAntiriciclaggio)
        Mieinfo.checkLinksOnIcon('Antiriciclaggio')
    })

    it('Verifica aggancio su tutte le sotto pagine di Antiriciclaggio', function () {
        if (!keysLinksMenu['antiriciclaggio'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Antiriciclaggio');
        Mieinfo.checkPageOnSubMenu('Antiriciclaggio', keysLinksSubMenuAntiriciclaggio)
    })

    it('Verifica aggancio Risorse per l\'Agenzia', function () {
        if (!keysLinksMenu['risorse-per-l\'agenzia'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Risorse per l\'Agenzia')
        Mieinfo.checkLinksOnSubMenu('Risorse per l\'Agenzia', keysLinksSubMenuRisorsePerAgenzia)
        Mieinfo.checkLinksOnIcon('Risorse per l\'Agenzia')
    });
    it('Verifica aggancio su tutte le sotto pagine di Risorse per l\'Agenzia', function () {
        if (!keysLinksMenu['risorse-per-l\'agenzia'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Risorse per l\'Agenzia');
        Mieinfo.checkPageOnSubMenu('Risorse per l\'Agenzia', keysLinksSubMenuRisorsePerAgenzia)
    })

    it('Verifica aggancio Operatività', function () {
        if (!keysLinksMenu['operativita'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Operatività')
        Mieinfo.checkPanelsOnOperativita()
    });

    it('Verifica aggancio Risorse per l\'Agente', function () {
        if (!keysLinksMenu['risorse-per-l\'agente'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Risorse per l\'Agente')
        Mieinfo.checkLinksOnSubMenu('Risorse per l\'Agente', keysLinksSubMenuRisorsePerAgente)
        Mieinfo.checkLinksOnIcon('Risorse per l\'Agente')
    });
    it('Verifica aggancio su tutte le sotto pagine di Risorse per l\'Agente', function () {
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Risorse per l\'Agente');
        Mieinfo.checkPageOnSubMenu('Risorse per l\'Agente', keysLinksSubMenuRisorsePerAgente)
    })

    it('Verifica aggancio Il mondo Allianz', function () {
        if (!keysLinksMenu['il-mondo-allianz'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Il mondo Allianz')
        Mieinfo.checkLinksOnSubMenu('Il mondo Allianz', keysLinksSubMenuIlMondoAllianz)
        Mieinfo.checkLinksOnIcon('Il mondo Allianz')
    })
    it('Verifica aggancio su tutte le sotto pagine di Il mondo Allianz', function () {
        if (!keysLinksMenu['il-mondo-allianz'])
            this.skip()
        TopBar.clickMieInfo()
        Mieinfo.clickLinkOnMenu('Il mondo Allianz');
        Mieinfo.checkPageOnSubMenu('Il mondo Allianz', keysLinksSubMenuIlMondoAllianz)
    })
});

    //TODO : PAGINA BIANCA DA TESTARE  -- Add TFS
    // it.only('Verifica aggancio New company handbook', function () {
    //   TopBar.clickMieInfo()
    //   Mieinfo.clickLinkOnMenu('New company handbook')
    //   Mieinfo.checkLinksOnSubMenu('New company handbook')
    // })
    // it.only('Verifica aggancio su tutte le sotto pagine di New company handbook', function () {
    //   TopBar.clickMieInfo()
    //   Mieinfo.clickLinkOnMenu('New company handbook');
    //   Mieinfo.checkPageOnSubMenu('New company handbook')
    // })
