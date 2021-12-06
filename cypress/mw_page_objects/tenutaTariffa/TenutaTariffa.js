/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

const { XMLParser } = require('fast-xml-parser')
let parsedLogTariffa
let parsedRadarUW

function findKeyLogTariffa(key, logTariffa = parsedLogTariffa) {
    var result;

    for (var property in logTariffa) {
        if (logTariffa.hasOwnProperty(property)) {
            if (property === key) {
                return logTariffa[key]; // returns the value
            }
            else if (typeof logTariffa[property] === "object") {
                // in case it is an object
                result = findKeyLogTariffa(key, logTariffa[property]);

                if (typeof result !== "undefined") {
                    return result;
                }
            }
        }
    }
}
function findKeyRadarUW(key, logRadarUW = parsedRadarUW) {
    var result;

    for (var property in logRadarUW) {
        if (logRadarUW.hasOwnProperty(property)) {
            if (property === key) {
                return logRadarUW[key]; // returns the value
            }
            else if (typeof logRadarUW[property] === "object") {
                // in case it is an object
                result = findKeyRadarUW(key, logRadarUW[property]);

                if (typeof result !== "undefined") {
                    return result;
                }
            }
        }
    }
}

let currentDataNascita
class TenutaTariffa {
    static compilaDatiQuotazione(currentCase) {

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            //Tipologia Veicolo
            // * auto è già selezionato di default quindi lo skippo
            if (currentCase.Tipo_Veicolo !== 'auto' && currentCase.Tipo_Veicolo !== 'fuoristrada') {
                cy.contains('un\'auto').parent().should('exist').and('be.visible').click().wait(500)
                cy.contains(currentCase.Tipo_Veicolo).should('exist').and('be.visible').click().wait(2000)
            }

            //Targa
            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Targa"]').type(currentCase.Targa).wait(500)

            //Data di Nascita : calcolata in automatico a partire dalla data decorrenza in rapporto all'età del caso
            let dataDecorrenza = calcolaDataDecorrenza(currentCase)
            currentDataNascita = new Date(dataDecorrenza.getFullYear() - currentCase.Eta, dataDecorrenza.getMonth(), dataDecorrenza.getDate())
            let formattedDataNascita = String(currentDataNascita.getDate()).padStart(2, '0') + '/' +
                String(currentDataNascita.getMonth() + 1).padStart(2, '0') + '/' +
                currentDataNascita.getFullYear()
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(formattedDataNascita).wait(1000)

            cy.get('label[id="nx-checkbox-informativa-label"]>span').eq(0).click({ force: true }).wait(500)

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '01_Dati_Quotazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })
        })
    }

    static compilaContraenteProprietario(currentCase) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            //TODO E' il proprietario principale del veicolo

            //Dati cliente Persona Fisica al momento
            //Dati generati Random per quanto riguarda nome e cognome
            cy.task('nuovoClientePersonaFisica').then((currentPersonaFisica) => {
                let currentCognome = currentPersonaFisica.cognome
                let currentNome = currentPersonaFisica.nome

                cy.get('input[formcontrolname="nome"]').should('exist').and('be.visible').type(currentPersonaFisica.nome.toUpperCase()).wait(500)
                cy.get('input[formcontrolname="cognomeRagioneSociale"]').should('exist').and('be.visible').type(currentPersonaFisica.cognome.toUpperCase()).wait(500)
                cy.get('input[formcontrolname="luogoNascita"]').should('exist').and('be.visible').type(currentCase.Comune).wait(500)
                cy.get('nx-dropdown[formcontrolname="toponimo"]').should('exist').and('be.visible').click().wait(500)
                let re = new RegExp("\^ " + currentCase.Toponimo.toLowerCase() + " \$")
                cy.contains(re).should('exist').and('be.visible').click().wait(500)
                cy.get('input[formcontrolname="indirizzo"]').should('exist').and('be.visible').type(currentCase.Indirizzo).wait(500)
                cy.get('input[formcontrolname="civico"]').should('exist').and('be.visible').type(currentCase.Numero_Civico).wait(500)
                cy.get('input[formcontrolname="citta"]').should('exist').and('be.visible').type(currentCase.Comune).wait(500)
                cy.get('input[formcontrolname="provincia"]').should('exist').and('be.visible').type(currentCase.Provincia).wait(500)
                cy.get('input[formcontrolname="cap"]').should('exist').and('be.visible').type(currentCase.CAP).wait(500)
                cy.get('nx-dropdown[formcontrolname="professione"]').should('exist').and('be.visible').click().wait(500)
                if (currentCase.Professione.includes('('))
                    cy.contains(currentCase.Professione).should('exist').click().wait(500)
                else {
                    re = new RegExp("\^ " + currentCase.Professione + " \$")
                    cy.contains(re).should('exist').click().wait(500)
                }

                //Generiamo il codice fiscale
                let formattedDataNascita = currentDataNascita.getFullYear() + '-' +
                    String(currentDataNascita.getMonth() + 1).padStart(2, '0') + '-' +
                    String(currentDataNascita.getDate()).padStart(2, '0')

                cy.getSSN(currentCognome, currentNome, currentCase.Comune, currentCase.Cod_Comune, formattedDataNascita, 'M').then(currentSSN => {
                    cy.get('input[formcontrolname="cfIva"]').should('exist').and('be.visible').type(currentSSN).wait(500)
                })

                cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '02_Contraente_Proprietario', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

                cy.contains('AVANTI').should('exist').and('be.visible').click().wait(500)

                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible').wait(500)

                //! Riclicchiamo su AVANTI (dopo che i textbox non sono più rossi)
                cy.get('span[class="page-title"]').invoke('text').then(pageTitle => {
                    if (!pageTitle.includes('Veicolo')) {
                        cy.contains('AVANTI').should('exist').and('be.visible').click().wait(500)
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible').wait(500)
                    }
                })
            })
        })
    }

    static compilaVeicolo(currentCase) {
        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()

        cy.get('@iframe').within(() => {
            //#region Informazioni Generali

            //Data Immatricolazione
            //Tolgo 10 gg per non incorrere in certe casistiche di 30, 60 gg esatti che in fase di tariffazione creano problemi
            let dataPrimaImmatricolazione
            if (currentCase.Prima_Immatricolazione.split(' ')[1].includes('ann')) {
                let dataDecorrenza = calcolaDataDecorrenza(currentCase)
                dataPrimaImmatricolazione = new Date(dataDecorrenza.getFullYear() - currentCase.Prima_Immatricolazione.split(' ')[0],
                    dataDecorrenza.getMonth(),
                    dataDecorrenza.getDate() - 10)
                let formattedPrimaImmatricolazione = String(dataPrimaImmatricolazione.getDate()).padStart(2, '0') + '/' +
                    String(dataPrimaImmatricolazione.getMonth() + 1).padStart(2, '0') + '/' +
                    dataPrimaImmatricolazione.getFullYear()

                cy.get('input[formcontrolname="dataImmatricolazione"]').should('exist').and('be.visible').clear().wait(500)
                cy.get('input[formcontrolname="dataImmatricolazione"]').should('exist').and('be.visible').type(formattedPrimaImmatricolazione).type('{enter}').wait(500)

                cy.wait('@getMotor', { requestTimeout: 30000 })
            }

            //Tipo Veicolo
            cy.get('nx-dropdown[formcontrolname="tipoVeicolo"]').should('exist').and('be.visible').click().wait(1000)
            cy.contains(currentCase.Tipo_Veicolo).should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Marca
            cy.get('nx-dropdown[formcontrolname="marca"]').should('exist').and('be.visible').click().wait(500)
            cy.get('.nx-dropdown__filter-input').should('exist').and('be.visible').type(currentCase.Marca).wait(500)
            let re = new RegExp("\^ " + currentCase.Marca + " \$")
            cy.contains(re).should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Modello
            cy.get('nx-dropdown[formcontrolname="modello"]').should('exist').and('be.visible').click().wait(500)
            cy.get('.nx-dropdown__filter-input').should('exist').and('be.visible').type(currentCase.Modello).wait(500)
            cy.contains(currentCase.Modello).should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Allestimento
            cy.get('nx-dropdown[formcontrolname="versione"]').should('exist').and('be.visible').click().wait(500)
            cy.get('.nx-dropdown__filter-input').should('exist').and('be.visible').type(currentCase.Versione).wait(500)
            cy.contains(currentCase.Versione).should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            cy.contains('Informazioni Generali').click().wait(500)
            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '03_Dati_Veicolo_Informazioni_Generali', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //#endregion

            //#region Dati Veicolo Tecnici
            //Posti
            if (currentCase.Posti !== "") {
                cy.get('input[formcontrolname="posti"]').should('exist').and('be.visible').type(currentCase.Posti).type('{enter}').wait(500)
                cy.wait('@getMotor', { requestTimeout: 30000 })
            }

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '04_Dati_Veicolo_Tecnici', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            cy.contains('AVANTI').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })
            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible').wait(500)
        });
    }

    static compilaProvenienza(currentCase) {
        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            //#region Provenienza
            cy.get('nx-dropdown[aria-haspopup="listbox"]').first().should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Provenienza).click().wait(500)

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible').wait(500)

            switch (currentCase.Provenienza) {
                case "Precedentemente assicurato altra compagnia":
                    //Nel Dettaglio
                    cy.get('nx-dropdown[aria-haspopup="listbox"]').last().should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Nel_Dettaglio).click().wait(500)
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    cy.contains('INSERISCI').should('exist').and('be.visible').click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })

                    //!Popup di dichiarazione di non circolazione a SI (non più presente?)
                    // cy.contains('Si').should('exist').and('be.visible').parent().click().wait(500)
                    // cy.contains('CONTINUA').should('exist').and('be.visible').click().wait(500)
                    // cy.wait('@getMotor', { requestTimeout: 30000 })
                    // cy.wait(1000)
                    break
                case "Voltura":
                    //Veicolo aggiuntivo o trasferimento classe per cessazione di rischio
                    cy.get('nx-checkbox[formcontrolname="isVeicoloAggiuntivoTraferimentoRischio"]').should('exist').and('be.visible').click()
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    //Data Voltura
                    if (currentCase.Data_Voltura === 'DATA DECORRENZA') {
                        let dataDecorrenza = calcolaDataDecorrenza(currentCase)

                        let formattedDataVoltura = String(dataDecorrenza.getDate()).padStart(2, '0') + '/' +
                            String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '/' +
                            dataDecorrenza.getFullYear()

                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').clear().wait(500)
                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').type(formattedDataVoltura).type('{enter}').wait(500)

                        cy.wait('@getMotor', { requestTimeout: 30000 })
                    }
                    else
                        throw new Error('Data Voltura non riconosciuta')

                    //Provenienza
                    cy.get('nx-dropdown[aria-haspopup="listbox"]').last().should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Sotto_Provenienza).click().wait(500)

                    //Targa di Provenienza
                    cy.contains('targa').should('exist').and('be.visible').parents('div[class="nx-formfield__input"]').find('input').first().type(currentCase.Targa_Provenienza).wait(500)

                    cy.contains('CERCA IN ANIA').click()
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    break
            }

            //Nessuna attestazione trovata in BDA
            cy.contains('Si').should('exist').and('be.visible').parent().click().wait(500)
            cy.contains('CONTINUA').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })
            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible').wait(500)

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '05_Provenienza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            //#region Dettagli
            //Scadenza precedente contratto
            let dataScadenzaPrecedenteContratto
            let dataDecorrenza = calcolaDataDecorrenza(currentCase)
            if (currentCase.Data_Scadenza.split(' ')[1].includes('giorn'))
                dataScadenzaPrecedenteContratto = new Date(dataDecorrenza.getFullYear(),
                    dataDecorrenza.getMonth(),
                    dataDecorrenza.getDate() - currentCase.Data_Scadenza.split(' ')[0])
            else if (currentCase.Data_Scadenza.split(' ')[1].includes('mes'))
                dataScadenzaPrecedenteContratto = new Date(dataDecorrenza.getFullYear(),
                    dataDecorrenza.getMonth() - currentCase.Data_Scadenza.split(' ')[0],
                    dataDecorrenza.getDate())

            let formattedDataScadenzaPrecedenteContratto = String(dataScadenzaPrecedenteContratto.getDate()).padStart(2, '0') + '/' +
                String(dataScadenzaPrecedenteContratto.getMonth() + 1).padStart(2, '0') + '/' +
                dataScadenzaPrecedenteContratto.getFullYear()

            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').last().should('exist').and('be.visible').clear().wait(500)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').last().should('exist').and('be.visible').type(formattedDataScadenzaPrecedenteContratto).type('{enter}').wait(500)

            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Compagnia di provenienza
            cy.contains('COMPAGNIA DI PROVENIENZA').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').contains(currentCase.Compagnia_Provenienza).click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Formula di provenienza
            cy.contains('FORMULA DI PROVENIENZA').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').contains(currentCase.Formula_Provenienza).click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            cy.get('h3:contains("Dettagli")').first().click().wait(500)
            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '06_Dettagli', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            //#region Sinistri
            cy.contains('Sinistri').click().wait(500)
            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '07_Sinistri', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            //#region CL
            //CL B. provenienza
            cy.contains('CL. B/ M provenienza').parents('div[class="nx-formfield__input-container"]').find('input').should('be.visible').type(currentCase.Cl_BM_Provenienza).wait(500)
            //CL B. assegnazione
            cy.contains('Cl. B/ M assegnazione').parents('div[class="nx-formfield__input-container"]').find('input').should('be.visible').type(currentCase.Cl_BM_Assegnazione).wait(500)
            //CL provenienza CU
            cy.contains('Cl. provenienza cu').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').contains(currentCase.Cl_Provenienza_CU).click().wait(500)
            //CL assegnazione CU
            cy.contains('Cl. assegnazione cu').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').contains(currentCase.Cl_Assegnazione_CU).click().wait(500)

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '08_CL', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            //TODO Attestato conforme all'articolo 134, comma 4 bis, del Codice assicurazioni ?

            cy.contains('AVANTI').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 100000 })
        })
    }

    static compilaOfferta(currentCase) {
        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            //Data Decorrenza
            let dataDecorrenza = calcolaDataDecorrenza(currentCase)
            let formattedDataDecorrenza = String(dataDecorrenza.getDate()).padStart(2, '0') + '/' +
                String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '/' +
                dataDecorrenza.getFullYear()

            cy.get('input[formcontrolname="dataDecorrenza"]').should('exist').and('be.visible').clear().wait(500)
            cy.get('input[formcontrolname="dataDecorrenza"]').should('exist').and('be.visible').type(formattedDataDecorrenza).type('{enter}').wait(500)

            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible').wait(500)

            //Verifichiamo che sia stata settata correttamente la data
            cy.get('input[formcontrolname="dataDecorrenza"]').should('exist').and('be.visible').invoke('val').then(currentDataDecorrenza =>{
                expect(currentDataDecorrenza).to.include(formattedDataDecorrenza)
            })

            cy.intercept({
                method: 'GET',
                url: '**/optional-pacchetti'
            }).as('getOptionalPacchetti')

            cy.intercept({
                method: 'GET',
                url: '**/impostazioni-generali'
            }).as('getImpostazioniGenerali')

            //Frazionamento
            cy.get('nx-dropdown[formcontrolname="frazionamento"]').should('exist').and('be.visible').click().wait(1000)
            cy.contains(currentCase.Frazionamento.toUpperCase()).should('exist').and('be.visible').click().wait(500)

            cy.wait('@getMotor', { requestTimeout: 30000 })
            cy.wait('@getOptionalPacchetti', { requestTimeout: 30000 })
            cy.wait('@getImpostazioniGenerali', { requestTimeout: 30000 })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible').wait(500)

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '09_Offerta_Recap_Top', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //Massimale
            cy.contains('Massimale').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').contains(currentCase.Massimale).click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible').wait(500)

            //Dividiamo per tipologia di veicolo
            switch (currentCase.Settore) {
                case '1':
                    //Conducente/Tipo Guida -> per il caso autocarro è pre-impostato
                    cy.contains('Tipo Guida').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Tipo_Guida).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })

                    //TODO Protezione Rivalsa è già settata come garanzia in automatico; implementa verficia di presenza

                    //Indennita' danno totale RCA
                    if (currentCase.Indennita_Danno_Totale !== '') {
                        cy.contains("Indennita' danno totale RCA").parents('tr').find('button').click()
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible').wait(500)
                    }

                    break
                case '4':
                    //? Conducente/Tipo Guida -> per il caso autocarro è pre-impostato
                    // cy.contains('Tipo Guida').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    // cy.get('nx-dropdown-item').contains(currentCase.Tipo_Guida).click().wait(500)
                    // cy.wait('@getMotor', { requestTimeout: 30000 })

                    //? Protezione Rivalsa -> per autocarro è settato in automatico
                    // cy.contains('Rivalsa').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    // cy.get('nx-dropdown-item').contains(currentCase.Rinuncia_Rivalsa).click().wait(500)
                    // cy.wait('@getMotor', { requestTimeout: 30000 })

                    //Carico e scarico
                    cy.contains('Carico e scarico').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Carico_Scarico).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    //Estensione Sgombero Neve
                    cy.contains('Estensione Sgombero Neve').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Sgombero_Neve).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    //Trasporto merci pericolose
                    cy.contains('Trasporto merci pericolose').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Merci_Pericolose).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    //Clausola Trasporti Eccezionali
                    cy.contains('Clausola Trasporti Eccezionali').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Trasporti_Eccezionali).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    break
                case '5':
                    //Conducente/Tipo Guida
                    cy.contains('Tipo Guida').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Tipo_Guida).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })

                    //Protezione Rivalsa
                    cy.contains('Rivalsa').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Rinuncia_Rivalsa).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })

                    //Protezione Bonus
                    cy.contains('Protezione Bonus').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Protezione_Bonus).click().wait(500)

                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)

                    //Opzione di sospendibilità
                    cy.contains('sospendibilità').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click().wait(500)
                    cy.get('nx-dropdown-item').contains(currentCase.Opzione_Spospendibilita).click().wait(500)
                    cy.wait('@getMotor', { requestTimeout: 30000 })

                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible').wait(500)
                    break
            }

            cy.get('strong:contains("Rc Auto")').click().wait(500)
            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '10_Offerta_RC', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //Verifichiamo il premio lordo a video
            cy.contains('BONUS/MALUS').parent('div').find('div[class="ng-star-inserted"]').invoke('text').then(premioLordo => {
                expect(premioLordo).contains(currentCase.Totale_Premio_Lordo)
            })
        })
    }

    static checkTariffa(currentCase) {

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('motor-footer').should('exist').and('be.visible').find('button').click().wait(5000)
            cy.getTariffaLog(currentCase).then(logFolder => {
                //#region LogTariffa
                cy.readFile(logFolder + "\\logTariffa.xml").then(fileContent => {
                    const options = {
                        ignoreAttributes: false
                    }
                    const parser = new XMLParser(options)
                    parsedLogTariffa = parser.parse(fileContent)

                    //Radar_KeyID
                    expect(JSON.stringify(findKeyLogTariffa('Radar_KeyID'))).to.contain(currentCase.Versione_Tariffa_Radar)
                    //CMC PUNTA FLEX
                    expect(JSON.stringify(findKeyLogTariffa('Radar_Punta_Flex_KeyID'))).to.contain(currentCase.Versione_Punta_Flex)
                })
                //#endregion

                //#region Radaruw
                cy.readFile(logFolder + "\\radaruw.xml").then(fileContent => {
                    const options = {
                        ignoreAttributes: false
                    }
                    const parser = new XMLParser(options)
                    parsedRadarUW = parser.parse(fileContent)

                    //Radar_KeyID
                    expect(JSON.stringify(findKeyRadarUW('Versione_Radar'))).to.contain(currentCase.Versione_Radar_UW)

                })

                //#endregion
            })
        })
    }
}

function calcolaDataDecorrenza(currentCase) {

    let terminePeriodoTariffazione = currentCase.Periodo_Tariffazione.split('-')[1];

    switch (terminePeriodoTariffazione) {
        //! Month 0 is January....
        case "01":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 0, 31);
        case "02":
            const date = new Date(currentCase.Anno_Periodo_Tariffazione, 1, 29);
            if (date.getMonth() === 1)
                return new Date(currentCase.Anno_Periodo_Tariffazione, 1, 29);
            else
                return new Date(currentCase.Anno_Periodo_Tariffazione, 1, 28);
        case "03":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 2, 31);
        case "04":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 3, 30);
        case "05":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 4, 31);
        case "06":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 5, 30);
        case "07":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 6, 31);
        case "08":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 7, 31);
        case "09":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 8, 30);
        case "10":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 9, 31);
        case "11":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 10, 30);
        case "12":
            return new Date(currentCase.Anno_Periodo_Tariffazione, 11, 31);
    }
}

export default TenutaTariffa