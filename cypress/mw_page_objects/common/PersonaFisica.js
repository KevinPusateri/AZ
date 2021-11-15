/// <reference types="Cypress" />

export default class PersonaFisica {
    nome
    cognome
    indirizzo = {
        via: "",
        numero: "",
        cap: "",
        citta: "",
        provincia: ""
    }
    
    constructor(nome, cognome) {
        this.nome = nome
        this.cognome = cognome
    }

    nomeCognome() {
        return this.nome + " " + this.cognome
    }

    cognomeNome() {
        return this.cognome + " " + this.nome
    }

    ubicazione() {
        return this.via + " " + this.numero + ", " + this.cap + " - " + this.citta + " (" + this.provincia + ")"
    }

    static GalileoGalilei() {
        let GalileoGalilei = new PersonaFisica("GALILEO", "GALILEI")
        GalileoGalilei.via = "LUNGOARNO GALILEO GALILEI"
        GalileoGalilei.numero = "12"
        GalileoGalilei.cap = "56125"
        GalileoGalilei.citta = "PISA"
        GalileoGalilei.provincia = "PI"

        return GalileoGalilei
    }
}

