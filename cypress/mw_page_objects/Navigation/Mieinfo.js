/// <reference types="Cypress" />
import LinkMieInfo from "../navigation/LinkMieInfo"

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
        const linksMenu = Object.values(LinkMieInfo.getLinksMenu())

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
        var checkLinks = []
        const LinksMenu = LinkMieInfo.getLinksMenu()
        const linksSubMenu = LinkMieInfo.getLinksSubMenu()

        switch (page) {
            case LinksMenu.PRODOTTI:
                checkLinks = Object.values(linksSubMenu.PRODOTTI)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim()).to.include(checkLinks[i]);
                    })
                })
                break
            case LinksMenu.INIZIATIVE:
                checkLinks = Object.values(LinksSubMenu.INIZIATIVE)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim()).to.include(checkLinks[i]);
                    })
                })
                break;
            case LinksMenu.SALES_ACADEMY:
                checkLinks = Object.values(LinksSubMenu.SALES_ACADEMY)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim()).to.include(checkLinks[i]);
                    })
                })
                break;
            case LinksMenu.ANTIRICICLAGGIO:
                checkLinks = Object.values(LinksSubMenu.ANTIRICICLAGGIO)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim()).to.include(checkLinks[i]);
                    })
                })
                break;
            case LinksMenu.RISORSE_PER_AGENZIA:
                checkLinks = Object.values(LinksSubMenu.RISORSE_PER_AGENZIA)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim()).to.include(checkLinks[i]);
                    })
                })
                break;
            case LinksMenu.RISORSE_PER_AGENTE:
                checkLinks = Object.values(LinksSubMenu.RISORSE_PER_AGENTE)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 6).each(($link, i) => {
                        expect($link.text().trim()).to.include(checkLinks[i]);
                    })
                })
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                checkLinks = Object.values(LinksSubMenu.IL_MONDO_ALLIANZ)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 3).each(($link, i) => {
                        expect($link.text().trim()).to.include(checkLinks[i]);
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
        const LinksMenu = LinkMieInfo.getLinksMenu()
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
                getIFrame().find('.product-icon--name').each(($link, i) => {
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
                getIFrame().find('.product-icon--name').each(($link, i) => {
                    expect($link.text().trim()).to.include(linksSalesAcademyIcon[i]);
                })
                break;
            case LinksMenu.NEW_COMPANY_HANDBOOK:
                const linksNewCompanyHandbookMenu = [
                    'ACH',
                ]
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim()).to.include(linksNewCompanyHandbookMenu[i]);
                    })
                })
                break;
            case LinksMenu.ANTIRICICLAGGIO:
                const linksAntiriciclaggio = [
                    'Normativa',
                    'Moduli, manuali e procedure',
                    'Link utili'
                ]
                getIFrame().find('.product-icon--name').each(($link, i) => {
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
                getIFrame().find('.product-icon--name').each(($link, i) => {
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
                getIFrame().find('.product-icon--name').each(($link, i) => {
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
                getIFrame().find('.product-icon--name').each(($link, i) => {
                    expect($link.text().trim()).to.include(linksRisorseAgenteIcon[i]);
                })
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                const linksMondoAllianzIcon = [
                    'I codici del Gruppo Allianz SpA',
                    'La rassegna stampa',
                    'Agricola San Felice'
                ]
                getIFrame().find('.product-icon--name').each(($link, i) => {
                    expect($link.text().trim()).to.include(linksMondoAllianzIcon[i]);
                })
                break;
        }
    }


    /**
      * Verifica atterraggio alla pagina
      * @param {string} page - Nome della pagina dal menu principale
      */
    static checkPageOnMenu(page) {
        const LinksMenu = LinkMieInfo.getLinksMenu()
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
        }
    }

    /**
     * Verifica atterraggio delle sotto pagine
     * @param {string} page - Nome della pagina(parent)
     */
    static checkPageOnSubMenu(page) {
        const LinksMenu = LinkMieInfo.getLinksMenu()
        switch (page) {
            case LinksMenu.PRODOTTI:
                this.checkAllPagesOnProdotti()
                break;
            case LinksMenu.INIZIATIVE:
                this.checkAllPagesOnIniziative()
                break;
            case LinksMenu.SALES_ACADEMY:
                this.checkAllPagesOnSalesAcademy()
                break;
            case LinksMenu.INIZIATIVE:
                this.checkAllPagesNewCompanyHandbook()
                break;
            case LinksMenu.ANTIRICICLAGGIO:
                this.checkAllPagesAntiriciclaggio()
                break;
            case LinksMenu.RISORSE_PER_AGENZIA:
                this.checkAllPagesRisorsePerAgenzia()
                break;
            case LinksMenu.RISORSE_PER_AGENTE:
                this.checkAllPagesRisorsePerAgente()
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                this.checkAllPagesIlMondoAllianz()  
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



    static checkAllPagesOnProdotti() {
        const linksProdotti = LinkMieInfo.getLinksSubMenu().PRODOTTI
        cy.contains('Allianz Ultra').click()
        getIFrame().find('h1:contains("Allianz Ultra")').should('be.visible')

        cy.contains(linksProdotti.ALLIANZ1_BUSINESS).click()
        getIFrame().find('h1:contains("Allianz1 Business")').should('be.visible')

        cy.contains(linksProdotti.AUTO_E_MOTORI).click()
        getIFrame().find('h1:contains("Auto e Motori")').should('be.visible')

        cy.contains(linksProdotti.CASA_CONDOMINIO_E_PETCARE).click()
        getIFrame().find('h1:contains("Casa")').should('be.visible')

        cy.contains(linksProdotti.INFORTUNI_E_SALUTE).click()
        getIFrame().find('h1:contains("Infortuni e Salute")').should('be.visible')

        cy.contains(linksProdotti.IMPRESA_E_RISCHI_DEDICATI).click()
        getIFrame().find('h1:contains("Impresa e rischi dedicati")').should('be.visible')

        cy.contains(linksProdotti.TUTELA_LEGALE).click()
        getIFrame().find('h1:contains("Tutela Legale")').should('be.visible')

        cy.contains(linksProdotti.CASA_CONDOMINIO_E_PETCARE).click()
        getIFrame().find('h1:contains("Vita")').should('be.visible')

        cy.contains(linksProdotti.VITA_CORPORATE).click()
        getIFrame().find('h1:contains("Vita Corporate")').should('be.visible')

        cy.contains(linksProdotti.CONVENZIONI_NAZIONALI).click()
        getIFrame().find('h1:contains("Convenzioni nazionali")').should('be.visible')

        cy.contains(linksProdotti.CONVENZIONI_LOCALI_E_OFFERTE_DEDICATE).click()
        getIFrame().find('h1:contains("Convenzioni locali e Offerte dedicate")').should('be.visible')

        cy.contains(linksProdotti.AGCS_ITALIA).click()
        getIFrame().find('h1:contains("AGCS")').should('be.visible')

        cy.contains(linksProdotti.FINANZIAMENTI_COMPASS).click()
        getIFrame().find('h1:contains("Finanziamenti Compass")').should('be.visible')
    }

    static checkAllPagesOnIniziative() {
        const linksIniziative = LinkMieInfo.getLinksSubMenu().INIZIATIVE
        cy.contains(linksIniziative.STOPDRIVE).click()
        getIFrame().find('h1:contains("' + linksIniziative.STOPDRIVE + '")').should('be.visible')

        cy.contains(linksIniziative.PROPONI_LTC).click()
        getIFrame().find('h1:contains("' + linksIniziative.PROPONI_LTC + '")').should('be.visible')

        cy.contains(linksIniziative.PROPONI_TCM).click()
        getIFrame().find('h1:contains("' + linksIniziative.PROPONI_TCM + '")').should('be.visible')

        cy.contains(linksIniziative.MENSILIZZAZIONE_RAMI_VARI).click()
        getIFrame().find('h1:contains("' + linksIniziative.MENSILIZZAZIONE_RAMI_VARI + '")').should('be.visible')

        cy.contains(linksIniziative.MENSILIZZAZIONE_AUTO).click()
        getIFrame().find('h1:contains("' + linksIniziative.MENSILIZZAZIONE_AUTO + '")').should('be.visible')

        cy.contains(linksIniziative.CLIENTI_VALORE_EXTRA).click()
        getIFrame().find('h1:contains("' + linksIniziative.CLIENTI_VALORE_EXTRA + '")').should('be.visible')

        cy.contains(linksIniziative.ALLIANZPAY).click()
        getIFrame().find('h1:contains("' + linksIniziative.ALLIANZPAY + '")').should('be.visible')

        cy.contains(linksIniziative.BUSTA_ARANCIONE).click()
        getIFrame().find('h1:contains("' + linksIniziative.BUSTA_ARANCIONE + '")').should('be.visible')

        cy.contains(linksIniziative.WINBACK_MOTOR).click()
        getIFrame().find('h1:contains("' + linksIniziative.WINBACK_MOTOR + '")').should('be.visible')

        cy.contains(linksIniziative.DECOMMISSIONING_TELEMATICI).click()
        getIFrame().find('h1:contains("' + linksIniziative.DECOMMISSIONING_TELEMATICI + '")').should('be.visible')

        cy.contains(linksIniziative.DIGITALIZZAZIONE_DEL_CERTIFICATO_ASSICURAZTIVO_MOTOR).click()
        getIFrame().find('h1:contains("' + linksIniziative.DIGITALIZZAZIONE_DEL_CERTIFICATO_ASSICURAZTIVO_MOTOR + '")').should('be.visible')

        cy.contains(linksIniziative.ATTESTATO_DI_RISCHIO_DINAMICO).click()
        getIFrame().find('h1:contains("' + linksIniziative.ATTESTATO_DI_RISCHIO_DINAMICO + '")').should('be.visible')

        cy.contains(linksIniziative.TEST).click()
        getIFrame().find('h1:contains("' + linksIniziative.TEST + '")').should('be.visible')
    }

    static checkAllPagesOnSalesAcademy() {
        const linksSalesAcademy = LinkMieInfo.getLinksSubMenu().SALES_ACADEMY
        cy.contains(linksSalesAcademy.CHI_SIAMO).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.CHI_SIAMO + '")').should('be.visible') // errore

        cy.contains(linksSalesAcademy.ALLIANZ_BUSINESS_SCHOOL).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.ALLIANZ_BUSINESS_SCHOOL + '")').should('be.visible')

        cy.contains(linksSalesAcademy.MASTER_PROFESSIONE_AGENTE).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.MASTER_PROFESSIONE_AGENTE + '")').should('be.visible')

        cy.contains(linksSalesAcademy.OBBLIGHI_IVASS).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.OBBLIGHI_IVASS + '")').should('be.visible')

        cy.contains(linksSalesAcademy.FORMAZIONE_MULTICANALE).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.FORMAZIONE_MULTICANALE + '")').should('be.visible')

        cy.contains(linksSalesAcademy.PERCORSI_DI_RUOLO).click()
        getIFrame().find('h1:contains("Oltre l’offerta: Percorsi di sviluppo dedicati")').should('be.visible')

    }

    static checkAllPagesNewCompanyHandbook() {
    }

    static checkAllPagesAntiriciclaggio() {
        const linksSalesAcademy = LinkMieInfo.getLinksSubMenu().ANTIRICICLAGGIO
        cy.contains(linksSalesAcademy.NORMATIVA).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.NORMATIVA + '")').should('be.visible')

        cy.contains(linksSalesAcademy.MODULI_MANUALI_E_PROCEDURE).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.MODULI_MANUALI_E_PROCEDURE + '")').should('be.visible')

        cy.contains(linksSalesAcademy.LINK_UTILI).click()
        getIFrame().find('h1:contains("' + linksSalesAcademy.LINK_UTILI + '")').should('be.visible')
    }

    static checkAllPagesRisorsePerAgenzia() {
        const linksRisorseAgenzie = LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENZIA
        cy.contains(linksRisorseAgenzie.RECLUTAMENTO).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RECLUTAMENTO + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.ARREDARE_AGENZIA).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.ARREDARE_AGENZIA + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.DIGITAL_MARKETING_E_SOCIAL_MEDIA).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RECDIGITAL_MARKETING_E_SOCIAL_MEDIALUTAMENTO + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.MATERIALI_DI_COMUNICAZIONE).click()
        getIFrame().find('h1:contains("' + MATERIALI_DI_COMUNICAZIONE.RECLUTAMENTO + ' istituzionale")').should('be.visible')

        cy.contains(linksRisorseAgenzie.RECLUTAMENTO).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RECLUTAMENTO + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.RICHIESTA_STAMPATI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RICHIESTA_STAMPATI + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.ORDINI_DI_TONER_E_CARTA).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.ORDINI_DI_TONER_E_CARTA + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.CATALOGHI_PRODOTTI_TECNOLOGICI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.CATALOGHI_PRODOTTI_TECNOLOGICI + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.SICUREZZA_IT).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.SICUREZZA_IT + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.APP_ADAM).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.APP_ADAM + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.PACCHETTI_DI_SICUREZZA).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.PACCHETTI_DI_SICUREZZA + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.RIFERIMENTI_AZIENDALI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RIFERIMENTI_AZIENDALI + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.LINK_UTILI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.LINK_UTILI + '")').should('be.visible')

        cy.contains(linksRisorseAgenzie.MINISITO_IDD).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.MINISITO_IDD + '")').should('be.visible')


    }

    static checkAllPagesRisorsePerAgente() {
        const linksRisorseAgente = LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENTE
        cy.contains(linksRisorseAgente.TRATTAMENTI_PROVVIGIONALI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.TRATTAMENTI_PROVVIGIONALI + '")').should('be.visible')

        cy.contains(linksRisorseAgente.INCENTIVAZIONE_MISSION_REGOLAMENTI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.INCENTIVAZIONE_MISSION_REGOLAMENTI + '")').should('be.visible')

        cy.contains(linksRisorseAgente.CONVENZIONI_PRODOTTI_ALLIANZ).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.CONVENZIONI_PRODOTTI_ALLIANZ + '")').should('be.visible')

        cy.contains(linksRisorseAgente.CASSA_PREVIDENZA_AGENTI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.CASSA_PREVIDENZA_AGENTI + '")').should('be.visible')

        cy.contains(linksRisorseAgente.LE_SCELTE_DI_INVESTIMENTO).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.LE_SCELTE_DI_INVESTIMENTO + '")').should('be.visible')

        cy.contains(linksRisorseAgente.CATALOGO_IDEE).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.CATALOGO_IDEE + '")').should('be.visible')
    }

    static checkAllPagesIlMondoAllianz(){
        const linksMondoAllianz = LinkMieInfo.getLinksSubMenu().IL_MONDO_ALLIANZ
        cy.contains(linksMondoAllianz.I_CODICI_DI_ALLIANZ_SPA).click()
        getIFrame().find('h1:contains("' + linksMondoAllianz.I_CODICI_DI_ALLIANZ_SPA + '")').should('be.visible')
  
        cy.contains(linksMondoAllianz.LA_RASSEGNA_STAMPA).click()
        getIFrame().find('h1:contains("' + linksMondoAllianz.LA_RASSEGNA_STAMPA + '")').should('be.visible')

        cy.contains(linksMondoAllianz.AGRICOLA_SAN_FELICE).click()
        getIFrame().find('h1:contains("' + linksMondoAllianz.AGRICOLA_SAN_FELICE + '")').should('be.visible')
    }
}

export default Mieinfo