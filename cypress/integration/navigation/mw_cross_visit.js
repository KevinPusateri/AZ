
/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

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
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: 'ANONIMO' }).then((results) => {
        insertedId = results.insertId
    })
})

after(function () {
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion
})

describe('Matrix Web : Aggancio Cross Visit', function () {
    it('Numbers - Verifica aggancio Allianz Global Assistance', function () {

        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (currentHostName.includes('SM'))
                this.skip()
            else {
                cy.visit('https://oazis.allianz-assistance.it/dynamic/home/index')
                cy.get('#oaz-login-btn').should('be.visible').and('contain.text', 'Accedi')
            }
        })
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: 'ANONIMO' }).then((results) => {
            insertedId = results.insertId
        })
    });

    it('Clients - Verifica aggancio Analisi dei Bisogni', function () {
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (currentHostName.includes('SM'))
                this.skip()
            else {
                cy.visit('https://www.ageallianz.it/analisideibisogni/app')
                cy.get('button').find('span').should('be.visible').and('contain.text', 'Accedi')
            }
        })
    });
})

