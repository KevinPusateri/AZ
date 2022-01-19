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
    static checkLinksOnMenuInfo(keys) {
        LinkMieInfo.getLinksMenu().deleteKey(keys)

        const linksMenuProfiled = Object.values(LinkMieInfo.getLinksMenu())

        getIFrame().find('[class="menu--link menu_padding-0"]').each(($link, i) => {
            expect($link.text().trim()).to.include(linksMenuProfiled[i + 1]);
        })
    }

    /**
     * Click Button link su menu di MieInfo
     * @param {string} page - nome del link nel Menu
     */
    static clickLinkOnMenu(page) {
        // wait forzato altrimenti non trova Antiriciclaggio
        // if (page === 'Antiriciclaggio')
        getIFrame().find('span:visible').contains(page).click()
        // else
        // getIFrame().find('span[class="menu--link--text"]:visible').should('be.visible').contains(page, { timeout: 5000 }).click().wait(2000)
        getIFrame().find('a[class~="menu--link_active"]').should('contain', page)
        this.checkPageOnMenu(page)
    }

    /**
     * Verifica che i sotto link del menu della pagina corrispondano
     * @param {page} page - nome della pagina 
     */
    static checkLinksOnSubMenu(page, keys) {
        debugger
        const LinksMenu = LinkMieInfo.getLinksMenu()
        // const linksSubMenu = LinkMieInfo.getLinksSubMenu()
        switch (page) {
            case LinksMenu.PRODOTTI:
                LinkMieInfo.getLinksSubMenu().PRODOTTI.deleteKey(keys.PRODOTTI)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    const checkLinks = Object.values(LinkMieInfo.getLinksSubMenu().PRODOTTI)
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
                    })
                })
                break
            case LinksMenu.INIZIATIVE:
                LinkMieInfo.getLinksSubMenu().INIZIATIVE.deleteKey(keys.INIZIATIVE)

                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    const checkLinks = Object.values(LinkMieInfo.getLinksSubMenu().INIZIATIVE)
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
                    })
                })
                break;
            case LinksMenu.SALES_ACADEMY:
                LinkMieInfo.getLinksSubMenu().SALES_ACADEMY.deleteKey(keys.SALES_ACADEMY)

                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    const checkLinks = Object.values(LinkMieInfo.getLinksSubMenu().SALES_ACADEMY)

                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
                    })
                })
                break;
            case LinksMenu.ANTIRICICLAGGIO:
                LinkMieInfo.getLinksSubMenu().ANTIRICICLAGGIO.deleteKey(keys.ANTIRICICLAGGIO)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    const checkLinks = Object.values(LinkMieInfo.getLinksSubMenu().ANTIRICICLAGGIO)
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
                    })
                })
                break;
            case LinksMenu.RISORSE_PER_AGENZIA:
                LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENZIA.deleteKey(keys.RISORSE_PER_AGENZIA)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    const checkLinks = Object.values(LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENZIA)
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
                    })
                })
                break;
            case LinksMenu.RISORSE_PER_AGENTE:
                LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENTE.deleteKey(keys.RISORSE_PER_AGENTE)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    const checkLinks = Object.values(LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENTE)
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 7).each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
                    })
                })
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                LinkMieInfo.getLinksSubMenu().IL_MONDO_ALLIANZ.deleteKey(keys.IL_MONDO_ALLIANZ)
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    const checkLinks = Object.values(LinkMieInfo.getLinksSubMenu().IL_MONDO_ALLIANZ)
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 3).each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
                    })
                })
                break;
            case LinksMenu.NEW_COMPANY_HANDBOOK:
                getIFrame().find('[class="menu--submenu menu--submenu_open"]').then($subMenu => {
                    let checkLinks = Object.values(linksSubMenu.NEW_COMPANY_HANDBOOK)
                    cy.wrap($subMenu).find('[class="menu--link menu_padding-1"]').should('have.length', 2).each(($link, i) => {
                        expect($link.text().trim().toLowerCase()).to.include(checkLinks[i].toLowerCase());
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
        cy.wait(4000)
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
                    expect($link.text().trim().toLowerCase()).to.include(linksProdottiIcon[i].toLowerCase());
                })
                break
            //TODO: Finire mie info
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
                getIFrame().find('app-dynamic-list:visible').within(($card) => {
                    cy.wrap($card).find('h4:visible').each(($link, i) => {
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
                let currentIconsSalesAcademy = []
                getIFrame().find('.product-icon--name').each(($link, i) => {
                    currentIconsSalesAcademy.push($link.text().trim())
                }).then(() => {
                    expect(currentIconsSalesAcademy.sort()).to.deep.eq(linksSalesAcademyIcon.sort());
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
                    // 'Riferimenti aziendali',
                    'Manuali di travaso MISA',
                    'Link utili',
                    'Minisito IDD',
                ]
                let currentLinksRisorseAgenziaIcon = []

                getIFrame().find('.product-icon--name').each(($link, i) => {
                    currentLinksRisorseAgenziaIcon.push($link.text().trim())
                }).then(() => {
                    expect(currentLinksRisorseAgenziaIcon.sort()).to.deep.eq(linksRisorseAgenziaIcon.sort());

                })
                break;
            case LinksMenu.RISORSE_PER_AGENTE:
                const linksRisorseAgenteIcon = [
                    'Trattamenti provvigionali',
                    'Incentivazioni, mission, regolamenti',
                    // 'Casa Allianz',
                    'Convenzioni Prodotti Allianz',
                    'Cassa Previdenza Agenti',
                    'Le scelte di investimento',
                    'Catalogo idee'
                ]
                let currentlinksRisorseAgenteIcon = []
                getIFrame().find('.product-icon--name:visible').each(($link, i) => {
                    currentlinksRisorseAgenteIcon.push($link.text().trim())
                }).then(() => {
                    expect(currentlinksRisorseAgenteIcon.sort()).to.deep.eq(linksRisorseAgenteIcon.sort());
                })
                break;
            case LinksMenu.IL_MONDO_ALLIANZ:
                const linksMondoAllianzIcon = [
                    'I codici del Gruppo Allianz SpA',
                    'La rassegna stampa',
                    'Agricola San Felice'
                ]
                let currentlinksMondoAllianzIcon = []
                getIFrame().find('.product-icon--name:visible').each(($link, i) => {
                    currentlinksMondoAllianzIcon.push($link.text().trim())
                }).then(() => {
                    expect(currentlinksMondoAllianzIcon.sort()).to.deep.eq(linksMondoAllianzIcon.sort());
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
                getIFrame().find('h1:contains("Primo piano")').should('be.visible')
                break;
            case LinksMenu.RACCOLTE:
                getIFrame().find('h3:contains("Pronti via")').should('be.visible')
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
            case LinksMenu.RILASCI_INFORMATICI:
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
                getIFrame().find('h1:contains("Test Handbook per rilascio")').should('be.visible')
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
            // 'Portale Digital Agency',
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
                // getIFrame().find('nx-expansion-panel-title').contains($card.text().trim()).click()
                // cy.wrap($card).should('have.attr', 'aria-expanded', 'true')
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

    /**
     * Verifica atterraggio delle sotto pagine di "Prodotti"
     */
    static checkAllPagesOnProdotti() {
        const linksProdotti = LinkMieInfo.getLinksSubMenu().PRODOTTI
        getIFrame().contains('Allianz Ultra').click()
        // :contains("Allianz Ultra")').should('be.visible

        getIFrame().contains(linksProdotti.ALLIANZ1_BUSINESS).click()
        // getIFrame().find('img').should('have.attr', 'src', '/lemieinfo/cdn/internal/assets/immagini/images-header/prodotti/allianzultra/AllianzUltra_HSP.png')
        getIFrame().find('h1:contains("Allianz1 Business")').should('not.exist')

        getIFrame().contains(linksProdotti.AUTO_E_MOTORI).click()
        getIFrame().find('h1:contains("Auto e Motori")').should('be.visible')

        getIFrame().contains(linksProdotti.CASA_CONDOMINIO_E_PETCARE).click()
        getIFrame().find('h1:contains("Casa")').should('be.visible')

        getIFrame().contains(linksProdotti.INFORTUNI_E_SALUTE).click()
        getIFrame().find('h1:contains("Infortuni e Salute")').should('be.visible')

        getIFrame().contains(linksProdotti.IMPRESA_E_RISCHI_DEDICATI).click()
        getIFrame().find('h1:contains("Impresa e rischi dedicati")').should('be.visible').wait(3000)

        getIFrame().find('a[href="/lemieinfo/prodotti/tutela-legale"]').contains(linksProdotti.TUTELA_LEGALE).click()
        getIFrame().find('h1:contains("Tutela Legale")').should('be.visible')

        getIFrame().contains(linksProdotti.VITA).click()
        getIFrame().find('h1:contains("Vita")').should('be.visible')

        getIFrame().contains(linksProdotti.VITA_CORPORATE).click()
        getIFrame().find('h1:contains("Vita Corporate")').should('be.visible')

        getIFrame().contains(linksProdotti.CONVENZIONI_NAZIONALI).click()
        getIFrame().find('h1:contains("Convenzioni nazionali")').should('be.visible')

        getIFrame().contains(linksProdotti.CONVENZIONI_LOCALI_E_OFFERTE_DEDICATE).click()
        getIFrame().find('h1:contains("Convenzioni locali e Offerte dedicate")').should('be.visible')

        getIFrame().contains(linksProdotti.AGCS_ITALIA).click()
        getIFrame().find('h1:contains("AGCS")').should('be.visible')

        getIFrame().contains(linksProdotti.FINANZIAMENTI_COMPASS).click()
        getIFrame().find('h1:contains("Finanziamenti Compass")').should('be.visible')
    }

    /**
     * Verifica atterraggio delle sotto pagine di "Iniziative"
     */
    static checkAllPagesOnIniziative() {
        const linksIniziative = LinkMieInfo.getLinksSubMenu().INIZIATIVE
        getIFrame().contains(linksIniziative.STOPDRIVE).click()
        getIFrame().find('h1:contains("' + linksIniziative.STOPDRIVE + '")').should('be.visible')

        getIFrame().contains(linksIniziative.PROPONI_LTC).click()
        getIFrame().find('h1:contains("' + linksIniziative.PROPONI_LTC + '")').should('be.visible')

        getIFrame().contains(linksIniziative.PROPONI_TCM).click()
        getIFrame().find('h1:contains("' + linksIniziative.PROPONI_TCM + '")').should('be.visible')

        getIFrame().contains(linksIniziative.MENSILIZZAZIONE_RAMI_VARI).click()
        // getIFrame().find('h1:contains("' + linksIniziative.MENSILIZZAZIONE_RAMI_VARI + '")').should('be.visible')

        getIFrame().contains(linksIniziative.MENSILIZZAZIONE_AUTO).click()
        getIFrame().find('h1:contains("' + linksIniziative.MENSILIZZAZIONE_AUTO + '")').should('be.visible')

        getIFrame().contains(linksIniziative.CLIENTI_VALORE_EXTRA).click()
        getIFrame().find('h1:contains("' + linksIniziative.CLIENTI_VALORE_EXTRA + '")').should('be.visible')

        getIFrame().contains(linksIniziative.ALLIANZPAY).click()
        getIFrame().find('h1:contains("' + linksIniziative.ALLIANZPAY + '")').should('be.visible')

        getIFrame().contains(linksIniziative.BUSTA_ARANCIONE).click()
        // getIFrame().find('h1:contains("' + linksIniziative.BUSTA_ARANCIONE + '")').should('be.visible')

        getIFrame().contains(linksIniziative.WINBACK_MOTOR).click()
        getIFrame().find('h1:contains("' + linksIniziative.WINBACK_MOTOR + '")').should('be.visible')

        getIFrame().contains(linksIniziative.DECOMMISSIONING_TELEMATICI).click()
        getIFrame().find('h1:contains("' + linksIniziative.DECOMMISSIONING_TELEMATICI + '")').should('be.visible')

        getIFrame().contains(linksIniziative.DIGITALIZZAZIONE_DEL_CERTIFICATO_ASSICURAZTIVO_MOTOR).click()
        getIFrame().find('h1:contains("' + linksIniziative.DIGITALIZZAZIONE_DEL_CERTIFICATO_ASSICURAZTIVO_MOTOR + '")').should('be.visible')

        getIFrame().contains(linksIniziative.ATTESTATO_DI_RISCHIO_DINAMICO).click()
        getIFrame().find('h1:contains("' + linksIniziative.ATTESTATO_DI_RISCHIO_DINAMICO + '")').should('be.visible')
    }

    /**
     * Verifica atterraggio delle sotto pagine di "Sales Academy"
     */
    static checkAllPagesOnSalesAcademy() {
        const linksSalesAcademy = LinkMieInfo.getLinksSubMenu().SALES_ACADEMY
        getIFrame().contains(linksSalesAcademy.CHI_SIAMO).click()
        getIFrame().find('div[class="text--wrapper html-text article-typography"]').should('be.visible') // errore

        getIFrame().contains(linksSalesAcademy.ALLIANZ_BUSINESS_SCHOOL).click()
        getIFrame().find(':contains("Università")').should('be.visible')

        getIFrame().contains(linksSalesAcademy.PERCORSI_DI_RUOLO).click()
        getIFrame().find('h3:contains("Sheet Percorsi di ruolo")').should('be.visible')

        getIFrame().contains(linksSalesAcademy.CAMPUS_IVASS).click()
        getIFrame().find(':contains("Sheet Obblighi IVASS")').should('be.visible')

        getIFrame().contains(linksSalesAcademy.FORMAZIONE_MULTICANALE).click()
        getIFrame().find('h1:contains("Formazione Multicanale")').should('be.visible')
    }

    /**
     * Verifica atterraggio delle sotto pagine di "New Company Handbook"
     */
    static checkAllPagesNewCompanyHandbook() { }

    /**
     * Verifica atterraggio delle sotto pagine di "Antiriciclaggio"
     */
    static checkAllPagesAntiriciclaggio() {
        const linksSalesAcademy = LinkMieInfo.getLinksSubMenu().ANTIRICICLAGGIO
        // cy.wait(20000)
        getIFrame().find('span:visible').contains(linksSalesAcademy.NORMATIVA).click()
        getIFrame().find('nx-expansion-panel-title').should('be.visible')
        // getIFrame().find('h1:contains("' + linksSalesAcademy.NORMATIVA + '")').should('be.visible')

        getIFrame().contains(linksSalesAcademy.MODULI_MANUALI_E_PROCEDURE).click()
        getIFrame().find('nx-expansion-panel-title').should('be.visible')
        // getIFrame().find('h1:contains("' + linksSalesAcademy.MODULI_MANUALI_E_PROCEDURE + '")').should('be.visible')

        getIFrame().contains(linksSalesAcademy.LINK_UTILI).click()
        getIFrame().find('app-section-title:contains("Antiriciclaggio link utili")').should('be.visible')
    }

    /**
     * Verifica atterraggio delle sotto pagine di "Risorse Per l'Agenzia"
     */
    static checkAllPagesRisorsePerAgenzia() {
        const linksRisorseAgenzie = LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENZIA
        getIFrame().contains(linksRisorseAgenzie.RECLUTAMENTO).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RECLUTAMENTO + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.ARREDARE_AGENZIA).click()
        getIFrame().find('h1:contains("Arredare l\'agenzia")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.DIGITAL_MARKETING_E_SOCIAL_MEDIA).click()
        getIFrame().find('h1:contains("Digital marketing e social media")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.MATERIALI_DI_COMUNICAZIONE).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.MATERIALI_DI_COMUNICAZIONE + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.RICHIESTA_STAMPATI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RICHIESTA_STAMPATI + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.ORDINI_DI_TONER_E_CARTA).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.ORDINI_DI_TONER_E_CARTA + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.CATALOGO_PRODOTTI_TECNOLOGICI).click()
        getIFrame().find('h1:contains("Catalogo prodotti tecnologici")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.SICUREZZA_IT).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.SICUREZZA_IT + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.APP_ADAM).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.APP_ADAM + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.PACCHETTI_DI_SICUREZZA).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.PACCHETTI_DI_SICUREZZA + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.RIFERIMENTI_AZIENDALI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.RIFERIMENTI_AZIENDALI + '")').should('be.visible')

        getIFrame().find('a[href="/lemieinfo/risorse-per-l\'agenzia/link-utili"]').contains(linksRisorseAgenzie.LINK_UTILI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.LINK_UTILI + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgenzie.IDD).click()
        getIFrame().find('h1:contains("' + linksRisorseAgenzie.IDD + '")').should('be.visible')
    }

    /**
     * Verifica atterraggio delle sotto pagine di "Risorse Per l'Agente"
     */
    static checkAllPagesRisorsePerAgente() {
        const linksRisorseAgente = LinkMieInfo.getLinksSubMenu().RISORSE_PER_AGENTE
        getIFrame().contains(linksRisorseAgente.TRATTAMENTI_PROVVIGIONALI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.TRATTAMENTI_PROVVIGIONALI + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgente.INCENTIVAZIONI_MISSION_REGOLAMENTI).click()
        getIFrame().find('h1:contains("Incentivazioni, mission, regolamenti")').should('be.visible')

        // !CONTENUTO VUOTO
        getIFrame().contains(linksRisorseAgente.COLLABORAZIONI_ORIZZONTALI).click()

        getIFrame().contains(linksRisorseAgente.CONVENZIONI_PRODOTTI_ALLIANZ).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.CONVENZIONI_PRODOTTI_ALLIANZ + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgente.CASSA_PREVIDENZA_AGENTI).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.CASSA_PREVIDENZA_AGENTI + '")').should('be.visible')

        // getIFrame().contains(linksRisorseAgente.LE_SCELTE_DI_INVESTIMENTO).click()
        // getIFrame().find('h1:contains("' + linksRisorseAgente.LE_SCELTE_DI_INVESTIMENTO + '")').should('be.visible')

        getIFrame().contains(linksRisorseAgente.CATALOGO_IDEE).click()
        getIFrame().find('h1:contains("' + linksRisorseAgente.CATALOGO_IDEE + '")').should('be.visible')
    }

    /**
     * Verifica atterraggio delle sotto pagine di "Il Mondo Allianz"
     */
    static checkAllPagesIlMondoAllianz() {
        const linksMondoAllianz = LinkMieInfo.getLinksSubMenu().IL_MONDO_ALLIANZ
        getIFrame().contains(linksMondoAllianz.I_CODICI_DI_ALLIANZ_SPA).click()
        getIFrame().find('h1:contains("' + linksMondoAllianz.I_CODICI_DI_ALLIANZ_SPA + '")').should('be.visible')

        getIFrame().contains(linksMondoAllianz.LA_RASSEGNA_STAMPA).click()
        getIFrame().find('h1:contains("' + linksMondoAllianz.LA_RASSEGNA_STAMPA + '")').should('be.visible')

        getIFrame().contains(linksMondoAllianz.AGRICOLA_SAN_FELICE).click()
        getIFrame().find('h1:contains("' + linksMondoAllianz.AGRICOLA_SAN_FELICE + '")').should('be.visible')
    }
}

export default Mieinfo