//#region Intercept
const initMezziPagam = {
    method: 'POST',
    url: /InitMezziPagam/
}

const getLogonUserName = {
    method: 'POST',
    url: /GetLogonUserName/
}

const selectTitolo = {
    method: 'POST',
    url: /SelectTitolo/
}

const getPostIncassoData = {
    method: 'POST',
    url: /GetPostIncassoData/
}

const incassa = {
    method: 'POST',
    url: /Incassa/
}
//#endregion

/**
 * @class
 * @classdesc Classe per interagire con l'applicativo IncassoDA
 * @author Andrea 'Bobo' Oboe
 */
class IncassoDA {

    /**
     * @returns Ritorna il pulsante '> Stampa'
     * @return {Object} pulsante '> Stampa'
     * @private
     */
    static stampa() {
        return cy.get('input[name*="btnStampa"]').should('exist').and('be.visible')
    }

    /**
     * @returns Ritorna il pulsante '> CHIUDI'
     * @return {Object} pulsante '> CHIUDI'
     * @private
     */
    static chiudi() {
        cy.get('#pnlBarraAvanzamento').should('exist').and('be.visible').within(()=>{
            return cy.get('input[name*="btnChiudi"]').should('exist').and('be.visible')
        })
    }

    /**
     * Verifica l'accesso in prima istanza all'applicativo IncassoDA
     */
    static accessoIncassoDA() {
        cy.intercept(selectTitolo).as('selectTitolo')
        cy.intercept(initMezziPagam).as('initMezziPagam')
        cy.intercept(getLogonUserName).as('getLogonUserName')

        cy.wait('@selectTitolo', { requestTimeout: 60000 })
        cy.wait('@initMezziPagam', { requestTimeout: 60000 })
        cy.wait('@getLogonUserName', { requestTimeout: 60000 })
    }

    /**
     * Click > Stampa (implementato per effettuare la stampa senza incasso)
     */
    static clickStampa() {
        cy.intercept(incassa).as('incassa')
        cy.intercept(getPostIncassoData).as('getPostIncassoData')
        this.stampa().click()
        cy.wait('@incassa', { requestTimeout: 60000 })
        cy.wait('@getPostIncassoData', { requestTimeout: 60000 })
    }

    /**
     * Click > CHIUDI
     */
    static clickCHIUDI() {
        this.chiudi().click()
    }

    /**
     * Ritorna il numero di contratto alla fine del processo di Incasso
     * @returns {String} il numero di contratto 
     */
    static getNumeroContratto() {
        return new Cypress.Promise((resolve) =>{
            cy.get('.TitoloItemDivTitle').should('exist').and('be.visible').invoke('text').then((infos) => {
                //Recuperiamo solo il numero di Cont
                let contratto = infos.split(' ')[1]
                resolve(contratto)
            })
        })
    }
}

export default IncassoDA