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
    Mieinfo.clickButtonOnMenu('Primo Piano')
  })

  it('Verifica aggancio Raccolte', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Raccolte')
  });

  it('Verifica aggancio Prodotti', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Prodotti')
    Mieinfo.checkLinkOnIconAndSubMenuProdotti()

  });

  it('Verifica aggancio Iniziative', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Iniziative')
    Mieinfo.checkLinkOnCardsAndSubMenuIniziative()

  });

  it('Verifica aggancio Eventi e Sponsorizzazioni', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Eventi e Sponsorizzazioni')
  });

  it('Verifica aggancio Sales Academy', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Sales Academy')
    Mieinfo.checkLinkOnIconAndSubMenuSalesAcademy()
  });

  it('Verifica aggancio Momento della Verità', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Momento della Verità')
    Mieinfo.checkLinkOnSubMenuMomentoVerita()
  });

  it('Verifica aggancio Le release', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Le release')
    Mieinfo.checkPanelsOnRelease()
  });

  it('Verifica aggancio Manuali Informatici', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Manuali Informatici')
    Mieinfo.checkPanelsOnManualiInformatici()
  });

  it('Verifica aggancio Circolari', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Circolari')
    Mieinfo.checkCircolari()

  });

  it('Verifica aggancio Company Handbook', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Company Handbook')
    Mieinfo.checkCompanyHandbook()
  })

  it('Verifica aggancio Antiriciclaggio', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Antiriciclaggio')
    Mieinfo.checkLinkOnSubMenuAntiriciclaggio()
  })

  it('Verifica aggancio Risorse per l\'Agenzia', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Risorse per l\'Agenzia')
    Mieinfo.checkLinkOnSubMenuRisorseAgenzia()
  });

  it('Verifica aggancio Operatività', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Operatività')
    Mieinfo.checkPanelsOnOperativita()
  });

  it('Verifica aggancio Risorse per l\'Agente', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Risorse per l\'Agente')
    Mieinfo.checkLinkOnSubMenuRisorseAgente()
  });

  it('Verifica aggancio Il Mondo Allianz', function () {
    TopBar.clickMieInfo()
    Mieinfo.clickButtonOnMenu('Il Mondo Allianz')
    Mieinfo.checkLinkOnSubMenuMondoAllianz()
  })

})