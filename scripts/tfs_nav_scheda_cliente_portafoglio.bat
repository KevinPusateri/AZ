@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/navigation/mw_navigation_scheda_cliente_portafoglio.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_navigation_scheda_cliente_portafoglio, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Navigation Scheda Cliente Portafoglio'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/navigation/mw_navigation_scheda_cliente_portafoglio.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_navigation_scheda_cliente_portafoglio, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Navigation Scheda Cliente Portafoglio'"
)