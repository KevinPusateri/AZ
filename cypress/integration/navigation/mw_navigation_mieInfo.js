/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */
/// <reference types="Cypress" />


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
Cypress.config('defaultCommandTimeout', 60000)

//#endregion


before(() => {
  cy.getUserWinLogin().then(data => {
    cy.startMysql(dbConfig, testName, currentEnv, data)
    LoginPage.logInMWAdvanced()
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
  it('Verifica aggancio Le Mie Info', function () {
    TopBar.clickMieInfo()
  })

  it('Verifica presenza links Menu', function () {
    TopBar.clickMieInfo()
    Mieinfo.checkLinksOnMenuInfo()
  })

  it('Verifica aggancio Primo piano', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Primo piano')
  })

  it('Verifica aggancio Raccolte', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Raccolte')
  });

  it('Verifica aggancio Contenuti Salvati', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Contenuti Salvati')
  });

  it('Verifica aggancio Prodotti', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Prodotti')
    Mieinfo.checkLinksOnSubMenu('Prodotti')
    Mieinfo.checkLinksOnIcon('Prodotti')
  });

  it('Verifica aggancio su tutte le sotto pagine di Prodotti', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Prodotti');
    Mieinfo.checkPageOnSubMenu('Prodotti')
  })

  it.only('Verifica aggancio Iniziative', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Iniziative')
    Mieinfo.checkLinksOnSubMenu('Iniziative')
    Mieinfo.checkLinksOnIcon('Iniziative')
  });

  it.only('Verifica aggancio su tutte le sotto pagine di Iniziative', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Iniziative');
    Mieinfo.checkPageOnSubMenu('Iniziative')
  })

  it('Verifica aggancio Eventi e Sponsorizzazioni', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Eventi e Sponsorizzazioni')
  });

  it('Verifica aggancio Sales Academy', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Sales Academy')
    Mieinfo.checkLinksOnSubMenu('Sales Academy')
    Mieinfo.checkLinksOnIcon('Sales Academy')
  });

  it('Verifica aggancio su tutte le sotto pagine di Sales Academy', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Sales Academy');
    Mieinfo.checkPageOnSubMenu('Sales Academy')
  })

  it('Verifica aggancio Momento della Verità', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Momento della Verità')
    Mieinfo.checkLinksOnIcon('Momento della Verità')
  });

  it('Verifica aggancio Le release', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Le release')
    Mieinfo.checkPanelsOnRelease()
  });

  it('Verifica aggancio Manuali Informatici', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Manuali Informatici')
    Mieinfo.checkPanelsOnManualiInformatici()
  });

  it('Verifica aggancio Circolari', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Circolari')
  });

  it('Verifica aggancio Company Handbook', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Company Handbook')
  })

  it('Verifica aggancio Antiriciclaggio', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Antiriciclaggio')
    Mieinfo.checkLinksOnSubMenu('Antiriciclaggio')
    Mieinfo.checkLinksOnIcon('Antiriciclaggio')
  })

  it('Verifica aggancio su tutte le sotto pagine di Antiriciclaggio', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Antiriciclaggio');
    Mieinfo.checkPageOnSubMenu('Antiriciclaggio')
  })

  it.only('Verifica aggancio Risorse per l\'Agenzia', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Risorse per l\'Agenzia')
    Mieinfo.checkLinksOnSubMenu('Risorse per l\'Agenzia')
    Mieinfo.checkLinksOnIcon('Risorse per l\'Agenzia')
  });
  it.only('Verifica aggancio su tutte le sotto pagine di Risorse per l\'Agenzia', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Risorse per l\'Agenzia');
    Mieinfo.checkPageOnSubMenu('Risorse per l\'Agenzia')
  })

  it('Verifica aggancio Operatività', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Operatività')
    Mieinfo.checkPanelsOnOperativita()
  });

  it('Verifica aggancio Risorse per l\'Agente', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Risorse per l\'Agente')
    Mieinfo.checkLinksOnSubMenu('Risorse per l\'Agente')
    Mieinfo.checkLinksOnIcon('Risorse per l\'Agente')
  });
  it('Verifica aggancio su tutte le sotto pagine di Risorse per l\'Agente', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Risorse per l\'Agente');
    Mieinfo.checkPageOnSubMenu('Risorse per l\'Agente')
  })

  it('Verifica aggancio Il Mondo Allianz', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Il Mondo Allianz')
    Mieinfo.checkLinksOnSubMenu('Il Mondo Allianz')
    Mieinfo.checkLinksOnIcon('Il Mondo Allianz')
  })
  it('Verifica aggancio su tutte le sotto pagine di Il Mondo Allianz', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Il Mondo Allianz');
    Mieinfo.checkPageOnSubMenu('Il Mondo Allianz')
  })

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
})