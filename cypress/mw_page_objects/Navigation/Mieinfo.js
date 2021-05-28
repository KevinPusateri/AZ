/// <reference types="Cypress" />

const getIFrame = () => {
    cy.get('iframe[class="iframe-object"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-object"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const LinksMenu = {
    PRIMO_PIANO: 'Primo Piano',
    RACCOLTE: 'Raccolte',
    CONTENUTI_SALVATI: 'Contenuti Salvati',
    PRODOTTI: 'Prodotti',
    INIZIATIVE: 'Iniziative',
    EVENTI_E_SPONSORIZZAZIONI: 'Eventi e Sponsorizzazioni',
    SALES_ACADEMY: 'Sales Academy',
    MOMENTO_DELLA_VERITA: 'Momento della Verità',
    LE_RELEASE: 'Le release',
    MANUALI_INFORMATICI: 'Manuali Informatici',
    CIRCOLARI: 'Circolari',
    NEW_COMPANY_HANDBOOK: 'New Company Handbook',
    COMPANY_HANDBOOK: 'Company Handbook',
    ANTIRICICLAGGIO: 'Antiriciclaggio',
    RISORSE_PER_AGENZIA: 'Risorse per l\'Agenzia',
    OPERATIVITA: 'Operatività',
    RISORSE_PER_AGENTE: 'Risorse per l\'Agente',
    IL_MONDO_ALLIANZ: 'Il Mondo Allianz',
}

class Mieinfo {

    /**
     * Verifica che tutti i link nel menu MieInfo siano presenti
     */
    static checkLinksOnMenuInfo() {
        const linksMenu = Object.values(LinksMenu)

        getIFrame().find('[class="menu--link menu_padding-0"]').each(($link, i) => {
            expect($link.text().trim()).to.include(linksMenu[i + 1]);
        })
    }

    /**
     * Click Button link su menu di MieInfo
     * @param {string} page - nome del link nel Menu
     */
    static clickLinkOnMenu(page) {
        getIFrame().contains(page).click().wait(2000)
        getIFrame().find('a[class~="menu--link_active"]').should('contain', page)
        this.checkPageOnMenu(page)
    }

    /**
     * Verifica che i sotto link del menu della pagina corrispondano
     * @param {page} page - nome della pagina 
     */
    static checkLinksOnSubMenu(page) {
        switch (page) {
            case LinksMenu.PRODOTTI:
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
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 13).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksProdottiMenu[i]);
                    })
                })
                break
            case LinksMenu.INIZIATIVE:
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
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 13).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksIniziativeMenu[i]);
                    })
                })
                break;
            case LinksMenu.SALES_ACADEMY:
                const linksSalesAcademyMenu = [
                    'Chi Siamo',
                    'Allianz Business School',
                    'Master Professione Agente',
                    'Obblighi IVASS',
                    'Formazione Multicanale',
                    'Percorsi di ruolo'
                ]
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 6).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksSalesAcademyMenu[i]);
                    })
                })
                break;
            case LinksMenu.ANTIRICICLAGGIO:
                const linksAntiriciclaggio = [
                    'Normativa',
                    'Moduli, manuali e procedure',
                    'Link utili'
                ]
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 3).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
                    })
                })
                break;
            case LinksMenu.RISORSE_PER_AGENZIA:
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
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 13).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksRisorseAgenziaMenu[i]);
                    })
                })
                break;
            case LinksMenu.RISORSE_PER_AGENTE:
                const linksRisorseAgenteMenu = [
                    'Trattamenti provvigionali',
                    'Incentivazione, mission, regolamenti',
                    'Convenzioni Prodotti Allianz',
                    'Cassa Previdenza Agenti',
                    'Le scelte di investimento',
                    'Catalogo idee'
                ]
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 6).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksRisorseAgenteMenu[i]);
                    })
                })
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                const linksMondoAllianzMenu = [
                    'I codici di Allianz SpA',
                    'La rassegna stampa',
                    'Agricola San Felice'
                ]
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 3).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksMondoAllianzMenu[i]);
                    })
                })
                break;
        }
    }

    /**
     * Verifica che i link icon presenti nella pagina corrispondano
     * @param {page} page - nome della pagina 
     */
    static checkLinksOnIcon(page) {
        switch (page) {
            case LinksMenu.PRODOTTI:
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
                getIFrame().find('.product-icon--name').should('have.length', 13).each(($link, i) => {
                    expect($link.text().trim()).to.include(linksProdottiIcon[i]);
                })
                break
            case LinksMenu.INIZIATIVE:
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
                    'Decommissioning telematici',
                    'Digitalizzazione del certificato',
                    'Attestato di rischio dinamico'
                ]
                getIFrame().find('[class="container"]').then($card => {
                    cy.wrap($card).find('[class="grid-item card-container--elements"]').should('have.length', 12).each(($link, i) => {
                        expect($link.text().trim()).to.include(linksIniziativeCard[i]);
                    })
                })
                break;
            case LinksMenu.SALES_ACADEMY:
                const linksSalesAcademyIcon = [
                    'Chi siamo',
                    'Allianz Business School',
                    'Obblighi IVASS',
                    'Percorsi di ruolo',
                    'Formazione Multicanale',
                ]
                getIFrame().find('.product-icon--name').should('have.length', 5).each(($link, i) => {
                    expect($link.text().trim()).to.include(linksSalesAcademyIcon[i]);
                })
                break;
            case LinksMenu.ANTIRICICLAGGIO:
                const linksAntiriciclaggio = [
                    'Normativa',
                    'Moduli, manuali e procedure',
                    'Link utili'
                ]
                getIFrame().find('.product-icon--name').should('have.length', 3).each(($link, i) => {
                    expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
                })
                break;
            case LinksMenu.MOMENTO_DELLA_VERITA:
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
                getIFrame().find('.product-icon--name').should('have.length', 8).each(($link, i) => {
                    expect($link.text().trim()).to.include(linksMomentoVeritaIcon[i]);
                })
                break;
            case LinksMenu.RISORSE_PER_AGENZIA:
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
                getIFrame().find('.product-icon--name').should('have.length', 13).each(($link, i) => {
                    expect($link.text().trim()).to.include(linksRisorseAgenziaIcon[i]);
                })
                break;
            case LinksMenu.RISORSE_PER_AGENTE:
                const linksRisorseAgenteIcon = [
                    'Trattamenti provvigionali',
                    'Incentivazioni, mission, regolamenti',
                    'Convenzioni Prodotti Allianz',
                    'Cassa Previdenza Agenti',
                    'Le scelte di investimento',
                    'Catalogo idee'
                ]
                getIFrame().find('.product-icon--name').should('have.length', 6).each(($link, i) => {
                    expect($link.text().trim()).to.include(linksRisorseAgenteIcon[i]);
                })
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                const linksMondoAllianzIcon = [
                    'I codici del Gruppo Allianz SpA',
                    'La rassegna stampa',
                    'Agricola San Felice'
                ]
                getIFrame().find('.product-icon--name').should('have.length', 3).each(($link, i) => {
                    expect($link.text().trim()).to.include(linksMondoAllianzIcon[i]);
                })
                break;
        }
    }

    /**
      * Verifica atterraggio alla pagina
      * @param {string} page - Nome della pagina 
      */
    static checkPageOnMenu(page) {
        switch (page) {
            case LinksMenu.PRIMO_PIANO:
                getIFrame().find('app-principal-news').should('be.visible')
                break;
            case LinksMenu.RACCOLTE:
                getIFrame().find('h3:contains("Pronti Via")').should('be.visible')
                break;
            case LinksMenu.CONTENUTI_SALVATI:
                getIFrame().find('h1:contains("Contenuti salvati")').should('be.visible')
                break;
            case LinksMenu.PRODOTTI:
                getIFrame().find('h1:contains("Prodotti")').should('be.visible')
                break;
            case LinksMenu.INIZIATIVE:
                getIFrame().find('h1:contains("Iniziative")').should('be.visible')
                break;
            case LinksMenu.EVENTI_E_SPONSORIZZAZIONI:
                getIFrame().find('h1:contains("Eventi")').should('be.visible')
                break;
            case LinksMenu.SALES_ACADEMY:
                getIFrame().find('h1:contains("Sales Academy")').should('be.visible')
                break;
            case LinksMenu.MOMENTO_DELLA_VERITA:
                getIFrame().find('h1:contains("Momento della Verità")').should('be.visible')
                break;
            case LinksMenu.LE_RELEASE:
                getIFrame().find('h1:contains("Release")').should('be.visible')
                break;
            case LinksMenu.MANUALI_INFORMATICI:
                getIFrame().find('h1:contains("Manuali Informatici")').should('be.visible')
                break;
            case LinksMenu.CIRCOLARI:
                getIFrame().find('h1:contains("Circolari")').should('be.visible')
                break;
            case LinksMenu.COMPANY_HANDBOOK:
                getIFrame().find('app-dynamic-element').should('be.visible')
                break;
            case LinksMenu.ANTIRICICLAGGIO:
                getIFrame().find('h1:contains("Antiriciclaggio")').should('be.visible')
                break;
            case LinksMenu.RISORSE_PER_AGENZIA:
                getIFrame().find('h1:contains("Risorse per l\'Agenzia")').should('be.visible')
                break;
            case LinksMenu.OPERATIVITA:
                getIFrame().find('h1:contains("Operatività")').should('be.visible')
                break;
            case LinksMenu.RISORSE_PER_AGENTE:
                getIFrame().find('h1:contains("Risorse per l\'agente")').should('be.visible')
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                getIFrame().find('h1:contains("Il Mondo Allianz")').should('be.visible')
                break;
            case LinksMenu.NEW_COMPANY_HANDBOOK:
                break;
            case LinksMenu.TEST_NEW_CH:
                break;
        }
    }
   
    //#region Verifica Panel aperti
    /**
     * Verifica che i panel si espandono su Release
     */
    static checkPanelsOnRelease() {
        getIFrame().find('app-accordion').contains('Matrix').click()
        getIFrame().find('#nx-expansion-panel-header-0').should('have.attr', 'aria-expanded', 'true')
        getIFrame().find('app-accordion').contains('Note di release').click()
        getIFrame().find('#nx-expansion-panel-header-1').should('have.attr', 'aria-expanded', 'true')
    }

    /**
     * Verifica che i panel si espandono su "Manuali informatici"
     */
    static checkPanelsOnManualiInformatici() {
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
        for (let index = 0; index < cardManuali.length; index++) {
            getIFrame().find('#nx-expansion-panel-header-' + index).then(($card) => {
                expect($card.text().trim()).to.include(cardManuali[index]);
                getIFrame().find('nx-expansion-panel-title').contains($card.text().trim()).click()
                cy.wrap($card).should('have.attr', 'aria-expanded', 'true')
            })
        }
    }

    /**
     * Verifica che i panel si espandono su "Operatività"
    */
    static checkPanelsOnOperativita() {
        const cardOperativita = [
            'Cambio sede',
            'Codici sblocco rami vari',
            'Contabilità',
            'Fatturazione elettronica',
            'Gestione documenti',
            'Gestione collaboratori',
            'Iniziativa whatsapp Agenti',
            'Informativa privacy (tedesco)',
            'Codice delle assicurazioni private',
            'Titolo IX - Reg. ISVAP - Registro unico intermediari'
        ]
        for (let index = 0; index < cardOperativita.length; index++) {
            getIFrame().find('#nx-expansion-panel-header-' + index).then(($card) => {
                expect($card.text().trim()).to.include(cardOperativita[index]);
                getIFrame().find('nx-expansion-panel-title').contains($card.text().trim()).click()
                cy.wrap($card).should('have.attr', 'aria-expanded', 'true')
            })
        }
    }
    //#endregion

}

export default Mieinfo