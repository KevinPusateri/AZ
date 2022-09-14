/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

const { XMLParser } = require('fast-xml-parser')
const moment = require('moment')
const jsonDiff = require('../../../node_modules/json-diff/lib/index.js')

const motorAICertified = require('../../fixtures/Controllo_Fattori/motor_ai_Certified.json')

let parsedLogTariffa
let parsedRadarUW
let parsedLogProxy


function findKeyInLog(key, logTariffa = parsedLogTariffa) {
    var result

    for (var property in logTariffa) {
        if (logTariffa.hasOwnProperty(property)) {
            if (property === key) {
                return logTariffa[key]; // returns the value
            }
            else if (typeof logTariffa[property] === "object") {
                // in case it is an object
                result = findKeyInLog(key, logTariffa[property]);

                if (typeof result !== "undefined") {
                    return result;
                }
            }
        }
    }
}
function findKeyRadarUW(key, logRadarUW = parsedRadarUW) {
    var result

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
function findKeyGaranziaARD(descSettore, key, currentGaranziaARD = null) {
    var result
    let garanziaARD
    if (currentGaranziaARD === null) {
        //Recuperiamo le Garanzie presenti, la prima corrisponde alla RCA
        debugger
        if (descSettore === 'KASKO COMPLETA')
            garanziaARD = findKeyInLog('Garanzia')[2]
        else if (descSettore === 'AVENS')
            garanziaARD = findKeyInLog('Garanzia')[4]
        else
            garanziaARD = findKeyInLog('Garanzia')[1]
    }
    else
        garanziaARD = currentGaranziaARD

    for (var property in garanziaARD) {
        if (garanziaARD.hasOwnProperty(property)) {
            if (property === key)
                return garanziaARD[key]; // returns the value
            else if (typeof garanziaARD[property] === "object") {
                // in case it is an object
                result = findKeyGaranziaARD(descSettore, key, garanziaARD[property]);

                if (typeof result !== "undefined") {
                    return result;
                }
            }
        }
    }
}

let currentDataNascita
class TenutaTariffa {

    /**
     * Accesso all'Area Riservata dalla pagina di Offerta e verifica lato ARD
     */
    static areaRiservata(currentCase) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.contains('Area riservata').should('exist').click()
            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')

            //Per MACROLESIONI, verifico la Riduzione ARD
            if (currentCase.Descrizione_Settore === 'MACROLESIONI') {
                cy.get('.riduzione-table-header').last().find('p').last().invoke('text').then((riduzioneARD) => {
                    expect(riduzioneARD).contains(currentCase.Riduzione_ARD)
                    cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + 'Area_Riservata_ARD', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                })
            }
        })
    }

    static flussoATRScadenzaAltraCompagnia(caso) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            //Tipologia Veicolo
            //? al momento lavoriamo direttamente con gli Autoveicoli quindi non serve gestire questo dropdown che by default è selezionato auto

            //Targa
            // cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').click().wait(1000)
            // cy.get('input[aria-label="Targa"]').clear().wait(500).type(caso.Targa).wait(1000)
            cy.get('input[class^="cdk-text-field-autofill-monitored ng-untouched ng-pristine ng-invalid c-input nx-input"]').should('exist').and('be.visible').click().wait(1000)
            cy.get('input[class^="cdk-text-field-autofill-monitored ng-untouched ng-pristine ng-invalid c-input nx-input"]').clear().wait(500).type(caso.Targa).wait(1000)

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner', { timeout: 120000 }).should('not.be.visible')
            cy.wait(2000)

            //Data Nascita
            let myBirthDay = new Date(caso.Data_nascita)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click().wait(1000)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(('0' + myBirthDay.getDate()).slice(-2) + '/' + ('0' + (myBirthDay.getMonth() + 1)).slice(-2) + '/' + myBirthDay.getFullYear()).wait(1000)

            //Attendiamo che il caricamento non sia più visibile#
            cy.get('nx-spinner').should('not.be.visible')
            cy.wait(1000)

            // cy.get('label[id="nx-checkbox-informativa-label"]>span').eq(0).click({ force: true })
            cy.get('label[id="nx-checkbox-0-label"]>span').eq(0).click({ force: true })

            cy.screenshot('Dati Quotazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains('Calcola').should('be.visible').click({ force: true })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner', { timeout: 120000 }).should('not.be.visible')

            //Inseriamo la residenza
            //? se il cliente non è registrato in portafoglio, questa parte non compare
            cy.get('@iframe').within(() => { }).then($body => {
                var checkIndirizzoVisible = $body.find('input[aria-label="Indirizzo"]').is(':visible')
                if (checkIndirizzoVisible) {
                    //Toponimo
                    if (caso.Toponimo.toUpperCase() !== 'VIA') {
                        cy.contains('via').should('be.visible').click().wait(500)
                        let re = new RegExp("\^ " + caso.Toponimo.toLowerCase() + " \$")
                        cy.contains(re).should('exist').click().wait(500)
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')
                    }

                    //Indirizzo
                    cy.get('input[aria-label="Indirizzo"]').should('exist').and('be.visible').click().wait(1000)
                    cy.get('input[aria-label="Indirizzo"]').type(caso.Indirizzo).wait(500)
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')

                    //Numero Civico
                    //? Metto a 1 by default che lato assuntivo non mi importa
                    cy.get('input[aria-label="NumeroCivico"]').should('exist').and('be.visible').click().wait(1000)
                    cy.get('input[aria-label="NumeroCivico"]').type('1').wait(500)
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')

                    //Comune
                    cy.get('input[aria-label="Comune"]').should('exist').and('be.visible').click().wait(1000)
                    cy.get('input[aria-label="Comune"]').type(caso.Comune_residenza.toUpperCase()).wait(500)
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')

                    cy.screenshot('Dati Indirizzo', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

                    cy.contains('Calcola').should('be.visible').click({ force: true })
                }
            })

            //Verifichiamo se siamo arrivati in pagina di Offerta direttamente
            //Attendiamo che il caricamento non sia più visibile (ci mette un po')
            cy.get('nx-spinner', { timeout: 120000 }).should('not.be.visible')
            cy.screenshot('Offerta', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //Controlliamo i vari dati in Provenienza
            cy.contains('Provenienza').should('be.visible').click({ force: true }).wait(1000)
            cy.screenshot('Provenienza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.contains('MODIFICA').should('be.visible').click().wait(1000)
            cy.get('nx-spinner').should('not.be.visible')

            //Scadenza Precedente Contratto
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').last().should('exist').and('be.visible').invoke('val').then(dataScadenza => {
                let myDataScadenza = new Date(caso.Data_scadenza)
                expect(dataScadenza).to.include(('0' + myDataScadenza.getDate()).slice(-2) + '/' + ('0' + (myDataScadenza.getMonth() + 1)).slice(-2) + '/' + myDataScadenza.getFullYear())
            })
        })
    }

    static compilaDatiQuotazione(currentCase, flowClients) {

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            //Tipologia Veicolo
            // * auto è già selezionato di default quindi lo skippo
            if (currentCase.Tipo_Veicolo !== 'auto' && currentCase.Tipo_Veicolo !== 'fuoristrada' && currentCase.Tipo_Veicolo !== 'taxi' && currentCase.Tipo_Veicolo !== 'Auto Storica') {
                cy.contains('un\'auto').parent().should('exist').and('be.visible').click()
                if (currentCase.Tipo_Veicolo === 'ciclomotore' || currentCase.Tipo_Veicolo === 'autobus' || currentCase.Tipo_Veicolo === 'macchina operatrice' || currentCase.Tipo_Veicolo === 'macchina agricola')
                    cy.contains('altro').should('exist').and('be.visible').click().wait(2000)
                else
                    cy.contains(currentCase.Tipo_Veicolo).should('exist').and('be.visible').click().wait(2000)
            }

            //Il proprietario è una
            if (currentCase.Tipologia_Entita !== 'Persona') {

                //Settaggi vari per persona giuridica
                cy.contains('persona fisica').should('exist').and('be.visible').click()
                cy.contains('persona giuridica').should('exist').and('be.visible').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')

                if (currentCase.Provenienza !== "Prima immatricolazione") {
                    cy.contains('Il veicolo non è già assicurato').should('exist').and('be.visible').click()
                    cy.contains(' Il veicolo è già assicurato').should('exist').and('be.visible').click()
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')
                }

                //Settore di attività
                cy.contains('Il suo settore di attività è').should('exist').and('be.visible').parents('div[nxrowalignitems="center"]').first().find('nx-dropdown').click()
                cy.contains(currentCase.Settore_Attivita.toUpperCase()).should('exist').click()
            }
            else {
                //Data di Nascita : calcolata in automatico (se Data_Nascita non è popolato) a partire dalla data decorrenza in rapporto all'età del caso
                if (!flowClients) {
                    if (currentCase.Data_Nascita !== "") {
                        var dateParts = currentCase.Data_Nascita.split("/")
                        currentDataNascita = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])

                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click()
                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(currentCase.Data_Nascita).wait(1000)
                    }
                    else {
                        let dataDecorrenza = calcolaDataDecorrenza(currentCase)
                        currentDataNascita = new Date(dataDecorrenza.getFullYear() - currentCase.Eta, dataDecorrenza.getMonth(), dataDecorrenza.getDate())
                        let formattedDataNascita = String(currentDataNascita.getDate()).padStart(2, '0') + '/' +
                            String(currentDataNascita.getMonth() + 1).padStart(2, '0') + '/' +
                            currentDataNascita.getFullYear()
                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click()
                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(formattedDataNascita).wait(1000)
                    }

                }
            }

            //Targa
            if (currentCase.Targa !== '') {
                cy.contains('Il numero della targa').parent().find('nx-word').eq(1).find('input').should('exist').and('be.visible').click().wait(1000)
                cy.contains('Il numero della targa').parent().find('nx-word').eq(1).find('input').clear().wait(2000)
                cy.contains('Il numero della targa').parent().find('nx-word').eq(1).find('input').type(currentCase.Targa).wait(2000)
            }

            //Checkbox informativa
            cy.get('label[class="nx-checkbox__label has-label"]>span').eq(0).click({ force: true })

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '01_Dati_Quotazione', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            if (currentCase.Targa !== '')
                cy.contains('Calcola').should('be.visible').click({ force: true })
            else
                cy.contains('Non conosci la targa?').should('be.visible').click({ force: true })

            cy.task('log', 'Dati Quotazione compilati correttamente')

        })
    }

    static compilaContraenteProprietario(currentCase, flowClients) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            //TODO E' il proprietario principale del veicolo
            if (!flowClients) {
                if (currentCase.Tipologia_Entita === 'Persona')
                    cy.task('nuovoClientePersonaFisica').then((currentPersonaFisica) => {
                        // let currentCognome = currentPersonaFisica.cognome
                        // let currentNome = currentPersonaFisica.nome

                        cy.get('input[formcontrolname="nome"]').should('exist').and('be.visible').type((currentCase.Nome === undefined && currentCase.Cognome === undefined) ? currentPersonaFisica.nome.toUpperCase() : currentCase.Nome)
                        cy.get('input[formcontrolname="cognomeRagioneSociale"]').should('exist').and('be.visible').type((currentCase.Nome === undefined && currentCase.Cognome === undefined) ? currentPersonaFisica.cognome.toUpperCase() : currentCase.Cognome)

                        cy.get('input[formcontrolname="luogoNascita"]').should('exist').and('be.visible').type((currentCase.Comune_Nascita === undefined) ? currentCase.Comune : currentCase.Comune_Nascita).wait(2000)

                        cy.get('nx-autocomplete-option:visible').within(() => {
                            cy.get('.nx-autocomplete-option__label').first().click()
                        })

                        cy.get('nx-dropdown[formcontrolname="toponimo"]').should('exist').and('be.visible').click()
                        let re = new RegExp("\^ " + currentCase.Toponimo.toLowerCase() + " \$")
                        cy.contains(re).should('exist').and('be.visible').click()
                        cy.get('input[formcontrolname="indirizzo"]').should('exist').and('be.visible').type(currentCase.Indirizzo)
                        cy.get('input[formcontrolname="civico"]').should('exist').and('be.visible').type(currentCase.Numero_Civico)

                        //?29.08.22 Città ora viene fuori il dropdown di selezione, con compilazione autoamtica di provincia e cap
                        cy.get('input[formcontrolname="citta"]').should('exist').and('be.visible').type(currentCase.Comune).wait(2000)

                        if (Cypress.env('currentEnv') === 'TEST') {
                            cy.get('nx-autocomplete-option:visible').within(() => {
                                cy.get('.nx-autocomplete-option__label').first().click()
                            })

                            cy.get('nx-dropdown[formcontrolname="cap"]').should('exist').and('be.visible').then(($cap) => {
                                if ($cap.text().trim() === 'Inserisci') {
                                    cy.get('nx-dropdown[formcontrolname="cap"]').should('exist').and('be.visible').click()
                                    cy.get(`span:contains(${currentCase.CAP})`).should('exist').click()
                                }
                            })
                        }
                        else {
                            //!Fino alla release 126 - da cancellare dopo uscita release 127
                            cy.get('input[formcontrolname="provincia"]').should('exist').and('be.visible').type(currentCase.Provincia)
                            cy.get('input[formcontrolname="cap"]').should('exist').and('be.visible').type(currentCase.CAP)
                        }

                        cy.get('nx-dropdown[formcontrolname="professione"]').should('exist').and('be.visible').click()
                        if (currentCase.Professione.includes('('))
                            cy.contains(currentCase.Professione).should('exist').click()
                        else {
                            re = new RegExp("\^ " + currentCase.Professione + " \$")
                            cy.contains(re).should('exist').click()
                        }

                        //? Dal rilascio del 21.06.22 viene calcolato in automatico il CF
                        cy.get('nx-dropdown[formcontrolname="sesso"]').should('exist').and('be.visible').click()
                        cy.contains((currentCase.Sesso === undefined || currentCase.Sesso === "") ? 'Maschio' : currentCase.Sesso).should('exist').and('be.visible').click()

                        //?Generiamo il codice fiscale --> generato automaticamente dall'applicativo ora
                        // let formattedDataNascita = currentDataNascita.getFullYear() + '-' +
                        //     String(currentDataNascita.getMonth() + 1).padStart(2, '0') + '-' +
                        //     String(currentDataNascita.getDate()).padStart(2, '0')

                        // cy.getSSN(currentCognome, currentNome, currentCase.Comune, currentCase.Cod_Comune, formattedDataNascita, 'M').then(currentSSN => {
                        //     cy.get('input[formcontrolname="cfIva"]').should('exist').and('be.visible').type(currentSSN)
                        // })


                    })
                else
                    cy.task('nuovoClientePersonaGiuridica').then((currentPersonaGiuridica) => {
                        let currentRagioneSociale = currentPersonaGiuridica.ragioneSociale
                        let currentPartitaIva = currentPersonaGiuridica.partitaIva

                        cy.get('input[formcontrolname="cognomeRagioneSociale"]').should('exist').and('be.visible').type(currentRagioneSociale.toUpperCase())

                        cy.get('nx-dropdown[formcontrolname="settoreAttivita"]').should('exist').and('be.visible').click()
                        cy.contains(currentCase.Settore_Attivita.toUpperCase()).should('exist').click()

                        cy.get('nx-dropdown[formcontrolname="toponimo"]').should('exist').and('be.visible').click()
                        let re = new RegExp("\^ " + currentCase.Toponimo.toLowerCase() + " \$")
                        cy.contains(re).should('exist').and('be.visible').click()
                        cy.get('input[formcontrolname="indirizzo"]').should('exist').and('be.visible').type(currentCase.Indirizzo)
                        cy.get('input[formcontrolname="civico"]').should('exist').and('be.visible').type(currentCase.Numero_Civico)
                        cy.get('input[formcontrolname="citta"]').should('exist').and('be.visible').type(currentCase.Comune)
                        cy.get('input[formcontrolname="provincia"]').should('exist').and('be.visible').type(currentCase.Provincia)
                        cy.get('input[formcontrolname="cap"]').should('exist').and('be.visible').type(currentCase.CAP)

                        cy.get('input[formcontrolname="cfIva"]').should('exist').and('be.visible').type(currentPartitaIva)

                    })
            }

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '02_Contraente_Proprietario', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            cy.contains('AVANTI').should('exist').and('be.visible').click()

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')
            //! Riclicchiamo su AVANTI (dopo che i textbox non sono più rossi)
            cy.get('span[class="page-title"]').invoke('text').then(pageTitle => {
                if (!pageTitle.includes('Veicolo')) {
                    cy.contains('AVANTI').should('exist').and('be.visible').click()
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')
                }
            })
        })

        cy.task('log', 'Dati Contraente Proprietario compilati correttamente')
    }

    static compilaVeicolo(currentCase) {
        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()

        cy.get('@iframe').within(() => {
            //#region Informazioni generali

            if (currentCase.Targa === '') {
                cy.contains('Ricerca senza targa').should('exist').and('be.visible').click()
                cy.contains('CONTINUA').should('exist').and('be.visible').click()
            }

            //Verifichiamo se Veicolo Storico
            if (currentCase.Descrizione_Settore.includes("STORICO")) {
                cy.get('nx-checkbox[formcontrolname="veicoloStorico"]').should('exist').and('be.visible').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Tipo Veicolo
            cy.get('nx-dropdown[formcontrolname="tipoVeicolo"]').should('exist').and('be.visible').invoke('text').then(tipVeicolo => {
                if (tipVeicolo.toLocaleLowerCase() !== currentCase.Tipo_Veicolo) {
                    cy.get('nx-dropdown[formcontrolname="tipoVeicolo"]').should('exist').and('be.visible').click().wait(1000)
                    if (currentCase.Tipo_Veicolo === 'autobus' || currentCase.Tipo_Veicolo === 'taxi' || currentCase.Tipo_Veicolo === 'macchina operatrice' || currentCase.Tipo_Veicolo === 'macchina agricola') {
                        cy.contains('altro').should('exist').click()

                        //In caso di autobus o taxi, compilo il form pop-up
                        let fullDetails = (currentCase.Tipo_Veicolo_Altro_Dettaglio_1 + ' - ' + currentCase.Tipo_Veicolo_Altro_Dettaglio_2).toUpperCase()

                        if (currentCase.Tipo_Veicolo_Altro_Dettaglio_3 !== "")
                            fullDetails += ' - ' + currentCase.Tipo_Veicolo_Altro_Dettaglio_3
                        if (currentCase.Tipo_Veicolo_Altro_Dettaglio_4 !== "")
                            fullDetails += ' - ' + currentCase.Tipo_Veicolo_Altro_Dettaglio_4.toUpperCase()

                        cy.get('nx-formfield[nxlabel="Veicolo"]').find('input').should('exist').and('be.visible').type((currentCase.Tipo_Veicolo_Altro_Dettaglio_1 + ' - ' + currentCase.Tipo_Veicolo_Altro_Dettaglio_2).toUpperCase())

                        cy.contains(fullDetails).click()


                        cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '03_Tipo_Veicolo', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

                        cy.contains('Conferma').click()
                    }
                    else {
                        let re = new RegExp("\^ " + currentCase.Tipo_Veicolo + " \$")
                        cy.contains(re).should('exist').click({ force: true })
                    }


                    cy.wait('@getMotor', { timeout: 30000 })

                    cy.wait(3000)

                    cy.get('nx-dropdown[formcontrolname="tipoVeicolo"]').within(($tipoVeicolo) => {
                        let isNotEmpty = $tipoVeicolo.find('span').is(':visible')
                        expect(isNotEmpty).to.be.true
                    })
                }
            })

           //Data Immatricolazione
            //Tolgo 10 gg per non incorrere in certe casistiche di 30, 60 gg esatti che in fase di tariffazione creano problemi
            //Differenziamo se Prima Immatricolazione è calcolata in automatico oppure è in formato data
            let dataPrimaImmatricolazione
            let formattedPrimaImmatricolazione
            if (!currentCase.Prima_Immatricolazione.includes('ann'))
                formattedPrimaImmatricolazione = currentCase.Prima_Immatricolazione
            else {
                if (currentCase.Prima_Immatricolazione.split(' ')[1].includes('ann')) {

                    let dataDecorrenza = calcolaDataDecorrenza(currentCase)
                    let formattedDataDecorrenza = dataDecorrenza.getFullYear() + '-' +
                        String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '-' +
                        String(dataDecorrenza.getDate()).padStart(2, '0')

                    formattedPrimaImmatricolazione = moment(formattedDataDecorrenza, 'YYYY-MM-DD').subtract(currentCase.Prima_Immatricolazione.split(' ')[0], 'years').subtract('10', 'days').format('DD/MM/YYYY')

                }
            }

            cy.get('input[formcontrolname="dataImmatricolazione"]').should('exist').and('be.visible').clear().wait(500)
            cy.get('input[formcontrolname="dataImmatricolazione"]').should('exist').and('be.visible').type(formattedPrimaImmatricolazione).type('{enter}').wait(500)

            cy.wait('@getMotor', { timeout: 30000 })

            cy.wait(2000)

            cy.get('input[formcontrolname="dataImmatricolazione"]').should('exist').and('be.visible').invoke('val').then(currentDataPrimaImmatricolazione => {
                expect(currentDataPrimaImmatricolazione).to.include(formattedPrimaImmatricolazione)
            })

            //? La differenza tra Allianz e AVIVA è che AVIVA per i veicoli senza catalogo ha la drop down con le marche, mentre Allianz ha solo la textbox.
            if ((currentCase.Tipo_Veicolo === 'autobus' || currentCase.Tipo_Veicolo === 'macchina operatrice' || currentCase.Tipo_Veicolo === 'macchina agricola') && !Cypress.env('isAviva')) {
                cy.get('input[formcontrolname="marcaModelloVersione"]').should('exist').type(currentCase.Marca + ' ' + currentCase.Modello + ' ' + currentCase.Versione)
            }
            else {
                //Marca
                cy.get('nx-dropdown[formcontrolname="marca"]').should('exist').and('be.visible').click()
                cy.get('.nx-dropdown__filter-input').should('exist').and('be.visible').type(currentCase.Marca)
                let re = new RegExp("\^ " + currentCase.Marca + " \$")
                cy.contains(re).should('exist').and('be.visible').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')

                //Per i modelli fuori catalogo, da compilare a mano; altrimenti utilizzo i dropdown
                if (currentCase.Settore === '3' || currentCase.Settore === '6' || currentCase.Settore === '7') {
                    //Modello Versione testo libero (essendo fuori catalogo)
                    cy.get('input[formcontrolname="marcaModelloVersione"]').should('exist').type(currentCase.Marca + ' ' + currentCase.Modello + ' ' + currentCase.Versione)
                }
                else {
                    cy.wait(3000)

                    //Modello
                    cy.get('nx-dropdown[formcontrolname="modello"]').should('exist').and('be.visible').click()
                    cy.get('.nx-dropdown__filter-input').should('exist').and('be.visible').type(currentCase.Modello)
                    cy.contains(currentCase.Modello).should('exist').and('be.visible').click()
                    cy.wait('@getMotor', { timeout: 30000 })
                    cy.wait(3000)
                    //Allestimento
                    cy.get('nx-dropdown[formcontrolname="versione"]').should('exist').and('be.visible').click()
                    cy.get('.nx-dropdown__filter-input').should('exist').and('be.visible').type(currentCase.Versione)
                    cy.contains(currentCase.Versione).should('exist').and('be.visible').click()
                    cy.wait('@getMotor', { timeout: 30000 })
                }
            }

            currentCase.Targa !== '' ? cy.contains('Informazioni').click() : cy.contains('Ricerca in banche dati il veicolo tramite il numero di targa o il modello prima di procedere all’inserimento.').click()
            //TODO vedi error on size
            //cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '03_Dati_Veicolo_Informazioni_Generali', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            //#region Dati Veicolo Tecnici
            //Numero iscrizione (per auto storica)
            if (currentCase.Numero_Iscrizione !== undefined && currentCase.Numero_Iscrizione !== "") {
                cy.get('input[formcontrolname="numeroIscrizione"]').should('exist').and('be.visible').clear().type(currentCase.Numero_Iscrizione).type('{enter}')
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Data iscrzione (per auto storica)
            if (currentCase.Data_Iscrizione !== undefined && currentCase.Data_Iscrizione !== "") {
                cy.get('input[formcontrolname="dataIscrizione"]').should('exist').and('be.visible').clear().wait(500)
                cy.get('input[formcontrolname="dataIscrizione"]').should('exist').and('be.visible').type(currentCase.Data_Iscrizione).type('{enter}').wait(500)

                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Registo automobilistico / Club federato (per auto storica)
            if (currentCase.Descrizione_Settore.includes("STORICO")) {
                cy.get('nx-dropdown[formcontrolname="registroAutomobilisticoClubFederato"]').should('exist').and('be.visible').click()
                cy.contains('AUTOMOTOCLUB').should('exist').and('be.visible').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Potenza
            if (currentCase.Potenza !== "") {
                cy.get('input[formcontrolname="potenza"]').should('exist').and('be.visible').clear().type(currentCase.Potenza).type('{enter}')
                cy.wait('@getMotor', { timeout: 30000 })
            }

            //Cavalli Fiscali
            if (currentCase.Cavalli_Fiscali !== undefined && currentCase.Cavalli_Fiscali !== "") {
                cy.get('input[formcontrolname="cavalli"]').should('exist').and('be.visible').clear().type(currentCase.Cavalli_Fiscali).type('{enter}')
                cy.wait('@getMotor', { timeout: 30000 })
            }

            //Posti
            if (currentCase.Posti !== "") {
                cy.get('input[formcontrolname="posti"]').should('exist').and('be.visible').clear().type(currentCase.Posti).type('{enter}')
                cy.wait('@getMotor', { timeout: 30000 })
            }

            //Alimentazione
            if (currentCase.Alimentazione !== "") {
                cy.get('nx-dropdown[formcontrolname="alimentazione"]').should('exist').and('be.visible').click()
                cy.contains(currentCase.Alimentazione).should('exist').and('be.visible').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Antifurto
            if (currentCase.Antifurto !== "") {
                cy.get('nx-dropdown[formcontrolname="antifurto"]').should('exist').and('be.visible').click()
                cy.contains(currentCase.Antifurto).should('exist').and('be.visible').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Peso Massimo Rimorchiabile
            if (currentCase.Peso_Max_Rimorchiabile !== "") {
                cy.get('input[formcontrolname="pesoMassimoRimorchiabile"]').should('exist').and('be.visible').clear().type(currentCase.Peso_Max_Rimorchiabile).type('{enter}')
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Peso Ordine di Marcia
            if (currentCase.Peso_Marcia !== "") {
                cy.get('input[formcontrolname="pesoOrdineMarcia"]').should('exist').and('be.visible').clear().type(currentCase.Peso_Marcia).type('{enter}')
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Valore Veicolo
            if (currentCase.Valore_Veicolo !== "") {
                cy.get('input[motoronlynumbers=""]').should('exist').and('be.visible').click()
                cy.get('input[motoronlynumbers=""]').clear().wait(500)
                cy.get('input[motoronlynumbers=""]').should('exist').and('be.visible').click()
                cy.get('input[motoronlynumbers=""]').type(currentCase.Valore_Veicolo).wait(500)
                cy.get('strong:contains("Valore del veicolo")').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '04_Dati_Veicolo_Tecnici', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            cy.contains('AVANTI').should('exist').and('be.visible').click()
            cy.wait('@getMotor', { timeout: 30000 })
            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')
        });
        cy.task('log', 'Dati Veicolo compilati correttamente')
    }

    static compilaProvenienza(currentCase) {

        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.wait(5000)
            //#region Provenienza
            cy.get('nx-dropdown[aria-haspopup="listbox"]').first().should('be.visible').click()
            cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Provenienza).click()

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')
            cy.wait(4000)
            switch (currentCase.Provenienza) {
                case "Precedentemente assicurato altra compagnia":
                    //Nel Dettaglio
                    cy.get('nx-dropdown[aria-haspopup="listbox"]').last().should('be.visible').click()
                    cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Nel_Dettaglio).click()
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')

                    cy.contains('INSERISCI').should('exist').and('be.visible').click()
                    cy.wait('@getMotor', { timeout: 30000 })
                    break
                case "Voltura":
                    //Veicolo aggiuntivo o trasferimento classe per cessazione di rischio (solo se Targa_Provenienza popolato)
                    if (currentCase.Targa_Provenienza !== "") {
                        cy.get('nx-checkbox[formcontrolname="isVeicoloAggiuntivoTraferimentoRischio"]').should('exist').and('be.visible').click()
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')
                    }

                    //Data Voltura
                    if (currentCase.Data_Voltura === 'DATA DECORRENZA') {
                        let dataDecorrenza = calcolaDataDecorrenza(currentCase)

                        let formattedDataVoltura = String(dataDecorrenza.getDate()).padStart(2, '0') + '/' +
                            String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '/' +
                            dataDecorrenza.getFullYear()

                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').clear()
                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').type(formattedDataVoltura).type('{enter}')

                        cy.wait('@getMotor', { timeout: 30000 })
                    }
                    else
                        throw new Error('Data Voltura non riconosciuta')

                    //Provenienza
                    if (currentCase.Sotto_Provenienza !== "") {
                        cy.get('nx-dropdown[aria-haspopup="listbox"]').last().should('be.visible').click()
                        cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Sotto_Provenienza).click()
                        //Targa di Provenienza
                        cy.contains('targa').should('exist').and('be.visible').parents('div[class="nx-formfield__input"]').find('input').first().type(currentCase.Targa_Provenienza)

                        cy.contains('CERCA IN ANIA').click()
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')
                    }

                    break
            }

            //Nessuna attestazione trovata in BDA
            if (currentCase.Provenienza !== "Prima immatricolazione" && currentCase.Sotto_Provenienza !== "") {
                cy.contains('Si').should('exist').and('be.visible').parent().click()
                cy.contains('CONTINUA').should('exist').and('be.visible').click()
                cy.wait('@getMotor', { timeout: 30000 })
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '05_Provenienza', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            //#endregion

            //#region Dettagli
            //? su Prima immatricolazione non servono i dettagli aggiuntivi
            if (currentCase.Provenienza !== "Prima immatricolazione") {
                let formattedDataScadenzaPrecedenteContratto
                if (currentCase.Data_Scadenza !== "") {
                    //Scadenza precedente contratto
                    let dataDecorrenza = calcolaDataDecorrenza(currentCase)
                    let formattedDataDecorrenza = dataDecorrenza.getFullYear() + '-' +
                        String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '-' +
                        String(dataDecorrenza.getDate()).padStart(2, '0')


                    if (currentCase.Data_Scadenza.split(' ')[1].includes('giorn'))
                        formattedDataScadenzaPrecedenteContratto = moment(formattedDataDecorrenza, 'YYYY-MM-DD').subtract(currentCase.Data_Scadenza.split(' ')[0], 'days').format('DD/MM/YYYY')
                    else if (currentCase.Data_Scadenza.split(' ')[1].includes('mes'))
                        formattedDataScadenzaPrecedenteContratto = moment(formattedDataDecorrenza, 'YYYY-MM-DD').subtract(currentCase.Data_Scadenza.split(' ')[0], 'months').format('DD/MM/YYYY')

                    cy.get('input[nxdisplayformat="DD/MM/YYYY"]').last().should('exist').and('be.visible').clear()
                    cy.get('input[nxdisplayformat="DD/MM/YYYY"]').last().should('exist').and('be.visible').type(formattedDataScadenzaPrecedenteContratto).type('{enter}')

                    cy.wait('@getMotor', { timeout: 30000 })
                }

                //Compagnia di provenienza
                if (currentCase.Compagnia_Provenienza !== "") {
                    cy.contains('COMPAGNIA DI PROVENIENZA').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Compagnia_Provenienza).click()

                    cy.wait('@getMotor', { timeout: 30000 })

                    //Formula di provenienza
                    cy.contains('FORMULA DI PROVENIENZA').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Formula_Provenienza).click()
                    cy.wait('@getMotor', { timeout: 30000 })

                    cy.get('h3:contains("Dettagli")').first().click()
                    cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '06_Dettagli', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true, disableTimersAndAnimations: false })
                    //#endregion

                    //Verifichiamo che la data non sia resettata
                    //? vedi bug trovato il release 124bis
                    if (currentCase.Data_Scadenza !== "")
                        cy.get('input[nxdisplayformat="DD/MM/YYYY"]').last().should('exist').and('be.visible').invoke('val').then(currentDataScadenzaPrecedenteContratto => {
                            expect(currentDataScadenzaPrecedenteContratto).to.include(formattedDataScadenzaPrecedenteContratto)
                        })

                    //Verifichiamo che la compagnia di provenienza non sia stata resettata
                    //? vedi bug trovato in release 124bis
                    //? Se non trova lo span è da segnalare come bug in quanto non ha salvato correttamente la compagnia di provenienza
                    cy.contains('COMPAGNIA DI PROVENIENZA').parents('div[class="nx-formfield__input"]').find('nx-dropdown').find('span').invoke('text').then(currentCompagniaProvenienza => {
                        expect(currentCompagniaProvenienza).to.include(currentCase.Compagnia_Provenienza.toUpperCase())
                    })


                    //#region Sinistri
                    cy.contains('Sinistri').click()
                    cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '07_Sinistri', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    //#endregion

                    //#region CL
                    //CL B. provenienza
                    cy.contains('CL. B/ M provenienza').parents('div[class="nx-formfield__input-container"]').find('input').should('be.visible').type(currentCase.Cl_BM_Provenienza).type('{enter}')
                    cy.get('nx-spinner').should('not.be.visible')
                    //CL B. assegnazione
                    cy.contains('Cl. B/ M assegnazione').parents('div[class="nx-formfield__input-container"]').find('input').should('be.visible').type(currentCase.Cl_BM_Assegnazione).type('{enter}')
                    cy.get('nx-spinner').should('not.be.visible')
                    //CL provenienza CU
                    cy.contains('Cl. provenienza cu').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Cl_Provenienza_CU).click()
                    cy.get('nx-spinner').should('not.be.visible')
                    //CL assegnazione CU
                    cy.contains('Cl. assegnazione cu').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Cl_Assegnazione_CU).click()
                    cy.get('nx-spinner').should('not.be.visible')


                    cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '08_CL', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                    //#endregion
                }
            }

            //TODO Attestato conforme all'articolo 134, comma 4 bis, del Codice assicurazioni ?
            cy.contains('AVANTI').should('exist').and('be.visible').click().wait(2000)

            //Popup di dichiarazione di non circolazione a SI
            cy.get('@iframe').then((iframe) => {
                if (iframe.find(':contains("Il proprietario presenta la dichiarazione di non circolazione?")').length > 0) {
                    cy.contains('Il proprietario presenta la dichiarazione di non circolazione?').should('exist').and('be.visible').parents('form').find('span:contains("Si")').click()
                    cy.contains('CONTINUA').should('exist').and('be.visible').click()
                    cy.wait('@getMotor', { timeout: 30000 })
                    cy.wait(1000)
                } else if (iframe.find(':contains("La data di decorrenza non permetterà il salvataggio del preventivo")').length > 0) {
                    cy.contains('CONTINUA').should('exist').and('be.visible').click()
                    cy.wait('@getMotor', { timeout: 30000 })
                    cy.wait(1000)
                }
            })

            cy.wait('@getMotor', { timeout: 100000 })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner', { timeout: 120000 }).should('not.be.visible')
        })

        cy.task('log', 'Dati Provenienza compilati correttamente')
    }

    static provenienzaVoltura(currentCase) {
        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')

            //Andiamo a settare la Voltura
            cy.get('nx-dropdown[aria-haspopup="listbox"]').first().should('be.visible').click()
            cy.get('nx-dropdown-item').should('be.visible').contains("Voltura").click()

            //Veicolo aggiuntivo o trasferimento classe per cessazione di rischio (solo se Targa_Provenienza popolato)
            if (currentCase.Targa_Provenienza !== "") {
                cy.get('nx-checkbox[formcontrolname="isVeicoloAggiuntivoTraferimentoRischio"]').should('exist').and('be.visible').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Data Voltura
            if (currentCase.Data_Voltura === 'DATA DECORRENZA') {
                let dataDecorrenza = calcolaDataDecorrenza(currentCase)

                let formattedDataVoltura = String(dataDecorrenza.getDate()).padStart(2, '0') + '/' +
                    String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '/' +
                    dataDecorrenza.getFullYear()

                cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').clear()
                cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').type(formattedDataVoltura).type('{enter}')

                cy.wait('@getMotor', { timeout: 30000 })
            }
            else
                throw new Error('Data Voltura non riconosciuta')

            //Primo Proprietario
            cy.get('input[formcontrolname="primoProprietario"]').should('exist').and('be.visible').type(currentCase.Primo_Proprietario)

            //Provenienza
            if (currentCase.Sotto_Provenienza !== "") {
                cy.get('nx-dropdown[aria-haspopup="listbox"]').last().should('be.visible').click()
                cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Sotto_Provenienza).click()
                //Targa di Provenienza
                cy.contains('targa').should('exist').and('be.visible').parents('div[class="nx-formfield__input"]').find('input').first().type(currentCase.Targa_Provenienza)

                cy.contains('CERCA IN ANIA').click()
                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            //Nessun proprietario della polizza indicata corrisponde a quello della nuova polizza.Trattasi di familiare convivente?
            cy.get('@iframe').then((iframe) => {
                if (iframe.find(':contains("Trattasi di familiare convivente?")').length > 0) {
                    cy.contains('Trattasi di familiare convivente?').should('exist').and('be.visible').parents('form').find('span:contains("Si")').click()
                    cy.contains('CONTINUA').should('exist').and('be.visible').click()
                    cy.wait('@getMotor', { timeout: 30000 })
                    cy.wait(3000)
                }
            })

            //i due soggetti non siano conviventi
            cy.get('@iframe').then((iframe) => {
                if (iframe.find(':contains("i due soggetti non siano conviventi")').length > 0) {
                    cy.contains('i due soggetti non siano conviventi').should('exist').and('be.visible').parents('form').find('span:contains("Si")').click()
                    cy.contains('CONTINUA').should('exist').and('be.visible').click()
                    cy.wait('@getMotor', { timeout: 30000 })
                    cy.wait(1000)
                }
            })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')
        })

        cy.task('log', 'Dati Provenienza compilati correttamente')
    }

    static getNumeroPreventivo() {
        return new Cypress.Promise(resolve => {
            cy.getIFrame()
            cy.get('@iframe').within(() => {
                cy.get('motor-footer').should('exist').and('be.visible').find('button').invoke('text').then(logText => {
                    resolve((logText.substring(logText.indexOf('P: ') + 3)).split(' ')[0])
                })
            })
        })
    }

    static compilaOffertaRCA(currentCase) {
        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            let dataDecorrenza = calcolaDataDecorrenza(currentCase)
            let formattedDataDecorrenza = String(dataDecorrenza.getDate()).padStart(2, '0') + '/' +
                String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '/' +
                dataDecorrenza.getFullYear()

            cy.get('nx-icon[name="pen"]').first().click().wait(700)
            cy.get('nx-icon[name="calendar"]').first().click()
            cy.contains('Scegli mese e anno').should('be.visible').click()

            //Selezioniamo l'anno
            cy.get('.nx-calendar-table').within(() => {
                cy.contains(dataDecorrenza.getFullYear()).click()
            })

            //Selezioniamo il mese
            cy.get('.nx-calendar-table').within(() => {
                cy.contains(dataDecorrenza.toLocaleString('default', { month: 'short' })).click()
            })

            //Selezioniamo il giorno
            cy.get('.nx-calendar-table').within(() => {
                cy.contains(String(dataDecorrenza.getDate())).click()
            })
            cy.wait('@getMotor', { timeout: 60000 })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')

            cy.intercept({
                method: 'GET',
                url: '**/optional-pacchetti'
            }).as('getOptionalPacchetti')

            cy.intercept({
                method: 'GET',
                url: '**/impostazioni-generali'
            }).as('getImpostazioniGenerali')

            //Frazionamento
            cy.get('#cart-bar > app-motor-cart > div > div > div.clickAble.nx-grid__column-6 > div > div > div > div > div:nth-child(2) > nx-icon').click()

            if (currentCase.Frazionamento.toLocaleLowerCase() !== "annuale") {

                cy.get('#cart-pop').within(() => {
                    cy.contains('annuale').should('exist').and('be.visible').click()
                })

                cy.contains(currentCase.Frazionamento.toLowerCase()).click()

                cy.wait('@getMotor', { timeout: 30000 })
                cy.wait('@getOptionalPacchetti', { timeout: 30000 })
                cy.wait('@getImpostazioniGenerali', { timeout: 30000 })

                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '09_Offerta_Recap_Top', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //Verifichiamo che sia stata settata correttamente la data
            cy.get('#sintesi-offerta-bar > div > form > div > div:nth-child(5) > div > div:nth-child(2) > div > p').should('exist').and('be.visible').invoke('text').then(currentDataDecorrenza => {
                expect(currentDataDecorrenza).to.include(formattedDataDecorrenza)
            })
            cy.wait(5000)

            //Espandiamo pannello RCA
            var rcaLabel
            if (currentCase.Settore == 6 || currentCase.Settore == 7)
                rcaLabel = "RCA - PREMIO FISSO UNIFICATA"
            else if (currentCase.Settore == 3)
                rcaLabel = "RCA - TARIFFA CON FRANCHIGIA FISSA ED ASSOLUTA UNIFICATA"
            else
                rcaLabel = "RCA - BONUS MALUS"

            cy.contains(rcaLabel).parents('form').within(() => {
                cy.get('nx-icon[class~="clickAble"]').first().click()
            })

            //Massimale
            cy.contains('Massimale').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
            cy.get('nx-dropdown-item').contains(currentCase.Massimale).click()
            cy.wait('@getMotor', { timeout: 30000 })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')

            //Dividiamo per tipologia di veicolo
            switch (currentCase.Settore) {
                case '1':
                    cy.wait(5000)
                    //Conducente/Tipo Guida -> per il caso autocarro è pre-impostato
                    cy.contains('Tipo Guida').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Tipo_Guida).click()
                    cy.wait('@getMotor', { timeout: 30000 })

                    //TODO Protezione Rivalsa è già settata come garanzia in automatico; implementa verficia di presenza
                    if (!Cypress.env('isAviva'))
                        //Indennita' danno totale RCA
                        if (currentCase.Indennita_Danno_Totale !== '') {
                            cy.contains("Indennita' danno totale RCA").parent('div').parent('div').within(() => {
                                cy.get('nx-checkbox').click()
                            })
                            //Attendiamo che il caricamento non sia più visibile
                            cy.get('nx-spinner').should('not.be.visible')
                        }

                    break
                case '3':
                    //Franchigia
                    if (currentCase.Franchigia !== '') {
                        cy.get(':contains("Franchigia"):last').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Franchigia).click()
                        cy.wait('@getMotor', { timeout: 30000 })
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')
                    }

                    //? Conducente/Tipo Guida è presettato

                    //Danni alle cose dei terzi trasportati
                    if (currentCase.Danni_Terzi_Trasportati !== '') {
                        cy.contains('Danni alle cose dei terzi trasportati').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Danni_Terzi_Trasportati).click()
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')
                        cy.wait('@getMotor', { timeout: 30000 })
                    }

                    //Rinuncia rilvalsa
                    if (currentCase.Rinuncia_Rivalsa !== '') {
                        cy.contains('Rivalsa').parents('motor-form-controllo').should('be.visible').find('nx-dropdown').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Rinuncia_Rivalsa).click()
                        cy.wait('@getMotor', { timeout: 30000 })
                    }
                    break
                case '4':
                    //? Conducente/Tipo Guida -> per il caso autocarro è pre-impostato
                    // cy.contains('Tipo Guida').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    // cy.get('nx-dropdown-item').contains(currentCase.Tipo_Guida).click()
                    // cy.wait('@getMotor', { timeout: 30000 })

                    //? Protezione Rivalsa -> per autocarro è settato in automatico
                    // cy.contains('Rivalsa').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    // cy.get('nx-dropdown-item').contains(currentCase.Rinuncia_Rivalsa).click()
                    // cy.wait('@getMotor', { timeout: 30000 })

                    cy.wait(5000)
                    if (!Cypress.env('isAviva')) {
                        //Carico e scarico
                        cy.contains('Carico e scarico').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Carico_Scarico).click()
                        cy.wait('@getMotor', { timeout: 30000 })
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')

                        //Estensione Sgombero Neve
                        cy.contains('Estensione Sgombero Neve').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Sgombero_Neve).click()
                        cy.wait('@getMotor', { timeout: 30000 })
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')

                        //Clausola Trasporti Eccezionali
                        cy.contains('Clausola Trasporti Eccezionali').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Trasporti_Eccezionali).click()
                        cy.wait('@getMotor', { timeout: 30000 })
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')
                    }

                    //Trasporto merci pericolose
                    cy.contains('Trasporto merci pericolose').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Merci_Pericolose).click()
                    cy.wait('@getMotor', { timeout: 30000 })
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')

                    break
                case '5':
                    cy.wait(5000)
                    //Conducente/Tipo Guida
                    cy.contains('Tipo Guida').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Tipo_Guida).click()
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')
                    cy.wait('@getMotor', { timeout: 30000 })

                    //Protezione Rivalsa
                    if (!Cypress.env('isAviva')) {
                        cy.contains('Rivalsa').parents('motor-form-controllo').should('be.visible').find('nx-dropdown').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Rinuncia_Rivalsa).click()
                        cy.wait('@getMotor', { timeout: 30000 })

                        //Protezione Bonus
                        cy.contains('Protezione Bonus').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Protezione_Bonus).click()
                    }


                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')
                    cy.wait(5000)

                    //Opzione di sospendibilità
                    if (Cypress.env('isAviva')) {
                        //? su AVIVA se il frazionamento non è annuale, non si puo' fare sospendibilità
                        if (currentCase.Frazionamento.toUpperCase() === 'ANNUALE' && currentCase.Opzione_Spospendibilita !== '') {
                            cy.contains('Sospensione').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                            cy.get('nx-dropdown-item').contains(currentCase.Opzione_Spospendibilita).click()
                            cy.wait('@getMotor', { timeout: 30000 })
                        }
                    }
                    else {
                        cy.contains('sospendibilità').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Opzione_Spospendibilita).click()
                        cy.wait('@getMotor', { timeout: 30000 })
                    }

                    cy.wait(2000)
                    //Attendiamo che il caricamento non sia più visibile
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                case '6':
                case '7':
                    //TODO Protezione Rivalsa è già settata come garanzia in automatico; implementa verficia di presenza
                    if (!Cypress.env('isAviva')) {
                        //Estensione Sgombero Neve
                        cy.contains('Estensione Sgombero Neve').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                        cy.get('nx-dropdown-item').contains(currentCase.Sgombero_Neve).click()
                        cy.wait('@getMotor', { timeout: 30000 })
                        //Attendiamo che il caricamento non sia più visibile
                        cy.get('nx-spinner').should('not.be.visible')
                    }
                    break
            }

            cy.get('h3:contains("Rc Auto")').click()
            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '10_Offerta_RC', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //Verifichiamo il premio lordo a video
            cy.contains(rcaLabel).parents('form').within(() => {
                cy.get('p[class~="premio"]').first().invoke('text').then(premioLordo => {

                    //expect(premioLordo).contains(currentCase.Totale_Premio_Lordo)
                    if (!premioLordo.includes(currentCase.Totale_Premio_Lordo)) {
                        cy.log('Attenzione : verificare differenza premi')
                        cy.log(`--> Valore rilevato : ${premioLordo}`)
                        cy.log(`--> Valore certificato : ${currentCase.Totale_Premio_Lordo}`)
                        cy.task('log', 'Attenzione : verificare differenza premi')
                        cy.task('log', `--> Valore rilevato : ${premioLordo}`)
                        cy.task('log', `--> Valore certificato : ${currentCase.Totale_Premio_Lordo}`)
                    }
                    else
                        cy.task('log', 'Dati Offerta compilati correttamente')
                })
            })
        })

    }

    static compilaOffertaARD(currentCase) {
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

            //! purtroppo il componente non è trovabile agevolmente al momento
            cy.get('#sintesi-offerta-bar > div > form > div > div:nth-child(5) > div > div:nth-child(2) > nx-icon').click()
            cy.get('nx-formfield').first().click().clear()
            cy.wait(700)
            cy.get('nx-formfield').first().click().type(formattedDataDecorrenza).click()

            cy.wait('@getMotor', { timeout: 60000 })

            //Attendiamo che il caricamento non sia più visibile
            cy.get('nx-spinner').should('not.be.visible')

            //La data di decorrenza non pemetterà il salvataggio del preventivo
            cy.get('@iframe').then((iframe) => {
                if (iframe.find(':contains("La data di decorrenza non pemetterà il salvataggio del preventivo")').length > 0) {
                    cy.contains('La data di decorrenza non pemetterà il salvataggio del preventivo').should('exist').and('be.visible').parents('nx-modal-container').find('span:contains("CONFERMA")').click()
                }
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
            cy.get('#cart-bar > app-motor-cart > div > div > div.clickAble.nx-grid__column-6 > div > div > div > div > div:nth-child(2) > nx-icon').click()

            if (currentCase.Frazionamento.toLocaleLowerCase() !== "annuale" && currentCase.Frazionamento !== "") {

                cy.get('#cart-pop').within(() => {
                    cy.contains('annuale').should('exist').and('be.visible').click()
                })

                cy.contains(currentCase.Frazionamento.toLowerCase()).click()

                cy.wait('@getMotor', { timeout: 30000 })
                cy.wait('@getOptionalPacchetti', { timeout: 30000 })
                cy.wait('@getImpostazioniGenerali', { timeout: 30000 })

                //Attendiamo che il caricamento non sia più visibile
                cy.get('nx-spinner').should('not.be.visible')
            }

            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '09_Offerta_Recap_Top', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //Verifichiamo che sia stata settata correttamente la data
            cy.get('#sintesi-offerta-bar > div > form > div > div:nth-child(5) > div > div:nth-child(2) > div > p').should('exist').and('be.visible').invoke('text').then(currentDataDecorrenza => {
                expect(currentDataDecorrenza).to.include(formattedDataDecorrenza)
            })

            //#region Effettuiamo un full deselect di tutte le ARD selezionate di default
            if (!Cypress.env('isAviva')) {
                //Incendio senza scoperto
                //? se non recupera il valore a catalogo, viene fuori solo l'etichetta 'Incendio'
                let incendioSenzaScoperto = false
                cy.get('@iframe').then((iframe) => {
                    if (iframe.find(':contains("Incendio senza scoperto")').length > 0) {
                        cy.contains("Incendio senza scoperto").parent('div').parent('div').within(() => {
                            cy.get('nx-checkbox').click()
                            incendioSenzaScoperto = true
                        })
                    }
                })

                if (incendioSenzaScoperto)
                    cy.get('nx-spinner').should('not.be.visible')

                //Assistenza Auto
                cy.wait(5000)
                cy.contains("Assistenza Auto").parent('div').parent('div').within(() => {
                    cy.get('nx-checkbox').click()
                })
                cy.get('nx-spinner').should('not.be.visible')
            }
            //#endregion

            switch (currentCase.Descrizione_Settore) {
                case "GARANZIE_AGGIUNTIVE_PACCHETTO_1":
                case "GARANZIE_AGGIUNTIVE_PACCHETTO_2":
                    cy.contains("Garanzie Aggiuntive").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    cy.wait(5000)

                    //Espandiamo pannello Garanzie Aggiuntive
                    cy.contains("Garanzie Aggiuntive").parent('div').parent('div').within(() => {
                        cy.get('nx-icon[class~="clickAble"]').first().click()
                    })
                    //Tipo pacchetto
                    let re = new RegExp("\^Tipo\$")
                    cy.contains(re).parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Tipo_Pacchetto_Garanzie_Aggiuntive).click()
                    cy.get('nx-spinner').should('not.be.visible')
                    //Limite rottura cristalli
                    cy.contains('Rottura cristalli con limite massimo').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Massimale_Rottura_Cristalli).click()
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                case "INCENDIO":
                    cy.contains("Incendio").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                case "FURTO":
                //AVIVA
                case "INCENDIO E FURTO":
                    cy.contains("Furto").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AZ
                case "KASKO PRIMO RISCHIO ASSOLUTO":
                case "KASKO COMPLETA":
                //AVIVA
                case "KASKO TOTALE":
                case "KASKO URTO CON ANIMALI":
                //AZ e AVIVA
                case "KASKO COLLISIONE":
                    cy.contains("Kasko").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    cy.wait(5000)

                    //Espandiamo pannello Kasko
                    cy.contains("Kasko").parent('div').parent('div').within(() => {
                        cy.get('nx-icon[class~="clickAble"]').first().click()
                    })

                    //Tipo pacchetto
                    cy.get(':contains("Tipo"):last').parents('motor-form-controllo').find('nx-dropdown').should('be.visible').click()
                    cy.get('nx-dropdown-item').contains(currentCase.Tipo_Kasko).click()
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AZ
                case "AVENS":
                //AVIVA
                case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI":
                case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI AUTOVETTURA":
                case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI AUTOCARRO":
                case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI AUTOBUS":
                case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI MACCHINA OPERATRICE":
                case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI MACCHINA AGRICOLA":
                    //? Su AZ Attiva Vandalidi ed Eventi Naturali compare attivando Furto, su Aviva è visibile by default
                    if (!Cypress.env('isAviva')) {
                        cy.contains("Furto").parent('div').parent('div').within(() => {
                            cy.get('nx-checkbox').click()
                        })
                        cy.get('nx-spinner').should('not.be.visible')
                    }

                    cy.contains("Atti Vandalici ed Eventi").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AVIVA
                case "EVENTI NATURALI":
                    cy.contains("Eventi Naturali").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AVIVA
                case "INFORTUNI":
                    cy.contains("Infortuni").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AVIVA
                case "CRISTALLI":
                    cy.contains("Cristalli").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AVIVA
                case "IMPREVISTI":
                    cy.contains("Imprevisti").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AVIVA
                case "ASSISTENZA":
                    cy.contains("Assistenza").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AVIVA
                case "TUTELA GIUDIZIARIA":
                    cy.contains("Tutela Giudiziaria").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
                //AZ
                case "MACROLESIONI":
                    cy.contains("Spese mediche per Macrolesioni alla guida").parent('div').parent('div').within(() => {
                        cy.get('nx-checkbox').click()
                    })
                    cy.get('nx-spinner').should('not.be.visible')
                    break
            }

            cy.get('h3:contains("Auto Rischi Diversi")').click()
            cy.screenshot(currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + '/' + '10_Offerta_ARD', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

            //Verifichiamo il totale relativo alla ARD
            cy.get('h3:contains("Auto Rischi Diversi")').parents('div').find('div:last').find('h3:last').invoke('text').then(value => {
                expect(value).contains(currentCase.Totale_Premio)
            })
        })
    }

    static checkTariffaRCA(currentCase) {

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('motor-footer').should('exist').find('button').click().wait(8000)
            cy.getTariffaLog(currentCase).then(logFolder => {
                //#region LogTariffa
                cy.readFile(logFolder + "\\logTariffa.xml").then(fileContent => {
                    const options = {
                        ignoreAttributes: false
                    }
                    const parser = new XMLParser(options)
                    parsedLogTariffa = parser.parse(fileContent)

                    //Radar_KeyID
                    expect(JSON.stringify(findKeyInLog('Radar_KeyID'))).to.contain(currentCase.Versione_Tariffa_Radar)
                    cy.task('log', `Versione Radar_KeyID rilevata ${JSON.stringify(findKeyInLog('Radar_KeyID'))}`)
                    //CMC PUNTA FLEX
                    expect(JSON.stringify(findKeyInLog('Radar_Punta_Flex_KeyID'))).to.contain(currentCase.Versione_Punta_Flex)
                    cy.task('log', `Versione Radar_Punta_Flex_KeyID rilevata ${JSON.stringify(findKeyInLog('Radar_Punta_Flex_KeyID'))}`)
                })
                //#endregion

                //#region Radaruw
                cy.readFile(logFolder + "\\radaruw.xml").then(fileContent => {
                    const options = {
                        ignoreAttributes: false
                    }
                    debugger
                    const parser = new XMLParser(options)
                    parsedRadarUW = parser.parse(fileContent)

                    //Radar_KeyID
                    expect(JSON.stringify(findKeyRadarUW('Versione_Radar'))).to.contain(currentCase.Versione_Radar_UW)
                    cy.task('log', `Versione Radar UW rilevata ${JSON.stringify(findKeyRadarUW('Versione_Radar'))}`)

                })
                //#endregion
            })
        })
    }

    static checkTariffaARD(currentCase) {

        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('motor-footer').should('exist').find('button').click().wait(8000)
            cy.getTariffaLog(currentCase).then(logFolder => {
                //#region LogTariffa
                cy.readFile(logFolder + "\\logTariffa.xml").then(fileContent => {
                    const options = {
                        ignoreAttributes: false
                    }
                    const parser = new XMLParser(options)
                    parsedLogTariffa = parser.parse(fileContent)
                    switch (currentCase.Descrizione_Settore) {
                        case "GARANZIE_AGGIUNTIVE_PACCHETTO_1":
                        case "GARANZIE_AGGIUNTIVE_PACCHETTO_2":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Garanzie_Aggiuntive)
                            break
                        case "INCENDIO":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Incendio)
                            break
                        //AZ
                        case "FURTO":
                        //AVIVA
                        case "INCENDIO E FURTO":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Furto)
                            break
                        //AZ
                        case "KASKO PRIMO RISCHIO ASSOLUTO":
                        case "KASKO COMPLETA":
                        //AVIVA
                        case "KASKO TOTALE":
                        case "KASKO URTO CON ANIMALI":
                        //AZ e AVIVA
                        case "KASKO COLLISIONE":
                            debugger
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Kasko)
                            break
                        //AZ
                        case "AVENS":
                        //AVIVA
                        case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI":
                        case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI AUTOVETTURA":
                        case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI AUTOCARRO":
                        case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI AUTOBUS":
                        case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI MACCHINA OPERATRICE":
                        case "ATTI VANDALICI ED EVENTI SOCIOPOLITICI MACCHINA AGRICOLA":
                        case "EVENTI NATURALI":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Avens)
                            break
                        //AVIVA
                        case "INFORTUNI":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Infortuni)
                            break
                        //AVIVA
                        case "CRISTALLI":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Cristalli)
                            break
                        //AVIVA
                        case "IMPREVISTI":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Imprevisti)
                            break
                        //AVIVA
                        case "ASSISTENZA":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Assistenza)
                            break
                        //AVIVA
                        case "TUTELA GIUDIZIARIA":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Tutela_Giudiziaria)
                            break
                        //AZ
                        case "MACROLESIONI":
                            expect(JSON.stringify(findKeyGaranziaARD(currentCase.Descrizione_Settore, 'Radar_KeyID'))).to.contain(currentCase.Versione_Macrolesioni)
                            break
                    }
                })
                //#endregion
            })
        })
    }

    static checkLogProxy(currentCase, numeroPreventivo) {

        cy.intercept({
            method: 'POST',
            url: /CaricaPrev/
        }).as('caricaPrev')

        cy.intercept({
            method: 'POST',
            url: /CaricaLog/
        }).as('caricaLog')


        cy.visit(Cypress.env('urlDebugProxyPreprod'))

        cy.getUserWinLogin().then(data => {
            cy.get('#txtCompagnia').should('exist').and('be.visible').type(data.agency.substr(0, 2)).wait(500)
            cy.get('#txtAgenzia').should('exist').and('be.visible').type(data.agency.substr(2)).wait(500)
            cy.get('#txtPreventivo').should('exist').and('be.visible').type(numeroPreventivo).wait(500)

            cy.get('button:contains("Carica")').should('exist').and('be.visible').click()

            cy.wait('@caricaPrev', { timeout: 15000 })
        })

        cy.task('log', 'Pagina LogProxy caricata correttamente')

        cy.get('td').last().should('exist').and('be.visible').click()
        cy.wait('@caricaLog', { timeout: 15000 })
        cy.window().document().then(function (doc) {
            doc.addEventListener('click', () => {
                setTimeout(function () { doc.location.reload() }, 5000)
            })
            cy.get('#ButtonLogProxy').should('exist').and('be.visible').click()
        })

        cy.getProxyLog(currentCase).then(logFolder => {
            cy.readFile(logFolder + "\\LogProxy.xml").then(fileContent => {
                const options = {
                    ignoreAttributes: false
                }

                cy.task('log', 'In analisi di LogProxy.xml...')
                const parser = new XMLParser(options)
                parsedLogProxy = parser.parse(fileContent)

                let fattoriDic = JSON.parse(findKeyInLog('_factoryFattoriDic', parsedLogProxy)).A
                let elencoFattori = fattoriDic.ElencoFattori

                //#region Fattore MOTOR_AI
                let motor_ai = JSON.parse(elencoFattori.filter(obj => { return obj.NomeFattore === 'MOTOR_AI' })[0].Valore)
                console.log(motor_ai)

                //Verifichiamo che output non assuma il valore -1
                for (const [key, value] of Object.entries(motor_ai))
                    if (value.output === -1)
                        assert.fail(`Fattore ${key} a -1`)

                //Andiamo a rimuovere output in quanto non necessita per il raffronto tra versioni
                for (const [key, value] of Object.entries(motor_ai))
                    delete value.output

                let getDifferences = jsonDiff.diffString(motor_ai, motorAICertified[currentCase.Identificativo_Caso], { color: false })
                if (getDifferences === '')
                    cy.task('log', `Versione modelli MOTORE_AI corretti con i valori certificati\n\n${JSON.stringify(motor_ai, null, "\t")}`)
                else
                    assert.fail(`Modelli MOTORE_AI non corretti\n\n ${getDifferences}`)
                //#endregion

                //#region Altri Fattori
                //Prendiamo tutti i fattori tranne MOTOR_AI
                let fattoriWithOutMotorAI = elencoFattori.filter(obj => { return obj.NomeFattore !== 'MOTOR_AI' })
                console.log(fattoriWithOutMotorAI)

                debugger
                //Togliamo i fattori che sono stati volutamente settati a -1 e verifichiamo che gli altri non siano a -1
                //? Da Maggio 2022, come da comunicazione di Marcialis, è stato chiuso l'accesso alla banca dati card
                //? Se stai leggendo questa riga sei stato fregato! Scappa!
                var closedBancaDatiCard = ["SINISTRI_TOT_RCA_ANIA", "SINISTRI_TOT_RCA_ULT_ANNO_ANIA", "SINISTRI_TOT_RCA_ULT_2_ANNI_ANIA", "SINISTRI_TOT_RCA_ULT_5_ANNI_ANIA", "SINISTRI_RC_ULT_ANNO_ANIA", "SINISTRI_RC_ULT_2_ANNI_ANIA", "SINISTRI_RC_ULT_5_ANNI_ANIA",
                    "SINISTRI_ARD_ULT_ANNO_ANIA", "SINISTRI_ARD_ULT_2_ANNI_ANIA", "SINISTRI_ARD_ULT_5_ANNI_ANIA", "SINISTRI_TOT_RCA_SCADENZA_ATR_ANIA", "SINISTRI_RC_ULT_2_ANNI_ANIA_R", "SINISTRI_RC_ULT_5_ANNI_ANIA_R", "SINISTRI_ARD_ULT_ANNO_ANIA_R",
                    "SINISTRI_ARD_ULT_2_ANNI_ANIA_R", "SINISTRI_ARD_ULT_5_ANNI_ANIA_R", "SINISTRI_TOT_RCA_SCADENZA_ATR_ANIA_R", "SINISTRI_TOT_RCA_ANIA_R", "SINISTRI_TOT_RCA_ULT_ANNO_ANIA_R", "SINISTRI_TOT_RCA_ULT_2_ANNI_ANIA_R", "SINISTRI_TOT_RCA_ULT_5_ANNI_ANIA_R",
                    "SINISTRI_RC_ULT_ANNO_ANIA_R", "NUM_SIN_RCA_ANNI_POSS_VEICOLO_ANIA", "NUM_SIN_RCA_ANNI_POSS_VEICOLO_ANIA_R"]
                cy.task('log', 'NOTA : Skip Check su Fattori Banca Dati Card')

                //? Da Dicembre 2021 in PP COD_VERIF_STATO_FAMIGLIA ritorna -1 (problemi lato sistemistico)
                //? REGOLE_CASO_ASSUNTIVO a -1 skip by default
                var otherCertifiedNotWorkingFattori = ["COD_VERIF_STATO_FAMIGLIA", "REGOLE_CASO_ASSUNTIVO"]
                cy.task('log', 'NOTA : Skip Check su COD_VERIF_STATO_FAMIGLIA e REGOLE_CASO_ASSUNTIVO')

                var allSkippedFattori = closedBancaDatiCard.concat(otherCertifiedNotWorkingFattori)

                let currentFattoriFailed = []
                for (const [key, value] of Object.entries(fattoriWithOutMotorAI)) {
                    if (!allSkippedFattori.includes(value.NomeFattore)) {
                        if (value.Valore === -1)
                            currentFattoriFailed.push(value.NomeFattore)
                    }
                }

                if (currentFattoriFailed.length > 0)
                    cy.task('log', `Fattori valorizzati a -1\n\n${JSON.stringify(currentFattoriFailed, null, "\t")}`)
                else
                    cy.task('log', 'Fattori OK')
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