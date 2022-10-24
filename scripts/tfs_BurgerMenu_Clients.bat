@echo off
set HTTP_PROXY=http://it000-svr.zone2.proxy.allianz:8090
set HTTPS_PROXY=http://it000-svr.zone2.proxy.allianz:8090
set NO_PROXY=ageallianz.it,.servizi.allianzit,.azi.allianzit
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/navigationBurger/mw_navigation_burgerMenuClients.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/burgerMenuClients, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Matrix Web Burger Menu Clients'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/navigationBurger/mw_navigation_burgerMenuClients.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/burgerMenuClients, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Matrix Web Burger Menu Clients'"
)