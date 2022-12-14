/// <reference types="Cypress" />

const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameElencoTelefonico = () => {
    getSCU().find('iframe[src="/phoneBook/searchInterniWithCompanyDA.do"]')
        .iframe();

    let iframeFolder = getSCU().find('iframe[src="/phoneBook/searchInterniWithCompanyDA.do"]')
        .its('0.contentDocument').should('exist');

    return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

class SCU {

    //#region Persona Fisica
    static nuovoClientePFDatiAnagrafici(nuovoClientePF) {
        getSCU().find('#nome').type(nuovoClientePF.nome)
        getSCU().find('#cognome').type(nuovoClientePF.cognome)
        getSCU().find('#comune-nascita').type('LONIGO')
        getSCU().find('li:contains("LONIGO")').click()
        getSCU().find('span[aria-owns="sesso_listbox"]').click()
        getSCU().find('li:contains("Maschile")').click()
        getSCU().find('#data-nascita').type('25011985')
        getSCU().find('#calcola-codice-fiscale').click()
        getSCU().find('span[aria-owns="professione_listbox"]').click()
        getSCU().find('li:contains("Architetto")').click()
        getSCU().find('#unita-di-mercato').type('1022')
        getSCU().find('li:contains("1022")').click()
        getSCU().find('#pep-no').click({ force: true })
        cy.screenshot('Dati Anagrafici', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getSCU().find('button:contains("Avanti")').click()
    }

    static nuovoClientePFContatti() {
        getSCU().find('span[aria-owns="toponomastica_listbox"]').click()
        getSCU().find('li').contains(/^PIAZZA$/).click()
        getSCU().find('#indirizzo-via').type('GIUSEPPE GARIBALDI')
        getSCU().find('#indirizzo-num').type('1')
        getSCU().find('#residenza-comune').type('LONIGO')
        getSCU().find('#residenza-comune_listbox').click()
        getSCU().find('span[aria-owns="tipo-tel_listbox"]').click()
        cy.screenshot('Contatti', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getSCU().find('button:contains("Avanti")').click()
    }

    static nuovoClientePFConsensi() {
        getSCU().find('label[for="invio-documenti-no"]').click()
        getSCU().find('label[for="firma-grafometrica-no"]').click()
        getSCU().find('label[for="consenso-otp-no"]').click()
        getSCU().find('label[for="promo-allianz-no"]').click()
        getSCU().find('label[for="promo-allianz-terzi-no"]').click()
        getSCU().find('label[for="promo-allianz-profilazione-no"]').click()
        getSCU().find('label[for="promo-allianz-indagini-no"]').click()
        getSCU().find('label[for="quest-adeguatezza-vita-no"]').click()
        cy.screenshot('Consensi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        getSCU().find('button:contains("Avanti")').click()
    }

    static nuovoClientePFDocumento() {
        getSCU().find('span[aria-owns="tipo-documento_listbox"]').click()
        getSCU().find('li:contains("CARTA D\'IDENTITA\'")').click()
        getSCU().find('#numero-documento').type('AR66666')
        getSCU().find('#data-emissione').type('01012021')
        getSCU().find('#data-scadenza').type('01012030')
        getSCU().find('#luogo-emissione').type('LONIGO')
        getSCU().find('#luogo-emissione_listbox').click()
        cy.screenshot('Documento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getSCU().find('button:contains("Avanti")').click()
        getSCU().find('button:contains("Conferma")').click()
    }
    //#endregion

    //#region Persona Giuridica
    static nuovoClientePGDatiAnagrafici(nuovoClientePG) {
        getSCU().find('#ragione-sociale').clear().type(nuovoClientePG.ragioneSociale)
        getSCU().find('span[aria-owns="forma-giuridica_listbox"]').click()
        let re = new RegExp("\^" + nuovoClientePG.formaGiuridica + "\$")
        getSCU().find('li').contains(re).click()
        getSCU().find('span[aria-owns="tipologia_listbox"]').click()
        getSCU().find("li:contains('" + nuovoClientePG.tipologia + "')").click()
        getSCU().find('span[aria-owns="settore-attivita_listbox"]').click()
        getSCU().find('li:contains("COSTRUZIONI")').click()
        getSCU().find('#partita-iva').type(nuovoClientePG.partitaIva)
        console.log('PARITAAA: ' + nuovoClientePG.partitaIva)
        getSCU().find('#codice-fiscale-impresa').type(nuovoClientePG.partitaIva)
        getSCU().find('#unita-di-mercato').type('1022')
        getSCU().find('li:contains("1022")').click()
        cy.screenshot('Dati Anagrafici', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        getSCU().find('button:contains("Avanti")').click()
    }

    static modificaClientePGDatiAnagrafici(clientePG) {
        cy.wait(4000)
        getSCU().find('#headingAnagrafica').click().wait(1000)
        getSCU().find('#partita-iva').clear().wait(1000).type(clientePG.partitaIva)
        getSCU().find('#codice-fiscale-impresa').clear().type(clientePG.partitaIva)
        getSCU().find('span[aria-owns="settore-attivita_listbox"]').click();
        getSCU().find('li:contains("COSTRUZIONI")').click();
        getSCU().find('#unita-di-mercato').clear().type('1022');
        getSCU().find('li:contains("1022")').click();
        getSCU().find('span[aria-owns="forma-giuridica_listbox"]').click()
        let re = new RegExp("\^" + clientePG.formaGiuridica + "\$")
        getSCU().find('li').contains(re).click()
        getSCU().find('span[aria-owns="tipologia_listbox"]').click()
        getSCU().find("li:contains('" + clientePG.tipologia + "')").click()
        getSCU().find('span[aria-owns="nazione-partita-iva_listbox"]').click();
        getSCU().find('li:contains("IT-Italia")').click();
        getSCU().within(() => {
            cy.get('#collapseAnagrafica').find('h2:contains("Dati principali")').click()
            cy.screenshot('Dati Anagrafici', { overwrite: true })
        })
    }

    static nuovoClientePGContatti(nuovoClientePG) {
        //Sede Legale
        getSCU().find('span[aria-owns="toponomastica_listbox"]').click()
        let re = new RegExp("\^" + nuovoClientePG.toponimo + "\$")
        getSCU().find('li').contains(re).click()
        getSCU().find('#indirizzo-via').type(nuovoClientePG.indirizzo)
        getSCU().find('#indirizzo-num').type(nuovoClientePG.numCivico)
        getSCU().find('#residenza-comune').type(nuovoClientePG.citta)
        getSCU().find('#residenza-comune_listbox').click()
        //Contatto Email
        getSCU().find('#email').type(nuovoClientePG.email)

        cy.intercept({
            method: 'POST',
            url: /NormalizzaUbicazione/
        }).as('normalizzaUbicazione')

        if (Cypress.isBrowser('firefox'))
            cy.screenshot('Contatti', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        getSCU().find('button:contains("Avanti")').click()

        cy.wait('@normalizzaUbicazione', { requestTimeout: 10000 })

        //#region Verifica presenza normalizzatore
        getSCU().find('#Allianz-msg-container').then((container) => {
            if (container.find('li:contains(normalizzata)').length > 0) {
                getSCU().find('button:contains("Avanti")').click()
            }
        })
        //#endregion
    }

    static modificaClientePGModificaContatti(clientePG) {
        getSCU().find('a:contains("Contatti")').click().wait(1000)
        //getSCU().find('#pec').clear().type(clientePG.pec)
        getSCU().find('#email').clear().type(clientePG.mail)
        getSCU().within(() => {
            cy.get('#collapseContatti').find('h2:contains("Sede Legale")').click()
        })
        cy.screenshot('Contatti', { overwrite: true })
    }

    static nuovoClientePGConsensi() {
        getSCU().find('label[for="invio-documenti-no"]').click()
        getSCU().find('label[for="firma-grafometrica-no"]').click()
        getSCU().find('label[for="promo-allianz-no"]').click()
        getSCU().find('label[for="promo-allianz-terzi-no"]').click()
        getSCU().find('label[for="promo-allianz-profilazione-no"]').click()
        getSCU().find('label[for="promo-allianz-indagini-no"]').click()
        getSCU().find('label[for="quest-adeguatezza-vita-no"]').click()

        cy.screenshot('Consensi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

    }

    static modificaClientePGConsensi(clientePG) {
        getSCU().find('a:contains("Consensi")').click()
        clientePG.invioPec ? getSCU().find('label[for="invio-documenti-pec-si"]').click() :
            getSCU().find('label[for="invio-documenti-pec-no"]').click()
        getSCU().find('label[for="firma-grafometrica-no"]').click()
        getSCU().find('label[for="promo-allianz-no"]').click()
        getSCU().find('label[for="promo-allianz-terzi-no"]').click()
        getSCU().find('label[for="promo-allianz-profilazione-no"]').click()
        getSCU().find('label[for="promo-allianz-indagini-no"]').click()
        getSCU().within(() => {
            cy.get('#collapseConsensi').find('h5:contains("Privacy e consensi")').click()
            cy.screenshot('Consensi', { overwrite: true })
        })
    }

    static nuovoClientePGConfermaInserimento() {
        cy.intercept({
            method: 'GET',
            url: /VerificaPiva*/
        }).as('verificaPiva')

        cy.intercept({
            method: 'POST',
            url: /Post/
        }).as('post')

        cy.screenshot('Conferma Inserimento', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        getSCU().find('button:contains("Avanti")').click().wait(2000)

        cy.wait('@verificaPiva', { requestTimeout: 10000 })
        cy.wait('@post', { requestTimeout: 10000 })

        //Verifica presenza normalizzatore
        getSCU().find('#Allianz-msg-container').then((container) => {
            if (container.find('li:contains(normalizzati)').length > 0) {
                getSCU().find('button:contains("Avanti")').click()
            }
        })

        getSCU().find('button:contains("Conferma")').click()
    }

    static modificaClientePGConfermaModifiche() {
        //#region Intercept
        cy.intercept({
            method: 'POST',
            url: /NormalizeImpresa/
        }).as('normalizeImpresa')

        cy.intercept({
            method: 'POST',
            url: /ValidateForEdit/
        }).as('validateForEdit')

        cy.intercept({
            method: 'GET',
            url: '**/AnagrafeWA40/**'
        }).as('anagrafeWA40')

        cy.intercept({
            method: 'GET',
            url: '**/SCU/**'
        }).as('scu')

        cy.intercept({
            method: 'POST',
            url: /getCustomerTree/
        }).as('getCustomerTree')
        //#endregion Intercept

        getSCU().find('#submit').click().wait(1000)

        //Verifica presenza normalizzatore
        getSCU().find('#Allianz-msg-container').then((container) => {
            if (container.find('li:contains(normalizzati)').length > 0) {
                getSCU().find('#submit').click()
            }
        });

        cy.wait('@normalizeImpresa', { requestTimeout: 60000 });
        cy.wait('@validateForEdit', { requestTimeout: 60000 });
        cy.wait('@anagrafeWA40', { requestTimeout: 120000 });
        cy.wait('@scu', { requestTimeout: 60000 }).wait(1000);

        getSCU().find('button:contains("Conferma")').click();

        //Restiamo in attesa del caricamento del tree del folder
        cy.wait('@getCustomerTree', { requestTimeout: 30000 });
    }
    //#endregion

    static generazioneStampe(isModifica = false) {
        cy.intercept({
            method: 'POST',
            url: /WriteConsensi/
        }).as('writeConsensi')

        cy.intercept({
            method: 'POST',
            url: /GenerazioneStampe/
        }).as('generazioneStampe')

        cy.intercept({
            method: 'POST',
            url: /SalvaInContentManager/
        }).as('salvaInContentManager')

        //Se sono in Censimento
        if (!isModifica) {
            cy.wait(3000)
            getSCU().then($body => {
                if ($body.find('button:contains("Conferma")').length > 0) {
                    getSCU().find('button:contains("Conferma")').click();
                }
            });

            cy.wait('@writeConsensi', { requestTimeout: 60000 })
            cy.wait('@generazioneStampe', { requestTimeout: 60000 })
            cy.wait('@salvaInContentManager', { requestTimeout: 80000 })
        }
        //Se sono in Modifica
        else {
            cy.wait(5000)
            //Popup Risulta un UNICO...
            getSCU().then($body => {
                if ($body.find('button:contains("NO")').length > 0) {
                    $body.find('button:contains("NO")').click();
                }
            });
            //Nessun documento da stampare...
            getSCU().then($body => {
                if ($body.find('button:contains("Esci")').length > 0)
                    getSCU().find('button:contains("Esci")').click()
            });

            //cy.wait('@generazioneStampe', { requestTimeout: 60000 })
            cy.wait('@salvaInContentManager', { requestTimeout: 60000 })
        }

        cy.screenshot('Generazione Stampe', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        //Pulsante per terminare la procedura di censimento/modifica
        getSCU().then($body => {
            if ($body.find('#endWorkflowButton').length > 0)
                getSCU().find('#endWorkflowButton').click()
        });

        cy.wait(8000)

    }

    static VerificaDocumentiInsufficienti() {
        cy.screenshot('Documenti Insufficienti', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        getSCU().find('button:contains("Inserisci il documento")').click()
    }

    static checkAggancioRicerca() {
        getSCU().find('#cerca-pers-forinsert-cf').should('exist').and('be.visible')
        cy.screenshot('Aggancio Ricerca', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static checkAggancioPolizzePropostePreventivi() {
        getSCU().find('#casella-ricerca').should('exist').and('be.visible')
        cy.screenshot('Aggancio Polizze Proposte Preventivi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static checkAggancioRubrica() {
        getIFrameElencoTelefonico().find('input[name="btnCerca"]').invoke('attr', 'value').should('equal', ' Cerca ')
        cy.screenshot('Aggancio Rubrica', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

}

export default SCU