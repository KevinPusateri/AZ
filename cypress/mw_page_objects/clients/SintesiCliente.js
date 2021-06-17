/// <reference types="Cypress" />

const getIframe = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe()

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist')

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

class SintesiCliente {

    static cancellaCliente() {
        cy.get('nx-icon[aria-label="Open menu"]').click();
        cy.contains('Cancellazione cliente').click();
        cy.contains('Cancella cliente').click();
        cy.contains('Ok').click();
    }

    static emettiPleinAir() {
        cy.get('nx-icon[aria-label="Open menu"]').click();
        cy.contains('PLEINAIR').click();
        getIframe().find('#PageContentPlaceHolder_Questionario1_4701-15_0_i').select('NUOVA ISCRIZIONE')
        getIframe().find('#PageContentPlaceHolder_Questionario1_4701-40_0_i').select('FORMULA BASE')
        getIframe().find('#ButtonQuestOk').click().wait(6000)
        getIframe().find('#TabVarieInserimentoTipoPagamento > div.left > span > span').click()
        getIframe().find('li').contains("Contanti").click()
        getIframe().find('#FiltroTabVarieInserimentoDescrizione').type("TEST AUTOMATICO")

        cy.intercept({
            method: 'POST',
            url: /QuestionariWeb/
        }).as('questionariWeb');

        getIframe().find('#TabVarieInserimentoButton').click().wait(8000)

        cy.wait('@questionariWeb', { requestTimeout: 60000 })

        getIframe().find('#ButtonQuestOk').click()
    }

    /**
    * @param {Array.String} labels - labels dei documenti da verificare in folder
    */
    static verificaInFolder(labels) {
        cy.get('nx-icon[aria-label="Open menu"]').click()
        cy.contains('folder').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(3000)

        getIframe().find('span[class="k-icon k-plus"]:visible').click()
        getIframe().find('span[class="k-icon k-plus"]:first').click()
        debugger
        cy.wrap(labels).each((label, i, array) => {
            getIframe().find('span').contains(label).click()
        })
    }

    static verificaDatiSpallaSinistra(cliente) {
        //Verifica indirizzo
        cy.get('.client-name').should('contain.text', String(cliente.ragioneSociale).toUpperCase().replace(",", ""))
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.toponimo)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.indirizzo)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.numCivico)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.cap)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.citta)
        cy.get('nx-icon[class*=location]').parent().get('div').should('contain.text', cliente.provincia)
        //Verifica email
        cy.get('nx-icon[class*=mail]').parent().get('div').should('contain.text', String(cliente.email).toLowerCase())
    }

    static checkAtterraggioSintesiCliente(cliente) {
        cy.get('app-client-profile-tabs').find('a').contains('SINTESI CLIENTE').should('have.class', 'active')
        cy.get('.client-name').should('contain.text', String(cliente).toUpperCase().replace(",", ""))
    }

    static retriveClientNameAndAddress() {
        return new Promise((resolve, reject) => {
            let client = { name: '', address: '' }
            cy.get('div[class*=client-name]').invoke('text')
                .then(currentClientName => {
                    client.name = currentClientName

                    cy.log('Retrived Client Name : ' + client.name)
                })
            cy.get('nx-icon[class="nx-icon--location nx-icon--auto nx-link__icon"]').parents('a')
                .find('div[class="value ng-star-inserted"]').invoke('text').then((currentAddress) => {
                    client.address = currentAddress.split('-')[0].replace(',', '').trim()
                    cy.log('Retrived Client Address : ' + client.address)
                })

            resolve(client);
        });
    }
    /**
     * Verifica se la Scheda del Cliente ha presente o meno il Numero o la Mail principale
     * @param {*} contactType tipo di contatto a scelta tra 'numero' e 'mail'
     * @returns true se presente, false se assente
     */
    static checkContattoPrincipale(contactType) {
        return new Promise((resolve, reject) => {
            cy.get('body')
                .then(body => {
                    let missingValue
                    (contactType === 'numero') ? missingValue = 'Aggiungi numero principale' : missingValue = ' Aggiungi mail principale '
                    if (body.find('.scrollable-sidebar-content').find('div:contains("' + missingValue + '")').length > 0)
                        resolve(false)
                    else
                        resolve(true)
                })
        })
    }

    /**
     * Aggiunge Contatto principale (a scelta tra 'numero' o 'mail') 
     * @param {*} contactType tipo di contatto a scelta tra 'numero' e 'mail'
     */
    static aggiungiContattoPrincipale(contactType) {
        let missingValue
        (contactType === 'numero') ? missingValue = 'Aggiungi numero principale' : missingValue = ' Aggiungi mail principale '
        debugger
        cy.get('.scrollable-sidebar-content').find('div:contains("' + missingValue + '")').click({ multiple: true })

    }
}

export default SintesiCliente