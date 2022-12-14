const { defineConfig } = require('cypress')
const { verifyDownloadTasks } = require('cy-verify-downloads');

module.exports = defineConfig({
  retries: 1,
  video: false,
  videoCompression: 25,
  trashAssetsBeforeRuns: true,
  projectId: '4ypuc8',
  numTestsKeptInMemory: 0,
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/mocha',
    charts: true,
    reportTitle: 'Matrix Web',
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  env: {
    db: {
      host: 'PALZMSQDBPRLV01.srv.allianz',
      port: 5551,
      user: 'MY_taut_VeeC9',
      password: 'BtG4VXvfuaj5kX3cDONqHBpyt0sLcE',
      database: 'applogs',
    },
    COMMAND_DELAY: 500,
    db_da: {
      host: 'PALZMSQDBPRLV01.srv.allianz',
      port: 5551,
      user: 'MY_taut_VeeC9',
      password: 'BtG4VXvfuaj5kX3cDONqHBpyt0sLcE',
      database: 'da',
    },
    enableLogDB: true,
    secretKey:
      '\\u0054\\u0033\\u0073\\u0037\\u0046\\u0034\\u0063\\u0074\\u0030\\u0072\\u0079\\u0032\\u0030\\u0032\\u0031\\u0024',
    currentEnv: 'PREPROD',
    internetTesting: false,
    urlMWPreprod: 'https://portaleagenzie.pp.azi.allianz.it/matrix/',
    baseUrlPreprod: 'https://portaleagenzie.pp.azi.allianz.it/matrix/',
    baseUrlTest: 'https://portaleagenzie.te.azi.allianzit/matrix/',
    urlMWTest: 'https://amlogin-dev.servizi.allianzit/nidp/idff/sso?id=datest&sid=1&option=credential&sid=1&target=https%3A%2F%2Fportaleagenzie.te.azi.allianzit%2Fmatrix%2F',
    urlSecondWindowTest: 'https://portaleagenzie2.te.azi.allianzit/matrix/',
    urlSecondWindowPreprod: 'https://portaleagenzie2.pp.azi.allianz.it/matrix/',
    profilingUrlPreprod: 'https://profilingbe.pp.azi.allianzit',
    profilingUrlTest: 'https://profilingbe.te.azi.allianzit',
    be2beTest: 'https://be2be.te.azi.allianzit',
    be2bePreprod: 'https://be2be.pp.azi.allianzit',
    mieInfoCloudTE:
      'https://lemieinfo-fe-test.azit-eks-no-prod.ew3.aws.aztec.cloud.allianz',
    mieInfoCloudPP:
      'https://lemieinfo-fe-pp.azit-eks-no-prod.ew3.aws.aztec.cloud.allianz',
    loginUrlGraphQLPreprod: 'https://matrix.pp.azi.allianz.it',
    hostAMPreprod: 'https://amlogin-pp.allianz.it',
    loginUrlGraphQLTest: 'https://matrix.te.azi.allianzit',
    hostAMTest: 'https://amlogin-dev.servizi.allianzit',
    isSecondWindow: false,
    monoUtenza: false,
    multiUtenza: '1-710000-0-405',
    isAviva: false,
    isAvivaBroker: false,
    hostParsr: 'H2017LE00038A',
    portParsr: '3001',
    selectedSettori: '',
    caseToExecute: '',
    urlDebugProxyPreprod:
      'https://portaleagenzie.pp.azi.allianz.it/Auto/NGRA2013/DebugGetProxy.aspx',
    // urlDebugProxyTest: 'https://portaleagenzie.te.azi.allianzit/Auto/NGRA2013/DebugGetProxy.aspx',
    urlDebugProxyTest:'https://amlogin-dev.servizi.allianzit/nidp/idff/sso?id=datest&sid=2&option=credential&sid=2&target=https%3A%2F%2Fportaleagenzie.te.azi.allianzit%2FAuto%2FNGRA2013%2FDebugGetProxy.aspx',
    usingDash: false,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('task', verifyDownloadTasks);
      return require('./cypress/plugins/index.js')(on, config)

    },
    experimentalSessionAndOrigin: false,
    baseUrl: 'https://portaleagenzie.pp.azi.allianz.it/matrix/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
