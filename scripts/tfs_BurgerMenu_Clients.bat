set HTTP_PROXY=
set HTTPS_PROXY=
.\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/navigationBurger/mw_navigation_burgerMenuClients.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/burgerMenuClients, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Matrix Web Burger Menu Clients'"