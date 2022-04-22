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

    static EttoreMajorana() {
        let EttoreMajorana = new PersonaFisica("ETTORE", "MAJORANA")
        EttoreMajorana.via = "VIA ETNEA"
        EttoreMajorana.numero = "251"
        EttoreMajorana.cap = "95125"
        EttoreMajorana.citta = "CATANIA"
        EttoreMajorana.provincia = "CT"
        EttoreMajorana.codiceFiscale = "MJRTTR86M05C351Z"

        return EttoreMajorana
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

    static DavideRoana() {
        let DavideRoana = new PersonaFisica("DAVIDE", "ROANA")
        DavideRoana.via = "VIA AL TIGLIO";
        DavideRoana.numero = "27"
        DavideRoana.cap = "33075"
        DavideRoana.citta = "CORDOVADO"
        DavideRoana.provincia = "PD"

        return DavideRoana
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

    static CarloRossini() {
        let CarloRossini = new PersonaFisica("CARLO", "ROSSINI")
        CarloRossini.via = "VIA GIUSEPPE MAZZINI"
        CarloRossini.numero = "1"
        CarloRossini.cap = "34074"
        CarloRossini.citta = "MONFALCONE"
        CarloRossini.provincia = "GO"
        CarloRossini.codiceFiscale = "RSSCRL80L25F356Z"

        return CarloRossini
    }

    static MonicaSant() {
        let MonicaSant = new PersonaFisica("MONICA", "SANT")
        MonicaSant.via = "VIA TRENTO"
        MonicaSant.numero = "13/A"
        MonicaSant.cap = "31010"
        MonicaSant.citta = "MARENO DI PIAVE"
        MonicaSant.provincia = "TV"

        return MonicaSant
    }

    static SimonettaRossino() {
        let SimonettaRossino = new PersonaFisica("SIMONETTA", "ROSSINO")
        SimonettaRossino.via = "VIA GIUSEPPE GARIBALDI"
        SimonettaRossino.numero = "12"
        SimonettaRossino.cap = "34170"
        SimonettaRossino.citta = "GORIZIA"
        SimonettaRossino.provincia = "GO"
        SimonettaRossino.codiceFiscale = "RSSSNT85E56E098Z"

        return SimonettaRossino
    }

    static MarioRossini() {
        let MarioRossini = new PersonaFisica("MARIO", "ROSSINI")
        MarioRossini.via = "VIA GIUSEPPE MAZZINI"
        MarioRossini.numero = "1"
        MarioRossini.cap = "34074"
        MarioRossini.citta = "MONFALCONE"
        MarioRossini.provincia = "GO"
        MarioRossini.codiceFiscale = "RSSMRA82L12F356R"

        return MarioRossini
    }
}

