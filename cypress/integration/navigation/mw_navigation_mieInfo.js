/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/
/// <reference types="Cypress" />


import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Mieinfo from "../../mw_page_objects/navigation/Mieinfo"

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


describe('Matrix Web : Navigazioni da Le Mie Info', function () {

  it('Verifica presenza links Menu', function () {
    TopBar.clickMieInfo()
    Mieinfo.checkLinksOnMenuInfo()
  })

  it('Verifica aggancio Primo Piano', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Primo Piano')
  })

  it('Verifica aggancio Raccolte', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Raccolte')
  });

  // ADD TFS
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

  it('Verifica aggancio Iniziative', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Iniziative')
    Mieinfo.checkLinksOnSubMenu('Iniziative')
    Mieinfo.checkLinksOnIcon('Iniziative')
  });

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
    Mieinfo.checkCircolari()

  });

  // ADD TFS -> Pagina Vuota
  // it('Verifica aggancio New Company Handbook', function () {
  
  // })

  it('Verifica aggancio Company Handbook', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Company Handbook')
    Mieinfo.checkCompanyHandbook()
  })

  it('Verifica aggancio Antiriciclaggio', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Antiriciclaggio')
    Mieinfo.checkLinksOnSubMenu('Antiriciclaggio')
    Mieinfo.checkLinksOnIcon('Antiriciclaggio')
  })

  it('Verifica aggancio Risorse per l\'Agenzia', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Risorse per l\'Agenzia')
    Mieinfo.checkLinksOnSubMenu('Risorse per l\'Agenzia')
    Mieinfo.checkLinksOnIcon('Risorse per l\'Agenzia')
  });

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

  it('Verifica aggancio Il Mondo Allianz', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickLinkOnMenu('Il Mondo Allianz')
    Mieinfo.checkLinksOnSubMenu('Il Mondo Allianz')
    Mieinfo.checkLinksOnIcon('Il Mondo Allianz')
  })

})