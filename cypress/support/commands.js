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

Cypress.Commands.add('iframeCustom', { prevSubject: 'element' }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.ready(function () {
      resolve($iframe.contents().find('body'));
    })
  })
})

Cypress.Commands.overwrite('clearCookies', () => {
  cy.getCookies().then(cookies => {
    for (const cookie of cookies) {
      cy.clearCookie(cookie.name)
    }
  })
})

Cypress.Commands.add('getIFrame', () => {
  cy.get('iframe',{log:false}).its('0.contentDocument.body').as('iframe')
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
      console.warn('switchToTab',{index,index_or_name})
      active_tab_index = index;
      let winNext = myTabs[active_tab_index]
      if(!winNext){
          throw new Error('tab missing')
      }
      cy.state('document', winNext.document)
      cy.state('window', winNext)
      debugTabState()
      resolve()
  })
})

function resolve_index_or_name_to_index(index_or_name){
  let index = parseInt(index_or_name) >= 0 ? index_or_name : active_tab_index || 0
  let name_index = myTabNames.indexOf(index_or_name)
  if(name_index>-1){
      index = name_index
  }
  return index;
}

Cypress.Commands.add('impersonification', (tutf, getPersUser, getChannel) => {
  cy.request({
    method: 'POST',
    url: 'https://profilingbe.pp.azi.allianzit/profilingManagement/personation/' + tutf,
    form: true,
    body: { persUser: getPersUser, channel: getChannel }
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
          resultOutCome = 'Skipped'
          //Also get the error message
          resultMessage = (testsArray[i].title + ' - ' + testsArray[i].err.message).replace(/'/g, "")
          resultStack = (testsArray[i].title + ' - ' + testsArray[i].err.stack).replace(/'/g, "")
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

Cypress.Commands.add('getHostName', () => {
  return os.hostname()
})