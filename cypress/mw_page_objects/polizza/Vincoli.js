/// <reference types="Cypress" />

import { find } from "lodash";

//#region iFrame
const ultraIFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const IFrameAnagrafe = () => {
    let iframeAnag = cy.get('iframe[src^="/Anagrafe"]') //('.popupContent').find
        .its('0.contentDocument').should('exist')

    return iframeAnag.its('body').should('not.be.null').then(cy.wrap)
}
//#endregion iFrame

class Vincoli {
    //#region caricamenti
    static caricamentoPagina() {
        cy.intercept({
            method: 'POST',
            url: '**/Appendici_AD/**'
        }).as('appendici')

        cy.wait('@appendici', { requestTimeout: 60000 })
    }

    static attesaRicerca() {
        cy.intercept({
            method: 'POST',
            url: '**/AnagrafeWA40/**'
        }).as('anagrafe')

        cy.wait('@anagrafe', { requestTimeout: 60000 })
    }

    static updateAppendice() {
        cy.intercept({
            method: 'POST',
            url: '**/UpdateAppendice.ashx'
        }).as('update')

        cy.wait('@update', { requestTimeout: 60000 })
    }

    static generazioneDocumenti() {
        cy.intercept({
            method: 'POST',
            url: '**/CreateDocument.ashx'
        }).as('documenti')

        cy.wait('@documenti', { requestTimeout: 60000 })
    }

    /* static attendiCaricamento() {
        ultraIFrame().within(() => {
            cy.get('.')
        })
    } */
    //#endregion caricamenti

    /**
     * Seleziona l'ambito da vincolare
     * @param {string} ambito
     */
    static SelezionaAmbito(ambito) {
        ultraIFrame().within(() => {
            cy.get('td[data-bind$="DescrizioneProdotto"]').contains(ambito.toUpperCase())
                .next('td').children('input').focus().click()
            cy.wait(500)
        })
    }

    /**
     * click sul pulsante Aggiungi Vincolo
     */
    static AggiungiVincolo() {
        ultraIFrame().within(() => {
            cy.get('input[value="Aggiungi Vincolo"]').click()
        })
    }

    static SelezionaEnteVincolatario(ente) {
        ultraIFrame().within(() => {
            cy.get('div').contains('Ente Vincolatario').parent('div')
                .find('input[value="' + ente + '"]').focus().click()
        })

        cy.wait(3000)
    }

    static RicercaBanca(tipoRicerca, ricerca) {
        ultraIFrame().within(() => {
            cy.wait(1000);
            IFrameAnagrafe().within(() => {
                cy.get('table[id$="TipoRicerca"]').should('be.visible')
                    .find('input[value="' + tipoRicerca + '"]').click()
            })
        })

        cy.wait(2000)

        ultraIFrame().within(() => {
            IFrameAnagrafe().within(() => {
                cy.get('input[id$="NomeBanca"]').should('be.visible').focus()
                    .type(ricerca.toUpperCase())

                cy.get('input[value="Ricerca"]').should('be.visible').click()
            })
        })

        cy.wait(7000)

        ultraIFrame().within(() => {
            IFrameAnagrafe().within(() => {
                cy.get('.AZGridViewPanel').should('be.visible')
                    .find('td').contains(ricerca.toUpperCase()).first().click()
            })
        })

        cy.wait(5000)

        ultraIFrame().within(() => {
            IFrameAnagrafe().within(() => {
                cy.get('input[value="Conferma"]').click()
            })
        })
    }

    static ChiudiPopupAnagrafico(dati) {
        ultraIFrame().within(() => {
            cy.get('div[aria-labelledby="ui-dialog-title-anag"]')
                .should('be.visible').scrollIntoView()
                .find('[class^="ui-dialog-titlebar-close"]').click()

            cy.wait(500)
        })
    }

    static TestiDirezionali(testo) {
        ultraIFrame().within(() => {
            cy.get('input[id$="testiDirezione"]')
                .should('be.visible').focus().click()

            cy.wait(500)

            cy.get('#ctl00_cont_direzioneTextTemplates_lista').find('input[id$="txtRicerca"]')
                .should('be.visible').focus().type(testo)

            cy.get('#ctl00_cont_direzioneTextTemplates_lista').find('input[id$="searchButton"]')
                .should('be.visible').focus().click()

            cy.wait(500)

            cy.get('#tblTesti').find('span').contains(testo).click()
            cy.wait(500)

            cy.get('#ctl00_cont_direzioneTextTemplates_lista')
                .find('input[value="inserisci"]').click()
        })

        cy.wait(2000)
    }

    static DatiVincolo(dati) {
        ultraIFrame().within(() => {
            cy.get('#ctl00_cont_pnlDatiAggiuntiviVincolo').should('be.visible')

            cy.get('#ctl00_cont_dataScad_txtDate').type(dati.dataScadenzaVincolo)
            cy.get('#ctl00_cont_titolareFinanziamentoTxt').type(dati.titolare)
            //cy.get('#ctl00_cont_giorniCoperturaCmb')
            cy.get('#ctl00_cont_numeroFinanziamentoTxt').type(dati.numeroFinanziamento)
            cy.get('#ctl00_cont_dataFinanziamentoDP_txtDate').type(dati.dataFinanziamento)
            cy.get('#ctl00_cont_importoMutuoTxt').type(dati.importoMutuo)
            cy.get('#ctl00_cont_notaioTxt').type(dati.notaio)
            cy.get('#ctl00_cont_dataRogitoDP_txtDate').type(dati.dataRogito)
            cy.get('#ctl00_cont_numeroRepertorioTxt').type(dati.numeroRepertorio)
            cy.get('#ctl00_cont_sezioneFoglioTxt').type(dati.sezioneFoglio)
            cy.get('#ctl00_cont_mappaleNTxt').type(dati.mappale)
            cy.get('#ctl00_cont_SubTxt').type(dati.sub)
        })
    }

    static StampaDocumenti(firma) {
        ultraIFrame().within(() => {
            cy.get('#copieStampaContainer').should('be.visible')
                .find('select').select(firma)

            cy.wait(1000);

            cy.get('#copieStampaPrintBtn')
                .should('be.visible').click()
        })

        ultraIFrame().within(() => {
            cy.get('#UCAnteprima').should('be.visible')
                .find('input[value="Chiudi"]').click()
        })
    }

    static Converti() {
        ultraIFrame().within(() => {
            cy.get('input[value="Converti"]')
                .should('be.visible').click()
        })
    }

    //#region Gestione Vincoli Ultra
    /**
     * Inserisce l'ente vincolatario dalla pagina Gestione Vincoli per Ultra
     */
    static ApriPopupEnteVincolatario() {
        ultraIFrame().within(() => {
            cy.get('#btnApriPopupAnagEnte')
                .should('be.visible').click()
        })
    }

    /**
     * ricerca e inserisce il testo direzionale indicato
     * @param {string} testo titolo del testo da ricercare
     */
    static InserisciTestoDirezionaleUltra(testo) {
        ultraIFrame().within(() => {
            cy.get('input[value="Testi Direzionali"]')
                .should('be.visible').click()

            cy.get('#popupTestiLiberi').should('be.visible')
                .find('.txt-ricerca-testi-liberi').type(testo)
            cy.get('#popupTestiLiberi')
                .find('.btn-ricerca-testi-liberi').click()

            cy.get('input[value="Seleziona"]')
                .should('be.visible').first().click()
        })
    }

    /**
     * click su Conferma nella pagina Gestione Vincoli di Ultra
     */
    static ConfermaGestioneVincoli() {
        ultraIFrame().within(() => {
            cy.get('#btnConferma')
                .should('be.visible').click()
        })
    }

    static ConfermaCreazioneDocumento() {
        ultraIFrame().within(() => {
            cy.get('#ctl00_cont_documentOkPnl')
                .should('be.visible').and('contain', 'Il documento è stato creato con numero')
        })
    }
    //#endregion Gestione Vincoli Ultra 
}
export default Vincoli