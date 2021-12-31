/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description Emissione preventivo applicazione auto da preventivo madre
 */

///<reference types="cypress"/>

//region import
import { PrevApplicazione } from '../../integration//MotorDA/tmp_LM_PreventivoApplicazione.js'
import Veicoli from '../../mw_page_objects/motor/ListaVeicoli'
//endregion import

//region params
let auto = Veicoli.Auto_ZZ841PP()
let garanzie = [
    "Furto"
]
let coperturaRCA = false
//endregion params

describe('AUTO 2', () => {
    context('tmp_LM_PreventivoApplicazione.js', function () {
        PrevApplicazione(auto, garanzie, coperturaRCA)
    })
})