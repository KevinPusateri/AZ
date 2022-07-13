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


    static ClosePopupWarning() {
        cy.get('body').should('be.visible').then(($form) => {

            const popupExist = $form.find('div[role="dialog"]').is(':contains("Attenzione")')
            debugger
            if (popupExist)
                cy.contains('button', 'NO').click()
        })
    }

    static ClickIncassa() {
        cy.screenshot('Incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        // Inizio flusso incasso
        cy.wait(5000)
        cy.intercept({
            method: '+(GET|POST)',
            url: '**/Incasso/**'
        }).as('getIncasso');
        cy.get('#pnlBtnIncasso').should('be.visible').click()
        cy.wait(3000)

        cy.wait('@getIncasso', { timeout: 40000 })
        // if(cy.get('div[role="dialog"]').is(':visible'))
        //     cy.get('div[role="dialog"]').find('button:contains("Procedi")').click()
    }

    static SelezionaIncassa() {
        cy.intercept({
            method: 'POST',
            url: /Incassa/
        }).as('incassa');

        cy.wait(5000)
        // Seleziono il metodo di pagamento
        cy.get('span[aria-owns="TabIncassoModPagCombo_listbox"]').should('be.visible').click().wait(1000)
        cy.get('#TabIncassoModPagCombo_listbox').should('be.visible')
            .find('li').contains(/^Assegno$/).click()

        //Conferma incasso
        cy.screenshot('Conferma incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.get('#btnTabIncassoConfirm').should('be.visible').click()

        cy.wait('@incassa', { timeout: 40000 })
    }

    static TerminaIncasso() {

        // Verifica incasso confermato
        cy.get('h2[class="page-title"]').should('be.visible').then(() => {
            cy.wait(5000)
            cy.screenshot('Verifica incasso conferrmato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.wait(5000)
        })

        cy.get('img[src="css/ultra/Images/Shape.png"]').should('be.visible')

        cy.get('input[value="CHIUDI"]').click()
    }
}

export default IncassoDA