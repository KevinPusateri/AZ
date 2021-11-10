/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

let currentDataNascita
class TenutaTariffa {

    static compilaDatiQuotazione(currentCase) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            //Tipologia Veicolo
            cy.contains('un\'auto').parent().should('exist').and('be.visible').click().wait(500)
            cy.contains(currentCase.Tipo_Veicolo).should('exist').and('be.visible').click().wait(500)

            //Targa
            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Targa"]').type(currentCase.Targa).wait(500)

            //Data di Nascita : calcolata in automatico a partire dalla data decorrenza in rapporto all'età del caso
            debugger
            let dataDecorrenza = calcolaDataDecorrenza(currentCase)
            currentDataNascita = new Date(dataDecorrenza.getFullYear() - currentCase.Eta, dataDecorrenza.getMonth(), dataDecorrenza.getDay())
            let formattedDataNascita = String(currentDataNascita.getDay()) + '/' +
                String(currentDataNascita.getMonth() + 1) + '/' +
                currentDataNascita.getFullYear()
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(formattedDataNascita).wait(1000)

            cy.get('label[id="nx-checkbox-informativa-label"]>span').eq(0).click({ force: true }).wait(500)

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
                re = new RegExp("\^ " + currentCase.Professione + " \$")
                cy.contains(re).should('exist').and('be.visible').click().wait(500)

                //Generiamo il codice fiscale
                let formattedDataNascita = currentDataNascita.getFullYear() + '-' +
                    String(currentDataNascita.getMonth() + 1).padStart(2, '0') + '-' +
                    String(currentDataNascita.getDay()).padStart(2, '0')


                cy.getSSN(currentCognome, currentNome, currentCase.Comune, currentCase.Cod_Comune, formattedDataNascita, 'M').then(currentSSN => {
                    cy.get('input[formcontrolname="cfIva"]').should('exist').and('be.visible').type(currentSSN).wait(500)
                })

                cy.intercept({
                    method: 'PUT',
                    url: '**/assuntivomotor/**'
                }).as('getMotor')

                cy.contains('AVANTI').should('exist').and('be.visible').click().wait(500)

                cy.wait('@getMotor', { requestTimeout: 100000 })
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
            //Data Immatricolazione
            //Tolgo 10 gg per non incorrere in certe casistiche di 30, 60 gg esatti che in fase di tariffazione creano problemi
            let dataPrimaImmatricolazione
            if (currentCase.Prima_Immatricolazione.split(' ')[1].includes('ann')) {
                let dataDecorrenza = calcolaDataDecorrenza(currentCase)
                dataPrimaImmatricolazione = new Date(dataDecorrenza.getFullYear() - currentCase.Prima_Immatricolazione.split(' ')[0],
                    dataDecorrenza.getMonth(),
                    dataDecorrenza.getDay() - 10)
                let formattedPrimaImmatricolazione = String(dataPrimaImmatricolazione.getDay()).padStart(2, '0') + '/' +
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

            //Posti
            cy.get('input[formcontrolname="posti"]').should('exist').and('be.visible').type(currentCase.Posti).type('{enter}').wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            cy.contains('AVANTI').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

        });
    }

    static compilaProvenienza(currentCase) {
        cy.intercept({
            method: '+(GET|PUT)',
            url: '**/assuntivomotor/**'
        }).as('getMotor')

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.wait(2000)
            //Provenienza
            cy.get('nx-dropdown[aria-haspopup="listbox"]').first().should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Provenienza).click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Nel Dettaglio
            cy.get('nx-dropdown[aria-haspopup="listbox"]').last().should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').should('be.visible').contains(currentCase.Nel_Dettaglio).click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })


            cy.contains('INSERISCI').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })


            //Popup di dichiarazione di non circolazione a SI
            //!ATTENZIONE CHE AL MOMENTO COMPARE DUE VOLTE
            cy.contains('Si').should('exist').and('be.visible').parent().click().wait(500)
            cy.contains('CONTINUA').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })
            cy.wait(1000)

            cy.contains('Si').should('exist').and('be.visible').parent().click().wait(500)
            cy.contains('CONTINUA').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })


            //Nessuna attestazione trovata in BDA
            cy.contains('Si').should('exist').and('be.visible').parent().click().wait(500)
            cy.contains('CONTINUA').should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Scadenza precedente contratto
            let dataScadenzaPrecedenteContratto
            let dataDecorrenza = calcolaDataDecorrenza(currentCase)
            if (currentCase.Data_Scadenza.split(' ')[1].includes('giorn'))
                dataScadenzaPrecedenteContratto = new Date(dataDecorrenza.getFullYear(),
                    dataDecorrenza.getMonth(),
                    dataDecorrenza.getDay() - currentCase.Data_Scadenza.split(' ')[0])
            else if (currentCase.Data_Scadenza.split(' ')[1].includes('mes'))
                dataScadenzaPrecedenteContratto = new Date(dataDecorrenza.getFullYear(),
                    dataDecorrenza.getMonth() - currentCase.Data_Scadenza.split(' ')[0],
                    dataDecorrenza.getDay())

            let formattedDataScadenzaPrecedenteContratto = String(dataScadenzaPrecedenteContratto.getDay()).padStart(2, '0') + '/' +
                String(dataScadenzaPrecedenteContratto.getMonth() + 1).padStart(2, '0') + '/' +
                dataScadenzaPrecedenteContratto.getFullYear()

            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').clear().wait(500)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').type(formattedDataScadenzaPrecedenteContratto).type('{enter}').wait(500)

            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Compagnia di provenienza
            cy.contains('COMPAGNIA DI PROVENIENZA').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').contains(currentCase.Compagnia_Provenienza).click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

            //Formula di provenienza
            cy.contains('FORMULA DI PROVENIENZA').parents('div[class="nx-formfield__input"]').find('nx-dropdown').should('be.visible').click().wait(500)
            cy.get('nx-dropdown-item').contains(currentCase.Formula_Provenienza).click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })

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
                debugger
                let formattedDataDecorrenza = String(dataDecorrenza.getDay()).padStart(2, '0') + '/' +
                    String(dataDecorrenza.getMonth() + 1).padStart(2, '0') + '/' +
                    dataDecorrenza.getFullYear()

                cy.get('input[formcontrolname="dataDecorrenza"]').should('exist').and('be.visible').clear().wait(500)
                cy.get('input[formcontrolname="dataDecorrenza"]').should('exist').and('be.visible').type(formattedDataDecorrenza).type('{enter}').wait(500)

                cy.wait('@getMotor', { requestTimeout: 30000 })

            //Conferma

            //Frazionamento
            cy.get('nx-dropdown[formcontrolname="frazionamento"]').should('exist').and('be.visible').click().wait(1000)
            cy.contains(currentCase.Frazionamento.toUpperCase()).should('exist').and('be.visible').click().wait(500)
            cy.wait('@getMotor', { requestTimeout: 30000 })
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