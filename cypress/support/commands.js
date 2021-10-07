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
const os = require('os')
const CryptoJS = require('crypto-js')


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

//TODO da veridicare l'addEventListener in base all'iframe
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
  cy.viewport(1920, 1080)
  Cypress.Cookies.defaults({
    preserve: (cookie) => {
      return true;
    }
  })
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
  cy.request({
    method: 'POST',
    log: false,
    url: 'https://profilingbe.pp.azi.allianzit/profilingManagement/personation/' + tutf,
    form: true,
    body: { persUser: getPersUser, channel: getChannel }
  }).then(resp => {
    if (resp.status !== 200)
      assert.fail('Impersonificazione non effettuata correttamente!')
    //else
    //cy.wait(2000)
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
          url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person',
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
                url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties/' + currentClient.customerNumber + '/partyrelations/',
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
                      url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore' + filteredRelations[0].relatedParty,
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
Cypress.Commands.add('getClientWithPolizze', (tutf, branchId, isUltra = false, isAZ1 = false, clientType = 'PF') => {
  cy.generateTwoLetters().then(nameRandom => {
    cy.generateTwoLetters().then(firstNameRandom => {
      cy.request({
        method: 'GET',
        retryOnStatusCodeFailure: true,
        timeout: 60000,
        log: false,
        url: (clientType === 'PF') ? 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
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
              url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
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
                return currentClient.customerNumber
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
          mainSearch = 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
        else
          mainSearch = 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?socialSecurityNumber=' + fixedPIorSSN + '&partySign=Person'
      }
      else {
        if (fixedPIorSSN === '')
          mainSearch = 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + nameRandom + '&partySign=Company'
        else
          mainSearch = 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?vatIN=' + fixedPIorSSN + '&partySign=Company'
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
              url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
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
                    url: (clientType === 'PF') ? 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + currentClient.name + '&firstName=' + currentClient.firstName + '&partySign=Person'
                      : 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?vatIN=' + currentClient.vatIN + '&partySign=Company',
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
                        url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/contracts?partyId=' + parsedClient + '&contractProcessState=Contract&status=Live',
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
                            url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties/' + parsedClient + '/accountmanagers/',
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
        url: (clientType === 'PF') ? 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Person'
          : 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/parties?name=' + nameRandom + '&firstName=' + firstNameRandom + '&partySign=Company',
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
              url: 'https://be2be.pp.azi.allianzit/daanagrafe/CISLCore/contracts?partyId=' + currentClient.customerNumber + '&contractProcessState=Contract&status=Live',
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
      url: 'https://be2be.pp.azi.allianzit/Anagrafe/AnagrafeWS/AnagrafeSvc.asmx/Normalize',
      body: { "xmlParameters": "<Normalize><Input action='ReverseCodiceFiscale'><Fields><Field name='COD_FISC'>" + respANIA.body.itemList[0].contractorFiscalCode + "</Field></Fields></Input></Normalize>" }
    }).then(resp => {
      cy.wrap(Cypress.$(resp.body))
        .then(wrappedBody => {
          debugger
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

Cypress.Commands.add('getUserWinLogin', () => {
  cy.task('getUsername').then((username) => {
    cy.fixture("tutf").then(data => {
      return data.users.filter(obj => {
        return obj.userName === username.toUpperCase()
      })[0]
    })
  })
})

Cypress.Commands.add('decryptLoginPsw', (isTFS = false) => {
  cy.fixture("tutf").then(data => {
    const psw = unescape(Cypress.env('secretKey').replace(/\\/g, "%"));
    const bytes = CryptoJS.AES.decrypt((!isTFS) ? data.psw : data.psw078, psw);
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

        debugger
        let documentsGenerated = false
        while (!documentsGenerated) {
          cy.wait(2000)
          cy.request({
            url: 'http://' + Cypress.env('hostParsr') + ':' + Cypress.env('portParsr') + '/' + location,
            method: 'GET',
            log: false
          }).then(respGenerated => {
            if (respGenerated.status === 201) {
              cy.log('PDF file processed!')
              documentsGenerated = true
            }
          })
        }
      })
    })
  //#endregion
})