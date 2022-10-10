/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 *
 * @description Flusso duplicazione codice LM
 */

///<reference types="cypress"/>

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregions

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.viewport(1280, 1080)

        // PP
        cy.visit('https://portaleagenzie.pp.azi.allianz.it/Auto/ConvenzioniAuto/Main.aspx', { headers: { "Accept-Encoding": "gzip, deflate" }, responseTimeout: 31000 }, {
            onBeforeLoad: win => {
                win.sessionStorage.clear();
                Object.defineProperty(win.navigator, 'language', { value: 'it-IT' });
                Object.defineProperty(win.navigator, 'languages', { value: ['it'] });
                Object.defineProperty(win.navigator, 'accept_languages', { value: ['it'] });
            },
            headers: {
                'Accept-Language': 'it',
            },
        })

        //Recuperiamo l'utenza in base alla macchina che è in run da tutf.json
        cy.task('getWinUserLogged').then((loggedUser) => {
            cy.fixture("tutf").then(data => {
                const user = data.users.filter(obj => {
                    return obj.userName === loggedUser.username.toUpperCase()
                })[0]

                cy.log('Retrived username : ' + loggedUser.username)
                cy.decryptLoginPsw().then(psw => {
                    let currentImpersonificationToPerform
                    let customImpersonification = {}
                    //Verifichiamo se ho customImpersonification valorizzato
                    if (Cypress.$.isEmptyObject(customImpersonification)) {
                        //Verifichiamo inoltre se effettuare check su seconda finestra in monoUtenza oppure AVIVA
                        if (Cypress.env('isSecondWindow') && Cypress.env('monoUtenza'))
                            currentImpersonificationToPerform = {
                                "agentId": data.monoUtenza.agentId,
                                "agency": data.monoUtenza.agency,
                            }
                        else if (Cypress.env('isAviva'))
                            currentImpersonificationToPerform = {
                                "agentId": data.aviva.agentId,
                                "agency": data.aviva.agency,
                            }
                        else if (Cypress.env('isAvivaBroker'))
                            currentImpersonificationToPerform = {
                                "agentId": data.avivaBroker.agentId,
                                "agency": data.avivaBroker.agency,
                            }
                        else
                            currentImpersonificationToPerform = {
                                "agentId": user.agentId,
                                "agency": user.agency,
                            }
                    } else
                        currentImpersonificationToPerform = {
                            "agentId": customImpersonification.agentId,
                            "agency": customImpersonification.agency,
                        }

                    cy.impersonification(user.tutf, currentImpersonificationToPerform.agentId, currentImpersonificationToPerform.agency).then(() => {
                        cy.get('input[name="Ecom_User_ID"]').type(user.tutf)
                        cy.get('input[name="Ecom_Password"]').type(psw, { log: false })
                        cy.get('input[type="SUBMIT"]').click()
                    })
                })
            })
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

//#endregion Before After

describe("LIBRI MATRICOLA", function () {
// !  La convenzione appena create si utilizza il giorno dopo su LM

    it('Flusso', () => {
        cy.get('#ambienteTargetLabel').should('be.visible').click()
        cy.get('#tendinaSceltaAmbiente').should('be.visible').find('#tendinaSceltaAmbiente_option_2').click()
        cy.contains('Esci').click()

        cy.contains('Apri convenzione').click()

        // RICERCA CODICI
        cy.get('#ctl00_ContentPlaceHolder1_txtSrcDescrizione').should('be.visible').type('SALA TEST LM AUTOMATICI')
        cy.get('#ctl00_ContentPlaceHolder1_ImageButton1').click()
        cy.get('#ctl00_ContentPlaceHolder1_GridView1').within(() => {
            cy.fixture('LibriMatricola/Convenzione.json').then((data) => {
                cy.contains(data.convenzione).click()
              })
        })


        // Accordo Dati Generali 
        cy.get('#contentDiv').should('be.visible')
        cy.contains('Duplica').click()

        // Dati Convenzione
        // un giorno dopo alla data corrente
        var afterTwoMonth = new Date();
        afterTwoMonth.setMonth(afterTwoMonth.getMonth() + 2);
        afterTwoMonth.setDate(1)

        afterTwoMonth.toLocaleDateString();
        let formattedDate = String(afterTwoMonth.getDate()).padStart(2, '0') + '/' +
            String(afterTwoMonth.getMonth()).padStart(2, '0') + '/' +
            String(afterTwoMonth.getFullYear())
        cy.log(formattedDate)
        cy.wait(5000)
        cy.get('#ctl00_ContentPlaceHolder1_dtDecorrenza').should('be.visible').clear().type(formattedDate)
        
        cy.get('#ctl00_ContentPlaceHolder1_txtDescrizione').should('be.visible').click()
        cy.get('#ctl00_ContentPlaceHolder1_txtDescrizione').clear().type('SALA TEST LM AUTOMATICI')

        //CONFERMA
        cy.get('#ctl00_commandBar_btnConferma').click()
        cy.get('#ctl00_contentMenuSx_MainMenu').within(() => {
            cy.contains('Salva').click()
        })


        // SPOSTA IN SVILIPPO
        cy.contains('Operazioni specifiche per l\'ambiente corrente').click()
        cy.get('#tendinaOperazioniAmbienteSviluppo_option_1').should('be.visible').click()

        // SALVA il Codice Convenzione e la data
        cy.get('#D-DatiGenerali').find('b').eq(1).then(($codiceConvenzione)=>{
            cy.writeFile('cypress/fixtures/LibriMatricola/Convenzione.json', {
                convenzione : $codiceConvenzione.text().trim(),
                dataConvenzione : formattedDate
            })
        })
        cy.contains('Esci').click()
    });


})