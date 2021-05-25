/// <reference types="Cypress" />

const getIFrame = () => {
    cy.get('iframe[class="iframe-object"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-object"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class Mieinfo {

    /**
     * Verifica che tutti i link nel menu MieInfo siano presenti
     */
    static checkLinksOnMenuInfo() {
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
            'Il Mondo Allianz',
            'New Company Handbook',
            'Test New CH'
        ]
        getIFrame().find('[class="menu--link menu_padding-0"]').each(($link, i) => {
            expect($link.text().trim()).to.include(linksMenu[i]);
        })
    }

    /**
     * Click Button link su menu di MieInfo
     * @param {string} page - nome del link nel Menu
     */
    static clickButtonOnMenu(page) {
        getIFrame().contains(page).click().wait(2000)
        getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain', page)

    }

    // /**
    //  *  Click "Primo Piano" e verifica atterraggio
    //  */
    // static clickPrimoPiano() {
    //     getIFrame().contains('Primo Piano').click().wait(2000)
    //     getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain', 'Primo Piano')
    // }

    // /**
    //  *  Click "Raccolte" e verifica atterraggio
    //  */
    // static clickRaccolte() {
    //     getIFrame().contains('Raccolte').click().wait(2000)
    //     getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain', 'Primo Piano')
    // }

    // /**
    //  *  Click "Prodotti" e verifica atterraggio
    //  */
    // static clickProdotti() {
    //     getIFrame().contains('Prodotti').click().wait(2000)
    //     getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain', 'Prodotti')
    // }

    // /**
    //  *  Click "Iniziative" e verifica atterraggio
    //  */
    // static clickIniziative() {
    //     getIFrame().contains('Iniziative').click().wait(2000)
    //     getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain', 'Iniziative')
    // }

    // /**
    //  *  Click "Eventi e Sponsorizzazioni" e verifica atterraggio
    //  */
    // static clickEventiSponsorizzazioni() {
    //     getIFrame().contains('Eventi e Sponsorizzazioni').click().wait(2000)
    //     getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain', 'Eventi e Sponsorizzazioni')
    //     getIFrame().find('app-page-title').should('contain', 'Eventi').and('be.visible')
    // }

    // /**
    //  *  Click "Sales Academy" e verifica atterraggio
    //  */
    // static clickSalesAcademy() {
    //     getIFrame().contains('Sales Academy').click().wait(2000)
    //     getIFrame().find('a[class="menu--link menu--link_active menu_padding-0 menu--link_active_id"]').should('contain', 'Sales Academy')
    // }

//#region Verifica Links su Icone e subMenu 
    /**
     * Verifica che le icon links e submenu di "Prodotti" siano presenti
     */
    static checkLinkOnIconAndSubMenuProdotti() {
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
    }

    /**
     * Verifica che le cards link e submenu di "Iniziative" siano presenti
     */
    static checkLinkOnCardsAndSubMenuIniziative() {
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
    }

    /**
     * Verifica che le icon links e submenu di "Sales Academy" siano presenti
     */
    static checkLinkOnIconAndSubMenuSalesAcademy() {
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
    }


    /**
     * Verifica che le icon links e submenu di "Momento della Verità" siano presenti
     */
    static checkLinkOnSubMenuMomentoVerita() {
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
    }

    /**
     * Verifica che le icon links e submenu di "Antiriciclaggio" siano presenti
     */
    static checkLinkOnSubMenuAntiriciclaggio() {
        const linksAntiriciclaggio = [
            'Normativa',
            'Moduli, manuali e procedure',
            'Link utili'
        ]
        getIFrame().find('.product-icon--name').should('have.length', 3).each(($link, i) => {
            expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
        })
        getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
            cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 3).each(($link, i) => {
                expect($link.text().trim()).to.include(linksAntiriciclaggio[i]);
            })
        })
    }

    /**
     * Verifica che le icon links e submenu di "Risorse per l'Agenzia" siano presenti
     */
    static checkLinkOnSubMenuRisorseAgenzia() {
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
    }


    /**
     * Verifica che le icon links e submenu di "Risorse per l\'Agente" siano presenti
     */
     static checkLinkOnSubMenuRisorseAgente() {
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
    }


      /**
     * Verifica che le icon links e submenu di "Il Mondo Allianz" siano presenti
     */
       static checkLinkOnSubMenuMondoAllianz() {
        const linksMondoAllianzIcon = [
            'I codici del Gruppo Allianz SpA',
            'La rassegna stampa',
            'Agricola San Felice'
          ]
          getIFrame().find('.product-icon--name').should('have.length', 3).each(($link, i) => {
            expect($link.text().trim()).to.include(linksMondoAllianzIcon[i]);
          })
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
    }
//#endregion  

//#region Verifica Panel espansi
    /**
     * Verifica che i panel si espandono
     */
    static checkPanelsOnRelease() {
        getIFrame().find('app-accordion').contains('Matrix').click()
        getIFrame().find('#nx-expansion-panel-header-0').should('have.attr', 'aria-expanded', 'true')
        getIFrame().find('app-accordion').contains('Note di release').click()
        getIFrame().find('#nx-expansion-panel-header-1').should('have.attr', 'aria-expanded', 'true')
    }

    /**
     * Verifica che le icon links e submenu di "Manuali informatici" siano presenti
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
     * Verifica che le icon links e submenu di "Operatività" siano presenti
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

    /**
     * verifica Atterraggio "Circolari"
     */
    static checkCircolari() {
        getIFrame().find('app-page-title').should('contain', 'Circolari').and('be.visible')
    }

    /**
     * verifica Atterraggio "Company Handbook"
     */
    static checkCompanyHandbook() {
        getIFrame().find('app-dynamic-element').should('be.visible')
    }

}

export default Mieinfo