/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import News from "../Navigation/News";

class HomePage {

    static reloadMWHomePage(mockedNotifications = true, mockedNews = true) {
        //Skip this two requests that blocks on homepage
        cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
        cy.intercept(/launch-*/, 'ignore').as('launchStaging');

        if (mockedNotifications) {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('notifications')) {
                    req.reply({ fixture: 'mockNotifications.json' })
                }
            })
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('getNotificationCategories')) {
                    req.reply({ fixture: 'mockGetNotificationCategories.json' })
                }
            })

        }

        if (mockedNews && !Cypress.env('isAviva')) {

            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news')) {
                    req.reply({ fixture: 'mockNews.json' })
                }
            })
        } else if (!Cypress.env('isAviva')) {
            //Wait for news graphQL to be returned
            cy.intercept('POST', '**/graphql', (req) => {
                if (req.body.operationName.includes('news')) {
                    req.alias = 'gqlNews'
                    req.res
                }
            })
        }

        // if (Cypress.env('isSecondWindow'))
        //     cy.visit(Cypress.env('urlSecondWindow'))
        // else if (Cypress.env('currentEnv') === 'TEST')
        //     cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 })
        // else {
        //     if (!Cypress.env('monoUtenza'))
        //         cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
        //     else
        //         cy.visit(Cypress.env('urlSecondWindow'), { responseTimeout: 31000 })
        // }
        if (Cypress.env('currentEnv') === 'TEST')
            cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 })
        else {
            if (!Cypress.env('monoUtenza'))
                cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
            else {
                if (Cypress.env('currentEnv') === 'TEST')
                    cy.visit(Cypress.env('urlSecondWindowTest'), { responseTimeout: 31000 })
                else
                    cy.visit(Cypress.env('urlSecondWindowPreprod'), { responseTimeout: 31000 })
            }
        }

        if (!mockedNews && !Cypress.env('isAviva'))
            cy.wait('@gqlNews')

        //Attendiamo caricamento dell'icona utente in alto a dx
        cy.get('.user-icon-container').should('be.visible')


    }

    /**
     * Click link "Vai al Centro notifiche"
     */
    static clickVaiAlCentroNotifiche() {
        cy.contains('Vai al Centro notifiche').click()
        cy.url().should('include', Common.getBaseUrl() + 'notification-center')
        cy.screenshot('Vai al Centro Notifiche', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click link "Vedi tutte"
     */
    static clickVediTutte() {
        cy.contains('Vedi tutte').click()
        cy.url().should('eq', Common.getBaseUrl() + 'lemieinfo?news=news')
        News.checkAtterraggio()
    }

    static checkNotExistVediTutte() {
        cy.get('nx-link[routerlink="/lemieinfo?news=news"]').should('not.exist')
        cy.screenshot('Vedi Tutte non presente', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Click Pannello "Notifiche in evidenza"
     */
    static clickPanelNotifiche() {
        // APERTURA PANNELLO             
        cy.intercept('POST', '**/graphql', (req) => {
            if (req.body.operationName.includes('notifications')) {
                req.alias = 'gqlNotifications'
            }
        })
        cy.get('nx-expansion-panel').click()
        cy.wait('@gqlNotifications')
        cy.get('lib-notification-list').should('be.visible')
        cy.screenshot('Pannello Notifiche', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
    }

    /**
     * Verifica notifiche siano visibili,
     * che i titoli corrispondano e 
     * controlla i testi dal menu a tendina di ciascuna notifica 
     * corrispondano
     */
    static checkNotifiche() {
        cy.get('lib-notification-list').find('lib-notification-card').each(($checkNotifica) => {
            expect($checkNotifica).to.be.visible
        })

        cy.get('lib-notification-list').find('[class="title-container"]').each((checkNotificaTitle) => {
            expect(['portafoglio', 'contabilità', 'vps']).to.include(checkNotificaTitle.text().trim())
        })

        cy.get('lib-notification-list').find('button[class="nx-button--tertiary nx-button--medium"]').each(($checkTendina) => {
            cy.wrap($checkTendina).click({ force: true })
            cy.get('[class^="nx-context-menu__content"]').find('button').each($button => {
                expect(['Disattiva notifiche di questo tipo', 'Attiva notifiche di questo tipo',
                    'Segna come da leggere', 'Segna come già letta', 'Segna come da leggere'
                ])
                    .to.include($button.text().trim())
            })

        })
    }

    static closeIndidentBox() {
        cy.wait(4000)
        cy.get('body').then($body => {
            if ($body.find('.lib-incident-notification').length > 0)
                cy.get('.nx-icon--close').click()
        });
    }
}

export default HomePage