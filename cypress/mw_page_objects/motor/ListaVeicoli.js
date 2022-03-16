/// <reference types="Cypress" />
function getPlateAuto() {
    var en = 'WERTYPASDFGHJKLZXCVBNM';
    var num = '1234567890';
    return 'Z'+getRandomByStr(1, en) + getRandomByStr(3, num) + getRandomByStr(2, en)
}

function getPlateMoto() {
    var en = 'WERTYPASDFGHJKLZXCVBNM';
    var num = '1234567890';
    return 'Z'+getRandomByStr(1, en) + getRandomByStr(5, num)
}

function getRandomByStr(l = 3, s) {
    if (typeof s !== 'string') { return }
    var len = +l;
    var chars = '';

    while (len--) {
        chars += s[parseInt(Math.random() * s.length, 10)];
    }
    return chars;
}

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
        let targa = getPlateAuto()
        let WW745FF = new ListaAuto("Auto", targa)
        WW745FF.targa = targa
        WW745FF.marca = "VOLVO"
        WW745FF.modello = "C70 (2005-2013)"
        WW745FF.versione = "C70 2.4 20V 170 CV MOMENTUM (DAL 2005/09)"
        WW745FF.dataImmatricolazione = "01/04/2022"
        WW745FF.nPosti = "5"

        return WW745FF
    }

    static Auto_ZZ841PP() {
        let targa = getPlateAuto()
        let ZZ841PP = new ListaAuto("Auto", targa)
        ZZ841PP.targa = targa
        ZZ841PP.marca = "AUDI"
        ZZ841PP.modello = "A4 5ª SERIE"
        ZZ841PP.versione = "A4 1.4 TFSI BUSINESS SPORT (DAL 2015/08)"
        ZZ841PP.dataImmatricolazione = "01/04/2022"
        ZZ841PP.nPosti = "5"

        return ZZ841PP
    }

    static Moto_MM25896() {
        let targa = getPlateMoto()
        let MM25896 = new ListaAuto("Motociclo", targa)
        MM25896.targa = targa
        MM25896.marca = "PIAGGIO"
        MM25896.modello = "ZIP 125"
        MM25896.versione = "(VERS. 01-2001)"
        MM25896.dataImmatricolazione = "01/04/2022"
        MM25896.nPosti = "2"

        return MM25896
    }

    static Auto_Applicazione1() {
        let targa = getPlateAuto()
        let WW745FF = new ListaAuto("Auto", targa)
        WW745FF.targa = targa
        WW745FF.marca = "VOLKSWAGEN"
        WW745FF.modello = "GOLF 8ª SERIE"
        WW745FF.versione = "GOLF 1.5 ETSI 150 CV EVO ACT DSG LIFE (DAL 2019/12)"
        WW745FF.dataImmatricolazione = "01/04/2022"
        WW745FF.nPosti = "5"

        return WW745FF
    }
    
}