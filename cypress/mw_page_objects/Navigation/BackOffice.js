/// <reference types="Cypress" />

class BackOffice {

    static clickCardLink(page) {
        return cy.get('.backoffice-card').find('a').contains(page).click()
    }

    static checkCardExistOnSinistri(linkTitlePage) {
        cy.get('app-backoffice-cards-list').eq(0).find('a').should('contain', linkTitlePage)
    }

    static checkCardExistOnContabilita(linkTitlePage) {
        cy.get('app-backoffice-cards-list').eq(1).find('a').should('contain', linkTitlePage)
    }

    static backToBackOffice() {
        cy.get('lib-breadcrumbs').contains('Backoffice').click()
        cy.url().should('eq', Cypress.env('baseUrl') + 'back-office')
    }

    static checkLinksOnSinistriExist() {
        const buttonsSinistri = [
            'Movimentazione sinistri',
            'Denuncia',
            'Denuncia BMP',
            'Consultazione sinistri',
            'Sinistri incompleti',
            'Sinistri canalizzati'
        ]
        cy.get('app-backoffice-cards-list').first().find('a').should('have.length', 6).each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsSinistri[i])
        })
    }

    static checkLinksOnContabilitaExist() {
        const buttonsContabilita = [
            'Sintesi Contabilità',
            'Giornata contabile',
            'Consultazione Movimenti',
            'Estrazione Contabilità',
            'Deleghe SDD',
            'Quadratura unificata',
            'Incasso per conto',
            'Incasso massivo',
            'Sollecito titoli',
            'Impostazione contabilità',
            'Convenzioni in trattenuta',
            'Monitoraggio Customer Digital Footprint'
        ]
        cy.get('app-backoffice-cards-list').eq(1).find('a[class="backoffice-label-text"]').each(($labelCard, i) => {
            expect($labelCard).to.contain(buttonsContabilita[i])
        })
    }
}




export default BackOffice