/// <reference types="Cypress" />

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
require('cypress-plugin-tab')


class TenutaTariffa {

    static calcolaDataDecorrenza(currentCase) {
        debugger
        let currentDatePlusTwoMonths = new Date()
        currentDatePlusTwoMonths.setMonth(currentDatePlusTwoMonths.getMonth() + 2)

        let dataFineTariffa
        let terminePeriodoTariffazione = currentCase.Periodo_Tariffazione.split('-')[1];

        switch (terminePeriodoTariffazione) {
            //! Month 0 is January....
            case "01":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 0, 31);
                break;
            case "02":
                const date = new Date(currentCase.Anno_Periodo_Tariffazione, 1, 29);
                if (date.getMonth() === 1)
                    dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 1, 29);
                else
                    dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 1, 28);
                break;
            case "03":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 2, 31);
                break;
            case "04":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 3, 30);
                break;
            case "05":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 4, 31);
                break;
            case "06":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 5, 30);
                break;
            case "07":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 6, 31);
                break;
            case "08":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 7, 31);
                break;
            case "09":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 8, 30);
                break;
            case "10":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 9, 31);
                break;
            case "11":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 10, 30);
                break;
            case "12":
                dataFineTariffa = new Date(currentCase.Anno_Periodo_Tariffazione, 11, 31);
                break;
        }

        //Verifichiamo se sto effettuando una previsione futura oltre i due mesi o meno
        if (DateTime.Compare(dataAttualePiùDueMesi, dataFineTariffa) < 0) {
            //Se il mese di dataFineTariffa è diverso dal mese di dataAttualePiùDueMesi setto come 

            //la dataFineTariffa essendo proiezione oltre la possibilità di scelta canonica da DA di due mesi
            if (dataAttualePiùDueMesi.Month == dataFineTariffa.Month)
                caso_tenuta_tariffa.Data_Decorrenza = dataAttualePiùDueMesi;
            else
                caso_tenuta_tariffa.Data_Decorrenza = dataFineTariffa;
        }
        else
            caso_tenuta_tariffa.Data_Decorrenza = dataFineTariffa;
    }

    //#region Dati quotazione
    static compilaDatiQuotazione(currentCase) {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.get('input[aria-label="Targa"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Targa"]').type(currentCase.targa).wait(500)

            //String dataNascita = caso.Data_Decorrenza.AddYears(-caso.Eta).AddDays(-10).ToString("ddMMyyyy");
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[nxdisplayformat="DD/MM/YYYY"]').type(dataNascita).wait(1000)

            cy.get('label[id="nx-checkbox-informativa-label"]>span').eq(0).click({ force: true }).wait(500)

            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })

            cy.get('input[aria-label="Indirizzo"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Indirizzo"]').type('roma{enter}').wait(500);

            cy.get('input[aria-label="NumeroCivico"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="NumeroCivico"]').type('12{enter}').wait(500);

            cy.get('input[aria-label="Comune"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[aria-label="Comune"]').type('Codogno').wait(1000);

            cy.contains('Calcola').click({ force: true })
            cy.contains('Calcola').should('be.visible')
            cy.contains('Calcola').click({ force: true })

            //const check = $body.find('OK').is(':visible')
            // if (check) {
            // cy.contains('OK').should('be.visible')
            //cy.contains('OK').click({ force: true })
            // }
        })

    }
    #region

    //#region Provenienza

    static provenienza(provenienza) {
        cy.wait(10000)
        cy.getIFrame()
        // cy.get('@iframe').within(() => {


        //     cy.get('nx-dropdown[aria-haspopup="listbox"]').first().should('be.visible').click()            
        //     cy.get('nx-dropdown-item').should('be.visible').contains(provenienza).click();


        // })

    }

    //#endregion

    //#region Salvataggio quotazione

    static salvaQuotazioneMotorNGA2021() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {

            cy.contains('Salva quotazione').should('be.visible').click()

            var nomeQuotazione = randomString(10, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

            cy.get('input[formcontrolname="nome"]').should('exist').and('be.visible').click().wait(500)
            cy.get('input[formcontrolname="nome"]').type(nomeQuotazione).wait(1000)
            cy.get('button[nxbutton="primary medium"]').click()
            return nomeQuotazione;

        })

    }

    //#endregion

}
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export default S_pm
