/// <reference types="Cypress" />

export default class ListaAuto {
    tipo
    targa
    marca
    modello
    versione
    dataImmatricolazione
    nPosti
    
    constructor(tipo, targa) {
        this.tipo = tipo
        this.targa = targa
    }

    static Auto_WW745FF() {
        let WW745FF = new ListaAuto("Auto", "WW745FF")
        WW745FF.targa = "WW745FF"
        WW745FF.marca = "VOLVO"
        WW745FF.modello = "C70 (2005-2013)"
        WW745FF.versione = "C70 2.4 20V 170 CV MOMENTUM (DAL 2005/09)"
        WW745FF.dataImmatricolazione = "01/03/2021"
        WW745FF.nPosti = "5"

        return WW745FF
    }

    static Auto_ZZ841PP() {
        let ZZ841PP = new ListaAuto("Auto", "ZZ841PP")
        ZZ841PP.targa = "ZZ841PP"
        ZZ841PP.marca = "AUDI"
        ZZ841PP.modello = "A4 5ª SERIE"
        ZZ841PP.versione = "A4 1.4 TFSI BUSINESS SPORT (DAL 2015/08)"
        ZZ841PP.dataImmatricolazione = "01/03/2021"
        ZZ841PP.nPosti = "5"

        return ZZ841PP
    }

    static Moto_MM25896() {
        let MM25896 = new ListaAuto("Motociclo", "MM25896")
        MM25896.targa = "MM25896"
        MM25896.marca = "PIAGGIO"
        MM25896.modello = "ZIP 125"
        MM25896.versione = "(VERS. 01-2001)"
        MM25896.dataImmatricolazione = "01/03/2021"
        MM25896.nPosti = "2"

        return MM25896
    }
}