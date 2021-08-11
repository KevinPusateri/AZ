/// <reference types="Cypress" />
import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
import LandingRicerca from '../ricerca/LandingRicerca.js';
import Legami from './Legami.js';

class DettaglioAnagrafica {
    static checkLinksSubTabs() {
        const tabAnagrafica = [
            'Dati anagrafici',
            'Altri contatti',
            'Altri indirizzi',
            'Documenti',
            'Legami',
            'Conti correnti',
            'Convenzioni'
        ]
        cy.get('nx-tab-header').find('button').each(($checkTabAnagrafica, i) => {
            expect($checkTabAnagrafica.text().trim()).to.include(tabAnagrafica[i]);
        })
    }

    static verificaDatiDettaglioAnagrafica(cliente) {

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        })
        cy.contains('DETTAGLIO ANAGRAFICA').click()

        cy.wait('@gqlClient', { requestTimeout: 30000 })

        if (cliente.isPEC)
            cy.contains('Invio documento via PEC')
                .parent('div')
                .get('nx-icon').should('have.class', 'nx-icon--s nx-icon--check-circle color-true')
    }

    static aggiungiDocumento() {
        cy.contains('Aggiungi documento').click()
    }

    static checkDocumento(documentType) {
        return new Cypress.Promise((resolve, reject) => {
            cy.get('body')
                .then(body => {
                    if (body.find('div:contains("' + documentType + '")').length > 0)
                        resolve(true)
                    else
                        resolve(false)
                })
        })
    }

    static checkClientWithoutLegame() {
        const searchClientWithoutLegame = () => {
            LandingRicerca.searchRandomClient(true, "PG", "P")
            LandingRicerca.clickRandomResult()
            // LandingRicerca.search('CREDITCON SPA')
            // LandingRicerca.clickFirstResult()
            this.sezioneLegami()
            cy.get('ac-anagrafe-panel').should('be.visible')
            cy.get('ac-anagrafe-panel').find('h4').should('contain.text', 'Gruppo aziendale')
            cy.get('body').should('be.visible')
                .then($body => {
                    const isTrovato = $body.find('button:contains("Inserisci membro"):visible').is(':visible')
                    if (isTrovato)
                        Legami.clickEliminaGruppo()
                    else
                        return
                })
        }

        searchClientWithoutLegame()
    }

    static modificaCliente() {
        cy.contains('DETTAGLIO ANAGRAFICA').click()
        cy.contains('Modifica dati cliente').click()
    }

    static sezioneDocumenti() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('identityDocuments')) {
                req.alias = 'gqlIdentityDocuments'
            }
        })
        cy.contains('DETTAGLIO ANAGRAFICA').click()
        cy.contains('Documenti').click()

        cy.wait('@gqlIdentityDocuments', { requestTimeout: 30000 })
    }

    static sezioneLegami() {
        cy.contains('DETTAGLIO ANAGRAFICA').click()

        cy.intercept({
            method: 'GET',
            url: '**/api/**'
        }).as('getApi');
        cy.intercept('POST', '**/graphql', (req) => { aliasQuery(req, 'fastQuoteProfiling') })
        cy.contains('Legami').click({ force: true })
        cy.wait('@getApi', { requestTimeout: 40000 });
        cy.get('body').find('ac-anagrafe-panel:contains("Gruppo aziendale")').should('be.visible')
        // cy.wait('@gqlfastQuoteProfiling', { requestTimeout: 40000 });

    }

    static clickTabDettaglioAnagrafica() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        });

        cy.contains('DETTAGLIO ANAGRAFICA').click()

        cy.wait('@gqlClient', { requestTimeout: 30000 });
    }

    /**
     * Click sub-tab
     * @param {string} subTab - nome sel subTab  
     */
    static clickSubTab(subTab) {

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        });
        //Intercept dedicata per il subTab Convenzioni
        cy.intercept({
            method: 'GET',
            url: '**/getclientagreements/**'
        }).as('getClientAgreements');

        cy.contains(subTab).click({ force: true })
        cy.wait('@gqlClient', { requestTimeout: 30000 });
        
        if(subTab === 'Convenzioni')
            cy.wait('@getClientAgreements', { requestTimeout: 60000 });
    }

    static checkSubTabDatiAnagrafici() {
        cy.get('app-section-title').find('.title:contains("Dati principali persona fisica"):visible')
        cy.get('app-physical-client-main-data').find('button:contains("Modifica dati cliente"):visible')
        cy.get('app-client-risk-profiles').find('.title:contains("Identificazione e adeguata verifica"):visible')
        cy.get('app-client-consents-accordion').find('.title:contains("Consensi"):visible')
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza').click()
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza AGL').click()
        cy.get('nx-expansion-panel-header').contains('Consensi e adeguatezza Leben').click()
        cy.get('app-section-title').find('.title:contains("Residenza anagrafica"):visible')
        cy.get('app-section-title').find('.title:contains("Domicilio"):visible')
        cy.get('app-section-title').find('.title:contains("Numero di telefono principale"):visible')
        cy.get('app-section-title').find('.title:contains("Email"):visible')
        cy.get('app-section-title').find('.title:contains("Documento principale"):visible')
    }


    /**
     * Verifica contatto creato sia presente
     * @param {string} contatto - Object contatto creato
     */
    static checkContatti(contatto) {
        cy.then(() => {
            cy.get('app-client-other-contacts').find('app-client-contact-table-row').should('be.visible')
            cy.get('app-client-other-contacts').find('app-client-contact-table-row').then((list) => {
                console.log(list.text())
                expect(list.text()).to.include(contatto.tipo)
                expect(list.text()).to.include(contatto.principale)
                if (contatto.tipo === 'E-Mail' || contatto.tipo === 'PEC') {
                    expect(list.text()).to.include(contatto.email)
                } else if (contatto.tipo === 'Sito Web') {
                    expect(list.text()).to.include(contatto.url)
                } else {
                    expect(list.text()).to.include(contatto.prefissoInt)
                    expect(list.text()).to.include(contatto.prefisso)
                    expect(list.text()).to.include(contatto.phone)
                    expect(list.text()).to.include(contatto.orario)
                }
            })
        })
    }

    static checkCampiDatiPrincipaliPF() {
        cy.get('app-physical-client-main-data').find('[class="box-unico"]').then((box) => {
            cy.wrap(box).find('app-section-title').should('contain.text', 'Dati principali persona fisica')
            cy.wrap(box).find('button[ngclass="button-edit-client"]')
                .should('contain.text', 'Modifica dati cliente')
            cy.get('app-physical-client-main-data').find('[class^="label"]').should('have.length', 21).then((label) => {
                expect(label.text().trim()).to.include('Titolo');
                expect(label.text().trim()).to.include('Cittadinanza');
                expect(label.text().trim()).to.include('Nome*');
                expect(label.text().trim()).to.include('Professione*');
                expect(label.text().trim()).to.include('Cognome*');
                expect(label.text().trim()).to.include('Unità di mercato*');
                expect(label.text().trim()).to.include('Sesso*');
                expect(label.text().trim()).to.include('Residenza fiscale');
                expect(label.text().trim()).to.include('Data di nascita*');
                expect(label.text().trim()).to.include('SAE');
                expect(label.text().trim()).to.include('Comune di nascita*');
                expect(label.text().trim()).to.include('Provincia*');
                expect(label.text().trim()).to.include('RAE');
                expect(label.text().trim()).to.include('Nazione di nascita*');
                expect(label.text().trim()).to.include('P.E.P. (autocert.)');
                expect(label.text().trim()).to.include('Stato civile');
                expect(label.text().trim()).to.include('Relazione P.E.P.');
                expect(label.text().trim()).to.include('Coniugato in');
                expect(label.text().trim()).to.include('Tipologia P.E.P.');
                expect(label.text().trim()).to.include('Codice fiscale*');
                expect(label.text().trim()).to.include('Referente');
            })

        })
    }

    static checkCampiIdentificazioneAdeguataVerifica() {
        cy.get('app-client-risk-profiles').then((box) => {
            cy.wrap(box).find('app-section-title').should('contain.text', 'Identificazione e adeguata verifica')
            cy.get('app-client-risk-profiles').find('[class^="label"]').should('have.length', 4).then((label) => {
                expect(label.text().trim()).to.include('Profilo rischio riciclaggio');
                expect(label.text().trim()).to.include('Profilo FATCA');
                expect(label.text().trim()).to.include('Stato operativo Vita');
                expect(label.text().trim()).to.include('Profilo CRS');
            })

        })
    }

    static checkCampiConsensi() {
        cy.get('app-client-consents-accordion').find('app-section-title').should('contain.text', 'Consensi')
        cy.get('app-client-consents-accordion').find('nx-expansion-panel:visible').then(($box) => {
            let panelName = []
            cy.get('app-client-consents-accordion').find('nx-expansion-panel-title').each(($elements) => {
                panelName.push($elements.text().trim())
            }).then(() => {

                for (let i = 0; i < panelName.length; i++) {
                    if (panelName[i] === 'Consensi e adeguatezza') {
                        // cy.contains(pageRegex).click()

                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .find('[class^="label"]').its('length').should('be.lt', 15)

                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .find('[class^="label"]').then((label) => {
                                expect(label.text().trim()).to.include('Privacy per scopi assicurativi');
                                expect(label.text().trim()).to.include('Invio documento via mail');
                                expect(label.text().trim()).to.include('Firma grafometrica');
                                expect(label.text().trim()).to.include('Firma OTP');
                                expect(label.text().trim()).to.include('Numero di telefono OTP');
                                if (label.text().trim() === 'Consenso Digital Me')
                                    expect(label.text().trim()).to.include('Consenso Digital Me');
                                expect(label.text().trim()).to.include('Profilo di sostenibilità finanziaria');
                                expect(label.text().trim()).to.include('Questionario adeguatezza cliente - Prodotti IBIPs');
                                expect(label.text().trim()).to.include('Profilo di esperienza & conoscenza');
                                expect(label.text().trim()).to.include('Attività promozionali relative al gruppo Allianz');
                                expect(label.text().trim()).to.include('Attività di profilazione realizzate da Allianz S.p.A.');
                                expect(label.text().trim()).to.include('Attività promozionali relative a società terze partner');
                                expect(label.text().trim()).to.include('Indagini di mercato');
                            })
                    } else if (panelName[i] === 'Consensi e adeguatezza AGL') {
                        cy.contains(panelName[i]).click()

                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .find('[class^="label"]').its('length').should('be.lt', 11)

                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .find('[class^="label"]').then((label) => {
                                expect(label.text().trim()).to.include('Privacy per scopi assicurativi');
                                expect(label.text().trim()).to.include('Invio documento via mail');
                                expect(label.text().trim()).to.include('Firma grafometrica');
                                // if (label.text().trim() === 'Consenso Digital Me')
                                // expect(label.text().trim()).to.include('Consenso Digital Me');
                                expect(label.text().trim()).to.include('Profilo di sostenibilità finanziaria');
                                expect(label.text().trim()).to.include('Questionario adeguatezza cliente - Prodotti IBIPs');
                                expect(label.text().trim()).to.include('Profilo di esperienza & conoscenza');
                                expect(label.text().trim()).to.include('Attività promozionali relative al gruppo Allianz');
                                expect(label.text().trim()).to.include('Attività di profilazione realizzate da Allianz S.p.A.');
                                expect(label.text().trim()).to.include('Attività promozionali relative a società terze partner');
                                expect(label.text().trim()).to.include('Indagini di mercato');
                            })
                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('lib-da-link')
                            .should('contain.text', 'Modifica consensi AGL')

                    } else if (panelName[i] === 'Consensi e adeguatezza Leben') {
                        cy.contains(panelName[i]).click()

                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .find('[class^="label"]').its('length').should('be.lt', 11)

                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .find('[class^="label"]').then((label) => {
                                expect(label.text().trim()).to.include('Privacy per scopi assicurativi');
                                expect(label.text().trim()).to.include('Invio documento via mail');
                                expect(label.text().trim()).to.include('Firma grafometrica');
                                // if (label.text().trim() === 'Consenso Digital Me')
                                // expect(label.text().trim()).to.include('Consenso Digital Me');
                                expect(label.text().trim()).to.include('Profilo di sostenibilità finanziaria');
                                expect(label.text().trim()).to.include('Questionario adeguatezza cliente - Prodotti IBIPs');
                                expect(label.text().trim()).to.include('Profilo di esperienza & conoscenza');
                                expect(label.text().trim()).to.include('Attività promozionali relative al gruppo Allianz');
                                expect(label.text().trim()).to.include('Attività di profilazione realizzate da Allianz S.p.A.');
                                expect(label.text().trim()).to.include('Attività promozionali relative a società terze partner');
                                expect(label.text().trim()).to.include('Indagini di mercato');
                            })
                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('lib-da-link')
                            .should('contain.text', 'Modifica consensi Leben')
                    }
                }
            })

        })
    }


    static checkCampiResidenzaAnagrafica() {
        cy.contains('app-section-title', 'Residenza anagrafica', { timeout: 10000 }).should('exist')
        cy.get('[class="label"]').should('include.text', 'Comune*')
        cy.get('[class="label"]').should('include.text', 'Indirizzo*')
    }

    static checkCampiDomicilio() {
        cy.contains('app-section-title', 'Domicilio', { timeout: 10000 }).should('exist')
        cy.get('[class="label"]').should('include.text', 'Comune*')
        cy.get('[class="label"]').should('include.text', 'Indirizzo*')
    }

    static checkCampiNumeroTelefonoPrincipale() {
        cy.contains('app-section-title', 'Numero di telefono principale', { timeout: 10000 }).should('exist')
            .next('.box').should('include.text', 'Tipologia').and('include.text', 'Numero')
    }

    static checkCampiEmail() {
        cy.contains('app-section-title', 'Email', { timeout: 10000 }).should('exist')
            .next('.box').should('include.text', 'Email')

    }

    static checkCampiDocumentoPrincipale() {
        cy.contains('app-section-title', 'Documento principale', { timeout: 10000 }).should('exist')
            .next('.box')
            .should('include.text', 'Tipologia documento')
            .and('include.text', 'Data di emissione')
            .and('include.text', 'Numero di documento')
            .and('include.text', 'Data di scadenza')
            .and('include.text', 'Autorità di rilascio')
            .and('include.text', 'Scansione')
            .and('include.text', 'Luogo di emissione')
    }

    /**
     * Click sul pulsante Aggiungi Convenzione da Dettaglio Anagrafica\Convenzioni
     * @param {bool} convenzionePresente : se false, verifica che non sia possibile emettere convenzione (con check popup); default a true
     * @param {string} agenzia : agenzia da selezionare dal dropdown menu in caso di aggiunta della convenzione
     */
    static clickAggiungiConvenzione(convenzionePresente = true, agenzia) {
        cy.contains('Aggiungi Convenzione').should('be.visible').click()
        if (!convenzionePresente) {
            cy.get('h4').should('contain.text', 'Nessuna convenzione disponibile per l\'agenzia selezionata')
            cy.contains('Annulla').click()
        }
        else {
            //Agenzia
            cy.get('nx-dropdown[formcontrolname="ambiente"]').should('be.visible').find('span').invoke('text').then($text => {
                if($text !== agenzia)
                {
                    cy.get('nx-dropdown[formcontrolname="ambiente"]').should('be.visible').click()
                    cy.contains(agenzia).should('be.visible').click()
                }
            })
            //Convenzione
            cy.get('#nx-dropdown-rendered-1').click()
            cy.contains('FINSEDA').should('be.visible').click()
            cy.focused().tab()
            //Matricola
            cy.get('input[formcontrolname="matricola"]').should('be.visible').type(Math.floor(Math.random() * 1000000000).toString())
            //Ruolo
            cy.get('nx-dropdown[formcontrolname="ruolo"]').should('be.visible').click()
            let re = new RegExp("\^Convenzionato\$")
            cy.contains(re).should('be.visible').click()
            cy.get('.ng-star-inserted').find('div:contains("Aggiungi")').click().should('be.visible').click()
        }
    }

    /**
     * Verifica la presenza delle convenzioni, e in caso ne effettua la cancellazione se specificato
     * @param {Boolean} isPresent se true, verifica la presenza di convenzioni
     * @param {Boolean} toBeDelated default false; se true, cancella eventuali convenzioni presenti
     */
    static checkConvenzioniPresenti(isPresent, toBeDelated = false) {
        cy.get('h3').invoke('text').then($text => {
            let numberOfConvenzioni = Number.parseInt($text.trim(), 10)
            switch (numberOfConvenzioni) {
                case 0:
                    if (isPresent)
                        assert.fail('Convezioni non presenti!')
                    break;
                default:
                    cy.wrap(numberOfConvenzioni).should('be.greaterThan', 0)
                    if (toBeDelated) {
                        cy.get('svg[data-icon="trash-alt"]').click()
                        cy.contains('Conferma').should('be.visible').click()
                    }
                    break;
            }
        })
    }
}

export default DettaglioAnagrafica