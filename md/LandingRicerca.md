## Classes

<dl>
<dt><a href="#LandingRicerca">LandingRicerca</a></dt>
<dd><p>Classe per utilizzare la Landing Ricerca di Matrix Web</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#StatoCliente">StatoCliente</a> : <code>&#x27;E&#x27;</code> | <code>&#x27;P&#x27;</code> | <code>&#x27;C&#x27;</code></dt>
<dd></dd>
<dt><a href="#TipoCliente">TipoCliente</a> : <code>&#x27;PF&#x27;</code> | <code>&#x27;PG&#x27;</code></dt>
<dd></dd>
</dl>

<a name="LandingRicerca"></a>

## LandingRicerca
Classe per utilizzare la Landing Ricerca di Matrix Web

**Kind**: global class  
**Author**: Andrea 'Bobo' Oboe & Kevin Pusateri  

* [LandingRicerca](#LandingRicerca)
    * [.clickTabClients()](#LandingRicerca.clickTabClients)
    * [.clickTabSales()](#LandingRicerca.clickTabSales)
    * [.clickTabMieInfo()](#LandingRicerca.clickTabMieInfo)
    * [.checkSubTabMieInfo()](#LandingRicerca.checkSubTabMieInfo)
    * [.checkNotExistMieInfo()](#LandingRicerca.checkNotExistMieInfo)
    * [.clickSubTabMieInfo(subTab)](#LandingRicerca.clickSubTabMieInfo)
    * [.searchRandomClient(filtri, tipoCliente, statoCliente)](#LandingRicerca.searchRandomClient)
    * [.search(value)](#LandingRicerca.search)
    * [.clickFirstResult()](#LandingRicerca.clickFirstResult)
    * [.clickRandomResult([clientForm], [clientType])](#LandingRicerca.clickRandomResult)
    * [.searchAndClickClientePF(cognome)](#LandingRicerca.searchAndClickClientePF)
    * [.clickClientePF(fullName)](#LandingRicerca.clickClientePF)
    * [.clickClientePG(fullName)](#LandingRicerca.clickClientePG)
    * [.checkBucaRicercaSuggerrimenti(pageLanding)](#LandingRicerca.checkBucaRicercaSuggerrimenti)
    * [.checkRicercaClassica()](#LandingRicerca.checkRicercaClassica)
    * [.checkNotExistRicercaClassica()](#LandingRicerca.checkNotExistRicercaClassica)
    * [.clickRicercaClassicaLabel(link)](#LandingRicerca.clickRicercaClassicaLabel)
    * [.checkRisultatiRicerca()](#LandingRicerca.checkRisultatiRicerca)
    * [.filtraRicerca(statoCliente)](#LandingRicerca.filtraRicerca)
    * [.checkSuggestedLinks(value)](#LandingRicerca.checkSuggestedLinks)
    * [.checkNotExistSuggestLinks(suggestLink)](#LandingRicerca.checkNotExistSuggestLinks)
    * [.checkLeMieInfo()](#LandingRicerca.checkLeMieInfo)
    * [.checkClients()](#LandingRicerca.checkClients)
    * [.checkAggancioCircolari()](#LandingRicerca.checkAggancioCircolari)
    * [.checkButtonRicercaClassica()](#LandingRicerca.checkButtonRicercaClassica)
    * [.checkTabDopoRicerca()](#LandingRicerca.checkTabDopoRicerca)
    * [.checkTabSuggerimentiRicerca()](#LandingRicerca.checkTabSuggerimentiRicerca)
    * [.checkClienteNotFound()](#LandingRicerca.checkClienteNotFound)

<a name="LandingRicerca.clickTabClients"></a>

### LandingRicerca.clickTabClients()
Click tab Clients

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.clickTabSales"></a>

### LandingRicerca.clickTabSales()
Click tab Clients

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.clickTabMieInfo"></a>

### LandingRicerca.clickTabMieInfo()
Click tab Mie Info

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkSubTabMieInfo"></a>

### LandingRicerca.checkSubTabMieInfo()
Effettua Check dei subtab di Miei Info

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkNotExistMieInfo"></a>

### LandingRicerca.checkNotExistMieInfo()
Verifica che non sia presente Il tab "Le mie info"

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.clickSubTabMieInfo"></a>

### LandingRicerca.clickSubTabMieInfo(subTab)
Click subTab da "Le mie Info"

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Description |
| --- | --- | --- |
| subTab | [<code>SubTabsMieInfo</code>](#SubTabsMieInfo) | Nome subTab |

<a name="LandingRicerca.searchRandomClient"></a>

### LandingRicerca.searchRandomClient(filtri, tipoCliente, statoCliente)
Effettua una ricerca Radnom di un Cliente in base ai parametri impostati

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Description |
| --- | --- | --- |
| filtri | <code>boolean</code> | se true, imposta filtri aggiuntivi di ricerca, altrimenti no |
| tipoCliente | [<code>TipoCliente</code>](#TipoCliente) | Tipo Cliente |
| statoCliente | [<code>StatoCliente</code>](#StatoCliente) | Stato Cliente |

<a name="LandingRicerca.search"></a>

### LandingRicerca.search(value)
Ricerca un valore nella buca di ricerca

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Cosa ricercare |

<a name="LandingRicerca.clickFirstResult"></a>

### LandingRicerca.clickFirstResult()
Clicca sul primo risultato della buca di ricerca

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.clickRandomResult"></a>

### LandingRicerca.clickRandomResult([clientForm], [clientType])
Seleziona un Cliente Random dalla lista di ricerca ritornata

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Default |
| --- | --- | --- |
| [clientForm] | [<code>TipoCliente</code>](#TipoCliente) | <code>PG</code> | 
| [clientType] | [<code>StatoCliente</code>](#StatoCliente) | <code>P</code> | 

<a name="LandingRicerca.searchAndClickClientePF"></a>

### LandingRicerca.searchAndClickClientePF(cognome)
Effettua la ricerca e seleziona un cliente PF attraverso il suo cognome

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Description |
| --- | --- | --- |
| cognome | <code>string</code> | da ricerca |

<a name="LandingRicerca.clickClientePF"></a>

### LandingRicerca.clickClientePF(fullName)
Clicca il risultato della ricerca attraverso il suo nome completo Persona Fisica

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type |
| --- | --- |
| fullName | <code>string</code> | 

<a name="LandingRicerca.clickClientePG"></a>

### LandingRicerca.clickClientePG(fullName)
Clicca il risultato della ricerca attraverso il suo nome completo Persona Giuridica

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type |
| --- | --- |
| fullName | <code>string</code> | 

<a name="LandingRicerca.checkBucaRicercaSuggerrimenti"></a>

### LandingRicerca.checkBucaRicercaSuggerrimenti(pageLanding)
Effettua un check sui Suggerimenti in Buca di Ricerca

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Description |
| --- | --- | --- |
| pageLanding | <code>string</code> | nome della pagina |

<a name="LandingRicerca.checkRicercaClassica"></a>

### LandingRicerca.checkRicercaClassica()
Effettua un check sulla Ricerca Classica

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkNotExistRicercaClassica"></a>

### LandingRicerca.checkNotExistRicercaClassica()
Verifica che non sia presente il button "Ricerca Classica"

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.clickRicercaClassicaLabel"></a>

### LandingRicerca.clickRicercaClassicaLabel(link)
Click sul link della Ricerca Classica

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type |
| --- | --- |
| link | <code>string</code> | 

<a name="LandingRicerca.checkRisultatiRicerca"></a>

### LandingRicerca.checkRisultatiRicerca()
Check Risultati Ricerca

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.filtraRicerca"></a>

### LandingRicerca.filtraRicerca(statoCliente)
Filtra la ricerca per lo Stato del Cliente

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Description |
| --- | --- | --- |
| statoCliente | [<code>StatoCliente</code>](#StatoCliente) | Stato Cliente |

<a name="LandingRicerca.checkSuggestedLinks"></a>

### LandingRicerca.checkSuggestedLinks(value)
Check Link Suggeriti

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Keywork da cercare (in base alla keyword vengono dei suggerimenti di default correlati) |

<a name="LandingRicerca.checkNotExistSuggestLinks"></a>

### LandingRicerca.checkNotExistSuggestLinks(suggestLink)
Verifica che non ci siano i link suggeriti

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  

| Param | Type |
| --- | --- |
| suggestLink | <code>\*</code> | 

<a name="LandingRicerca.checkLeMieInfo"></a>

### LandingRicerca.checkLeMieInfo()
Check Mie Info

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkClients"></a>

### LandingRicerca.checkClients()
Check Clients

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkAggancioCircolari"></a>

### LandingRicerca.checkAggancioCircolari()
Check Aggancio Circolari

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkButtonRicercaClassica"></a>

### LandingRicerca.checkButtonRicercaClassica()
Check Button Ricerca Classica

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkTabDopoRicerca"></a>

### LandingRicerca.checkTabDopoRicerca()
Verifica i tab(Clients,sales,Le mie info) presenti dopoaver effettuato la ricerca

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkTabSuggerimentiRicerca"></a>

### LandingRicerca.checkTabSuggerimentiRicerca()
Verifica i tab(Clients,sales,Le mie info) presenti dopoaver effettuato la ricerca

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="LandingRicerca.checkClienteNotFound"></a>

### LandingRicerca.checkClienteNotFound()
Verifica che la ricerca non ha prodotto risultati

**Kind**: static method of [<code>LandingRicerca</code>](#LandingRicerca)  
<a name="SubTabsMieInfo"></a>

## SubTabsMieInfo : <code>enum</code>
Enum Sub Tabs Mie Info

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| CIRCOLARI | <code>string</code> | <code>&quot;Circolari&quot;</code> | 
| COMPANY_HANDBOOK | <code>string</code> | <code>&quot;Company Handbook&quot;</code> | 
| PRODOTTI | <code>string</code> | <code>&quot;Prodotti&quot;</code> | 
| PAGINE | <code>string</code> | <code>&quot;Pagine&quot;</code> | 

<a name="StatoCliente"></a>

## StatoCliente : <code>&#x27;E&#x27;</code> \| <code>&#x27;P&#x27;</code> \| <code>&#x27;C&#x27;</code>
**Kind**: global typedef  
<a name="TipoCliente"></a>

## TipoCliente : <code>&#x27;PF&#x27;</code> \| <code>&#x27;PG&#x27;</code>
**Kind**: global typedef  
