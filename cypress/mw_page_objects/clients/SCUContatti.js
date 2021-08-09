/// <reference types="Cypress" />

const getSCU = () => {
  cy.get('iframe[class="iframe-content ng-star-inserted"]').iframe();

  let iframeSCU = cy
    .get('iframe[class="iframe-content ng-star-inserted"]')
    .its("0.contentDocument")
    .should("exist");

  return iframeSCU.its("body").should("not.be.undefined").then(cy.wrap);
};

class SCUContatti {
  //#region AggiungiContatto
  static aggiungiContattoFisso(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Fisso - indice -> 0
          this.addTipo(contatto, 0);

          // Principale: NO
          this.addPrincipale(contatto);

          //Pref. Int.
          this.addPrefInt(contatto);

          //Prefisso: numero random
          this.addPrefisso(contatto);

          this.addOrario(contatto);
          // Telefono: numero random
          this.addPhone(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);
          resolve(contatto);
        });
    });
  }
  static aggiungiContattoCellulare(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Cellulare - indice -> 1
          this.addTipo(contatto, 1);

          // Principale: NO
          this.addPrincipale(contatto);

          //Pref. Int.
          this.addPrefInt(contatto);

          //Prefisso: numero random
          this.addPrefisso(contatto);

          this.addOrario(contatto);
          // Telefono: numero random
          this.addPhone(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);
          resolve(contatto);
        });
    });
  }

  static aggiungiContattoFax(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Fax - indice -> 2
          this.addTipo(contatto, 2);

          // Principale: NO
          this.addPrincipale(contatto);

          //Pref. Int.
          this.addPrefInt(contatto);

          //Prefisso: numero random
          this.addPrefisso(contatto);

          // Orario
          this.addOrario(contatto);

          // Telefono: numero random
          this.addPhone(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);
          resolve(contatto);
        });
    });
  }
  static aggiungiContattoEmail(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Email - indice -> 3
          this.addTipo(contatto, 3);

          // Principale: NO
          this.addPrincipale(contatto);

          // Inserisci Email
          this.addEmail(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);;
          resolve(contatto);
        });
    });
  }
  static aggiungiContattoSitoWeb(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Sito Web - indice -> 4
          this.addTipo(contatto, 4);

          // Principale: NO
          this.addPrincipale(contatto);

          // Inserisci Sito Web
          this.addSitoWeb(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);;
          resolve(contatto);
        });
    });
  }

  static aggiungiContattoNumeroVerde(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Numero Verde - indice -> 5
          this.addTipo(contatto, 5);

          // Principale: NO
          this.addPrincipale(contatto);

          //Pref. Int.
          this.addPrefInt(contatto);

          //Prefisso: numero random
          this.addPrefisso(contatto);

          this.addOrario(contatto);

          // Telefono: numero random
          this.addPhone(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);
          resolve(contatto);
        });
    });
  }

  static aggiungiContattoFaxVerde(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Fax Verde - indice -> 6
          this.addTipo(contatto, 6);

          // Principale: NO
          this.addPrincipale(contatto);

          //Pref. Int.
          this.addPrefInt(contatto);

          //Prefisso: numero random
          this.addPrefisso(contatto);

          this.addOrario(contatto);

          // Telefono: numero random
          this.addPhone(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);
          resolve(contatto);
        });
    });
  }

  static aggiungiContattoUfficio(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: Ufficio - indice -> 7
          this.addTipo(contatto, 7);

          // Principale: NO
          this.addPrincipale(contatto);

          //Pref. Int.
          this.addPrefInt(contatto);

          //Prefisso: numero random
          this.addPrefisso(contatto);

          this.addOrario(contatto);

          // Telefono: numero random
          this.addPhone(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(5000);
          resolve(contatto);
        });
    });
  }

  static aggiungiContattoPEC(contatto) {
    cy.contains("Aggiungi contatto").click();
    return new Promise((resolve, reject) => {
      cy.task("nuovoContatto")
        .then((object) => {
          contatto = object;
          contatto.tipo = "";
          contatto.prefissoInt = "";
          contatto.prefisso = "";
          contatto.orario = "";
        })
        .then(() => {
          // Tipo: PEC - indice -> 8
          this.addTipo(contatto, 8);

          // Principale: NO
          this.addPrincipale(contatto);

          // Inserisci PEC
          this.addEmail(contatto);

          //click salva
          getSCU().find('#submit:contains("Salva")').click().wait(8000);
          resolve(contatto);
        });
    });
  }

  static aggiungiNuovoTelefonoPrincipale(contatto) {
    // Tipo: Cellulare - indice -> 1
    this.addTipo(contatto, 1);

    //Pref. Int.
    this.addPrefInt(contatto);

    //Prefisso: numero random
    this.addPrefisso(contatto);

    this.addOrario(contatto);
    // Telefono: numero random
    this.addPhone(contatto);

    //click salva
    getSCU().find('#submit:contains("Salva")').click();
  }

  static aggiungiNuovaMailPrincipale(contatto) {
    // Inserisci Email
    this.addEmail(contatto);

    //click salva
    getSCU().find('#submit:contains("Salva")').click();
  }
  //#endregion

  static eliminaContatto(contatto) {
    cy.get("app-client-other-contacts").then((table) => {
      if (contatto.tipo === "E-Mail" || contatto.tipo === "PEC") {
        cy.wrap(table)
          .find(
            'app-client-contact-table-row:contains("' +
            contatto.tipo +
            '"):contains("' +
            contatto.principale +
            '")'
          )
          .find(':contains("' + contatto.email + '")')
          .then((row) => {
            cy.wrap(row)
              .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
              .click()
              .wait(5000);
            cy.get("button").contains("Elimina contatto").click();
            cy.get('nx-modal-container').should('be.visible')
            cy.get('nx-modal-container').find('span:contains("Conferma"):visible').click()
            cy.wait(3000)
            if (!row.is(':visible'))
              assert.isTrue(true, 'contatto eliminato')
            else
              assert.fail('il contatto non è stato eliminato')
            // cy.wrap(table).find('app-client-contact-table-row').should('not.contain.text',contatto.tipo)
            // .and('not.contain.text',contatto.principale).and('not.contain.text', contatto.email)
          });
      } else if (contatto.tipo === "Sito Web") {
        cy.wrap(table)
          .find(
            'app-client-contact-table-row:contains("' +
            contatto.tipo +
            '"):contains("' +
            contatto.principale +
            '")'
          )
          .find(':contains("' + contatto.url + '")')
          .then((row) => {
            cy.wrap(row).as('row')
            cy.wrap(row)
              .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
              .click()
              .wait(5000);
            cy.get("button").contains("Elimina contatto").click();
            cy.get('nx-modal-container').should('be.visible')
            cy.get('nx-modal-container').find('span:contains("Conferma"):visible').click()
            cy.wait(3000)
            if (!row.is(':visible'))
              assert.isTrue(true, 'contatto eliminato')
            else
              assert.fail('il contatto non è stato eliminato')
            // cy.wrap(table).find('app-client-contact-table-row').should('not.contain.text',contatto.tipo)
            // .and('not.contain.text',contatto.principale).and('not.contain.text', contatto.url)
          })
      } else {
        cy.wrap(table)
          .find(
            'app-client-contact-table-row:contains("' +
            contatto.tipo +
            '"):contains("' +
            contatto.principale +
            '")'
          )
          .find(
            ':contains("' +
            contatto.prefissoInt +
            " " +
            contatto.prefisso +
            " " +
            contatto.phone +
            '")'
          )
          .then((row) => {
            console.log('row: '+ row)
            console.log('wrap: '+ cy.wrap(row))
            cy.wrap(row)
              .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
              .click()
              .wait(5000);
            cy.get("button").contains("Elimina contatto").click();
            cy.get('nx-modal-container').should('be.visible')
            cy.get('nx-modal-container').find('span:contains("Conferma"):visible').click()
            cy.wait(3000)
            debugger
            if (!row.is(':visible'))
              assert.isTrue(true, 'contatto eliminato')
            else
              assert.fail('il contatto non è stato eliminato')         
          })
      }
    })
  }

  //#region CheckModifica
  static modificaContatti(contatto) {
    return new Promise((resolve, reject) => {
      cy.get("app-client-other-contacts").then((table) => {
        if (contatto.tipo === "E-Mail" || contatto.tipo === "PEC") {
          cy.wrap(table)
            .find(
              'app-client-contact-table-row:contains("' +
              contatto.tipo +
              '"):contains("' +
              contatto.principale +
              '")'
            )
            .find(':contains("' + contatto.email + '")')
            .then((row) => {
              cy.wrap(row)
                .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
                .click()
                .wait(5000);
              cy.get("lib-da-link").contains("Modifica contatto").click();
              // getSCU()
              //   .find('span[aria-owns="principale_listbox"]')
              //   .should("include", contatto.principale);
              // getSCU()
              //   .find('span[aria-owns="tipoReperibilita_listbox"]')
              //   .should("include", contatto.tipo);
              // getSCU().find("#otherKind").should("include", contatto.email);
              cy.then(() => {
                cy.task("nuovoContatto").then((object) => {
                  contatto.email = object.email;
                  this.addEmail(contatto);
                  getSCU().find('#submit:contains("Salva")').click().wait(8000);
                  resolve(contatto);
                });
              });
            });
        } else if (contatto.tipo === "Sito Web") {
          cy.wrap(table)
            .find(
              'app-client-contact-table-row:contains("' +
              contatto.tipo +
              '"):contains("' +
              contatto.principale +
              '")'
            )
            .find(':contains("' + contatto.url + '")')
            .then((row) => {
              cy.wrap(row)
                .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
                .click()
                .wait(5000);
              cy.get("lib-da-link").contains("Modifica contatto").click();
              // getSCU()
              //   .find('span[aria-owns="principale_listbox"]')
              //   .should("include", contatto.principale);
              // getSCU()
              //   .find('span[aria-owns="tipoReperibilita_listbox"]')
              //   .should("include", contatto.tipo);
              // getSCU().find("#otherKind").should("include", contatto.url);
              cy.then(() => {
                cy.task("nuovoContatto").then((object) => {
                  contatto.url = object.url;
                  this.addSitoWeb(contatto);
                  getSCU().find('#submit:contains("Salva")').click().wait(8000);
                  resolve(contatto);
                });
              });
            });
        } else {
          cy.wrap(table)
            .find(
              'app-client-contact-table-row:contains("' +
              contatto.tipo +
              '"):contains("' +
              contatto.principale +
              '")'
            )
            .find(
              ':contains("' +
              contatto.prefissoInt +
              " " +
              contatto.prefisso +
              " " +
              contatto.phone +
              '")'
            )
            .then((row) => {
              cy.wrap(row)
                .find('nx-icon[class="nx-icon--s nx-icon--ellipsis-h icon"]')
                .click()
                .wait(5000);
              //   cy.intercept({
              //     method: 'GET',
              //     url: '**/daanagrafe/**'
              // }).as('danagrafe');
              cy.get("lib-da-link").contains("Modifica contatto").click();
              // cy.wait('@danagrafe', { requestTimeout: 40000 });
              // getSCU()
              //   .find('span[aria-owns="principale_listbox"]')
              //   .should("include", contatto.principale);
              // getSCU()
              //   .find('span[aria-owns="tipoReperibilita_listbox"]')
              //   .should("include", contatto.tipo);
              // getSCU()
              //   .find('span[aria-controls="tel-pref_listbox"]')
              //   .should("include", contatto.prefisso);
              // getSCU()
              //   .find('span[aria-controls="tel-pr-int_listbox"]')
              //   .should("include", contatto.prefissoInt);
              // getSCU().find("#tel-num").should("include", contatto.phone);
              const scelta = [
                "Prefisso",
                "Numero",
                "Orario",
                "Email",
                "Sito Web",
              ]; /*"PrefInt", (Tipo)*/
              var indexScelta = Math.floor(Math.random() * scelta.length);
              cy.then(() => {
                cy.task("nuovoContatto")
                  .then((object) => {
                    if (scelta[indexScelta] === "Numero")
                      contatto.phone = object.phone;
                    if (scelta[indexScelta] === "Email")
                      contatto.email = object.email;
                    if (scelta[indexScelta] === "Sito Web")
                      contatto.url = object.url;
                  })
                  .then(() => {
                    switch (scelta[indexScelta]) {
                      // case "PrefInt":
                      //   this.addPrefInt(contatto);
                      //   break;
                      case "Prefisso":
                        this.addPrefisso(contatto);
                        break;
                      case "Numero":
                        this.addPhone(contatto);
                        break;
                      case "Orario":
                        this.addOrario(contatto);
                        break;
                    }
                    getSCU()
                      .find('#submit:contains("Salva")')
                      .click()
                      .wait(5000);
                    resolve(contatto);
                  });
              });
            });
        }
      });
    });
  }
  //#endregion

  //#region Add methods

  static addPhone(contatto) {
    getSCU().find("#tel-num").clear().type(contatto.phone);
  }

  static addOrario(contatto) {
    getSCU().find('span[aria-owns="orario_listbox"]').click();
    getSCU()
      .find("#orario_listbox > li")
      .then((listOrario) => {
        var index = Math.floor(Math.random() * listOrario.length);
        console.log(index);
        console.log(listOrario);
        cy.wrap(listOrario)
          .eq(index)
          .then((orarioSelected) => {
            console.log(orarioSelected.text());
            cy.wrap(orarioSelected).click();
            switch (orarioSelected.text()) {
              case "Tutto il giorno":
                contatto.orario = "09:00 - 19:00";
                break;
              case "Solo la mattina":
                contatto.orario = "09:00 - 13:00";
                break;
              case "Sera":
                contatto.orario = "19:00 - 22:00";
                break;
              case "Pomeriggio":
                contatto.orario = "14:00 - 19:00";
                break;
              case "Reperibilità Oraria":
                getSCU().find('span[aria-owns="alle_listbox"]').click();
                getSCU()
                  .find("#alle_listbox > li")
                  .then((orarioAlle) => {
                    var indexOra = Math.floor(
                      Math.random() * orarioAlle.length
                    );
                    cy.wrap(orarioAlle)
                      .eq(indexOra)
                      .then((orarioAlleSelected) => {
                        getSCU()
                          .find('span[aria-owns="dalle_listbox"]')
                          .then((orarioDalle) => {
                            cy.wrap(orarioDalle)
                              .find('span[class="k-input"]')
                              .then((orarioDalleSelected) => {
                                contatto.orario =
                                  orarioDalleSelected.text() +
                                  " - " +
                                  orarioAlleSelected.text();
                              });
                          });
                      });
                    cy.wrap(orarioAlle).eq(indexOra).click();
                  });
                break;
            }
          });
      });
  }

  /**
   * Inserisci Prefisso
   * @param {Object} contatto - contatto Prefisso 
   */
  static addPrefisso(contatto) {
    getSCU().find('span[aria-controls="tel-pref_listbox"]').click();
    getSCU()
      .find("#tel-pref_listbox > li")
      .then((list) => {
        var index = Math.floor(Math.random() * list.length);
        cy.wrap(list)
          .eq(index)
          .then((numberText) => {
            contatto.prefisso = numberText.text();
          });
        cy.wrap(list).eq(index).click();
      });
  }

  /**
   * Inserisci Prefisso Internazionale
   * @param {Object} contatto - contatto Prefisso Internazionale  
   */
  //TODO: Randomizzarlo
  static addPrefInt(contatto) {
    getSCU().find('span[aria-controls="tel-pr-int_listbox"]').click();
    getSCU()
      .find('#tel-pr-int_listbox > li[data-offset-index="94"]')
      .then((list) => {
        contatto.prefissoInt = list.text();
      });
  }
  /**
   * Inserisci Tipo
   * @param {Object} contatto - contatto Tipo  
   */
  static addTipo(contatto, index) {
    getSCU().find('span[aria-owns="tipoReperibilita_listbox"]').click();
    getSCU()
      .find("#tipoReperibilita_listbox > li").eq(index).then((tipo) => {
        contatto.tipo = tipo.text();
        if (contatto.tipo === "Email") contatto.tipo = "E-Mail";
      }).click();
  }

  /**
   * Inserisci Orario 
   * @param {Object} contatto - contatto Orario  
   */
  static addOrario(contatto) {
    getSCU().find('span[aria-owns="orario_listbox"]').click();
    getSCU()
      .find("#orario_listbox > li")
      .then((listOrario) => {
        var index = Math.floor(Math.random() * listOrario.length);
        console.log(index);
        console.log(listOrario);
        cy.wrap(listOrario)
          .eq(index)
          .then((orarioSelected) => {
            console.log(orarioSelected.text());
            cy.wrap(orarioSelected).click();
            switch (orarioSelected.text()) {
              case "Tutto il giorno":
                contatto.orario = "09:00 - 19:00";
                break;
              case "Solo la mattina":
                contatto.orario = "09:00 - 13:00";
                break;
              case "Sera":
                contatto.orario = "19:00 - 22:00";
                break;
              case "Pomeriggio":
                contatto.orario = "14:00 - 19:00";
                break;
              case "Reperibilità Oraria":
                getSCU().find('span[aria-owns="alle_listbox"]').click();
                getSCU()
                  .find("#alle_listbox > li")
                  .then((orarioAlle) => {
                    var indexOra = Math.floor(
                      Math.random() * orarioAlle.length
                    );
                    cy.wrap(orarioAlle)
                      .eq(indexOra)
                      .then((orarioAlleSelected) => {
                        getSCU()
                          .find('span[aria-owns="dalle_listbox"]')
                          .then((orarioDalle) => {
                            cy.wrap(orarioDalle)
                              .find('span[class="k-input"]')
                              .then((orarioDalleSelected) => {
                                contatto.orario =
                                  orarioDalleSelected.text() +
                                  " - " +
                                  orarioAlleSelected.text();
                              });
                          });
                      });
                    cy.wrap(orarioAlle).eq(indexOra).click();
                  });
                break;
            }
          });
      });
  }

  /**
   * Inserisci Principale 
   * @param {Object} contatto - contatto Principale  
   */
  static addPrincipale(contatto) {
    getSCU().find('span[aria-owns="principale_listbox"]').click();
    getSCU()
      .find("#principale-list")
      .find('li:contains("No")')
      .then((principale) => {
        contatto.principale = principale.text();
      })
      .click();
  }

  /**
   * Inserisci Email 
   * @param {Object} contatto - contatto Principale  
   */
  static addEmail(contatto) {
    getSCU().find("#otherKind").clear().type(contatto.email);
  }

  /**
   * Inserisci Sito Web 
   * @param {Object} contatto - contatto Sito Web  
   */
  static addSitoWeb(contatto) {
    getSCU().find("#otherKind").clear().type(contatto.url);
  }
  //#endregion
}
export default SCUContatti