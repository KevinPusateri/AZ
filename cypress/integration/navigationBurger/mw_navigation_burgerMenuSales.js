/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
const agency = '010710000'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

before(() => {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    LoginPage.logInMW(userName, psw)


})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
})

after(function () {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

})
describe('Matrix Web : Navigazioni da Burger Menu in Sales', function () {

    it('Verifica i link da Burger Menu', function () {
        TopBar.clickSales()
        BurgerMenuSales.checkExistLinks()
    });

    //#region New Business
    //#region Motor
    it('Verifica aggancio Preventivo Motor', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Preventivo Motor')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Flotte e Convenzioni', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Flotte e Convenzioni')
        BurgerMenuSales.backToSales()

    });

    it('Verifica aggancio MiniFlotte', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('MiniFlotte')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Trattative Auto Corporate', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Trattative Auto Corporate')
        BurgerMenuSales.backToSales()
    })
    //#endregion

    //#region  Rami Vari
    it('Verifica aggancio Allianz Ultra Casa e Patrimonio', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio')
        BurgerMenuSales.backToSales()

    });

    it('Verifica aggancio Allianz Ultra Casa e Patrimonio BMP', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            BurgerMenuSales.clickLink('Allianz Ultra Casa e Patrimonio BMP')
            BurgerMenuSales.backToSales()
        } else this.skip()
    });

    it('Verifica aggancio Allianz Ultra Salute', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz Ultra Salute')
        BurgerMenuSales.backToSales()
    });

    it('Verifica aggancio Allianz1 Business', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz1 Business')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio FastQuote Infortuni da circolazione', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('FastQuote Infortuni da circolazione')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio FastQuote Impresa e Albergo', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('FastQuote Impresa e Albergo')
        BurgerMenuSales.backToSales()
    })
    //#endregion

    //#region Vita
    it('Verifica aggancio Allianz1 premorienza', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Allianz1 premorienza')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Preventivo Anonimo Vita Individuali', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Preventivo Anonimo Vita Individuali')
        BurgerMenuSales.backToSales()
    })
    //#endregion

    //#region Mid Corporate
    it('Verifica aggancio Gestione richieste per PA', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Gestione richieste per PA')
        BurgerMenuSales.backToSales()
    })
    //#endregion
    //#endregion

    //#region Gestione
    it('Verifica aggancio Nuovo Sfera', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            BurgerMenuSales.clickLink('Nuovo Sfera')
            BurgerMenuSales.backToSales()
        } else this.skip()
    })

    it('Verifica aggancio Sfera', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Sfera')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Campagne Commerciali', function () {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            BurgerMenuSales.clickLink('Campagne Commerciali')
            BurgerMenuSales.backToSales()
        } else this.skip()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Recupero preventivi e quotazioni')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Documenti da firmare', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Documenti da firmare')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Gestione attività in scadenza', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Gestione attività in scadenza')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Manutenzione portafoglio RV Midco', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Manutenzione portafoglio RV Midco')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Vita Corporate', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Vita Corporate')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Monitoraggio Polizze Proposte')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Certificazione fiscale', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Certificazione fiscale')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Manutenzione Portafoglio Auto', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Manutenzione Portafoglio Auto')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Cruscotto certificati applicazioni', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Cruscotto certificati applicazioni')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Cruscotto riepiloghi polizze abb.', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Cruscotto riepiloghi polizze abb.')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Report Cliente T4L', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Report Cliente T4L')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Documenti annullati', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Documenti annullati')
        BurgerMenuSales.backToSales()
    })

    // // // Unauthorize! apre nuova pagina ma ha un canale e aggiungere excel TFS
    // it('Verifica aggancio GED – Gestione Documentale', function () {
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('GED – Gestione Documentale').click()
    //      canaleFromPopup()
    //      cy.get('body').then($body => {
    //         $body.find('h1:contains("Unauthorized!"):visible')
    //     })
    //     cy.get('a').contains('Sales').click()
    // })

    it('Verifica aggancio Documenti da gestire', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Documenti da gestire')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Folder', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Folder')
        BurgerMenuSales.backToSales()
    })

    it('Verifica aggancio Allianz Global Assistance', function () {

        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                TopBar.clickSales()
                BurgerMenuSales.clickLink('Allianz Global Assistance')
            }
        })
    })

    //TODO Al momento rimosso in quanto il target non è presente in quanto c'è la finestra di Common di mezzo e aggiungere su excel
    // it.skip('Verifica aggancio Allianz Placement Platform', function () {
    //     TopBar.clickSales()
    //     BurgerMenuSales.clickLink('Allianz placement platform')
    // })

    it('Verifica aggancio Qualità portafoglio auto', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Qualità portafoglio auto')
        BurgerMenuSales.backToSales()
    })

    // Accesso Negato e su excel
    // it('Verifica aggancio App cumulo terremoti', function () {
    //     cy.url().should('eq',baseUrl+ 'sales/')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('App cumulo terremoti').click()
    // canaleFromPopup()
    //     cy.get('a').contains('Sales').click()
    // })

    it('Verifica aggancio Note di contratto', function () {
        TopBar.clickSales()
        BurgerMenuSales.clickLink('Note di contratto')
        BurgerMenuSales.backToSales()
    })

    //TODO Al momento rimosso in quanto il target non è presente in quanto c'è la finestra di Common di mezzo e excel
    // it('Verifica aggancio ACOM Gestione iniziative', function () {
    //     TopBar.clickSales()
    //     cy.get('lib-burger-icon').click({force:true})

    //     var newUrl = '';
    //     cy.window().then((win) => {
    //         cy.stub(win, 'open').as('windowOpen').callsFake(url => {
    //             newUrl = url;
    //         });
    //     }).then(()=>{

    //         cy.contains('ACOM Gestione iniziative').click()
    //         Common.canaleFromPopup()
    //         cy.get('@windowOpen').should('be.called');
    //         cy.visit(newUrl)
    //     })
    // })
    //#endregion
})