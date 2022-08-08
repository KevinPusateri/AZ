/// <reference types="Cypress" />
/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
**/

import 'cypress-iframe';
import PageVPS from "../../mw_page_objects/vps/PageVPS";
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente";
import menuProvenienza from '../../fixtures/Motor/ProdottoProvenienza.json'
import LandingRicerca from "../ricerca/LandingRicerca";
import DettaglioAnagrafica from '../clients/DettaglioAnagrafica';
import TopBar from '../common/TopBar';
import LoginPage from '../common/LoginPage';

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
     * Torna indietro all'elenco preventivi Madre
     */
    static backElencoPreventivi() {
        cy.wait(5000)
        matrixFrame().within(() => {
            cy.intercept({
                method: 'GET',
                url: '**/PreventiviMadri.aspx/**'
            }).as('listaPreventivi')
            cy.get('input[value="< Elenco Preventivi"]').click()
            cy.wait('@listaPreventivi', { requestTimeout: 30000 });
        })
    }

    /**
     * Torno Indietro Elenco Libri Matricola
     */
    static backElencoLibriMatricola() {
        cy.wait(10000)
        matrixFrame().within(() => {
            cy.intercept({
                method: 'POST',
                url: '**/GestioneLibriMatricolaDA/**'
            }).as('getLibriMatricola');
            cy.get('#ButtonBackElencoLM').should('be.visible').within(() => {
                cy.get('input[value="< Elenco Libri Matricola"]').should('be.visible').click()
            })
            // cy.wait('@getLibriMatricola', { requestTimeout: 40000 }).its('response.statusCode').should('eq', 200)
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
    static nuovoPreventivoMadre(convenzione, dataConvenzione) {

        matrixFrame().within(() => {

            let count = 0;
            const reloadTable = (count) => {
                if (count === 5)
                    assert.fail('Rifare il flusso (Convenzione non trovata)')
                cy.intercept({
                    method: 'POST',
                    url: '**/GetAllConvenzioni'
                }).as('loadGetAllConvenzioni')
                cy.get('#ButtonNuovo').should('be.visible').click() //click sul pulsante 'nuovo'

                cy.wait(3500)
                cy.get('input[class="inputSmlMid hasDatepicker"]').should('be.visible').click()
                    .clear().type(dataConvenzione + '{enter}', { delay: 200 })
                cy.get('input[class="inputSmlLarge"]').click().clear().type(convenzione + '{enter}', { delay: 200 })//.wait(5000)

                cy.get('span[class="ui-button-icon-primary ui-icon ui-icon-search"]').first().click().wait(3500)
                cy.wait('@loadGetAllConvenzioni', { requestTimeout: 60000 })


                cy.get('#tblConvenzioni').then(($table) => {
                    const table = $table.find('td').is(':contains(' + convenzione + ')')
                    if (!table) {
                        cy.contains('Chiudi').click()
                        count++
                        reloadTable(count)
                    }
                    else {
                        cy.wrap($table).find('td[aria-describedby="tblConvenzioni_txtCodice"]:visible').wait(1000)
                        cy.get('#tblConvenzioni').contains(convenzione).should('be.visible').click()
                        cy.intercept({
                            method: 'POST',
                            url: '**/GetDatiAggiuntiviConvenzione'
                        }).as('loadDatiIntegrativi')

                        cy.get('button').children('span').contains('Ok')
                            .should('be.visible').click()
                        cy.wait('@loadDatiIntegrativi', { requestTimeout: 60000 });
                    }

                })
            }

            reloadTable(count)

        })

    }

    /**
     * 
     */
    static checkDichiarazionediNonCircolazione() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.wait(5000)
            cy.get('form').then($form => {
                console.log($form)
                if ($form.find('div[role="dialog"]:visible').length > 0) {
                    cy.get('div[role="dialog"]').should('be.visible').contains('Si').click()
                }
            })
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

            cy.wait(3000)
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

    static AccessoriOptional() {
        matrixFrame().within(() => {
            cy.get('span[class="ui-button-text"]').should('be.visible').contains('OK').click()
        })
    }


    /**
     * Completa la pagina Integrazione
     * [21/12/2021 si limita ad emettere il preventivo]
     * @param {boolean} inviaRichiestaVPS - default settato a false verifico se Cliccare Invio Richiesta VPS
     */
    static Integrazione(inviaRichiestaVPS = false) {
        //attende il completamento del salvataggio preventivo
        cy.intercept({
            method: 'POST',
            url: '**/GetElencoAutorizzazioni'
        }).as('loadIntegrazione')

        cy.wait('@loadIntegrazione', { requestTimeout: 60000 });

        if (!inviaRichiestaVPS) {
            matrixFrame().within(() => {
                //click su Emetti preventivo
                cy.get('#btnSalvaNomin')
                    .should('be.visible').click()
            })
        }

    }

    /**
     * 
     * @private
     */
    static inviaRichiestaVPS() {
        return new Cypress.Promise((resolve, reject) => {

            //attende il completamento della richiesta VPS
            cy.intercept({
                method: 'POST',
                url: '**/VerificaAbilitazioneRichiestaVPSUrgente'
            }).as('loadVerificaAbilitazioneRichiestaVPSUrgente')
            matrixFrame().within(() => {
                //click su Emetti preventivo
                cy.get('#btnInviaRichiesta')
                    .should('be.visible').click()
            })
            cy.wait('@loadVerificaAbilitazioneRichiestaVPSUrgente', { requestTimeout: 60000 });

            matrixFrame().within(() => {
                // Inserimento codice VPS
                cy.intercept({
                    method: 'POST',
                    url: '**/InviaRichiestaVPS'
                }).as('loadInviaRichiestaVPS')
                cy.get('div[role="dialog"]').should('be.visible').within(() => {
                    // Esistono motivazioni commerciali? check Si ->    
                    cy.get('#rb_commerciali_si').click()
                    cy.get('#txtTestoMotivazioniTeniche').type('asdaweawda')
                    cy.get('button').find('span:contains("Ok"):visible').click()

                })
                cy.wait('@loadInviaRichiestaVPS', { requestTimeout: 60000 });

                cy.get('div[role="dialog"]').should('be.visible').within(() => {
                    cy.get('#EsitoinvioVPS').should('include.text', 'completato con successo.')
                    cy.get('#EsitoinvioVPS').invoke('text').then(numeroPreventivo => {
                        var result = numeroPreventivo.replace(/\D/g, "");
                        // Esistono motivazioni commerciali? ->  check Si    
                        cy.get('button').find('span:contains("Ok"):visible').click()
                        resolve(result)

                        cy.wait(15000)
                    })
                })
            })
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

        cy.intercept({
            method: 'GET',
            url: '**/Completamento/**'
        }).as('completamento')
        matrixFrame().within(() => {
            //click su Emetti preventivo
            cy.get('#btnAvanti')
                .should('be.visible').click()
        })
        cy.wait('@completamento', { requestTimeout: 60000 });

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

        cy.wait('@salvataggioContratto', { requestTimeout: 220000 });
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

        cy.wait(5000)

    }

    static FinaleContrattoLibroMatricola() {
        matrixFrame().within(() => {
            cy.get('[class="clNumeroPrevContr"]').invoke('text').then(val => {
                cy.wrap(val).as('contratto')
                cy.log("return " + '@contratto')
            })
        })
        cy.wait(10000)

        // Adempimenti precontrattuali
        matrixFrame().within(() => {
            cy.get('div[role="dialog"]').then(($dialog) => {
                const dialog = $dialog.find('#Elencodocumentidagestire').is(':visible')
                if (dialog) {
                    cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                        cy.get('#Elencodocumentidagestire').should('be.visible')
                        cy.contains('Ok').click()
                        cy.get('#Elencodocumentidagestire').should('not.be.visible')
                    })
                }
            })

            cy.get('a[href="GetPDFFile.ashx?tipoStampa=precontrattuale&isInMobilita=false"]').should('be.visible').invoke('removeAttr', 'href').click().wait(5000)
            cy.get('div[role="dialog"]').then(($dialog) => {
                const dialog = $dialog.find('#Elencodocumentidagestire').is(':visible')
                if (dialog) {
                    cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                        cy.get('#Elencodocumentidagestire').should('be.visible')
                        cy.contains('Ok').click()
                        cy.get('#Elencodocumentidagestire').should('not.be.visible')
                    })
                }
            })
        })
        matrixFrame().within(() => {
            cy.get('#div1').should('be.visible').and('contain.text', 'Operazione conclusa')
        })

        // Perfezionamento
        matrixFrame().within(() => {
            cy.get('a[href="GetPDFFile.ashx?tipoStampa=anteprimaContratto&isInMobilita=false"]').should('be.visible').invoke('removeAttr', 'href').click()
            cy.get('#divPannelloMsgConsegnaDoc').should('be.visible').and('include.text', 'Operazione conclusa')
        })


    }

    static VerificaPresenzaContrattoLibroMatricola(nContratto) {
        cy.wait(10000)
        cy.getIFrame()
        cy.get('@iframe').should('be.visible').within(() => {
            cy.get('#table_polizze_madri').should('be.visible').within(() => {
                cy.get('#' + nContratto).should('be.visible')
            })
        })
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

    static AperturaTabLibriMatricola() {
        cy.wait(5000)
        matrixFrame().within(() => {

            cy.get('#tab_polizze_madri').should('be.visible').click()
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
        cy.wait(2000)
        matrixFrame().within(() => {
            //tasto destro sul preventivo passato come parametro, altrimenti ne sceglie uno casualmente
            //e restituisce il numero del preventivo scelto

            // table diventa preventivi figlie table_preventivi_figlie
            cy.wait(2000)
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

    static getPreventivoMadre() {
        cy.wait(5000)

        matrixFrame().within(() => {
            cy.get('#table_preventivi_madre', { timeout: 10000 }).should('be.visible').within(() => {

                cy.get('[class*="ui-row-ltr"]', { timeout: 10000 }).should('be.visible')
                    .then(($rows) => {
                        const items = $rows.toArray()
                        return Cypress._.sample(items)
                    }).then(($rows) => {
                        cy.wrap($rows.find('[aria-describedby="table_preventivi_madre_NumeroPreventivo"]').text())
                            .as('nPrevMadre')
                    })
            })

        })

    }

    static getLibroMatricola() {
        cy.wait(5000)

        matrixFrame().within(() => {
            cy.get('#table_polizze_madri', { timeout: 10000 }).should('be.visible').within(() => {

                cy.get('[class*="ui-row-ltr"]', { timeout: 10000 }).should('be.visible')
                    .then(($rows) => {
                        const items = $rows.toArray()
                        return Cypress._.sample(items)
                    }).then(($rows) => {
                        cy.wrap($rows.find('[aria-describedby="table_polizze_madri_NumeroContratto"]').text())
                            .as('nLibroMatricola')
                    })
            })

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
                .should('be.visible').type(veicolo.targa).wait(1000)

            //seleziona la marca
            cy.get('div[title="Seleziona la marca del veicolo"]').first()
                .find('input:first').type(veicolo.marca)
                .wait(1000).type('{downarrow}{enter}').wait(1000)

            //seleziona il modello
            cy.get('#cbModello').find('input').type(veicolo.modello)
                .wait(1000).type('{downarrow}{enter}').wait(1000)

            //seleziona la versione
            cy.get('#cbVersione').find('input').type(veicolo.versione)
                .wait(1000).type('{downarrow}{enter}').wait(1000)

            //inserisce la data di immatricolazione
            cy.get('input[data-bind*="dpDataImmatricolazioneN"]').first()
                .type(veicolo.dataImmatricolazione).wait(1000)

            //inserisce il numero dei posti
            cy.get('input[title*="numero di posti"]').filter(':visible').type(veicolo.nPosti).wait(1000)
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

    static confermaPreventivi() {
        cy.wait(5000)
        //Selezioniamo tutti preventivi
        matrixFrame().within(() => {
            cy.get('#cb_table_preventivi_figlie').should('be.visible').click()
            //Conferme dei popup
            cy.get('input[value="Conferma preventivi selezionati"]').click()
            cy.get('#popup_content').should('be.visible').find('#popup_ok').click()

            cy.get('#popup_message').should('be.visible')
            cy.get('#popup_content').should('be.visible').find('#popup_ok').click()
            cy.get('div[class="iconconfermato"]').should('be.visible')


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

            cy.intercept({
                method: 'POST',
                url: '**/GetRiepilogoGaranzie'
            }).as('Riepilogo')

            cy.contains('Conferma').should('be.visible').click()
            // Attesa apertura Scheda Riepilogo 
            cy.wait('@Riepilogo', { requestTimeout: 60000 });
        })
    }


    static conversione() {
        cy.wait(5000)
        //Selezioniamo tutti preventivi
        matrixFrame().within(() => {
            cy.get('#cb_table_preventivi_figlie').should('be.visible').click()
            //Conferme dei popup
            cy.get('input[value="Converti preventivi selezionati"]').click()

            cy.get('div[aria-describedby="dialogConfermaConversione"]').should('be.visible').find('#btnConferma').click()

            // Caricamento Conversione Completato
            cy.get('div[aria-describedby="dialogProgressBarConversione"]').should('be.visible').within(() => {

                cy.get('#result-message', { timeout: 200000 }).should('contain.text', 'Tutti i preventivi selezionati sono stati convertiti')
                cy.contains('Chiudi').click().wait(2000)
            })

            cy.get('#popup_container').should('be.visible').find('#popup_ok:visible').click().wait(15000)
        })


        matrixFrame().within(() => {
            // Stampa Massiva Procedi
            cy.get('div[aria-describedby="dialogConfermaStampaMassiva"]').should('be.visible').within(() => {
                cy.get('#dialogConfermaStampaMassiva', { timeout: 30000 }).should('be.visible')
                cy.get('button[role="button"]').contains('Procedi').click().wait(2000)

            })

            // Stampa Massiva Inizio Stampa
            cy.get('div[aria-describedby="dialogStampaMassiva"]').should('be.visible').within(() => {
                cy.get('#btnStampa').click()
            })
            cy.get('#statusStampaApplet', { timeout: 200000 }).should('not.be.visible')

            // Popup Esci
            cy.get('div[aria-describedby="dialogStampaMassiva"]').should('be.visible').within(() => {
                cy.contains('Esci').click()
            })

            // Popup Stampa Applicazioni Conclusa -> OK
            cy.get('#popup_container').should('be.visible').within(() => {
                cy.get('#popup_title').should('include.text', 'Stampa applicazioni conclusa')
                cy.get('#popup_ok').click()
            })

            // Popup Avviso
            cy.get('div[aria-describedby="popupUltrattivita"]').should('be.visible').within(() => {
                cy.get('button').contains('Ok').click()
            })
        })

    }


    /**
     * Accedi all'Elenco Preventivi Applicazioni
     * @param {string} nPreventivo - numero del preventivo 
     */
    static accessoElencoPrevApplicazioni(nPreventivo) {

        //tasto destro sul preventivo passato come parametro
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.wait(2000)
            cy.get('#table_polizze_madri', { timeout: 10000 }).should('be.visible').within(() => {

                cy.get('#' + nPreventivo).should('be.visible').rightclick()
            })
        })

        // Click su Accesso a Elenco Preventivi
        cy.get('@iframe').within(() => {
            cy.log('inside contex menu')
            cy.get('[id="jqContextMenu"]', { timeout: 5000 })
                .find('#visualizzaPLF')
                .should('be.visible').click()
        })

    }

    /**
     * Accedi all'Elenco Applicazioni
     * @param {string} nPreventivo - numero del preventivo 
     */
    static accessoElencoApplicazioni(nPreventivo) {

        //tasto destro sul preventivo passato come parametro
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.wait(2000)
            cy.get('#table_polizze_madri', { timeout: 10000 }).should('be.visible').within(() => {

                cy.get('#' + nPreventivo).should('be.visible').rightclick()
            })
        })

        // Click su Accesso a Elenco Preventivi
        cy.get('@iframe').within(() => {
            cy.log('inside contex menu')
            cy.get('[id="jqContextMenu"]', { timeout: 5000 })
                .find('#visualizzaPF')
                .should('be.visible').click()
        })

    }

    static consensi() {
        cy.wait(10000)
        cy.getIFrame()
        //Visualizza PDF e conferma
        cy.get('@iframe').should('be.visible').within(() => {

            //? CAPITA che non sia settato di default capire in base all'agenzia
            cy.get('#pnlIntermediari').should('be.visible').within(() => {
                cy.get('button[title="Show All Items"]').first().click().wait(1000)
            })
            cy.get('#ulintermediario').should('exist').and('be.visible').find('li').contains('PULINI FRANCESCO').click()


            // Set Informativo
            cy.get('#btnVisualizzaPrivacy').should('be.visible').first().click()
            cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                cy.get('#AnteprimaPDF').should('be.visible')
                cy.contains('Conferma').click()
                cy.get('#AnteprimaPDF').should('not.be.visible')
            })
            // Allegato 3 Informativa
            cy.get('input[alt="Visualizza Informativa"]').should('be.visible').first().click()
            cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                cy.get('#AnteprimaPDF').should('be.visible')
                cy.contains('Conferma').click()
                cy.get('#AnteprimaPDF').should('not.be.visible')
            })

            // Allegato 4 Informazioni
            cy.get('input[alt="Visualizza Informativa"]').should('be.visible').eq(1).click()
            cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                cy.get('#AnteprimaPDF').should('be.visible')
                cy.contains('Conferma').click()
                cy.get('#AnteprimaPDF').should('not.be.visible')
            })

            // Riepilogo delle richieste
            cy.get('#btnVisualizzaAdeguatezza').should('be.visible').click()
            cy.get('div[role="dialog"]:visible').should('be.visible').within(() => {
                cy.get('#AnteprimaPDF').should('be.visible')
                cy.contains('Conferma').click()
                cy.get('#AnteprimaPDF').should('not.be.visible').wait(3900)
            })

            // Privacy per scopi assicurativi
            cy.contains('Privacy per scopi assicurativi').parents('tr').within(($tr) => {
                const isChecked = $tr.find('div[class="clStatoStampa1"]').is(':visible')
                if (!isChecked)
                    cy.get('td').eq(2).find('input').click()
            })

            cy.get('#btnAvanti').should('be.visible').click().wait(25000)
        })

        cy.get('@iframe').should('be.visible').within(() => {
            cy.get('img[src="Images/iconImagesBlue/confirm_green.gif"]').should('be.visible')
        })
    }


    // Accedi Voce di menu Incasso Polizza Madre
    static accessoIncassoPolizzaMadre(nPreventivo) {
        //tasto destro sul preventivo passato come parametro
        cy.wait(15000)
        cy.getIFrame()
        cy.get('@iframe').should('be.visible').within(() => {
            cy.get('#table_polizze_madri', { timeout: 10000 }).should('be.visible').within(() => {

                cy.get('#' + nPreventivo).should('be.visible').rightclick()
            })
        })

        cy.wait(3000)
        // Click su Incasso Polizza Madre
        cy.get('@iframe').within(() => {
            cy.log('inside contex menu')
            cy.get('[id="jqContextMenu"]', { timeout: 5000 })
                .find('#incassaPM')
                .should('be.visible').click()

        })
    }

    /**
     * Flusso Incasso Polizza Madre 
     */
    static incasso() {
        cy.wait(15000)
        cy.getIFrame()
        cy.get('@iframe').should('be.visible').within(() => {
            // Incasso
            cy.intercept({
                method: 'POST',
                url: '**/GoToIncasso'
            }).as('GoToIncasso')
            cy.get('#pnlBtnIncasso').should('be.visible').click()
            cy.wait('@GoToIncasso', { requestTimeout: 60000 });
        })

        //Digital Accounting System (DAS) - sezione incassi
        cy.wait(10000)
        cy.get('@iframe').should('be.visible').within(() => {

            // Modalita di Pagamento
            cy.get('span[aria-owns="TabIncassoModPagCombo_listbox"]').click()
            cy.get('#TabIncassoModPagCombo-list').should('be.visible').within(() => {
                cy.contains('Assegno').click()
            })
            // Incasso
            cy.get('#btnTabIncassoConfirm').should('be.visible').click()
        })

        cy.wait(10000)
        cy.get('@iframe').should('be.visible').within(() => {
            // Incasso Completato Chiudi Pagina
            cy.get('#ctl00_pHolderMain1_btnChiudi').should('be.visible').click().wait(8000)
        })
    }


    /**
     * inizio Inclusione Nuova Applicazione
     */
    static inclusioneNuovaApplicazione() {
        cy.wait(10000)
        matrixFrame().within(() => {
            cy.get('input[value="Inclusione Nuova Applicazione"]').click()
        })
    }
}
export function PrevApplicazione(caseTest, nomeApplicazione, veicolo, garanzie, coperturaRCA = true, nPopupRiepilogo = 0) {

    //#region Configuration
    Cypress.config('defaultCommandTimeout', 60000)
    const delayBetweenTests = 2000
    //#endregions

    //#region  variabili iniziali
    var nPreventivo = null
    var nPreventivoApp = null
    //#endregion variabili iniziali


    describe("PREVENTIVO APPLICAZIONE: " + nomeApplicazione, function () {

        // Viene eseguito solo al primo Preventivo Applicazione
        if (caseTest === 1)
            it("Elenco applicazioni", function () {

                LibriMatricola.AperturaTabPreventivi()
                LibriMatricola.AperturaElencoApplicazioni(nPreventivo)

                cy.get('@nPrevMadre').then(val => {
                    nPreventivo = val
                    cy.log("nPreventivo: " + nPreventivo)
                })

                LibriMatricola.caricamentoElencoApplicazioni()
            })

        it("Nuovo preventivo applicazione", function () {
            LibriMatricola.NuovoPreventivoApplicazione()
            LibriMatricola.caricamentoDatiAmministrativi()
        })

        it("Dati Amministrativi", function () {
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoContraenteProprietario()
        })

        it("Contraente/Proprietario", function () {
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoVeicolo()
        })

        it("Veicolo", function () {
            LibriMatricola.NuovoVeicolo(veicolo)
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoProdottoProvenienza()
        })

        it("Selezione provenienza", function () {
            LibriMatricola.CoperturaRCA(coperturaRCA)
            if (coperturaRCA) {
                LibriMatricola.ProvenienzaVeicolo(menuProvenienza.primaImmatricolazione.documentazione)
            }
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoRiepilogo()
        })

        it("Riepilogo", function () {
            LibriMatricola.RiepilogoGaranzie2(garanzie, nPopupRiepilogo)
            LibriMatricola.Avanti()
        })

        it("Integrazione", function () {
            LibriMatricola.Integrazione()
        })

        it("Finale", function () {
            LibriMatricola.ContrattoFinale()
            LibriMatricola.FinaleGoHome()
            cy.get('@contratto').then(val => {
                nPreventivoApp = val
                cy.log("Preventivo Applicazione n. " + nPreventivoApp)
            })
        })

        it("Verifica presenza preventivo applicazione", function () {
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
    var convenzione
    var dataConvenzione
    before(() => {
        cy.fixture('LibriMatricola/Convenzione.json').then((data) => {
            convenzione = data.convenzione
            dataConvenzione = data.dataConvenzione
        })

    });
    //#endregion variabili iniziali

    it("Ricerca cliente", function () {

        const loopSearchClientWithBusinessForm = () => {
            LandingRicerca.searchRandomClient(true, "PG", 'P')
            LandingRicerca.clickRandomResult('PG', 'P')
            // LandingRicerca.search('00826700577')
            // LandingRicerca.clickFirstResult()
            DettaglioAnagrafica.clickTabDettaglioAnagrafica()
            cy.wait(3000)
            let loopCheck = false
            DettaglioAnagrafica.getIVAClient().then((codIva) => {
                if (codIva === '-') {
                    loopCheck = true
                }
                DettaglioAnagrafica.getFormaGiuridica().then((checkExistFormaGiuridica) => {
                    if (checkExistFormaGiuridica) {
                        cy.writeFile('cypress/fixtures/LibriMatricola/LibriMatricola.json', {
                            ClientePGIVA: codIva
                        })
                    }
                    else {
                        loopCheck = true
                    }
                })
            })
            cy.get('body').then(() => {
                if (loopCheck) {
                    loopSearchClientWithBusinessForm()
                }
            })
            SintesiCliente.clickTabSintesiCliente()
        }
        loopSearchClientWithBusinessForm()

    })

    it("Libri Matricola da Sintesi Cliente", function () {
        SintesiCliente.clickAuto()
        SintesiCliente.clickLibriMatricola()
    })

    it("Nuovo preventivo madre", function () {
        LibriMatricola.nuovoPreventivoMadre(convenzione, dataConvenzione)
    })

    it("Dati integrativi", function () {
        LibriMatricola.datiIntegrativi(false)
    })

    it("Contraente", function () {
        LibriMatricola.Contraente()
        LibriMatricola.caricamentoRiepilogo()
    })

    it("Riepilogo", function () {
        LibriMatricola.Riepilogo(false)
    })

    it("Integrazione", function () {
        LibriMatricola.Integrazione()
    })

    it("Finale", function () {
        LibriMatricola.ContrattoFinale()
        LibriMatricola.FinaleGoHome()
        cy.get('@contratto').then(val => {
            nPreventivo = val
            cy.log("nContratto b " + nPreventivo)
        })

    })

    it("Verifica presenza preventivo Madre", function () {

        cy.log("nContratto c " + nPreventivo)
        expect(nPreventivo).to.not.be.undefined
        expect(nPreventivo).to.not.be.equal("000000")
        LibriMatricola.VerificaPresenzaPrevMadre(nPreventivo)
    })

}

export function InclusioneApplicazione(nomeApplicazione, veicolo, garanzie, coperturaRCA = true, nPopupRiepilogo = 0) {

    //#region Configuration
    Cypress.config('defaultCommandTimeout', 60000)
    const delayBetweenTests = 2000
    //#endregions
    var nPreventivoApp

    describe("INCLUSIONE APPLICAZIONE: " + nomeApplicazione, function () {
        it('Inclusione Nuova Applicazione', function () {
            cy.fixture('LibriMatricola/LibriMatricola.json').then((data) => {
                LoginPage.logInMWAdvanced()
                LandingRicerca.search(data.ClientePGIVA)
                LandingRicerca.clickFirstResult()
                SintesiCliente.clickAuto()
                SintesiCliente.clickLibriMatricola()
                LibriMatricola.accessoElencoApplicazioni(data.numContrattoLibro)
                LibriMatricola.inclusioneNuovaApplicazione()
                LibriMatricola.caricamentoDatiAmministrativi()
            })
        })
        it('Dati Amministrativi', function () {
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoContraenteProprietario()
        })

        it("Contraente/Proprietario", function () {
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoVeicolo()
        })

        it("Veicolo", function () {
            LibriMatricola.NuovoVeicolo(veicolo)
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoProdottoProvenienza()
        })

        it("Selezione provenienza", function () {
            LibriMatricola.CoperturaRCA(coperturaRCA)
            if (coperturaRCA) {
                LibriMatricola.ProvenienzaVeicolo(menuProvenienza.primaImmatricolazione.documentazione)
            }
            LibriMatricola.Avanti()
            LibriMatricola.caricamentoRiepilogo()
        })

        it("Riepilogo", function () {
            LibriMatricola.RiepilogoGaranzie2(garanzie, nPopupRiepilogo)
            LibriMatricola.Avanti()
        })

        it("Integrazione", function () {
            LibriMatricola.Integrazione(true)
            LibriMatricola.inviaRichiestaVPS().then((numPreventivoApp) => {
                cy.log(numPreventivoApp)
                nPreventivoApp = numPreventivoApp
            })
            TopBar.logOutMW()
            cy.wait(1500)
        })

        // TODO: Verifica Esito in attesa di Autorizzazione giallo
        // it("Verifica Esito in attesa di Autorizzazione", function () {

        // })

        it("Autorizza Preventivo (VPS)", function () {
            PageVPS.launchLoginVPS()
        })

        it("aa", function () {
            cy.reload()
        })

        // it("Finale", function () {
        //     LibriMatricola.ContrattoFinale()
        //     LibriMatricola.FinaleGoHome()
        //     cy.get('@contratto').then(val => {
        //         nPreventivoApp = val
        //         cy.log("Preventivo Applicazione n. " + nPreventivoApp)
        //     })
        // })

        // it("Verifica presenza preventivo applicazione", function () {
        //     expect(nPreventivoApp).to.not.be.undefined
        //     expect(nPreventivoApp).to.not.be.null

        //     LibriMatricola.VerificaPresenzaPrevApp(nPreventivoApp)
        // })
    })
}

export default LibriMatricola