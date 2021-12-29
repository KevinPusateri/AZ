/// <reference types="Cypress" />

export default class ListaAuto {
    targa
    marca
    modello
    versione
    dataImmatricolazione
    nPosti
    
    constructor(targa) {
        this.targa = targa
    }

    static WW745FF() {
        let WW745FF = new ListaAuto("WW745FF")
        WW745FF.targa = "WW745FF"
        WW745FF.marca = "VOLVO"
        WW745FF.modello = "C70 (2005-2013)"
        WW745FF.versione = "C70 2.4 20V 170 CV MOMENTUM (DAL 2005/09)"
        WW745FF.dataImmatricolazione = "01/03/2021"
        WW745FF.nPosti = "5"

        return WW745FF
    }
}