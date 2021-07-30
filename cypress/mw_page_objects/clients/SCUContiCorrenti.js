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

        return new Promise((resolve, reject) => {


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

            var checkCod = this.checkCodiceFISCALE(contoCorrente.vat)
            if (checkCod)
                getSCU().find('#codFiscale').type(contoCorrente.vat)
            else
                assert.fail('codFiscale non valido')

            contoCorrente.intestatario = client.name
            getSCU().find('label[for="annoApertura"]').then((textAnnoApertura) => contoCorrente.annoApertura = textAnnoApertura.text())

            getSCU().find('#submit:contains("Salva")').click().wait(4000);
            resolve(contoCorrente);
        });
    }

    /**
    * Verifica contoCorrente creato sia presente
    * @param {string} contoCorrente - Object contoCorrente creato
    */
    static checkContoCorrente(contoCorrente) {
        cy.get('app-client-bank-accounts').find('app-client-bank-account-card').then((list) => {
            console.log(list.text())
            expect(list.text()).to.include(contoCorrente.iban)
        })
    }

    /**
    * Verifica contoCorrente modificato
    * @param {string} contoCorrente - Object contoCorrente creato
    */
    static modificaConto(contoCorrente) {
        cy.get("app-client-bank-accounts").then((table) => {
            cy.wrap(table)
                .find(
                    'app-client-bank-account-card:contains("' +
                    contoCorrente.iban +
                    '")'
                )
                .then((row) => {
                    cy.wrap(row)
                        .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
                        .click()
                        .wait(5000);
                    cy.get("lib-check-user-permissions").contains("Modifica conto corrente").click();
                })
        })

        getSCU().find('#iban').should('contain.text', contoCorrente.iban)
        getSCU().find('span[class="k-dropdown-wrap k-state-default"] > span[class="k-input"]').should('contain.text', contoCorrente.coordinate)
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
                    contoCorrente.iban +
                    '")'
                )
                .then((row) => {
                    cy.wrap(row)
                        .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
                        .click()
                        .wait(5000);
                    cy.get("lib-check-user-permissions").contains("Elimina conto corrente").click();
                })
        })

        cy.get('nx-modal-container').within((container) => {
            cy.wrap(container).should('contain.text', 'Elimina conto corrente')
            cy.contains('Conferma').click()
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