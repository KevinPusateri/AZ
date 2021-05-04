/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 3000


const getIFrame = () => {
    cy.get('iframe[class="iframe-object"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-object"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const backToClients = () => cy.get('a').contains('Clients').click().wait(5000)

before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  
    cy.intercept('POST', '/graphql', (req) => {
    // if (req.body.operationName.includes('notifications')) {
    //     req.alias = 'gqlNotifications'
    // }
    if (req.body.operationName.includes('news')) {
        req.alias = 'gqlNews'
    }
    })
    cy.viewport(1920, 1080)
  
    cy.visit('https://matrix.pp.azi.allianz.it/')
    cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
    cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait(2000).wait('@gqlNews')
  })
  
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('https://matrix.pp.azi.allianz.it/')
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return true;
      }
    })
  })
  
  after(() => {
    cy.get('body').then($body => {
        if ($body.find('.user-icon-container').length > 0) {   
            cy.get('.user-icon-container').click();
            cy.wait(1000).contains('Logout').click()
            cy.wait(delayBetweenTests)
        }
    });
    cy.clearCookies();
  })

describe('Matrix Web : Navigazioni da Le Mie Info', function () {

  //#region // NEW DA TESTARE  
  it('Verifica presenza links Menu', function(){
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    
    const linksMenu = [
      'Primo Piano',
      'Raccolte',
      'Contenuti Salvati',
      'Prodotti',
      'Iniziative',
      'Eventi e Sponsorizzazioni',
      'Sales Academy',
      'Momento della Verità',
      'Le release',
      'Manuali Informatici',
      'Circolari',
      'Company Handbook',
      'Antiriciclaggio',
      'Risorse per l\'Agenzia',
      'Operatività',
      'Risorse per l\'Agente',
      'Il Mondo Allianz'
    ]
    cy.get('app-home-right-section').find('app-rapid-link').should('have.length',4).each(($link, i) => {
        expect($link.text().trim()).to.include(linksMenu[i]);
    })
  })

  it('Verifica aggancio Primo Piano', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Primo Piano').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Primo Piano')
  })

  it('Verifica aggancio Raccolte', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Raccolte').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Raccolte')
  });

  it('Verifica aggancio Prodotti', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Raccolte').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Prodotti')
    const linksProdotti = [
      'Allianz Ultra',
      'Allianz1 Business',
      'Auto e Motori',
      'Casa',
      'Infortuni e Salute',
      'Impresa e Rischi dedicati',
      'Tutela Legale',
      'Vita',
      'Vita Corporate',
      'Convenzioni Nazionali',
      'Circolari',
      'Company Handbook',
      'Antiriciclaggio',
      'Risorse per l\'Agenzia',
      'Operatività',
      'Risorse per l\'Agente',
      'Il Mondo Allianz'
    ]
    cy.get('app-product-icons').find('app-product-icon').each(($link) =>{

    })


  });

  it('Verifica aggancio Iniziative', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Eventi e Sponsorizzazioni', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Sales Academy', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Momento della Verità', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Le release', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Manuali Informatici', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Circolari', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Company Handbook', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Antiriciclaggio', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Risorse per l\'Agenzia', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Operatività', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Risorse per l\'Agente', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

  it('Verifica aggancio Il Mondo Allianz', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
  });

});