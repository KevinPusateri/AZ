/// <reference types="Cypress" />
/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
**/

import 'cypress-iframe';
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";
import menuAuto from '../../fixtures/Motor/menuMotor.json'
import menuProvenienza from '../../fixtures/Motor/ProdottoProvenienza.json'
import LandingRicerca from "../ricerca/LandingRicerca";
import TopBar from '../common/TopBar';

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

class LibriMatricola {



    /**
     * metodo generico per cliccare sul pulsante Avanti
     */
    static Avanti() {
        //attende caricamento Contraente
        matrixFrame().within(() => {
            clickAvanti()
        })
    }

    /**
     * Attende il caricamento di Libri Matricola su DA
     */
    // static caricamentoLibriMatricolaDA() {

    //     cy.wait('@LibriMatricolaDA', { requestTimeout: 120000 });
    // }

    /**
     * Avvia l'emissione di un nuovo preventivo madre
     * @param {string} convenzione 
     */
    static nuovoPreventivoMadre(convenzione) {

        matrixFrame().within(() => {

            cy.get('#ButtonNuovo').should('be.visible').click() //click sul pulsante 'nuovo'
            cy.pause()

            cy.get('#tblConvenzioni').should('be.visible')
                .find('td[aria-describedby="tblConvenzioni_txtDescrizione"]')
                .contains(convenzione).should('be.visible').click()

            cy.intercept({
                method: 'POST',
                url: '**/GetDatiAggiuntiviConvenzione'
            }).as('loadDatiIntegrativi')

            cy.get('button').children('span').contains('Ok')
                .should('be.visible').click()
            cy.wait('@loadDatiIntegrativi', { requestTimeout: 60000 });
        })
    }

    /**
     * Inserisce i dati integrativi
     * [21/12/2021 si limita ad attendere il caricamento e cliccare 'avanti']
     * @param {bool} retrodatazione 
     */
    static datiIntegrativi(retrodatazione) {

        matrixFrame().within(() => {
            cy.intercept({
                method: 'POST',
                url: '**/GetComboContent'
            }).as('loadContraente')
            //click su avanti
            cy.get('[value="› Avanti"]')
                .should('be.visible').click()

            if (retrodatazione) {
                cy.get('label').contains('Retrodatazione della decorrenza?').should('be.visible')
                    .parent().parent()
                    .find('button').children('span').contains('Ok').click()
            }
            cy.wait('@loadContraente', { requestTimeout: 60000 });

        })
    }

    /**
     * Imposta i dati contraente
     * [21/12/2021 si limita ad attendere il caricamento della pagina e andare avanti]
     */
    static Contraente() {

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
            var a = i
            matrixFrame().within(() => {
                cy.log('var a inside: ' + a)
                //scorre l'array e seleziona la garanzia
                //[non verifica se la garanzia è già stata selezionata]
                cy.get('label').contains(garanzie[a])
                    .parents('.subtableBlock').find('input').click()
            })

            cy.wait(1000)
            var popupCheck = false
            matrixFrame().within(() => {
                //cy.get('#pnlDialog').should('be.visible')
                cy.get('#pnlDialog').then(($popup) => {
                    popupCheck = $popup.is(':visible')
                    cy.log("popup: " + popupCheck)
                    popupCheck.as('boolPopup')
                })
            })

            cy.log("popup out: " + '@boolPopup')
            //se il popup è presente clicca su ok
            if ('popupCheck') {
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

    static RiepilogoGaranzie2(garanzie, nPopup) {

        for (var i = 0; i < garanzie.length; i++) {
            cy.log('var i outside: ' + i)
            var a = i
            matrixFrame().within(() => {
                cy.log('var a inside: ' + a)
                //scorre l'array e seleziona la garanzia
                //[non verifica se la garanzia è già stata selezionata]
                cy.get('label').contains(garanzie[a])
                    .parents('.subtableBlock').find('input').click()
            })

            /*------*/

            cy.wait(1000)
            matrixFrame().within(() => {
                //cy.get('#pnlDialog').should('be.visible')
                cy.get('#pnlDialog').then(($popup) => {
                    var popupCheck = $popup.is(':visible')
                    cy.log("popup: " + popupCheck)
                    cy.wrap(popupCheck).as('boolPopup')
                })
            })

            //se il popup è presente clicca su ok
            cy.get('@boolPopup').then(($popupIsVisible) => {
                if ($popupIsVisible) {
                    cy.log("inside if")

                    for (var y = 0; y < nPopup; y++) {
                        matrixFrame().within(() => {
                            cy.get('div[id="pnlDialog"]').next('div')
                                .find('span').contains('OK').click() //click su OK

                            cy.wait(300)
                        })
                    }
                }
            })
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
     * Completa la pagina Integrazione
     * Emetti Polizza
     */
    static IntegrazioneEmettiPolizza() {
        //attende il completamento del salvataggio preventivo 608601
        cy.intercept({
            method: 'POST',
            url: '**/GetElencoAutorizzazioni'
        }).as('loadIntegrazione')

        cy.wait('@loadIntegrazione', { requestTimeout: 60000 });

        matrixFrame().within(() => {
            //click su Emetti preventivo
            cy.get('#btnAvanti')
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

        cy.wait('@salvataggioContratto', { requestTimeout: 80000 });

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
        cy.intercept({
            method: 'POST',
            url: '**/Auto/GestioneLibriMatricolaDA/**'
        }).as('LibriMatricolaDA')

        matrixFrame().within(() => {
            cy.get('input[value="› Home"]').click() //click su Home
            cy.get('#pnlDialog').contains('Si è sicuri di voler uscire?')
                .next('div').find('span').contains('Si').click() //Risponde SI al popup di attenzione
        })
        cy.wait('@LibriMatricolaDA', { requestTimeout: 120000 });

    }

    /**
     * ritorna alla Home dalla pagina finale di salvataggio contratto su Preventivo Applicazione 
     */
    static FinaleGoHomeApplication() {
        cy.intercept({
            method: 'POST',
            url: '**/Auto/GestioneLibriMatricolaDA/**'
        }).as('LibriMatricolaDA')

        matrixFrame().within(() => {
            cy.get('input[value="› Home"]').click() //click su Home
            cy.get('#pnlDialog').contains('Si è sicuri di voler uscire?')
                .next('div').find('span').contains('Si').click() //Risponde SI al popup di attenzione
        })
        cy.wait('@LibriMatricolaDA', { requestTimeout: 120000 });

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

    static AperturaElencoApplicazioni(nPreventivo, nomeApplicazione) {
        matrixFrame().within(() => {
            //tasto destro sul preventivo passato come parametro, altrimenti ne sceglie uno casualmente
            //e restituisce il numero del preventivo scelto

            // table diventa preventivi figlie table_preventivi_figlie
            cy.wait(2000)
            if (nomeApplicazione === 'Auto') {
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

            }

        })

        if (nomeApplicazione === 'Auto')
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

    static conversione() {
        //Selezioniamo tutti preventivi
        matrixFrame().within(() => {
            cy.get('#cb_table_preventivi_figlie').should('be.visible').click()
            //Conferme dei popup
            cy.get('input[value="Conferma preventivi selezionati"]').click()
            cy.get('#popup_content').should('be.visible').find('#popup_ok').click()

            cy.get('#popup_message').should('contain.text', 'Sono stati confermati 3 preventivi')
            cy.get('#popup_content').should('be.visible').find('#popup_ok').click()
            cy.get('div[class="iconconfermato"]').should('be.visible').and('have.length', 3)


            // Torno Indietro Elenco preventivi
            cy.intercept({
                method: 'GET',
                url: '**/PreventiviMadri.aspx/**'
            }).as('listaPreventivi')
            cy.get('input[value="< Elenco Preventivi"]').click()
            cy.wait('@listaPreventivi', { requestTimeout: 30000 });
            cy.pause()
        })
    }

    /**
     * Accedi al preventivo polizza Madre
     * @param {string} nPreventivo - numero del preventivo 
     */
    static accessoPreventivoPolizzaMadre(nPreventivo) {

        //tasto destro sul preventivo passato come parametro
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.wait(2000)
            cy.get('#table_preventivi_madre', { timeout: 10000 }).should('be.visible').within(() => {

                cy.get('#' + nPreventivo).should('be.visible').rightclick()
            })
        })

        // Click su Accesso a Preventivo Polizza Madre
        cy.get('@iframe').within(() => {
            cy.log('inside contex menu')
            cy.get('[id="jqContextMenu"]', { timeout: 5000 })
                .find('#visualizzaPLM')
                .should('be.visible').click()
        })

        // Inserire la Data
        cy.get('@iframe').within(() => {
            cy.get('#dialogDataPresuntoIncassoContent').should('be.visible').within(() => {

                // un giorno dopo alla data corrente
                var today = new Date();
                var tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                tomorrow.toLocaleDateString();
                let formattedDate = String(tomorrow.getDate()).padStart(2, '0') + '' +
                    String(tomorrow.getMonth() + 1).padStart(2, '0') + '' +
                    tomorrow.getFullYear()

                cy.get('#dataPresuntoIncassoDialogValue').clear().type(formattedDate).wait(500)
            })

            cy.intercept({
                method: 'POST',
                url: '**/GetRiepilogoGaranzie'
            }).as('Riepilogo')

            cy.contains('Conferma').should('be.visible').click()
            // Attesa apertura Scheda Riepilogo 
            cy.wait('@Riepilogo', { requestTimeout: 60000 });
        })
    }

    static consensi() {
        cy.getIFrame()

        //Visualizza PDF e conferma
        cy.get('@iframe').within(() => {
            cy.get('input[alt="Visualizza Informativa"]').first().click()
            cy.pause()
            cy.get('#AnteprimaPDF').should('be.visible')
            cy.get('button').contains('Conferma').click()
            cy.get('#AnteprimaPDF').should('not.be.visible')
            cy.pause()
        })
    }
}

export function PrevApplicazione(nomeApplicazione, veicolo, garanzie, coperturaRCA = true, nPopupRiepilogo = 0) {

    //#region Configuration
    Cypress.config('defaultCommandTimeout', 60000)
    const delayBetweenTests = 2000
    //#endregions

    //#region  variabili iniziali
    var nPreventivo = null
    var nPreventivoApp = null
    //#endregion variabili iniziali


    describe("PREVENTIVO APPLICAZIONE: " + nomeApplicazione, () => {

        it("Elenco applicazioni", () => {

            // Viene eseguito solo al primo Step
            if (nomeApplicazione === 'Auto') {
                LibriMatricola.AperturaTabPreventivi()
                LibriMatricola.AperturaElencoApplicazioni(nPreventivo, nomeApplicazione)

                cy.get('@nPrevMadre').then(val => {
                    nPreventivo = val
                    cy.log("nPreventivo: " + nPreventivo)
                })

                LibriMatricola.caricamentoElencoApplicazioni()
            }

        })

        it("Nuovo preventivo applicazione", () => {
            LibriMatricola.NuovoPreventivoApplicazione(true)
            LibriMatricola.caricamentoDatiAmministrativi()
        })

        it("Dati Amministrativi", () => {
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoContraenteProprietario()
        })

        it("Contraente/Proprietario", () => {
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoVeicolo()
        })

        it("Veicolo", () => {
            LibriMatricola.NuovoVeicolo(veicolo)
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoProdottoProvenienza()
        })

        it("Selezione provenienza", () => {
            LibriMatricola.CoperturaRCA(coperturaRCA)
            if (coperturaRCA) {
                LibriMatricola.ProvenienzaVeicolo(menuProvenienza.primaImmatricolazione.documentazione)
            }
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoRiepilogo()
        })

        it("Riepilogo", () => {
            LibriMatricola.RiepilogoGaranzie2(garanzie, nPopupRiepilogo)
            LibriMatricola.Avanti()
        })

        it("Integrazione", () => {
            LibriMatricola.Integrazione()
        })

        it("Finale", () => {
            LibriMatricola.ContrattoFinale()
            LibriMatricola.FinaleGoHome()
            // LibriMatricola.caricamentoElencoApplicazioni()

            cy.get('@contratto').then(val => {
                nPreventivoApp = val
                cy.log("Preventivo Applicazione n. " + nPreventivoApp)
            })
        })

        it("Verifica presenza preventivo applicazione", () => {
            expect(nPreventivoApp).to.not.be.undefined
            expect(nPreventivoApp).to.not.be.null

            LibriMatricola.VerificaPresenzaPrevApp(nPreventivoApp)
        })
    })
}

export function PreventivoMadre() {

    //#region Configuration
    Cypress.config('defaultCommandTimeout', 60000)
    //#endregions

    //#region  variabili iniziali
    var nPreventivo
    let currentClientPG
    //#endregion variabili iniziali

    it("Ricerca cliente", () => {
        // LandingRicerca.searchRandomClient(true, "PG", 'E')
        // LandingRicerca.clickRandomResult('E')
        TopBar.search('04818780480')
        LandingRicerca.clickFirstResult()
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            currentClientPG = currentClient
        })
    })

    it("Libri Matricola da Sintesi Cliente", () => {
        SintesiCliente.emissioneAuto(menuAuto.prodottiParticolari.libriMatricola)
        cy.wait('@LibriMatricolaDA', { requestTimeout: 50000 });

    })

    it("Nuovo preventivo madre", () => {
        LibriMatricola.nuovoPreventivoMadre('SALA TEST LM AUTOMATICI')
    })

    it("Dati integrativi", () => {
        LibriMatricola.datiIntegrativi(true)
    })

    it("Contraente", () => {
        LibriMatricola.Contraente()
        LibriMatricola.caricamentoRiepilogo()
    })

    it("Riepilogo", () => {
        LibriMatricola.Riepilogo(false)
    })

    it("Integrazione", () => {
        LibriMatricola.Integrazione()
    })

    it("Finale", () => {
        LibriMatricola.ContrattoFinale()
        LibriMatricola.FinaleGoHome()
        cy.get('@contratto').then(val => {
            nPreventivo = val
            cy.log("nContratto b " + nPreventivo)
        })

    })

    it("Verifica presenza preventivo", () => {

        cy.log("nContratto c " + nPreventivo)
        expect(nPreventivo).to.not.be.undefined
        expect(nPreventivo).to.not.be.equal("000000")
        LibriMatricola.VerificaPresenzaPrevMadre(nPreventivo)
    })

}

export default LibriMatricola
//VOLVO C70 2.4 20V 170 CV MOMENTUM (DAL 2005/09)