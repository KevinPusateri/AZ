/// <reference types="Cypress" />
import Sales from "../../mw_page_objects/navigation/Sales"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import PreventivoMotor from "../../mw_page_objects/Motor/PreventivoMotor"



//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    
    cy.preserveCookies()
})

after(() => {
    //TopBar.logOutMW()
})

describe('Matrix Web : motor Salvataggio quotazione', function () {


    it('Verifica aggancio Sales e emissione polizza motor', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
    })

    it('Compila dati veicolo', function() {

       PreventivoMotor.compilaDatiQuotazione('GA470EG','27/08/1954');
     })


})