set HTTP_PROXY=
set HTTPS_PROXY=
.\\node_modules\\.bin\\cypress run --quiet --spec cypress/integration/navigationBurger/mw_navigation_burgerMenuNumbers.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/burgerMenuNumbers, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Matrix Web Burger Menu Numbers'"