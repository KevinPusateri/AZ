/// <reference types="Cypress" />

import Common from "../common/Common";
import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
import LandingRicerca from "../ricerca/LandingRicerca";
import menuPolizzeAttive from '../../fixtures/SchedaCliente/menuPolizzeAttive.json'
import IncassoDA from "../da/IncassoDA";

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframe = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameMatrix = () => {

    cy.get('#matrixIframe')
        .iframe();

    let iframeSin = cy.get('#matrixIframe')
        .its('0.contentDocument').should('exist');

    return iframeSin.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIFrameDenuncia = () => {

    getIFrameMatrix().find('iframe[src="cliente.jsp"]')
        .iframe();

    let iframe = getIFrameMatrix().find('iframe[src="cliente.jsp"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

const getIframeModificaFonte = () => {

    getIFrame().find('iframe[id="MAIN_IFRAME"]')
        .iframe();

    let iframe = getIFrame().find('iframe[id="MAIN_IFRAME"]')
        .its('0.contentDocument').should('exist');

    return iframe.its('body').should('not.be.undefined').then(cy.wrap)
}

class Portafoglio {

    /**
     * Loop
     * Ricerca un cliente fino a quando non trova
     * una polizza attiva presente
     */
    static checkClientWithPolizza() {
        const searchClientWithPolizza = () => {
            LandingRicerca.searchRandomClient(true, "PF", "E")
            LandingRicerca.clickRandomResult()
            Portafoglio.clickTabPortafoglio()
            Portafoglio.clickSubTab('Polizze attive')
            cy.get('app-wallet-active-contracts').should('be.visible')
            cy.get('body').should('be.visible')
                .then($body => {
                    const isTrovato = $body.find('app-wallet-active-contracts:contains("Il cliente non possiede Polizze attive"):visible').is(':visible')
                    if (isTrovato)
                        searchClientWithPolizza()
                    else
                        return
                })
        }

        searchClientWithPolizza()
    }

    /**
     * Torna indietro 
     */
    static back() {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('client')) {
                req.alias = 'client'
            }
        })

        cy.get('a').contains('Clients').click()

        cy.wait('@client', { timeout: 30000 })
            .its('response.body.data.client')
            .should('not.be.null')
    }

    /**
     * Click Il tab Portafoglio
     */
    static clickTabPortafoglio() {
        cy.intercept('POST', '**/graphql', (req) => {
            aliasQuery(req, 'contract')
        })

        cy.get('app-client-profile-tabs').should('be.visible').within(() => {
            cy.get('a').should('be.visible')
        })
        cy.contains('PORTAFOGLIO').click().wait(2000)
        cy.wait('@gqlcontract', { timeout: 60000 });
        //cy.screenshot('Verifica aggancio Portafoglio', { clip: { x: 0, y: 0, width: 1920, height: 900 } }, { overwrite: true })
    }

    static apriPortafoglioLite() {
        let checkAperto

        cy.get('app-client-profile-tabs').should('be.visible')
            .find('a').contains("PORTAFOGLIO").then(($body) => {
                checkAperto = $body.is('[class*="active"]')
            })

        if (!checkAperto) {
            cy.get('app-client-profile-tabs')
                .find('a').contains("PORTAFOGLIO").click()

            cy.intercept({
                method: 'POST',
                url: '**/graphql'
            }).as('caricamento')

            cy.wait('@caricamento', { timeout: 120000 });
        }
        else {
            cy.log("tab già aperto")
        }
    }

    /**
     * Apre (true) o chiude (false) la lista delle polizze
     * @param {bool} apertaChiusa 
     */
    static listaPolizze(apertaChiusa) {
        switch (apertaChiusa) {
            case true:
                cy.get(".app-wallet-list-toggle-button").then(($body) => {
                    cy.log('Lista ' + $body.children('div[class="icon"]').is(':visible'))
                    if ($body.children('div[class="icon"]').is(':visible')) {
                        cy.log('Lista if ' + $body.children('div[class="icon"]').is(':visible'))
                        $body.children('div[class="icon"]').trigger('click')
                    }
                    else {
                        cy.log('Lista già aperta')
                    }
                })
                break;
            case false:
                cy.get(".app-wallet-list-toggle-button").then(($body) => {
                    if ($body.children('div[class="icon open"]').is(':visible')) {
                        $body.children('div[class="icon open"]').trigger('click')
                    }
                    else {
                        cy.log('Lista già chiusa')
                    }
                })
                break;
        }
    }


    /**
     * Verifica presenza dei subTabs di Portafoglio
     */
    static checkLinksSubTabs() {
        cy.get('nx-tab-header').first().scrollIntoView().should('exist')
        cy.get('button').should('be.visible')
        const tabPortafoglio = [
            'Polizze attive',
            'Proposte',
            'Preventivi',
            'Non in vigore',
            'Sinistri'
        ]
        cy.get('nx-tab-header').find('button').each(($checkTabPortafoglio, i) => {
            expect($checkTabPortafoglio.text().trim()).to.include(tabPortafoglio[i]);
        })
    }

    /**
     * Verifica Se il Cliente possiede delle Pollizze (Polizze attive)
     * @param {Boolean} [performAggancioApplicativo] default true, effettua aggancio applicativo dalla card
     */
    static checkPolizzeAttive(performAggancioApplicativo = true) {
        cy.screenshot('Verifica Polizze Attive', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Polizze attive")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede polizze')
            else {
                cy.get('app-wallet-active-contracts').should('be.visible').then(($contract) => {

                    var firstCheck = $contract.find(':contains("Polizze attive")').is(':visible')
                    var secondCheck = $contract.find(':contains("Polizza attiva")').is(':visible')
                    if (firstCheck || secondCheck) {
                        assert.isTrue(true, 'corretto')
                        cy.log(firstCheck)
                        cy.log(secondCheck)
                    }
                })
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.wait(3000)
                if (performAggancioApplicativo) {
                    cy.get('app-contract-card').should('be.visible').first().click()
                    cy.wait(3000)
                    Common.canaleFromPopup()
                    getIFrame().find('#navigation-area:contains("Contratto"):visible')
                    cy.screenshot('Verifica Scheda Polizza Attiva', { capture: 'fullPage' }, { overwrite: true })
                    this.back()
                }
            }
        })
    }

    /**
     * Verifica la presenza dei preventivi
     */
    static checkPreventivi() {
        cy.screenshot('Verifica Preventivi', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Preventivi")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede Preventivi')
            else {
                cy.get('app-wallet-quotations').should('be.visible')
                cy.get('app-contract-card').should('be.visible')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.wait(10000)
                cy.get('app-contract-card').first().click()
                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('digitalAgencyLink')) {
                        req.alias = 'gqlDigitalAgencyLink'
                    }
                })
                Common.canaleFromPopup()
                cy.wait('@gqlDigitalAgencyLink', { timeout: 40000 })
                cy.wait(10000)
                getIFrame().find('#casella-ricerca').should('exist').and('be.visible').and('contain.text', 'Cerca')
                cy.screenshot('Verifica Preventivo', { capture: 'fullPage' }, { overwrite: true })
                this.back()
            }

        })
    }

    /**
     * Verifica la presenza delle proposte
     */
    static checkProposte() {
        cy.screenshot('Verifica Proposte', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Proposte")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede Proposte')
            else {
                cy.get('lib-da-link').should('be.visible')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('contract')) {
                        req.alias = 'gqlcontract'
                    }

                })
                cy.get('app-wallet-proposals').find('app-section-title').should('contain.text', 'Propost')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.get('app-contract-card').should('be.visible')
                cy.get('app-contract-card').first().then(() => {
                    cy.wait(10000)
                    cy.get('app-contract-card').first().click()
                    cy.intercept('POST', '**/graphql', (req) => {
                        if (req.body.operationName.includes('digitalAgencyLink')) {
                            req.alias = 'gqlDigitalAgencyLink'
                        }
                    })
                    Common.canaleFromPopup()
                    cy.wait('@gqlDigitalAgencyLink', { timeout: 40000 }).then((interception) => {
                        expect(interception.response.statusCode).to.be.eq(200);
                    });

                    getIFrame().find('a:contains("Contratto"):visible', { timeout: 15000 })
                    cy.screenshot('Verifica Scheda Proposta', { capture: 'fullPage' }, { overwrite: true })
                    this.back()
                })
            }
        })

    }

    /**
     * Verifica la presenza delle polizze non in vigore
     */
    static checkNonInVigore() {
        cy.screenshot('Verifica Non in Vigore', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Polizze")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede Polizze')
            else {
                cy.get('lib-da-link').should('be.visible')
                cy.get('lib-filter-button-with-modal').should('be.visible')

                cy.get('app-wallet-inactive-contracts').should('be.visible').then(($contract) => {

                    var firstCheck = $contract.find(':contains("Polizze attive")').is(':visible')
                    var secondCheck = $contract.find(':contains("Polizza attiva")').is(':visible')
                    if (firstCheck || secondCheck) {
                        assert.isTrue(true, 'corretto')
                        cy.log(firstCheck)
                        cy.log(secondCheck)
                    }
                })

                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.wait(5000)
                cy.get('app-contract-card').should('be.visible').first().click()
                Common.canaleFromPopup()
                cy.wait(10000)
                getIFrame().find('#navigation-area').should('be.visible').and('contain.text', '« Uscita')
                cy.screenshot('Verifica Scheda Non in Vigore', { capture: 'fullPage' }, { overwrite: true })
                this.back()
            }
        })
    }

    /**
     * Verifica la presenza dei sinistri
     */
    static checkSinistri() {
        cy.screenshot('Verifica Sinistri', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Sinistri")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede Sinistri')
            else {
                cy.get('lib-da-link').should('be.visible')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.get('app-wallet-claims').find('app-section-title').should('contain.text', 'Sinistr')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.get('app-claim-card').first()
                    .find('app-contract-context-menu > nx-icon').click()

                cy.get('.cdk-overlay-container').find('button').contains('Consulta sinistro').click()
                getIFrame().find('a[class="active"]').should('contain.text', 'Dettaglio del Sinistro')
                cy.screenshot('Verifica Scheda Sinistri', { capture: 'fullPage' }, { overwrite: true })
                this.back()
            }
        })
    }

    /**
     * 
     * @param {string} subTab - nome di una subtab
     * ("Polizze attive")
     */
    static clickSubTab(subTab) {
        cy.get('nx-tab-header').scrollIntoView().contains(subTab)
            .scrollIntoView().click({ force: true })
        // ! Disattivo la visualizzazione elenco lista 

        cy.get('app-wallet-list-toggle-button').should('be.visible').find('div[class^="icon"]').then(($iconList) => {
            if ($iconList.hasClass('icon open'))
                cy.get('app-wallet-list-toggle-button').find('nx-icon').click()
        })
    }

    /**
     * Filtraggio Polizze estratte in base ai filtri passati
     * @param {String} lob a scelta tra Motor,Rami vari, Vita, Allianz 1 e Allianz Ultra
     * @param {String} stato opzionale, a scelta tra Da incassare, Sostituzione, Annullata, Bloccata, Bloccata Parz., Sospesa
     */
    static filtraPolizze(lob, stato = '') {
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('contract')) {
                req.alias = 'gqlcontract'
            }

        })

        cy.get('lib-filter-button-with-modal').find('nx-icon[name="filter"]').click()
        cy.get('lib-modal-container').should('be.visible').within(() => {
            //Stato della polizza (opzionale)
            if (stato !== '')
                cy.contains(stato).click()

            //Lob della polizza
            cy.contains(lob).click()
        })

        cy.wait(1000);

        cy.get('.footer').find('button').contains('applica').click()
        cy.wait('@gqlcontract', { timeout: 30000 })
    }

    /**
     * 
     * @param {string} numberPolizza 
     * @param {string} typeAnnullamento : tipo di annullamento("Sospesa",)
     */
    static clickAnnullamento(numberPolizza, typeAnnullamento) {
        cy.get('app-contract-card').should('be.visible')
        cy.get('lib-da-link[calldaname]').contains(numberPolizza).first()
            .parents('lib-da-link[calldaname]').as('polizza')
        cy.log(numberPolizza)
        // Click tre puntini dalla prima polizza
        cy.get('@polizza').should('exist').then(($contract) => {
            cy.wrap($contract)
                .find('app-contract-context-menu').find('nx-icon').click()
        })

        // Click Link Annullamento
        cy.get('.cdk-overlay-container').should('contain.text', 'Annullamento').within(($overlay) => {
            cy.get('button').should('be.visible')
            cy.wrap($overlay).find('button:contains("Annullamento")').click()
            cy.wait(2000)
        })
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('postAuto');

        cy.intercept(/cdnjs.cloudflare.com/, 'ignore').as('cdnjs')

        Common.canaleFromPopup()
        cy.wait('@postAuto', { timeout: 120000 });

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.contains(typeAnnullamento).first().should('be.visible').click()
        })
    }

    /**
     * Verifico che la polizza non sia presente
     * @param {string} numberPolizza : numero della polizza 
     */
    static checkPolizzaIsNotPresentOnPolizzeAttive(numberPolizza) {
        cy.get('app-wallet-active-contracts').should('be.visible').then(($wallet) => {
            const checkCard = $wallet.find('lib-da-link[calldaname]').is(':visible')
            if (checkCard) {
                cy.log('Sono presenti')
                cy.get('lib-da-link[calldaname]').as('polizze')
                cy.get('@polizze').should('be.visible')
            } else {
                cy.wait(3000)
            }
        })
        var check = true
        const loop = () => {
            cy.wait(2000)
            var loopCheck = false
            cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
                const container = $container.find(':contains("Il cliente non possiede Polizze attive")').is(':visible')
                if (container) {
                    startTime()
                    loopCheck = false
                    assert.isTrue(true, 'Cliente non possiede Polizze')
                } else {
                    cy.get('lib-da-link[calldaname]').should('be.visible').then(($card) => {

                        var checkStatus = $card.find(':contains("' + numberPolizza + '")').is(':visible')
                        cy.log('Polizza non presente CORRETTO a false -> ' + checkStatus)

                        if (checkStatus == false) {
                            startTime()
                            cy.get('lib-da-link[calldaname]').should('not.include.text', numberPolizza)

                            loopCheck = false
                        } else {
                            if (check)
                                startTime()
                            check = false
                            loopCheck = true

                        }
                    })

                    cy.get('body').then(() => {
                        if (loopCheck) {

                            cy.contains('DETTAGLIO ANAGRAFICA').click()
                            cy.contains('PORTAFOGLIO').click()
                            loop()
                        }
                    })
                }
            })

        }
        loop()

        function startTime() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            // add a zero in front of numbers<10
            m = checkTime(m);
            s = checkTime(s);
            // var t = setTimeout(function () { startTime() }, 500);
            console.log(h + ":" + m + ":" + s)

        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }

    /**
     * Verifica che la polizza specificata sia presente su "Polizze attive"
     * @param {string} numberPolizza : numero della polizza 
     */
    static checkPolizzaIsPresentOnPolizzeAttive(numberPolizza) {
        cy.get('lib-da-link[calldaname]').as('polizza')

        cy.get('@polizza').should('be.visible')

        var check = true
        const loop = () => {
            var loopCheck = false
            cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
                const container = $container.find(':contains("Il cliente non possiede Polizze attive")').is(':visible')
                if (container) {
                    startTime()
                    loopCheck = false
                    assert.isTrue(true, 'Cliente non possiede Polizze')
                } else {
                    cy.get('@polizza').should('be.visible').then(($card) => {

                        var checkStatus = $card.find(':contains("' + numberPolizza + '")').is(':visible')

                        if (checkStatus) {
                            startTime()
                            cy.get('@polizza').should('include.text', numberPolizza)

                            loopCheck = false
                        } else {
                            if (check)
                                startTime()
                            check = false
                            loopCheck = true

                        }
                    })

                    cy.get('body').then(() => {
                        if (loopCheck) {
                            cy.contains('DETTAGLIO ANAGRAFICA').click()
                            cy.contains('PORTAFOGLIO').click()
                            loop()
                        }
                    })
                }
            })

        }
        loop()

        function startTime() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            // add a zero in front of numbers<10
            m = checkTime(m);
            s = checkTime(s);
            // var t = setTimeout(function () { startTime() }, 500);
            console.log(h + ":" + m + ":" + s)

        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }

    static checkPolizzaAttivaLite(numberPolizza) {
        cy.get('app-client-wallet').should('exist')
            .find('nx-tab-header').should('be.visible').scrollIntoView()
            .then(($body) => {
                if ($body.find('div:contains("Polizze attive")')
                    .parent('button[class*="active"]').is(':visible')) {
                    cy.log("portafoglio polizze attive già aperto")
                }
                else {
                    cy.log("Apertura portafoglio polizze attive")
                    $body.find('div:contains("Polizze attive")').trigger('click')
                }
            })

        this.ordinaPolizze("Numero contratto")

        cy.get('app-wallet-active-contracts').should('exist')
            .find('[ngclass="contract-number"]:contains(' + numberPolizza + ')')
            .should('be.visible')
    }

    /**
     * Verifico che la pollizza sia presente su "Non in Vigore"
     * @param {string} numberPolizza : numero della polizza
     */
    static checkPolizzaIsPresentOnNonInVigore(numberPolizza, messaggio = "4 - Vendita / conto vendita") {
        cy.get('lib-da-link[calldaname]').as('polizza')

        cy.get('@polizza').should('be.visible')
        cy.contains('DETTAGLIO ANAGRAFICA').as('dettaglio')
        cy.contains('PORTAFOGLIO').as('portafoglio')
        cy.get('button').contains('Non in vigore').as('nonInVigore')

        var check = true
        const loop = () => {
            var loopCheck = false

            cy.get('@polizza').should('be.visible').then(($card) => {
                var checkStatus = $card.find(':contains("' + numberPolizza + '")').is(':visible')

                if (checkStatus) {
                    startTime()
                    cy.get('@polizza').contains(numberPolizza).first()
                        .parents('lib-da-link[calldaname]').should('be.visible').within(($card) => {
                            const checkBadge = $card.find('nx-badge:contains("TITOLI DA INCASSARE")').is(':visible')
                            if (checkBadge)
                                this.Incasso()
                            else {
                                cy.get('nx-badge').should('contain.text', 'Non in vigore')
                                cy.get('nx-badge').invoke('attr', 'aria-describedby').then(($described) => {
                                    cy.document().its('body').find('#cdk-describedby-message-container').find('#' + $described)
                                        .should('include.text', messaggio)
                                })
                            }
                        })

                    loopCheck = false
                } else {
                    if (check)
                        startTime()
                    check = false
                    loopCheck = true

                }
            })


            cy.get('body').then(() => {
                if (loopCheck) {

                    cy.get('@dettaglio').click()
                    cy.get('@portafoglio').click()
                    cy.get('@nonInVigore').click()
                    loop()
                }
            })
        }
        loop()

        function startTime() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            // add a zero in front of numbers<10
            m = checkTime(m);
            s = checkTime(s);
            // var t = setTimeout(function () { startTime() }, 500);
            console.log(h + ":" + m + ":" + s)

        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }

    static Incasso() {
        cy.contains('Incassa').click()
        IncassoDA.accessoMezziPagam()

        cy.wrap(Cypress.$('html')).within(() => {
            cy.getIFrame()
            cy.get('@iframe').should('be.visible').within(() => {
                IncassoDA.ClickIncassa()
                cy.wait('@getIncasso', { requestTimeout: 60000 });
            })
        })
        cy.wait(10000)
        cy.wrap(Cypress.$('html')).within(() => {
            cy.getIFrame()
            cy.get('@iframe').should('be.visible').within(() => {
                IncassoDA.SelezionaIncassa('Contanti')
            })
        })
        cy.wait(10000)
        cy.wrap(Cypress.$('html')).within(() => {
            cy.getIFrame()
            cy.get('@iframe').should('be.visible').within(() => {
                IncassoDA.TerminaIncasso(true)
            })
        })
    }

    /**
     * Verifica che la poliza sia in stato di "Sospesa"
     * @param {string} currentCustomerNumber : url del client specifico
     * @param {string} numberPolizza : numero della polizza
     */
    static checkPolizzaIsSospesa(numberPolizza) {

        cy.get('lib-da-link[calldaname]').contains(numberPolizza).first().as('polizza')

        cy.get('@polizza').should('be.visible')
        cy.contains('DETTAGLIO ANAGRAFICA').as('dettaglio')
        cy.contains('PORTAFOGLIO').as('portafoglio')

        // Faccio il loop finchè non riaggiorna la pagina mostrando il tooltip SOSPESa
        var check = true
        const loop = () => {
            var loopCheck = false
            cy.get('@polizza')
                .parents('lib-da-link[calldaname]').should('be.visible').within(() => {
                    cy.get('[ngclass="top-card-grid"]').as('stato')
                    cy.get('@stato').then(($stato) => {
                        var checkStatus = $stato.find(':contains("SOSPESA")').is(':visible')

                        if (checkStatus) {
                            startTime()

                            cy.get('app-contract-status-badge').should('contain.text', 'SOSPESA')
                            cy.document().its('body').find('#cdk-describedby-message-container').then((textSospesa) => {
                                var checkSenza = '30 - Sospensione senza integrazione';
                                var checkNuova = 'Nuova sospensione (senza integrazione) 1';
                                if (textSospesa.text().includes('30 - Sospensione senza integrazione') ||
                                    textSospesa.text().includes('Nuova sospensione (senza integrazione) 1'))
                                    assert.isTrue(true, 'tooltip corretto')
                                else
                                    assert.fail(textSospesa.text() + ' ERRORE')
                            })
                            loopCheck = false
                        } else {
                            if (check)
                                startTime()
                            check = false
                            loopCheck = true

                        }
                    })
                })

            cy.get('body').then(() => {
                if (loopCheck) {

                    cy.get('@dettaglio').click()
                    cy.get('@portafoglio').click()
                    loop()
                }
            })
        }
        loop()

        function startTime() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            // add a zero in front of numbers<10
            m = checkTime(m);
            s = checkTime(s);
            // var t = setTimeout(function () { startTime() }, 500);
            console.log(h + ":" + m + ":" + s)

        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }

    /**
     * Verifica la presenza di una label associata ad un oggetto identificato dal 
     * suo locator 
     * @param {string} locator : attribute identify 
     * @param {string} label : text displayed
     */
    static checkObj_ByLocatorAndText(locator, label) {
        cy.get(locator).should('be.visible')
            .then(($val) => {
                expect(Cypress.dom.isJquery($val), 'jQuery object').to.be.true
                let txt = $val.text().trim()
                if (txt.includes(label)) {
                    cy.log('>> object with label: "' + label + '" is defined')
                } else
                    assert.fail('object with label: "' + label + '" is not defined')
            })
        cy.wait(1000);
    }


    /**
     * Esegui "storno Annullamento" della polizza specificata
     * @param {string} numberPolizza : numero della polliza 
     */
    static clickStornoAnnullamento(numberPolizza) {
        cy.get('app-contract-card').should('be.visible')
        cy.get('lib-da-link[calldaname]').contains(numberPolizza).first()
            .parents('lib-da-link[calldaname]').as('polizza')
        // Click tre puntini dalla prima polizza
        cy.get('@polizza').should('exist').then(($contract) => {
            cy.wrap($contract)
                .find('app-contract-context-menu').find('nx-icon').click()
        })

        // Click Link Storno annullamento 
        cy.get('.cdk-overlay-container').should('contain.text', 'Storno annullamento').within(($overlay) => {
            cy.get('button').should('be.visible')
            cy.wrap($overlay).find('button:contains("Storno annullamento")').click()
        })
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('postAuto');

        Common.canaleFromPopup()
        cy.wait('@postAuto', { timeout: 60000 });

        cy.getIFrame()
        cy.get('@iframe').should('be.visible').within(() => {
            cy.wait(5000)

            cy.get('#btnStorno').should('exist').and('be.visible').click()
            cy.wait(5000)
            cy.get('div[role="dialog"]').then(($form) => {
                const checkFormVisible = $form.find(':contains("Lo storno è stato eseguito ma si è verificato un errore in fase di invio mail della documentazione.")').is(':visible')
                if (checkFormVisible) {
                    cy.contains('Ok').click()
                    cy.wrap($form).should('not.be.visible')
                } else
                    cy.get('div[class="messaggioAnnullamenti"]').should('exist').and('be.visible')
                        .and('contain.text', 'Storno eseguito correttamente.')

            })


            cy.get('input[title="Home"]').should('be.visible').click()
            cy.wait(10000)
        })
    }

    static checkTooltipStopDrive(numberPolizza) {
        cy.get('lib-da-link[calldaname]').contains(numberPolizza).first().as('polizza')

        cy.get('@polizza').should('be.visible')
        cy.contains('DETTAGLIO ANAGRAFICA').as('dettaglio')
        cy.contains('PORTAFOGLIO').as('portafoglio')

        // Faccio il loop finchè non riaggiorna la pagina mostrando il tooltip SOSPESa
        cy.get('@polizza')
            .parents('lib-da-link[calldaname]').should('be.visible').within(() => {
                cy.get('[ngclass="top-card-grid"]').as('stato')
                cy.get('@stato').then(($stato) => {

                    cy.get('app-contract-status-badge').should('contain.text', 'IN ANNULLAMENTO')
                    cy.document().its('body').find('#cdk-describedby-message-container').then((textStop) => {
                        if (textStop.text().includes('30 - Sospensione stop and drive'))
                            assert.isTrue(true, 'tooltip corretto')
                        else
                            assert.fail(textSospesa.text() + ' ERRORE')
                    })

                })
            })
    }

    /**
     * todo: modificare gli if con uno switch e separare il controllo popup canale
     * Apre il menù opzioni del contratto e seleziona la voce indicata 
     * @param {string} nContratto 
     * @param {json} voce
     * @param {boolean} checkPage se true, verifica atterraggio pagina (false by default)
     */
    static menuContratto(nContratto, voce, checkPage = false) {
        //cerca il riquadro del contratto e apre il menù contestuale
        cy.get('.contract-number').contains(nContratto)
            .parents('.top-card-grid').find('app-contract-context-menu')
            .children('nx-icon').click()

        cy.wait(1000);

        //Effetuiamo il click nel sotto menu in determinati casi
        if (voce.includes('Sostituzione'))
            cy.get('[class*="transformContextMenu"]').should('be.visible')
                .contains('Sostituzione/Riattivazione').click()
        else if (voce.includes('Reperibilità'))
            cy.get('[class*="transformContextMenu"]').should('be.visible')
                .contains('Funzioni anagrafiche').click()
        else if (voce.includes('Cessione') || voce.includes('Modifica tipologia veicolo') || voce.includes('Allineamento proprietario contraente'))
            cy.get('[class*="transformContextMenu"]').should('be.visible')
                .contains('Altri casi assuntivi').click()
        else if (voce.includes('Tecnologica') || voce.includes('Perizia Kasko') || voce.includes('Duplicati certificato e carta verde') || voce.includes('Stampa attestato di rischio') || voce.includes('Ristampa certificato in giornata') || voce.includes('Revoca di disdetta o recesso')) {
            let re = new RegExp("\^ Gestione \$")
            cy.get('[class*="transformContextMenu"]').should('be.visible')
                .contains(re).click()
        }
        else if (voce.includes('Denuncia sinistro'))
            cy.get('[class*="transformContextMenu"]') //.should('be.visible')
                .contains('Sinistri').click()


        cy.get('[class*="transformContextMenu"]').should('be.visible')
            .contains(voce).click({ force: true }) //seleziona la voce dal menù

        //Verifica eventuale presenza del popup di disambiguazione
        Common.canaleFromPopup()

        if (checkPage)
            this.checkPage(voce)
    }

    /**
     * Apre il menù contestuale della polizza nella visualizzazione 'Lista' e seleziona la voce indicata
     * @param {string} nContratto 
     * @param {fixture} voce 
     */
    static menuContrattoLista(nContratto, voce) {
        //cerca il riquadro del contratto e apre il menù contestuale
        cy.get('table[class*="contracts-table"]').contains(nContratto)
            .parents('tr[class^="nx-table-row"]').find('app-contract-context-menu')
            .children('nx-icon').click()

        //cy.wait(200);

        cy.get('[class*="transformContextMenu"]').should('be.visible')
            .contains(voce).click({ force: true }) //seleziona la voce dal menù
        cy.wait(500);

        // .loading-spinner | loading-container nx-image--auto
        cy.get('[class="loading-spinner"]').should('not.exist').wait(300)
    }

    static checkAmbiti(nContratto, ambiti) {
        this.menuContratto(nContratto, menuPolizzeAttive.mostraAmbiti) //apre popup ambiti del contratto
        cy.get('nx-modal-container').should('be.visible')
            .find('[class="modal-title"]').contains('Ambiti del contratto')
            .parents('app-modular-contract').find('[class="category"]').each(($ambiti, index, $list) => {
                expect($ambiti).to.contain(ambiti[index])
                cy.log("ambito " + ambiti[index] + " presente")
            }) //verifica che gli ambiti indicati siano presenti
        cy.get('nx-modal-container').should('be.visible')
            .find('[aria-label="Close dialog"]').click() //chiude popup
    }

    /**
     * Verifica atterraggio alla pagina
     * @param {string} page - Nome della pagina 
     */
    static checkPage(page) {

        //#region Intercept
        cy.intercept({
            method: 'POST',
            url: /NGRA2013/
        }).as('NGRA2013')

        cy.intercept({
            method: 'POST',
            url: /Conguagli_AD/
        }).as('conguagliAD')

        cy.intercept({
            method: 'POST',
            url: /IncassoDA/
        }).as('incassoDA')

        cy.intercept({
            method: 'POST',
            url: /GestioneAnnullamentiDA/
        }).as('gestioneAnnullamentiDA')

        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('postAuto')

        cy.intercept({
            method: 'POST',
            url: /Appendici_AD/
        }).as('appendiciAD')

        cy.intercept({
            method: 'POST',
            url: /DuplicatiDA/
        }).as('duplicatiDA')

        cy.intercept({
            method: 'POST',
            url: /GestioneRevocheDA/
        }).as('gestioneRevocheDA')

        cy.intercept({
            method: 'GET',
            url: /dasinden/
        }).as('dasinden')

        cy.intercept({
            method: 'GET',
            url: /da/
        }).as('da')
        //#endregion

        if (page.includes('Sostituzione')) {
            cy.wait('@NGRA2013', { timeout: 120000 })

            cy.getIFrame()
            cy.get('@iframe').within(() => {
                cy.contains("Sostituzione in corso di contratto").should('exist').and('be.visible')
            })
        }
        else if (page.includes('Regolazione')) {
            cy.wait('@conguagliAD', { timeout: 120000 })

            cy.getIFrame()
            cy.get('@iframe').within(() => {
                cy.contains("Gestione Regolazione Premio Allianz").should('exist').and('be.visible')
            })
        }
        else if (page.includes('Quietanzamento')) {
            cy.wait('@incassoDA', { timeout: 120000 }).then(incassoDA => {
                expect(incassoDA.response.statusCode).to.be.eq(200);
                assert.isNotNull(incassoDA.response.body)
            })
        }
        else if (page.includes('Annullamento') || page.includes('Storno')) {
            cy.wait('@postAuto', { timeout: 120000 })
            cy.wait('@gestioneAnnullamentiDA', { timeout: 120000 })

            cy.getIFrame()
            cy.get('@iframe').within(() => {
                if (page === 'Annullamento') {
                    cy.contains("Gestione Annullamenti Allianz").should('exist').and('be.visible')
                    cy.contains("Lista annullamenti disponibili").should('exist').and('be.visible')
                }
                else if (page === 'Storno annullamento') {
                    cy.contains("Gestione Storni Allianz").should('exist').and('be.visible')
                    cy.get('#btnStorno').should('exist').and('be.visible')
                }
            })
        }
        else if (page.includes('Reperibilità')) {
            cy.wait('@appendiciAD', { timeout: 120000 })

            cy.getIFrame()
            cy.get('@iframe').within(() => {
                cy.contains("Appendici anagrafiche").should('exist').and('be.visible')
                cy.get('input[value="Recapito Quietanza"]').should('exist').and('be.visible')
            })
        }
        else if (page.includes('Cessione') || page.includes('Modifica tipologia veicolo') || page.includes('Allineamento proprietario contraente')) {
            cy.wait('@NGRA2013', { timeout: 120000 })
            cy.wait(3000)
            getIFrame().then($body => {
                if ($body.find('label:contains("proprietari e i contraenti allineati")').length > 0)
                    getIFrame().find('span:contains("Esci")').click()
                else if ($body.find('label:contains("consentita a scadenza annua")').length > 0)
                    getIFrame().find('span:contains("Esci")').click()
                else
                    getIFrame().find('input[value="› Avanti"]').should('exist').and('be.visible')
            })
        }
        else if (page.includes('Perizia Kasko')) {
            cy.wait('@postAuto', { timeout: 120000 })

            cy.getIFrame()
            cy.get('@iframe').within(() => {
                cy.get('#ctl00_pHolderMain1_btnConfermaPK').should('exist').and('be.visible')
            })
        }
        else if (page.includes('Stampa attestato di rischio')) {
            cy.wait(3000)
            getIFrame().then($body => {
                if ($body.find(':contains("Attestato di sede non presente")').length > 0)
                    getIFrame().find('input[id="btnExit"]').click()
                else {
                    cy.wait('@duplicatiDA', { timeout: 120000 })
                    cy.getIFrame()
                    cy.get('@iframe').within(() => {
                        cy.contains('Gestione Duplicati').should('exist').and('be.visible')
                        if (page !== 'Stampa attestato di rischio') {
                            cy.get('#btnMail').should('exist').and('be.visible')
                            cy.get('#btnStampa').should('exist').and('be.visible')
                        }
                    })
                }
            })
        }
        else if (page.includes('Duplicati') || page.includes('Ristampa certificato in giornata')) {
            cy.wait('@duplicatiDA', { timeout: 120000 })

            cy.getIFrame()
            cy.get('@iframe').within(() => {
                cy.contains('Gestione Duplicati').should('exist').and('be.visible')
                if (page !== 'Stampa attestato di rischio') {
                    cy.get('#btnMail').should('exist').and('be.visible')
                    cy.get('#btnStampa').should('exist').and('be.visible')
                }
            })
        }
        else if (page.includes('Revoca di disdetta o recesso')) {
            cy.wait('@gestioneRevocheDA', { timeout: 120000 })

            cy.getIFrame()
            cy.get('@iframe').within(() => {
                //? Per le polizze attive non è possibile proseguire con questo tipo di menu
                //? le polizze devono essere o nello stato DISDETTA DA ASSICURATO oppure ANNULLATA
                cy.contains('Non è possibile proseguire.').should('exist').and('be.visible')
            })
        }
        else if (page.includes('Denuncia sinistro')) {
            cy.wait('@dasinden', { timeout: 120000 })
            cy.wait(5000)
            getIFrameDenuncia().within(() => {
                cy.contains('Dati generali di denuncia').should('exist').and('be.visible')
                cy.contains('Avanti').should('exist').and('be.visible')

            })
        }
        else if (page.includes('Modifica fonte')) {
            cy.wait('@da', { timeout: 120000 })
            cy.wait(5000)
            getIframeModificaFonte().within(() => {
                cy.get('input[value="Esegui Variazione"]').should('exist').and('be.visible')
            })
        }

        //Verifichiamo la briciola di pane
        cy.get('lib-breadcrumbs').find('span[class="ng-star-inserted"]').should('exist').then(breadCrumb => {
            expect(breadCrumb.text().trim().replace(/\u00a0/g, ' ')).to.equal(page)
        })

        cy.screenshot('Verifica aggancio ' + page, { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        this.back()
    }

    /**
     * Ordina ordina la lista delle polizze secondo il criterio indicato
     * @param {string} ordinaPer 
     */
    static ordinaPolizze(ordinaPer) {
        cy.get('.filter-container').should('be.visible')
        cy.wait(1000);
        cy.get('.sorting-button').should('be.visible')
            .focus().click() //apre il menù per l'ordine delle polizze
        cy.wait(1000);

        cy.get('.lib-item-filters').contains(ordinaPer).click({ force: true }) //seleziona la voce dal menù
    }

    /**
     * Visualizza Lista 
     */
    static visualizzaLista() {
        cy.get('app-wallet-list-toggle-button').should('be.visible').find('div[class^="icon"]').then(($iconList) => {
            if ($iconList.hasClass('icon')) {
                cy.get('app-wallet-list-toggle-button').find('nx-icon').click()

                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('saveContractModalView')) {
                        req.alias = 'gqlModalView'
                    }
                })
                //cy.contains('DETTAGLIO ANAGRAFICA').click()

                cy.wait('@gqlModalView', { timeout: 30000 })
            }
        })
    }

    /**
     * apre il menù contestuale nella sezione 'ambiti del contratto'
     * @param {string} ambito 
     * @param {string} voce 
     */
    static menuContestualeAmbiti(ambito, voce) {
        //verifica che sia aperto il popup 'Ambiti del contratto'
        cy.get('.modal-title').children().contains('Ambiti del contratto')

        //cerca il riquadro dell'ambito indicato e apre il menù contestuale
        //todo verificare
        cy.get('nx-modal-container').should('be.visible')
            .find('nx-icon[class*="' + ambito + '"]')
            .parents('[class^="card"]').find('app-module-context-menu')
            .find('nx-icon').click()

        cy.wait(1000);

        cy.get('[class*="context-menu"]').should('be.visible')
            .find('button').contains(voce).click({ force: true }) //seleziona la voce dal menù
    }

    /**
    * Click pulsante "Incassa" da Portafoglio proposte
    * @param {string} nProposta  
    */
    static clickIncassaProposta(nProposta) {
        cy.get('div').contains(nProposta).should('exist')
            .parents('app-contract-card').should('have.length', 1)
            .find('button').contains('Incassa').should('exist').click()
    }

    /**
     * Attende il caricamento della pagina Clients Incassa
     */
    static caricamentoPaginaIncassa() {
        cy.log('***** CARICAMENTO PAGINA INCASSO DA CLIENTS *****')
        cy.intercept({
            method: 'POST',
            url: '**/Auto/IncassoDA/**'
        }).as('incasso')

        cy.wait('@incasso', { timeout: 60000 })
    }

    /**
    * Click pulsante "Incassa" da Clients/Incassa
    * @param {string} nProposta  
    */
    static clickIncassa() {
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('input[value="> Incassa"]')
                .should('be.visible').click()
        })
    }

    /**
     * Verifica che il preventivo specificato sia presente su "Preventivi"
     * @param {string} numberPreventivo : numero di preventivo 
     */
    static checkPreventivoIsPresentOnPreventivi(numberPreventivo) {
        cy.log("Verifica Preventivo: " + numberPreventivo)
        Portafoglio.visualizzaLista()
        cy.get('table[class="nx-table contracts-table ng-star-inserted"]').should('exist')
            .find('tbody').should('exist')
            .find('td').contains(numberPreventivo).should('have.length', 1)
    }

    /**
     * Seleziona Gestione dal menù tre puntini del preventivo specificato
     * @param {string} numberPreventivo : numero di preventivo 
     */
    static clickGestionePreventivo(numPrev) {
        Portafoglio.visualizzaLista()
        cy.wait(5000)
        //cy.pause()
        cy.get('table[class="nx-table contracts-table ng-star-inserted"]').should('exist')
            .find('span').contains(numPrev).should('have.length', 1).wait(500)
            .click()

        //cy.pause()


        /*
          .parents('tr').should('have.length', 1)
          .find('nx-icon[name="ellipsis-h"]').should('have.length', 1).wait(10000)
          .click({force: true}).wait(2000)
          //.parents('div[class="context-container"]').should('exist')
          //.scrollIntoView().click()
        cy.get('div[class="cdk-overlay-pane"]').should('exist')
          .find('button[ngclass="context-link"]').contains('Gestione').should('exist').click()
        //cy.get('button[ngclass="context-link"]').contains('Gestione').should('exist').click()
        */


        //Aspetta caricamento pagina Cruscotto Preventivi
        cy.log('***** CARICAMENTO PAGINA CRUSCOTTO PREVENTIVI *****')
        cy.intercept({
            method: 'POST',
            url: '**/Danni/CruscottoPreventivi_AD/**'
        }).as('cruscottoPreventivi')
        cy.wait('@cruscottoPreventivi', { timeout: 60000 });

        // Seleziona pulsante di Modifica Preventivo
        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.get('div[id="contenitore-dettagli"]').should('exist')
                .find('input[value="› Modifica Preventivo"]').should('be.enabled').click()
        })
    }
}
export default Portafoglio
//<img _ngcontent-yoe-c287="" class="loading-spinner" src="assets/images/spinner.gif" alt="Caricamento...">