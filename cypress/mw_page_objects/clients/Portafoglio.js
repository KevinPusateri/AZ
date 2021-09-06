/// <reference types="Cypress" />

import Common from "../common/Common";
import { aliasQuery } from '../../mw_page_objects/common/graphql-test-utils.js'
import LandingRicerca from "../ricerca/LandingRicerca";
import SintesiCliente from "./SintesiCliente";
import DettaglioAnagrafica from "./DettaglioAnagrafica";

const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
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

    static back() {
        cy.get('a').contains('Clients').click()
    }

    static clickTabPortafoglio() {
        cy.intercept('POST', '**/graphql', (req) => {
            aliasQuery(req, 'contract')
        })

        cy.get('app-client-profile-tabs').should('be.visible').within(() => {
            cy.get('a').should('be.visible')
        })
        cy.contains('PORTAFOGLIO').click()
        cy.wait('@gqlcontract', { requestTimeout: 60000 });

    }

    static checkLinksSubTabs() {
        cy.get('nx-tab-header').should('be.visible')
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

    static checkPolizzeAttive() {
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Polizze attive")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede polizze')
            else {
                cy.get('app-wallet-active-contracts').should('be.visible').and('contain.text', 'Polizze attive')
                cy.get('lib-filters-sorting').should('be.visible')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.wait(3000)
                cy.get('app-contract-card').should('be.visible').first().click()
                cy.wait(3000)
                Common.canaleFromPopup()
                getIFrame().find('#navigation-area:contains("Contratto"):visible')
                this.back()
            }
        })
    }

    static checkPreventivi() {
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
                cy.wait('@gqlDigitalAgencyLink', { requestTimeout: 40000 })
                cy.wait(10000)
                getIFrame().find('#casella-ricerca').should('exist').and('be.visible').and('contain.text', 'Cerca')
                this.back()
            }
        })
    }

    static checkProposte() {
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Proposte")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede Proposte')
            else {
                cy.get('lib-da-link').should('be.visible')
                cy.get('lib-filters-sorting').should('be.visible')
                cy.intercept('POST', '**/graphql', (req) => {
                    if (req.body.operationName.includes('contract')) {
                        req.alias = 'gqlcontract'
                    }

                })
                cy.get('app-wallet-proposals').find('app-section-title').should('contain.text', 'Proposte')
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
                    cy.wait('@gqlDigitalAgencyLink', { requestTimeout: 40000 }).then((interception) => {
                        expect(interception.response.statusCode).to.be.eq(200);
                    });

                    getIFrame().find('#casella-ricerca').should('be.visible').and('contain.text', 'Cerca')
                    this.back()
                })
            }
        })

    }

    static checkNonInVigore() {
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Polizze")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede Polizze')
            else {
                cy.get('lib-da-link').should('be.visible')
                cy.get('lib-filters-sorting').should('be.visible')
                cy.get('app-wallet-inactive-contracts').find('app-section-title').should('contain.text', 'Polizze')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.wait(5000)
                cy.get('app-contract-card').should('be.visible').first().click()
                Common.canaleFromPopup()
                cy.wait(10000)
                getIFrame().find('#navigation-area').should('be.visible').and('contain.text', '« Uscita')
                this.back()
            }
        })
    }

    static checkSinistri() {
        cy.get('[class="cards-container"]').should('be.visible').then(($container) => {
            const container = $container.find(':contains("Il cliente non possiede Sinistri")').is(':visible')
            if (container)
                assert.isTrue(true, 'Cliente non possiede Sinistri')
            else {
                cy.get('lib-da-link').should('be.visible')
                cy.get('lib-filters-sorting').should('be.visible')
                cy.get('app-wallet-claims').find('app-section-title').should('contain.text', 'Sinistri')
                cy.get('lib-filter-button-with-modal').should('be.visible')
                cy.get('app-claim-card').first()
                    .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h ellipsis-icon"]').click()

                cy.get('.cdk-overlay-container').find('button').contains('Consulta sinistro').click()
                getIFrame().find('a[class="active"]').should('contain.text', 'Dettaglio del Sinistro')
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
        cy.get('nx-tab-header').contains(subTab).click({ force: true })
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

        cy.wait(1000)

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
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').contains(numberPolizza).first()
            .parents('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')
        cy.log(numberPolizza)
        // Click tre puntini dalla prima polizza
        cy.get('@polizza').should('exist').then(($contract) => {
            cy.wrap($contract)
                .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h ellipsis-icon"]').click()
        })

        // Click Link Annullamento
        cy.get('.cdk-overlay-container').should('contain.text', 'Annullamento').within(($overlay) => {
            cy.get('button').should('be.visible')
            cy.wrap($overlay).find('button:contains("Annullamento")').click()
        })
        cy.intercept({
            method: 'POST',
            url: '**/Auto/**'
        }).as('postAuto');

        Common.canaleFromPopup()
        cy.wait('@postAuto', { requestTimeout: 60000 });

        cy.getIFrame()
        cy.get('@iframe').within(() => {
            cy.contains(typeAnnullamento).first().should('be.visible').click()
        })
    }

    /**
     * Verifico che la polizza non sia presente
     * @param {string} numberPolizza : numero della polizza 
     */
    static checkPolizzaIsNotPresent(numberPolizza) {

        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

        cy.get('@polizza').should('be.visible')
        cy.contains('DETTAGLIO ANAGRAFICA').as('dettaglio')
        cy.contains('PORTAFOGLIO').as('portafoglio')

        var check = true
        const loop = () => {
            var loopCheck = false
            cy.get('@polizza').should('be.visible').then(($card) => {

                var checkStatus = $card.find(':contains("' + numberPolizza + '")').is(':visible')

                if (checkStatus == false) {
                    startTime()
                    cy.get('@polizza').should('not.include.text',numberPolizza)

                    loopCheck = false
                }
                else {
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
     * Verifico che la pollizza sia presente
     * @param {string} numberPolizza : numero della polizza
     */
    static checkPolizzaIsPresent(numberPolizza) {
        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').as('polizza')

        cy.get('@polizza').should('be.visible')
        cy.contains('DETTAGLIO ANAGRAFICA').as('dettaglio')
        cy.contains('PORTAFOGLIO').as('portafoglio')
        cy.get('button').contains('Non in vigore').as('nonInVigore')
        // cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').contains(numberPolizza).first().should('be.visible')

        var check = true
        const loop = () => {
            var loopCheck = false

            // TODO: Fare in modo che se compare polizze inesistenti sia anche corretto
            cy.get('@polizza').should('be.visible').then(($card) => {
                var checkStatus = $card.find(':contains("' + numberPolizza + '")').is(':visible')

                if (checkStatus) {
                    startTime()
                    cy.get('@polizza').contains(numberPolizza).first().should('be.visible').within(()=>{

                        cy.get('nx-badge').should('contain.text', 'Non in vigore')

                        cy.get('nx-badge').invoke('attr','aria-describedby').should('equal', 'cdk-describedby-message-6')
                        cy.document().its('body').find('#cdk-describedby-message-container')
                        .should('include.text', '4 - Vendita / conto vendita')
                    })

                    loopCheck = false
                }
                else {
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

    /**
     * 
     * @param {string} currentCustomerNumber : url del client specifico
     * @param {string} numberPolizza : numero della polizza
     */
    static checkPolizzaIsSospesa(currentCustomerNumber, numberPolizza) {

        cy.get('lib-da-link[calldaname="GENERIC-DETAILS"]').contains(numberPolizza).first().as('polizza')

        cy.get('@polizza').should('be.visible')
        cy.contains('DETTAGLIO ANAGRAFICA').as('dettaglio')
        cy.contains('PORTAFOGLIO').as('portafoglio')

        // Faccio il loop finchè non riaggiorna la pagina mostrando il tooltip SOSPESa
        var check = true
        const loop = () => {
            var loopCheck = false
            cy.get('@polizza')
                .parents('lib-da-link[calldaname="GENERIC-DETAILS"]').should('be.visible').within(() => {
                    cy.get('[ngclass="top-card-grid"]').as('stato')
                    cy.get('@stato').then(($stato) => {
                        var checkStatus = $stato.find(':contains("SOSPESA")').is(':visible')

                        if (checkStatus) {
                            startTime()

                            cy.get('app-contract-status-badge').should('contain.text', 'SOSPESA')
                            cy.document().its('body').find('#cdk-describedby-message-container')
                                .should('include.text', '30 - Nuova sospensione (senza integrazione)')
                            loopCheck = false
                        }
                        else {
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
}

export default Portafoglio