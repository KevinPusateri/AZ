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

        cy.screenshot('Dettaglio Anagrafica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        cy.wait('@gqlClient', { requestTimeout: 30000 })

        if (cliente.isPEC)
            cy.contains('Invio documento via PEC')
                .parent('div')
                .get('nx-icon').should('have.class', 'nx-icon--s ndbx-icon nx-icon--check-circle color-true')
    }

    static aggiungiDocumento() {
        cy.contains('Aggiungi documento').click()
    }

    static checkDocumento(documentType, checkTest = true) {
        return new Cypress.Promise((resolve, reject) => {
            cy.wait(8000)
            cy.get('app-client-documents').should('exist').and('be.visible')
            cy.get('body')
                .then(body => {
                    if (body.find('div:contains("' + documentType + '")').length > 0) {
                        if (checkTest)
                            cy.screenshot('Verifica ' + documentType + ' inserito', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                })
        })
    }

    static checkClientWithoutLegame() {
        const searchClientWithoutLegame = () => {
            LandingRicerca.searchRandomClient(true, "PG", "P")
            LandingRicerca.clickRandomResult()
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
        cy.contains('Documenti').click({ force: true })

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

    /**
     * Effettua il click su Dettaglio Anagrafica
     */
    static clickTabDettaglioAnagrafica() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'gqlClient'
            }
        });

        cy.contains('DETTAGLIO ANAGRAFICA').click()

        cy.wait('@gqlClient', { timeout: 15000 }).its('response.statusCode').should('eq', 200)
        cy.get('app-section-title:contains("Dati principali")').should('be.visible').wait(3000)
        cy.screenshot('Dettaglio Anagrafica', { clip: { x: 0, y: 0, width: 1920, height: 700 } })
    }

    /**
     * Click sub-tab
     * @param {string} subTab - nome sel subTab  
     */
    static clickSubTab(subTab) {

        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('saveOperationAccount'))
                req.alias = 'gqlOperation'
        });
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client'))
                req.alias = 'gqlClient'
        });
        //Intercept dedicata per il subTab Convenzioni
        cy.intercept({
            method: 'GET',
            url: '**/getclientagreements/**'
        }).as('getClientAgreements');

        cy.contains(subTab).click({ force: true })

        //Sul tab Legami non c'è la gqlClient specificata
        if (subTab !== 'Legami')
            cy.wait('@gqlClient', { timeout: 30000 }).its('response.statusCode').should('eq', 200)

        if (subTab === 'Convenzioni')
            cy.wait('@gqlOperation', { timeout: 30000 }).its('response.statusCode').should('eq', 200)
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
                expect(list.text()).to.include('Sì')
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
                if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
                    expect(label.text().trim()).to.include('Professione');
                else
                    expect(label.text().trim()).to.include('Professione*');
                expect(label.text().trim()).to.include('Cognome*');
                if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
                    expect(label.text().trim()).to.include('Unità di mercato');
                else
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
                cy.screenshot('Dati Campi Dati Principali', { overwrite: true })
            })

        })
    }

    static checkCampiIdentificazioneAdeguataVerifica() {
        cy.get('app-client-risk-profiles').then((box) => {
            cy.wrap(box).find('app-section-title').should('contain.text', 'Identificazione e adeguata verifica')
            cy.get('app-client-risk-profiles').find('[class^="label"]').then((label) => {
                expect(label.text().trim()).to.include('Profilo rischio riciclaggio');
                expect(label.text().trim()).to.include('Profilo FATCA');
                if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
                    expect(label.text().trim()).to.include('Stato operativo Vita');
                expect(label.text().trim()).to.include('Profilo CRS');
            })

        })
        cy.get('app-physical-client-main-data:contains("Dati principali persona fisica")')
            .screenshot('Campi Identificazione Adeguata verifica', { overwrite: true })
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
                                if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
                                    expect(label.text().trim()).to.include('Attività di profilazione realizzate da Allianz S.p.A.');
                                else
                                    expect(label.text().trim()).to.include('Attività di profilazione realizzate da Allianz Viva S.p.A.');
                                expect(label.text().trim()).to.include('Attività promozionali relative a società terze partner');
                                expect(label.text().trim()).to.include('Indagini di mercato');
                            })
                        cy.wait(5000)
                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .screenshot('Campi Consensi: ' + panelName[i], { overwrite: true })
                    } else if (panelName[i] === 'Consensi e adeguatezza AGL') {
                        cy.contains(panelName[i]).click().wait(3500)

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
                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .screenshot('Campi Consensi: ' + panelName[i], { overwrite: true })

                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('lib-da-link')
                            .should('contain.text', 'Modifica consensi AGL')

                    } else if (panelName[i] === 'Consensi e adeguatezza Leben') {
                        cy.contains(panelName[i]).click().wait(3500)

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
                        cy.contains(panelName[i]).parents('nx-expansion-panel').find('[id^=cdk-accordion-child]')
                            .screenshot('Campi Consensi: ' + panelName[i], { overwrite: true })
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
        cy.contains('app-section-title', 'Residenza anagrafica').click()

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
     * @param {bool} convenzionePresente : se false, verifica che non sia possibile emettere convenzione (con check popup)
     * @param {string} agenzia : agenzia da selezionare dal dropdown menu in caso di aggiunta della convenzione
     * @param {string} convenzione : convenzione da selezionare dal dropdown menu in caso di aggiunta della convenzione
     * @param {string} ruolo : ruolo da selezionare dal dropdown menu in caso di aggiunta della convenzione
     * @param {string} aderente : aderente da selezionare dal dropdown menu in caso di aggiunta Familiare del Convenzionato
     */
    static clickAggiungiConvenzione(convenzionePresente, agenzia, convenzione, ruolo, aderente) {

        cy.contains('Aggiungi Convenzione').should('be.visible').click()
        if (!convenzionePresente) {
            cy.get('h4').should('contain.text', 'Nessuna convenzione disponibile per l\'agenzia selezionata')
            cy.screenshot('Nessuna convenzione disponibile ', { clip: { x: 0, y: 0, width: 1920, height: 900 } })
            cy.contains('Annulla').click().wait(5000)
        } else {
            return new Cypress.Promise((resolve, reject) => {
                const convenzioneInserita = {
                    agenzia: agenzia,
                    convenzioneId: convenzione,
                    matricola: (ruolo === 'Familiare del Convenzionato') ? '' : Math.floor(Math.random() * 1000000000).toString(),
                    ruolo: ruolo,
                    aderente: aderente
                }
                //Agenzia
                cy.get('nx-dropdown[formcontrolname="ambiente"]').should('be.visible').click().wait(2000)
                cy.get('nx-dropdown-item').should('be.visible').within(() => {
                    cy.contains(agenzia).should('be.visible').click()
                })
                cy.get('nx-dropdown[formcontrolname="convenzione"]').should('be.visible').click().wait(2000)
                //Convenzione
                // cy.get('#nx-dropdown-rendered-5').click()
                cy.get('nx-dropdown-item').should('be.visible').within(() => {
                    cy.contains(convenzione).should('be.visible').click()
                })
                // cy.contains(convenzione).should('be.visible').click()
                //Matricola
                if (convenzioneInserita.matricola !== '')
                    cy.get('input[formcontrolname="matricola"]').should('be.visible').type(convenzioneInserita.matricola)
                //Ruolo
                cy.get('nx-dropdown[formcontrolname="ruolo"]').should('be.visible').click()

                cy.get('.cdk-overlay-container').should('be.visible').within(($element) => {
                    console.log($element)
                    // cy.get('[aria-activedescendant="nx-dropdown-item-2"]').should('exist').and('be.visible').within(($tendina) => {
                    cy.get('[class="cdk-overlay-connected-position-bounding-box"]').find('div[role="listbox"]').should('exist').and('be.visible').within(($tendina) => {
                        switch (ruolo) {
                            case 'Convenzionato':
                                cy.wrap($tendina).find('span').contains(/\s*Convenzionato/).click()
                                break;
                            case 'Ente Convenzionante':
                                cy.wrap($tendina).find('span').contains(/\s*Ente Convenzionante/).click()
                                break;
                            case 'Familiare del Convenzionato':
                                cy.wrap($tendina).find('span').contains(/\s*Familiare del Convenzionato/).click()
                                break;
                        }
                    })

                    //Aderenti Convenzione che si apre in automatico se selezionato 'Famigliare del Convenzionato'
                    if (aderente !== undefined) {
                        cy.wait(2000)
                        cy.get('nx-dropdown[formcontrolname="aderente"]').should('be.visible').click()
                        cy.get('nx-dropdown-item[class^="nx-dropdown-item"]').should('exist').and('be.visible')
                        cy.contains(aderente.toUpperCase()).should('be.visible').click()
                    }
                    cy.screenshot('Aggiungi Convenzione con Ruolo ' + ruolo, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

                    cy.contains('Aggiungi').click()
                })
                resolve(convenzioneInserita)
            })
        }
    }

    /**
     * Verifica la presenza delle convenzioni, e in caso ne effettua la cancellazione se specificato
     * @param {Boolean} isPresent se true, verifica la presenza di convenzioni
     * @param {Boolean} toBeDelated default false; se true, cancella eventuali convenzioni presenti
     */
    static checkConvenzioniPresenti(isPresent, toBeDelated = false) {

        cy.wait(10000)
        cy.get('h3').should('exist').and('be.visible').invoke('text').then($text => {
            let numberOfConvenzioni = Number.parseInt($text.trim(), 10)
            switch (numberOfConvenzioni) {
                case 0:
                    if (isPresent)
                        assert.fail('Convezioni non presenti!')
                    break;
                default:
                    cy.wrap(numberOfConvenzioni).should('be.greaterThan', 0)
                    cy.get('app-convenzioni').should('exist').and('be.visible').within(() => {
                        cy.get('.row:eq(1)').should('exist').and('be.visible')
                        cy.screenshot('Convenzione Presente', { clip: { x: 0, y: 0, width: 1920, height: 900 } })
                    })
                    cy.wait(4000)
                    if (toBeDelated) {
                        cy.get('svg[data-icon="trash-alt"]').click()
                        cy.contains('Conferma').should('be.visible').click()
                        cy.wait(2000)
                    }
                    break;
            }

        })
    }


    static checkConvenzioneInserito(convenzione) {
        cy.wait(2000)
        cy.get('app-convenzioni').should('exist').and('be.visible').within(() => {
            cy.get('.row:eq(1)').should('exist').and('be.visible').within(() => {
                cy.get('[class~="list-content"]').should('contain.text', convenzione.agenzia)
                cy.get('[class~="list-content"]').should('contain.text', convenzione.convenzioneId)
                cy.get('[class~="list-content"]').should('contain.text', convenzione.ruolo)
            })
        })
        cy.screenshot('Convenzione ' + convenzione.convenzioneId + ' ' + convenzione.ruolo, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static getCFClient() {
        return new Cypress.Promise((resolve, reject) => {

            cy.contains('Codice fiscale')
                .parents('app-client-data-label')
                .find('div[class="value"]:first').invoke('text').then((CF) => {
                    resolve(CF.trim())
                })

        })
    }

    static getIVAClient() {
        return new Cypress.Promise((resolve, reject) => {

            cy.contains('Partita IVA')
                .parents('app-client-data-label')
                .find('div[class="value"]:first').invoke('text').then((IVA) => {
                    resolve(IVA.trim())
                })

        })
    }


    static getFormaGiuridica() {
        return new Cypress.Promise(resolve => {
            cy.contains('Forma giuridica').parents('app-client-data-label').within(() => {
                cy.get('div[class="value"]').invoke('text').then((tipologia) => {
                    if (tipologia.trim() !== '-')
                        resolve(true)
                    else
                        resolve(false)
                })
            })
        })
    }

    static contattoPresente() {
        return new Cypress.Promise(resolve => {

            cy.get('span[class="nx-button__content-wrapper"]').should('be.visible')
            cy.get('app-client-profile-detail').should('be.visible').then(($contattiPage) => {
                const checkEmpty = $contattiPage.find(':contains("Non sono presenti altri contatti")').is(':visible')

                if (checkEmpty) {
                    resolve(true)
                } else {
                    resolve(false)
                }

            })
        })
    }

    static removeAllContatti() {
        cy.wait(5000)
        const loopRemove = () => {

        cy.get('app-client-other-contacts').should('be.visible').then(($bodyContatti) => {
            if ($bodyContatti.find('app-client-contact-table-row').length > 0) {
                cy.get('app-client-contact-table-row').first().find('nx-icon[class="nx-icon--s ndbx-icon nx-icon--ellipsis-h icon"]')
                    .click()
                    .wait(3000);
                cy.get("button").contains("Elimina contatto").should('be.visible').click();
                cy.get('nx-modal-container').should('be.visible')
                cy.get('nx-modal-container').find('span:contains("Conferma"):visible').click()
                cy.wait(5000)
                loopRemove()
            }
        })
    }

    loopRemove()
}
}
export default DettaglioAnagrafica