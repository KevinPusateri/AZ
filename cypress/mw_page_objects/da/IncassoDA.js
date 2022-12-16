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
        cy.wait('@selectTitolo', { timeout: 120000 })
        // cy.wait('@initMezziPagam', { timeout: 60000 })
        cy.wait('@getLogonUserName', { timeout: 120000 })
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

    static ClickIncassa($iframe = undefined) {
        cy.screenshot('Incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })

        // Inizio flusso incasso
        cy.wait(5000)
        cy.intercept({
            method: '+(GET|POST)',
            url: '**/Incasso/**'
        }).as('getIncasso');
        cy.get('#pnlBtnIncasso').should('exist').should('be.visible').click()
        cy.wait(3000)
    }

    static ClickPopupWarning($iframe = undefined) {
        if ($iframe === undefined) {
            cy.get('body').then(($body) => {
                const popupWarning = $body.find('div[role="dialog"]').is(':visible')
                if (popupWarning)
                    cy.get('div[role="dialog"]').should('be.visible').within(($dialog) => {
                        cy.wait(4000)
                        if ($dialog.text().includes('relativo alla quietanza'))
                            cy.contains('Procedi').click()
                        else {
                            cy.contains('button', 'Contr.Convenzionabile').click().wait(4000)
                            cy.contains('Procedi').click()
                        }
                    })
                cy.wait('@getIncasso', { timeout: 40000 })
                cy.wait(10000)
            })
        }
        else {
            const popupWarning = $iframe.find('div[role="dialog"]').is(':visible')
            if (popupWarning)
                cy.get('div[role="dialog"]').should('be.visible').within(($dialog) => {
                    cy.wait(4000)
                    if ($dialog.text().includes('relativo alla quietanza'))
                        cy.contains('Procedi').click()
                    else {
                        cy.contains('button', 'Contr.Convenzionabile').click().wait(4000)
                        cy.contains('Procedi').click()
                    }
                })
            cy.wait('@getIncasso', { timeout: 40000 })

            cy.wait(10000)
        }
    }

    static SelezionaIncassa(typeIncasso = 'Assegno') {
        cy.intercept({
            method: 'POST',
            url: /Incassa/
        }).as('incassa');

        cy.wait(10000)
        // Seleziono il metodo di pagamento
        cy.get('span[aria-owns="TabIncassoModPagCombo_listbox"]').should('be.visible').click().wait(1000)
        let regexKeyType = new RegExp('\^' + typeIncasso + '\$');
        cy.get('#TabIncassoModPagCombo_listbox').should('be.visible')
            .find('li:visible').contains(regexKeyType).click()

        //Conferma incasso
        // cy.screenshot('Conferma incasso', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
        cy.get('#btnTabIncassoConfirm').should('be.visible').click()

        cy.wait('@incassa', { timeout: 120000 })
    }

    static TerminaIncasso(TitoloIncassoByAnnullamento = true) {

        // Verifica incasso confermato
        cy.get('div[class="container"]').should('be.visible').then(() => {
            cy.wait(5000)
            cy.screenshot('Verifica incasso confermato', { clip: { x: 0, y: 0, width: 1920, height: 900 }, overwrite: true })
            cy.wait(5000)
        })
        if (!TitoloIncassoByAnnullamento) {
            cy.get('img[src="Images/iconImagesBlue/confirm_green.gif"]').should('be.visible')
            cy.get('input[value="CHIUDI"]').should('be.visible').click()
        }
        else {
            cy.get('img[src="css/ultra/Images/Shape.png"]').should('be.visible')
            cy.contains('CHIUDI').click()
        }

    }
}

export default IncassoDA