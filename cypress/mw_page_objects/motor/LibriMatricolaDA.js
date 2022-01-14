/// <reference types="Cypress" />

import { find } from "lodash";
import NoteContratto from "../clients/NoteContratto";

//#region iFrame
const matrixFrame = () => {
    let iframeSCU = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion iFrame

const clickAvanti = () => {
    cy.get('[value="› Avanti"]')
        .should('be.visible').click()
}

class LibriMatricolaDA {

    /**
     * metodo generico per cliccare sul pulsante Avanti
     */
    static Avanti() {
        matrixFrame().within(() => {
            clickAvanti()
        })
    }

    /**
     * Attende il caricamento di Libri Matricola su DA
     */
    static caricamentoLibriMatricolaDA() {
        cy.intercept({
            method: 'POST',
            url: '**/Auto/GestioneLibriMatricolaDA/**'
        }).as('LibriMatricolaDA')

        cy.wait('@LibriMatricolaDA', { requestTimeout: 60000 });
    }

    /**
     * Avvia l'emissione di un nuovo preventivo madre
     * @param {string} convenzione 
     */
    static nuovoPreventivoMadre(convenzione) {
        matrixFrame().within(() => {
            cy.get('#ButtonNuovo').should('be.visible').click() //click sul pulsante 'nuovo'

            cy.get('#tblConvenzioni').should('be.visible')
                .find('td[aria-describedby="tblConvenzioni_txtDescrizione"]')
                .contains(convenzione).should('be.visible').click()

            cy.get('button').children('span').contains('Ok')
                .should('be.visible').click()
        })
    }

    /**
     * Inserisce i dati integrativi
     * [21/12/2021 si limita ad attendere il caricamento e cliccare 'avanti']
     * @param {bool} retrodatazione 
     */
    static datiIntegrativi(retrodatazione) {

        //attende caricamento Dati Integrativi
        cy.intercept({
            method: 'POST',
            url: '**/GetDatiAggiuntiviConvenzione'
        }).as('loadDatiIntegrativi')

        cy.wait('@loadDatiIntegrativi', { requestTimeout: 60000 });

        matrixFrame().within(() => {

            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()

            if (retrodatazione) {
                cy.get('label').contains('Retrodatazione della decorrenza?').should('be.visible')
                    .parent().parent()
                    .find('button').children('span').contains('Ok').click()
            }
        })
    }

    /**
     * Imposta i dati contraente
     * [21/12/2021 si limita ad attendere il caricamento della pagina e andare avanti]
     */
    static Contraente() {

        //attende caricamento Contraente
        cy.intercept({
            method: 'POST',
            url: '**/GetComboContent'
        }).as('loadContraente')

        cy.wait('@loadContraente', { requestTimeout: 60000 });


        matrixFrame().within(() => {
            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()
        })
    }

    /**
     * Attende il caricamento della pagina Coperture,
     * risponde alla presenza di altre coperture
     * [21/12/2021 non agisce sulle garanzie presenti]
     * @param {bool} altreCoperture 
     */
    static Riepilogo(altreCoperture) {
        matrixFrame().within(() => {
            var copertureValue = "1" //default altre coperture: si

            //se non sono presenti altre coperture
            //modifica il value per 'no'
            if (!altreCoperture) {
                copertureValue = "2"
            }

            //Questionario adeguatezza: altre coperture
            cy.get('input[name="adegAltreCopRB"][value="' + copertureValue + '"]')
                .should('be.visible').click()

            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()
        })
    }

    static Riepilogo(altreCoperture) {
        matrixFrame().within(() => {
            var copertureValue = "1" //default altre coperture: si

            //se non sono presenti altre coperture
            //modifica il value per 'no'
            if (!altreCoperture) {
                copertureValue = "2"
            }

            //Questionario adeguatezza: altre coperture
            cy.get('input[name="adegAltreCopRB"][value="' + copertureValue + '"]')
                .should('be.visible').click()

            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()
        })
    }

    static RiepilogoGaranzie(garanzie) {
        
        for (var i = 0; i < garanzie.length; i++) {
            cy.log('var i outside: ' + i)
            var a= i
            matrixFrame().within(() => {
                cy.log('var a inside: ' + a)
                //scorre l'array e seleziona la garanzia
                //[non verifica se la garanzia è già stata selezionata]
                cy.get('label').contains(garanzie[a])
                    .parents('.subtableBlock').find('input').click()
            })

            cy.wait(1000)
            var popupCheck = false
            /* matrixFrame().within(() => {
                //cy.get('#pnlDialog').should('be.visible')
                cy.get('#pnlDialog').then(($popup) => {
                    popupCheck = $popup.is(':visible')
                    cy.log("popup: " + popupCheck)
                    popupCheck.as('boolPopup')
                })                
            }) */

            //se il popup è presente clicca su ok
            if (popupCheck) {
                do {
                    matrixFrame().within(() => {
                        cy.get('div[id="pnlDialog"]').next('div')
                            .find('span').contains('OK').click() //click su OK
                    })

                } while (
                    matrixFrame().within(() => {
                        cy.get('div[id="pnlDialog"]').is(':visible')
                    })
                )
            }
        }
    }

    /**
     * Completa la pagina Integrazione
     * [21/12/2021 si limita ad emettere il preventivo]
     */
    static Integrazione() {
        //attende il completamento del salvataggio preventivo 608601
        cy.intercept({
            method: 'POST',
            url: '**/GetElencoAutorizzazioni'
        }).as('loadIntegrazione')

        cy.wait('@loadIntegrazione', { requestTimeout: 60000 });

        matrixFrame().within(() => {
            //click su Emetti preventivo
            cy.get('#btnSalvaNomin')
                .should('be.visible').click()
        })
    }

    /**
     * Verifica che venga salvato il contratto e restituisce l'alias
     * con il numero del contratto
     */
    static ContrattoFinale() {
        //attende il completamento del salvataggio contratto
        cy.intercept({
            method: 'POST',
            url: '**/GeneraPDF'
        }).as('salvataggioContratto')

        cy.wait('@salvataggioContratto', { requestTimeout: 60000 });

        matrixFrame().within(() => {
            cy.get('[class="clNumeroPrevContr"]').invoke('text').then(val => {
                cy.wrap(val).as('contratto')
                cy.log("return " + '@contratto')
            })
        })
    }

    /**
     * ritorna alla Home dalla pagina finale di salvataggio contratto
     */
    static FinaleGoHome() {
        matrixFrame().within(() => {
            cy.get('input[value="› Home"]').click() //click su Home
            cy.get('#pnlDialog').contains('Si è sicuri di voler uscire?')
                .next('div').find('span').contains('Si').click() //Risponde SI al popup di attenzione
        })
    }

    //#region Preventivi Applicazione
    /**
     * Apre la scheda Preventivi
     * (se non è già aperta)
     */
    static AperturaTabPreventivi() {
        var tabActive = false

        matrixFrame().then(($element) => {
            //verifica se la tab Preventivi è già attiva
            tabActive = $element.find('[id="tab_preventivi_polizze_madre"][class*="ui-state-active"]')
                .is(':visible')
        }).within(() => {
            cy.log("TabActive: " + tabActive)
            //se la tab non è già attiva, la apre
            if (!tabActive) {
                cy.get('#tab_preventivi_polizze_madre').children().click() //click su tab Preventivi

                //attende il caricamento della lista preventivi
                cy.intercept({
                    method: 'GET',
                    url: '**/PreventiviMadri.aspx/**'
                }).as('listaPreventivi')
                cy.wait('@listaPreventivi', { requestTimeout: 30000 });
            }
        })
    }

    /**
     * verifica che il Preventivo Madre compaia nella lista dei preventivi
     * [23/12/2021 non considera la presenza di più pagine]
     * @param {string} nPreventivo 
     */
    static VerificaPresenzaPrevMadre(nPreventivo) {
        var tabActive = false

        this.AperturaTabPreventivi()

        //ricarica l'iframe e verifica la presenza del preventivo
        matrixFrame().within(() => {
            cy.get('#table_preventivi_madre', { timeout: 10000 }).find('#' + nPreventivo)
                .should('be.visible')
        })
    }

    static AperturaElencoApplicazioni(nPreventivo) {
        matrixFrame().within(() => {
            //tasto destro sul preventivo passato come parametro, altrimenti ne sceglie uno casualmente
            //e restituisce il numero del preventivo scelto
            cy.get('#table_preventivi_madre', { timeout: 10000 }).within(() => {
                if (nPreventivo == null) {
                    cy.get('[class*="ui-row-ltr"]', { timeout: 10000 }).should('be.visible')
                        .then(($rows) => {
                            const items = $rows.toArray()
                            return Cypress._.sample(items)
                        }).rightclick().then(($rows) => {
                            cy.wrap($rows.find('[aria-describedby="table_preventivi_madre_NumeroPreventivo"]').text())
                                .as('nPrevMadre')
                        })
                }
                else {
                    cy.get('#' + nPreventivo).should('be.visible').rightclick()
                }
            })
        })

        matrixFrame().within(() => {
            cy.log('inside contex menu')
            cy.get('[id="jqContextMenu"]', { timeout: 5000 })
                .find('#visualizzaPreventiviFiglie')
                .should('be.visible').click()
        })
    }

    static caricamentoElencoApplicazioni() {
        cy.intercept({
            method: 'GET',
            url: '**/PolizzeFiglie.aspx/**'
        }).as('PolizzeFiglie')

        cy.wait('@PolizzeFiglie', { requestTimeout: 30000 });
    }

    /**
     * Verifica la presenza del preventivo applicazione passato come parametro
     * @param {string} nPreventivo 
     */
    static VerificaPresenzaPrevApp(nPreventivo) {
        //verifica la presenza del preventivo
        matrixFrame().within(() => {
            cy.get('#table_preventivi_figlie', { timeout: 10000 })
                .find('[title="' + nPreventivo + '"]').contains(nPreventivo)
                .should('be.visible')
        })
    }

    /**
     * Clicca sul pusante 'Nuovo' nella sezione Preventivi Applicazioni
     */
    static NuovoPreventivoApplicazione() {
        matrixFrame().within(() => {
            cy.get('#ButtonChiamaTarga').should('be.visible').click() //clicca sul pusalnte 'nuovo'
        })
    }

    //#endregion Preventivi applicazioni

    /**
     * Attende il caricamento della pagina Dati Amministrativi
     */
    static caricamentoDatiAmministrativi() {
        cy.intercept({
            method: 'POST',
            url: '**/GetDatiAggiuntiviConvenzione'
        }).as('Convenzione')

        cy.wait('@Convenzione', { requestTimeout: 60000 });
    }

    /**
     * Attende il caricamento della pagina Contraente/Proprietario
     */
    static caricamentoContraenteProprietario() {
        cy.intercept({
            method: 'GET',
            url: '**/ContraeAnag.aspx'
        }).as('ContraeAnag')

        cy.wait('@ContraeAnag', { requestTimeout: 30000 });
    }

    static caricamentoVeicolo() {
        cy.intercept({
            method: 'POST',
            url: '**/GetAlberoVeicoli'
        }).as('Veicoli')

        cy.wait('@Veicoli', { requestTimeout: 60000 });
    }

    static caricamentoRiepilogo() {
        cy.intercept({
            method: 'POST',
            url: '**/GetRiepilogoGaranzie'
        }).as('Riepilogo')

        cy.wait('@Riepilogo', { requestTimeout: 60000 });
    }

    static caricamentoProdottoProvenienza() {
        cy.intercept({
            method: 'GET',
            url: '**/TipoProProveni.aspx'
        }).as('ProdottoProvenienza')

        cy.wait('@ProdottoProvenienza', { requestTimeout: 80000 });
    }

    static RicercaVeicolo(targa) {
        matrixFrame().within(() => {
            cy.get('[data-bind*="targaRicercaArchivio"]', { timeout: 10000 }).should('be.visible')
                .type(targa)
            cy.get('[data-bind*="RicercaTargaArchivio"]').should('be.visible').click()
        })

        matrixFrame().within(() => {
            cy.get('[aria-describedby="tblVeicoli_txtTarga"]').contains(targa)
                .should('be.visible').click()
        })
    }

    /**
     * Inserisce un nuovo veicolo
     * @param {ListaAuto} veicolo 
     */
    static NuovoVeicolo(veicolo) {
        matrixFrame().within(() => {
            //apre la sezione 'inserimento nuovo veicolo' 
            cy.get('#selezioneRicerca').find('[name="veicoloNuovoEsist"][value="true"]')
                .should('be.visible').click()
        })

        //attende che venga caricata la sezione 'inserimento nuovo veicolo'
        cy.intercept({
            method: 'POST',
            url: '**/GetAllMarche'
        }).as('Marche')
        cy.wait('@Marche', { requestTimeout: 60000 });

        matrixFrame().within(() => {
            //se il tipo di veicolo è diverso da Auto, apre la sezione relativa
            if (veicolo.tipo != "Auto") {
                cy.get('[for="radio' + veicolo.tipo + '"]').click() //click su tab tipo di veicolo

                //attende il caricamento della lista veicoli
                cy.intercept({
                    method: 'POST',
                    url: '**/GetAllMarche'
                }).as('Marche')
                cy.wait('@Marche', { requestTimeout: 60000 });
            }
        })

        matrixFrame().within(() => {
            //inserisce la targa
            cy.get('input[data-bind*="targaRicercaANIANumero"]').first()
                .should('be.visible').type(veicolo.targa)

            //seleziona la marca
            cy.get('div[title="Seleziona la marca del veicolo"]')
                .find('input').type(veicolo.marca)
                .wait(1000).type('{downarrow}{enter}')

            //seleziona il modello
            cy.get('#cbModello').find('input').type(veicolo.modello)
                .wait(1000).type('{downarrow}{enter}')

            //seleziona la versione
            cy.get('#cbVersione').find('input').type(veicolo.versione)
                .wait(1000).type('{downarrow}{enter}')

            //inserisce la data di immatricolazione
            cy.get('input[data-bind*="dpDataImmatricolazioneN"]')
                .type(veicolo.dataImmatricolazione)

            //inserisce il numero dei posti
            cy.get('input[title*="numero di posti"]').filter(':visible').type(veicolo.nPosti)
        })
    }

    /**
     * Seleziona la presenza o meno della copertura RCA
     * @param {bool} copertura 
     */
    static CoperturaRCA(copertura) {
        if (copertura == true) {
            copertura = "Con copertura"
        }
        else {
            copertura = "Senza copertura"
        }

        cy.log('Copertura RCA: ' + copertura)

        var coperturaCheck = false

        matrixFrame().then(($element) => {
            //verifica il tipo di copertura è già attivo
            coperturaCheck = $element.find('[type="radio"][value*="' + copertura + '"]')
                .is(':checked')
        }).within(() => {
            cy.log("Checked: " + coperturaCheck)
            //se la tab non è già attiva, la apre
            if (!coperturaCheck) {
                cy.get('[type="radio"][value*="' + copertura + '"]').click() //click sull'elemento scelto
            }
        })
    }

    /**
     * seleziona la provenienza del veicolo nella tab Prodotto/Provenienza
     * @param {json ProdottoProvenienza} provenienza 
     */
    static ProvenienzaVeicolo(provenienza) {
        matrixFrame().within(() => {
            cy.log('Array menù provenienza: ' + provenienza.length)
            //scorre i sottomenù fino aselezionare l'opzione richiesta
            for (var i = 0; i < provenienza.length; i++) {
                cy.log(provenienza[i])
                cy.get('a[role="menuitem"]').contains(provenienza[i])
                    .should('be.visible').click()
            }
        })
    }
}
export default LibriMatricolaDA
//VOLVO C70 2.4 20V 170 CV MOMENTUM (DAL 2005/09)