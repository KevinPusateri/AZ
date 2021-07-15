/// <reference types="Cypress" />


const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]').iframe();

    let iframeSCU = cy
        .get('iframe[class="iframe-content ng-star-inserted"]')
        .its("0.contentDocument")
        .should("exist");

    return iframeSCU.its("body").should("not.be.undefined").then(cy.wrap);
};

//ADD TFS
class SCUAltriIndirizzi {

    static aggiungiInidirizzo(indirizzo) {
        cy.contains("Aggiungi indirizzo").click();

        return new Promise((resolve, reject) => {
            //#region Ruolo
            getSCU().find('span[aria-owns="ruolo_listbox"]').click()
            getSCU().find('#ruolo_listbox > li').then((list) => {
                var index = Math.floor(Math.random() * list.length);
                cy.wrap(list).eq(index).then((numberText) => {
                    indirizzo.ruolo = numberText.text();
                });
                cy.wrap(list).eq(index).click();
            });
            //#endregion

            //#region Toponimo
            getSCU().find('span[aria-owns="toponomastica_listbox"]').click()
            getSCU().find('#toponomastica_listbox > li').then((list) => {
                cy.wrap(list).eq(0).then((numberText) => {
                    indirizzo.toponimo = numberText.text();
                });
                cy.wrap(list).eq(0).click();
            });
            //#endregion

            //#region Indirizzo
            getSCU().find('#indirizzo-via').type(indirizzo.address)
            //#endregion

            //#region Numero
            getSCU().find('#indirizzo-num').type(indirizzo.numero)
            //#endregion

            //#region Comune
            getSCU().find('#residenza-comune').type(indirizzo.comune)
            getSCU().find('#residenza-comune_listbox > li').first().click()
            //#endregion

            //#region CAP
            getSCU().find('span[aria-controls="cap_listbox"]').click()
            getSCU().find('#cap_listbox > li:contains("' + indirizzo.cap + '")').click()
            //#endregion

            getSCU().find('#submit:contains("Salva")').click().wait(30000);
            resolve(indirizzo);
        })

    }

    static modificaIndirizzo(indirizzo) {
        return new Promise((resolve, reject) => {

            cy.get("app-client-other-addresses").then((table) => {
                cy.wrap(table)
                    .find(
                        'app-client-address-table-row:contains("' +
                        indirizzo.address +'")')
                    .then((row) => {
                        cy.wrap(row)
                            .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
                            .click()
                            .wait(5000);
                    }).then(() => {
                        cy.get("lib-da-link").contains("Modifica indirizzo").click();

                        //#region Indirizzo
                        getSCU().find('#indirizzo-via').clear().type('XX SETTEMBRE')
                        indirizzo.address = 'XX SETTEMBRE'
                        //#endregion

                        //#region Comune
                        getSCU().find('#residenza-comune').clear()
                        getSCU().find('#residenza-comune').type('MILANO')
                        indirizzo.comune = 'MILANO'
                        getSCU().find('#residenza-comune_listbox > li').first().click()
                        //#endregion

                        //#region CAP
                        getSCU().find('span[aria-controls="cap_listbox"]').click().wait(1000)
                        getSCU().find('#cap_listbox > li:contains("20123")').click()
                        indirizzo.cap = '20123'
                        //#endregion

                        getSCU().find('#submit:contains("Salva")').click().wait(30000);
                        resolve(indirizzo);
                    })
            })
        })
    }

    /**
       * Verifica contoCorrete creato sia presente
       * @param {string} indirizzo - Object contoCorrete creato
       */
    static checkAltriIndirizzi(indirizzo) {
        cy.then(() => {
            cy.get('app-client-other-addresses').find('app-client-address-table-row').then((list) => {
                if (list.length > 0) {
                    expect(list.text()).to.include(indirizzo.address)
                    expect(list.text()).to.include(indirizzo.comune)
                    expect(list.text()).to.include(indirizzo.cap)
                } else
                    assert.fail('Nessun Indirizzo è stato inserito')
            })
        })
    }


    static eliminaIndirizzo() {
        cy.get("app-client-other-addresses").then((table) => {
            cy.wrap(table)
                .find('app-client-address-table-row:contains("' + indirizzo.address + '")'
                    .find(':contains("' + indirizzo.comune + '")')
                    .find(':contains("' + indirizzo.cap + '")')
                )
                .then((row) => {
                    cy.wrap(row)
                        .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
                        .click()
                        .wait(5000);
                    cy.get("lib-check-user-permissions").contains("Elimina indirizzo").click();
                })
        })

        cy.get('nx-modal-container').within((container) => {
            cy.wrap(container).should('contain.text', 'Elimina indirizzo')
            cy.contains('Elimina indirizzo').click()
        })
    }
}
export default SCUAltriIndirizzi