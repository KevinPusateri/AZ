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
  
  // after(() => {
  //   cy.get('body').then($body => {
  //       if ($body.find('.user-icon-container').length > 0) {   
  //           cy.wait(1000).get('.user-icon-container').click();
  //           cy.wait(1000).contains('Logout').click()
  //           cy.wait(delayBetweenTests)
  //       }
  //   });
  //   cy.clearCookies();
  //   cy.clearLocalStorage();
  // })

// NEW DA TESTARE
describe('Matrix Web : Navigazioni da Le Mie Info', function () {

  it('Verifica presenza links Menu', function(){
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    const linksMenu = [
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
    getIFrame().find('[class="menu--link menu_padding-0"]').each(($link, i) => {
        expect($link.text().trim()).to.include(linksMenu[i]);
    })
  })

  it('Verifica aggancio Primo Piano', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Primo Piano').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Primo Piano')
  })

  it('Verifica aggancio Raccolte', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Raccolte').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Raccolte')
  });

  it('Verifica aggancio Prodotti', function () {
    cy.intercept('POST','**/lemieinfo/**').as('pageInfo')
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@pageInfo')
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Prodotti').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Prodotti')
    const linksProdottiIcon = [
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
      'Convenzioni locali e Offerte dedicate',
      'AGCS Italia',
      'Finanziamenti Compass'
    ]
    getIFrame().find('.product-icon--name').should('have.length',13).each(($link,i) =>{
      expect($link.text().trim()).to.include(linksProdottiIcon[i]);
    })
    const linksProdottiMenu = [
      'Allianz Ultra',
      'Allianz1 Business',
      'Auto e Motori',
      'Casa condominio e petcare',
      'Infortuni e salute',
      'Impresa e rischi dedicati',
      'Tutela Legale',
      'Vita',
      'Vita Corporate',
      'Convenzioni nazionali',
      'Convenzioni locali e offerte dedicate',
      'AGCS Italia',
      'Finanziamenti Compass'
    ]
    getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
        cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length',13).each(($link,i) =>{
          expect($link.text().trim()).to.include(linksProdottiMenu[i]);
        })
    })

  });

  it('Verifica aggancio Iniziative', function () {
    cy.intercept('POST','**/lemieinfo/**').as('pageInfo')
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@pageInfo')
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Iniziative').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Iniziative')
    const linksIniziative = [
      'Stop&Drive',
      'Proponi LTC',
      'Proponi TCM',
      'Mensilizzazione Rami Vari',
      'Mensilizzazione Auto',
      'Clienti Valore Extra',
      'Allianzpay',
      'Busta Arancione',
      'Winback Motor',
      'Decomissioning telematici',
      'Digitalizzazione del certificato',
      'Attestato di rischio dinamico'
    ]
    getIFrame().find('[class="container"]').then($card => {
      cy.wrap($card).find('[class="grid-item card-container--elements"]').each(($link,i) =>{
        expect($link.text().trim()).to.include(linksIniziative[i]);
      })
    })
    // should length
    // cy.get('app-card-container').find('app-card-vertical').each(($link,i) =>{
    //   expect($link.text().trim()).to.include(linksIniziative[i]);
    // })
    // getIFrame().find('app-menu > a').find('a').each(($link,i) =>{
    //   expect($link.text().trim()).to.include(linksIniziative[i]);
    // })
  });

  it('Verifica aggancio Eventi e Sponsorizzazioni', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Eventi e Sponsorizzazioni').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Eventi e Sponsorizzazioni')
    getIFrame().find('app-page-title').should('contain','Eventi').and('be.visible')
  });

  it('Verifica aggancio Sales Academy', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Sales Academy').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Sales Academy')
    const linksSalesAcademyIcon = [
      'Chi siamo',
      'Allianz Business School',
      'Obblighi IVASS',
      'Percorsi di ruolo',
      'Formazione Multicanale',
    ]
    getIFrame().find('.product-icon--name').should('have.length',5).each(($link,i) =>{
      expect($link.text().trim()).to.include(linksSalesAcademyIcon[i]);
    })
    const linksSalesAcademyMenu = [
      'Chi Siamo',
      'Allianz Business School',
      'Master Professione Agente',
      'Obblighi IVASS',
      'Formazione Multicanale',
      'Percorsi di ruolo'
    ]
    getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
      cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length',6).each(($link,i) =>{
        expect($link.text().trim()).to.include(linksSalesAcademyMenu[i]);
      })
    })
  });

  it('Verifica aggancio Momento della Verità', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Momento della Verità').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Momento della Verità')
    const linksMomentoVeritaIcon = [
      'Apertura',
      'Gestione',
      'Valutazione',
      'Pagamento',
      'Apertura',
      'Gestione',
      'Valutazione',
      'Pagamento'

    ]
    getIFrame().find('.product-icon--name').should('have.length',8).each(($link,i) =>{
      expect($link.text().trim()).to.include(linksMomentoVeritaIcon[i]);
    })
  });

  it('Verifica aggancio Le release', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Le release').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Le release')
    getIFrame().find('app-accordion').contains('Matrix').click()
    getIFrame().find('#nx-expansion-panel-header-0').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Note di release').click()
    getIFrame().find('#nx-expansion-panel-header-1').should('have.attr','aria-expanded','true')

  });

  // TODO: non legge aria-expanded
  it('Verifica aggancio Manuali Informatici', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Manuali Informatici').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Manuali Informatici')
    getIFrame().find('app-accordion').contains('ADAM').click()
    getIFrame().find('#nx-expansion-panel-header-2').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Allianz1 e Allianz1 Business').click()
    // getIFrame().find('#nx-expansion-panel-header-3').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('AllianzPay').click()
    // getIFrame().find('#nx-expansion-panel-header-4').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Allianz ULTRA').click()
    // getIFrame().find('#nx-expansion-panel-header-5').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Anagrafica Intermediari').click()
    // getIFrame().find('#nx-expansion-panel-header-6').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Antiriciclaggio').click()
    // getIFrame().find('#nx-expansion-panel-header-7').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('APP').click()
    // getIFrame().find('#nx-expansion-panel-header-8').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Auto').click()
    // getIFrame().find('#nx-expansion-panel-header-9').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Cliente').click()
    // getIFrame().find('#nx-expansion-panel-header-10').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Configurazione postazioni').click()
    // getIFrame().find('#nx-expansion-panel-header-11').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Contabilità').click()
    // getIFrame().find('#nx-expansion-panel-header-12').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Delege SDD').click()
    // getIFrame().find('#nx-expansion-panel-header-13').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('E-Payment e firma digitale').click()
    // getIFrame().find('#nx-expansion-panel-header-14').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('FastQuote').click()
    // getIFrame().find('#nx-expansion-panel-header-15').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Gestione Documentale').click()
    // getIFrame().find('#nx-expansion-panel-header-16').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Gestione Provvigionale').click()
    // getIFrame().find('#nx-expansion-panel-header-17').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Matrix Web').click()
    // getIFrame().find('#nx-expansion-panel-header-18').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Media Library').click()
    // getIFrame().find('#nx-expansion-panel-header-19').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('MidCo').click()
    // getIFrame().find('#nx-expansion-panel-header-20').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Modello Generico').click()
    // getIFrame().find('#nx-expansion-panel-header-21').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Pubblica Amministazione').click()
    // getIFrame().find('#nx-expansion-panel-header-22').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Quadratura Unificata Digital Agency').click()
    // getIFrame().find('#nx-expansion-panel-header-23').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Rami Vari').click()
    // getIFrame().find('#nx-expansion-panel-header-24').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Reportistica').click()
    // getIFrame().find('#nx-expansion-panel-header-25').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Resilience Digital Agency').click()
    // getIFrame().find('#nx-expansion-panel-header-26').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Scadenze').click()
    // getIFrame().find('#nx-expansion-panel-header-27').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Sfera').click()
    // getIFrame().find('#nx-expansion-panel-header-28').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Sinistri').click()
    // getIFrame().find('#nx-expansion-panel-header-29').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Vita Individuali - Emissione').click()
    // getIFrame().find('#nx-expansion-panel-header-30').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Vita Individuali - Gestione').click()
    // getIFrame().find('#nx-expansion-panel-header-31').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Vita Individuali - Liquidazione').click()
    // getIFrame().find('#nx-expansion-panel-header-32').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Vita Individuali - Utilità').click()
    // getIFrame().find('#nx-expansion-panel-header-33').should('have.attr','aria-expanded','true')
    // getIFrame().find('app-accordion').contains('Vita Corporate').click()
    // getIFrame().find('#nx-expansion-panel-header-34').should('have.attr','aria-expanded','true')


  });

  it('Verifica aggancio Circolari', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Circolari').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Circolari')
    getIFrame().find('app-page-title').should('contain','Circolari').and('be.visible')

  });

  it('Verifica aggancio Company Handbook', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Company Handbook').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Company Handbook')
    getIFrame().find('app-dynamic-element').should('be.visible')
  })

  it('Verifica aggancio Antiriciclaggio', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Antiriciclaggio').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Antiriciclaggio')
    const linksAntiriciclaggio = [
      'Normativa',
      'Moduli, manuali e procedure',
      'Link utili'
    ]
    getIFrame().find('.product-icon--name').should('have.length',3).each(($link,i) =>{
      expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
    })
    getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
      cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length',3).each(($link,i) =>{
        expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
      })
    })
  });

  it('Verifica aggancio Risorse per l\'Agenzia', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Risorse per l\'Agenzia').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Risorse per l\'Agenzia')
    const linksRisorseAgenziaIcon = [
      'Reclutamento',
      'Arredare l\'agenzia',
      'Digital marketing e social media',
      'Materiali di comunicazione istituzionale',
      'Richiesta stampati',
      'Ordini di toner e carta',
      'Catalogo prodotti tecnologici',
      'Sicurezza IT',
      'L\'app ADAM',
      'Pacchetti di sicurezza',
      'Link utili',
      'Manuali di travaso MISA',
      'Minisito IDD',
    ]
    getIFrame().find('.product-icon--name').should('have.length',13).each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgenziaIcon[i]);
    })
    const linksRisorseAgenziaMenu = [
      'Reclutamento',
      'Arredare l\'Agenzia',
      'Digital Marketing e Social Media',
      'Materiali di comunicazione',
      'Richiesta stampati',
      'Ordini di toner e carta',
      'Cataloghi prodotti tecnologici',
      'Sicurezza IT',
      'L\'app ADAM',
      'Pacchetti di sicurezza',
      'Riferimenti aziendali',
      'Link utili',
      'Minisito IDD',
    ]
    getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
      cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length',13).each(($link,i) =>{
        expect($link.text().trim()).to.include(linksRisorseAgenziaMenu[i]);
      })
    })
  });

  it('Verifica aggancio Operatività', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Operatività').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Operatività')
    getIFrame().find('app-accordion').contains('Cambio sede').click()
    getIFrame().find('#nx-expansion-panel-header-0').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Codici sblocco rami vari').click()
    getIFrame().find('#nx-expansion-panel-header-1').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Contabilità').click()
    getIFrame().find('#nx-expansion-panel-header-2').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Fatturazione elettronica').click()
    getIFrame().find('#nx-expansion-panel-header-3').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Gestione documenti').click()
    getIFrame().find('#nx-expansion-panel-header-4').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Gestione collaboratori').click()
    getIFrame().find('#nx-expansion-panel-header-5').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Iniziativa whatsapp Agenti').click()
    getIFrame().find('#nx-expansion-panel-header-6').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Informativa privacy (tedesco)').click()
    getIFrame().find('#nx-expansion-panel-header-7').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Codice delle assicurazioni private').click()
    getIFrame().find('#nx-expansion-panel-header-8').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Titolo IX - Reg. ISVAP - Registro unico intermediari').click()
    getIFrame().find('#nx-expansion-panel-header-9').should('have.attr','aria-expanded','true')
  });

  // TODO
  it.only('Verifica aggancio Risorse per l\'Agente', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Risorse per l\'Agente').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Risorse per l\'Agente')
    const linksRisorseAgenteIcon = [
      'Trattamenti provvigionali',
      'Incentivazioni, mission, regolamenti',
      'Convenzioni Prodotti Allianz',
      'Cassa Previdenza Agenti',
      'Le scelte di investimento',
      'Catalogo idee'
    ]
    getIFrame().find('.product-icon--name').should('have.length',6).each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgenteIcon[i]);
    })
    const linksRisorseAgenteMenu = [
      'Trattamenti provvigionali',
      'Incentivazione, mission, regolamenti',
      'Convenzioni Prodotti Allianz',
      'Cassa Previdenza Agenti',
      'Le scelte di investimento',
      'Catalogo idee'
    ]
    getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
      cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length',6).each(($link,i) =>{
        expect($link.text().trim()).to.include(linksRisorseAgenteMenu[i]);
      })
    })
  });

  it('Verifica aggancio Il Mondo Allianz', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('span').contains('Il Mondo Allianz').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Il Mondo Allianz')
    const linksMondoAllianz = [
      'I codici del Gruppo Allianz SpA',
      'La rassegna stampa',
      'Agricola San Felice'
    ]
    // should length
    cy.get('app-product-icons').find('app-product-icon').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgente[i]);
    })
   getIFrame().find('app-menu > a').find('a').each(($link,i) =>{
      expect($link.text().trim()).to.include(linksRisorseAgente[i]);
    })
  });

});