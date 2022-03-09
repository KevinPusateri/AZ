<a name="Common"></a>

## Common
Classe Common per varie funzioni Cross Matrix Web

**Kind**: global class  
**Author**: Andrea 'Bobo' Oboe & Kevin Pusateri  

* [Common](#Common)
    * [.canaleFromPopup(chooseUtenza)](#Common.canaleFromPopup)
    * [.getBaseUrl()](#Common.getBaseUrl) ⇒ <code>string</code>
    * [.checkUrlEnv()](#Common.checkUrlEnv)
    * [.visitUrlOnEnv(mockedNotifications, mockedNews)](#Common.visitUrlOnEnv)
    * [.clickByIdOnIframe(id)](#Common.clickByIdOnIframe) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).click()</code>
    * [.clickById(id)](#Common.clickById) ⇒
    * [.clickByTextOnIframe(text)](#Common.clickByTextOnIframe) ⇒ <code>cy.contains(text).should(&#x27;be.visible&#x27;).click()</code>
    * [.clickByText(text)](#Common.clickByText) ⇒
    * [.getByIdOnIframe(id)](#Common.getByIdOnIframe) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;)</code>
    * [.getById(id)](#Common.getById) ⇒
    * [.getByIdAndFindOnIframe(id, idFind)](#Common.getByIdAndFindOnIframe) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).find(idFind)</code>
    * [.getByIdAndFind(id)](#Common.getByIdAndFind) ⇒
    * [.getByIdWithType(i, text)](#Common.getByIdWithType) ⇒
    * [.getByIdWithTypeOnIframe(i, text)](#Common.getByIdWithTypeOnIframe) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).clear().type(text)</code>
    * [.findByIdOnIframe(path)](#Common.findByIdOnIframe) ⇒
    * [.clickFindByIdOnIframe(path)](#Common.clickFindByIdOnIframe) ⇒

<a name="Common.canaleFromPopup"></a>

### Common.canaleFromPopup(chooseUtenza)
Dal popup clicca sulla prima agenzia per accedere alla pagina

**Kind**: static method of [<code>Common</code>](#Common)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| chooseUtenza | <code>boolean</code> | <code>false</code> | : default a false, effettua l'accesso alla seconda finestra dalla homepage |

<a name="Common.getBaseUrl"></a>

### Common.getBaseUrl() ⇒ <code>string</code>
Resituisce l'url in base all'ambiente(env)

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>string</code> - indirizzo url  
<a name="Common.checkUrlEnv"></a>

### Common.checkUrlEnv()
Verifica che l'url sia corretto in base all'ambiente

**Kind**: static method of [<code>Common</code>](#Common)  
**Todo**

- [ ] In ambiente di TEST il check non viene fatto correttamente

<a name="Common.visitUrlOnEnv"></a>

### Common.visitUrlOnEnv(mockedNotifications, mockedNews)
Effettua il visit url nei vari ambienti in base alle variabili settate in cypress.jsonSe Preprod fa il visit su urlMWPreprod altrimenti su urlMWTest (vedi cypress.json)

**Kind**: static method of [<code>Common</code>](#Common)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| mockedNotifications | <code>boolean</code> | <code>true</code> | default true per mockare le Notifice |
| mockedNews | <code>boolean</code> | <code>true</code> | default a true per mockare le News |

<a name="Common.clickByIdOnIframe"></a>

### Common.clickByIdOnIframe(id) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).click()</code>
Click un elemento dentro l'iframe

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).click()</code> - return getIframe().within(() => )  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | tag o attributo del tag |

<a name="Common.clickById"></a>

### Common.clickById(id) ⇒
Click un elemento

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: cy.get(id).should('exist').and('be.visible').click()  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | tag o attributo del tag |

<a name="Common.clickByTextOnIframe"></a>

### Common.clickByTextOnIframe(text) ⇒ <code>cy.contains(text).should(&#x27;be.visible&#x27;).click()</code>
Click su un testo dentro l'iframe

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>cy.contains(text).should(&#x27;be.visible&#x27;).click()</code> - getIframe().within(() => )  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | testo |

<a name="Common.clickByText"></a>

### Common.clickByText(text) ⇒
Click su un testo

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: cy.contains(text).should('be.visible').click()  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | testo |

<a name="Common.getByIdOnIframe"></a>

### Common.getByIdOnIframe(id) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;)</code>
Get elemento da un iframe

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;)</code> - getIframe().within(() => )  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | tag o attributo del tag |

<a name="Common.getById"></a>

### Common.getById(id) ⇒
Get elemento

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: cy.get(id).should('exist').and('be.visible')  
**Link**: https://docs.cypress.io/api/commands/get#Selector  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | tag o attributo del tag |

**Example**  
```js
Common.getById('#body'), Common.getById('input['input']', Common.getById('input['a[href="link"]'])
```
<a name="Common.getByIdAndFindOnIframe"></a>

### Common.getByIdAndFindOnIframe(id, idFind) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).find(idFind)</code>
Get elemento

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).find(idFind)</code> - return getIframe().within(() => )  
**Link**: https://docs.cypress.io/api/commands/find  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | tag o attributo del tag |
| idFind | <code>string</code> | tag o attributo del tag |

**Example**  
```js
cy.get('#parent').find('li')
```
<a name="Common.getByIdAndFind"></a>

### Common.getByIdAndFind(id) ⇒
Get elemento

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: cy.get(id).should('exist').and('be.visible').find(idFind)  
**Link**: https://docs.cypress.io/api/commands/find  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | tag o attributo del tag |

**Example**  
```js
cy.get('#parent').find('li')
```
<a name="Common.getByIdWithType"></a>

### Common.getByIdWithType(i, text) ⇒
Get elemento

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: cy.get(id).should('exist').and('be.visible').clear().type(text)  
**Link**: https://docs.cypress.io/api/commands/type  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>string</code> | tag o attributo del tag |
| text | <code>string</code> | testo |

**Example**  
```js
Common.getByIdWithType('#parent','Ciao, come va?')
```
<a name="Common.getByIdWithTypeOnIframe"></a>

### Common.getByIdWithTypeOnIframe(i, text) ⇒ <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).clear().type(text)</code>
Get elemento Da un Iframe

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>cy.get(id).should(&#x27;exist&#x27;).and(&#x27;be.visible&#x27;).clear().type(text)</code> - getIframe().within(() => )  
**Link**: https://docs.cypress.io/api/commands/type  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>string</code> | tag o attributo del tag |
| text | <code>string</code> | testo |

**Example**  
```js
Common.getByIdWithTypeOnIframe('#f-nome', randomChars)
```
<a name="Common.findByIdOnIframe"></a>

### Common.findByIdOnIframe(path) ⇒
Trova l'elemento tramite la sua path all'interno di un iFrame

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: elemento  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path elemento |

**Example**  
```js
Common.findByIdOnIframe('table[role="grid"]:visible > tbody')
```
<a name="Common.clickFindByIdOnIframe"></a>

### Common.clickFindByIdOnIframe(path) ⇒
Trova l'elemento tramite la sua path all'interno di un iFrame ed effettua il click

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: elemento cliccato per poter effettuare altre operazioni concatenate  

| Param | Type |
| --- | --- |
| path | <code>\*</code> | 

**Example**  
```js
Common.clickFindByIdOnIframe('button:contains("Cancella"):visible')
```
