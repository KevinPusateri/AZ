/// <reference types="Cypress" />


const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class SCUContatti {

    static aggiungiContattoFisso(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {

            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                // Tipo: Fisso
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(0).then((tipo) => {
                    contatto.tipo = tipo.text()
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                //Pref. Int.
                getSCU().find('span[aria-controls="tel-pr-int_listbox"]').click()
                getSCU().find('#tel-pr-int_listbox > li[data-offset-index="94"]').then((list) => {
                    contatto.prefissoInt = list.text()
                })


                //Prefisso: numero random
                getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
                getSCU().find('#tel-pref_listbox > li').then((list) => {
                    var index = Math.floor(Math.random() * list.length)
                    cy.log(index)
                    cy.wrap(list).eq(index).then(numberText => {
                        contatto.prefisso = numberText.text()
                    })
                    cy.wrap(list).eq(index).click()

                })

                getSCU().find('span[aria-owns="orario_listbox"]').click()
                getSCU().find('#orario_listbox > li').then((listOrario) => {
                    var index = Math.floor(Math.random() * listOrario.length)
                    console.log(index)
                    console.log(listOrario)
                    cy.wrap(listOrario).eq(index).then(orarioSelected => {
                        console.log(orarioSelected.text())
                        cy.wrap(orarioSelected).click()
                        switch (orarioSelected.text()) {
                            case 'Tutto il giorno':
                                contatto.orario = '09:00 - 19:00'
                                break;
                            case 'Solo la mattina':
                                contatto.orario = '09:00 - 13:00'
                                break;
                            case 'Sera':
                                contatto.orario = '19:00 - 22:00'
                                break;
                            case 'Pomeriggio':
                                contatto.orario = '14:00 - 19:00'
                                break;
                            case 'Reperibilità Oraria':
                                getSCU().find('span[aria-owns="alle_listbox"]').click()
                                getSCU().find('#alle_listbox > li').then((orarioAlle) => {
                                    var indexOra = Math.floor(Math.random() * orarioAlle.length)
                                    cy.wrap(orarioAlle).eq(indexOra).then(orarioAlleSelected => {
                                        getSCU().find('span[aria-owns="dalle_listbox"]').then((orarioDalle) => {
                                            cy.wrap(orarioDalle).find('span[class="k-input"]').then((orarioDalleSelected) => {
                                                contatto.orario = orarioDalleSelected.text() + ' - ' + orarioAlleSelected.text()
                                            })
                                        })
                                    })
                                    cy.wrap(orarioAlle).eq(indexOra).click()
                                })
                                break;
                        }
                    })

                })
                // Telefono: numero random
                getSCU().find('#tel-num').type(contatto.phone)
                cy.log(contatto.phone)

                //click salva
                getSCU().find('#submit:contains("Salva")').click().wait(4000)
                resolve(contatto)

            })
        })
    }
    static aggiungiContattoCellulare(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(1).then((tipo) => {
                    contatto.tipo = tipo.text()
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                //Pref. Int.
                getSCU().find('span[aria-controls="tel-pr-int_listbox"]').click()
                getSCU().find('#tel-pr-int_listbox > li[data-offset-index="94"]').then((list) => {
                    contatto.prefissoInt = list.text()
                })

                //Prefisso: numero random
                getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
                getSCU().find('#tel-pref_listbox > li').then((list) => {
                    var index = Math.floor(Math.random() * list.length)
                    cy.log(index)
                    cy.wrap(list).eq(index).then(numberText => {
                        contatto.prefisso = numberText.text()
                    })
                    cy.wrap(list).eq(index).click()
                })

                // Orario
                getSCU().find('span[aria-owns="orario_listbox"]').click()
                getSCU().find('#orario_listbox > li').then((listOrario) => {
                    var index = Math.floor(Math.random() * listOrario.length)
                    console.log(index)
                    console.log(listOrario)
                    cy.wrap(listOrario).eq(index).then(orarioSelected => {
                        console.log(orarioSelected.text())
                        cy.wrap(orarioSelected).click()
                        switch (orarioSelected.text()) {
                            case 'Tutto il giorno':
                                contatto.orario = '09:00 - 19:00'
                                break;
                            case 'Solo la mattina':
                                contatto.orario = '09:00 - 13:00'
                                break;
                            case 'Sera':
                                contatto.orario = '19:00 - 22:00'
                                break;
                            case 'Pomeriggio':
                                contatto.orario = '14:00 - 19:00'
                                break;
                            case 'Reperibilità Oraria':
                                getSCU().find('span[aria-owns="alle_listbox"]').click()
                                getSCU().find('#alle_listbox > li').then((orarioAlle) => {
                                    var indexOra = Math.floor(Math.random() * orarioAlle.length)
                                    cy.wrap(orarioAlle).eq(indexOra).then(orarioAlleSelected => {
                                        getSCU().find('span[aria-owns="dalle_listbox"]').then((orarioDalle) => {
                                            cy.wrap(orarioDalle).find('span[class="k-input"]').then((orarioDalleSelected) => {
                                                contatto.orario = orarioDalleSelected.text() + ' - ' + orarioAlleSelected.text()
                                            })
                                        })
                                    })
                                    cy.wrap(orarioAlle).eq(indexOra).click()
                                })
                                break;
                        }
                    })
                })
                getSCU().find('#tel-num').type(contatto.phone)
                cy.log(contatto.phone)
                // Telefono: numero random

                //click salva
                getSCU().find('#submit:contains("Salva")').click().wait(4000)
                resolve(contatto)

            })
        });
    }
    static aggiungiContattoFax(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                return new Promise((resolve, reject) => {
                    // Tipo: Fax
                    getSCU().contains('Seleziona...').click()
                    getSCU().find('#tipoReperibilita_listbox > li').eq(2).then((tipo) => {
                        contatto.tipo = tipo.text()
                    }).click()

                    // Principale: NO
                    getSCU().find('span[aria-owns="principale_listbox"]').click()
                    getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                        contatto.principale = principale.text()
                    }).click()

                    //Pref. Int.
                    getSCU().find('span[aria-controls="tel-pr-int_listbox"]').click()
                    getSCU().find('#tel-pr-int_listbox > li[data-offset-index="94"]').then((list) => {
                        contatto.prefissoInt = list.text()
                    })

                    //Prefisso: numero random
                    getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
                    getSCU().find('#tel-pref_listbox > li').then((list) => {
                        var index = Math.floor(Math.random() * list.length)
                        cy.log(index)
                        cy.wrap(list).eq(index).then(numberText => {
                            contatto.prefisso = numberText.text()
                        })
                        cy.wrap(list).eq(index).click()
                    })

                    getSCU().find('span[aria-owns="orario_listbox"]').click()
                    getSCU().find('#orario_listbox > li').then((listOrario) => {
                        var index = Math.floor(Math.random() * listOrario.length)
                        console.log(index)
                        console.log(listOrario)
                        cy.wrap(listOrario).eq(index).then(orarioSelected => {
                            console.log(orarioSelected.text())
                            cy.wrap(orarioSelected).click()
                            switch (orarioSelected.text()) {
                                case 'Tutto il giorno':
                                    contatto.orario = '09:00 - 19:00'
                                    break;
                                case 'Solo la mattina':
                                    contatto.orario = '09:00 - 13:00'
                                    break;
                                case 'Sera':
                                    contatto.orario = '19:00 - 22:00'
                                    break;
                                case 'Pomeriggio':
                                    contatto.orario = '14:00 - 19:00'
                                    break;
                                case 'Reperibilità Oraria':
                                    getSCU().find('span[aria-owns="alle_listbox"]').click()
                                    getSCU().find('#alle_listbox > li').then((orarioAlle) => {
                                        var indexOra = Math.floor(Math.random() * orarioAlle.length)
                                        cy.wrap(orarioAlle).eq(indexOra).then(orarioAlleSelected => {
                                            getSCU().find('span[aria-owns="dalle_listbox"]').then((orarioDalle) => {
                                                cy.wrap(orarioDalle).find('span[class="k-input"]').then((orarioDalleSelected) => {
                                                    contatto.orario = orarioDalleSelected.text() + ' - ' + orarioAlleSelected.text()
                                                })
                                            })
                                        })
                                        cy.wrap(orarioAlle).eq(indexOra).click()
                                    })
                                    break;
                            }
                        })
                    })
                    // Telefono: numero random
                    getSCU().find('#tel-num').type(contatto.phone)
                    cy.log(contatto.phone)

                    //click salva
                    getSCU().find('#submit:contains("Salva")').click().wait(4000)
                    resolve(contatto)
                })
            })
        });
    }
    static aggiungiContattoEmail(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                // Tipo: Email
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(3).then((tipo) => {
                    contatto.tipo = 'E-Mail'
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                // Inserisci Email
                getSCU().find('#otherKind').type(contatto.email)

                //click salva
                getSCU().find('#submit:contains("Salva")').click()
                resolve(contatto)
            })
        });
    }
    static aggiungiContattoSitoWeb(contatto) {

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                // Tipo: Sito Web
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(4).then((tipo) => {
                    contatto.tipo = tipo.text()
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                // Inserisci Url
                getSCU().find('#otherKind').type(contatto.url)

                //click salva
                getSCU().find('#submit:contains("Salva")').click()
                resolve(contatto)
            })
        });
    }

    static aggiungiContattoNumeroVerde(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                // Tipo: Numero Verde
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(5).then((tipo) => {
                    contatto.tipo = tipo.text()
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                //Pref. Int.
                getSCU().find('span[aria-controls="tel-pr-int_listbox"]').click()
                getSCU().find('#tel-pr-int_listbox > li[data-offset-index="94"]').then((list) => {
                    contatto.prefissoInt = list.text()
                })

                //Prefisso: numero random
                getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
                getSCU().find('#tel-pref_listbox > li').then((list) => {
                    var index = Math.floor(Math.random() * list.length)
                    cy.log(index)
                    cy.wrap(list).eq(index).then(numberText => {
                        contatto.prefisso = numberText.text()
                    })
                    cy.wrap(list).eq(index).click()
                })

                getSCU().find('span[aria-owns="orario_listbox"]').click()
                getSCU().find('#orario_listbox > li').then((listOrario) => {
                    var index = Math.floor(Math.random() * listOrario.length)
                    console.log(index)
                    console.log(listOrario)
                    cy.wrap(listOrario).eq(index).then(orarioSelected => {
                        console.log(orarioSelected.text())
                        cy.wrap(orarioSelected).click()
                        switch (orarioSelected.text()) {
                            case 'Tutto il giorno':
                                contatto.orario = '09:00 - 19:00'
                                break;
                            case 'Solo la mattina':
                                contatto.orario = '09:00 - 13:00'
                                break;
                            case 'Sera':
                                contatto.orario = '19:00 - 22:00'
                                break;
                            case 'Pomeriggio':
                                contatto.orario = '14:00 - 19:00'
                                break;
                            case 'Reperibilità Oraria':
                                getSCU().find('span[aria-owns="alle_listbox"]').click()
                                getSCU().find('#alle_listbox > li').then((orarioAlle) => {
                                    var indexOra = Math.floor(Math.random() * orarioAlle.length)
                                    cy.wrap(orarioAlle).eq(indexOra).then(orarioAlleSelected => {
                                        getSCU().find('span[aria-owns="dalle_listbox"]').then((orarioDalle) => {
                                            cy.wrap(orarioDalle).find('span[class="k-input"]').then((orarioDalleSelected) => {
                                                contatto.orario = orarioDalleSelected.text() + ' - ' + orarioAlleSelected.text()
                                            })
                                        })
                                    })
                                    cy.wrap(orarioAlle).eq(indexOra).click()
                                })
                                break;
                        }
                    })
                })
                // Telefono: numero random
                getSCU().find('#tel-num').type(contatto.phone)
                cy.log(contatto.phone)

                //click salva
                getSCU().find('#submit:contains("Salva")').click().wait(4000)
                resolve(contatto)
            })
        });
    }

    static aggiungiContattoFaxVerde(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                // Tipo: Fax Verde
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(6).then((tipo) => {
                    contatto.tipo = tipo.text()
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                //Pref. Int.
                getSCU().find('span[aria-controls="tel-pr-int_listbox"]').click()
                getSCU().find('#tel-pr-int_listbox > li[data-offset-index="94"]').then((list) => {
                    contatto.prefissoInt = list.text()
                })

                //Prefisso: numero random
                getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
                getSCU().find('#tel-pref_listbox > li').then((list) => {
                    var index = Math.floor(Math.random() * list.length)
                    cy.log(index)
                    cy.wrap(list).eq(index).then(numberText => {
                        contatto.prefisso = numberText.text()
                    })
                    cy.wrap(list).eq(index).click()
                })

                getSCU().find('span[aria-owns="orario_listbox"]').click()
                getSCU().find('#orario_listbox > li').then((listOrario) => {
                    var index = Math.floor(Math.random() * listOrario.length)
                    console.log(index)
                    console.log(listOrario)
                    cy.wrap(listOrario).eq(index).then(orarioSelected => {
                        console.log(orarioSelected.text())
                        cy.wrap(orarioSelected).click()
                        switch (orarioSelected.text()) {
                            case 'Tutto il giorno':
                                contatto.orario = '09:00 - 19:00'
                                break;
                            case 'Solo la mattina':
                                contatto.orario = '09:00 - 13:00'
                                break;
                            case 'Sera':
                                contatto.orario = '19:00 - 22:00'
                                break;
                            case 'Pomeriggio':
                                contatto.orario = '14:00 - 19:00'
                                break;
                            case 'Reperibilità Oraria':
                                getSCU().find('span[aria-owns="alle_listbox"]').click()
                                getSCU().find('#alle_listbox > li').then((orarioAlle) => {
                                    var indexOra = Math.floor(Math.random() * orarioAlle.length)
                                    cy.wrap(orarioAlle).eq(indexOra).then(orarioAlleSelected => {
                                        getSCU().find('span[aria-owns="dalle_listbox"]').then((orarioDalle) => {
                                            cy.wrap(orarioDalle).find('span[class="k-input"]').then((orarioDalleSelected) => {
                                                contatto.orario = orarioDalleSelected.text() + ' - ' + orarioAlleSelected.text()
                                            })
                                        })
                                    })
                                    cy.wrap(orarioAlle).eq(indexOra).click()
                                })
                                break;
                        }
                    })
                })
                // Telefono: numero random
                getSCU().find('#tel-num').type(contatto.phone)
                cy.log(contatto.phone)

                //click salva
                getSCU().find('#submit:contains("Salva")').click().wait(4000)
                resolve(contatto)
            })
        });
    }

    static aggiungiContattoUfficio(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                // Tipo: Ufficio
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(7).then((tipo) => {
                    contatto.tipo = tipo.text()
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                //Pref. Int.
                getSCU().find('span[aria-controls="tel-pr-int_listbox"]').click()
                getSCU().find('#tel-pr-int_listbox > li[data-offset-index="94"]').then((list) => {
                    contatto.prefissoInt = list.text()
                })

                //Prefisso: numero random
                getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
                getSCU().find('#tel-pref_listbox > li').then((list) => {
                    var index = Math.floor(Math.random() * list.length)
                    cy.log(index)
                    cy.wrap(list).eq(index).then(numberText => {
                        contatto.prefisso = numberText.text()
                    })
                    cy.wrap(list).eq(index).click()
                })

                getSCU().find('span[aria-owns="orario_listbox"]').click()
                getSCU().find('#orario_listbox > li').then((listOrario) => {
                    var index = Math.floor(Math.random() * listOrario.length)
                    console.log(index)
                    console.log(listOrario)
                    cy.wrap(listOrario).eq(index).then(orarioSelected => {
                        console.log(orarioSelected.text())
                        cy.wrap(orarioSelected).click()
                        switch (orarioSelected.text()) {
                            case 'Tutto il giorno':
                                contatto.orario = '09:00 - 19:00'
                                break;
                            case 'Solo la mattina':
                                contatto.orario = '09:00 - 13:00'
                                break;
                            case 'Sera':
                                contatto.orario = '19:00 - 22:00'
                                break;
                            case 'Pomeriggio':
                                contatto.orario = '14:00 - 19:00'
                                break;
                            case 'Reperibilità Oraria':
                                getSCU().find('span[aria-owns="alle_listbox"]').click()
                                getSCU().find('#alle_listbox > li').then((orarioAlle) => {
                                    var indexOra = Math.floor(Math.random() * orarioAlle.length)
                                    cy.wrap(orarioAlle).eq(indexOra).then(orarioAlleSelected => {
                                        getSCU().find('span[aria-owns="dalle_listbox"]').then((orarioDalle) => {
                                            cy.wrap(orarioDalle).find('span[class="k-input"]').then((orarioDalleSelected) => {
                                                contatto.orario = orarioDalleSelected.text() + ' - ' + orarioAlleSelected.text()
                                            })
                                        })
                                    })
                                    cy.wrap(orarioAlle).eq(indexOra).click()
                                })
                                break;
                        }
                    })
                })
                // Telefono: numero random
                getSCU().find('#tel-num').type(contatto.phone)
                cy.log(contatto.phone)

                //click salva
                getSCU().find('#submit:contains("Salva")').click().wait(4000)
                resolve(contatto)
            });
        });
    }

    static aggiungiContattoPEC(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            cy.task('nuovoContatto').then((object) => {
                contatto = object
                contatto.tipo = ""
                contatto.prefissoInt = ""
                contatto.prefisso = ""
                contatto.orario = ""
            }).then(() => {
                // Tipo: PEC
                getSCU().contains('Seleziona...').click()
                getSCU().find('#tipoReperibilita_listbox > li').eq(8).then((tipo) => {
                    contatto.tipo = tipo.text()
                }).click()

                // Principale: NO
                getSCU().find('span[aria-owns="principale_listbox"]').click()
                getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                    contatto.principale = principale.text()
                }).click()

                // Inserisci Email
                getSCU().find('#otherKind').type(contatto.email)

                //click salva
                getSCU().find('#submit:contains("Salva")').click()
                resolve(contatto)
            });
        });
    }


    static checkModificaContatti() {
        cy.then(() => {
            cy.get('app-client-other-contacts').then(()=>{

                // .find('app-client-contact-table-row:contains("'+contatto.tipo+'"):contains("'+contatto.principale+'")')
                //     .and(':contains("")').then((list) => {
                //     console.log(list.text())
                //     expect(list.text()).to.include(contatto.tipo)
                //     expect(list.text()).to.include(contatto.principale)
                //     if (contatto.tipo === 'E-Mail' || contatto.tipo === 'PEC') {
                //         expect(list.text()).to.include(contatto.email)
                //     } else if (contatto.tipo === 'Sito Web') {
                //         expect(list.text()).to.include(contatto.url)
                //     } else {
                //         expect(list.text()).to.include(contatto.prefissoInt)
                //         expect(list.text()).to.include(contatto.prefisso)
                //         expect(list.text()).to.include(contatto.phone)
                //         expect(list.text()).to.include(contatto.orario)
                //     }
                // })
            })
        })
    }
}
export default SCUContatti