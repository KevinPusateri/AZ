/**
 * @author Elio Cossu <elio.cossu@allianz.it>
 *
 * @description Emissione preventivo applicazione auto da preventivo madre
 */

///<reference types="cypress"/>

//region import
import { PrevApplicazione } from './tmp_LM_PreventivoApplicazione.js'
import Veicoli from '../../mw_page_objects/motor/ListaVeicoli'
//endregion import

//region params
let moto = Veicoli.Moto_MM25896()
let garanzie = []
//endregion params

describe('MOTO', () => {
    context('tmp_LM_PreventivoApplicazione.js', function() {
        PrevApplicazione(moto, garanzie)
    })
})