/// <reference types="Cypress" />

const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
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
        getSCU().find('button:contains("Avanti")').click()
        getSCU().find('button:contains("Conferma")').click()
    }
    //#endregion

    //#region Persona Giuridica
    static nuovoClientePGDatiAnagrafici(nuovoClientePG) {
        getSCU().find('#ragione-sociale').type(nuovoClientePG.ragioneSociale)
        getSCU().find('span[aria-owns="forma-giuridica_listbox"]').click()
        getSCU().find('li').contains(/^S.R.L.$/).click()
        getSCU().find('span[aria-owns="tipologia_listbox"]').click()
        getSCU().find('li:contains("DITTA")').click()
        getSCU().find('span[aria-owns="settore-attivita_listbox"]').click()
        getSCU().find('li:contains("COSTRUZIONI")').click()
        getSCU().find('#partita-iva').type(nuovoClientePG.partitaIva)
        getSCU().find('#codice-fiscale-impresa').type(nuovoClientePG.partitaIva)
        getSCU().find('#unita-di-mercato').type('1022')
        getSCU().find('li:contains("1022")').click()
        getSCU().find('button:contains("Avanti")').click()
    }

    static nuovoClientePGContatti(nuovoClientePG) {
        //Sede Legale
        getSCU().find('span[aria-owns="toponomastica_listbox"]').click()
        getSCU().find('li').contains(/^PIAZZA$/).click()
        getSCU().find('#indirizzo-via').type('GIUSEPPE GARIBALDO')
        getSCU().find('#indirizzo-num').type('1')
        getSCU().find('#residenza-comune').type('LONIGO')
        getSCU().find('#residenza-comune_listbox').click()
        //Contatto Email
        getSCU().find('#email').type(nuovoClientePG.email)

        cy.intercept({
            method: 'POST',
            url: /NormalizzaUbicazione/
        }).as('normalizzaUbicazione')

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

    static nuovoClientePGConsensi() {
        getSCU().find('label[for="invio-documenti-no"]').click()
        getSCU().find('label[for="firma-grafometrica-no"]').click()
        getSCU().find('label[for="promo-allianz-no"]').click()
        getSCU().find('label[for="promo-allianz-terzi-no"]').click()
        getSCU().find('label[for="promo-allianz-profilazione-no"]').click()
        getSCU().find('label[for="promo-allianz-indagini-no"]').click()
        getSCU().find('label[for="quest-adeguatezza-vita-no"]').click()
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
    //#endregion

    static generazioneStampe() {
        getSCU().contains('Conferma').click()
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

        cy.wait('@writeConsensi', { requestTimeout: 60000 })
        cy.wait('@generazioneStampe', { requestTimeout: 60000 })
        cy.wait('@salvaInContentManager', { requestTimeout: 60000 })

        getSCU().find('#endWorkflowButton').click()
    }

    static VerificaDocumentiInsufficienti(){
        getSCU().find('button:contains("Inserisci il documento")').click()
    }
}

export default SCU