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
    codiceFiscale
    
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
        GalileoGalilei.codiceFiscale = "GLLGLL64B16G702K"

        return GalileoGalilei
    }

    static SabrinaTonon() {
        let SabrinaTonon = new PersonaFisica("SABRINA", "TONON")
        SabrinaTonon.via = "VIA DELL'AEROPORTO"
        SabrinaTonon.numero = "2/C"
        SabrinaTonon.cap = "34077"
        SabrinaTonon.citta = "RONCHI DEI LEGIONARI"
        SabrinaTonon.provincia = "go"

        return SabrinaTonon
    }

    static MassimoRoagna() {
        let MassimoRoagna = new PersonaFisica("MASSIMO", "ROAGNA")
        MassimoRoagna.via = "VIA VITTORIO ALFIERI"
        MassimoRoagna.numero = "3"
        MassimoRoagna.cap = "10022"
        MassimoRoagna.citta = "CARMAGNOLA"
        MassimoRoagna.provincia = "TO"

        return MassimoRoagna
    }
}

