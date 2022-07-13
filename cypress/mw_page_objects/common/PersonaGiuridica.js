/// <reference types="Cypress" />

export default class PersonaGiuridica {
    denominazione
    indirizzo = {
        via: "",
        numero: "",
        cap: "",
        citta: "",
        provincia: ""
    }
    partitaIVA
    nDipendenti
    formaGiuridica
    unitaMercato
    attivita
    
    constructor(denominazione, formaGiuridica) {
        this.denominazione = denominazione
        this.formaGiuridica = formaGiuridica
    }

    ubicazione() {
        return this.via + " " + this.numero + ", " + this.cap + " - " + this.citta + " (" + this.provincia + ")"
    }

    static Sinopoli() {
        let Sinopoli = new PersonaGiuridica("SINOPOLI", "S.R.L.")
        Sinopoli.via = "VIA PO"
        Sinopoli.numero = "14"
        Sinopoli.cap = "20006"
        Sinopoli.citta = "PREGNANA MILANESE"
        Sinopoli.provincia = "MI"
        Sinopoli.partitaIVA = "12819770152"
        Sinopoli.nDipendenti = "21 - 50"
        Sinopoli.unitaMercato = "4211"
        Sinopoli.attivita = "Costruzione, ristrutturazione parziale o totale di edifici"

        return Sinopoli
    }
}

