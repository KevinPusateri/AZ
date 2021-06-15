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
    * @param {string} etichetta - documento da verificare in folder
    */
    static verificaInFolder([etichette]) {
        cy.get('nx-icon[aria-label="Open menu"]').click()
        cy.contains('folder').click()
        cy.get('nx-modal-container').find('.agency-row').first().click().wait(3000)

        getIframe().find('span[class="k-icon k-plus"]:visible').click()
        getIframe().find('span[class="k-icon k-plus"]:first').click()

        etichette.forEach(label => {
            getIframe().find('span').contains(label).click()
        });
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
            let client = {name:'', address:''}
            cy.get('div[class*=client-name]').invoke('text')
                .then(currentClientName => {
                    client.name = currentClientName
                })
            cy.get('nx-icon[class="nx-icon--location nx-icon--auto nx-link__icon"]').parents('a')
                .find('div[class="value ng-star-inserted"]').invoke('text').then((currentAddress) => {
                    client.address = currentAddress.split('-')[0].replace(',','').trim()
                })
            resolve(client);
        });
    }
}

export default SintesiCliente