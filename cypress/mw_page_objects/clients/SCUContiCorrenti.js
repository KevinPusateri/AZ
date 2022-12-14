/// <reference types="Cypress" />

import Common from "../common/Common";

const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]').iframe();

    let iframeSCU = cy
        .get('iframe[class="iframe-content ng-star-inserted"]')
        .its("0.contentDocument")
        .should("exist");

    return iframeSCU.its("body").should("not.be.undefined").then(cy.wrap);
};
const ibantools = require('ibantools');


class SCUContiCorrenti {

    static aggiungiContoCorrente(contoCorrente, client) {
        cy.contains("Aggiungi conto corrente").click();
        Common.canaleFromPopup()

        return new Cypress.Promise((resolve, reject) => {


            getSCU().find('span[aria-owns="tipoCoordinate_listbox"]').click()
            getSCU()
                .find("#tipoCoordinate_listbox > li").then((list) => {
                    var index = Math.floor(Math.random() * list.length);
                    cy.wrap(list).eq(index).then(textCoordinate => {
                        contoCorrente.coordinate = textCoordinate.text()
                    }).click();
                })
            var validIban = ibantools.isValidIBAN(contoCorrente.iban)
            if (validIban)
                getSCU().find('#iban').type(contoCorrente.iban)
            else
                assert.fail('Iban non valido')

            getSCU().find('#intestatario').type(client.name)
            contoCorrente.intestatario = client.name
            cy.wait(5000)
            var checkCod = this.checkCodiceFISCALE(contoCorrente.vat)
            if (checkCod)
                getSCU().find('#codFiscale').type(contoCorrente.vat)
            else
                assert.fail('codFiscale non valido')

            contoCorrente.intestatario = client.name
            getSCU().find('label[for="annoApertura"]').then((textAnnoApertura) => contoCorrente.annoApertura = textAnnoApertura.text())
            getSCU().within(() => {
                cy.get('h3:contains("Aggiunta di un nuovo conto corrente")').click()
                cy.screenshot('Verifica Conto corrente salvato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            })
            getSCU().find('#submit:contains("Salva")').click().wait(8000);
            resolve(contoCorrente);
        });
    }

    /**
    * Verifica contoCorrente creato sia presente
    * @param {string} contoCorrente - Object contoCorrente creato
    */
    static checkContoCorrente(contoCorrente) {
        cy.get('app-client-bank-accounts').find('app-client-bank-account-card').then((list) => {
            cy.screenshot('Verifica Conto corrente inserito', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            expect(list.text()).to.include(contoCorrente.iban)
        })
    }

    /**
     * Verifica contoCorrente non sia piu presente
     * @param {string} contoCorrente - Object contoCorrente
     */
    static checkContoCorrenteIsNotPresent(contoCorrente) {
        cy.get('app-client-bank-accounts').then(($list) => {
            const conto = $list.find(':contains("Non sono presenti conti correnti")').is(':visible')
            if (!conto)
                expect($list.text()).to.not.include(contoCorrente.iban)
            else{
                assert.isTrue(true,'Iban Eliminato')
                expect($list.text()).to.not.include(contoCorrente.iban)
            }
        })
        cy.screenshot('Verifica Conto corrente non presente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    static checkContoCorrenteModificato(conto) {
        cy.get('app-client-bank-accounts').find('app-client-bank-account-card').then((list) => {
            cy.screenshot('Verifica Conto corrente Modificato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            expect(list.text()).to.include(conto)
        })
    }

    /**
    * Verifica contoCorrente modificato
    * @param {string} contoCorrente - Object contoCorrente creato
    */
    static modificaConto(contoCorrente) {
        return new Cypress.Promise((resolve, reject) => {
            cy.get("app-client-bank-accounts").then((table) => {
                cy.wrap(table)
                    .find(
                        'app-client-bank-account-card:contains("' +
                        contoCorrente.iban +
                        '")'
                    )
                    .then((row) => {
                        cy.wrap(row)
                            .find('nx-icon')
                            .click()
                        cy.get('button[class^="nx-context-menu-item context-link"]').should('be.visible')
                        cy.get("lib-da-link").contains("Modifica conto corrente").click();
                        Common.canaleFromPopup()
                        cy.fixture('iban.json').then((data) => {
                            var indexScelta
                            do {
                                indexScelta = Math.floor(Math.random() * data.iban.length);
                            } while (data.iban[indexScelta] === contoCorrente.iban)
                            var newIban = data.iban[indexScelta]
                            var validIban = ibantools.isValidIBAN(newIban)
                            if (validIban) {
                                getSCU().find('#iban').clear().type(newIban).type('{enter}').wait(3000)
                                cy.screenshot('Modifica Conto Corrente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                                getSCU().find('#submit:contains("Salva"):visible').click().wait(8000)
                                resolve(newIban);
                            }
                            else
                                assert.fail('Iban non valido')
                        })

                    })


            })

        });

    }

    /**
    * Verifica contoCorrente eliminato
    * @param {string} contoCorrente - Object contoCorrente creato
    */
    static eliminaConto(contoCorrente) {
        cy.get("app-client-bank-accounts").then((table) => {
            cy.wrap(table)
                .find(
                    'app-client-bank-account-card:contains("' +
                    contoCorrente +
                    '")'
                )
                .then((row) => {
                    cy.wrap(row)
                        .find('nx-icon')
                        .click()
                        .wait(5000);
                    cy.get("lib-check-user-permissions").contains("Elimina conto corrente").click();
                    cy.screenshot('Verifica popup elimina Conto', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
                })
        })

        cy.get('nx-modal-container').within((container) => {
            cy.wrap(container).should('contain.text', 'Elimina conto corrente')
            cy.contains('Conferma').click().wait(3000)
        })
    }
    static checkCodiceFISCALE(vat) {
        var cf = vat.toUpperCase();
        var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
        if (!cfReg.test(cf))
            return false;
        var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
        var s = 0;
        for (var i = 1; i <= 13; i += 2)
            s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
        for (var i = 0; i <= 14; i += 2)
            s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
        if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0))
            return false;
        return true;
    }
} export default SCUContiCorrenti