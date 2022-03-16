/// <reference types="Cypress" />

import { find } from "lodash";
import UltraBMP from "../../mw_page_objects/UltraBMP/UltraBMP"

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

class DatiIntegrativi {
    //#region caricamenti
    /**
     * Attende il caricamento della pagina Dati Integrativi
     */
    static caricamentoPagina() {
        cy.log('***** CARICAMENTO PAGINA DATI INTEGRATIVI *****')
        cy.intercept({
            method: 'GET',
            url: '**/datiintegrativi/getDati'
        }).as('datiintegrativi')

        cy.wait('@datiintegrativi', { requestTimeout: 60000 })
    }
    //#endregion caricamenti

    static ClickButtonAvanti() {
        ultraIFrame().within(() => {
            cy.get('input[id="btnAvanti"]').should('be.visible').click()
        })
    }

    /**
     * Inserisce la data di decorrenza o scadenza tramite code injection
     * tipoData: 'decorrenza' o 'scadenza'
     * @param {string} tipoData 
     * @param {string} data 
     */
    static ModificaDataInjection(tipoData, data) {
        ultraIFrame().within(() => {
            var txtBox
            switch (tipoData) {
                case "decorrenza":
                    txtBox = "#txtDataDecorrenza"
                    break;
                case "scadenza":
                    txtBox = "#txtDataScadenza"
                    break;
                default:
                    cy.log("usare il tipoData: 'decorrenza' o 'scadenza'")
            }

            cy.get(txtBox)
                .invoke('attr', 'value', data)
                .should('have.attr', 'value', data)
        })
    }

    /**
     * Clicca sull'opzione 'Seleziona tutti NO'
     */
    static selezionaTuttiNo() {
        ultraIFrame().within(() => {
            cy.get('label').contains('Seleziona tutti NO').should('be.visible').click()
        })
    }

    /**
     * 
     * @param {bool} speseMediche 
     * @param {bool} diariaRicovero 
     * @param {bool} invaliditaPermanente 
     */
    static DatiIntegrativi(speseMediche, diariaRicovero, invaliditaPermanente) {
        var risposte = [speseMediche, diariaRicovero, invaliditaPermanente]

        for (var i = 0; i < risposte.length; i++) {
            if (risposte[i] == true) {
                risposte[i] = "SI"
            }
            else {
                risposte[i] = "NO"
            }
        }

        ultraIFrame().within(() => {
            for (var i = 0; i < risposte.length; i++) {
                cy.log(risposte[i])
            }

            cy.get('[class$="domande-integrative-ambito"]')
                .find('[class^="domandaSiNo"]').each(($el, index, $list) => {
                    cy.wrap($el).find('span').contains(risposte[index]).click()
                })
        })
    }

    /**
     * clicca sul pulsante Conferma nel popup Dichiarazioni Contraente
     */
    static popupDichiarazioni() {
        ultraIFrame().within(() => {
            cy.get('[id="PopupDichiarazioni"]', { timeout: 5000 })
                .should('be.visible')
                .find('button').contains('AVANTI').click()
        })
    }

    /**
     * Verifica data decorrenza (se non viene passata alcuna data dev'essere la data di oggi)
     * @param string dataDec (nel formato gg/mm/aaaa) 
     */
    static verificaDataDecorrenza(dataDec = "") {
        if (dataDec == "")
            dataDec = UltraBMP.dataOggi()
        ultraIFrame().within(() => {
            cy.get('input[id="txtDataDecorrenza"]').should('have.value', dataDec)
        })
    }

    /**
     * Verifica data scadenza (se non viene passata alcuna data dev'essere la data di oggi + 1 anno)
     * @param string dataScad (nel formato gg/mm/aaaa) 
     */
    static verificaDataScadenza(dataScad = "") {
        if (dataScad == "")
            //dataScad = UltraBMP.dataOggiPiuUnAnno()
            dataScad = UltraBMP.dataOggiPiuAnni(1)
        cy.log('Data scadenza da verificare: ' + dataScad)
        ultraIFrame().within(() => {
            cy.get('input[id="txtDataScadenza"]').should('have.value', dataScad)
        })
    }

    /**
      * Verifica dato polizza modificabile
      * @param string campo (descrizione del campo che si vuole verificare) 
      * @param string modificabile (se true il campo deve essere modificabile, altrimenti no)
      */
    static verificaDatoPolizzaModificabile(campo, modificabile) {
        let classe = ""
        if (modificabile)
            classe = "radio-group"
        else
            classe = "radio-group disabled"
        cy.log("Da verificare: " + campo + " - modificabile: " + modificabile)
        ultraIFrame().within(() => {
            if (modificabile) {
                cy.get('span').contains(campo).should('be.visible')
                    .parent('div').should('be.visible')
                    .siblings('div').should('have.class', classe)
            }
            else {
                cy.get('div').contains(campo).should('be.visible')
                    .siblings('div').should('have.class', classe)
            }
        })
    }

    /**
     * Verifica retrodatabilità (la data decorrenza non può essere inferiore ad oggi)
     * Prova ad impostare la data Decorrenza a ieri e verifica che non si possa procedere nell'emissione
     * Ripristina la data impostata
     */
    static verificaRetrodatabilità() {
        var dataOggi = UltraBMP.dataOggi()
        var dataIeri = UltraBMP.dataOggiPiuGiorni(-1)
        DatiIntegrativi.impostaDataDecorrenza(UltraBMP.dataOggiPiuGiorni(-1))
        //DatiIntegrativi.ModificaDataInjection('decorrenza', UltraBMP.dataOggiPiuGiorni(-1))
        DatiIntegrativi.ClickButtonAvanti()
        DatiIntegrativi.popupDichiarazioni()
        ultraIFrame().within(() => {
            /*
            cy.get('h1').contains("Dichiarazioni contraente principale").should('exist')
              .parent('h1').should('exist')
              .parent('div').should('exist')
              .find('button').contains('CONFERMA').should('be.enabled').click({force: true})
            */
            cy.get('div[id="popUpValidazioniAngrafiche"]').should('be.visible')
                .find('li').contains('Retrodatazione non ammessa!').should('exist')
            cy.get('div[id="popUpValidazioniAngrafiche"]').should('be.visible')
                .find('input').should('have.value', 'OK').click()
        })
        DatiIntegrativi.impostaDataDecorrenza(UltraBMP.dataOggi())
        //DatiIntegrativi.ModificaDataInjection('decorrenza', UltraBMP.dataOggi())
    }

    /**
     * Imposta data di decorrenza (formato gg/mm/aaaa)
     */
    static impostaDataDecorrenza(dataDec) {
        var gg = Number(dataDec.substring(0, 2))
        var mm = Number(dataDec.substring(3, 5)) - 1
        var aaaa = Number(dataDec.substring(6))
        cy.log('Data dec: ' + dataDec)
        cy.log('gg: ' + gg + ' mm: ' + mm + ' aaaa: ' + aaaa)

        ultraIFrame().within(() => {
            cy.get('input[id="txtDataDecorrenza"]').should('be.visible').click()
            // Mese
            cy.get('div[class="ui-datepicker-title"]').should('exist')
                .find('select').eq(0).select(mm)
            // Anno >>>>> ATTENZIONE - NON FUNZIONA !!!!
            cy.get('div[class="ui-datepicker-title"]').should('exist')
                .find('select').eq(1).type(aaaa).wait(1000)
                .type('{enter}')
            // Giorno
            cy.get('table[class="ui-datepicker-calendar"]').should('exist')
                .find('td').contains(gg).click()

            //cy.pause()
        })
    }

    static approfondimentoSituazioneAssicurativa(polizzeStessoRischio, comunqueInteressato = true) {
        ultraIFrame().within(() => {
            //cy.get('[class="popupSituazioneAssicurativa"]', { timeout: 10000 })
            cy.get('#QuestionarioSituazioneAssicurativa', { timeout: 10000 })
                .should('be.visible') //attende la comparsa del popup

            if (polizzeStessoRischio == true) {
                cy.get('[class="popupSituazioneAssicurativa"]')
                    .find('span').contains('polizze in essere sullo stesso rischio')
                    .closest('[class="domanda"]').find('span').contains('SI') //Se possiede polizze sullo stesso rischio clicca si

                if (comunqueInteressato == false) {
                    cy.get('[class="popupSituazioneAssicurativa"]')
                        .find('span').contains('comunque interessato')
                        .closest('[class="domanda"]').find('span').contains('NO') //se non è interessato clicca no
                }
            }

            cy.get('[class="popupSituazioneAssicurativa"]')
                .find('button').contains('CONFERMA').click() //conferma il popup
            cy.wait(1000)
        })
    }

    static confermaDichiarazioniContraente() {
        ultraIFrame().within(() => {
            //Attende la comparsa del popup 'Dichiarazioni contraente principale' e clicca su Conferma            
            cy.get('[aria-describedby="PopupDichiarazioni"]', { timeout: 5000 })
                .should('be.visible') //attende la comparsa del popup
                .find('button').contains('AVANTI').click() //conferma
        })
    }
}

export default DatiIntegrativi