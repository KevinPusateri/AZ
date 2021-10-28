/// <reference types="Cypress" />
import Sales from "../../mw_page_objects/navigation/Sales"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import PreventivoMotor from "../../mw_page_objects/Motor/PreventivoMotor"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
let numeroQuotazione 
//#endregion

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

    it('Compila dati veicolo', function () {

        cy.task('getTarghe', { dbConfig: dbConfig }).then((results) => {
            let retrivedTarga = results[Math.floor(Math.random() * results.length)].Targa.trim()
            cy.getSSNAndBirthDateFromTarga(retrivedTarga).then(result => {
            
                PreventivoMotor.compilaDatiQuotazione(retrivedTarga, result.birthDate);
            })
        })
        //PreventivoMotor.compilaDatiQuotazione('FD385AY', '01/01/1996');
        //PreventivoMotor.provenienza('Voltura');
        PreventivoMotor.salvaQuotazioneMotorNGA2021().then((numeroQuotazione)=>{
        PreventivoMotor.recuperQuotazione(numeroQuotazione)

        })
       
      
    })


})