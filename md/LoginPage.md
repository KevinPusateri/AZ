<a name="LoginPage"></a>

## LoginPage
Classe per avvio di Matrix Web e Login

**Kind**: global class  
**Author**: Andrea 'Bobo' Oboe  
<a name="LoginPage.logInMWAdvanced"></a>

### LoginPage.logInMWAdvanced(customImpersonification, mockedNotifications, mockedNews)
Login in MW Advanced

**Kind**: static method of [<code>LoginPage</code>](#LoginPage)  
**Author**: Andrea 'Bobo' Oboe  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| customImpersonification | <code>object</code> |  | default empty, if specified perform a custom impersonification before login |
| mockedNotifications | <code>boolean</code> | <code>true</code> | default a true, mocka le notifiche in atterraggio su MW |
| mockedNews | <code>boolean</code> | <code>true</code> | default a true, mocka le news in atterraggio su MW |

**Example**  
```js
let customImpersonification = {
            "agentId": "ARFPULINI2",
            "agency": "010710000"
        }
```
