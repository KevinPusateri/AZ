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
        return cy.get('input[name*="btnChiudi"]:visible').should('exist').and('be.visible')
    }

    /**
     * @returns Ritorna il pulsante '> Salva Simulazione'
     * @return {Object} pulsante '> Salva Simulazione'
     */
    static salvaSimulazione() {
        return cy.get('input[name*="btnSalvaSimulazione"]:visible').should('exist').and('be.visible')
    }

    /**
     * Verifica l'accesso in prima istanza all'applicativo IncassoDA/MezziPagam.aspx
     */
    static accessoMezziPagam() {
        cy.intercept(selectTitolo).as('selectTitolo')
        cy.intercept(initMezziPagam).as('initMezziPagam')
        cy.intercept(getLogonUserName).as('getLogonUserName')

        cy.wait('@selectTitolo', { timeout: 60000 })
        cy.wait('@initMezziPagam', { timeout: 60000 })
        cy.wait('@getLogonUserName', { timeout: 60000 })
    }

    /**
     * Verifica l'accesso in prima istanza all'applicativo IncassoDA/GestioneFlex.aspx
     */
    static accessoGestioneFlex() {
        cy.intercept(initMezziPagam).as('initMezziPagam')
        cy.wait('@initMezziPagam', { timeout: 60000 })
    }

    /**
     * Click > Stampa (implementato per effettuare la stampa senza incasso)
     */
    static clickStampa() {
        cy.intercept(incassa).as('incassa')
        cy.intercept(getPostIncassoData).as('getPostIncassoData')
        this.stampa().click()
        cy.wait('@incassa', { timeout: 180000 })
        cy.wait('@getPostIncassoData', { timeout: 120000 })
    }

    /**
     * Click > CHIUDI
     */
    static clickCHIUDI() {
        this.chiudi().click()
    }

    /**
     * Click > Salva Simulazione
     */
    static clickSalvaSimulazione() {
        this.salvaSimulazione().click()
    }

    /**
     * Ritorna il numero di contratto alla fine del processo di Incasso
     * @returns {String} il numero di contratto 
     */
    static getNumeroContratto() {
        return new Cypress.Promise((resolve) => {
            cy.get('.TitoloItemDivTitle').should('exist').and('be.visible').invoke('text').then((infos) => {
                //Recuperiamo solo il numero di Cont
                let contratto = infos.split(' ')[1]
                resolve(contratto)
            })
        })
    }
}

export default IncassoDA