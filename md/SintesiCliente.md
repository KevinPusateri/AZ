## Classes

<dl>
<dt><a href="#SintesiCliente">SintesiCliente</a></dt>
<dd><p>Classe per utilizzare la Sintesi Cliente in Matrix Web</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Client">Client</a></dt>
<dd></dd>
</dl>

<a name="SintesiCliente"></a>

## SintesiCliente
Classe per utilizzare la Sintesi Cliente in Matrix Web

**Kind**: global class  
**Author**: Andrea 'Bobo' Oboe & Kevin Pusateri  

* [SintesiCliente](#SintesiCliente)
    * [.wait()](#SintesiCliente.wait)
    * [.checkTabs()](#SintesiCliente.checkTabs)
    * [.checkSituazioneCliente()](#SintesiCliente.checkSituazioneCliente)
    * [.clickTabSintesiCliente()](#SintesiCliente.clickTabSintesiCliente)
    * [.checkFastQuoteUltra()](#SintesiCliente.checkFastQuoteUltra)
    * [.checkFastQuoteAuto()](#SintesiCliente.checkFastQuoteAuto)
    * [.calcolaDaFastQuoteAuto()](#SintesiCliente.calcolaDaFastQuoteAuto)
    * [.clickProcediInserimentoManualeFastQuoteAuto()](#SintesiCliente.clickProcediInserimentoManualeFastQuoteAuto)
    * [.checkFastQuoteAlbergo()](#SintesiCliente.checkFastQuoteAlbergo)
    * [.VaiPreferiti()](#SintesiCliente.VaiPreferiti)
    * [.checkCardsEmissioni(keysCards)](#SintesiCliente.checkCardsEmissioni)
    * [.Emissione(fixtureEmissione)](#SintesiCliente.Emissione)
    * ~~[.selezionaPrimaAgenzia()](#SintesiCliente.selezionaPrimaAgenzia)~~
    * [.clickAuto()](#SintesiCliente.clickAuto)
    * [.clickPreventivoMotor()](#SintesiCliente.clickPreventivoMotor)
    * [.clickFlotteConvenzioni()](#SintesiCliente.clickFlotteConvenzioni)
    * [.clickAssunzioneGuidata()](#SintesiCliente.clickAssunzioneGuidata)
    * [.clickVeicoliEpoca()](#SintesiCliente.clickVeicoliEpoca)
    * [.clickLibriMatricola()](#SintesiCliente.clickLibriMatricola)
    * [.clickKaskoARDChilometro()](#SintesiCliente.clickKaskoARDChilometro)
    * [.clickKaskoARDGiornata()](#SintesiCliente.clickKaskoARDGiornata)
    * [.clickKaskoARDVeicolo()](#SintesiCliente.clickKaskoARDVeicolo)
    * [.clickPolizzaBase()](#SintesiCliente.clickPolizzaBase)
    * [.clickCoassicurazione()](#SintesiCliente.clickCoassicurazione)
    * [.clickNuovaPolizza()](#SintesiCliente.clickNuovaPolizza)
    * [.clickNuovaPolizzaGuidata()](#SintesiCliente.clickNuovaPolizzaGuidata)
    * [.clickNuovaPolizzaCoassicurazione()](#SintesiCliente.clickNuovaPolizzaCoassicurazione)
    * [.clickRamiVari()](#SintesiCliente.clickRamiVari)
    * [.clickAllianzUltraCasaPatrimonio()](#SintesiCliente.clickAllianzUltraCasaPatrimonio)
    * [.clickAllianzUltraCasaPatrimonioBMP()](#SintesiCliente.clickAllianzUltraCasaPatrimonioBMP)
    * [.clickAllianzUltraSalute()](#SintesiCliente.clickAllianzUltraSalute)
    * [.clickAllianz1Business()](#SintesiCliente.clickAllianz1Business)
    * [.clickFastQuoteUniversoSalute()](#SintesiCliente.clickFastQuoteUniversoSalute)
    * [.clickFastQuoteInfortuniDaCircolazione()](#SintesiCliente.clickFastQuoteInfortuniDaCircolazione)
    * [.clickFastQuoteImpresaSicura()](#SintesiCliente.clickFastQuoteImpresaSicura)
    * [.clickFastQuoteAlbergo()](#SintesiCliente.clickFastQuoteAlbergo)
    * [.clickGestioneGrandine()](#SintesiCliente.clickGestioneGrandine)
    * [.clickPolizzaNuova()](#SintesiCliente.clickPolizzaNuova)
    * [.clickVita()](#SintesiCliente.clickVita)
    * [.clickSevizioConsulenza()](#SintesiCliente.clickSevizioConsulenza)
    * [.checkContrattiEvidenza()](#SintesiCliente.checkContrattiEvidenza)
    * [.cancellaCliente()](#SintesiCliente.cancellaCliente)
    * [.emettiPleinAir()](#SintesiCliente.emettiPleinAir)
    * [.verificaInFolderDocumentiAnagrafici(labels)](#SintesiCliente.verificaInFolderDocumentiAnagrafici)
    * [.verificaDatiSpallaSinistra(cliente)](#SintesiCliente.verificaDatiSpallaSinistra)
    * [.checkAtterraggioSintesiCliente(cliente)](#SintesiCliente.checkAtterraggioSintesiCliente)
    * [.clickClientsBriciolaPane()](#SintesiCliente.clickClientsBriciolaPane)
    * [.retriveClientNameAndAddress()](#SintesiCliente.retriveClientNameAndAddress) ⇒ [<code>Promise.&lt;Client&gt;</code>](#Client)
    * [.retriveUrl()](#SintesiCliente.retriveUrl) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.visitUrlClient(fullUrl, param)](#SintesiCliente.visitUrlClient)
    * [.checkContattoPrincipale(contactType)](#SintesiCliente.checkContattoPrincipale) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.aggiungiContattoPrincipale(contactType)](#SintesiCliente.aggiungiContattoPrincipale)
    * [.back()](#SintesiCliente.back)
    * [.checkVociSpallaSinistra(voce)](#SintesiCliente.checkVociSpallaSinistra)
    * [.emettiReportProfiloVita(agenzia, [erroMessage])](#SintesiCliente.emettiReportProfiloVita)
    * [.checkLinksFromAuto()](#SintesiCliente.checkLinksFromAuto)
    * [.checkLinksFromRamiVari(keys)](#SintesiCliente.checkLinksFromRamiVari)
    * [.checkLinksFromVita()](#SintesiCliente.checkLinksFromVita)
    * [.checkLinksFromAutoOnEmissione(keysAuto)](#SintesiCliente.checkLinksFromAutoOnEmissione)
    * [.checkLinksFromAutoOnProdottiParticolari(keysAuto)](#SintesiCliente.checkLinksFromAutoOnProdottiParticolari)
    * [.checkLinksFromAutoOnPassioneBlu()](#SintesiCliente.checkLinksFromAutoOnPassioneBlu)
    * [.checkLinksFromAutoOnNatanti()](#SintesiCliente.checkLinksFromAutoOnNatanti)
    * [.checkLinksFromRamiVariOnEmissione()](#SintesiCliente.checkLinksFromRamiVariOnEmissione)
    * [.checkLinksFromAutoOnProdottiParticolariKasko()](#SintesiCliente.checkLinksFromAutoOnProdottiParticolariKasko)
    * [.checkLinksFromAutoOnProdottiParticolariPolizzaAperta()](#SintesiCliente.checkLinksFromAutoOnProdottiParticolariPolizzaAperta)

<a name="SintesiCliente.wait"></a>

### SintesiCliente.wait()
Funzione che attende il caricamento della Sintesi Cliente dopo aver cliccato il primo risultato riportato dalla ricerca

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkTabs"></a>

### SintesiCliente.checkTabs()
Verifica la presenza dei Tab Sintesi Cliente, Dettaglio Anagrafica, Portafoglio e Archivio Cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkSituazioneCliente"></a>

### SintesiCliente.checkSituazioneCliente()
Effettua un check sulla parte di Situazione Cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickTabSintesiCliente"></a>

### SintesiCliente.clickTabSintesiCliente()
Click sul Tab Sintesi Cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkFastQuoteUltra"></a>

### SintesiCliente.checkFastQuoteUltra()
Effettua Check su Fast Quote Ultra

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkFastQuoteAuto"></a>

### SintesiCliente.checkFastQuoteAuto()
Effettua Check su Fast Quote Auto

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.calcolaDaFastQuoteAuto"></a>

### SintesiCliente.calcolaDaFastQuoteAuto()
Effettua il calcola da Fast Quote Auto con accesso all'applicativo motorw

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickProcediInserimentoManualeFastQuoteAuto"></a>

### SintesiCliente.clickProcediInserimentoManualeFastQuoteAuto()
Click sul popup di Inserimento Manuale Fast Quote Auto

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkFastQuoteAlbergo"></a>

### SintesiCliente.checkFastQuoteAlbergo()
Effettua Check su Fast Quote Albergo

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.VaiPreferiti"></a>

### SintesiCliente.VaiPreferiti()
Clicca sul pulsante 'Vai a Preferiti' nella scheda Fastquote

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkCardsEmissioni"></a>

### SintesiCliente.checkCardsEmissioni(keysCards)
Verifica le Cards Emissioni

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type |
| --- | --- |
| keysCards | <code>Object</code> | 

**Example**  
```js
let keysCards = { AUTO: true,  RAMIVARI: true,  VITA: true}   
```
<a name="SintesiCliente.Emissione"></a>

### SintesiCliente.Emissione(fixtureEmissione)
Effettua Emissione del ramo indicato

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Description |
| --- | --- | --- |
| fixtureEmissione | <code>string</code> | vedi ../../fixtures/SchedaCliente/menuEmissione.json |

<a name="SintesiCliente.selezionaPrimaAgenzia"></a>

### ~~SintesiCliente.selezionaPrimaAgenzia()~~
***Deprecated***

Seleziona la prima agenzia dal popup "seleziona il canale" in MatrixUtilizza Common.canaleFromPopup()

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickAuto"></a>

### SintesiCliente.clickAuto()
Effettua il click su Auto

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickPreventivoMotor"></a>

### SintesiCliente.clickPreventivoMotor()
Emissione Preventivo Motor

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
**Requires**: <code>module:clickAuto()</code>  
<a name="SintesiCliente.clickFlotteConvenzioni"></a>

### SintesiCliente.clickFlotteConvenzioni()
Click Flotte Convenzioni

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickAssunzioneGuidata"></a>

### SintesiCliente.clickAssunzioneGuidata()
Click Assunzione Guidata

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickVeicoliEpoca"></a>

### SintesiCliente.clickVeicoliEpoca()
Click Veicoli Epoca

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickLibriMatricola"></a>

### SintesiCliente.clickLibriMatricola()
Click Libri Matricola

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickKaskoARDChilometro"></a>

### SintesiCliente.clickKaskoARDChilometro()
Click Kasko ARD Chilometro

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickKaskoARDGiornata"></a>

### SintesiCliente.clickKaskoARDGiornata()
Click Kasko ARD Giornata

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickKaskoARDVeicolo"></a>

### SintesiCliente.clickKaskoARDVeicolo()
Click Kasko ARD Veicolo

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickPolizzaBase"></a>

### SintesiCliente.clickPolizzaBase()
Click Polizza Base

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickCoassicurazione"></a>

### SintesiCliente.clickCoassicurazione()
Click Coassicurazione

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickNuovaPolizza"></a>

### SintesiCliente.clickNuovaPolizza()
Click Nuova Polizza Motor

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickNuovaPolizzaGuidata"></a>

### SintesiCliente.clickNuovaPolizzaGuidata()
Click Nuova Polizza Guidata

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickNuovaPolizzaCoassicurazione"></a>

### SintesiCliente.clickNuovaPolizzaCoassicurazione()
Click Nuova Polizza Coassicurazione

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickRamiVari"></a>

### SintesiCliente.clickRamiVari()
Click Rami Vari

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickAllianzUltraCasaPatrimonio"></a>

### SintesiCliente.clickAllianzUltraCasaPatrimonio()
Click Allianz Ultra Casa Patrimonio

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickAllianzUltraCasaPatrimonioBMP"></a>

### SintesiCliente.clickAllianzUltraCasaPatrimonioBMP()
Click Allianz Ultra Casa Patrimonio BMP

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickAllianzUltraSalute"></a>

### SintesiCliente.clickAllianzUltraSalute()
Click Allianz Ultra Salute

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickAllianz1Business"></a>

### SintesiCliente.clickAllianz1Business()
Click Allianz1 Business

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickFastQuoteUniversoSalute"></a>

### SintesiCliente.clickFastQuoteUniversoSalute()
Click Fast Quote Universo Salute

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickFastQuoteInfortuniDaCircolazione"></a>

### SintesiCliente.clickFastQuoteInfortuniDaCircolazione()
Click Fast Quote Infortuni da Circolazione

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickFastQuoteImpresaSicura"></a>

### SintesiCliente.clickFastQuoteImpresaSicura()
Click Fast Quote Impresa Sicura

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickFastQuoteAlbergo"></a>

### SintesiCliente.clickFastQuoteAlbergo()
Click Fast Quote Albergo

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickGestioneGrandine"></a>

### SintesiCliente.clickGestioneGrandine()
Click Gestione Grandine

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickPolizzaNuova"></a>

### SintesiCliente.clickPolizzaNuova()
Click Polizza Nuova Rami Vari

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickVita"></a>

### SintesiCliente.clickVita()
Click Vita

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.clickSevizioConsulenza"></a>

### SintesiCliente.clickSevizioConsulenza()
Click Vita > Servizio Consulenza

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkContrattiEvidenza"></a>

### SintesiCliente.checkContrattiEvidenza()
Verifica l'aggancio alla pagina del primo contratto

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.cancellaCliente"></a>

### SintesiCliente.cancellaCliente()
Effettua la Cancellazione di un cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.emettiPleinAir"></a>

### SintesiCliente.emettiPleinAir()
Emette Plein Air (flusso completo)

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.verificaInFolderDocumentiAnagrafici"></a>

### SintesiCliente.verificaInFolderDocumentiAnagrafici(labels)
Verifica Documenti Anagrafici in Folder

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Description |
| --- | --- | --- |
| labels | <code>Array.String</code> | labels dei documenti da verificare in folder |

<a name="SintesiCliente.verificaDatiSpallaSinistra"></a>

### SintesiCliente.verificaDatiSpallaSinistra(cliente)
Verifica Data in Spalla Sinistra

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Description |
| --- | --- | --- |
| cliente | <code>Objec</code> | Dati del cliente da verificare |

**Example**  
```js
let cliente = {
        nuovoClientePG.tipologia = "DITTA"
        nuovoClientePG.formaGiuridica = "S.R.L."
        nuovoClientePG.toponimo = "PIAZZA"
        nuovoClientePG.indirizzo = "GIUSEPPE GARIBALDI"
        nuovoClientePG.numCivico = "1"
        nuovoClientePG.cap = "36045"
        nuovoClientePG.citta = "LONIGO"
        nuovoClientePG.provincia = "VI"
        }
```
<a name="SintesiCliente.checkAtterraggioSintesiCliente"></a>

### SintesiCliente.checkAtterraggioSintesiCliente(cliente)
Check Atterraggio in Sintesi Cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Description |
| --- | --- | --- |
| cliente | <code>string</code> | Nome del cliente da verificare |

<a name="SintesiCliente.clickClientsBriciolaPane"></a>

### SintesiCliente.clickClientsBriciolaPane()
Click su Clients BreadCrumb

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.retriveClientNameAndAddress"></a>

### SintesiCliente.retriveClientNameAndAddress() ⇒ [<code>Promise.&lt;Client&gt;</code>](#Client)
Funzione che ritorna il nome del cliente e il suo indirizzo

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
**Returns**: [<code>Promise.&lt;Client&gt;</code>](#Client) - Promise per nome e indirizzo del cliente  
<a name="SintesiCliente.retriveUrl"></a>

### SintesiCliente.retriveUrl() ⇒ <code>Promise.&lt;string&gt;</code>
Ritorna l'url del cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise url del cliente  
<a name="SintesiCliente.visitUrlClient"></a>

### SintesiCliente.visitUrlClient(fullUrl, param)
Funzione che carica direttamente l'url del cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fullUrl | <code>boolean</code> | <code>true</code> | default a true, viene passato l'url completo, altrimenti viene generato |
| param | <code>string</code> |  | viene passato l'url completo |

<a name="SintesiCliente.checkContattoPrincipale"></a>

### SintesiCliente.checkContattoPrincipale(contactType) ⇒ <code>Promise.&lt;boolean&gt;</code>
Verifica se la Scheda del Cliente ha presente o meno il Numero o la Mail principale

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Promise ritorna true se presente, false se assente  

| Param | Type | Description |
| --- | --- | --- |
| contactType | <code>string</code> | tipo di contatto a scelta tra 'numero' e 'mail' |

<a name="SintesiCliente.aggiungiContattoPrincipale"></a>

### SintesiCliente.aggiungiContattoPrincipale(contactType)
Aggiunge Contatto principale (a scelta tra 'numero' o 'mail')

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Description |
| --- | --- | --- |
| contactType | <code>string</code> | tipo di contatto a scelta tra 'numero' e 'mail' |

<a name="SintesiCliente.back"></a>

### SintesiCliente.back()
Clicca sul BreadCrumb Clients per tornare in Sintesi Cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkVociSpallaSinistra"></a>

### SintesiCliente.checkVociSpallaSinistra(voce)
Verifica la presenza della voce specificata cliccando sui 3 puntini in spalla sinistra

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Description |
| --- | --- | --- |
| voce | <code>String</code> | etichetta da verifica cliccando sui 3 puntini in spalla sinistra |

<a name="SintesiCliente.emettiReportProfiloVita"></a>

### SintesiCliente.emettiReportProfiloVita(agenzia, [erroMessage])
Emette Report Profilo Vita cliccando sui 3 puntini della spalla sx in atterraggio su Sintesi Cliente

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type | Description |
| --- | --- | --- |
| agenzia | <code>string</code> | in fase di disambiguazione da cliccare |
| [erroMessage] | <code>boolean</code> | default false, se a true controlla prezenza errore |

<a name="SintesiCliente.checkLinksFromAuto"></a>

### SintesiCliente.checkLinksFromAuto()
Verifica i Links da Card Auto

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkLinksFromRamiVari"></a>

### SintesiCliente.checkLinksFromRamiVari(keys)
Verifica i Links da Card Rami Vari

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type |
| --- | --- |
| keys | <code>Object</code> | 

<a name="SintesiCliente.checkLinksFromVita"></a>

### SintesiCliente.checkLinksFromVita()
Verifica i Links da Card Vita

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkLinksFromAutoOnEmissione"></a>

### SintesiCliente.checkLinksFromAutoOnEmissione(keysAuto)
Verifica Links da Auto su Emissione

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type |
| --- | --- |
| keysAuto | <code>Object</code> | 

<a name="SintesiCliente.checkLinksFromAutoOnProdottiParticolari"></a>

### SintesiCliente.checkLinksFromAutoOnProdottiParticolari(keysAuto)
Verifica Links Auto su Prodotti Particolari

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  

| Param | Type |
| --- | --- |
| keysAuto | <code>Object</code> | 

<a name="SintesiCliente.checkLinksFromAutoOnPassioneBlu"></a>

### SintesiCliente.checkLinksFromAutoOnPassioneBlu()
Verifica Links Auto Passione Blu

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkLinksFromAutoOnNatanti"></a>

### SintesiCliente.checkLinksFromAutoOnNatanti()
Verifica Links Auto Natanti

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkLinksFromRamiVariOnEmissione"></a>

### SintesiCliente.checkLinksFromRamiVariOnEmissione()
Verifica Links da Rami Vari Emissione

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkLinksFromAutoOnProdottiParticolariKasko"></a>

### SintesiCliente.checkLinksFromAutoOnProdottiParticolariKasko()
Verifica Links da Auto Prodotti Particolari Kasko

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="SintesiCliente.checkLinksFromAutoOnProdottiParticolariPolizzaAperta"></a>

### SintesiCliente.checkLinksFromAutoOnProdottiParticolariPolizzaAperta()
Verifica Links da Auto Prodotti Particolari Polizza Aperta

**Kind**: static method of [<code>SintesiCliente</code>](#SintesiCliente)  
<a name="CardsEmissioni"></a>

## CardsEmissioni : <code>enum</code>
Enum Cards Emissioni

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| AUTO | <code>string</code> | <code>&quot;Auto&quot;</code> | 
| RAMIVARI | <code>string</code> | <code>&quot;Rami vari&quot;</code> | 
| VITA | <code>string</code> | <code>&quot;Vita&quot;</code> | 
| deleteKey | <code>string</code> | <code>null</code> | 

<a name="RamiVari"></a>

## RamiVari : <code>enum</code>
Enum Voci Emissione Rami Vari

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| ALLIANZ_ULTRA_CASA_E_PATRIMONIO | <code>string</code> | <code>&quot;&quot;</code> | 
| ALLIANZ_ULTRA_CASA_E_PATRIMONIO_BMP | <code>string</code> | <code>&quot;&quot;</code> | 
| ALLIANZ_ULTRA_SALUTE | <code>string</code> | <code>&quot;&quot;</code> | 
| ALLIANZ_ULTRA_IMPRESA | <code>string</code> | <code>&quot;Allianz Ultra Impresa&quot;</code> | 
| ALLIANZ1_BUSINESS | <code>string</code> | <code>&quot;Allianz1 Business&quot;</code> | 
| FASQUOTE_UNIVERSO_PERSONA | <code>string</code> | <code>&quot;Fastquote Universo Persona&quot;</code> | 
| FASTQUOTE_UNIVERSO_SALUTE | <code>string</code> | <code>&quot;FastQuote Universo Salute&quot;</code> | 
| FASTQUOTE_INFORTUNI_CIRCOLAZIONE | <code>string</code> | <code>&quot;FastQuote Infortuni Da Circolazione&quot;</code> | 
| FASQUOTE_IMPRESA_SICURA | <code>string</code> | <code>&quot;FastQuote Impresa Sicura&quot;</code> | 
| FASQUOTE_ALBERGO | <code>string</code> | <code>&quot;FastQuote Albergo&quot;</code> | 
| GESTIONE_GRANDINE | <code>string</code> | <code>&quot;Gestione Grandine&quot;</code> | 
| EMISSIONE | <code>string</code> | <code>&quot;Emissione&quot;</code> | 
| deleteKey | <code>string</code> | <code>null</code> | 

<a name="Auto"></a>

## Auto : <code>enum</code>
Enum Voci Emissione Auto (con accesso a subMenu)

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| EMISSIONE | <code>string</code> | <code>&quot;Emissione&quot;</code> | 
| PRODOTTI_PARTICOLARI | <code>string</code> | <code>&quot;Prodotti particolari&quot;</code> | 
| PASSIONE_BLU | <code>string</code> | <code>&quot;&quot;</code> | 
| deleteKey | <code>string</code> | <code>null</code> | 

<a name="linksEmissioneAuto"></a>

## linksEmissioneAuto : <code>enum</code>
Enum Links Emissione Auto

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| EMISSIONE | <code>Object</code> | <code>{&quot;PREVENTIVO_MOTOR&quot;:&quot;Preventivo Motor&quot;,&quot;FLOTTE_CONVENZIONI&quot;:&quot;Flotte e convenzioni&quot;,&quot;deleteKey&quot;:&quot;&quot;}</code> | 
| PRODOTTI_PARTICOLARI | <code>Object</code> | <code>{&quot;ASSUNZIONE_GUIDATA&quot;:&quot;Assunzione guidata (con cod. di autorizz.)&quot;,&quot;VEICOLI_EPOCA&quot;:&quot;Veicoli d&#x27;epoca durata 10 giorni&quot;,&quot;LIBRI_MATRICOLA&quot;:&quot;Libri matricola&quot;,&quot;KASKO_ARD_DIPENDENDI_MISSIONE&quot;:&quot;Kasko e ARD per &#x27;Dipendenti in Missione&#x27;&quot;,&quot;POLIZZA_APERTA&quot;:&quot;Polizza aperta&quot;,&quot;COASSICURAZIONE&quot;:&quot;Coassicurazione&quot;,&quot;deleteKey&quot;:&quot;&quot;}</code> | 
| PASSIONE_BLU | <code>Object</code> | <code>{&quot;NUOVA_POLIZZA&quot;:&quot;Nuova polizza&quot;,&quot;NUOVA_POLIZZA_GUIDATA&quot;:&quot;Nuova polizza Guidata&quot;,&quot;NUOVA_POLIZZA_COASSICURAZIONE&quot;:&quot;Nuova polizza Coassicurazione&quot;,&quot;deleteKey&quot;:&quot;&quot;}</code> | 

<a name="Client"></a>

## Client
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Nome del cliente |
| address | <code>string</code> | Indirizzo del cliente |

