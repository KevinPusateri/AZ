/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description Emissione preventivo applicazione auto da preventivo madre
 */

///<reference types="cypress"/>

//region import
import { PrevApplicazione } from './LM_PreventivoApplicazione.js'
import Veicoli from '../../mw_page_objects/motor/ListaVeicoli'
//endregion import

//region params
let auto = Veicoli.Auto_ZZ841PP()
let garanzie = [
    "Furto"
]
let coperturaRCA = false
let nPopupRiepilogo = 4
//endregion params

describe('AUTO 2', () => {
    context('LM_PreventivoApplicazione.js', function () {
        PrevApplicazione(auto, garanzie, coperturaRCA, nPopupRiepilogo)
    })
})