/// <reference types="Cypress" />

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
     * Verifica che la domanda Si/No indicata come parametro sia sabbiata
     * @param {string} domanda 
     */
    static checkDomandaSabbiata(domanda) {
        ultraIFrame().within(() => {
            cy.get('.DomandaTesto').contains(domanda).parent()
                .siblings('div').should('have.class', 'radio-group disabled')
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
     * Seleziona 'SI' sulla presenza di altre coperture assicurative per l'ambito di rischio
     * @param {string} ambito - ambito a cui ci si vuole riferire  
     */
    static selezionaSiAmbito(ambito) {
        ultraIFrame().within(() => {
            cy.get('div[class="box-border-bottom weight--bold header-ambito"]').should('have.length.gt', 0)
                .find('label').contains(ambito).should('exist')
                .parent('div')
                .parent('div').should('have.length', 1)
                .find('span').contains('SI').should('have.length', 1).click()
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
     * clicca sul pulsante Avanti nel popup Dichiarazioni Contraente
     */
    static popupDichiarazioni() {
        ultraIFrame().within(() => {
            cy.get('[id="PopupDichiarazioni"]', { timeout: 5000 })
                .should('be.visible')
                .find('button').contains('AVANTI').should('be.visible').click()
        })
    }

    /**
     * clicca sul pulsante Conferma nel popup "Approfondimento sulla situazione assicurativa"
     */
    static popupApprofondimentoSituazioneAssicurativa() {
        ultraIFrame().within(() => {
            cy.get('div[id="QuestionarioSituazioneAssicurativa"]', { timeout: 5000 })
                .should('be.visible')
                .find('button').contains('CONFERMA').should('be.visible').click()
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
            cy.wait(1000);
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

    /**
     * Modifica fonte per ruolo
     * @param {string} ruolo 
     */
    static modificaFonteRuolo(ruolo) {
        ultraIFrame().within(() => {
            cy.get('div[id="dettaglio-fonte-selezionata"]').should('be.visible').click().wait(500)
            cy.get('div[id="dettaglio-intermediario"]').should('be.visible') //verifica apertura popup fonte
                .find('[id="edit-fonte-selezionata"]').should('be.visible').click() //click sull'icona della penna
            cy.wait(2000)

            //Modifica fonte
            cy.get('table[id="fonti-grid"]').should('exist')
                .find('td').contains(ruolo).first().should('exist')
                .parent('tr').should('have.length', 1)
                .find('div').first().click().wait(500)

            //Salvataggio fonte selezionata
            cy.get('table[id="fonti-grid"]').should('exist')
                .find('td').contains(ruolo).first().should('exist')
                .parent('tr').should('have.length', 1)
                .find('td').should('exist')
                .eq(1)
                .invoke('text').then(val => {
                    cy.wrap(val).as('fonteSel')
                    cy.log('Fonte selezionata: ' + val)
                })

            cy.get('div[id="popup-seleziona-fonte-content"]').should('exist')
                .find('div[class="btn-container"]').should('exist')
                .find('button').contains('CONFERMA').should('have.length', 1).click().wait(500)

            //cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento

            /*
            cy.get('span').contains('Fonte').should('be.visible')
                .next('nx-icon').click() //dblclick() //click su pulsante Fonte
            cy.wait(500)
            cy.get('[id="fontePopover"]').should('be.visible') //verifica apertura popup fonte
                .find('[name="pen"]').click() //click sull'icona della penna
            cy.wait(2000)

            cy.get('[class*="fonti-table"]').should('exist') //verifica apertura popup per la scelta della fonte

            //seleziona una fonte random
            cy.get('[class*="fonti-table"]').find('[class*="sottofonte-semplice"]') //lista delle fonti
                .then(($fonti) => {
                    var rndFonte = Math.floor(Math.random() * $fonti.length)
                    cy.get($fonti).eq(rndFonte).first().find('nx-radio').click() //click sul radio button di una fonte random

                    cy.get($fonti).eq(rndFonte).first().invoke('text').then(($text) => {
                        cy.log('fonte selezionata: ', $text)
                    })
                });

            cy.get('button').contains('CONFERMA').should('exist').click()

            cy.get('[id="alz-spinner"]').should('not.be.visible') //attende il caricamento
            */
        })
    }

}

export default DatiIntegrativi