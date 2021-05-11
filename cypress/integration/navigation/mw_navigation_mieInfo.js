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
  
  // after(() => {
  //   cy.get('body').then($body => {
  //       if ($body.find('.user-icon-container').length > 0) {   
  //           cy.wait(2000).get('.user-icon-container').click();
  //           cy.wait(2000).contains('Logout').click()
  //           cy.wait(delayBetweenTests)
  //       }
  //   });
  //   cy.clearCookies();
  //   cy.clearLocalStorage();
  // })


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
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Primo Piano')
  })

  it('Verifica aggancio Raccolte', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Raccolte').click().wait(2000)
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Raccolte')
  });

  it('Verifica aggancio Prodotti', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Prodotti').click().wait(2000)
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
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Iniziative').click().wait(2000)
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Iniziative')
    const linksIniziativeCard = [
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
      cy.wrap($card).find('[class="grid-item card-container--elements"]').should('have.length',12).each(($link,i) =>{
        expect($link.text().trim()).to.include(linksIniziativeCard[i]);
      })
    })
    const linksIniziativeMenu = [
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
    getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
      cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length',13).each(($link,i) =>{
        expect($link.text().trim()).to.include(linksIniziativeMenu[i]);
      })
    })
  });

  it('Verifica aggancio Eventi e Sponsorizzazioni', function () {
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Eventi e Sponsorizzazioni').click().wait(2000)
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Eventi e Sponsorizzazioni')
    getIFrame().find('app-page-title').should('contain','Eventi').and('be.visible')
  });

  it('Verifica aggancio Sales Academy', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })    
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Sales Academy').click().wait(2000)
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
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })    
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Momento della Verità').click().wait(2000)
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
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Le release').click().wait(2000)
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Le release')
    getIFrame().find('app-accordion').contains('Matrix').click()
    getIFrame().find('#nx-expansion-panel-header-0').should('have.attr','aria-expanded','true')
    getIFrame().find('app-accordion').contains('Note di release').click()
    getIFrame().find('#nx-expansion-panel-header-1').should('have.attr','aria-expanded','true')

  });

  it('Verifica aggancio Manuali Informatici', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Manuali Informatici').click()
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Manuali Informatici')
    // const l = getIFrame().find('app-dynamic-list').then(($list) =>{
    //  cy.wrap($list).find('[class="dynamic-list--element ng-star-inserted]').each(($card) =>{ $card.length})
    // })
    const cardManuali = [
      'ADAM',
      'Allianz1 e Allianz1 Business',
      'AllianzPay',
      'Allianz ULTRA',
      'Anagrafica Intermediari',
      'Antiriciclaggio',
      'APP',
      'Auto',
      'Cliente',
      'Configurazione postazioni',
      'Contabilità',
      'Deleghe SDD',
      'e-Commerce',
      'E-payment e firma digitale',
      'FastQuote',
      'Gestione Documentale',
      'Gestione Provvigionale',
      'Matrix Web',
      'Media Library',
      'MidCo',
      'Modello Generico',
      'Pubblica Amministrazione',
      'Quadratura Unificata Digital Agency',
      'Rami Vari',
      'Reportistica',
      'Resilience Digital Agency',
      'Scadenze',
      'Sfera',
      'Sinistri',
      'Vita Individuali - Emissione',
      'Vita Individuali - Gestione',
      'Vita Individuali - Liquidazione',
      'Vita Individuali - Utilità',
      'Vita Corporate'
    ]  
    for (let index = 0; index < cardManuali.length ; index++) {
      getIFrame().find('#nx-expansion-panel-header-'+index).then(($card) =>{
        expect($card.text().trim()).to.include(cardManuali[index]);
        getIFrame().find('nx-expansion-panel-title').contains($card.text().trim()).click()
        cy.wrap($card).should('have.attr','aria-expanded','true')
      })
    }
  });

  it('Verifica aggancio Circolari', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })    
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Circolari').click().wait(2000)
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Circolari')
    getIFrame().find('app-page-title').should('contain','Circolari').and('be.visible')

  });

  it('Verifica aggancio Company Handbook', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Company Handbook').click().wait(2000)
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Company Handbook')
    getIFrame().find('app-dynamic-element').should('be.visible')
  })

  it('Verifica aggancio Antiriciclaggio', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Antiriciclaggio').click().wait(2000)
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
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Risorse per l\'Agenzia').click().wait(2000)
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
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Operatività').click().wait(2000)
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

  it('Verifica aggancio Risorse per l\'Agente', function () {
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Risorse per l\'Agente').click().wait(2000)
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
    interceptPageMieInfo()
    cy.get('app-product-button-list').find('a').contains('Le mie info').click()
    cy.wait('@getMieInfo', { requestTimeout: 30000 })
    cy.url().should('eq', baseUrl + 'lemieinfo?info=1')
    getIFrame().contains('Il Mondo Allianz').click().wait(2000)
    getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain','Il Mondo Allianz')
    const linksMondoAllianzIcon = [
      'I codici del Gruppo Allianz SpA',
      'La rassegna stampa',
      'Agricola San Felice'
    ]
    getIFrame().find('.product-icon--name').should('have.length',3).each(($link,i) =>{
      expect($link.text().trim()).to.include(linksMondoAllianzIcon[i]);
    })
    const linksMondoAllianzMenu = [
      'I codici di Allianz SpA',
      'La rassegna stampa',
      'Agricola San Felice'
    ]
    getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
      cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length',3).each(($link,i) =>{
        expect($link.text().trim()).to.include(linksMondoAllianzMenu[i]);
      })
    })
  })

})