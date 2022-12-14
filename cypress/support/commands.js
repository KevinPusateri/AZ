// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-file-upload'
const moment = require('moment')
const CryptoJS = require('crypto-js')


const be2beHost = (Cypress.env('currentEnv') === 'TEST') ? Cypress.env('be2beTest') : Cypress.env('be2bePreprod')

//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/**
   * Will check if an iframe is ready for DOM manipulation. Just listening for the
   * load event will only work if the iframe is not already loaded. If so, it is
   * necessary to observe the readyState. The issue here is that Chrome initialises
   * iframes with "about:blank" and sets their readyState to complete. So it is

   * also necessary to check if it's the readyState of the correct target document.
   *
   * Some hints taken and adapted from:
   * https://stackoverflow.com/questions/17158932/how-to-detect-when-an-iframe-has-already-been-loaded/36155560

   *
   * @param $iframe - The iframe element
   */
const isIframeLoaded = $iframe => {
  const contentWindow = $iframe.contentWindow;


  const src = $iframe.attributes.src;
  const href = contentWindow.location.href;
  if (contentWindow.document.readyState === 'complete') {
    return href !== 'about:blank' || src === 'about:blank' || src === '';

  }

  return false;
};


/**
  * Wait for iframe to load, and call callback
  *
  * Some hints taken and adapted from:
  * https://gitlab.com/kgroat/cypress-iframe/-/blob/master/src/index.ts
*/
Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframes => new Cypress.Promise(resolve => {
  const loaded = [];

  $iframes.each((_, $iframe) => {
    loaded.push(
      new Promise(subResolve => {
        if (isIframeLoaded($iframe)) {
          subResolve($iframe.contentDocument.body);
        } else {
          Cypress.$($iframe).on('load.appearHere', () => {
            if (isIframeLoaded($iframe)) {
              subResolve($iframe.contentDocument.body);
              Cypress.$($iframe).off('load.appearHere');
            }
          });
        }
      })
    );
  });

  return Promise.all(loaded).then(resolve);
}));

/**
 * Verifica se l'Iframe è ready per l'utilizzo
 * @todo da veridicare l'addEventListener in base all'iframe
 */
Cypress.Commands.add('isIFrameReady', () => {
  return cy.window().then({ timeout: 10 * 1000 }, window => {
    return new Cypress.Promise(resolve => {
      window.addEventListener('message', e => {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data

        if (data.code === 'Ready') {
          resolve()
        }
      })
    })
  })
})


Cypress.Commands.add('iframeCustom', { prevSubject: 'element' }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.ready(function () {
      resolve($iframe.contents().find('body'));
    })
  })
})

Cypress.Commands.overwrite('clearCookies', () => {
  cy.getCookies({ log: false }).then(cookies => {
    for (const cookie of cookies) {
      cy.clearCookie(cookie.name, {
        log: false
      })
    }
  })
})

Cypress.Commands.add('getIFrame', () => {

  cy.get('iframe').invoke('attr', 'id')
  .then(sometext => cy.log(sometext));
  
  cy.get('iframe').its('0.contentDocument.body').as('iframe')
})

Cypress.Commands.add('getIframeBody', (iframeCode) => {
  // get the iframe > document > body
  // and retry until the body element is not empty
  cy.log('getIframeBody')

  return cy
    .get(iframeCode, { log: false })
    .its('0.contentDocument.body', { log: false }).should('not.be.empty')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    // https://on.cypress.io/wrap
    .then((body) => cy.wrap(body, { log: false }))
})

Cypress.Commands.add('generateTwoLetters', () => {
  var result = '';
  var charactersFirstLetter = 'BCDFGLMNPRSTVZ';
  result += charactersFirstLetter.charAt(Math.floor(Math.random() * charactersFirstLetter.length));

  var charactersSecondLetter = 'AEIOU';
  result += charactersSecondLetter.charAt(Math.floor(Math.random() * charactersSecondLetter.length));
  return result;
})

Cypress.Commands.add('generateTwoLettersForImpresaIndividuale', () => {
  var result = '';
  var charactersFirstLetter = 'BCDFGLMNPRSTVZ';
  result += charactersFirstLetter.charAt(Math.floor(Math.random() * charactersFirstLetter.length));
  result += charactersFirstLetter.charAt(Math.floor(Math.random() * charactersFirstLetter.length));
  return result;
})

Cypress.Commands.add('generateUnicoClienteLabel', () => {
  let currentDateTime = moment().format('DD/MM/YYYY')
  return "Consensi cliente (UNICO) " + currentDateTime + " CLIENTE"
})

Cypress.Commands.add('generateUnicoDirezioneLabel', () => {
  let currentDateTime = moment().format('DD/MM/YYYY')
  return "Consensi cliente (UNICO) " + currentDateTime + " DIREZIONE"
})

Cypress.Commands.add('generateVisuraCameraleLabel', () => {
  let currentDateTime = moment().format('DD/MM/YYYY')
  return "Visura Camerale (Rami Vari) " + currentDateTime
})

Cypress.Commands.add('preserveCookies', () => {
  cy.viewport(1280, 1080)
  Cypress.Cookies.defaults({
    preserve: (cookie) => {
      return true;
    }
  })
})

Cypress.Commands.add('ignoreRequest', () => {
  cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache')
  cy.intercept(/launch-*/, 'ignore').as('launchStaging')
  cy.intercept(/cdn.igenius.ai/, 'ignore').as('igenius')
  cy.intercept(/i.ytimg.com/, 'ignore').as('ytimg')
})

Cypress.Commands.add('forceVisit', url => {
  cy.window().then(win => {
    return win.open(url, '_self');
  });
});


let active_tab_index = 0;
let myTabNames = [];
let myTabs = [];

Cypress.Commands.add('switchToTab', (index_or_name) => {
  return new Cypress.Promise((resolve) => {
    let index = resolve_index_or_name_to_index(index_or_name)
    console.warn('switchToTab', { index, index_or_name })
    active_tab_index = index;
    let winNext = myTabs[active_tab_index]
    if (!winNext) {
      throw new Error('tab missing')
    }
    cy.state('document', winNext.document)
    cy.state('window', winNext)
    debugTabState()
    resolve()
  })
})

function resolve_index_or_name_to_index(index_or_name) {
  let index = parseInt(index_or_name) >= 0 ? index_or_name : active_tab_index || 0
  let name_index = myTabNames.indexOf(index_or_name)
  if (name_index > -1) {
    index = name_index
  }
  return index;
}

Cypress.Commands.add('impersonification', (tutf, getPersUser, getChannel) => {
  //? Se effettuiamo il test via linea internet in PP, non possiamo accedere direttamente ai servizi di BE (assicurarsi di essere prima impersonificati
  //? con la propria utenza tecnica nell'AG corretta)
  if (!Cypress.env('internetTesting'))
    cy.request({
      method: 'POST',
      log: false,
      url: Cypress.env('currentEnv') === 'TEST' ? Cypress.env('profilingUrlTest') + '/profilingManagement/personation/' + tutf : Cypress.env('profilingUrlPreprod') + '/profilingManagement/personation/' + tutf,
      form: true,
      body: { persUser: getPersUser, channel: getChannel }
    }).then(resp => {
      if (resp.status !== 200)
        assert.fail('Impersonificazione non effettuata correttamente!')
      //else
      //cy.wait(2000)
    })
})

//Permettere di ritornare le chiavi di profilazioni in base all'utente passato
Cypress.Commands.add('getProfiling', (tutf) => {
  cy.task('getWinUserLogged').then((loggedUser) => {

    cy.fixture("tutf").then(data => {
      let user = data.users.filter(obj => {
        return obj.userName === loggedUser.username.toUpperCase()
      })

      //Nel caso sia su TFS, per eventuali run in parallelo, utilizzo la TUTF003 per AVIVA e la TUTF078 per AZ
      if (user.length > 1)
        (Cypress.env('isAviva')) ? user = user.filter(obj => { return obj.agency.startsWith('14') })[0] : user = user.filter(obj => { return !obj.agency.startsWith('14') })[0]
      else
        user = user[0]

      cy.request({
        method: 'GET',
        log: false,
        url: Cypress.env('currentEnv') === 'TEST' ? Cypress.env('profilingUrlTest') + '/daprofiling/profile/' + user.tutf : Cypress.env('profilingUrlPreprod') + '/daprofiling/profile/' + user.tutf
      }).then(resp => {
        if (resp.status !== 200)
          throw new Error('Recupero Profiling fallito')
        else
          return resp.body
      })
    })
  })
})

Cypress.Commands.add('profilingLinksMenu', (tutf, keysLinks) => {

  for (let key in keysLinks) {
    cy.slugMieInfo(tutf, key.toString()).then((stateKey) => {
      if (!stateKey) {
        keysLinks[key] = false
      }
    })
  }
})

Cypress.Commands.add('filterProfile', (profileArray, key) => {
  let filtered = profileArray.filter(el => {
    return el.name === key
  })

  return (filtered.length > 0) ? true : false
})


//Permettere di verificare se una sezione delle mie info è presente o meno
Cypress.Commands.add('slugMieInfo', (tutf, section) => {
  cy.request({
    method: 'POST',
    log: true,
    failOnStatusCode: false,
    url: Cypress.env('currentEnv') === 'TEST' ? Cypress.env('mieInfoCloudTE') + '/lemieinfo/middleware/api/v1/query-entities/slug' : Cypress.env('mieInfoCloudPP') + '/lemieinfo/middleware/api/v1/query-entities/slug',
    headers: {
      'Portaluser': tutf,
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    body: '["' + section + '"]'
  }).then(resp => {
    if (resp.status === 404 || resp.status === 403)
      return false
    else if (resp.status === 200) {
      let jsonReponse = JSON.parse(resp.body)
      return true
    }
    else {
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error is', e)
        console.log('runnable', runnable)
        throw new Error('Errore durante la chiamata slug mie info (Slug: ' + section + ')')

      })
    }
  })
})

Cypress.Commands.add('getPartyRelations', () => {
  cy.getUserWinLogin().then(data => {
    cy.generateTwoLetters().then(nameRandom => {
      cy.generateTwoLetters().then(firstNameRandom => {
        cy.request({
          method: 'GET',
          retryOnStatusCodeFailure: true,
          timeout: 60000,
          log: false,
          url: be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person',
          headers: {
            'x-allianz-user': data.tutf
          }
        }).then(response => {
          if (response.body.length === 0)
            cy.getPartyRelations()
          else {
            let clientiPotenziali = response.body.filter(el => {
              return el.partyCategory[0] === 'P'
            })

            if (clientiPotenziali.length > 0) {
              let currentClient = clientiPotenziali[Math.floor(Math.random() * clientiPotenziali.length)]
              cy.request({
                method: 'GET',
                retryOnStatusCodeFailure: true,
                log: false,
                timeout: 120000,
                url: be2beHost + '/daanagrafe/CISLCore/parties/' + currentClient.customerNumber + '/partyrelations/',
                headers: {
                  'x-allianz-user': data.tutf
                }
              }).then(responsePartyRelations => {
                //Verifico che i legami presenti siano almeno 2
                if (responsePartyRelations.body.length === 0 || responsePartyRelations.body.length === 1)
                  cy.getPartyRelations()
                else {
                  let filteredRelations = responsePartyRelations.body.filter(el => {
                    return (!el.relatedParty.includes(currentClient.customerNumber) && el.extEntity.groupRelationDescription !== 'Aderente')
                  })
                  if (filteredRelations.length === 0)
                    cy.getPartyRelations()
                  else {
                    cy.request({
                      method: 'GET',
                      retryOnStatusCodeFailure: true,
                      log: false,
                      timeout: 120000,
                      url: be2beHost + '/daanagrafe/CISLCore' + filteredRelations[0].relatedParty,
                      headers: {
                        'x-allianz-user': data.tutf
                      }
                    }).then(currentRelatedParty => {
                      return [currentClient, currentRelatedParty.body]
                    })
                  }
                }
              })
            }
            else
              cy.getPartyRelations()
          }
        })
      })
    })
  })
})

/**
 * Verifica la presenza delle convenzioni, e in caso ne effettua la cancellazione se specificato
 * @param {String} tutf tutf utilizzata negli headers per invocare i servizi in x-allianz-user
 * @param {String} branchId tipo di polizza da trovare (31 [AU], 11 [RV], 42 [Ultra + Allianz1], 86 [VI])
 * @param {boolean} isUltra default a false, da specificare a true se si ricercano polizze Ultra (altrimenti si confondono con quelle allianz1)
 * @param {boolean} isAZ1 default a false, da specificare a true se si ricercano polizze AZ1 Business
 * @param {String} clientType default a PF, specifica il tipo di cliente da trovare tra PF e PG
 */
Cypress.Commands.add('getClientWithPolizze', (tutf, branchId, isUltra = false, isAZ1 = false, clientType = 'PF', isFixedSearch = false, clientToAnalyze = 0) => {

  if (isFixedSearch) {
    let nameRandom = 'RO'
    let firstNameRandom = 'MA'

    cy.request({
      method: 'GET',
      retryOnStatusCodeFailure: true,
      timeout: 60000,
      log: false,
      url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
        : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
      headers: {
        'x-allianz-user': tutf
      }
    }).then(response => {

      //Verifichiamo solo clienti in stato EFFETTIVO
      let clientiEffettivi = response.body.filter(el => {
        return el.partyCategory[0] === 'E'
      })

      try {
        let currentClient = clientiEffettivi[clientToAnalyze]
        cy.log('Cliente in analisi : ' + currentClient.customerNumber)
        //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
        cy.request({
          method: 'GET',
          retryOnStatusCodeFailure: true,
          timeout: 60000,
          log: false,
          url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
          headers: {
            'x-allianz-user': tutf
          }
        }).then(responseContracts => {
          //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
          let contractsWithBranchId
          if (isUltra)
            contractsWithBranchId = responseContracts.body.filter(el => {
              return (el.branchId.includes(branchId) && el.branchName.includes('ULTRA'))
            })
          else if (isAZ1)
            contractsWithBranchId = responseContracts.body.filter(el => {
              return (el.branchId.includes(branchId) && el.branchName.includes('ALLIANZ1'))
            })
          else
            contractsWithBranchId = responseContracts.body.filter(el => {
              return el.branchId.includes(branchId)
            })

          if (contractsWithBranchId.length > 0) {
            return currentClient.name + ' ' + currentClient.firstName
          }
          else
            cy.getClientWithPolizze(tutf, branchId, isUltra, isAZ1, clientType, true, clientToAnalyze + 1)
        })

      } catch (error) {
        return ""
      }
    })
  }
  else {
    cy.generateTwoLetters().then(nameRandom => {
      cy.generateTwoLetters().then(firstNameRandom => {
        cy.request({
          method: 'GET',
          retryOnStatusCodeFailure: true,
          timeout: 60000,
          log: false,
          url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
            : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
          headers: {
            'x-allianz-user': tutf
          }
        }).then(response => {
          if (response.body.length === 0)
            cy.getClientWithPolizze(tutf, branchId, isUltra, isAZ1, clientType)
          else {
            //Verifichiamo solo clienti in stato EFFETTIVO
            let clientiEffettivi = response.body.filter(el => {
              return el.partyCategory[0] === 'E'
            })

            if (clientiEffettivi.length > 0) {
              let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]
              //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
              cy.request({
                method: 'GET',
                retryOnStatusCodeFailure: true,
                timeout: 60000,
                log: false,
                url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
                headers: {
                  'x-allianz-user': tutf
                }
              }).then(responseContracts => {
                //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
                let contractsWithBranchId
                if (isUltra)
                  contractsWithBranchId = responseContracts.body.filter(el => {
                    return (el.branchId.includes(branchId) && el.branchName.includes('ULTRA'))
                  })
                else if (isAZ1)
                  contractsWithBranchId = responseContracts.body.filter(el => {
                    return (el.branchId.includes(branchId) && el.branchName.includes('ALLIANZ1'))
                  })
                else
                  contractsWithBranchId = responseContracts.body.filter(el => {
                    return el.branchId.includes(branchId)
                  })

                if (contractsWithBranchId.length > 0) {
                  return currentClient.name + ' ' + currentClient.firstName
                }
                else
                  cy.getClientWithPolizze(tutf, branchId, isUltra, isAZ1, clientType)
              })
            }
            else
              cy.getClientWithPolizze(tutf, branchId, isUltra, isAZ1, clientType)
          }
        })
      })
    })
  }
})

/**
 * Metodo very extreme : ricerca un cliente censito in almeno due agenzie di un HUB (in questo caso sulla 1-710000 e 73-552) e in particolare sulla seconda
 * verifica che non ci siano polizze del branchId specificato che sono invece presenti sulla prima
 * !!! attualmente operante su polizze Vita
 * !!! attenzione che opera SOLO sugli HUB della 1-710000 (FRANCESCO PULINI) e 1-375000 (ALBERTO LONGO)
 * @param {String} agencyMain agenzia principale dell'HUB dove ricercare il cliente con polizze vive (a scelta tra 010710000 3 010375000)
 * @param {number} branchId tipo di polizza da trovare (80 [VI]) -> viene automaticamente creato un array di branch
 * @param {boolean} isUltra default a false, da specificare a true se si ricercano polizze Ultra (altrimenti si confondono con quelle allianz1)
 * @param {boolean} isAZ1 default a false, da specificare a true se si ricercano polizze AZ1 Business
 * @param {String} clientType default a PF, specifica il tipo di cliente da trovare tra PF e PG
 * @param {String} fixedPIorSSN default a '', se specificato effettuo la ricerca su un cliente PF in base al suo CF, se PG in base alla sua PI
 */
Cypress.Commands.add('getClientInDifferentAgenciesWithPolizze', (agencyMain, branchId, isUltra = false, isAZ1 = false, clientType = 'PF', fixedPIorSSN = '') => {
  //Creiamo range di branchID in base a quella di partenza
  let branchRange = [
    branchId.toString() + ' ',
    (branchId + 1).toString() + ' ',
    (branchId + 2).toString() + ' ',
    (branchId + 3).toString() + ' ',
    (branchId + 4).toString() + ' ',
    (branchId + 5).toString() + ' ',
    (branchId + 6).toString() + ' ',
  ]

  let found = false
  let impersonificationToReturn
  let agencyToReturn
  let currentClient

  let agentId = (agencyMain === '010710000') ? 'ARFPULINI2' : 'ARALONGO7'
  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {

      let mainSearch
      if (clientType === 'PF') {
        if (fixedPIorSSN === '')
          mainSearch = be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
        else
          mainSearch = be2beHost + '/daanagrafe/CISLCore/parties?socialSecurityNumber=' + fixedPIorSSN + '&partySign=Person'
      }
      else {
        if (fixedPIorSSN === '')
          mainSearch = be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&partySign=Company'
        else
          mainSearch = be2beHost + '/daanagrafe/CISLCore/parties?vatIN=' + fixedPIorSSN + '&partySign=Company'
      }

      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: mainSearch,
        headers: {
          'x-allianz-user': agentId
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientInDifferentAgenciesWithPolizze(agencyMain, branchId, isUltra, isAZ1, clientType, fixedPIorSSN)
        else {
          //Verifichiamo solo clienti in stato EFFETTIVO
          let clientiEffettivi = response.body.filter(el => {
            return (el.partyCategory[0] === 'E' || el.partyCategory[0] === '')
          })

          if (clientiEffettivi.length > 0) {
            currentClient = (fixedPIorSSN === '') ? clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)] : clientiEffettivi[0]
            //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
              headers: {
                'x-allianz-user': agentId
              }
            }).then(responseContracts => {
              //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
              let contractsWithBranchId
              if (isUltra)
                contractsWithBranchId = responseContracts.body.filter(el => {
                  if (branchRange.some(ids => el.branchId.includes(ids)))
                    return el.branchName.includes('ULTRA')
                })
              else if (isAZ1)
                contractsWithBranchId = responseContracts.body.filter(el => {
                  if (branchRange.some(ids => el.branchId.includes(ids)))
                    return el.branchName.includes('ALLIANZ1')
                })
              else
                contractsWithBranchId = responseContracts.body.filter(el => {
                  if (branchRange.some(ids => el.branchId.includes(ids)))
                    return el
                })
              if (contractsWithBranchId.length > 0) {
                //Verifica che il cliente sia presente anche in altre agenzie
                let possibleImpersonifications = (agencyMain === '010710000') ? [
                  { account: 'PULINIFR.0552', agency: '730000552', codAgency: '552' },
                  { account: 'ARFPULINI3', agency: '010748000', codAgency: '748000' },
                  { account: 'AZFPULINI', agency: '050000851', codAgency: '851' },
                  { account: 'ASFPULINI2', agency: '070004266', codAgency: '4266' }
                ] :
                  [
                    { account: 'ARALONGO20', agency: '010523000', codAgency: '523000' },
                    { account: 'AMALONGO', agency: '020002002', codAgency: '2002' }
                  ]
                for (let i = 0; i < possibleImpersonifications.length; i++) {
                  let parsedClient = ''
                  console.log('Try with ' + currentClient.name)
                  cy.request({
                    method: 'GET',
                    retryOnStatusCodeFailure: true,
                    timeout: 60000,
                    log: false,
                    url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + currentClient.name + '&firstName=' + currentClient.firstName + '&partySign=Person'
                      : be2beHost + '/daanagrafe/CISLCore/parties?vatIN=' + currentClient.vatIN + '&partySign=Company',
                    headers: {
                      'x-allianz-user': possibleImpersonifications[i].account
                    }
                  }).then((responseParties) => {
                    parsedClient = responseParties.body[0].self.split('/')[2]
                    if (responseParties.status === 200 && parsedClient !== '0' && responseParties.body.length > 0) {
                      //Verifichiamo che siano presenti polizze e che non ce ne siano nel branchId passato
                      cy.request({
                        method: 'GET',
                        retryOnStatusCodeFailure: true,
                        timeout: 60000,
                        log: false,
                        url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + parsedClient + '&contractProcessState=Contract&status=Live',
                        headers: {
                          'x-allianz-user': possibleImpersonifications[i].account
                        }
                      }).then(resp => {
                        console.log('Try with ' + currentClient.name)
                        //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato (SUCESSIVAMENTE EFFETTUO LA NEGAZIONE)
                        let contractsWithBranchIdFinal
                        if (isUltra)
                          contractsWithBranchIdFinal = resp.body.filter(el => {
                            if (branchRange.some(ids => el.branchId.includes(ids)))
                              return el.branchName.includes('ULTRA')
                          })
                        else if (isAZ1)
                          contractsWithBranchIdFinal = resp.body.filter(el => {
                            if (branchRange.some(ids => el.branchId.includes(ids)))
                              return el.branchName.includes('ALLIANZ1')
                          })
                        else
                          contractsWithBranchIdFinal = resp.body.filter(el => {
                            if (branchRange.some(ids => el.branchId.includes(ids)))
                              return el
                          })
                        //Se non ce ne sono ma ci sono altre polizze procedo
                        if (contractsWithBranchIdFinal.length === 0) {
                          //Verifico gli accountmanagers
                          cy.request({
                            method: 'GET',
                            retryOnStatusCodeFailure: true,
                            timeout: 60000,
                            log: false,
                            url: be2beHost + '/daanagrafe/CISLCore/parties/' + parsedClient + '/accountmanagers/',
                            headers: {
                              'x-allianz-user': possibleImpersonifications[i].account
                            }
                          }).then(respAccount => {
                            if (resp.status !== 200)
                              cy.getClientInDifferentAgenciesWithPolizze(agencyMain, branchId, isUltra, isAZ1, clientType, fixedPIorSSN)
                            else {
                              if (respAccount.body.length > 0) {
                                if (!found) {
                                  found = true
                                  impersonificationToReturn = possibleImpersonifications[i]
                                  agencyToReturn = possibleImpersonifications[i].codAgency
                                }
                              }
                            }
                          })
                        }
                      })
                    }
                  })
                }
                cy.then(() => {
                  if (found)
                    return { clientToUse: currentClient, impersonificationToUse: impersonificationToReturn, agencyToVerify: agencyToReturn }
                  else
                    cy.getClientInDifferentAgenciesWithPolizze(agencyMain, branchId, isUltra, isAZ1, clientType, fixedPIorSSN)
                })
              }
              else
                cy.getClientInDifferentAgenciesWithPolizze(agencyMain, branchId, isUltra, isAZ1, clientType, fixedPIorSSN)
            })
          }
          else
            cy.getClientInDifferentAgenciesWithPolizze(agencyMain, branchId, isUltra, isAZ1, clientType, fixedPIorSSN)
        }
      })
    })
  })
})

/**
 * Verifica la presenza di un cliente con almeno una polizza per effettuare l'annullamento
 * @param {String} tutf tutf utilizzata negli headers per invocare i servizi in x-allianz-user
 * @param {String} branchId tipo di polizza da trovare (31 [AU], 11 [RV], 42 [Ultra + Allianz1], 86 [VI])
 * @param {String} state default a annulla(Vendita), da specificare a 'sospesa' se si vuole fare Sospensione(cod 30;sottoCod 00)
 * @param {boolean} isUltra default a false, da specificare a true se si ricercano polizze Ultra (altrimenti si confondono con quelle allianz1)
 * @param {boolean} isAZ1 default a false, da specificare a true se si ricercano polizze AZ1 Business
 * @param {String} clientType default a PF, specifica il tipo di cliente da trovare tra PF e PG
 * 
 */
Cypress.Commands.add('getClientWithPolizzeAnnullamento', (tutf, branchId, state = 'annulla', isUltra = false, isAZ1 = false, clientType = 'PF') => {
  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
        headers: {
          'x-allianz-user': tutf
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientWithPolizzeAnnullamento(tutf, state, branchId, isUltra, isAZ1, clientType)
        else {
          //Verifichiamo solo clienti in stato EFFETTIVO
          let clientiEffettivi = response.body.filter(el => {
            return el.partyCategory[0] === 'E'
          })

          if (clientiEffettivi.length > 0) {
            let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]
            //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
              headers: {
                'x-allianz-user': tutf
              }
            }).then(responseContracts => {
              //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
              let contractsWithBranchId
              let contractsWithScadenza
              if (isUltra)
                contractsWithBranchId = responseContracts.body.filter(el => {
                  return (el.branchId.includes(branchId) && el.branchName.includes('ULTRA'))
                })
              else if (isAZ1)
                contractsWithBranchId = responseContracts.body.filter(el => {
                  return (el.branchId.includes(branchId) && el.branchName.includes('ALLIANZ1'))
                })
              else
                contractsWithBranchId = responseContracts.body.filter(el => {
                  return el.branchId.includes(branchId)
                })
              if (contractsWithBranchId.length > 0) {
                var options = {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                }
                contractsWithScadenza = contractsWithBranchId.filter(el => {
                  return el.paymentFrequency.includes('Annuale')// && (formatDate > currentDate)
                })
                if (contractsWithScadenza.length > 0) {
                  var datePolizzaScadenza = contractsWithScadenza.filter(el => {

                    //trovo p
                    var date = el._meta.metaInfoEntries[0].messages[3].message
                    var dateSplited = date.replaceAll('-', '/').split('/')
                    var newdate = dateSplited[1] + '/' + dateSplited[0] + '/' + dateSplited[2];
                    let formatDate = new Date(newdate)
                    let currentDate = new Date()

                    // Verifico che la polizza non sia già sospesa
                    if (state === 'sospesa') {
                      var stato = el.amendments[0].reason.toLowerCase().includes('sospensione')
                      if ((formatDate > currentDate) && stato == false)
                        return el
                    }
                    else {
                      var stato = el.amendments[0].reason.toLowerCase().includes('sospensione')
                      if (stato == false && (formatDate > currentDate))
                        return el
                      else
                        cy.getClientWithPolizzeAnnullamento(tutf, state, branchId, isUltra, isAZ1, clientType)

                    }
                  })

                  if (datePolizzaScadenza.length > 0) {
                    var polizza = {
                      customerNumber: currentClient.customerNumber,
                      customerName: currentClient.name + ' ' + currentClient.firstName,
                      numberPolizza: datePolizzaScadenza[0].bundleNumber
                    }
                    return polizza
                  } else
                    cy.getClientWithPolizzeAnnullamento(tutf, state, branchId, isUltra, isAZ1, clientType)
                } else
                  cy.getClientWithPolizzeAnnullamento(tutf, state, branchId, isUltra, isAZ1, clientType)
              }
              else
                cy.getClientWithPolizzeAnnullamento(tutf, state, branchId, isUltra, isAZ1, clientType)
            })
          }
          else
            cy.getClientWithPolizzeAnnullamento(tutf, state, branchId, isUltra, isAZ1, clientType)
        }
      })
    })
  })
})

Cypress.Commands.add('getClientWithConsensoOTP', (tutf, state = 'annulla', clientType = 'PF', agenciesToAnalize = null, currentAgency = null, trial = 20) => {
  cy.fixture("agencies").then(agenciesFromFixture => {
    if (agenciesToAnalize === null) {
      currentAgency = agenciesFromFixture.shift()
      cy.log('Perform impersonification on ' + currentAgency.agency)
      cy.impersonification(tutf, currentAgency.agentId, currentAgency.agency)
    }
    else if (trial === 0) {
      if (agenciesToAnalize.length > 0) {
        currentAgency = agenciesToAnalize.shift()
        cy.log('Get next agency : ' + currentAgency.agency)
        cy.log('Perform impersonification on ' + currentAgency.agency)
        cy.impersonification(tutf, currentAgency.agentId, currentAgency.agency)
        cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesToAnalize, currentAgency)
        return
      }
      else {
        cy.log("--------- RIPROVIAMO ---------")
        cy.getClientWithConsensoOTP(tutf)
        return
      }
    }
    else
      agenciesFromFixture = agenciesToAnalize

    cy.log('Trial ' + trial + ' for agency ' + currentAgency.agency)
    let newTrial = trial - 1

    cy.generateTwoLetters().then(nameRandom => {
      cy.generateTwoLetters().then(firstNameRandom => {
        cy.request({
          method: 'GET',
          retryOnStatusCodeFailure: true,
          timeout: 60000,
          log: false,
          url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
            : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
          headers: {
            'x-allianz-user': tutf
          }
        }).then(response => {
          if (response.status !== 200)
            cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
          if (response.body.length === 0) {
            cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
          }
          else {
            //Verifichiamo solo clienti in stato EFFETTIVO
            let clientiEffettivi = response.body.filter(el => {
              return el.partyCategory[0] === 'E'
            })

            if (clientiEffettivi.length > 0) {
              let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]

              //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
              cy.request({
                method: 'GET',
                retryOnStatusCodeFailure: true,
                timeout: 60000,
                log: false,
                url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
                headers: {
                  'x-allianz-user': tutf
                }
              }).then(responseContracts => {
                if (responseContracts.status !== 200)
                  cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
                let contractsWithBranchId
                contractsWithBranchId = responseContracts.body.filter(el => {
                  return el.branchId.includes('31')
                })
                if (contractsWithBranchId.length > 0) {
                  let contractsWithScadenza = contractsWithBranchId.filter(el => {
                    return el.paymentFrequency.includes('Annuale')
                  })
                  if (contractsWithScadenza.length > 0) {
                    var datePolizzaScadenza = contractsWithScadenza.filter(el => {

                      var date = el._meta.metaInfoEntries[0].messages[3].message
                      var dateSplited = date.replaceAll('-', '/').split('/')
                      var newdate = dateSplited[1] + '/' + dateSplited[0] + '/' + dateSplited[2];
                      let formatDate = new Date(newdate)
                      let currentDate = new Date()

                      // Verifico che la polizza non sia già sospesa
                      if (state === 'sospesa') {
                        var stato = el.amendments[0].reason.toLowerCase().includes('sospensione')
                        if ((formatDate > currentDate) && stato == false)
                          return el
                      }
                      else {
                        var stato = el.amendments[0].reason.toLowerCase().includes('sospensione')
                        if (stato == false && (formatDate > currentDate))
                          return el
                      }
                    })

                    if (datePolizzaScadenza.length > 0) {
                      var polizza = {
                        customerNumber: currentClient.customerNumber,
                        customerName: currentClient.name + ' ' + currentClient.firstName,
                        numberPolizza: datePolizzaScadenza[0].bundleNumber,
                        agentId: currentAgency.agentId,
                        agency: currentAgency.agency
                      }
                      cy.request({
                        method: 'GET',
                        retryOnStatusCodeFailure: true,
                        timeout: 60000,
                        log: false,
                        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties/' + currentClient.customerNumber + '/dataconsentagreements/ConsensoOTP_Allianz'
                          : be2beHost + '/daanagrafe/CISLCore/parties/' + currentClient.customerNumber + '/dataconsentagreements/ConsensoOTP_Allianz',
                        headers: {
                          'x-allianz-user': tutf
                        }
                      }).then(responseConsenso => {
                        if (responseConsenso.status !== 200)
                          cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                        let consensoOtpActive = responseConsenso.body.rejectionReason.includes('1')
                        if (consensoOtpActive) {
                          cy.getUserProfileToken(tutf).then(userProfileToken => {
                            //Verifichiamo se il cliente è in buca di ricerca di MW
                            cy.isClientInBuca(userProfileToken, currentAgency.agencies, polizza.customerName).then(isInBuca => {
                              if (isInBuca)
                                cy.isClientAccessible(userProfileToken, currentAgency.agentId, polizza.customerNumber).then(isAccessible => {
                                  if (isAccessible)
                                    cy.isClientEffettivo(userProfileToken, currentAgency.agentId, polizza.customerNumber).then(isEffettivo => {
                                      if (isEffettivo)
                                        return polizza
                                      else
                                        cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                                    })
                                  else
                                    cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                                })
                              else
                                cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                            })
                          })
                        }
                        else {
                          cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                        }
                      })
                    } else {
                      cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                    }
                  } else {
                    cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                  }
                } else {
                  cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
                }
              })
            }
            else {
              cy.getClientWithConsensoOTP(tutf, state, clientType, agenciesFromFixture, currentAgency, newTrial)
            }
          }
        })
      })
    })
  })
})

Cypress.Commands.add('getUserProfileToken', (tutf) => {
  cy.clearCookies()
  cy.clearLocalStorage()
  //Open MW
  cy.request({
    method: 'GET',
    log: false,
    url: (Cypress.env('currentEnv') === 'TEST') ? Cypress.env('loginUrlGraphQLTest') : Cypress.env('loginUrlGraphQLPreprod')
  }).its('body').then(html => {
    let el = document.createElement('html')
    el.innerHTML = html
    let nidp = el.getElementsByTagName('form')[0].getAttribute('action')

    //Login Step 1
    cy.request({
      method: 'POST',
      log: false,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: ((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('loginUrlGraphQLTest') : Cypress.env('loginUrlGraphQLPreprod')) + nidp
    }).then(() => {
      //Login Step 2
      cy.decryptLoginPsw().then(psw => {
        cy.request({
          method: 'POST',
          log: false,
          retryOnStatusCodeFailure: true, // mettendo a false puo capitare errore 405
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: {
            Ecom_User_ID: tutf,
            Ecom_Password: psw
          },
          url: ((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('hostAMTest') : Cypress.env('hostAMPreprod')) + '/nidp/idff/sso?sid=0&sid=0'
        }).then(() => {
            //Get the userProfileToken
            const userDetailsQuery = `query userDetails($filter: UserDetailsRequestInput!) {
            userDetails(filter: $filter) { 
            userProfileToken
            }
            }`

          cy.request({
            method: 'POST',
            url: ((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('baseUrlTest') : Cypress.env('baseUrlPreprod')) + 'api/graphql',
            headers: { 'Content-Type': 'application/json' },
            body: { query: userDetailsQuery },
            log: false
          }).then(userDetails => {
            return userDetails.body.data.userDetails.userProfileToken
          })
        })
      })
    })
  })
})

/**
 * Funzione che permette di utilizzare la graphQL searchClient di MW per verificare se un cliente è presente in buca di ricerca o meno
 * ? Si necessita di aver precedentemente chiamato la funzione getUserProfileToken per ottenere lo userProfileToken
 * @author Andrea 'Bobo' Oboe
 */
Cypress.Commands.add('isClientInBuca', (userProfileToken, agencies, searchValue) => {

  const searchQuery = `query searchClient($filter: SearchRequestInput!) {
    searchClient(filter: $filter) {
      total
      afterKey
      results {
        agencies {
          agency
          company
          office
        }
        idClient
        name
        address
        age
        status
        legal
        company
        office
        taxCode
        vatNumber
        birthDate
      }
    }
  }`

  const currentAgenciesInSearch = JSON.stringify(agencies)

  const filter = `{
    "filter": {
      "userToken": "${userProfileToken}",
      "afterKey": null,
      "size": 30,
      "search": "${searchValue}",
      "agencies": ${currentAgenciesInSearch},
      "clientsType": [
        "individual",
        "legal"
      ],
      "state": [
        "actual",
        "potential",
        "ceased"
      ]
    }
  }`

  cy.request({
    method: 'POST',
    url: ((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('baseUrlTest') : Cypress.env('baseUrlPreprod')) + 'api/graphql',
    headers: { 'Content-Type': 'application/json' },
    body: { query: searchQuery, variables: JSON.parse(filter) },
    log: false
  }).then(searchResults => {
    let filteredResults = searchResults.body.data.searchClient.results.filter(el => {
      return el.name === searchValue.toUpperCase()
    })

    return (filteredResults.length > 0) ? true : false
  })
})

/**
 * Funzione che permette di verificare se l'accountId specificato ha visibilità sul clientId
 * ? Si necessita di aver precedentemente chiamato la funzione getUserProfileToken per ottenere lo userProfileToken
 * @author Andrea 'Bobo' Oboe
 */
Cypress.Commands.add('isClientAccessible', (userProfileToken, accountId, clientId) => {
  const clientQuery = `query client($filter: ClientRequestInput!) {
    client(filter: $filter) {
      id
      accounts(filter: $filter)
      accountsVisibility(filter: $filter) {
        account
        agencyCode
        companyCode
        sourceCode
        subAgencyCode
        roleCode
        fromRole
        ageDescription
      }
      type {
        key
        value
      }
      gender {
        value
      }
      birthDate
      fiscalCode
      vatNumber
      title
      image
      intermediary
      employee
      name
      surname
      age
      birthDate
      deathDate
      contacts(filter: $filter) {
        principalPhone {
          id
          email
          countryPrefix
          prefix
          phoneNumber
          additionalInformation
          mobile
          preferred
          status
          preferredDayPart
          preferredYearlyPart
          type
          isPrivate
        }
        principalMail {
          id
          email
          countryPrefix
          prefix
          phoneNumber
          additionalInformation
          mobile
          preferred
          status
          preferredDayPart
          preferredYearlyPart
          type
          isPrivate
          checked
        }
        otp {
          id
          countryPrefix
          prefix
          phoneNumber
          additionalInformation
          mobile
          preferred
          status
          preferredDayPart
          preferredYearlyPart
          type
          isPrivate
        }
      }
      addresses(filter: $filter) {
        principal {
          id
          countryCode
          street
          streetNumber
          stairwayNumber
          streetType {
            key
            value
          }
          type
          city {
            key
            value
          }
          district
          districtCode
          area
          areaCode
          postCode
          districtId
        }
        domicile {
          id
          countryCode
          street
          streetNumber
          stairwayNumber
          streetType {
            key
            value
          }
          type
          city {
            key
            value
          }
          district
          districtCode
          area
          postCode
        }
      }
      consents(filter: $filter) {
        sendMailConsents
        signatureGraphConsents
        signatureOtpConsents
        allianzPromoConsents
        sidebarSignatureGraphConsents(filter: $filter) {
          status
          message
        }
        sidebarSignatureOtpConsents(filter: $filter) {
          status
          message
        }
        sidebarSendMailConsents(filter: $filter) {
          status
          message
        }
      }
      companyName
      businessForm {
        key
        value
      }
      businessType {
        key
        value
      }
      traceable
      publicAuthorithy
    }
  }
  `

  const filter = `{
    "filter": {
    "userToken": "${userProfileToken}",
    "accountId": "${accountId}",
    "clientId": "${clientId}"
    }
  }`

  cy.request({
    method: 'POST',
    url: ((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('baseUrlTest') : Cypress.env('baseUrlPreprod')) + 'clients/api/graphql',
    headers: { 'Content-Type': 'application/json' },
    body: { query: clientQuery, variables: JSON.parse(filter) },
    log: false
  }).then(clientResponse => {
    return (clientResponse.body.data.client !== null) ? true : false
  })
})

/**
 * Funzione che permette di verificare se il clinetId in MW è EFFETTIVO (SICCOME VIDIEMME A VOLTE....)
 * ? Si necessita di aver precedentemente chiamato la funzione getUserProfileToken per ottenere lo userProfileToken
 * @author Andrea 'Bobo' Oboe
 */
Cypress.Commands.add('isClientEffettivo', (userProfileToken, accountId, clientId) => {
  const clientQuery = `query client($filter: ClientRequestInput!) {
    client(filter: $filter) {
      status(filter: $filter) {
        clientStatus {
          key
          value
        }
        clientSince {
          year
          month
        }
        viewReportLife
      }
    }
  }  
  `

  const filter = `{
    "filter": {
    "userToken": "${userProfileToken}",
    "accountId": "${accountId}",
    "clientId": "${clientId}"
    }
  }`

  cy.request({
    method: 'POST',
    url: ((Cypress.env('currentEnv') === 'TEST') ? Cypress.env('baseUrlTest') : Cypress.env('baseUrlPreprod')) + 'clients/api/graphql',
    headers: { 'Content-Type': 'application/json' },
    body: { query: clientQuery, variables: JSON.parse(filter) },
    log: false
  }).then(clientResponse => {
    if (clientResponse.body.data.client !== null) {
      return (clientResponse.body.data.client.status.clientStatus.key === 'E') ? true : false
    }
    else
      return false
  })
})

Cypress.Commands.add('getTestsInfos', (testsArray) => {
  return new Cypress.Promise((resolve) => {

    let tests = {}

    //Count total of tests in the spec file

    tests.ntc = testsArray.length

    //TODO l'array commands non è disponibile sembra in RUN mode
    // let totalNtc = 0
    // for (let h = 0; h < testsArray.length; h++) {
    //   let currentTest = testsArray[h]
    //   if (currentTest.commands !== undefined)
    //     for (let i = 0; i < currentTest.commands.length; i++) {
    //       if (currentTest.commands[i].name === 'assert')
    //         totalNtc++
    //     }
    // }
    // tests.ntc = totalNtc


    //Verify if all tests are passed or not
    let resultOutCome = 'Passed'
    let resultMessage = 'All Tests are OK!'
    let resultStack = ''
    tests.test = []
    for (let i = 0; i < testsArray.length; i++) {
      switch (testsArray[i].state) {
        case 'failed':
          console.log(testsArray[i].err.stack)
          resultOutCome = 'Failed'
          //Also get the error message
          resultMessage = (testsArray[i].title + ' - ' + testsArray[i].err.message).replace(/'/g, "")
          resultStack = (testsArray[i].title + ' - ' + testsArray[i].err.stack).replace(/'/g, "")
          break;
        case 'pending':
          resultOutCome = 'Passed' // Skipped
          //Also get the error message
          // resultMessage = (testsArray[i].title + ' - ' + testsArray[i].err.message).replace(/'/g, "")
          // resultStack = (testsArray[i].title + ' - ' + testsArray[i].err.stack).replace(/'/g, "")
          break;
      }

      if (resultMessage.length > 1000)
        resultMessage.substring(0, 999)
      if (resultStack.length > 5000)
        resultStack.substring(0, 4999)

      tests.test.push({
        resultOutCome: resultOutCome,
        resultMessage: resultMessage,
        resultStack: resultStack
      })
    }

    resolve(tests)
  })
})

Cypress.Commands.add('getSSNAndBirthDateFromTarga', (targa) => {
  cy.request({
    method: 'GET',
    log: false,
    url: 'http://online.azi.allianzit/WebdaniaFES/services/vehicle/' + targa + '/sita/'
  }).then(respANIA => {

    cy.request({
      method: 'POST',
      log: false,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: be2beHost + '/Anagrafe/AnagrafeWS/AnagrafeSvc.asmx/Normalize',
      body: { "xmlParameters": "<Normalize><Input action='ReverseCodiceFiscale'><Fields><Field name='COD_FISC'>" + respANIA.body.itemList[0].contractorFiscalCode + "</Field></Fields></Input></Normalize>" }
    }).then(resp => {
      cy.wrap(Cypress.$(resp.body))
        .then(wrappedBody => {
          let parser = new DOMParser()
          let xmlDoc = parser.parseFromString(wrappedBody[2].outerText, "text/xml")
          let currentBirthDate = xmlDoc.getElementsByTagName("DataNascita")[0].childNodes[0].nodeValue.split(' ')[0]

          return {
            'ssn': respANIA.body.itemList[0].contractorFiscalCode,
            'birthDate': currentBirthDate
          }
        })
    })
  })
})

Cypress.Commands.add('getSSN', (cognome, nome, comune, codComune, dataNascita, sesso) => {
  cy.request({
    method: 'POST',
    log: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://be2be.te.azi.allianzit/Anagrafe/AnagrafeWS/AnagrafeSvc.asmx/CalcolaCF',
    body: {
      Cognome: cognome,
      Nome: nome,
      Comune: comune,
      CodComune: codComune,
      CodProvincia: "",
      DataNascita: dataNascita,
      Sesso: sesso
    }
  }).then(resp => {
    cy.wrap(Cypress.$(resp.body))
      .then(wrappedBody => {
        return wrappedBody[2].innerText
      })
  })
})


Cypress.Commands.add('getUserWinLogin', () => {
  cy.task('getUsername').then((username) => {
    cy.fixture("tutf").then(data => {
      return data.users.filter(obj => {
        return obj.userName === username.toUpperCase()
      })[0]
    })
  })
})

Cypress.Commands.add('decryptLoginPsw', () => {
  cy.fixture("tutf").then(data => {
    const psw = unescape(Cypress.env('secretKey').replace(/\\/g, "%"));
    const bytes = CryptoJS.AES.decrypt(data.psw, psw);
    return bytes.toString(CryptoJS.enc.Utf8);
  })
})

/**
 * metodo per aprire link nella stessa pagina
 * (Risolve casi in cui link non hanno l'attributo target=_blank)  
 */
Cypress.Commands.add('selfWindow', () => {
  cy.window().then(win => {
    cy.stub(win, 'open').callsFake((url) => {
      return win.open.wrappedMethod.call(win, url, '_self');
    }).as('Open');
  });
})

Cypress.Commands.add('startMysql', (dbConfig, testName, currentEnv, data) => {

  if (Cypress.env('enableLogDB')) {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
      return results.insertId
    })

  }
})

Cypress.Commands.add('finishMysql', (dbConfig, insertedId, tests) => {
  if (Cypress.env('enableLogDB'))
    cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
})

Cypress.Commands.add('getTariffaLog', (currentCase) => {
  cy.task('getLatestDownloadedFile', Cypress.browser.name).then(latestDownload => {
    cy.task('unzipLatestLogTariffa', { filePath: latestDownload, currentCase: currentCase, specName: Cypress.spec.name }).then(logFolder => {
      return logFolder
    })
  })
})
Cypress.Commands.add('getProxyLog', (currentCase) => {
  cy.task('getLatestDownloadedFile', Cypress.browser.name).then(latestDownload => {
    cy.task('moveToLogFolder', { filePath: latestDownload, currentCase: currentCase, specName: Cypress.spec.name }).then(logFolder => {
      return logFolder
    })
  })
})

Cypress.Commands.add('SalvaPolizza', (dbConfig, cliente, nPolizza, dataEmissione, dataScadenza, ramo, ambiti, ambiente) => {
  cy.task('SalvaPolizza', { dbConfig: dbConfig, cliente: cliente, nPolizza: nPolizza, dataEmissione: dataEmissione, dataScadenza: dataScadenza, ramo: ramo, ambiti: ambiti, ambiente: ambiente })
    .then((results) => {
      return results.insertId
    })
})

Cypress.Commands.add('findLastPolizza', (dbConfig, prodotto, annullamento, ambiente, data) => {
  cy.log("Ambiente ricerca: " + ambiente)
  cy.task('findLastPolizza', { dbConfig: dbConfig, prodotto: prodotto, annullamento: annullamento, ambiente: ambiente, data: data })
    .then((result) => {
      return result
    })
})

//registra l'annullamento nel database
Cypress.Commands.add('registraAnnullamento', (dbConfig, id, numeroPolizza, prodotto) => {
  cy.task('registraAnnullamento', { dbConfig: dbConfig, id: id, numeroPolizza: numeroPolizza, prodotto: prodotto })
    .then((result) => {
      return result
    })
})


//#region PDF Parse
Cypress.Commands.add('parsePdf', () => {

  cy.fixture("Autocertificazione_Test.pdf", 'binary')
    .then((file) => Cypress.Blob.binaryStringToBlob(file, 'application/pdf'))
    .then((blob) => {
      var formdata = new FormData();
      formdata.append("file", blob);
      cy.log('Upload PDF file to parse...')
      cy.request({
        url: 'http://' + Cypress.env('hostParsr') + ':' + Cypress.env('portParsr') + '/api/v1/document',
        method: 'POST',
        log: false,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formdata
      }).then(resp => {
        expect(resp.status).to.eq(202)
        expect(resp).to.have.property('headers')
        let location = resp.headers['location']
        cy.log('Waiting PDF to be parsed...')

        const waitForPdf = () => {
          cy.request({
            url: 'http://' + Cypress.env('hostParsr') + ':' + Cypress.env('portParsr') + location,
            method: 'GET',
            log: false
          }).then(respGenerated => {
            if (respGenerated.status === 200)
              waitForPdf()
            else {
              cy.log('PDF file processed!')
              cy.request({
                url: 'http://' + Cypress.env('hostParsr') + ':' + Cypress.env('portParsr') + respGenerated.body.markdown,
                method: 'GET',
                log: false
              }).then(resp => {
                expect(resp.status).to.eq(200)

              })
            }
          })
        }

        waitForPdf()
      })
    })
  //#endregion

})
Cypress.Commands.add('getCurrentDate', (dd = 0) => {

  let currentDate = new Date()
  let formattedDate = String(currentDate.getDate() + dd).padStart(2, '0') + '/' +
    String(currentDate.getMonth() + 1).padStart(2, '0') + '/' +
    currentDate.getFullYear()
  return formattedDate
})

Cypress.Commands.add('getClientWithoutConsentAgreements', (tutf, clientType = 'PF', currentAgency) => {
  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
        headers: {
          'x-allianz-user': tutf
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientWithoutConsentAgreements(tutf, clientType, currentAgency)
        else {
          let clienti = response.body.filter(el => {
            return el.socialSecurityNumber !== ''
          })

          if (clienti.length > 0) {
            let currentClient = clienti[Math.floor(Math.random() * clienti.length)]
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/parties/' + currentClient.customerNumber + '/dataconsentagreements',
              headers: {
                'x-allianz-user': tutf
              }
            }).then(responseAgreements => {
              let agreementOTP = responseAgreements.body.filter(el => {
                return el.dataConsent.dataConsentType === 'ConsensoOTP'
              })
              let agreementEmail = responseAgreements.body.filter(el => {
                return el.dataConsent.dataConsentType === 'InvioEmail' &&
                  el.dataConsent.dataConsentGroup === 'Allianz'
              })
              // Verifico se non hanno espresso conensi
              if (!agreementOTP[0].hasOwnProperty('accepted') &&
                !agreementEmail[0].hasOwnProperty('accepted'))
                return currentClient
              else
                cy.getClientWithoutConsentAgreements(tutf, clientType, currentAgency)
            })
          } else
            cy.getClientWithoutConsentAgreements(tutf, clientType, currentAgency)
        }
      })
    })
  })
})


/**
 * Ottieni un Cliente che abbia almeno una polizza Attiva
 */
Cypress.Commands.add('getClientWithPolizzeAttive', (tutf, branchId, clientType = 'PF', currentAgency) => {

  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
        headers: {
          'x-allianz-user': tutf
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientWithPolizzeAttive(tutf, branchId, clientType, currentAgency)
        else {
          //Verifichiamo solo clienti in stato EFFETTIVO
          let clientiEffettivi = response.body.filter(el => {
            return el.partyCategory[0] === 'E' && el.socialSecurityNumber !== ''
          })

          if (clientiEffettivi.length > 0) {
            let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]
            //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
              headers: {
                'x-allianz-user': tutf
              }
            }).then(responseContracts => {
              //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
              if (responseContracts.status !== 200)
                cy.getClientWithPolizzeAttive(tutf, branchId, clientType, currentAgency)
              //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
              let contractsWithBranchId
              contractsWithBranchId = responseContracts.body.filter(el => {
                return el.branchId.includes(branchId)
              })

              if (contractsWithBranchId.length > 0) {
                cy.getUserProfileToken(tutf).then(userProfileToken => {
                  cy.isClientInBuca(userProfileToken, currentAgency.agencies, currentClient.name + ' ' + currentClient.firstName).then(isInBuca => {
                    if (isInBuca) {
                      cy.isClientAccessible(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isAccessible => {
                        if (isAccessible)
                          cy.isClientEffettivo(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isEffettivo => {
                            if (isEffettivo)
                              return currentClient
                            else
                              cy.getClientWithPolizzeAttive(tutf, branchId, clientType, currentAgency)
                          })
                        else
                          cy.getClientWithPolizzeAttive(tutf, branchId, clientType, currentAgency)
                      })
                    }
                    else
                      cy.getClientWithPolizzeAttive(tutf, branchId, clientType, currentAgency)

                  })
                })
              } else
                cy.getClientWithPolizzeAttive(tutf, branchId, clientType, currentAgency)
            })
          } else
            cy.getClientWithPolizzeAttive(tutf, branchId, clientType, currentAgency)
        }
      })
    })
  })
})

/**
 * Ottieni un Cliente che abbia almeno una Proposta
 */
Cypress.Commands.add('getClientWithProposte', (tutf, branchId, clientType = 'PF', currentAgency) => {

  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
        headers: {
          'x-allianz-user': tutf
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientWithProposte(tutf, branchId, clientType, currentAgency)
        else {
          //Verifichiamo solo clienti in stato EFFETTIVO
          let clientiEffettivi = response.body.filter(el => {
            return el.partyCategory[0] === 'E' && el.socialSecurityNumber !== ''
          })

          if (clientiEffettivi.length > 0) {
            let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]
            //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Application',
              headers: {
                'x-allianz-user': tutf
              }
            }).then(responseContracts => {
              //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
              if (responseContracts.status !== 200)
                cy.getClientWithProposte(tutf, branchId, clientType, currentAgency)
              //Filtriamo per branchID per verificare che ci siano polizze con il branchId specificato
              let contractsWithBranchId
              contractsWithBranchId = responseContracts.body.filter(el => {
                return el.branchId.includes(branchId)
              })

              if (contractsWithBranchId.length > 0) {
                cy.getUserProfileToken(tutf).then(userProfileToken => {
                  cy.isClientInBuca(userProfileToken, currentAgency.agencies, currentClient.name + ' ' + currentClient.firstName).then(isInBuca => {
                    if (isInBuca) {
                      cy.isClientAccessible(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isAccessible => {
                        if (isAccessible)
                          cy.isClientEffettivo(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isEffettivo => {
                            if (isEffettivo)
                              return currentClient
                            else
                              cy.getClientWithProposte(tutf, branchId, clientType, currentAgency)
                          })
                        else
                          cy.getClientWithProposte(tutf, branchId, clientType, currentAgency)
                      })
                    }
                    else
                      cy.getClientWithProposte(tutf, branchId, clientType, currentAgency)
                  })
                })
              } else
                cy.getClientWithProposte(tutf, branchId, clientType, currentAgency)
            })
          } else
            cy.getClientWithProposte(tutf, branchId, clientType, currentAgency)
        }
      })
    })
  })
})

/**
 * Ottieni un Cliente che abbia almeno un Preventivo
 */
Cypress.Commands.add('getClientWithPreventivi', (tutf, clientType = 'PF', currentAgency) => {

  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
        headers: {
          'x-allianz-user': tutf
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientWithPreventivi(tutf, clientType, currentAgency)
        else {
          //Verifichiamo solo clienti in stato EFFETTIVO
          let clientiEffettivi = response.body.filter(el => {
            return el.partyCategory[0] === 'E' && el.socialSecurityNumber !== ''
          })

          if (clientiEffettivi.length > 0) {
            let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]
            //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/contractinfos?partyId=' + currentClient.customerNumber + '&contractPhase=Quotation',
              headers: {
                'x-allianz-user': tutf
              }
            }).then(responseContracts => {
              if (responseContracts.status !== 200)
                cy.getClientWithPreventivi(tutf, clientType, currentAgency)

              let contracts
              contracts = responseContracts.body

              if (contracts.length > 0) {
                cy.getUserProfileToken(tutf).then(userProfileToken => {
                  cy.isClientInBuca(userProfileToken, currentAgency.agencies, currentClient.name + ' ' + currentClient.firstName).then(isInBuca => {
                    if (isInBuca) {
                      cy.isClientAccessible(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isAccessible => {
                        if (isAccessible)
                          cy.isClientEffettivo(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isEffettivo => {
                            if (isEffettivo)
                              return currentClient
                            else
                              cy.getClientWithPreventivi(tutf, clientType, currentAgency)
                          })
                        else
                          cy.getClientWithPreventivi(tutf, clientType, currentAgency)
                      })
                    }
                    else
                      cy.getClientWithPreventivi(tutf, clientType, currentAgency)
                  })
                })
              } else
                cy.getClientWithPreventivi(tutf, clientType, currentAgency)

            })
          } else
            cy.getClientWithPreventivi(tutf, clientType, currentAgency)
        }
      })
    })
  })
})

/**
 * Ottieni un Cliente che abbia almeno un Non in Vigore
 */
Cypress.Commands.add('getClientWithNonInVigore', (tutf, clientType = 'PF', currentAgency) => {

  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
        headers: {
          'x-allianz-user': tutf
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientWithNonInVigore(tutf, clientType, currentAgency)
        else {
          //Verifichiamo solo clienti in stato EFFETTIVO
          let clientiEffettivi = response.body.filter(el => {
            return el.partyCategory[0] === 'E' && el.socialSecurityNumber !== ''
          })

          if (clientiEffettivi.length > 0) {
            let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]
            //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/contractinfos?partyId=' + currentClient.customerNumber + '&contractPhase=Contract&contractStatus=Rescind',
              headers: {
                'x-allianz-user': tutf
              }
            }).then(responseContracts => {
              if (responseContracts.status !== 200)
                cy.getClientWithNonInVigore(tutf, clientType, currentAgency)

              let contracts
              contracts = responseContracts.body

              if (contracts.length > 0) {
                cy.getUserProfileToken(tutf).then(userProfileToken => {
                  cy.isClientInBuca(userProfileToken, currentAgency.agencies, currentClient.name + ' ' + currentClient.firstName).then(isInBuca => {
                    if (isInBuca) {
                      cy.isClientAccessible(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isAccessible => {
                        if (isAccessible)
                          cy.isClientEffettivo(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isEffettivo => {
                            if (isEffettivo)
                              return currentClient
                            else
                              cy.getClientWithNonInVigore(tutf, clientType, currentAgency)
                          })
                        else
                          cy.getClientWithNonInVigore(tutf, clientType, currentAgency)
                      })
                    }
                    else
                      cy.getClientWithNonInVigore(tutf, clientType, currentAgency)
                  })
                })
              } else
                cy.getClientWithNonInVigore(tutf, clientType, currentAgency)

            })
          } else
            cy.getClientWithNonInVigore(tutf, clientType, currentAgency)
        }
      })
    })
  })
})
/**
 * Ottieni un Cliente che abbia almeno un Sinistro
 */
Cypress.Commands.add('getClientWithSinistri', (tutf, clientType = 'PF', currentAgency) => {

  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : be2beHost + '/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
        headers: {
          'x-allianz-user': tutf
        }
      }).then(response => {
        if (response.body.length === 0)
          cy.getClientWithPreventivi(tutf, clientType, currentAgency)
        else {
          //Verifichiamo solo clienti in stato EFFETTIVO
          let clientiEffettivi = response.body.filter(el => {
            return el.partyCategory[0] === 'E' && el.socialSecurityNumber !== ''
          })

          if (clientiEffettivi.length > 0) {
            let currentClient = clientiEffettivi[Math.floor(Math.random() * clientiEffettivi.length)]
            //Andiamo a cercare i contratti attivi, filtrando poi in base al branchId
            cy.request({
              method: 'GET',
              retryOnStatusCodeFailure: true,
              timeout: 60000,
              log: false,
              url: be2beHost + '/daanagrafe/CISLCore/claims?partyId=' + currentClient.customerNumber,
              headers: {
                'x-allianz-user': tutf
              }
            }).then(responseContracts => {
              if (responseContracts.status !== 200)
                cy.getClientWithPreventivi(tutf, clientType, currentAgency)

              let contracts
              contracts = responseContracts.body

              if (contracts.length > 0) {
                cy.getUserProfileToken(tutf).then(userProfileToken => {
                  cy.isClientInBuca(userProfileToken, currentAgency.agencies, currentClient.name + ' ' + currentClient.firstName).then(isInBuca => {
                    if (isInBuca) {
                      cy.isClientAccessible(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isAccessible => {
                        if (isAccessible)
                          cy.isClientEffettivo(userProfileToken, currentAgency.agentId, currentClient.customerNumber).then(isEffettivo => {
                            if (isEffettivo)
                              return currentClient
                            else
                              cy.getClientWithPreventivi(tutf, clientType, currentAgency)
                          })
                        else
                          cy.getClientWithPreventivi(tutf, clientType, currentAgency)
                      })
                    }
                    else
                      cy.getClientWithPreventivi(tutf, clientType, currentAgency)
                  })
                })
              } else
                cy.getClientWithPreventivi(tutf, clientType, currentAgency)

            })
          } else
            cy.getClientWithPreventivi(tutf, clientType, currentAgency)
        }
      })
    })
  })
})

Cypress.Commands.add('parseXlsx', (inputFile) => {
  return cy.task('parseXlsx', { filePath: inputFile })
})

// Set CYPRESS_COMMAND_DELAY above zero for demoing to stakeholders,
// E.g. CYPRESS_COMMAND_DELAY=1000 node_modules/.bin/cypress open
const COMMAND_DELAY = Cypress.env('COMMAND_DELAY') || 0;
if (COMMAND_DELAY > 0) {
  for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
      const origVal = originalFn(...args);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(origVal);
        }, COMMAND_DELAY);
      });
    });
  }
}

//#region windows
const normalVisit = () => cy.visit('index.html')

let originalWindow = null;

Cypress.Commands.add('openWindow', (url, features) => {
  if (!originalWindow) {
    originalWindow = cy.state('window');
    originalWindow.APP_ID = 1; // depth 1
  }
  const w = Cypress.config('viewportWidth')
  const h = Cypress.config('viewportHeight')

  if (!features) {
    Cypress.Commands.add('openWindow', (url, features) => {
      console.log('openWindow %s "%s"', url, features)

      return new Promise(resolve => {
        if (window.top.aut) {
          if (window.top.MyAltWindow && window.top.MyAltWindow.close) {
            console.log('window exists already')
            window.top.aut.close()
            window.top.MyAltWindow.close()
          }
          // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
          window.top.aut = window.top.open(url, 'aut', features)
          window.top.MyAltWindow = window.top.open(url, 'MyAltWindow', features)
          window.top.MyAltWindow.APP_ID = 2; // TODO: make this support n-many

          // letting page enough time to load and set "document.domain = localhost"
          // so we can access it
          setTimeout(() => {
            cy.state('document', window.top.aut.document)
            cy.state('window', window.top.aut)
            cy.state('document', window.top.MyAltWindow.document)
            cy.state('window', window.top.MyAltWindow)
            resolve()
          }, 500)
        }
      })
    })
  }

  /* toggle between 2 for now, could set this up to handle N-many windows */
  Cypress.Commands.add('switchWindow', () => {
    return new Promise(resolve => {
      if (cy.state('window').APP_ID === 1) {
        // switch to our ALT window
        console.log('switching to alt popup window...')
        cy.state('document', originalWindow.top.MyAltWindow.document)
        cy.state('window', originalWindow.top.MyAltWindow)
        originalWindow.blur()
      } else {
        console.log('switching back to original window')
        // switch back to originalWindow
        cy.state('document', originalWindow.document)
        cy.state('window', originalWindow)
        originalWindow.top.MyAltWindow.blur()
      }
      window.blur();

      cy.state('window').focus()

      resolve();
    })
  })

  Cypress.Commands.add('closeWindow', () => {
    return new Promise(resolve => {
      if (window.top.MyAltWindow && window.top.MyAltWindow.close) {
        window.top.MyAltWindow.close() // close popup
        window.top.MyAltWindow = null
      }
      if (originalWindow) {
        cy.state('document', originalWindow.document)
        cy.state('window', originalWindow)
      }
      cy.state('window').focus()
      resolve()
    })
  })
})

//#endregion windows