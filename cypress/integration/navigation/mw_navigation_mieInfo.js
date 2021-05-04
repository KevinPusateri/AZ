/// <reference types="Cypress" />

Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 3000
const baseUrl = Cypress.env('baseUrl') 
const interceptPageMieInfo = () =>{
  cy.intercept({
      method: 'POST',
      url: '**/lemieinfo/**' ,
    }).as('getMieInfo'); 
}

const getIFrame = () => {
    cy.get('iframe[class="iframe-object"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-object"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

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
    cy.get('input[name="Ecom_User_ID"]').type('le00080')
    cy.get('input[name="Ecom_Password"]').type('Dragonball3')
    cy.get('input[type="SUBMIT"]').click()
    cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
  
    cy.wait(2000).wait('@gqlNews')
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
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

//#region // NEW DA TESTARE
describe('Matrix Web : Navigazioni da Le Mie Info', function () {

  it('Verifica presenza links Menu', function(){
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
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
    cy.get('app-menu-voices').find('a').should('have.length',17).each(($link, i) => {
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
      'Casa condominio e petcare',
      'Infortuni e Salute',
      'Impresa e rischi dedicati',
      'Tutela Legale',
      'Vita',
      'Vita Corporate',
      'Convenzioni nazionali',
      'Convenzioni locali e offerte dedicate',
      'AGCS Italia',
      'Finanziamenti Compass'
    ]
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksProdotti[i]);
    }).should('have.length',13)

    cy.get('app-menu-voices').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksIniziative[i]);
    })
  });

  it('Verifica aggancio Iniziative', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Iniziative').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Prodotti')
    const linksIniziative = [
      'Stop&Drive',
      'Proponi LTC',
      'Proponi TCM',
      'Mensilizzazione Rami Vari',
      'Mensilizzazione Auto',
      'Clienti Valore Extra',
      'AllianzPay',
      'Busta arancione',
      'Winback Motor',
      'Decommissioning telematici',
      'Digitalizzazione del certificato',
      'Attestato di rischio dinamico',
      'Test'
    ]
    // should length
    cy.get('app-card-container').find('app-card-vertical').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksIniziative[i]);
    })
    cy.get('app-menu-voices').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksIniziative[i]);
    })
  });

  it('Verifica aggancio Eventi e Sponsorizzazioni', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Eventi e Sponsorizzazioni')
    cy.get('app-page-title').should('contain','Eventi').and('be.visible')
  });

  it('Verifica aggancio Sales Academy', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Iniziative').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Sales Academy')
    const linksSalesAcademy = [
      'Chi Siamo',
      'Allianz Business School',
      'Master Professione Agente',
      'Obblighi IVASS',
      'Formazione Multicanale',
      'Percorsi di ruolo'
    ]
    // should length
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksSalesAcademy[i]);
    })
    cy.get('app-menu-voices').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksSalesAcademy[i]);
    })
  });

  it('Verifica aggancio Momento della Verità', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Momento della Verità').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Momento della Verità')
    const linksMomentoVerita = [
      'Apertura',
      'Gestione',
      'Valutazione',
      'Pagamento',
      'Apertura',
      'Gestione'
    ]
    // should length
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksMomentoVerita[i]);
    })
  });

  it('Verifica aggancio Le release', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('La release').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','La release')
    cy.get('app-accordion').contains('Matrix').click()
    // DA PROVARE
    cy.get('#nx-expansion-panel-header-0').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Note di relase').click()
    // DA PROVARE
    cy.get('#nx-expansion-panel-header-1').should('have.attr','aria-expanded','true')

  });

  it('Verifica aggancio Manuali Informatici', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('La release').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Manuali Informatici')
    cy.get('app-accordion').contains('ADAM').click()
    cy.get('#nx-expansion-panel-header-2').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Allianz1 e Allianz1 Business').click()
    cy.get('#nx-expansion-panel-header-4').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('AllianzPay').click()
    cy.get('#nx-expansion-panel-header-5').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Allianz ULTRA').click()
    cy.get('#nx-expansion-panel-header-6').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Anagrafica Intermediari').click()
    cy.get('#nx-expansion-panel-header-7').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Antiriciclaggio').click()
    cy.get('#nx-expansion-panel-header-8').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('APP').click()
    cy.get('#nx-expansion-panel-header-9').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Auto').click()
    cy.get('#nx-expansion-panel-header-10').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Cliente').click()
    cy.get('#nx-expansion-panel-header-11').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Configurazione postazioni').click()
    cy.get('#nx-expansion-panel-header-12').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Contabilità').click()
    cy.get('#nx-expansion-panel-header-13').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Delege SDD').click()
    cy.get('#nx-expansion-panel-header-14').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('E-Payment e firma digitale').click()
    cy.get('#nx-expansion-panel-header-15').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('FastQuote').click()
    cy.get('#nx-expansion-panel-header-16').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Gestione Documentale').click()
    cy.get('#nx-expansion-panel-header-17').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Gestione Provvigionale').click()
    cy.get('#nx-expansion-panel-header-18').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Matrix Web').click()
    cy.get('#nx-expansion-panel-header-19').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Media Library').click()
    cy.get('#nx-expansion-panel-header-20').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('MidCo').click()
    cy.get('#nx-expansion-panel-header-21').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Modello Generico').click()
    cy.get('#nx-expansion-panel-header-22').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Pubblica Amministazione').click()
    cy.get('#nx-expansion-panel-header-23').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Quadratura Unificata Digital Agency').click()
    cy.get('#nx-expansion-panel-header-24').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Rami Vari').click()
    cy.get('#nx-expansion-panel-header-25').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Reportistica').click()
    cy.get('#nx-expansion-panel-header-26').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Resilience Digital Agency').click()
    cy.get('#nx-expansion-panel-header-27').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Scadenze').click()
    cy.get('#nx-expansion-panel-header-28').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Sfera').click()
    cy.get('#nx-expansion-panel-header-29').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Sinistri').click()
    cy.get('#nx-expansion-panel-header-30').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Vita Individuali - Emissione').click()
    cy.get('#nx-expansion-panel-header-31').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Vita Individuali - Gestione').click()
    cy.get('#nx-expansion-panel-header-32').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Vita Individuali - Liquidazione').click()
    cy.get('#nx-expansion-panel-header-33').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Vita Individuali - Utilità').click()
    cy.get('#nx-expansion-panel-header-34').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Vita Corporate').click()
    cy.get('#nx-expansion-panel-header-35').should('have.attr','aria-expanded','true')


  });

  it('Verifica aggancio Circolari', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Circolari').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Circolari')
    cy.get('app-page-title').should('contain','Circolari').and('be.visible')
  });

  it('Verifica aggancio Company Handbook', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Company Handbook').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Company Handbook')
    cy.get('app-page-title').should('contain','Circolari').and('be.visible')
    cy.get('app-dynamic-list').find('app-dynamic-element').should(($element) =>{
      cy.wrap($element).should('be.visible')
    });
  })

  it('Verifica aggancio Antiriciclaggio', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Antiriciclaggio').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Antiriciclaggio')
    const linksAntiriciclaggio = [
      'Normativa',
      'Moduli, manuali e procedure',
      'Link utili'
    ]
    // should length
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
    })
    cy.get('app-menu-voices').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
    })
  });

  it('Verifica aggancio Risorse per l\'Agenzia', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Risorse per l\'Agenzia').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Risorse per l\'Agenzia')
    const linksRisorseAgenzia = [
      'Reclutamento',
      'Arredare l\'agenzia',
      'Digital marketing e social media',
      'Materiali di comunicazione istituzionale',
      'Richiesta stampanti',
      'Ordini di toner e carta',
      'Catalogo prodotti tecnologici',
      'Sicurezza IT',
      'L\'app ADAM',
      'Pacchetti di sicurezza',
      'Link utili',
      'Manuali di travaso',
      'Minisito IDD',
    ]
    // should length
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgenzia[i]);
    })
    cy.get('app-menu-voices').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgenzia[i]);
    })
  });

  it('Verifica aggancio Operatività', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Operatività').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Operatività')
    cy.get('app-accordion').contains('Cambio sede').click()
    cy.get('#nx-expansion-panel-header-0').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Codici sblocco rami vari').click()
    cy.get('#nx-expansion-panel-header-1').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Contabilità').click()
    cy.get('#nx-expansion-panel-header-2').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Fatturazione elettronica').click()
    cy.get('#nx-expansion-panel-header-3').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Gestione documenti').click()
    cy.get('#nx-expansion-panel-header-4').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Gestione collaboratori').click()
    cy.get('#nx-expansion-panel-header-5').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Iniziativa whatsapp Agenti').click()
    cy.get('#nx-expansion-panel-header-6').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Informativa privacy (tedesco)').click()
    cy.get('#nx-expansion-panel-header-7').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Codice delle assicurazioni private').click()
    cy.get('#nx-expansion-panel-header-8').should('have.attr','aria-expanded','true')
    cy.get('app-accordion').contains('Titolo IX - Reg. ISVAP - Registro unico intermediari').click()
    cy.get('#nx-expansion-panel-header-9').should('have.attr','aria-expanded','true')
  });

  it('Verifica aggancio Risorse per l\'Agente', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Risorse per l\'Agente').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Risorse per l\'Agente')
    const linksRisorseAgente = [
      'Trattamenti provviggionali',
      'Incentivazioni, mission, regolamenti',
      'Convenzioni Prodotti Allianz',
      'Cassa Previdenza',
      'Le scelte di investimento',
      'Catalogo idee'
    ]
    // should length
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgente[i]);
    })
    cy.get('app-menu-voices').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgente[i]);
    })
  });

  it('Verifica aggancio Il Mondo Allianz', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    cy.get('app-menu-voices').contains('Il Mondo Allianz').click()
    cy.get('app-menu-voices').find('a[class^="menu--link menu--link_active"]').should('contain','Il Mondo Allianz')
    const linksMondoAllianz = [
      'I codici del Gruppo Allianz SpA',
      'La rassegna stampa',
      'Agricola San Felice'
    ]
    // should length
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgente[i]);
    })
    cy.get('app-menu-voices').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgente[i]);
    })
  });

});