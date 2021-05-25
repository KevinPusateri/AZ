/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/
/// <reference types="Cypress" />


import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Mieinfo from "../../mw_page_objects/Navigation/Mieinfo"

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
    // getIFrame().find('app-accordion').contains('Cambio sede').click()
    // getIFrame().find('#nx-expansion-panel-header-0').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Codici sblocco rami vari').click()
    // getIFrame().find('#nx-expansion-panel-header-1').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Contabilità').click()
    // getIFrame().find('#nx-expansion-panel-header-2').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Fatturazione elettronica').click()
    // getIFrame().find('#nx-expansion-panel-header-3').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Gestione documenti').click()
    // getIFrame().find('#nx-expansion-panel-header-4').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Gestione collaboratori').click()
    // getIFrame().find('#nx-expansion-panel-header-5').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Iniziativa whatsapp Agenti').click()
    // getIFrame().find('#nx-expansion-panel-header-6').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Informativa privacy (tedesco)').click()
    // getIFrame().find('#nx-expansion-panel-header-7').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Codice delle assicurazioni private').click()
    // getIFrame().find('#nx-expansion-panel-header-8').should('have.attr', 'aria-expanded', 'true')
    // getIFrame().find('app-accordion').contains('Titolo IX - Reg. ISVAP - Registro unico intermediari').click()
    // getIFrame().find('#nx-expansion-panel-header-9').should('have.attr', 'aria-expanded', 'true')
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