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
let auto = Veicoli.Auto_WW745FF()
let garanzie = [
    "Furto"
]
//endregion params

describe('AUTO', () => {
    context('tmp_LM_PreventivoApplicazione.js', function () {
        PrevApplicazione(auto, garanzie)
    })
})