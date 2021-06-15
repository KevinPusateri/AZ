/// <reference types="Cypress" />


const getSCU = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class SCUContatti {

    static aggiungiFisso(contatto) {
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            var lista = { tipo: "", principale: "", orario: '', prefissoInt: '', prefisso: '' };
            // Tipo: Fisso
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Fisso")').then((tipo) => {
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
                                        cy.wrap(orarioDalle).find('span[class="k-input"]').then((orarioDalleSelected)=>{
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
            // togli digit
            getSCU().find('#tel-num').type(contatto.phone)
            cy.log(contatto.phone)


            //click salva
            getSCU().find('#submit:contains("Salva")').click().wait(4000)
            cy.then(() => {
                resolve(contatto)
            });

            // cy.intercept('POST', '**/graphql', (req) => {
            //     if (req.body.operationName.includes('client')) {
            //         req.alias = 'client'
            //     }
            // });
    
            // cy.get('a').contains('Clients').click()
    
            // cy.wait('@client', { requestTimeout: 30000 });
        });
    }

    static aggiungiCellulare() {
        var lista = { tipo: "", principale: "", prefisso: '', numero: '' };
        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: Cellulare
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Cellulare")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Principale: NO
            getSCU().find('span[aria-owns="principale_listbox"]').click()
            getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                lista.principale = principale.text()
            }).click()

            //Prefisso: numero random
            getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
            getSCU().find('#tel-pref_listbox > li').then((list) => {
                var index = Math.floor(Math.random() * list.length)
                cy.log(index)
                cy.wrap(list).eq(index).click()
                cy.wrap(list).eq(index).then(numberText => {
                    lista.prefisso = numberText
                })
            })

            // Telefono: numero random
            cy.digitTelephone().then((number) => {
                lista.numero = number
                getSCU().find('#tel-num').type(number)
            })

            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

    static aggiungiFax() {
        var lista = { tipo: "", principale: "", prefisso: '', numero: '' };

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: Fax
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Fax")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Principale: NO
            getSCU().find('span[aria-owns="principale_listbox"]').click()
            getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                lista.principale = principale.text()
            }).click()

            //Prefisso: numero random
            getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
            getSCU().find('#tel-pref_listbox > li').then((list) => {
                var index = Math.floor(Math.random() * list.length)
                cy.log(index)
                cy.wrap(list).eq(index).click()
                cy.wrap(list).eq(index).then(numberText => {
                    lista.prefisso = numberText
                })
            })

            // Telefono: numero random
            cy.digitTelephone().then((number) => {
                lista.numero = number
                getSCU().find('#tel-num').type(number)
            })

            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

    static aggiungiEmail() {
        var lista = { tipo: "", principale: "", email: '' };

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: Email
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Email")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Inserisci Email
            cy.generateTwoLetters().then((word) => {
                var email = word + '@gmail.com'
                lista.email = email
                getSCU().find('#otherKind').type(email)
            })
            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

    static aggiungiSitoWeb() {
        var lista = { tipo: "", principale: "", sitoWeb: '' };

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: Sito Web
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Sito Web")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Inserisci Sito Web
            cy.generateTwoLetters().then((word) => {
                var sitoWeb = 'www.' + word + '.com'
                lista.sitoWeb = sitoWeb
                getSCU().find('#otherKind').type(sitoWeb)
            })
            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

    static aggiungiNumeroVerde() {
        var lista = { tipo: "", principale: "", prefisso: '', numero: '' };

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: Numero Verde
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Numero Verde")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Principale: NO
            getSCU().find('span[aria-owns="principale_listbox"]').click()
            getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                lista.principale = principale.text()
            }).click()

            //Prefisso: numero random
            getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
            getSCU().find('#tel-pref_listbox > li').then((list) => {
                var index = Math.floor(Math.random() * list.length)
                cy.log(index)
                cy.wrap(list).eq(index).click()
                cy.wrap(list).eq(index).then(numberText => {
                    lista.prefisso = numberText
                })
            })

            // Telefono: numero random
            cy.digitTelephone().then((number) => {
                lista.numero = number
                getSCU().find('#tel-num').type(number)
            })

            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

    static aggiungiFaxVerde() {
        var lista = { tipo: "", principale: "", prefisso: '', numero: '' };

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: Fax Verde
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Fax Verde")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Principale: NO
            getSCU().find('span[aria-owns="principale_listbox"]').click()
            getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                lista.principale = principale.text()
            }).click()

            //Prefisso: numero random
            getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
            getSCU().find('#tel-pref_listbox > li').then((list) => {
                var index = Math.floor(Math.random() * list.length)
                cy.log(index)
                cy.wrap(list).eq(index).click()
                cy.wrap(list).eq(index).then(numberText => {
                    lista.prefisso = numberText
                })
            })

            // Telefono: numero random
            cy.digitTelephone().then((number) => {
                lista.numero = number
                getSCU().find('#tel-num').type(number)
            })

            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

    static aggiungiUfficio() {
        var lista = { tipo: "", principale: "", prefisso: '', numero: '' };

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: Ufficio
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("Ufficio")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Principale: NO
            getSCU().find('span[aria-owns="principale_listbox"]').click()
            getSCU().find('#principale-list').find('li:contains("No")').then((principale) => {
                lista.principale = principale.text()
            }).click()

            //Prefisso: numero random
            getSCU().find('span[aria-controls="tel-pref_listbox"]').click()
            getSCU().find('#tel-pref_listbox > li').then((list) => {
                var index = Math.floor(Math.random() * list.length)
                cy.log(index)
                cy.wrap(list).eq(index).click()
                cy.wrap(list).eq(index).then(numberText => {
                    lista.prefisso = numberText
                })
            })

            // Telefono: numero random
            cy.digitTelephone().then((number) => {
                lista.numero = number
                getSCU().find('#tel-num').type(number)
            })

            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

    static aggiungiPEC() {
        var lista = { tipo: "", principale: "", email: '' };

        cy.contains('Aggiungi contatto').click()
        return new Promise((resolve, reject) => {
            // Tipo: PEC
            getSCU().contains('Seleziona...').click()
            getSCU().find('#tipoReperibilita_listbox > li:contains("PEC")').then((tipo) => {
                lista.tipo = tipo.text()
            }).click()

            // Inserisci PEC
            cy.generateTwoLetters().then((word) => {
                var email = word + 'pec.it'
                lista.email = email
                getSCU().find('#otherKind').type(email)
            })
            //click salva
            getSCU().find('#submit:contains("Salva")').click()
            resolve(lista);
            console.log(lista)
        });
    }

}
export default SCUContatti